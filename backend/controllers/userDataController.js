const UserData = require("../models/userDataModel.js");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

const saveDocument = async (req, res) => {
  const { _id } = req.user;
  const { document, canvas } = req.body;
  const { fileId } = req.params;

  try {
    var userData = await UserData.findOne({ userId: _id });
    if (!userData) {
      return res.status(400).json({ message: "User Not Found" });
    }

    if (!document && !canvas) {
      return res.status(400).json({ message: "No data provided" });
    }
    console.log(fileId);
    const fileExistIndex = userData.file.findIndex(
      (file) => file._id == fileId
    );
    if (fileExistIndex === -1) {
      return res.status(400).json({ message: "File Not Found" });
    }

    if (document) {
      userData.file[fileExistIndex].document = document;
    }

    if (canvas && canvas.imageData) {
      const canvasData = userData.file[fileExistIndex].canvas;
      if (!canvasData || !canvasData[0] || !canvasData[0].imageData) {
        userData.file[fileExistIndex].canvas = [
          { imageData: {}, whiteBoardData: {} },
        ];
      }
      console.time();
      // await deleteCloudinaryImages(canvasData);
      console.timeEnd();
      console.time();

      const updatedImageDataArray = await uploadImagesToCloudinary(canvas);
      console.timeEnd();

      updatedImageDataArray.forEach((item) => {
        if (item && item.id && item.dataURL) {
          userData.file[fileExistIndex].canvas[0].imageData[item.id] = {
            id: item.id,
            dataURL: item.dataURL,
          };
        }
      });
    }

    if (canvas?.whiteBoardData) {
      userData.file[fileExistIndex].canvas[0].whiteBoardData =
        canvas.whiteBoardData;
    }
    if (document) {
      userData.file[fileExistIndex].document = document;
    }
    saveDocument2(
      userData.file[fileExistIndex].canvas[0],
      fileExistIndex,
      _id,
      document
    );
    res.status(200).json({ message: "Document saved successfully", userData });
  } catch (error) {
    console.error("Error in saving document:", error);
    res.status(500).json({ message: "Error in saving document" });
  }
};

const saveDocument2 = async (userData, fileExistIndex, _id, document) => {
  try {
    // Assuming UserData is the Mongoose model representing user data
    let user = await UserData.findOne({ userId: _id });

    // Assuming fileExistIndex is the index of the file to be updated
    user.file[fileExistIndex].canvas[0] = userData;
    user.file[fileExistIndex].document = document;

    // Save the updated user data
    await user.save();
    return;
  } catch (error) {
    return error;
  }
};

const deleteCloudinaryImages = async (canvasData) => {
  try {
    if (!canvasData || !canvasData[0] || !canvasData[0].imageData) return;

    await Promise.all(
      Object.values(canvasData[0].imageData).map(async (imageDataItem) => {
        if (isCloudinaryUrl(imageDataItem.dataURL)) return;
        console.log("abt");
        await cloudinary.uploader.destroy(
          imageDataItem.dataURL.split("/").pop().split(".")[0]
        );
      })
    );
  } catch (error) {
    console.error("Error deleting images from Cloudinary:", error);
    throw error;
  }
};

const uploadImagesToCloudinary = async (canvasData) => {
  try {
    return Promise.all(
      Object.values(canvasData.imageData).map(async (imageDataObj) => {
        if (isCloudinaryUrl(imageDataObj.dataURL)) {
          return { id: imageDataObj.id, dataURL: imageDataObj.dataURL };
        }
        const uploadedResponse = await cloudinary.uploader.upload(
          imageDataObj.dataURL
        );
        return { id: imageDataObj.id, dataURL: uploadedResponse.secure_url };
      })
    );
  } catch (error) {
    console.error("Error uploading images to Cloudinary:", error);
    throw error;
  }
};

const isCloudinaryUrl = async (url) => {
  // if (!url.includes("cloudinary.com")) {
  //   // console.log(url);
  // } else {
  // }
  // cloudinary.uploader
  //   .upload(url, {
  //     moderation: "duplicate:0.8",
  //     // notification_url: "https://mysite.example.com/hooks",
  //   })
  //   .then((result) => console.log(result))
  //   .catch((error) => console.log(error));
  return url.includes("cloudinary.com");
};

const createTeam = async (req, res) => {
  const { _id } = req.user;
  const { teamName } = req.body;
  let newTeam;
  try {
    let userData = await UserData.findOne({ userId: _id });

    if (userData) {
      if (userData.team.find((team) => team.teamName === teamName)) {
        return res.status(400).json({ message: "Team already exists" });
      }
      newTeam = { _id: new mongoose.Types.ObjectId(), teamName };
      userData.team.push(newTeam);
    } else {
      newTeam = { _id: new mongoose.Types.ObjectId(), teamName };
      userData = new UserData({ userId: _id, team: [newTeam] });
    }

    await userData.save();

    // Send both the ID and the newly created team in the response
    res
      .status(200)
      .json({ message: "Team created successfully", team: newTeam });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in saving team" });
  }
};

const getDocument = async (req, res) => {
  try {
    const { _id } = req.user;
    const { fileId } = req.params;

    const user = await findUserData(_id, res);

    if (user) {
      let file = user.file.findIndex((file) => file._id == fileId);

      res.status(200).json(user.file[file].document[0]);
    } else {
      res.status(400).json({ message: "No file found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in fetching file" });
  }
};

const createFile = async (req, res) => {
  const { _id } = req.user;
  const { fileName, teamId } = req.body;

  try {
    let userData = await findUserData(_id, res);
    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    } else if (!teamId) {
      return res.status(400).json({ message: "Team id is required" });
    }
    if (userData) {
      const teamExists = userData.team.some(
        (team) => team._id.toString() === teamId
      );
      const fileNameAladyExist = userData.file.find(
        (file) => file.fileName === fileName
      );
      if (fileNameAladyExist) {
        return res.status(500).json({ message: "File already exists" });
      } else if (!teamExists) {
        return res.status(200).json({ message: "Team does not exist" });
      }
      userData.file.push({ fileName, teamId, document: [], canvas: [] });
    } else {
      return res.status(400).json({ message: "First create Team" });
    }

    await userData.save();

    res.status(200).json({ message: "File created successfully", userData });
  } catch (error) {
    res.status(500).json({ message: "Error in saving team" });
  }
};

// const saveCanvas = async (req, res) => {
//   const { _id } = req.user;
//   const { canvas } = req.body;
//   const { fileId } = req.params;

//   try {
//     let userData = await getUserData(_id, res);

//     if (!userData) {
//       return res.status(400).json({ message: "User Not Found" });
//     }

//     let file = userData.file.find((file) => file._id == fileId);

//     if (!file) {
//       return res.status(400).json({ message: "File Not Found" });
//     }

//     file.canvas[0] = canvas;

//     await retry(() => userData.save());

//     res.status(200).json({ message: "Canvas saved successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error in saving canvas" });
//   }
// };

// const retry = async (operation, maxAttempts = 3, delay = 1000) => {
//   let attempts = 0;
//   while (attempts < maxAttempts) {
//     try {
//       await operation();
//       return; // Operation successful, exit the loop
//     } catch (error) {
//       if (error.name === "VersionError" && attempts < maxAttempts - 1) {
//         // Increment attempts and wait before retrying
//         attempts++;
//         await new Promise((resolve) => setTimeout(resolve, delay));
//       } else {
//         throw error; // Throw error if it's not a VersionError or maxAttempts reached
//       }
//     }
//   }
//   throw new Error("Operation failed after multiple attempts");
// };

const getCanvas = async (req, res) => {
  try {
    const { _id } = req.user;
    const { fileId } = req.params;
    const user = await findUserData(_id, res);

    if (user) {
      let fileExistIndex = user.file.findIndex((file) => file._id == fileId);
      if (fileExistIndex !== -1) {
        res.status(200).json(user.file[fileExistIndex].canvas);
      }
    } else {
      res.status(400).json({ message: "No file found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in fetching Canvas" });
  }
};

const deleteFile = async (req, res) => {
  const { fileId } = req.params;
  const user = await findUserData(req.user._id, res);

  if (user) {
    user.file = user.file.filter((file) => file._id != fileId);
    await user.save();
    res.status(200).json({ message: "File deleted successfully" });
  } else {
    res.status(400).json({ message: "No file found" });
  }
};
const updateFile = async (req, res) => {
  const { fileId } = req.params;
  const { fileName } = req.body;
  const user = await findUserData(req.user._id, res);

  try {
    if (user) {
      let file = user.file.find((file) => file._id == fileId);
      if (file) {
        file.fileName = fileName;
        await user.save();
        res.status(200).json({ message: "File updated successfully" });
      } else {
        res.status(400).json({ message: "No file found" });
      }
    } else {
      res.status(400).json({ message: "No file found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in updating file" });
  }
};
const duplicateFile = async (req, res) => {
  const { fileId } = req.params;
  const user = await findUserData(req.user._id, res);
  try {
    if (user) {
      let file = user.file.find((file) => file._id == fileId);
      if (file) {
        user.file.push({
          fileName: file.fileName,
          teamId: file.teamId,
          document: file.document,
          canvas: file.canvas,
        });
        await user.save();
        res.status(200).json({ message: "File duplicated successfully" });
      } else {
        res.status(400).json({ message: "No file found" });
      }
    } else {
      res.status(400).json({ message: "No file found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error in duplicating file" });
  }
};

const getUserData = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await UserData.findOne({ userId: _id });
    if (!user) {
      return res.status(200).json([]);
    }
    const data = {
      file: user.file.map((file) => ({
        fileName: file.fileName,
        _id: file._id,
        teamId: file.teamId,
        updatedAt: file.updatedAt,
        createdAt: file.createdAt,
      })),
      team: user.team,
      isArchive: user.isArchive,
    };

    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Error in fetching archive file" });
  }
};
const archiveFile = async (req, res) => {
  try {
    const { _id } = req.user;
    const { fileId } = req.params;

    const user = await UserData.findOne({ userId: _id });
    if (!user) {
      res.status(400).json({ message: "User Not Found" });
    }
    const fileIndex = user.file.findIndex((file) => file._id == fileId);
    if (fileIndex === -1) {
      res.status(400).json({ message: "File Not Found" });
    }
    user.isArchive.push(fileId);
    await user.save();
    res.status(200).json({ message: "File archived successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in archiving file" });
  }
};
const findUserData = async (_id, res) => {
  let userData = await UserData.findOne({ userId: _id });

  if (!userData) {
    res.status(400).json({ message: "User Not Found" });
    throw new Error("User Not Found");
  }

  return userData;
};

const getFileName = async (req, res) => {
  try {
    const { _id } = req.user;
    const { teamId } = req.params;
    const { fileId } = req.query;

    const user = await UserData.findOne({ userId: _id });

    if (user && fileId) {
      let file = user.file.filter((file) => file._id == fileId);
      res.status(200).json(file);
    } else if (user && teamId) {
      let file = user.file.filter((file) => file.teamId == teamId);
      res.status(200).json(file);
    }
  } catch (error) {
    res.status(500).json({ message: "Error in fetching file" });
  }
};
const unArchive = async (req, res) => {
  const { _id } = req.user;
  const { fileId } = req.params;

  try {
    const user = await UserData.findOne({ userId: _id });
    if (!user) {
      res.status(400).json({ message: "User Not Found" });
    }
    const fileIndex = user.isArchive.findIndex((file) => file == fileId);
    if (fileIndex === -1) {
      res.status(400).json({ message: "File Not Found" });
    }
    user.isArchive = user.isArchive.filter((file) => file != fileId);
    await user.save();
    res.status(200).json({ message: "File unarchived successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in unarchiving file" });
  }
};

module.exports = {
  createFile,
  createTeam,
  unArchive,
  saveDocument,
  archiveFile,
  getDocument,
  deleteFile,
  getCanvas,
  updateFile,
  duplicateFile,
  getUserData,
  getFileName,
};

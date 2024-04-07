const UserData = require("../models/userDataModel.js");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const User = require("../models/userModel.js");

const saveDocument = async (req, res) => {
  const { _id } = req.user;
  const { document, canvas } = req.body;
  const { fileId } = req.params;
  console.log("abt");
  console.log(canvas?.whiteBoardData);
  try {
    let userData = await UserData.findOne({ userId: _id });
    let fileExistIndex = userData?.file?.findIndex(
      (file) => file._id == fileId
    );
    if (fileExistIndex === -1) {
      userData = await UserData.findOne({ "whiteListUser.userId": _id });
      if (!userData) {
        return res.status(404).json({ message: "Access denied" });
      }
      fileExistIndex = userData.file.findIndex((file) => file._id == fileId);
    }
    if (!document && !canvas) {
      return;
      res.status(400).json({ message: "No data provided" });
    }

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
      // console.time();
      // // await deleteCloudinaryImages(canvasData);
      // console.timeEnd();
      // console.time();

      const updatedImageDataArray = await uploadImagesToCloudinary(canvas);
      // console.timeEnd();

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
      userData._id,
      document
    );
    console.log(userData._id);
    res.status(200).json({ message: "Document saved successfully", userData });
  } catch (error) {
    console.error("Error in saving document:", error);
    res.status(500).json({ message: "Error in saving document" });
  }
};

const saveDocument2 = async (userData, fileExistIndex, _id, document) => {
  try {
    // Assuming UserData is the Mongoose model representing user data
    let user = await UserData.findOne({ _id });

    // Assuming fileExistIndex is the index of the file to be updated
    user.file[fileExistIndex].canvas[0] = userData;
    user.file[fileExistIndex].document = document;

    // Save the updated user data
    await user.save();
    // console.log(user.file[fileExistIndex].document[0].blocks.length);

    return;
  } catch (error) {
    console.log("Error in saving document:", error);
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

const getFileData = async (req, res) => {
  try {
    const { _id } = req.user;
    const { fileId } = req.params;

    // Find the user data
    let user = await UserData.findOne({ userId: _id });
    if (!user) {
      user = new UserData({ userId: _id });
      await user.save();
      // return res.status(404).json({ message: "User not found" });
    }

    // Find the file index in the user's files
    const fileIndex = await user.file.findIndex((file) => file._id == fileId);
    if (fileIndex === -1) {
      // If file not found in user's files, check whitelist for access
      const checkGrantAccess = await UserData.findOne({
        "whiteListUser.userId": _id,
      });
      if (!checkGrantAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Find the file in the whitelist user's files
      const grantAccessFile = checkGrantAccess.file.find(
        (file) => file._id == fileId
      );
      if (!grantAccessFile) {
        return res.status(404).json({ message: "You Are Not Authraise" });
      }

      // Return the file data if found
      return res.status(200).json(grantAccessFile);
    } else {
      // Return the file data from the user's files
      return res.status(200).json(user.file[fileIndex]);
    }
  } catch (error) {
    console.error("Error in fetching file data:", error);
    return res.status(500).json({ message: "Internal server error" });
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
const grantAccess = async (req, res) => {
  try {
    const { _id } = req.user;
    const { fileId } = req.params;
    const { email } = req.body;

    // Validate email format
    if (!email) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Find the user's data
    const userData = await UserData.findOne({ userId: _id });
    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    // Find the file by its ID
    const file = userData.file.find((file) => file._id == fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    if (!file.whiteListUser) {
      file.whiteListUser = [];
    }
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userData.whiteListUser.includes(user._id)) {
      return res.status(200).json({ message: "Access already granted" });
    }
    // Grant access by adding the user's ID to the whiteListUser array of the file
    userData.whiteListUser.push({ userId: user._id, fileId });

    // Save the updated userData
    await userData.save();

    res.status(200).json({ message: "Access granted successfully" });
  } catch (error) {
    console.error("Error in granting access to file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// // Function to validate email format
// const isValidEmail = (email) => {
//   // Implement your email validation logic here
// };

module.exports = {
  createFile,
  createTeam,
  unArchive,
  saveDocument,
  archiveFile,
  deleteFile,
  updateFile,
  duplicateFile,
  getUserData,
  getFileData,
  grantAccess,
};

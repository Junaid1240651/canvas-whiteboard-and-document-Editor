const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const generateTokenAndSetCookies = require("../utils/helpers/generateTokenAndSetCookies.js");
const { default: mongoose } = require("mongoose");
const signUpUser = async (req, res) => {
  try {
    const { userName, name, email, profilePic, password } = req.body.inputs;

    const user = await User.findOne({ $or: [{ email }, { userName }] });
    if (user) {
      return res.status(400).json({ error: "user Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      userName,
      profilePic,
      password: hashPassword,
    });
    await newUser.save();
    if (newUser) {
      generateTokenAndSetCookies(newUser._id, res);
      res.status(200).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userName: newUser.userName,

        profilePic: newUser.profilePic,
        message: "Account Created Successfully",
      });
    } else {
      res.status(400).json({ error: "Invalid Data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body.inputs;

    const user = await User.findOne({ userName });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookies(user._id, res);
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      userName: user.userName,

      profilePic: user.profilePic,
      message: "User Login Successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, password, userName } = req.body.inputs;
  const userId = req.user._id;
  let { profilePic } = req.body.inputs;
  try {
    let user = await User.findOne(userId);
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
      user = await user.save();
      return res
        .status(200)
        .json({ message: "User profile Update Successfully" });
    }

    if (profilePic) {
      if (user.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profilePic);

      profilePic = uploadedResponse.secure_url;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.userName = userName || user.userName;
    user.profilePic = profilePic || user.profilePic;
    user = await user.save();
    user.password = null;

    return res
      .status(200)
      .json({ message: "User profile Update Successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error in updating profile" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ error: "User logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  logoutUser,
  updateProfile,
};

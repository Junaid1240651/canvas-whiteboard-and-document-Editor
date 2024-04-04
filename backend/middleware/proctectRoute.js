const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    req.user = user;
    // console.log(user);
    next();
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = protectRoute;

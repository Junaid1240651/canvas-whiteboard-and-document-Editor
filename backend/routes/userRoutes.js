const express = require("express");
const {
  signUpUser,
  loginUser,
  logoutUser,
  updateProfile,
} = require("../controllers/userController");
const protectRoute = require("../middleware/proctectRoute");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/update/:id", protectRoute, updateProfile);

module.exports = router;

const express = require("express");
const {
  createFile,
  createTeam,
  saveDocument,

  deleteFile,
  updateFile,
  duplicateFile,
  getUserData,
  archiveFile,
  unArchive,

  getFileData,
  grantAccess,
} = require("../controllers/userDataController");
const router = express.Router();

const proctedRoute = require("../middleware/proctectRoute.js");
router.get("/file/:fileId", proctedRoute, getFileData);

router.get("/getUserData", proctedRoute, getUserData);

router.post("/grantAccess/:fileId", proctedRoute, grantAccess);
router.post("/saveDocument/:fileId", proctedRoute, saveDocument);
router.post("/unArchiveFile/:fileId", proctedRoute, unArchive);
router.post("/archiveFile/:fileId", proctedRoute, archiveFile);
router.post("/duplicateFile/:fileId", proctedRoute, duplicateFile);
router.post("/createTeam", proctedRoute, createTeam);
router.post("/createFile", proctedRoute, createFile);
router.post("/updateFile/:fileId", proctedRoute, updateFile);

router.delete("/deleteFile/:fileId", proctedRoute, deleteFile);
// router.post("/saveCanvas/:fileId", proctedRoute, saveCanvas);

module.exports = router;

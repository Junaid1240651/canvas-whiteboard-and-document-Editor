const mongoose = require("mongoose");

const fileNameSchema = new mongoose.Schema(
  {
    fileName: String,
    document: Array,
    canvas: Array,
    teamId: { type: String, unique: false },
  },
  { timestamps: true }
);
const teamNameSchema = new mongoose.Schema({
  teamName: { type: String },
});

const userDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    team: [teamNameSchema],
    file: [fileNameSchema],
    isArchive: Array,
    whiteListUser: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
      },
    ],
  },
  { timestamps: true }
);

const UserData = mongoose.model("UserDoc", userDataSchema);
module.exports = UserData;

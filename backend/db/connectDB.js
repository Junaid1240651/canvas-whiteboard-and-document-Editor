const mongoose = require("mongoose");

const connectDb = mongoose
  .connect(
    "mongodb+srv://junaid0000:junaid0000@junaid0000.aeuqf9y.mongodb.net/canvas"
  )
  .then(() => console.log("Connected!"))
  .catch((err) => console.error("Connection error:", err));

module.exports = connectDb;

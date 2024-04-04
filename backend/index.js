require("dotenv").config();
const express = require("express");
const connectDb = require("./db/connectDB.js");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes.js");
const userDataRoutes = require("./routes/userDataRoute.js");
const cloudinary = require("cloudinary").v2;
const { app, server } = require("./socket/socket.js");

const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_Name,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/userData", userDataRoutes);

server.listen(PORT, () => {
  console.log("listening on 3000");
});

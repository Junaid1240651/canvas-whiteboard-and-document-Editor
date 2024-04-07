const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const _ = require("lodash");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

const userSocketMap = {}; // userId: socketId
let previousCanvasData = null;
let previousDocument = null;
let previousData = null;
let previousFileData = null;

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("connected", userId);

  if (userId != "undefined") userSocketMap[userId] = socket.id;
  // console.log("connected", userSocketMap[userId]);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  console.log(userSocketMap);
  const debounceEmitCanvas = _.debounce(
    ({ document, canvas, _id, fileId, fileData }) => {
      // Emit the canvas event to all clients
      io.emit("canvas", { document, canvas, _id, fileId, fileData });
      // Update the previousCanvasData to the current canvas data
      previousCanvasData = canvas;
      previousFileData = fileData;
    },
    200
  );

  socket.on("canvas", async ({ canvas, _id, fileId, fileData }) => {
    try {
      if (canvas) {
        if (JSON.stringify(canvas) !== JSON.stringify(previousCanvasData)) {
          // Update the previousCanvasData to the current canvas data
          // console.log(canvas);
          debounceEmitCanvas({ canvas, _id, fileId, fileData });
        }
      } else {
        if (JSON.stringify(fileData) !== JSON.stringify(previousFileData)) {
          // Update the previousCanvasData to the current canvas data
          // console.log(canvas);
          debounceEmitCanvas({ canvas, _id, fileId, fileData });
        }
      }
      // Check if the canvas data has changed since the last emission
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("document", async ({ document, _id, fileId }) => {
    // console.log(document.blocks);
    try {
      // Check if the canvas data has changed since the last emission
      if (JSON.stringify(document) !== JSON.stringify(previousDocument)) {
        // Update the previousCanvasData to the current canvas data
        previousDocument = document;
        io.emit("document", { document, _id, fileId });
      }
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
    // delete userSocketMap[userId];
    // io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getRecipientSocketId };

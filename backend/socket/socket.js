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

let previousCanvasData = null;
let previousDocument = null;

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  const debounceEmitCanvas = _.debounce(({ document, canvas, _id, fileId }) => {
    // Emit the canvas event to all clients
    io.emit("canvas", { document, canvas, _id, fileId });
    // Update the previousCanvasData to the current canvas data
    previousCanvasData = canvas;
  }, 200);

  socket.on("canvas", async ({ canvas, _id, fileId, fileData }) => {
    try {
      if (canvas) {
        if (JSON.stringify(canvas) !== JSON.stringify(previousCanvasData)) {
          debounceEmitCanvas({ canvas, _id, fileId, fileData });
        }
      } else {
        if (JSON.stringify(fileData) !== JSON.stringify(previousFileData)) {
          debounceEmitCanvas({ canvas, _id, fileId, fileData });
        }
      }
      // Check if the canvas data has changed since the last emission
    } catch (error) {
      console.log(error);
    }
  });
  socket.on("document", async ({ document, _id, fileId }) => {
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
  });
});

module.exports = { io, server, app, getRecipientSocketId };

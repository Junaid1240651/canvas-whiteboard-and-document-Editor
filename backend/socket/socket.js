const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);

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

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("connected", userId);

  if (userId != "undefined") userSocketMap[userId] = socket.id;
  // console.log("connected", userSocketMap[userId]);

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("canvas", async ({ document, canvas, _id }) => {
    try {
      console.log(_id);
      io.emit("canvas", { document, canvas, _id });
    } catch (error) {
      console.log(error);
    }
  });

  // socket.on("markMessagesAsSeen", async ({ conversationId, userId }) => {
  //   try {
  //     await Message.updateMany(
  //       { conversationId: conversationId, seen: false },
  //       { $set: { seen: true } }
  //     );
  //     await Conversation.updateOne(
  //       { _id: conversationId },
  //       { $set: { "lastMessage.seen": true } }
  //     );
  //     io.to(userSocketMap[userId]).emit("messagesSeen", { conversationId });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  socket.on("disconnect", () => {
    console.log("disconnected");
    // delete userSocketMap[userId];
    // io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { io, server, app, getRecipientSocketId };

import { io } from "socket.io-client";
import { setOnlineUsers, setSocket } from "../redux/socketio";

const setupSocket = (userId, dispatch) => {
  try {
    const socket = io("http://localhost:3000", {
      query: {
        userId: userId,
      },
    });

    socket.on("connect", () => {
      // console.log("Connected to server");
      dispatch(setSocket(socket));
    });

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return socket;
  } catch (error) {
    console.log(error);
    console.error("Error connecting to server:", error);
    return null;
  }
};

export default setupSocket;

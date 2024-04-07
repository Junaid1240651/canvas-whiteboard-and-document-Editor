import { io } from "socket.io-client";
import { setSocket } from "../redux/socketio";

const setupSocket = (userId, dispatch) => {
  try {
    const socket = io("/", {
      query: {
        userId: userId,
      },
    });
console.log(socket)
    socket.on("connect", () => {
      dispatch(setSocket(socket));
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return socket;
  } catch (error) {
    return null;
  }
};

export default setupSocket;

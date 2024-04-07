import { io } from "socket.io-client";
import { setSocket } from "../redux/socketio";

const setupSocket = (userId, dispatch) => {
  try {
    const socket = io("http://localhost:3000", {
      query: {
        userId: userId,
      },
    });

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

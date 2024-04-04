import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import axios from "axios";
import useLoading from "../hooks/useLoading";
import { useDispatch, useSelector } from "react-redux";
import { setSaveCanvasClick } from "../redux/team";
import LoadingScreen from "./LoadingScreen/LoadingScreen";
const Canvas = ({ setCanvasData }) => {
  const [whiteBoardData, setWhiteBoardData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const { colorMode } = useColorMode();
  const { isLoading, setLoading } = useLoading();
  const socket = useSelector((state) => state.socketio.socket);
  const [internalChange, setInternalChange] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);

  const useToast = useShowToast();
  const dispatch = useDispatch();

  const theme = colorMode === "light" ? "light" : "dark";
  const { fileId } = useParams();

  const saveCanvasClick = useSelector((state) => state.team.saveCanvasClick);

  const getCanvas = async () => {
    if (isLoading) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/userData/canvas/${fileId}`);
      if (res.data[0].whiteBoardData.length > 0) {
        setWhiteBoardData(res.data[0]);
      } else {
        setWhiteBoardData(res.data);
      }
    } catch (error) {
      useToast("Error", error.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (saveCanvasClick && whiteBoardData !== null) {
      setCanvasData({ whiteBoardData, imageData });
      dispatch(setSaveCanvasClick(false));
    }
  }, [saveCanvasClick]);

  useEffect(() => {
    getCanvas();
  }, [fileId]);

  let files = {};
  useEffect(() => {
    whiteBoardData &&
      whiteBoardData.imageData &&
      Object.keys(whiteBoardData.imageData).forEach((id) => {
        files[id] = {
          id: id,
          dataURL: whiteBoardData.imageData[id].dataURL,
        };
      });
  }, [whiteBoardData]);

  useEffect(() => {
    socket.emit("canvas", {
      canvas: whiteBoardData,
      _id: user?._id,
    });
    setInternalChange(true);
  }, [whiteBoardData]);

  useEffect(() => {
    socket?.on("canvas", (message) => {
      // console.log(message.canvas);
      if (user?._id !== message._id) {
        // Check if the received canvas data is different from the current state
        const receivedCanvasData = message.canvas;
        const currentCanvasData = whiteBoardData;

        // If the received data is different from the current state, update the state
        if (
          JSON.stringify(receivedCanvasData) !==
          JSON.stringify(currentCanvasData)
          //    &&
          // receivedCanvasData.length > 0
        ) {
          console.log(user?._id);
          console.log(message._id);

          // setWhiteBoardData(receivedCanvasData);
          return;
        }
      }
    });
  }, [socket]);
  return (
    <>
      {!isLoading && (
        <Excalidraw
          theme={theme}
          initialData={{
            elements: whiteBoardData ? whiteBoardData.whiteBoardData : [],
            appState: { viewBackgroundColor: "#1e20" },
            files: files,
          }}
          onChange={(excalidrawElements, appState, files) => {
            setWhiteBoardData(excalidrawElements);
            setImageData(files);
          }}
          UIOptions={{
            canvasActions: {
              saveToActiveFile: false,
              loadScene: false,
              export: false,
              toggleTheme: false,
            },
          }}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.Help />
            <MainMenu.DefaultItems.SaveAsImage />
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
          <WelcomeScreen>
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.MenuHint />
            <WelcomeScreen.Hints.ToolbarHint />
            <WelcomeScreen.Center>
              <WelcomeScreen.Center.MenuItemHelp />
            </WelcomeScreen.Center>
          </WelcomeScreen>
        </Excalidraw>
      )}
    </>
  );
};

export default Canvas;

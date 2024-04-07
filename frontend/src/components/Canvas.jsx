import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useColorMode } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import axios from "axios";
import useLoading from "../hooks/useLoading";
import { useDispatch, useSelector } from "react-redux";
import { setSaveCanvasClick } from "../redux/team";
import LoadingScreen from "./LoadingScreen/LoadingScreen";
const Canvas = ({ setCanvasData, fileData }) => {
  const [whiteBoardData, setWhiteBoardData] = useState(
    fileData[0] ? fileData[0].whiteBoardData : []
  );
  const [whiteBoardData2, setWhiteBoardData2] = useState(
    fileData[0] ? fileData[0].whiteBoardData : []
  );
  const { fileId } = useParams();
  const [isRemoteChange, setIsRemoteChange] = useState(true);
  const [imageData, setImageData] = useState(
    fileData[0] ? fileData[0].imageData : null
  );
  const { colorMode } = useColorMode();
  const socket = useSelector((state) => state.socketio.socket);
  const user = useSelector((state) => state.auth.userInfo);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const dispatch = useDispatch();
  const theme = colorMode === "light" ? "light" : "dark";
  const saveCanvasClick = useSelector((state) => state.team.saveCanvasClick);
  useEffect(() => {
    if (saveCanvasClick && whiteBoardData !== null) {
      console.log(whiteBoardData);
      setCanvasData({ whiteBoardData: whiteBoardData2, imageData });
      dispatch(setSaveCanvasClick(false));
    }
  }, [saveCanvasClick]);

  let files = {};
  useEffect(() => {
    imageData &&
      imageData &&
      Object.keys(imageData).forEach((id) => {
        files[id] = {
          id: id,
          dataURL: imageData[id].dataURL,
        };
      });
  }, [whiteBoardData]); //

  const prevWhiteBoardData = useRef(null);

  // Function to log the previous and current whiteBoardData
  const logData = async (prevData, currentData) => {
    const sceneData = {
      elements: currentData.map((element) => element),
    };
    await excalidrawAPI.updateScene(sceneData);

    setIsRemoteChange(true);
  };

  useEffect(() => {
    // Call the logData function after whiteBoardData is updated
    logData(prevWhiteBoardData.current, whiteBoardData);
    // Store the current whiteBoardData as the previous value
    prevWhiteBoardData.current = whiteBoardData;
  }, [whiteBoardData]);
  useEffect(() => {
    socket?.on("canvas", (message) => {
      if (user?._id !== message._id) {
        setIsRemoteChange(false);

        const receivedCanvasData = message.canvas;
        const receivedFileData = message.fileData;
        console.log(receivedFileData, "receivedFileData");

        if (
          JSON.stringify(receivedCanvasData) !==
            JSON.stringify(whiteBoardData) &&
          whiteBoardData?.length <= receivedCanvasData?.length
        ) {
          setWhiteBoardData(receivedCanvasData);

          // Update the whiteBoardData state
        }
      }
    });

    // After whiteBoardData is updated, update the scene using excalidrawAPI

    return () => {
      socket.off("canvas"); // Clean up socket listener on unmount
    };
  }, [socket]);
  console.log(imageData);
  if (!fileData) return <LoadingScreen />;
  return (
    <>
      <Excalidraw
        theme={theme}
        initialData={{
          elements: whiteBoardData,
          appState: { viewBackgroundColor: "#1e20" },
          files: files,
        }}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        isCollaborating={true}
        onChange={(excalidrawElements, appState, files) => {
          setWhiteBoardData2(excalidrawElements);
          if (isRemoteChange === true) {
            // Only emit changes if they are not caused by remote users
            setTimeout(() => {
              setImageData(files);
              socket.emit("canvas", {
                canvas: excalidrawElements,
                fileData: files,
                _id: user?._id,
                fileId: fileId,
              });
            }, 200);
          }
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
    </>
  );
};

export default Canvas;

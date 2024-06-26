import { AddIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  useColorModeValue,
  Text,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import React, { Suspense, lazy, useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { useParams } from "react-router-dom";
import useLoading from "../hooks/useLoading";
import { useDispatch, useSelector } from "react-redux";

import { setSaveCanvasClick, setSaveDocClick } from "../redux/team";
import ColorModeToggle from "../components/ColorModeToggle";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
const Document = lazy(() => import("../components/Document"));
const Canvas = lazy(() => import("../components/Canvas"));
const Workspace = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [documentData, setDocumentData] = useState();
  const [whiteBoardData, setWhiteBoardData] = useState();
  const { isLoading, setLoading } = useLoading();
  const user = useSelector((state) => state.auth.userInfo);
  const [fileData, setFileData] = useState();
  const dispatch = useDispatch();
  const [screenType, setScreenType] = useState(
    localStorage.getItem("screenType") || "both"
  );

  const useToast = useShowToast();
  const { fileId } = useParams();
  const getFileData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/api/userData/file/${fileId}`);
      if (res.data) {
        setFileData(res.data);
      }
    } catch (error) {
      useToast("Error", error.response.data.message, "error");
      setFileData(null);
    } finally {
      setLoading(false);
    }
  };

  const onSaveDocument = async () => {
    if (
      isLoading &&
      screenType === "both" &&
      documentData?.document !== undefined &&
      whiteBoardData?.canvasData !== undefined
    )
      return;
    setLoading(true);
    try {
      const res = await axios.post(`/api/userData/saveDocument/${fileId}`, {
        document: documentData?.document,
        canvas: whiteBoardData?.canvasData,
      });
      useToast("Success", res.data.message, "success");
    } catch (error) {
      setFileData(null);
      useToast("Error", error.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const saveClickHandler = () => {
    if (screenType === "both") {
      dispatch(setSaveDocClick(true));
      dispatch(setSaveCanvasClick(true));
    } else if (screenType === "document") {
      dispatch(setSaveDocClick(true));
    } else if (screenType === "canvas") {
      dispatch(setSaveCanvasClick(true));
    }
  };

  function getDocData(document) {
    setDocumentData((prevData) => ({ ...prevData, document }));
  }
  function getCanvasData(canvasData) {
    setWhiteBoardData((prevData) => ({ ...prevData, canvasData }));
  }

  useEffect(() => {
    if (screenType === "both") {
      document && whiteBoardData && onSaveDocument();
    } else {
      onSaveDocument();
    }
  }, [documentData, whiteBoardData]);
  useEffect(() => {
    localStorage.setItem("screenType", screenType);
  }, [screenType]);
  useEffect(() => {
    getFileData();
  }, [fileId]);
  if (!fileData?.canvas && !fileData?.document)
    return fileData === null ? (
      <Text className=" text-2xl flex justify-center   h-[100vh] items-center w-full">
        You Dont Have Access of This file or Invalid Url 🥺
      </Text>
    ) : (
      <LoadingScreen />
    );
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <Box
          height={"auto"}
          // bg={useColorModeValue("gray.100", "bg-dark")}
        >
          <Flex
            h={14}
            px={10}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <HStack spacing={4} alignItems={"center"}>
              <Avatar cursor={"pointer"} size={"sm"} src={user?.profilePic} />
              <Text cursor={"pointer"}>{fileData?.fileName}</Text>
            </HStack>
            <HStack spacing={0} alignItems={"center"}>
              <Text
                border={"1px solid gray"}
                className="p-1 px-3 border-1  border-r-0 cursor-pointer"
                onClick={() => setScreenType("document")}
              >
                Document
              </Text>

              <Text
                border={"1px solid gray"}
                className="p-1 px-3 border-1  border-r-0 cursor-pointer"
                onClick={() => {
                  setScreenType("both");
                }}
              >
                Both
              </Text>
              <Text
                border={"1px solid gray"}
                className="p-1 px-3 border-1  border-r-0 cursor-pointer"
                onClick={() => setScreenType("canvas")}
              >
                Canvas
              </Text>
            </HStack>
            <HStack gap={2}>
              <Button>Share</Button>
              <Button isLoading={isLoading} onClick={saveClickHandler}>
                Save
              </Button>
              <ColorModeToggle
                colorMode={colorMode}
                toggleColorMode={toggleColorMode}
              />
            </HStack>
          </Flex>
          <Divider className="w-[100vh] h-[0.5px] bg-slate-400" />
          <Flex
            className={`${
              screenType === "both" ? "flex-1" : "flex"
            } border-none`}
            h={`calc(100vh - 58px)`}
            overflow={"hidden"}
            justify="between"
          >
            <div
              className={`${
                screenType === "both"
                  ? "w-8/12 pl-10"
                  : screenType === "document"
                  ? "w-[1500000%]"
                  : "hidden"
              }`}
            >
              <Document fileData={fileData?.document} setDocData={getDocData} />
            </div>
            {screenType === "both" && (
              <Divider width={0.5} height={"100%"} className="bg-slate-400" />
            )}
            <React.Fragment>
              <Canvas
                setFileData={setFileData}
                fileData={fileData?.canvas}
                setCanvasData={getCanvasData}
              />
            </React.Fragment>
          </Flex>
        </Box>
      </Suspense>
    </>
  );
};

export default Workspace;

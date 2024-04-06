import { Box } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import RawTool from "@editorjs/raw";
import LinkTool from "@editorjs/link";
import SimpleImage from "@editorjs/simple-image";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";
import Warning from "@editorjs/warning";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { useColorMode } from "@chakra-ui/react";
import useLoading from "../hooks/useLoading";
import { useDispatch, useSelector } from "react-redux";
import { setSaveDocClick } from "../redux/team";
import LoadingScreen from "./LoadingScreen/LoadingScreen";
const rawDocument = {
  time: 1550476186479,
  blocks: [
    {
      data: {
        text: "Make You Doc Here",
        level: 1,
      },
      id: "123",
      type: "header",
    },
    {
      data: {
        level: 4,
      },
      id: "1234",
      type: "header",
    },
  ],
  version: "2.8.1",
};
const Document = ({ setDocData, fileData }) => {
  const editorRef = useRef(null);
  const [document, setDocument] = useState(
    fileData[0] ? fileData[0] : rawDocument
  );
  const { isLoading, setLoading } = useLoading();
  const { fileId } = useParams();
  const [hasNewChanges, setHasNewChanges] = useState(false);
  const user = useSelector((state) => state.auth.userInfo);
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const saveDocClick = useSelector((state) => state.team.saveDocClick);
  const socket = useSelector((state) => state.socketio.socket);

  const initEditor = async () => {
    const editor = new EditorJS({
      holder: "editorjs",
      data: document,
      tools: {
        header: {
          class: Header,
          shortcut: "CMD+SHIFT+H",
          config: {
            placeholder: "Enter a Header",
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        raw: {
          class: RawTool,
        },
        linkTool: {
          class: LinkTool,
        },
        image: {
          class: SimpleImage,
        },

        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        paragraph: Paragraph,
        warning: Warning,
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              coub: true,
            },
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+O",
        },
      },
      onChange: () => {
        setHasNewChanges(true);
      },
    });

    // Set the editor instance to the ref
    editorRef.current = editor;
  };

  const onSaveDocument = async () => {
    if (editorRef.current) {
      const saveData = await editorRef.current.save();
      console.log(saveData);
      setDocData([saveData]);
    }
  };

  useEffect(() => {
    saveDocClick && onSaveDocument();
    saveDocClick && dispatch(setSaveDocClick(false));
    console.log("fgsdfg");
  }, [saveDocClick]);

  useEffect(() => {
    document && initEditor();
    return () => {
      const destroyEditor = async () => {
        if (editorRef.current) {
          const editor = await editorRef.current;
          editor.destroy();
        }
      };

      destroyEditor();
    };
  }, [document]);

  useEffect(() => {
    if (hasNewChanges && socket) {
      const abc = async () => {
        const saveData = await editorRef.current.save();
        socket.emit("document", {
          document: saveData,
          _id: user?._id,
          fileId: fileId,
        });
        setHasNewChanges(false); // Reset the flag after emitting data
      };
      abc();
    }
  }, [hasNewChanges, socket]);

  useEffect(() => {
    socket?.on("document", (message) => {
      console.log(message.document);
      if (user?._id !== message._id) {
        const receivedDocumentData = message.document;

        // If the received data is different from the current state, update the state
        if (JSON.stringify(receivedDocumentData) !== JSON.stringify(document)) {
          console.log("bimci");
          setDocument(receivedDocumentData);
        }
      }
    });

    return () => {
      socket.off("document"); // Clean up socket listener on unmount
    };
  }, [socket]);
  return (
    <div
      className={`w-[100%] ${
        colorMode === "light" ? "text-black bg-white" : "text-white bg-dark"
      } `}
    >
      {!isLoading && (
        <div
          className={` ${colorMode === "light" ? "bg-slate-200" : " bg-dark"} `}
          id="editorjs"
        />
      )}
    </div>
  );
};

export default Document;

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";

import { useEffect, useState } from "react";
import axios from "axios";
import useLoading from "./../hooks/useLoading";
import { useSelector } from "react-redux";
import useGetUserData from "../hooks/useGetUserData";

const CreateFile = ({
  newFile,
  renameFile,
  grantAccess,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [fileName, setFileName] = useState(renameFile?.fileName);
  const { isLoading, setLoading } = useLoading();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const selectedTeam = useSelector((state) => state.team.selectedTeam);
  const showToast = useShowToast();
  const getUserData = useGetUserData();
  const createFile = async () => {
    if (isLoading) return;
    if (selectedTeam?.team === undefined) {
      alert("Please create a team first");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/userData/createFile", {
        fileName,
        teamId: selectedTeam?.team?._id,
      });

      getUserData();
      showToast("Success", res.data.message, "success");
      closeModal();
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async () => {
    if (isLoading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/userData/updateFile/${renameFile?._id}`,
        {
          fileName,
        }
      );
      await getUserData();
      showToast("Success", res.data.message, "success");
      closeModal();
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const grantAccessHandler = () => {
    if (isLoading) return;
    setLoading(true);
    axios
      .post(`/api/userData/grantAccess/${grantAccess}`, {
        email: fileName,
      })
      .then((res) => {
        showToast("Success", res.data.message, "success");
        closeModal();
      })
      .catch((error) => {
        showToast("Error", error.response.data.message, "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (isModalOpen) {
      onOpen();
    } else {
      onClose();
    }
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  return (
    <Modal
      isCentered
      onClose={closeModal}
      isOpen={isOpen}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {grantAccess
            ? "Enter Email  To Give Grant Access"
            : "Enter File Name"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter gap={4}>
          <Button onClick={closeModal}>Close</Button>
          <Button
            isLoading={isLoading}
            onClick={
              newFile
                ? createFile
                : grantAccess
                ? grantAccessHandler
                : updateFile
            }
          >
            {newFile ? "Create File" : grantAccess ? "Submit" : "Update File"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFile;

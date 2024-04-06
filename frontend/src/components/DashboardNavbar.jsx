import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  useColorModeValue,
  Text,
  Input,
  Tr,
  Th,
  Td,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Divider,
  useColorMode,
  Button,
  MenuItem,
  MenuList,
  MenuButton,
  Menu,
  IconButton,
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";

import { IoIosLink, IoMdMore } from "react-icons/io";

import { Link, useNavigate } from "react-router-dom";
import ColorModeToggle from "./ColorModeToggle";
import { GoDuplicate } from "react-icons/go";
import {
  MdDeleteOutline,
  MdDriveFileRenameOutline,
  MdLogout,
} from "react-icons/md";
import { IoArchiveOutline, IoShareSocialOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import CreateFile from "./CreateFile";
import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen/LoadingScreen";
import useGetUserData from "../hooks/useGetUserData";
import { setSelectedTeam } from "../redux/team";
import { CgProfile } from "react-icons/cg";
import useLogout from "../hooks/useLogout";
const DashboardNavbar = ({}) => {
  const [renameFile, setRenameFile] = useState(null);
  const [grantAccess, setGrantAccess] = useState(null);
  const user = useSelector((state) => state.auth.userInfo);
  const userData = useSelector((state) => state.user.userData);
  const logout = useLogout();

  const navigate = useNavigate();
  const selectedTeam = useSelector((state) => state.team.selectedTeam);
  const getUserData = useGetUserData();
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showToast = useShowToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const deleteFile = async (fileId) => {
    try {
      const res = await axios.delete(`/api/userData/deleteFile/${fileId}`);
      await getUserData();

      showToast("Success", res.data.message, "success");
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };
  const copyURL = (fileId) => {
    navigator.clipboard
      .writeText("http://localhost:3001/workspace/" + fileId)
      .then(() => {
        showToast("Success", "File link copied", "success");
      });
  };
  const duplicateFile = async (fileId) => {
    try {
      const res = await axios.post(`/api/userData/duplicateFile/${fileId}`);
      showToast("Success", res.data.message, "success");
      await getUserData();
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };
  const archiveFile = async (fileId) => {
    try {
      const res = await axios.post(`/api/userData/archiveFile/${fileId}`);
      showToast("Success", res.data.message, "success");
      await getUserData();
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };
  const unArchive = async (fileId) => {
    try {
      const res = await axios.post(`/api/userData/unArchiveFile/${fileId}`);
      showToast("Success", res.data.message, "success");

      await getUserData();
      dispatch(
        setSelectedTeam({
          ...selectedTeam,
          archive: true,
        })
      );
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };

  const allFileHandler = () => {
    dispatch(
      setSelectedTeam({
        ...selectedTeam,
        allFile: false,
        archive: false,
      })
    );
  };
  const recentFileHandler = () => {
    if (!userData || !userData.file) {
      console.log("userData or userData.file is null or undefined");
      return;
    }

    const selectedTeamId = selectedTeam.team?._id;

    if (!selectedTeamId) {
      console.log("Selected team ID is null or undefined");
      return;
    }

    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

    const filteredFiles = userData.file.filter(
      (file) =>
        file.teamId === selectedTeamId &&
        new Date(file.createdAt) > thirtyMinutesAgo
    );

    const sortedFiles = [...filteredFiles].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFile(sortedFiles);
  };
  const searchFilter = (e) => {
    if (!userData || !userData.file) return;

    const searchQuery = e.target.value.toLowerCase();
    const selectedTeamId = selectedTeam.allFile ? null : selectedTeam.team?._id;

    const filteredFiles = userData.file.filter(
      (file) =>
        (selectedTeam.allFile || file.teamId === selectedTeamId) &&
        file.fileName.toLowerCase().includes(searchQuery)
    );

    setFile(filteredFiles);
  };

  useEffect(() => {
    if (
      selectedTeam.team &&
      userData &&
      selectedTeam.archive === false &&
      selectedTeam.allFile === false
    ) {
      const fileName = userData?.file?.filter(
        (file) =>
          file.teamId == selectedTeam.team._id &&
          !userData.isArchive.includes(file._id)
      );

      setFile(fileName);
    } else if (selectedTeam.allFile === true) {
      const fileName = userData?.file.filter(
        (file) => !userData.isArchive.includes(file._id)
      );
      setFile(fileName);
    }
  }, [selectedTeam, userData]);

  useEffect(() => {
    if (selectedTeam.archive === true) {
      const fileName = userData?.file.filter((file) =>
        userData.isArchive.includes(file._id)
      );
      setSelectedTeam({
        ...selectedTeam,
        archive: false,
      });
      setFile(fileName);
    }
  }, [selectedTeam]);
  if (!userData) {
    return <LoadingScreen />;
  }
  return (
    <>
      <Box
        height={"100vh"}
        width={`calc(100% - 288px)`}
        bg={useColorModeValue("white", "gray.800")}
      >
        <Flex
          h={16}
          my={1.5}
          px={7}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack spacing={4} fontWeight={500} alignItems={"center"}>
            {selectedTeam.archive ? (
              <Button cursor={"auto"} px={5}>
                Archive
              </Button>
            ) : (
              <>
                <Button px={5} cursor={"pointer"} onClick={allFileHandler}>
                  All
                </Button>
                <Button cursor={"pointer"} onClick={recentFileHandler}>
                  Recent
                </Button>
                <Button onClick={allFileHandler} cursor={"pointer"}>
                  Created By Me
                </Button>
              </>
            )}
          </HStack>
          <Flex alignItems={"center"} gap={5}>
            <Input
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              placeholder={"Search"}
              rounded={"5px"}
              border={"1.5px solid #64748B"}
              onChange={searchFilter}
              // leftIcon={<AddIcon />}
            />

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                border={"none"}
                icon={
                  <Avatar
                    cursor={"pointer"}
                    size={"sm"}
                    src={user?.profilePic}
                  />
                }
                variant="outline"
              />
              <MenuList className="text-[17px]">
                <MenuItem
                  onClick={() => navigate("/profile")}
                  icon={<CgProfile size={20} />}
                  command="⌘P"
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  icon={<MdLogout size={20} />}
                  command="⌘L"
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>

            <ColorModeToggle
              colorMode={colorMode}
              toggleColorMode={toggleColorMode}
            />
          </Flex>
        </Flex>
        <Divider className="w-[100vh] mb-4 h-[0.5px] bg-slate-400" />
        <TableContainer px={6}>
          <Table size={"sm"} variant="simple">
            <Thead fontWeight={400}>
              <Tr mb={2}>
                <Th pb={5} fontSize={"15px"}>
                  File Name
                </Th>
                <Th pb={5} fontSize={"15px"}>
                  Created At
                </Th>
                <Th pb={5} fontSize={"15px"}>
                  Edited
                </Th>
                <Th pb={5} fontSize={"15px"}>
                  Auther
                </Th>
                <Th pb={5}></Th>
              </Tr>
            </Thead>

            <Tbody>
              {file?.map((file, index) => (
                <Tr
                  key={index}
                  className={`cursor-pointer ${
                    colorMode === "light"
                      ? "hover:bg-gray-100"
                      : "hover:bg-gray-800"
                  }`}
                >
                  <Td
                    onClick={() => navigate(`/workspace/${file._id}`)}
                    fontSize={"16px"}
                    fontWeight={"500"}
                  >
                    {" "}
                    {file.fileName}
                  </Td>
                  <Td onClick={() => navigate(`/workspace/${file._id}`)}>
                    {formatDistanceToNow(new Date(file.createdAt))} ago
                  </Td>

                  <Td onClick={() => navigate(`/workspace/${file._id}`)}>
                    {formatDistanceToNow(new Date(file.updatedAt))} ago
                  </Td>
                  <Td onClick={() => navigate(`/workspace/${file._id}`)}>
                    <Avatar size={"sm"} src={user?.profilePic} />
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        border={"none"}
                        icon={<IoMdMore size={24} />}
                        variant="outline"
                      />
                      <MenuList className="text-[17px]">
                        <MenuItem
                          onClick={() => copyURL(file._id)}
                          icon={<IoIosLink size={18} />}
                          command="⌘C"
                        >
                          Copy Link
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setIsModalOpen(true), setGrantAccess(file._id);
                          }}
                          icon={<IoIosLink size={18} />}
                          command="⌘C"
                        >
                          Grant Access
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            setRenameFile(file);
                            setIsModalOpen(true);
                          }}
                          icon={<MdDriveFileRenameOutline size={18} />}
                          command="⌘R"
                        >
                          Rename
                        </MenuItem>
                        <MenuItem
                          onClick={() => copyURL(file._id)}
                          icon={<IoShareSocialOutline size={18} />}
                          command="⌘S"
                        >
                          Share
                        </MenuItem>
                        <MenuItem
                          onClick={() => duplicateFile(file._id)}
                          icon={<GoDuplicate size={18} />}
                          command="⌘D"
                        >
                          Duplicate
                        </MenuItem>{" "}
                        <MenuItem
                          onClick={() =>
                            userData.isArchive.includes(file._id)
                              ? unArchive(file._id)
                              : archiveFile(file._id)
                          }
                          icon={<IoArchiveOutline size={18} />}
                          command="⌘A"
                        >
                          {userData?.isArchive.includes(file._id)
                            ? "Unarchive"
                            : "Archive"}
                        </MenuItem>{" "}
                        <MenuItem
                          onClick={() => deleteFile(file._id)}
                          icon={<MdDeleteOutline size={18} />}
                          command="⌘O"
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {file?.length <= 0 && (
          <Text className="mt-4 text-center">No File Avilable</Text>
        )}
        {isModalOpen && (
          <CreateFile
            grantAccess={grantAccess}
            renameFile={renameFile}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}
        {userData?.file?.length <= 0 && (
          <Text className="text-center mt-5 text-xl">
            No File Avilable Please Create One
          </Text>
        )}
      </Box>
    </>
  );
};

export default DashboardNavbar;

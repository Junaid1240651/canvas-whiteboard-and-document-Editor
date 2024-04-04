import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Flex,
  Image,
  Text,
  Divider,
  Box,
  Progress,
  useColorModeValue,
  Avatar,
  CircularProgress,
} from "@chakra-ui/react";
import { IoFlagOutline } from "react-icons/io5";
import { FiGrid } from "react-icons/fi";
import { MdOutlineLogout } from "react-icons/md";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineTeam } from "react-icons/ai";
import { FiArchive } from "react-icons/fi";
import { AiOutlineGithub } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";
import CreateFile from "./CreateFile";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTeam } from "../redux/team";
import { setFileModelOpen } from "../redux/file";
import LoadingScreen from "./LoadingScreen/LoadingScreen";
import useGetUserData from "../hooks/useGetUserData";
import useLogout from "../hooks/useLogout";
const SideNavBar = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectedTeam = useSelector((state) => state.team.selectedTeam);
  const user = useSelector((state) => state.auth.userInfo);
  const userData = useSelector((state) => state.user.userData);
  const navigate = useNavigate();
  const logout = useLogout();

  const openFileModel = () => {
    setIsModalOpen(true);
    dispatch(setFileModelOpen(true));
  };
  const setSelectedTeamHandler = (team) => {
    dispatch(setSelectedTeam({ team: team, archive: false, allFile: false }));
  };

  useEffect(() => {
    if (selectedTeam.team) return;
    userData &&
      dispatch(
        setSelectedTeam({
          team: userData?.team?.[0],
          archive: false,
          allFile: false,
        })
      );
  }, []);

  const allFileHandler = () => {
    dispatch(
      setSelectedTeam({
        ...selectedTeam,
        allFile: true,
        archive: false,
      })
    );
  };
  const archiveHandler = () => {
    dispatch(
      setSelectedTeam({
        ...selectedTeam,
        allFile: false,
        archive: true,
      })
    );
  };

  return (
    <>
      <Box
        bg={useColorModeValue("white", "gray.800")}
        className=" h-screen 
    fixed w-72 borde-r border-r-[1px] border-r-gray-400 p
    flex flex-col align-middle 
    "
      >
        <Box className=" flex-1 flex-col justify-center">
          <Flex className=" flex justify-center">
            <Image src="/logo.png" w={100} h={10} my={3} mt={4} />
          </Flex>
          <Divider height={"1.4px"} className="bg-gray-500" mt={2} />

          <Menu className="m-6">
            <MenuButton
              colorScheme="#4287f5"
              m={"18px"}
              width={"86.7%"}
              as={Button}
              _hover={{ bg: "#4287f5" }}
              textColor={"white"}
              backgroundColor={"#2866df"}
              rightIcon={<ChevronDownIcon />}
            >
              {selectedTeam.team ? selectedTeam.team.teamName : "Create Team"}
            </MenuButton>
            <MenuList gap={3}>
              {userData &&
                userData?.team?.map((team, index) => (
                  <Flex mx={3} key={index}>
                    <MenuItem
                      onClick={() => setSelectedTeamHandler(team)}
                      key={index}
                      rounded={4}
                      px={2}
                    >
                      {team.teamName}
                    </MenuItem>
                  </Flex>
                ))}

              <Divider height={"1.4px"} className="bg-gray-500" mt={2} />
              <MenuList mx={3} shadow={"none"} border={"none"}>
                <MenuItem
                  rounded={4}
                  gap={2}
                  px={2}
                  onClick={() => navigate("/create/team")}
                >
                  <AiOutlineTeam />
                  Create Team
                </MenuItem>
                <MenuItem gap={2} px={2} onClick={() => navigate("/profile")}>
                  <IoSettingsOutline gap={2} />
                  Settings
                </MenuItem>
                <MenuItem gap={2} px={2} onClick={logout}>
                  <MdOutlineLogout />
                  Logout
                </MenuItem>
              </MenuList>
              <Divider my={2} />

              <Flex pl={5} gap={2} alignItems={"center"}>
                <Image
                  src={`${user?.profilePic}`}
                  w={8}
                  height={8}
                  rounded={"full"}
                />
                <Flex direction={"column"} className="text-sm" lineHeight={1.2}>
                  <Text fontWeight={"bold"}>{user?.name}</Text>
                  <Text>{user?.email}</Text>
                </Flex>
              </Flex>
            </MenuList>
          </Menu>
          {/* <Divider className="w-[100vh] mb-6 h-[0.5px] bg-slate-400" /> */}
          <Flex className="flex justify-center m-[18px] mt-1">
            <Button
              onClick={() => allFileHandler()}
              justifyContent={"start"}
              width={"100%"}
              gap={2}
            >
              <FiGrid />
              All Files
            </Button>
          </Flex>
        </Box>
        <Box p={5} fontWeight={500}>
          <Text
            width={"100%"}
            gap={2}
            p={2}
            alignItems={"center"}
            className="flex hover:bg-gray-200  hover:rounded-[6px]"
            cursor={"pointer"}
          >
            <IoFlagOutline />
            Getting Start
          </Text>
          <Text
            width={"100%"}
            gap={2}
            p={2}
            alignItems={"center"}
            className="flex hover:bg-gray-200  hover:rounded-[6px]"
            cursor={"pointer"}
          >
            {" "}
            <AiOutlineGithub />
            Github
          </Text>
          <Text
            width={"100%"}
            gap={2}
            p={2}
            alignItems={"center"}
            className="flex hover:bg-gray-200  hover:rounded-[6px]"
            cursor={"pointer"}
            mb={3}
            onClick={archiveHandler}
          >
            <FiArchive />
            Archive
          </Text>
          <Button
            width={"100%"}
            mb={4}
            bg={"#2866df"}
            _hover={{ bg: "#4287f5" }}
            textColor={"white"}
            onClick={openFileModel}
          >
            New File
          </Button>
          {isModalOpen && (
            <CreateFile
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              newFile={true}
            />
          )}
          <Progress
            // className="bg-blue-750"
            // backgroundColor={"red"}
            colorScheme="red"
            bgColor={"#2866df"}
            mb={3}
            size="sm"
            value={userData?.file?.length * 20}
            rounded={"full"}
          />
        </Box>
      </Box>
    </>
  );
};

export default SideNavBar;

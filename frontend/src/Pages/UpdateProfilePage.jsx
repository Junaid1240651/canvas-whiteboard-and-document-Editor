import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import usePreviewImage from "../hooks/usePreviewImage";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";
import { setUserInfo } from "../redux/auth";
import useLoading from "../hooks/useLoading";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const { isLoading, setLoading } = useLoading();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: user.name,
    userName: user.userName,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
    password: "",
  });
  const fileRef = useRef(null);
  const { handleImageChange, imageURL } = usePreviewImage();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setLoading(true);
    try {
      inputs.profilePic = imageURL;

      const response = await axios.put(`/api/users/update/${user._id}`, {
        inputs,
      });
      dispatch(setUserInfo(response.data.user));
      showToast("Success", response.data.message, "success");
    } catch (error) {
      showToast("Error", error.response.data.error, "error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} height={"100vh"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl>
            <FormLabel>User Icon</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  cursor={"pointer"}
                  size="xl"
                  src={imageURL || user.profilePic}
                  onClick={() => fileRef.current.click()}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              placeholder="Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              value={inputs.name}
            />
          </FormControl>
          <FormControl>
            <FormLabel>User Name</FormLabel>
            <Input
              placeholder="UserName"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) =>
                setInputs({ ...inputs, userName: e.target.value })
              }
              value={inputs.userName}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              value={inputs.email}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Your Bio..."
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              value={inputs.bio}
            />
          </FormControl>{" "}
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              value={inputs.password}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              onClick={() => navigate("/dashboard")}
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
};

export default UpdateProfilePage;

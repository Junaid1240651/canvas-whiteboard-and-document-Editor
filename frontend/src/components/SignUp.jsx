import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch } from "react-redux";
import { setAuthScreenStatus, setUserInfo } from "../redux/auth";
import axios from "axios";

import useShowToast from "../hooks/useShowToast";
import useLoading from "../hooks/useLoading";
import { AvatarGenerator } from "random-avatar-generator";
const SignUp = () => {
  const dispatch = useDispatch();
  const showToast = useShowToast();
  const [showPassword, setShowPassword] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    profilePic: "",
  });
  const { isLoading, setLoading } = useLoading();

  const handleSignUp = async () => {
    if (isLoading) return;
    setLoading(true);
    try {
      const generator = new AvatarGenerator();

      // Simply get a random avatar
      const avatar = generator.generateRandomAvatar();
      inputs.profilePic = avatar;

      const user = await axios.post("/api/users/signup", { inputs });
      showToast("Success", user.data.message, "success");
      dispatch(setUserInfo(user.data));
    } catch (error) {
      showToast("Error", error.response.data.error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <HStack>
              <Box>
                <FormControl isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    onChange={(e) =>
                      setInputs({ ...inputs, name: e.target.value })
                    }
                    value={inputs.name}
                    type="text"
                  />
                </FormControl>
              </Box>
              <Box>
                <FormControl isRequired>
                  <FormLabel>User Name</FormLabel>
                  <Input
                    onChange={(e) =>
                      setInputs({ ...inputs, userName: e.target.value })
                    }
                    value={inputs.userName}
                    type="text"
                  />
                </FormControl>
              </Box>
            </HStack>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                onChange={(e) =>
                  setInputs({ ...inputs, email: e.target.value })
                }
                value={inputs.email}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) =>
                    setInputs({ ...inputs, password: e.target.value })
                  }
                  value={inputs.password}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="SignUping..."
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleSignUp}
                isLoading={isLoading}
              >
                Sign up
              </Button>
            </Stack>
            <Stack>
              <Text align={"center"}>
                Already a user?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => dispatch(setAuthScreenStatus("Login"))}
                >
                  Login
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default SignUp;

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useState } from "react";
import { FiLogOut } from "react-icons/fi";

import { useDispatch } from "react-redux";
import { setAuthScreenStatus, setUserInfo } from "../redux/auth";
import useShowToast from "../hooks/useShowToast";
import axios from "axios";

import useLoading from "../hooks/useLoading";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { isLoading, setLoading } = useLoading();

  const [inputs, setInputs] = useState({
    userName: "",
    password: "",
  });
  const showToast = useShowToast();
  const handleLogin = async () => {
    if (isLoading) return;
    setLoading(true);
    try {
      const user = await axios.post("/api/users/login", {
        inputs,
      });
      dispatch(setUserInfo(user.data));
      showToast("Success", user.data.message, "success");
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
            Login Your Account
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
          w={{
            base: "full",
            sm: "400px",
          }}
        >
          <Stack spacing={4}>
            <FormControl isRequired>
              <FormLabel>UserName</FormLabel>
              <Input
                type="text"
                onChange={(e) =>
                  setInputs({ ...inputs, userName: e.target.value })
                }
                value={inputs.userName}
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
                loadingText="Logging In..."
                size="lg"
                bg={useColorModeValue("gray.600", "gray.700")}
                color={"white"}
                _hover={{
                  bg: useColorModeValue("gray.700", "gray.800"),
                }}
                onClick={handleLogin}
                isLoading={isLoading}
              >
                <FiLogOut size={20} />
                Login
              </Button>
            </Stack>
            <Stack>
              <Text align={"center"}>
                Don&apos;t Have an Account?{" "}
                <Link
                  color={"blue.400"}
                  onClick={() => dispatch(setAuthScreenStatus("SignUp"))}
                >
                  SignUp
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;

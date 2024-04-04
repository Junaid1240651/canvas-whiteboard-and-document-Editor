import Hero from "../components/Hero";
import Header from "../components/Header";
import { Flex, useColorModeValue } from "@chakra-ui/react";

const Home = () => {
  return (
    <Flex bg={useColorModeValue("white", "gray.800")} className="   flex-col ">
      <Header /> <Hero />
    </Flex>
  );
};

export default Home;

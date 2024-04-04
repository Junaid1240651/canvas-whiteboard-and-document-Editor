import { useDispatch } from "react-redux";
import { setAuthScreenStatus } from "../redux/auth";
import { useNavigate } from "react-router-dom";
import { Box, Image } from "@chakra-ui/react";

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Box className="  bg-gray-850 text-white">
      <div className=" flex gap-10 flex-col mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Documents & diagrams for engineering teams.
            <span className="sm:block"> Increase Conversion. </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            All-in-one markdown editor, collaborative canvas, and
            diagram-as-code builder
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Get Start
            </button>
          </div>
        </div>
        <Image src="./dashboard.webp" />
      </div>
    </Box>
  );
};

export default Hero;

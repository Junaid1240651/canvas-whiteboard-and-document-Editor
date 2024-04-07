import { Button, Image, Input, useColorMode } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useLoading from "../hooks/useLoading";
import { useDispatch } from "react-redux";
import { setSelectedTeam } from "../redux/team";

const CreateTeam = () => {
  const useToast = useShowToast();
  const { isLoading, setLoading } = useLoading();
  const [teamName, setTeamName] = useState("");
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();

  const navigate = useNavigate();
  const createNewTeam = async () => {
    if (isLoading) return;
    if (teamName === "")
      return useToast("Error", "Please Enter the Team Name", "error");
    setLoading(true);

    try {
      const res = await axios.post("/api/userData/createTeam", { teamName });

      useToast("Success", res.data.message, "success");
      dispatch(
        setSelectedTeam({
          team: res.data.team,
          archive: false,
          allFile: false,
        })
      );
      navigate("/dashboard");
    } catch (error) {
      useToast("Error", error.response.data.message, "error");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className=" px-6 md:px-16 my-16">
      <Image
        src={`${colorMode === "dark" ? "/logo2.png" : "/logo.png"}`}
        alt="logo"
        width={200}
        height={70}
      />
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-center font-bold text-[40px] py-3">
          What should we call your team?
        </h2>
        <h2 className="text-gray-500 text-center">
          You can always change this later from settings.
        </h2>
        <div className="mt-7 w-[40%]">
          <label className="text-gray-500">Team Name</label>
          <Input
            placeholder="Team Name"
            className="mt-3"
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>
        <Button
          textColor={"white"}
          bg={"#2866df"}
          className=" mt-9 w-[30%] hover:bg-blue-600"
          isLoading={isLoading}
          onClick={() => createNewTeam()}
        >
          Create Team
        </Button>
      </div>
    </div>
  );
};

export default CreateTeam;

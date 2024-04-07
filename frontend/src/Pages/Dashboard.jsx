import { useEffect } from "react";
import SideNavBar from "../components/SideNavBar";
import DashboardRight from "../components/Dashboard";
import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import LoadingScreen from "../components/LoadingScreen/LoadingScreen";
import useGetUserData from "../hooks/useGetUserData";
const Dashboard = () => {
  const userData = useSelector((state) => state.user.userData);

  const getUserData = useGetUserData();

  useEffect(() => {
    getUserData();
  }, []);

  if (!userData) <LoadingScreen />;
  return (
    <>
      {userData ? (
        <Flex className="flex flex-col ">
          <SideNavBar s />

          <Flex className="justify-end  bg-slate-200">
            <DashboardRight />
          </Flex>
        </Flex>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Dashboard;

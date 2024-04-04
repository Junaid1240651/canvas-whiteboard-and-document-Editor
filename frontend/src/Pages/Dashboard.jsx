import React, { useEffect, useState } from "react";
import SideNavBar from "../components/SideNavBar";
import DashboardNavbar from "../components/DashboardNavbar";
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
            <DashboardNavbar />
          </Flex>
        </Flex>
      ) : (
        <LoadingScreen />
      )}
    </>
  );
};

export default Dashboard;

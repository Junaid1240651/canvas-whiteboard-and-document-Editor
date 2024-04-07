import axios from "axios";
import useShowToast from "./useShowToast";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/user";

const useGetUserData = () => {
  const showToast = useShowToast();
  const dispatch = useDispatch();

  const getUserData = async () => {
    try {
      const res = await axios.get("/api/userData/getUserData");
      dispatch(setUserData(res.data));
    } catch (error) {
      showToast("Error", error.response.data.message, "error");
    }
  };

  return getUserData;
};

export default useGetUserData;

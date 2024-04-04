import { useDispatch } from "react-redux";
import useShowToast from "./useShowToast";
import useLoading from "./useLoading";
import axios from "axios";
import { setUserInfo } from "../redux/auth";

const useLogout = () => {
  const showToast = useShowToast();
  const dispatch = useDispatch();
  const { isLoading, setLoading } = useLoading();

  const logout = async () => {
    if (isLoading) return;
    setLoading(true);
    try {
      const response = await axios.post("/api/users/logout");
      dispatch(setUserInfo(null));
      showToast("Success", response.data.error, "success");
    } catch (error) {
      showToast("Error", error.response.data.error, "error");
    } finally {
      setLoading(false);
    }
  };

  return logout;
};

export default useLogout;

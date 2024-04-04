import SignUp from "../components/SignUp";
import Login from "./../components/Login";
import { useSelector } from "react-redux";
const AuthPage = () => {
  const authScreenStatus = useSelector((state) => state.auth.authScreenStatus);

  return <>{authScreenStatus === "Login" ? <Login /> : <SignUp />}</>;
};

export default AuthPage;

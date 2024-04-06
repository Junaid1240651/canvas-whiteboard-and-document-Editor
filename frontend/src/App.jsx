import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react"; // Import Suspense and lazy
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./Pages/HomePage";

const AuthPage = lazy(() => import("./Pages/AuthPage")); // Lazy load AuthPage
const CreateTeam = lazy(() => import("./Pages/CreateTeam")); // Lazy load CreateTeam
const Dashboard = lazy(() => import("./Pages/Dashboard")); // Lazy load Dashboard
const Workspace = lazy(() => import("./Pages/WorkSpace")); // Lazy load Workspace
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import setupSocket from "./socketio/socketio";
import { setSocket } from "./redux/socketio";
import { io } from "socket.io-client";

function App() {
  const user = useSelector((state) => state.auth.userInfo);
  const socket = useSelector((state) => state.socketio.socket);
  const onlineUser = useSelector((state) => state.socketio.onlineUsers);
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = user ? setupSocket(user._id, dispatch) : null;
    if (socket) {
      dispatch(setSocket(socket));
      return () => {
        socket.close();
      };
    }
  }, [user]);

  // console.log(onlineUser);
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workspace/:fileId" element={<Workspace />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/create/team"
          element={user ? <CreateTeam /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={user ? <UpdateProfilePage /> : <Navigate to="/" />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;

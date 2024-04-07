import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./Pages/HomePage";

const AuthPage = lazy(() => import("./Pages/AuthPage"));
const CreateTeam = lazy(() => import("./Pages/CreateTeam"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Workspace = lazy(() => import("./Pages/WorkSpace"));
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import UpdateProfilePage from "./Pages/UpdateProfilePage";
import setupSocket from "./socketio/socketio";
import { setSocket } from "./redux/socketio";

function App() {
  const user = useSelector((state) => state.auth.userInfo);
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
          element={!user ? <AuthPage /> : <Navigate to="/dashboard" />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;

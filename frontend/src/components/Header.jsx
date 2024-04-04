import { useDispatch, useSelector } from "react-redux";
import useLogout from "./../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { setAuthScreenStatus } from "../redux/auth";

const Header = () => {
  const user = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logout = useLogout();
  return (
    <header className="bg-gray-900">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <a className="block text-teal-600" href="#">
          <span className="sr-only">Home</span>
          <img className="w-[20%]" alt="logo" src="/logo.png" />
        </a>

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <a
                  className="text-white transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  About{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-white transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Careers{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-white transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  History{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-white transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Services{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-white transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Projects{" "}
                </a>
              </li>

              <li>
                <a
                  className="text-white transition hover:text-gray-500/75"
                  href="#"
                >
                  {" "}
                  Blog{" "}
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {!user ? (
              <div className="sm:flex sm:gap-4">
                <button
                  className="hidden rounded-md hover:text-white bg-gray-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-sky-600 sm:block"
                  onClick={() => {
                    dispatch(setAuthScreenStatus("Login"));
                    navigate("/auth");
                  }}
                >
                  Login
                </button>

                <button
                  className="hidden rounded-md hover:text-white bg-gray-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-sky-600 sm:block"
                  onClick={() => {
                    dispatch(setAuthScreenStatus("SignUp"));
                    navigate("/auth");
                  }}
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                className="hidden rounded-md hover:text-white bg-gray-100 px-5 py-2.5 text-sm font-medium text-black transition hover:bg-sky-600 sm:block"
                onClick={logout}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

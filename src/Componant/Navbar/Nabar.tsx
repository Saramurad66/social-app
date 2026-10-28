import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";

export default function Nabar() {
  const [isOpen, setIsOpen] = useState(false);
  const { userLogin, setuserLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("userToken");
    setuserLogin(null);
    navigate("/auth/login");
  }
  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="text-2xl font-black text-blue-950 cursor-pointer">
              Social App
            </div>

            <div className="hidden md:flex items-center gap-8">
              {userLogin ? (
                <>
                  <Link
                    to="/newsfeed"
                    className="text-gray-700 hover:text-blue-950 font-medium transition"
                  >
                    Newsfeed
                  </Link>

                  <Link
                    to="/profile"
                    className="text-gray-700 hover:text-blue-950 font-medium transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-blue-950 font-medium transition cursor-pointer"
                  >
                    LogOut
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/register"
                    className="text-gray-700 hover:text-blue-950 font-medium transition"
                  >
                    Register
                  </Link>
                  <Link
                    to="/auth/Login"
                    className="text-gray-700 hover:text-blue-950 font-medium transition"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-2xl text-blue-950"
              aria-label="Toggle menu"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>

          {isOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col gap-4">
                {userLogin ? (
                  <>
                    <Link
                      to="/newsfeed"
                      className="text-gray-700 hover:text-blue-950 font-medium transition"
                    >
                      Newsfeed
                    </Link>
                    <Link
                      to="/profile"
                      className="text-gray-700 hover:text-blue-950 font-medium transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="text-gray-700 hover:text-blue-950 font-medium transition cursor-pointer"
                    >
                      LogOut
                    </button>{" "}
                  </>
                ) : (
                  <>
                    <Link
                      to="/auth/register"
                      className="text-gray-700 hover:text-blue-950 font-medium transition"
                    >
                      Register
                    </Link>
                    <Link
                      to="/auth/Login"
                      className="text-gray-700 hover:text-blue-950 font-medium transition"
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

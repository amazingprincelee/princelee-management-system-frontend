import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaBell, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/features/authSlice";
import { fetchUserProfile } from "../redux/features/userSlice"
import logo from "../assets/logo.png";

function NavComponent() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  
  

  const [isOpen, setIsOpen] = useState(false); // mobile nav
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // profile dropdown
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(fetchUserProfile());
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {token ? <p>{`Welcome ${user?.fullname}`}</p> : (<>
             <div className="flex items-center flex-shrink-0 space-x-3">
            <img
              src={logo}
              alt="School Logo"
              className="w-auto h-8 sm:h-10"
            />
            <Link to="/" className="text-xl sm:text-2xl font-bold text-[#284ea1]">
              School Manager
            </Link>
          </div>
          </>)}
          

          {/* Desktop Menu */}
          <div className="items-center hidden space-x-6 md:flex">
            {token ? (
              <>
                {/* Notification */}
                <button className="relative px-3 py-2 rounded-md text-gray-700 hover:text-[#284ea1] hover:bg-gray-100 focus:outline-none">
                  <FaBell className="w-5 h-5" />
                  <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-2"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:text-[#284ea1] hover:bg-gray-100 focus:outline-none"
                  >
                    <FaUserCircle className="w-6 h-6" />
                    <span className="hidden sm:block">{user?.user?.fullname || "User"}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white rounded-md shadow-lg">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/features"
                  className="text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Features
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="bg-[#284ea1] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1c3a7e] transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#284ea1] focus:outline-none"
            >
              {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md">
          {token ? (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-red-600 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="block text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/features"
                className="block text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/contact"
                className="block text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="block bg-[#284ea1] text-white px-3 py-2 rounded-md hover:bg-[#1c3a7e] transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavComponent;

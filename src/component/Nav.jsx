import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes, FaBell } from "react-icons/fa";
import { useSelector } from "react-redux"
import logo from "../assets/logo.png";

function NavComponent() {
   const { token } = useSelector((state) => state.auth)
   const { profile } = useSelector((state) => state.user)
  
  const [isOpen, setIsOpen] = useState(false);
  //const primaryColor = "#284ea1";

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          {token ?  <Link to={'/dashboard'}>Welcome, {profile?.user?.fullname}</Link> : 
          ( <>
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

          {/* Navigation Links - Desktop */}
          <div className="hidden space-x-6 md:flex">
            {token? (
  <button
    className="relative px-3 py-2 rounded-md text-gray-700 hover:text-[#284ea1] hover:bg-gray-100 focus:outline-none"
  >
    <FaBell className="w-5 h-5" />
    {/* Notification dot example */}
    <span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-2"></span>
  </button>
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
            </>)
             }
              
            <Link
              to="/login"
              className="bg-[#284ea1] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1c3a7e] transition"
            >
             
             {token ? "Logout" : "Login"} 
            </Link>
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
          <Link
            to="/"
            className="block text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/features"
            className="block text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Features
          </Link>
          <Link
            to="/contact"
            className="block text-gray-700 hover:text-[#284ea1] px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/register"
            className="block bg-[#284ea1] text-white px-3 py-2 rounded-md text-base font-medium hover:bg-[#1c3a7e] transition"
            onClick={() => setIsOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavComponent;
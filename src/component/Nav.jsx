import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../assets/logo.png";

function NavComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const primaryColor = "#284ea1";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <img
              src={logo}
              alt="School Logo"
              className="h-8 sm:h-10 w-auto"
            />
            <Link to="/" className="text-xl sm:text-2xl font-bold text-[#284ea1]">
              School Manager
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-6">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-[#284ea1] focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
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
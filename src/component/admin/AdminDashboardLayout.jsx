import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FaSchool,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUsers,
  FaMoneyBill,
  FaCog,
  FaBook,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

function AdminDashboardLayout() {
  const [schoolName] = useState("Bedetels In'l Academy");
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on mobile when a menu item is clicked
  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:flex md:flex-col`}
      >
        {/* Logo + School Name */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <FaSchool className="text-3xl text-blue-600" />
            <span className="text-lg font-bold text-gray-800 truncate">
              {schoolName}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link
            to="/dashboard"
            onClick={handleMenuClick}
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/dashboard/teachers"
            onClick={handleMenuClick}
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaChalkboardTeacher />
            <span>Teachers</span>
          </Link>

          <Link
            to="/dashboard/students"
            onClick={handleMenuClick}
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaUsers />
            <span>Students</span>
          </Link>

          <Link
            to="/dashboard/billing"
            onClick={handleMenuClick}
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaMoneyBill />
            <span>Billing</span>
          </Link>

          <Link
            to="/dashboard/settings"
            onClick={handleMenuClick}
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaCog />
            <span>Settings</span>
          </Link>

          <Link
            to="/dashboard/exams"
            onClick={handleMenuClick}
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaBook />
            <span>Exams</span>
          </Link>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex flex-col flex-1">
        {/* Top bar (only visible on mobile) */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md md:hidden">
          <button
            className="text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FaChevronLeft className="w-6 h-6" />
            ) : (
              <FaChevronRight className="w-6 h-6" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            Dashboard
          </h2>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-2 overflow-y-auto sm:p-4 md:p-6">
          <div className="p-4 bg-white shadow rounded-xl sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardLayout;

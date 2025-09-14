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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 md:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:flex md:flex-col`}
      >
        {/* Logo + School Name */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <FaSchool className="text-3xl text-blue-600" />
            <span className="text-lg font-bold text-gray-800">
              {schoolName}
            </span>
          </div>

          {/* Close button for mobile */}
          <button
            className="text-gray-600 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/dashboard/teachers"
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaChalkboardTeacher />
            <span>Teachers</span>
          </Link>

          <Link
            to="/dashboard/students"
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaUsers />
            <span>Students</span>
          </Link>

          <Link
            to="/dashboard/billing"
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaMoneyBill />
            <span>Billing</span>
          </Link>

          <Link
            to="/dashboard/settings"
            className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
          >
            <FaCog />
            <span>Settings</span>
          </Link>

          <Link
            to="/dashboard/exams"
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
          <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="p-6 bg-white shadow rounded-2xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardLayout;

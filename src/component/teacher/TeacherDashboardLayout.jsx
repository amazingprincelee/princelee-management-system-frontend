import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  FaHome, 
  FaClipboardList, 
  FaGraduationCap, 
  FaChartLine, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaBookOpen,
  FaUsers,
  FaCalendarAlt
} from "react-icons/fa";
import { logout } from "../../redux/features/authSlice";
import { fetchSchoolInfo } from "../../redux/features/schoolSlice";

const TeacherDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { school } = useSelector((state) => state.school);

  useEffect(() => {
    dispatch(fetchSchoolInfo());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const menuItems = [
    { path: "/teacher-dashboard", icon: FaHome, label: "Dashboard", exact: true },
    { path: "/teacher-dashboard/my-classes", icon: FaUsers, label: "My Classes" },
    { path: "/teacher-dashboard/exams", icon: FaClipboardList, label: "Exams & CA" },
    { path: "/teacher-dashboard/results", icon: FaGraduationCap, label: "Results" },
    { path: "/teacher-dashboard/generate-results", icon: FaChartLine, label: "Generate Results" },
    { path: "/teacher-dashboard/subjects", icon: FaBookOpen, label: "My Subjects" },
    { path: "/teacher-dashboard/reports", icon: FaChartLine, label: "Reports" },
    { path: "/teacher-dashboard/calendar", icon: FaCalendarAlt, label: "Calendar" },
    { path: "/teacher-dashboard/profile", icon: FaUser, label: "Profile" },
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600">
          <div className="flex items-center space-x-3">
            {school?.logo && (
              <img src={school.logo} alt="School Logo" className="w-8 h-8 rounded-full" />
            )}
            <span className="text-white font-semibold text-lg">
              {school?.name || "Teacher Portal"}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FaUser className="text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.fullname}</p>
              <p className="text-sm text-gray-500">Teacher</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="mr-3" size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <FaSignOutAlt className="mr-3" size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <FaBars size={20} />
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Teacher Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.fullname}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboardLayout;
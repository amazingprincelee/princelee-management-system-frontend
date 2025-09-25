import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSchoolInfo } from '../../redux/features/schoolSlice';
import { logout } from '../../redux/features/authSlice';
import {
  FaSchool,
  FaTachometerAlt,
  FaChalkboardTeacher,
  FaUsers,
  FaMoneyBill,
  FaCog,
  FaBook,
  FaCalendarAlt,
  FaChevronRight,
  FaChevronLeft,
  FaEye,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminDashboardLayout() {
  const [schoolName, setSchoolName] = useState("Bedetels Int'l Academy");
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const {school, loading, error} = useSelector((state)=> state.school)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close sidebar on mobile when a menu item is clicked
  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  // Close sidebar if clicking outside
  useEffect(() => {
    dispatch(fetchSchoolInfo())
    setSchoolName(school?.schoolName)
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, school?.schoolName]);

  // whenever school updates, update the local state
useEffect(() => {
  if (school?.schoolName) {
    setSchoolName(school.schoolName);
  }else if(error){
    console.log(error);
    
  }
}, [error, school]);

  
  

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:flex md:flex-col border-r border-gray-200`}
      >
   {/* Logo + School Name */}
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex items-center space-x-3">
    {loading ? (
      // Skeleton loader
      <>
        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-300 rounded animate-pulse"></div>
      </>
    ) : (
      <>
        {school?.schoolLogo ? (
          <img
            src={school.schoolLogo}
            alt="School Logo"
            className="object-contain w-10 h-10 rounded-full"
          />
        ) : (
          <FaSchool className="w-10 h-10 text-primary-600" />
        )}
        <span
          className="text-lg font-bold text-gray-800 truncate max-w-[150px] md:max-w-[200px]"
          title={schoolName}
        >
          {schoolName || "School Name"}
        </span>
      </>
    )}
  </div>
</div>



        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
            { to: "/dashboard/teachers", icon: <FaChalkboardTeacher />, label: "Teachers" },
            { to: "/dashboard/students", icon: <FaUsers />, label: "Students" },
            { to: "/dashboard/parents", icon: <FaUsers />, label: "Parents" },
            { to: "/dashboard/billing", icon: <FaMoneyBill />, label: "Billing" },
            { to: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
            { to: "/dashboard/exams", icon: <FaBook />, label: "Exams" },
            { to: "/dashboard/calendar", icon: <FaCalendarAlt />, label: "Calendar" },
            { to: "/dashboard/profile", icon: <FaUser />, label: "Profile" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={handleMenuClick}
              className="flex items-center px-4 py-3 space-x-3 text-gray-700 transition-all duration-200 rounded-lg hover:bg-blue-600 hover:text-primary-700 hover:shadow-sm group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 space-x-3 text-red-600 transition-all duration-200 rounded-lg hover:bg-red-50 hover:text-red-700 hover:shadow-sm group mt-4"
          >
            <span className="text-lg group-hover:scale-110 transition-transform duration-200">
              <FaSignOutAlt />
            </span>
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200 md:hidden">
          <button
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <FaChevronLeft className="w-5 h-5" />
            ) : (
              <FaChevronRight className="w-5 h-5" />
            )}
          </button>
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            Dashboard
          </h2>
          <div className="w-9 h-9"></div> {/* Spacer for centering */}
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="p-6 bg-white shadow-sm rounded-xl border border-gray-200 min-h-[calc(100vh-8rem)]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboardLayout;

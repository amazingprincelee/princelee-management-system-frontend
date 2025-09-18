import { useState, useEffect, useRef } from "react";
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSchoolInfo } from '../../redux/features/schoolSlice';
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
  const [schoolName, setSchoolName] = useState("Bedetels In'l Academy");
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const {school, loading, error} = useSelector((state)=> state.school)
  const dispatch = useDispatch()

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:relative md:flex md:flex-col`}
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
          <FaSchool className="w-10 h-10 text-blue-600" />
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
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { to: "/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
            { to: "/dashboard/teachers", icon: <FaChalkboardTeacher />, label: "Teachers" },
            { to: "/dashboard/students", icon: <FaUsers />, label: "Students" },
            { to: "/dashboard/parents", icon: <FaUsers />, label: "Parents" },
            { to: "/dashboard/billing", icon: <FaMoneyBill />, label: "Billing" },
            { to: "/dashboard/settings", icon: <FaCog />, label: "Settings" },
            { to: "/dashboard/exams", icon: <FaBook />, label: "Exams" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={handleMenuClick}
              className="flex items-center px-3 py-2 space-x-3 text-gray-700 transition rounded-lg hover:bg-blue-100 hover:text-blue-600"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
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

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FaUsers, 
  FaClipboardList, 
  FaGraduationCap, 
  FaBookOpen,
  FaPlus,
  FaEye,
  FaChartLine
} from "react-icons/fa";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const TeacherDashboard = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingResults: 0,
    completedExams: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}/teacher/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setStats(response.data.stats);
      setRecentActivities(response.data.recentActivities || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "My Classes",
      value: stats.totalClasses,
      icon: FaUsers,
      color: "bg-blue-500",
      link: "/teacher-dashboard/my-classes"
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: FaGraduationCap,
      color: "bg-green-500",
      link: "/teacher-dashboard/my-classes"
    },
    {
      title: "Pending Results",
      value: stats.pendingResults,
      icon: FaClipboardList,
      color: "bg-yellow-500",
      link: "/teacher-dashboard/results"
    },
    {
      title: "Completed Exams",
      value: stats.completedExams,
      icon: FaBookOpen,
      color: "bg-purple-500",
      link: "/teacher-dashboard/exams"
    }
  ];

  const quickActions = [
    {
      title: "Create New Exam",
      description: "Set up a new exam or continuous assessment",
      icon: FaPlus,
      color: "bg-blue-600",
      link: "/teacher-dashboard/exams/create"
    },
    {
      title: "Enter Results",
      description: "Input exam scores and CA marks",
      icon: FaClipboardList,
      color: "bg-green-600",
      link: "/teacher-dashboard/results/enter"
    },
    {
      title: "View My Classes",
      description: "See all classes you're teaching",
      icon: FaEye,
      color: "bg-purple-600",
      link: "/teacher-dashboard/my-classes"
    },
    {
      title: "Generate Reports",
      description: "Create performance reports for your subjects",
      icon: FaChartLine,
      color: "bg-orange-600",
      link: "/teacher-dashboard/reports"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullname}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your teaching activities and quick actions to get started.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                <div className={`${action.color} p-2 rounded-lg w-fit mb-3`}>
                  <Icon className="text-white" size={20} />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-600">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            No recent activities. Start by creating an exam or entering results.
          </p>
        )}
      </div>

      {/* My Subjects Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Subjects</h2>
        {user?.subjects && user.subjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.subjects.map((subject, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900">{subject}</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Click to view classes and manage exams
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            No subjects assigned. Contact the administrator to assign subjects.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
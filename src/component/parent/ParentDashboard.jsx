import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { 
  FaChild, 
  FaGraduationCap, 
  FaMoneyBillWave, 
  FaBell,
  FaEye,
  FaDownload,
  FaCalendarAlt,
  FaExclamationTriangle
} from "react-icons/fa";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Fetch children data
      const childrenResponse = await axios.get(`${baseUrl}/parent/children`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch notifications
      const notificationsResponse = await axios.get(`${baseUrl}/parent/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch payment summary
      const paymentsResponse = await axios.get(`${baseUrl}/parent/payment-summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChildren(childrenResponse.data.children || []);
      setNotifications(notificationsResponse.data.notifications || []);
      setPaymentSummary({
        totalPaid: paymentsResponse.data.summary?.totalPayments || 0,
        outstanding: paymentsResponse.data.summary?.totalOutstanding || 0,
        currentTerm: paymentsResponse.data.summary?.currentTermFees || 0,
        ...paymentsResponse.data.summary
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default values for demo purposes
      setChildren([]);
      setNotifications([]);
      setPaymentSummary({
        totalPaid: 0,
        outstanding: 0,
        currentTerm: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    // Ensure amount is a number and handle undefined/null/object cases
    const numAmount = typeof amount === 'number' ? amount : 0;
    return `₦${numAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  };

  const quickActions = [
    {
      title: "View All Children",
      description: "See detailed information about all your children",
      icon: FaChild,
      color: "bg-primary",
      link: "/parent-dashboard/children"
    },
    {
      title: "Check Results",
      description: "View latest exam results and academic progress",
      icon: FaGraduationCap,
      color: "bg-green-600",
      link: "/parent-dashboard/results"
    },
    {
      title: "Payment History",
      description: "View payment records and outstanding fees",
      icon: FaMoneyBillWave,
      color: "bg-purple-600",
      link: "/parent-dashboard/payments"
    },
    {
      title: "Notifications",
      description: "Read important updates from the school",
      icon: FaBell,
      color: "bg-orange-600",
      link: "/parent-dashboard/notifications"
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
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
          Stay updated with your children's academic progress and school activities.
        </p>
      </div>

      {/* Children Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Children</h2>
          <Link
            to="/parent-dashboard/children"
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {children.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {children.slice(0, 3).map((child, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  {child.studentPhoto ? (
                    <img 
                      src={child.studentPhoto} 
                      alt={`${child.firstName} ${child.surName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <FaChild className="text-primary-600" size={20} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {child.firstName} {child.surName}
                    </h3>
                    <p className="text-sm text-gray-600">{child.classLevel}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admission No:</span>
                    <span className="font-medium">{child.admissionNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session:</span>
                    <span className="font-medium">{child.currentSession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Term:</span>
                    <span className="font-medium capitalize">{child.currentTerm}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Link
                    to={`/parent-dashboard/children/${child._id}`}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FaChild className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No children registered yet.</p>
            <p className="text-sm text-gray-500 mt-1">
              Contact the school administration to register your children.
            </p>
          </div>
        )}
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
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-sm transition-all duration-200"
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

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(paymentSummary.totalPaid)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FaMoneyBillWave className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(paymentSummary.outstanding)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <FaExclamationTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Term</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(paymentSummary.currentTerm)}
              </p>
            </div>
            <div className="bg-primary p-3 rounded-lg">
              <FaCalendarAlt className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Notifications</h2>
          <Link
            to="/parent-dashboard/notifications"
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification, index) => (
              <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                </div>
                <div className="ml-4 text-right">
                  <span className="text-xs text-gray-500">
                    {notification.createdAt ? new Date(notification.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-1 ml-auto"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            No notifications yet. You'll receive updates about your children's progress here.
          </p>
        )}
      </div>
    </div>
  );
};

export default ParentDashboard;
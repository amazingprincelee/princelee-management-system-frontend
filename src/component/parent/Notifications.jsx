import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FaBell, 
  FaEnvelope, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaTrash,
  FaCog,
  FaEye,
  FaEyeSlash,
  FaFilter,
  FaSpinner
} from 'react-icons/fa';

const Notifications = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState({
    results: true,
    events: true,
    announcements: true,
    fees: true,
    attendance: false
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Simulate API call
      const mockNotifications = [
        {
          id: '1',
          type: 'result',
          title: 'New Result Available',
          message: 'First Term results for Adebayo Johnson (JSS 2A) are now available.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          read: false,
          priority: 'high',
          childName: 'Adebayo Johnson',
          actionUrl: '/parent-dashboard/results'
        },
        {
          id: '2',
          type: 'event',
          title: 'Parent-Teacher Meeting',
          message: 'Scheduled for December 15th, 2024 at 10:00 AM. Please confirm your attendance.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          read: false,
          priority: 'medium',
          actionUrl: '/parent-dashboard/events'
        },
        {
          id: '3',
          type: 'fee',
          title: 'Fee Payment Reminder',
          message: 'Second Term school fees for Fatima Ibrahim are due in 5 days.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          read: true,
          priority: 'high',
          childName: 'Fatima Ibrahim',
          actionUrl: '/parent-dashboard/payments'
        },
        {
          id: '4',
          type: 'announcement',
          title: 'School Holiday Notice',
          message: 'School will be closed from December 20th to January 8th for Christmas holidays.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          read: true,
          priority: 'low',
          actionUrl: '/parent-dashboard/announcements'
        },
        {
          id: '5',
          type: 'attendance',
          title: 'Attendance Alert',
          message: 'Adebayo Johnson was absent from school today (December 10th, 2024).',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          read: true,
          priority: 'medium',
          childName: 'Adebayo Johnson',
          actionUrl: '/parent-dashboard/attendance'
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result':
        return <FaGraduationCap className="text-blue-500" />;
      case 'event':
        return <FaCalendarAlt className="text-green-500" />;
      case 'fee':
        return <FaExclamationTriangle className="text-orange-500" />;
      case 'announcement':
        return <FaInfoCircle className="text-purple-500" />;
      case 'attendance':
        return <FaCheckCircle className="text-red-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const markAsRead = async (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = async (notificationId) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const updateEmailSettings = async (setting, value) => {
    setEmailNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
    // Simulate API call to update settings
    console.log('Email notification settings updated:', { [setting]: value });
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <FaBell className="mr-3 text-blue-500" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600">Stay updated with your child's school activities</p>
          </div>
          
          <div className="flex gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaCheckCircle />
                Mark All Read
              </button>
            )}
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaCog />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings Panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaEnvelope className="mr-2 text-blue-500" />
            Email Notification Preferences
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(emailNotifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="capitalize font-medium">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button
                  onClick={() => updateEmailSettings(key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaFilter />
            All ({notifications.length})
          </button>
          
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaEye />
            Unread ({unreadCount})
          </button>
          
          {['result', 'event', 'fee', 'announcement', 'attendance'].map(type => {
            const count = notifications.filter(n => n.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === type ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaBell className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'You have no notifications at the moment.' : `No ${filter} notifications found.`}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-md border-l-4 ${getPriorityColor(notification.priority)} ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatTimestamp(notification.timestamp)}</span>
                        {notification.childName && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {notification.childName}
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {notification.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-500 hover:text-blue-700 p-2"
                        title="Mark as read"
                      >
                        <FaEyeSlash />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Delete notification"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
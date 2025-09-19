import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FaBell, 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaTrash, 
  FaFilter,
  FaSearch,
  FaGraduationCap,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaCog
} from 'react-icons/fa';
import axios from 'axios';

const ParentNotifications = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    resultNotifications: true,
    paymentNotifications: true,
    eventNotifications: true
  });

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, filter, searchTerm]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await axios.get('/api/notifications/preferences', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    if (filter !== 'all') {
      filtered = filtered.filter(notification => {
        if (filter === 'unread') return !notification.isRead;
        if (filter === 'read') return notification.isRead;
        return notification.type === filter;
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/api/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setNotifications(prev =>
        prev.filter(notification => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const updatePreferences = async (newPreferences) => {
    try {
      await axios.put('/api/notifications/preferences', newPreferences, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'result':
        return <FaGraduationCap className="text-blue-500" />;
      case 'payment':
        return <FaMoneyBillWave className="text-green-500" />;
      case 'event':
        return <FaCalendarAlt className="text-purple-500" />;
      case 'alert':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-400" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-300 bg-white';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your child's academic progress and school activities</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Notifications</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="result">Results</option>
              <option value="payment">Payments</option>
              <option value="event">Events</option>
              <option value="alert">Alerts</option>
            </select>
          </div>

          {/* Preferences Button */}
          <button
            onClick={() => document.getElementById('preferences-modal').showModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaCog />
            <span>Preferences</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <FaBell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`border-l-4 rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg ${
                getPriorityColor(notification.priority)
              } ${!notification.isRead ? 'ring-2 ring-green-200' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`text-lg font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{notification.message}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatDate(notification.createdAt)}</span>
                      <span className="capitalize">{notification.type}</span>
                      {notification.priority && (
                        <span className={`capitalize font-medium ${
                          notification.priority === 'high' ? 'text-red-600' :
                          notification.priority === 'medium' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {notification.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Mark as read"
                    >
                      <FaEnvelopeOpen />
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete notification"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preferences Modal */}
      <dialog id="preferences-modal" className="modal">
        <div className="modal-box max-w-md">
          <h3 className="font-bold text-lg mb-4">Notification Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <FaEnvelope className="text-gray-500" />
                <span>Email Notifications</span>
              </label>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  emailNotifications: e.target.checked
                }))}
                className="toggle toggle-success"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <FaGraduationCap className="text-gray-500" />
                <span>Result Notifications</span>
              </label>
              <input
                type="checkbox"
                checked={preferences.resultNotifications}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  resultNotifications: e.target.checked
                }))}
                className="toggle toggle-success"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <FaMoneyBillWave className="text-gray-500" />
                <span>Payment Notifications</span>
              </label>
              <input
                type="checkbox"
                checked={preferences.paymentNotifications}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  paymentNotifications: e.target.checked
                }))}
                className="toggle toggle-success"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <FaCalendarAlt className="text-gray-500" />
                <span>Event Notifications</span>
              </label>
              <input
                type="checkbox"
                checked={preferences.eventNotifications}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  eventNotifications: e.target.checked
                }))}
                className="toggle toggle-success"
              />
            </div>
          </div>

          <div className="modal-action">
            <button
              onClick={() => {
                updatePreferences(preferences);
                document.getElementById('preferences-modal').close();
              }}
              className="btn btn-success"
            >
              Save Preferences
            </button>
            <button
              onClick={() => document.getElementById('preferences-modal').close()}
              className="btn"
            >
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default ParentNotifications;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaBook,
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaDownload,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';

const TeacherExams = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('exams');
  const [exams, setExams] = useState([]);
  const [cas, setCas] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    type: 'exam', // exam or ca
    totalMarks: 100,
    duration: 60,
    date: '',
    time: '',
    instructions: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examsRes, casRes, classesRes, subjectsRes] = await Promise.all([
        axios.get('/api/exams/teacher', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/cas/teacher', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/classes/teacher', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/subjects/teacher', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setExams(Array.isArray(examsRes.data) ? examsRes.data : []);
      setCas(Array.isArray(casRes.data) ? casRes.data : []);
      setClasses(Array.isArray(classesRes.data) ? classesRes.data : []);
      setSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set mock data as fallback
      setExams([
        {
          _id: '1',
          title: 'Mathematics Mid-Term Exam',
          subject: { name: 'Mathematics' },
          class: { name: 'Grade 10A' },
          type: 'exam',
          totalMarks: 100,
          duration: 120,
          date: '2024-02-15',
          time: '09:00',
          status: 'scheduled',
          instructions: 'Bring calculator and writing materials'
        },
        {
          _id: '2',
          title: 'Physics Final Exam',
          subject: { name: 'Physics' },
          class: { name: 'Grade 11B' },
          type: 'exam',
          totalMarks: 100,
          duration: 180,
          date: '2024-02-20',
          time: '10:00',
          status: 'draft',
          instructions: 'Formula sheet will be provided'
        }
      ]);
      
      setCas([
        {
          _id: '3',
          title: 'Chemistry Lab Assessment',
          subject: { name: 'Chemistry' },
          class: { name: 'Grade 12A' },
          type: 'ca',
          totalMarks: 50,
          duration: 90,
          date: '2024-02-10',
          time: '14:00',
          status: 'completed',
          instructions: 'Lab safety rules apply'
        }
      ]);
      
      setClasses([
        { _id: '1', name: 'Grade 10A' },
        { _id: '2', name: 'Grade 11B' },
        { _id: '3', name: 'Grade 12A' }
      ]);
      
      setSubjects([
        { _id: '1', name: 'Mathematics' },
        { _id: '2', name: 'Physics' },
        { _id: '3', name: 'Chemistry' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = editingItem 
        ? `/api/${formData.type}s/${editingItem._id}`
        : `/api/${formData.type}s`;
      
      const method = editingItem ? 'put' : 'post';
      
      await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      fetchData();
      resetForm();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`/api/${type}s/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subject: item.subject._id,
      class: item.class._id,
      type: item.type || 'exam',
      totalMarks: item.totalMarks,
      duration: item.duration,
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
      time: item.time || '',
      instructions: item.instructions || '',
      status: item.status
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subject: '',
      class: '',
      type: 'exam',
      totalMarks: 100,
      duration: 60,
      date: '',
      time: '',
      instructions: '',
      status: 'draft'
    });
    setEditingItem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-primary text-primary-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <FaCheckCircle className="text-green-500" />;
      case 'completed':
        return <FaCheckCircle className="text-primary-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaExclamationTriangle className="text-yellow-500" />;
    }
  };

  const filteredItems = (items) => {
    // Ensure items is always an array
    if (!Array.isArray(items)) {
      return [];
    }
    
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.class?.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exams & Continuous Assessment</h1>
        <p className="text-gray-600">Create and manage exams and continuous assessments for your classes</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'exams', label: 'Exams', icon: FaClipboardList, count: exams.length },
              { id: 'cas', label: 'Continuous Assessment', icon: FaBook, count: cas.length }
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search exams and assessments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => {
              resetForm();
              setFormData(prev => ({ ...prev, type: activeTab.slice(0, -1) }));
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaPlus />
            <span>Create {activeTab === 'exams' ? 'Exam' : 'CA'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6">
        {filteredItems(activeTab === 'exams' ? exams : cas).length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <FaClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === 'exams' ? 'exams' : 'assessments'} found
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first {activeTab === 'exams' ? 'exam' : 'assessment'} to get started
            </p>
            <button
              onClick={() => {
                resetForm();
                setFormData(prev => ({ ...prev, type: activeTab.slice(0, -1) }));
                setShowCreateModal(true);
              }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaPlus />
              <span>Create {activeTab === 'exams' ? 'Exam' : 'CA'}</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems(activeTab === 'exams' ? exams : cas).map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaBook className="text-primary-500" />
                        <span>{item.subject?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaUsers className="text-green-500" />
                        <span>{item.class?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaCalendarAlt className="text-purple-500" />
                        <span>{item.date ? new Date(item.date).toLocaleDateString() : 'Not set'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <FaClock className="text-orange-500" />
                        <span>{item.duration} mins</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Total Marks: <strong>{item.totalMarks}</strong></span>
                      {item.time && <span>Time: <strong>{item.time}</strong></span>}
                    </div>

                    {item.instructions && (
                      <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {item.instructions}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    
                    <button
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(item._id, activeTab.slice(0, -1))}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingItem ? 'Edit' : 'Create'} {formData.type === 'exam' ? 'Exam' : 'Continuous Assessment'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                      placeholder="Enter title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    >
                      <option value="">Select Subject</option>
                      {subjects.map(subject => (
                        <option key={subject._id} value={subject._id}>{subject.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Class *
                    </label>
                    <select
                      required
                      value={formData.class}
                      onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    >
                      <option value="">Select Class</option>
                      {classes.map(cls => (
                        <option key={cls._id} value={cls._id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Marks *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData(prev => ({ ...prev, totalMarks: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    rows="4"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
                    placeholder="Enter instructions for students..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherExams;



import React, { useState, useEffect } from 'react';
import { 
  FaChartBar, 
  FaUsers, 
  FaClipboardCheck, 
  FaExclamationTriangle,
  FaTrophy,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';

function ExamAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [teacherStatus, setTeacherStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({
    term: '',
    session: ''
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [analyticsRes, teacherStatusRes] = await Promise.all([
        axios.get(`${baseUrl}/exams/analytics`, {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }),
        axios.get(`${baseUrl}/exams/teacher-status`, {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        })
      ]);

      setAnalytics(analyticsRes.data);
      setTeacherStatus(teacherStatusRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exam Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor teacher result submissions and student performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-4">
          <FaFilter className="text-gray-500" />
          <select
            name="term"
            value={filters.term}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          >
            <option value="">All Terms</option>
            <option value="first">First Term</option>
            <option value="second">Second Term</option>
            <option value="third">Third Term</option>
          </select>
          <input
            type="text"
            name="session"
            value={filters.session}
            onChange={handleFilterChange}
            placeholder="Session (e.g., 2024/2025)"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartBar },
              { id: 'top-students', label: 'Top Students', icon: FaTrophy },
              { id: 'teacher-status', label: 'Teacher Status', icon: FaUsers },
              { id: 'subjects', label: 'Subject Performance', icon: FaClipboardCheck }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <span className="ml-3 text-gray-600">Loading exam analytics...</span>
            </div>
          )}

          {/* No Data State */}
          {!loading && (!analytics || !analytics.overview) && (
            <div className="text-center py-12">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Available</h3>
              <p className="text-gray-500">Unable to load exam analytics. Please check if the backend server is running.</p>
            </div>
          )}

          {/* Overview Tab */}
          {!loading && activeTab === 'overview' && analytics && analytics.overview && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-primary p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaUsers className="text-primary-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm font-medium text-primary-600">Total Teachers</p>
                      <p className="text-2xl font-bold text-primary-900">{analytics.overview.totalTeachers}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaClipboardCheck className="text-green-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm font-medium text-green-600">Submitted Results</p>
                      <p className="text-2xl font-bold text-green-900">{analytics.overview.teachersWithResults}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-red-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm font-medium text-red-600">Pending Results</p>
                      <p className="text-2xl font-bold text-red-900">{analytics.overview.teachersWithoutResults}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <div className="flex items-center">
                    <FaChartBar className="text-purple-600 text-2xl mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-600">Submission Rate</p>
                      <p className="text-2xl font-bold text-purple-900">{analytics.overview.submissionRate}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Submissions */}
              <div className="bg-white border rounded-lg">
                <div className="px-6 py-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Result Submissions</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {analytics.recentSubmissions.map((submission, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {submission.teacherName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.studentName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {submission.subject}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              submission.scoreType === 'FINAL' ? 'bg-green-100 text-green-800' :
                              submission.scoreType === 'EXAM' ? 'bg-primary text-primary-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {submission.scoreType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Top Students Tab */}
          {!loading && activeTab === 'top-students' && analytics && analytics.topStudents && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Students</h3>
                <FaTrophy className="text-yellow-500 text-2xl" />
              </div>
              
              <div className="grid gap-4">
                {analytics.topStudents.map((student, index) => (
                  <div key={student._id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-600' :
                        'bg-primary'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{student.studentName}</h4>
                        <p className="text-sm text-gray-500">Admission: {student.admissionNumber}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">{student.averageScore}%</p>
                      <p className="text-sm text-gray-500">{student.totalSubjects} subjects</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Status Tab */}
          {activeTab === 'teacher-status' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Teacher Result Submission Status</h3>
                <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  <FaDownload />
                  Export
                </button>
              </div>

              <div className="grid gap-4">
                {teacherStatus.map((teacher) => (
                  <div key={teacher._id} className={`border rounded-lg p-4 ${
                    teacher.hasSubmitted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            teacher.hasSubmitted ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <h4 className="font-semibold text-gray-900">{teacher.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            teacher.status === 'full time' ? 'bg-primary text-primary-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {teacher.status}
                          </span>
                        </div>
                        
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaEnvelope />
                            {teacher.email}
                          </div>
                          {teacher.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaPhone />
                              {teacher.phone}
                            </div>
                          )}
                          {teacher.lastSubmission && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCalendarAlt />
                              Last: {new Date(teacher.lastSubmission).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{teacher.resultCount}</p>
                        <p className="text-sm text-gray-500">results submitted</p>
                        <p className="text-sm text-gray-500">{teacher.subjectCount} subjects</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subjects Tab */}
          {!loading && activeTab === 'subjects' && analytics && analytics.subjectPerformance && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Subject Performance Statistics</h3>
              
              <div className="grid gap-4">
                {analytics.subjectStats.map((subject, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{subject.subject}</h4>
                      <span className="text-2xl font-bold text-primary-600">{subject.averageScore}%</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Total Students</p>
                        <p className="font-semibold">{subject.totalStudents}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pass Count</p>
                        <p className="font-semibold text-green-600">{subject.passCount}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pass Rate</p>
                        <p className="font-semibold text-primary-600">{subject.passRate}%</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${subject.passRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamAnalytics;
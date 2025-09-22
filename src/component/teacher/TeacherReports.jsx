import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FaFileAlt, 
  FaDownload, 
  FaEye, 
  FaCalendarAlt, 
  FaChartBar, 
  FaUsers, 
  FaGraduationCap,
  FaFilter,
  FaSearch,
  FaPrint
} from 'react-icons/fa';

const TeacherReports = () => {
  const { user } = useSelector((state) => state.user);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Mock data for demonstration
  const mockReports = [
    {
      id: 1,
      title: 'Grade 10A Mathematics - Term 1 Performance Report',
      type: 'performance',
      subject: 'Mathematics',
      class: 'Grade 10A',
      dateGenerated: '2024-01-15',
      period: 'Term 1 2024',
      status: 'completed',
      fileSize: '2.3 MB',
      description: 'Comprehensive performance analysis for Term 1'
    },
    {
      id: 2,
      title: 'Physics Class Attendance Report - December 2023',
      type: 'attendance',
      subject: 'Physics',
      class: 'Grade 11B',
      dateGenerated: '2024-01-10',
      period: 'December 2023',
      status: 'completed',
      fileSize: '1.8 MB',
      description: 'Monthly attendance tracking and analysis'
    },
    {
      id: 3,
      title: 'Chemistry Assessment Summary - Q4 2023',
      type: 'assessment',
      subject: 'Chemistry',
      class: 'Grade 12A',
      dateGenerated: '2024-01-08',
      period: 'Q4 2023',
      status: 'completed',
      fileSize: '3.1 MB',
      description: 'Quarterly assessment results and insights'
    },
    {
      id: 4,
      title: 'Biology Progress Tracking Report',
      type: 'progress',
      subject: 'Biology',
      class: 'Grade 9C',
      dateGenerated: '2024-01-05',
      period: 'January 2024',
      status: 'processing',
      fileSize: 'Generating...',
      description: 'Student progress tracking and recommendations'
    }
  ];

  const reportTypes = [
    { value: 'all', label: 'All Reports' },
    { value: 'performance', label: 'Performance Reports' },
    { value: 'attendance', label: 'Attendance Reports' },
    { value: 'assessment', label: 'Assessment Reports' },
    { value: 'progress', label: 'Progress Reports' },
    { value: 'behavioral', label: 'Behavioral Reports' }
  ];

  const subjects = ['all', 'Mathematics', 'Physics', 'Chemistry', 'Biology'];
  const classes = ['all', 'Grade 9C', 'Grade 10A', 'Grade 11B', 'Grade 12A'];

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await axios.get(`${baseUrl}/teacher/reports`, {
      //   headers: { Authorization: `Bearer ${user.token}` }
      // });
      // setReports(response.data.reports);
      
      // Using mock data for now
      setTimeout(() => {
        setReports(mockReports);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportData) => {
    try {
      setGeneratingReport(true);
      // TODO: Replace with actual API call
      // const response = await axios.post(`${baseUrl}/teacher/reports/generate`, reportData, {
      //   headers: { Authorization: `Bearer ${user.token}` }
      // });
      
      // Simulate report generation
      setTimeout(() => {
        const newReport = {
          id: Date.now(),
          title: `${reportData.subject} - ${reportData.type} Report`,
          type: reportData.type,
          subject: reportData.subject,
          class: reportData.class,
          dateGenerated: new Date().toISOString().split('T')[0],
          period: reportData.period,
          status: 'processing',
          fileSize: 'Generating...',
          description: `Generated ${reportData.type} report for ${reportData.subject}`
        };
        setReports([newReport, ...reports]);
        setGeneratingReport(false);
        setShowGenerateModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating report:', error);
      setGeneratingReport(false);
    }
  };

  const handleDownload = (reportId) => {
    // TODO: Implement actual download functionality
    console.log('Downloading report:', reportId);
    alert('Download functionality will be implemented with backend integration');
  };

  const handleView = (reportId) => {
    // TODO: Implement report viewing functionality
    console.log('Viewing report:', reportId);
    alert('Report viewing functionality will be implemented with backend integration');
  };

  const handlePrint = (reportId) => {
    // TODO: Implement print functionality
    console.log('Printing report:', reportId);
    alert('Print functionality will be implemented with backend integration');
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType;
    const matchesSubject = selectedSubject === 'all' || report.subject === selectedSubject;
    const matchesClass = selectedClass === 'all' || report.class === selectedClass;
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSubject && matchesClass && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'performance': return <FaChartBar className="text-blue-600" />;
      case 'attendance': return <FaUsers className="text-green-600" />;
      case 'assessment': return <FaGraduationCap className="text-purple-600" />;
      case 'progress': return <FaCalendarAlt className="text-orange-600" />;
      default: return <FaFileAlt className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and manage your teaching reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FaFileAlt size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FaChartBar size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => new Date(r.dateGenerated).getMonth() === new Date().getMonth()).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FaDownload size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <FaCalendarAlt size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reports.filter(r => r.status === 'processing').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
              
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>
                    {cls === 'all' ? 'All Classes' : cls}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={() => setShowGenerateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaFileAlt size={16} />
              Generate Report
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredReports.map(report => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {getTypeIcon(report.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt size={12} />
                          {report.dateGenerated}
                        </span>
                        <span>{report.period}</span>
                        <span>{report.fileSize}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleView(report.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Report"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      onClick={() => handlePrint(report.id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Print Report"
                    >
                      <FaPrint size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(report.id)}
                      disabled={report.status === 'processing'}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download Report"
                    >
                      <FaDownload size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Generate New Report</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleGenerateReport({
                type: formData.get('type'),
                subject: formData.get('subject'),
                class: formData.get('class'),
                period: formData.get('period')
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select
                  name="type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Report Type</option>
                  {reportTypes.slice(1).map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  name="subject"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  {subjects.slice(1).map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  name="class"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Class</option>
                  {classes.slice(1).map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <input
                  type="text"
                  name="period"
                  placeholder="e.g., Term 1 2024, January 2024"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generatingReport}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingReport ? 'Generating...' : 'Generate Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherReports;
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../utils/baseUrl';
import { 
  FaChild, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowLeft,
  FaSpinner,
  FaIdCard,
  FaBirthdayCake,
  FaVenusMars,
  FaHome,
  FaChartLine
} from 'react-icons/fa';

const ChildDetails = () => {
  const [child, setChild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { childId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChildDetails();
  }, [childId]);

  const fetchChildDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/parent/children`, {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`
        }
      });
      
      // Find the specific child from the children array
      const childData = response.data.children?.find(c => c._id === childId);
      
      if (childData) {
        // Map the API response to match the component's expected structure
        const mappedChild = {
          _id: childData._id,
          fullname: `${childData.firstName} ${childData.middleName ? childData.middleName + ' ' : ''}${childData.surName}`,
          firstName: childData.firstName,
          surName: childData.surName,
          middleName: childData.middleName,
          email: childData.parentInfo?.email || 'N/A',
          phone: childData.parentInfo?.phone || 'N/A',
          address: childData.parentInfo?.address || 'N/A',
          dateOfBirth: childData.dateOfBirth,
          gender: childData.gender,
          studentId: childData.studentId,
          class: childData.class,
          status: childData.status || 'Active',
          admissionDate: childData.admissionDate,
          guardianName: childData.parentInfo?.guardianName || 'N/A',
          emergencyContact: childData.parentInfo?.emergencyContact || 'N/A'
        };
        setChild(mappedChild);
      } else {
        setError('Child not found');
      }
    } catch (err) {
      console.error('Error fetching child details:', err);
      setError('Failed to load child details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate('/parent-dashboard/children')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="inline mr-2" />
            Back to Children
          </button>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-600">Child not found</p>
          <button
            onClick={() => navigate('/parent-dashboard/children')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaArrowLeft className="inline mr-2" />
            Back to Children
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/parent-dashboard/children')}
            className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{child.fullname}</h1>
            <p className="text-gray-600">Student Details</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/parent-dashboard/children/${child._id}/results`}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaGraduationCap className="inline mr-2" />
            View Results
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaUser className="mr-2 text-primary" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-gray-900">{child.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-gray-900">{child.surName}</p>
              </div>
              {child.middleName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  <p className="text-gray-900">{child.middleName}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <p className="text-gray-900 flex items-center">
                  <FaIdCard className="mr-2 text-gray-500" />
                  {child.studentId || 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900 flex items-center">
                  <FaBirthdayCake className="mr-2 text-gray-500" />
                  {formatDate(child.dateOfBirth)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900 flex items-center">
                  <FaVenusMars className="mr-2 text-gray-500" />
                  {child.gender || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaGraduationCap className="mr-2 text-primary" />
              Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <p className="text-gray-900">{child.class || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  child.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {child.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                <p className="text-gray-900 flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  {formatDate(child.admissionDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaPhone className="mr-2 text-primary" />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 flex items-center">
                  <FaEnvelope className="mr-2 text-gray-500" />
                  {child.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900 flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />
                  {child.phone}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <p className="text-gray-900 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" />
                  {child.address}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
                <p className="text-gray-900 flex items-center">
                  <FaUser className="mr-2 text-gray-500" />
                  {child.guardianName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <p className="text-gray-900 flex items-center">
                  <FaPhone className="mr-2 text-gray-500" />
                  {child.emergencyContact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/parent-dashboard/children/${child._id}/results`}
                className="w-full bg-primary text-white text-center py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <FaChartLine className="mr-2" />
                View Academic Results
              </Link>
              <button
                onClick={() => navigate('/parent-dashboard/calendar')}
                className="w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <FaCalendarAlt className="mr-2" />
                View Calendar
              </button>
              <button
                onClick={() => navigate('/parent-dashboard/payments')}
                className="w-full bg-purple-600 text-white text-center py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                <FaHome className="mr-2" />
                View Payments
              </button>
            </div>
          </div>

          {/* Student Summary Card */}
          <div className="bg-gradient-to-br from-primary to-blue-600 rounded-lg shadow-sm p-6 text-white">
            <div className="text-center">
              <FaChild className="text-4xl mb-3 mx-auto opacity-80" />
              <h3 className="text-lg font-semibold mb-2">{child.fullname}</h3>
              <p className="text-blue-100 mb-4">Class: {child.class || 'N/A'}</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <p className="text-sm">Student ID</p>
                <p className="font-semibold">{child.studentId || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDetails;
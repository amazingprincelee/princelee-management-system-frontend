import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FaChild, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaEye,
  FaSpinner
} from 'react-icons/fa';

const Children = () => {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/parent/children`, {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`
        }
      });
      
      // Map the API response to match the component's expected structure
      const mappedChildren = (response.data.children || []).map(child => ({
        _id: child._id,
        fullname: `${child.firstName} ${child.middleName ? child.middleName + ' ' : ''}${child.surName}`,
        firstName: child.firstName,
        surName: child.surName,
        middleName: child.middleName,
        email: child.parentInfo?.email || 'N/A',
        phone: child.parentInfo?.phoneNumber || 'N/A',
        address: child.address || child.parentInfo?.address || 'N/A',
        class: child.classLevel,
        section: child.section,
        admissionNumber: child.admissionNumber,
        dateOfBirth: child.dateOfBirth,
        gender: child.gender,
        guardianName: child.parentInfo?.guardianName || child.parentInfo?.fatherName || child.parentInfo?.motherName || user?.fullname || 'Parent Name',
        profilePicture: child.studentPhoto || null,
        academicYear: child.currentSession,
        currentTerm: child.currentTerm,
        status: child.status === 'active' ? 'Active' : child.status || 'Active',
        admissionDate: child.admissionDate
      }));
      
      setChildren(mappedChildren);
      setError('');
    } catch (error) {
      console.error('Error fetching children:', error);
      setError('Failed to load children information. Please try again later.');
      
      // Only set mock data if it's a network error or 500 error
      if (error.response?.status >= 500 || !error.response) {
        setChildren([
          {
            _id: '1',
            fullname: 'John Doe',
            firstName: 'John',
            surName: 'Doe',
            middleName: '',
            email: 'john.doe@student.school.com',
            phone: '+1234567890',
            address: '123 Main St, City',
            class: 'Grade 10A',
            section: 'Secondary',
            admissionNumber: 'ADM001',
            dateOfBirth: '2008-05-15',
            gender: 'male',
            guardianName: user?.fullname || 'Parent Name',
            profilePicture: null,
            academicYear: '2023-2024',
            currentTerm: 'first',
            status: 'Active',
            admissionDate: '2023-09-01'
          },
          {
            _id: '2',
            fullname: 'Jane Doe',
            firstName: 'Jane',
            surName: 'Doe',
            middleName: '',
            email: 'jane.doe@student.school.com',
            phone: '+1234567891',
            address: '123 Main St, City',
            class: 'Grade 8B',
            section: 'Secondary',
            admissionNumber: 'ADM002',
            dateOfBirth: '2010-08-22',
            gender: 'female',
            guardianName: user?.fullname || 'Parent Name',
            profilePicture: null,
            academicYear: '2023-2024',
            currentTerm: 'first',
            status: 'Active',
            admissionDate: '2023-09-01'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getClassOptions = () => {
    const classes = [...new Set(children.map(child => child.class))];
    return classes.sort();
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || child.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading children information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <FaChild className="text-3xl text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Children</h1>
        </div>
        <p className="text-gray-600">
          View and manage information about your children registered in the school.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Children
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            />
          </div>
          <div className="md:w-48">
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Class
            </label>
            <select
              id="class"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent"
            >
              <option value="all">All Classes</option>
              {getClassOptions().map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Children Grid */}
      {filteredChildren.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FaChild className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {children.length === 0 ? 'No Children Registered' : 'No Children Found'}
          </h3>
          <p className="text-gray-600 mb-6">
            {children.length === 0 
              ? 'Contact the school administration to register your children.'
              : 'Try adjusting your search criteria or filters.'
            }
          </p>
          {children.length === 0 && (
            <button
              onClick={() => navigate('/contact')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Contact School
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <div key={child._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Child Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {child.profilePicture ? (
                      <img
                        src={child.profilePicture}
                        alt={child.fullname}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                        <FaUser className="text-primary-600 text-xl" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {child.fullname}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Admission: {child.admissionNumber}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      child.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {child.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Child Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Class:</span>
                    <p className="font-medium text-gray-900">{child.class}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Age:</span>
                    <p className="font-medium text-gray-900">
                      {child.dateOfBirth ? calculateAge(child.dateOfBirth) : 'N/A'} years
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span>
                    <p className="font-medium text-gray-900">{child.gender ? child.gender.charAt(0).toUpperCase() + child.gender.slice(1) : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Academic Year:</span>
                    <p className="font-medium text-gray-900">{child.academicYear || 'N/A'}</p>
                  </div>
                  {child.section && (
                    <div>
                      <span className="text-gray-500">Section:</span>
                      <p className="font-medium text-gray-900">{child.section}</p>
                    </div>
                  )}
                  {child.currentTerm && (
                    <div>
                      <span className="text-gray-500">Current Term:</span>
                      <p className="font-medium text-gray-900">{child.currentTerm.charAt(0).toUpperCase() + child.currentTerm.slice(1)}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    <span className="truncate">{child.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-2 text-gray-400" />
                    <span>{child.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    <span className="truncate">{child.address}</span>
                  </div>
                  {child.dateOfBirth && (
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      <span>Born: {new Date(child.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex space-x-3">
                <Link
                  to={`/parent-dashboard/children/${child._id}/results`}
                  className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                >
                  <FaGraduationCap className="inline mr-2" />
                  View Results
                </Link>
                <button
                  onClick={() => navigate(`/parent-dashboard/children/${child._id}`)}
                  className="flex-1 bg-gray-600 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <FaEye className="inline mr-2" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {children.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{children.length}</div>
              <div className="text-sm text-gray-600">Total Children</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {children.filter(child => child.status === 'Active').length}
              </div>
              <div className="text-sm text-gray-600">Active Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {getClassOptions().length}
              </div>
              <div className="text-sm text-gray-600">Different Classes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Children;
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeachers } from "../../redux/features/teacherSlice";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaEye, FaKey, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// TeacherForm component moved outside to prevent recreation on every render
const TeacherForm = ({ onSubmit, initialData = {}, formData, setFormData, isLoading = false }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <input
        type="text"
        placeholder="Full Name"
        value={formData.fullname || initialData.fullname || ""}
        onChange={(e) =>
          setFormData({ ...formData, fullname: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email || initialData.email || ""}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Create a password for teacher"
        value={formData.password || ""}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone || initialData.phone || ""}
        onChange={(e) =>
          setFormData({ ...formData, phone: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
      <select
        value={formData.gender || initialData.gender || ""}
        onChange={(e) =>
          setFormData({ ...formData, gender: e.target.value })
        }
        className="w-full p-2 border rounded"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input
        type="text"
        placeholder="Designation"
        value={formData.designation || initialData.designation || ""}
        onChange={(e) =>
          setFormData({ ...formData, designation: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Subjects (comma separated)"
        value={formData.subjects || initialData.subjects?.join(", ") || ""}
        onChange={(e) =>
          setFormData({ ...formData, subjects: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Salary"
        value={formData.salary || initialData.salary || ""}
        onChange={(e) =>
          setFormData({ ...formData, salary: e.target.value })
        }
        className="w-full p-2 border rounded"
      />
    </div>
    <textarea
      placeholder="Address"
      value={formData.address || initialData.address || ""}
      onChange={(e) =>
        setFormData({ ...formData, address: e.target.value })
      }
      className="w-full p-2 border rounded"
      rows="3"
    />

    <button
      type="submit"
      disabled={isLoading}
      className={`w-full p-2 rounded text-white sm:w-auto ${
        isLoading 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-primary hover:bg-blue-600'
      }`}
    >
      {isLoading ? 'Submitting...' : 'Submit'}
    </button>
  </form>
);

function ManageTeachers() {
  const { teachers } = useSelector((state) => state.teacher);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    designation: "",
    gender: "",
    subject: "",
  });
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [filterError, setFilterError] = useState(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isUpdatingTeacher, setIsUpdatingTeacher] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  useEffect(() => {
    let result = teachers || [];

    if (searchTerm) {
      result = result.filter(
        (teacher) =>
          teacher.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.designation) {
      result = result.filter(
        (teacher) =>
          teacher.designation.toLowerCase() === filters.designation.toLowerCase()
      );
    }

    if (filters.gender) {
      result = result.filter(
        (teacher) => teacher.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.subject) {
      result = result.filter((teacher) =>
        teacher.subjects.some(
          (subject) => subject.toLowerCase() === filters.subject.toLowerCase()
        )
      );
    }

    setFilteredTeachers(result);
    setFilterError(null);
  }, [teachers, searchTerm, filters]);

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setIsAddingTeacher(true);
    try {
      const token = localStorage.getItem("token");
      
      // Process the form data
      const teacherData = {
        ...formData,
        subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()) : []
      };
      
      await axios.post(`${baseUrl}/teacher/add-teacher`, teacherData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      dispatch(fetchTeachers());
      setShowAddModal(false);
      setFormData({});
      toast.success("Teacher added successfully!");
    } catch (err) {
      console.error("Error adding teacher:", err);
      const errorMessage = err.response?.data?.message || "Failed to add teacher";
      setFilterError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsAddingTeacher(false);
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    setIsUpdatingTeacher(true);
    try {
      const token = localStorage.getItem("token");
      
      // Process the form data
      const teacherData = {
        ...formData,
        userId: selectedTeacher._id,
        subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()) : []
      };
      
      await axios.put(
        `${baseUrl}/teacher/update`,
        teacherData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      dispatch(fetchTeachers());
      setShowEditModal(false);
      setSelectedTeacher(null);
      setFormData({});
      toast.success("Teacher updated successfully!");
    } catch (err) {
      console.error("Error updating teacher:", err);
      const errorMessage = err.response?.data?.message || "Failed to update teacher";
      setFilterError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdatingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${baseUrl}/teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchTeachers());
        toast.success("Teacher deleted successfully!");
      } catch (err) {
        console.error("Error deleting teacher:", err);
        const errorMessage = err.response?.data?.message || "Failed to delete teacher";
        setFilterError(errorMessage);
        toast.error(errorMessage);
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ designation: "", gender: "", subject: "" });
    setFilterError(null);
  };

  const handleAddTeacherRoute = () => {
    navigate("/dashboard/add-teachers");
  };

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const designations = [...new Set(teachers?.map((t) => t.designation) || [])].sort();
  const subjects = [...new Set(teachers?.flatMap((t) => t.subjects || []) || [])].sort();

  // Teacher Details Modal Component
  const TeacherDetailsModal = ({ teacher, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
        <div className="sticky top-0 px-6 py-4 bg-white border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Teacher Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-gray-900">{teacher.fullname}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Username</label>
                  <p className="text-gray-900">{teacher.username}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{teacher.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{teacher.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Gender</label>
                  <p className="text-gray-900">{teacher.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{teacher.address || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Professional Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Designation</label>
                  <p className="text-gray-900">{teacher.designation || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Salary</label>
                  <p className="text-gray-900">{teacher.salary ? `₦${teacher.salary.toLocaleString()}` : 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Employment Status</label>
                  <p className="text-gray-900 capitalize">{teacher.status || 'full time'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Password Status</label>
                  <div className="flex items-center space-x-2">
                    {teacher.updatedPassword ? (
                      <>
                        <FaCheckCircle className="text-green-500" />
                        <span className="font-medium text-green-700">Updated by Teacher</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-orange-500" />
                        <span className="font-medium text-orange-700">Using Generated Password</span>
                      </>
                    )}
                  </div>
                </div>
                {teacher.generatedParentPassword && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Generated Password</label>
                    <p className="p-2 font-mono text-gray-900 bg-gray-100 rounded">{teacher.generatedParentPassword}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Subjects Section - Full width */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects && teacher.subjects.length > 0 ? (
                  teacher.subjects.map((subject, idx) => (
                    <span key={idx} className="inline-flex px-3 py-2 text-sm font-medium text-blue-800 bg-blue-100 border border-blue-200 rounded-full">
                      {subject}
                    </span>
                  ))
                ) : (
                  <p className="italic text-gray-500">No subjects assigned</p>
                )}
              </div>
            </div>

            {/* Bank Details */}
            {(teacher.bankDetails?.bankName || teacher.bankDetails?.bankAccount || teacher.bankDetails?.accountName) && (
              <div className="space-y-4 md:col-span-2">
                <h3 className="pb-2 text-lg font-semibold text-gray-900 border-b">Bank Details</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Bank Name</label>
                    <p className="text-gray-900">{teacher.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Number</label>
                    <p className="text-gray-900">{teacher.bankDetails.bankAccount}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Name</label>
                    <p className="text-gray-900">{teacher.bankDetails.accountName}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Teachers</h1>
          <p className="mt-1 text-sm text-gray-600">Add, edit, and manage teacher records</p>
        </div>
        <button
          onClick={handleAddTeacherRoute}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-l bg-primary hover:bg-blue-600"
        >
          <FaPlus className="w-4 h-4 mr-2" /> Add Teacher
        </button>
      </div>

      {/* Search and Filters Section */}
      <div className="p-4 space-y-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FaSearch className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
            />
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FaTimes className="w-4 h-4 mr-2" /> Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={filters.designation}
            onChange={(e) =>
              setFilters({ ...filters, designation: e.target.value })
            }
            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          >
            <option value="">All Designations</option>
            {designations.map((designation) => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-300 focus:border-orange-400"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        {filterError && (
          <div className="p-3 border border-red-200 rounded-lg bg-red-50">
            <p className="text-sm text-red-600">{filterError}</p>
          </div>
        )}
      </div>

      {/* Teachers Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        {/* Mobile Card View - Show on small screens */}
        <div className="block sm:hidden">
          <div className="divide-y divide-gray-200">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <div key={teacher._id} className="p-4 transition-colors duration-200 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary">
                          <span className="text-lg font-medium text-primary-600">
                            {teacher.fullname?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{teacher.fullname}</div>
                        <div className="text-sm text-gray-500 truncate">{teacher.email}</div>
                        <div className="text-xs text-gray-400">{teacher.username}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewTeacher(teacher)}
                        className="p-2 text-blue-600 transition-colors duration-200 rounded hover:text-blue-900 hover:bg-blue-50"
                        title="View details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setShowEditModal(true);
                          setFormData({
                            ...teacher,
                            subjects: teacher.subjects?.join(', ') || '',
                            bankName: teacher.bankDetails?.bankName,
                            bankAccount: teacher.bankDetails?.bankAccount,
                            accountName: teacher.bankDetails?.accountName,
                          });
                        }}
                        className="p-2 transition-colors duration-200 rounded text-primary-600 hover:text-primary-900 hover:bg-blue-600"
                        title="Edit teacher"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="p-2 text-red-600 transition-colors duration-200 rounded hover:text-red-900 hover:bg-red-50"
                        title="Delete teacher"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Designation:</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        {teacher.designation || 'Not assigned'}
                      </span>
                    </div>
                    {teacher.salary && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Salary:</span>
                        <span className="text-xs font-medium text-gray-900">₦{teacher.salary.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Password:</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        teacher.updatedPassword 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {teacher.updatedPassword ? (
                          <>
                            <FaCheckCircle className="w-3 h-3 mr-1" />
                            Updated
                          </>
                        ) : (
                          <>
                            <FaKey className="w-3 h-3 mr-1" />
                            Generated
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-500">
                  <div className="mb-2 text-lg">No teachers found</div>
                  <div className="text-sm">Try adjusting your search or filter criteria</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View - Hide on small screens */}
        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Username</th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell">Email</th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:table-cell">Phone</th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Designation</th>
                <th className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:table-cell">Salary</th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Password Status</th>
                <th className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <tr key={teacher._id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {/* Name Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
                            <span className="text-sm font-medium text-primary-600">
                              {teacher.fullname?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{teacher.fullname}</div>
                          <div className="text-sm text-gray-500 md:hidden">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Username Column */}
                    <td className="px-3 py-4 text-sm text-gray-900 whitespace-nowrap">
                      {teacher.username}
                    </td>
                    
                    {/* Email Column - Hidden on small screens */}
                    <td className="hidden px-3 py-4 text-sm text-gray-900 whitespace-nowrap md:table-cell">
                      {teacher.email}
                    </td>
                    
                    {/* Phone Column - Hidden on medium and smaller screens */}
                    <td className="hidden px-3 py-4 text-sm text-gray-900 whitespace-nowrap lg:table-cell">
                      {teacher.phone || 'Not provided'}
                    </td>
                    
                    {/* Designation Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        {teacher.designation || 'Not assigned'}
                      </span>
                    </td>
                    
                    {/* Salary Column - Hidden on medium and smaller screens */}
                    <td className="hidden px-3 py-4 text-sm text-gray-900 whitespace-nowrap lg:table-cell">
                      {teacher.salary ? `₦${teacher.salary.toLocaleString()}` : 'Not set'}
                    </td>
                    
                    {/* Password Status Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        teacher.updatedPassword 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}>
                        {teacher.updatedPassword ? (
                          <>
                            <FaCheckCircle className="w-3 h-3 mr-1" />
                            Updated
                          </>
                        ) : (
                          <>
                            <FaKey className="w-3 h-3 mr-1" />
                            Generated
                          </>
                        )}
                      </span>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-3 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewTeacher(teacher)}
                          className="p-1 text-blue-600 transition-colors duration-200 rounded hover:text-blue-900 hover:bg-blue-50"
                          title="View details"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEditModal(true);
                            setFormData({
                              ...teacher,
                              subjects: teacher.subjects?.join(', ') || '',
                              bankName: teacher.bankDetails?.bankName,
                              bankAccount: teacher.bankDetails?.bankAccount,
                              accountName: teacher.bankDetails?.accountName,
                            });
                          }}
                          className="p-1 transition-colors duration-200 rounded text-primary-600 hover:text-primary-900 hover:bg-blue-600"
                          title="Edit teacher"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          className="p-1 text-red-600 transition-colors duration-200 rounded hover:text-red-900 hover:bg-red-50"
                          title="Delete teacher"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="mb-2 text-lg">No teachers found</div>
                      <div className="text-sm">Try adjusting your search or filter criteria</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
            <div className="sticky top-0 px-6 py-4 bg-white border-b border-gray-200 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <TeacherForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleAddTeacher}
                onCancel={() => setShowAddModal(false)}
                isEditing={false}
                isLoading={isAddingTeacher}
              />
            </div>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
            <div className="sticky top-0 px-6 py-4 bg-white border-b border-gray-200 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Teacher</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 transition-colors duration-200 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <TeacherForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleUpdateTeacher}
                onCancel={() => setShowEditModal(false)}
                isEditing={true}
                isLoading={isUpdatingTeacher}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Teacher Details Modal */}
      {showViewModal && selectedTeacher && (
        <TeacherDetailsModal 
          teacher={selectedTeacher} 
          onClose={() => setShowViewModal(false)} 
        />
      )}
    </div>
  );
}

export default ManageTeachers;
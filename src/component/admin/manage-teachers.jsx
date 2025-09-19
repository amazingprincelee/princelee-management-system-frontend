import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeachers } from "../../redux/features/teacherSlice";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

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
          : 'bg-blue-500 hover:bg-blue-600'
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

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  useEffect(() => {
    let result = teachers || [];

    if (searchTerm) {
      result = result.filter(
        (teacher) =>
          teacher.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
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



  const designations = [...new Set(teachers?.map((t) => t.designation) || [])].sort();
  const subjects = [...new Set(teachers?.flatMap((t) => t.subjects || []) || [])].sort();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Teachers</h1>
          <p className="text-sm text-gray-600 mt-1">Add, edit, and manage teacher records</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <FaPlus className="mr-2 w-4 h-4" /> Add Teacher
        </button>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FaTimes className="mr-2 w-4 h-4" /> Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <select
            value={filters.designation}
            onChange={(e) =>
              setFilters({ ...filters, designation: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{filterError}</p>
          </div>
        )}
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {/* Mobile Card View - Show on small screens */}
        <div className="block sm:hidden">
          <div className="divide-y divide-gray-200">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <div key={teacher._id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-lg font-medium text-blue-600">
                            {teacher.fullname?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{teacher.fullname}</div>
                        <div className="text-sm text-gray-500 truncate">{teacher.email}</div>
                        <div className="text-xs text-gray-400">{teacher.phone || 'No phone'}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
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
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-2 rounded hover:bg-blue-50"
                        title="Edit teacher"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher._id)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 p-2 rounded hover:bg-red-50"
                        title="Delete teacher"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Designation:</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {teacher.designation || 'Not assigned'}
                      </span>
                    </div>
                    {teacher.salary && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Salary:</span>
                        <span className="text-xs font-medium text-gray-900">₦{teacher.salary.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <span className="text-xs text-gray-500">Subjects:</span>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {teacher.subjects && teacher.subjects.length > 0 ? (
                          teacher.subjects.slice(0, 3).map((subject, idx) => (
                            <span key={idx} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {subject}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400 italic">No subjects</span>
                        )}
                        {teacher.subjects && teacher.subjects.length > 3 && (
                          <span className="text-xs text-gray-500">+{teacher.subjects.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-500">
                  <div className="text-lg mb-2">No teachers found</div>
                  <div className="text-sm">Try adjusting your search or filter criteria</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View - Hide on small screens */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">Address</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Salary</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subjects</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher, index) => (
                  <tr key={teacher._id} className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {/* Name Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
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
                    
                    {/* Email Column - Hidden on small screens */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">{teacher.email}</td>
                    
                    {/* Phone Column - Hidden on medium and smaller screens */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      {teacher.phone || 'Not provided'}
                    </td>
                    
                    {/* Address Column - Hidden on large and smaller screens */}
                    <td className="px-3 py-4 text-sm text-gray-900 hidden xl:table-cell">
                      <div className="max-w-xs truncate" title={teacher.address || 'Not provided'}>
                        {teacher.address || 'Not provided'}
                      </div>
                    </td>
                    
                    {/* Designation Column */}
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        {teacher.designation || 'Not assigned'}
                      </span>
                    </td>
                    
                    {/* Salary Column - Hidden on medium and smaller screens */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      {teacher.salary ? `₦${teacher.salary.toLocaleString()}` : 'Not set'}
                    </td>
                    
                    {/* Subjects Column - Responsive design for multiple subjects */}
                    <td className="px-3 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        {teacher.subjects && teacher.subjects.length > 0 ? (
                          teacher.subjects.length <= 2 ? (
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects.map((subject, idx) => (
                                <span key={idx} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="relative group">
                              <div className="flex flex-wrap gap-1">
                                {teacher.subjects.slice(0, 2).map((subject, idx) => (
                                  <span key={idx} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                    {subject}
                                  </span>
                                ))}
                                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 cursor-pointer">
                                  +{teacher.subjects.length - 2} more
                                </span>
                              </div>
                              {/* Tooltip for all subjects */}
                              <div className="absolute z-10 invisible group-hover:visible bg-gray-900 text-white text-xs rounded-lg px-3 py-2 bottom-full left-0 mb-2 whitespace-nowrap shadow-lg">
                                All subjects: {teacher.subjects.join(", ")}
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            </div>
                          )
                        ) : (
                          <span className="text-gray-500 italic">No subjects assigned</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Actions Column */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
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
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded hover:bg-blue-50"
                          title="Edit teacher"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher._id)}
                          className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded hover:bg-red-50"
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
                      <div className="text-lg mb-2">No teachers found</div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add New Teacher</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Teacher</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
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
    </div>
  );
}

export default ManageTeachers;

import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { fetchTeachers } from "../../redux/features/teacherSlice";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaTimes } from "react-icons/fa";

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
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseUrl}/teacher/add-teacher`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchTeachers());
      setShowAddModal(false);
      setFormData({});
    } catch (err) {
      console.error("Error adding teacher:", err);
      setFilterError(err.response?.data?.message || "Failed to add teacher");
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/teacher/update`,
        { ...formData, userId: selectedTeacher._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchTeachers());
      setShowEditModal(false);
      setSelectedTeacher(null);
      setFormData({});
    } catch (err) {
      console.error("Error updating teacher:", err);
      setFilterError(err.response?.data?.message || "Failed to update teacher");
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
      } catch (err) {
        console.error("Error deleting teacher:", err);
        setFilterError(err.response?.data?.message || "Failed to delete teacher");
      }
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ designation: "", gender: "", subject: "" });
    setFilterError(null);
  };

  const TeacherForm = ({ onSubmit, initialData = {} }) => (
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
          placeholder="Subjects (comma-separated)"
          value={formData.subjects || initialData.subjects?.join(",") || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              subjects: e.target.value.split(",").map((s) => s.trim()),
            })
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
        <input
          type="text"
          placeholder="Bank Name"
          value={formData.bankName || initialData.bankDetails?.bankName || ""}
          onChange={(e) =>
            setFormData({ ...formData, bankName: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Bank Account"
          value={
            formData.bankAccount || initialData.bankDetails?.bankAccount || ""
          }
          onChange={(e) =>
            setFormData({ ...formData, bankAccount: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Account Name"
          value={
            formData.accountName || initialData.bankDetails?.accountName || ""
          }
          onChange={(e) =>
            setFormData({ ...formData, accountName: e.target.value })
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 text-white bg-blue-500 rounded sm:w-auto"
      >
        Submit
      </button>
    </form>
  );

  const designations = [...new Set(teachers?.map((t) => t.designation) || [])].sort();
  const subjects = [...new Set(teachers?.flatMap((t) => t.subjects || []) || [])].sort();

  return (
    <div className="p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col mb-4 space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-lg font-bold sm:text-xl md:text-2xl">Manage Teachers</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-green-500 rounded sm:w-auto sm:text-base sm:px-4"
        >
          <FaPlus className="mr-2" /> Add Teacher
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="relative flex-1">
            <FaSearch className="absolute text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 text-sm border rounded sm:text-base"
            />
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center w-full px-3 py-2 text-sm text-white bg-gray-500 rounded sm:w-auto sm:text-base sm:px-4"
          >
            <FaTimes className="mr-2" /> Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
          <select
            value={filters.designation}
            onChange={(e) =>
              setFilters({ ...filters, designation: e.target.value })
            }
            className="w-full p-2 text-sm border rounded sm:text-base"
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
            className="w-full p-2 text-sm border rounded sm:text-base"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="w-full p-2 text-sm border rounded sm:text-base"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
        {filterError && <p className="text-red-500">{filterError}</p>}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse sm:text-sm md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Designation</th>
              <th className="p-2 border">Subjects</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <tr key={teacher._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{teacher.fullname}</td>
                  <td className="p-2 border">{teacher.email}</td>
                  <td className="p-2 border">{teacher.designation}</td>
                  <td className="p-2 border">
                    {teacher.subjects?.join(", ") || "N/A"}
                  </td>
                  <td className="flex p-2 space-x-2 border">
                    <button
                      onClick={() => {
                        setSelectedTeacher(teacher);
                        setShowEditModal(true);
                        setFormData({
                          ...teacher,
                          bankName: teacher.bankDetails?.bankName,
                          bankAccount: teacher.bankDetails?.bankAccount,
                          accountName: teacher.bankDetails?.accountName,
                        });
                      }}
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-2 text-center border">
                  No teachers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center px-2 bg-black bg-opacity-50 sm:px-4">
          <div className="w-full max-w-2xl p-4 bg-white rounded-lg sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-bold sm:text-xl">Add New Teacher</h2>
            <TeacherForm onSubmit={handleAddTeacher} />
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full p-2 mt-4 text-white bg-gray-500 rounded sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTeacher && (
        <div className="fixed inset-0 flex items-center justify-center px-2 bg-black bg-opacity-50 sm:px-4">
          <div className="w-full max-w-2xl p-4 bg-white rounded-lg sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-bold sm:text-xl">Edit Teacher</h2>
            <TeacherForm
              onSubmit={handleUpdateTeacher}
              initialData={selectedTeacher}
            />
            <button
              onClick={() => setShowEditModal(false)}
              className="w-full p-2 mt-4 text-white bg-gray-500 rounded sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageTeachers;

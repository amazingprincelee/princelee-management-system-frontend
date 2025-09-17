import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../../redux/features/studentSlice";
import {
  FaEdit,
  FaTrash,
  FaArrowUp,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

function ManageStudents() {
  const { students, loading, error } = useSelector((state) => state.students);
  const dispatch = useDispatch();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [showBulkPromoteModal, setShowBulkPromoteModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [promotionRules, setPromotionRules] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [promotionSuggestions, setPromotionSuggestions] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    classLevel: "",
    section: "",
    gender: "",
  });
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filterError, setFilterError] = useState(null);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    const applyFilters = async () => {
      let result = students || [];

      if (filters.classLevel) {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setFilterError("No authentication token found");
            return;
          }
          const response = await axios.get(
            `${baseUrl}/student/class/${filters.classLevel}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          result = response.data.classFound || [];
          setFilterError(null);
        } catch (err) {
          setFilterError(
            err.response?.data?.message || "Failed to fetch students by class"
          );
          result = [];
        }
      }

      if (searchTerm) {
        result = result.filter(
          (student) =>
            student.firstName
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            student.surName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.section) {
        result = result.filter(
          (student) =>
            student.section.toLowerCase() === filters.section.toLowerCase()
        );
      }

      if (filters.gender) {
        result = result.filter(
          (student) => student.gender.toLowerCase() === filters.gender.toLowerCase()
        );
      }

      setFilteredStudents(result);
    };

    applyFilters();
  }, [students, searchTerm, filters]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${baseUrl}/student/add`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchStudents());
      setShowAddModal(false);
      setFormData({});
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/student/update/${selectedStudent._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchStudents());
      setShowEditModal(false);
      setSelectedStudent(null);
      setFormData({});
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${baseUrl}/student/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(fetchStudents());
      } catch (err) {
        console.error("Error deleting student:", err);
      }
    }
  };

  const handlePromoteStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/student/promote/${selectedStudent._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchStudents());
      setShowPromoteModal(false);
      setSelectedStudent(null);
      setFormData({});
    } catch (err) {
      console.error("Error promoting student:", err);
    }
  };

  const handleBulkPromote = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/student/bulk-promote`,
        { studentIds: selectedStudents, promotionRules },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchStudents());
      setShowBulkPromoteModal(false);
      setSelectedStudents([]);
      setPromotionRules({});
    } catch (err) {
      console.error("Error bulk promoting students:", err);
    }
  };

  const fetchPromotionSuggestions = async (currentClass) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${baseUrl}/student/promotion-suggestions/${currentClass}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPromotionSuggestions(response.data.data);
    } catch (err) {
      console.error("Error fetching promotion suggestions:", err);
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ classLevel: "", section: "", gender: "" });
    setFilterError(null);
  };

  const StudentForm = ({ onSubmit, initialData = {} }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName || initialData.firstName || ""}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Surname"
          value={formData.surName || initialData.surName || ""}
          onChange={(e) =>
            setFormData({ ...formData, surName: e.target.value })
          }
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Middle Name"
          value={formData.middleName || initialData.middleName || ""}
          onChange={(e) =>
            setFormData({ ...formData, middleName: e.target.value })
          }
          className="p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Date of Birth"
          value={formData.dateOfBirth || initialData.dateOfBirth || ""}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
          className="p-2 border rounded"
        />
        <select
          value={formData.gender || initialData.gender || ""}
          onChange={(e) =>
            setFormData({ ...formData, gender: e.target.value })
          }
          className="p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="text"
          placeholder="Class Level"
          value={formData.classLevel || initialData.classLevel || ""}
          onChange={(e) => {
            setFormData({ ...formData, classLevel: e.target.value });
            fetchPromotionSuggestions(e.target.value);
          }}
          className="p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="px-3 py-2 text-sm text-white bg-blue-500 rounded sm:px-4 sm:py-2"
      >
        Submit
      </button>
    </form>
  );

  const classLevels = [...new Set(students?.map((s) => s.classLevel) || [])].sort();
  const sections = [...new Set(students?.map((s) => s.section) || [])].sort();

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col items-start justify-between mb-4 space-y-2 sm:flex-row sm:items-center sm:space-y-0">
        <h1 className="text-xl font-bold md:text-2xl">Manage Students</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-3 py-2 text-sm text-white bg-green-500 rounded sm:px-4 sm:py-2"
        >
          <FaPlus className="mr-2" /> Add Student
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-4 space-y-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="relative flex-1">
            <FaSearch className="absolute text-gray-400 left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 text-sm border rounded md:text-base"
            />
          </div>
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center px-3 py-2 text-sm text-white bg-gray-500 rounded sm:px-4 sm:py-2"
          >
            <FaTimes className="mr-2" /> Clear Filters
          </button>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:space-x-4">
          <select
            value={filters.classLevel}
            onChange={(e) =>
              setFilters({ ...filters, classLevel: e.target.value })
            }
            className="p-2 text-sm border rounded md:text-base"
          >
            <option value="">All Classes</option>
            {classLevels.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
          <select
            value={filters.section}
            onChange={(e) =>
              setFilters({ ...filters, section: e.target.value })
            }
            className="p-2 text-sm border rounded md:text-base"
          >
            <option value="">All Sections</option>
            {sections.map((section) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          <select
            value={filters.gender}
            onChange={(e) =>
              setFilters({ ...filters, gender: e.target.value })
            }
            className="p-2 text-sm border rounded md:text-base"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        {filterError && <p className="text-red-500">{filterError}</p>}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse md:text-base">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedStudents(
                      e.target.checked ? filteredStudents.map((s) => s._id) : []
                    )
                  }
                />
              </th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleSelectStudent(student._id)}
                    />
                  </td>
                  <td className="p-2 border">{`${student.firstName} ${student.surName}`}</td>
                  <td className="p-2 border">{student.classLevel}</td>
                  <td className="p-2 border">{student.section}</td>
                  <td className="flex p-2 space-x-2 border">
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowEditModal(true);
                        setFormData(student);
                      }}
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowPromoteModal(true);
                        fetchPromotionSuggestions(student.classLevel);
                      }}
                      className="text-green-500"
                    >
                      <FaArrowUp />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-2 text-center border">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedStudents.length > 0 && (
        <button
          onClick={() => setShowBulkPromoteModal(true)}
          className="px-3 py-2 mt-4 text-sm text-white bg-blue-500 rounded sm:px-4 sm:py-2"
        >
          Bulk Promote Selected
        </button>
      )}

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center p-2 bg-black bg-opacity-50">
          <div className="w-11/12 max-w-2xl p-6 bg-white rounded-lg sm:w-full">
            <h2 className="mb-4 text-lg font-bold md:text-xl">Add New Student</h2>
            <StudentForm onSubmit={handleAddStudent} />
            <button
              onClick={() => setShowAddModal(false)}
              className="px-3 py-2 mt-4 text-sm text-white bg-gray-500 rounded sm:px-4 sm:py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center p-2 bg-black bg-opacity-50">
          <div className="w-11/12 max-w-2xl p-6 bg-white rounded-lg sm:w-full">
            <h2 className="mb-4 text-lg font-bold md:text-xl">Edit Student</h2>
            <StudentForm
              onSubmit={handleUpdateStudent}
              initialData={selectedStudent}
            />
            <button
              onClick={() => setShowEditModal(false)}
              className="px-3 py-2 mt-4 text-sm text-white bg-gray-500 rounded sm:px-4 sm:py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showPromoteModal && selectedStudent && (
        <div className="fixed inset-0 flex items-center justify-center p-2 bg-black bg-opacity-50">
          <div className="w-11/12 max-w-2xl p-6 bg-white rounded-lg sm:w-full">
            <h2 className="mb-4 text-lg font-bold md:text-xl">
              Promote/Demote Student
            </h2>
            <form onSubmit={handlePromoteStudent} className="space-y-4">
              <select
                value={formData.newClassLevel || ""}
                onChange={(e) =>
                  setFormData({ ...formData, newClassLevel: e.target.value })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select New Class</option>
                {promotionSuggestions.allAvailableClasses?.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <p>
                Suggested Promotion:{" "}
                {promotionSuggestions.suggestedPromotion || "None"}
              </p>
              <input
                type="text"
                placeholder="Section"
                value={formData.newSection || ""}
                onChange={(e) =>
                  setFormData({ ...formData, newSection: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Reason"
                value={formData.reason || ""}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="px-3 py-2 text-sm text-white bg-green-500 rounded sm:px-4 sm:py-2"
              >
                Promote
              </button>
            </form>
            <button
              onClick={() => setShowPromoteModal(false)}
              className="px-3 py-2 mt-4 text-sm text-white bg-gray-500 rounded sm:px-4 sm:py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showBulkPromoteModal && (
        <div className="fixed inset-0 flex items-center justify-center p-2 bg-black bg-opacity-50">
          <div className="w-11/12 max-w-2xl p-6 bg-white rounded-lg sm:w-full">
            <h2 className="mb-4 text-lg font-bold md:text-xl">Bulk Promotion</h2>
            <form onSubmit={handleBulkPromote} className="space-y-4">
              <input
                type="text"
                placeholder="New Class Level"
                value={promotionRules.newClassLevel || ""}
                onChange={(e) =>
                  setPromotionRules({
                    ...promotionRules,
                    newClassLevel: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="New Section"
                value={promotionRules.newSection || ""}
                onChange={(e) =>
                  setPromotionRules({
                    ...promotionRules,
                    newSection: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="px-3 py-2 text-sm text-white bg-green-500 rounded sm:px-4 sm:py-2"
              >
                Promote Selected
              </button>
            </form>
            <button
              onClick={() => setShowBulkPromoteModal(false)}
              className="px-3 py-2 mt-4 text-sm text-white bg-gray-500 rounded sm:px-4 sm:py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;

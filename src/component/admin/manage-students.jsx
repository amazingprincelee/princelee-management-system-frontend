import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../../redux/features/studentSlice";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaTimes,
} from "react-icons/fa";

function ManageStudents() {
  const { students, loading, error } = useSelector((state) => state.students);
  const dispatch = useDispatch();

  // modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // data states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    classLevel: "",
    section: "",
    gender: "",
  });
  const [filteredStudents, setFilteredStudents] = useState([]);

  // multi-step add student
  const [step, setStep] = useState(1); // 1 = parent, 2 = student
  const [parentOption, setParentOption] = useState(""); // "new" | "existing"
  const [parents, setParents] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [parentForm, setParentForm] = useState({});

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    let result = students || [];

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
        (student) =>
          student.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.classLevel) {
      result = result.filter(
        (student) =>
          student.classLevel.toLowerCase() === filters.classLevel.toLowerCase()
      );
    }

    setFilteredStudents(result);
  }, [students, searchTerm, filters]);

  // ---------- PARENT & STUDENT HANDLERS ----------
  const fetchParents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/admin/all-parents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParents(res.data.parents || []);
    } catch (err) {
      console.error("Error fetching parents:", err);
    }
  };

  useEffect(() => {
    if (parentOption === "existing") {
      fetchParents();
    }
  }, [parentOption]);

  const handleRegisterParent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/admin/register-parent`,
        { ...parentForm, role: "parent" }, // ensure role is parent
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedParentId(res.data.newUser._id);
      setStep(2);
    } catch (err) {
      console.error("Error registering parent:", err);
    }
  };

  const handleRegisterStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const finalData = { ...formData, parentId: selectedParentId };
      await axios.post(`${baseUrl}/student/add`, finalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchStudents());
      resetAddModal();
    } catch (err) {
      console.error("Error registering student:", err);
    }
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setStep(1);
    setParentOption("");
    setFormData({});
    setParentForm({});
    setSelectedParentId(null);
  };

  // ---------- STUDENT HANDLERS ----------
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/student/${selectedStudent._id}`,
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
          onChange={(e) =>
            setFormData({ ...formData, classLevel: e.target.value })
          }
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Section"
          value={formData.section || initialData.section || ""}
          onChange={(e) =>
            setFormData({ ...formData, section: e.target.value })
          }
          className="p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="px-3 py-2 text-sm text-white bg-blue-500 rounded"
      >
        Submit
      </button>
    </form>
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Manage Students</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-3 py-2 text-sm text-white bg-green-500 rounded"
        >
          <FaPlus className="mr-2" /> Add Student
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="flex items-center px-2 border rounded">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 outline-none"
          />
          {searchTerm && (
            <FaTimes
              className="ml-2 text-gray-500 cursor-pointer"
              onClick={() => setSearchTerm("")}
            />
          )}
        </div>

        <select
          value={filters.classLevel}
          onChange={(e) => setFilters({ ...filters, classLevel: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Classes</option>
          <option value="jss1">JSS1</option>
          <option value="jss2">JSS2</option>
          <option value="jss3">JSS3</option>
          <option value="ss1">SS1</option>
          <option value="ss2">SS2</option>
          <option value="ss3">SS3</option>
        </select>

        <select
          value={filters.section}
          onChange={(e) => setFilters({ ...filters, section: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Sections</option>
          <option value="a">A</option>
          <option value="b">B</option>
        </select>

        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          className="p-2 border rounded"
        >
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Student Table */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">First Name</th>
              <th className="p-2 border">Surname</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Section</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id} className="text-center border-t">
                <td className="p-2 border">{student.firstName}</td>
                <td className="p-2 border">{student.surName}</td>
                <td className="p-2 border">{student.gender}</td>
                <td className="p-2 border">{student.classLevel}</td>
                <td className="p-2 border">{student.section}</td>
                <td className="flex justify-center gap-2 p-2 border">
                  <button
                    className="flex items-center px-2 py-1 text-sm text-white bg-blue-500 rounded"
                    onClick={() => {
                      setSelectedStudent(student);
                      setFormData(student);
                      setShowEditModal(true);
                    }}
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    className="flex items-center px-2 py-1 text-sm text-white bg-red-500 rounded"
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/30">
          <div className="relative w-11/12 max-w-2xl p-6 bg-white rounded-lg">
            {/* Close Button */}
            <button
              onClick={resetAddModal}
              className="absolute text-gray-600 top-2 right-2 hover:text-black"
            >
              <FaTimes size={20} />
            </button>

            {step === 1 && (
              <>
                <h2 className="mb-4 text-lg font-bold">Step 1: Select Parent</h2>
                <div className="flex gap-4 mb-4">
                  <button
                    className={`px-4 py-2 rounded ${
                      parentOption === "new"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setParentOption("new")}
                  >
                    New Parent
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      parentOption === "existing"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => setParentOption("existing")}
                  >
                    Existing Parent
                  </button>
                </div>

                {parentOption === "new" && (
                  <form onSubmit={handleRegisterParent} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={parentForm.fullname || ""}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, fullname: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={parentForm.phone || ""}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, phone: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={parentForm.address || ""}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, address: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={parentForm.email || ""}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, email: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={parentForm.password || ""}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, password: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 text-sm text-white bg-green-500 rounded"
                    >
                      Register Parent
                    </button>
                  </form>
                )}

                {parentOption === "existing" && (
                  <select
                    className="w-full p-2 border rounded"
                    onChange={(e) => setSelectedParentId(e.target.value)}
                  >
                    <option value="">Select Parent</option>
                    {parents.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.fullname} ({p.email})
                      </option>
                    ))}
                  </select>
                )}

                {selectedParentId && (
                  <button
                    onClick={() => setStep(2)}
                    className="px-3 py-2 mt-4 text-sm text-white bg-blue-500 rounded"
                  >
                    Continue to Student Form
                  </button>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="mb-4 text-lg font-bold">Step 2: Add Student</h2>
                <StudentForm onSubmit={handleRegisterStudent} />
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/30">
          <div className="relative w-11/12 max-w-2xl p-6 bg-white rounded-lg">
            {/* Close Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute text-gray-600 top-2 right-2 hover:text-black"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="mb-4 text-lg font-bold">Edit Student</h2>
            <StudentForm
              onSubmit={handleUpdateStudent}
              initialData={selectedStudent}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;

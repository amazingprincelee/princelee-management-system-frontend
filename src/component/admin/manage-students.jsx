import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../../redux/features/studentSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    classLevel: "",
    section: "",
    gender: "",
  });
  const [filteredStudents, setFilteredStudents] = useState([]);

  // multi-step add student
  const [step, setStep] = useState(1); // 1 = parent, 2 = student step 1, 3 = student step 2
  const [parentOption, setParentOption] = useState(""); // "new" | "existing"
  const [parents, setParents] = useState([]);
  const [selectedParentId, setSelectedParentId] = useState(null);
  const [parentForm, setParentForm] = useState({});

  // parent filtering
  const [parentSearchTerm, setParentSearchTerm] = useState("");
  const [filteredParents, setFilteredParents] = useState([]);

  // classes state
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    dispatch(fetchStudents());
    fetchClasses();
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

  // ---------- FETCH CLASSES ----------
  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/admin/all-classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

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

  useEffect(() => {
    if (parents.length > 0) {
      const filtered = parents.filter(
        (parent) =>
          parent.fullname.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
          parent.email.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
          (parent.phone && parent.phone.includes(parentSearchTerm))
      );
      setFilteredParents(filtered);
    }
  }, [parents, parentSearchTerm]);

  const handleRegisterParent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/admin/register-parent`,
        { ...parentForm, role: "parent" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedParentId(res.data.newUser._id);
      toast.success("Parent registered successfully!");
      setStep(2);
    } catch (err) {
      console.error("Error registering parent:", err);
      toast.error("Failed to register parent. Please try again.");
    }
  };

  const handleRegisterStudent = async (e, studentFormData) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const finalData = {
        ...studentFormData,
        parentId: selectedParentId,
        currentSession: studentFormData.currentSession || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`, // Default to current year
        currentTerm: studentFormData.currentTerm || "first", // Default to first term
      };
      await axios.post(`${baseUrl}/student/add`, finalData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchStudents());
      toast.success("Student registered successfully!");
      resetAddModal();
    } catch (err) {
      console.error("Error registering student:", err);
      toast.error("Failed to register student. Please try again.");
    }
  };

  const resetAddModal = () => {
    setShowAddModal(false);
    setStep(1);
    setParentOption("");
    setParentForm({});
    setSelectedParentId(null);
    setParentSearchTerm("");
    setFilteredParents([]);
  };

  // ---------- STUDENT HANDLERS ----------
  const handleUpdateStudent = async (e, studentFormData) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseUrl}/student/${selectedStudent._id}`,
        studentFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(fetchStudents());
      toast.success("Student updated successfully!");
      setShowEditModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("Error updating student:", err);
      toast.error("Failed to update student. Please try again.");
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
        toast.success("Student deleted successfully!");
      } catch (err) {
        console.error("Error deleting student:", err);
        toast.error("Failed to delete student. Please try again.");
      }
    }
  };

  const StudentForm = ({ onSubmit, initialData = {}, classes }) => {
    const [formData, setFormData] = useState(() => ({ ...initialData }));
    const [studentStep, setStudentStep] = useState(1); // 1 = personal details, 2 = parent/guardian details

    const handleFormInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <form id="studentForm" onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
        {studentStep === 1 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName || ""}
              onChange={(e) => handleFormInputChange("firstName", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Surname"
              value={formData.surName || ""}
              onChange={(e) => handleFormInputChange("surName", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Middle Name"
              value={formData.middleName || ""}
              onChange={(e) => handleFormInputChange("middleName", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={formData.dateOfBirth || ""}
              onChange={(e) => handleFormInputChange("dateOfBirth", e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <select
              value={formData.gender || ""}
              onChange={(e) => handleFormInputChange("gender", e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              value={formData.classLevel || ""}
              onChange={(e) => handleFormInputChange("classLevel", e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select Class Level</option>
              {classes.map((classItem) => (
                <option key={classItem._id} value={classItem.level}>
                  {classItem.level}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Section"
              value={formData.section || ""}
              onChange={(e) => handleFormInputChange("section", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="State of Origin"
              value={formData.stateOfOrigin || ""}
              onChange={(e) => handleFormInputChange("stateOfOrigin", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end col-span-2 mt-4 space-x-4">
              <button
                type="button"
                onClick={() => setStudentStep(2)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {studentStep === 2 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Nationality"
              value={formData.nationality || "Nigeria"}
              onChange={(e) => handleFormInputChange("nationality", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Father's Name"
              value={formData.fatherName || ""}
              onChange={(e) => handleFormInputChange("fatherName", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Mother's Name"
              value={formData.motherName || ""}
              onChange={(e) => handleFormInputChange("motherName", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Guardian's Name"
              value={formData.guardianName || ""}
              onChange={(e) => handleFormInputChange("guardianName", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phoneNumber || ""}
              onChange={(e) => handleFormInputChange("phoneNumber", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ""}
              onChange={(e) => handleFormInputChange("email", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address || ""}
              onChange={(e) => handleFormInputChange("address", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Current Session (e.g., 2025/2026)"
              value={formData.currentSession || ""}
              onChange={(e) => handleFormInputChange("currentSession", e.target.value)}
              className="w-full p-2 border rounded"
            />
            <select
              value={formData.currentTerm || ""}
              onChange={(e) => handleFormInputChange("currentTerm", e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Term</option>
              <option value="first">First</option>
              <option value="second">Second</option>
              <option value="third">Third</option>
            </select>
            <div className="flex justify-between col-span-2 mt-4 space-x-4">
              <button
                type="button"
                onClick={() => setStudentStep(1)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
              >
                Add Student
              </button>
            </div>
          </div>
        )}
      </form>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col justify-between mb-4 sm:flex-row">
        <h1 className="text-xl font-bold">Manage Students</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-3 py-2 mt-2 text-sm text-white bg-green-500 rounded sm:mt-0"
        >
          <FaPlus className="mr-2" /> Add Student
        </button>
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
          <div className="relative w-full max-w-md p-4 bg-white rounded-lg sm:max-w-2xl sm:p-6">
            <button
              onClick={resetAddModal}
              className="absolute text-gray-600 top-2 right-2 hover:text-black"
            >
              <FaTimes size={20} />
            </button>

            {step === 1 && (
              <>
                <p className="text-orange-400">
                  You must select or create a new parent before adding a student
                </p>
                <h2 className="mb-4 text-lg font-bold">Step 1: Select Parent</h2>
                <div className="flex flex-col gap-4 mb-4 sm:flex-row">
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

                {/* new parent form */}
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
                      placeholder="Create Password for parent"
                      value={parentForm.password || ""}
                      onChange={(e) =>
                        setParentForm({ ...parentForm, password: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-3 py-2 text-sm text-white bg-green-500 rounded sm:w-auto"
                    >
                      Register Parent
                    </button>
                  </form>
                )}

                {/* existing parent search */}
                {parentOption === "existing" && (
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex items-center px-2 py-1 border rounded focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-200">
                        <FaSearch className="text-xs text-gray-400" />
                        <input
                          type="text"
                          placeholder="Type to search parents..."
                          value={parentSearchTerm}
                          onChange={(e) => setParentSearchTerm(e.target.value)}
                          className="w-full px-2 py-1 text-sm outline-none"
                          autoComplete="off"
                        />
                        {parentSearchTerm && (
                          <FaTimes
                            className="ml-1 text-xs text-gray-500 cursor-pointer hover:text-gray-700"
                            onClick={() => {
                              setParentSearchTerm("");
                              setSelectedParentId(null);
                            }}
                          />
                        )}
                      </div>

                      {parentSearchTerm && (
                        <div className="absolute z-50 w-full mt-1 overflow-y-auto bg-white border border-gray-200 rounded shadow-lg max-h-40">
                          {filteredParents.length > 0 ? (
                            filteredParents.slice(0, 8).map((parent) => (
                              <div
                                key={parent._id}
                                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                                  selectedParentId === parent._id
                                    ? "bg-blue-50 text-blue-800"
                                    : ""
                                }`}
                                onClick={() => {
                                  setSelectedParentId(parent._id);
                                  setParentSearchTerm(parent.fullname);
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {parent.fullname}
                                    </p>
                                    <div className="flex flex-col text-xs text-gray-500 sm:flex-row sm:space-x-2">
                                      <span className="truncate">{parent.email}</span>
                                      {parent.phone && (
                                        <span className="hidden sm:inline">
                                          • {parent.phone}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {selectedParentId === parent._id && (
                                    <div className="flex-shrink-0 ml-2">
                                      <div className="flex items-center justify-center w-3 h-3 bg-blue-500 rounded-full">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-center text-gray-500">
                              No parents found matching "{parentSearchTerm}"
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Always visible Next button when a parent is chosen */}
                    {selectedParentId && (
                      <button
                        onClick={() => setStep(2)}
                        className="w-full px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded sm:w-auto mt-14 hover:bg-blue-700"
                      >
                        Continue to Student Form →
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="mb-4 text-lg font-bold">Step 2: Student Details - Part 1</h2>
                <StudentForm
                  onSubmit={handleRegisterStudent}
                  classes={classes}
                />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded"
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="mb-4 text-lg font-bold">Step 2: Student Details - Part 2</h2>
                <StudentForm
                  onSubmit={handleRegisterStudent}
                  classes={classes}
                />
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-200 rounded"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    form="studentForm"
                    className="px-3 py-2 text-sm text-white bg-green-500 rounded"
                  >
                    Add Student
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/30">
          <div className="relative w-full max-w-md p-4 bg-white rounded-lg sm:max-w-2xl sm:p-6">
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
              classes={classes}
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                form="studentForm"
                className="px-3 py-2 text-sm text-white bg-blue-500 rounded"
              >
                Update Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStudents;
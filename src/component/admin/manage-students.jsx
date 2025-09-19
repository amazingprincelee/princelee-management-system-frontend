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
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          student.surName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.section) {
      result = result.filter(
        (student) =>
          student.section?.toLowerCase() === filters.section.toLowerCase()
      );
    }

    if (filters.gender) {
      result = result.filter(
        (student) =>
          student.gender?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.classLevel) {
      result = result.filter(
        (student) =>
          student.classLevel?.toLowerCase() === filters.classLevel.toLowerCase()
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
          parent.fullname?.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
          parent.email?.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
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
      
      // Show success message with password information
      if (res.data.parentInfo) {
        const { generatedPassword, welcomeEmailSent } = res.data.parentInfo;
        if (welcomeEmailSent) {
          toast.success(
            `Parent registered successfully! Temporary password (${generatedPassword}) has been sent to their email.`,
            { autoClose: 8000 }
          );
        } else {
          toast.warning(
            `Parent registered successfully! Temporary password: ${generatedPassword}. Please share this with the parent as email sending failed.`,
            { autoClose: 10000 }
          );
        }
      } else {
        toast.success("Parent registered successfully!");
      }
      
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
        currentSession: studentFormData.currentSession || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
        currentTerm: studentFormData.currentTerm || "first",
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
    const [studentStep, setStudentStep] = useState(1);

    const handleFormInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <form id="studentForm" onSubmit={(e) => onSubmit(e, formData)} className="space-y-4">
        {studentStep === 1 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="w-full">
              <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter First Name"
                value={formData.firstName || ""}
                onChange={(e) => handleFormInputChange("firstName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="surName" className="block mb-1 text-sm font-medium text-gray-700">
                Surname
              </label>
              <input
                id="surName"
                type="text"
                placeholder="Enter Surname"
                value={formData.surName || ""}
                onChange={(e) => handleFormInputChange("surName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="middleName" className="block mb-1 text-sm font-medium text-gray-700">
                Middle Name
              </label>
              <input
                id="middleName"
                type="text"
                placeholder="Enter Middle Name"
                value={formData.middleName || ""}
                onChange={(e) => handleFormInputChange("middleName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative w-full">
              <label htmlFor="dateOfBirth" className="block mb-1 text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth || ""}
                onChange={(e) => handleFormInputChange("dateOfBirth", e.target.value)}
                className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Select your date of birth</p>
            </div>
            <div className="w-full">
              <label htmlFor="gender" className="block mb-1 text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                value={formData.gender || ""}
                onChange={(e) => handleFormInputChange("gender", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="w-full">
              <label htmlFor="classLevel" className="block mb-1 text-sm font-medium text-gray-700">
                Class Level
              </label>
              <select
                id="classLevel"
                value={formData.classLevel || ""}
                onChange={(e) => handleFormInputChange("classLevel", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Class Level</option>
                {classes.map((classItem) => (
                  <option key={classItem._id} value={classItem.level}>
                    {classItem.level}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full">
              <label htmlFor="section" className="block mb-1 text-sm font-medium text-gray-700">
                Section
              </label>
              <input
                id="section"
                type="text"
                placeholder="Enter Section"
                value={formData.section || ""}
                onChange={(e) => handleFormInputChange("section", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="stateOfOrigin" className="block mb-1 text-sm font-medium text-gray-700">
                State of Origin
              </label>
              <input
                id="stateOfOrigin"
                type="text"
                placeholder="Enter State of Origin"
                value={formData.stateOfOrigin || ""}
                onChange={(e) => handleFormInputChange("stateOfOrigin", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end col-span-2 mt-4 space-x-4">
              <button
                type="button"
                onClick={() => setStudentStep(2)}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </div>
        )}
        {studentStep === 2 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="w-full">
              <label htmlFor="nationality" className="block mb-1 text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                id="nationality"
                type="text"
                placeholder="Enter Nationality"
                value={formData.nationality || "Nigeria"}
                onChange={(e) => handleFormInputChange("nationality", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="fatherName" className="block mb-1 text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                id="fatherName"
                type="text"
                placeholder="Enter Father's Name"
                value={formData.fatherName || ""}
                onChange={(e) => handleFormInputChange("fatherName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="motherName" className="block mb-1 text-sm font-medium text-gray-700">
                Mother's Name
              </label>
              <input
                id="motherName"
                type="text"
                placeholder="Enter Mother's Name"
                value={formData.motherName || ""}
                onChange={(e) => handleFormInputChange("motherName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="guardianName" className="block mb-1 text-sm font-medium text-gray-700">
                Guardian's Name
              </label>
              <input
                id="guardianName"
                type="text"
                placeholder="Enter Guardian's Name"
                value={formData.guardianName || ""}
                onChange={(e) => handleFormInputChange("guardianName", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="phoneNumber" className="block mb-1 text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="text"
                placeholder="Enter Phone Number"
                value={formData.phoneNumber || ""}
                onChange={(e) => handleFormInputChange("phoneNumber", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter Email"
                value={formData.email || ""}
                onChange={(e) => handleFormInputChange("email", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="address" className="block mb-1 text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Enter Address"
                value={formData.address || ""}
                onChange={(e) => handleFormInputChange("address", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="currentSession" className="block mb-1 text-sm font-medium text-gray-700">
                Current Session
              </label>
              <input
                id="currentSession"
                type="text"
                placeholder="Enter Current Session (e.g., 2025/2026)"
                value={formData.currentSession || ""}
                onChange={(e) => handleFormInputChange("currentSession", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full">
              <label htmlFor="currentTerm" className="block mb-1 text-sm font-medium text-gray-700">
                Current Term
              </label>
              <select
                id="currentTerm"
                value={formData.currentTerm || ""}
                onChange={(e) => handleFormInputChange("currentTerm", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Term</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="third">Third</option>
              </select>
            </div>
            <div className="flex justify-between col-span-2 mt-4 space-x-4">
              <button
                type="button"
                onClick={() => setStudentStep(1)}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600"
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
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
          <p className="mt-1 text-sm text-gray-600">Add, edit, and manage student records</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg shadow-sm hover:bg-blue-700"
        >
          <FaPlus className="w-4 h-4 mr-2" /> Add Student
        </button>
      </div>

      {/* Search and Filters Section */}
      <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <FaSearch className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filters.classLevel}
            onChange={(e) => setFilters({...filters, classLevel: e.target.value})}
            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Classes</option>
            {classes.map((classItem) => (
              <option key={classItem._id} value={classItem.level}>
                {classItem.level}
              </option>
            ))}
          </select>
          
          <select
            value={filters.section}
            onChange={(e) => setFilters({...filters, section: e.target.value})}
            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Sections</option>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
          
          <select
            value={filters.gender}
            onChange={(e) => setFilters({...filters, gender: e.target.value})}
            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading students...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-center text-red-500">{error}</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-center text-gray-500">No students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Student</th>
                  <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase sm:table-cell">Gender</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Class</th>
                  <th className="hidden px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:table-cell">Section</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="transition-colors duration-200 hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                            <span className="text-sm font-medium text-blue-600">
                              {student.firstName?.charAt(0)}{student.surName?.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.surName}
                          </div>
                          <div className="text-sm text-gray-500 sm:hidden">
                            {student.gender} • {student.section}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-900 whitespace-nowrap sm:table-cell">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        {student.classLevel}
                      </span>
                    </td>
                    <td className="hidden px-6 py-4 text-sm text-gray-900 whitespace-nowrap md:table-cell">
                      {student.section}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 transition-colors duration-200 bg-blue-100 rounded-md hover:bg-blue-200"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowEditModal(true);
                          }}
                        >
                          <FaEdit className="w-3 h-3 mr-1" /> Edit
                        </button>
                        <button
                          className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 transition-colors duration-200 bg-red-100 rounded-md hover:bg-red-200"
                          onClick={() => handleDeleteStudent(student._id)}
                        >
                          <FaTrash className="w-3 h-3 mr-1" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Step {step} of 2: {step === 1 ? 'Select Parent' : 'Student Information'}
                </p>
              </div>
              <button
                onClick={resetAddModal}
                className="p-2 text-gray-400 transition-colors duration-200 rounded-lg hover:text-gray-600 hover:bg-gray-200"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 p-6 overflow-y-auto">
              {step === 1 && (
                <>
                  <div className="p-4 mb-6 border border-orange-200 rounded-lg bg-orange-50">
                    <p className="text-sm text-orange-700">
                      You must select or create a new parent before adding a student
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2">
                    <button
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        parentOption === "new"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setParentOption("new")}
                    >
                      <div className="text-center">
                        <FaPlus className="mx-auto mb-2 text-lg" />
                        <div className="font-medium">New Parent</div>
                        <div className="text-sm opacity-75">Create a new parent account</div>
                      </div>
                    </button>
                    <button
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        parentOption === "existing"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                      onClick={() => setParentOption("existing")}
                    >
                      <div className="text-center">
                        <FaSearch className="mx-auto mb-2 text-lg" />
                        <div className="font-medium">Existing Parent</div>
                        <div className="text-sm opacity-75">Select from existing parents</div>
                      </div>
                    </button>
                  </div>

                  {/* new parent form */}
                  {parentOption === "new" && (
                    <div className="p-6 rounded-lg bg-gray-50">
                      <h3 className="mb-4 text-lg font-medium text-gray-900">Create New Parent Account</h3>
                      <form onSubmit={handleRegisterParent} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter full name"
                              value={parentForm.fullname || ""}
                              onChange={(e) =>
                                setParentForm({ ...parentForm, fullname: e.target.value })
                              }
                              className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Phone Number *
                            </label>
                            <input
                              type="text"
                              placeholder="Enter phone number"
                              value={parentForm.phone || ""}
                              onChange={(e) =>
                                setParentForm({ ...parentForm, phone: e.target.value })
                              }
                              className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1 text-sm font-medium text-gray-700">
                            Address *
                          </label>
                          <input
                            type="text"
                            placeholder="Enter address"
                            value={parentForm.address || ""}
                            onChange={(e) =>
                              setParentForm({ ...parentForm, address: e.target.value })
                            }
                            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              placeholder="Enter email address"
                              value={parentForm.email || ""}
                              onChange={(e) =>
                                setParentForm({ ...parentForm, email: e.target.value })
                              }
                              className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                              Gender *
                            </label>
                            <select
                              value={parentForm.gender || ""}
                              onChange={(e) =>
                                setParentForm({ ...parentForm, gender: e.target.value })
                              }
                              className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-blue-800">
                                Automatic Password Generation
                              </h3>
                              <div className="mt-2 text-sm text-blue-700">
                                <p>A temporary password will be automatically generated and sent to the parent's email address. The password will be created using their personal information for security.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-4">
                          <button
                            type="submit"
                            className="px-6 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            Register Parent & Continue
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* existing parent search */}
                  {parentOption === "existing" && (
                    <div className="p-6 rounded-lg bg-gray-50">
                      <h3 className="mb-4 text-lg font-medium text-gray-900">Select Existing Parent</h3>
                      <div className="space-y-4">
                        <div className="relative">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Search Parent
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <FaSearch className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              placeholder="Search by name or email..."
                              value={parentSearchTerm}
                              onChange={(e) => setParentSearchTerm(e.target.value)}
                              className="w-full py-3 pl-10 pr-10 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              autoComplete="off"
                            />
                            {parentSearchTerm && (
                              <button
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                                onClick={() => {
                                  setParentSearchTerm("");
                                  setSelectedParentId(null);
                                }}
                              >
                                <FaTimes className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                              </button>
                            )}
                          </div>

                          {parentSearchTerm && !selectedParentId && (
                            <div className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg max-h-60">
                              {filteredParents.length > 0 ? (
                                filteredParents.slice(0, 8).map((parent) => (
                                  <div
                                    key={parent._id}
                                    className={`px-4 py-3 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0 ${
                                      selectedParentId === parent._id
                                        ? "bg-blue-50 border-blue-200"
                                        : "hover:bg-gray-50"
                                    }`}
                                    onClick={() => {
                                      setSelectedParentId(parent._id);
                                      setParentSearchTerm(parent.fullname);
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center flex-1 min-w-0">
                                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 bg-blue-100 rounded-full">
                                          <span className="text-sm font-medium text-blue-600">
                                            {parent.fullname?.charAt(0)}
                                          </span>
                                        </div>
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
                                      </div>
                                      {selectedParentId === parent._id && (
                                        <div className="flex-shrink-0 ml-2">
                                          <div className="flex items-center justify-center w-5 h-5 bg-blue-500 rounded-full">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-6 text-sm text-center text-gray-500">
                                  <FaSearch className="mx-auto mb-2 text-gray-400" />
                                  No parents found matching "{parentSearchTerm}"
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Selected parent display and continue button */}
                        {selectedParentId && (
                          <div className="relative z-10 p-4 mt-6 border border-green-200 rounded-lg bg-green-50 shadow-sm">
                            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                              <div className="flex items-center">
                                <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 bg-green-100 rounded-full">
                                  <span className="text-sm font-medium text-green-600">
                                    {parentSearchTerm?.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-green-900">
                                    Selected Parent: {parentSearchTerm}
                                  </p>
                                  <p className="text-xs text-green-600">
                                    Ready to add student information
                                  </p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedParentId(null);
                                    setParentSearchTerm('');
                                  }}
                                  className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                >
                                  Change
                                </button>
                                <button
                                  onClick={() => setStep(2)}
                                  className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
                                >
                                  Continue →
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <StudentForm
                  onSubmit={handleRegisterStudent}
                  classes={classes}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Parent Selection
                </button>
              )}
              {step === 1 && <div></div>}
              <div className="text-sm text-gray-500">
                Step {step} of 2
              </div>
            </div>
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
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl } from "../../utils/baseUrl";

function AddTeacherComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    phone: "",
    gender: "",
    address: "",
    salary: "",
    designation: "",
    status: "full time",
    bankName: "",
    bankAccount: "",
    accountName: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 2;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubjectInputChange = (e) => {
    const value = e.target.value;
    setSubjectInput(value);

    // Clear subjects error when user starts typing
    if (errors.subjects) {
      setErrors({ ...errors, subjects: "" });
    }

    // Check for comma or space to add subject
    if (value.includes(',') || value.includes(' ')) {
      const newSubjects = value
        .split(/[,\s]+/)
        .map(s => s.trim())
        .filter(s => s && !subjects.includes(s));
      
      if (newSubjects.length > 0) {
        setSubjects([...subjects, ...newSubjects]);
      }
      setSubjectInput("");
    }
  };

  const handleSubjectInputKeyDown = (e) => {
    // Add subject on Enter key
    if (e.key === 'Enter' && subjectInput.trim()) {
      e.preventDefault();
      const trimmedSubject = subjectInput.trim();
      if (trimmedSubject && !subjects.includes(trimmedSubject)) {
        setSubjects([...subjects, trimmedSubject]);
      }
      setSubjectInput("");
    }
    // Remove last subject on Backspace if input is empty
    else if (e.key === 'Backspace' && !subjectInput && subjects.length > 0) {
      setSubjects(subjects.slice(0, -1));
    }
  };

  const removeSubject = (indexToRemove) => {
    setSubjects(subjects.filter((_, index) => index !== indexToRemove));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        // Basic Information
        { if (!form.fullname.trim()) newErrors.fullname = "Full name is required";
        if (!form.username.trim()) newErrors.username = "Username (email or phone) is required";
        // Validate if username is either email or phone
        const isEmail = form.username.includes("@");
        const isPhone = /^\+?[\d\s-()]+$/.test(form.username);
        if (!isEmail && !isPhone) {
          newErrors.username = "Username must be a valid email or phone number";
        }
        if (!form.phone.trim()) newErrors.phone = "Phone number is required";
        if (!form.gender) newErrors.gender = "Gender is required";
        break; }

      case 2:
        // Professional Information
        if (!form.designation.trim()) newErrors.designation = "Designation is required";
        if (subjects.length === 0) newErrors.subjects = "At least one subject is required";
        if (!form.salary.trim()) newErrors.salary = "Salary is required";
        if (isNaN(form.salary) || parseFloat(form.salary) <= 0)
          newErrors.salary = "Please enter a valid salary amount";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setForm({
      fullname: "",
      username: "",
      phone: "",
      gender: "",
      address: "",
      salary: "",
      designation: "",
      status: "full time",
      bankName: "",
      bankAccount: "",
      accountName: "",
    });
    setSubjects([]);
    setSubjectInput("");
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps before submission
    let allValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      if (!validateStep(step)) {
        allValid = false;
        setCurrentStep(step);
        break;
      }
    }

    if (!allValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare teacher data matching backend expectations
      const teacherData = {
        fullname: form.fullname,
        username: form.username.trim().toLowerCase(),
        phone: form.phone,
        gender: form.gender,
        address: form.address,
        role: "teacher",
        salary: form.salary,
        designation: form.designation,
        subjects: subjects,
        status: form.status,
        bankName: form.bankName || undefined,
        bankAccount: form.bankAccount || undefined,
        accountName: form.accountName || undefined,
      };

      const response = await axios.post(
        `${baseUrl}/teacher/add-teacher`,
        teacherData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "Teacher added successfully!");
      
      // Reset form and navigate after successful submission
      resetForm();
      
      // Navigate to the add teacher page (refresh the form)
      setTimeout(() => {
        navigate("/dashboard/teachers");
      }, 1500);

    } catch (err) {
      console.error("Error adding teacher:", err);
      const errorMessage = err.response?.data?.message || "Error adding teacher";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 1:
        return "Basic Information";
      case 2:
        return "Professional Details";
      default:
        return "";
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step < currentStep
                  ? "bg-green-500 border-green-500 text-white"
                  : step === currentStep
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-gray-200 border-gray-300 text-gray-500"
              }`}
            >
              {step < currentStep ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                step
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  step <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Step {step}
              </p>
              <p
                className={`text-xs ${
                  step <= currentStep ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {getStepTitle(step)}
              </p>
            </div>
            {step < 2 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  step < currentStep ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
        <svg
          className="w-5 h-5 mr-2 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Personal Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.fullname ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.fullname && (
            <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username (Email or Phone) *
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="email@example.com or phone number"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            This will be used for login. Password will be auto-generated and sent via email.
          </p>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Gender *
          </label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.gender ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
        <svg
          className="w-5 h-5 mr-2 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
          />
        </svg>
        Professional Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Salary *
          </label>
          <input
            type="number"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.salary ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.salary && (
            <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Designation *
          </label>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="e.g., Mathematics Teacher, Head of Science"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.designation ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.designation && (
            <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Employment Status
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="full time">Full Time</option>
            <option value="part time">Part Time</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Subjects *
        </label>
        <div
          className={`w-full min-h-[100px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors duration-200 ${
            errors.subjects ? "border-red-500" : "border-gray-300"
          }`}
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {subjects.map((subject, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 border border-blue-200 rounded-full"
              >
                {subject}
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="inline-flex items-center justify-center w-4 h-4 ml-2 rounded-full hover:bg-blue-200 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={subjectInput}
            onChange={handleSubjectInputChange}
            onKeyDown={handleSubjectInputKeyDown}
            placeholder={
              subjects.length === 0
                ? "Type subject and press Enter, Space, or Comma"
                : "Add another subject..."
            }
            className="w-full outline-none"
          />
        </div>
        {errors.subjects && (
          <p className="mt-1 text-sm text-red-600">{errors.subjects}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Type subject name and press Enter, Space, or Comma to add. Click X to remove.
        </p>
      </div>

      {/* Banking Information as optional fields in Step 2 */}
      <div className="pt-6 mt-6 border-t border-gray-200">
        <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
          <svg
            className="w-5 h-5 mr-2 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Banking Information (Optional)
        </h3>

        <div className="p-4 mb-6 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex">
            <svg
              className="w-5 h-5 text-blue-400 mt-0.5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                Optional Information
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Bank details are optional but recommended for salary payments. You
                can add or update this information later.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Bank Name
            </label>
            <input
              type="text"
              name="bankName"
              value={form.bankName}
              onChange={handleChange}
              className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Account Number
            </label>
            <input
              type="text"
              name="bankAccount"
              value={form.bankAccount}
              onChange={handleChange}
              className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Account Name
            </label>
            <input
              type="text"
              name="accountName"
              value={form.accountName}
              onChange={handleChange}
              className="w-full px-3 py-2 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Teacher</h1>
          <p className="mt-2 text-sm text-gray-600">
            Follow the steps below to add a new teacher to the system. A temporary password will be auto-generated and sent to the teacher's email.
          </p>
        </div>

        {renderStepIndicator()}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl"
        >
          <div className="p-6 min-h-[500px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  Reset
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Next
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2 text-sm font-medium text-white transition-colors duration-200 bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Adding Teacher...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Add Teacher
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTeacherComponent;
import { useState } from "react";

function AddTeacherComponent() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    salary: "",
    subjects: "",
    designation: "",
    bankName: "",
    bankAccount: "",
    accountName: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Simulating API call since axios isn't available in this environment
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage("Teacher added successfully!");
      setForm({
        fullname: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        salary: "",
        subjects: "",
        designation: "",
        bankName: "",
        bankAccount: "",
        accountName: "",
      });
    } catch (err) {
      setMessage("Error adding teacher");
      console.log(err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-4 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto sm:max-w-lg lg:max-w-3xl xl:max-w-4xl">
        <div className="overflow-hidden bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="px-4 py-4 bg-gradient-to-r from-[#284ea1] to-blue-700 sm:px-6">
            <h2 className="text-lg font-bold text-center text-white sm:text-xl lg:text-2xl">
              Add New Teacher
            </h2>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {message && (
              <div className={`p-3 mb-4 text-sm text-center rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-4 sm:space-y-5">
              {/* Personal Information Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="mb-3 text-sm font-semibold text-gray-700 sm:text-base">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  />
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Address"
                  rows="2"
                  className="w-full p-3 mt-4 text-sm transition-colors border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                />
              </div>

              {/* Professional Information Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="mb-3 text-sm font-semibold text-gray-700 sm:text-base">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    placeholder="Salary"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    placeholder="Designation"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                  />
                </div>
                <textarea
                  name="subjects"
                  value={form.subjects}
                  onChange={handleChange}
                  placeholder="Subjects (comma separated)"
                  rows="2"
                  className="w-full p-3 mt-4 text-sm transition-colors border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                />
              </div>

              {/* Banking Information Section */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700 sm:text-base">
                  Banking Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="bankName"
                    value={form.bankName}
                    onChange={handleChange}
                    placeholder="Bank Name"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="accountName"
                    value={form.accountName}
                    onChange={handleChange}
                    placeholder="Account Name"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  />
                  <input
                    type="text"
                    name="bankAccount"
                    value={form.bankAccount}
                    onChange={handleChange}
                    placeholder="Bank Account Number"
                    className="w-full p-3 text-sm transition-colors border border-gray-300 rounded-lg sm:col-span-2 focus:ring-2 focus:ring-[#284ea1] focus:border-[#284ea1] sm:text-base"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full px-4 py-3 text-sm font-semibold text-white transition-colors duration-200 bg-[#284ea1] rounded-lg hover:bg-blue-700 disabled:bg-blue-400 sm:text-base focus:ring-4 focus:ring-blue-200 focus:outline-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Adding Teacher...
                  </div>
                ) : (
                  "Add Teacher"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTeacherComponent;


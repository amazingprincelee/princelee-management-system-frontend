import { useState } from "react";
import axios from "axios";

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
      const res = await axios.post("/api/teachers/add-teacher", form);
      setMessage(res.data.message);
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
      setMessage(err.response?.data?.message || "Error adding teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-5 mx-auto mt-5 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-center">Add New Teacher</h2>

      {message && (
        <div className="p-2 mb-3 text-sm text-center text-white bg-blue-500 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="subjects"
          value={form.subjects}
          onChange={handleChange}
          placeholder="Subjects (comma separated)"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="designation"
          value={form.designation}
          onChange={handleChange}
          placeholder="Designation"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="bankName"
          value={form.bankName}
          onChange={handleChange}
          placeholder="Bank Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="bankAccount"
          value={form.bankAccount}
          onChange={handleChange}
          placeholder="Bank Account Number"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="accountName"
          value={form.accountName}
          onChange={handleChange}
          placeholder="Account Name"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
        >
          {loading ? "Adding Teacher..." : "Add Teacher"}
        </button>
      </form>
    </div>
  );
}

export default AddTeacherComponent;

import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function UpdateTeacher({ teacherId }) {
  const { teacher, loading: teacherLoading, error } = useSelector(
    (state) => state.teachers
  );
  
  // const navigate = useNavigate();

  const [form, setForm] = useState({
    userId: teacherId,
    salary: "",
    subjects: "",
    designation: "",
    bankName: "",
    bankAccount: "",
    accountName: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Prefill form from teacher slice
  useEffect(() => {
    if (teacher && teacher._id === teacherId) {
      setForm({
        userId: teacher._id,
        salary: teacher.salary || "",
        subjects: teacher.subjects?.join(", ") || "",
        designation: teacher.designation || "",
        bankName: teacher.bankDetails?.bankName || "",
        bankAccount: teacher.bankDetails?.bankAccount || "",
        accountName: teacher.bankDetails?.accountName || "",
      });
    }
  }, [teacher, teacherId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        subjects: form.subjects.split(",").map((s) => s.trim()),
      };
      const res = await axios.put("/api/teachers/update", payload);
      setMessage(res.data.message);
      setLoading(false);
      // optional redirect
      // navigate("/teachers");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error updating teacher");
      setLoading(false);
    }
  };

  if (teacherLoading) return <p>Loading teacher data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md p-5 mx-auto mt-5 bg-white rounded-lg shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-center">Update Teacher</h2>

      {message && (
        <div className="p-2 mb-3 text-sm text-center text-white bg-blue-500 rounded">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
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
        />
        <input
          type="text"
          name="bankAccount"
          value={form.bankAccount}
          onChange={handleChange}
          placeholder="Bank Account Number"
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="accountName"
          value={form.accountName}
          onChange={handleChange}
          placeholder="Account Name"
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 text-white transition bg-blue-500 rounded hover:bg-blue-600"
        >
          {loading ? "Updating..." : "Update Teacher"}
        </button>
      </form>
    </div>
  );
}

export default UpdateTeacher;

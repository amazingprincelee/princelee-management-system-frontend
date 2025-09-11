import { useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/baseUrl";

function AddClassModal({ isOpen, onClose, onSuccess }) {
  const [classLevel, setClassLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) return null; // hide modal if closed

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${baseUrl}/class/create`,
        { classLevel },
        {
          headers: {
            Authorization: `Bearer ${token}`, // pass token
          },
        }
      );

      setMessage(res.data.message);
      setLoading(false);
      setClassLevel("");
      if (onSuccess) onSuccess(); // refresh parent list
      // ⚠️ Do NOT close the modal automatically
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating class");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="mb-4 text-lg font-bold">Add New Class</h2>

        {message && (
          <p
            className={`mb-3 text-sm text-center ${
              message.toLowerCase().includes("success")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            placeholder="Enter class level (e.g. Nursary-1, Primary-1,  JSS1, )"
            className="w-full p-2 border rounded"
            required
          />

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClassModal;

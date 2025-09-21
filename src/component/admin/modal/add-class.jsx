import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../../utils/baseUrl";
import { RiDeleteBinLine } from "react-icons/ri";

function AddClassModal({ isOpen, onClose, onSuccess }) {
  const [classLevel, setClassLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState({});

  // Fetch classes on mount
  useEffect(() => {
    if (isOpen) {
      fetchClasses();
    }
  }, [isOpen]);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseUrl}/class`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error fetching classes");
    }
  };

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
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(res.data.message);
      setClassLevel("");
      fetchClasses(); // Refresh class list
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error creating class");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleteLoading((prev) => ({ ...prev, [id]: true }));
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${baseUrl}/class/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      fetchClasses(); // Refresh class list
      if (onSuccess) onSuccess();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting class");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg max-h-[80vh] flex flex-col">
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
            placeholder="Enter class level (e.g. Nursery-1, Primary-1, JSS1)"
            className="w-full p-2 text-sm border rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm text-white bg-primary rounded hover:bg-blue-600"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
        <div className="flex-1 mt-4 overflow-y-auto">
          <h3 className="mb-2 text-sm font-semibold">Existing Classes</h3>
          {classes.length === 0 ? (
            <p className="text-sm text-gray-500">No classes found</p>
          ) : (
            <ul className="space-y-2">
              {classes.map((cls) => (
                <li
                  key={cls._id}
                  className="flex items-center justify-between p-2 text-sm bg-gray-100 rounded"
                >
                  <span>{cls.level}</span>
                  <button
                    onClick={() => handleDelete(cls._id)}
                    disabled={deleteLoading[cls._id]}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    title="Delete class"
                  >
                    {deleteLoading[cls._id] ? (
                      <span className="animate-spin">⌛</span>
                    ) : (
                      <RiDeleteBinLine size={18} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddClassModal;
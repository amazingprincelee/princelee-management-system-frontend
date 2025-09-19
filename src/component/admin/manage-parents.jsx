import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { FaEye, FaTimes, FaSearch } from "react-icons/fa";

function ManageParents() {
  const [parents, setParents] = useState([]);
  const [filteredParents, setFilteredParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    hasChildren: "",
  });

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/admin/parent-withchildren`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setParents(response.data.parents || []);
      } catch (err) {
        setError(err.message || "Failed to fetch parents");
      } finally {
        setLoading(false);
      }
    };
    fetchParents();
  }, []);

  useEffect(() => {
    let filtered = [...parents];

    if (searchTerm) {
      filtered = filtered.filter(
        (parent) =>
          parent.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (parent.phone && parent.phone.includes(searchTerm))
      );
    }

    if (filters.hasChildren === "yes") {
      filtered = filtered.filter(
        (parent) => parent.children && parent.children.length > 0
      );
    } else if (filters.hasChildren === "no") {
      filtered = filtered.filter(
        (parent) => !parent.children || parent.children.length === 0
      );
    }

    setFilteredParents(filtered);
  }, [searchTerm, filters, parents]);

  const handleViewDetails = (parent) => {
    setSelectedParent(parent);
  };

  const handleCloseModal = () => {
    setSelectedParent(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-4 text-xl font-bold">Manage Parents</h1>

      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
        <div className="w-full sm:w-1/3">
          <select
            value={filters.hasChildren}
            onChange={(e) => setFilters({ ...filters, hasChildren: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Parents</option>
            <option value="yes">With Children</option>
            <option value="no">Without Children</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Full Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParents.map((parent) => (
                <tr key={parent._id} className="text-center border-t">
                  <td className="p-2 border">{parent.fullname}</td>
                  <td className="p-2 border">{parent.email}</td>
                  <td className="p-2 border">{parent.phone || "N/A"}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleViewDetails(parent)}
                      className="flex items-center px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <FaEye className="mr-1" /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedParent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg">
            <button
              onClick={handleCloseModal}
              className="absolute text-gray-600 top-2 right-2 hover:text-black"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="mb-4 text-lg font-bold">Parent Details</h2>
            <div className="space-y-4">
              <p><strong>Full Name:</strong> {selectedParent.fullname}</p>
              <p><strong>Email:</strong> {selectedParent.email}</p>
              <p><strong>Phone:</strong> {selectedParent.phone || "N/A"}</p>
              <p><strong>Address:</strong> {selectedParent.address || "N/A"}</p>
              <div>
                <strong>Children:</strong>
                {selectedParent.children && selectedParent.children.length > 0 ? (
                  <ul className="pl-5 mt-2 list-disc">
                    {selectedParent.children.map((child) => (
                      <li key={child._id}>
                        {child.firstName} {child.surName} (Class: {child.classLevel})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2">No children registered</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageParents;
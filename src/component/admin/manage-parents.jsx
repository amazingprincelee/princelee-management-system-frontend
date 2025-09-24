import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { FaEye, FaTimes, FaSearch, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";

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
  
  // Add Parent Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentForm, setParentForm] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    address: "",
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

  const handleAddParent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/admin/register-parent`,
        { ...parentForm, role: "parent" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Show success message with password information
      if (res.data.parentInfo) {
        const { temporaryPassword, emailSent } = res.data.parentInfo;
        if (emailSent) {
          toast.success(
            `Parent registered successfully! Temporary password (${temporaryPassword}) has been sent to their email.`,
            { autoClose: 8000 }
          );
        } else {
          toast.warning(
            `Parent registered successfully! Temporary password: ${temporaryPassword}. Please share this with the parent as email sending failed.`,
            { autoClose: 10000 }
          );
        }
      } else {
        toast.success("Parent registered successfully!");
      }
      
      // Reset form and close modal
      setParentForm({
        fullname: "",
        username: "",
        email: "",
        phone: "",
        address: "",
      });
      setShowAddModal(false);
      
      // Refresh parents list
      const response = await axios.get(`${baseUrl}/admin/parent-withchildren`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParents(response.data.parents || []);
      
    } catch (err) {
      console.error("Error registering parent:", err);
      const errorMessage = err.response?.data?.message || "Failed to register parent. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setParentForm({
      fullname: "",
      username: "",
      email: "",
      phone: "",
      address: "",
    });
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold">Manage Parents</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <FaPlus className="mr-2" />
          Add Parent
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-4 sm:flex-row">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <FaSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
        </div>
        <div className="w-full sm:w-1/3">
          <select
            value={filters.hasChildren}
            onChange={(e) => setFilters({ ...filters, hasChildren: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-light"
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
                      className="flex items-center px-2 py-1 text-sm text-white bg-primary rounded hover:bg-blue-600"
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

      {/* Add Parent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
          <div className="relative w-full max-w-md p-6 bg-white rounded-lg">
            <button
              onClick={handleCloseAddModal}
              className="absolute text-gray-600 top-2 right-2 hover:text-black"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="mb-4 text-lg font-bold">Add New Parent</h2>
            <form onSubmit={handleAddParent} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={parentForm.fullname}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Username (Phone or Email) *
                </label>
                <input
                  type="text"
                  name="username"
                  value={parentForm.username}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter phone or email"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={parentForm.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter email address (optional)"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={parentForm.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={parentForm.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter address"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="flex-1 px-4 py-2 text-gray-700 transition-colors duration-200 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center flex-1 px-4 py-2 text-white transition-colors duration-200 bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    "Add Parent"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageParents;
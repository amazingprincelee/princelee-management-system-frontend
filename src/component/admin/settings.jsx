import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/features/userSlice";
import { FaEdit, FaSave, FaPlus, FaTrash, FaUpload } from "react-icons/fa";

function Settings() {
  const { profile, loading: profileLoading } = useSelector((state) => state.user || { profile: null, loading: false, error: null });
  const dispatch = useDispatch();
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/school-info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchoolInfo(response.data.schoolInfo[0] || {});
        setGalleryImages(response.data.schoolInfo[0]?.photoGallery || []);
      } catch (err) {
        setError("Failed to fetch school information", err);
      }
    };
    fetchSchoolInfo();
    dispatch(fetchUserProfile());

    // Fetch all users (assuming /user/all endpoint)
    const fetchAllUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/user/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllUsers(response.data.users || []);
      } catch (err) {
        setError("Failed to fetch users", err);
      }
    };
    fetchAllUsers();
  }, [dispatch]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    setFormData(schoolInfo || {});
  };

  const handleSaveSchoolInfo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseUrl}/school-info/update/${schoolInfo._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSchoolInfo(formData);
      setEditMode(false);
      setSuccess("School information updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update school information", err);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) return setError("Please select an image");
    const formData = new FormData();
    formData.append("image", selectedImage);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${baseUrl}/school-info/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setSchoolInfo(response.data.school);
      setSuccess("Logo uploaded successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to upload logo", err);
    }
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!galleryImages.length) return setError("Please select gallery images");
    const formData = new FormData();
    galleryImages.forEach((image) => formData.append("images", image));
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${baseUrl}/school-info/upload-gallery`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setSchoolInfo(response.data.school);
      setGalleryImages(response.data.uploadedUrls);
      setSuccess("Gallery images uploaded successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to upload gallery images", err);
    }
  };

  const handleRemoveGalleryImage = async (index) => {
    try {
      const token = localStorage.getItem("token");
      const updatedGallery = galleryImages.filter((_, i) => i !== index);
      await axios.put(`${baseUrl}/school-info/update/${schoolInfo._id}`, { photoGallery: updatedGallery }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGalleryImages(updatedGallery);
      setSuccess("Gallery image removed successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to remove gallery image", err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${baseUrl}/auth/change-password`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Password changed successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to change password", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>

      {/* School Information Section */}
      <div className="p-4 mb-6 border rounded">
        <h2 className="mb-2 text-xl font-semibold">School Information</h2>
        {error && <p className="mb-2 text-red-500">{error}</p>}
        {success && <p className="mb-2 text-green-500">{success}</p>}
        {schoolInfo ? (
          <div>
            {!editMode ? (
              <div>
                <p><strong>Name:</strong> {schoolInfo.schoolName}</p>
                <p><strong>Description:</strong> {schoolInfo.schoolDescription}</p>
                <p><strong>Address:</strong> {schoolInfo.schoolAddress}</p>
                <p><strong>Motto:</strong> {schoolInfo.schoolMotto}</p>
                <p><strong>State:</strong> {schoolInfo.state}</p>
                <p><strong>Country:</strong> {schoolInfo.country}</p>
                {schoolInfo.schoolLogo && <img src={schoolInfo.schoolLogo} alt="School Logo" className="w-32 h-32 mb-2" />}
                <h3 className="mt-2">Photo Gallery</h3>
                <div className="flex flex-wrap gap-2">
                  {galleryImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img src={img} alt={`Gallery ${index}`} className="w-20 h-20" />
                      <button onClick={() => handleRemoveGalleryImage(index)} className="absolute top-0 right-0 text-red-500"><FaTrash /></button>
                    </div>
                  ))}
                </div>
                <button onClick={handleEditToggle} className="flex items-center p-2 mt-4 text-white bg-blue-500 rounded">
                  <FaEdit className="mr-1" /> Edit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveSchoolInfo} className="space-y-4">
                <input
                  type="text"
                  value={formData.schoolName || ""}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="School Name"
                  className="w-full p-2 border rounded"
                />
                <textarea
                  value={formData.schoolDescription || ""}
                  onChange={(e) => setFormData({ ...formData, schoolDescription: e.target.value })}
                  placeholder="School Description"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={formData.schoolAddress || ""}
                  onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                  placeholder="School Address"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={formData.schoolMotto || ""}
                  onChange={(e) => setFormData({ ...formData, schoolMotto: e.target.value })}
                  placeholder="School Motto"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={formData.state || ""}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  value={formData.country || ""}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Country"
                  className="w-full p-2 border rounded"
                />
                <button type="submit" className="flex items-center p-2 text-white bg-green-500 rounded">
                  <FaSave className="mr-1" /> Save
                </button>
                <button type="button" onClick={handleEditToggle} className="p-2 ml-2 text-white bg-gray-500 rounded">
                  Cancel
                </button>
              </form>
            )}
            <div className="mt-4">
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="mb-2"
              />
              <button onClick={handleImageUpload} className="flex items-center p-2 text-white bg-blue-500 rounded">
                <FaUpload className="mr-1" /> Upload Logo
              </button>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={(e) => setGalleryImages([...e.target.files])}
                  className="mb-2"
                />
                <button onClick={handleGalleryUpload} className="flex items-center p-2 text-white bg-blue-500 rounded">
                  <FaUpload className="mr-1" /> Upload Gallery
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading school information...</p>
        )}
      </div>

      {/* User Management Section */}
      <div className="p-4 mb-6 border rounded">
        <h2 className="mb-2 text-xl font-semibold">User Management</h2>
        {profileLoading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{user.fullname}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">
                    <button className="mr-2 text-blue-500"><FaEdit /></button>
                    <button className="text-red-500"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="flex items-center p-2 mt-2 text-white bg-green-500 rounded">
            <FaPlus className="mr-1" /> Add User
          </button>
        </div>
      </div>

      {/* System Preferences Section */}
      <div className="p-4 mb-6 border rounded">
        <h2 className="mb-2 text-xl font-semibold">System Preferences</h2>
        <div className="space-y-4">
          <select className="w-full p-2 border rounded">
            <option value="">Select Time Zone</option>
            <option value="WAT">West Africa Time (WAT)</option>
            {/* Add more time zones as needed */}
          </select>
          <input
            type="text"
            placeholder="Academic Year (e.g., 2024/2025)"
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Security Settings Section */}
      <div className="p-4 border rounded">
        <h2 className="mb-2 text-xl font-semibold">Security Settings</h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <p><strong>Current User:</strong> {profile?.fullname || "Not loaded"}</p>
          <input
            type="password"
            placeholder="Current Password"
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="p-2 text-white bg-blue-500 rounded">
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;
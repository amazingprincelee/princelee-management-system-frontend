import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../redux/features/userSlice";
import { baseUrl } from "../utils/baseUrl";
import axios from "axios";
import { FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaCamera, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";

const ProfileSettings = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  // password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  
  

  // handle profile photo
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) return toast.error("Please select an image");

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", selectedImage);

      await axios.post(`${baseUrl}/user/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile photo updated!");
      dispatch(fetchUserProfile()); // refresh profile
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      setChanging(true);
      const token = localStorage.getItem("token");

      await axios.patch(
        `${baseUrl}/user/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setChanging(false);
    }
  };

  if (loading) return <p className="py-10 text-center">Loading profile...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl p-6 mx-auto mt-10 bg-white shadow-md rounded-2xl">
      {/* Profile Photo Section */}
      <div className="relative flex flex-col items-center">
        {user?.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt="Profile"
            className="object-cover w-32 h-32 border-4 border-gray-200 rounded-full"
          />
        ) : (
          <FaUserCircle className="w-32 h-32 text-gray-400" />
        )}

        <label className="absolute p-2 text-white bg-blue-600 rounded-full cursor-pointer bottom-4 right-36 hover:bg-blue-700">
          <FaCamera />
          <input type="file" className="hidden" onChange={handleImageChange} />
        </label>

        {selectedImage && (
          <button
            onClick={handleUpload}
            className="px-4 py-2 mt-3 text-sm text-white bg-green-600 rounded-lg shadow hover:bg-green-700"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="mt-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center">{user?.fullname || "No Name"}</h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <FaEnvelope /> <span>{user?.email}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <FaMapMarkerAlt /> <span>{user?.address || "No address provided"}</span>
        </div>
      </div>

      {/* Account Info */}
      <div className="pt-6 mt-8 border-t">
        <h3 className="mb-3 text-lg font-medium">Account Info</h3>
        <ul className="space-y-2 text-gray-700">
          <li><strong>Username:</strong> {user?.username}</li>
          <li><strong>User ID:</strong> {user?._id}</li>
          <li><strong>Status:</strong> {user?.isVerified ? "✅ Verified" : "❌ Not Verified"}</li>
        </ul>
      </div>

      {/* Change Password */}
      <div className="pt-6 mt-8 border-t">
        <h3 className="flex items-center gap-2 mb-3 text-lg font-medium">
          <FaLock /> Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
            disabled={changing}
          >
            {changing ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;

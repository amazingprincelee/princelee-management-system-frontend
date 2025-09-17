import React, { useEffect, useState } from "react";
import { baseUrl } from "../../utils/baseUrl"

function SchoolInformation() {
  // State management
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    schoolName: "",
    schoolDescription: "",
    schoolAddress: "",
    schoolMotto: "",
    state: "",
    country: ""
  });

  const [logoFile, setLogoFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [activeTab, setActiveTab] = useState("info");

  

  // Fetch school information
  const fetchSchoolInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/school-info`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setSchool(data.schoolInfo?.[0] || data.schoolInfo || null);
      } else {
        throw new Error(data.message || "Failed to fetch school information");
      }
    } catch (error) {
      setError(error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add school information
  const addSchoolInfo = async (schoolData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/school-info/add`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(schoolData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSchool(data.newSchoolInfo);
        alert(data.message || "School information added successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to add school information");
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update school information
  const updateSchoolInfo = async (schoolId, schoolData) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/school-info/update/${schoolId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(schoolData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setSchool(data.existingSchoolInfo);
        alert(data.message || "School information updated successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to update school information");
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete school information
  const deleteSchoolInfo = async (schoolId) => {
    if (!window.confirm("Are you sure you want to delete this school information? This action cannot be undone.")) {
      return false;
    }

    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/school-info/delete/${schoolId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setSchool(null);
        setFormData({
          schoolName: "",
          schoolDescription: "",
          schoolAddress: "",
          schoolMotto: "",
          state: "",
          country: ""
        });
        alert(data.message || "School information deleted successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to delete school information");
      }
    } catch (error) {
      setError(error.message);
      alert(`Error: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Upload school logo
  const uploadSchoolLogo = async (imageFile) => {
    setUploadLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${baseUrl}/school-info/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setSchool(data.school);
        alert(data.message || "Logo uploaded successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to upload logo");
      }
    } catch (error) {
      setError(error.message);
      alert(`Upload Error: ${error.message}`);
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete school logo
  const deleteSchoolLogo = async () => {
    if (!window.confirm("Are you sure you want to delete the school logo?")) {
      return false;
    }

    setUploadLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/school-info/delete-logo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        setSchool(prev => prev ? { ...prev, schoolLogo: undefined } : null);
        alert(data.message || "Logo deleted successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to delete logo");
      }
    } catch (error) {
      setError(error.message);
      alert(`Delete Error: ${error.message}`);
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  // Upload gallery images
  const uploadGalleryImages = async (imageFiles) => {
    setUploadLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const formData = new FormData();
      Array.from(imageFiles).forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${baseUrl}/school-info/upload-gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        setSchool(data.school);
        alert(data.message || "Gallery images uploaded successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to upload gallery images");
      }
    } catch (error) {
      setError(error.message);
      alert(`Upload Error: ${error.message}`);
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete gallery image
  const deleteGalleryImage = async (imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this gallery image?")) {
      return false;
    }

    setUploadLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(`${baseUrl}/school-info/delete-gallery-image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Remove the deleted image from local state
        setSchool(prev => {
          if (prev && prev.photoGallery) {
            return {
              ...prev,
              photoGallery: prev.photoGallery.filter(url => url !== imageUrl)
            };
          }
          return prev;
        });
        alert(data.message || "Gallery image deleted successfully!");
        return true;
      } else {
        throw new Error(data.message || "Failed to delete gallery image");
      }
    } catch (error) {
      setError(error.message);
      alert(`Delete Error: ${error.message}`);
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  // Load school info on component mount
  useEffect(() => {
    fetchSchoolInfo();
  }, []);

  // Update form data when school data changes
  useEffect(() => {
    if (school) {
      setFormData({
        schoolName: school.schoolName || "",
        schoolDescription: school.schoolDescription || "",
        schoolAddress: school.schoolAddress || "",
        schoolMotto: school.schoolMotto || "",
        state: school.state || "",
        country: school.country || ""
      });
    }
  }, [school]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    
    let success = false;
    if (school && school._id) {
      // Update existing school info
      success = await updateSchoolInfo(school._id, formData);
    } else {
      // Add new school info
      success = await addSchoolInfo(formData);
    }
    
    if (success) {
      // Refresh the data
      fetchSchoolInfo();
    }
  };

  const handleDeleteSchool = async () => {
    if (school && school._id) {
      const success = await deleteSchoolInfo(school._id);
      if (success) {
        // Refresh the data
        fetchSchoolInfo();
      }
    }
  };

  const handleLogoUpload = async (e) => {
    e.preventDefault();
    if (!logoFile) {
      alert('Please select a logo file');
      return;
    }

    const success = await uploadSchoolLogo(logoFile);
    if (success) {
      setLogoFile(null);
      // Reset the file input
      const fileInput = document.getElementById('logo-input');
      if (fileInput) fileInput.value = '';
      
      // Refresh the data
      fetchSchoolInfo();
    }
  };

  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (galleryFiles.length === 0) {
      alert('Please select gallery images');
      return;
    }

    const success = await uploadGalleryImages(galleryFiles);
    if (success) {
      setGalleryFiles([]);
      // Reset the file input
      const fileInput = document.getElementById('gallery-input');
      if (fileInput) fileInput.value = '';
      
      // Refresh the data
      fetchSchoolInfo();
    }
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, JPG, PNG)');
        e.target.value = '';
        return;
      }
      
      // Validate file size (1MB = 1024KB)
      if (file.size / 1024 > 1024) {
        alert('File size should not exceed 1MB');
        e.target.value = '';
        return;
      }
      
      setLogoFile(file);
    }
  };

  const handleGalleryFilesChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Validate each file
      const validFiles = [];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
      for (let file of files) {
        if (!validTypes.includes(file.type)) {
          alert(`${file.name} is not a valid image file (JPEG, JPG, PNG)`);
          continue;
        }
        
        if (file.size / 1024 > 1024) {
          alert(`${file.name} exceeds 1MB size limit`);
          continue;
        }
        
        validFiles.push(file);
      }
      
      if (validFiles.length === 0) {
        e.target.value = '';
      }
      
      setGalleryFiles(validFiles);
    }
  };

  if (loading && !school) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-32 h-32 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl p-6 mx-auto bg-white">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">School Information Settings</h1>
        <p className="text-gray-600">Manage your school's basic information, logo, and photo gallery</p>
      </div>

      {error && (
        <div className="px-4 py-3 mb-6 text-red-700 bg-red-100 border border-red-400 rounded">
          Error: {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'info', label: 'Basic Information', icon: '📝' },
            { id: 'logo', label: 'School Logo', icon: '🎨' },
            { id: 'gallery', label: 'Photo Gallery', icon: '📸' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Basic Information Tab */}
      {activeTab === 'info' && (
        <div className="p-6 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Basic Information</h2>
            {school && school._id && (
              <button
                onClick={handleDeleteSchool}
                disabled={loading}
                className="px-4 py-2 text-white transition duration-200 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete School Info'}
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  School Name *
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  School Motto
                </label>
                <input
                  type="text"
                  name="schoolMotto"
                  value={formData.schoolMotto}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school motto"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                School Description
              </label>
              <textarea
                name="schoolDescription"
                value={formData.schoolDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter school description"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                School Address *
              </label>
              <input
                type="text"
                name="schoolAddress"
                value={formData.schoolAddress}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter complete address"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Country *
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter country"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmitInfo}
                disabled={loading}
                className="px-6 py-2 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (school && school._id ? 'Update Information' : 'Save Information')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logo Upload Tab */}
      {activeTab === 'logo' && (
        <div className="p-6 rounded-lg bg-gray-50">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">School Logo</h2>
          
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Current Logo</h3>
                {school?.schoolLogo && (
                  <button
                    onClick={deleteSchoolLogo}
                    disabled={uploadLoading}
                    className="px-3 py-1 text-sm text-white transition duration-200 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {uploadLoading ? 'Deleting...' : 'Delete Logo'}
                  </button>
                )}
              </div>
              {school?.schoolLogo ? (
                <div className="p-6 text-center bg-white border-2 border-gray-300 border-dashed rounded-lg">
                  <img
                    src={school.schoolLogo}
                    alt="School Logo"
                    className="object-contain max-w-full mx-auto max-h-48"
                  />
                </div>
              ) : (
                <div className="p-8 text-center bg-white border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="mb-2 text-4xl">🏫</div>
                  <p className="text-gray-500">No logo uploaded yet</p>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">Upload New Logo</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Logo File
                  </label>
                  <input
                    id="logo-input"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleLogoFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPEG, JPG, PNG (max 1MB)
                  </p>
                </div>

                {logoFile && (
                  <div className="p-2 text-sm text-gray-600 rounded bg-blue-50">
                    Selected: {logoFile.name}
                  </div>
                )}

                <button
                  onClick={handleLogoUpload}
                  disabled={uploadLoading || !logoFile}
                  className="w-full px-4 py-2 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {uploadLoading ? 'Uploading...' : 'Upload Logo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Tab */}
      {activeTab === 'gallery' && (
        <div className="p-6 rounded-lg bg-gray-50">
          <h2 className="mb-6 text-2xl font-semibold text-gray-900">Photo Gallery</h2>
          
          <div className="mb-8">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Current Gallery</h3>
            {school?.photoGallery && school.photoGallery.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {school.photoGallery.map((image, index) => (
                  <div key={index} className="relative overflow-hidden bg-white rounded-lg shadow-sm group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="object-cover w-full h-48"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => deleteGalleryImage(image)}
                        disabled={uploadLoading}
                        className="px-3 py-2 text-sm text-white transition duration-200 bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {uploadLoading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white border-2 border-gray-300 border-dashed rounded-lg">
                <div className="mb-2 text-4xl">📸</div>
                <p className="text-gray-500">No gallery images uploaded yet</p>
              </div>
            )}
          </div>

          <div className="p-6 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Add New Images</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select Gallery Images
                </label>
                <input
                  id="gallery-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleGalleryFilesChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: JPEG, JPG, PNG (max 1MB each). You can select multiple files.
                </p>
              </div>

              {galleryFiles.length > 0 && (
                <div className="p-2 text-sm text-gray-600 rounded bg-green-50">
                  Selected: {galleryFiles.length} file(s)
                </div>
              )}

              <button
                onClick={handleGalleryUpload}
                disabled={uploadLoading || galleryFiles.length === 0}
                className="w-full px-4 py-2 text-white transition duration-200 bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {uploadLoading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolInformation;
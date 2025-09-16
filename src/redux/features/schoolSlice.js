import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/baseUrl"
import axios from "axios";

// Fetch school information
export const fetchSchoolInfo = createAsyncThunk("school/fetchSchoolInfo", async (_, thunkApi) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return thunkApi.rejectWithValue("No token found");
        }

        const response = await axios.get(`${baseUrl}/school-info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to fetch school information");
    }
});

// Add school information
export const addSchoolInfo = createAsyncThunk("school/addSchoolInfo", async (schoolData, thunkApi) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return thunkApi.rejectWithValue("No token found");
        }

        const response = await axios.post(`${baseUrl}/school-info/add`, schoolData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to add school information");
    }
});

// Update school information
export const updateSchoolInfo = createAsyncThunk("school/updateSchoolInfo", async ({schoolId, schoolData}, thunkApi) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return thunkApi.rejectWithValue("No token found");
        }

        const response = await axios.put(`${baseUrl}/school-info/update/${schoolId}`, schoolData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to update school information");
    }
});

// Upload school logo
export const uploadSchoolLogo = createAsyncThunk("school/uploadSchoolLogo", async (imageFile, thunkApi) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return thunkApi.rejectWithValue("No token found");
        }

        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axios.post(`${baseUrl}/school-info/upload`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to upload school logo");
    }
});

// Upload gallery images
export const uploadGalleryImages = createAsyncThunk("school/uploadGalleryImages", async (imageFiles, thunkApi) => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            return thunkApi.rejectWithValue("No token found");
        }

        const formData = new FormData();
        Array.from(imageFiles).forEach(file => {
            formData.append('images', file);
        });

        const response = await axios.post(`${baseUrl}/school-info/upload-gallery`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data?.message || "Failed to upload gallery images");
    }
});

const schoolSlice = createSlice({
    name: "school",
    initialState: {
        school: null,
        loading: false,
        error: null,
        uploadLoading: false,
        uploadError: null,
        message: null
    },

    reducers: {
        clearMessages: (state) => {
            state.error = null;
            state.uploadError = null;
            state.message = null;
        }
    },

    extraReducers: (builder) => {
        builder
        // Fetch school info
        .addCase(fetchSchoolInfo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchSchoolInfo.fulfilled, (state, action) => {
            state.school = action.payload.schoolInfo;
            state.error = null;
            state.loading = false;
        })
        .addCase(fetchSchoolInfo.rejected, (state, action) => {
            state.error = action.payload;
            state.school = null;
            state.loading = false;
        })

        // Add school info
        .addCase(addSchoolInfo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addSchoolInfo.fulfilled, (state, action) => {
            state.school = action.payload.newSchoolInfo;
            state.loading = false;
            state.message = action.payload.message;
            state.error = null;
        })
        .addCase(addSchoolInfo.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // Update school info
        .addCase(updateSchoolInfo.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateSchoolInfo.fulfilled, (state, action) => {
            state.school = action.payload.existingSchoolInfo;
            state.loading = false;
            state.message = action.payload.message;
            state.error = null;
        })
        .addCase(updateSchoolInfo.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        })

        // Upload logo
        .addCase(uploadSchoolLogo.pending, (state) => {
            state.uploadLoading = true;
            state.uploadError = null;
        })
        .addCase(uploadSchoolLogo.fulfilled, (state, action) => {
            state.school = action.payload.school;
            state.uploadLoading = false;
            state.message = action.payload.message;
            state.uploadError = null;
        })
        .addCase(uploadSchoolLogo.rejected, (state, action) => {
            state.uploadError = action.payload;
            state.uploadLoading = false;
        })

        // Upload gallery
        .addCase(uploadGalleryImages.pending, (state) => {
            state.uploadLoading = true;
            state.uploadError = null;
        })
        .addCase(uploadGalleryImages.fulfilled, (state, action) => {
            state.school = action.payload.school;
            state.uploadLoading = false;
            state.message = action.payload.message;
            state.uploadError = null;
        })
        .addCase(uploadGalleryImages.rejected, (state, action) => {
            state.uploadError = action.payload;
            state.uploadLoading = false;
        });
    }
});

export const { clearMessages } = schoolSlice.actions;
export default schoolSlice.reducer;
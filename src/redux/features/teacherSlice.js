import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/baseUrl";

export const fetchTeachers = createAsyncThunk(
  "teacher/fetchTeachers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return rejectWithValue("No token found");
      }

      const response = await axios.get(`${baseUrl}/teacher/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.teachers; // Return the teachers array directly
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch teachers");
    }
  }
);

const initialState = {
  teachers: [],
  loading: false,
  error: null,
};

const teachersSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.teachers = [];
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
        state.error = null;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.teachers = [];
      });
  },
});

export default teachersSlice.reducer;
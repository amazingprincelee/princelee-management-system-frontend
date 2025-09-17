import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/baseUrl";
import axios from "axios";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, thunkApi) => {
    console.log("🔥 Thunk called");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return thunkApi.rejectWithValue("no token found");
      }

      const response = await axios.get(`${baseUrl}/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
         console.log("❌ Error", error.response?.status);
        // FIXED: error.response?.date → error.response?.data
        return thunkApi.rejectWithValue(error.response?.data || "failed")
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // FIXED: Clear the correct property (user instead of profile)
    clearUser: (state) => {
      state.user = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
         state.loading = false;
        // Store the user data directly, not nested
        state.user = action.payload.user || action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// FIXED: Export the correct action name (clearUser instead of clearProfile)
export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
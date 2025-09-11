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
        return thunkApi.rejectWithValue(error.response?.date || "failed")
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        (state.loading = false), (state.profile = action.payload);
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = userSlice.actions;
export default userSlice.reducer;

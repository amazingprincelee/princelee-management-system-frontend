import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}/auth/login`, { username, password });
      return response.data; // ✅ success path
    } catch (err) {
       if (err.response && err.response.data) {
        
        return rejectWithValue(err.response.data);
        
        
      }
      return rejectWithValue({ message: "Something went wrong" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    token: null,
    role: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.message = action.payload.message; // ✅ backend "login successfully"
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.role = null;
        // 👇 make sure to read from action.payload.message
        state.message = action.payload?.message || "Login failed";
      });
  },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;

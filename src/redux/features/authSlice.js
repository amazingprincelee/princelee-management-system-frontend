import axios from "axios";
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/baseUrl"


export const loginUser = createAsyncThunk(
    "auth/loginUser",

    async({username, password}, thunkApi)=>{
        try {

            const response = await axios.post(`${baseUrl}/auth/login`, {username, password})
            console.log(response);
            return response.data
            
            
        } catch (error) {
            console.log("🔥 Axios error:", error.response?.data);
            return thunkApi.rejectWithValue(error.response?.data || "Login failed")
        }

    }
);


const initialState = {
    message: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    success: false,
    error: null

}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state)=>{
           state.user = null;
           state.token = null;
           state.loading = false;
           state.error = null;
           localStorage.removeItem("token")
        }
    },
    extraReducers: (builder)=>{
        builder

        .addCase(loginUser.pending, (state)=>{
            state.loading = true;
            state.error = null
        })
        .addCase(loginUser.fulfilled, (state, action)=>{
            state.loading = false,
            state.success = action.payload;
            state.token = action.payload.token;
            localStorage.setItem("token", action.payload.token)

        })
        .addCase(loginUser.rejected, (state, action)=>{
           state.loading = false
           state.error = action.payload?.message || "Login failed";
           state.message = action.payload?.message || "Login failed";
        })

    }

});



export const { logout } = authSlice.actions;  
export default authSlice.reducer;             

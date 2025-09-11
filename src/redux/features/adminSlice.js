import axios from "axios";
import { baseUrl } from "../../utils/baseUrl";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



export const fetchadminDashboard = createAsyncThunk("admin/fetchDashboard", async (_, thunkApi)=>{

    try {

        const token = localStorage.getItem('token')

        if(!token){
           return thunkApi.rejectWithValue("no token found")
        }

        const response = await axios.get(`${baseUrl}/admin/dashboard`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
        })

        return response.data
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "failed")
    }

});


const initialState = {
    dashboard: null,
    loading: false,
    error: null
}


const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchadminDashboard.pending, (state)=>{
            state.loading = true;
            state.error = null
        })
        .addCase(fetchadminDashboard.fulfilled, (state, action)=>{
            state.loading = false;
            state.error= null;
            state.dashboard = action.payload
        })
        .addCase(fetchadminDashboard.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload
        })
    }
})


export default adminSlice.reducer;



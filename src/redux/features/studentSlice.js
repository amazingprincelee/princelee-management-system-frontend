import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../../utils/baseUrl"



export const fetchStudents = createAsyncThunk("student/fetchStudents", async (_, thunkApi)=>{

    try {

        const token = localStorage.getItem("token");

        if(!token){
            return thunkApi.rejectWithValue("no token found")
        }

        const response = await axios.get(`${baseUrl}/student/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })


       return response.data
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || "Failed to fetch students")
    }

});



const studentSlice = createSlice({
    name: "students",
    initialState: {
        students: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchStudents.pending, (state)=>{
            state.loading = true;
            state.students = null;
            state.error = null
        })
        .addCase(fetchStudents.fulfilled, (state, action)=>{
            state.students = action.payload.foundStudents
;
            state.loading = false;
            state.error = null
        })
        .addCase(fetchStudents.rejected, (state, action)=>{
            state.error = action.payload;
            state.students = null;
            state.loading = false
        })

    }
});


export default studentSlice.reducer;
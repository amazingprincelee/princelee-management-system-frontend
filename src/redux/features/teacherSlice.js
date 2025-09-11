import axios from "axios";
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/baseUrl"



export const fetchTeachers = createAsyncThunk("teacher/fetchTeachers", async (_, thunkApi)=>{

    try {
          const token = localStorage.getItem('token');

          console.log("the token wey i won send", token);
          

          if(!token){
            return thunkApi.rejectWithValue("No token found")
          }

        const response = await axios.get(`${baseUrl}/teacher`, {
            headers: {
          Authorization: `Bearer ${token}`,
        },
        });

        return response.data
        
    } catch (error) {
       return thunkApi.rejectWithValue(error.response?.data || "failed") 
    }

});


const initialState = {
    teachers: null,
    loading: false,
    error: null
};

const teachersSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        builder
        .addCase(fetchTeachers.pending, (state)=>{
          state.loading = true;
          state.error = null;
          state.teachers = null
        })
        .addCase(fetchTeachers.fulfilled, (state, action)=>{
            state.loading = false;
            state.teachers = action.payload;
            state.error = null
        })
        .addCase(fetchTeachers.rejected, (state, action)=>{
            state.loading = false;
            state.error = action.payload;
            state.teachers = null;
        })
    }

});


export default teachersSlice.reducer
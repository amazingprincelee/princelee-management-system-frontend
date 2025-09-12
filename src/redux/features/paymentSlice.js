import axios from "axios";
import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/baseUrl"




export const fetchPayment = createAsyncThunk("payment/fetchPayment", async (_, thunkApi) => {

    try {
         const token = localStorage.getItem('token')

         if(!token){
            return thunkApi.rejectWithValue("token not found")
         }

         const response = await axios.get(`${baseUrl}/payment`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
         });

         return response.data
        
    } catch (error) {
        return thunkApi.rejectWithValue(error.response?.data || 'failed')
    }

});


const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        payments: null,
        loading: false,
        error: null
    },
    reducers: {
        clearPayment: (state)=>{ state.payments = null}
    },
    extraReducers: (builder)=>{
        builder
        .addCase(fetchPayment.pending, (state)=>{
           state.loading = true,
           state.error = null,
           state.payments = null
        })
        .addCase(fetchPayment.fulfilled, (state, action)=>{
             state.payments = action.payload.payments;
             state.loading = false
             state.error = null
        })
        .addCase(fetchPayment.rejected, (state, action) =>{
            state.error = action.payload;
            state.loading = false;
            state.payments = null;
        } )

    }
});



export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
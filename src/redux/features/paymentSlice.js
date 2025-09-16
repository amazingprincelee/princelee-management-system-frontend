import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../utils/baseUrl";

export const fetchPayment = createAsyncThunk("payment/fetchPayment", async (filters, thunkApi) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkApi.rejectWithValue("Token not found");
    }

    // Build query string from filters
    const query = new URLSearchParams(filters).toString();
    const response = await axios.get(`${baseUrl}/payment?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data || 'Failed to fetch payments');
  }
});

export const approvePayment = createAsyncThunk("payment/approvePayment", async ({ paymentId, installmentId }, thunkApi) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return thunkApi.rejectWithValue("Token not found");
    }

    const response = await axios.put(
      `${baseUrl}/payment/approve-payment`,
      { paymentId, installmentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data || 'Failed to approve payment');
  }
});


export const addPayment = createAsyncThunk('payment/addPayment', async ({formData}, thunkApi) => {
    
   try {
       const token = localStorage.getItem('token');

       if(!token){
        return thunkApi.rejectWithValue("token not found")
       }

       const response = await axios.post(`${baseUrl}/payment/add-payment`, 
        formData,
        {headers: {
          Authorization: `Bearer ${token}`
        }}
        
      );

      return response.data
    
   } catch (error) {
     return thunkApi.rejectWithValue(error.response?.data || "addPayment Failted")
   }



} )

// In your paymentSlice
export const getReceipt = createAsyncThunk(
  'payment/getReceipt',
  async ({ paymentId, installmentId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue("Token not found");
      }

      const response = await axios.get(`${baseUrl}/payment/get-receipt/${paymentId}/${installmentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payments: null,
    loading: false,
    error: null,
    approving: false,
    approveError: null,
    receipt: null,
    receiptLoading: false,
    receiptError: null,
    addPayment: null,
    addPaymentLoading: false,
    addPaymentError: null
  },
  reducers: {
    clearPayment: (state) => {
      state.payments = null;
      state.error = null;
    },
    clearReceipt: (state) => {
      state.receipt = null;
      state.receiptError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.payments = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.payments = action.payload.payments;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
        state.payments = null;
      })
      .addCase(approvePayment.pending, (state) => {
        state.approving = true;
        state.approveError = null;
      })
      .addCase(approvePayment.fulfilled, (state, action) => {
        state.approving = false;
        state.approveError = null;
        // Update the payments list with the updated payment
        if (state.payments) {
          state.payments = state.payments.map((p) =>
            p._id === action.payload.payment._id ? action.payload.payment : p
          );
        }
      })
      .addCase(approvePayment.rejected, (state, action) => {
        state.approving = false;
        state.approveError = action.payload;
      })
      .addCase(getReceipt.pending, (state) => {
        state.receiptLoading = true;
        state.receiptError = null;
        state.receipt = null;
      })
      .addCase(getReceipt.fulfilled, (state, action) => {
        state.receipt = action.payload.receiptUrl;
        state.receiptLoading = false;
        state.receiptError = null;
      })
      .addCase(getReceipt.rejected, (state, action) => {
        state.receiptError = action.payload;
        state.receiptLoading = false;
        state.receipt = null;
      })
      .addCase(addPayment.pending, (state)=>{
        state.addPaymentLoading = true;
        state.addPaymentError = null;
      })
      .addCase(addPayment.fulfilled, (state, action)=>{
        state.addPayment = action.payload
      })
      .addCase(addPayment.rejected, (state, action)=> {
        state.addPaymentError = action.payload;
        state.addPaymentError = null
      })
  },
});

export const { clearPayment, clearReceipt } = paymentSlice.actions;
export default paymentSlice.reducer;
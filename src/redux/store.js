import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import adminReducer from "./features/adminSlice";
import teacherReducer from "./features/teacherSlice";
import paymentReducer from "./features/paymentSlice"



const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        user: userReducer,
        admin: adminReducer,
        teachers: teacherReducer,
        payment: paymentReducer
    }
})


export default store
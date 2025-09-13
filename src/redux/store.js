import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import adminReducer from "./features/adminSlice";
import teacherReducer from "./features/teacherSlice";
import paymentReducer from "./features/paymentSlice";
import studentReducer from "./features/studentSlice"



const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        user: userReducer,
        admin: adminReducer,
        teacher: teacherReducer,
        payment: paymentReducer,
        students: studentReducer
    }
})


export default store
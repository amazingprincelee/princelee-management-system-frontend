import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import userReducer from "./features/userSlice";
import adminReducer from "./features/adminSlice";
import teacherReducer from "./features/teacherSlice"



const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        user: userReducer,
        admin: adminReducer,
        teachers: teacherReducer
    }
})


export default store
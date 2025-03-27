import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/reducer/authReducer"
import postReducer from "../redux/reducer/postReducer"

export const store=configureStore({
    reducer:{
        auth:authReducer,
        postReducer:postReducer
    }
})
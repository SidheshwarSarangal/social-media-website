import {combineReducers} from "@reduxjs/toolkit";

import authReducer from "../slice/authSlice"
import profileReducer from "../slice/profileSlice"


const rootReducer = combineReducers({
    auth: authReducer,
    profile:profileReducer,

})

export default rootReducer
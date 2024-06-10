import { createSlice } from "@reduxjs/toolkit/react";
import { stat } from "fs";

const initialState= {
    token: "",
    user: ""
};

const authSlice= createSlice({
    name:"auth",
    initialState,
    reducers:{
        userRegistration: (state, action)=>{
            state.token = action.payload.token
        },
        userLoggedIn: (state, action)=>{
            state.token = action.payload.accessToken;
            state.user = action.payload.user
        },
        userLoggedOut : (state)=>{
            state.token= "";
            state.user = "";
        }
    }
})

export const {userRegistration, userLoggedIn, userLoggedOut} = authSlice.actions;
import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConectionsRequests, loginUser, registerUser } from "../../action/authAction";

const initialState = {
    user:undefined,
    isError:false,
    isLoading:false,
    isSuccess:false,
    message:"",
    isTokenThere:false,
    loggedIn:false,
    profileFetched:false,
    connections:[],
    connectionRequest:[],
    all_users:[],
    all_profiles_fetched:false
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{

        reset:()=>initialState,
        handleLoginUser:(state)=>{
            state.message="helllo"
        },
        emptyMessage:(state)=>{
            state.message=""
        },
        setTokenIsThere:(state)=>{
            state.isTokenThere=true
        },
        setTokenIsNotThere:(state)=>{
            state.isTokenThere=false
        }

    },

    extraReducers:(builder)=>{
        builder
        .addCase(loginUser.pending,(state)=>{
            state.isLoading=true
            state.message="knocking the door"
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.message="logged in"
            state.loggedIn=true
            state.isError=false
        })
        .addCase(loginUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
        .addCase(registerUser.pending,(state)=>{
            state.isLoading=true
            state.message="registering"
        })
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isSuccess=true
            state.loggedIn=true
            state.isError=false
            state.message="registered"
        })
        .addCase(registerUser.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
        .addCase(getAboutUser.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.profileFetched=true
            state.user=action.payload.profile
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading=false
            state.isError=false
            state.all_profiles_fetched=true
            state.all_users=action.payload.profiles
        })
        .addCase(getConnectionsRequest.fulfilled,(state,action)=>{
            state.connections=action.payload    
        })
        .addCase(getConnectionsRequest.rejected,(state,action)=>{
            state.message=action.payload
        })
        .addCase(getMyConectionsRequests.fulfilled,(state,action)=>{
            state.connectionRequest=action.payload
            
        })
        .addCase(getMyConectionsRequests.rejected,(state,action)=>{
            state.message=action.payload
        })

    }
})

export const {emptyMessage,reset,setTokenIsNotThere,setTokenIsThere}=authSlice.actions


export default authSlice.reducer
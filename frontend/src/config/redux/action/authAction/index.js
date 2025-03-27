import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser=createAsyncThunk(
    "user/login",

    async(user,thunkAPI)=>{
        try{

            const response=await clientServer
            .post("/login",{
               email:user.email,
               password:user.password           
             })

             if(response.data.token){
                localStorage.setItem("token",response.data.token)
             }else{
                return thunkAPI.rejectWithValue({message:"token not provided"})

             }


             return thunkAPI.fulfillWithValue(response.data.token)

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }
    }
)

export const registerUser=createAsyncThunk(
    "user/register",

    async(user,thunkAPI)=>{

        try{

            const request=await clientServer.post("/register",{
                username:user.username,
 
                name:user.name,
                email:user.email,
                password:user.password
            })

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }

    }
)

export const getAboutUser=createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{
        try{
            console.log(user)
            const response=await clientServer.get("/get_user_and_profile",{
                params:{
                    token:user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }
    }
)

export const getAllUsers=createAsyncThunk(
    "user/getAllUsers",
    async(user,thunkAPI)=>{
        try{
            console.log(user)
            const response=await clientServer.get("/user/get_all_users")

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }
    }
    
)

export const sendConnectionRequest=createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            console.log(user)
            const response=await clientServer.post("/user/send_connection_request",{
                token:user.token,
                connectionId:user.user_id
            })

            thunkAPI.dispatch(getConnectionsRequest({token:user.token}))

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }
    }
)

export const getConnectionsRequest=createAsyncThunk(
    "user/getConnectionRequests",
    async(user,thunkAPI)=>{
        try{
            console.log(user)
            const response=await clientServer.get("/user/getConnectionRequests",{
                headers: {
                    Authorization: `Bearer ${user?.token}`, // ✅ Send token in headers
                  },
            })

            return thunkAPI.fulfillWithValue(response.data.conections)

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }
    }
)




export const getMyConectionsRequests=createAsyncThunk(
    "user/getMyConnectionsRequests",
    async(user,thunkAPI)=>{
        try{
            console.log("User Object:", user); // Check if user is defined
            console.log("Token:"); // Check if token exists
            const response=await clientServer.get("/user/user_connection_request",{
                params:{
                    token:user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }
    }
)

export const acceptConnection=createAsyncThunk(
    "user/acceptConnection",
    async(user,thunkAPI)=>{
        try{
            console.log("sending data",{
                token: user.token,
                requestId: user.connectionId, // 🔍 Check if this is undefined
                action_type: user.action,
            })
            const response=await clientServer.post("/user/accept_connection_request",{
                token:user.token,
                requestId:user.connectionId,
                action_type:user.action
            })

            thunkAPI.dispatch(getConnectionsRequest({token:user.tokrn}))
            thunkAPI.dispatch(getConnectionsRequest({token:user.tokrn}))

            return thunkAPI.fulfillWithValue(response.data)

        }catch(error){
            return thunkAPI.rejectWithValue({error:error.message})
        }
    }
)



// ✅ Fetch Connection Requests


// ✅ Fetch My Connection Requests


// ✅ Accept Connection Request


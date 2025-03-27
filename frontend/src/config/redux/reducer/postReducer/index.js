import { getMyConectionsRequests } from "../../action/authAction"
import { getAllComments, getAllPosts } from "../../action/postAction"

const { createSlice } = require("@reduxjs/toolkit")

const initialState={
    posts:[],
    isLoading:false,
    isError:false,
    postFetched:false,
    isLogedIn:false,
    message:"",
    comments:[],
    postId: "",
}

const postSlice=createSlice({
    name:"post",
    initialState,
    reducers:{
        reset:()=>initialState,
        resetPostId:(state)=>{
            state.postId=""
        },
    },
    extraReducers:(builder=>{
        builder
        .addCase(getAllPosts.pending,(state)=>{
            state.isLoading=true
           state.message="fetching posts..."
        })
        .addCase(getAllPosts.fulfilled,(state,action)=>{
            state.isLoading=false
            state.posts=action.payload
            state.postFetched=true
            state.posts=action.payload.posts.reverse()
        })
        .addCase(getAllPosts.rejected,(state,action)=>{
            state.isLoading=false
            state.isError=true
            state.message=action.payload
        })
        .addCase(getAllComments.fulfilled,(state,action)=>{
            state.postId=action.payload.post_id
            state.comments=action.payload.comments
        })
        
    })

})

export const {resetPostId}=postSlice.actions

export default postSlice.reducer
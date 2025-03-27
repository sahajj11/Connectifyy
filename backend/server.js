dotenv.config()

import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import postRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js"

// dotenv.config()

const app=express()

app.use(cors())
app.use(express.json())

app.use(postRoutes)
app.use(userRoutes)

app.use(express.static("uploads"))

const start=async()=>{
    const connectDB=await mongoose.connect(process.env.MONGO_URI)

    app.listen(8080,()=>{
        console.log("server started")
    })
}

start()
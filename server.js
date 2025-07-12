import express from "express";
import cors from "cors";
import "dotenv/config";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import cartRouter from "./routes/cartRouter.js";
import { connectDB } from "./config/prismaDb.js";
import orderRouter from "./routes/orderRouter.js";
const app = express()

const PORT = process.env.PORT || 5000

connectDB()
connectCloudinary()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

app.use("/api/user", userRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.listen(PORT, ()=>{
    console.log(`Server start from ${PORT}`)
})
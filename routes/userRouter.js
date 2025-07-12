import express from "express"
import { userRegister, adminLogin, loginUser, getAllUser } from "../controllers/userController.js"

const userRouter = express.Router()


userRouter.post('/register', userRegister) 
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)
userRouter.get("/users", getAllUser)

export default userRouter;
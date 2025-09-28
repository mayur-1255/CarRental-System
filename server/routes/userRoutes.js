import express from "express";
import { getCars, getUserData, getUserProfile, loginUser, registerUser, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserData)
userRouter.get('/cars', getCars)
userRouter.get('/profile', protect, getUserProfile)
userRouter.put('/profile', protect, updateUserProfile)

export default userRouter;
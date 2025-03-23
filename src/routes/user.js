import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { forgotPassword, getUserProfile, login, logout, register,
     resetPassword, updateProfile, } from "../controllers/user.js";
import { protectedRoute } from "../middleware/middlewares.js";


const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        return cb(null, "./public/userProfile")
    },
    filename: (req, file, cb)=>{
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
        console.log(uniqueName)
        return cb(null, `${uniqueName}-${file.originalname}`)
    }
})
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/update-profile", protectedRoute, upload.single("profilePic"), updateProfile);
router.get("/profile", protectedRoute, getUserProfile);

export default router;
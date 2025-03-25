import { Router } from "express";
import multer from "multer";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import { deleteUser, forgotPassword, getUserProfile, login, logout, register,
     resetPassword, updateProfile, } from "../controllers/user.js";
import { protectedRoute } from "../middleware/middlewares.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: 'dkhq7x5lc',
    api_key: '333898237965564',
    api_secret: 'fnKkWkpN0B2xkL2fCoxnhPO2qmo',
});

const router = Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "userProfile",
        format: async (req, file) => "png",
        public_id: (req, file) => file.originalname.split(".")[0] + "_" + Date.now(),
    },
})
const upload = multer({ storage });

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/delete-user", protectedRoute, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.put("/update-profile", protectedRoute, upload.single("profilePic"), updateProfile);
router.get("/profile", protectedRoute, getUserProfile);

export default router;
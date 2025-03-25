import { Router } from "express";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { createBlog, getAllBlogs, getBlogById } from "../controllers/blog.js";
import { protectedRoute } from "../middleware/middlewares.js";

cloudinary.config({
    cloud_name: 'dkhq7x5lc',
    api_key: '333898237965564',
    api_secret: 'fnKkWkpN0B2xkL2fCoxnhPO2qmo',
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "blogImage",
        fomat: async () => "jpg",
        public_id: (req, file) => "blog_" + Date.now(),
    },
})

const upload = multer({ storage });

const router = Router();

router.post("/create", protectedRoute, upload.single("blogImage"), createBlog);
router.get("/all-blogs", getAllBlogs);
router.get("/blog/:id", getBlogById);

export default router;
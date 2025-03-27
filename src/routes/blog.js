import { Router } from "express";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import multer from "multer";
import { addComment, createBlog, getAllBlogs, getBlogById } from "../controllers/blog.js";
import { protectedRoute } from "../middleware/middlewares.js";
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

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
router.get("/:id",
    //  protectedRoute,
      getBlogById);
router.post("/addComment/:id",
     protectedRoute,
      addComment);

export default router;
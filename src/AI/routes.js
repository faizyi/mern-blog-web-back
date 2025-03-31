import { Router } from "express";
import { generateBlogDescription } from "./controllers.js";

const router = Router();

router.post("/generate-blog-desc", generateBlogDescription)

export default router;
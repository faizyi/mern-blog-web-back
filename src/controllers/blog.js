import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";

export const createBlog = async (req, res) => {
    const { title, description} = req.body;
    const file = req.file;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({ message: "Unauthorized. Please login" });
        if(!file) return res.status(400).json({ message: "Blog image is required" });
        const image = file.path;
        const blog = await Blog.create({ title, description, image, user: req.user._id });
        res.status(201).json({ blog, message: "Blog created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate("user");
        res.status(201).json({ blogs, message: "Blogs fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const getBlogById = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    try {
        const blog = await Blog.findById(id).populate("user");
        res.status(201).json({ blog, message: "Blog fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
import { Blog } from "../models/blog.js";
import { Comment } from "../models/comment.js";
import { User } from "../models/user.js";

export const createBlog = async (req, res) => {
    const { title, description, category } = req.body;
    const file = req.file;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({ message: "Unauthorized. Please login" });
        if (!file) return res.status(400).json({ message: "Blog image is required" });
        const image = file.path;
        const blog = await Blog.create({ title, description, category, image, user: req.user._id });
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
    const { userId } = req.body;
    
    try {
        const blog = await Blog.findById(id).populate("user");
        const comments = await Comment.find({ blog: id }).populate("user");
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (userId && blog.user._id.toString() !== userId) {
            blog.views += 1;
            await blog.save();
        }
        res.status(201).json({ blog, comments, message: "Blog fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const addComment = async (req, res) => {
    const { comment, loginUserId, blogUserId } = req.body;
    const { id } = req.params;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({ message: "Unauthorized. Please login" });
        if (loginUserId === blogUserId) return res.status(400).json({ message: "You cannot comment on your own blog" });
        const comments = await Comment.create({ comment, user: req.user._id, blog: id });
        res.status(201).json({ comments, message: "Comment added successfully, Refesh the page." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}
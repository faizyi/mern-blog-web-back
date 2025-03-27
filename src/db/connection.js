import mongoose from "mongoose";
import { configs } from "../config/config.js";


export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://faiz557564:9G6sbBnJOCB5lsBt@cluster0.syog7.mongodb.net/mern-blog-web?retryWrites=true&w=majority");
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection failed");
    }
}
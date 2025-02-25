import mongoose from "mongoose";
import { configs } from "../config/config.js";


export const connectDB = async () => {
    try {
        await mongoose.connect(configs.mongoUrl);
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection failed");
    }
}
import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    views: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Blog = model("blogs", blogSchema);
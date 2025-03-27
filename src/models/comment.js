import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    comment: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    blog: { type: Schema.Types.ObjectId, ref: "blogs", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Comment = model("comments", commentSchema);
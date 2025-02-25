import jwt from "jsonwebtoken";
import { configs } from "../config/config.js";

export const generateToken = (user) => {
    const payload = {
        name: user.username,
        email: user.email,
        profile: user.profilePic,
        role: user.role,
        id: user._id
    }
    const token = jwt.sign(payload, configs.jwtKey);
    return token
}

export const verifyToken = (token) => {
    if(!token) return null
    try {
        const payload = jwt.verify(token, configs.jwtKey);
        return payload
    } catch (error) {
        return null
    }
}

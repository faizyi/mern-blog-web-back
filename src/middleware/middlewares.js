import { User } from "../models/user.js";
import { verifyToken } from "../services/user.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "You are Unauthorized . Please login"});
        const decode = verifyToken(token);
        if(!decode) return res.status(401).json({message: "You are Unauthorized. Please login"});
        const user = await User.findById(decode.id).select("-password");
        if(!user) return res.status(401).json({message: "You are Unauthorized. Please login"});
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
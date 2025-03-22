import { User } from "../models/user.js";
import { verifyToken } from "../services/services.js";

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({message: "Unauthorized"});
        const decode = verifyToken(token);
        if(!decode) return res.status(401).json({message: "Unauthorized"});
        const user = await User.findById(decode.id).select("-password");
        if(!user) return res.status(401).json({message: "Unauthorized"});
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}
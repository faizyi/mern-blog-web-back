import { User } from "../models/user.js";
import { generateToken, sendResetPasswordEmail } from "../services/services.js";
import crypto from "crypto";
export const register = async(req, res)=>{
    try {
        const {username, email, password} = req.body;
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Someone already registered with this email"});
        const newUser = await new User({username, email, password}).save();
        await newUser.save();
        const token = generateToken(newUser, res)
        const {password: _, ...userData} = newUser.toObject();
        res.status(200).json({message: "User created successfully", userData});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "Invalid credentials"});
        const matchPassword = await user.comparePassword(password);
        if(!matchPassword) return res.status(400).json({message: "Invalid credentials"});
        const token = generateToken(user, res);
        const {password: _, ...userData} = user.toObject();
        res.status(200).json({message: "User logged in successfully", userData});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const logout = (req, res) =>{
    res.clearCookie("jwt").status(200).json({message: "User logged out successfully"});
}

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if(!user) return res.status(404).json({message: "User not found"});
        res.status(200).json({userInfo: user});
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.file) {
            req.body.profilePic = req.file.filename
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.profilePic = req.body.profilePic || user.profilePic;
        if (req.body.newPassword && req.body.currentPassword) {
            const isMatch = await user.comparePassword(req.body.currentPassword);
            if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

            user.password = req.body.newPassword;
        }

        await user.save();

        res.status(200).json({ userInfo: user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const forgotPassword = async (req, res) => {    
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        //generate token
        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpires = Date.now() + 5 * 60 * 1000; // 15 minutes
        await user.save();

        await sendResetPasswordEmail(email, token);

        res.status(200).json({ message: "Password reset link sent successfully to your email." });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { token }= req.params;
        const { password} = req.body;
        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: "Token is invalid or has expired. Please try again." });

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Password Updated successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

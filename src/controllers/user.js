import { Blog } from "../models/blog.js";
import { User } from "../models/user.js";
import { generateToken, sendResetPasswordEmail } from "../services/user.js";
import crypto from "crypto";
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Someone already registered with this email" });
        const newUser = await new User({ username, email, password }).save();
        await newUser.save();
        const token = generateToken(newUser, res)
        const { password: _, ...userData } = newUser.toObject();
        res.status(200).json({ message: "User created successfully", userData });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const matchPassword = await user.comparePassword(password);
        if (!matchPassword) return res.status(400).json({ message: "Invalid credentials" });
        const token = generateToken(user, res);
        const { password: _, ...userData } = user.toObject();
        res.status(200).json({ message: "User logged in successfully", userData });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const logout = (req, res) => {
    res.clearCookie("jwt",{
        httpOnly: true,
        secure: true,
        sameSite: "None",
    }).status(200).json({ message: "User logged out successfully" });
}

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const blog = await Blog.deleteMany({ user: req.user._id });
        res.clearCookie("jwt");
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const getUserProfile = async (req, res) => {
    
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ userInfo: user });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { username, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });
        user.username = username || user.username;
        user.email = email || user.email;
        if (req.file) {
            user.profilePic = req.file.path;
          }
        if (newPassword && !currentPassword) return res.status(400).json({ message: 
            "Current password is required for password change" });
        if (currentPassword && !newPassword) return res.status(400).json({ message:
             "New password is required for password change" });
        if (newPassword && currentPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            user.password = newPassword;
        }
        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
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
        const { token } = req.params;
        const { password } = req.body;
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

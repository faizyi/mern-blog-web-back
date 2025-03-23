import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { configs } from "../config/config.js";

export const generateToken = (user, res) => {
    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, configs.jwtKey);
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
    });
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


export const sendResetPasswordEmail = async (email, token) =>{
    const transpoter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
            user: "faiznoor492@gmail.com",
            pass: "kqgo xojb xlgk urnm"
        }
    });

    const resetLink = `https://mern-blog-web-front.vercel.app/reset-password/${token}`

    const mailOptions = {
        from: "faiznoor492@gmail.com",
        to: email,
        subject: "Password Reset Request",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 5 minutes.</p>`,
    };

    await transpoter.sendMail(mailOptions);
}
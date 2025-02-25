import { User } from "../models/user.js";
import { generateToken } from "../services/services.js";
export const register = async(req, res)=>{
    try {
        const {username, email, password} = req.body;
        console.log(req.body)
        const user = await User.findOne({email});
        if(user) return res.status(400).json({message: "User already exists"});
        const newUser = await new User({username, email, password}).save();
        await newUser.save();
        const token = generateToken(newUser)
        res.status(200).json({message: "User created successfully", token});
    } catch (error) {
        res.status(500).json("Server error");
    }
}


export const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user || !(await comparePassword(password))) res.status(400).json({message: "Invalid credentials"});
        const token = generateToken(user);
        res.status(200).json({message: "User logged in successfully", token});
    } catch (error) {
        res.status(500).json("Server error");
    }
}
import { configDotenv } from "dotenv";
configDotenv();
import axios from "axios";

export const generateBlogDescription = async (req, res) =>{
    const {title} = req.body;
    
    const API_KEY = "AIzaSyAtMWGdefIBKAHlLzUrnJTCZ2j5fMZVEw4"
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAtMWGdefIBKAHlLzUrnJTCZ2j5fMZVEw4`;

    const data = {
        contents: [{ role: "user", parts: [{ text: `Write a 500-word blog description for: "${title}"` }] }]
    };
    

    try {
        // console.log("Sending request to:", url);
        // console.log("Payload:", JSON.stringify(data));
    
        const response = await axios.post(url, data, {
            headers: { 'Content-Type': 'application/json' }
        });
    
        // console.log("AI Response:", response.data);
    
        // Ensure the response format is correct
        const generatedText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedText) throw new Error("Invalid AI response format");
    
        res.status(200).json({ description: generatedText });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    

}

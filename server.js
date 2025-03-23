import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/db/connection.js";
import userRoutes from "./src/routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/public/userProfile", express.static(path.join(__dirname, "public/userProfile")));
app.use(cors({
    origin: "https://mern-blog-web-front.vercel.app",
    credentials: true
}));


//Routes
app.get("/", (req, res)=>{
    res.send("Server")
})
app.use("/user", userRoutes);

//DB Connection
connectDB();

app.listen(PORT, ()=>{
    console.log("Server is running on port ", PORT);
    
})
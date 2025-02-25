import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/db/connection.js";
import userRoutes from "./src/routes/user.js";
const app = express();
const PORT = 5001;


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
// app.use(cors());


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
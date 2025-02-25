import { configDotenv } from "dotenv";

configDotenv();

export const configs = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    jwtKey: process.env.JWT_KEY
}
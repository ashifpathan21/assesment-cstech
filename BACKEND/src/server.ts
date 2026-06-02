import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import { connectDB } from './config/db.js';
const app = express();
connectDB()
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URI
}))

app.listen(port, () => {
    console.log(`Server is running on PORT=${port}`)
})



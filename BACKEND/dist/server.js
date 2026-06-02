import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import RouteV1 from './routes/route.js';
const app = express();
connectDB();
const port = process.env.PORT || 3000;
import './workers/jobWorler.js';
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URI
}));
app.get('/test', (req, res) => {
    res.send("Server is healthy");
});
app.use('/api/v1', RouteV1);
app.listen(port, () => {
    console.log(`Server is running on PORT=${port}`);
});

import 'dotenv/config';
import express from "express";
import connectDB from './config/database.js';
import noticeRoutes from './route/noticeRoute.js';

const app = express();
const PORT = 3000


//Connect to MongoDB
await connectDB();

app.use(express.json());
app.use("/api/v1", noticeRoutes);

app.listen(PORT, () => {
  console.log(`ScreenSage listening on port ${PORT}`);
});
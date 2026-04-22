import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import {authMiddleware} from './middlewares/authMiddleware.js';
import {authRoutes, commentsRoutes, dashboardRoutes, ticketsRoutes} from './routes/index.js';

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use("/", authRoutes);
app.use("/", ticketsRoutes);
app.use("/", commentsRoutes);
app.use("/", dashboardRoutes);

const PORT = process.env.PORT || 4111;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
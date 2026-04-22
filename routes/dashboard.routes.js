import express from 'express';

import client from '../db/client.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {dashboard} from "../controllers/dashbord.controller.js"

const router = express.Router();

router.get('/api/dashboard', authMiddleware, dashboard);

export default router;
import express from 'express'

import {authMiddleware} from '../middlewares/authMiddleware.js'
import {register, login, me} from "../controllers/auth.controller.js"

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.get('/api/auth/me', authMiddleware, me);

export default router;
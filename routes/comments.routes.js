import express from 'express';

import client from '../db/client.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {addComment, findUserComment} from '../controllers/comment.controller.js';

const router = express.Router();

router.post('/api/tickets/:id/comments', authMiddleware, addComment);
router.get('/api/tickets/:id/comments', authMiddleware, findUserComment);

export default router;
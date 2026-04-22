import express from 'express';

import client from '../db/client.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';
import {createTicket, ticketFilter, singleTicket, ticketById, allTickets, updateTicket, updateStatus, assign} from "../controllers/tickets.controller.js"

const router = express.Router();

router.post('/api/tickets', authMiddleware, createTicket);
router.get('/api/tickets', authMiddleware, ticketFilter);
router.get('/api/tickets/:id', authMiddleware, singleTicket);
router.get('/api/tickets/:id', authMiddleware, ticketById);
router.get('/api/tickets', authMiddleware, allTickets);
router.put('/api/tickets/:id', authMiddleware, updateTicket);
router.patch('/api/tickets/:id/status', authMiddleware, updateStatus);
router.patch('/api/tickets/:id/assign', authMiddleware, assign);

export default router;
import express from 'express';

import client from '../db/client.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = express.Router();

export const addComment = async (req, res) => {
  try {
    const {id} = req.params;
    const {message} = req.body;

    const ticketResult = await client.query(
      `SELECT status FROM tickets WHERE id = $1`,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({message: 'Ticket not found'});
    }

    const ticket = ticketResult.rows[0];

    if (ticket.status === 'closed') {
      return res.status(400).json({
        message: 'Cannot add comment to closed ticket'
      });
    }

    const result = await client.query(
      `INSERT INTO comments
        ("ticketId", "authorId", message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [
        id,
        req.user.id,
        message
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};

export const findUserComment = async (req, res) => {
  try {
    const {id} = req.params;

    const result = await client.query(
      `SELECT * FROM comments
       WHERE "ticketId" = $1
       ORDER BY "createdAt" ASC`,
      [id]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};

export default router;
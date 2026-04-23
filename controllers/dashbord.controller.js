import express from 'express';

import client from '../db/client.js';
import {authMiddleware} from '../middlewares/authMiddleware.js';

const router = express.Router();

export const dashboard = async (req, res) => {
  try {
    const total = await client.query(
      `SELECT COUNT(*) FROM tickets`
    );

    const open = await client.query(
      `SELECT COUNT(*) FROM tickets WHERE status = 'open'`
    );

    const closed = await client.query(
      `SELECT COUNT(*) FROM tickets WHERE status = 'closed'`
    );

    res.json({
      totalTickets: total.rows[0].count,
      openTickets: open.rows[0].count,
      closedTickets: closed.rows[0].count,
    });

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};
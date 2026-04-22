import express from 'express';

import client from '../db/client.js';

const router = express.Router();

export const createTicket = async (req, res) => {
  try {
    const {title, description, priority, assignedTo} = req.body;

    const result = await client.query(
      `INSERT INTO tickets 
        (title, description, priority, status, "createdBy", "assignedTo")
       VALUES ($1, $2, $3, 'open', $4, $5)
       RETURNING *`,
      [
        title,
        description,
        priority,
        req.user.id,
        assignedTo
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};

export const ticketFilter = async (req, res) => {
  try {
    const {status, priority, assignedTo, search} = req.query;

    let query = `SELECT * FROM tickets WHERE 1=1`;
    let values = [];
    let i = 1;

    if (status) {
      query += ` AND status = $${i}`;
      values.push(status);
      i++;
    }

    if (priority) {
      query += ` AND priority = $${i}`;
      values.push(priority);
      i++;
    }

    if (assignedTo) {
      query += ` AND "assignedTo" = $${i}`;
      values.push(assignedTo);
      i++;
    }

    if (search) {
      query += ` AND (title ILIKE $${i} OR description ILIKE $${i})`;
      values.push(`%${search}%`);
      i++;
    }

    query += ` ORDER BY "createdAt" DESC`;

    const result = await client.query(query, values);

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Server error'});
  }
};

export const singleTicket = async (req, res) => {
  try {
    const {id} = req.params;

    const result = await client.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({message: 'Ticket not found'});
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Server error'});
  }
};

export const ticketById = async (req, res) => {
  try {
    const {id} = req.params;

    const result = await client.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({message: 'Ticket not found'});
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Server error'});
  }
};

export const allTickets = async (req, res) => {
  try {
    const result = await client.query(
      `SELECT * FROM tickets ORDER BY "createdAt" DESC`
    );

    res.json(result.rows);

  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Server error'});
  }
};

export const updateTicket = async (req, res) => {
  try {
    const {id} = req.params;

    const ticketCheck = await client.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [id]
    );

    if (ticketCheck.rows.length === 0) {
      return res.status(404).json({message: 'Ticket not found'});
    }

    const ticket = ticketCheck.rows[0];

    const {title, description, priority, status, assignedTo} = req.body;

    if (status === 'closed' && ticket.status !== 'resolved') {
      return res.status(400).json({
        message: 'Ticket must be resolved before closing'
      });
    }

    const result = await client.query(
      `UPDATE tickets
       SET title = $1,
           description = $2,
           priority = $3,
           status = $4,
           "assignedTo" = $5
       WHERE id = $6
       RETURNING *`,
      [
        title || ticket.title,
        description || ticket.description,
        priority || ticket.priority,
        status || ticket.status,
        assignedTo ?? ticket.assignedTo,
        id
      ]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};

export const updateStatus = async (req, res) => {
  try {
    const {id} = req.params;
    const {status: newStatus} = req.body;

    console.log(id)

    const ticketResult = await client.query(
      `SELECT status FROM tickets WHERE id = $1`,
      [id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({message: 'Ticket not found'});
    }

    const currentStatus = ticketResult.rows[0].status;

    if (newStatus === 'closed' && currentStatus !== 'resolved') {
      return res.status(400).json({
        message: 'Ticket must be resolved before closing'
      });
    }

    const result = await client.query(
      `UPDATE tickets
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [newStatus, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Server error'});
  }
};

export const assign = async (req, res) => {
  try {
    const {id} = req.params;
    const {assignedTo} = req.body;

    const ticketCheck = await client.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [id]
    );

    if (ticketCheck.rows.length === 0) {
      return res.status(404).json({message: 'Ticket not found'});
    }

    if (assignedTo) {
      const userCheck = await client.query(
        `SELECT id FROM users WHERE id = $1`,
        [assignedTo]
      );

      if (userCheck.rows.length === 0) {
        return res.status(400).json({message: 'Agent not found'});
      }
    }

    const result = await client.query(
      `UPDATE tickets
       SET "assignedTo" = $1
       WHERE id = $2
       RETURNING *`,
      [assignedTo, id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);
    res.status(500).json({message: 'Server error'});
  }
};
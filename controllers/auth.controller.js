import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

import client from '../db/client.js';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;

    const check = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (check.rows.length > 0) {
      return res.status(400).json({message: 'User already exists'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashedPassword, role || 'agent']
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};

export const login = async (req, res) => {
  try {
    const {email, password} = req.body;

    const result = await client.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
      {id: user.id, role: user.role},
      JWT_SECRET,
      {expiresIn: '1d'}
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};

export const me = async (req, res) => {
  try {
    const result = await client.query(
      `SELECT id, name, email, role FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};
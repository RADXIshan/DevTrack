import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";
import { randomUUID } from "crypto";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userExistsResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExistsResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = randomUUID();

    const result = await pool.query(
      "INSERT INTO users (id, name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, email",
      [userId, name, email, passwordHash]
    );

    const user = result.rows[0];

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password_hash))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, bio, github_url, linkedin_url, twitter_url, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      githubUrl: user.github_url,
      linkedinUrl: user.linkedin_url,
      twitterUrl: user.twitter_url,
      createdAt: user.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

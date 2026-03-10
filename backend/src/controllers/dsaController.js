import pool from "../config/db.js";
import { randomUUID } from "crypto";

// @desc    Get user's DSA entries
// @route   GET /api/dsa
export const getDsaEntries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM dsa_entries WHERE user_id = $1 ORDER BY completed_at DESC",
      [req.user.id]
    );
    const entries = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      difficulty: row.difficulty,
      dataStructure: row.data_structure,
      algorithm: row.algorithm,
      timeComplexity: row.time_complexity,
      spaceComplexity: row.space_complexity,
      leetcodeUrl: row.leetcode_url,
      approachThought: row.approach_thought,
      completedAt: row.completed_at,
      userId: row.user_id,
    }));
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a DSA entry
// @route   POST /api/dsa
export const addDsaEntry = async (req, res) => {
  try {
    const { title, difficulty, dataStructure, algorithm, timeComplexity, spaceComplexity, leetcodeUrl, approachThought } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO dsa_entries (id, title, difficulty, data_structure, algorithm, time_complexity, space_complexity, leetcode_url, approach_thought, user_id, completed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [id, title, difficulty || "Easy", dataStructure, algorithm, timeComplexity, spaceComplexity, leetcodeUrl, approachThought, req.user.id]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id, title: row.title, difficulty: row.difficulty,
      dataStructure: row.data_structure, algorithm: row.algorithm,
      timeComplexity: row.time_complexity, spaceComplexity: row.space_complexity,
      leetcodeUrl: row.leetcode_url, approachThought: row.approach_thought,
      completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a DSA entry
// @route   PUT /api/dsa/:id
export const updateDsaEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM dsa_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });

    const { title, difficulty, dataStructure, algorithm, timeComplexity, spaceComplexity, leetcodeUrl, approachThought } = req.body;
    const result = await pool.query(
      `UPDATE dsa_entries SET
        title = COALESCE($1, title),
        difficulty = COALESCE($2, difficulty),
        data_structure = COALESCE($3, data_structure),
        algorithm = COALESCE($4, algorithm),
        time_complexity = COALESCE($5, time_complexity),
        space_complexity = COALESCE($6, space_complexity),
        leetcode_url = COALESCE($7, leetcode_url),
        approach_thought = COALESCE($8, approach_thought)
      WHERE id = $9 RETURNING *`,
      [title, difficulty, dataStructure, algorithm, timeComplexity, spaceComplexity, leetcodeUrl, approachThought, id]
    );
    const row = result.rows[0];
    res.json({
      id: row.id, title: row.title, difficulty: row.difficulty,
      dataStructure: row.data_structure, algorithm: row.algorithm,
      timeComplexity: row.time_complexity, spaceComplexity: row.space_complexity,
      leetcodeUrl: row.leetcode_url, approachThought: row.approach_thought,
      completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a DSA entry
// @route   DELETE /api/dsa/:id
export const deleteDsaEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM dsa_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    await pool.query("DELETE FROM dsa_entries WHERE id = $1", [id]);
    res.json({ message: "Entry removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

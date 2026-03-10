import pool from "../config/db.js";
import { randomUUID } from "crypto";

// @desc    Get user's Database entries
// @route   GET /api/db
export const getDbEntries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM db_entries WHERE user_id = $1 ORDER BY completed_at DESC",
      [req.user.id]
    );
    const entries = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      dbType: row.db_type,
      dbTechnology: row.db_technology,
      conceptsCovered: row.concepts_covered,
      useCase: row.use_case,
      notes: row.notes,
      completedAt: row.completed_at,
      userId: row.user_id,
    }));
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a Database entry
// @route   POST /api/db
export const addDbEntry = async (req, res) => {
  try {
    const { title, dbType, dbTechnology, conceptsCovered, useCase, notes } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO db_entries (id, title, db_type, db_technology, concepts_covered, use_case, notes, user_id, completed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *`,
      [id, title, dbType || "SQL", dbTechnology, conceptsCovered, useCase, notes, req.user.id]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id, title: row.title, dbType: row.db_type,
      dbTechnology: row.db_technology, conceptsCovered: row.concepts_covered,
      useCase: row.use_case, notes: row.notes,
      completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a Database entry
// @route   PUT /api/db/:id
export const updateDbEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM db_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });

    const { title, dbType, dbTechnology, conceptsCovered, useCase, notes } = req.body;
    const result = await pool.query(
      `UPDATE db_entries SET
        title = COALESCE($1, title),
        db_type = COALESCE($2, db_type),
        db_technology = COALESCE($3, db_technology),
        concepts_covered = COALESCE($4, concepts_covered),
        use_case = COALESCE($5, use_case),
        notes = COALESCE($6, notes)
      WHERE id = $7 RETURNING *`,
      [title, dbType, dbTechnology, conceptsCovered, useCase, notes, id]
    );
    const row = result.rows[0];
    res.json({
      id: row.id, title: row.title, dbType: row.db_type,
      dbTechnology: row.db_technology, conceptsCovered: row.concepts_covered,
      useCase: row.use_case, notes: row.notes,
      completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a Database entry
// @route   DELETE /api/db/:id
export const deleteDbEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM db_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    await pool.query("DELETE FROM db_entries WHERE id = $1", [id]);
    res.json({ message: "Entry removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

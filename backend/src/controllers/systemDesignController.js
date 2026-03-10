import pool from "../config/db.js";
import { randomUUID } from "crypto";

// @desc    Get user's System Design entries
// @route   GET /api/systemdesign
export const getSystemDesignEntries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM systemdesign_entries WHERE user_id = $1 ORDER BY completed_at DESC",
      [req.user.id]
    );
    const entries = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      designType: row.design_type,
      components: row.components,
      patterns: row.patterns,
      scalabilityNotes: row.scalability_notes,
      resourcesUrl: row.resources_url,
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

// @desc    Add a System Design entry
// @route   POST /api/systemdesign
export const addSystemDesignEntry = async (req, res) => {
  try {
    const { title, designType, components, patterns, scalabilityNotes, resourcesUrl, notes } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO systemdesign_entries (id, title, design_type, components, patterns, scalability_notes, resources_url, notes, user_id, completed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW()) RETURNING *`,
      [id, title, designType || "HLD", components, patterns, scalabilityNotes, resourcesUrl, notes, req.user.id]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id, title: row.title, designType: row.design_type,
      components: row.components, patterns: row.patterns,
      scalabilityNotes: row.scalability_notes, resourcesUrl: row.resources_url,
      notes: row.notes, completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a System Design entry
// @route   PUT /api/systemdesign/:id
export const updateSystemDesignEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM systemdesign_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });

    const { title, designType, components, patterns, scalabilityNotes, resourcesUrl, notes } = req.body;
    const result = await pool.query(
      `UPDATE systemdesign_entries SET
        title = COALESCE($1, title),
        design_type = COALESCE($2, design_type),
        components = COALESCE($3, components),
        patterns = COALESCE($4, patterns),
        scalability_notes = COALESCE($5, scalability_notes),
        resources_url = COALESCE($6, resources_url),
        notes = COALESCE($7, notes)
      WHERE id = $8 RETURNING *`,
      [title, designType, components, patterns, scalabilityNotes, resourcesUrl, notes, id]
    );
    const row = result.rows[0];
    res.json({
      id: row.id, title: row.title, designType: row.design_type,
      components: row.components, patterns: row.patterns,
      scalabilityNotes: row.scalability_notes, resourcesUrl: row.resources_url,
      notes: row.notes, completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a System Design entry
// @route   DELETE /api/systemdesign/:id
export const deleteSystemDesignEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM systemdesign_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    await pool.query("DELETE FROM systemdesign_entries WHERE id = $1", [id]);
    res.json({ message: "Entry removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

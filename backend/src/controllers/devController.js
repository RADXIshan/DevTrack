import pool from "../config/db.js";
import { randomUUID } from "crypto";

// @desc    Get user's DEV entries
// @route   GET /api/dev
export const getDevEntries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM dev_entries WHERE user_id = $1 ORDER BY completed_at DESC",
      [req.user.id]
    );
    const entries = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      projectType: row.project_type,
      frontendTech: row.frontend_tech,
      backendTech: row.backend_tech,
      databaseTech: row.database_tech,
      otherTech: row.other_tech,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      description: row.description,
      completedAt: row.completed_at,
      userId: row.user_id,
    }));
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a DEV entry
// @route   POST /api/dev
export const addDevEntry = async (req, res) => {
  try {
    const { title, projectType, frontendTech, backendTech, databaseTech, otherTech, githubUrl, liveUrl, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO dev_entries (id, title, project_type, frontend_tech, backend_tech, database_tech, other_tech, github_url, live_url, description, user_id, completed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW()) RETURNING *`,
      [id, title, projectType || "Fullstack", frontendTech, backendTech, databaseTech, otherTech, githubUrl, liveUrl, description, req.user.id]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id, title: row.title, projectType: row.project_type,
      frontendTech: row.frontend_tech, backendTech: row.backend_tech,
      databaseTech: row.database_tech, otherTech: row.other_tech,
      githubUrl: row.github_url, liveUrl: row.live_url,
      description: row.description, completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a DEV entry
// @route   PUT /api/dev/:id
export const updateDevEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM dev_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });

    const { title, projectType, frontendTech, backendTech, databaseTech, otherTech, githubUrl, liveUrl, description } = req.body;
    const result = await pool.query(
      `UPDATE dev_entries SET
        title = COALESCE($1, title),
        project_type = COALESCE($2, project_type),
        frontend_tech = COALESCE($3, frontend_tech),
        backend_tech = COALESCE($4, backend_tech),
        database_tech = COALESCE($5, database_tech),
        other_tech = COALESCE($6, other_tech),
        github_url = COALESCE($7, github_url),
        live_url = COALESCE($8, live_url),
        description = COALESCE($9, description)
      WHERE id = $10 RETURNING *`,
      [title, projectType, frontendTech, backendTech, databaseTech, otherTech, githubUrl, liveUrl, description, id]
    );
    const row = result.rows[0];
    res.json({
      id: row.id, title: row.title, projectType: row.project_type,
      frontendTech: row.frontend_tech, backendTech: row.backend_tech,
      databaseTech: row.database_tech, otherTech: row.other_tech,
      githubUrl: row.github_url, liveUrl: row.live_url,
      description: row.description, completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a DEV entry
// @route   DELETE /api/dev/:id
export const deleteDevEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM dev_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    await pool.query("DELETE FROM dev_entries WHERE id = $1", [id]);
    res.json({ message: "Entry removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

import pool from "../config/db.js";
import { randomUUID } from "crypto";

// @desc    Get user's AI/ML entries
// @route   GET /api/aiml
export const getAimlEntries = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM aiml_entries WHERE user_id = $1 ORDER BY completed_at DESC",
      [req.user.id]
    );
    const entries = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      algorithm: row.algorithm,
      library: row.library,
      paperUrl: row.paper_url,
      dataset: row.dataset,
      modelUsed: row.model_used,
      framework: row.framework,
      keyFindings: row.key_findings,
      completedAt: row.completed_at,
      userId: row.user_id,
    }));
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add an AI/ML entry
// @route   POST /api/aiml
export const addAimlEntry = async (req, res) => {
  try {
    const { title, algorithm, library, paperUrl, dataset, modelUsed, framework, keyFindings } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const id = randomUUID();
    const result = await pool.query(
      `INSERT INTO aiml_entries (id, title, algorithm, library, paper_url, dataset, model_used, framework, key_findings, user_id, completed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *`,
      [id, title, algorithm, library, paperUrl, dataset, modelUsed, framework, keyFindings, req.user.id]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id, title: row.title, algorithm: row.algorithm,
      library: row.library, paperUrl: row.paper_url,
      dataset: row.dataset, modelUsed: row.model_used,
      framework: row.framework, keyFindings: row.key_findings,
      completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update an AI/ML entry
// @route   PUT /api/aiml/:id
export const updateAimlEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM aiml_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });

    const { title, algorithm, library, paperUrl, dataset, modelUsed, framework, keyFindings } = req.body;
    const result = await pool.query(
      `UPDATE aiml_entries SET
        title = COALESCE($1, title),
        algorithm = COALESCE($2, algorithm),
        library = COALESCE($3, library),
        paper_url = COALESCE($4, paper_url),
        dataset = COALESCE($5, dataset),
        model_used = COALESCE($6, model_used),
        framework = COALESCE($7, framework),
        key_findings = COALESCE($8, key_findings)
      WHERE id = $9 RETURNING *`,
      [title, algorithm, library, paperUrl, dataset, modelUsed, framework, keyFindings, id]
    );
    const row = result.rows[0];
    res.json({
      id: row.id, title: row.title, algorithm: row.algorithm,
      library: row.library, paperUrl: row.paper_url,
      dataset: row.dataset, modelUsed: row.model_used,
      framework: row.framework, keyFindings: row.key_findings,
      completedAt: row.completed_at, userId: row.user_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete an AI/ML entry
// @route   DELETE /api/aiml/:id
export const deleteAimlEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await pool.query("SELECT * FROM aiml_entries WHERE id = $1", [id]);
    if (check.rows.length === 0 || check.rows[0].user_id !== req.user.id)
      return res.status(404).json({ message: "Entry not found or unauthorized" });
    await pool.query("DELETE FROM aiml_entries WHERE id = $1", [id]);
    res.json({ message: "Entry removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

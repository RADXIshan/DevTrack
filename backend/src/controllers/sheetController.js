import pool from "../config/db.js";
import { randomUUID } from "crypto";

// @desc    Get sheet progress
// @route   GET /api/sheets/:sheetName
export const getSheetProgress = async (req, res) => {
  try {
    const { sheetName } = req.params;
    
    const result = await pool.query(
      "SELECT * FROM predefined_sheet_progress WHERE user_id = $1 AND sheet_name = $2",
      [req.user.id, sheetName]
    );

    const progress = result.rows.map(row => ({
      id: row.id,
      sheetName: row.sheet_name,
      problemId: row.problem_id,
      status: row.status,
      userId: row.user_id
    }));

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update sheet progress
// @route   POST /api/sheets/:sheetName
export const updateSheetProgress = async (req, res) => {
  try {
    const { sheetName } = req.params;
    const { problemId, status } = req.body;

    if (!problemId || !status) {
      return res.status(400).json({ message: "Problem ID and status required" });
    }

    // Check if record exists
    const checkResult = await pool.query(
      "SELECT * FROM predefined_sheet_progress WHERE user_id = $1 AND sheet_name = $2 AND problem_id = $3",
      [req.user.id, sheetName, problemId]
    );

    let result;
    if (checkResult.rows.length > 0) {
      // Update existing record
      result = await pool.query(
        "UPDATE predefined_sheet_progress SET status = $1 WHERE user_id = $2 AND sheet_name = $3 AND problem_id = $4 RETURNING *",
        [status, req.user.id, sheetName, problemId]
      );
    } else {
      // Insert new record
      const id = randomUUID();
      result = await pool.query(
        "INSERT INTO predefined_sheet_progress (id, user_id, sheet_name, problem_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [id, req.user.id, sheetName, problemId, status]
      );
    }

    const row = result.rows[0];
    const progress = {
      id: row.id,
      sheetName: row.sheet_name,
      problemId: row.problem_id,
      status: row.status,
      userId: row.user_id
    };

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

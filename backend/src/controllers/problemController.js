import pool from "../config/db.js";
import { randomUUID } from "crypto";

// @desc    Get logged in user's problems
// @route   GET /api/problems
export const getProblems = async (req, res) => {
  try {
    const { mode } = req.query;
    
    let query = "SELECT * FROM problem_entries WHERE user_id = $1";
    const params = [req.user.id];
    
    if (mode) {
      query += " AND mode = $2";
      params.push(mode);
    }
    
    query += " ORDER BY completed_at DESC";

    const result = await pool.query(query, params);
    
    const problems = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      leetcodeUrl: row.leetcode_url,
      difficulty: row.difficulty,
      dataStructure: row.data_structure,
      algorithm: row.algorithm,
      pattern: row.pattern,
      approachThought: row.approach_thought,
      mode: row.mode,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      techStack: row.tech_stack,
      paperUrl: row.paper_url,
      modelUsed: row.model_used,
      framework: row.framework,
      completedAt: row.completed_at,
      userId: row.user_id
    }));

    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add a problem
// @route   POST /api/problems
export const addProblem = async (req, res) => {
  try {
    const {
      title,
      leetcodeUrl,
      difficulty,
      dataStructure,
      algorithm,
      pattern,
      approachThought,
      mode,
      githubUrl,
      liveUrl,
      techStack,
      paperUrl,
      modelUsed,
      framework,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const problemId = randomUUID();
    
    const result = await pool.query(
      `INSERT INTO problem_entries (
        id, title, leetcode_url, difficulty, data_structure, algorithm, pattern,
        approach_thought, mode, github_url, live_url, tech_stack, paper_url,
        model_used, framework, user_id, completed_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW())
      RETURNING *`,
      [
        problemId, title, leetcodeUrl, difficulty, dataStructure, algorithm,
        pattern, approachThought, mode || "DSA", githubUrl, liveUrl, techStack,
        paperUrl, modelUsed, framework, req.user.id
      ]
    );

    const row = result.rows[0];
    const problem = {
      id: row.id,
      title: row.title,
      leetcodeUrl: row.leetcode_url,
      difficulty: row.difficulty,
      dataStructure: row.data_structure,
      algorithm: row.algorithm,
      pattern: row.pattern,
      approachThought: row.approach_thought,
      mode: row.mode,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      techStack: row.tech_stack,
      paperUrl: row.paper_url,
      modelUsed: row.model_used,
      framework: row.framework,
      completedAt: row.completed_at,
      userId: row.user_id
    };

    res.status(201).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a problem
// @route   PUT /api/problems/:id
export const updateProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    
    const checkResult = await pool.query(
      "SELECT * FROM problem_entries WHERE id = $1",
      [problemId]
    );

    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== req.user.id) {
      return res.status(404).json({ message: "Problem not found or unauthorized" });
    }

    const {
      title,
      leetcodeUrl,
      difficulty,
      dataStructure,
      algorithm,
      pattern,
      approachThought,
      mode,
      githubUrl,
      liveUrl,
      techStack,
      paperUrl,
      modelUsed,
      framework,
    } = req.body;

    const result = await pool.query(
      `UPDATE problem_entries SET
        title = COALESCE($1, title),
        leetcode_url = COALESCE($2, leetcode_url),
        difficulty = COALESCE($3, difficulty),
        data_structure = COALESCE($4, data_structure),
        algorithm = COALESCE($5, algorithm),
        pattern = COALESCE($6, pattern),
        approach_thought = COALESCE($7, approach_thought),
        mode = COALESCE($8, mode),
        github_url = COALESCE($9, github_url),
        live_url = COALESCE($10, live_url),
        tech_stack = COALESCE($11, tech_stack),
        paper_url = COALESCE($12, paper_url),
        model_used = COALESCE($13, model_used),
        framework = COALESCE($14, framework)
      WHERE id = $15
      RETURNING *`,
      [
        title, leetcodeUrl, difficulty, dataStructure, algorithm, pattern,
        approachThought, mode, githubUrl, liveUrl, techStack, paperUrl,
        modelUsed, framework, problemId
      ]
    );

    const row = result.rows[0];
    const updatedProblem = {
      id: row.id,
      title: row.title,
      leetcodeUrl: row.leetcode_url,
      difficulty: row.difficulty,
      dataStructure: row.data_structure,
      algorithm: row.algorithm,
      pattern: row.pattern,
      approachThought: row.approach_thought,
      mode: row.mode,
      githubUrl: row.github_url,
      liveUrl: row.live_url,
      techStack: row.tech_stack,
      paperUrl: row.paper_url,
      modelUsed: row.model_used,
      framework: row.framework,
      completedAt: row.completed_at,
      userId: row.user_id
    };

    res.json(updatedProblem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/problems/:id
export const deleteProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    
    const checkResult = await pool.query(
      "SELECT * FROM problem_entries WHERE id = $1",
      [problemId]
    );

    if (checkResult.rows.length === 0 || checkResult.rows[0].user_id !== req.user.id) {
      return res.status(404).json({ message: "Problem not found or unauthorized" });
    }

    await pool.query(
      "DELETE FROM problem_entries WHERE id = $1",
      [problemId]
    );

    res.json({ message: "Problem removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

import pool from "../config/db.js";

// @desc    Get user stats for a specific mode
// @route   GET /api/stats
export const getStats = async (req, res) => {
  try {
    const { mode = "DSA" } = req.query;

    const result = await pool.query(
      "SELECT * FROM problem_entries WHERE user_id = $1 AND mode = $2",
      [req.user.id, mode]
    );

    const problems = result.rows;
    const totalSolved = problems.length;

    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
    const patternCounts = {};
    const dsCounts = {};
    const techStackCounts = {};
    const frameworkCounts = {};

    problems.forEach((p) => {
      if (p.difficulty) {
        difficultyCounts[p.difficulty] = (difficultyCounts[p.difficulty] || 0) + 1;
      }
      if (p.pattern) {
        patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
      }
      if (p.data_structure) {
        dsCounts[p.data_structure] = (dsCounts[p.data_structure] || 0) + 1;
      }
      if (p.tech_stack) {
        techStackCounts[p.tech_stack] = (techStackCounts[p.tech_stack] || 0) + 1;
      }
      if (p.framework) {
        frameworkCounts[p.framework] = (frameworkCounts[p.framework] || 0) + 1;
      }
    });

    res.json({
      totalSolved,
      difficultyCounts,
      patternCounts,
      dsCounts,
      techStackCounts,
      frameworkCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

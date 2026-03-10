import pool from "../config/db.js";

// @desc    Get user stats for a specific mode
// @route   GET /api/stats
export const getStats = async (req, res) => {
  try {
    const { mode = "DSA" } = req.query;
    const userId = req.user.id;

    let totalSolved = 0;
    let extraCounts = {};

    switch (mode) {
      case "DSA": {
        const result = await pool.query(
          "SELECT difficulty, time_complexity, data_structure FROM dsa_entries WHERE user_id = $1",
          [userId]
        );
        totalSolved = result.rows.length;
        const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
        const dsCounts = {};
        result.rows.forEach((p) => {
          if (p.difficulty) difficultyCounts[p.difficulty] = (difficultyCounts[p.difficulty] || 0) + 1;
          if (p.data_structure) dsCounts[p.data_structure] = (dsCounts[p.data_structure] || 0) + 1;
        });
        extraCounts = { difficultyCounts, dsCounts };
        break;
      }
      case "DEV": {
        const result = await pool.query(
          "SELECT project_type FROM dev_entries WHERE user_id = $1",
          [userId]
        );
        totalSolved = result.rows.length;
        const projectTypeCounts = {};
        result.rows.forEach((p) => {
          if (p.project_type) projectTypeCounts[p.project_type] = (projectTypeCounts[p.project_type] || 0) + 1;
        });
        extraCounts = { projectTypeCounts };
        break;
      }
      case "AI": {
        const result = await pool.query(
          "SELECT framework, library FROM aiml_entries WHERE user_id = $1",
          [userId]
        );
        totalSolved = result.rows.length;
        const frameworkCounts = {};
        const libraryCounts = {};
        result.rows.forEach((p) => {
          if (p.framework) frameworkCounts[p.framework] = (frameworkCounts[p.framework] || 0) + 1;
          if (p.library) libraryCounts[p.library] = (libraryCounts[p.library] || 0) + 1;
        });
        extraCounts = { frameworkCounts, libraryCounts };
        break;
      }
      case "DB": {
        const result = await pool.query(
          "SELECT db_type, db_technology FROM db_entries WHERE user_id = $1",
          [userId]
        );
        totalSolved = result.rows.length;
        const dbTypeCounts = { SQL: 0, NoSQL: 0, VectorDB: 0 };
        const dbTechCounts = {};
        result.rows.forEach((p) => {
          if (p.db_type) dbTypeCounts[p.db_type] = (dbTypeCounts[p.db_type] || 0) + 1;
          if (p.db_technology) dbTechCounts[p.db_technology] = (dbTechCounts[p.db_technology] || 0) + 1;
        });
        extraCounts = { dbTypeCounts, dbTechCounts };
        break;
      }
      case "SYSTEMDESIGN": {
        const result = await pool.query(
          "SELECT design_type FROM systemdesign_entries WHERE user_id = $1",
          [userId]
        );
        totalSolved = result.rows.length;
        const designTypeCounts = { LLD: 0, HLD: 0, Both: 0 };
        result.rows.forEach((p) => {
          if (p.design_type) designTypeCounts[p.design_type] = (designTypeCounts[p.design_type] || 0) + 1;
        });
        extraCounts = { designTypeCounts };
        break;
      }
      default:
        return res.status(400).json({ message: "Invalid mode" });
    }

    res.json({ totalSolved, ...extraCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

import prisma from "../config/db.js";

// @desc    Get user stats for a specific mode
// @route   GET /api/stats
export const getStats = async (req, res) => {
  try {
    const { mode = "DSA" } = req.query;

    const problems = await prisma.problemEntry.findMany({
      where: {
        userId: req.user.id,
        mode,
      },
    });

    const totalSolved = problems.length;

    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
    const patternCounts = {};
    const dsCounts = {};

    problems.forEach((p) => {
      if (p.difficulty) {
        difficultyCounts[p.difficulty] = (difficultyCounts[p.difficulty] || 0) + 1;
      }
      if (p.pattern) {
        patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
      }
      if (p.dataStructure) {
        dsCounts[p.dataStructure] = (dsCounts[p.dataStructure] || 0) + 1;
      }
    });

    res.json({
      totalSolved,
      difficultyCounts,
      patternCounts,
      dsCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

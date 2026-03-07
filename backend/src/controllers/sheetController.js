import prisma from "../config/db.js";

// @desc    Get sheet progress
// @route   GET /api/sheets/:sheetName
export const getSheetProgress = async (req, res) => {
  try {
    const { sheetName } = req.params;
    
    const progress = await prisma.predefinedSheetProgress.findMany({
      where: {
        userId: req.user.id,
        sheetName,
      },
    });

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

    const progress = await prisma.predefinedSheetProgress.upsert({
      where: {
        userId_sheetName_problemId: {
          userId: req.user.id,
          sheetName,
          problemId,
        },
      },
      update: {
        status,
      },
      create: {
        userId: req.user.id,
        sheetName,
        problemId,
        status,
      },
    });

    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

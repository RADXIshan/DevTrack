import prisma from "../config/db.js";

// @desc    Get logged in user's problems
// @route   GET /api/problems
export const getProblems = async (req, res) => {
  try {
    const { mode } = req.query; // optional "DSA", "DEV", "AI" filter
    const filter = { userId: req.user.id };
    if (mode) {
      filter.mode = mode;
    }

    const problems = await prisma.problemEntry.findMany({
      where: filter,
      orderBy: { completedAt: "desc" },
    });

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

    const problem = await prisma.problemEntry.create({
      data: {
        title,
        leetcodeUrl,
        difficulty,
        dataStructure,
        algorithm,
        pattern,
        approachThought,
        mode: mode || "DSA",
        githubUrl,
        liveUrl,
        techStack,
        paperUrl,
        modelUsed,
        framework,
        userId: req.user.id,
      },
    });

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
    const problem = await prisma.problemEntry.findUnique({
      where: { id: problemId },
    });

    if (!problem || problem.userId !== req.user.id) {
      return res.status(404).json({ message: "Problem not found or unauthorized" });
    }

    const updatedProblem = await prisma.problemEntry.update({
      where: { id: problemId },
      data: {
        ...req.body,
      },
    });

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
    const problem = await prisma.problemEntry.findUnique({
      where: { id: problemId },
    });

    if (!problem || problem.userId !== req.user.id) {
      return res.status(404).json({ message: "Problem not found or unauthorized" });
    }

    await prisma.problemEntry.delete({
      where: { id: problemId },
    });

    res.json({ message: "Problem removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

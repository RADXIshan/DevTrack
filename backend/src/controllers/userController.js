import prisma from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        createdAt: true,
        _count: {
          select: { problems: true }
        }
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, githubUrl, linkedinUrl, twitterUrl } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        bio,
        githubUrl,
        linkedinUrl,
        twitterUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        githubUrl: true,
        linkedinUrl: true,
        twitterUrl: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

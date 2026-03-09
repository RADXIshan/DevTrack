import pool from "../config/db.js";

export const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.bio, u.github_url, u.linkedin_url, u.twitter_url, u.created_at,
       COUNT(p.id) as problem_count
       FROM users u
       LEFT JOIN problem_entries p ON u.id = p.user_id
       WHERE u.id = $1
       GROUP BY u.id`,
      [req.user.id]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      githubUrl: user.github_url,
      linkedinUrl: user.linkedin_url,
      twitterUrl: user.twitter_url,
      createdAt: user.created_at,
      _count: {
        problems: parseInt(user.problem_count)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { bio, githubUrl, linkedinUrl, twitterUrl } = req.body;

    const result = await pool.query(
      `UPDATE users SET
        bio = COALESCE($1, bio),
        github_url = COALESCE($2, github_url),
        linkedin_url = COALESCE($3, linkedin_url),
        twitter_url = COALESCE($4, twitter_url)
      WHERE id = $5
      RETURNING id, name, email, bio, github_url, linkedin_url, twitter_url, created_at`,
      [bio, githubUrl, linkedinUrl, twitterUrl, req.user.id]
    );

    const row = result.rows[0];
    const user = {
      id: row.id,
      name: row.name,
      email: row.email,
      bio: row.bio,
      githubUrl: row.github_url,
      linkedinUrl: row.linkedin_url,
      twitterUrl: row.twitter_url,
      createdAt: row.created_at
    };

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

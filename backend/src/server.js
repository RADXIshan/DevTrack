import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import dsaRoutes from "./routes/dsaRoutes.js";
import devRoutes from "./routes/devRoutes.js";
import aimlRoutes from "./routes/aimlRoutes.js";
import dbRoutes from "./routes/dbRoutes.js";
import systemDesignRoutes from "./routes/systemDesignRoutes.js";
import sheetRoutes from "./routes/sheetRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Simple CORS middleware that works reliably on Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/dev", devRoutes);
app.use("/api/aiml", aimlRoutes);
app.use("/api/db", dbRoutes);
app.use("/api/systemdesign", systemDesignRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/users", userRoutes);

app.get("/", (_, res) => {
  res.json({ message: "Server is live!" });
});

app.get("/health", (_, res) => {
  res.json({ message: "Health OK!" })
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", contactRoute);

app.get("/", (_, res) => {
  res.send("Server is live!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

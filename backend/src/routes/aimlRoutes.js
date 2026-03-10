import express from "express";
import { getAimlEntries, addAimlEntry, updateAimlEntry, deleteAimlEntry } from "../controllers/aimlController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getAimlEntries).post(protect, addAimlEntry);
router.route("/:id").put(protect, updateAimlEntry).delete(protect, deleteAimlEntry);

export default router;

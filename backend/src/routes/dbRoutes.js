import express from "express";
import { getDbEntries, addDbEntry, updateDbEntry, deleteDbEntry } from "../controllers/dbController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDbEntries).post(protect, addDbEntry);
router.route("/:id").put(protect, updateDbEntry).delete(protect, deleteDbEntry);

export default router;

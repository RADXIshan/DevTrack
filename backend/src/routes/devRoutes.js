import express from "express";
import { getDevEntries, addDevEntry, updateDevEntry, deleteDevEntry } from "../controllers/devController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDevEntries).post(protect, addDevEntry);
router.route("/:id").put(protect, updateDevEntry).delete(protect, deleteDevEntry);

export default router;

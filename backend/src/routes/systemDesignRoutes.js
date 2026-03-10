import express from "express";
import { getSystemDesignEntries, addSystemDesignEntry, updateSystemDesignEntry, deleteSystemDesignEntry } from "../controllers/systemDesignController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getSystemDesignEntries).post(protect, addSystemDesignEntry);
router.route("/:id").put(protect, updateSystemDesignEntry).delete(protect, deleteSystemDesignEntry);

export default router;

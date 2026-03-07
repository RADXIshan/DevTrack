import express from "express";
import { getSheetProgress, updateSheetProgress } from "../controllers/sheetController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/:sheetName")
  .get(protect, getSheetProgress)
  .post(protect, updateSheetProgress);

export default router;

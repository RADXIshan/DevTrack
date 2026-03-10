import express from "express";
import { getDsaEntries, addDsaEntry, updateDsaEntry, deleteDsaEntry } from "../controllers/dsaController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getDsaEntries).post(protect, addDsaEntry);
router.route("/:id").put(protect, updateDsaEntry).delete(protect, deleteDsaEntry);

export default router;

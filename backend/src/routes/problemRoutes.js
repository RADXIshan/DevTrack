import express from "express";
import { getProblems, addProblem, updateProblem, deleteProblem } from "../controllers/problemController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(protect, getProblems)
  .post(protect, addProblem);

router.route("/:id")
  .put(protect, updateProblem)
  .delete(protect, deleteProblem);

export default router;

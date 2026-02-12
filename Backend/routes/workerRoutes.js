// routes/workerRoutes.js
import express from "express";
import { 
  getWorkerCases, 
  getRecentWorkerCases, 
  getWorkerProfile,
  getWorkerStats,
  getCaseById 
} from "../controllers/workerController.js";
import authWorker from "../middleware/authWorker.js";

const router = express.Router();

// All routes are protected with authWorker middleware
router.get("/cases", authWorker, getWorkerCases); // Get all cases
router.get("/recent-cases", authWorker, getRecentWorkerCases); // Get 6 recent cases
router.get("/profile", authWorker, getWorkerProfile); // Get worker profile
router.get("/stats", authWorker, getWorkerStats); // Get worker statistics
router.get("/case/:caseId", authWorker, getCaseById); 

export default router;
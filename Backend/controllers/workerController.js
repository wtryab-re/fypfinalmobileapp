// controllers/workerController.js
import Case from "../models/Case.js";
import User from "../models/User.js";

// Get ALL cases in the system (not filtered by worker)
export const getWorkerCases = async (req, res) => {
  try {
    // ✅ CHANGED: Fetch ALL cases, not just this worker's cases
    const cases = await Case.find({})
      .populate("assignedDoctor", "name email") // Populate doctor details if assigned
      .populate("uploadedBy", "name email") // Also populate the worker who uploaded it
      .sort({ createdAt: -1 }); // Sort by newest first

    res.json({
      success: true,
      cases,
      totalCases: cases.length,
    });
  } catch (err) {
    console.error("Error fetching cases:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get recent cases (limited to 6) for dashboard - ALL cases
export const getRecentWorkerCases = async (req, res) => {
  try {
    // ✅ CHANGED: Fetch ALL recent cases, not just this worker's cases
    const cases = await Case.find({})
      .populate("assignedDoctor", "name email")
      .populate("uploadedBy", "name email") // Populate worker info
      .sort({ createdAt: -1 })
      .limit(6);

    console.log('🔍 Fetching ALL cases (not filtered by worker)');
    console.log('📦 Found cases:', cases.length);
    console.log('📦 Cases data:', cases);

    res.json({
      success: true,
      cases,
      totalCases: cases.length,
    });
  } catch (err) {
    console.error("Error fetching recent cases:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get worker profile (this one stays the same)
export const getWorkerProfile = async (req, res) => {
  try {
    const workerId = req.userId;

    // Fetch worker details
    const worker = await User.findById(workerId).select("-password"); // Exclude password

    if (!worker) {
      return res.json({ success: false, message: "Worker not found" });
    }

    res.json({
      success: true,
      worker,
    });
  } catch (err) {
    console.error("Error fetching worker profile:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get worker statistics - now showing ALL cases in system
export const getWorkerStats = async (req, res) => {
  try {
    // ✅ CHANGED: Stats for ALL cases in the system
    const totalCases = await Case.countDocuments({});
    const pendingCases = await Case.countDocuments({ 
      status: { $in: ["PENDING_WORKER_REVIEW", "APPROVED_FOR_AI", "AI_PROCESSING"] }
    });
    const completedCases = await Case.countDocuments({ 
      status: "COMPLETED" 
    });
    const assignedCases = await Case.countDocuments({ 
      status: "ASSIGNED_TO_DOCTOR" 
    });

    res.json({
      success: true,
      stats: {
        totalCases,
        pendingCases,
        completedCases,
        assignedCases,
      },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single case details by ID
export const getCaseById = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findById(caseId)
      .populate("assignedDoctor", "name email")
      .populate("uploadedBy", "name email _id") // ✅ Make sure to populate uploadedBy
      .populate("patientId", "name age gender");

    if (!caseData) {
      return res.json({ success: false, message: "Case not found" });
    }

    console.log('Fetched case:', caseData); // DEBUG
    console.log('uploadedBy:', caseData.uploadedBy); // DEBUG

    res.json({
      success: true,
      case: caseData,
    });
  } catch (err) {
    console.error("Error fetching case details:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
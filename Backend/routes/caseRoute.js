import express from "express";
import multer from "multer";
import Case from "../models/Case.js";
import AIResult from "../models/AIResult.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { sendImageToAI } from "../services/aiService.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload heatmap to Cloudinary
const uploadHeatmapToCloudinary = async (heatmapBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "heatmaps" },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(heatmapBuffer).pipe(stream);
  });
};

// POST /api/cases
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { patientId, patientHistory, manualChecks } = req.body;
    const imageFile = req.file;

    if (!patientId || !patientHistory || !imageFile || !manualChecks) {
      return res.status(400).json({ 
        message: "All fields and manual checks are required." 
      });
    }

    // Parse manualChecks if it comes as a string from FormData
    const checks = typeof manualChecks === "string" 
      ? JSON.parse(manualChecks) 
      : manualChecks;

    // Validate that all checks are true
    if (!checks.isLungs || !checks.isClear || !checks.isVerified) {
      return res.status(400).json({ 
        message: "Manual verification failed. All answers must be Yes." 
      });
    }

    // Upload image buffer to Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "cases" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(imageFile.buffer);

    const newCase = new Case({
      patientId,
      patientHistory,
      imageUrl: result.secure_url,
      manualChecks: checks,
      status: "APPROVED_FOR_AI",
    });

    await newCase.save();

    // Respond immediately to user
    res.status(201).json({ 
      message: "Case created successfully. AI processing initiated.", 
      case: newCase 
    });

    // AI Processing (asynchronous - runs after response is sent)
    processAI(newCase._id, result.secure_url, imageFile.buffer);

  } catch (error) {
    console.error("Error creating case:", error);
    res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
});

// Asynchronous AI processing function
async function processAI(caseId, imageUrl, imageBuffer) {
  try {
    console.log(`[AI Processing] Started for case: ${caseId}`);

    // Send image to Flask AI API
    const aiResponse = await sendImageToAI(imageUrl, imageBuffer);

    if (!aiResponse.success) {
      throw new Error(aiResponse.message || "AI processing failed");
    }

    // Download heatmap from Flask server
    const heatmapUrl = await downloadAndUploadHeatmap(aiResponse.heatmap);

    // Create AIResult document
    const aiResult = new AIResult({
      caseId: caseId,
      qcPass: aiResponse.qc_pass,
      qcResults: aiResponse.qc_results,
      predictions: aiResponse.prediction,
      heatmapUrl: heatmapUrl,
      modelVersion: "MobileNetV2-v1",
    });

    await aiResult.save();

    // Update Case with AIResult reference and status
    await Case.findByIdAndUpdate(caseId, {
      aiResult: aiResult._id,
      status: "AI_PROCESSED",
    });

    console.log(`[AI Processing] Completed successfully for case: ${caseId}`);

  } catch (error) {
    console.error(`[AI Processing] Failed for case ${caseId}:`, error.message);
    
    // Update case with error status
    await Case.findByIdAndUpdate(caseId, {
      status: "AI_FAILED",
      aiError: error.message,
    }).catch(err => console.error("Failed to update case status:", err));
  }
}

// Helper to download heatmap from Flask and upload to Cloudinary
async function downloadAndUploadHeatmap(heatmapFilename) {
  try {
    const fetch = (await import("node-fetch")).default;
    const heatmapUrl = `http://127.0.0.1:8080/heatmap/${heatmapFilename}`;
    
    const response = await fetch(heatmapUrl);
    if (!response.ok) {
      throw new Error("Failed to download heatmap from Flask");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadHeatmapToCloudinary(buffer);
    return cloudinaryUrl;

  } catch (error) {
    console.error("Heatmap upload error:", error.message);
    // Return a placeholder or empty string if heatmap fails
    return "";
  }
}

// GET all cases with AI results (for Flask frontend)
router.get("/all", async (req, res) => {
  try {
    const cases = await Case.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate("aiResult")
      .lean();

    res.status(200).json({ success: true, cases });
  } catch (error) {
    console.error("Error fetching cases:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single case detail - NO AUTH
router.get("/detail/:caseId", async (req, res) => {
  try {
    const { caseId } = req.params;
    
    const caseData = await Case.findById(caseId)
      .populate("aiResult")
      .lean();

    if (!caseData) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    res.status(200).json({ success: true, case: caseData });
  } catch (error) {
    console.error("Error fetching case:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


export default router;
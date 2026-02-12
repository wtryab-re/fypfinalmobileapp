import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    patientHistory: {
      type: String,
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    // Worker who uploaded the case (optional for now)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Case lifecycle status
    status: {
      type: String,
      enum: [
        "PENDING_WORKER_REVIEW",
        "APPROVED_FOR_AI",
        "AI_PROCESSING",
        "AI_PROCESSED",
        "AI_FAILED",
        "ASSIGNED_TO_DOCTOR",
        "COMPLETED",
        "REJECTED",
      ],
      default: "PENDING_WORKER_REVIEW",
    },

    // Manual verification checks by worker
    manualChecks: {
      isLungs: {
        type: Boolean,
        required: true,
      },
      isClear: {
        type: Boolean,
        required: true,
      },
      isVerified: {
        type: Boolean,
        required: true,
      },
    },

    // Will be linked after AI runs
    aiResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIResult",
      default: null,
    },

    // Track AI errors if processing fails
    aiError: {
      type: String,
      default: null,
    },

    // Will be set when a doctor accepts the case
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  },
);

const Case = mongoose.model("Case", caseSchema);

export default Case;

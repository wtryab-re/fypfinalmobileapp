import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import caseRouter from "./routes/caseRoute.js";
import workerRoutes from "./routes/workerRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cases", caseRouter);
app.use("/api/worker", workerRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🔥");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "fypdb", // Specify the database name
  })
  .then(() => {
    console.log("\n\nMongoDB Connected Successfully to fypdb");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on port ${PORT}`),
    );
  })
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

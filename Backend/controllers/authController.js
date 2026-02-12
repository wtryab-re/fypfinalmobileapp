//controllers/authController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Case from "../models/Case.js";

// Register User (Patient or Worker)
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      phoneNumber,
      cnic,
      email,
      password,
      role,
      workerID,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !age ||
      !gender ||
      !phoneNumber ||
      !cnic ||
      !email ||
      !password ||
      !role ||
      (role === "worker" && !workerID)
    ) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { cnic }] });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User with this email or CNIC already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      age,
      gender,
      phoneNumber,
      cnic,
      email,
      password: hashedPassword,
      role,
      isApproved: role === "patient" ? true : false, // Auto-approve patients, workers need approval
      workerID: role === "worker" ? workerID : null,
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message:
        role === "worker"
          ? "Registration successful! Your account is pending admin approval."
          : "Registration successful!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.isApproved,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login User (Patient or Worker)
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check if worker is approved
    if (user.role === "worker" && !user.isApproved) {
      return res.json({
        success: false,
        message:
          "Your account is pending admin approval. Please wait for approval before logging in.",
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const userCases = (await Case.find({ patientId: user._id })) || [];

    res.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
      userCases: userCases,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

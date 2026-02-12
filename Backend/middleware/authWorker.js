// middlewares/authWorker.js
import jwt from "jsonwebtoken";

const authWorker = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Please login again" });
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ FIXED: Use req.userId instead of req.body.userId
    req.userId = token_decode.id;
    
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authWorker;
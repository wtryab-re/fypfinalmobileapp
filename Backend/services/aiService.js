import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";

const AI_BASE_URL = "http://127.0.0.1:8080"; // Flask API - use IPv4

export const sendImageToAI = async (imageUrl, imageBuffer) => {
  try {
    const fetch = (await import("node-fetch")).default;
    
    let buffer = imageBuffer;

    // If buffer not provided, download from Cloudinary URL
    if (!buffer) {
      console.log("Downloading image from Cloudinary...");
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image from Cloudinary");
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    console.log(`Sending image to AI... Buffer size: ${buffer.length} bytes`);

    // Create a readable stream from buffer
    const stream = Readable.from(buffer);

    // Prepare form-data
    const formData = new FormData();
    formData.append("file", stream, {
      filename: "xray.jpg",
      contentType: "image/jpeg",
      knownLength: buffer.length
    });

    // Send POST request to Flask AI endpoint
    const aiResponse = await axios.post(`${AI_BASE_URL}/api/predict`, formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 120000, // 120 sec timeout (was 60)
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      validateStatus: (status) => status < 600, // Don't throw on 4xx/5xx
    });

    console.log("AI Response received:", aiResponse.data.success ? "Success" : "Failed");
    return aiResponse.data; // JSON returned by Flask

  } catch (err) {
    console.error("Error sending image to AI:", err.message);
    if (err.response) {
      console.error("Flask error response:", err.response.data);
      console.error("Flask status code:", err.response.status);
    }
    return { 
      success: false, 
      message: err.response?.data?.message || err.message || "AI request failed" 
    };
  }
};
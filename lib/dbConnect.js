// lib/dbConnect.js
import mongoose from "mongoose";

let isConnected = false; // track connection

export default async function dbConnect() {
  if (isConnected) {
    // ✅ Already connected
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = db.connections[0].readyState;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

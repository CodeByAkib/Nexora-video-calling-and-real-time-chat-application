import mongoose from "mongoose";

export const connectDB = async (uri) => {
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Message only - never log the connection string or the raw error object.
    console.error("Error in connecting to MongoDB:", error.message);
    process.exit(1); // 1 means failure
  }
};

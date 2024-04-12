import mongoose from "mongoose";

const dbConnect = async (): Promise<void> => {
  try {
    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) throw new Error("MONGODB_URI is not defined");

    // Check if a connection already exists
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB connection already exists");
      return;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongodbUri);
    console.log("Connected to MongoDB.");
  } catch (error: any) {
    console.log("Error while connecting with the database", error.message);
    process.exit(1);
  }
};

export default dbConnect;

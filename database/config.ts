import mongoose from "mongoose";

export const Connect = async () => {
  try {
    const mongodbUri = process.env.MONGODB_URI;

    if (!mongodbUri) throw new Error("MONGODB_URI is not defined");

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongodbUri);
    console.log("Connected to MongoDB.");
  } catch (error: any) {
    console.log("Error while connecting with the database", error.message);
  }
};

export const Disconnect = async () => {
  try {
    console.log("Disconnecting from MongoDB...");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error: any) {
    console.log("Error while disconnecting from the database", error.message);
  }
};

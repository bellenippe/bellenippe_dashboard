import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("Using existing connection");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL || "", {
      dbName: "bellenippe",
    });
    isConnected = true;
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database", error);
  }
};

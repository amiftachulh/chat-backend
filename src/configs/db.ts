import { MONGODB_URI } from "./env";
import mongoose from "mongoose";

export async function connectDb() {
  console.log("Connecting to the database...");
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

mongoose.connection.once("open", () => {
  console.log("Connected to the database.");
});

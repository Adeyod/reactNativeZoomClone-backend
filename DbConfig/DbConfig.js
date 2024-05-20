import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const DbConfig = mongoose
  .connect(process.env.MONGODB_URL)
  .then((res) => {
    console.log(
      `MongoDB connected successfully to host ${mongoose.connection.host}`
    );
  })
  .catch((error) => {
    console.log(`MongoDB connection failed: ${error}`);
    process.exit(1);
  });

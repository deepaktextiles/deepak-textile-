import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "mqbs9z4j",
  api_key: process.env.CLOUDINARY_API_KEY || "236483846328754",
  api_secret: process.env.CLOUDINARY_API_SECRET || "hW9B7ixEes5xJQoWP8xucbYBKF0",
  secure: true,
});

export const isCloudinaryConfigured = () => {
  return Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET) ||
      process.env.CLOUDINARY_URL
  );
};

export default cloudinary;

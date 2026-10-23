import fs from "fs";
import path from "path";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";

export const uploadImage = async (req, res) => {
  try {
    const { image, filename = "upload", folder = "deepak_textiles" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    // Validate base64 format or URL
    const isDataUri = image.startsWith("data:");
    if (!isDataUri && !image.startsWith("http://") && !image.startsWith("https://")) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format. Expected base64 data URL or HTTP link.",
      });
    }

    // 1. Prioritize Cloudinary Upload
    if (isCloudinaryConfigured()) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: folder,
          resource_type: "auto",
          tags: ["deepak_textiles", "b2b_catalog"],
        });

        return res.status(200).json({
          success: true,
          message: "Image successfully uploaded to Cloudinary.",
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
          format: uploadResponse.format,
          bytes: uploadResponse.bytes,
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed, falling back to local file storage:", cloudinaryError.message);
      }
    }

    // 2. Fallback: Local Storage (in case Cloudinary is offline or unconfigured)
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Invalid base64 data URL format.",
      });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // 10MB limit
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Image exceeds 10MB limit.",
      });
    }

    let ext = "jpg";
    if (mimeType.includes("png")) ext = "png";
    else if (mimeType.includes("webp")) ext = "webp";
    else if (mimeType.includes("avif")) ext = "avif";
    else if (mimeType.includes("svg")) ext = "svg";
    else if (mimeType.includes("gif")) ext = "gif";

    const uniqueName = `upload-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}.${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueName);
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueName}`;

    return res.status(200).json({
      success: true,
      message: "Image saved to local storage.",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image.",
    });
  }
};

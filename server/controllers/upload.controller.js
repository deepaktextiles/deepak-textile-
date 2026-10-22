import fs from "fs";
import path from "path";

export const uploadImage = async (req, res) => {
  try {
    const { image, filename = "upload" } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "No image file provided.",
      });
    }

    // Match base64 data URL
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({
        success: false,
        message: "Invalid image format. Expected base64 data URL.",
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

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully from device.",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload image.",
    });
  }
};

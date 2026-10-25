import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedAdmin } from "../../../lib/auth.js";
import cloudinary, { isCloudinaryConfigured } from "../../../server/config/cloudinary.js";

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { image, folder = "deepak_textiles" } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, message: "No image file provided." },
        { status: 400 }
      );
    }

    // 1. Cloudinary upload if configured
    if (isCloudinaryConfigured()) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: folder,
          resource_type: "auto",
          tags: ["deepak_textiles", "b2b_catalog"],
        });

        return NextResponse.json({
          success: true,
          message: "Image successfully uploaded to Cloudinary.",
          url: uploadResponse.secure_url,
          public_id: uploadResponse.public_id,
        });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError.message);
      }
    }

    // 2. Local filesystem fallback (if running in Node/local environment)
    const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { success: false, message: "Invalid image format." },
        { status: 400 }
      );
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    let ext = "jpg";
    if (mimeType.includes("png")) ext = "png";
    else if (mimeType.includes("webp")) ext = "webp";
    else if (mimeType.includes("avif")) ext = "avif";

    const uniqueName = `upload-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}.${ext}`;

    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, uniqueName);
      await fs.promises.writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: "Image saved successfully.",
        url: `/uploads/${uniqueName}`,
      });
    } catch {
      // In serverless environments where filesystem is read-only, return data URI if small
      return NextResponse.json({
        success: true,
        message: "Image processed.",
        url: image,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to upload image." },
      { status: 500 }
    );
  }
}

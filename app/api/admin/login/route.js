import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/db.js";
import { generateAdminToken } from "../../../../lib/auth.js";
import { Admin } from "../../../../server/models/Admin.js";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide both admin email and password.",
        },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Dynamic lookup in MongoDB Admin collection
    let admin = await Admin.findOne({ email: cleanEmail }).select("+password");

    // 2. Initial DB bootstrap fallback: if no admin exists or matching default
    if (!admin) {
      const adminCount = await Admin.countDocuments();
      const defaultEmail = (
        process.env.ADMIN_EMAIL || "admin@deepaktextiles.com"
      )
        .toLowerCase()
        .trim();

      if (adminCount === 0 || cleanEmail === defaultEmail) {
        const defaultPassword = process.env.ADMIN_PASSWORD || "Admin@123";
        const defaultName =
          process.env.ADMIN_NAME || "Deepak Agarwal (Owner)";

        admin = await Admin.create({
          name: defaultName,
          email: defaultEmail,
          password: defaultPassword,
          role: "admin",
        });

        admin = await Admin.findById(admin._id).select("+password");
      }
    }

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid administrator credentials. Email not registered.",
        },
        { status: 401 }
      );
    }

    // 3. Compare password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid administrator credentials. Incorrect password.",
        },
        { status: 401 }
      );
    }

    // 4. Upgrade plaintext password to bcrypt if needed
    if (
      admin.password &&
      !admin.password.startsWith("$2a$") &&
      !admin.password.startsWith("$2b$") &&
      !admin.password.startsWith("$2y$")
    ) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
      await admin.save();
    }

    const token = generateAdminToken(admin);

    return NextResponse.json({
      success: true,
      message: "Admin sign in successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("[Admin Login Error]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

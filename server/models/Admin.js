import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  // Prevent double-hashing if password is already a bcrypt hash
  if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$") || this.password.startsWith("$2y$")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

AdminSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password || !enteredPassword) return false;
  // If stored as plaintext (e.g. edited manually via Mongo Compass or seed), verify directly
  if (!this.password.startsWith("$2a$") && !this.password.startsWith("$2b$") && !this.password.startsWith("$2y$")) {
    return this.password === enteredPassword;
  }
  return bcrypt.compare(enteredPassword, this.password);
};

export const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

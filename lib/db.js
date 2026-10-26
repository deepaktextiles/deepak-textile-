import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  let primaryUri = process.env.MONGODB_URI.trim();

  // Strip accidental "MONGODB_URI=" prefix or surrounding quotes if pasted in hosting dashboard
  if (primaryUri.startsWith("MONGODB_URI=")) {
    primaryUri = primaryUri.replace(/^MONGODB_URI=/, "").trim();
  }
  primaryUri = primaryUri.replace(/^["']|["']$/g, "").trim();

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
    };

    cached.promise = mongoose
      .connect(primaryUri, opts)
      .then((m) => {
        console.log(
          `[MongoDB] Connected successfully to: ${m.connection.host} (${m.connection.name})`,
        );
        return m;
      })
      .catch(async (err) => {
        console.error(
          `[MongoDB] Connection failed to "${primaryUri.replace(/:([^@]+)@/, ":****@")}":`,
          err.message,
        );

        // Fallback to in-memory only if no explicit cloud MONGODB_URI is provided
        const isCloudUri = primaryUri.includes("mongodb+srv://");
        if (process.env.NODE_ENV !== "production" && !isCloudUri) {
          try {
            console.warn(
              "[MongoDB] Starting zero-config in-memory MongoDB fallback...",
            );
            const { MongoMemoryServer } = await import("mongodb-memory-server");
            const mongod = await MongoMemoryServer.create({
              instance: { dbName: "deepak_textiles", launchTimeout: 60000 },
            });
            const memoryUri = mongod.getUri();
            const conn = await mongoose.connect(memoryUri, opts);
            console.log(`[MongoDB] In-memory MongoDB connected: ${memoryUri}`);
            return conn;
          } catch (memErr) {
            console.error("[MongoDB Memory Fallback Failed]:", memErr);
            throw err;
          }
        }
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

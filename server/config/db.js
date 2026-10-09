import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  const primaryUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/deepak_textiles";

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (${conn.connection.name})`);
  } catch (err) {
    console.warn(`[MongoDB] Connection to "${primaryUri}" failed: ${err.message}`);
    console.log(`[MongoDB] Starting zero-config in-memory MongoDB fallback...`);

    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create({
        instance: { dbName: "deepak_textiles" },
      });
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      isConnected = true;
      console.log(`[MongoDB] In-memory MongoDB connected: ${memoryUri}`);
    } catch (memErr) {
      console.error("[MongoDB] In-memory connection failed:", memErr);
      throw memErr;
    }
  }
};

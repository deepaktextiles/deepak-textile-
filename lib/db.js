import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  const primaryUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/deepak_textiles";

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(primaryUri, opts)
      .then((m) => {
        return m;
      })
      .catch(async (err) => {
        // Fallback in development only if local MongoDB is not running
        if (process.env.NODE_ENV !== "production") {
          try {
            const { MongoMemoryServer } = await import("mongodb-memory-server");
            const mongod = await MongoMemoryServer.create({
              instance: { dbName: "deepak_textiles", launchTimeout: 60000 },
            });
            const memoryUri = mongod.getUri();
            return await mongoose.connect(memoryUri, opts);
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

import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV!,
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    KEY: process.env.CLOUDINARY_API_KEY!,
    SECRET: process.env.CLOUDINARY_API_SECRET!,
  },
};
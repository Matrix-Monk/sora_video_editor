import * as dotenv from "dotenv";
dotenv.config();

export const config = {
  API_PORT: process.env.API_PORT,
  NODE_ENV: process.env.NODE_ENV!,
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  CLOUDINARY: {
    NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    KEY: process.env.CLOUDINARY_API_KEY!,
    SECRET: process.env.CLOUDINARY_API_SECRET!,
  },
  GOOGLE: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  },
};
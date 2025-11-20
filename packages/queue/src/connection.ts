import { Redis } from "ioredis";
import { config } from "@sora/config/config";


const redisUrl = "redis://localhost:6379";
export const connection = new Redis(redisUrl);
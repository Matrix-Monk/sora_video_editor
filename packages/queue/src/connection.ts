import { Redis } from "ioredis";
import { config } from "@sora/config/config";


const redisUrl = config.REDIS_URL;
export const connection = new Redis(redisUrl);
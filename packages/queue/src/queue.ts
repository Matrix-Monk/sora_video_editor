import { Queue } from "bullmq";
import { connection } from "./connection";


export const generationQueue = new Queue("generation", { connection });

export async function addJob(data: any) {
  return generationQueue.add("generate-video", data, {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
  });
}
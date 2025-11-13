import { Worker } from "bullmq";
import { connection } from "@sora/queue/connection";
import prisma from "@sora/db/client";
import { log } from "@sora/utils/logger";

new Worker(
  "generation",
  async (job) => {
    log("Processing job", job.id, job.data);
    await new Promise((r) => setTimeout(r, 2000));
    await prisma.generated.update({
      where: { id: job.data.id },
      data: { status: "done", outputUrl: "sample.mp4" },
    });
  },
  { connection }
);
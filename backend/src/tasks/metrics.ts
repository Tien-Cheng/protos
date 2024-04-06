import { Worker } from "bullmq";
import { Device } from "../types";

const worker = new Worker(
  "devices",
  async (job) => {
    const data: Device = job.data;
    // TODO: auto delete job if DB does not have device any more
  }
)

worker.run();
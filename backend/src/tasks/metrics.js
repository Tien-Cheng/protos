// use docker to run redis on localhost
import { Worker } from "bullmq";

const worker = new Worker(
  "devices",
  async (job) => {
    fetch("http://localhost:4090/devices/poll", {
      method: "POST",
      body: JSON.stringify(job.data)
    })
  }
)

worker.run();
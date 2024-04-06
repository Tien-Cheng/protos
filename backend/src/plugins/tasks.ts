import plugin from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { ConnectionOptions, Queue } from "bullmq";

declare module "fastify" {
  interface FastifyInstance {
    tasks: {
      queues: Record<string, Queue>;
      createQueue: (name: string, connectionSettings?: ConnectionOptions) => Queue;
    }
  }
}

export default plugin<FastifyPluginAsync>(async (app): Promise<void> => {
  const queues: Record<string, Queue> = {};

  const createQueue = (
    name: string,
    connectionSettings?: ConnectionOptions
  ) => {
    // NOTE: this requires redis to be running
    // as tasks are saved on redis
    queues[name] = new Queue(name, {
      connection: connectionSettings ?? {},
    });

    return queues[name];
  };

  app.decorate("tasks", {
    queues,
    createQueue,
  });
});

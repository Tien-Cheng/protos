import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const main: FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
  app.get("/", {}, async (req, res) => {
    const devices = await app.deviceClient.scan();
    // TODO: start scan with 10s second timeout? (or can this be SSE?)

    // Return list of devices along with connection settings
    return res.send({
      devices
    });
  });
};

export default main;

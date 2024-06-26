import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BodySchema } from "./types";
import { Device } from "../../types";
import { Timestamp } from "firebase-admin/firestore";

const main: FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
  app.post(
    "/",
    {
      schema: {
        body: BodySchema,
      },
    },
    async (req, res): Promise<Device> => {
      // Get info about the device
      const { host, port, brand, roomId, isFavourite, deviceThumbnail } =
        req.body;

      // Run connect method
      const device = await app.deviceClient.connect(host, port, brand);
      // Add device to the database
      const created = Timestamp.now();
      const dbEntry: Device = Object.assign(device, {
        roomId,
        isFavourite,
        deviceThumbnail,
        created,
      });

      await app.db.collection("Devices").doc(device.deviceId).set(dbEntry);


      return res.send(dbEntry);
    }
  );
};

export default main;

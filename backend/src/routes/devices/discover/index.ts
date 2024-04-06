import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Timestamp } from "firebase-admin/firestore";

const main: FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
  app.get("/", {}, async (req, res) => {
    const devices = await app.deviceClient.scan();
    // TODO: start scan with 10s second timeout? (or can this be SSE?)
    const deviceDetails = devices.map((device) => {
      const data = {
        deviceId: device.deviceId,
        deviceUrl: device.deviceUrl,
        deviceType: device.deviceType,
        deviceName: device.deviceName,
        deviceBrand: device.deviceBrand,
        created: Timestamp.now(),
        isFavourite: false,
        roomId: "XpCpkNqWYMGACHNw4rJu"
      }
      return data;
    })


    await Promise.all(deviceDetails.map(async (device) => {
      await app.db.collection("Devices").doc(device.deviceId).set(device);
    }))

    // Return list of devices along with connection settings
    return res.send({
      deviceDetails
    });
  });
};

export default main;

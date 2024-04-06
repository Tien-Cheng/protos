import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Timestamp } from "firebase-admin/firestore";
import { DeviceType } from "types";

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
        roomId: "XpCpkNqWYMGACHNw4rJu",
      };
      return data;
    });

    await Promise.all(
      deviceDetails.map(async (device) => {
        await app.db.collection("Devices").doc(device.deviceId).set(device);
        // Once added, we need to start collecting data from the device
        if (device.deviceType == DeviceType.SmartHub) {
          return;
        }

        const queue =
          app.tasks.queues["devices"] ?? app.tasks.createQueue(device.deviceId);

        // note this is hacky as if the ip address changes
        // this will fail
        const url = device.deviceUrl.split(":");
        return await queue.add(
          device.deviceId,
          {
            host: url[0],
            port: url[1],
            deviceBrand: device.deviceBrand,
            deviceType: device.deviceType,
          },
          {
            repeat: {
              every: 5000, // poll every 5 seconds
            },
          }
        );
      })
    );

    // Return list of devices along with connection settings
    return res.send({
      deviceDetails,
    });
  });
};

export default main;

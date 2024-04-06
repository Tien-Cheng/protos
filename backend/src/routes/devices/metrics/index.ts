import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { HubBodySchema, PollBodySchema } from "./types";
import { Timestamp } from "firebase-admin/firestore";
import { DeviceLog } from "types";

const main: FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
  app.post(
    "/",
    {
      schema: {
        body: HubBodySchema,
      },
    },
    async (req, res): Promise<void> => {
      const body = req.body;
      let data = body as any;
      data["startTime"] = Timestamp.fromDate(data["startTime"]);
      data = data as DeviceLog;

      const deviceId = body.deviceId;

      await app.db
        .collection("Devices")
        .doc(deviceId)
        .collection("Series")
        .add(data);
    }
  );

  app.post(
    "/poll",
    {
      schema: {
        body: PollBodySchema,
      },
    },
    async (req, res): Promise<void> => {
      const { deviceId, deviceBrand, deviceType, host, port } = req.body;
      const data = await app.deviceClient.getData(
        host,
        port,
        deviceBrand,
        deviceType
      );

      if (!data) {
        return;
      }

      await app.db
        .collection("Devices")
        .doc(deviceId)
        .collection("Series")
        .add(data);
    }
  );
};

export default main;

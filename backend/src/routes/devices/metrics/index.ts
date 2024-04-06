
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { BodySchema } from "./types";
import { Timestamp } from "firebase-admin/firestore";
import { DeviceLog } from "types";

const main: FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
  app.post(
    "/",
    {
      schema: {
        body: BodySchema,
      },
    },
    async (req, res): Promise<void> => {
      const body = req.body;
      let data = body as any;
      data["startTime"] = Timestamp.fromDate(data["startTime"]);
      data = data as DeviceLog;

      const deviceId = body.deviceId;

      await app.db.collection("Devices").doc(deviceId).collection("Series").add(data);
    }
  );
};

export default main;

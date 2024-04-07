import axios from "axios";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { ParamsSchema, HubQuerySchema, PollBodySchema } from "./types";


const main: FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
  app.post(
    "/",
    {
      schema: {
        params: ParamsSchema,
        body: HubQuerySchema,
      },
    },
    async (req, res): Promise<void> => {
      // const body = req.body;
      // let data = body as any;
      // data["startTime"] = Timestamp.fromDate(data["startTime"]);
      // data = data as DeviceLog;

      const deviceId = req.params.did;
      console.log(req.body.ldrVal);
      const data = {
        temperature: req.body.temperature,
        humidity: req.body.humidity,
        humanPresense: req.body.pirVal == 1,
        lightOn: req.body.ldrVal > 500,
      };
      console.log(data)

      // Update Records to Firestore
      const docRef = await app.db.collection("Devices").doc(deviceId).get()

      if (!docRef.exists) {
        throw new Error(`DeviceID ${deviceId} does not exist`)
      }

      app.db.collection("Devices").doc(deviceId).set(data, { merge: true })

      const request = await axios({
        method: 'get',
        url: 'https://api.data.gov.sg/v1/environment/air-temperature'
      });
      const externalTemp = request.data.items[0].readings[1].value;



      // Add smart recommendations if available
      
      if (data.humanPresense && data.lightOn) {
        // Turn off light when no human is present
        await app.db.collection("Suggestions").add({
          deviceId,
          deviceState: "INACTIVE",
          suggestionDescription: "Turn off the Light when no human is present.",
          suggestionName: "Turn Off Light"
        });
      }

      if (data.humanPresense && (externalTemp - data.temperature) > 5){
        // Turn off aircon when no human is present
        await app.db.collection("Suggestions").add({
          deviceId,
          deviceState: "INACTIVE",
          suggestionDescription: "Turn off the Aircon when no human is present.",
          suggestionName: "Turn Off Light"
        });
      }
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

import { Type } from "@sinclair/typebox";
import { DeviceBrand, DeviceType } from "../../../../types";

export const ParamsSchema = Type.Object({
  did: Type.String(),
});

export const PollBodySchema = Type.Object({
  deviceId: Type.String(),
  deviceType: Type.Enum(DeviceType),
  deviceBrand: Type.Enum(DeviceBrand),
  host: Type.String(),
  port: Type.Number({
    minimum: 0
  })
})

export const HubQuerySchema = Type.Object({
  temperature: Type.Number(),
  humidity: Type.Number(),
  pirVal: Type.Number(),
  ldrVal: Type.Number(),
})
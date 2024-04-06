import { Type } from "@sinclair/typebox";
import { DeviceBrand, DeviceType } from "../../../types";

export const HubBodySchema = Type.Object({
  deviceId: Type.String(),
  type: Type.String(),
  startTime: Type.Date(),
  values: Type.Record(Type.String(), Type.Any()),
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
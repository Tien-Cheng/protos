import { Type } from "@sinclair/typebox";
import { DeviceType } from "../../../types";

export const HubBodySchema = Type.Object({
  deviceId: Type.String(),
  type: Type.String(),
  startTime: Type.Date(),
  values: Type.Record(Type.String(), Type.Any()),
});

export const PollBodySchema = Type.Object({
  deviceId: Type.String(),
  brand: Type.Enum(DeviceType),
})
import { Type } from "@sinclair/typebox";
import { DeviceType } from "../../../types";

export const BodySchema = Type.Object({
  deviceId: Type.String(),
  brand: Type.Enum(DeviceType),
  startTime: Type.Date(),
  values: Type.Record(Type.String(), Type.Any())
});


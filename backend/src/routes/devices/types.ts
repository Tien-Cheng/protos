import { Type } from "@sinclair/typebox";
import { DeviceBrand } from "../../types";

export const BodySchema = Type.Object({
  host: Type.String(),
  port: Type.Integer({
    minimum: 0,
  }),
  brand: Type.Enum(DeviceBrand),
  roomId: Type.String(),
  isFavourite: Type.Boolean({
    default: false,
  }),
  deviceThumbnail: Type.Optional(Type.String()),
});

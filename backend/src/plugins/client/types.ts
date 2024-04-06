import { DeviceCandidate } from "../../types";

export interface DeviceAPIProvider {
  scan: () => Promise<DeviceCandidate[]>;
  connect: (
    host: string,
    port: number
  ) => Promise<DeviceCandidate>;
}
import { DeviceCandidate, DeviceLog, DeviceType } from "../../types";

export interface DeviceAPIProvider {
  scan: () => Promise<DeviceCandidate[]>;
  connect: (
    host: string,
    port: number
  ) => Promise<DeviceCandidate>;
  getData: (
    host: string,
    port: number,
    deviceType: DeviceType,
  ) => Promise<DeviceLog | null>;
}
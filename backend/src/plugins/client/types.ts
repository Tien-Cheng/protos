import { DeviceCandidate } from "../../types";

export interface DeviceAPIProvider {
  scan: () => Promise<DeviceCandidate[]>;
  connect: (
    deviceUrl: string
  ) => Promise<DeviceCandidate>;
}
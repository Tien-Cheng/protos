import { Timestamp } from "firebase-admin/firestore";

export enum DeviceType {
  SmartPlug = "smart-plug",
  SmartHub = "smart-hub",
  SmartBulb = "smart-bulb"
}

export enum DeviceBrand {
  tpLink = "tplink"
}

export interface DeviceCandidate {
  deviceId: string;
  deviceUrl: string;
  deviceType: DeviceType;
  deviceName: string;
  deviceBrand: DeviceBrand;
}

export interface Device extends DeviceCandidate {
  created: Timestamp;
  isFavourite: boolean;
  roomId: string;
  deviceThumbnail?: string;
}

export interface DeviceLog {
  deviceId: string;
  logType: string;
  data: Record<string, any>;
  created: Timestamp;
}
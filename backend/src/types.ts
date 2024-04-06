export enum DeviceType {
  SmartPlug = "smart-plug",
  SmartHub = "smart-hub"
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
  created: string;
  isFavourite: boolean;
  roomId: string;
  deviceThumbnail?: string;
}
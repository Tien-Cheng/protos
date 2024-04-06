export enum DeviceType {
  SmartPlug = "smart-plug",
  SmartHub = "smart-hub",
}

export enum DeviceBrand {
  tpLink = "tplink"
}

export enum DeviceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONNECTED = "DISCONNECTED",
  ERROR = "ERROR",
}

export interface Device {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  deviceBrand: DeviceBrand;
  deviceThumbnail?: string;
  deviceUrl: string; // ip address of device
  created: string;
  isFavourite: boolean;
  roomId: string;
  state: DeviceStatus;
}

export interface Room {
  roomId: string;
  roomName: string;
  locationId: string;
  created: string;
}

export interface Environment {
  temperature: number;
  humidity: number;
}

export interface Weather extends Environment {
  state: string;
}

export interface Voucher {
  voucherId: string,
  voucherName: string,
  voucherDescription?: string,
  imageURL?: string,
  requiredPoints: number,
}
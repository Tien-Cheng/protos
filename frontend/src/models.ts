enum DeviceType {
  SmartPlug = "smart-plug",
  SmartHub = "smart-hub",
}

enum DeviceBrand {
  tpLink = "tplink"
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
import { setTimeout } from "timers/promises";
import {
  AnyDevice,
  Bulb,
  Client,
  Plug,
  RealtimeNormalized,
} from "tplink-smarthome-api";
import { DeviceAPIProvider } from "../types";
import {
  DeviceBrand,
  DeviceCandidate,
  DeviceLog,
  DeviceType,
} from "../../../types";
import { Timestamp } from "firebase-admin/firestore";

export class TPLinkProvider implements DeviceAPIProvider {
  client: Client;
  mapType: Record<string, DeviceType>;

  constructor() {
    this.client = new Client();
    this.mapType = {
      plug: DeviceType.SmartPlug,
      bulb: DeviceType.SmartBulb,
    };
  }

  async scan() {
    let devices: DeviceCandidate[] = [];
    const timeout = 5000;
    this.client
      .startDiscovery({
        discoveryTimeout: timeout, // TODO: make this configurable
      })
      .on("device-new", (device) => {
        let deviceCandidate: DeviceCandidate = {
          deviceId: device.deviceId,
          deviceUrl: `${device.host}:${device.port}`,
          deviceType: this.mapType[device.deviceType],
          deviceName: device.name,
          deviceBrand: DeviceBrand.tpLink,
        };
        devices.push(deviceCandidate);
        device.closeConnection();
      });
    // give the discovery some time to scan until it times out
    await setTimeout(timeout);
    return devices;
  }

  async connect(host: string, port: number) {
    let device = await this.client.getDevice({
      host,
      port,
    });

    let deviceDetails: DeviceCandidate = {
      deviceId: device.deviceId,
      deviceUrl: `${device.host}:${device.port}`,
      deviceType: this.mapType[device.deviceType],
      deviceName: device.name,
      deviceBrand: DeviceBrand.tpLink,
    };

    return deviceDetails;
  }

  async getData(host: string, port: number, deviceType: DeviceType) {
    const timestamp = Timestamp.now();
    let data: Record<string, any> = {
      startTime: timestamp,
    };
    let device: Bulb | Plug | AnyDevice;
    if (deviceType == DeviceType.SmartBulb) {
      device = this.client.getBulb({
        host,
        port,
      });
      data["type"] = "smart-bulb";
      const light = await device.lighting.getLightState();
      data["values"] = {
        brightness: light.brightness,
        colorTemp: light.color_temp,
        hue: light.hue,
      };
    } else if (deviceType == DeviceType.SmartPlug) {
      device = this.client.getPlug({
        host,
        port,
      });
      data["type"] = "smart-plug";
    } else {
      return null;
    }
    data["deviceId"] = device.deviceId;
    // Get e meter data
    const { current, voltage } =
      (await device.emeter.getRealtime()) as RealtimeNormalized;

    if (current && voltage) {
      data["values"][current] = current;
      data["values"][voltage] = voltage;
    }

    return data as DeviceLog;
  }
}

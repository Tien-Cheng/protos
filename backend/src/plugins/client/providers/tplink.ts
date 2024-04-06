import { setTimeout } from "timers/promises";
import { Client } from "tplink-smarthome-api";
import { DeviceAPIProvider } from "../types";
import { DeviceBrand, DeviceCandidate, DeviceType } from "../../../types";

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

  async connect(host: string) {
    let device = await this.client.getDevice({
      host,
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
}

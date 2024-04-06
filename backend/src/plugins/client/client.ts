import plugin from "fastify-plugin";
import {
  DeviceBrand,
  DeviceCandidate,
  DeviceLog,
  DeviceType,
} from "../../types";
import { DeviceAPIProvider } from "./types";
import { TPLinkProvider } from "./providers/tplink";
import { FastifyPluginAsync } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    deviceClient: {
      scan: () => Promise<DeviceCandidate[]>;
      connect: (
        host: string,
        port: number,
        brand: DeviceBrand
      ) => Promise<DeviceCandidate>;
      getData: (
        host: string,
        port: number,
        brand: DeviceBrand,
        deviceType: DeviceType
      ) => Promise<DeviceLog | null>;
    };
  }
}

export default plugin<FastifyPluginAsync>(async (app): Promise<void> => {
  const providers: Record<DeviceBrand, DeviceAPIProvider> = {
    tplink: new TPLinkProvider(),
  };

  const scan = async () => {
    // for all providers, do a scan, returning all found devices
    app.log.info("Starting scan for devices");
    const allDevices: DeviceCandidate[] = (
      await Promise.all(
        Object.values(providers).map((provider) => provider.scan())
      )
    ).flat();
    return allDevices;
  };

  const connect = async (host: string, port: number, brand: DeviceBrand) => {
    const device = await providers[brand].connect(host, port);
    return device;
  };

  const getData = async (
    host: string,
    port: number,
    brand: DeviceBrand,
    deviceType: DeviceType
  ) => {
    if (deviceType == DeviceType.SmartHub) {
      return null;
    }
    const data = await providers[brand].getData(
      host, port, deviceType
    );

    return data;
  };

  app.decorate("deviceClient", {
    scan,
    connect,
    getData
  });
});

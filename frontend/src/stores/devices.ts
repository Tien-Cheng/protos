import { defineStore } from "pinia";

import { collection, query, where, getDocs, and } from "firebase/firestore";

import { db } from "../firebase";

import { Device, DeviceType, HubDevice } from "../models";



export const useDevicesStore = defineStore("devices", {
  state: (): { devices: { [deviceId: string]: Device | HubDevice } } => ({
    devices: {}
  }),
  getters: {
    devicesByRoomId: (state) => (roomId: string) => {
      return Object.values(state.devices).filter((device) => device.roomId === roomId);
    },
    deviceById: (state) => (deviceId: string) => {
      return state.devices[deviceId];
    },
    hubDeviceByRoomId: (state) => (roomId: string) => {
      return Object.values(state.devices).find((device) => device.roomId === roomId && device.deviceType === DeviceType.SmartHub) as HubDevice;
    }
  },
  actions: {
    async getDevicesByRoom(roomId: string) {
      try {
        const snap = await getDocs(query(collection(db, "Devices"), where("roomId", "==", roomId)));

        snap.forEach((doc) => {
          const device = doc.data() as Device;
          device.deviceId = doc.id;
          this.devices[doc.id] = device;
        });
      } catch (error) {
        console.error(error);
      }
    },
    // async getHubDeviceByRoom(roomId: string) {
    //   try {
    //     const snap = await getDocs(query(collection(db, "Devices"), and(where("roomId", "==", roomId), where("deviceType", "==", DeviceType.SmartHub))));

    //     snap.forEach((doc) => {
    //       const device = doc.data() as HubDevice;
    //       device.deviceId = doc.id;
    //       this.devices[doc.id] = device;
    //     });
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    async addDevice() {
      try {

      } catch (error) {
        console.error(error);
      }
    },
  }
});
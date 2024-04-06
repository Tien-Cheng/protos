import { defineStore } from "pinia";

import { collection, query, where, getDocs } from "firebase/firestore";

import { db } from "../firebase";

import { Device } from "../models";



export const useDevicesStore = defineStore("devices", {
  state: (): { devices: { [deviceId: string]: Device } } => ({
    devices: {}
  }),
  getters: {
    devicesByRoomId: (state) => (roomId: string) => {
      return Object.values(state.devices).filter((device) => device.roomId === roomId);
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
    async addDevice() {
      try {

      } catch (error) {
        console.error(error);
      }
    },
  }
});
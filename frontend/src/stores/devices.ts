import { defineStore } from "pinia";

import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

import { db } from "../firebase";

import { Device, DeviceStatus } from "../models";



export const useDevicesStore = defineStore("devices", {
  state: (): { devices: { [deviceId: string]: Device } } => ({
    devices: {}
  }),
  getters: {
    devicesByRoomId: (state) => (roomId: string) => {
      return Object.values(state.devices).filter((device) => device.roomId === roomId);
    },
    deviceById: (state) => (deviceId: string) => {
      return state.devices[deviceId];
    },
    favouriteDevices: (state) => {
      return Object.values(state.devices).filter((device) => device.isFavourite);
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
    async getFavouriteDevices() {
      try {
        const snap = await getDocs(query(collection(db, "Devices"), where("isFavourite", "==", true)));

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
    async updateState(id: string, status: DeviceStatus) {
      this.devices[id].state = status;
      try {

        setDoc(doc(collection(db, "Devices"), id), this.devices[id]);
      } catch (e) {
        console.error(e);
      }
    },
  }
});
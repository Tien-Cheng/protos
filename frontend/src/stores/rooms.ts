import { defineStore } from "pinia";

import { collection, getDocs, setDoc, doc } from "firebase/firestore";

import { db } from "../firebase";

import { Room } from "../models";



export const useRoomsStore = defineStore("rooms", {
  state: (): { rooms: { [roomId: string]: Room } } => ({
    rooms: {}
  }),
  actions: {
    async getRooms() {
      try {
        const snap = await getDocs(collection(db, "Rooms"));

        snap.forEach((doc) => {
          const device = doc.data() as Room;
          device.roomId = doc.id;
          this.rooms[doc.id] = device;
        });
      } catch (error) {
        console.error(error);
      }
    },
    // async addRoom(room: Room) {
    //   room.locationId = "my-room";

    //   try {
    //     await setDoc(doc(collection(db, "Rooms")), room);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
  }
});
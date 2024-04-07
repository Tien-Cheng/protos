import { defineStore } from "pinia";

import { collection, setDoc, doc, getDoc } from "firebase/firestore";

import { db } from "../firebase";


export const usePointsStore = defineStore("points", {
  state: (): { points: number, id: string } => ({
    points: 100,
    id: "",
  }),
  actions: {
    async getPoints() {
      try {
        const collectionDoc = doc(collection(db, "Points"));
        const snap = (await getDoc(collectionDoc)), data = snap.data();

        if (data && data["points"]) {
          this.points = parseInt(data["points"].toString());
          this.id = collectionDoc.id;
        } else {
          await this.setPoints();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async setPoints() {
      if (this.id == "")
        await this.getPoints();

      setDoc(doc(collection(db, "Points"), this.id), { points: this.points });
    },
    async changePoints(change: number) {
      this.points += change;
      try {
        this.setPoints();
      } catch (e) {
        console.error(e);
      }
    }
  }
});
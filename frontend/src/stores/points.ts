import { defineStore } from "pinia";

import { collection, setDoc, doc, getDoc, getDocs } from "firebase/firestore";

import { db } from "../firebase";


export const usePointsStore = defineStore("points", {
  state: (): { points: number, id: string } => ({
    points: 100,
    id: "",
  }),
  actions: {
    async getPoints() {
      try {
        const snap = await getDocs(collection(db, "Points"));
        let points;
        snap.forEach(snapDoc => {
          points = snapDoc.data()["points"];
          if (points) {
            this.points = parseInt(points.toString());
            this.id = snapDoc.id;
          } else {
            this.setPoints();
          }
        });
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
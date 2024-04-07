import { defineStore } from "pinia";

import { collection, doc, getDocs, deleteDoc } from "firebase/firestore";

import { db } from "../firebase";
import { Suggestion } from "../models";
import { useDevicesStore } from "./devices";

export const useSuggestionsStore = defineStore("suggestions", {
  state: (): { suggestions: { [id: string]: Suggestion } } => ({
    suggestions: {},
  }),
  actions: {
    async getAllSuggestions() {
      try {
        const snap = (await getDocs(collection(db, "Suggestions")))

        snap.forEach((snapDoc) => {
          const suggestion = snapDoc.data() as Suggestion;

          suggestion.suggestionId = snapDoc.id;
          this.suggestions[snapDoc.id] = suggestion;
        });
        return this.suggestions;
      } catch (error) {
        console.error(error);
      }
    },
    async removeSuggestion(id: string) {
      try {
        if (Object.keys(this.suggestions).includes(id))
          deleteDoc(doc(collection(db, "Vouchers"), id));
        else
          console.error("no suggestion with that id");
      } catch (e) {
        console.error(e);
      }
    },
    async applySuggestion(id: string) {
      const deviceStore = useDevicesStore();
      if (!Object.keys(this.suggestions).includes(id))
        return console.error("no suggestion with that id");

      const suggestion = this.suggestions[id];

      const device = deviceStore.deviceById(suggestion.deviceId);

      try {
        await deviceStore.updateState(device.deviceId, suggestion.deviceState);
        await this.removeSuggestion(id);
      } catch (e) {
        console.error(e);
      }
    }
  }
});
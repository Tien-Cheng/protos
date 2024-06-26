import { defineStore } from "pinia";

import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

import { db } from "../firebase";
import { Voucher } from "../models";

// import { Room } from "../models";



export const useVouchersStore = defineStore("vouchers", {
  state: (): { vouchers: { [voucherid: string]: Voucher } } => ({
    vouchers: {}
  }),
  actions: {
    async getVouchers() {
      try {
        const snap = await getDocs(collection(db, "Vouchers"));

        snap.forEach((doc) => {
          const voucher = doc.data() as Voucher;
          voucher.voucherId = doc.id;
          this.vouchers[doc.id] = voucher;
        });
      } catch (error) {
        console.error(error);
      }
    },
    async getAvailableVouchers(score: number) {
      await this.getVouchers();
      const available: { [id: string]: Voucher } = {};
      Object.keys(this.vouchers).forEach((id) => {
        if (this.vouchers[id].requiredPoints <= score) available[id] = this.vouchers[id];
      });
      return available;
    },
    async removeVoucher(id: string) {
      try {
        deleteDoc(doc(collection(db, "Vouchers"), id));
      } catch (e) {
        console.error(e);
      }
    }
  }
});

export interface Voucher {
  voucherId: string,
  voucherName: string,
  voucherDescription?: string,
  imageURL?: string,
  requiredPoints: number,
}
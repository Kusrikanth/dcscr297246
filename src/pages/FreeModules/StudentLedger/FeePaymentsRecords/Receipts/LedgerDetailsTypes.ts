// detection promotion table data type
export interface ReceiptsDataTypes {
  id: number;
  date: string;
  receiptNo: string;
  feeName: string;
  paymentMode: string;
  actualAmount: string;
  paidAmount: string;
  fine: string;
  cardCharges: string;
  refundedStatus: string;
  referenceNo: string;
  chequeStatus: string;
  receiptStatus: string;

  // eslint-disable-next-line no-restricted-globals
  remarks: string;
}

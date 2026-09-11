export interface CheckDetailsDataTypes {
  inTheName: string;
  bankName: string;
  chequeDate: string;
  chequeNo: string;

  finalRefundAmount: string;
  remarks: string;
}

export interface AdjustmentDataTypes {
  adjustAmount: string;

  studentIdAdjusted: string;
  studentNameAdjusted: string;

  finalRefundAmount: string;
  remarks: string;
}

export interface AdjustmentTableDataTypes {
  id: number;
  feeName: string;
  amountPayable: number;
  amountPaid: number;
  concession: number;
  fine: number;
  status: string;
  amountToPay: number;
  adjustAmount: string;
}

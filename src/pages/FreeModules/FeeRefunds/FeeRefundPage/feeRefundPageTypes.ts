// new fee refund page data
export interface NewFeeRefundDataTypes {
  refundFor: string;
  academicYear: string;
  curriculum: string;
  class: string;
  studentId: string;
  studentNo: string;

  // paymentDetails: {
  //   method: string;
  //   price: string;
  // };
  // chequeDate: string;
  // chequeNo: string;
  // inTheName: string;
  // chequeAmount: number | undefined;
  // bankName: string;
}

// new refund table data
export interface NewRefundTableData {
  id: number;
  academicYear: string;
  feeName: string;
  payableAmount: number;
  // eslint-disable-next-line no-restricted-globals
  status: string;
  amountDue: number;
}

// Tabbar menu types
export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding?: string;
}

export interface FeeDetailsTableData {
  id: number;
  feeName: string;
  amountPayable: string;
  netAmount: string;
  amountPaid: string;
  refundAmount: string;
}

export interface RefundDetailsDataTypes {
  refundableAmount: string;
}

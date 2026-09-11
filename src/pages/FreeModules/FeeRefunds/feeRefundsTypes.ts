// fee refund table filter
export interface FeeRefundFilterhProps {
  search: string;
  year: string;
  class: string;
  board: string;
  dateRange: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// fee refund table data type
export interface FeeRefundTableData {
  id: number;
  refundDate: string;
  studentName: studentDetailsProps;
  curriculum: string;
  class: string;
  refundAmount: number;
  paymentMode: string;
  adjustmentAmount: number;
  adjustedTo: string;
  cashAmount: number;
  chequeAmount: number;
  chequeNo: string;
  inTheName: string;
}

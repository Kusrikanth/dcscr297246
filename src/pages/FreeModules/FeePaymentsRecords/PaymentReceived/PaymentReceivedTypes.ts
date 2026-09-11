// payment received table filter
export interface PaymentReceivedFilterhProps {
  search: string;
  date: string;
  status: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// payment received table data type
export interface PaymentReceivedTableData {
  id: number;
  studentName: studentDetailsProps;
  classSection: string;
  feeName: string;
  receiptNo: string;
  transectionId: string;
  receiptDate: string;
  paymentMode: string;
  receivedAmount: number;
  status: string;
}

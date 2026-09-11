// fee receipt table filter
export interface FeeReceiptsFilterhProps {
  search: string;
  year: string;
  class: string;
  curriculumId:string;
  selectDateRange: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// fee receipt table data type
export interface FeeReceiptTableData {
  id: number;
  studentName: studentDetailsProps;
  receiptNo: string;
  class: string;
  receiptDate: string;
  paymentMode: string;
  refNo: string;
  amountPaid: number;
  cashier:string,
  fine: number;
}
export interface NewFeeReceiptTableData {
  id: number;
  previousReceiptNo: string;
  feeNames: string;
  amountPayable: string;
  amountPaid: string;
  concession: string;
  fine: string;
  amounttoPay: string;
}

// fee receipt modal
export interface FeeReceiptModalType {
  showModal: boolean;
  branchId: string;
}

// Modal types
export interface FeeDetailsModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

// fee details modal table data
export interface FeeDetailsModalTableData {
  sNo: number;
  feeName: string;
  concession: number;
  amountPayable: number;
  netAmount: number;
  amountPaid: number;
  balance: number;
}

// Tabbar menu types
export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding?: string;
  className?: string;
}

export interface FeeDetailsTableData {
  id: number;
  feeName: string;
  lastDate: string;
  amountPayable: string;
  amountPaid: string;
  concession: string;
  fine: string;
  status: string;
  amountToPay: string;
}

export interface ReceiptDetailsDataTypes {
  receiptNo: string;
  date: string;

  totalActualAmount: string;
  totalFine: string;
  previousPaidAmount: string;
  amountToPay: string;
  currentPaidAmount: string;
  balanceToPay: string;
  cashToReturn: string;
  fine: string;
  bankCharges: string;
  chequeAmount: string;
  actualPaidAmount: string;
  remarks: string;
}

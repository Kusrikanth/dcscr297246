import { string } from "yup";

// new student modal data
export interface NewStudentDataTypes {
  receiptNo: string;
  date: string;
  receiptType: string;
  academicYear: string;
  curriculum: string;
  registrationNo: string;
  studentName: string;

  paymentDetails: {
    method: string;
    price: string;
  };
  remarks: string;

  totalActualAmount: string;
  totalFine: number | undefined;
  previousPaidAmount: number | undefined;
  amountToPay: number | undefined;
  balanceToPay: number | undefined;
  cashToReturn: number | undefined;
  fine: number | undefined;
  currentPaidAmount: number | undefined;
  bankCharges: number | undefined;
  cashAmount: string;
}

// create receipt

export interface CreateReceiptTypes {
  receiptFor: string;
  receiptType: string;
  academicYear: string;
  curriculum: string;
  class: string;
  receiptNo:string;
  date:string;
  challanType:string;
  studentNo: string;
  studentName: string;
  totalFine:string;
  totalActualAmount:string;
  previousPaidAmount:string;
  amounttoPay:string;
  currentPaidAmount:string;
  balancetoPay:string;
  cashtoReturn:string;
  fine:string;
  bankCharges:string;
  cashAmount:string;
  actualPaidAmount:string;
  paymentMode:string;
  transactionId:string;
  transactionDate:string;
}

// new student table data
export interface NewStudentTableData {
  id: number;
  academicYear: string;
  feeName: string;
  payableAmount: number;
  // eslint-disable-next-line no-restricted-globals
  status: string;
  amountDue: number;
}

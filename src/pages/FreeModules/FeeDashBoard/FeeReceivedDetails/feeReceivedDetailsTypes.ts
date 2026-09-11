import { string } from "yup";

// add students table data
interface studentDetailsProps {
  name?: string;
  dep_id?: string;
  imgUrl?: string;
}

// academic table data
export interface IFeeDetailsData {
  id: number;
  name: studentDetailsProps | string;
  curriculum: string;
  class: string;
  feeName: string;
  lastDatetoPay: string;
  payableAmount: string;
  amountPaid: string;
  paymentMode: string;
  balance: string;
  status: string;
}

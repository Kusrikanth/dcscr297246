export interface TerminationFilterhProps {
  search: string;
  year: string;
  statusdata: string;
}
interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

export interface TerminationRequestTableTypes {
  id: number;
  requestNo: string;
  studentName: studentDetailsProps;
  route: string;
  terminationDate: string;
  withEffectiveFromDate: string;
  status: string;
}
export interface NewTerminationRequestTypes {
  requestNo: string;
  section: string;
  curriculum: string;
  studentNo: string;
  withEffectDate: string;
  studentName: string;
  class: string;
}
export interface ApplicableTermsTableTypes {
  id: number;
  terms: string;
  fromDate: string;
  toDate: string;
  amountToPay: number;
  amountPaid: number;
  balance: number;
  status: string;
}
export interface IStudentLedgerModal {
  showModal: boolean;
  branchId: "";
}
export interface StudentLedgerModalData {
  id: number;
  feeName: string;
  amounttoPay: number;
  amountPaid: number;
  balanceAmount: number;
  concession: number;
  route: string;
  stop: string;
  slab: string;
}
export interface StudentLedgerModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

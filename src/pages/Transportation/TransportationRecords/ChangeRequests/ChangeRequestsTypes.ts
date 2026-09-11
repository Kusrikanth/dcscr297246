import { string } from "yup";

export interface ChangeRequestsFilterhProps {
  search: string;
  year: string;
  requestType: string;
  statusdata: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

export interface ChangeRequestsTableDataType {
  id: number;
  requestNo: string;
  studentName: studentDetailsProps;
  existingRoute: string;
  existingPickUpPoint: string;
  newRoute: string;
  newPickUpPoint: string;
  status: string;
}
export interface ApplicableTermsTableDataTypes {
  id: number;
  terms: string;
  fromDate: string;
  toDate: string;
}
export interface ExistingRoutesTableDataTypes {
  id: number;
  terms: string;
  fromDate: string;
  toDate: string;
  routes: string;
  stops: string;
}

export interface NewChangesRequestTypes {
  requestNo: string;
  section: string;
  curriculum: string;
  studentNo: string;
  studentName: string;
  withEffectDate: string;
  newRoute: string;
  slab: string;
  pickUpTime: string;
  dropTime: string;
  class: string;
  document: string;
  concessionDetails: {
    concession: string;
    price: string;
  };
  remarks: string;
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

export interface IStudentLedgerModal {
  showModal: boolean;
  branchId: string;
}

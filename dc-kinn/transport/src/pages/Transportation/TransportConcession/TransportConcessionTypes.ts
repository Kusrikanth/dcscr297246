import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";

export interface TransportConcessionFilterhProps {
  search: string;
  year: string;
  curriculum: string;
  class: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// transport concession table data type
export interface TransportConcessionTableDataTypes {
  id: number;
  studentName: studentDetailsProps;
  curriculum: string;
  class: string;
  section: string;
  employeeName: string;
  concessionAmount: string;
  document: string;
}

export interface NewTransportConcessionTableData {
  id: number;
  feeName: string;
  feeAmount: number;
  concAmount: string;
  payableAmount: number;
}

export interface ITranportConcessionModal {
  showModal: boolean;
  branchId: string;
}

export interface NewTranportConcessionDataTypes {
  type: string;
  academicYear: string;
  curriculum: string;
  studentId: string;
  studentName: string;
  concessionType: string;
  concessionMode: string;
  concessionAmount: string;
  class: string;
  document: string;
  concessionDetails: string;
  remarks: string;
}

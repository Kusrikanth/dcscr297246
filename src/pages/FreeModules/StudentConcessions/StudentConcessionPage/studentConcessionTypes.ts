// new student concession page data
export interface NewStudentConcessionDataTypes {
  feeTypeId: string;
  academicYearId: string;
  curriculumId: string;
  studentId: string;
  siblingId: string;
  employeeId:string;
  minimumNetAmount:string;
  // studentName: string;
  concessionType: string;
  concessionMode: string;
  concessionValue: string;
  totalConcessionAmount:string;
  isNoFeeSelected:string;
  classId: string;
  document: string;
  concessionDetails: {
    concession: string;
    price: string;
  };
  remarks: string;
}

// new student concession table data

export interface NewStudentConcessionTableData {
  id: number;
  feeName: string;
  feeAmount: number;
  paidAmount:number;
  conc: string;
  concAmount: string;
  payableAmount: number;
}
export interface StudentConcessionModalData {
  id: number;
  academicYear: string;
  feeDetails: string;
  assignedFee: number;
  concessionAmount: number;
  concessionType: string;
  amounttoPay: number;
  concessionRemarks: string;
}
export interface StudentConcessionModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  studentId: string;
}

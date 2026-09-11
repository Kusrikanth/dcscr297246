// bonafide certificate table filter
export interface BonafideCertificateFilterhProps {
  branchId?: string,
  nameFilterType: string;
  search: string;
  academicYearId: string;
  curriculumId: string;
  classId: string;
  preparationStatus: string;
  issuanceDate: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: any;
}

// bonafide certificate table data type
export interface bonafideCertificateTableData {
  id: number;
  requestDate: string;
  studentName: studentDetailsProps;
  class: string;
  section: string;
  requestType: string;
  issuanceDate: string;
  // eslint-disable-next-line no-restricted-globals
  status: string;
}

export interface BonafideCertificateModal {
  showModal: boolean;
  branchId: string;
  bonafideRequestId?: any;
  // modalData?: IBranchInfo;
}

// Modal types
export interface ModalPropsType {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  bonafideRequestId?: any;
  branchId: string;
  editBranchDetails?: string;
  submitHandler?: any;
  digitalSign?: boolean;
}

export interface bonafideCertificateDataTypes {
  academicYearId: string,
  curriculumId: string,
  certificateType: string,
  classId: string,
  sectionId: string,
  studentId: string,
  fromClassId: string,
  toClassId: string,
  dateOfAdmission: string,
  admissionNumber: string,
  motherName: string,
  fatherName: string,
  dob: string,
  issuanceDate: string,
  purpose: string,
}

export interface BonafideCertificateModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  currentStudent?: any;
  instituteName?: string;
  branchId: string;
  // editBranchDetails: string | undefined;
  bonafideId?: any;
  bonafideCertificateDetails?: any;
  academicYearId?: string;
  requestBy?: string;
  directory?: boolean;
}

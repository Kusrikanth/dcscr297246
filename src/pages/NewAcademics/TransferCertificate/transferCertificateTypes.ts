// transfer certificate table filter
export interface TransferCertificateFilterhProps {
  branchId?: string,
  search: string;
  academicYearId: string;
  classId: string;
  curriculumId: string;
  requestType: string;
  tcRequestStatus: string;
  tcApplicationStartDt: string;
  tcApplicationEndDt: string;
  date: string;
  sectionId: string;
  nameFilterType: string;
}


// Modal types
export interface TransferCertificateModalProps {
  isOpen: boolean;
  toggle: any;
  currentStudent?: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  editCertificateDetails?: any,
  tcId?: any,
  academicYearId?: string
  requestType?: string
  directory?: any
}

// add languages modal
export interface TransferCertificateModalType {
  showModal: boolean;
  branchId: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: any;
}

// transfer certificate table data type
export interface TransferCertificateTableData {
  id: string;
  tcApplicationDate: string;
  studentName: studentDetailsProps;
  class: string;
  section: string;
  requestType: string;
  lastAttendanceDate: string;
  approvalStatus: string;
  // eslint-disable-next-line no-restricted-globals
  status: string;
}

// offline transfer certificate modal data
export interface OfflineTransferDataTypes {
  academicYearId: string;
  curriculumId: string;
  studentId: string;
  classId: string;
  sectionId: string;
  // className: string;
  // sectionName: string;
  tcApplicationDate: string;
  lastAttendedDate: string;
  fromClassId: string;
  toClassId: string;
  nextSchoolOfAdmission: string;
  reason: string;

  motherSignature: string;
  fatherSignature: string;
  bonafide: string;
}

// Certificate issuance modal data
export interface CertificateIssuanceDataTypes {
  academicYearId: string;
  curriculumId: string;
  studentName: string;
  className: string;
  sectionName: string;
  lastAttendedDate: string;
  fromClassId: string;
  toClassId: string;
  toStatus: string;
  certificateType: string;
  fatherName: string;
  motherName: string;
  subjectNames: string;
  nationalityId: string;
  studentCastOrScheduleTribe: string;
  fromCurriculumId: string;
  dateOfAdmission: string;
  fromYear: string;
  toYear: string;
  passedAndPromotedToClassId: string;
  detainedInClassId: string;
  dateOfBirthInWords: string;
  whetherFailed: string;
  nccAndOtherDetails: string;
  gameExtraCurActivities: string;
  schoolBoardAnnualexaminationLastResult: string;
  generalConduct: string;
  reasonForLeaving: string;
  otherRemarks: string;
  noOfWorkingDays: string;
  noOfPresentDays: string;
  lastClassStudied: string;
  concession: string;
  monthName: string;
  dateOfBirth: string;
  admissionNumber: string;
  dateOfIssuance: string;
}

export interface ModalPropsType {
  isOpen: boolean;
  toggle: any;
  showApiLoader?: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  submitHandler?: any;
  confirmationMessage?: any;
  cancelHandler?: any;
  submitTitle?: any;
  cancleTitle?: any;
}
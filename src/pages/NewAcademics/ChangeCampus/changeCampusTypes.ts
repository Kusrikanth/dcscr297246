// change campus table filter
export interface ChangeCampusFilterhProps {
  search: string;
  year: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: any;
}

// detection promotion table data type
export interface ChangeCampusTableData {
  id: number;
  studentName: studentDetailsProps;
  changeCampus: string;
  curriculum: string;
  changeCurriculum: string;
  class: string;
  changeClass: string;
  changedStudentId: string;
  // eslint-disable-next-line no-restricted-globals
  status: string;
  acceptanceApprovalStatus: string;
}

// Modal types
export interface ChangeCampusModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  requestDetails: string | undefined;
}

// change stream modal
export interface ChangeCampusModalType {
  showModal: boolean;
  branchId: string;
}

// change campus modal filter types
export interface ChangeCampusModalFilterhProps {
  academicYear: string;
  curriculum: string;
  student: string;
  previousStudiedClass: string;
  dateAdmission: string;
  changeCampus: string;
  changeCurriculum: string;
  changeClass: string;
}

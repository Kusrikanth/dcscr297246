// change stream table filter
export interface ChangeStreamFilterhProps {
  searchString: string;
  academicYearId: string;
  curriculumId: string;
  branchClassId: string;
  pageNo:number;
  pageSize:number;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

// detection promotion table data type
export interface ChangeStreamTableData {
  id: number;
  studentName: studentDetailsProps;
  currentStream: string;
  changeStream: string;
  // eslint-disable-next-line no-restricted-globals
  status: string;
}

// Modal types
export interface ChangeStreamModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  requestDetails: any;
  filterData?:any;
  changeStreamRequestDetails?:any;
  directory?: any;
  editChangeStreamDetails?:any;
}
export interface ChangeStreamConformationModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  requestId: string;
  requestDetails: any;
  filterData?:any;
}

// change stream modal
export interface ChangeStreamModalType {
  showModal: boolean;
  branchId: string;
}
export interface ChangeConfirmationStreamModalType {
  showModal: boolean;
  requestId: string;
}

// change stream modal filter types
export interface ChangeStreamModalFilterhProps {
  academicYearId: string;
  curriculumId: string;
  studentId: string;
  className: string;
  currentStreamName: string;
  changeStreamId: string;
}

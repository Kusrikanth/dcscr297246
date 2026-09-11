// detection promotion table filter
export interface DetectionPromotionFilterhProps {
  studentName: string;
  academicYearId: string;
  curriculumId: string;
  fromClassId: string;
  pageNo:number,
  pageSize:number
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: any;
}

// detection promotion table data type
export interface DetectionPromotionTableData {
  id: number;
  studentName: studentDetailsProps;
  class: string;
  section: string;
  rollNumber: number;
  fromClass: string;
  detainedPromoted: string;
  detainedToPromotedTo: string;
  // eslint-disable-next-line no-restricted-globals
  status: string;
}

// Modal types
export interface DetectionPromotionModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  submitHandler?: () => void;
  cancelHandler?: () => void;
  editBranchDetails: string | undefined;
  studentDetails?:any
  submitText?:any
}

// detection promotion modal filter types
export interface DetectionPromotionModalFilterhProps {
  academicYearId: string;
  branchCurriculumId: string;
  studentId: string;
  prevStudiedClass: string;
  promotedDetained: string;
  detainedOrPromotedToClass: string;
}

// detection promotion modal
export interface DetectionPromotionModalType {
  showModal: boolean;
  branchId: string;
}

// detection promotion approval modal filter types
export interface DetecPromoApproModalFilterhProps {
  remarks: string;
}

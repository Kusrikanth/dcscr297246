// academics date table filter
export interface AcademicDatesFilterhProps {
  searchString: string;
  academicYearId: string;
  curriculumId: string;
}


export interface IAcademicDatesTableData {
    id: number,
    class: string,
    startDate: string,
    endDate: string
}

export interface addAcademicYearDateModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle?: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  modalData?:any
}

export interface ModalType {
  showModal: boolean;
  branchId: string;
  modalData: any
}

// add academic year date modal filter types
export interface AddAcademicYearDateModalFilterhProps {
  academicYear: string;
  curriculum: string;
}

export interface IInstDepartmentInfo {
  id: string;
  // createdAt: string;
  // createdBy: string | null;
  // lastModifiedAt: string;
  classData: string | null;
  endDate: string | null;
  startDate: string | null;
  // active: boolean;
  // shortCode: string;
  // name: string;
}


export interface IAddDepartmentInfoState {
    uniqueId?: string,
     classData: string | null,
    startDate: string | null,
    endDate: string | null
}

export interface IAddDepartmentsState {
    academicYear: string;
    curriculum: string;
    departments: Array<IAddDepartmentInfoState>
}

export interface IDelAcademicDateModalState {
  showModal: boolean;
  classId: string;
}

export interface IAcademicResp {
  prevDeleteAcademicDateRep: any;
  prevAddAcademicDateRep: any;
  prevUpdateAcademicDateRep: any;
  prevAcademicErrorRep: any;
}
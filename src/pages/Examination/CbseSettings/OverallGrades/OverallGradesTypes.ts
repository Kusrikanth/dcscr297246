
export interface OverallGradesDataType {
    id: number;
    fromMarks: string;
    toMarks: string;
    grade: string;
  }
  
  export interface IOverallGradesProps {
    isOpen: boolean;
    toggle: () => void;
    modalTitle?: string;
    instituteName?:string;
    instituteId: string;
    branchId:string;
    editBranchDetails?:string;
    modalData?:any
  }
  
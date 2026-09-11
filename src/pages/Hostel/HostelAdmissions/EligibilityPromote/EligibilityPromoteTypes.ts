  export interface EligibilityPromoteDataTypes {
    id: number;
    studentName: studentDetailsProps;
    class: string;
    section: string;
    rollNo: string;
    phoneNo: string;
    mail: string;
     status: string;
   }
   interface studentDetailsProps {
    StudName?: string;
    dep_id?: string;
    imgUrl?: string;
  }
  export interface IChangeEligibilityPromoteProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }
  export interface ExaminationMarksModelDataTypes {
    id: number;
    studentName: studentDetailsProps;
    class: string;
    section: string;
    rollNo: string;
    phoneNo: string;
    mail: string;
  }
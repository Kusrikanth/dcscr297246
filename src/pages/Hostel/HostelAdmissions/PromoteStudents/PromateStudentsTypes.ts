export interface PromoteStudentsDataTypes {
    id: number;
    slno: number;
    class: string;
    section: string;
    rollNo: string;
    phoneNo: string;
    mail: string;
   }
   interface studentDetailsProps {
    StudName?: string;
    dep_id?: string;
    imgUrl?: string;
    imgUrl1?: string;
  }
  export interface IChangePromoteStudentsProps {
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

  export interface AlmanacUploadedDataTypes {
    id: number;
    class: string;
    examinationName: string;
    curriculam:string;
    fileName:string;
    userDate:string;
    createdUser:string;
    createdDate:string;
    createdTime: string;
   }
  export interface IChangeAlmanacUploadedProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }
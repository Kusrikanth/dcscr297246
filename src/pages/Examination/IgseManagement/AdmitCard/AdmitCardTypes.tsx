interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}
export interface ExaminationDateDataTypes {
    id: number;
    studentName: studentDetailsProps;
    rollNo: string;
    startDate: string;
    endDate: string;
  }
  
  export interface IExaminationDateProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }
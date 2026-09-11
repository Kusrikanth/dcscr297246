
export interface ExaminationDateDataTypes {
    id: number;
    subjectName: string;
    startDate: string;
    endDate: string;
  }
  
  export interface IExaminationDateProps {
    isOpen: boolean,
    toggle: any,
    modalTitle?: string,
  }
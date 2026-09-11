interface studentDetailsProps {
    StudName?: string;
    dep_id?: string;
    imgUrl?: string;
  }
  
  export interface ReportCardDataTypes {
      id: number;
      studentName: studentDetailsProps;
      rollNo: string;
      class : string;
      mathematics : string;
      status: string;
    }
    export interface ReportCardProps {
        isOpen: boolean,
        toggle: any,
        modalTitle?: string,
        existingSubject: string;
        replaceSubject: string;
      }
    
  
interface studentDetailsProps {
    StudName?: string;
    dep_id?: string;
    imgUrl?: string;
  }
  
  export interface ProgressCardDataTypes {
      id: number;
      studentName: studentDetailsProps;
      rollNo: string;
      class : string;
      mathematics : string;
      reportGeneration: string;
      status: string;
    }
    export interface ProgressCardProps {
        isOpen: boolean,
        toggle: any,
        modalTitle?: string,
      }
    
  
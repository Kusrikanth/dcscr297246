interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

export interface MarksEntryDataTypes {
    id: number;
    studentName: studentDetailsProps;
    rollNo: string;
    status: string;
  }
  

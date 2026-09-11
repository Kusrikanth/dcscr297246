export interface ClassWiseTopPerformersFilterhProps {
    board: string,
    class: string,
}

// add students table data
interface studentDetailsProps {
  name?: string;
  dep_id?: string;
  imgUrl?: string;
}

// academic table data
export interface IClassWiseTopPerformersTableData {
  id: number;
  studentName: studentDetailsProps | string;
  campus: string;
  totalMarks: string;
  marks: string;
}
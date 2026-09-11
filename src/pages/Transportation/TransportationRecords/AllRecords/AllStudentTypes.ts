export interface AllStudentsFilterhProps {
  search: string;
  year: string;
  requestType: string;
  statusdata: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

export interface AllStudentsTableDataType {
  id: number;
  requestNo: string;
  studentName: studentDetailsProps;
  existingRoute: string;
  existingPickUpPoint: string;
  newRoute: string;
  newPickUpPoint: string;
  status: string;
}

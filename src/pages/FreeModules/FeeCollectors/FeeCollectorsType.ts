// ChequeHistory filter props

export interface FeeCollectorsProps {
  search: string;
}

export interface TeacherNameDataProps {
  id: number;
  name: string;
  dep_id: string;
  imgUrl: string;
}

export interface FeeCollectorsTableData {
  id: number;
  personalInfo: TeacherNameDataProps;
  userType: string;
  mobileNo: string;
}

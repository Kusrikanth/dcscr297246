export interface NewRequestsFilterhProps {
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

export interface NewRequestsTableDataType {
  id: number;
  requestNo: string;
  studentName: studentDetailsProps;
  newRoute: string;
  pickUpPoint: string;
  dropPoint: string;
  status: string;
}
export interface AddNewRequestsTypes {
  requestNo: string;
  section: string;
  curriculum: string;
  studentNo: string;
  studentName: string;
  withEffectDate: string;
  newRoute: string;
  slab: string;
  pickUpTime: string;
  dropTime: string;
  class: string;
  document: string;
  concessionDetails: {
    concession: string;
    price: string;
  };
  remarks: string;
}
export interface ApplicableTermsTableDataTypes {
  id: number;
  terms: string;
  fromDate: string;
  toDate: string;
}

// CampusTransferRequests table filter
export interface CampusTransferRequestsFilterProps {
  search: string;
  year: string;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: any;
}

// CampusTransferRequests table data type
export interface CampusTransferRequestsDataTypes {
  id: number;
  studentName: studentDetailsProps;
  curriculum: string;
  changeCurriculum: string;
  class: string;
  changeClass: string;
  // eslint-disable-next-line no-restricted-globals
  approvalStatus: string;
}

export interface CampusTransferRequestModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  requestDetails: any;
}

export interface CampusTransferRequestConfirmModalType {
  showModal: boolean;
  branchId: string;
}

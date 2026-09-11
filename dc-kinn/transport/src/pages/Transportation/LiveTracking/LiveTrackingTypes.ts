export interface LiveTrackingFilterType {
  search: string;
}

export interface LiveTrackingTypeModal {
  showModal: boolean;
  branchId: string;
}

export interface LiveTrackingTypeModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

export interface LiveTrackingModalTableDataType {
  id: number;
  stopName: string;
  status: string;
  address: string;
  arrivalTime: string;
  departureTime: string;
  actualHalt: string;
  students: string;
}

export interface AllocateAnotherVehicleTypes {
  vehicle: string;
  driver: string;
  attendant: string;
}

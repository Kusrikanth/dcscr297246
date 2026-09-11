export interface CreateStopDataProps {
  routeId: string;
  stopName: string;
  slab: string;
  pickUpTime: string;
  dropOfTime: string;
}

export interface ModalTypes {
  showModal: boolean;
  branchId: string;
}

export interface ModalDataTypeProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

export interface ShiftStopsDataType {
  routeName: string;
  stopName: string;
  shiftToRoute: string;
}

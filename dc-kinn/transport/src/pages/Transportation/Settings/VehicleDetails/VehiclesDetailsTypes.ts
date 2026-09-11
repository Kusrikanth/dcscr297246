export interface vehicalDetailsProps {
  registrationNo: string;
  vehicleStatus: string;
}

export interface vehicalDetailsData {
  id: number;
  registrationNo: string;
  vehicleID: string;
  make: string;
  vehicleType: string;
  vehicleCapacity: string;
}
export interface VehicalDetailsOpenModal {
  showModal: boolean;
  branchId: string;
}

export interface IVehicalDetailsModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  vehicleDetailId: string;
  editBranchDetails: string | undefined;
}
export interface IVehicalDetailsModal {
  showModal: boolean;
  vehicleDetailId: string;
}

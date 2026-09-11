export interface vehicalsTypesProps {
  search: string;
}

export interface vehicalTypesData {
  id: number;
  routes: string;
  vehicleType: string;
}
export interface VehicalsTypeOpenModal {
  showModal: boolean;
  branchId: string;
}
export interface VehicalsTypeModalProps {
  id: number;
  vehicalType: string;
  [key: string]: any;
}
export interface IVehicalsTypeModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
export interface IVehicalsTypeModal {
  showModal: boolean;
  vehicleId: string;
}

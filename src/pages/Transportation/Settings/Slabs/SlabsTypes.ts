export interface SlabsFilterProps {
  search: string;
  academicYear: string;
}

export interface SlabsDataTypes {
  id: number;
  slabName: string;
  fromDistance: string;
  toDistance: string;
}

export interface ISlabsTabModal {
  showModal: boolean;
  slabId: string;
}
export interface NewRoutesDataType {
  routeName: string;
  vehicle: string;
  driver: string;
  attendant: string;
  employee: string;
}
export interface ISlabsModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  slabId: string | undefined;
  editBranchDetails: string | undefined;
}
export interface NewSlabDataTypes {
  id: number;
  slabName: string;
  fromDistance: number;
  toDistance: number;
}
export interface ISlabType {
  id: number;
  slabName: string;
  fromDistance: number;
  toDistance: number;
  radius: number; 
}

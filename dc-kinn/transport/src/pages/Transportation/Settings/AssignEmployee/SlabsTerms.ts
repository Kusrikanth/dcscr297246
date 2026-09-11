export interface SlabsTermsFilterProps {
  search: string;
  academicYear: string;
  termsType: string;
}

export interface SlabsTermsTypes {
  id: number;
  slabName: string;
  fromDistance: string;
  toDistance: string;
  attendantname:string,
  amount: string;
}

export interface ISlabsTermsModal {
  showModal: boolean;
  branchId: string;
}

export interface ISlabsTermsModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}

export interface ISlabTermsType {
  id: number;
  slabName: string;
  distanceRange: string;
  amount: number;
}

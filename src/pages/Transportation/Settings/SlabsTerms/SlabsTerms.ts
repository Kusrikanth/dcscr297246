export interface SlabsTermsFilterProps {
  slabName: string;
  academicYearId: string;
  termTypeIds:any;
}

export interface SlabsTermsTypes {
  id: number;
  slabName: string;
  fromDistance: string;
  toDistance: string;
  amount: string;
}

export interface ISlabsTermsModal {
  showModal: boolean;
  slabTermId: any;
}

export interface ISlabsTermsModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  slabTermId: string;
  editBranchDetails: string | undefined;
}

export interface ISlabTermsType {
  id: number;
  slabName: string;
  distanceRange: string;
  amount: number;
}

// export interface SlabsFilterProps {
//   search: string;
//   academicYear: string;
// }

// export interface ISelectInput {
//   id: string;
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   menuItems: string[];
// }

export interface ISlabsTabModal {
  showModal: boolean;
  branchId: string;
}
// export interface NewRoutesDataType {
//   routeName: string;
//   vehicle: string;
//   driver: string;
//   attendant: string;
//   employee: string;
// }
// export interface ISlabsModalProps {
//   isOpen: boolean;
//   toggle: any;
//   modalTitle: string;
//   instituteId: string;
//   instituteName: string;
//   branchId: string;
//   editBranchDetails: string | undefined;
// }
// export interface NewSlabDataTypes {
//   id: number;
//   slabName: string;
//   fromDistance: number;
//   toDistance: number;
// }
// export interface ISlabType {
//   id: number;
//   slabName: string;
//   fromDistance: number;
//   toDistance: number;
//   radius: number; 
// }





// SlabsTypes.ts
export interface ISlabType {
  id: number;
  route: string;
  stop: string;
  slab: string;
  slabName: string;
  fromDistance: number;
  toDistance: number;
  radius: number;
  pickupTime: string;
  dropTime: string;
}

export interface ISlabsModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
}

export interface ITimeInput {
  name: string;
  formgroupClassName?: string | undefined;
  labelText?: string;
  inputClassName?: string;
  value?: string | number | undefined | null;
  placeHolder?: string;
  onChange?: any;
  onBlur?: any;
  invalid?: boolean;
  error?: any;
  isReadOnly?: boolean;
  isDisabled?: boolean;
}

export interface ISelectInput {
  name: string;
  formgroupClassName?: string | undefined;
  labelText?: string;
  inputClassName?: string;
  onChange?: any;
  onBlur?: any;
  invalid?: boolean;
  error?: any;
  customWidth?: any;
  valueKey: string;
  textKey: string;
  menuItems: any[] | undefined;
  hideSelectOption?: boolean;
  defaultSelect?: string;
  defaultValue?: string;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  labelClass?: string;
}

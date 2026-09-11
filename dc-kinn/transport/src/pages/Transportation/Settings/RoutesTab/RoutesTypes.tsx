export interface routesProps {
  search: string;
}
export interface UserDataProps {
  id: number;
  name: string;
  dep_id: string;
  imgUrl: string;
}
export interface RoutesTabDataTypes {
  id: number;
  routes: string;
  stopName: string;
  slabs: string;
}

export interface IRoutesTabModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
}
export interface IRoutesTabModal {
  showModal: boolean;
  branchId: string;
  routeId?:any;
  routeData:any;
}

export interface NewRoutesDataType {
  [key: string]: number | string;
  id:number;
  routeName: string;
  routeCode: string;
}
export interface ISlabType {
  id: number;
  slabName: string;
  fromDistance: number;
  toDistance: number;
}
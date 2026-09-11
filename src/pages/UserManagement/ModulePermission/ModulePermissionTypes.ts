// Tabbar menu types
export interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  onClick?: () => void;
}

// manage student table filter
export interface ManagePermissionFilterhProps {
  userType: string;
}

export interface ManagePermissionTableType {
  id: number;
  submodule: string;
  create: boolean;
  edit: boolean;
  view: boolean;
  delete: boolean;
}
// manage student table filter
// export interface CreateParentFilterhProps {
//   search: string;
// }
// export interface CreateEmployeeFilterhProps {
//   search: string;
//   employeeCategory: string;
// }
// export interface ManageParentFilterhProps {
//   search: string;
//   class: string;
//   section: string;
//   status: string;
// }
// export interface ManageEmployeeFilterhProps {
//   search: string;
//   class: string;
//   section: string;
//   status: string;
// }
// export interface CreatePasswordProps {
//   newPassword: string;
//   confirmPassword: string;
// }

// interface studentDetailsProps {
//   StudName?: string;
//   dep_id?: string;
//   imgUrl?: string;
// }

// // payment received table data type
// export interface StudentTableData {
//   id: number;
//   studentName: studentDetailsProps;
//   class: string;
//   section: string;
//   emailId: string;
//   userName: string;
//   createdDate: string;

//   // eslint-disable-next-line no-restricted-globals
//   status: string;
// }
// export interface ParentTableData {
//   id: number;
//   studentName: studentDetailsProps;
//   phoneNo: string;
//   emailId: string;
//   userName: string;
//   createdDate: string;

//   // eslint-disable-next-line no-restricted-globals
//   status: string;
// }
// export interface EmployeeTableData {
//   id: number;
//   studentName: studentDetailsProps;
//   employeeCategory: string;
//   phoneNo: string;
//   emailId: string;
//   userName: string;
//   createdDate: string;

//   // eslint-disable-next-line no-restricted-globals
//   status: string;
// }

// // create student account modal
// export interface CreateStudentAccModalType {
//   showModal: boolean;
//   branchId: string;
// }
// export interface CreateParentAccModalType {
//   showModal: boolean;
//   branchId: string;
// }
// export interface CreateEmployeeAccModalType {
//   showModal: boolean;
//   branchId: string;
// }
// export interface CreatePasswordAccModalType {
//   showModal: boolean;
//   branchId: string;
// }

// // Modal types
// export interface CreateStudentAccModalProps {
//   isOpen: boolean;
//   toggle: any;
//   modalTitle: string;
//   instituteId: string;
//   instituteName: string;
//   branchId: string;
//   editBranchDetails: string | undefined;
// }
// export interface CreateParentAccModalProps {
//   isOpen: boolean;
//   toggle: any;
//   modalTitle: string;
//   instituteId: string;
//   instituteName: string;
//   branchId: string;
//   editBranchDetails: string | undefined;
// }
// export interface CreateEmployeeAccModalProps {
//   isOpen: boolean;
//   toggle: any;
//   modalTitle: string;
//   instituteId: string;
//   instituteName: string;
//   branchId: string;
//   editBranchDetails: string | undefined;
// }
// export interface CreatePasswordAccModalProps {
//   isOpen: boolean;
//   toggle: any;
//   modalTitle: string;
//   instituteId: string;
//   instituteName: string;
//   branchId: string;
//   editBranchDetails: string | undefined;
// }

// // create student table data type
// export interface CreateStudentTableData {
//   id: number;
//   name: studentDetailsProps;
//   class: string;
//   section: string;
// }
// export interface CreateParentTableData {
//   id: number;
//   name: studentDetailsProps;
//   phoneNo: string;
// }
// export interface CreateEmployeeTableData {
//   id: number;
//   name: studentDetailsProps;
//   employeeCategory: string;
// }

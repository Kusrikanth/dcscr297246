// language table filter

export interface languageFilterhProps {
  searchString: string;
}

// language table data
export interface ILanguageTableData {
  id: number;
  languageName: string;
  // shortName: string;
}

// add languages modal
export interface IAddLanguageModal {
  showModal: boolean;
  branchId: string;
  modalData: any;
}

// Modal types
export interface IAddLanguageModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  modalData?: any;
}

export interface ITermsState {
  id: number;
  curriculumnName: string;
}
export interface newLanguageType {
  languageName: string;
  shortName?: string;
}
export interface searchInputProps {
  fields?: Array<IAddLanguagesState>;
}
export interface IDelLanguageModalState {
  showModal: boolean;
  languageId: string;
}
export interface ILanguageResp {
  prevDeleteLanguageResp?: any;
  prevAddLanguageResp?: any;
  prevUpdateLanguageResp?: any;
  // prevSetMainLanguageResp: any;
  prevLanguageErrorResp?: any;
}
export interface IAddLanguagesState {
  fields: Array<newLanguageType>
}
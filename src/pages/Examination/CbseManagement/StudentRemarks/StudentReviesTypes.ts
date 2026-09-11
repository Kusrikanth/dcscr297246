
export interface SubjectDataTypes {
  id: any;
  studentId: number;
  studentCode: number;
  totalElements : number;
  totalPages : number;
  pageable : number;
  remarks: number | string | null;
  remarkContextId: null;
  studentImageBase64: null;
  isSelected: boolean;
  errors?: {
    remarks?: string;
  };
  touched?: {
    remarks?: boolean;
  };
}

export interface ISubjectError {
  remarks?: string;
  remarkContextId?: string;
}

export interface IErrorState {
  message: string;
}

export type AllCheckedFunction = (field: keyof SubjectDataTypes) => boolean;

export  interface HandleToggleAllFunction {
  (field: keyof SubjectDataTypes, event: React.ChangeEvent<HTMLInputElement>): void;
}

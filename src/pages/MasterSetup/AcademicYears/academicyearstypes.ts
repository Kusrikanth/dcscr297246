// Interface & Types

import { IAcademicYearInfo } from "../../../store/mastersettings/instacademics/instacademictypes";
import { IModelWithPagination } from "../../../store/types";

//Index file types
export interface IAcademicYearsProps {
  instituteName: string;
  instituteId: string;
}

export interface IAcademicYearModalState {
  showModal: boolean;
  academicYearId: string | undefined;
  modalData?: IAcademicYearInfo | undefined;
}

export interface IDelAcademicYearModalState {
  showModal: boolean;
  academicYearId: string;
}

export interface IAcademicYearsDateRespRef {
  prevAcademicYearListResp: IModelWithPagination<IAcademicYearInfo> | undefined;
  prevDeleteAcademicYearResp: any;
  prevInstAcademicErrorResp: any;
}
export interface IAcademicYearRespRef {
  prevAcademicYearListResp: IModelWithPagination<IAcademicYearInfo> | undefined;
}

//Add Academic Year Modal
export interface IAddAcademicYearProps {
  isOpen: boolean;
  toggle: any;
  modalTitle: string;
  academicYearId: string | undefined;
  instituteId: string;
  editModalData: IAcademicYearInfo | undefined;
}

export interface IAddEditAcademicYearRespRef {
  prevAddAcademicYearResp: IAcademicYearInfo | undefined;
  prevUpdateAcademicYearResp: any;
}

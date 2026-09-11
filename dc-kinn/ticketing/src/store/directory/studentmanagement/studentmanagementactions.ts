import { createAction } from "@reduxjs/toolkit";
import { StudentManagementConstants } from "./studentmanagementconstants";
import { INewActionType } from "../../types";


export {
    setStudentsListAct, setPastEductionClassAct, setGetStudentByIdAct,
    setGetSiblingDetailsAct, setStudentsStatsAct,
    setAddStudentAct, setParentsStatsAct, setAllParentsListAct,
    setStudentsIdsListAct,
    setStudentListByRegNoAct, setParentChildrensAct,setStudentAttendanceAct, resetGetStudentByIdAct, resetStudentAttendanceAct
} from "./studentmanagementslice";

export const getStudentAttendanceAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENT_ATTENDANCE);

export const getStudentsStatsAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENTS_STATS_REQUEST);

export const getStudentsListAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENTS_LIST_REQUEST);
export const getStudentsIDsListAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENTS_IDSLIST_REQUEST);

export const addStudentAct = createAction<INewActionType | undefined>(StudentManagementConstants.ADD_STUDENT_REQUEST);

export const getStudentByIdAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENT_BYID_REQUEST);


export const getSiblingDetailsAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_SIBLING_DETAILS_REQUEST);

export const downloadDocumentByIdAct = createAction<INewActionType | undefined>(StudentManagementConstants.DOWNLOAD_DOCUMENT_BYID_REQUEST);

export const updateStudentAct = createAction<INewActionType | undefined>(StudentManagementConstants.UPDATE_STUDENT_REQUEST);

export const deleteStudentAct = createAction<INewActionType | undefined>(StudentManagementConstants.DELETE_STUDENT_REQUEST);

export const uploadStudentDocumentAct = createAction<INewActionType | undefined>(StudentManagementConstants.UPLOAD_STUDENT_DOCUMENT_REQUEST);
export const classWiseDocumentListAct = createAction<INewActionType | undefined>(StudentManagementConstants.CLASS_WISE_DOCUMENT_LIST);


export const getStudentByFilterAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENTS_BYFILTER_REQUEST);

export const exportStudentDataAct = createAction<INewActionType | undefined>(StudentManagementConstants.EXPORT_STUDENT_DATA_REQUEST);
export const exportStudentRegistrationDataAct = createAction<INewActionType | undefined>(StudentManagementConstants.EXPORT_STUDENT_REGISTRATION_DATA_REQUEST);

export const pastEducationClassAct = createAction<INewActionType | undefined>(StudentManagementConstants.PAST_EDUCATION_CLASS_REQUEST);

export const permanentAddressStateAct = createAction<INewActionType | undefined>(StudentManagementConstants.PERMANENT_ADDRESS_STATE_REQUEST);

export const permanentAddressCityAct = createAction<INewActionType | undefined>(StudentManagementConstants.PERMANENT_ADDRESS_CITY_REQUEST);

export const getStudentFatherEmployeeDetailsAct = createAction<INewActionType | undefined>(StudentManagementConstants.STUDENT_FATHER_EMPLOYEE_DETAILS_REQUEST);

export const getStudentMotherEmployeeDetailsAct = createAction<INewActionType | undefined>(StudentManagementConstants.STUDENT_MOTHER_EMPLOYEE_DETAILS_REQUEST);

export const getAllParentsListAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_ALL_PARENTS_LIST_REQUEST);

export const exportParentListAct = createAction<INewActionType | undefined>(StudentManagementConstants.EXPORT_PARENT_lIST);

export const sendCredentialsParentAct = createAction<INewActionType | undefined>(StudentManagementConstants.SEND_CREDENTIALS_PARENT);

export const getParentChildrensAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_PARENT_CHIDRENS_REQUEST);

export const getParentDetailsByIdAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_PARENT_DETAILS_BYID_REQUEST);

export const getParentsStatsAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_PARENTS_STATS_REQUEST);

export const getStudentListByRegNoAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENTLIST_BYREGNO_REQUEST);

export const getStudentDetailByRegNoAct = createAction<INewActionType | undefined>(StudentManagementConstants.GET_STUDENT_DETAIL_BYREGNO_REQUEST);

export const updatePrimaryContactAct = createAction<INewActionType | undefined>(StudentManagementConstants.UPDATE_PRIMARY_CONTACT_REQUEST);

export const updateStudentDetailsAct = createAction<INewActionType | undefined>(StudentManagementConstants.UPDATE_STUDENT_DETAILS);
export const updateWhatsappnoAct = createAction<INewActionType | undefined>(StudentManagementConstants.UPDATE_WHATSAPP_NUMBER_REQUEST);

export const deleteDocByIdAct = createAction<INewActionType | undefined>(StudentManagementConstants.DELETE_DOC_BY_ID);


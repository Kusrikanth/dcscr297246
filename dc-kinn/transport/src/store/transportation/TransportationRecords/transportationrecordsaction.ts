import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { TransportRecordsConstants } from "./transportationrecordsconstants";

export {resetAllocationDetailsAct,resetTermsForTerminationReqAct} from "./transportationrecordsslice";

// All Students

export const getAllStudentsTransRecListAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_ALL_STUDENTS_LIST);
export const exportAllNewRequestAct = createAction<INewActionType | undefined>(TransportRecordsConstants.EXPORT_ALL_NEW_REQUEST);

// New Resquests

export const getNewRequestListAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_NEW_REQUEST_LIST);
export const approveTransportRequestAct = createAction<INewActionType | undefined>(TransportRecordsConstants.APPROVE_TRANSPORT_REQUEST);
export const requestNoTransportRequestAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_REQUESTNO_TRANSPORT_REQUEST);
export const getTermsTransportBySlabIdAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_TERMS_FORTRANSPORT_BYSLABID_REQUEST);


export const approveSubmittedTransportReqAct =  createAction<INewActionType | undefined>(TransportRecordsConstants.APPROVE_SUBMITTED_TRANSPORT_REQUEST);
export const getTransportRequestByIdAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_TRANSPORTINFO_BYID_REQUEST);
export const deleteTransportReqAct = createAction<INewActionType | undefined>(TransportRecordsConstants.DELETE_TRANSPORT_NEW_REQUEST);
export const exportTransportNewReqAct = createAction<INewActionType | undefined>(TransportRecordsConstants.EXPORT_TRANSPORT_NEW_REQUEST);

// change request

export const getChangeRequestListAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_CHANGE_REQUEST_LIST);
export const getAllocationDetailsAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_ALLOCATION_DETAILS);

// termination

export const getTerminationListAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_TERMINATION_LIST);
export const addTerminationRequestAct = createAction<INewActionType | undefined>(TransportRecordsConstants.ADD_TERMINATION_REQUEST);
export const getTermsForTerminationReqAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_TERMS_FOR_TERMINATION_REQUEST);
export const rejectTerminationReqAct = createAction<INewActionType | undefined>(TransportRecordsConstants.REJECT_TERMINATION_REQUEST);

// student records

export const getStuTransportationRecordsAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_STU_TRANSPORTAION_RECORDS);
export const exportStuTransportationRecordsAct = createAction<INewActionType | undefined>(TransportRecordsConstants.EXPORT_STU_TRANSPORTAION_RECORDS);

// employee records

export const getEmpTransportationRecordsAct = createAction<INewActionType | undefined>(TransportRecordsConstants.GET_EMP_TRANSPORTAION_RECORDS);
export const exportEmpTransportationRecordsAct = createAction<INewActionType | undefined>(TransportRecordsConstants.EXPORT_EMP_TRANSPORTAION_RECORDS);
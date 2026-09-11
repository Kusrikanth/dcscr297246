

import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../../types";
import { HostelStudentLedgerConstants } from "./hostelrequestconstants";

export { setHostelEligibleClassesAct, setHigherClassEligibilityStudAct , setTerminationStuLedgersAct,
    setHostelTransferRequestAct
 } from "./hostelrequestslice";

export const getHostelNotOptedStudentsAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_NOTOPTED_STUDENTS_REQUEST);
export const getHostelOptedStudentsAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_OPTED_STUDENTS_REQUEST);
export const saveHostelOptedStudentsAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.SAVE_HOSTEL_OPTED_STUDENTS_REQUEST);
export const deleteHostelOptedStudentAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.DELETE_HOSTEL_OPTED_STUDENT_REQUEST);
export const exportHostelShortlistStuListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_SHORTLIST_STU_LIST);
export const reActivateHostelShortlistByIdAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.RE_ACTIVATE_HOSETL_SHORTLIST_BY_ID)

// promote students 

export const getHostelPromoteStuListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_PROMOTE_STU_LIST);
export const getSaveHostelPromoteStuListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_SAVE_HOSTEL_PROMOTE_STU_LIST);
export const saveHostelPromoteStuAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.SAVE_HOSTEL_PROMOTE_STU);


// eligibility for promote students
export const getHigherClassEligibilityStudAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HIGHERCLASS_ELIGIBILTYSTUD_REQUEST);
export const getHostelEligibleClassesAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_ELIGIBLECLASSES_REQUEST);
export const getEligibleStudForPromoteAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_ELIGIBLESTUD_FORPROMOTE_REQUEST);
export const saveEligibleStudForPromoteAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.SAVE_ELIGIBLESTUD_FORPROMOTE_REQUEST);
export const revertRemoveHostelPromotionAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.REVERT_REMOVE_HOSTELPROMOTION_REQUEST);

// Hostel Bed Allocation

export const getHostelBedAllocationListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_BED_ALLOCATION_LIST);
export const deallocateHostelBedAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.DEALLOCATE_BED_REQUEST);
export const getStuListForAllocateBedAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_STU_LIST_FOR_ALLOCATE_BED);
export const getNotAllocateBedListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_NOT_ALLOCATE_BED_LIST);
export const addHostelBedAllocationAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.ADD_HOSTEL_BED_ALLOCATION);
export const exportHostelBedAllocationAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.EXPORT_HOSTEL_BED_ALLOCATION);

// Hostel Termination

export const getHostelTerminationListAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_TERMINATION_LIST);
export const getTerminationStuLedgersAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_TERMINATION_STU_LEDGERS);
export const saveHostelTerminationAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.SAVE_HOSTEL_TERMINATION_LIST);
export const revertHostelTerminationByIdAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.REVERT_HOSTEL_TERMINATION_BY_ID)



//Hostel Transfer Request
export const hostelTransferRequestAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.GET_HOSTEL_TRANSFER_REQUEST);
export const updateHostelTransferStatusAct = createAction<INewActionType | undefined>(HostelStudentLedgerConstants.UPDATE_HOSTEL_TRANSFER_STATUS_REQUEST);

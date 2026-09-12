
import { createAction } from "@reduxjs/toolkit";
import { FeeReportConstants } from "./feereportconstants";
import { INewActionType } from "../../types";

export {
    setFeeNameByTypeAct, setfeeTermByTypeAct,
    setFeeNameForFilterAct,
    resetUnpaidFeedbackListAct, resetUnpaidListAct,setUnpaidStudentCountAct
} from "./feereportslice";
export const getFeeNameByTypeAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_FEENAME_BYTYPE_REQUEST);
export const getFeeTermByTypeAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_FEETERM_BYTYPE_REQUEST);
export const getFeeNameForFilterAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_FEENAME_FORFILTER_REQUEST);

export const getFeeCollectionAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_FEECOLLECTION_REQUEST);
export const exportFeeCollectionAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_FEECOLLECTION_REQUEST);
export const getUnpaidListStudentAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_UNPAID_REPORT_REQUEST);
export const getUnpaidFeedbackListAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_UNPAID_FEEDBACK_LIST);
export const sendEmailSmsUnpaidListAct = createAction<INewActionType | undefined>(FeeReportConstants.SEND_EMAIL_SMS_UNPAID_LIST);
export const getFeedbackByIdAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_FEEDBACK_BY_REGID);
export const fillFeedbackFormAct = createAction<INewActionType | undefined>(FeeReportConstants.FILL_FEEDBACK_FORM);
export const exportUnpaidListAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_UNPAID_LIST);

export const fullEmployeeConcessionAct = createAction<INewActionType | undefined>(FeeReportConstants.FULL_EMPLOYEE_CONCESSION);

export const getCbseVerifyReportAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_CBSE_VERIFY_REPORT_REQUEST);
export const downloadCbseVerifyListAct = createAction<INewActionType | undefined>(FeeReportConstants.DOWNLOAD_CBSE_VERIFY_REPORT);
export const exportCbseVerificationAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_CBSE_VERIFICATION_REQUEST);

// Fee Dashboard

export const getFeeDashboardStatsAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_DASHBOARD_STATS);
export const getFeeDashboardJodoPaymentModeStatusStatsAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_DASHBOARD_JODO_PAYMENT_MODE_STATUS_STATS);
export const getFeeDashboardTransactionSummaryAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_DASHBOARD_TRANSACTION_SUMMARY);
export const getFeeCollectionDashboardAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_COLLECTION_DASHBOARD);
export const getFeeDashboardCollectionStatsAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_DASHBOARD_COLLECTION_STATS);
export const getFeeRevenueDashboardAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_REVENUE_DASHBOARD);
export const getFeeDashboardConcessionAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_DASHBOARD_CONCESSION_TYPE);
export const getFeeDashboardPaymentModeAct = createAction<INewActionType | undefined>(FeeReportConstants.FEE_DASHBOARD_PAYMENT_MODE);

export const ccAvenueOrderStatsAct = createAction<INewActionType | undefined>(FeeReportConstants.CC_AVENUE_ORDER_STATS);

// Super Admin Fee Dashboard

export const getNetPaidFeeByBranchAct = createAction<INewActionType | undefined>(FeeReportConstants.NET_PAID_FEE_BY_BRANCH);
export const getBranchWiseDueSummaryAct = createAction<INewActionType | undefined>(FeeReportConstants.BRANCH_WISE_DUE_SUMMARY);
export const exportBranchWiseDueSummaryAct = createAction<INewActionType | undefined>(FeeReportConstants.BRANCH_WISE_DUE_SUMMARY_EXPORT);
export const getUnpaidStudentCountAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_UNPAID_STUDENT_COUNT);
export const getBranchWiseNetPaidByDateAct = createAction<INewActionType | undefined>(FeeReportConstants.BRANCH_WISE_NET_PAID_BY_DATE);
export const exportBranchWiseNetPaidByDateAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_BRANCH_WISE_NET_PAID_BY_DATE);
export const getBranchWiseNetAmountAct = createAction<INewActionType | undefined>(FeeReportConstants.BRANCH_WISE_NET_AMOUNT);
export const getClassSectionWiseNetAmountAct = createAction<INewActionType | undefined>(FeeReportConstants.CLASS_SECTION_WISE_NET_AMOUNT);
export const exportClassSectionWiseNetAmountAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_CLASS_SECTION_WISE_NET_AMOUNT);
export const exportBranchWiseNetAmountAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_BRANCH_WISE_NET_AMOUNT);

// Super Admin Transport Dashboard

export const getVehicleTypeListDashboardAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_VEHICLE_TYPE_LIST_DASHBOARD);
export const exportVehicleTypeListDashboardAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_VEHICLE_TYPE_LIST_DASHBOARD);
export const getTransportFeeTermWiseAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_TRANSPORT_FEE_TERM_WISE);
export const exportTransportFeeTermWiseAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_TRANSPORT_FEE_TERM_WISE);
export const getActiveVehiclesListAct = createAction<INewActionType | undefined>(FeeReportConstants.ACTIVE_VEHICLES_LIST);
export const getStuAvailingListAct = createAction<INewActionType | undefined>(FeeReportConstants.STU_AVAILING_LIST);
export const getTransportOptedListAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_TRANSPORT_OPTED_LIST);
export const getPendingReqListAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_PENDING_REQ_LIST);

export const getFeeCallingReportAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_FEE_CALLING_REPORT);
export const getFeeCallingReportSummaryAct = createAction<INewActionType | undefined>(FeeReportConstants.GET_FEE_CALLING_REPORT_SUMMARY);
export const exportFeeCallingReportAct = createAction<INewActionType | undefined>(FeeReportConstants.EXPORT_FEE_CALLING_REPORT);

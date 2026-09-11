import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClassroomManagmentReducerState } from "./classroommanagmenttypes";

const initialState: IClassroomManagmentReducerState = {
  branchCurriculumListResp: undefined,
  academicClassListResp: undefined,
  branchCurriculumErrorResp: undefined,
  academicClassErrorResp: undefined,
  sectionListResp: undefined,
  sectionListFilterResp: undefined,
  higherClassStudentListResp: undefined,
  removePromotionResp: undefined,
  deletePromotionResp: undefined,
  nonEligibleHigherClassStudentListResp: undefined,
  assignHigherClassStudentListResp: undefined,
  sectionErrorResp: undefined,
  sectionDetailsByIdResp: undefined,
  sectionDetailsByIdErrorResp: undefined,
  classroomListResp: undefined,
  classroomErrorResp: undefined,
  teacherListResp: undefined,
  teacherListErrorResp: undefined,
  studentListResp: undefined,
  studentListErrorResp: undefined,
  studentListBySectionResp: undefined,
  studentListBySectionErrorResp: undefined,
  unAssignedstudentListResp: undefined,
  unAssignedstudentListErrorResp: undefined,
  updateClassroomResp: undefined,
  updateClassroomErrorResp: undefined,
  updateClassroomTeacherResp: undefined,
  updateClassroomTeacherErrorResp: undefined,
  updateSectionStudentsResp: undefined,
  updateSectionStudentsErrorResp: undefined,
  removeSectionStudentsResp: undefined,
  removeSectionStudentsErrorResp: undefined,
  getGenerateRollNoResp: undefined,
  getGenerateIdStatus: undefined,
  getRollNoListState: undefined,
  assignRollNoState: undefined,
  streamChangeReqList: undefined,
  streamChangeStudentList: undefined,
  classListChangeStream: undefined,
  streamReqestResp: undefined,
  approveRejectStreamReqResp: undefined,
  getChangeCurriculumReqResp: undefined,
  getCurriculumStudentList: undefined,
  setChangeCurriculumReq: undefined,
  approveRejectCurriculumReqResp: undefined,
  promotedStudentList: undefined,
  higherClassStudentForPromo: undefined,
  promoteHigherClassStudents: undefined,
  curriculumList: undefined,
  classList: undefined,
  streamClassList: undefined,
  sectionSubjectList: undefined,
  promotedClassList: undefined,
  detentionPromotionStudends: undefined,
  ledgersOfDetainedOrPromotedResp: undefined,
  notDetentionedPromotionedStudends: undefined,
  detainedOrPromotedClasses: undefined,
  setPromoteOrDetaineStudent: undefined,
  approvalPromotionDetentionReq: undefined,
  tcRequestList: undefined,
  exportTcRequestListResp: undefined,
  tcRequestById: undefined,
  studentListTcReq: undefined,
  studentDetailsTcResp: undefined,
  studentLedgerTcResp: undefined,
  studentListBonafideCertificate: undefined,
  addTcReqRes: undefined,
  editTcReqRes: undefined,
  addBonafideCertificateRes: undefined,
  tcReqLogRes: undefined,
  initalTcIssuanceRes: undefined,
  tcIssuanceByIdResp: undefined,
  updateTcIssuanceResp: undefined,
  certificateIssuance: undefined,
  cancelTcRequest: undefined,
  tcApprovalStatusList: undefined,
  tcApproveRejectResp: undefined,
  tcConsolidatedResp: undefined,
  issueTcRequest: undefined,
  bonafideCerificates: undefined,
  previewTcRequest: undefined,
  bonafideCumStudyCerificate: undefined,
  sendMailNotification: undefined,
  parentCollectedStatus: undefined,
  bonafideCerificateById: undefined,
  updateBonafideCerificateRes: undefined,
  issueBonafideCerificateRes: undefined,
  smsNotification: undefined,
  emailNotification: undefined,
  previewBonafideCertiResp: undefined,
  saveHealthFormResp: undefined,
  getHealthFormListResp: undefined,
  getStuHealthFormListResp: undefined,
  updateHealthFormStatusResp: undefined,
  downloadStaticHealthResp: undefined,
  exportHigherClassEligiResp: undefined,
  exportDetentionPromotionResp: undefined,
  exportPromoteStudentsResp: undefined,
  updateStuRollNoResp: undefined,
  exportBonafiedListResp: undefined,
  exportTcListResp: undefined,
  bonafideCertiSendEmailResp: undefined,
  classroomManagmentErrorResp: undefined,
  deleteSectionListResp: undefined,
  fetchStudentAcademicYearDataResp: undefined,
  getCustomTcCertificateResp: undefined,
  getDepartMentApprovalResp: undefined,
};

export const classroomManagmentSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {
    setBranchCurriculumListAct: (state, action: PayloadAction<any>) => {
      state.branchCurriculumListResp = action.payload;
    },
    setBranchCurriculumErrorAct: (state, action: PayloadAction<any>) => {
      state.branchCurriculumErrorResp = action.payload;
    },
    setAcademicClassListAct: (state, action: PayloadAction<any>) => {
      state.academicClassListResp = action.payload;
    },
    setAcademicClassErrorAct: (state, action: PayloadAction<any>) => {
      state.academicClassErrorResp = action.payload;
    },
    setSectionListAct: (state, action: PayloadAction<any>) => {
      state.sectionListResp = action.payload;
    },
    resetSectionListAct: (state, action: PayloadAction<any>) => {
      state.sectionListResp = action.payload;
    },
    setSectionErrorAct: (state, action: PayloadAction<any>) => {
      state.sectionErrorResp = action.payload;
    },
    setHigherClassStudentListAct: (state, action: PayloadAction<any>) => {
      state.higherClassStudentListResp = action.payload;
    },
    setRemovePromotionAct: (state, action: PayloadAction<any>) => {
      state.removePromotionResp = action.payload;
    },
    setDeletePromotionAct: (state, action: PayloadAction<any>) => {
      state.deletePromotionResp = action.payload;
    },
    setNonEligibleHigherClassStudentListAct: (state, action: PayloadAction<any>) => {
      state.nonEligibleHigherClassStudentListResp = action.payload;
    },
    resetNonEligibleHigherClassStudentList: (state, action: PayloadAction<any>) => {
      state.nonEligibleHigherClassStudentListResp = action.payload;
    },
    assignHigherClassStudentListAct: (state, action: PayloadAction<any>) => {
      state.assignHigherClassStudentListResp = action.payload;
    },
    previewBonafideCertiListAct: (state, action: PayloadAction<any>) => {
      state.previewBonafideCertiResp = action.payload;
    },
    setSectionDetailsByIdAct: (state, action: PayloadAction<any>) => {
      state.sectionDetailsByIdResp = action.payload;
    },
    setSectionDetailsByIdErrorAct: (state, action: PayloadAction<any>) => {
      state.sectionDetailsByIdErrorResp = action.payload;
    },
    setClassroomListAct: (state, action: PayloadAction<any>) => {
      state.classroomListResp = action.payload;
    },
    setClassroomErrorAct: (state, action: PayloadAction<any>) => {
      state.classroomErrorResp = action.payload;
    },
    setTeacherListAct: (state, action: PayloadAction<any>) => {
      state.teacherListResp = action.payload;
    },
    setTeacherListErrorAct: (state, action: PayloadAction<any>) => {
      state.teacherListErrorResp = action.payload;
    },
    setStudentListAct: (state, action: PayloadAction<any>) => {
      state.studentListResp = action.payload;
    },
    setStudentListErrorAct: (state, action: PayloadAction<any>) => {
      state.studentListErrorResp = action.payload;
    },
    setStudentListBySectionAct: (state, action: PayloadAction<any>) => {
      state.studentListBySectionResp = action.payload;
    },
    setStudentListBySectionErrorAct: (state, action: PayloadAction<any>) => {
      state.studentListBySectionErrorResp = action.payload;
    },
    setUnassignedStudentListAct: (state, action: PayloadAction<any>) => {
      state.unAssignedstudentListResp = action.payload;
    },
    setUnassignedStudentListErrorAct: (state, action: PayloadAction<any>) => {
      state.unAssignedstudentListErrorResp = action.payload;
    },
    setUpdateClassroomAct: (state, action: PayloadAction<any>) => {
      state.updateClassroomResp = action.payload;
    },
    setUpdateClassroomErrorAct: (state, action: PayloadAction<any>) => {
      state.updateClassroomErrorResp = action.payload;
    },
    setUpdateClassroomTeacherAct: (state, action: PayloadAction<any>) => {
      state.updateClassroomTeacherResp = action.payload;
    },
    setUpdateClassroomTeacherErrorAct: (state, action: PayloadAction<any>) => {
      state.updateClassroomTeacherErrorResp = action.payload;
    },
    setUpdateSectionStudentsAct: (state, action: PayloadAction<any>) => {
      state.updateSectionStudentsResp = action.payload;
    },
    setUpdateSectionStudentsErrorAct: (state, action: PayloadAction<any>) => {
      state.updateSectionStudentsErrorResp = action.payload;
    },
    setRemoveSectionStudentsAct: (state, action: PayloadAction<any>) => {
      state.removeSectionStudentsResp = action.payload;
    },
    setRemoveSectionStudentsErrorAct: (state, action: PayloadAction<any>) => {
      state.removeSectionStudentsErrorResp = action.payload;
    },
    resetClassroomManagement: (state, action: PayloadAction<any>) => {
      state.academicClassListResp = action.payload;
      state.sectionListResp = action.payload;
      state.updateClassroomResp = action.payload;
      state.updateClassroomTeacherResp = action.payload;
      state.updateSectionStudentsResp = action.payload;
      state.removeSectionStudentsResp = action.payload;
      state.classroomManagmentErrorResp = action.payload;
    },
    getGenerateRollNoAct: (state, action: PayloadAction<any>) => {
      state.getGenerateRollNoResp = action.payload;
    },
    getGenerateIdStatusAct: (state, action: PayloadAction<any>) => {
      state.getGenerateIdStatus = action.payload;
    },
    resetGenerateIdStatus: (state, action: PayloadAction<any>) => {
      state.getGenerateIdStatus = action.payload;
    },
    getRollNoListAct: (state, action: PayloadAction<any>) => {
      state.getRollNoListState = action.payload;
    },
    resetRollNoList: (state, action: PayloadAction<any>) => {
      state.getRollNoListState = action.payload;
    },
    assignRollNoAct: (state, action: PayloadAction<any>) => {
      state.assignRollNoState = action.payload;
    },
    getStreamChangeRequestListAct: (state, action: PayloadAction<any>) => {
      state.streamChangeReqList = action.payload;
    },
    getStreamChangeStudentListAct: (state, action: PayloadAction<any>) => {
      state.streamChangeStudentList = action.payload;
    },
    setClassListForStreamChangeAct: (state, action: PayloadAction<any>) => {
      state.classListChangeStream = action.payload;
    },
    resetClassListForStreamChangeAct: (state, action: PayloadAction<any>) => {
      state.classListChangeStream = action.payload;
    },
    resetStreamChangeStudentList: (state, action: PayloadAction<any>) => {
      state.streamChangeStudentList = action.payload;
    },
    setStreamRequestAct: (state, action: PayloadAction<any>) => {
      state.streamReqestResp = action.payload;
    },
    setApproveRejectStreamRequestAct: (state, action: PayloadAction<any>) => {
      state.approveRejectStreamReqResp = action.payload;
    },
    getChangeCurriculumRequestAct: (state, action: PayloadAction<any>) => {
      state.getChangeCurriculumReqResp = action.payload;
    },
    getCurriculumStudentListAct: (state, action: PayloadAction<any>) => {
      state.getCurriculumStudentList = action.payload;
    },
    resetCurriculumStudentList: (state, action: PayloadAction<any>) => {
      state.getCurriculumStudentList = action.payload;
    },
    setChangeCurriculumReqRes: (state, action: PayloadAction<any>) => {
      state.setChangeCurriculumReq = action.payload;
    },
    setClassroomManagmentErrorAct: (state, action: PayloadAction<any>) => {
      state.classroomManagmentErrorResp = action.payload;
    },
    getPromotedStudentListAct: (state, action: PayloadAction<any>) => {
      state.promotedStudentList = action.payload;
    },
    resetPromotedStudentList: (state, action: PayloadAction<any>) => {
      state.promotedStudentList = action.payload;
    },
    getHigherClassStudentForPromotionAct: (state, action: PayloadAction<any>) => {
      state.higherClassStudentForPromo = action.payload;
    },
    setPromoteHigherClassStudentAct: (state, action: PayloadAction<any>) => {
      state.promoteHigherClassStudents = action.payload;
    },
    setCurriculumList: (state, action: PayloadAction<any>) => {
      state.curriculumList = action.payload;
    },
    setClassList: (state, action: PayloadAction<any>) => {
      state.classList = action.payload;
    },
    setStreamClassList: (state, action: PayloadAction<any>) => {
      state.streamClassList = action.payload;
    },
    setSectionSubjectList: (state, action: PayloadAction<any>) => {
      state.sectionSubjectList = action.payload;
    },
    setPromotedClassList: (state, action: PayloadAction<any>) => {
      state.promotedClassList = action.payload;
    },
    setDetentionPromotionStudentList: (state, action: PayloadAction<any>) => {
      state.detentionPromotionStudends = action.payload;
    },
    setLedgersOfDetainedOrPromotedAct: (state, action: PayloadAction<any>) => {
      state.ledgersOfDetainedOrPromotedResp = action.payload;
    },
    resetLedgersOfDetainedOrPromotedAct: (state, action: PayloadAction<any>) => {
      state.ledgersOfDetainedOrPromotedResp = action.payload;
    },
    resetNotDetentionedPromotionedStudentList: (state, action: PayloadAction<any>) => {
      state.notDetentionedPromotionedStudends = action.payload;
    },
    setNotDetentionedPromotionedStudentList: (state, action: PayloadAction<any>) => {
      state.notDetentionedPromotionedStudends = action.payload;
    },
    setDetainedOrPromotedClassList: (state, action: PayloadAction<any>) => {
      state.detainedOrPromotedClasses = action.payload;
    },
    resetDetainedOrPromotedClassList: (state, action: PayloadAction<any>) => {
      state.detainedOrPromotedClasses = action.payload;
    },
    setPromoteDetaineStudents: (state, action: PayloadAction<any>) => {
      state.setPromoteOrDetaineStudent = action.payload;
    },
    setApprovalPromotionDetentionReqRes: (state, action: PayloadAction<any>) => {
      state.approvalPromotionDetentionReq = action.payload;
    },
    setApproveRejectCurriculumRequestAct: (state, action: PayloadAction<any>) => {
      state.approveRejectCurriculumReqResp = action.payload;
    },
    setTcRequestAct: (state, action: PayloadAction<any>) => {
      state.tcRequestList = action.payload;
    },
    setExportTcRequestListAct: (state, action: PayloadAction<any>) => {
      state.exportTcRequestListResp = action.payload;
    },
    getTcRequestByIdAct: (state, action: PayloadAction<any>) => {
      state.tcRequestById = action.payload;
    },
    resetTcRequestByIdAct: (state, action: PayloadAction<any>) => {
      state.tcRequestById = action.payload;
    },
    getStudentListForTcReqAct: (state, action: PayloadAction<any>) => {
      state.studentListTcReq = action.payload;
    },
    setStudentDetailsTcAct: (state, action: PayloadAction<any>) => {
      state.studentDetailsTcResp = action.payload;
    },
    setStudentLedgerTcAct: (state, action: PayloadAction<any>) => {
      state.studentLedgerTcResp = action.payload;
    },


    getStudentListForBonafideCertificateAct: (state, action: PayloadAction<any>) => {
      state.studentListBonafideCertificate = action.payload;
    },
    setTcReqResAct: (state, action: PayloadAction<any>) => {
      state.addTcReqRes = action.payload;
    },
    setEditTcReqResAct: (state, action: PayloadAction<any>) => {
      state.editTcReqRes = action.payload;
    },
    setBonafideCertificateResAct: (state, action: PayloadAction<any>) => {
      state.addBonafideCertificateRes = action.payload;
    },
    setTcReqLogResAct: (state, action: PayloadAction<any>) => {
      state.tcReqLogRes = action.payload;
    },
    setInitialTcIssuanceAct: (state, action: PayloadAction<any>) => {
      state.initalTcIssuanceRes = action.payload;
    },
    setTcIssuanceByIdAct: (state, action: PayloadAction<any>) => {
      state.tcIssuanceByIdResp = action.payload;
    },
    setUpdateTcIssuanceAct: (state, action: PayloadAction<any>) => {
      state.updateTcIssuanceResp = action.payload;
    },

    setCertificateIssuanceAct: (state, action: PayloadAction<any>) => {
      state.certificateIssuance = action.payload;
    },
    cancelTcRequestAct: (state, action: PayloadAction<any>) => {
      state.cancelTcRequest = action.payload;
    },
    tcApprovalStatusListAct: (state, action: PayloadAction<any>) => {
      state.tcApprovalStatusList = action.payload;
    },
    setTcApproveRejectAct: (state, action: PayloadAction<any>) => {
      state.tcApproveRejectResp = action.payload;
    },
    setTcConsolidatedAct: (state, action: PayloadAction<any>) => {
      state.tcConsolidatedResp = action.payload;
    },
    issueTcRequestAct: (state, action: PayloadAction<any>) => {
      state.issueTcRequest = action.payload;
    },
    getBonafideCertificateAct: (state, action: PayloadAction<any>) => {
      state.bonafideCerificates = action.payload;
    },
    getPreviewTcRequestAct: (state, action: PayloadAction<any>) => {
      state.previewTcRequest = action.payload;
    },
    getBonafideCumStudyCertificateAct: (state, action: PayloadAction<any>) => {
      state.bonafideCumStudyCerificate = action.payload;
    },
    getBonafideCertificateByIdAct: (state, action: PayloadAction<any>) => {
      state.bonafideCerificateById = action.payload;
    },
    updateBonafideCertificateByIdAct: (state, action: PayloadAction<any>) => {
      state.updateBonafideCerificateRes = action.payload;
    },
    issueBonafideCertificateAct: (state, action: PayloadAction<any>) => {
      state.issueBonafideCerificateRes = action.payload;
    },
    getSendMailNotificationAct: (state, action: PayloadAction<any>) => {
      state.sendMailNotification = action.payload;
    },
    SMSNotificationAct: (state, action: PayloadAction<any>) => {
      state.smsNotification = action.payload;
    },
    emailNotificationAct: (state, action: PayloadAction<any>) => {
      state.emailNotification = action.payload;
    },
    setSaveHealthFormAct: (state, action: PayloadAction<any>) => {
      state.saveHealthFormResp = action.payload;
    },
    setHealthFormListAct: (state, action: PayloadAction<any>) => {
      state.getHealthFormListResp = action.payload;
    },
    setUpdateHealthFormStatusAct: (state, action: PayloadAction<any>) => {
      state.updateHealthFormStatusResp = action.payload;
    },
    setStuHealthFormListAct: (state, action: PayloadAction<any>) => {
      state.getStuHealthFormListResp = action.payload;
    },
    setDownloadStaticHealthAct: (state, action: PayloadAction<any>) => {
      state.downloadStaticHealthResp = action.payload;
    },
    setExportHigherClassEligiAct: (state, action: PayloadAction<any>) => {
      state.exportHigherClassEligiResp = action.payload;
    },
    setExportDetentionPromotionAct: (state, action: PayloadAction<any>) => {
      state.exportDetentionPromotionResp = action.payload;
    },
    setExportPromoteStudentsAct: (state, action: PayloadAction<any>) => {
      state.exportPromoteStudentsResp = action.payload;
    },
    setUpdateStuRollNoAct: (state, action: PayloadAction<any>) => {
      state.updateStuRollNoResp = action.payload;
    },
    setExportBonafiedListAct: (state, action: PayloadAction<any>) => {
      state.exportBonafiedListResp = action.payload;
    },
    setExportTcListAct: (state, action: PayloadAction<any>) => {
      state.exportTcListResp = action.payload;
    },
    setBonafideCertiSendEmailAct: (state, action: PayloadAction<any>) => {
      state.bonafideCertiSendEmailResp = action.payload;
    },
    updateParentCollectedStatusAct: (state, action: PayloadAction<any>) => {
      state.parentCollectedStatus = action.payload;
    },
    setSectionListFilterAct: (state, action: PayloadAction<any>) => {
      state.sectionListFilterResp = action.payload;
    },
    setDeleteSectionListAct: (state, action: PayloadAction<any>) => {
      state.deleteSectionListResp = action.payload;
    },
    setStudentAcademicYearDataAct: (state, action: PayloadAction<any>) => {
      state.fetchStudentAcademicYearDataResp = action.payload;
    },
    setCustomTcCertificateAct: (state, action: PayloadAction<any>) => {
      state.getCustomTcCertificateResp = action.payload;
    },
    setDepartMentApprovalAct: (state, action: PayloadAction<any>) => {
      state.getDepartMentApprovalResp = action.payload;
    },
  },
});

export const {
  setBranchCurriculumListAct,
  setAcademicClassListAct,
  setAcademicClassErrorAct,
  setBranchCurriculumErrorAct,
  setSectionListAct,
  setHigherClassStudentListAct,
  setRemovePromotionAct,
  setDeletePromotionAct,
  setNonEligibleHigherClassStudentListAct,
  resetNonEligibleHigherClassStudentList,
  assignHigherClassStudentListAct,
  setSectionErrorAct,
  setClassroomListAct,
  setClassroomErrorAct,
  setSectionDetailsByIdAct,
  setSectionDetailsByIdErrorAct,
  setTeacherListAct,
  setTeacherListErrorAct,
  setStudentListAct,
  setStudentListErrorAct,
  setStudentListBySectionAct,
  setStudentListBySectionErrorAct,
  setUnassignedStudentListAct,
  setUnassignedStudentListErrorAct,
  setUpdateClassroomAct,
  setUpdateClassroomErrorAct,
  setUpdateClassroomTeacherAct,
  setUpdateClassroomTeacherErrorAct,
  setUpdateSectionStudentsAct,
  setUpdateSectionStudentsErrorAct,
  setRemoveSectionStudentsAct,
  setRemoveSectionStudentsErrorAct,
  resetClassroomManagement,
  getGenerateRollNoAct,
  getGenerateIdStatusAct,
  resetGenerateIdStatus,
  getRollNoListAct,
  resetRollNoList,
  assignRollNoAct,
  getStreamChangeRequestListAct,
  setClassListForStreamChangeAct,
  resetClassListForStreamChangeAct,
  resetDetainedOrPromotedClassList,
  getStreamChangeStudentListAct,
  resetStreamChangeStudentList,
  setStreamRequestAct,
  setApproveRejectStreamRequestAct,
  getChangeCurriculumRequestAct,
  getCurriculumStudentListAct,
  resetCurriculumStudentList,
  setChangeCurriculumReqRes,
  setApproveRejectCurriculumRequestAct,
  getPromotedStudentListAct,
  resetPromotedStudentList,
  getHigherClassStudentForPromotionAct,
  setPromoteHigherClassStudentAct,
  setCurriculumList,
  setClassList,
  setStreamClassList,
  setSectionSubjectList,
  setPromotedClassList,
  setDetentionPromotionStudentList,
  setLedgersOfDetainedOrPromotedAct,
  resetLedgersOfDetainedOrPromotedAct,
  setNotDetentionedPromotionedStudentList,
  resetNotDetentionedPromotionedStudentList,
  setDetainedOrPromotedClassList,
  setPromoteDetaineStudents,
  setApprovalPromotionDetentionReqRes,
  setTcRequestAct,
  setExportTcRequestListAct,
  getTcRequestByIdAct,
  resetTcRequestByIdAct,
  getStudentListForTcReqAct,
  setStudentDetailsTcAct,
  setStudentLedgerTcAct,
  getStudentListForBonafideCertificateAct,
  setTcReqResAct,
  setEditTcReqResAct,
  setBonafideCertificateResAct,
  setTcReqLogResAct,
  setInitialTcIssuanceAct, setTcIssuanceByIdAct, setUpdateTcIssuanceAct,
  setCertificateIssuanceAct,
  cancelTcRequestAct,
  tcApprovalStatusListAct,
  setTcApproveRejectAct,
  setTcConsolidatedAct,
  issueTcRequestAct,
  getBonafideCertificateAct,
  getPreviewTcRequestAct,
  getBonafideCumStudyCertificateAct,
  getSendMailNotificationAct,
  updateParentCollectedStatusAct,
  getBonafideCertificateByIdAct,
  updateBonafideCertificateByIdAct,
  issueBonafideCertificateAct,
  SMSNotificationAct,
  setHealthFormListAct,
  previewBonafideCertiListAct,
  setSaveHealthFormAct,
  setUpdateHealthFormStatusAct,
  setStuHealthFormListAct,
  emailNotificationAct,
  setDownloadStaticHealthAct,
  setExportHigherClassEligiAct,
  setExportDetentionPromotionAct,
  setExportPromoteStudentsAct,
  setExportBonafiedListAct,
  setExportTcListAct,
  setBonafideCertiSendEmailAct,
  setUpdateStuRollNoAct,
  setClassroomManagmentErrorAct,
  resetSectionListAct,
  setSectionListFilterAct,
  setDeleteSectionListAct,
  setStudentAcademicYearDataAct,
  setCustomTcCertificateAct,
  setDepartMentApprovalAct,
} = classroomManagmentSlice.actions;

export default classroomManagmentSlice.reducer;

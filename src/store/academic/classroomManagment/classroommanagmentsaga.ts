import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  setBranchCurriculumListAct,
  setBranchCurriculumErrorAct,
  setAcademicClassListAct,
  setAcademicClassErrorAct,
  setSectionListAct,
  setSectionErrorAct,
  setSectionDetailsByIdAct,
  setSectionDetailsByIdErrorAct,
  setClassroomListAct,
  setClassroomErrorAct,
  setTeacherListErrorAct,
  setTeacherListAct,
  setUpdateClassroomAct,
  setUpdateClassroomErrorAct,
  setStudentListAct,
  setStudentListErrorAct,
  setUpdateClassroomTeacherAct,
  setUpdateClassroomTeacherErrorAct,
  setUpdateSectionStudentsAct,
  setUpdateSectionStudentsErrorAct,
  setStudentListBySectionAct,
  setStudentListBySectionErrorAct,
  setUnassignedStudentListAct,
  setUnassignedStudentListErrorAct,
  setRemoveSectionStudentsAct,
  setRemoveSectionStudentsErrorAct,
  setClassroomManagmentErrorAct,
  setHigherClassStudentListAct,
  setRemovePromotionAct,
  getGenerateRollNoAct,
  getGenerateIdStatusAct,
  getRollNoListAct,
  assignRollNoAct,
  setNonEligibleHigherClassStudentListAct,
  assignHigherClassStudentListAct,
  getStreamChangeRequestListAct,
  getStreamChangeStudentListAct,
  setStreamRequestAct,
  setApproveRejectStreamRequestAct,
  getChangeCurriculumRequestAct,
  getCurriculumStudentListAct,
  setChangeCurriculumReqRes,
  setApproveRejectCurriculumRequestAct,
  getPromotedStudentListAct,
  getHigherClassStudentForPromotionAct,
  setPromoteHigherClassStudentAct,
  setCurriculumList,
  setClassList,
  setSectionSubjectList,
  setPromotedClassList,
  setDetentionPromotionStudentList,
  setLedgersOfDetainedOrPromotedAct,
  setNotDetentionedPromotionedStudentList,
  setDetainedOrPromotedClassList,
  setPromoteDetaineStudents,
  setApprovalPromotionDetentionReqRes,
  setTcRequestAct,
  getStudentListForTcReqAct,
  setStudentDetailsTcAct,
  setStudentLedgerTcAct,
  setTcReqResAct,
  setClassListForStreamChangeAct,
  setTcReqLogResAct,
  setInitialTcIssuanceAct,
  setTcIssuanceByIdAct, setUpdateTcIssuanceAct,
  setCertificateIssuanceAct,
  cancelTcRequestAct,
  tcApprovalStatusListAct,
  setTcApproveRejectAct,
  setTcConsolidatedAct,
  issueTcRequestAct,
  setDeletePromotionAct,
  getBonafideCertificateAct,
  getSendMailNotificationAct,
  updateParentCollectedStatusAct,
  getStudentListForBonafideCertificateAct,
  setBonafideCertificateResAct,
  getBonafideCertificateByIdAct,
  updateBonafideCertificateByIdAct,
  getTcRequestByIdAct,
  setEditTcReqResAct,
  issueBonafideCertificateAct,
  SMSNotificationAct,
  emailNotificationAct,
  setStreamClassList,
  getPreviewTcRequestAct,
  previewBonafideCertiListAct,
  setSaveHealthFormAct,
  setHealthFormListAct,
  setUpdateHealthFormStatusAct,
  setStuHealthFormListAct,
  setDownloadStaticHealthAct,
  setExportHigherClassEligiAct,
  setExportDetentionPromotionAct,
  setExportPromoteStudentsAct,
  setUpdateStuRollNoAct,
  setExportBonafiedListAct,
  setExportTcListAct,
  setBonafideCertiSendEmailAct,
  setSectionListFilterAct,
  setDeleteSectionListAct,
  setStudentAcademicYearDataAct,
  setCustomTcCertificateAct,
  setDepartMentApprovalAct,
  setExportTcRequestListAct,
} from "./classroommanagmentslice";
import { ClassroomManagmentConstants } from "./classroommanagmentconstants";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../../api/apiactions";
import { ICreatedActionType } from "../../types";
import { IAcademicInfoList } from "./classroommanagmenttypes";

function* getBrancheCurriculumListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    // let arr: IAcademicInfoList[] = [];
    // response.data.map((branch: any) => {
    //   let branchName = branch.instituteCurriculum.name;
    //   let branchId = branch.instituteCurriculum.id;
    //   arr.push({ name: branchName, id: branchId });
    // });
    yield put(setBranchCurriculumListAct(response.data));
  }
}
function* getAcademicClassListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    // let arr: IAcademicInfoList[] = [];
    // response.data.map((cls: any) => {
    //   let className = cls.branchClass.instituteClassEntity.name;
    //   let classId = cls.id;
    //   arr.push({ name: className, id: classId });
    // });

    yield put(setAcademicClassListAct(response.data));
  }
}
function* getSectionDetailsByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    // let arr: any = [];
    // let data = {
    //   sectionName: response && response.data.name,
    //   clsName:
    //     response &&
    //     response.data.academicClass.branchClass.instituteClassEntity.name,
    //   primaryTeacher: response && response.data.primarySectionTeacher,
    // };
    yield put(setSectionDetailsByIdAct(response.data));
  }
}
function* getSectionListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setSectionListAct(response.data));
  }
}
function* getHigherClassStudentListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setHigherClassStudentListAct(response.data));
  }
}
function* removePromotionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setRemovePromotionAct(response.data));
  }
}
function* deletePromotionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setDeletePromotionAct({ statusCode: response.status }));
  }
}

function* getNonEligibleHigherClassStudentListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setNonEligibleHigherClassStudentListAct(response.data));
  }
}
function* setHigherClassStudentListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(assignHigherClassStudentListAct(response.data));
  }
}
function* getTeacherListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    // let arr: any = []
    // response.data.map((cls: any) => {
    //   let className = cls.branchClass.instituteClassEntity.name;
    //   let classId = cls.id;
    //   arr.push({ name: className, id: classId });
    // });
    yield put(setTeacherListAct(response.data.data));
  }
}
function* getStudentListBySectionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setStudentListBySectionAct(response.data));
  }
}
function* getUnassignedStudentListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setUnassignedStudentListAct(response.data));
  }
}
function* getClassroomListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setClassroomListAct(response.data.data));
  }
}

function* updateClassroomTeacherGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setUpdateClassroomTeacherAct(response));
  }
}
function* updateSectionStudentsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setUpdateSectionStudentsAct(response));
  }
}
function* removeSectionStudentGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setRemoveSectionStudentsAct(response));
  }
}
function* updateClassroomGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setUpdateClassroomAct(response));
  }
}
function* getGenerateRollNo(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getGenerateRollNoAct(response.data));
  }
}
function* getGenerateIdStatus(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getGenerateIdStatusAct(response.data));
  }
}
function* assignRollNoList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(assignRollNoAct({ statusCode: response.status }));
  }
}
function* getRollNoList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getRollNoListAct(response.data));
  }
}
function* getStreamChangeRequestList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getStreamChangeRequestListAct(response.data));
  }
}
function* getClassListForStreamChange(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setClassListForStreamChangeAct(response.data));
  }
}
function* getStreamChangeStudentList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getStreamChangeStudentListAct(response.data));
  }
}
function* setStreamChangeRequest(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setStreamRequestAct({ statusCode: response.status }));
  }
}
function* approveRejectStreamChangeRequest(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setApproveRejectStreamRequestAct({ statusCode: response.status }));
  }
}
function* getChangeCurriculumListResp(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getChangeCurriculumRequestAct(response.data));
  }
}
function* getCurriculumStudentListResp(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getCurriculumStudentListAct(response.data));
  }
}
function* raiseChangeCurriculumReq(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setChangeCurriculumReqRes({ statusCode: response.status }));
  }
}
function* approveRejectCurriculumChangeRequest(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setApproveRejectCurriculumRequestAct({ statusCode: response.status }));
  }
}
function* getPromotedStudentList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getPromotedStudentListAct(response.data));
  }
}
function* getHigherClassStudentForPromotion(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getHigherClassStudentForPromotionAct(response.data));
  }
}
function* setPromoteHigherClassStudent(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setPromoteHigherClassStudentAct({ statusCode: response.status }));
  }
}
function* getCurriculumList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setCurriculumList(response.data));
  }
}
function* getClassList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setClassList(response.data));
  }
}
function* getStreamClassList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setStreamClassList(response.data));
  }
}
function* getSectionSubjectList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setSectionSubjectList(response.data));
  }
}
function* getPromotedClassList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setPromotedClassList(response.data));
  }
}
function* getDetentionPromotionStudentsList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setDetentionPromotionStudentList(response.data));
  }
}

function* getLedgersOfDetainedOrPromotedGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setLedgersOfDetainedOrPromotedAct(response.data));
  }
}
function* getNotDetentionedPromotionedStudentsList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setNotDetentionedPromotionedStudentList(response.data));
  }
}
function* getPromotedOrDetainedClassList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setDetainedOrPromotedClassList(response.data));
  }
}
function* setPromoteDetaineStudent(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setPromoteDetaineStudents({ statusCode: response.status }));
  }
}
function* setApprovalPromotionDetentionReq(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setApprovalPromotionDetentionReqRes({ statusCode: response.status }));
  }
}
function* getTcRequestListReq(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setTcRequestAct(response.data));
  }
}
function* exportTcRequestListGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setClassroomManagmentErrorAct(response.error));
    } else {
        yield put(setExportTcRequestListAct(response.data));
    }
}
function* getTcRequestByIdRes(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getTcRequestByIdAct(response.data));
  }
}
function* getStudentListForTcReq(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getStudentListForTcReqAct(response.data));
  }
}

function* getStudentDetailsTcGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setStudentDetailsTcAct(response.data));
  }
}


function* getStudentLedgerTcGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setStudentLedgerTcAct(response.data));
  }
}

function* getStudentListForBonafideCertificate(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getStudentListForBonafideCertificateAct(response.data));
  }
}
function* addTcReq(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setTcReqResAct({ statusCode: response.status }));
  }
}
function* editTcReq(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setEditTcReqResAct({ statusCode: response.status }));
  }
}
function* addBonafideCertificate(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setBonafideCertificateResAct({ statusCode: response.status }));
  }
}
function* getTcReqLog(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setTcReqLogResAct(response.data));
  }
}
function* getInitialTcIssuance(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setInitialTcIssuanceAct(response.data));
  }
}

function* getTcIssuanceByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setTcIssuanceByIdAct(response.data));
  }
}

function* updateTcIssuanceGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setUpdateTcIssuanceAct(response.data));
  }
}


function* setCertificateIssuance(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setCertificateIssuanceAct({ statusCode: response.status }));
  }
}
function* cancelTcReq(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(cancelTcRequestAct({ statusCode: response.status }));
  }
}
function* tcApprovalStatusList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(tcApprovalStatusListAct(response.data));
  }
}

function* tcApproveRejectGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setTcApproveRejectAct(response.data));
  }
}
function* tcConsolidateGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setTcConsolidatedAct(response.data));
  }
}

function* issueTcRequest(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(issueTcRequestAct(response.data));
  }
}
function* smsNotificationRequest(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(SMSNotificationAct({ statusCode: response.status }));
  }
}
function* emailNotificationRequest(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(emailNotificationAct({ statusCode: response.status }));
  }
}
function* getBonafideCerticateList(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getBonafideCertificateAct(response.data));
  }
}
function* getBonafideCumStudyCerticate(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getBonafideCertificateAct(response.data));
  }
}
function* getTcRequestPreviewCerticate(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getPreviewTcRequestAct(response.data));
  }
}
function* getPreviewBonafideCertificate(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(previewBonafideCertiListAct(response.data));
  }
}
function* getBonafideCerticateById(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getBonafideCertificateByIdAct(response.data));
  }
}
function* updateBonafideCerticateById(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(updateBonafideCertificateByIdAct({ statusCode: response.status }));
  }
}
function* issueBonafideCerticate(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(issueBonafideCertificateAct({ statusCode: response.status }));
  }
}
function* getSendMailNotification(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(getSendMailNotificationAct({ statusCode: response.status }));
  }
}
function* saveHealthFormGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setSaveHealthFormAct(response.data));
  }
}
function* getHealthFormListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setHealthFormListAct(response.data));
  }
}
function* updateHealthFormStatusGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setUpdateHealthFormStatusAct(response.data));
  }
}
function* updateParentCollectedStatus(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(updateParentCollectedStatusAct({ statusCode: response.status }));
  }
}
function* downloadStaticHealthGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setDownloadStaticHealthAct(response.data));
  }
}
function* exportHigherClassEligiGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setExportHigherClassEligiAct(response.data));
  }
}
function* exportDetentionPromotionGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setExportDetentionPromotionAct(response.data));
  }
}
function* exportPromoteStudentsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setExportPromoteStudentsAct(response.data));
  }
}
function* getStuHealthFormListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setStuHealthFormListAct(response.data));
  }
}
function* updateStuRollNoGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setUpdateStuRollNoAct({ statusCode: response.status }));
  }
}

function* exportBonafiedListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setExportBonafiedListAct(response.data));
  }
}
function* exportTcListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setExportTcListAct(response.data));
  }
}
function* sectionListFilterGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setSectionListFilterAct(response.data));
  }
}
function* fetchStudentAcademicYearDataGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setStudentAcademicYearDataAct(response.data));
  }
}
function* getCustomTcCertificateGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setCustomTcCertificateAct(response.data));
  }
}
function* deleteSectionListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    deleteData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setDeleteSectionListAct({statusCode : response.status}));
  }
}
function* bonafideCertiSendEmailGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setBonafideCertiSendEmailAct({statusCode : response.status}));
  }
}
function* getDepartMentApprovalGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig
  );
  if (response && response.error) {
    yield put(setClassroomManagmentErrorAct(response.error));
  } else {
    yield put(setDepartMentApprovalAct({statusCode : response.status}));
  }
}
export default function* academicSaga() {
  yield takeLatest(
    ClassroomManagmentConstants.GET_BRANCH_CURRICULUM_LIST,
    getBrancheCurriculumListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_ACADEMIC_CLASS_LIST,
    getAcademicClassListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_SECTION_LIST,
    getSectionListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_HIGHER_CLASS_STUDENT_LIST,
    getHigherClassStudentListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.REMOVE_PROMOTION_REQUEST,
    removePromotionGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.DELETE_PROMOTION_REQUEST,
    deletePromotionGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_NON_ELIGIBLE_HIGHER_CLASS_STUDENT_LIST,
    getNonEligibleHigherClassStudentListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.SET_HIGHER_CLASS_STUDENT_LIST,
    setHigherClassStudentListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_SECTION_DETAILS_BY_ID,
    getSectionDetailsByIdGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_CLASSROOM_LIST,
    getClassroomListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_TEACHER_LIST,
    getTeacherListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_STUDENT_LIST_BY_SECTION,
    getStudentListBySectionGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_UNASSIGNED_STUDENT_LIST,
    getUnassignedStudentListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.UPDATE_CLASSROOM,
    updateClassroomGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.UPDATE_CLASSROOM_TEACHER,
    updateClassroomTeacherGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.UPDATE_SECTION_STUDENTS,
    updateSectionStudentsGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.REMOVE_STUDENT_TO_SECTION,
    removeSectionStudentGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_GENERATE_ROLL_NO,
    getGenerateRollNo
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_GENERATE_ID_STATUS,
    getGenerateIdStatus
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_ROLL_NO_LIST,
    getRollNoList
  );
  yield takeLatest(
    ClassroomManagmentConstants.ASSIGN_ROLL_NO,
    assignRollNoList
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_STREAM_CHANGE_REQUEST_LIST,
    getStreamChangeRequestList
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_CLASS_LIST_CHANGE_STREAM,
    getClassListForStreamChange
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_STREAM_CHANGE_STUDENT_LIST,
    getStreamChangeStudentList
  );
  // yield takeLatest(
  //   ClassroomManagmentConstants.GET_CLASS_LIST_CHANGE_STREAM,
  //   getStreamChangeStudentList
  // );
  yield takeLatest(
    ClassroomManagmentConstants.SET_STREAM_CHANGE_REQUEST,
    setStreamChangeRequest
  );
  yield takeLatest(
    ClassroomManagmentConstants.APPROVE_REJECT_STREAM_CHANGE_REQUEST,
    approveRejectStreamChangeRequest
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_CHANGE_CURRICULUM_LIST,
    getChangeCurriculumListResp
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_CURRICULUM_STUDENT_LIST,
    getCurriculumStudentListResp
  );
  yield takeLatest(
    ClassroomManagmentConstants.SET_CHANGE_CURRICULUM_REQ,
    raiseChangeCurriculumReq
  );
  yield takeLatest(
    ClassroomManagmentConstants.APPROVE_REJECT_CURRICULUM_CHANGE_REQUEST,
    approveRejectCurriculumChangeRequest
  );
  yield takeLatest(
    ClassroomManagmentConstants.PROMOTED_STUDENT_LIST,
    getPromotedStudentList
  );
  yield takeLatest(
    ClassroomManagmentConstants.HIGHER_CLASS_STUDENT_FOR_PROMOTION,
    getHigherClassStudentForPromotion
  );
  yield takeLatest(
    ClassroomManagmentConstants.PROMOTE_HIGHER_CLASS_STUDENT,
    setPromoteHigherClassStudent
  );
  yield takeLatest(
    ClassroomManagmentConstants.CURRICULUM_LIST,
    getCurriculumList
  );
  yield takeLatest(
    ClassroomManagmentConstants.CLASS_LIST,
    getClassList
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_STREAM_CLASS_LIST,
    getStreamClassList
  );
  yield takeLatest(
    ClassroomManagmentConstants.SECTION_SUBJECT_LIST,
    getSectionSubjectList
  );
  yield takeLatest(
    ClassroomManagmentConstants.PROMOTED_CLASS_LIST,
    getPromotedClassList
  );
  yield takeLatest(
    ClassroomManagmentConstants.DETENTION_PROMOTION_STUDENT_LIST,
    getDetentionPromotionStudentsList
  );
  yield takeLatest(
    ClassroomManagmentConstants.LEDGER_OF_PROMOTED_DETAINED_STUDENT_REQUEST,
    getLedgersOfDetainedOrPromotedGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.NOT_DETENTIONED_PROMOTIONED_STUDENT_LIST,
    getNotDetentionedPromotionedStudentsList
  );
  yield takeLatest(
    ClassroomManagmentConstants.PROMOTED_OR_DETAINED_CLASS_LIST,
    getPromotedOrDetainedClassList
  );
  yield takeLatest(
    ClassroomManagmentConstants.PROMOTE_DETAINE_STUDENT,
    setPromoteDetaineStudent
  );
  yield takeLatest(
    ClassroomManagmentConstants.APPROVE_REJECT_PROMOTION_DETENTION_REQ,
    setApprovalPromotionDetentionReq
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_TC_REQUEST_LIST,
    getTcRequestListReq
  );
  yield takeLatest(ClassroomManagmentConstants.EXPORT_TC_REQUEST_LIST, exportTcRequestListGen);
      
  yield takeLatest(
    ClassroomManagmentConstants.GET_TC_REQUEST_BY_ID,
    getTcRequestByIdRes
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_STUDENT_LIST_FOR_TC_REQ,
    getStudentListForTcReq
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_STUDENT_DETAILS_TC_REQUEST,
    getStudentDetailsTcGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_STUDENT_LEDGER_TC_REQUEST,
    getStudentLedgerTcGen
  );

  yield takeLatest(
    ClassroomManagmentConstants.GET_STUDENT_LIST_FOR_BONAFIDE_CERTIFICATE,
    getStudentListForBonafideCertificate
  );
  yield takeLatest(
    ClassroomManagmentConstants.ADD_TC_REQUEST,
    addTcReq
  );
  yield takeLatest(
    ClassroomManagmentConstants.EDIT_TC_REQUEST,
    editTcReq
  );
  yield takeLatest(
    ClassroomManagmentConstants.ADD_BONAFIDE_CERTIFICATE,
    addBonafideCertificate
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_TC_REQUEST_LOG,
    getTcReqLog
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_INITIAL_TC_ISSUANCE,
    getInitialTcIssuance
  );

  yield takeLatest(
    ClassroomManagmentConstants.TCISSUANCE_BYID_REQUEST,
    getTcIssuanceByIdGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.UPDATE_TCISSUANCE_REQUEST,
    updateTcIssuanceGen
  );

  yield takeLatest(
    ClassroomManagmentConstants.SET_CERTIFICATE_ISSUANCE,
    setCertificateIssuance
  );
  yield takeLatest(
    ClassroomManagmentConstants.CANCEL_TC_REQUEST,
    cancelTcReq
  );
  yield takeLatest(
    ClassroomManagmentConstants.TC_APPROVAL_STATUS_LIST,
    tcApprovalStatusList
  );
  yield takeLatest(
    ClassroomManagmentConstants.TC_APPROVE_REJECT_REQUEST,
    tcApproveRejectGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.TC_CONSOLIDATED_VIEW,
    tcConsolidateGen
  );


  yield takeLatest(
    ClassroomManagmentConstants.ISSUE_TC_REQUEST,
    issueTcRequest
  );
  yield takeLatest(
    ClassroomManagmentConstants.BONAFIDE_CERTIFICATE_LIST,
    getBonafideCerticateList
  );
  yield takeLatest(
    ClassroomManagmentConstants.BONAFIDE_CUM_STUDY_CERTIFICATE,
    getBonafideCumStudyCerticate
  );
  yield takeLatest(
    ClassroomManagmentConstants.PREVIEW_TC_REQUEST,
    getTcRequestPreviewCerticate
  );
  yield takeLatest(
    ClassroomManagmentConstants.SEND_EMAIL_NOTIFICATION,
    getSendMailNotification
  );
  yield takeLatest(
    ClassroomManagmentConstants.PARENT_COLLECTED_STATUS,
    updateParentCollectedStatus
  );
  yield takeLatest(
    ClassroomManagmentConstants.BONAFIDE_CERTIFICATE_BY_ID,
    getBonafideCerticateById
  );
  yield takeLatest(
    ClassroomManagmentConstants.UPDATE_BONAFIDE_CERTIFICATE_DETAILS,
    updateBonafideCerticateById
  );
  yield takeLatest(
    ClassroomManagmentConstants.ISSUE_BONAFIDE_CERTIFICATE,
    issueBonafideCerticate
  );
  yield takeLatest(
    ClassroomManagmentConstants.SMS_NOTIFICATION,
    smsNotificationRequest
  );
  yield takeLatest(
    ClassroomManagmentConstants.EMAIL_NOTIFICATION,
    emailNotificationRequest
  );
  yield takeLatest(
    ClassroomManagmentConstants.PREVIEW_BONAFIDE_CERTIFICATE,
    getPreviewBonafideCertificate
  );
  yield takeLatest(
    ClassroomManagmentConstants.SAVE_HEALTH_FORM,
    saveHealthFormGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.HEALTH_FORM_LIST,
    getHealthFormListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.UPDATE_HEALTH_FORM_STATUS,
    updateHealthFormStatusGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.FETCH_STU_HEALTH_FORM,
    getStuHealthFormListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.DOWNLOAD_STATIC_FORM,
    downloadStaticHealthGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.EXPORT_HIGHER_CLASS_ELIGIBILITY,
    exportHigherClassEligiGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.EXPORT_DETENTION_PROMOTION,
    exportDetentionPromotionGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.EXPORT_PROMOTE_STUDENTS,
    exportPromoteStudentsGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.EXPORT_BONAFIED_LIST,
    exportBonafiedListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.EXPORT_TC_LIST,
    exportTcListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.BONAFIDE_SEND_EMAIL,
    bonafideCertiSendEmailGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.UPDATE_STU_ROLL_NO,
    updateStuRollNoGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.SET_SECTION_LIST_FILTER,
    sectionListFilterGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.DELETE_SECTION_LIST,
    deleteSectionListGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.FETCH_STUDENT_ACADEMIC_YEAR,
    fetchStudentAcademicYearDataGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_CUSTOM_TC_CERTIFICATE,
    getCustomTcCertificateGen
  );
  yield takeLatest(
    ClassroomManagmentConstants.GET_DEPARTMENT_APPROVAL,
    getDepartMentApprovalGen
  );
}

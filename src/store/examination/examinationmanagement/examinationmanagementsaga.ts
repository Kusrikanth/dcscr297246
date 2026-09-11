
import { all, call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, putData , postData } from "../../../api/apiactions";
import { ExaminationManagementConstants } from "./examinationmanagementconstancts";
import { setAdmitCardDetailsAct, setAoGradeEntryListAct, setAoInsideSubjectsAct, setAoTermSubjectsAct, setAoTermSubjectsByIdAct, setChangeStudentSubjectsDetailsAct, setChangeStudentSubjectsDetailsByIdAct, setCoscholasticGradesListAct, setDeleteAoTermSubjectsAct, setDeleteChangeStudentSubjectsByIdDetailsAct, setDeleteChangeStudentSubjectsDetailsAct, setDeleteStudentRemarksAct, setDownloadAdmitCardAct, setDownloadMarksEntryAct, setEditStudentRemarksAct, setEntryLearnerSkillDetailsAct, setExaminationClassesAct, setExaminationClassSubjectAct, setExaminationInstituteTermsAct, setExaminationManagementErrorAct, setEyGradeEntryAct, setGenerateAdmitCardAct, setProgressCardListAct, setInternalSubjectsMarksEntryAct, setSaveAoGradeEntryListAct, setSaveAoTermSubjectsAct, setSaveChangeStudentSubjectsDetailsAct, setSaveEntryMarksAct, setSaveEyGradeEntryListAct, setSaveInternalSubjectsMarksListAct, setSaveStudentRemarksAct, setStudentDetailsAct, setStudentRemarksAct, setStudentRemarksByIdAct, setStudentRemarksDecriptionAct, setUpdateAoTermSubjectsAct, setUpdateChangeStudentSubjectsDetailsAct, setUploadMarksEntryAct, setGenerateProgressCardAct, setDownloadProgressCard, setPreviewProgressCard, setAoGradeEntryErrorAct, setDownloadAllProgressCardsAct, setSubjectsForInternalMarksEntryAct, setDownloadCbseProgressCardsAct, setStudentGradeReportBookAct, setExportStudentGradeReportBookAct, setFilterListForCbseAct, setExaminationDashboardDataAct, setBranchWiseMarksRangeAct, setMarksRangeListAct, setSubjectAndGradeWiseAct, setSubjectListForDashboardAct, setClassTeacherListAct, setExaminationSubjectsListAct, setSubjectGradeWiseAnalysisAct, setExportSectionWiseAnalysisAct, setAdmitCardExamDetailsAct, setCbseProgressCardStudentAct, setFoundationStudentsProfilesAct, setSaveGeneralInformationAct, setSaveGeneralStudentPhotoAct, setGeneralInformationByIdAct, setUpdateGeneralInformationAct, setUploadStudentSurroundingPhotoAct, setUploadFamilySurroundingPhotoAct, setSaveSurroundingAct, setUpdateSurroundingAct, setDomainDetailsStudentAct, setSaveDaominStudentDetailsAct, setUpdateDomainDetailsStudentAct, setSaveDomainSummaryAct, setLogActivityStatusAct, setSaveParentCollectedStatusAct, setStudentSummaryByIdAct, setHolisticProgressCardAct, setMarksEntryReportListAct, setExportMarksEntryReportAct, exportFondationStageGradeEntryAct, setClassGradeWiseAnalysisAct, setIgcseStudentSkillsAttributesDetailsAct, setSaveIgcseStudentSkillsAttributesDetailsAct, setClassAnalysisReportAct, setCopyFoundationStageGradeEntryStudentDetailsAct } from "./examinationmanagementslice";

// Admit Card

function* getAdmitCardDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setAdmitCardDetailsAct(response.data));
    }
}

function* generateAdmitCardGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setGenerateAdmitCardAct(response.data));
    }
}

function* downloadAdmitCardGen(action: ICreatedActionType): any {
  const { endpoint, payload: apiPayload, optionalConfig } = action.payload;
  const response = yield call(getData, endpoint, apiPayload, optionalConfig);

  if (response && response.error) {
    yield put(setExaminationManagementErrorAct(response.error));
  } else {
    const viewType = optionalConfig?.viewType;
    const updatedViewResp = {
      ...response.data,
      viewType,
    };

    yield put(setDownloadAdmitCardAct(updatedViewResp));
  }
}

function* getAdmitCardExamDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setAdmitCardExamDetailsAct(response.data));
    }
}

 export function* getChangeStudentSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setChangeStudentSubjectsDetailsAct(response.data));
        }
    }

    export function* getChangeStudentSubjectsByIdGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setChangeStudentSubjectsDetailsByIdAct(response.data));
        }
    }

    export function* saveChangeStudentSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSaveChangeStudentSubjectsDetailsAct({status: response.status}));
        }
    }

    export function* updateChangeStudentSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setUpdateChangeStudentSubjectsDetailsAct({statusCode : response.status}));
        }
    }

    export function* deleteChangeStudentSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDeleteChangeStudentSubjectsDetailsAct({status : response.statusCode}));
        }
    }

    export function* deleteChangeStudentSubjectsByIdGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDeleteChangeStudentSubjectsByIdDetailsAct({status : response.statusCode}));
        }
    }

        
    function* getStudentDetailsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setStudentDetailsAct(response.data));
        }
    }
    function* getExaminationClassesGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setExaminationClassesAct(response.data));
        }
    }
    function* getExaminationClassSubjectGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setExaminationClassSubjectAct(response.data));
        }
    }
    
    function* saveEntryMarksGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSaveEntryMarksAct({status: response.status}));
        }
    }

    export function* getCoscholasticGradesListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setCoscholasticGradesListAct(response.data));
        }
    }
    
    //Examination-Marks
    export function* getStudentRemarksGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setStudentRemarksAct(response.data));
        }
    }

    export function* getExaminationInstituteTermsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setExaminationInstituteTermsAct(response.data));
        }
    }

    export function* getStudentDescriptionGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setStudentRemarksDecriptionAct(response.data));
        }
    }

    export function* getStudentRemarksByIdGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setStudentRemarksByIdAct(response.data));
        }
    }

    export function* saveStudentRemarksGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSaveStudentRemarksAct({status: response.status}));
        }
    }

    export function* editStudentRemarksGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setEditStudentRemarksAct({statusCode : response.status}));
        }
    }

    export function* deleteStudentRemarksGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDeleteStudentRemarksAct({status : response.statusCode}));
        }
    }
    function* downloadMarksEntryGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDownloadMarksEntryAct(response.data));
        }
    }
    function* uploadMarksEntryGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setUploadMarksEntryAct({status: response.status}));
        }
    }

    //Ao Selection
    function* getAoTermSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setAoGradeEntryErrorAct(response.error));
        } else {
            yield put(setAoTermSubjectsAct(response.data));
        }
    }
    function* getAoInsideSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setAoInsideSubjectsAct(response.data));
        }
    }
    function* saveAoTermSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSaveAoTermSubjectsAct({status: response.status}));
        }
    }
    function* getAoTermSubjectsByIdGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setAoTermSubjectsByIdAct(response.data));
        }
    }
    function* deleteAoTermSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDeleteAoTermSubjectsAct({status: response.status}));
        }
    }
    function* updateAoTermSubjectsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setUpdateAoTermSubjectsAct({status: response.status}));
        }
    }
    
    // Ao Grade Entry
    
    function* getAoGradeEntryListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setAoGradeEntryListAct(response.data));
        }
    }

    function* saveAoGradeEntryListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSaveAoGradeEntryListAct({statusCode : response.status}));
        }
    }

    function* getEyGradeEntryGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setEyGradeEntryAct(response.data));
        }
    }
    function* getEntryLearnerSkillDetailsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setEntryLearnerSkillDetailsAct(response.data));
        }
    }
    
    function* saveEyGradeEntryListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSaveEyGradeEntryListAct({statusCode : response.status}));
        }
    }
    
    // Progress Card
    function* getProgressCardListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setProgressCardListAct(response.data));
        }
    }

    function* generateProgressCardGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setGenerateProgressCardAct({status: response.status}));
        }
    }

    function* downloadProgressCardGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDownloadProgressCard(response.data));
        }
    }

    function* previewProgressCardGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setPreviewProgressCard(response.data));
        }
    }

    function* downloadAllProgressCardsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDownloadAllProgressCardsAct(response.data));
        }
    }

    function* downloadCbseProgressCardsGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setDownloadCbseProgressCardsAct(response.data));
        }
    }

    function* getCbseProgressCardStudentGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setCbseProgressCardStudentAct(response.data))
        }
    }

    function* getInternalSubjectsMarksListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setInternalSubjectsMarksEntryAct(response.data));
        }
    }

    function* saveInternalSubjectsMarksListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSaveInternalSubjectsMarksListAct({status: response.status}));
        }
    }

    function* getSubjectsForInternalMarksEntryGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSubjectsForInternalMarksEntryAct(response.data));
        }
    }

    //student_grade_book
    
    function* getStudentGradeReportBookListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setStudentGradeReportBookAct(response.data));
        }
    }

function* exportStudentGradeReportBookGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setExportStudentGradeReportBookAct(response.data));
    }
}

    function* getFilterListForCbseGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setFilterListForCbseAct(response.data));
        }
    }

    function* getExaminationDashboardDataGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setExaminationDashboardDataAct(response.data));
        }
    }
    function* getBranchWiseMarksRangeGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setBranchWiseMarksRangeAct(response.data));
        }
    }
    function* getMarksRangeListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setMarksRangeListAct(response.data));
        }
    }
    function* getSubjectAndGradeWiseGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSubjectAndGradeWiseAct(response.data));
        }
    }
    function* getSubjectListForDashboardGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setSubjectListForDashboardAct(response.data));
        }
    }
    function* getClassTeacherListGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setClassTeacherListAct(response.data));
        }
    }

    function* getExaminationSubjects(action: ICreatedActionType): any {
      const { payload } = action;
      const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
      if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
      } else {
        yield put(setExaminationSubjectsListAct(response.data || []));
      }
    }
    function* getSubjectGradeWiseAnalysisGen(action: ICreatedActionType): any {
      const { payload } = action;
      const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
      if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
      } else {
        yield put(setSubjectGradeWiseAnalysisAct(response.data || []));
      }
    }
    function* exportSectionWiseAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setExportSectionWiseAnalysisAct(response.data));
    }
    }
    function* getClassGradeWiseAnalysisGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setClassGradeWiseAnalysisAct(response.data));
    }
    }

    // student domains
    function* getFoundationStudentsProfilesGen(action: ICreatedActionType): any {
        const { payload } = action;
        const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
        if (response && response.error) {
            yield put(setExaminationManagementErrorAct(response.error));
        } else {
            yield put(setFoundationStudentsProfilesAct(response.data));
        }
    }


    function* saveGeneralInformationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setSaveGeneralInformationAct({status: response.status, data: response.data}));
    }
}
    function* saveGeneralStudentPhotoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setSaveGeneralStudentPhotoAct({status: response.status, data: response.data}));
    }
}
    function* getGeneralInformationByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setGeneralInformationByIdAct(response.data));
    }
}
    function* updateGeneralInformationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setUpdateGeneralInformationAct({status: response.status}));
    }
}
    function* uploadStudentSurroundingPhotoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setUploadStudentSurroundingPhotoAct({status: response.status, data: response.data}));
    }
}
    function* uploadFamilySurroundingPhotoGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setUploadFamilySurroundingPhotoAct({status: response.status, data: response.data}));
    }
}
    function* saveSurroundingGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setSaveSurroundingAct({status: response.status, data: response.data}));
    }
}
    function* updateSurroundingGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setUpdateSurroundingAct({status: response.status, data: response.data}));
    }
}
    function* getDomainDetailsStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setDomainDetailsStudentAct(response.data));
    }
}
    function* saveDomainStudentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setSaveDaominStudentDetailsAct({status: response.status, data: response.data}));
    }
}
    function* updateDomainDetailsStudentGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setUpdateDomainDetailsStudentAct({status: response.status, data: response.data}));
    }
}
    function* saveDomainSummaryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setSaveDomainSummaryAct({status: response.status, data: response.data}));
    }
}
    function* getLogActivityStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setLogActivityStatusAct(response.data));
    }
}
    function* saveParentCollectedStatusGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setSaveParentCollectedStatusAct({status: response.status}));
    }
}
function* getStudentSummaryByIdGen(action: ICreatedActionType): any {
const { payload } = action;
const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
if (response && response.error) {
    yield put(setExaminationManagementErrorAct(response.error));
} else {
    yield put(setStudentSummaryByIdAct(response.data));
}}

function* copyFoundationStageGradeEntryStudentDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setCopyFoundationStageGradeEntryStudentDetailsAct({ status: response.status }));
    }
}

function* getHolisticProgressCardGen(action: ICreatedActionType): any {
const { payload } = action;
const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
if (response && response.error) {
    yield put(setExaminationManagementErrorAct(response.error));
} else {
    yield put(setHolisticProgressCardAct(response.data));
}}

// marks entry report
function* getMarksEntryReportListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setMarksEntryReportListAct(response.data));
    }
}
function* exportMarksEntryReportGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(setExportMarksEntryReportAct(response.data));
    }
}
function* setExportFondationStageGradeEntryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    } else {
        yield put(exportFondationStageGradeEntryAct(response.data));
    }
}
// IGCSE Student Skills and Attributes
export function* getIgcseStudentSkillsAttributesDetailsGen(action: ICreatedActionType): any {
    const {payload} = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    }
    else {
        yield put(setIgcseStudentSkillsAttributesDetailsAct(response.data));
    }
}

export function* saveIgcseStudentSkillsAttributesDetailsGen(action: ICreatedActionType): any {
    const {payload} = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    }
    else {
        yield put(setSaveIgcseStudentSkillsAttributesDetailsAct({status: response.status, data: response.data}));
    }
}

export function* getClassAnalysisReportGen(action: ICreatedActionType): any {
    const {payload} = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if(response && response.error) {
        yield put(setExaminationManagementErrorAct(response.error));
    }
    else {
        yield put(setClassAnalysisReportAct(response.data));
    }
}

export default function* examinationmanagementsaga() {
    // Admit Card

    yield takeLatest(ExaminationManagementConstants.GET_ADMIT_CARD_DETAILS, getAdmitCardDetailsGen);
    yield takeLatest(ExaminationManagementConstants.GENERATE_ADMIT_CARD, generateAdmitCardGen);
    yield takeLatest(ExaminationManagementConstants.DOWNLOAD_ADMIT_CARD, downloadAdmitCardGen);
    yield takeLatest(ExaminationManagementConstants.GET_ADMIT_CARD_EXAM_DETAILS, getAdmitCardExamDetailsGen);

    // change student subject
    yield takeLatest(ExaminationManagementConstants.GET_CHANGE_STUDENT_SUBJECTS_DETAILS, getChangeStudentSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.GET_CHANGE_STUDENT_SUBJECTS_DETAILS_BY_ID, getChangeStudentSubjectsByIdGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_CHANGE_STUDENT_SUBJECTS_DETAILS, saveChangeStudentSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.UPDATE_CHANGE_STUDENT_SUBJECTS_DETAILS, updateChangeStudentSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.DELETE_CHANGE_STUDENT_SUBJECTS_DETAILS, deleteChangeStudentSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.DELETE_CHANGE_STUDENT_SUBJECTS_DETAILS_BY_ID, deleteChangeStudentSubjectsByIdGen);


    //mark entry
    yield takeLatest(ExaminationManagementConstants.GET_STUDENT_DETAILS, getStudentDetailsGen);
    yield takeLatest(ExaminationManagementConstants.GET_EXAMINATION_CLASSES, getExaminationClassesGen);
    yield takeLatest(ExaminationManagementConstants.GET_EXAMINATION_CLASS_SUBJECTS, getExaminationClassSubjectGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_ENTRY_MARKS, saveEntryMarksGen);
    yield takeLatest(ExaminationManagementConstants.GET_COSCHOLASTIC_GRADES_LIST, getCoscholasticGradesListGen);
    yield takeLatest(ExaminationManagementConstants.DOWNLOAD_MARKS_ENTRY, downloadMarksEntryGen);
    yield takeLatest(ExaminationManagementConstants.UPLOAD_MARKS_ENTRY, uploadMarksEntryGen);
   
    //Student Remrark
    yield takeLatest(ExaminationManagementConstants.GET_STUDENT_REMARKS_DETAILS, getStudentRemarksGen);
    yield takeLatest(ExaminationManagementConstants.GET_EXAMINATION_INSTITUTE_TERMS, getExaminationInstituteTermsGen);
    yield takeLatest(ExaminationManagementConstants.GET_STUDENT_REMARKS_DESCRIPTION, getStudentDescriptionGen);
    yield takeLatest(ExaminationManagementConstants.GET_STUDENT_REMARKS_DETAILS_BY_ID, getStudentRemarksByIdGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_STUDENT_REMARKS_DETAILS, saveStudentRemarksGen);
    yield takeLatest(ExaminationManagementConstants.EDIT_STUDENT_REMARKS_DETAILS, editStudentRemarksGen);
    yield takeLatest(ExaminationManagementConstants.DELETE_STUDENT_REMARKS_DETAILS, deleteStudentRemarksGen);

    //Ao Selection
    yield takeLatest(ExaminationManagementConstants.GET_AO_TERM_SUBJECTS, getAoTermSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.GET_AO_INSIDE_SUBJECTS, getAoInsideSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_AO_TERM_SUBJECTS, saveAoTermSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.GET_AO_TERM_SUBJECTS_BY_ID, getAoTermSubjectsByIdGen);
    yield takeLatest(ExaminationManagementConstants.DELETE_AO_TERM_SUBJECTS, deleteAoTermSubjectsGen);
    yield takeLatest(ExaminationManagementConstants.UPDATE_AO_TERM_SUBJECTS, updateAoTermSubjectsGen);

    // Ao Grade Entry
    yield takeLatest(ExaminationManagementConstants.GET_AO_GRADE_ENTRY_LIST, getAoGradeEntryListGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_AO_GRADE_ENTRY_LIST, saveAoGradeEntryListGen);
    yield takeLatest(ExaminationManagementConstants.EXAMINATION_SUBJECTS_LIST, getExaminationSubjects);

    ////Ey Grade Entry
    yield takeLatest(ExaminationManagementConstants.GET_EY_GRADE_ENTRY_DETAILS, getEyGradeEntryGen);
    yield takeLatest(ExaminationManagementConstants.GET_ENTRY_LEARNER_SKILL_DETAILS, getEntryLearnerSkillDetailsGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_EY_GRADE_ENTRY_LIST, saveEyGradeEntryListGen);
    

    //Internal Subjects Marks Entry
    yield takeLatest(ExaminationManagementConstants.GET_INTERNAL_SUBJECTS_MARKS_LIST, getInternalSubjectsMarksListGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_INTERNAL_SUBJECTS_MARKS_LIST, saveInternalSubjectsMarksListGen);

    // Progress Card
    yield takeLatest(ExaminationManagementConstants.GET_PROGRESS_CARD_LIST, getProgressCardListGen);
    yield takeLatest(ExaminationManagementConstants.GENERATE_PROGRESS_CARD, generateProgressCardGen);
    yield takeLatest(ExaminationManagementConstants.DOWNLOAD_PROGRESS_CARD, downloadProgressCardGen);
    yield takeLatest(ExaminationManagementConstants.PREVIEW_PROGRESS_CARD, previewProgressCardGen);
    yield takeLatest(ExaminationManagementConstants.DOWNLOAD_ALL_PROGRESS_CARDS, downloadAllProgressCardsGen);
    yield takeLatest(ExaminationManagementConstants.GET_SUBJECTS_FOR_INTERNAL_MARKS_ENTRY, getSubjectsForInternalMarksEntryGen);
    yield takeLatest(ExaminationManagementConstants.DOWNLOAD_CBSE_PROGRESS_CARDS, downloadCbseProgressCardsGen);
    yield takeLatest(ExaminationManagementConstants.GET_FILTER_LIST_FOR_CBSE, getFilterListForCbseGen);
    yield takeLatest(ExaminationManagementConstants.GET_CBSE_PROGRESSCARD_STUDENT, getCbseProgressCardStudentGen);

    //student_grade_book
    yield takeLatest(ExaminationManagementConstants.GET_STUDENT_GRADE_REPORT_BOOK, getStudentGradeReportBookListGen);
    yield takeLatest(ExaminationManagementConstants.EXPORT_STUDENT_GRADE_REPORT_BOOK, exportStudentGradeReportBookGen);

    //dashboard
    yield takeLatest(ExaminationManagementConstants.GET_EXAMINATION_DASHBOARD_DATA, getExaminationDashboardDataGen);
    yield takeLatest(ExaminationManagementConstants.GET_BRANCH_WISE_MARKS_RANGE, getBranchWiseMarksRangeGen);
    yield takeLatest(ExaminationManagementConstants.GET_MARKS_RANGE, getMarksRangeListGen);
    yield takeLatest(ExaminationManagementConstants.GET_SUBJECT_GRADE_WISE, getSubjectAndGradeWiseGen);
    yield takeLatest(ExaminationManagementConstants.GET_SUBJECT_LIST_OF_DASHBOARD, getSubjectListForDashboardGen);
    yield takeLatest(ExaminationManagementConstants.GET_CLASS_TEACHER_LIST, getClassTeacherListGen);
    yield takeLatest(ExaminationManagementConstants.GET_SUBJECT_GRADE_WISE_ANALYSIS, getSubjectGradeWiseAnalysisGen);
    yield takeLatest(ExaminationManagementConstants.EXPORT_SECTION_WISE_ANALYSIS, exportSectionWiseAnalysisGen);
    yield takeLatest(ExaminationManagementConstants.GET_CLASS_GRADE_WISE_ANALYSIS, getClassGradeWiseAnalysisGen);

    // student domains
    yield takeLatest(ExaminationManagementConstants.GET_FOUNDATION_STUDENTS_PROFILES_LIST, getFoundationStudentsProfilesGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_GENERAL_INFORMATION, saveGeneralInformationGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_GENERAL_STUDENT_PHOTO, saveGeneralStudentPhotoGen);
    yield takeLatest(ExaminationManagementConstants.GET_GENERAL_INFORMATION_BY_ID, getGeneralInformationByIdGen);
    yield takeLatest(ExaminationManagementConstants.UPDATE_GENERAL_INFORMATION, updateGeneralInformationGen);
    yield takeLatest(ExaminationManagementConstants.UPLOAD_STUDENT_SURROUNDING_PHOTO, uploadStudentSurroundingPhotoGen);
    yield takeLatest(ExaminationManagementConstants.UPLOAD_FAMILY_SURROUNDING_PHOTO, uploadFamilySurroundingPhotoGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_SURROUNDING, saveSurroundingGen);
    yield takeLatest(ExaminationManagementConstants.UPDATE_SURROUNDING, updateSurroundingGen);
    yield takeLatest(ExaminationManagementConstants.GET_DOMAIN_DETAILS_STUDENT, getDomainDetailsStudentGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_STUDENT_DOMAIN_DETAILS, saveDomainStudentDetailsGen);
    yield takeLatest(ExaminationManagementConstants.UPDATE_STUDENT_DOMAIN_DETAILS, updateDomainDetailsStudentGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_DOMAIN_SUMMARY, saveDomainSummaryGen);
    yield takeLatest(ExaminationManagementConstants.GET_LOG_ACTIVITY_STATUS, getLogActivityStatusGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_PARENT_COLLECTED_STATUS, saveParentCollectedStatusGen);
    yield takeLatest(ExaminationManagementConstants.GET_STUDENT_SUMMARY_BY_ID, getStudentSummaryByIdGen);
    yield takeLatest(ExaminationManagementConstants.COPY_FOUNDATION_STAGE_GRADE_ENTRY_STUDENT_DETAILS, copyFoundationStageGradeEntryStudentDetailsGen);

    //holistic progress card
    yield takeLatest(ExaminationManagementConstants.GET_HOLISTIC_PROGRESS_CARD, getHolisticProgressCardGen);
    yield takeLatest(ExaminationManagementConstants.GET_MARKS_ENTRY_REPORT_LIST, getMarksEntryReportListGen);
    yield takeLatest(ExaminationManagementConstants.EXPORT_MARKS_ENTRY_REPORT, exportMarksEntryReportGen);
    yield takeLatest(ExaminationManagementConstants.EXPORT_FOUNDATION_STAGE_GRADE_ENTRY, setExportFondationStageGradeEntryGen);

    // IGCSE Student Skills and Attributes
    yield takeLatest(ExaminationManagementConstants.GET_IGCSE_STUDENT_SKILLS_ATTRIBUTES_DETAILS, getIgcseStudentSkillsAttributesDetailsGen);
    yield takeLatest(ExaminationManagementConstants.SAVE_IGCSE_STUDENT_SKILLS_ATTRIBUTES_DETAILS, saveIgcseStudentSkillsAttributesDetailsGen);
    yield takeLatest(ExaminationManagementConstants.GET_CLASS_ANALYSIS_REPORT, getClassAnalysisReportGen);
 
}
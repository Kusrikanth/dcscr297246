import axios, { AxiosError, AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { AdmissionAvailabilityConstants } from "./admissionavailabilityconstant";
import {
    deleteData,
    getData,
    postData,
    putData,
} from "../../../../api/apiactions";
import { ICreatedActionType } from "../../../types";
import { addAdmissionAvailablityAct, editAdmissionAvailablityAct, setAcademicAvailablityErrorAct, setAddEvaluationProcessAct, setAddExamSubjectsListAct, setAddPanelMemberAct, setAdmissionAvailablityByIdAct, setAdmissionAvailablityClassListAct, setAdmissionAvailablityListAct, setAdmissionFacilitysListAct, setAdmissionFacilitysListById, setAgeCriteriaByIdAct, setAgeCriteriaListAct, setApplicationDetailsByCurriculumAct, setClassWiseDocumentsByIdAct, setClassWiseDocumentsListAct, setClassWiseDocumentsListByIdAct, setClassesForAddEvaluationAct, setClassesForEvaluationAct, setDelClassWiseDocumentsAct, setDelMasterDocumentsAct, setDeleteAdmissionFacilitysAct, setEditAdmissionFacilitysByIdAct, setEditAgeCriteriaRespAct, setEditClassWiseDocumentsAct, setEditEvaluationProcessByIdAct, setEditExamSubjectsListAct, setEditMasterDocumentsAct, setEditPanelMemberByIdAct, setEvaluationProcessByIdAct, setEvaluationProcessListAct, setExamSubjectStreamListAct, setExamSubjectsByClassAct, setExamSubjectsListAct, setExamSubjectsListById, setExportPanelMemberListAct, setGeneratedAgeCriteriaRespAct, setInstituteEvaluationListAct, setMasterDocumentsByIdAct, setMasterDocumentsListAct, setOtpSettingKeyAct, setPanelEmployeesListAct, setPanelMemberByIdAct, setPanelMembersListAct, setRegistrationInstructionAct, setSaveAdmissionFacilitysAct, setRegistrationInstructionSecondAct, setSaveClassWiseDocumentsAct, setSaveMasterDocumentsAct, setStuAppTrackerListAct, setStuListAppTrackerAct, setUnassignClassWiseDocumentsListAct, setOptionalSubjectsListAct, setOptionalSubjectItemByIdAct, setSaveOptionalSubjectItemsAct, setEditOptionalSubjectItemAct, delOptionalSubjectItemAct, setSaveApplicationBannerAct, setApplicationBannerAct, setAdmissionSignatureListAct, setSaveAdmissionSignatureAct, setUpdateAdmissionSignatureAct, setDeleteAdmissionSignatureAct, setAdmissionSignatureByIdAct } from "./admissionavailabilityslice";
import { deleteAdmissionFacilitysListAct, editAdmissionFacilitysListAct, saveAdmissionFacilitysListAct } from "./admissionavailabilityaction";

function* getAdmissionAvailabilityListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAdmissionAvailablityListAct(response.data));
    }
}
function* getAdmissionAvailabilityClassListGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAdmissionAvailablityClassListAct(response.data));
    }
}
function* addAdmissionAvailabilityClassListGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(addAdmissionAvailablityAct(response.data));
    }
}
function* setAdmissionAvailabilityByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAdmissionAvailablityByIdAct(response.data));
    }
}
function* editAdmissionAvailabilityClassListGen(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(editAdmissionAvailablityAct(response));
    }
}
function* getAgeCriteriaListGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAgeCriteriaListAct(response.data));
    }
}
function* getAgeCriteriaByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAgeCriteriaByIdAct(response.data));
    }
}
function* generateAgeCriteriaGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setGeneratedAgeCriteriaRespAct(response.data));
    }
}
function* getExamSubejctsListGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setExamSubjectsListAct(response.data));
    }
}
function* getPanelMembersListGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setPanelMembersListAct(response.data));
    }
}
function* addExamSubjectsListGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAddExamSubjectsListAct(response.data));
    }
}
function* editExamSubjectsListGen(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditExamSubjectsListAct(response));
    }
}
function* getExamSubjectsListByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setExamSubjectsListById(response.data));
    }
} 
function* getExamSubjectStreamListGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setExamSubjectStreamListAct(response.data));
    }
} 
function* getExamSubjectsByClassGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setExamSubjectsByClassAct(response.data));
    }
} 
function* getPanelEmployeesListGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setPanelEmployeesListAct(response.data));
    }
} 
function* addPanelMemberListGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAddPanelMemberAct(response.data));
    }
} 
function* getPanelMemberByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setPanelMemberByIdAct(response.data));
    }
} 
function* editPanelMemberByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditPanelMemberByIdAct(response));
    }
} 
function* editAgeCriteriaByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditAgeCriteriaRespAct(response));
    }
} 

// Evaluation Process Module

function* evaluationProcessListGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEvaluationProcessListAct(response.data));
    }
} 
function* instituteEvaluationListGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setInstituteEvaluationListAct(response.data));
    }
} 
function* classesForEvaluationProcessGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setClassesForEvaluationAct(response.data));
    }
} 
function* addEvaluationProcessGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAddEvaluationProcessAct(response.data));
    }
} 
function* classesForAddEvaluationGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setClassesForAddEvaluationAct(response.data));
    }
} 
function* getEvaluationProcessByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEvaluationProcessByIdAct(response.data));
    }
} 
function* exportPanelMemberListGen(action: any): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setExportPanelMemberListAct(response.data));
    }
} 
function* getEditEvaluationProcessByIdGen(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditEvaluationProcessByIdAct(response));
    }
} 

 // Master-Documents
 
function* getMasterDocumentsListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setMasterDocumentsListAct(response.data));
    }
}

function* saveMasterDocumentsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setSaveMasterDocumentsAct({statusCode : response.status}));
    }
}

function* editMasterDocumentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditMasterDocumentsAct({statusCode : response.status}));
    }
}

function* deleteMasterDocumentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setDelMasterDocumentsAct({status : response.statusCode}));
    }
}

function* getMasterDocumentsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setMasterDocumentsByIdAct(response.data));
    }
}

 // Class-Wise-Documents
 
function* getClassWiseDocumentsListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setClassWiseDocumentsListAct(response.data));
    }
}

function* getUnassignClassWiseDocumentsListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setUnassignClassWiseDocumentsListAct(response.data));
    }
}

function* saveClassWiseDocumentsGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setSaveClassWiseDocumentsAct({statusCode : response.status}));
    }
}

function* editClassWiseDocumentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditClassWiseDocumentsAct({statusCode : response.status}));
    }
}

function* deleteClassWiseDocumentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setDelClassWiseDocumentsAct({status : response.statusCode}));
    }
}

function* getClassWiseDocumentsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setClassWiseDocumentsByIdAct(response.data));
    }
}

function* getClassWiseDocumentsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setClassWiseDocumentsListByIdAct(response.data));
    }
}

//application-sale
function* getRegistrationInstructionGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setRegistrationInstructionAct(response.data));
    }
}
function* getRegistrationInstructionSecondGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setRegistrationInstructionSecondAct(response.data));
    }
}


function* getApplicationDetailsByCurriculumGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setApplicationDetailsByCurriculumAct(response.data));
    }
}

function* getStuAppTrackerListGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setStuAppTrackerListAct(response.data));
    }
}

function* getStuListAppTrackerGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setStuListAppTrackerAct(response.data));
    }
}

function* getOtpSettingKeyGen(action:ICreatedActionType):any {
    const {payload}=action;
    const response=yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setOtpSettingKeyAct(response.data));
    }
}

function* getAdmissionFacilitysListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAdmissionFacilitysListAct(response.data));
    }
}

function* getAdmissionFacilitysById(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAdmissionFacilitysListById(response.data));
    }
}

function* saveAdmissionFacility(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
     if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setSaveAdmissionFacilitysAct({statusCode : response.status}));
    }
}

function* editAdmissionFacilityById(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditAdmissionFacilitysByIdAct({statusCode : response.status}));
    }
}

function* deleteAdmissionFacilityById(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setDeleteAdmissionFacilitysAct({status : response.statusCode}));
    }
}
function* getOptionalSubjectsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setOptionalSubjectsListAct(response.data));
    }
}
function* getOptionalSubjectItemByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setOptionalSubjectItemByIdAct(response.data));
    }
}
function* saveOptionalSubjectItemsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
     if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setSaveOptionalSubjectItemsAct({statusCode : response.status}));
    }
}

function* editOptionalSubjectItemGen(action: any): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setEditOptionalSubjectItemAct({statusCode : response.status}));
    }
}

function* delOptionalSubjectItemGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(delOptionalSubjectItemAct({status : response.statusCode}));
    }
}

//Application-Banner
function* getApplicationBannerGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setApplicationBannerAct(response.data));
    }
}

function* saveApplicationBannerGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
     if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setSaveApplicationBannerAct({statusCode : response.status}));
    }
}

//signature
function* getAdmissionSignatureListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAdmissionSignatureListAct(response.data));
    }
}

function* saveAdmissionSignatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setSaveAdmissionSignatureAct({ status: response.status }));
    }
}

function* updateAdmissionSignatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setUpdateAdmissionSignatureAct({ status: response.status }));
    }
}

function* deleteAdmissionSignatureGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setDeleteAdmissionSignatureAct({ status: response.status }));
    }
}

function* getAdmissionSignatureByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setAcademicAvailablityErrorAct(response.error));
    } else {
        yield put(setAdmissionSignatureByIdAct(response.data));
    }
}
export default function* AdmissionAvailabilitySaga() {
    yield takeLatest(AdmissionAvailabilityConstants.ADMISSION_LIST_REQUEST, getAdmissionAvailabilityListGen);
    yield takeLatest(AdmissionAvailabilityConstants.ADMISSION_CLASS_LIST_REQUEST, getAdmissionAvailabilityClassListGen);
    yield takeLatest(AdmissionAvailabilityConstants.ADD_ADMISSION_AVAILABILTY, addAdmissionAvailabilityClassListGen);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_ADMISSION_AVAILABILTY, editAdmissionAvailabilityClassListGen);
    yield takeLatest(AdmissionAvailabilityConstants.ADMISSION_AVAILABILTY_BY_ID, setAdmissionAvailabilityByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.AGE_CRITERIA_LIST_REQUEST, getAgeCriteriaListGen);
    yield takeLatest(AdmissionAvailabilityConstants.GENERATE_AGE_CRITERIA, generateAgeCriteriaGen);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_AGE_CRITERIA, editAgeCriteriaByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.AGE_CRITERIA_BY_ID_REQUEST, getAgeCriteriaByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.EXAM_SUBJECTS_LIST, getExamSubejctsListGen);
    yield takeLatest(AdmissionAvailabilityConstants.EXAM_SUBJECT_ALL_SUBJECTS_BY_CLASS, getExamSubjectsByClassGen);
    yield takeLatest(AdmissionAvailabilityConstants.EXAM_SUBJECT_STREAM_LIST, getExamSubjectStreamListGen);
    yield takeLatest(AdmissionAvailabilityConstants.ADD_EXAM_SUBJECT, addExamSubjectsListGen);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_EXAM_SUBJECT, editExamSubjectsListGen);
    yield takeLatest(AdmissionAvailabilityConstants.EXAM_SUBJECTS_BY_ID_REQUEST, getExamSubjectsListByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.PANEL_MEMBERS_LIST, getPanelMembersListGen);
    yield takeLatest(AdmissionAvailabilityConstants.PANEL_EMPLOYEES_LIST, getPanelEmployeesListGen);
    yield takeLatest(AdmissionAvailabilityConstants.ADD_PANEL_MEMBER, addPanelMemberListGen);
    yield takeLatest(AdmissionAvailabilityConstants.PANEL_MEMBER_BY_ID_REQUEST, getPanelMemberByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_PANEL_MEMBER, editPanelMemberByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.EVALUATION_PROCESS_LIST, evaluationProcessListGen);
    yield takeLatest(AdmissionAvailabilityConstants.INSTITUTE_EVALUATION_LIST, instituteEvaluationListGen);
    yield takeLatest(AdmissionAvailabilityConstants.CLASSES_FOR_EVALUATION_LIST, classesForEvaluationProcessGen);
    yield takeLatest(AdmissionAvailabilityConstants.ADD_EVALUATION_PROCESS, addEvaluationProcessGen);
    yield takeLatest(AdmissionAvailabilityConstants.CLASSES_FOR_ADD_EVALUATION, classesForAddEvaluationGen);
    yield takeLatest(AdmissionAvailabilityConstants.EVALUATION_PROCESS_LIST_BY_ID, getEvaluationProcessByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_EVALUATION_PROCESS, getEditEvaluationProcessByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.EXPORT_PANEL_MEMBER_LIST, exportPanelMemberListGen);

    //Master-Documents

    yield takeLatest(AdmissionAvailabilityConstants.GET_MASTER_DOCUMENTS_LIST, getMasterDocumentsListGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_MASTER_DOCUMENTS_BY_ID, getMasterDocumentsByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.SAVE_MASTER_DOCUMENTS, saveMasterDocumentsGen);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_MASTER_DOCUMENTS, editMasterDocumentsGen);
    yield takeLatest(AdmissionAvailabilityConstants.DELETE_MASTER_DOCUMENTS, deleteMasterDocumentsGen);

    //Class-Wise-Documents

    yield takeLatest(AdmissionAvailabilityConstants.GET_CLASS_WISE_DOCUMENTS_LIST, getClassWiseDocumentsListGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_CLASS_WISE_DOCUMENTS_LIST_BY_ID, getClassWiseDocumentsListByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_UNASSIGN_CLASS_WISE_DOCUMENTS_LIST, getUnassignClassWiseDocumentsListGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_CLASS_WISE_DOCUMENTS_BY_ID, getClassWiseDocumentsByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_CLASS_WISE_DOCUMENTS, editClassWiseDocumentsGen);
    yield takeLatest(AdmissionAvailabilityConstants.SAVE_CLASS_WISE_DOCUMENTS, saveClassWiseDocumentsGen);
    yield takeLatest(AdmissionAvailabilityConstants.DELETE_CLASS_WISE_DOCUMENTS, deleteClassWiseDocumentsGen);
    
    // Admission Facility
    yield takeLatest(AdmissionAvailabilityConstants.GET_ADMISSION_FACILITY_LIST, getAdmissionFacilitysListGen);
    yield takeLatest(AdmissionAvailabilityConstants.SAVE_ADMISSION_FACILITY, saveAdmissionFacility);
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_ADMISSION_FACILITY, editAdmissionFacilityById);
    yield takeLatest(AdmissionAvailabilityConstants.DELETE_ADMISSION_FACILITY, deleteAdmissionFacilityById);
    yield takeLatest(AdmissionAvailabilityConstants.GET_ADMISSION_FACILITY_LIST_BY_ID, getAdmissionFacilitysById);
    //application-sale
    yield takeLatest(AdmissionAvailabilityConstants.GET_REGISTRATION_INSTRUCTION, getRegistrationInstructionGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_REGISTRATION_INSTRUCTION_SECOND, getRegistrationInstructionSecondGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_APPLICATION_DETAILS_BY_CURRICULUM, getApplicationDetailsByCurriculumGen);

    yield takeLatest(AdmissionAvailabilityConstants.STU_APP_TRACKER_LIST, getStuAppTrackerListGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_STU_LIST_APP_TRACKER, getStuListAppTrackerGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_OTP_SETTING_KEY, getOtpSettingKeyGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_OPTIONAL_SUBJECTS_LIST,getOptionalSubjectsListGen)
    yield takeLatest(AdmissionAvailabilityConstants.GET_OPTIONAL_SUBJECTS_ITEM_BY_ID,getOptionalSubjectItemByIdGen)
    yield takeLatest(AdmissionAvailabilityConstants.SAVE_OPTIONAL_SUBJECTS_ITEM,saveOptionalSubjectItemsGen)
    yield takeLatest(AdmissionAvailabilityConstants.EDIT_OPTIONAL_SUBJECTS_ITEM,editOptionalSubjectItemGen)
    yield takeLatest(AdmissionAvailabilityConstants.DEL_OPTIONAL_SUBJECTS_ITEM,delOptionalSubjectItemGen)

    //Application-Banner
    yield takeLatest(AdmissionAvailabilityConstants.GET_APPLICATION_BANNER, getApplicationBannerGen);
    yield takeLatest(AdmissionAvailabilityConstants.SAVE_APPLICATION_BANNER, saveApplicationBannerGen);
    
    //signature
    yield takeLatest(AdmissionAvailabilityConstants.GET_ADMISSION_SIGNATURE_LIST, getAdmissionSignatureListGen);
    yield takeLatest(AdmissionAvailabilityConstants.SAVE_ADMISSION_SIGNATURE, saveAdmissionSignatureGen);
    yield takeLatest(AdmissionAvailabilityConstants.UPDATE_ADMISSION_SIGNATURE, updateAdmissionSignatureGen);
    yield takeLatest(AdmissionAvailabilityConstants.GET_ADMISSION_SIGNATURE_BY_ID, getAdmissionSignatureByIdGen);
    yield takeLatest(AdmissionAvailabilityConstants.DELETE_ADMISSION_SIGNATURE, deleteAdmissionSignatureGen);

}
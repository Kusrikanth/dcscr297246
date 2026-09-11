import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    IAdmissionAvailabilityReducerState
} from "./admissionavailabilitytypes";
import { IResponseErrorModel } from "../../../types";
import { setDeleteAdmissionWithdrawalAct } from "../../AdmissionSettings/admissionsettingslice";

const initialState: IAdmissionAvailabilityReducerState = {
    admissionAvailabilityListResp: undefined,
    admissionAvailabilityClassListResp: undefined,
    addadmissionAvailabilityResp: undefined,
    editadmissionAvailabilityResp: undefined,
    getadmissionAvailabilityByIdResp: undefined,
    ageCriteriaListResp: undefined,
    ageCriteriaByIdResp: undefined,
    generateAgeCriteriaResp: undefined,
    editAgeCriteriaByIdResp: undefined,
    examSubjectsListResp: undefined,
    getExamSubjectsByClassResp: undefined,
    editExamSubjectsListResp: undefined,
    addExamSubjectsListResp : undefined,
    examSubjectListByIdResp : undefined,
    getExamSubjectStreamResp : undefined,
    panelMembersListResp: undefined,
    academicAvailabilityErrorResp: undefined,
    panelEmployeesListResp:undefined,
    addPanelMemberResp:undefined,
    getPanelMemberByIdResp:undefined,
    editPanelMemberResp:undefined,
    getEvaluationProcessListResp:undefined,
    getInstituteEvaluationListResp:undefined,
    getClassesForEvaluationResp:undefined,
    addEvaluationProcessResp:undefined,
    classesForAddEvaluationResp:undefined,
    getEvaluationProcessByIdResp:undefined,
    exportPanelMemberListResp:undefined,
    editEvaluationProcessByIdResp : undefined,

    //Master-Documents
    getMasterDocumentsListResp : undefined,
    saveMasterDocumentsResp : undefined,
    getMasterDocumentsByIdResp : undefined,
    editMasterDocumentsRequestResp : undefined,
    delMasterDocumentsRequestResp : undefined,

    //Class-Wise-Documents
    getClassWiseDocumentsListResp : undefined,
    getClassWiseDocumentsListByIdResp : undefined,
    getUnassignClassWiseDocumentsListResp : undefined,
    editClassWiseDocumentsResp : undefined,
    saveClassWiseDocumentsResp : undefined,
    getClassWiseDocumentsByIdResp : undefined,
    delClassWiseDocumentsRequestResp : undefined,
    getRegistrationInstructionResp : undefined,
    getRegistrationInstructionSecondResp:undefined,

    //Admission Facility
    getAdmissionFacilitysListResp : undefined,
    getAdmissionFacilitysListByIdResp : undefined,
    editAdmissionFacilityResp : undefined,
    saveAdmissionFacilityResp : undefined,
    delAdmissionFacilityRequestResp : undefined,

    getStuAppTrackerListResp : undefined,
    getStuListAppTrackerResp : undefined,
    getOtpSettingKeyResp : undefined,

    getApplicationDetailsByCurriculumResp : undefined,

    // OptionalSubjects
    getOptionalSubjectsListResp : undefined,
    getOptionalSubjectItemByIdResp : undefined,
    saveOptionalSubjectItemsResp : undefined,
    editOptionalSubjectItemResp : undefined,
    delOptionalSubjectItemResp : undefined,

    //Application-Banner
    getApplicationBannerResp : undefined,
    saveApplicationBannerResp : undefined,

    //Signature
    getAdmissionSignatureListResp : undefined,
    saveAdmissionSignatureResp : undefined,
    updateAdmissionSignatureResp : undefined,
    getAdmissionSignatureByIdResp : undefined,
    delAdmissionSignatureResp : undefined,
};

export const admissionAvailabilityRequest = createSlice({
    name: "admissionavailabilityrequest",
    initialState,
    reducers: {
        setAdmissionAvailablityListAct: (state, action: PayloadAction<any>) => {
            state.admissionAvailabilityListResp = action.payload;
        },
        setAdmissionFacilitysListAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionFacilitysListResp = action.payload;
        },
        setAdmissionFacilitysListById: (state, action: PayloadAction<any>) => {
        state.getAdmissionFacilitysListByIdResp = action.payload;
        },
        setEditAdmissionFacilitysByIdAct: (state, action: PayloadAction<any>) => {
            state.editAdmissionFacilityResp = action.payload;
        },
        setSaveAdmissionFacilitysAct: (state, action: PayloadAction<any>) => {
            state.saveAdmissionFacilityResp = action.payload;
        },
        setDeleteAdmissionFacilitysAct: (state, action: PayloadAction<any>) => {
            state.delAdmissionFacilityRequestResp = action.payload;
        },
        setAdmissionAvailablityClassListAct: (state, action: PayloadAction<any>) => {
            state.admissionAvailabilityClassListResp = action.payload;
        },
        addAdmissionAvailablityAct: (state, action: PayloadAction<any>) => {
            state.addadmissionAvailabilityResp = action.payload;
        },
        editAdmissionAvailablityAct: (state, action: PayloadAction<any>) => {
            state.editadmissionAvailabilityResp = action.payload;
        },
        setAdmissionAvailablityByIdAct: (state, action: PayloadAction<any>) => {
            state.getadmissionAvailabilityByIdResp = action.payload;
        },
        setAgeCriteriaListAct: (state, action: PayloadAction<any>) => {
            state.ageCriteriaListResp = action.payload;
        },
        setAgeCriteriaByIdAct: (state, action: PayloadAction<any>) => {
            state.ageCriteriaByIdResp = action.payload;
        },
        setGeneratedAgeCriteriaRespAct: (state, action: PayloadAction<any>) => {
            state.generateAgeCriteriaResp = action.payload;
        },
        setEditAgeCriteriaRespAct: (state, action: PayloadAction<any>) => {
            state.editAgeCriteriaByIdResp = action.payload;
        },
        setExamSubjectsListAct: (state, action: PayloadAction<any>) => {
            state.examSubjectsListResp = action.payload;
        },
        setExamSubjectStreamListAct: (state, action: PayloadAction<any>) => {
            state.getExamSubjectStreamResp = action.payload;
        },
        setExamSubjectsByClassAct: (state, action: PayloadAction<any>) => {
            state.getExamSubjectsByClassResp = action.payload;
        },
        setPanelMembersListAct: (state, action: PayloadAction<any>) => {
            state.panelMembersListResp = action.payload;
        },
        setAddExamSubjectsListAct: (state, action: PayloadAction<any>) => {
            state.addExamSubjectsListResp = action.payload;
        },
        setEditExamSubjectsListAct: (state, action: PayloadAction<any>) => {
            state.editExamSubjectsListResp = action.payload;
        },
        setExamSubjectsListById: (state, action: PayloadAction<any>) => {
            state.examSubjectListByIdResp = action.payload;
        },
        setPanelEmployeesListAct: (state, action: PayloadAction<any>) => {          
            state.panelEmployeesListResp = action.payload;
        },
        resetPanelEmployeesListAct: (state, action: PayloadAction<any>) => {          
            state.panelEmployeesListResp = action.payload;
        },
        setAddPanelMemberAct: (state, action: PayloadAction<any>) => {          
            state.addPanelMemberResp = action.payload;
        },
        setPanelMemberByIdAct: (state, action: PayloadAction<any>) => {          
            state.getPanelMemberByIdResp = action.payload;
        },
        setEditPanelMemberByIdAct: (state, action: PayloadAction<any>) => {          
            state.editPanelMemberResp = action.payload;
        },
        setEvaluationProcessListAct: (state, action: PayloadAction<any>) => {          
            state.getEvaluationProcessListResp = action.payload;
        },
        setInstituteEvaluationListAct: (state, action: PayloadAction<any>) => {          
            state.getInstituteEvaluationListResp = action.payload;
        },
        setClassesForEvaluationAct: (state, action: PayloadAction<any>) => {          
            state.getClassesForEvaluationResp = action.payload;
        },
        setAddEvaluationProcessAct: (state, action: PayloadAction<any>) => {          
            state.addEvaluationProcessResp = action.payload;
        },
        setClassesForAddEvaluationAct: (state, action: PayloadAction<any>) => {          
            state.classesForAddEvaluationResp = action.payload;
        },
        setEvaluationProcessByIdAct: (state, action: PayloadAction<any>) => {          
            state.getEvaluationProcessByIdResp = action.payload;
        },
        setEditEvaluationProcessByIdAct: (state, action: PayloadAction<any>) => {          
            state.editEvaluationProcessByIdResp = action.payload;
        },
        setExportPanelMemberListAct: (state, action: PayloadAction<any>) => {          
            state.exportPanelMemberListResp = action.payload;
        },
        setAcademicAvailablityErrorAct: (
            state,
            action: PayloadAction<IResponseErrorModel>
        ) => {
            state.academicAvailabilityErrorResp = action.payload;
        },

        //Master-Documents
        
    setMasterDocumentsListAct: (state, action: PayloadAction<any>) => {
        state.getMasterDocumentsListResp = action.payload;
    },
    setSaveMasterDocumentsAct: (state, action: PayloadAction<any>) => {
        state.saveMasterDocumentsResp = action.payload;
    },
    setMasterDocumentsByIdAct: (state, action: PayloadAction<any>) => {
        state.getMasterDocumentsByIdResp = action.payload;
    },
    setEditMasterDocumentsAct: (state, action: PayloadAction<any>) => {
        state.editMasterDocumentsRequestResp = action.payload;
    },
    setDelMasterDocumentsAct: (state, action: PayloadAction<any>) => {
        state.delMasterDocumentsRequestResp = action.payload;
    },

        //Class-Wise-Documents
        
    setClassWiseDocumentsListAct: (state, action: PayloadAction<any>) => {
        state.getClassWiseDocumentsListResp = action.payload;
    },
    setUnassignClassWiseDocumentsListAct: (state, action: PayloadAction<any>) => {
        state.getUnassignClassWiseDocumentsListResp = action.payload;
    },
    setSaveClassWiseDocumentsAct: (state, action: PayloadAction<any>) => {
        state.saveClassWiseDocumentsResp = action.payload;
    },
    setEditClassWiseDocumentsAct: (state, action: PayloadAction<any>) => {
        state.editClassWiseDocumentsResp = action.payload;
    },
    setClassWiseDocumentsByIdAct: (state, action: PayloadAction<any>) => {
        state.getClassWiseDocumentsByIdResp = action.payload;
    },
    setDelClassWiseDocumentsAct: (state, action: PayloadAction<any>) => {
        state.delClassWiseDocumentsRequestResp = action.payload;
    },
    setClassWiseDocumentsListByIdAct: (state, action: PayloadAction<any>) => {
        state.getClassWiseDocumentsListByIdResp = action.payload;
    },
    
    //application-sale
    setRegistrationInstructionAct: (state, action: PayloadAction<any>) => {
        state.getRegistrationInstructionResp = action.payload;
    },
    setRegistrationInstructionSecondAct: (state, action: PayloadAction<any>) => {
        state.getRegistrationInstructionSecondResp = action.payload;
    },
    resetRegistrationInstructionSecondAct: (state, action: PayloadAction<any>) => {
        state.getRegistrationInstructionSecondResp = action.payload;
    },
    setApplicationDetailsByCurriculumAct: (state, action: PayloadAction<any>) => {
        state.getApplicationDetailsByCurriculumResp = action.payload;
    },

    setStuAppTrackerListAct: (state, action: PayloadAction<any>) => {
        state.getStuAppTrackerListResp = action.payload;
    },
    setStuListAppTrackerAct: (state, action: PayloadAction<any>) => {
        state.getStuListAppTrackerResp = action.payload;
    },
    setOtpSettingKeyAct: (state, action: PayloadAction<any>) => {
        state.getOtpSettingKeyResp = action.payload;
    },

    // OptionalSubjects
    setOptionalSubjectsListAct: (state,action:PayloadAction<any>) => {
        state.getOptionalSubjectsListResp = action.payload;
    },
    resetOptionalSubjectsListAct: (state,action:PayloadAction<any>) => {
        state.getOptionalSubjectsListResp = action.payload;
    },
    setOptionalSubjectItemByIdAct: (state,action:PayloadAction<any>) => {
        state.getOptionalSubjectItemByIdResp = action.payload;
    },
    setSaveOptionalSubjectItemsAct: (state,action:PayloadAction<any>) => {
        state.saveOptionalSubjectItemsResp = action.payload;
    },
    setEditOptionalSubjectItemAct: (state,action:PayloadAction<any>) => {
        state.editOptionalSubjectItemResp = action.payload;
    },
    delOptionalSubjectItemAct: (state,action:PayloadAction<any>) => {
        state.delOptionalSubjectItemResp = action.payload;
    },

    //Application-Banner
    
        setApplicationBannerAct: (state, action: PayloadAction<any>) => {
            state.getApplicationBannerResp = action.payload;
        },
        resetApplicationBannerAct: (state, action: PayloadAction<any>) => {
            state.getApplicationBannerResp = action.payload;
        },
        setSaveApplicationBannerAct: (state, action: PayloadAction<any>) => {
            state.saveApplicationBannerResp = action.payload;
        },
        
        //Signatures
        setAdmissionSignatureListAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionSignatureListResp = action.payload;
        },
        setSaveAdmissionSignatureAct: (state, action: PayloadAction<any>) => {
            state.saveAdmissionSignatureResp = action.payload;
        },
        setUpdateAdmissionSignatureAct: (state, action: PayloadAction<any>) => {
            state.updateAdmissionSignatureResp = action.payload;
        },
        setAdmissionSignatureByIdAct: (state, action: PayloadAction<any>) => {
            state.getAdmissionSignatureByIdResp = action.payload;
        },
        setDeleteAdmissionSignatureAct: (state, action: PayloadAction<any>) => {
            state.delAdmissionSignatureResp = action.payload;
        },
    },
});


export const {
    setAdmissionAvailablityListAct,
    setAdmissionFacilitysListAct,
    setEditAdmissionFacilitysByIdAct,
    setAdmissionFacilitysListById,
    setSaveAdmissionFacilitysAct,
    setDeleteAdmissionFacilitysAct,
    setAdmissionAvailablityClassListAct,
    addAdmissionAvailablityAct,
    editAdmissionAvailablityAct,
    setAgeCriteriaListAct,
    setAgeCriteriaByIdAct,
    setEditAgeCriteriaRespAct,
    setGeneratedAgeCriteriaRespAct,
    setAdmissionAvailablityByIdAct,
    setExamSubjectsListAct,
    setExamSubjectStreamListAct,
    setExamSubjectsByClassAct,
    setEditExamSubjectsListAct,
    setAddExamSubjectsListAct,
    setExamSubjectsListById,
    setAcademicAvailablityErrorAct,
    setPanelMembersListAct,
    setPanelEmployeesListAct,
    setAddPanelMemberAct,
    resetPanelEmployeesListAct,
    setPanelMemberByIdAct,
    setEditPanelMemberByIdAct,
    setEvaluationProcessListAct,
    setInstituteEvaluationListAct,
    setClassesForEvaluationAct,
    setAddEvaluationProcessAct,
    setClassesForAddEvaluationAct,
    setEvaluationProcessByIdAct,
    setEditEvaluationProcessByIdAct,
    setExportPanelMemberListAct,

    //Master-DOcuments

    setMasterDocumentsListAct,
    setSaveMasterDocumentsAct,
    setEditMasterDocumentsAct,
    setDelMasterDocumentsAct,
    setMasterDocumentsByIdAct,

    //Class-Wise-DOcuments

    setClassWiseDocumentsListAct,
    setClassWiseDocumentsListByIdAct,
    setUnassignClassWiseDocumentsListAct,
    setEditClassWiseDocumentsAct,
    setSaveClassWiseDocumentsAct,
    setDelClassWiseDocumentsAct,
    setClassWiseDocumentsByIdAct,

    //application-sale  
      setRegistrationInstructionAct,
      setRegistrationInstructionSecondAct,
      resetRegistrationInstructionSecondAct,
      setApplicationDetailsByCurriculumAct,

      setStuAppTrackerListAct,
      setStuListAppTrackerAct,
      setOtpSettingKeyAct,

    setOptionalSubjectsListAct,
    resetOptionalSubjectsListAct,
    setOptionalSubjectItemByIdAct,
    setSaveOptionalSubjectItemsAct,
    setEditOptionalSubjectItemAct,
    delOptionalSubjectItemAct,

    //Application-Banner
    setApplicationBannerAct,
    resetApplicationBannerAct,
    setSaveApplicationBannerAct,

    //Signatures
    setAdmissionSignatureListAct,
    setSaveAdmissionSignatureAct,
    setUpdateAdmissionSignatureAct,
    setAdmissionSignatureByIdAct,
    setDeleteAdmissionSignatureAct,

} = admissionAvailabilityRequest.actions;

export default admissionAvailabilityRequest.reducer;




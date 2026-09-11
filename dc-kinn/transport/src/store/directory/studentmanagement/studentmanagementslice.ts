import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStudentManagementState } from "./studentmanagementtypes";
import { IModelWithPagination } from "../../types";

const initialState: IStudentManagementState = {
    getStudentAttendanceResp: undefined,
    studentsStatsResp: undefined,
    studentsListResp: undefined,
    studentsIdsListResp: undefined,
    addStudentResp: undefined,
    updateStudentResp: undefined,
    affectedSection: undefined,
    getStudentByIdResp: undefined,
    getSiblingDetailsResp: undefined,
    downDocumentByIdResp: undefined,
    deleteStudentResp: undefined,
    uploadStudentDocumentResp: undefined,
    classWiseDocumentListResp: undefined,
    getStudentsByFilterResp: undefined,
    studentManagementErrorResp: undefined,
    pastEducationClass: undefined,
    permanentAddressStateResp: undefined,
    permanentAddressCityResp: undefined,
    studentFatherEmployeeDetailsResp: undefined,
    studentMotherEmployeeDetailsResp: undefined,
    allParentsListResp: undefined,
    parentChildrensResp: undefined,
    parentDetailsByIdResp: undefined,
    parentsStatsResp: undefined,
    updatePrimaryContactResp: undefined,
    studentListByRegNo: undefined,
    exportParentListResp: undefined,
    studentDetailsByRegNo: undefined,
    exportStudentDataResp: undefined,
    exportStudentDataRegistrationResp: undefined,
    sendCredentialsParentResp: undefined,
    updateStudentDetailsResp: undefined,
    updateWhatsappnoResp: undefined,
    deleteDocByIdResp: undefined,
};

export const studentManagementSlice = createSlice({
    name: "studentManagement",
    initialState,
    reducers: {
        setStudentAttendanceAct: (state, action: PayloadAction<any>) => {
            state.getStudentAttendanceResp = action.payload
        },
        resetStudentAttendanceAct: (state, action: PayloadAction<any>) => {
            state.getStudentAttendanceResp = action.payload
        },
        setStudentsStatsAct: (state, action: PayloadAction<any>) => {
            state.studentsStatsResp = action.payload
        },
        setStudentsListAct: (state, action: PayloadAction<any>) => {
            state.studentsListResp = action.payload
        },
        setStudentsIdsListAct: (state, action: PayloadAction<any>) => {
            state.studentsIdsListResp = action.payload
        },
        setAddStudentAct: (state, action: PayloadAction<any>) => {
            state.addStudentResp = action.payload
        },
        setUpdateStudentAct: (state, action: PayloadAction<any>) => {
            state.updateStudentResp = action.payload
            state.affectedSection = action.payload.affectedSection;

        },
        setGetStudentByIdAct: (state, action: PayloadAction<any>) => {
            state.getStudentByIdResp = action.payload
        },
        resetGetStudentByIdAct: (state, action: PayloadAction<any>) => {
            state.getStudentByIdResp = action.payload
        },
        setGetSiblingDetailsAct: (state, action: PayloadAction<any>) => {
            state.getSiblingDetailsResp = action.payload
        },
        setDownDocumentByIdAct: (state, action: PayloadAction<any>) => {
            state.downDocumentByIdResp = action.payload
        },
        setDeleteStudentAct: (state, action: PayloadAction<any>) => {
            state.deleteStudentResp = action.payload
        },

        setUploadStudentDocumentAct: (state, action: PayloadAction<any>) => {
            state.uploadStudentDocumentResp = action.payload
        },

        setClassWiseDocumentListAct: (state, action: PayloadAction<any>) => {
            state.classWiseDocumentListResp = action.payload
        },

        setStudentsByFilterAct: (state, action: PayloadAction<any>) => {
            state.getStudentsByFilterResp = action.payload
        },
        // clearStudentsByFilterAct:(state,action: PayloadAction<any>)=>{
        //     state.getStudentsByFilterResp=action.payload
        // },
        setStudentMngmntErrorAct: (state, action: PayloadAction<any>) => {
            state.studentManagementErrorResp = action.payload
        },
        setPastEductionClassAct: (state, action: PayloadAction<any>) => {
            state.pastEducationClass = action.payload
        },
        setPermanentAddressStateResp: (state, action: PayloadAction<any>) => {
            state.permanentAddressStateResp = action.payload
        },
        setPermanentAddressCityResp: (state, action: PayloadAction<any>) => {
            state.permanentAddressCityResp = action.payload
        },
        setStudentFatherEmployeeDetailsAct: (state, action: PayloadAction<any>) => {
            state.studentFatherEmployeeDetailsResp = action.payload
        },
        setStudentMotherEmployeeDetailsAct: (state, action: PayloadAction<any>) => {
            state.studentMotherEmployeeDetailsResp = action.payload
        },
        setAllParentsListAct: (state, action: PayloadAction<any>) => {
            state.allParentsListResp = action.payload
        },
        setParentChildrensAct: (state, action: PayloadAction<any>) => {
            state.parentChildrensResp = action.payload
        },
        setParentDetailsByIdResp: (state, action: PayloadAction<any>) => {
            state.parentDetailsByIdResp = action.payload
        },
        setParentsStatsAct: (state, action: PayloadAction<any>) => {
            state.parentsStatsResp = action.payload
        },
        setUpdatePrimaryContactAct: (state, action: PayloadAction<any>) => {
            state.updatePrimaryContactResp = action.payload
        },
        setExportStudentDataAct: (state, action: PayloadAction<any>) => {
            state.exportStudentDataResp = action.payload
        },
        setExportStudentRegistrationDataAct: (state, action: PayloadAction<any>) => {
            state.exportStudentDataRegistrationResp = action.payload
        },
        setStudentListByRegNoAct: (state, action: PayloadAction<any>) => {
            state.studentListByRegNo = action.payload
        },
        setStudentDetailsByRegNoAct: (state, action: PayloadAction<any>) => {
            state.studentDetailsByRegNo = action.payload
        },
        setExportParentListAct: (state, action: PayloadAction<any>) => {
            state.exportParentListResp = action.payload
        },
        setSendCredentialsParentAct: (state, action: PayloadAction<any>) => {
            state.sendCredentialsParentResp = action.payload
        },
        setUpdateStudentDetailsAct: (state, action: PayloadAction<any>) => {
            state.updateStudentDetailsResp = action.payload
            state.affectedSection = action.payload.affectedSection;
        },
        setUpdateWhatsappnoAct: (state, action: PayloadAction<any>) => {
            state.updateWhatsappnoResp = action.payload
        },
        setDeleteDocByIdAct: (state, action: PayloadAction<any>) => {
            state.deleteDocByIdResp = action.payload
        },
        resetAct: (state, action) => {
            state = initialState;
        },
    },
    extraReducers: (builder) => {
        builder.addCase('RESET_STATE', (state) => {
            return initialState;
        });
        builder.addCase('RESET_STUDENTMANGEMENT_STORE', (state) => {
            return initialState;
        });
    },
});

export const { setStudentAttendanceAct,resetStudentAttendanceAct,setStudentsStatsAct, setStudentsListAct,
    setStudentsIdsListAct, setAddStudentAct, setUpdateStudentAct,
    setGetStudentByIdAct,resetGetStudentByIdAct, setGetSiblingDetailsAct, setDownDocumentByIdAct, setDeleteStudentAct, setUploadStudentDocumentAct, setClassWiseDocumentListAct,
    setStudentsByFilterAct, setStudentMngmntErrorAct, setPastEductionClassAct,
    setPermanentAddressStateResp, setPermanentAddressCityResp,
    setStudentFatherEmployeeDetailsAct, setStudentMotherEmployeeDetailsAct, setExportStudentDataAct, setExportStudentRegistrationDataAct,
    setParentChildrensAct, setUpdateStudentDetailsAct, setUpdateWhatsappnoAct,
    setParentDetailsByIdResp,
    setParentsStatsAct,
    setUpdatePrimaryContactAct
    , setExportParentListAct,
    setAllParentsListAct,
    setSendCredentialsParentAct,setDeleteDocByIdAct,
    setStudentListByRegNoAct, setStudentDetailsByRegNoAct,
    resetAct
} = studentManagementSlice.actions;

export default studentManagementSlice.reducer;

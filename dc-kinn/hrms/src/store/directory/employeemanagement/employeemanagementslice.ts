import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IStudentManagementState } from "./employeemanagementtypes";
import { IModelWithPagination } from "../../types";

const initialState: IStudentManagementState = {
    employeesStatsResp: undefined,
    employeesListResp: undefined,
    otherEmployeesListResp: undefined,
    addEmployeeResp: undefined,
    updateEmployeeResp: undefined,
    getEmployeeByIdResp: undefined,
    downDocumentByIdResp: undefined,
    deleteEmployeeResp: undefined,
    uploadEmployeeDocumentResp: undefined,
    getEmployeesByFilterResp: undefined,
    getEmployeesNameByFilterResp: undefined,
    getEmployeeDocumentListResp: undefined,
    getReporterListResp: undefined,
    getReportingClassDivisonListResp: undefined,
    getHodListResp: undefined,
    employeeManagementErrorResp: undefined,
    exportEmployeeDataResp: undefined,
    exportOtherEmployeeDataResp: undefined,
    getAllCompaniesllListResp: undefined,
    getCompanyDetailsListByIdResp: undefined,
    editCompanyDetailsRequestResp: undefined,
    saveCompanyDetailsListResp: undefined,
    delCompanyDetailsRequestResp: undefined,

};

export const studentManagementSlice = createSlice({
    name: "employeeManagement",
    initialState,
    reducers: {
        setEmployeesStatsAct: (state, action: PayloadAction<any>) => {
            state.employeesStatsResp = action.payload
        },
        setEmployeesListAct: (state, action: PayloadAction<any>) => {
            state.employeesListResp = action.payload
        },
        setOtherEmployeesListAct: (state, action: PayloadAction<any>) => {
            state.otherEmployeesListResp = action.payload
        },
        setAddEmployeeAct: (state, action: PayloadAction<any>) => {
            state.addEmployeeResp = action.payload
        },
        setUpdateEmployeeAct: (state, action: PayloadAction<any>) => {
            state.updateEmployeeResp = action.payload
        },
        setGetEmployeeByIdAct: (state, action: PayloadAction<any>) => {
            state.getEmployeeByIdResp = action.payload
        },
        setDownDocumentByIdAct: (state, action: PayloadAction<any>) => {
            state.downDocumentByIdResp = action.payload
        },
        setDeleteEmployeeAct: (state, action: PayloadAction<any>) => {
            state.deleteEmployeeResp = action.payload
        },

        setUploadEmployeeDocumentAct: (state, action: PayloadAction<any>) => {
            state.uploadEmployeeDocumentResp = action.payload
        },

        resetEmployeesByFilterAct: (state, action: PayloadAction<any>) => {
            state.getEmployeesByFilterResp = action.payload
        },
        setEmployeesByFilterAct: (state, action: PayloadAction<any>) => {
            state.getEmployeesByFilterResp = action.payload
        },
        setEmployeesNameByFilterAct: (state, action: PayloadAction<any>) => {
            state.getEmployeesNameByFilterResp = action.payload
        },
        setEmployeeDocumentListAct: (state, action: PayloadAction<any>) => {
            state.getEmployeeDocumentListResp = action.payload
        },
        setReporterListAct: (state, action: PayloadAction<any>) => {
            state.getReporterListResp = action.payload
        },
        setReportingClassDivisionListAct: (state, action: PayloadAction<any>) => {
            state.getReportingClassDivisonListResp = action.payload
        },
        setHodListAct: (state, action: PayloadAction<any>) => {
            state.getHodListResp = action.payload
        },
        setExportEmployeeDataAct: (state, action: PayloadAction<any>) => {
            state.exportEmployeeDataResp = action.payload
        },
        setOtherExportEmployeeDataAct: (state, action: PayloadAction<any>) => {
            state.exportOtherEmployeeDataResp = action.payload
        },
        setEmployeeMngmntErrorAct: (state, action: PayloadAction<any>) => {
            state.employeeManagementErrorResp = action.payload
        },

        setAllCompaniesListAct: (state, action: PayloadAction<any>) => {
            state.getAllCompaniesllListResp = action.payload
        },
        setCompanyDetailsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getCompanyDetailsListByIdResp = action.payload;
        },
        setSaveCompanyDetailsListAct: (state, action: PayloadAction<any>) => {
            state.saveCompanyDetailsListResp = action.payload;
        },
        setEditCompanyDetailsListAct: (state, action: PayloadAction<any>) => {
            state.editCompanyDetailsRequestResp = action.payload;
        },
        setDelCompanyDetailsListAct: (state, action: PayloadAction<any>) => {
            state.delCompanyDetailsRequestResp = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder.addCase('RESET_APP_STATE', (state) => {
            return initialState;
        });
        builder.addCase('RESET_EMPLOYEEMANGEMENT_STORE', (state) => {
            return initialState;
        });
    },
});

export const { setEmployeesStatsAct, setEmployeesListAct, setOtherEmployeesListAct, setAddEmployeeAct, setUpdateEmployeeAct,
    setGetEmployeeByIdAct, setDownDocumentByIdAct, setDeleteEmployeeAct, setUploadEmployeeDocumentAct,
    resetEmployeesByFilterAct, setEmployeesByFilterAct, setEmployeesNameByFilterAct, setEmployeeDocumentListAct, setReporterListAct,
    setReportingClassDivisionListAct, setHodListAct, setExportEmployeeDataAct,setOtherExportEmployeeDataAct,setAllCompaniesListAct,
    setCompanyDetailsListByIdAct, setEditCompanyDetailsListAct, setDelCompanyDetailsListAct,
    setSaveCompanyDetailsListAct, setEmployeeMngmntErrorAct
} = studentManagementSlice.actions;

export default studentManagementSlice.reducer;

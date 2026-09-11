import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IComplaintDepartmentReducerState } from "./complaintdepartmenttypes";


const initialState: IComplaintDepartmentReducerState = {
    getComplaintDepartmentListResp:undefined,
    getMasterComplaintDeptListResp:undefined,
    editComplaintDeptResp:undefined,
    addComplaintDeptResp:undefined,
    deleteComplaintDeptResp:undefined,
    saveMasterComplaintDeptResp:undefined,

    // error state

    complaintDepartmentErrResp : undefined,
}
export const complaintDepartment = createSlice({
    name: "complaintDepartment",
    initialState,
    reducers: {
        setComplaintDepartmentListAct: (state, action: PayloadAction<any>) => {
            state.getComplaintDepartmentListResp = action.payload;
        },
        setMasterComplaintDeptListAct: (state, action: PayloadAction<any>) => {
            state.getMasterComplaintDeptListResp = action.payload;
        },
        setEditComplaintDeptAct: (state, action: PayloadAction<any>) => {
            state.editComplaintDeptResp = action.payload;
        },
        setAddComplaintDeptAct: (state, action: PayloadAction<any>) => {
            state.addComplaintDeptResp = action.payload;
        },
        setDeleteComplaintDeptAct: (state, action: PayloadAction<any>) => {
            state.deleteComplaintDeptResp = action.payload;
        },
        setSaveMasterComplaintDeptAct: (state, action: PayloadAction<any>) => {
            state.saveMasterComplaintDeptResp = action.payload;
        },
        
        //error state

        setComplaintDepartmentErrorAct: (state, action: PayloadAction<any>) => {
            state.complaintDepartmentErrResp = action.payload;
        },
      
    }
})
export const {
    setComplaintDepartmentListAct,
    setMasterComplaintDeptListAct,
    setEditComplaintDeptAct,
    setAddComplaintDeptAct,
    setDeleteComplaintDeptAct,
    setSaveMasterComplaintDeptAct,

    //error state
    setComplaintDepartmentErrorAct,
    
    } = complaintDepartment.actions;
    
export default complaintDepartment.reducer;
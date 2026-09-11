import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IVehicleDetaileReducerState } from "./vehicledetailetypes";

const initialState: IVehicleDetaileReducerState = {
    vehicleDetaileListResp: undefined,
    vehicleDetaileByIdResp: undefined,
    updateVehicleDetailResp: undefined,
    addVehicleDetailResp: undefined,
    getVehicleManufactureListResp: undefined,
    getVehicleModelListResp: undefined,
    updateVehicleTypeDetailResp: undefined,
    delVehicleDetailResp: undefined,
    vehicleTypeResp: undefined,
    updateVehicleTypeResp: undefined,
    vehicleDetailErrorResp: undefined,
    getFuelTypeListResp:undefined,
    exportVehicleDetailListResp:undefined,
    getInsuranceCompanyListResp:undefined,
    getInsuranceTypesListResp:undefined,

    //vehicle-manufacture
    getVehicleManufactureDetailListResp:undefined,
    saveVehicleManufactureDetailListResp:undefined,
    saveVehicleModelManufactureDetailListResp:undefined,
    getVehicleManufactureDetailListByIdResp:undefined,
    getVehicleModelManufactureDetailListByIdResp:undefined,
}
export const vehicleDetailRequest = createSlice({
    name: "vehicleDetailRequest",
    initialState,
    reducers: {
        setVehicleDetailListAct: (state, action: PayloadAction<any>) => {
            state.vehicleDetaileListResp = action.payload;
        },
        setDelVehicleDetailAct: (state, action: PayloadAction<any>) => {
            state.delVehicleDetailResp = action.payload;
        },
        setUpdateVehicleDetailAct: (state, action: PayloadAction<any>) => {
            state.updateVehicleDetailResp = action.payload;
        },
        setVehicleDetailByIdAct: (state, action: PayloadAction<any>) => {
            state.vehicleDetaileByIdResp = action.payload;
        },
        resetVehicleDetailByIdAct: (state, action: PayloadAction<any>) => {
            state.vehicleDetaileByIdResp = action.payload;
        },
        setVehicleTypeAct: (state, action: PayloadAction<any>) => {
            state.vehicleTypeResp = action.payload;
        },
        setCreateVehicleDetailAct: (state, action: PayloadAction<any>) => {
            state.addVehicleDetailResp = action.payload;
        },
        setVehicleManufactureListAct: (state, action: PayloadAction<any>) => {
            state.getVehicleManufactureListResp = action.payload;
        },
        setVehicleModelListAct: (state, action: PayloadAction<any>) => {
            state.getVehicleModelListResp = action.payload;
        },
        resetVehicleModelListAct: (state, action: PayloadAction<any>) => {
            state.getVehicleModelListResp = action.payload;
        },
        setUpdateTypeVehicleDetailAct: (state, action: PayloadAction<any>) => {
            state.updateVehicleTypeDetailResp = action.payload;
        },
        setFuelTypeListAct: (state, action: PayloadAction<any>) => {
            state.getFuelTypeListResp = action.payload;
        },
        setVehicleDetailErrorAct: (state, action: PayloadAction<any>) => {
            state.vehicleDetailErrorResp = action.payload;
        },
        setExportVehicleDetailListAct: (state, action: PayloadAction<any>) => {
            state.exportVehicleDetailListResp = action.payload;
        },
        setInsuranceCompanyListAct: (state, action: PayloadAction<any>) => {
            state.getInsuranceCompanyListResp = action.payload;
        },
        setInsuranceTypesListAct: (state, action: PayloadAction<any>) => {
            state.getInsuranceTypesListResp = action.payload;
        },

        //vehicle-manufacture
        setVehicleManufactureDetailsAct: (state, action: PayloadAction<any>) => {
            state.getVehicleManufactureDetailListResp = action.payload;
        },
        setSaveVehicleManufactureDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveVehicleManufactureDetailListResp = action.payload;
        },
        setSaveVehicleModelManufactureDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveVehicleModelManufactureDetailListResp = action.payload;
        },
        setVehicleManufactureDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getVehicleManufactureDetailListByIdResp = action.payload;
        },
        setVehicleModelManufactureDetailsByIdAct: (state, action: PayloadAction<any>) => {
            state.getVehicleModelManufactureDetailListByIdResp = action.payload;
        },
    }
})
export const { setVehicleDetailListAct,
    setDelVehicleDetailAct,
    setUpdateVehicleDetailAct,
    setVehicleDetailByIdAct,
    setVehicleTypeAct,
    setUpdateTypeVehicleDetailAct,
    setCreateVehicleDetailAct,
    setVehicleManufactureListAct,
    setVehicleModelListAct,
    resetVehicleModelListAct,
    setFuelTypeListAct,
    resetVehicleDetailByIdAct,
    setVehicleDetailErrorAct, setExportVehicleDetailListAct,
    setInsuranceCompanyListAct,setInsuranceTypesListAct, 
    //vehicle-manufacture
    setVehicleManufactureDetailsAct,
    setSaveVehicleManufactureDetailsAct,
    setSaveVehicleModelManufactureDetailsAct,
    setVehicleManufactureDetailsByIdAct,
    setVehicleModelManufactureDetailsByIdAct,

} = vehicleDetailRequest.actions;
export default vehicleDetailRequest.reducer;
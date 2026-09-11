import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IHostelSettingsReducerState } from "./hostelsettingstypes";

const initialState: IHostelSettingsReducerState = {

    // Hostel Facility Eligibility

    getHostelFacilityEligibilityResp: undefined,
    editHostelFacilityEligibilityResp: undefined,

    // Hostel Fee Structure

    getHostelFeeStructureResp : undefined,
    getHostelFeeTermsResp : undefined,
    saveHostelFeeStructureResp : undefined,
    getHostelFeeStructureByIdResp : undefined,
    editHostelFeeStructureResp: undefined,
    deleteHostelFeeStructureResp: undefined,

    getHostelFeeNameResp:undefined,
    getHostelRoomTypesResp:undefined,

    //hostel details
    getHostelDetailsResp:undefined,
    saveHostelDetailsResp:undefined,
    delHostelRequestResp:undefined,
    getHostelDetailsListByIdResp:undefined,
    editHostelDetailRequestResp:undefined,

    //hostel bulding
    getHostelBuildingResp:undefined,
    saveHostelBuildingResp:undefined,
    delHostelBuildingRequestResp:undefined,
    getHostelBuildingListByIdResp:undefined,
    editHostelBuildingRequestResp:undefined,

    //hostel floor
    getHostelFloorResp:undefined,
    saveHostelFloorResp:undefined,
    delHostelFloorRequestResp:undefined,
    getHostelFloorListByIdResp:undefined,
    editHostelFloorRequestResp:undefined,

    //hostel room-type
    getHostelRoomTypeResp:undefined,
    saveHostelRoomTypeResp:undefined,
    delHostelRoomTypeRequestResp:undefined,
    getHostelRoomTypeListByIdResp:undefined,
    editHostelRoomTypeRequestResp:undefined,

    //hostel room-details
    getHostelRoomDetailsResp:undefined,
    saveHostelRoomDetailsResp:undefined,
    delHostelRoomDetailsRequestResp:undefined,
    getHostelRoomDetailsListByIdResp:undefined,
    editHostelRoomDetailsRequestResp:undefined,

    //fee particulars
    getHostelFeeParticularsResp:undefined,
    saveHostelFeeNameParticularsResp:undefined,
    delHostelFeeNameParticularsRequestResp:undefined,
    getHostelFeeNameParticularsListByIdResp:undefined,
    editHostelFeeNameParticularsRequestResp:undefined,

    // error state

    hostelSettingsErrResp : undefined,
}
export const hostelSettings = createSlice({
    name: "hostelSettings",
    initialState,
    reducers: {

        // Hostel Facility Eligibility

        setHostelFacilityEligibilityAct: (state, action: PayloadAction<any>) => {
            state.getHostelFacilityEligibilityResp = action.payload;
        },
        setEditHostelFacilityEligibilityAct: (state, action: PayloadAction<any>) => {
            state.editHostelFacilityEligibilityResp = action.payload;
        },

        // Hostel Fee Strcture

        setHostelFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeStructureResp = action.payload;
        },
        setHostelFeeTermsAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeTermsResp = action.payload;
        },
        setSaveHostelFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.saveHostelFeeStructureResp = action.payload;
        },
        setHostelFeeStructureByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeStructureByIdResp = action.payload;
        },
        resetHostelFeeStructureByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeStructureByIdResp = action.payload;
        },
        setEditHostelFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.editHostelFeeStructureResp = action.payload;
        },
        setDeleteHostelFeeStructureAct: (state, action: PayloadAction<any>) => {
            state.deleteHostelFeeStructureResp = action.payload;
        },

        setHostelFeeNameAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeNameResp = action.payload;
        },
        setHostelRoomTypesAct: (state, action: PayloadAction<any>) => {
            state.getHostelRoomTypesResp = action.payload;
        },

        //hostel details
        setHostelDetailsAct: (state, action: PayloadAction<any>) => {
            state.getHostelDetailsResp = action.payload;
        },
        setSaveHostelDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveHostelDetailsResp = action.payload;
        },
        setHostelDetailsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelDetailsListByIdResp = action.payload;
        },
        setEditHostelDetailsListAct: (state, action: PayloadAction<any>) => {
            state.editHostelDetailRequestResp = action.payload;
        },
        setDelHostelDetailsListAct: (state, action: PayloadAction<any>) => {
            state.delHostelRequestResp = action.payload;
        },

        //hostel building
        setHostelBuildingAct: (state, action: PayloadAction<any>) => {
            state.getHostelBuildingResp = action.payload;
        },
        setSaveHostelBuildingAct: (state, action: PayloadAction<any>) => {
            state.saveHostelBuildingResp = action.payload;
        },
        setHostelBuildingListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelBuildingListByIdResp = action.payload;
        },
        setEditHostelBuildingListAct: (state, action: PayloadAction<any>) => {
            state.editHostelBuildingRequestResp = action.payload;
        },
        setDelHostelBuildingListAct: (state, action: PayloadAction<any>) => {
            state.delHostelBuildingRequestResp = action.payload;
        },

        //hostel floor
        setHostelFloorAct: (state, action: PayloadAction<any>) => {
            state.getHostelFloorResp = action.payload;
        },
        setSaveHostelFloorAct: (state, action: PayloadAction<any>) => {
            state.saveHostelFloorResp = action.payload;
        },
        setHostelFloorListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelFloorListByIdResp = action.payload;
        },
        setEditHostelFloorListAct: (state, action: PayloadAction<any>) => {
            state.editHostelFloorRequestResp = action.payload;
        },
        setDelHostelFloorListAct: (state, action: PayloadAction<any>) => {
            state.delHostelFloorRequestResp = action.payload;
        },

        //hostel room type
        setHostelRoomTypeAct: (state, action: PayloadAction<any>) => {
            state.getHostelRoomTypeResp = action.payload;
        },
        setSaveHostelRoomTypeAct: (state, action: PayloadAction<any>) => {
            state.saveHostelRoomTypeResp = action.payload;
        },
        setHostelRoomTypeListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelRoomTypeListByIdResp = action.payload;
        },
        setEditHostelRoomTypeListAct: (state, action: PayloadAction<any>) => {
            state.editHostelRoomTypeRequestResp = action.payload;
        },
        setDelHostelRoomTypeListAct: (state, action: PayloadAction<any>) => {
            state.delHostelRoomTypeRequestResp = action.payload;
        },

        //hostel room-details
        setHostelRoomDetailsAct: (state, action: PayloadAction<any>) => {
            state.getHostelRoomDetailsResp = action.payload;
        },
        setSaveHostelRoomDetailsAct: (state, action: PayloadAction<any>) => {
            state.saveHostelRoomDetailsResp = action.payload;
        },
        setHostelRoomDetailsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelRoomDetailsListByIdResp = action.payload;
        },
        setEditHostelRoomDetailsListAct: (state, action: PayloadAction<any>) => {
            state.editHostelRoomDetailsRequestResp = action.payload;
        },
        setDelHostelRoomDetailsListAct: (state, action: PayloadAction<any>) => {
            state.delHostelRoomDetailsRequestResp = action.payload;
        },

        //fee particulars
        setHostelFeeParticularsAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeParticularsResp = action.payload;
        },
        setSaveHostelFeeNameParticularsAct: (state, action: PayloadAction<any>) => {
            state.saveHostelFeeNameParticularsResp = action.payload;
        },
        setHostelFeeNameParticularsListByIdAct: (state, action: PayloadAction<any>) => {
            state.getHostelFeeNameParticularsListByIdResp = action.payload;
        },
        setEditHostelFeeNameParticularsListAct: (state, action: PayloadAction<any>) => {
            state.editHostelFeeNameParticularsRequestResp = action.payload;
        },
        setDelHostelFeeNameParticularsListAct: (state, action: PayloadAction<any>) => {
            state.delHostelFeeNameParticularsRequestResp = action.payload;
        },
        //reset
        
        resetHostelDetailsListAct: (state, action: PayloadAction<any>) => {
            state.getHostelDetailsResp = action.payload;
        },
        resetHostelRoomDetailsListAct: (state, action: PayloadAction<any>) => {
            state.getHostelRoomDetailsResp = action.payload;
        },
        resetHostelBuildingsListAct: (state, action: PayloadAction<any>) => {
            state.getHostelBuildingResp = action.payload;
        },
        resetHostelFloorListAct: (state, action: PayloadAction<any>) => {
            state.getHostelFloorResp = action.payload;
        },
        resetHostelRoomTypeListAct: (state, action: PayloadAction<any>) => {
            state.getHostelRoomTypeResp = action.payload;
        },
        //error state

        setHostelSettingsErrAct: (state, action: PayloadAction<any>) => {
            state.hostelSettingsErrResp = action.payload;
        },
      
    }
})
export const {

    // Hostel Facility Eligibility

    setHostelFacilityEligibilityAct,
    setEditHostelFacilityEligibilityAct,

    // Hostel Fee Structure

    setHostelFeeStructureAct,
    setHostelFeeTermsAct,
    setSaveHostelFeeStructureAct,
    setHostelFeeStructureByIdAct,
    resetHostelFeeStructureByIdAct,
    setEditHostelFeeStructureAct,
    setDeleteHostelFeeStructureAct,

    setHostelFeeNameAct,
    setHostelRoomTypesAct,

    //hostel details
    setHostelDetailsAct,
    setSaveHostelDetailsAct,
    setHostelDetailsListByIdAct,
    setEditHostelDetailsListAct,
    setDelHostelDetailsListAct,

    //hostel building
    setHostelBuildingAct,
    setSaveHostelBuildingAct,
    setHostelBuildingListByIdAct,
    setEditHostelBuildingListAct,
    setDelHostelBuildingListAct,
    
    //hostel floor
    setHostelFloorAct,
    setSaveHostelFloorAct,
    setHostelFloorListByIdAct,
    setEditHostelFloorListAct,
    setDelHostelFloorListAct,
    
    //hostel room-type
    setHostelRoomTypeAct,
    setSaveHostelRoomTypeAct,
    setHostelRoomTypeListByIdAct,
    setEditHostelRoomTypeListAct,
    setDelHostelRoomTypeListAct,
    
    //hostel room-details
    setHostelRoomDetailsAct,
    setSaveHostelRoomDetailsAct,
    setHostelRoomDetailsListByIdAct,
    setEditHostelRoomDetailsListAct,
    setDelHostelRoomDetailsListAct,
    
    //Fee Particulars
    setHostelFeeParticularsAct,
    setSaveHostelFeeNameParticularsAct,
    setHostelFeeNameParticularsListByIdAct,
    setEditHostelFeeNameParticularsListAct,
    setDelHostelFeeNameParticularsListAct,
    
    //reset
    resetHostelDetailsListAct,
    resetHostelRoomDetailsListAct,
    resetHostelBuildingsListAct,
    resetHostelRoomTypeListAct,
    resetHostelFloorListAct,
    //error state

    setHostelSettingsErrAct,

    } = hostelSettings.actions;
export default hostelSettings.reducer;
export interface IHostelSettingsReducerState {
    
    // Hostel Facility Eligibility
    
    getHostelFacilityEligibilityResp:any;
    editHostelFacilityEligibilityResp : any;

    // Hostel Fee Structure

    getHostelFeeStructureResp :any;
    getHostelFeeTermsResp:any;
    saveHostelFeeStructureResp : any;
    editHostelFeeStructureResp : any;
    getHostelFeeStructureByIdResp : any;
    deleteHostelFeeStructureResp:any;

    getHostelFeeNameResp : any;
    getHostelRoomTypesResp : any ;

    //hostel details
    getHostelDetailsResp : any;
    saveHostelDetailsResp : any;
    delHostelRequestResp : any;
    getHostelDetailsListByIdResp : any;
    editHostelDetailRequestResp : any;

    //hostel building
    getHostelBuildingResp : any;
    saveHostelBuildingResp : any;
    delHostelBuildingRequestResp : any;
    getHostelBuildingListByIdResp : any;
    editHostelBuildingRequestResp : any;

    //hostel floor
    getHostelFloorResp : any;
    saveHostelFloorResp : any;
    delHostelFloorRequestResp : any;
    getHostelFloorListByIdResp : any;
    editHostelFloorRequestResp : any;
   
    //hostel room-type
    getHostelRoomTypeResp : any;
    saveHostelRoomTypeResp : any;
    delHostelRoomTypeRequestResp : any;
    getHostelRoomTypeListByIdResp : any;
    editHostelRoomTypeRequestResp : any;

    //hostel building
    getHostelRoomDetailsResp : any;
    saveHostelRoomDetailsResp : any;
    delHostelRoomDetailsRequestResp : any;
    getHostelRoomDetailsListByIdResp : any;
    editHostelRoomDetailsRequestResp : any;

    //fee particulars
    getHostelFeeParticularsResp : any;
    saveHostelFeeNameParticularsResp : any;
    delHostelFeeNameParticularsRequestResp : any;
    getHostelFeeNameParticularsListByIdResp : any;
    editHostelFeeNameParticularsRequestResp : any;
    //error state
    
    hostelSettingsErrResp:any;
}
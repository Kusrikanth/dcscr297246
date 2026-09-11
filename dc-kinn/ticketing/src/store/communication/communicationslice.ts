import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICommunicationReducerState } from "./communicationtypes";

const initialState: ICommunicationReducerState = {
    manageNotificationResp: undefined,
    composeMessageResp: undefined,
    curriculumClassSectResp: undefined,
    communicationErrorResp: undefined,
    exportNotificationItemByIdResp: undefined,

    //setting template
    templateListResp: undefined,
    saveTemplateResp: undefined,
    deleteTemplateResp: undefined,
    updateTemplateResp: undefined,

    //feeds
    getFeedsListResp: undefined,
    saveFeedsResp: undefined,
    deleteFeedsResp: undefined,
    getFeedsByIdResp: undefined,
    updateFeedsResp: undefined,
    updateFeedsFilesResp: undefined,
    //events
    eventListResp: undefined,
    saveEventResp: undefined,
    deleteEventResp: undefined,
    getEventByIdResp: undefined,
    updateEventResp: undefined,
    updateFilesResp: undefined,

    //notification history
    getSmsTemplateListResp: undefined,
    getNotificationHistoryResp: undefined,
    exportNotificationHistoryResp: undefined,
    // gallery management
    getGalleryManagementListResp:undefined,
    getGalleryManagementItemByIdResp:undefined,
    saveGalleryManagementItemResp:undefined,
    deleteGalleryManagementItemResp:undefined,
    getGalleryCategoriesResp:undefined,
    updateGalleryManagementItemResp:undefined,

    //whatsapp notification
    whatsappTemplatesResp: undefined,
    sendWhatsappMessageResp: undefined,
    uploadWhatsappMediaResp: undefined,
    getWhatsappCampaignStatsResp: undefined,
    getCampaginOverviewDetailsResp: undefined,
    getCampaginRecipientsDetailsResp: undefined,
    whatsAppNotificationValidateStudentsResp: undefined,
    // whatsapp settings
    getWhatsappSettingsTemplatesResp: undefined,
    updateWhatsappSettingsTemplateResp: undefined,
    getNotificationCampaignRecipientListResp: undefined,
}

export const communicationSlice = createSlice({
    name: "communication",
    initialState,
    reducers: {
        setManageNotificationAct: (state, action: PayloadAction<any>) => {
            state.manageNotificationResp = action.payload;
        },
        setComposeMessageAct: (state, action: PayloadAction<any>) => {
            state.composeMessageResp = action.payload;
        },
        setCurriculumClassSectAct: (state, action: PayloadAction<any>) => {
            state.curriculumClassSectResp = action.payload;
        },
        setCommunicationErrorAct: (state, action: PayloadAction<any>) => {
            state.communicationErrorResp = action.payload;
        },
        setExportNotificationItemByIdAct: (state, action: PayloadAction<any>) => {
            state.exportNotificationItemByIdResp = action.payload;
        },

        //setting template
        setTemplateListAct: (state, action: PayloadAction<any>) => {
            state.templateListResp = action.payload
        },
        setSaveTemplateAct: (state, action: PayloadAction<any>) => {
            state.saveTemplateResp = action.payload
        },
        setDeleteTemplateAct: (state, action: PayloadAction<any>) => {
            state.deleteTemplateResp = action.payload
        },
        setUpdateTemplateAct: (state, action: PayloadAction<any>) => {
            state.updateTemplateResp = action.payload
        },

        //feeds
        setFeedsListAct: (state, action: PayloadAction<any>) => {
            state.getFeedsListResp = action.payload
        },
        setSaveFeedsAct: (state, action: PayloadAction<any>) => {
            state.saveFeedsResp = action.payload
        },
        setdeleteFeedsAct: (state, action: PayloadAction<any>) => {
            state.deleteFeedsResp = action.payload
        },
        setFeedsByIdAct: (state, action: PayloadAction<any>) => {
            state.getFeedsByIdResp = action.payload
        },
        setUpdateFeedsAct: (state, action: PayloadAction<any>) => {
            state.updateFeedsResp = action.payload
        },
        setUpdateFeedsFilesAct: (state, action: PayloadAction<any>) => {
            state.updateFeedsFilesResp = action.payload
        },

        //evnets
        setEventListAct: (state, action: PayloadAction<any>) => {
            state.eventListResp = action.payload
        },

        setSaveEventAct: (state, action: PayloadAction<any>) => {
            state.saveEventResp = action.payload
        },
        setDeleteEventAct: (state, action: PayloadAction<any>) => {
            state.deleteEventResp = action.payload
        },
        setEventByIdAct: (state, action: PayloadAction<any>) => {
            state.getEventByIdResp = action.payload
        },
        setUpdateEventAct: (state, action: PayloadAction<any>) => {
            state.updateEventResp = action.payload
        },
        setUpdateFilesAct: (state, action: PayloadAction<any>) => {
            state.updateFilesResp = action.payload
        },

        //notification history
        setSmsTemplateListAct: (state, action: PayloadAction<any>) => {
            state.getSmsTemplateListResp = action.payload
        },
        setNotificationHistoryAct: (state, action: PayloadAction<any>) => {
            state.getNotificationHistoryResp = action.payload
        },
        setExportNotificationHistoryAct: (state, action: PayloadAction<any>) => {
            state.exportNotificationHistoryResp = action.payload
        },

        // gallery management
        setGalleryManagementListAct:(state,action:PayloadAction<any>)=>{
            state.getGalleryManagementListResp = action.payload
        },
        setGalleryManagementItemByIdAct:(state,action:PayloadAction<any>)=>{
            state.getGalleryManagementItemByIdResp = action.payload
        },
        setSaveGalleryManagementItemAct:(state,action:PayloadAction<any>)=>{
            state.saveGalleryManagementItemResp = action.payload
        },
        setDeleteGalleryManagementItemAct:(state,action:PayloadAction<any>)=>{
            state.deleteGalleryManagementItemResp = action.payload
        },
        setGalleryCategoriesAct:(state,action:PayloadAction<any>)=>{
            state.getGalleryCategoriesResp = action.payload
        },
        setUpdateGalleryManagementItemAct:(state,action:PayloadAction<any>)=>{
            state.updateGalleryManagementItemResp = action.payload
        },
        //whatsapp notification
        setWhatsappTemplatesAct: (state, action: PayloadAction<any>) => {
            state.whatsappTemplatesResp = action.payload
        },

        setSendWhatsappMessageAct: (state, action: PayloadAction<any>) => {
            state.sendWhatsappMessageResp = action.payload
        },

        setUploadWhatsappMediaAct: (state, action: PayloadAction<any>) => {
            state.uploadWhatsappMediaResp = action.payload
        },
        setGetWhatsappCampaignStatsAct: (state, action: PayloadAction<any>) => {
            state.getWhatsappCampaignStatsResp = action.payload
        },
        setGetCampaginOverviewDetailsAct: (state, action: PayloadAction<any>) => {
            state.getCampaginOverviewDetailsResp = action.payload
        },
        setGetCampaginRecipientsDetailsAct: (state, action: PayloadAction<any>) => {
            state.getCampaginRecipientsDetailsResp = action.payload
        },
        
        setWhatsAppNotificationValidateStudentsAct: (state, action: PayloadAction<any>) => {
            state.whatsAppNotificationValidateStudentsResp = action.payload;
        },
        resetWhatsAppNotificationValidateStudentsAct: (state, action: PayloadAction<any>) => {
            state.whatsAppNotificationValidateStudentsResp = action.payload;
        },
        // whatsapp settings
        setGetWhatsappSettingsTemplatesAct: (state, action: PayloadAction<any>) => {
            state.getWhatsappSettingsTemplatesResp = action.payload;
        },
        setUpdateWhatsappSettingsTemplateAct: (state, action: PayloadAction<any>) => {
            state.updateWhatsappSettingsTemplateResp = action.payload;
        },
        setNotificationCampaignRecipientListAct:(state,action:PayloadAction<any>)=>{
            state.getNotificationCampaignRecipientListResp = action.payload
        },
        resetNotificationCampaignRecipientListAct:(state,action:PayloadAction<any>)=>{
            state.getNotificationCampaignRecipientListResp = action.payload
        },
    }
})

export const {
    setManageNotificationAct,
    setComposeMessageAct, setCurriculumClassSectAct,
    setCommunicationErrorAct,
    setExportNotificationItemByIdAct,
    setTemplateListAct,
    setSaveTemplateAct,
    setDeleteTemplateAct,
    setUpdateTemplateAct,
    setFeedsListAct,
    setSaveFeedsAct,
    setdeleteFeedsAct,
    setFeedsByIdAct,
    setUpdateFeedsAct,
    setUpdateFeedsFilesAct,
    setEventListAct,
    setSaveEventAct,
    setDeleteEventAct,
    setEventByIdAct,
    setUpdateEventAct,
    setUpdateFilesAct,
    setSmsTemplateListAct,
    setNotificationHistoryAct,
    setExportNotificationHistoryAct,
    setGalleryManagementListAct,
    setGalleryManagementItemByIdAct,
    setSaveGalleryManagementItemAct,
    setDeleteGalleryManagementItemAct,
    setWhatsappTemplatesAct,
    setSendWhatsappMessageAct,
    setUploadWhatsappMediaAct,
    setGetWhatsappCampaignStatsAct,
    setGetCampaginOverviewDetailsAct,
    setGetCampaginRecipientsDetailsAct,
    setWhatsAppNotificationValidateStudentsAct,
    resetWhatsAppNotificationValidateStudentsAct,
    setGetWhatsappSettingsTemplatesAct,
    setUpdateWhatsappSettingsTemplateAct,
    setGalleryCategoriesAct,
    setUpdateGalleryManagementItemAct,
    setNotificationCampaignRecipientListAct,
    resetNotificationCampaignRecipientListAct,
} = communicationSlice.actions;

export default communicationSlice.reducer;
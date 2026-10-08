export interface ICommunicationReducerState {
    manageNotificationResp: any;
    composeMessageResp: any;
    updateNotificationResp: any;
    deleteNotificationResp: any;
    curriculumClassSectResp: any;
    communicationErrorResp: any;
    exportNotificationItemByIdResp:any;

    //settings template
    templateListResp: any;
    saveTemplateResp: any;
    deleteTemplateResp: any;
    updateTemplateResp: any;

    //feeds
    getFeedsListResp: any;
    saveFeedsResp: any;
    deleteFeedsResp: any;
    getFeedsByIdResp: any;
    updateFeedsResp: any;
    updateFeedsFilesResp: any;
    //events
    eventListResp: any;
    saveEventResp: any;
    deleteEventResp:any;
    getEventByIdResp:any;
    updateEventResp:any;
    updateFilesResp:any;

    //notification history
    getSmsTemplateListResp: any;
    getNotificationHistoryResp: any;
    exportNotificationHistoryResp: any

    // gallery management
    getGalleryManagementListResp:any;
    getGalleryManagementItemByIdResp:any
    saveGalleryManagementItemResp:any;
    deleteGalleryManagementItemResp:any;
    getGalleryCategoriesResp:any;
    updateGalleryManagementItemResp:any;
    //whatsapp notification
    whatsappTemplatesResp: any;
    sendWhatsappMessageResp: any;
    uploadWhatsappMediaResp: any;
    getWhatsappCampaignStatsResp: any;
    getCampaginOverviewDetailsResp: any;
    getCampaginRecipientsDetailsResp: any;
    whatsAppNotificationValidateStudentsResp: any;

    // whatsapp settings
    getWhatsappSettingsTemplatesResp: any;
    updateWhatsappSettingsTemplateResp: any;
    
    getNotificationCampaignRecipientListResp: any;
}
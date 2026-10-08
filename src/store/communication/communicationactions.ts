import { createAction } from "@reduxjs/toolkit";
import { INewActionType } from "../types";
import { CommunicationConstants } from "./communicationconstants";
export { setFeedsByIdAct } from "./communicationslice";

export { setEventByIdAct, resetWhatsAppNotificationValidateStudentsAct, resetNotificationCampaignRecipientListAct } from "./communicationslice";

// export { setCbseVerificationsAct } from "./communicationslice";
export const getManageNotificationAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_MANAGE_NOTIFICATION_REQUEST);
export const composeMessageAct = createAction<INewActionType | undefined>(CommunicationConstants.ADD_COMPOSE_MESSAGE_REQUEST);
export const updateNotificationAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_NOTIFICATION_REQUEST);
export const deleteNotificationAct = createAction<INewActionType | undefined>(CommunicationConstants.DELETE_NOTIFICATION_REQUEST);
export const getCurriculumClassSectAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_CURRICULUM_CLASS_SECT_REQUEST);
export const exportNotificationItemByIdAct = createAction<INewActionType | undefined>(CommunicationConstants.EXPORT_NOTIFICATION_ITEM_BY_ID);


//setting template
export const getTemplateListAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_TEMPLATE_LIST);
export const saveTemplateAct = createAction<INewActionType | undefined>(CommunicationConstants.SAVE_TEMPLATE);
export const deleteTemplateAct = createAction<INewActionType | undefined>(CommunicationConstants.DELETE_TEMPLATE);
export const updateTemplateAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_TEMPLATE);

//feeds
export const getFeedsListAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_FEEDS_LIST);
export const saveFeedsAct = createAction<INewActionType | undefined>(CommunicationConstants.SAVE_FEEDS);
export const deleteFeedsAct = createAction<INewActionType | undefined>(CommunicationConstants.DELETE_FEEDS);
export const getFeedsByIdAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_FEEDS_BY_ID);
export const updateFeedsAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_FEEDS);
export const updateFeedsFileAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_FEEDS_FILES);
//events

export const getEventListAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_EVENTS_LIST);
export const saveEventAct = createAction<INewActionType | undefined>(CommunicationConstants.SAVE_EVENT);
export const deleteEventAct = createAction<INewActionType | undefined>(CommunicationConstants.DELETE_EVENT_LIST);
export const getEventByIdAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_EVENT_BY_ID);
export const updateEventAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_EVENT_REQUEST);
export const updateFilesAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_FILES_REQUEST);

//notification history
export const getSmsTemplateListAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_SMS_TEMPLATE_LIST);
export const getNotificationHistoryAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_NOTIFICATION_HISTORY);
export const exportNotificationHistoryAct = createAction<INewActionType | undefined>(CommunicationConstants.EXPORT_NOTIFICATION_HISTORY);

// gallery management
export const getGalleryManagementListAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_GALLERY_MANAGEMENT_LIST)
export const getGalleryManagementItemByIdAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_GALLERY_MANAGEMENT_ITEM_BY_ID)
export const saveGalleryManagementItemAct = createAction<INewActionType | undefined>(CommunicationConstants.SAVE_GALLERY_MANAGEMENT_ITEM)
export const deleteGalleryManagementItemAct = createAction<INewActionType | undefined>(CommunicationConstants.DELETE_GALLERY_MANAGEMENT_ITEM)
export const getGalleryCategoriesAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_GALLERY_CATEGORIES)
export const updateGalleryManagementItemAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_GALLERY_MANAGEMENT_ITEM)
//whatsapp notification
export const getWhatsappTemplatesAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_WHATSAPP_TEMPLATES);
export const sendWhatsappMessageAct = createAction<INewActionType | undefined>(CommunicationConstants.SEND_WHATSAPP_MESSAGE);
export const uploadWhatsappMediaAct = createAction<INewActionType | undefined>(CommunicationConstants.UPLOAD_WHATSAPP_MEDIA);
export const getWhatsappCampaignStatsAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_WHATSAPP_CAMPAIGN_STATS);
export const getCampaginOverviewDetailsAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_CAMPAGIN_OVERVIEW_DETAILS);
export const getCampaginRecipientsDetailsAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_CAMPAGIN_RECIPIENTS_DETAILS);
export const whatsAppNotifcationValidateStudentsAct = createAction<INewActionType | undefined>(CommunicationConstants.WHATSAPP_NOTIFICATION_VALIDATE_STUDENTS);
// whatsapp settings
export const getWhatsappSettingsTemplatesAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_WHATSAPP_SETTINGS_TEMPLATES);
export const updateWhatsappSettingsTemplateAct = createAction<INewActionType | undefined>(CommunicationConstants.UPDATE_WHATSAPP_SETTINGS_TEMPLATE);

export const getNotificationCampaignRecipientListAct = createAction<INewActionType | undefined>(CommunicationConstants.GET_NOTIFCATION_CAMPAIGN_RECIPIENT_LIST);
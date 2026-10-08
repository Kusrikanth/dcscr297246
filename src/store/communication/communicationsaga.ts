import { call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../types";
import { getData, deleteData, postData, putData } from "../../api/apiactions";
import {
    setManageNotificationAct,
    setComposeMessageAct, setCurriculumClassSectAct,
    setCommunicationErrorAct,
    setUpdateNotificationAct,
    setDeleteNotificationAct,
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
    setGetWhatsappSettingsTemplatesAct,
    setUpdateWhatsappSettingsTemplateAct,
    setGalleryCategoriesAct,
    setUpdateGalleryManagementItemAct,
    setNotificationCampaignRecipientListAct,
    setExportNotificationItemByIdAct
} from "./communicationslice";
import { CommunicationConstants } from "./communicationconstants";

function* getManageNotificationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setManageNotificationAct(response.data));
    }
}
function* exportNotificationItemByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setExportNotificationItemByIdAct(response.data));
    }
}

function* composeMessageGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setComposeMessageAct({ statusCode: response.statusCode }));
    }
}

function* updateNotificationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateNotificationAct({ statusCode: response.statusCode }));
    }
}

function* deleteNotificationGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setDeleteNotificationAct({ statusCode: response.statusCode }));
    }
}

function* getCurriculumClassSectGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);

    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setCurriculumClassSectAct(response.data));
    }
}

//setting template
function* getTemplateListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setTemplateListAct(response.data));
    }
}

function* saveTemplateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setSaveTemplateAct({ statusCode: response.statusCode }));
    }
}

function* deleteTemplateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setDeleteTemplateAct({ statusCode: response.statusCode }));
    }
}

function* editTemplateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateTemplateAct({ statusCode: response.statusCode }));
    }
}

//feeds

function* getFeedsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setFeedsListAct(response.data));
    }
}

function* saveFeedsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setSaveFeedsAct({ statusCode: response.statusCode }));
    }
}
function* deleteFeedsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setdeleteFeedsAct({ statusCode: response.statusCode }));
    }
}

function* getFeedsByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setFeedsByIdAct(response.data));
    }
}

function* setUpdateFeedsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateFeedsAct({ statusCode: response.statusCode }));
    }
}

function* updateFeedsFilesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateFeedsFilesAct({ statusCode: response.statusCode }));
    }
}


//events

function* getEventListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setEventListAct(response.data));
    }
}

function* saveEventGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setSaveEventAct({ statusCode: response.status }));
    }
}
function* deleteEventGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setDeleteEventAct({ statusCode: response.status }));
    }
}

function* getEventByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setEventByIdAct(response.data));
    }
}

function* updateEventRespGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateEventAct({ statusCode: response.status }));
    }
}
function* updateFilesRespGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateFilesAct({ statusCode: response.status }));
    }
}

// notification history
function* getSmsTemplateListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setSmsTemplateListAct(response.data));
    }
}
function* getNotificationHistoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setNotificationHistoryAct(response.data));
    }
}
function* exportNotificationHistoryGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setExportNotificationHistoryAct(response.data));
    }
}
// gallery management
function* getGalleryManagementListGen(action:ICreatedActionType):any{
    const {payload} = action;
    const response = yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error){
        yield put(setCommunicationErrorAct(response.error));
    }
    else {
        yield put(setGalleryManagementListAct(response.data))
    }
}
function* getGalleryManagementItemByIdGen(action:ICreatedActionType):any{
    const {payload} = action;
    const response = yield call(getData,payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error){
        yield put(setCommunicationErrorAct(response.error));
    }else {
        yield put(setGalleryManagementItemByIdAct(response.data))
    }
}

function* saveGalleryManagementItemGen(action:ICreatedActionType):any{
    const {payload} = action;
    const response = yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig);
    if(response && response.error){
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setSaveGalleryManagementItemAct({statusCode: response.statusCode}))
    } 
}
function* deleteGalleryManagementItemGen(action:ICreatedActionType):any{
    const {payload} = action;
    const response = yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig);
    if(response && response.error){
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setDeleteGalleryManagementItemAct({statusCode: response.statusCode}))
    } 
}

//whatsapp notification 
function* getWhatsappTemplatesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setWhatsappTemplatesAct(response.data));
    }
}

function* sendWhatsappMessageActGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setSendWhatsappMessageAct({ statusCode: response.statusCode }));
    }
}


function* uploadWhatsappMediaGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUploadWhatsappMediaAct(response.data));
    }
}

function* getWhatsappCampaignStatsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setGetWhatsappCampaignStatsAct(response.data));
    }
}
function* getCampaginOverviewDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    }  else {
        yield put(setGetCampaginOverviewDetailsAct(response.data));
    }
}
function* getCampaginRecipientsDetailsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    }  else {
        yield put(setGetCampaginRecipientsDetailsAct(response.data));
    }
}
function* whatsAppNotifcationValidateStudentsGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setWhatsAppNotificationValidateStudentsAct({
            statusCode: response.status,
            data: response.data
        }));
    }
}

function* getWhatsappSettingsTemplatesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setGetWhatsappSettingsTemplatesAct(response.data));
    }
}

function* updateWhatsappSettingsTemplateGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateWhatsappSettingsTemplateAct({ statusCode: response.status }));
    }
}
function* getGalleryCategoriesGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setGalleryCategoriesAct(response.data));
    }
}
function* updateGalleryManagementItemGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setUpdateGalleryManagementItemAct({ statusCode: response.status }));
    }
}

function* getNotificationCampaignRecipientListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig);
    if (response && response.error) {
        yield put(setCommunicationErrorAct(response.error));
    } else {
        yield put(setNotificationCampaignRecipientListAct(response.data));
    }
}

export default function* communicationSaga() {
    yield takeLatest(CommunicationConstants.GET_MANAGE_NOTIFICATION_REQUEST, getManageNotificationGen);
    yield takeLatest(CommunicationConstants.ADD_COMPOSE_MESSAGE_REQUEST, composeMessageGen);
    yield takeLatest(CommunicationConstants.UPDATE_NOTIFICATION_REQUEST, updateNotificationGen);
    yield takeLatest(CommunicationConstants.DELETE_NOTIFICATION_REQUEST, deleteNotificationGen);
    yield takeLatest(CommunicationConstants.GET_CURRICULUM_CLASS_SECT_REQUEST, getCurriculumClassSectGen);
    yield takeLatest(CommunicationConstants.EXPORT_NOTIFICATION_ITEM_BY_ID,exportNotificationItemByIdGen)

    //setting template
    yield takeLatest(CommunicationConstants.GET_TEMPLATE_LIST, getTemplateListGen);
    yield takeLatest(CommunicationConstants.SAVE_TEMPLATE, saveTemplateGen);
    yield takeLatest(CommunicationConstants.DELETE_TEMPLATE, deleteTemplateGen);
    yield takeLatest(CommunicationConstants.UPDATE_TEMPLATE, editTemplateGen);

    //feeds
    yield takeLatest(CommunicationConstants.GET_FEEDS_LIST, getFeedsListGen);
    yield takeLatest(CommunicationConstants.SAVE_FEEDS, saveFeedsGen);
    yield takeLatest(CommunicationConstants.DELETE_FEEDS, deleteFeedsGen);
    yield takeLatest(CommunicationConstants.GET_FEEDS_BY_ID, getFeedsByIdGen);
    yield takeLatest(CommunicationConstants.UPDATE_FEEDS, setUpdateFeedsGen);
    yield takeLatest(CommunicationConstants.UPDATE_FEEDS_FILES, updateFeedsFilesGen);
    //events
    yield takeLatest(CommunicationConstants.GET_EVENTS_LIST, getEventListGen);
    yield takeLatest(CommunicationConstants.SAVE_EVENT, saveEventGen);
    yield takeLatest(CommunicationConstants.DELETE_EVENT_LIST, deleteEventGen);
    yield takeLatest(CommunicationConstants.GET_EVENT_BY_ID, getEventByIdGen);
    yield takeLatest(CommunicationConstants.UPDATE_EVENT_REQUEST, updateEventRespGen);
    yield takeLatest(CommunicationConstants.UPDATE_FILES_REQUEST, updateFilesRespGen);

    //notification history
    yield takeLatest(CommunicationConstants.GET_SMS_TEMPLATE_LIST, getSmsTemplateListGen);
    yield takeLatest(CommunicationConstants.GET_NOTIFICATION_HISTORY, getNotificationHistoryGen);
    yield takeLatest(CommunicationConstants.EXPORT_NOTIFICATION_HISTORY, exportNotificationHistoryGen);

    // gallery management
    yield takeLatest(CommunicationConstants.GET_GALLERY_MANAGEMENT_LIST,getGalleryManagementListGen);
    yield takeLatest(CommunicationConstants.GET_GALLERY_MANAGEMENT_ITEM_BY_ID,getGalleryManagementItemByIdGen);
    yield takeLatest(CommunicationConstants.SAVE_GALLERY_MANAGEMENT_ITEM,saveGalleryManagementItemGen);
    yield takeLatest(CommunicationConstants.DELETE_GALLERY_MANAGEMENT_ITEM,deleteGalleryManagementItemGen);
    yield takeLatest(CommunicationConstants.GET_GALLERY_CATEGORIES,getGalleryCategoriesGen);
    yield takeLatest(CommunicationConstants.UPDATE_GALLERY_MANAGEMENT_ITEM,updateGalleryManagementItemGen);
    //whatsapp notification
    yield takeLatest(CommunicationConstants.GET_WHATSAPP_TEMPLATES, getWhatsappTemplatesGen);
    yield takeLatest(CommunicationConstants.SEND_WHATSAPP_MESSAGE, sendWhatsappMessageActGen);
    yield takeLatest(CommunicationConstants.UPLOAD_WHATSAPP_MEDIA, uploadWhatsappMediaGen);
    yield takeLatest(CommunicationConstants.GET_WHATSAPP_CAMPAIGN_STATS, getWhatsappCampaignStatsGen);
    yield takeLatest(CommunicationConstants.GET_CAMPAGIN_OVERVIEW_DETAILS, getCampaginOverviewDetailsGen);
    yield takeLatest(CommunicationConstants.GET_CAMPAGIN_RECIPIENTS_DETAILS, getCampaginRecipientsDetailsGen);
    yield takeLatest(CommunicationConstants.WHATSAPP_NOTIFICATION_VALIDATE_STUDENTS, whatsAppNotifcationValidateStudentsGen);
    // whatsapp settings
    yield takeLatest(CommunicationConstants.GET_WHATSAPP_SETTINGS_TEMPLATES, getWhatsappSettingsTemplatesGen);
    yield takeLatest(CommunicationConstants.UPDATE_WHATSAPP_SETTINGS_TEMPLATE, updateWhatsappSettingsTemplateGen);

    yield takeLatest(CommunicationConstants.GET_NOTIFCATION_CAMPAIGN_RECIPIENT_LIST, getNotificationCampaignRecipientListGen);
}

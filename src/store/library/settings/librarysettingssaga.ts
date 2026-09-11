import axios, { AxiosError, AxiosResponse } from "axios";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { ICreatedActionType } from "../../types";
import { deleteData, getData, postData, putData } from "../../../api/apiactions";
import { setSaveLibraryDetailsListAct, setLibraryCategoryListAct, setLibraryDetailsErrorAct, setLibraryDetailsListAct, setLibraryLanguageListAct, setLibraryPublisherListAct, setLibraryRackListAct, setLibraryRecordListAct, setLibraryRoomsListAct, setLibraryShelfListAct, setLibraryDetailsListByIdAct, setEditLibraryDetailsListAct, setDelLibraryDetailsListAct, setLibraryRoomsListByIdAct, setSaveLibraryRoomsListAct, setEditLibraryRoomsListAct, setDelLibraryRoomsListAct, setLibraryPublisherListByIdAct, setSaveLibraryPublisherListAct, setEditLibraryPublisherListAct, setDelLibraryPublisherListAct, setDelLibraryShelfsListAct, setEditLibraryShelfsListAct, setSaveLibraryShelfsListAct, setLibraryShelfsListByIdAct, setLibraryRacksListByIdAct, setSaveLibraryRacksListAct, setEditLibraryRacksListAct, setDelLibraryRacksListAct, setLibraryUserRecordTypeListAct, setLibraryUserTypeListAct, setEditLibraryUserTypeListAct, setEditLibraryUserRecordTypeListAct, setDeleteLibraryRackPromptListAct, setSaveLibraryCategoriesListAct, setLibraryCategoryItemByIdAct, setEditLibraryCategoryItemAct, setDelLibraryCategoryItemAct } from "./librarysettingsslice";
import { LibrarySettingsConstants } from "./librarysettingsconstants";

//libraryDetails

function* getLibraryDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryDetailsListAct(response.data));
    }
}

function* getLibraryDetailsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryDetailsListByIdAct(response.data));
    }
}

function* saveLibraryDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setSaveLibraryDetailsListAct(response.data));
    }
}

function* editLibraryDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setEditLibraryDetailsListAct({statusCode : response.status}));
    }
}

function* deleteLibraryDetailsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setDelLibraryDetailsListAct({status : response.statusCode}));
    }
}

//Library Rooms
function* getLibraryRoomsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryRoomsListAct(response.data));
    }
}

function* getLibraryRoomsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryRoomsListByIdAct(response.data));
    }
}

function* saveLibraryRoomsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setSaveLibraryRoomsListAct(response.data));
    }
}

function* editLibraryRoomsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setEditLibraryRoomsListAct({statusCode : response.status}));
    }
}

function* deleteLibraryRoomsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setDelLibraryRoomsListAct({status : response.statusCode}));
    }
}
//Library Shelfs
function* getLibraryShelfListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryShelfListAct(response.data));
    }
}
function* getLibraryShelfsListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryShelfsListByIdAct(response.data));
    }
}

function* saveLibraryShelfsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setSaveLibraryShelfsListAct(response.data));
    }
}

function* editLibraryShelfsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setEditLibraryShelfsListAct({statusCode : response.status}));
    }
}

function* deleteLibraryShelfsListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setDelLibraryShelfsListAct({status : response.statusCode}));
    }
}

//Library Racks
function* getLibraryRackListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryRackListAct(response.data));
    }
}

function* getLibraryRacksListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryRacksListByIdAct(response.data));
    }
}

function* saveLibraryRacksListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setSaveLibraryRacksListAct(response.data));
    }
}

function* editLibraryRacksListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setEditLibraryRacksListAct({statusCode : response.status}));
    }
}

function* deleteLibraryRacksListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setDelLibraryRacksListAct({status : response.statusCode}));
    }
}
//Library Publisher
function* getLibraryPublisherListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryPublisherListAct(response.data));
    }
}

function* getLibraryPublisherListByIdGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryPublisherListByIdAct(response.data));
    }
}

function* saveLibraryPublisherListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(postData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setSaveLibraryPublisherListAct(response.data));
    }
}

function* editLibraryPublisherListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setEditLibraryPublisherListAct({statusCode : response.status}));
    }
}

function* deleteLibraryPublisherListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(deleteData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setDelLibraryPublisherListAct({status : response.statusCode}));
    }
}

//Library Record
function* getLibraryRecordListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryRecordListAct(response.data));
    }
}
//Library Category
function* getLibraryCategoryListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryCategoryListAct(response.data));
    }
    }

function* getLibraryCategoryItemByIdGen(action: ICreatedActionType):any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint,payload.payload, payload.optionalConfig)
    if(response && response.error){
        yield put(setLibraryDetailsErrorAct(response.error))
    }else {
        yield put(setLibraryCategoryItemByIdAct(response.data))
    }
}

function* saveLibraryCategoriesGen(action: ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(postData,payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error){
        yield put(setLibraryDetailsErrorAct(response.error));
    }else {
        yield put(setSaveLibraryCategoriesListAct({statusCode : response.status}))
    }
}

function* editLibraryCategoriesGen(action:ICreatedActionType):any{
    const {payload} = action;
    const response = yield call(putData, payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error){
        yield put(setLibraryDetailsErrorAct(response.error));
    }else {
        yield put(setEditLibraryCategoryItemAct({statusCode : response.status}))
    }
}

function* delLibraryCategoriesGen(action:ICreatedActionType):any {
    const {payload} = action;
    const response = yield call(deleteData,payload.endpoint,payload.payload,payload.optionalConfig)
    if(response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    }else {
        yield put(setDelLibraryCategoryItemAct({status : response.statusCode}))
    }
}

//Library Language
function* getLibraryLanguageListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryLanguageListAct(response.data));
    }
}

//library User Record Type
function* getLibraryUserRecordTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryUserRecordTypeListAct(response.data));
    }
}

function* editLibraryUserRecordTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setEditLibraryUserRecordTypeListAct({statusCode : response.status}));
    }
}

//library User Type
function* getLibraryUserTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setLibraryUserTypeListAct(response.data));
    }
}

function* editLibraryUserTypeListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(putData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setEditLibraryUserTypeListAct({statusCode : response.status}));
    }
}
//Rack, Shelf, Room Delete Prompt
function* getDeleteLibraryRackPromptListGen(action: ICreatedActionType): any {
    const { payload } = action;
    const response = yield call(getData, payload.endpoint, payload.payload, payload.optionalConfig)
    if (response && response.error) {
        yield put(setLibraryDetailsErrorAct(response.error));
    } else {
        yield put(setDeleteLibraryRackPromptListAct(response.data));
    }
}

export default function* librarySettingsSaga() {
    //LibraryDetails

    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_DETAILS, getLibraryDetailsListGen);
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_DETAILS_LIST_BY_ID, getLibraryDetailsListByIdGen);
    yield takeLatest(LibrarySettingsConstants.SAVE_LIBRARY_DETAILS_LIST, saveLibraryDetailsListGen);
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_DETAILS_LIST, editLibraryDetailsListGen);
    yield takeLatest(LibrarySettingsConstants.DELETE_LIBRARY_DETAILS_LIST, deleteLibraryDetailsListGen);
    
    //Library Rooms
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_ROOMS, getLibraryRoomsListGen);
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_ROOMS_LIST_BY_ID, getLibraryRoomsListByIdGen);
    yield takeLatest(LibrarySettingsConstants.SAVE_LIBRARY_ROOMS_LIST, saveLibraryRoomsListGen);
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_ROOMS_LIST, editLibraryRoomsListGen);
    yield takeLatest(LibrarySettingsConstants.DELETE_LIBRARY_ROOMS_LIST, deleteLibraryRoomsListGen);


    //LibraryShelfs
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_SHELF, getLibraryShelfListGen);
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_SHELFS_LIST_BY_ID, getLibraryShelfsListByIdGen);
    yield takeLatest(LibrarySettingsConstants.SAVE_LIBRARY_SHELFS_LIST, saveLibraryShelfsListGen);
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_SHELFS_LIST, editLibraryShelfsListGen);
    yield takeLatest(LibrarySettingsConstants.DELETE_LIBRARY_SHELFS_LIST, deleteLibraryShelfsListGen);


    //Library Racks
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_RACK, getLibraryRackListGen);
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_RACKS_LIST_BY_ID, getLibraryRacksListByIdGen);
    yield takeLatest(LibrarySettingsConstants.SAVE_LIBRARY_RACKS_LIST, saveLibraryRacksListGen);
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_RACKS_LIST, editLibraryRacksListGen);
    yield takeLatest(LibrarySettingsConstants.DELETE_LIBRARY_RACKS_LIST, deleteLibraryRacksListGen);


    //Library Publisher
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_PUBLISHER, getLibraryPublisherListGen);
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_PUBLISHER_LIST_BY_ID, getLibraryPublisherListByIdGen);
    yield takeLatest(LibrarySettingsConstants.SAVE_LIBRARY_PUBLISHER_LIST, saveLibraryPublisherListGen);
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_PUBLISHER_LIST, editLibraryPublisherListGen);
    yield takeLatest(LibrarySettingsConstants.DELETE_LIBRARY_PUBLISHER_LIST, deleteLibraryPublisherListGen);


    //library User Record Type
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_RECORD, getLibraryRecordListGen);


    //Library Category
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_CATEGORY, getLibraryCategoryListGen);
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_CATEGORY_BY_ID, getLibraryCategoryItemByIdGen)
    yield takeLatest(LibrarySettingsConstants.SAVE_LIBRARY_CATEGORY_ITEMS,saveLibraryCategoriesGen)
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_CATEGORY_ITEM, editLibraryCategoriesGen)
    yield takeLatest(LibrarySettingsConstants.DELETE_LIBRARY_CATEGORY_ITEM, delLibraryCategoriesGen)


    //Library Category
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_LANGUAGE, getLibraryLanguageListGen);

    //library User Record Type
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_USER_RECORD_TYPE, getLibraryUserRecordTypeListGen);
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_USER__RECORD_TYPE, editLibraryUserRecordTypeListGen);

    //library User Record Type
    yield takeLatest(LibrarySettingsConstants.GET_LIBRARY_USER_TYPE, getLibraryUserTypeListGen);
    yield takeLatest(LibrarySettingsConstants.EDIT_LIBRARY_USER_TYPE, editLibraryUserTypeListGen);

    //Rack, Shelf, Room Delete Prompt
    yield takeLatest(LibrarySettingsConstants.DELETE_LIBRARY_RACK_PROMPT, getDeleteLibraryRackPromptListGen);
}
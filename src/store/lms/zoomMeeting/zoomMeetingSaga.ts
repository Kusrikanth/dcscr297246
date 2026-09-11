import { call, put, takeLatest } from 'redux-saga/effects';
import { ICreatedActionType } from '../../types';
import {
  deleteData,
  getData,
  postData,
  putData,
} from '../../../api/apiactions';
import {
  setSaveScheduledMeetingItemAct,
  setAllSectionMeetingLinksAct,
  setClassMeetingLinksByIdAct,
  setSaveClassMeetingLinkByClassAct,
  setScheduledMeetingsListAct,
  setZoomMeetingErrorAct,
  setCancelScheduledMeetingsItemByIdAct,
  setScheduledMeetingItemByIdAct,
  setEditScheduledMeetingItemByIdAct,
  setReScheduleScheduledMeetingItemByIdAct,
  setScheduledMeetingsStatsAct,
  setStartScheduledMeetingItemByIdAct,
  setJoinScheduledMeetingsItemByIdAct,
  setReStartScheduledMeetingsItemByIdAct,
  setEndScheduledMeetingsItemByIdAct,
  setLeaveScheduledMeetingsItemByIdAct,
  setZoomMeetingJoinTokenAct,
} from './zoomMeetingSlice';
import { zoomMeetingConstants } from './zoomMeetingConstants';

function* getAllSectionMeetingLinksGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setAllSectionMeetingLinksAct(response.data));
  }
}

function* getClassMeetingLinksByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setClassMeetingLinksByIdAct(response.data));
  }
}

function* saveClassMeetingLinkByClassGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setSaveClassMeetingLinkByClassAct(response.data));
  }
}

// meeting schedules
function* getScheduledMeetingsListGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setScheduledMeetingsListAct(response.data));
  }
}
function* getScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setScheduledMeetingItemByIdAct(response.data));
  }
}

function* saveScheduledMeetingItemGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setSaveScheduledMeetingItemAct(response.data));
  }
}

function* cancelScheduledMeetingsItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setCancelScheduledMeetingsItemByIdAct(response.data));
  }
}
function* editScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setEditScheduledMeetingItemByIdAct(response.data));
  }
}
function* reScheduleScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setReScheduleScheduledMeetingItemByIdAct(response.data));
  }
}
function* getScheduledMeetingsStatsGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    getData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setScheduledMeetingsStatsAct(response.data));
  }
}
function* startScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setStartScheduledMeetingItemByIdAct(response.data));
  }
}
function* reStartScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setReStartScheduledMeetingsItemByIdAct(response.data));
  }
}
function* endScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setEndScheduledMeetingsItemByIdAct(response.data));
  }
}
function* joinScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setJoinScheduledMeetingsItemByIdAct(response.data));
  }
}
function* leaveScheduledMeetingItemByIdGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    putData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setLeaveScheduledMeetingsItemByIdAct(response.data));
  }
}
function* getZoomMeetingJoinTokenGen(action: ICreatedActionType): any {
  const { payload } = action;
  const response = yield call(
    postData,
    payload.endpoint,
    payload.payload,
    payload.optionalConfig,
  );
  if (response && response.error) {
    yield put(setZoomMeetingErrorAct(response.error));
  } else {
    yield put(setZoomMeetingJoinTokenAct(response.data));
  }
}

export default function* zoomMeetingsSaga() {
  yield takeLatest(
    zoomMeetingConstants.GET_ALL_SECTION_MEETING_LINKS,
    getAllSectionMeetingLinksGen,
  );
  yield takeLatest(
    zoomMeetingConstants.GET_CLASS_MEETING_LINKS_BY_ID,
    getClassMeetingLinksByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.SAVE_CLASS_MEETING_LINKS_CLASS,
    saveClassMeetingLinkByClassGen,
  );
  yield takeLatest(
    zoomMeetingConstants.GET_SCHEDULED_MEETING_LIST,
    getScheduledMeetingsListGen,
  );
  yield takeLatest(
    zoomMeetingConstants.GET_SCHEDULED_MEETING_ITEM_BY_ID,
    getScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.SAVE_SCHEDULED_MEETING_ITEM,
    saveScheduledMeetingItemGen,
  );
  yield takeLatest(
    zoomMeetingConstants.CANCEL_SCHEDULED_MEETING_ITEM_BY_ID,
    cancelScheduledMeetingsItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.EIDT_SCHEDULED_MEETING_ITEM_BY_ID,
    editScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.RESCHEDULE_SCHEDULED_MEETING_ITEM_BY_ID,
    reScheduleScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.GET_SCHEDULED_MEETING_STATS,
    getScheduledMeetingsStatsGen,
  );
  yield takeLatest(
    zoomMeetingConstants.START_SCHEDULED_MEETING_ITEM_BY_ID,
    startScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.RE_START_SCHEDULED_MEETING_ITEM_BY_ID,
    reStartScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.END_SCHEDULED_MEETING_ITEM_BY_ID,
    endScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.JOIN_SCHEDULED_MEETING_ITEM_BY_ID,
    joinScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.LEAVE_SCHEDULED_MEETING_ITEM_BY_ID,
    leaveScheduledMeetingItemByIdGen,
  );
  yield takeLatest(
    zoomMeetingConstants.GET_ZOOM_MEETING_JOIN_TOKEN,
    getZoomMeetingJoinTokenGen,
  );
}

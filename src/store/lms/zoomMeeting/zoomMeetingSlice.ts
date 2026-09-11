import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IZoomMeetingState } from './zoomMeetingTypes';

const initialState: IZoomMeetingState = {
  // meeting links settings
  getAllSectionMeetingLinksResp: undefined,
  getClassMeetingLinksByIdResp: undefined,
  saveClassMeetingLinkByClassResp: undefined,

  // meeting schedules
  getScheduledMeetingsListResp: undefined,
  getScheduledMeetingItemByIdResp: undefined,
  saveScheduledMeetingItemResp: undefined,
  cancelScheduledMeetingsItemByIdResp: undefined,
  editScheduledMeetingItemByIdResp: undefined,
  reScheduleScheduledMeetingItemByIdResp: undefined,
  getScheduledMeetingsStatsResp: undefined,
  startScheduledMeetingsItemByIdResp: undefined,
  joinScheduledMeetingsItemByIdResp: undefined,
  reStartScheduledMeetingsItemByIdResp: undefined,
  endScheduledMeetingsItemByIdResp: undefined,
  leaveScheduledMeetingsItemByIdResp: undefined,
  getZoomMeetingJoinTokenResp: undefined,

  getzoomMeetingErrorResp: undefined,
};

export const zoomMeetings = createSlice({
  name: 'zoomMeetings',
  initialState,
  reducers: {
    // meeting links settings
    setAllSectionMeetingLinksAct: (state, action: PayloadAction<any>) => {
      state.getAllSectionMeetingLinksResp = action.payload;
    },
    setClassMeetingLinksByIdAct: (state, action: PayloadAction<any>) => {
      state.getClassMeetingLinksByIdResp = action.payload;
    },
    setSaveClassMeetingLinkByClassAct: (state, action: PayloadAction<any>) => {
      state.saveClassMeetingLinkByClassResp = action.payload;
    },

    // meeting schedules
    setScheduledMeetingsListAct: (state, action: PayloadAction<any>) => {
      state.getScheduledMeetingsListResp = action.payload;
    },
    resetScheduledMeetingsListAct: (state, action: PayloadAction<any>) => {
      state.getScheduledMeetingsListResp = action.payload;
    },
    resetLiveMeetingApiAct: (state) => {
      state.getScheduledMeetingItemByIdResp = undefined;
      state.startScheduledMeetingsItemByIdResp = undefined;
      state.reStartScheduledMeetingsItemByIdResp = undefined;
      state.endScheduledMeetingsItemByIdResp = undefined;
      state.joinScheduledMeetingsItemByIdResp = undefined;
      state.leaveScheduledMeetingsItemByIdResp = undefined;
      state.getZoomMeetingJoinTokenResp = undefined;
      state.getzoomMeetingErrorResp = undefined;
    },
    setScheduledMeetingItemByIdAct: (state, action: PayloadAction<any>) => {
      state.getScheduledMeetingItemByIdResp = action.payload;
    },
    setSaveScheduledMeetingItemAct: (state, action: PayloadAction<any>) => {
      state.saveScheduledMeetingItemResp = action.payload;
    },
    setCancelScheduledMeetingsItemByIdAct: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.cancelScheduledMeetingsItemByIdResp = action.payload;
    },
    setEditScheduledMeetingItemByIdAct: (state, action: PayloadAction<any>) => {
      state.editScheduledMeetingItemByIdResp = action.payload;
    },
    setReScheduleScheduledMeetingItemByIdAct: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.reScheduleScheduledMeetingItemByIdResp = action.payload;
    },
    setScheduledMeetingsStatsAct: (state, action: PayloadAction<any>) => {
      state.getScheduledMeetingsStatsResp = action.payload;
    },
    setStartScheduledMeetingItemByIdAct: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.startScheduledMeetingsItemByIdResp = action.payload;
    },
    setReStartScheduledMeetingsItemByIdAct: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.reStartScheduledMeetingsItemByIdResp = action.payload;
    },
    setEndScheduledMeetingsItemByIdAct: (state, action: PayloadAction<any>) => {
      state.endScheduledMeetingsItemByIdResp = action.payload;
    },

    setJoinScheduledMeetingsItemByIdAct: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.joinScheduledMeetingsItemByIdResp = action.payload;
    },
    setLeaveScheduledMeetingsItemByIdAct: (
      state,
      action: PayloadAction<any>,
    ) => {
      state.leaveScheduledMeetingsItemByIdResp = action.payload;
    },
    setZoomMeetingJoinTokenAct: (state, action: PayloadAction<any>) => {
      state.getZoomMeetingJoinTokenResp = action.payload;
    },

    setZoomMeetingErrorAct: (state, action: PayloadAction<any>) => {
      state.getzoomMeetingErrorResp = action.payload;
    },
  },
});

export const {
  setAllSectionMeetingLinksAct,
  setClassMeetingLinksByIdAct,
  setSaveClassMeetingLinkByClassAct,
  setScheduledMeetingsListAct,
  resetScheduledMeetingsListAct,
  resetLiveMeetingApiAct,
  setScheduledMeetingItemByIdAct,
  setSaveScheduledMeetingItemAct,
  setCancelScheduledMeetingsItemByIdAct,
  setEditScheduledMeetingItemByIdAct,
  setReScheduleScheduledMeetingItemByIdAct,
  setScheduledMeetingsStatsAct,
  setStartScheduledMeetingItemByIdAct,
  setJoinScheduledMeetingsItemByIdAct,
  setReStartScheduledMeetingsItemByIdAct,
  setEndScheduledMeetingsItemByIdAct,
  setLeaveScheduledMeetingsItemByIdAct,
  setZoomMeetingJoinTokenAct,
  setZoomMeetingErrorAct,
} = zoomMeetings.actions;
export default zoomMeetings.reducer;

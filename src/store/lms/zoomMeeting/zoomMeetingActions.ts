import { createAction } from '@reduxjs/toolkit';
import { INewActionType } from '../../types';
import { zoomMeetingConstants } from './zoomMeetingConstants';

export const getAllSectionMeetingLinksAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.GET_ALL_SECTION_MEETING_LINKS);

export const getClassMeetingLinksByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.GET_CLASS_MEETING_LINKS_BY_ID);

export const saveClassMeetingLinkByClassAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.SAVE_CLASS_MEETING_LINKS_CLASS);

export const getScheduledMeetingsListAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.GET_SCHEDULED_MEETING_LIST);
export const getScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.GET_SCHEDULED_MEETING_ITEM_BY_ID);

export const saveScheduledMeetingItemAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.SAVE_SCHEDULED_MEETING_ITEM);

export const cancelScheduledMeetingsItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.CANCEL_SCHEDULED_MEETING_ITEM_BY_ID);
export const editScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.EIDT_SCHEDULED_MEETING_ITEM_BY_ID);
export const reScheduleScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.RESCHEDULE_SCHEDULED_MEETING_ITEM_BY_ID);
export const getScheduledMeetingsStatsAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.GET_SCHEDULED_MEETING_STATS);
export const startScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.START_SCHEDULED_MEETING_ITEM_BY_ID);

export const reStartScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.RE_START_SCHEDULED_MEETING_ITEM_BY_ID);

export const endScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.END_SCHEDULED_MEETING_ITEM_BY_ID);

export const joinScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.JOIN_SCHEDULED_MEETING_ITEM_BY_ID);

export const leaveScheduledMeetingItemByIdAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.LEAVE_SCHEDULED_MEETING_ITEM_BY_ID);
export const getZoomMeetingJoinTokenAct = createAction<
  INewActionType | undefined
>(zoomMeetingConstants.GET_ZOOM_MEETING_JOIN_TOKEN);

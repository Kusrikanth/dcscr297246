export interface IZoomMeetingState {
  // meeting links settings
  getAllSectionMeetingLinksResp: any;
  getClassMeetingLinksByIdResp: any;
  saveClassMeetingLinkByClassResp: any;

  // meeting schedules
  getScheduledMeetingsListResp: any;
  getScheduledMeetingItemByIdResp: any;
  saveScheduledMeetingItemResp: any;
  cancelScheduledMeetingsItemByIdResp:any;
  editScheduledMeetingItemByIdResp:any;
  reScheduleScheduledMeetingItemByIdResp:any;
  getScheduledMeetingsStatsResp:any;

  // start the meeting
  startScheduledMeetingsItemByIdResp: any;
  reStartScheduledMeetingsItemByIdResp: any;
  endScheduledMeetingsItemByIdResp: any;

  joinScheduledMeetingsItemByIdResp: any;
  leaveScheduledMeetingsItemByIdResp: any;
  getZoomMeetingJoinTokenResp: any;

  getzoomMeetingErrorResp: any;
}

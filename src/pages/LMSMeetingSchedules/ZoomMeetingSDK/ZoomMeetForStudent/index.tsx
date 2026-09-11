import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ZoomMtg,
  onMeetingStatus as zoomMeetingStatus,
} from '@zoom/meetingsdk';
import { shallowEqual } from 'react-redux';

import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { useHistory, useLocation } from 'react-router-dom';
import { leaveScheduledMeetingItemByIdAct } from '../../../../store/lms/zoomMeeting/zoomMeetingActions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import '../_zoom-sdk-styles.scss';

type ZoomMeetingStatusEvent = {
  status?: zoomMeetingStatus;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object' && !Array.isArray(value));

const getStringField = (details: unknown, fieldName: string): string => {
  if (!isRecord(details)) return '';

  const value = details[fieldName];
  return value === undefined || value === null ? '' : String(value).trim();
};

const getZoomJoinTokenDetails = (response: unknown) => {
  if (!isRecord(response)) return response;

  if (response.data) return response.data;
  if (response.joinTokenDetails) return response.joinTokenDetails;

  return response;
};

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();
ZoomMtg.i18n.load('en-US');

const ZoomMeetForStudent = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const location = useLocation<{
    autoJoin?: boolean;
    meetingId?: string | number;
    returnTo?: string;
    sessionId?: string | number;
    zoomJoinTokenDetails?: unknown;
  }>();

  const scheduledMeetingId = location.state?.meetingId;
  const returnTo = location.state?.returnTo || '/live-classes';

  const { parentChildrensResp, currentStudentId } = useAppSelector(
    ({ appData, directoryStudent }) => ({
      currentStudentId: appData.currentStudentId,
      parentChildrensResp: directoryStudent.parentChildrensResp,
    }),
    shallowEqual,
  );

  const {
    getScheduledMeetingItemByIdResp,
    getZoomMeetingJoinTokenResp,
    getzoomMeetingErrorResp,
    leaveScheduledMeetingsItemByIdResp,
  } = useAppSelector(
    ({ zoomMeetings }) => ({
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
      getZoomMeetingJoinTokenResp: zoomMeetings.getZoomMeetingJoinTokenResp,
      getzoomMeetingErrorResp: zoomMeetings.getzoomMeetingErrorResp,
      leaveScheduledMeetingsItemByIdResp:
        zoomMeetings.leaveScheduledMeetingsItemByIdResp,
    }),
    shallowEqual,
  );

  const currentStudent = useMemo(() => {
    if (!parentChildrensResp || !currentStudentId) return undefined;

    return parentChildrensResp.find(
      (item: { childId?: string | number }) =>
        +Number(item.childId) === +currentStudentId,
    );
  }, [parentChildrensResp, currentStudentId]);

  const { meetingLink } = getScheduledMeetingItemByIdResp || {};
  const { meetingId: zoomMeetingId, meetingPassword } = meetingLink || {};
  const sessionId = location.state?.sessionId;
  const zoomJoinTokenDetails = useMemo(
    () =>
      getZoomJoinTokenDetails(
        location.state?.zoomJoinTokenDetails || getZoomMeetingJoinTokenResp,
      ),
    [getZoomMeetingJoinTokenResp, location.state?.zoomJoinTokenDetails],
  );

  const isInitializedRef = useRef(false);
  const isJoinedRef = useRef(false);
  const autoJoinRef = useRef(false);
  const leaveSubmittedRef = useRef(false);
  const leaveRequestStartedRef = useRef(false);
  const leaveResponseBeforeRequestRef = useRef<unknown>(undefined);
  const leaveErrorBeforeRequestRef = useRef<unknown>(undefined);
  const pendingZoomControlRef = useRef<HTMLElement | null>(null);
  const replayingZoomLeaveClickRef = useRef(false);
  const statusListenerRegisteredRef = useRef(false);

  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  const sdkKey = getStringField(zoomJoinTokenDetails, 'sdkKey');
  const zoomSignature = getStringField(zoomJoinTokenDetails, 'signature');
  const zoomPasscode =
    getStringField(zoomJoinTokenDetails, 'passcode') || meetingPassword || '';
  const zoomZak = getStringField(zoomJoinTokenDetails, 'zak');

  const cleanMeetingNumber = useMemo(() => {
    return String(
      getStringField(zoomJoinTokenDetails, 'meetingNumber') ||
        zoomMeetingId ||
        '',
    ).replace(/\D/g, '');
  }, [zoomJoinTokenDetails, zoomMeetingId]);

  const leaveUrl = `${window.location.origin}${
    returnTo.startsWith('/') ? returnTo : `/${returnTo}`
  }`;

  const cleanZoomSdkStyles = useCallback(() => {
    const head = document.head;
    if (!head) {
      return;
    }

    const zoomLinkRegex = /zoom(-|_)meetingsdk|zoomus-websdk|zoom-meetingsdk|meetingsdk/i;
    const linkElements = Array.from(
      head.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'),
    );

    linkElements.forEach((link) => {
      const href = link.href || '';
      if (zoomLinkRegex.test(href)) {
        link.remove();
      }
    });

    const styleElements = Array.from(head.querySelectorAll<HTMLStyleElement>('style'));
    styleElements.forEach((style) => {
      const id = style.id || '';
      const dataEmotion = style.getAttribute('data-emotion') || '';
      const text = style.textContent || '';
      if (
        zoomLinkRegex.test(id) ||
        zoomLinkRegex.test(dataEmotion) ||
        /\.zoom-meetingsdk|zoom-meetingsdk|zmu-data-selector|zoomus-websdk|zoom-meeting|zoom-meeting-ui/i.test(
          text,
        )
      ) {
        style.remove();
      }
    });
  }, []);

  const showZoomRoot = useCallback(() => {
    const zoomRoot = document.getElementById('zmmtg-root');

    if (zoomRoot) {
      zoomRoot.style.display = 'block';
    }
  }, []);

  const hideZoomRoot = useCallback(() => {
    const zoomRoot = document.getElementById('zmmtg-root');

    if (zoomRoot) {
      zoomRoot.style.display = 'none';
    }

    cleanZoomSdkStyles();
  }, [cleanZoomSdkStyles]);

  const navigateToReturnTo = useCallback(
    (message?: string) => {
      hideZoomRoot();
      history.replace(returnTo, {
        zoomMeetingError: message,
      });
    },
    [history, hideZoomRoot, returnTo],
  );

  const hasValidMeetingNumber = Boolean(cleanMeetingNumber);
  const hasMeetingId = Boolean(scheduledMeetingId);

  const submitLeaveAttendance = useCallback(() => {
    if (
      !scheduledMeetingId ||
      leaveSubmittedRef.current ||
      leaveRequestStartedRef.current
    ) {
      return;
    }

    leaveRequestStartedRef.current = true;
    leaveResponseBeforeRequestRef.current = leaveScheduledMeetingsItemByIdResp;
    leaveErrorBeforeRequestRef.current = getzoomMeetingErrorResp;

    const payload = {
      sessionId,
      studentId: currentStudentId,
      updatedByName: currentStudent?.childName || '',
    };

    dispatch(
      leaveScheduledMeetingItemByIdAct(
        generateActionPayload(
          'leave_scheduled_meeting_item_by_id',
          {
            id: scheduledMeetingId,
          },
          payload,
        ),
      ),
    );
  }, [
    currentStudent?.childName,
    currentStudentId,
    dispatch,
    getzoomMeetingErrorResp,
    leaveScheduledMeetingsItemByIdResp,
    scheduledMeetingId,
    sessionId,
  ]);

  const registerMeetingStatusListener = useCallback(() => {
    if (statusListenerRegisteredRef.current) return;

    statusListenerRegisteredRef.current = true;

    ZoomMtg.inMeetingServiceListener(
      'onMeetingStatus',
      (data: ZoomMeetingStatusEvent) => {
        if (data?.status !== zoomMeetingStatus.disconnected) return;

        submitLeaveAttendance();
        isJoinedRef.current = false;
        setIsJoined(false);
      },
    );
  }, [submitLeaveAttendance]);

  const isZoomLeaveControl = useCallback((target: EventTarget | null) => {
    const element =
      target instanceof Element
        ? target.closest('button, a, [role="button"], [aria-label], [title]')
        : null;

    if (!element || !document.getElementById('zmmtg-root')?.contains(element)) {
      return false;
    }

    const visibleText = (element.textContent || '').trim().toLowerCase();

    const accessibleText = [
      element.getAttribute('aria-label'),
      element.getAttribute('title'),
      element.getAttribute('data-tooltip'),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const actionText = `${visibleText} ${accessibleText}`;

    if (actionText.includes('computer audio')) {
      return false;
    }

    return (
      visibleText === 'leave meeting' ||
      accessibleText.includes('leave meeting')
    );
  }, []);

  const initZoomClient = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (isInitializedRef.current) {
        resolve();
        return;
      }

      showZoomRoot();

      ZoomMtg.init({
        leaveUrl,
        patchJsMedia: true,
        leaveOnPageUnload: true,
        disableCORP: !window.crossOriginIsolated,

        disableInvite: true,
        disableCallOut: true,
        disableRecord: true,
        disablePreview: false,

        isSupportChat: true,
        isSupportQA: true,
        isSupportCC: true,
        screenShare: true,
        videoHeader: true,
        defaultView: 'gallery',

        meetingInfo: ['topic', 'host', 'participant', 'dc', 'enctype'],

        success: () => {
          isInitializedRef.current = true;
          resolve();
        },

        error: (error: unknown) => {
          reject(error);
        },
      });
    });
  }, [leaveUrl, showZoomRoot]);

  const joinZoomMeeting = useCallback(
    (signature: string) => {
      return new Promise<void>((resolve, reject) => {
        const studentName =
          currentStudent?.childName || currentStudent?.studentName || 'Student';

        const studentEmail =
          currentStudent?.emailId || currentStudent?.admissionEmailId || '';

        const joinPayload: Parameters<typeof ZoomMtg.join>[0] = {
          sdkKey,
          signature,
          meetingNumber: cleanMeetingNumber,

          passWord: zoomPasscode,

          userName: studentName,

          success: () => {
            isJoinedRef.current = true;
            setIsJoined(true);
            registerMeetingStatusListener();
            resolve();
          },

          error: (error: unknown) => {
            reject(error);
          },
        };

        if (studentEmail) {
          joinPayload.userEmail = studentEmail;
        }

        if (zoomZak) {
          joinPayload.zak = zoomZak;
        }

        ZoomMtg.join(joinPayload);
      });
    },
    [
      cleanMeetingNumber,
      currentStudent,
      registerMeetingStatusListener,
      sdkKey,
      zoomPasscode,
      zoomZak,
    ],
  );

  const joinMeetingAsStudent = useCallback(async () => {
    try {
      setIsJoining(true);

      if (!sdkKey) {
        throw new Error('Zoom SDK key / Client ID is missing.');
      }

      if (!hasValidMeetingNumber) {
        throw new Error('Meeting number is missing.');
      }

      if (!currentStudent) {
        throw new Error('Student details are missing.');
      }

      if (!zoomSignature) {
        throw new Error('Zoom meeting signature is missing.');
      }

      await initZoomClient();
      await joinZoomMeeting(zoomSignature);
    } catch (error) {
      console.error('Student join error:', error);

      const zoomError =
        error && typeof error === 'object'
          ? (error as { reason?: string; message?: string;errorMessage?:string })
          : {};

      const message =
        zoomError.reason ||
        zoomError.message ||
        zoomError.errorMessage ||
        'Unable to join Zoom meeting as student';

      hideZoomRoot();
      navigateToReturnTo(message);
    } finally {
      setIsJoining(false);
    }
  }, [
    currentStudent,
    hasValidMeetingNumber,
    hideZoomRoot,
    initZoomClient,
    joinZoomMeeting,
    navigateToReturnTo,
    sdkKey,
    zoomSignature,
  ]);

  useEffect(() => {
    if (!hasMeetingId || !hasValidMeetingNumber) {
      navigateToReturnTo('Invalid or missing meeting details.');
      return;
    }

    if (
      !location.state?.autoJoin ||
      autoJoinRef.current ||
      !cleanMeetingNumber ||
      !currentStudent
    ) {
      return;
    }

    autoJoinRef.current = true;
    joinMeetingAsStudent();
  }, [
    cleanMeetingNumber,
    currentStudent,
    hasMeetingId,
    hasValidMeetingNumber,
    joinMeetingAsStudent,
    location.state?.autoJoin,
    navigateToReturnTo,
  ]);

  useEffect(() => {
    if (!isJoined) return;

    const handleZoomLeaveClick = (event: MouseEvent) => {
      if (replayingZoomLeaveClickRef.current || leaveSubmittedRef.current) {
        return;
      }

      if (!isZoomLeaveControl(event.target)) {
        return;
      }

      const zoomControl =
        event.target instanceof Element
          ? (event.target.closest(
              'button, a, [role="button"], [aria-label], [title]',
            ) as HTMLElement | null)
          : null;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      pendingZoomControlRef.current = zoomControl;
      submitLeaveAttendance();
    };

    document.addEventListener('click', handleZoomLeaveClick, true);

    return () => {
      document.removeEventListener('click', handleZoomLeaveClick, true);
    };
  }, [isJoined, isZoomLeaveControl, submitLeaveAttendance]);

  useEffect(() => {
    if (
      !leaveRequestStartedRef.current ||
      leaveScheduledMeetingsItemByIdResp ===
        leaveResponseBeforeRequestRef.current
    ) {
      return;
    }

    leaveSubmittedRef.current = true;
    leaveRequestStartedRef.current = false;

    const zoomControl = pendingZoomControlRef.current;
    pendingZoomControlRef.current = null;

    if (!zoomControl || !document.contains(zoomControl)) {
      return;
    }

    replayingZoomLeaveClickRef.current = true;
    zoomControl.click();

    window.setTimeout(() => {
      replayingZoomLeaveClickRef.current = false;
    }, 0);
  }, [leaveScheduledMeetingsItemByIdResp]);

  useEffect(() => {
    if (
      !leaveRequestStartedRef.current ||
      getzoomMeetingErrorResp === leaveErrorBeforeRequestRef.current
    ) {
      return;
    }

    leaveRequestStartedRef.current = false;
    pendingZoomControlRef.current = null;
  }, [getzoomMeetingErrorResp]);

  useEffect(() => {
    if (!isJoined) return;

    const handleBeforeUnload = () => {
      submitLeaveAttendance();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      submitLeaveAttendance();
    };
  }, [isJoined, submitLeaveAttendance]);

  useEffect(() => {
    return () => {
      hideZoomRoot();
    };
  }, [hideZoomRoot]);

  return (
    <div className="tw-py-4">
      <div className="container-fluid">
        {/* <div className="tw-mb-4 tw-flex tw-justify-between tw-items-center">
          <div className="tw-flex tw-items-center tw-gap-2">
            <img
                src={HeaderLoginImg}
                alt="header-logo"
                className="tw-w-[162px]"
            ></img>
          </div>
        </div> */}

        {/* {!isJoined && (
          <div className="tw-rounded-xl tw-border tw-border-gray-200 tw-bg-white tw-p-6 tw-text-center">
            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
              Click Join Class to open Zoom meeting..
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default ZoomMeetForStudent;

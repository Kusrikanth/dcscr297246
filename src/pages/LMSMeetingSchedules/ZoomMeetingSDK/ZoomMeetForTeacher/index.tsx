import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ZoomMtg,
  onMeetingStatus as zoomMeetingStatus,
} from '@zoom/meetingsdk';

import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { useHistory, useLocation } from 'react-router-dom';
import { endScheduledMeetingItemByIdAct } from '../../../../store/lms/zoomMeeting/zoomMeetingActions';
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

const ZoomMeetForTeacher = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const location = useLocation<{
    autoStart?: boolean;
    meetingId?: string | number;
    returnTo?: string;
    zoomJoinTokenDetails?: unknown;
  }>();

  const scheduledMeetingId = location.state?.meetingId;

  const {
    endScheduledMeetingsItemByIdResp,
    getScheduledMeetingItemByIdResp,
    getZoomMeetingJoinTokenResp,
    getzoomMeetingErrorResp,
    userMeResp,
  } = useAppSelector(
    ({ zoomMeetings, login }) => ({
      endScheduledMeetingsItemByIdResp:
        zoomMeetings.endScheduledMeetingsItemByIdResp,
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
      getZoomMeetingJoinTokenResp: zoomMeetings.getZoomMeetingJoinTokenResp,
      getzoomMeetingErrorResp: zoomMeetings.getzoomMeetingErrorResp,
      userMeResp: login.userMeResp,
    }),
    shallowEqual,
  );

  const { meetingLink } = getScheduledMeetingItemByIdResp || {};
  const { meetingId: zoomMeetingId, meetingPassword } = meetingLink || {};
  const zoomJoinTokenDetails = useMemo(
    () =>
      getZoomJoinTokenDetails(
        location.state?.zoomJoinTokenDetails || getZoomMeetingJoinTokenResp,
      ),
    [getZoomMeetingJoinTokenResp, location.state?.zoomJoinTokenDetails],
  );

  const isInitializedRef = useRef(false);
  const isJoinedRef = useRef(false);
  const autoStartRef = useRef(false);
  const endSubmittedRef = useRef(false);
  const endRequestStartedRef = useRef(false);
  const endResponseBeforeRequestRef = useRef<unknown>(undefined);
  const endErrorBeforeRequestRef = useRef<unknown>(undefined);
  const pendingZoomControlRef = useRef<HTMLElement | null>(null);
  const replayingZoomLeaveClickRef = useRef(false);
  const statusListenerRegisteredRef = useRef(false);

  const [isStarting, setIsStarting] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const returnTo = location.state?.returnTo || '/meeting-schedules';

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
      const zoomRoot = document.getElementById('zmmtg-root');

      if (zoomRoot) {
        zoomRoot.style.display = 'none';
        zoomRoot.replaceChildren();
      }

      if (message) {
        sessionStorage.setItem('zoomMeetingError', message);
      }

      window.location.replace(leaveUrl);
    },
    [leaveUrl],
  );

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

  const hasValidMeetingNumber = Boolean(cleanMeetingNumber);
  const hasMeetingId = Boolean(scheduledMeetingId);

  const endScheduledMeeting = useCallback(() => {
    if (
      !scheduledMeetingId ||
      endSubmittedRef.current ||
      endRequestStartedRef.current
    ) {
      return;
    }

    endRequestStartedRef.current = true;
    endResponseBeforeRequestRef.current = endScheduledMeetingsItemByIdResp;
    endErrorBeforeRequestRef.current = getzoomMeetingErrorResp;

    const payload = {
      updatedByName: userMeResp?.userInfo?.loginId,
    };

    dispatch(
      endScheduledMeetingItemByIdAct(
        generateActionPayload(
          'end_scheduled_meeting_item_by_id',
          {
            id: scheduledMeetingId,
          },
          payload,
        ),
      ),
    );
  }, [
    dispatch,
    endScheduledMeetingsItemByIdResp,
    getzoomMeetingErrorResp,
    scheduledMeetingId,
    userMeResp?.userInfo?.loginId,
  ]);

  const registerMeetingStatusListener = useCallback(() => {
    if (statusListenerRegisteredRef.current) return;

    statusListenerRegisteredRef.current = true;

    ZoomMtg.inMeetingServiceListener(
      'onMeetingStatus',
      (data: ZoomMeetingStatusEvent) => {
        if (data?.status !== zoomMeetingStatus.disconnected) return;

        endScheduledMeeting();
        isJoinedRef.current = false;
        setIsStarted(false);
      },
    );
  }, [endScheduledMeeting]);

  const isZoomLeaveOrEndControl = useCallback((target: EventTarget | null) => {
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

    const finalVisibleOptions = [
      'leave',
      'leave meeting',
      'end meeting',
      'end meeting for all',
      'exit for all',
    ];

    if (finalVisibleOptions.includes(visibleText)) {
      return true;
    }

    return (
      accessibleText.includes('leave meeting') ||
      accessibleText.includes('end meeting') ||
      accessibleText.includes('exit for all')
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
        disableRecord: false,
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

  const { userInfo, contact } = userMeResp || {};
  const { name } = userInfo || {};
  const teacherFullName = `${name?.firstName || ''} ${
    name?.lastName || ''
  }`.trim();
  const teacherEmail = contact?.email || '';

  const joinZoomMeeting = useCallback(
    (signature: string) => {
      return new Promise<void>((resolve, reject) => {
        const joinPayload: Parameters<typeof ZoomMtg.join>[0] = {
          sdkKey,
          signature,

          meetingNumber: cleanMeetingNumber,

          passWord: zoomPasscode,

          userName: teacherFullName,

          success: () => {
            isJoinedRef.current = true;
            setIsStarted(true);
            registerMeetingStatusListener();
            resolve();
          },

          error: (error: unknown) => {
            reject(error);
          },
        };

        if (teacherEmail) {
          joinPayload.userEmail = teacherEmail;
        }

        if (zoomZak) {
          joinPayload.zak = zoomZak;
        }

        ZoomMtg.join(joinPayload);
      });
    },
    [
      cleanMeetingNumber,
      registerMeetingStatusListener,
      sdkKey,
      teacherEmail,
      teacherFullName,
      zoomPasscode,
      zoomZak,
    ],
  );

  const startMeetingAsTeacher = useCallback(async () => {
    try {
      setIsStarting(true);

      if (!sdkKey) {
        throw new Error('Zoom SDK key / Client ID is missing.');
      }

      if (!cleanMeetingNumber) {
        throw new Error('Meeting number is missing.');
      }

      if (!zoomSignature) {
        throw new Error('Zoom meeting signature is missing.');
      }

      await initZoomClient();
      await joinZoomMeeting(zoomSignature);
    } catch (error) {
      console.error('Teacher start error:', error);

      const zoomError =
        error && typeof error === 'object'
          ? (error as { reason?: string; message?: string; errorMessage?:string })
          : {};

      const message =
        zoomError.reason ||
        zoomError.message ||
        zoomError.errorMessage ||
        'Unable to start Zoom meeting as teacher';

      hideZoomRoot();

      navigateToReturnTo(message);
    } finally {
      setIsStarting(false);
    }
  }, [
    cleanMeetingNumber,
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
      !location.state?.autoStart ||
      autoStartRef.current ||
      !cleanMeetingNumber
    ) {
      return;
    }

    autoStartRef.current = true;
    startMeetingAsTeacher();
  }, [
    cleanMeetingNumber,
    hasMeetingId,
    hasValidMeetingNumber,
    location.state?.autoStart,
    navigateToReturnTo,
    startMeetingAsTeacher,
  ]);

  useEffect(() => {
    if (!isStarted) return;

    const handleZoomLeaveOrEndClick = (event: MouseEvent) => {
      if (replayingZoomLeaveClickRef.current || endSubmittedRef.current) {
        return;
      }

      if (!isZoomLeaveOrEndControl(event.target)) {
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
      endScheduledMeeting();
    };

    document.addEventListener('click', handleZoomLeaveOrEndClick, true);

    return () => {
      document.removeEventListener('click', handleZoomLeaveOrEndClick, true);
    };
  }, [endScheduledMeeting, isStarted, isZoomLeaveOrEndControl]);

  useEffect(() => {
    if (
      !endRequestStartedRef.current ||
      endScheduledMeetingsItemByIdResp === endResponseBeforeRequestRef.current
    ) {
      return;
    }

    endSubmittedRef.current = true;
    endRequestStartedRef.current = false;

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
  }, [endScheduledMeetingsItemByIdResp]);

  useEffect(() => {
    if (
      !endRequestStartedRef.current ||
      getzoomMeetingErrorResp === endErrorBeforeRequestRef.current
    ) {
      return;
    }

    endRequestStartedRef.current = false;
    pendingZoomControlRef.current = null;
  }, [getzoomMeetingErrorResp]);

  useEffect(() => {
    if (!isStarted) return;

    const handleBeforeUnload = () => {
      endScheduledMeeting();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      endScheduledMeeting();
    };
  }, [endScheduledMeeting, isStarted]);

  useEffect(() => {
    return () => {
      hideZoomRoot();
    };
  }, [hideZoomRoot]);

  return (
    <div className="tw-py-4">
      <div className="container-fluid"></div>
    </div>
  );
};

export default ZoomMeetForTeacher;

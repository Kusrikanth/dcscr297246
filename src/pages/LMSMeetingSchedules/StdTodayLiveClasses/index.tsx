import { HugeiconsIcon } from '@hugeicons/react';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { Calendar02Icon } from '@hugeicons-pro/core-stroke-standard';
import LiveClassesStats from './LiveClassesStats';
import UpdatedHorizontalTab from '../../../Components/Common/UpdatedHorizontalTab';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, StatusLabel } from '../../../Components/Common';
import { meetingStatusColor } from '../MeetingSchedules/helper';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import {
  getScheduledMeetingItemByIdAct,
  getScheduledMeetingsListAct,
  getScheduledMeetingsStatsAct,
  getZoomMeetingJoinTokenAct,
  joinScheduledMeetingItemByIdAct,
} from '../../../store/lms/zoomMeeting/zoomMeetingActions';
import {
  resetLiveMeetingApiAct,
  setJoinScheduledMeetingsItemByIdAct,
} from '../../../store/lms/zoomMeeting/zoomMeetingSlice';
import { generateActionPayload } from '../../../utility/reduxutility';
import NoDataComp from '../../../Components/Common/NoDataComp';
import { getDdMmYyyyWithMonthNameFormat } from '../../../utility/dateutility';
import { useHistory, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentMeetingCard from './StudentMeetingCard';

const initialState = {
  academicYearId: '',
  studentId: '',
};

const StdTodayLiveClasses = () => {
  const [studentDetailsState, setStudentDetailsState] = useState<any>({});
  const [activeId, setActiveId] = useState<string>('LIVE');
  const [filtersState, setFiltersState] = useState({ ...initialState });
  const [scheduledMeetingsList, setScheduledMeetingsList] = useState<any>([]);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation<{
    zoomMeetingError?: string;
  }>();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 5,
  });
  const isFetchingListRef = useRef(false);
  const pendingJoinMeetingIdRef = useRef<string | number | null>(null);
  const joinMeetingConfirmedRef = useRef(false);

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    getScheduledMeetingsListResp,
    getScheduledMeetingsStatsResp,
    currentInstIdResp: instituteId,
    showApiLoader,
    currentStudentId,
    parentChildrensResp,
    getScheduledMeetingItemByIdResp,
    joinScheduledMeetingsItemByIdResp,
    getzoomMeetingErrorResp,
    getZoomMeetingJoinTokenResp,
  } = useAppSelector(
    ({ appData, instAcademics, zoomMeetings, globalData,directoryStudent }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getScheduledMeetingsListResp: zoomMeetings.getScheduledMeetingsListResp,
      getScheduledMeetingsStatsResp: zoomMeetings.getScheduledMeetingsStatsResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      currentStudentId: appData.currentStudentId,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
      joinScheduledMeetingsItemByIdResp:
        zoomMeetings.joinScheduledMeetingsItemByIdResp,
      getzoomMeetingErrorResp: zoomMeetings.getzoomMeetingErrorResp,
      getZoomMeetingJoinTokenResp: zoomMeetings.getZoomMeetingJoinTokenResp,
    }),
    shallowEqual,
  );

  const MenuOptions = [
    {
      id: 'LIVE',
      labelName: `Today's Meetings`,
      customPadding: '0px 15px',
    },
    {
      id: 'UPCOMING',
      labelName: 'Upcoming Meetings',
      customPadding: '0px 15px',
    },
    {
      id: 'COMPLETED',
      labelName: 'Completed Meetings',
      customPadding: '0px 15px',
    },
    {
      id: 'CANCELLED',
      labelName: 'Cancelled Meetings',
      customPadding: '0px 15px',
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute('data-id');
    if (menuId) {
      setActiveId(menuId);
    }
  }

  const getStatusesByActiveId = useCallback((activeId: string) => {
    if (activeId === 'UPCOMING') {
      return {
        statuses: ['RESCHEDULED', 'SCHEDULED']?.join(','),
      };
    } else if (activeId === 'LIVE') {
      return {
        statuses: null,
        isTodayMeetings: true,
      };
    }

    return {
      statuses: activeId,
    };
  }, []);

  const fetchScheduledMeetingsStats = useCallback(
    (otherProps?: any) => {
      const academicYearId =
        otherProps?.academicYearId ?? filtersState.academicYearId;
      const studentId = otherProps?.studentId ?? currentStudentId;

      if (!instituteId || !branchId || !academicYearId || !studentId) {
        return;
      }

      const payload = {
        instituteId,
        academicYearId,
        branchId,
        studentId,
        ...otherProps,
      };

      dispatch(
        getScheduledMeetingsStatsAct(
          generateActionPayload(
            'get_scheduled_meetings_stats',
            undefined,
            payload,
          ),
        ),
      );
    },
    [
      branchId,
      currentStudentId,
      dispatch,
      filtersState.academicYearId,
      instituteId,
    ],
  );

  const fetchScheduledMeetingsList = useCallback(
    (otherProps?: any) => {
      const academicYearId =
        otherProps?.academicYearId ?? filtersState.academicYearId;
      const studentId = otherProps?.studentId ?? currentStudentId;
      const pageNo = otherProps?.pageNo ?? paginationRef.current.pageNo;
      const pageSize = otherProps?.pageSize ?? paginationRef.current.pageSize;

      if (!instituteId || !branchId || !academicYearId || !studentId) {
        return;
      }

      const payload = {
        instituteId,
        academicYearId,
        branchId,
        pageNo,
        pageSize,
        // sortBy: 'createdAt',
        // orderBy: 'desc',
        studentId,
        ...getStatusesByActiveId(activeId),
        ...otherProps,
      };

      isFetchingListRef.current = true;

      dispatch(
        getScheduledMeetingsListAct(
          generateActionPayload(
            'get_scheduled_meetings_list',
            undefined,
            payload,
          ),
        ),
      );
    },
    [
      activeId,
      branchId,
      currentStudentId,
      dispatch,
      filtersState.academicYearId,
      getStatusesByActiveId,
      instituteId,
    ],
  );

  useEffect(() => {
    if (academicYearListResp) {
      const yearId = academicYearListResp.data.find(
        (year: any) => year.yearStatus?.toLowerCase() === 'current',
      )?.academicYearId;

      if (yearId) {
        setFiltersState((prev) =>
          prev.academicYearId === yearId
            ? prev
            : {
                ...prev,
                academicYearId: yearId,
              },
        );
      }
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (Array.isArray(parentChildrensResp)) {
        const studentInfo = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId);
        setStudentDetailsState(studentInfo);
    }
  }, [currentStudentId, parentChildrensResp]);

  useEffect(() => {
    if (currentStudentId) {
      setFiltersState((prev) =>
        prev.studentId === currentStudentId
          ? prev
          : {
              ...prev,
              studentId: currentStudentId,
            },
      );
    }
  }, [currentStudentId]);

  const {
    content: getScheduledMeetingsList,
    totalPages,
    pageble,
  } = getScheduledMeetingsListResp || {};

  const { academicYearId } = filtersState || {};

  useEffect(() => {
    if (academicYearId) {
      fetchScheduledMeetingsStats({ academicYearId });
    }
  }, [academicYearId, fetchScheduledMeetingsStats]);

  useEffect(() => {
    if (academicYearId && currentStudentId) {
      paginationRef.current.pageNo = 0;
      setScheduledMeetingsList([]);
      fetchScheduledMeetingsList({
        academicYearId,
        studentId: currentStudentId,
        pageNo: 0,
      });
    }
  }, [academicYearId, activeId, currentStudentId, fetchScheduledMeetingsList]);

  useEffect(() => {
    if (Array.isArray(getScheduledMeetingsList)) {
      const responsePageNo =
        pageble?.pageNumber ??
        getScheduledMeetingsListResp?.pageable?.pageNumber ??
        paginationRef.current.pageNo;

      setScheduledMeetingsList((prev) =>
        responsePageNo === 0
          ? getScheduledMeetingsList
          : [...prev, ...getScheduledMeetingsList],
      );
    }

    isFetchingListRef.current = false;
  }, [
    getScheduledMeetingsList,
    getScheduledMeetingsListResp,
    pageble?.pageNumber,
  ]);

  useEffect(() => {
    function handleScroll() {
      const currentPageNo =
        pageble?.pageNumber ??
        getScheduledMeetingsListResp?.pageable?.pageNumber ??
        paginationRef.current.pageNo;
      const nextPageNo = currentPageNo + 1;
      const hasNextPage = nextPageNo < (totalPages || 0);
      const isNearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      if (
        isNearBottom &&
        hasNextPage &&
        !showApiLoader &&
        !isFetchingListRef.current
      ) {
        paginationRef.current.pageNo = nextPageNo;
        fetchScheduledMeetingsList({ pageNo: nextPageNo });
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    fetchScheduledMeetingsList,
    getScheduledMeetingsListResp,
    pageble?.pageNumber,
    showApiLoader,
    totalPages,
  ]);

  const { createdByName } = getScheduledMeetingItemByIdResp || {};

  const liveClassesRef = useRef({
    prevJoinScheduledMeetingsItemByIdResp: joinScheduledMeetingsItemByIdResp,
    prevGetzoomMeetingErrorResp: getzoomMeetingErrorResp,
  });

  useEffect(() => {
    const zoomMeetingError = location.state?.zoomMeetingError;

    if (zoomMeetingError) {
      toast.error(zoomMeetingError);
      history.replace({
        ...location,
        state: undefined,
      });
    }
  }, [history, location]);

  function fetchScheduledMeetingItemById(id: any) {
    dispatch(
      getScheduledMeetingItemByIdAct(
        generateActionPayload('get_scheduled_meeting_item_by_id', { id: id }),
      ),
    );
  }

  function fetchZoomMeetingJoinToken() {
    const sectionId = studentDetailsState?.sectionId;

    if (!sectionId) {
      toast.error('Student section details are missing');
      return false;
    }

    dispatch(
      getZoomMeetingJoinTokenAct(
        generateActionPayload('get_zoom_meeting_join_token', { sectionId }),
      ),
    );

    return true;
  }

  function joinScheduledMeetingsItemByIdCall(meetingId?: any) {
    if (!meetingId) return;

    if (!fetchZoomMeetingJoinToken()) return;

    const payload = {
      studentId: currentStudentId,
      createdByName,
    };

    pendingJoinMeetingIdRef.current = meetingId;
    joinMeetingConfirmedRef.current = false;
    dispatch(resetLiveMeetingApiAct());
    fetchScheduledMeetingItemById(meetingId);

    dispatch(
      joinScheduledMeetingItemByIdAct(
        generateActionPayload(
          'join_scheduled_meeting_item_by_id',
          {
            id: meetingId,
          },
          payload,
        ),
      ),
    );
  }

  useEffect(() => {
    const {
      prevJoinScheduledMeetingsItemByIdResp,
      prevGetzoomMeetingErrorResp,
    } = liveClassesRef.current;
    const pendingJoinMeetingId = pendingJoinMeetingIdRef.current;
    const responseMeetingId = getScheduledMeetingItemByIdResp?.id;
    const hasZoomJoinToken = Boolean(getZoomMeetingJoinTokenResp);

    if (
      joinScheduledMeetingsItemByIdResp &&
      joinScheduledMeetingsItemByIdResp !==
        prevJoinScheduledMeetingsItemByIdResp
    ) {
      joinMeetingConfirmedRef.current = true;
    } else if (
      getzoomMeetingErrorResp &&
      getzoomMeetingErrorResp !== prevGetzoomMeetingErrorResp
    ) {
      const { message } = getzoomMeetingErrorResp;
      pendingJoinMeetingIdRef.current = null;
      joinMeetingConfirmedRef.current = false;
      toast.error(message || 'Something went wrong');
    }

    if (
      joinMeetingConfirmedRef.current &&
      hasZoomJoinToken &&
      pendingJoinMeetingId &&
      responseMeetingId &&
      `${responseMeetingId}` === `${pendingJoinMeetingId}`
    ) {
      const { sessionId } = joinScheduledMeetingsItemByIdResp || {};

      pendingJoinMeetingIdRef.current = null;
      joinMeetingConfirmedRef.current = false;
      dispatch(setJoinScheduledMeetingsItemByIdAct(undefined));
      history.push('/live-classes/student-meet', {
        autoJoin: true,
        meetingId: pendingJoinMeetingId,
        returnTo: '/live-classes',
        sessionId,
        zoomJoinTokenDetails: getZoomMeetingJoinTokenResp,
      });
    }

    liveClassesRef.current.prevJoinScheduledMeetingsItemByIdResp =
      joinScheduledMeetingsItemByIdResp;
    liveClassesRef.current.prevGetzoomMeetingErrorResp =
      getzoomMeetingErrorResp;
  }, [
    dispatch,
    getScheduledMeetingItemByIdResp,
    getZoomMeetingJoinTokenResp,
    getzoomMeetingErrorResp,
    history,
    joinScheduledMeetingsItemByIdResp,
  ]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Meetings" pageTitle="Meetings" />

          <div className="tw-mb-4 tw-flex tw-justify-between tw-items-center">
            <div className="tw-flex tw-items-center tw-gap-2">
              <div
                className="tw-border tw-border-[#BFDBFE] tw-rounded-lg tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center"
                style={{
                  background: '#F3F4F6 0% 0% no-repeat padding-box',
                }}
              >
                <HugeiconsIcon icon={Calendar02Icon} size={18}></HugeiconsIcon>
              </div>
              <div className="">
                <h4 className="tw-card-title tw-flex tw-items-center tw-text-xl">
                  Online Classes
                </h4>
              </div>
            </div>
          </div>

          <LiveClassesStats statsData={getScheduledMeetingsStatsResp || {}} />

          <div className="tw-mt-4 tw-mb-6">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              showBadge={true}
              horizontalClass="mb-0 overflow-auto text-nowrap"
            />

            <div className="tw-space-y-4 tw-mt-6">
              {scheduledMeetingsList.length > 0 ? (
                scheduledMeetingsList.map((clsItem:any) => (
                  <StudentMeetingCard
                    key={clsItem?.id}
                    activeTabId={activeId}
                    clsItem={clsItem}
                    onJoinMeeting={joinScheduledMeetingsItemByIdCall}
                  />
                ))
              ) : (
                <div className="tw-card">
                  <div className="tw-card-body">
                    <NoDataComp />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StdTodayLiveClasses;

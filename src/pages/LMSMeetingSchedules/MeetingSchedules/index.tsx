import { HugeiconsIcon } from '@hugeicons/react';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import {
  AddTeamIcon,
  Calendar02Icon,
  Cancel01Icon,
  Delete02Icon,
  Edit03Icon,
  GridViewIcon,
  LeftToRightListBulletIcon,
  LinkForwardIcon,
  PlusSignIcon,
  ReloadIcon,
  ViewIcon,
} from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../Components/Common/Button';
import SchedulesStatsList from './SchedulesStatsList';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import UpdatedHorizontalTab from '../../../Components/Common/UpdatedHorizontalTab';
import {
  ModalContainerUpdated,
  SelectInput,
  TextInput,
} from '../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getBranchCurriculumAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../utility/reduxutility';

import { generateColumns } from './helper';
import AddEditScheduleMeeting from './AddEditScheduleMeeting';
import { useModal } from '../../../hooks/modalhook';
import classnames from 'classnames';
import { useHistory, useLocation } from 'react-router-dom';
import {
  cancelScheduledMeetingsItemByIdAct,
  getScheduledMeetingItemByIdAct,
  getScheduledMeetingsListAct,
  getScheduledMeetingsStatsAct,
  getZoomMeetingJoinTokenAct,
  reStartScheduledMeetingItemByIdAct,
  startScheduledMeetingItemByIdAct,
} from '../../../store/lms/zoomMeeting/zoomMeetingActions';
import {
  resetLiveMeetingApiAct,
  resetScheduledMeetingsListAct,
  setReStartScheduledMeetingsItemByIdAct,
  setStartScheduledMeetingItemByIdAct,
} from '../../../store/lms/zoomMeeting/zoomMeetingSlice';
import { IPaginationState } from '../../../Components/Common/Pagination';
import MeetingGridView from './MeetingGridView';
import TableContainer from '../../../Components/Common/TableContainer';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import LiveClassesStats from '../StdTodayLiveClasses/LiveClassesStats';
import StartScheduleMeetingModal from './StartScheduleMeetingModal';
import {
  getAssignLanClassListAct,
  getAssignLanSectionListAct,
} from '../../../store/assignlanguages/assignlanguagesaction';
import {
  resetAssignLanClassListAct,
  resetAssignLanSectionListAct,
} from '../../../store/assignlanguages/assignlanguagesslice';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';

const initialState = {
  searchString: '',
  academicYearId: '',
  curriculumId: '',
  classId: '',
  sectionId: '',
  fromDate: '',
  toDate: '',
};

const getStartOfDayDateTime = (date?: string) =>
  date ? `${date.split('T')[0]}T00:00:00` : '';

const getEndOfDayDateTime = (date?: string) =>
  date ? `${date.split('T')[0]}T23:59:59` : '';

const MeetingSchedules = () => {
  const [activeId, setActiveId] = useState<any>('LIVE');
  const [activeViewType, setActiveViewType] = useState('tableView');
  const [filtersState, setFiltersState] = useState({ ...initialState });
  const dispatch = useAppDispatch();
  const {
    closeModal: addEditScheduleMeetingCloseModal,
    modalState: addEditScheduleMeetingModalState,
    openModal: addEditScheduleMeetingOpenModal,
  } = useModal();
  const {
    closeModal: delScheduleMeetingCloseModal,
    modalState: delScheduleMeetingModalState,
    openModal: delScheduleMeetingOpenModal,
  } = useModal();
  const {
    closeModal: startScheduleMeetingCloseModal,
    modalState: startScheduleMeetingModalState,
    openModal: startScheduleMeetingOpenModal,
  } = useModal();
  const history = useHistory();
  const location = useLocation<{
    zoomMeetingError?: string;
  }>();
  const pendingStartMeetingIdRef = useRef<string | number | null>(null);
  const startMeetingConfirmedRef = useRef(false);

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    getScheduledMeetingsListResp,
    getScheduledMeetingItemByIdResp,
    saveScheduledMeetingItemResp,
    editScheduledMeetingItemByIdResp,
    reScheduleScheduledMeetingItemByIdResp,
    cancelScheduledMeetingsItemByIdResp,
    getzoomMeetingErrorResp,
    getScheduledMeetingsStatsResp,
    startScheduledMeetingsItemByIdResp,
    reStartScheduledMeetingsItemByIdResp,
    getZoomMeetingJoinTokenResp,
    currentInstIdResp: instituteId,
    showApiLoader,
    loggedInUserRole,
    userMeResp,
    getAssignLanClassListResp,
    getAssignLanSectionListResp,
  } = useAppSelector(
    ({
      appData,
      instAcademics,
      branchAcademics,
      zoomMeetings,
      globalData,
      login,
      assignLanguages,
    }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getScheduledMeetingsListResp: zoomMeetings.getScheduledMeetingsListResp,
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
      saveScheduledMeetingItemResp: zoomMeetings.saveScheduledMeetingItemResp,
      cancelScheduledMeetingsItemByIdResp:
        zoomMeetings.cancelScheduledMeetingsItemByIdResp,
      editScheduledMeetingItemByIdResp:
        zoomMeetings.editScheduledMeetingItemByIdResp,
      reScheduleScheduledMeetingItemByIdResp:
        zoomMeetings.reScheduleScheduledMeetingItemByIdResp,
      getzoomMeetingErrorResp: zoomMeetings.getzoomMeetingErrorResp,
      getScheduledMeetingsStatsResp: zoomMeetings.getScheduledMeetingsStatsResp,
      startScheduledMeetingsItemByIdResp:
        zoomMeetings.startScheduledMeetingsItemByIdResp,
      reStartScheduledMeetingsItemByIdResp:
        zoomMeetings.reStartScheduledMeetingsItemByIdResp,
      getZoomMeetingJoinTokenResp: zoomMeetings.getZoomMeetingJoinTokenResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      loggedInUserRole: appData.loggedInUserRole,
      userMeResp: login.userMeResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
    }),
    shallowEqual,
  );

  const isTeacher = loggedInUserRole && loggedInUserRole === 'TEACHER';

  function handleViewChange(viewType: string) {
    setActiveViewType(viewType);
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: filtersState.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'curriculumName',
      orderBy: 'asc',
      ...otherProps,
    };

    dispatch(
      getBranchCurriculumAct(
        generateActionPayload('get_brch_curriculum', undefined, payload),
      ),
    );
  }
  function fetchClassesList(otherProps?: any) {
    const { academicYearId, curriculumId } = filtersState || {};

    const payload = {
      academicYearId: academicYearId,
      curriculumId: curriculumId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'classSequence',
      orderBy: 'asc',
      moduleName:"EXAMINATION",
      ...otherProps,
    };

    dispatch(
      getAssignLanClassListAct(
        generateActionPayload('get_brch_curriculum_class', undefined, payload),
      ),
    );
  }
  function fetchSectionsList(otherProps?: any) {
    const { academicYearId, curriculumId, classId } = filtersState || {};
    const payload = {
      branchId,
      masterAcademicYearId: academicYearId,
      curriculumId: curriculumId,
      branchClassId: classId,
      pageNo: 0,
      pageSize: 100,
      sortBy: 'sectionName',
      orderBy: 'asc',
      ...otherProps,
    };

    dispatch(
      getAssignLanSectionListAct(
        generateActionPayload('get_section_list', undefined, payload),
      ),
    );
  }

  const getStatusesByActiveId = (activeId: string) => {
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
  };

  function fetchScheduledMeetingsList(otherProps?: any) {
    const { academicYearId, curriculumId, classId, sectionId, searchString } =
      filtersState || {};
    const { pageNo, pageSize } = paginationRef.current;

    const payload: any = {
      instituteId,
      academicYearId,
      curriculumId,
      classId,
      sectionId,
      branchId,
      pageNo,
      pageSize,
      // sortBy: 'createdAt',
      // orderBy: 'desc',
      searchString,
      ...getStatusesByActiveId(activeId),
      ...otherProps,
    };

    if (activeId !== 'LIVE') {
      payload.fromDate = getStartOfDayDateTime(
        otherProps?.fromDate ?? filtersState.fromDate,
      );
      payload.toDate = getEndOfDayDateTime(
        otherProps?.toDate ?? filtersState.toDate,
      );
    }

    dispatch(
      getScheduledMeetingsListAct(
        generateActionPayload(
          'get_scheduled_meetings_list',
          undefined,
          payload,
        ),
      ),
    );
  }
  function fetchScheduledMeetingsStats(otherProps?: any) {
    const { academicYearId } = filtersState || {};
    const payload = {
      instituteId,
      academicYearId,
      branchId,
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
  }

  function fetchScheduledMeetingItemById(id: any) {
    dispatch(
      getScheduledMeetingItemByIdAct(
        generateActionPayload('get_scheduled_meeting_item_by_id', { id: id }),
      ),
    );
  }

  function delScheduledMeetingsItemByIdCall(reason: any) {
    const payload = {
      reason: reason,
    };

    dispatch(
      cancelScheduledMeetingsItemByIdAct(
        generateActionPayload(
          'cancel_scheduled_meetings_item_by_id',
          { id: delScheduleMeetingModalState.modalData },
          payload,
        ),
      ),
    );
  }

  function fetchZoomMeetingJoinToken(sectionId: any) {
    if (!sectionId) {
      toast.error('Section Id are missing');
      return false;
    }

    dispatch(
      getZoomMeetingJoinTokenAct(
        generateActionPayload('get_zoom_meeting_join_token', { sectionId }),
      ),
    );

    return true;
  }

  function startScheduledMeetingsItemByIdCall(
    meeting?: any,
    meetingSectionId?: any,
  ) {
    const selectedMeeting = meeting ?? startScheduleMeetingModalState.modalData;
    const meetingId =
      typeof selectedMeeting === 'object'
        ? selectedMeeting?.id
        : selectedMeeting;

    if (!meetingId || !meetingSectionId) return;

    const payload = {
      updatedByName: userMeResp?.userInfo?.loginId || '',
    };

    pendingStartMeetingIdRef.current = meetingId;
    startMeetingConfirmedRef.current = false;
    dispatch(resetLiveMeetingApiAct());
    fetchScheduledMeetingItemById(meetingId);
    fetchZoomMeetingJoinToken(meetingSectionId);

    dispatch(
      startScheduledMeetingItemByIdAct(
        generateActionPayload(
          'start_scheduled_meeting_item_by_id',
          {
            id: meetingId,
          },
          payload,
        ),
      ),
    );
  }
  function reStartScheduledMeetingsItemByIdCall(
    meeting?: any,
    meetingSectionId?: any,
  ) {
    const selectedMeeting = meeting ?? startScheduleMeetingModalState.modalData;
    const meetingId =
      typeof selectedMeeting === 'object'
        ? selectedMeeting?.id
        : selectedMeeting;

    if (!meetingId || !meetingSectionId) return;

    const payload = {
      updatedByName: userMeResp?.userInfo?.loginId || 'Teacher',
    };

    pendingStartMeetingIdRef.current = meetingId;
    startMeetingConfirmedRef.current = false;
    dispatch(resetLiveMeetingApiAct());
    fetchScheduledMeetingItemById(meetingId);
    fetchZoomMeetingJoinToken(meetingSectionId);

    dispatch(
      reStartScheduledMeetingItemByIdAct(
        generateActionPayload(
          'restart_scheduled_meeting_item_by_id',
          {
            id: meetingId,
          },
          payload,
        ),
      ),
    );
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    fetchScheduledMeetingsList();
  }

  function filterHandler(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    paginationRef.current.pageNo = 0;

    if (name === 'curriculumId') {
      setFiltersState((prev) => ({
        ...prev,
        curriculumId: value,
        classId: '',
        sectionId: '',
      }));

      dispatch(resetAssignLanSectionListAct(undefined));

      if (value) {
        fetchClassesList({ curriculumId: value });
      } else {
        dispatch(resetScheduledMeetingsListAct(undefined));
        dispatch(resetAssignLanClassListAct(undefined));
      }

      return;
    }

    if (name === 'classId') {
      setFiltersState((prev) => ({
        ...prev,
        classId: value,
        sectionId: '',
      }));

      dispatch(resetAssignLanSectionListAct(undefined));

      if (value) {
        fetchSectionsList({ branchClassId: value });
      }

      return;
    }

    if (name === 'sectionId') {
      setFiltersState((prev) => ({
        ...prev,
        sectionId: value,
      }));

      return;
    }

    if (name === 'searchString') {
      setFiltersState((prev) => ({
        ...prev,
        [name]: value,
      }));
      fetchScheduledMeetingsList({
        searchString: value,
      });

      return;
    }

    setFiltersState((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleDateChange = ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    const fromDate = startDate;
    const toDate = endDate;

    paginationRef.current.pageNo = 0;

    setFiltersState((prev) => ({
      ...prev,
      fromDate,
      toDate,
    }));
    fetchScheduledMeetingsList({ fromDate, toDate, pageNo: 0 });
  };

  const menuOptions = useMemo(() => {
    const actionIdsByTab = {
      LIVE: ['view-details', 'edit', 'reschedule', 'cancel'],
      UPCOMING: [
        'view-details',
        'add-participants',
        'forward',
        'edit',
        'reschedule',
        'cancel',
      ],
      COMPLETED: ['view-details', 'edit', 'reschedule', 'cancel'],
      CANCELLED: ['view-details'],
    };

    const actionOptions = [
      {
        id: 'view-details',
        actionIcon: (
          <HugeiconsIcon
            icon={ViewIcon}
            className="me-2 text-primary"
            size={18}
          />
        ),
        actionName: <span className="text-primary">View details</span>,
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute('data-id');
          history.push('/meeting-schedules/meeting-details', {
            meetingId: id,
          });
          fetchScheduledMeetingItemById(id);
        },
      },
      // {
      //   id: 'add-participants',
      //   actionIcon: (
      //     <HugeiconsIcon
      //       icon={AddTeamIcon}
      //       className="me-2 text-success"
      //       size={18}
      //     />
      //   ),
      //   actionName: <span className="text-success">Add participants</span>,
      //   onClickHndlr: () => {},
      // },
      // {
      //   id: 'forward',
      //   actionIcon: (
      //     <HugeiconsIcon
      //       icon={LinkForwardIcon}
      //       className="me-2 text-primary"
      //       size={18}
      //     />
      //   ),
      //   actionName: <span className="text-primary">Forward</span>,
      //   onClickHndlr: () => {},
      // },
      {
        id: 'edit',
        actionIcon: (
          <HugeiconsIcon
            icon={Edit03Icon}
            className="me-2 text-secondary"
            size={18}
          />
        ),
        actionName: <span className="text-secondary">Edit</span>,
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute('data-id');
          addEditScheduleMeetingOpenModal({ id: id, type: 'edit' });
          fetchScheduledMeetingItemById(id);
        },
      },
      {
        id: 'reschedule',
        actionIcon: (
          <HugeiconsIcon
            icon={Calendar02Icon}
            className="me-2 text-secondary"
            size={18}
          />
        ),
        actionName: <span className="text-secondary">Reschedule</span>,
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute('data-id');
          addEditScheduleMeetingOpenModal({ id: id, type: 'reSchedule' });
          fetchScheduledMeetingItemById(id);
        },
      },
      {
        id: 'cancel',
        actionIcon: (
          <HugeiconsIcon
            icon={Cancel01Icon}
            className="me-2 tw-text-red-500"
            size={18}
          />
        ),
        actionName: <span className="tw-text-red-500">Cancel</span>,
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          delScheduleMeetingOpenModal(id);
        },
      },
    ];

    const activeActionIds = actionIdsByTab[activeId] || [];

    return actionOptions.filter((option) =>
      activeActionIds.includes(option.id),
    );
  }, [activeId, history]);

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
    setActiveId(menuId);

    if (menuId === 'LIVE') {
      setFiltersState((prev) => ({
        ...prev,
        fromDate: '',
        toDate: '',
      }));
    }
  }

  const startMeetingHandler = useCallback((meeting?: any) => {
    startScheduleMeetingOpenModal(meeting);
  }, []);

  const tableColumns = useMemo(
    () =>
      generateColumns(menuOptions, isTeacher, activeId, startMeetingHandler),
    [activeId, isTeacher, menuOptions, startMeetingHandler],
  );

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === 'current',
      )?.academicYearId;

    if (yearId) {
      setFiltersState((prev) => ({ ...prev, academicYearId: yearId }));
      fetchCurriculumList({ academicYearId: yearId });
      fetchScheduledMeetingsStats({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const { academicYearId } = filtersState || {};
    if (academicYearId && brchCurriculumResp && brchCurriculumResp.data.length > 0) {
      const curriculumId =
        brchCurriculumResp?.data?.[0]?.branchCurriculumId || '';

      setFiltersState((prev) => ({
        ...prev,
        curriculumId,
        classId: '',
        sectionId: '',
      }));

      if (curriculumId) {
        fetchClassesList({ curriculumId });
      }
    }
  }, [brchCurriculumResp]);

  useEffect(() => {
    const { academicYearId, curriculumId, classId, sectionId } =
      filtersState || {};

    if (academicYearId && curriculumId) {
      paginationRef.current.pageNo = 0;

      fetchScheduledMeetingsList({
        academicYearId,
        curriculumId,
        classId,
        sectionId,
        pageNo: 0,
      });
    }
  }, [
    activeId,
    filtersState.academicYearId,
    filtersState.curriculumId,
    filtersState.classId,
    filtersState.sectionId,
  ]);

  const meetingScheduleRef = useRef({
    prevSaveScheduledMeetingItemResp: saveScheduledMeetingItemResp,
    prevCancelScheduledMeetingsItemByIdResp:
      cancelScheduledMeetingsItemByIdResp,
    prevEditScheduledMeetingItemByIdResp: editScheduledMeetingItemByIdResp,
    prevReScheduleScheduledMeetingItemByIdResp:
      reScheduleScheduledMeetingItemByIdResp,
    prevStartScheduledMeetingsItemByIdResp: startScheduledMeetingsItemByIdResp,
    prevReStartScheduledMeetingsItemByIdResp:
      reStartScheduledMeetingsItemByIdResp,
    prevGetzoomMeetingErrorResp: getzoomMeetingErrorResp,
  });

  useEffect(() => {
    const zoomMeetingError =
      location.state?.zoomMeetingError ||
      sessionStorage.getItem('zoomMeetingError');

    if (!zoomMeetingError) return;

    sessionStorage.removeItem('zoomMeetingError');
    toast.error(zoomMeetingError);
  }, [location.state]);

  useEffect(() => {
    const {
      prevSaveScheduledMeetingItemResp,
      prevCancelScheduledMeetingsItemByIdResp,
      prevEditScheduledMeetingItemByIdResp,
      prevReScheduleScheduledMeetingItemByIdResp,
      prevStartScheduledMeetingsItemByIdResp,
      prevReStartScheduledMeetingsItemByIdResp,
      prevGetzoomMeetingErrorResp,
    } = meetingScheduleRef.current;

    const pendingStartMeetingId = pendingStartMeetingIdRef.current;
    const responseMeetingId = getScheduledMeetingItemByIdResp?.id;
    const hasZoomJoinToken = Boolean(getZoomMeetingJoinTokenResp);

    if (
      saveScheduledMeetingItemResp &&
      saveScheduledMeetingItemResp !== prevSaveScheduledMeetingItemResp
    ) {
      toast.success('Meetings deatils updated successfully');
      fetchScheduledMeetingsList();
      fetchScheduledMeetingsStats();
      addEditScheduleMeetingCloseModal();
    } else if (
      editScheduledMeetingItemByIdResp &&
      editScheduledMeetingItemByIdResp !== prevEditScheduledMeetingItemByIdResp
    ) {
      toast.success('Meeting edited successfully');
      fetchScheduledMeetingsList();
      addEditScheduleMeetingCloseModal();
    } else if (
      reScheduleScheduledMeetingItemByIdResp &&
      reScheduleScheduledMeetingItemByIdResp !==
        prevReScheduleScheduledMeetingItemByIdResp
    ) {
      toast.success('Meeting rescheduled successfully');
      fetchScheduledMeetingsList();
      addEditScheduleMeetingCloseModal();
    } else if (
      cancelScheduledMeetingsItemByIdResp &&
      cancelScheduledMeetingsItemByIdResp !==
        prevCancelScheduledMeetingsItemByIdResp
    ) {
      toast.success('Meeting canceled successfully');
      fetchScheduledMeetingsList();
      fetchScheduledMeetingsStats();
      delScheduleMeetingCloseModal();
    } else if (
      startScheduledMeetingsItemByIdResp &&
      startScheduledMeetingsItemByIdResp !==
        prevStartScheduledMeetingsItemByIdResp
    ) {
      startMeetingConfirmedRef.current = true;
    } else if (
      reStartScheduledMeetingsItemByIdResp &&
      reStartScheduledMeetingsItemByIdResp !==
        prevReStartScheduledMeetingsItemByIdResp
    ) {
      startMeetingConfirmedRef.current = true;
    } else if (
      getzoomMeetingErrorResp &&
      getzoomMeetingErrorResp !== prevGetzoomMeetingErrorResp
    ) {
      const { message } = getzoomMeetingErrorResp;
      pendingStartMeetingIdRef.current = null;
      startMeetingConfirmedRef.current = false;
      toast.error(message || 'Something went wrong');
    }

    if (
      startMeetingConfirmedRef.current &&
      hasZoomJoinToken &&
      pendingStartMeetingId &&
      responseMeetingId &&
      `${responseMeetingId}` === `${pendingStartMeetingId}`
    ) {
      pendingStartMeetingIdRef.current = null;
      startMeetingConfirmedRef.current = false;
      startScheduleMeetingCloseModal();
      dispatch(setStartScheduledMeetingItemByIdAct(undefined));
      dispatch(setReStartScheduledMeetingsItemByIdAct(undefined));
      history.push('/meeting-schedules/zoom-meet-for-teacher', {
        autoStart: true,
        meetingId: pendingStartMeetingId,
        returnTo: '/meeting-schedules',
        zoomJoinTokenDetails: getZoomMeetingJoinTokenResp,
      });
    }

    meetingScheduleRef.current.prevSaveScheduledMeetingItemResp =
      saveScheduledMeetingItemResp;
    meetingScheduleRef.current.prevCancelScheduledMeetingsItemByIdResp =
      cancelScheduledMeetingsItemByIdResp;
    meetingScheduleRef.current.prevEditScheduledMeetingItemByIdResp =
      editScheduledMeetingItemByIdResp;
    meetingScheduleRef.current.prevReScheduleScheduledMeetingItemByIdResp =
      reScheduleScheduledMeetingItemByIdResp;
    meetingScheduleRef.current.prevStartScheduledMeetingsItemByIdResp =
      startScheduledMeetingsItemByIdResp;
    meetingScheduleRef.current.prevReStartScheduledMeetingsItemByIdResp =
      reStartScheduledMeetingsItemByIdResp;
    meetingScheduleRef.current.prevGetzoomMeetingErrorResp =
      getzoomMeetingErrorResp;
  }, [
    saveScheduledMeetingItemResp,
    editScheduledMeetingItemByIdResp,
    reScheduleScheduledMeetingItemByIdResp,
    cancelScheduledMeetingsItemByIdResp,
    startScheduledMeetingsItemByIdResp,
    reStartScheduledMeetingsItemByIdResp,
    getScheduledMeetingItemByIdResp,
    getZoomMeetingJoinTokenResp,
    getzoomMeetingErrorResp,
  ]);

  const {
    content: getScheduledMeetingsList,
    totalElements,
    totalPages,
    pageble,
  } = getScheduledMeetingsListResp || {};

  const showClearFilters = Boolean(
    filtersState.classId ||
    filtersState.sectionId ||
    filtersState.fromDate ||
    filtersState.toDate,
  );

  function clearFiltersHandler() {
    paginationRef.current.pageNo = 0;

    setFiltersState((prev) => ({
      ...prev,
      searchString: '',
      classId: '',
      sectionId: '',
      fromDate: '',
      toDate: '',
    }));

    dispatch(resetAssignLanSectionListAct(undefined));
    dispatch(resetScheduledMeetingsListAct(undefined));
    fetchScheduledMeetingsList();
  }

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
              <h4 className="tw-card-title tw-flex tw-items-center tw-text-xl">
                Meeting schedules
              </h4>
            </div>

            <div className="tw-flex tw-items-center tw-gap-2">
              {/* <Button variant="secondary" size="sm">
                <HugeiconsIcon icon={ReloadIcon} size={16}></HugeiconsIcon>
                exportBtn
              </Button> */}
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  addEditScheduleMeetingOpenModal({ id: null, type: 'add' })
                }
              >
                <HugeiconsIcon icon={PlusSignIcon} size={16}></HugeiconsIcon>
                Schedule Meeting
              </Button>
            </div>
          </div>

          <LiveClassesStats statsData={getScheduledMeetingsStatsResp || {}} />

          <div className="tw-card tw-mt-4">
            <div className="tw-card-header tw-pb-0 tw-flex tw-justify-between">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="mb-0 overflow-auto text-nowrap"
              />

              {isTeacher ? null : (
                <div className="list-grid-nav hstack gap-1 tw-mb-2">
                  <button
                    className={classnames(
                      'btn btn-soft-info nav-link btn-icon fs-14 filter-button',
                      { active: activeViewType === 'tableView' },
                    )}
                    onClick={() => handleViewChange('tableView')}
                  >
                    <HugeiconsIcon icon={LeftToRightListBulletIcon} size={18} />
                  </button>
                  <button
                    className={classnames(
                      'btn btn-soft-info nav-link btn-icon fs-14 filter-button',
                      { active: activeViewType === 'gridView' },
                    )}
                    onClick={() => handleViewChange('gridView')}
                  >
                    <HugeiconsIcon icon={GridViewIcon} size={18} />
                  </button>
                </div>
              )}
            </div>

            <div className="tw-card-body">
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-relative">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        value={filtersState.searchString}
                        onChange={filterHandler}
                        formgroupClassName="tw-mb-0"
                        labelText="Search"
                        placeHolder="Search tile or description"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="curriculumId"
                    value={filtersState.curriculumId}
                    onChange={filterHandler}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="shortName"
                    labelText="Curriculum"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>
                <div className="tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={filtersState.classId}
                    onChange={filterHandler}
                    menuItems={getAssignLanClassListResp?.content || []}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>
                <div className="tw-col-span-6 xl:tw-col-span-2">
                  <SelectInput
                    name="sectionId"
                    value={filtersState.sectionId}
                    onChange={filterHandler}
                    menuItems={getAssignLanSectionListResp?.data || []}
                    valueKey="sectionId"
                    textKey="sectionName"
                    labelText="Section"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>
                {activeId !== 'LIVE' ? (
                  <div className="tw-col-span-6 xl:tw-col-span-2">
                    <CustomDatePicker
                      name="dateRange"
                      startDate={filtersState.fromDate}
                      endDate={filtersState.toDate}
                      onChange={handleDateChange}
                      placeholder="Select a Date Range"
                      monthsShown={2}
                      formgroupClassName="tw-mb-0"
                      labelText="Date Range"
                      floatingLabel
                      // portalId={'calendar-dateRange'}
                    />
                  </div>
                ) : null}
                {showClearFilters ? (
                  <div className="tw-col-span-1">
                    <Button variant="wrong" onClick={clearFiltersHandler}>
                      Clear
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            {activeViewType === 'tableView' ? (
              <div className="tw-card">
                <div className="tw-card-body tw-p-0">
                  <TableContainer
                    columns={tableColumns || []}
                    data={
                      Array.isArray(getScheduledMeetingsList) &&
                      getScheduledMeetingsList.length > 0
                        ? getScheduledMeetingsList
                        : []
                    }
                    divClass="table-responsive mb-1"
                    theadClass="table-light text-muted align-middle"
                    showPagination={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageble?.pageNumber || 0}
                  ></TableContainer>
                </div>
              </div>
            ) : (
              <MeetingGridView
                data={
                  Array.isArray(getScheduledMeetingsList) &&
                  getScheduledMeetingsList.length > 0
                    ? getScheduledMeetingsList
                    : []
                }
                menuOptions={menuOptions}
                activeTabId={activeId}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageble?.pageNumber || 0}
              ></MeetingGridView>
            )}
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="addEditScheduleMeeting"
        isOpen={addEditScheduleMeetingModalState.showModal}
        toggle={addEditScheduleMeetingCloseModal}
        modalTitle={`${addEditScheduleMeetingModalState?.modalData?.type === 'edit' ? 'Edit Meeting' : addEditScheduleMeetingModalState?.modalData?.type === 'reSchedule' ? 'Reschedule the Meeting' : 'Schedule Meeting'}`}
        // modalSubtitle={
        //   <div className="tw-text-sm mb-0">
        //     <p className="tw-mb-0 tw-text-gray-500">
        //       Create a new meeting for your students
        //     </p>
        //   </div>
        // }
        headerClassName="tw-flex"
        modalSize="lg"
      >
        <AddEditScheduleMeeting
          onClose={addEditScheduleMeetingCloseModal}
          editItem={addEditScheduleMeetingModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="delScheduleMeetingModal"
        isOpen={delScheduleMeetingModalState.showModal}
        toggle={delScheduleMeetingCloseModal}
        modalSize="md"
        hideHeader={true}
      >
        <DeleteConfirmationModal
          cancelHndlr={delScheduleMeetingCloseModal}
          confirmHndlr={delScheduledMeetingsItemByIdCall}
          isDisble={showApiLoader}
        ></DeleteConfirmationModal>
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="startScheduleMeetingModal"
        isOpen={startScheduleMeetingModalState.showModal}
        toggle={startScheduleMeetingCloseModal}
        modalSize="md"
        modalTitle="Start Meeting"
      >
        <StartScheduleMeetingModal
          cancelHndlr={startScheduleMeetingCloseModal}
          isDisble={showApiLoader}
          meeting={startScheduleMeetingModalState.modalData}
          reStartScheduledHandler={reStartScheduledMeetingsItemByIdCall}
          startScheduledHandler={startScheduledMeetingsItemByIdCall}
        ></StartScheduleMeetingModal>
      </ModalContainerUpdated>
    </>
  );
};

export default MeetingSchedules;

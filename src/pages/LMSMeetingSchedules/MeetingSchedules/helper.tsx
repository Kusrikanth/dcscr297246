import {
  Button,
  MoreActions,
  StatusLabel,
  UserDetails,
} from '../../../Components/Common';
import { IOptionsHrtl } from '../../../Components/Common/MenuOptions';
import {
  convertUTCToISTTimeOnly,
  getDdMmYyyyWithMonthNameFormat,
  getFormattedDateddMMMYYYY,
} from '../../../utility/dateutility';

export const meetingStatusColor = {
  live: 'hard',
  completed: 'success',
  rescheduled: 'inprogress',
  scheduled: 'inprogress',
  cancelled: 'warning',
};

export function getMeetingActionOptions(
  menuOption: Array<IOptionsHrtl>,
  activeId = '',
  status = '',
) {
  const meetingStatus = status?.toLowerCase();
  const showViewDetailsOnly =
    (activeId === 'LIVE' && meetingStatus === 'live') ||
    (activeId === 'COMPLETED' && meetingStatus === 'completed');

  return showViewDetailsOnly
    ? menuOption.filter((option) => option.id === 'view-details')
    : menuOption;
}

export function generateColumns(
  menuOption: Array<IOptionsHrtl>,
  isTeacher = false,
  activeId = '',
  startMeetingHandler?: (meeting?: {
    id?: string | number;
    status?: string;
  }) => void,
) {
  const showStartButton = isTeacher && activeId === 'LIVE';

  return [
    {
      Header: 'Title',
      accessor: 'title',
      disableSortBy: true,
      columnClassName: 'min-w-300px w-300px max-w-300px',
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.title}
            // displayId={original?.description}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },

    {
      Header: 'Class & Sec',
      accessor: 'sectionName',
      disableSortBy: true,
    },
    {
      Header: 'Date',
      accessor: 'date',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const date = original?.scheduledStart?.split('T')?.[0];
        return <span>{date ? getDdMmYyyyWithMonthNameFormat(date) : '-'}</span>;
      },
    },
    {
      Header: 'Duration',
      accessor: 'duration',
      disableSortBy: true,
    },
    {
      Header: 'Start Time',
      accessor: 'scheduledStart',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original?.scheduledStart?.split('T') ?? [];
        return (
          <UserDetails
            displayName={time ? convertUTCToISTTimeOnly(time) : '-'}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: 'End Time',
      accessor: 'scheduledEnd',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original?.scheduledEnd?.split('T') ?? [];
        return (
          <UserDetails
            displayName={time ? convertUTCToISTTimeOnly(time) : '-'}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },

    {
      Header: 'Created By',
      accessor: 'createdByName',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.createdByName}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: 'Status',
      accessor: 'status',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const statusType =
          meetingStatusColor[original?.status?.toLowerCase() || ''];

        return (
          <StatusLabel type={statusType} labelName={original?.status || '-'} />
        );
      },
    },
    {
      Header: 'Actions',
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        const meetingStatus = original?.status || '';
        const isLive = meetingStatus?.toLowerCase() === 'live';
        const actionOptions = getMeetingActionOptions(
          menuOption,
          activeId,
          meetingStatus,
        );

        return (
          <div className="tw-flex tw-gap-3 tw-items-center">
            {showStartButton ? (
              <Button onClick={() => startMeetingHandler?.(original)}>
                {isLive ? 'Rejoin' : 'Start'}
              </Button>
            ) : null}
            <MoreActions
              actionOptions={actionOptions}
              rowId={original.id}
              isHorizontal={true}
            ></MoreActions>
          </div>
        );
      },
    },
  ];
}

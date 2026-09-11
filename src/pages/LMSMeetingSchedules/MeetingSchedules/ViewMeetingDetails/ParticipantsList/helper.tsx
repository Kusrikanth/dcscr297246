import { StatusLabel, UserDetails } from '../../../../../Components/Common';
import { convertUTCToISTTimeOnly, getMinutesLabel } from '../../../../../utility/dateutility';

const statusColorMap = {
  joined: 'inprogress',
  notjoined: 'cancelled',
  completed: 'approved',
  leftearly: 'waring',
};

export function generateColumns() {
  return [
    {
      Header: 'S.No',
      accessor: 'sNo',
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        return <span>{index + 1 > 9 ? index + 1 : `0${index + 1}`}</span>;
      },
    },
    {
      Header: 'Name',
      accessor: 'name',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.studentName}
            displayId={original.studentCode}
            size="xs"
          ></UserDetails>
        );
      },
    },
    {
      Header: 'Joined At',
      accessor: 'firstJoinTime',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [, time] = original?.firstJoinTime?.split('T') ?? [];

        return <span>{time ? convertUTCToISTTimeOnly(time) : '-'}</span>;
      },
    },
    {
      Header: 'Exited At',
      accessor: 'lastExitTime',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [, time] = original?.lastExitTime?.split('T') ?? [];

        return <span>{time ? convertUTCToISTTimeOnly(time) : '-'}</span>;
      },
    },
    {
      Header: 'Total time spent',
      accessor: 'totalTimeSpentMin',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{getMinutesLabel(Number(original?.totalTimeSpentMin || '-'))}</span>;
      },
    },
    {
      Header: 'Join Count',
      accessor: 'joinCount',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original?.joinCount || '-'}</span>;
      },
    },
    {
      Header: 'Status',
      accessor: 'attendanceStatus',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {

        const status = original?.attendanceStatus?.split('_').join('').toLowerCase() || '';

        return original?.attendanceStatus ? (
          <StatusLabel
            type={statusColorMap[status] || 'pending'}
            labelName={original?.attendanceStatus || ''}
          ></StatusLabel>
        ) : (
          <span>-</span>
        );
      },
    },
  ];
}
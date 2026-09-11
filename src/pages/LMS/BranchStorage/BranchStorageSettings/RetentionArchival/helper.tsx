import { MenuOptionHrtl, StatusLabel } from '../../../../../Components/Common';
import { IOptionsHrtl } from '../../../../../Components/Common/MenuOptions';

const actionColorMap = {
  archive: 'inprogress',
  lock: 'warning ',
  delete: 'hard',
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'RULE NAME',
      accessor: 'ruleName',
      disableSortBy: true,
    },
    {
      Header: 'SCOPE',
      accessor: 'scope',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-text-sm tw-text-gray-700">{value}</span>
      ),
    },
    {
      Header: 'CONDITION',
      accessor: 'condition',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-text-sm tw-text-gray-700">{value}</span>
      ),
    },
    {
      Header: 'ACTION',
      accessor: 'action',
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <StatusLabel
            labelName={value}
            type={actionColorMap[value.toLowerCase()]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: 'STATUS',
      accessor: 'status',
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const isActive = value === 'Active';
        return (
          <div className="tw-flex tw-items-center tw-gap-2">
            <span
              className={`tw-w-2 tw-h-2 tw-rounded-full ${isActive ? 'tw-bg-green-500' : 'tw-bg-gray-400'}`}
            />
            <span
              className={`tw-text-sm ${isActive ? 'tw-text-green-700' : 'tw-text-gray-500'}`}
            >
              {value}
            </span>
          </div>
        );
      },
    },
    {
      Header: 'ACTIONS',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.uniqueId}
          />
        );
      },
    },
  ];
}

export const retentionRulesData = [
  {
    uniqueId: '1',
    ruleName: 'Student Submissions',
    ruleId: 'RULE001',
    scope: 'Class Rooms',
    condition: 'Age > 180 days',
    action: 'Archive',
    status: 'Active',
  },
  {
    uniqueId: '2',
    ruleName: 'Fee Receipts',
    ruleId: 'RULE002',
    scope: 'Finance',
    condition: 'Age > 365 days',
    action: 'Lock',
    status: 'Active',
  },
  {
    uniqueId: '3',
    ruleName: 'Staff Documents',
    ruleId: 'RULE003',
    scope: 'HR Module',
    condition: 'Age > 730 days',
    action: 'Delete',
    status: 'Active',
  },
  {
    uniqueId: '4',
    ruleName: 'Attendance Logs',
    ruleId: 'RULE004',
    scope: 'All Branches',
    condition: 'Age > 540 days',
    action: 'Archive',
    status: 'Paused',
  },
  {
    uniqueId: '5',
    ruleName: 'Exam Answer Sheets',
    ruleId: 'RULE005',
    scope: 'Academics',
    condition: 'Age > 365 days',
    action: 'Lock',
    status: 'Active',
  },
  {
    uniqueId: '6',
    ruleName: 'Transport Records',
    ruleId: 'RULE006',
    scope: 'Transport',
    condition: 'Age > 365 days',
    action: 'Archive',
    status: 'Paused',
  },
];

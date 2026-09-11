import { HugeiconsIcon } from '@hugeicons/react';
import { MenuOptionHrtl, UserDetails } from '../../../../Components/Common';
import { IOptionsHrtl } from '../../../../Components/Common/MenuOptions';
import { UserMultiple02Icon } from '@hugeicons-pro/core-stroke-standard';

export const roomsData = [
  {
    uniqueId: '1',
    name: 'Config',
    type: 'Custom',
    tags: [],
    owner: 'Me',
    lastActivity: '02/24/2026 2:31 AM',
  },
  {
    uniqueId: '2',
    name: 'Exams & Assessments',
    type: 'Custom',
    tags: ['AY 2025-26', 'Exams'],
    owner: 'HOD - Maths',
    lastActivity: '02/22/2026 10:15 AM',
  },
  {
    uniqueId: '3',
    name: 'STA',
    type: 'Public room',
    tags: [],
    owner: 'Me',
    lastActivity: '02/21/2026 3:31 PM',
  },
  {
    uniqueId: '4',
    name: 'LMS Resources',
    type: 'Public room',
    tags: ['LMS', 'Academic'],
    owner: 'Admin',
    lastActivity: '02/20/2026 4:00 PM',
  },
  {
    uniqueId: '5',
    name: 'Finance & Budgets',
    type: 'Custom',
    tags: ['Finance'],
    owner: 'Admin - Finance',
    lastActivity: '02/19/2026 9:45 AM',
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'NAME',
      accessor: 'name',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails displayName={original.name} size="xs"></UserDetails>
        );
      },
    },
    {
      Header: 'TYPE',
      accessor: 'type',
      disableSortBy: true,
    },
    {
      Header: 'TAGS',
      accessor: 'tags',
      disableSortBy: true,
      Cell: ({ value }: any) => {
        if (value.length === 0) {
          return <span>-</span>;
        }

        return (
          <div className="tw-flex tw-items-center tw-gap-2">
            {value.map((item) => (
              <span
                key={item}
                className="tw-px-2 tw-py-1 tw-rounded tw-bg-zinc-200 tw-text-xs tw-flex-shrink-0"
              >
                {item}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      Header: 'OWNER',
      accessor: 'owner',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <div className="tw-flex tw-items-center tw-gap-2">
          <HugeiconsIcon
            icon={UserMultiple02Icon}
            size={18}
            className="tw-text-zinc-500 tw-flex-shrink-0"
          ></HugeiconsIcon>
          {value}
        </div>
      ),
    },
    {
      Header: 'LAST ACTIVITY',
      accessor: 'lastActivity',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-text-sm tw-text-gray-700">{value}</span>
      ),
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

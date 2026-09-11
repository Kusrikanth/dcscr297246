import { HugeiconsIcon } from '@hugeicons/react';

import {
  File01Icon,
  Folder02Icon,
  Pdf01Icon,
  UserMultiple02Icon,
  Xls01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import {
  IOptionsHrtl,
  MenuOptionHrtl,
  MoreActions,
} from '../../../../../Components/Common/MenuOptions';
import { UserDetails } from '../../../../../Components/Common';

export const fileExplorerData = [
  {
    uniqueId: '1',
    name: 'Integrations',
    type: 'FOLDER',
    itemCount: '2 items',
    size: '',
    modified: '02/20/2026',
    owner: 'A Admin',
    icon: 'folder',
  },
  {
    uniqueId: '2',
    name: 'System Settings',
    type: 'FOLDER',
    itemCount: '2 items',
    size: '',
    modified: '02/24/2026',
    owner: 'A Admin',
    icon: 'folder',
  },
  {
    uniqueId: '3',
    name: 'Backup_Schedule.xlsx',
    type: 'XLSX',
    itemCount: '',
    size: '210 KB',
    modified: '02/23/2026',
    owner: 'A Admin',
    icon: 'excel',
  },
  {
    uniqueId: '4',
    name: 'Server_Logs_Feb.pdf',
    type: 'PDF',
    itemCount: '',
    size: '1.8 MB',
    modified: '02/24/2026',
    owner: 'A Admin',
    icon: 'pdf',
  },
];

export const typeColorMap = {
  folder: {
    icon: Folder02Icon,
    color: 'yellow',
  },
  xlsx: {
    icon: Xls01Icon,
    color: 'green',
  },
  pdf: {
    icon: Pdf01Icon,
    color: 'red',
  },
  default: {
    icon: File01Icon,
    color: 'zinc',
  },
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'NAME',
      accessor: 'name',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { name, itemCount, type } = original || {};
        return (
          <div className="tw-flex tw-items-center tw-gap-2">
            <div
              className={`tw-text-${typeColorMap[type.toLowerCase()].color}-500 tw-bg-${typeColorMap[type.toLowerCase()].color}-100 tw-p-2 tw-rounded tw-flex tw-items-center tw-justify-center`}
            >
              <HugeiconsIcon
                icon={typeColorMap[type.toLowerCase()].icon}
                size={18}
              ></HugeiconsIcon>
            </div>
            <div>
              <p className="tw-mb-0">{name}</p>
              {itemCount && (
                <p className="tw-text-zinc-500 tw-text-xs tw-mb-0">{`(${itemCount})`}</p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      Header: 'TYPE',
      accessor: 'type',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <div
          className={`tw-text-${typeColorMap[value.toLowerCase()].color}-500 tw-bg-${typeColorMap[value.toLowerCase()].color}-100 tw-px-2 tw-py-1 tw-rounded tw-text-xs tw-mb-0 tw-inline-flex tw-gap-2 tw-items-center`}
        >
          <HugeiconsIcon
            icon={typeColorMap[value.toLowerCase()].icon}
            size={16}
          ></HugeiconsIcon>
          {value}
        </div>
      ),
    },
    {
      Header: 'SIZE',
      accessor: 'size',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-text-sm tw-text-gray-600">
          {value ? value : '-'}
        </span>
      ),
    },
    {
      Header: 'MODIFIED',
      accessor: 'modified',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-text-sm tw-text-gray-700">{value}</span>
      ),
    },
    {
      Header: 'OWNER',
      accessor: 'owner',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <UserDetails displayName={value} size="xs"></UserDetails>
      ),
    },
    {
      Header: 'ACTIONS',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center tw-gap-2">
            <MoreActions
              actionOptions={actionsList}
              rowId={original.uniqueId}
              isHorizontal={true}
            />
          </div>
        );
      },
    },
  ];
}

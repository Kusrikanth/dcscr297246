import { StatusLabel, UserDetails } from '../../../../../../Components/Common';
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from '../../../../../../Components/Common/MenuOptions';

export const roleColorMap = {
  branchadmin: 'inprogress',
  teacher: 'warning',
  hod: 'success',
};

export const accessLevelColorMap = {
  fullaccess: 'success',
  limitedaccess: 'warning',
  viewonly: 'inprogress',
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'USER',
      accessor: 'user',
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <UserDetails
          displayName={original.user}
          displayId={original.userId}
          size="xs"
        ></UserDetails>
      ),
    },
    {
      Header: 'ROLE',
      accessor: 'role',
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const roleKey = value.replace(/\s+/g, '').toLowerCase();
        return (
          <StatusLabel
            labelName={value}
            type={roleColorMap[roleKey]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: 'ACCESS LEVEL',
      accessor: 'accessLevel',
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <StatusLabel
            labelName={value}
            type={accessLevelColorMap[value.replace(/\s+/g, '').toLowerCase()]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: 'ROOMS ACCESS',
      accessor: 'roomsAccess',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <StatusLabel labelName={value} type="disabled"></StatusLabel>
      ),
    },
    {
      Header: 'LAST UPDATED',
      accessor: 'lastUpdated',
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
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const userManagementData = [
  {
    uniqueId: 'U1001',
    user: 'Rajesh Kumar',
    userId: 'U1001',
    role: 'Branch Admin',
    accessLevel: 'Full Access',
    roomsAccess: 52,
    lastUpdated: '2026-03-04 14:30',
  },
  {
    uniqueId: 'U1010',
    user: 'Meera Iyer',
    userId: 'U1010',
    role: 'Branch Admin',
    accessLevel: 'Full Access',
    roomsAccess: 52,
    lastUpdated: '2026-02-23 09:20',
  },
  {
    uniqueId: 'U1002',
    user: 'Lakshman M',
    userId: 'U1002',
    role: 'Teacher',
    accessLevel: 'Full Access',
    roomsAccess: 45,
    lastUpdated: '2026-03-03 10:15',
  },
  {
    uniqueId: 'U1003',
    user: 'Vaibhav R',
    userId: 'U1003',
    role: 'Teacher',
    accessLevel: 'Limited Access',
    roomsAccess: 30,
    lastUpdated: '2026-03-02 09:45',
  },
  {
    uniqueId: 'U1007',
    user: 'Arjun Patel',
    userId: 'U1007',
    role: 'Teacher',
    accessLevel: 'Full Access',
    roomsAccess: 38,
    lastUpdated: '2026-02-26 15:35',
  },
  {
    uniqueId: 'U1009',
    user: 'Rahul Krishnan',
    userId: 'U1009',
    role: 'Teacher',
    accessLevel: 'Limited Access',
    roomsAccess: 22,
    lastUpdated: '2026-02-24 17:40',
  },
  {
    uniqueId: 'U1004',
    user: 'Rudra Tej',
    userId: 'U1004',
    role: 'HOD',
    accessLevel: 'Limited Access',
    roomsAccess: 12,
    lastUpdated: '2026-03-01 16:20',
  },
  {
    uniqueId: 'U1005',
    user: 'ARJUN ',
    userId: 'U1005',
    role: 'HOD',
    accessLevel: 'View Only',
    roomsAccess: 8,
    lastUpdated: '2026-02-28 11:10',
  },
  {
    uniqueId: 'U1006',
    user: 'Sneha Reddy',
    userId: 'U1006',
    role: 'HOD',
    accessLevel: 'Limited Access',
    roomsAccess: 15,
    lastUpdated: '2026-02-27 08:50',
  },
];

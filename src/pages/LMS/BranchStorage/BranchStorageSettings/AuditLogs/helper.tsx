export const priorityStyleMap = {
  high: {
    bgColor: 'tw-bg-red-100',
    textColor: 'tw-text-red-600',
    dotColor: 'tw-bg-red-500',
  },
  med: {
    bgColor: 'tw-bg-yellow-100',
    textColor: 'tw-text-yellow-600',
    dotColor: 'tw-bg-yellow-500',
  },
  low: {
    bgColor: 'tw-bg-green-50',
    textColor: 'tw-text-green-600',
    dotColor: 'tw-bg-green-500',
  },
};

export const auditLogs = [
  {
    id: '1',
    priority: 'HIGH',
    action: 'Quota changed → Miyapur → 100GB',
    time: 'Today 10:12',
    performedBy: 'SuperAdmin',
    branch: 'Miyapur',
    ip: '103.21.xx.xx',
  },
  {
    id: '2',
    priority: 'MED',
    action: 'Public link revoked → Admissions',
    time: 'Today 10:18',
    performedBy: 'BranchAdmin',
    branch: 'Kukatpally',
    ip: '103.21.xx.xx',
  },
  {
    id: '3',
    priority: 'LOW',
    action: 'Retention rule updated',
    time: 'Today 11:02',
    performedBy: 'SuperAdmin',
    branch: 'HQ',
    ip: '103.21.xx.xx',
  },
  {
    id: '4',
    priority: 'HIGH',
    action: 'User role escalated → Finance Admin',
    time: 'Today 11:45',
    performedBy: 'SuperAdmin',
    branch: 'HQ',
    ip: '103.21.xx.xx',
  },
  {
    id: '5',
    priority: 'LOW',
    action: 'Backup schedule modified → Weekly',
    time: 'Today 12:30',
    performedBy: 'BranchAdmin',
    branch: 'Miyapur',
    ip: '103.21.xx.xx',
  },
];

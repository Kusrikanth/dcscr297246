import {
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Video01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';

const SchedulesStatsItem = ({ item }: any) => {
  return (
    <div
      className={`tw-bg-white tw-border tw-rounded-[10px] tw-shadow-sm tw-p-4 tw-min-h-[72px] ${item.cardClass}`}
    >
      <div className="tw-flex tw-items-start tw-justify-between tw-gap-3">
        <div>
          <p className="tw-text-sm tw-leading-none tw-text-gray-500 tw-mb-3">
            {item.title}
          </p>

          <h3
            className={`tw-text-[20px] tw-leading-none tw-font-bold tw-mb-0 ${item.valueClass}`}
          >
            {item.value}
          </h3>
        </div>

        <div
          className={`tw-w-[32px] tw-h-[32px] tw-rounded-[6px] tw-flex tw-items-center tw-justify-center ${item.iconBoxClass}`}
        >
          <HugeiconsIcon
            icon={item.icon}
            size={18}
            strokeWidth={2}
            className={item.iconClass}
          />
        </div>
      </div>
    </div>
  );
};

const LiveClassesStats = ({ statsData }) => {
  const stats = statsData || {};

  const schedulesStatsData = [
    {
      id: 1,
      title: 'Total Meetings',
      value: stats?.totalCount ?? 0,
      icon: Calendar03Icon,
      valueClass: 'tw-text-[#4338CA]',
      cardClass: 'tw-border-[#C7D2FE]',
      iconBoxClass: 'tw-bg-[#EEF2FF] tw-border-[#C7D2FE]',
      iconClass: 'tw-text-[#4F46E5]',
    },
    {
      id: 2,
      title: `Today's Meetings`,
      value: stats?.todayMeetingsCount ?? 0,
      icon: Video01Icon,
      valueClass: 'tw-text-[#DC2626]',
      cardClass: 'tw-border-[#FECACA]',
      iconBoxClass: 'tw-bg-[#FEF2F2] tw-border-[#FECACA]',
      iconClass: 'tw-text-[#EF4444]',
    },
    {
      id: 3,
      title: 'Upcoming Meetings',
      value: stats?.upcomingCount ?? 0,
      icon: Clock01Icon,
      valueClass: 'tw-text-[#0284C7]',
      cardClass: 'tw-border-[#BAE6FD]',
      iconBoxClass: 'tw-bg-[#F0F9FF] tw-border-[#BAE6FD]',
      iconClass: 'tw-text-[#0EA5E9]',
    },
    {
      id: 4,
      title: 'Completed Meetings',
      value: stats?.completedCount ?? 0,
      icon: CheckmarkCircle02Icon,
      valueClass: 'tw-text-[#15803D]',
      cardClass: 'tw-border-[#BBF7D0]',
      iconBoxClass: 'tw-bg-[#F0FDF4] tw-border-[#BBF7D0]',
      iconClass: 'tw-text-[#22C55E]',
    },
    {
      id: 5,
      title: 'Cancelled Meetings',
      value: stats?.cancelledCount ?? 0,
      icon: Cancel01Icon,
      valueClass: 'tw-text-[#92400E]',
      cardClass: 'tw-border-[#FCD34D]',
      iconBoxClass: 'tw-bg-[#FFFBEB] tw-border-[#FDE68A]',
      iconClass: 'tw-text-[#F59E0B]',
    },
  ];

  return (
    <div className="tw-mb-4">
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-5 tw-gap-2">
        {schedulesStatsData.map((item) => (
          <SchedulesStatsItem key={`${item.id}-${item.title}`} item={item} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(LiveClassesStats);

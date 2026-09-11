import {
  Calendar03Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Video01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import React from 'react';

const SchedulesStatsItem = ({ item }) => {
  return (
    <div className="tw-bg-white tw-border tw-border-[#E5E7EB] tw-rounded-[14px] tw-shadow-sm tw-p-4 tw-min-h-[112px]">
      <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
        <div>
          <p className="tw-text-[12px] tw-font-semibold tw-text-[#9CA3AF] tw-mb-4">
            {item.title}
          </p>

          <h3
            className={`tw-text-[26px] tw-leading-none tw-font-bold tw-mb-3 ${item.valueClass}`}
          >
            {item.value}
          </h3>
        </div>

        <div
          className={`tw-w-[30px] tw-h-[30px] tw-rounded-[8px] tw-border tw-flex tw-items-center tw-justify-center ${item.iconBoxClass}`}
        >
          <HugeiconsIcon
            icon={item.icon}
            size={16}
            strokeWidth={2}
            className={item.iconClass}
          />
        </div>
      </div>
    </div>
  );
};

const SchedulesStatsList = ({ statsData }) => {
  const stats = statsData || {};
  const schedulesStatsData = [
    {
      id: 1,
      title: 'Total Sessions',
      value: stats?.totalCount ?? 0,
      icon: Calendar03Icon,
      valueClass: 'tw-text-[#111827]',
      iconBoxClass: 'tw-bg-[#EFF6FF] tw-border-[#BFDBFE]',
      iconClass: 'tw-text-[#4B5563]',
    },
    {
      id: 2,
      title: 'Live Now',
      value: stats?.liveCount ?? 0,
      icon: Video01Icon,
      valueClass: 'tw-text-[#EF4444]',
      iconBoxClass: 'tw-bg-[#FEF2F2] tw-border-[#FECACA]',
      iconClass: 'tw-text-[#EF4444]',
    },
    {
      id: 3,
      title: 'Upcoming',
      value: stats.upcomingCount ?? 0,
      icon: Clock01Icon,
      valueClass: 'tw-text-[#047857]',
      iconBoxClass: 'tw-bg-[#D1FAE5] tw-border-[#A7F3D0]',
      iconClass: 'tw-text-[#10B981]',
    },
    {
      id: 4,
      title: 'Completed',
      value: stats.completedCount ?? 0,
      icon: CheckmarkCircle02Icon,
      valueClass: 'tw-text-[#111827]',
      iconBoxClass: 'tw-bg-[#EFF6FF] tw-border-[#BFDBFE]',
      iconClass: 'tw-text-[#4B5563]',
    },
    {
      id: 5,
      title: 'Cancelled',
      value: stats.cancelledCount ?? 0,
      icon: Cancel01Icon,
      valueClass: 'tw-text-[#92400E]',
      iconBoxClass: 'tw-bg-[#FFFBEB] tw-border-[#FDE68A]',
      iconClass: 'tw-text-[#F59E0B]',
    },
  ];

  return (
    <div className="tw-mb-8">
      <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-5 tw-gap-4">
        {schedulesStatsData.map((item) => (
          <SchedulesStatsItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(SchedulesStatsList);

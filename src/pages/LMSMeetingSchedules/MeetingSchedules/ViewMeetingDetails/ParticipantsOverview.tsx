import { memo, useMemo } from 'react';
import { UserMultiple02Icon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { shallowEqual } from 'react-redux';

import { useAppSelector } from '../../../../hooks/storehook';

const ParticipantsOverview = () => {
  const { attendanceStats } = useAppSelector(
    ({ zoomMeetings }) => ({
      attendanceStats:
        zoomMeetings.getScheduledMeetingItemByIdResp?.attendanceStats,
    }),
    shallowEqual,
  );

  const totalParticipants = attendanceStats?.totalCount ?? 0;
  const presentParticipants = attendanceStats?.presentCount ?? 0;
  const absentParticipants = attendanceStats?.absentCount ?? 0;

  const hasParticipantsData = presentParticipants > 0 || absentParticipants > 0;

  const series = useMemo(
    () =>
      hasParticipantsData ? [presentParticipants, absentParticipants] : [1],
    [hasParticipantsData, presentParticipants, absentParticipants],
  );

  const chartOptions: ApexOptions = useMemo(
    () => ({
      chart: {
        type: 'donut',
        sparkline: {
          enabled: true,
        },
      },
      labels: hasParticipantsData ? ['Present', 'Absent'] : ['No Data'],
      colors: hasParticipantsData ? ['#22C55E', '#EF4444'] : ['#E5E7EB'],
      stroke: {
        width: 3,
        colors: ['#fcfcfc'],
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      tooltip: {
        enabled: hasParticipantsData,
        y: {
          formatter: (value) => `${value}`,
        },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              name: {
                show: true,
                offsetY: 16,
                color: '#94A3B8',
                fontSize: '11px',
                fontWeight: 600,
                formatter: () => 'Total',
              },
              value: {
                show: true,
                offsetY: -10,
                color: '#1E3A8A',
                fontSize: '24px',
                fontWeight: 800,
                formatter: () => `${totalParticipants}`,
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                color: '#94A3B8',
                fontSize: '11px',
                fontWeight: 600,
                formatter: () => `${totalParticipants}`,
              },
            },
          },
        },
      },
    }),
    [hasParticipantsData, totalParticipants],
  );

  const overviewData = useMemo(
    () => [
      {
        label: 'Present',
        value: presentParticipants,
        colorClass: 'tw-bg-green-500',
      },
      {
        label: 'Absent',
        value: absentParticipants,
        colorClass: 'tw-bg-red-500',
      },
      {
        label: 'Total',
        value: totalParticipants,
        colorClass: 'tw-bg-blue-500',
      },
    ],
    [totalParticipants, presentParticipants, absentParticipants],
  );

  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-items-center tw-gap-2">
          <HugeiconsIcon
            icon={UserMultiple02Icon}
            size={17}
            className="text-primary"
          />

          <h4 className="tw-card-title text-primary tw-mb-0">
            Participants Overview
          </h4>
        </div>
      </div>

      <div className="tw-card-body">
        <div className="tw-flex tw-items-center tw-justify-between tw-gap-4 tw-flex-row xl:tw-flex-col">
          <div className="tw-flex tw-h-[198px] tw-w-[198px] tw-items-center tw-justify-center">
            <ReactApexChart
              type="donut"
              options={chartOptions}
              series={series}
              height={178}
              width={178}
            />
          </div>

          <div className="tw-flex-1 tw-space-y-4">
            {overviewData.map((item) => (
              <div
                key={item.label}
                className="tw-grid tw-grid-cols-[12px_35px_1fr] tw-items-center tw-gap-2"
              >
                <span
                  className={`tw-h-2.5 tw-w-2.5 tw-rounded-sm ${item.colorClass}`}
                />

                <span className="tw-text-right tw-text-sm tw-text-gray-400">
                  {item.label}
                </span>

                <span className="text-primary tw-text-sm tw-font-semibold tw-ms-4">
                  {`: ${item.value}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsOverview;

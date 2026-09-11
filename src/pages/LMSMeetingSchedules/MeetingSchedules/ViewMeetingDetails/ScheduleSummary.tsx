import { HugeiconsIcon } from '@hugeicons/react';
import { Calendar03Icon } from '@hugeicons-pro/core-stroke-standard';

const scheduleSummary = {
  status: 'Live Now',
  startTime: '09:00 AM',
  endTime: '10:00 AM',
  duration: '1 hr',
  platform: 'Smart Live Class',
  allowJoinBeforeHost: 'Yes',
  attendanceTracking: 'Enabled',
  chat: 'Enabled',
  screenSharing: 'Enabled',
  muteOnEntry: 'No',
};

const SummaryRow = ({
  label,
  value,
  isStatus = false,
}: {
  label: string;
  value: string;
  isStatus?: boolean;
}) => {
  return (
    <div className="tw-grid tw-grid-cols-[125px_12px_1fr] tw-items-center tw-gap-2">
      <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
        {label}
      </p>

      <span className="tw-text-sm  tw-text-gray-400">:</span>

      {isStatus ? (
        <span className="tw-inline-flex tw-w-fit tw-items-center tw-rounded-full tw-bg-teal-50 tw-px-3 tw-py-1 tw-text-xs tw-font-bold tw-text-teal-500">
          {value}
        </span>
      ) : (
        <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
          {value}
        </p>
      )}
    </div>
  );
};

const ScheduleSummary = () => {
  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header">
        <div className="tw-flex tw-items-center tw-gap-2">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={18}
            className="tw-text-gray-700"
          />

          <h4 className="tw-card-title tw-mb-0">Schedule Summary</h4>
        </div>
      </div>

      <div className="tw-card-body">
        <div className="tw-space-y-3">
          <SummaryRow
            label="Status"
            value={scheduleSummary.status}
            isStatus
          />

          <SummaryRow
            label="Start Time"
            value={scheduleSummary.startTime}
          />

          <SummaryRow
            label="End Time"
            value={scheduleSummary.endTime}
          />

          <SummaryRow
            label="Duration"
            value={scheduleSummary.duration}
          />

          <SummaryRow
            label="Platform"
            value={scheduleSummary.platform}
          />

          <SummaryRow
            label="Allow Join Before Host"
            value={scheduleSummary.allowJoinBeforeHost}
          />

          <SummaryRow
            label="Attendance Tracking"
            value={scheduleSummary.attendanceTracking}
          />

          <SummaryRow
            label="Chat"
            value={scheduleSummary.chat}
          />

          <SummaryRow
            label="Screen Sharing"
            value={scheduleSummary.screenSharing}
          />

          <SummaryRow
            label="Mute on Entry"
            value={scheduleSummary.muteOnEntry}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleSummary;
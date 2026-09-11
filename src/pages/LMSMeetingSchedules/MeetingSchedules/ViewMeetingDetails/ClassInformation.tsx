import { HugeiconsIcon } from '@hugeicons/react';
import { BookOpen01Icon } from '@hugeicons-pro/core-stroke-standard';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import {
  convertUTCToISTTimeOnly,
  getFormattedDateddMMMYYYY,
} from '../../../../utility/dateutility';

const InfoRow = ({ label, value }: any) => {
  return (
    <div className="tw-grid tw-grid-cols-[1fr_12px_1fr] tw-items-start tw-gap-2">
      <p className="tw-mb-0 tw-text-sm tw-text-gray-500">{label || '-'}</p>

      <span className="tw-text-sm  tw-text-gray-400">:</span>

      <p className="tw-mb-0 tw-text-sm  tw-text-gray-800">{value || '---'}</p>
    </div>
  );
};

const ClassInformation = () => {
  const { getScheduledMeetingItemByIdResp } = useAppSelector(
    ({ zoomMeetings }) => ({
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
    }),
    shallowEqual,
  );

  const {
    sectionName,
    scheduledStart,
    scheduledEnd,
    duration,
    meetingLink,
    createdAt,
    updatedAt,
    createdBy,
    createdByName,
    timeZone,
  } = getScheduledMeetingItemByIdResp || {};

  const [startDate, startTime] = scheduledStart?.split('T') ?? [];
  const [endDate, endTime] = scheduledEnd?.split('T') ?? [];
  const [createdDate, createdTime] = createdAt?.split('T') ?? [];
  const [updatedDate, updatedTime] = updatedAt?.split('T') ?? [];

  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header">
        <div className="tw-flex tw-items-center tw-gap-2">
          <HugeiconsIcon
            icon={BookOpen01Icon}
            size={18}
            className="tw-text-gray-700"
          />

          <h4 className="tw-card-title tw-mb-0">Class Information</h4>
        </div>
      </div>

      <div className="tw-card-body">
        <div className="tw-space-y-3">
          <InfoRow label="Class & Section" value={sectionName} />

          <InfoRow label="Date" value={getFormattedDateddMMMYYYY(startDate)} />

          <InfoRow
            label="Time"
            value={`${convertUTCToISTTimeOnly(startTime)} - ${convertUTCToISTTimeOnly(endTime)}`}
          />

          <InfoRow label="Duration" value={duration} />

          <InfoRow label="Time Zone" value={timeZone} />

          <InfoRow label="Created By" value={createdByName} />

          <InfoRow
            label="Created On"
            value={`${getFormattedDateddMMMYYYY(createdDate)}, ${convertUTCToISTTimeOnly(createdTime)}`}
          />
          <InfoRow
            label="Last Updated"
            value={`${getFormattedDateddMMMYYYY(updatedDate)}, ${convertUTCToISTTimeOnly(updatedTime)}`}
          />

          <InfoRow label="Platform" value={meetingLink?.platform} />
          {/* <InfoRow label="Allow Join Before Host" value="Yes" />
          <InfoRow label="Attendance Tracking" value="Enabled" />
          <InfoRow label="Chat" value="Enabled" />
          <InfoRow label="Screen Sharing" value="Enabled" />
          <InfoRow label="Mute on Entry" value="No" /> */}
        </div>
      </div>
    </div>
  );
};

export default ClassInformation;

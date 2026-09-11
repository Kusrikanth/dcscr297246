import {
  BookOpen01Icon,
  Calendar03Icon,
  Clock01Icon,
  ComputerIcon,
  GlobalIcon,
  Note02Icon,
  RefreshIcon,
  TeacherIcon,
  Time01Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import { StatusLabel } from '../../../../Components/Common';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { meetingStatusColor } from '../helper';
import {
  convertUTCToISTTimeOnly,
  getFormattedDateddMMMYYYY,
} from '../../../../utility/dateutility';
import type { ComponentProps, ReactNode } from 'react';

const DetailItem = ({ icon, label, value, subValue }: any) => {
  return (
    <div className="tw-flex tw-min-h-[84px] tw-items-start tw-gap-2 tw-border tw-border-gray-200 tw-p-4">
      <HugeiconsIcon icon={icon} size={18}></HugeiconsIcon>

      <div>
        <p className="tw-mb-1 tw-text-sm tw-leading-none tw-text-gray-500">
          {label || '-'}
        </p>

        <p className="tw-mb-0 tw-text-base tw-font-semibold">
          {value || '---'}
        </p>

        {subValue && (
          <p className="tw-mb-0 tw-text-xs tw-font-medium tw-leading-4 tw-text-gray-500">
            {subValue}
          </p>
        )}
      </div>
    </div>
  );
};

const ClassHeaderCard = () => {
  const { getScheduledMeetingItemByIdResp } = useAppSelector(
    ({ zoomMeetings }) => ({
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
    }),
    shallowEqual,
  );

  const {
    title,
    description,
    status,
    sectionName,
    scheduledStart,
    scheduledEnd,
    actualStart,
    actualEnd,
    duration,
    meetingLink,
    agenda,
    createdAt,
    updatedAt,
    createdByName,
    timeZone,
    rescheduledReason,
    cancellationReason
  } = getScheduledMeetingItemByIdResp || {};


  const [startDate, startTime] = scheduledStart?.split('T') ?? [];
  const [, endTime] = scheduledEnd?.split('T') ?? [];
  const [, actualStartTime] = actualStart?.split('T') ?? [];
  const [, actualEndTime] = actualEnd?.split('T') ?? [];
  const [createdDate, createdTime] = createdAt?.split('T') ?? [];
  const [updatedDate, updatedTime] = updatedAt?.split('T') ?? [];
  const actualStartTimeDisplay = convertUTCToISTTimeOnly(
    actualStartTime || '',
  );
  const actualEndTimeDisplay = convertUTCToISTTimeOnly(actualEndTime || '');
  const actualTimeDisplay =
    actualStartTimeDisplay && actualEndTimeDisplay
      ? `${actualStartTimeDisplay} - ${actualEndTimeDisplay}`
      : actualStartTimeDisplay || actualEndTimeDisplay;

  return (
    <div className="tw-card tw-mb-0 tw-h-full tw-w-full tw-items-center">
      <div className="tw-card-body tw-flex-1">
        <div className="tw-grid tw-grid-cols-1 tw-gap-5 md:tw-grid-cols-[128px_1fr] tw-items-center">
          <div className="tw-flex tw-items-center tw-gap-4 md:tw-flex-col md:tw-items-center md:tw-gap-2 md:tw-border-r md:tw-border-gray-200">
            <div className="tw-flex tw-h-16 tw-w-16 tw-items-center tw-justify-center tw-rounded-full tw-bg-indigo-50 tw-text-gray-700">
              <HugeiconsIcon icon={BookOpen01Icon} size={24}></HugeiconsIcon>
            </div>

            <StatusLabel
              type={meetingStatusColor[status?.toLowerCase() || '']}
              labelName={status || ''}
            ></StatusLabel>
          </div>

          <div>
            <div className="tw-pb-0">
              <h5 className="tw-card-title tw-text-lg tw-text-gray-800 tw-mb-0">
                {title || '--'}
              </h5>
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-1">
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700 tw-mb-0">
                  Description :
                </p>
                <p className="tw-mb-0 tw-text-sm tw-text-gray-500 tw-mb-0">
                  {description || '---'}
                </p>
              </div>
              <div className="tw-flex tw-items-center tw-gap-2">
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700 tw-mb-0">
                  Agenda :
                </p>
                <p className="tw-mb-0 tw-text-sm tw-text-gray-500 tw-mb-0">
                  {agenda || '---'}
                </p>
              </div>
              {
                rescheduledReason &&
              <div className="tw-flex tw-items-center tw-gap-2">
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700 tw-mb-0">
                Rescheduled Reason :
                </p>
                <p className="tw-mb-0 tw-text-sm tw-text-gray-500 tw-mb-0">
                  {rescheduledReason || '---'}
                </p>
              </div>
              }
              {
                cancellationReason &&
              <div className="tw-flex tw-items-center tw-gap-2">
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700 tw-mb-0">
                  Cancellation Reason :
                </p>
                <p className="tw-mb-0 tw-text-sm tw-text-gray-500 tw-mb-0">
                  {cancellationReason || '---'}
                </p>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="tw-card-footer tw-border-0 !tw-p-0">
        <div className="tw-grid tw-grid-cols-1 tw-overflow-hidden tw-border tw-border-gray-200 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-4 2xl:tw-grid-cols-5">
          <DetailItem
            icon={Note02Icon}
            label="Class & Section"
            value={sectionName}
          />

          <DetailItem
            icon={Calendar03Icon}
            label="Date"
            value={getFormattedDateddMMMYYYY(startDate || '')}
          />

          <DetailItem
            icon={Time01Icon}
            label="Time"
            value={`${convertUTCToISTTimeOnly(startTime || '')} - ${convertUTCToISTTimeOnly(endTime || '')}`}
          />
          <DetailItem
            icon={Time01Icon}
            label="Actual Start & End Time"
            value={actualTimeDisplay}
          />

          <DetailItem icon={Clock01Icon} label="Duration" value={duration} />

          <DetailItem icon={GlobalIcon} label="Time Zone" value={timeZone} />

          <DetailItem
            icon={TeacherIcon}
            label="Created By"
            value={createdByName}
          />

          <DetailItem
            icon={Calendar03Icon}
            label="Created On"
            value={getFormattedDateddMMMYYYY(createdDate || '')}
            subValue={convertUTCToISTTimeOnly(createdTime || '')}
          />

          <DetailItem
            icon={RefreshIcon}
            label="Last Updated"
            value={getFormattedDateddMMMYYYY(updatedDate || '')}
            subValue={convertUTCToISTTimeOnly(updatedTime || '')}
          />

          <DetailItem
            icon={ComputerIcon}
            label="Platform"
            value={meetingLink?.platform}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassHeaderCard;

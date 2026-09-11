import { HugeiconsIcon } from '@hugeicons/react';
import {
  Calendar03Icon,
  Delete02Icon,
  Edit03Icon,
} from '@hugeicons-pro/core-stroke-standard';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';

const QuickActions = ({ onEditHandler, onCancelHandler }: any) => {
  const { getScheduledMeetingItemByIdResp } = useAppSelector(
    ({ zoomMeetings }) => ({
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
    }),
    shallowEqual,
  );

  const { status } = getScheduledMeetingItemByIdResp || {};

  const statusName = status?.toLowerCase();
  const isCompleted = statusName === 'completed';
  const isCancelled = statusName === 'cancelled';
  const isLive = statusName === 'live';

  const showEditAction = !isCancelled && !isCompleted;
  const showRescheduleAction = !isCancelled && !isCompleted && !isLive;
  const showCancelAction = !isCancelled && !isCompleted && !isLive;

  if (!showEditAction && !showRescheduleAction && !showCancelAction) {
    return null;
  }

  return (
    <div className="tw-flex tw-w-full tw-flex-col tw-gap-4 xl:tw-w-auto xl:tw-items-end">
      <div className="tw-flex tw-w-full tw-flex-wrap tw-gap-4 xl:tw-w-auto xl:tw-justify-end">
        {showEditAction ? (
          <button
            type="button"
            className="tw-flex tw-h-10 tw-min-w-[132px] tw-items-center tw-justify-center tw-gap-2 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-px-3 tw-text-sm tw-font-semibold tw-text-gray-700 tw-shadow-sm hover:tw-bg-gray-50"
            onClick={() => onEditHandler('edit')}
          >
            <HugeiconsIcon icon={Edit03Icon} size={16} />
            Edit Schedule
          </button>
        ) : null}

        {showRescheduleAction ? (
          <button
            type="button"
            className="tw-flex tw-h-10 tw-min-w-[120px] tw-items-center tw-justify-center tw-gap-2 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-px-3 tw-text-sm tw-font-semibold tw-text-gray-700 tw-shadow-sm hover:tw-bg-gray-50"
            onClick={() => onEditHandler('reSchedule')}
          >
            <HugeiconsIcon icon={Calendar03Icon} size={16} />
            Reschedule
          </button>
        ) : null}

        {showCancelAction ? (
          <button
            type="button"
            className="tw-flex tw-h-10 tw-min-w-[132px] tw-items-center tw-justify-center tw-gap-2 tw-rounded-lg tw-border tw-border-red-200 tw-bg-red-50 tw-px-3 tw-text-sm tw-font-semibold tw-text-red-500 tw-shadow-sm hover:tw-bg-red-100"
            onClick={onCancelHandler}
          >
            <HugeiconsIcon icon={Delete02Icon} size={16} />
            Cancel Meeting
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default QuickActions;

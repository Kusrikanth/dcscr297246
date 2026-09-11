import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";
import { meetingStatusColor } from "../MeetingSchedules/helper";
import { Button, StatusLabel } from '../../../Components/Common';

const meetingBorderColorMap = {
  live: 'red-500',
  completed: 'green-500',
  rescheduled: 'blue-500',
  scheduled: 'blue-500',
  cancelled: 'yellow-500',
};

const StudentMeetingCard = ({ activeTabId, clsItem, onJoinMeeting }: any) => {
  const {
    id,
    status,
    scheduledStart,
    scheduledEnd,
    title,
    teacherName,
    createdByName,
    duration,
  } = clsItem || {};

  const statusType = meetingStatusColor[status?.toLowerCase() || ''];
  const cardBorderColor =
    meetingBorderColorMap[status?.toLowerCase() || ''] || 'gray-500';
  const startTime = convertUTCToISTTimeOnly(scheduledStart?.split('T')?.[1]?.slice(0, 5) || '');
  const endTime = convertUTCToISTTimeOnly(scheduledEnd?.split('T')?.[1]?.slice(0, 5) || '');
  const date = scheduledStart?.split('T')?.[0];

  const timeLabel =
    startTime && endTime ? `${startTime} - ${endTime}` : startTime || endTime;
  const displayTeacher = teacherName || createdByName || '-';

  return (
    <div className="tw-card">
      <div
        className={`tw-card-body tw-border-l-4 tw-border-${cardBorderColor}`}
      >
        <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
          <div>
            <div className="tw-mb-4">
              <h4 className="tw-text-lg tw-mb-0">
                <span className="tw-font-bold">{title}</span>
              </h4>
              <p className="tw-text-sm tw-font-medium tw-text-gray-500 tw-mb-0">
                Created By : {displayTeacher}
              </p>
            </div>
            <div className="tw-flex tw-gap-1 tw-mb-0 tw-flex-col tw-items-start">
              <div className="tw-font-medium tw-text-gray-800 tw-text-base">
                {getDdMmYyyyWithMonthNameFormat(date)}
              </div>
              <div className="tw-flex tw-gap-3">
                <span className="tw-text-sm tw-font-medium tw-text-gray-500">
                  {timeLabel || "--:--"}
                </span>
                <span className="tw-text-sm tw-font-medium tw-text-gray-500">
                  |
                </span>
                <span className="tw-text-sm tw-font-medium tw-text-gray-500">
                  {duration || "-"}
                </span>
              </div>
              <StatusLabel type={statusType} labelName={status}></StatusLabel>
            </div>
          </div>

          {activeTabId === 'LIVE' && (
            <button
              type="button"
              className="tw-bg-[#14B8A6] hover:tw-bg-[#0F766E] tw-text-white tw-text-sm tw-px-4 tw-py-2 tw-rounded-[8px] tw-transition disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
              onClick={() => onJoinMeeting?.(id)}
              disabled={!id || status?.toLowerCase() !== 'live'}
            >
              Join Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMeetingCard;
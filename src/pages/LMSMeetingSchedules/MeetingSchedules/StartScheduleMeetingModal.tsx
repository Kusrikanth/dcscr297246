import { shallowEqual } from 'react-redux';
import { Button } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';

const StartScheduleMeetingModal = ({
  cancelHndlr,
  isDisble,
  reStartScheduledHandler,
  startScheduledHandler,
  meeting,
}: any) => {
  const { getScheduledMeetingItemByIdResp } = useAppSelector(
    ({ zoomMeetings }) => ({
      getScheduledMeetingItemByIdResp:
        zoomMeetings.getScheduledMeetingItemByIdResp,
    }),
    shallowEqual,
  );

  const selectedMeetingId = meeting?.id;
  const isSameMeeting =
    selectedMeetingId &&
    getScheduledMeetingItemByIdResp?.id &&
    `${getScheduledMeetingItemByIdResp.id}` === `${selectedMeetingId}`;
  const status =
    meeting?.status ||
    (isSameMeeting ? getScheduledMeetingItemByIdResp?.status : undefined);
  const meetingSectionId = meeting?.sectionId;

  const isLive = status?.toLowerCase() === 'live';

  const confirmHndlr = () => {
    if (isLive) {
      reStartScheduledHandler(meeting, meetingSectionId);
      return;
    }

    startScheduledHandler(meeting, meetingSectionId);
  };

  return (
    <>
      <div className="modal-body">
        <p className="tw-mb-0 tw-text-gray-600">
          {isLive
            ? 'This meeting is already live. Do you want to restart the meeting session?'
            : 'You are about to start a live meeting session. Do you want to proceed to the console?'}
        </p>
      </div>

      <div className="modal-footer p-3">
        <Button type="button" variant="secondary" onClick={cancelHndlr}>
          Cancel
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={confirmHndlr}
          disabled={isDisble || false}
        >
          {isLive ? 'Restart Meeting' : 'Start Meeting'}
        </Button>
      </div>
    </>
  );
};

export default StartScheduleMeetingModal;

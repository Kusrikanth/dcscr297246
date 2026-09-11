import { ModalContainerUpdated } from '../../../../Components/Common';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import ClassHeaderCard from './ClassHeaderCard';
import ClassInformation from './ClassInformation';
import ParticipantsList from './ParticipantsList';
import QuickActions from './QuickActions';
import MeetingDetails from './MeetingDetails';
import ParticipantsOverview from './ParticipantsOverview';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../../../hooks/modalhook';
import AddEditScheduleMeeting from '../AddEditScheduleMeeting';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import {
  cancelScheduledMeetingsItemByIdAct,
  getScheduledMeetingItemByIdAct,
} from '../../../../store/lms/zoomMeeting/zoomMeetingActions';
import { useCallback, useEffect, useRef } from 'react';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

const ViewMeetingDetails = () => {
  const location = useLocation<any>();
  const meetingId = location.state?.meetingId;
  const dispatch = useAppDispatch();
  const {
    closeModal: addEditScheduleMeetingCloseModal,
    modalState: addEditScheduleMeetingModalState,
    openModal: addEditScheduleMeetingOpenModal,
  } = useModal();

  const {
    closeModal: delScheduleMeetingCloseModal,
    modalState: delScheduleMeetingModalState,
    openModal: delScheduleMeetingOpenModal,
  } = useModal();

  const {
    editScheduledMeetingItemByIdResp,
    reScheduleScheduledMeetingItemByIdResp,
    cancelScheduledMeetingsItemByIdResp,
    getzoomMeetingErrorResp,
    showApiLoader,
    loggedInUserRole
  } = useAppSelector(
    ({ zoomMeetings, globalData,appData }) => ({
      showApiLoader: globalData.showApiLoader,
      editScheduledMeetingItemByIdResp:
        zoomMeetings.editScheduledMeetingItemByIdResp,
      reScheduleScheduledMeetingItemByIdResp:
        zoomMeetings.reScheduleScheduledMeetingItemByIdResp,
      cancelScheduledMeetingsItemByIdResp:
        zoomMeetings.cancelScheduledMeetingsItemByIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      getzoomMeetingErrorResp: zoomMeetings.getzoomMeetingErrorResp,
    }),
    shallowEqual,
  );

  const isTeacher = loggedInUserRole && loggedInUserRole === 'TEACHER';

  const meetingDetailsRef = useRef({
    prevEditScheduledMeetingItemByIdResp: editScheduledMeetingItemByIdResp,
    prevReScheduleScheduledMeetingItemByIdResp:reScheduleScheduledMeetingItemByIdResp,
    prevCancelScheduledMeetingsItemByIdResp:
      cancelScheduledMeetingsItemByIdResp,
    prevGetzoomMeetingErrorResp: getzoomMeetingErrorResp,
  });

  function editScheduleHandler(type: any) {
    if (!meetingId) {
      return;
    }

    dispatch(
      getScheduledMeetingItemByIdAct(
        generateActionPayload('get_scheduled_meeting_item_by_id', {
          id: meetingId,
        }),
      ),
    );
    addEditScheduleMeetingOpenModal({ id: meetingId, type: type });
  }
  function cancelScheduleHandler() {
    if (!meetingId) {
      return;
    }

    delScheduleMeetingOpenModal(meetingId);
  }

  function delScheduledMeetingsItemByIdCall(reason: string) {
    const payload = {
      reason: reason,
    };

    dispatch(
      cancelScheduledMeetingsItemByIdAct(
        generateActionPayload(
          'cancel_scheduled_meetings_item_by_id',
          { id: delScheduleMeetingModalState.modalData },
          payload,
        ),
      ),
    );
  }

  const fetchScheduledMeetingItemById = useCallback(() => {
    if (!meetingId) {
      return;
    }

    dispatch(
      getScheduledMeetingItemByIdAct(
        generateActionPayload('get_scheduled_meeting_item_by_id', {
          id: meetingId,
        }),
      ),
    );
  }, [dispatch, meetingId]);

  useEffect(() => {
    const {
      prevEditScheduledMeetingItemByIdResp,
      prevReScheduleScheduledMeetingItemByIdResp,
      prevCancelScheduledMeetingsItemByIdResp,
      prevGetzoomMeetingErrorResp,
    } = meetingDetailsRef.current;

    if (
      editScheduledMeetingItemByIdResp &&
      editScheduledMeetingItemByIdResp !== prevEditScheduledMeetingItemByIdResp
    ) {
      toast.success('Meeting edited successfully');
      addEditScheduleMeetingCloseModal();
      fetchScheduledMeetingItemById();
    } else if(reScheduleScheduledMeetingItemByIdResp && reScheduleScheduledMeetingItemByIdResp !== prevReScheduleScheduledMeetingItemByIdResp){
      toast.success('Meeting rescheduled successfully');
      addEditScheduleMeetingCloseModal();
      fetchScheduledMeetingItemById();
    } else if (
      cancelScheduledMeetingsItemByIdResp &&
      cancelScheduledMeetingsItemByIdResp !==
        prevCancelScheduledMeetingsItemByIdResp
    ) {
      toast.success('Meeting canceled successfully');
      delScheduleMeetingCloseModal();
      fetchScheduledMeetingItemById();
    } else if (
      getzoomMeetingErrorResp &&
      getzoomMeetingErrorResp !== prevGetzoomMeetingErrorResp
    ) {
      const { message } = getzoomMeetingErrorResp;
      toast.error(message || 'Something went wrong');
    }

    meetingDetailsRef.current.prevEditScheduledMeetingItemByIdResp =
      editScheduledMeetingItemByIdResp;
    meetingDetailsRef.current.prevReScheduleScheduledMeetingItemByIdResp =
      reScheduleScheduledMeetingItemByIdResp;
    meetingDetailsRef.current.prevCancelScheduledMeetingsItemByIdResp =
      cancelScheduledMeetingsItemByIdResp;
    meetingDetailsRef.current.prevGetzoomMeetingErrorResp =
      getzoomMeetingErrorResp;
  }, [
    addEditScheduleMeetingCloseModal,
    cancelScheduledMeetingsItemByIdResp,
    delScheduleMeetingCloseModal,
    editScheduledMeetingItemByIdResp,
    fetchScheduledMeetingItemById,
    reScheduleScheduledMeetingItemByIdResp,
    getzoomMeetingErrorResp,
  ]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Meetings" />
          <div className="card p-3 shadow-lg rounded lms_step_wizard page-title-box border-0 !tw-rounded-none">
            <div className="tw-flex tw-w-full tw-flex-col tw-gap-4 xl:tw-flex-row xl:tw-items-center xl:tw-justify-between">
              <div className="tw-min-w-0">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                  <p className="tw-mb-0 tw-text-lg tw-font-bold tw-leading-6 tw-text-gray-800 sm:tw-text-xl">
                    Class Schedule Details
                  </p>
                </div>

                <p className="tw-mb-0 tw-mt-1 tw-text-sm tw-leading-5 tw-text-gray-500 sm:tw-text-base">
                  View complete information about this live class session.
                </p>
              </div>

              <QuickActions
                onEditHandler={editScheduleHandler}
                onCancelHandler={cancelScheduleHandler}
              />
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-y-5 tw-gap-x-4 tw-mb-6">
            <div className="tw-col-span-12">
              <ClassHeaderCard />
            </div>
            {
              isTeacher ? null : <div className="tw-col-span-12">
                <MeetingDetails  />
              </div>
            }

            {/* <div className="tw-col-span-12 xl:tw-col-span-4">
              <ClassInformation />
            </div> */}
            {/* <div className="tw-col-span-12 xl:tw-col-span-4">
              <ScheduleSummary />
            </div> */}
            <div className="tw-col-span-12 xl:tw-col-span-9">
              <ParticipantsList />
            </div>
            <div className="tw-col-span-12 xl:tw-col-span-3">
              <ParticipantsOverview />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="addEditScheduleMeeting"
        isOpen={addEditScheduleMeetingModalState.showModal}
        toggle={addEditScheduleMeetingCloseModal}
         modalTitle={`${addEditScheduleMeetingModalState?.modalData?.type === 'edit' ? 'Edit Meeting' : addEditScheduleMeetingModalState?.modalData?.type === 'reSchedule' ? 'Reschedule the Meeting' : 'Schedule Meeting'}`}
        headerClassName="tw-flex"
        modalSize="lg"
      >
        <AddEditScheduleMeeting
          onClose={addEditScheduleMeetingCloseModal}
          editItem={addEditScheduleMeetingModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="delScheduleMeetingModal"
        isOpen={delScheduleMeetingModalState.showModal}
        toggle={delScheduleMeetingCloseModal}
        modalSize="md"
        hideHeader={true}
      >
        <DeleteConfirmationModal
          cancelHndlr={delScheduleMeetingCloseModal}
          confirmHndlr={delScheduledMeetingsItemByIdCall}
          isDisble={showApiLoader}
        ></DeleteConfirmationModal>
      </ModalContainerUpdated>
    </>
  );
};

export default ViewMeetingDetails;

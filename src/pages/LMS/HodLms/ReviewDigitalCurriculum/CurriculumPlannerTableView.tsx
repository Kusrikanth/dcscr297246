import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, BookEditIcon, Copy01Icon, PencilEdit02Icon, ViewIcon, } from "@hugeicons-pro/core-stroke-standard";
import { hodFeedbackHistoryDigitalCurriculumDetailsByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch } from "../../../../hooks/storehook";
import { useModal } from "../../../../hooks/modalhook";
import { useHistory } from "react-router-dom";
import FeedBackHistoryModal from "./FeedBackHistoryModal";
import { ModalContainerUpdated } from "../../../../Components/Common";

const CurriculumPlannerTableView = ({ getDigitalCurriculumListResp, activeId }) => {
  const { openModal: openFeedBackHistoryModal, closeModal: closeFeedBackHistoryModal, modalState: feedBackHistoryModalState } = useModal();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const menuOptions = useMemo(
    () => [
      {
        id: "feedBack",
        actionIcon: (
          <HugeiconsIcon
            icon={Copy01Icon}
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "Feedback & History",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(hodFeedbackHistoryDigitalCurriculumDetailsByIdAct(generateActionPayload("hod_feedback_history_details_by_id", { subjectCurriculumId: id }, undefined)));
          openFeedBackHistoryModal(id);
        },
      },
      {
        id: "review-curriculum",
        actionIcon: (
          <HugeiconsIcon
            icon={ViewIcon}
            className="me-2 text-muted"
            size={18}
          />
        ),
        actionName: "Review Curriculum",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          history.push(`/review-digital-curriculum-details/${id}`);
        },
      }
    ],
    [getDigitalCurriculumListResp]
  );

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [getDigitalCurriculumListResp]
  );
  const filteredData = useMemo(() => {
    return getDigitalCurriculumListResp?.content || [];
  }, [getDigitalCurriculumListResp]);

  const hasData = filteredData.length > 0;

  return (
    <>
      <div className="card">
        <div className="card-header d-none">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">Category List</h4>
            </div>
          </div>
        </div>
        <div className="card-body p-0 lms_digital_curriculum">
          {hasData ? (
            <TableContainer
              columns={tableColumns || []}
              data={filteredData}
              tableClass="mb-0"
              divClass="table-responsive mb-3"
              theadClass="table-light text-muted align-middle"
              showCheckbox={false}
              showPagination={false}
            />
          ) : (
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-bg-white tw-rounded-xl tw-border tw-shadow-sm tw-py-10 tw-px-4">
              <div className="tw-w-14 tw-h-14 tw-bg-gray-100 tw-rounded-2xl tw-shadow-sm tw-flex tw-items-center tw-justify-center tw-mb-3">
                <div className="tw-text-3xl tw-text-gray-400">📄</div>
              </div>
              <p className="tw-text-base tw-font-semibold tw-text-gray-700">
                No curriculum found
              </p>
              <p className="tw-text-sm tw-text-gray-500 tw-mt-1">
                Try adjusting filters or create a new digital curriculum for a class and subject.
              </p>
            </div>
          )}
        </div>
      </div>
      <ModalContainerUpdated
        id="feedback-history-modal"
        isOpen={feedBackHistoryModalState.showModal}
        toggle={closeFeedBackHistoryModal}
        modalTitle="Feedback History Details"
        modalSize="xl"
      >
        <FeedBackHistoryModal
          toggle={closeFeedBackHistoryModal}
          id={feedBackHistoryModalState.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default CurriculumPlannerTableView;

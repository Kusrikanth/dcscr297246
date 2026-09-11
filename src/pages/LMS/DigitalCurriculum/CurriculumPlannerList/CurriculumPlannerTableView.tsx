import { useMemo, useState } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit03Icon, Exchange01Icon, Megaphone01Icon } from "@hugeicons-pro/core-stroke-standard";
import { ModalContainerUpdated } from "../../../../Components/Common";
import PublishDigitalCurriculumModal from "./PublishDigitalCurriculumModal";
import EditCurriculumStructureModal from "./EditCurriculumStructureModal";
import { useAppDispatch } from "../../../../hooks/storehook";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../../hooks/modalhook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getDigitalCurriculumBasicDetailsByIdAct, getDigitalCurriculumManualUploadByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import ViewDigitalCurriculumModal from "./ViewDigitalCurriculumModal";

const CurriculumPlannerTableView = ({ getDigitalCurriculumListResp, activeId, getDigitalCurriculumStatsApi, getDigitalCurriculumListApi }) => {
  const { openModal: openEditCurriculumStructureModal, closeModal: closeEditCurriculumStructureModal, modalState: editCurriculumStructureModalState } = useModal();
  const { openModal: openPublishDigitalCurriculumModal, closeModal: closePublishDigitalCurriculumModal, modalState: publishDigitalCurriculumModalState } = useModal();
  const { openModal: openViewDigitalCurriculumModal, closeModal: closeViewDigitalCurriculumModal, modalState: viewDigitalCurriculumModalState } = useModal();

  const dispatch = useAppDispatch();
  const history = useHistory();

  const menuOptions = useMemo(
    () => [
      {
        id: "modify-curriculum",
        actionIcon: <HugeiconsIcon icon={Exchange01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Modify Curriculum",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getDigitalCurriculumManualUploadByIdAct(
              generateActionPayload(
                "get_digital_curriculum_manual_upload_by_id",
                { subjectCurriculumId: id },
                undefined
              )
            )
          );
          openEditCurriculumStructureModal(id);
        },
      },

      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={Edit03Icon} className="me-2 text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          history.push("/digital-curriculum/add-curriculum", {
            subjectCurriculumId: id,
          });
        },
      },
      {
        id: "publish",
        actionIcon: <HugeiconsIcon icon={Megaphone01Icon} className="me-2 text-muted" size={18} />,
        actionName: "Publish",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(
            getDigitalCurriculumBasicDetailsByIdAct(
              generateActionPayload(
                "get_digital_curriculum_basic_details_by_id",
                { subjectCurriculumId: id },
                undefined
              )
            )
          );
          openPublishDigitalCurriculumModal(id);
        },
      },
      {
        id: "View",
        actionIcon: <HugeiconsIcon icon={Megaphone01Icon} className="me-2 text-muted" size={18} />,
        actionName: "View Curriculum",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openViewDigitalCurriculumModal(id);
        },
      },
    ],
    [getDigitalCurriculumListResp]
  );

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [getDigitalCurriculumListResp]
  );
  const normalizeStatus = (status: string = "") =>
  status.toLowerCase().replace(/_/g, "");
  const filteredData = useMemo(() => {
    const all = getDigitalCurriculumListResp?.content || [];

    if (!activeId || activeId === "all") return all;

    return all.filter(
  (item) =>
    normalizeStatus(item.curriculumStatus) ===
    normalizeStatus(activeId)
);
  }, [getDigitalCurriculumListResp, activeId]);

  const hasData =
    getDigitalCurriculumListResp?.content &&
    getDigitalCurriculumListResp.content.length > 0;

  return (
    <>
      <div className="tw-bg-white tw-rounded-xl tw-border tw-shadow-sm">
        <div className="tw-hidden">
          <div className="tw-flex tw-items-center">
            <div className="tw-w-1/2">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Category List
              </h4>
            </div>
          </div>
        </div>
        <div className="tw-p-0 tw-bg-white lms_digital_curriculum">
          {hasData ? (
            <TableContainer
              columns={tableColumns || []}
              data={filteredData}
              tableClass="tw-mb-0"
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-slate-50 tw-text-slate-500 tw-align-middle"
              showCheckbox={false}
              showPagination={true}
              totalPages={getDigitalCurriculumListResp?.totalPages || 0}
              totalRecords={getDigitalCurriculumListResp?.totalElements || 0}
              callbackPaginationHndlr={() => { }}
              currentPageNumber={getDigitalCurriculumListResp?.pageNumber || 0}
            />
          ) : (
            <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-bg-white tw-rounded-xl tw-border tw-shadow-sm tw-py-10 tw-px-4">
              <div className="tw-w-14 tw-h-14 tw-bg-gray-100 tw-rounded-2xl tw-shadow-sm tw-flex tw-items-center tw-justify-center tw-mb-3">
                <span className="tw-text-3xl tw-text-gray-400">📄</span>
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
        id="edit-curriculum-structure-modal"
        isOpen={editCurriculumStructureModalState.showModal}
        toggle={closeEditCurriculumStructureModal}
        modalTitle="Edit Curriculum Details"
        modalSize="xl"
      >
        <EditCurriculumStructureModal
          getDigitalCurriculumStatsApi={getDigitalCurriculumStatsApi}
          getDigitalCurriculumListApi={getDigitalCurriculumListApi}
          toggle={closeEditCurriculumStructureModal}
          id={editCurriculumStructureModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="publish-curriculum-structure-modal"
        isOpen={publishDigitalCurriculumModalState.showModal}
        toggle={closePublishDigitalCurriculumModal}
        modalTitle="Publish Curriculum Details"
        modalSize="lg"
      >
        <PublishDigitalCurriculumModal
          toggle={closePublishDigitalCurriculumModal}
          id={publishDigitalCurriculumModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="view-curriculum-structure-modal"
        isOpen={viewDigitalCurriculumModalState.showModal}
        toggle={closeViewDigitalCurriculumModal}
        modalTitle="View Curriculum Details"
        headerClassName="!tw-bg-slate-900 !tw-text-white"
        modalSize="lg"
      >
        <ViewDigitalCurriculumModal
          toggle={closeViewDigitalCurriculumModal}
          id={viewDigitalCurriculumModalState.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default CurriculumPlannerTableView;

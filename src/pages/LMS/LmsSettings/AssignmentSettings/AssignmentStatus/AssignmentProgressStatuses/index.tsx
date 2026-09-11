import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useModal } from "../../../../../../hooks/modalhook";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import React, { useMemo } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
} from "../../../../../../Components/Common";
import AssignmentProgressStatusesModal from "./AssignmentProgressStatusesModal";

const AssignmentProgressStatuses = () => {
  const {
    openModal: addEditAssignmentProgressOpenModal,
    closeModal: addEditAssignmentProgressCloseModal,
    modalState: addEditAssignmentProgressModalState,
  } = useModal();

  const {
    openModal: delAssignmentProgressOpenModal,
    closeModal: delAssignmentProgressCloseModal,
    modalState: delAssignmentProgressModalState,
  } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionName: "Edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),

        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditAssignmentProgressOpenModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          delAssignmentProgressOpenModal(id);
        },
      },
    ],
    []
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                Progress Statuses (Class/Section-Level)
              </h4>
              <p className="mb-0 fs-12 text-muted">
                <span className="fw-semibold me-1">Applies to :</span>
                Admins, Teachers (Per Assignment Overview)
              </p>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditAssignmentProgressOpenModal()}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className="me-2"
                    size={18}
                  />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            totalPages={0}
            totalRecords={0}
            currentPageNumber={0}
          ></TableContainer>
        </div>
      </div>

      <ModalContainerUpdated
        id="add-edit-assignment-type-modal"
        isOpen={addEditAssignmentProgressModalState.showModal}
        toggle={addEditAssignmentProgressCloseModal}
        modalTitle={
          addEditAssignmentProgressModalState.modalData
            ? "Edit Assignment Progress Statuses"
            : "Add Assignment Progress Statuses"
        }
        modalSize="md"
      >
        <AssignmentProgressStatusesModal
          id={addEditAssignmentProgressModalState.modalData}
          toggle={addEditAssignmentProgressCloseModal}
        ></AssignmentProgressStatusesModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-assignment-type-modal"
        isOpen={delAssignmentProgressModalState.showModal}
        confirmMessage="Are you sure you want to Delete the Assignment Progress"
        cancelHndlr={delAssignmentProgressCloseModal}
        confirmHndlr={() => {}}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default AssignmentProgressStatuses;

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
import AssignmentLifecycleStatusesModal from "./AddEditAssignmentLifeCycleModal";

const AssignmentLifecycleStatuses = () => {
  const {
    openModal: addEditAssignmentLifeCycleOpenModal,
    closeModal: addEditAssignmentLifeCycleCloseModal,
    modalState: addEditAssignmentLifeCycleModalState,
  } = useModal();

  const {
    openModal: delAssignmentLifeCycleOpenModal,
    closeModal: delAssignmentLifeCycleCloseModal,
    modalState: delAssignmentLifeCycleModalState,
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
          addEditAssignmentLifeCycleOpenModal(id);
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
          delAssignmentLifeCycleOpenModal(id);
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
                Assignment Lifecycle Statuses
              </h4>
              <p className="mb-0 fs-12 text-muted">
                <span className="fw-semibold me-1">Applies to :</span>
                Admins, HODs, Teachers (Course-Level)
              </p>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditAssignmentLifeCycleOpenModal()}
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
        isOpen={addEditAssignmentLifeCycleModalState.showModal}
        toggle={addEditAssignmentLifeCycleCloseModal}
        modalTitle={
          addEditAssignmentLifeCycleModalState.modalData
            ? "Edit Assignment Life Cycle Statuses"
            : "Add Assignment Life Cycle Statuses"
        }
        modalSize="md"
      >
        <AssignmentLifecycleStatusesModal
          id={addEditAssignmentLifeCycleModalState.modalData}
          toggle={addEditAssignmentLifeCycleCloseModal}
        ></AssignmentLifecycleStatusesModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-assignment-type-modal"
        isOpen={delAssignmentLifeCycleModalState.showModal}
        confirmMessage="Are you sure you want to Delete the Assignment Type"
        cancelHndlr={delAssignmentLifeCycleCloseModal}
        confirmHndlr={() => {}}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default AssignmentLifecycleStatuses;

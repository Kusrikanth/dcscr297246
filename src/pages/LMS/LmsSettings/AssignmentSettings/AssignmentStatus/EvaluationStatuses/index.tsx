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
import AddEditEvalutionModal from "./AddEditEvalutionModal";

const EvaluationStatuses = () => {
  const {
    openModal: addEditEvalutionOpenModal,
    closeModal: addEditEvalutionCloseModal,
    modalState: addEditEvalutionModalState,
  } = useModal();

  const {
    openModal: delEvalutionOpenModal,
    closeModal: delEvalutionCloseModal,
    modalState: delEvalutionModalState,
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
          addEditEvalutionOpenModal(id);
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
          delEvalutionOpenModal(id);
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
                Evaluation Statuses (Teacher-Specific)
              </h4>
              <p className="mb-0 fs-12 text-muted">
                <span className="fw-semibold me-1">Applies to :</span>
                Teachers
              </p>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditEvalutionOpenModal()}
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
        isOpen={addEditEvalutionModalState.showModal}
        toggle={addEditEvalutionCloseModal}
        modalTitle={
          addEditEvalutionModalState.modalData
            ? "Edit Evalution Statuses"
            : "Add Evalution Statuses"
        }
        modalSize="md"
      >
        <AddEditEvalutionModal
          id={addEditEvalutionModalState.modalData}
          toggle={addEditEvalutionCloseModal}
        ></AddEditEvalutionModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-assignment-type-modal"
        isOpen={delEvalutionModalState.showModal}
        confirmMessage="Are you sure you want to Delete the Evalution Item"
        cancelHndlr={delEvalutionCloseModal}
        confirmHndlr={() => {}}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default EvaluationStatuses;

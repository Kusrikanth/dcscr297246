import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  ConfirmationModal,
  ModalContainerUpdated,
} from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditMarkingRulesModal from "./AddEditMarkingRulesModal";

const MarkingRules = () => {
  const {
    openModal: addEditOpenMarkingRulesModal,
    closeModal: addEditCloseMarkingRulesModal,
    modalState: addEditMarkingRulesModalState,
  } = useModal();

  const {
    openModal: delOpenMarkingRulesModal,
    closeModal: delCloseMarkingRulesModal,
    modalState: delMarkingRulesModalState,
  } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditOpenMarkingRulesModal(id);
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
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delOpenMarkingRulesModal(id);
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
              <h4 className="card-title mb-0 flex-grow-1">Marking Rules</h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditOpenMarkingRulesModal()}
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
        id="add-edit-difficulty-levels-modal"
        isOpen={addEditMarkingRulesModalState.showModal}
        toggle={addEditCloseMarkingRulesModal}
        modalTitle={
          addEditMarkingRulesModalState.modalData
            ? "Edit Marking Rules"
            : "Add Marking Rules"
        }
        modalSize="md"
      >
        <AddEditMarkingRulesModal
          toggle={addEditCloseMarkingRulesModal}
          id={addEditMarkingRulesModalState.showModal}
        ></AddEditMarkingRulesModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-difficulty-levels-modal"
        isOpen={delMarkingRulesModalState.showModal}
        confirmMessage="Are you sure you want to Delete Item"
        cancelHndlr={delCloseMarkingRulesModal}
        confirmHndlr={() => {}}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default MarkingRules;

import { useMemo } from "react";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  ConfirmationModal,
  ModalContainerUpdated,
} from "../../../../../../Components/Common";
import { useModal } from "../../../../../../hooks/modalhook";

const StudentLevel = () => {
  const {
    openModal: addEditOpenDiffcultyModal,
    closeModal: addEditCloseDiffcultyModal,
    modalState: addEditDiffcultyModalState,
  } = useModal();

  const {
    openModal: delOpenDiffcultyModal,
    closeModal: delClsoeDiffcultyModal,
    modalState: delDiffcultyModalState,
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
        // onClickHndlr: (event: any) => {
        //   const id = event.currentTarget.getAttribute("data-id");
        //   addEditOpenDiffcultyModal(id);
        // },
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
          delOpenDiffcultyModal(id);
        },
      },
    ],
    []
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div>
        <TableContainer
          columns={tableColumns || []}
          data={tableData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showCheckbox={true}
          showPagination={true}
          totalPages={0}
          totalRecords={0}
          currentPageNumber={0}
        ></TableContainer>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={addEditDiffcultyModalState.showModal}
        toggle={addEditCloseDiffcultyModal}
        modalTitle={
          addEditDiffcultyModalState.modalData
            ? "Edit Difficulty"
            : "Add Difficulty"
        }
        modalSize="md"
      ></ModalContainerUpdated>

      <ConfirmationModal
        id="del-difficulty-levels-modal"
        isOpen={delDiffcultyModalState.showModal}
        confirmMessage="Are you sure you want to Delete the Skill Tag"
        cancelHndlr={delClsoeDiffcultyModal}
        confirmHndlr={() => {}}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default StudentLevel;

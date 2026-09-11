import { useMemo } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import AddClassRoomModal from "./AddClassRoom";
import Button from "../../../../Components/Common/Button";

const ClassRoomSettings = () => {
  const {
    closeModal: closeAddClassRoomModal,
    openModal: openAddClassRoomModal,
    modalState: addClassRoomModalState,
  } = useModal();

  const {
    closeModal: closeDeleteClassRoomModal,
    openModal: openDeleteClassRoomModal,
    modalState: deleteClassRoomModalState,
  } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const roomId = event.currentTarget.getAttribute("data-id");
          openAddClassRoomModal(roomId);
        },
      },
      {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const roomId = event.currentTarget.getAttribute("data-id");
          openDeleteClassRoomModal(roomId);
        },
      },
    ],
    []
  );

  const tableColumns = useMemo(
    () => generateColumns(menuOptions),
    [menuOptions]
  );

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="Class Room"
            pageTitle="Time Table Management"
          />
        </div>

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">

          <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-100">
            <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-justify-between tw-gap-4">

              <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                Class Room
              </h4>

              <Button
                onClick={() => openAddClassRoomModal()}
                variant="primary"
              >
                <i className="ri-add-line"></i>
                Add New
              </Button>

            </div>
          </div>

          <div className="  ">

            <div className="tw-w-full sm:tw-w-72 tw-p-6">
              <div className="tw-relative search-box">
                <TextInput
                  name="searchString"
                  formgroupClassName="!tw-mb-0"
                  placeHolder="Search"
                  value={""}
                  onChange={() => { }}
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
              </div>
            </div>

            <div className="tw-overflow-auto tw-rounded-lg tw-border tw-border-gray-100">

              <TableContainer
                columns={tableColumns || []}
                data={tableData || []}
                tableClass="tw-mb-0"
                divClass="tw-w-full"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={0}
                totalRecords={0}
                callbackPaginationHndlr={() => { }}
                currentPageNumber={0}
              />

            </div>

          </div>

        </div>

      </div>

      <ModalContainerUpdated
        id="addClassRoomModal"
        isOpen={addClassRoomModalState.showModal}
        toggle={closeAddClassRoomModal}
        modalTitle={
          addClassRoomModalState.modalData
            ? "Edit Class Room"
            : "Add Class Room"
        }
        modalSize="md"
      >
        <AddClassRoomModal
          toggle={() => closeAddClassRoomModal()}
          modalTitle="Create Class Room"
          isOpen={addClassRoomModalState.showModal}
          modalData={addClassRoomModalState.modalData}
        ></AddClassRoomModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-class-room"
        isOpen={deleteClassRoomModalState.showModal}
        confirmMessage="Are you sure you want to delete a Class Room"
        cancelHndlr={closeDeleteClassRoomModal}
        confirmHndlr={() => {}}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default ClassRoomSettings;

import React, { ChangeEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useModal } from "../../../../hooks/modalhook";
import {
  addTcRetentionMasters,
  deleteTcRetentionMaster,
  getTcRetentionMasters,
  TcRetentionMasterInput,
  TcRetentionMasterType,
  updateTcRetentionMaster,
} from "../../../../utility/tcretentionutility";
import { generateColumns, tcRetentionMasterConfigs } from "./helper";
import AddTcRetentionMasterModal from "./AddTcRetentionMasterModal";

interface ITcRetentionMasterList {
  type: TcRetentionMasterType;
}

// Body of one TC Retention Settings tab: search, add/edit/delete and the table for a single master type.
const TcRetentionMasterList: React.FC<ITcRetentionMasterList> = ({ type }) => {
  const { title } = tcRetentionMasterConfigs[type];
  const [records, setRecords] = useState(() => getTcRetentionMasters(type));
  const [searchString, setSearchString] = useState("");
  const [pagination, setPagination] = useState<IPaginationState>({ pageNo: 0, pageSize: 10 });

  const { closeModal: closeAddModal, modalState: addModalState, openModal: openAddModal } = useModal();
  const { closeModal: closeDeleteModal, modalState: deleteModalState, openModal: openDeleteModal } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          openAddModal(event.currentTarget.getAttribute("data-id"));
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          openDeleteModal(event.currentTarget.getAttribute("data-id"));
        },
      },
    ],
    []
  );

  const columns = useMemo(() => generateColumns(menuOptions, type), [menuOptions, type]);

  const tableData = useMemo(() => {
    const search = searchString.trim().toLowerCase();
    return search ? records.filter((record) => record.name.toLowerCase().includes(search)) : records;
  }, [records, searchString]);

  const { pageNo, pageSize } = pagination;
  const totalPages = Math.ceil(tableData.length / pageSize);
  const pagedData = tableData.slice(pageNo * pageSize, (pageNo + 1) * pageSize);

  function searchHndlr(event: ChangeEvent<HTMLInputElement>) {
    setSearchString(event.target.value);
    setPagination((prevState) => ({ ...prevState, pageNo: 0 }));
  }

  const editItem = records.find((record) => `${record.id}` === `${addModalState.modalData}`);

  // TODO: dispatch the add / update TC retention master APIs here once they are available.
  function submitHndlr(items: Array<TcRetentionMasterInput>) {
    if (editItem) {
      setRecords(updateTcRetentionMaster(type, editItem.id, items[0]));
      toast.success(`${title} Updated Successfully`);
    } else {
      setRecords(addTcRetentionMasters(type, items));
      toast.success(`${title} Added Successfully`);
    }
    closeAddModal();
  }

  // TODO: dispatch the delete TC retention master API here once it is available.
  function deleteHndlr() {
    const updatedRecords = deleteTcRetentionMaster(type, deleteModalState.modalData);
    setRecords(updatedRecords);
    // Deleting the only row on the last page would leave an empty page, so go back to the first one.
    if (pageNo > 0 && pageNo * pageSize >= updatedRecords.length) {
      setPagination((prevState) => ({ ...prevState, pageNo: 0 }));
    }
    toast.success(`${title} Deleted Successfully`);
    closeDeleteModal();
  }

  return (
    <>
      <div className="tw-px-4 tw-py-4">
        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-justify-between tw-gap-3">
          <div className="tw-w-full sm:tw-w-72">
            <div className="search-box">
              <TextInput
                name="searchString"
                value={searchString}
                onChange={searchHndlr}
                inputClassName="tw-bg-gray-100"
                formgroupClassName="tw-mb-0"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <Button type="button" variant="primary" onClick={() => openAddModal()} className="tw-flex tw-items-center tw-self-end sm:tw-self-auto">
            <i className="ri-add-line tw-mr-2" />
            Add {title}
          </Button>
        </div>
      </div>
      <TableContainer
        columns={columns}
        data={pagedData}
        divClass="tw-overflow-x-auto tw-mb-3"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
        showPagination={true}
        totalPages={totalPages}
        totalRecords={tableData.length}
        callbackPaginationHndlr={setPagination}
        currentPageNumber={pageNo}
      />
      <ModalContainerUpdated
        id="add-tc-retention-master-modal"
        isOpen={addModalState.showModal}
        toggle={closeAddModal}
        modalTitle={editItem ? `Edit ${title}` : `Add ${title}`}
        modalSize="md"
      >
        <AddTcRetentionMasterModal
          type={type}
          editItem={editItem}
          existingRecords={records}
          toggle={closeAddModal}
          submitHndlr={submitHndlr}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-tc-retention-master-modal"
        isOpen={deleteModalState.showModal}
        confirmMessage={`Are you sure you want to delete this ${title} ?`}
        cancelHndlr={closeDeleteModal}
        confirmHndlr={deleteHndlr}
        showImgIcon={true}
        iconType="reject"
        btnClassName="btn w-sm btn-danger"
      />
    </>
  );
};

export default TcRetentionMasterList;

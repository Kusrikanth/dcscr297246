import { useMemo } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { useModal } from "../../../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../../../Components/Common";

const BulkUploadData = () => {
  const {
    openModal: importBlukDataOpenModal,
    closeModal: importBlukDataCloseModal,
    modalState: importBlukDataModalState,
  } = useModal();

  const tableColumns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="card shadow-none !tw-border !tw-rounded-lg">
        <div className="card-body">
          <div className="tw-mb-4">
            <h4 className="card-title mb-0">Bulk Import(.xlsx)</h4>
            <p className="tw-mb-0 tw-text-gray-500">
              Use the template, validate, then import to create/patch the
              structure.
            </p>
          </div>
          <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-3 tw-gap-y-2">
            <div className="tw-flex tw-items-center tw-gap-x-2 tw-gap-y-1">
              <button className="btn btn-outline-success">
                Download template
              </button>
              <button className="btn btn-outline-primary">Chose File</button>
            </div>
            <div className="tw-flex tw-items-center tw-gap-x-2 tw-gap-y-1">
              <button className="btn btn-outline-warning">Validate Only</button>
              <button
                className="btn btn-secondary"
                onClick={importBlukDataOpenModal}
              >
                Import & Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-none !tw-border !tw-rounded-lg !tw-overflow-hidden">
        <div className="card-body p-0">
          <TableContainer
            columns={tableColumns}
            data={tableData || []}
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle !tw-overflow-hidden"
            // showPagination={true}
          ></TableContainer>
        </div>
      </div>

      {/* <ModalContainerUpdated
        id="bluk-upload-modal"
        isOpen={importBlukDataModalState.showModal}
        toggle={importBlukDataCloseModal}
        modalSize="xl"
        modalTitle="Bulk upload the Currciulum Data"
      >
        <ImportBlukDataModal
          toggle={importBlukDataCloseModal}
        ></ImportBlukDataModal>
      </ModalContainerUpdated> */}
    </>
  );
};

export default BulkUploadData;

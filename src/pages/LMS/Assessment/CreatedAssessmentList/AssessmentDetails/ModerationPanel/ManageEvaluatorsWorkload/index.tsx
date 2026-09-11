import { useMemo } from "react";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AnalysisTextLinkIcon,
  ArrowReloadHorizontalIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Notification03Icon,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { generateColumns, tableData } from "./helper";
import { ModalContainerUpdated } from "../../../../../../../Components/Common";
import AddModratores from "../AddModratores";
import { useModal } from "../../../../../../../hooks/modalhook";

const ManageEvaluatorsWorkload = () => {
  const {
    closeModal: closeAddUnitModal,
    modalState: addUnitState,
    openModal: openAddUnitModal,
  } = useModal();

  const menuOptions = useMemo(
    () => [
      {
        id: "notify",
        actionIcon: (
          <HugeiconsIcon
            icon={Notification03Icon}
            className="me-2 d-inline-block"
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Notify",
      },
      {
        id: "reGrade",
        actionIcon: (
          <HugeiconsIcon
            icon={ArrowReloadHorizontalIcon}
            className="me-2 d-inline-block"
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Re Grade",
      },
      {
        id: "resolveExceptions",
        actionIcon: (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            className="me-2 d-inline-block"
            size={18}
            color="#878a99"
          />
        ),
        actionName: "Resolve Exceptions",
        onClickHndlr: (event: any) => {},
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
            <div className="col-12 col-lg-6">
              <h4 className="card-title mb-0">Manage Evaluators Workload</h4>
            </div>
            <div className="col-12 col-lg-auto ms-auto">
              <button
                className="btn btn-success d-flex align-items-center justify-content-center"
                onClick={() => openAddUnitModal()}
              >
                <i className="ri-add-line me-2" />
                Add New
              </button>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            divClass="table-responsive mb-3 fs-12"
            tableClass="table-nowrap"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            // showCheckbox={true}
            totalPages={0}
            totalRecords={0}
          ></TableContainer>
        </div>
      </div>

      <ModalContainerUpdated
        id="add-examination"
        isOpen={addUnitState.showModal}
        toggle={() => closeAddUnitModal()}
        modalTitle="Assign"
        modalSize="md"
      >
        <AddModratores toggle={closeAddUnitModal} id={addUnitState.modalData} />
      </ModalContainerUpdated>
    </>
  );
};

export default ManageEvaluatorsWorkload;

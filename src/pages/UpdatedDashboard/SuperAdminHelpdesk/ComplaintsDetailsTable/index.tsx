import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useModal } from "../../../../hooks/modalhook";
import { Button, ModalContainerUpdated } from "../../../../Components/Common";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch } from "../../../../hooks/storehook";
import { exportOpenTicketsAct } from "../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";

const ComplaintsDetailsTable = (props: any) => {
  
  const dispatch = useAppDispatch();
  

  const tableColumns = useMemo(() => generateColumns(), [props.data]);

  function submitExportHndlr() {

    const payload = {
      instituteId: props?.instituteId,
      academicYearId: props?.filters?.academicYearId,
      ...props?.filters
    };
    if (Array.isArray(payload.departmentNames)) {
      payload.departmentNames = payload.departmentNames.map((item: any) => item.name).join(",");
    }
    dispatch(exportOpenTicketsAct(generateActionPayload('export_open_tickets_details', undefined, payload, { responseType: 'blob' })))
  }

  return (
    <div className="card !tw-rounded-2xl !tw-shadow-sm">
      <div className="card-header !tw-rounded-t-2xl">
        <div className="tw-flex tw-flex-wrap tw-items-center">
          <div className="tw-w-10/12 lg:tw-w-6/12 tw-mt-0">
            <h4 className="card-title !tw-mb-2 md:!tw-mb-0">
              Open Tickets Details
            </h4>
          </div>
          <div className="tw-w-auto tw-mt-0 tw-ml-auto">
            <div className="tw-flex tw-items-center">
              <Button
                id="export-btn"
                title="Export"
                variant="exportBtn"
                onClick={props.openModal}
              >
                <img src={ExportIcon} className="img-fluid tw-w-5 tw-h-5" />
              </Button>
              <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body !tw-px-0 !tw-pt-0 !tw-pb-3">
        <TableContainer
          columns={tableColumns || []}
          data={props.data?.openTicketDetails || []}
          tableClass="tw-mb-0"
          divClass="table-responsive !tw-overflow-x-auto tw-max-h-[400px]"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0 tw-z-[1]"
          showPagination={false}
          showFooter={false}
        ></TableContainer>
      </div>

      <ModalContainerUpdated
        id="export-section-modal"
        isOpen={props.modalState.showModal}
        toggle={props.closeModal}
        modalTitle="Export Open Tickets Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={props.modalState.showModal}
          toggle={props.closeModal}
          instituteId={props.instituteId}
          // branchId={props?.filters?.branchId}
          submitHndlr={submitExportHndlr}
          feature="helpdesk"
          subFeature="dashboard_open_tickets"
          remarksText="Enter remarks to export Open Tickets Details?"
        />
      </ModalContainerUpdated>
    </div>
  );
};

export default ComplaintsDetailsTable;

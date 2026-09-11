import { useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportTransportFeeTermWiseAct, getTransportFeeTermWiseAct } from "../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { Button, ModalContainerUpdated } from "../../../../Components/Common";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";

interface ITransportFeeCollectionTableViewProps {
  academicYearId: string,
  branchIdState: string
}

const TransportFeeCollectionTableView: React.FC<ITransportFeeCollectionTableViewProps> = (props) => {

  const { academicYearId, branchIdState: branchId } = props || {}
  const [tableData, setTableData] = useState<any[]>([])
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp,
    getTransportFeeTermWiseResp,
    exportTransportFeeTermWiseResp,
  } = useAppSelector(
    ({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getTransportFeeTermWiseResp: feeReport.getTransportFeeTermWiseResp,
      exportTransportFeeTermWiseResp: feeReport.exportTransportFeeTermWiseResp,
    }),
    shallowEqual
  );
  const transportFeeCollectionRef = useRef({
    prevExportTransportFeeTermWiseResp: exportTransportFeeTermWiseResp,
  });

  useEffect(() => {
    const { prevExportTransportFeeTermWiseResp } = transportFeeCollectionRef.current;
    if (exportTransportFeeTermWiseResp && exportTransportFeeTermWiseResp !== prevExportTransportFeeTermWiseResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportTransportFeeTermWiseResp, "Transport_Fee_Collection");
    }
    transportFeeCollectionRef.current.prevExportTransportFeeTermWiseResp = exportTransportFeeTermWiseResp;

  }, [exportTransportFeeTermWiseResp]);

  useEffect(() => {
    if (instituteId && academicYearId) {
      getTransportTermsApiCall();
    }
  }, [instituteId, academicYearId, branchId]);

  useEffect(() => {
    if (Array.isArray(getTransportFeeTermWiseResp)) {
      const modifiedResp = getTransportFeeTermWiseResp.map((item: any) => {
        const { branchName, routes, students, totalVehicles, occupancy = 0, termWiseSummaries = [], vehiclesCapacity, employees } = item || {}
        const termData = termWiseSummaries?.reduce((acc: any, curr: any) => {
          const key = curr?.termName?.replace("-", "") || "";
          acc[`${key?.toLowerCase()}Per`] = ((curr.totalStudentsPaid || 0) / (curr.totalStudents || 1)) * 100;
          return acc;
        }, {})
        return {
          branchName, routes, students, totalVehicles, occupancy, vehiclesCapacity, employees, ...termData
        }
      })
      setTableData(modifiedResp)
    }
  }, [getTransportFeeTermWiseResp])

  const getTransportTermsApiCall = () => {
    const payload = {
      instituteId, academicYearId
    };
    dispatch(
      getTransportFeeTermWiseAct(
        generateActionPayload(
          "get_transport_fee_term_wise",
          undefined,
          payload
        )
      )
    )
  };

  const exportSubmitHndlr = () => {
    const payload = { instituteId, academicYearId };
    dispatch(exportTransportFeeTermWiseAct(generateActionPayload("export_transport_fee_term_wise", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const tableColumns = useMemo(() => generateColumns(getTransportFeeTermWiseResp), [getTransportFeeTermWiseResp]);
  return (
    <>
      <div className="card !tw-shadow-sm !tw-rounded-2xl">
        <div className="card-header !tw-p-4 !tw-rounded-t-2xl">
          <div className="tw-flex tw-items-center tw-justify-between">
            <div>
              <h4 className="card-title !tw-mb-0">
                Transport Fee Term wise
              </h4>
            </div>
            <div>
              <div className="tw-flex tw-gap-3">
                <Button
                  id="export-btn"
                  variant="exportBtn"
                  onClick={openExportModal}
                >
                  <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body !tw-pt-0 !tw-px-0">
          <TableContainer
            columns={tableColumns || []}
            data={tableData || []}
            divClass="table-responsive tw-overflow-auto max-h-400px"
            theadClass="table-light tw-bg-gray-100 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0"
            showFooter={true}
            trFooterClass="tw-font-bold tw-bg-gray-100"
          ></TableContainer>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-transport-fee-term-wise-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Transport Fee Term wise"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="transportation"
          subFeature={"transport_fee_term_wise"}
          remarksText="Enter remarks to export Transport Fee Term wise ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TransportFeeCollectionTableView;

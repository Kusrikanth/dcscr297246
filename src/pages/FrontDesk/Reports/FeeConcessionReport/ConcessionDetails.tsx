import React, { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumnsConcession } from "./helper";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../../Components/Common";
import DetailReportModal from "./DetailReportModal";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { exportStuConcessionV2Act } from "../../../../store/fee/feeconcessions/feeconcessionactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { csvExportHndlr, downloadExcelFile } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";

interface ConcessionDetailsProps {
  academicYearId: string;
  curriculumId: string;
  classId: string;
}
const ConcessionDetails: React.FC<ConcessionDetailsProps> = ({ academicYearId, curriculumId, classId }) => {

  const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModalState, openModal: openExportConfirmationModal } = useModal()
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
    const dispatch = useAppDispatch();
  const { modalState: detailReportModalState, closeModal: closeDetailReportModalHndlr,
    openModal: openDetailReportModalHndlr
  } = useModal();
    const exportModalHndler = () => {
      let payload = {
        academicYearId,
        curriculumId,
        classId,
        branchId: branchId,
      };
      dispatch(exportStuConcessionV2Act(generateActionPayload('export_stu_concession_v2', undefined, { ...payload }, {
        responseType: 'blob'
      })))
    }
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getConcessionDashboardDataListResp,
    exportStuConcessionV2Resp,
  } = useAppSelector(
    ({ appData, masterFeeSettings, feeConcession }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getConcessionDashboardDataListResp: masterFeeSettings.getConcessionDashboardDataListResp,
      exportStuConcessionV2Resp: feeConcession.exportStuConcessionV2Resp,
    }), shallowEqual);

  const StudentConcessionRef = useRef({
    prevExportStuConcessionV2Resp: exportStuConcessionV2Resp,
  })
 
   useEffect(() => {
     const { prevExportStuConcessionV2Resp } = StudentConcessionRef.current || {};
     if (exportStuConcessionV2Resp && exportStuConcessionV2Resp !== prevExportStuConcessionV2Resp) {
      downloadExcelFile(exportStuConcessionV2Resp, "Concession_Details_List")
       toast.success("Concession Details Downloaded Successfully.")
       closeExportConfirmationModal();
     }
      StudentConcessionRef.current.prevExportStuConcessionV2Resp = exportStuConcessionV2Resp
   }, [exportStuConcessionV2Resp])
  
  const roleColumns = useMemo(() => generateColumnsConcession(openDetailReportModalHndlr), [openDetailReportModalHndlr]);
  const staticSlabs = [
    { slabFrom: "0.1%", slabTo: "5%" },
    { slabFrom: "05%", slabTo: "15%" },
    { slabFrom: "15%", slabTo: "25%" },
    { slabFrom: "25%", slabTo: "35%" },
    { slabFrom: "35%", slabTo: "50%" },
    { slabFrom: "50%", slabTo: "75%" },
    { slabFrom: "75%", slabTo: "98%" },
    { slabFrom: "98%", slabTo: "100%" },
  ];

  const formatSlabRange = (slabFrom: string, slabTo: string) => {
     if (slabFrom === "0.1%" && slabTo === "5%") return "0-5%";
     if (slabFrom === "05%" && slabTo === "15%") return "5-15%";
     if (slabFrom === "98%" && slabTo === "100%") return "100%";
     return `${slabFrom.replace("%", "").padStart(2, "0")}-${slabTo.replace("%", "").padStart(2, "0")}%`;
   };
   
   const generateTableData = (data: any[], staticSlabs: { slabFrom: string; slabTo: string }[]) => {
     return staticSlabs.map(({ slabFrom, slabTo }) => {
       const formattedSlab = formatSlabRange(slabFrom, slabTo);
   
       const matchingData = data.find((item) => 
         item.slab === formattedSlab || 
         (formattedSlab === "0-5%" && item.slab === "0.1-5%") ||
         (formattedSlab === "5-15%" && item.slab === "05-15%")
       );
      return {
        staticSlab: formattedSlab,
        totalAmount: matchingData?.totalAmount || 0,
        totalConcessionAmount: matchingData?.totalConcessionAmount || 0,
        totalConcessionCount: matchingData?.totalConcessionCount || 0,
        academicConcession: matchingData?.academicConcession || 0,
        academicConcessionCount: matchingData?.academicConcessionCount || 0,
        sportsConcession: matchingData?.sportsConcession || 0,
        sportsConcessionCount: matchingData?.sportsConcessionCount || 0,
        siblingConcession: matchingData?.siblingConcession || 0,
        siblingConcessionCount: matchingData?.siblingConcessionCount || 0,
        pvaConcession: matchingData?.pvaConcession || 0,
        pvaConcessionCount: matchingData?.pvaConcessionCount || 0,
        otherConcession: matchingData?.otherConcession || 0,
        otherConcessionCount: matchingData?.otherConcessionCount || 0,
        managementConcession: matchingData?.managementConcession || 0,
        managementConcessionCount: matchingData?.managementConcessionCount || 0,
      };
    });
  };

  const mappedData = useMemo(() => {

    return generateTableData(getConcessionDashboardDataListResp?.concessionReportDTOS || [], staticSlabs);
  }, [getConcessionDashboardDataListResp]);

  const updatedModalData = detailReportModalState.modalData
  ? (() => {
      const { staticSlab } = detailReportModalState.modalData;
      const slabRange = staticSlabs.find(({ slabFrom, slabTo }) => formatSlabRange(slabFrom, slabTo) === staticSlab);   
      return {
        ...detailReportModalState.modalData,
        slabFrom: slabRange ? parseInt(slabRange.slabFrom.replace("%", ""), 10) : 0,
        slabTo: slabRange ? parseInt(slabRange.slabTo.replace("%", ""), 10) : 0,
        academicYearId,
        curriculumId,
        classId,
      };
    })()
  : {};
  
  return (
    <>
      <div className="card">
        <div className="tw-border-b tw-px-4 tw-py-3">
          <div className="tw-flex tw-items-center tw-justify-between">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
              Concession Details
            </h4>

            <Button
              id="export-btn"
              variant="exportBtn"
              onClick={openExportConfirmationModal}
            >
              <img src={ExportIcon} className="tw-h-5 tw-w-5 tw-object-contain" alt="Export" />
              <UncontrolledTooltip placement="bottom" target="export-btn">
                Export
              </UncontrolledTooltip>
            </Button>
          </div>
        </div>
        <TableContainer
          columns={roleColumns || []}
          data={mappedData}
          divClass="table-responsive tw-mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={false}
          showFooter={false}
        />
      </div>

      <ModalContainerUpdated
        id="printform-view"
        // modalTitle="Change Password"
        modalTitle={"Concession Details"}
        isOpen={detailReportModalState.showModal}
        toggle={closeDetailReportModalHndlr}
        modalSize="xl"
        hideHeader={true}
      >
        <DetailReportModal
        toggle={closeDetailReportModalHndlr}
          modalData={updatedModalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="student-concession-export-modal"
        isOpen={exportConfirmationModalState.showModal}
        toggle={closeExportConfirmationModal}
        modalTitle="Export Concession Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportConfirmationModalState.showModal}
          toggle={closeExportConfirmationModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature="fee_concession"
          remarksText="Enter remarks to export Concession Data?"
        />
      </ModalContainerUpdated>
    </>
  )
}

export default ConcessionDetails
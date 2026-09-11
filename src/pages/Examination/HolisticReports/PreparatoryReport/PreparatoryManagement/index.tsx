import React, { useEffect, useMemo, useState } from "react";
import PreparatoryActivities from "./PreparatoryActivities";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import PreparatoryGradeEntry from "./PreparatoryGradeEntry";
import ProgressCard from "./ProgressCard";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useModal } from "../../../../../hooks/modalhook";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { exportPreparatoryGradeEntryListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { downloadExcelFile } from "../../../../../utility/commonutility";
import { toast } from "react-toastify";

const PreparatoryManagement = () => {
  const { closeModal: closeExportSectionModalHnldr, openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();
  const dispatch = useAppDispatch();
  const [filter, setFilter] = useState<any>(null);

  const {

    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    exportPreparatoryGradeEntryListResp,
    loggedInUserRole,
  } = useAppSelector(
    ({ appData, examinationSettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      exportPreparatoryGradeEntryListResp: examinationSettings.exportPreparatoryGradeEntryListResp
    }),
    shallowEqual
  );
  const initialActiveId = useMemo(() => {
    if (loggedInUserRole === "TEACHER") {
      return "gradeEntry"
    }
    return "activities";
  }, [loggedInUserRole]);
  const [activeId, setActiveId] = useState<any>(initialActiveId);

  const branchDashboardRef = React.useRef({
    prevExportPreparatoryGradeEntryListResp: exportPreparatoryGradeEntryListResp,
  });

  useEffect(() => {
    const { prevExportPreparatoryGradeEntryListResp } = branchDashboardRef.current;

    if (exportPreparatoryGradeEntryListResp && prevExportPreparatoryGradeEntryListResp !== exportPreparatoryGradeEntryListResp) {
      toast.success("Exported garde entry Successfully");
      closeExportSectionModalHnldr();
      downloadExcelFile(exportPreparatoryGradeEntryListResp, "Preparatory_Grade_Entry");
    }

    branchDashboardRef.current.prevExportPreparatoryGradeEntryListResp = exportPreparatoryGradeEntryListResp;
  }, [exportPreparatoryGradeEntryListResp])



  const MenuOptions = useMemo(() => {
    const options = [{
      id: "activities",
      labelName: "Activities",
      customPadding: "0px 15px",
    },
    {
      id: "gradeEntry",
      labelName: "Grade Entry",
      customPadding: "0px 15px",
    },
    {
      id: "progressCard",
      labelName: "Progress Card",
      customPadding: "0px 15px",
    }];
    if (loggedInUserRole === "TEACHER") {
      return options.filter(item => item.id !== "activities")
    }
    return options;
  }, [loggedInUserRole]);

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "activities":
        return PreparatoryActivities;
      case "gradeEntry":
        return PreparatoryGradeEntry;
      case "progressCard":
        return ProgressCard;
      default:
        return null;
    }
  }
  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }
  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent setFilter={setFilter} />;
  }, [activeId, setFilter]);

  function submitExportHndlr() {
    const payload = {
      branchId,
      academicYearId: filter?.academicYearId,
      curricullumId: filter?.curriculumId,
      classId: filter?.classId,
      ...filter
    };
    dispatch(exportPreparatoryGradeEntryListAct(generateActionPayload('export_preparatory_stage_grade_entry', undefined, payload, { responseType: 'blob' })))
  }

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb
            title="Foundation Stage"
            pageTitle="Examination"
          />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Preparatory Stage
                  </h4>
                </div>
                {activeId === "gradeEntry" && <div className="col-auto ms-auto">
                  <button
                    id="export-btn"
                    className="btn btn-icon btn-rounded btn-soft-info p-2 me-2"
                    onClick={openExportSectionModalHnldr}
                  >
                    <img src={ExportIcon} className="img-fluid h-100" />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </button>
                </div>}
              </div>
            </div>
            <div className="card-body p-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="pt-2 mb-2 overflow-auto text-nowrap"
              />
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-section-modal"
        isOpen={exportSectionModalState.showModal}
        toggle={closeExportSectionModalHnldr}
        modalTitle="Export Foundation Stage Grade Entry Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportSectionModalState.showModal}
          toggle={closeExportSectionModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="examination"
          subFeature="holistic_ps_profiles_export"
          remarksText="Enter remarks to export foundation stage grade entry?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default PreparatoryManagement;

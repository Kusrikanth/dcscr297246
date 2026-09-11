import { useEffect, useMemo, useRef, useState } from "react";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import AcademicYearWiseAllTotal from "../../../DashBoardBranchSummary/AcademicYearWiseTotal/AcademicYearWiseAllTotal";
import AcademicYearCurrrentPreTotal from "../../../DashBoardBranchSummary/AcademicYearWiseTotal/AcademicYearCurrrentPreTotal";
import AcademicYearWiseClassTotal from "../../../DashBoardBranchSummary/AcademicYearWiseTotal/AcademicYearWiseClassTotal";
import { getExportAdmissionDashboardAct, getSchoolStrengthAct } from "../../../../store/academic/academicRequest/academicrequestactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { getActiveId } from "./helper";
import { useFormik } from "formik";
import { getClassListAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { ModalContainerUpdated } from "../../../../Components/Common";
import ExportModal from "../../StudentManagement/ExportModal";


interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  academicYearId: "",
  curriculumId: "",
};

const AcademicYearWiseTotal = () => {
  const { closeModal: closeExportSectionModalHnldr,
    openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();
  const dispatch = useAppDispatch()
  const [activeId, setActiveId] = useState<any>("academicYearWiseAllTotal");
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "academicYearWiseAllTotal",
      labelName: "All",
      customPadding: "5px 5px 5px 5px",
    },
    {
      id: "academicYearCurrrentPreTotal",
      labelName: "Current vs Previous",
      customPadding: "5px 5px 5px 5px",
    },
    {
      id: "academicYearWiseClassTotal",
      labelName: "Class",
      customPadding: "5px 5px 5px 5px",
    },
  ];
  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "academicYearWiseAllTotal":
        return AcademicYearWiseAllTotal;
      case "academicYearCurrrentPreTotal":
        return AcademicYearCurrrentPreTotal;
      case "academicYearWiseClassTotal":
        return AcademicYearWiseClassTotal;
    }
  }

  const AcademicYearWiseApiCall = (otherProps?: any) => {

    const { academicYearId, curriculumId } = upcomingEvents.values;
    let payload = {
      academicYearId,
      curriculumId,
      branchId,
      instituteId,
      ...otherProps,
    };
    if (instituteId) {
      dispatch(getSchoolStrengthAct(generateActionPayload('get_school_strength', undefined, payload)))
    }
  }


  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicRequestErrorResp,
    exportAdmissionDashboardResp
  } = useAppSelector(
    ({ appData, academicRequest }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicRequestErrorResp: academicRequest.academicRequestErrorResp,
      exportAdmissionDashboardResp: academicRequest.exportAdmissionDashboardResp

    }),
    shallowEqual
  );

  const studentCountRef = useRef({
    prevAcademicRequestErrorResp: academicRequestErrorResp,
    prevExportAdmissionDashboardResp: exportAdmissionDashboardResp,

  });

  useEffect(() => {
    const { prevAcademicRequestErrorResp, prevExportAdmissionDashboardResp } =
      studentCountRef.current;
    if (academicRequestErrorResp && academicRequestErrorResp !== prevAcademicRequestErrorResp) {
      const { details } = academicRequestErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (exportAdmissionDashboardResp && exportAdmissionDashboardResp !== prevExportAdmissionDashboardResp) {
      const { name } = exportAdmissionDashboardResp || {}
      if (name === "school_strength") {
        toast.success("Exported successfully");
        closeExportSectionModalHnldr()
        AcademicYearWiseApiCall();
        downloadExcelFile(exportAdmissionDashboardResp?.data, getActiveId(activeId));
      }
    }
    studentCountRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
    studentCountRef.current.prevExportAdmissionDashboardResp = exportAdmissionDashboardResp;

  }, [academicRequestErrorResp, exportAdmissionDashboardResp]);

  const upcomingEvents = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  })

  useEffect(() => {
    AcademicYearWiseApiCall();
    let payload = {
      branchId,
      instituteId,
    };
    if (instituteId && branchId) {
      dispatch(getClassListAct(generateActionPayload('class_list', undefined, payload)))
    }
  }, [branchId, instituteId]);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return (
      <TabComponent activeId={activeId} />
    );
  }, [activeId, branchId, instituteId]);


  function submitExportHndlr() {

    const payload = {
      branchId,
      instituteId,
      exportType: "",
      name: "school_strength",
    };
    if (activeId === "academicYearWiseAllTotal") {
      payload.exportType = "all";
    }
    else if (activeId === "academicYearCurrrentPreTotal") {
      payload.exportType = "currentVsPs";
    }
    else if (activeId === "academicYearWiseClassTotal") {
      payload.exportType = "class";
    }
    if (payload.exportType !== "") {
      dispatch(getExportAdmissionDashboardAct(generateActionPayload('export_school_strength', undefined, payload, {
        responseType: 'blob'
      })))
    }
  }



  return (
    <>
      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">

        <div className="tw-px-6 tw-py-2 tw-border-b tw-border-gray-100">
          <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center text-align-center md:tw-justify-between tw-gap-4">

            <h4 className="tw-text-[16px] tw-font-[500] tw-text-gray-800 text-align-center tw-mb-0">
              School Strength
            </h4>

            <div>
              <button
                id="export-btn"
                onClick={openExportSectionModalHnldr}
                className="tw-inline-flex tw-items-center tw-justify-center tw-w-10 tw-h-10 tw-rounded-full tw-bg-blue-50 hover:tw-bg-blue-100 tw-transition tw-duration-200"
              >
                <img src={ExportIcon} alt="Export" className="tw-w-5 tw-h-5" />
              </button>

              <UncontrolledTooltip placement="bottom" target="export-btn">
                Export
              </UncontrolledTooltip>
            </div>

          </div>
        </div>

        <div className="tw-p-6 horizontal_tab">

          <div className="tw-mb-6 tw-grid tw-grid-cols-12">
            <div className="tw-col-span-12 tw-pt-3 tw-flex tw-justify-end tw-md-0 tw-px-4">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-ps-0"
              />
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-6">
            <div className="tw-col-span-12">
              {activeComponent}
            </div>
          </div>

        </div>

      </div>
      <ModalContainerUpdated
        id="export-section-modal"
        isOpen={exportSectionModalState.showModal}
        toggle={closeExportSectionModalHnldr}
        modalTitle="Export School Strength Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportSectionModalState.showModal}
          toggle={closeExportSectionModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="branch_dashboard"
          subFeature={getActiveId(activeId)}
          remarksText="Enter remarks to export school strength details?"
        />
      </ModalContainerUpdated>
    </>
  )
}

export default AcademicYearWiseTotal
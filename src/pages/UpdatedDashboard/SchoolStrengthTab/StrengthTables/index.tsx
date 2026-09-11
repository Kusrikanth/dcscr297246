import { useEffect, useMemo, useRef, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import CurriculumWiseStrengthExpand from "./CurriculumWiseStrengthExpand";
import GenderWiseStrengthExpand from "./GenderWiseStrengthExpand";
import NotPromotedReport from "./NotPromotedReport";
import StreamWiseStrength from "./StreamWiseStrength";
import TcTable from "./TcTable";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportClassByBranchStatusAct, getClassByBranchStatusAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const inititalValues = {
  branchId: "",
  academicYearId: "",
  tcStatus: "REQUESTED",
}

const tcFilers: Array<any> = [
  {
    id: "REQUESTED",
    name: "Requested",
  },
  {
    id: "PREPARED",
    name: "Preparted",
  },
  {
    id: "ISSUED",
    name: "Issued",
  },
];

const StrengthTables = () => {
  const [activeId, setActiveId] = useState("curriculum-wise");
  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(inititalValues);
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const {
    currentInstIdResp: instituteId, academicYearListResp, exportClassByBranchStatusResp } =
    useAppSelector(({ appData, instAcademics, reports }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      exportClassByBranchStatusResp: reports.exportClassByBranchStatusResp,
    }), shallowEqual)

  const clasByBranchStatusRef = useRef({
    prevExportClassByBranchStatusResp: exportClassByBranchStatusResp,
  });

  useEffect(() => {
    const { prevExportClassByBranchStatusResp } = clasByBranchStatusRef.current;
    if (exportClassByBranchStatusResp && exportClassByBranchStatusResp !== prevExportClassByBranchStatusResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportClassByBranchStatusResp, "class_by_branch_status");
    }
    clasByBranchStatusRef.current.prevExportClassByBranchStatusResp = exportClassByBranchStatusResp;

  }, [exportClassByBranchStatusResp]);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "curriculum-wise",
      labelName: "Curriculum",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "gender-wise",
      labelName: "Gender",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "not-promoted-report",
      labelName: "Promoted Students",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "tc-table",
      labelName: "TC",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId || "");
  }

  const classbyBranchStatusApiCall = (otherProps?: any) => {
    const payload = {
      ...filterState,
      instituteId,
      type: activeId === "curriculum-wise" ? "CURRICULUM" : activeId === "gender-wise" ? "GENDER" : activeId === "not-promoted-report" ? "PROMOTION STATUS" : "TC STATUS",
      ...otherProps,
    };
    if (activeId !== "tc-table") {
      delete payload.tcStatus
    }
    if (instituteId) {
      dispatch(getClassByBranchStatusAct(generateActionPayload('get_class_by_branch_status', undefined, payload)))
    }
  }

  const exportSubmitHndlr = () => {
    const payload = {
      academicYearId: filterState.academicYearId,
      branchId: filterState.branchId,
      instituteId,
      tcStatus: filterState.tcStatus,
      type: activeId === "curriculum-wise" ? "CURRICULUM" : activeId === "gender-wise" ? "GENDER" : activeId === "not-promoted-report" ? "PROMOTION STATUS" : "TC STATUS",
    };
    dispatch(exportClassByBranchStatusAct(generateActionPayload("export_class_by_branch_status", undefined, payload, {
      responseType: 'blob'
    })));
  }

  useEffect(() => {
    if (activeId && academicYearListResp) {
      const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
      classbyBranchStatusApiCall({ academicYearId: yearId })
    }
  }, [academicYearListResp, activeId]);

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "curriculum-wise":
        return CurriculumWiseStrengthExpand;
      case "gender-wise":
        return GenderWiseStrengthExpand;
      case "not-promoted-report":
        return NotPromotedReport;
      case "stream-wise-strength":
        return StreamWiseStrength;
      case "tc-table":
        return TcTable;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent academicYearId={filterState.academicYearId} tcStatus={filterState.tcStatus}></TabComponent>;
  }, [activeId, filterState.academicYearId]);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value, }));
    classbyBranchStatusApiCall({ [name]: value })
  }

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="curriculum-wise-strength-container">
        <div className="card !tw-rounded-2xl !tw-shadow-sm">
          <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-4">
              <div>
                <h4 className="card-title !tw-mb-0">
                  Class by Branch Status
                </h4>
              </div>

              <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-4">
                <SelectInput
                  name="academicYearId"
                  value={filterState.academicYearId}
                  onChange={onChangeFilterHndlr}
                  menuItems={academicYearList || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="tw-mb-0"
                  labelText="Academic Year"
                  floatingLabel
                />
                {activeId === "tc-table" && (
                  <SelectInput
                    name="tcStatus"
                    value={filterState.tcStatus}
                    onChange={onChangeFilterHndlr}
                    menuItems={tcFilers || []}
                    valueKey="id"
                    textKey="name"
                    formgroupClassName="tw-mb-0"
                    defaultSelect="Select"
                    labelText="TC Filters"
                    floatingLabel
                  />
                )}
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="horizontal-menu-updated-style !overflow-x-auto !tw-justify-end !tw-text-wrap"
                />
                <button
                  id="export-btn"
                  className="btn btn-icon tw-p-2 !tw-rounded-full !tw-bg-sky-100"
                  onClick={openExportModal}
                >
                  <img src={ExportIcon} className="img-fluid tw-w-5 tw-h-5" alt="Export" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button>
              </div>
            </div>
          </div>
          <div className="card-body !tw-p-0">{activeComponent}</div>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-class-by-branch-status-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Class By Branch Status"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={""}
          submitHndlr={exportSubmitHndlr}
          feature="academic"
          subFeature={"class_by_branch_status"}
          remarksText="Enter remarks to Export Class By Branch Status ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StrengthTables;

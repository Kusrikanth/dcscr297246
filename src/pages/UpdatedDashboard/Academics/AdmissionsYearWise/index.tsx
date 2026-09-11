import { useEffect, useMemo, useRef, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import AdmissionsYearWiseTable from "./AdmissionsYearWiseTable";
import AdmissionsYearWiseBar from "./AdmissionsYearWiseBar";
import { Button, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { exportAdmissionsYearWiseAct, getAdmissionsYearWiseAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const curriculumTypes = [
  {
    id: "CAMBRIDGE INTERNATIONAL",
    name: "CAMBRIDGE INTERNATIONAL"
  },
  {
    id: "CBSE",
    name: "CBSE"
  }
]

const inititalValues = {
  academicYearId: "",
  curriculumName: "",
  startDate: "",
  endDate: "",
}

const AdmissionsYearWise = () => {
  const [activeId, setActiveId] = useState<any>(
    "admissions-year-wise-bar-view"
  );

  const [filterState, setFilterState] = useState(inititalValues);
  const dispatch = useAppDispatch();
  const { showClearFilterState, advanceFilterChange } = useFilterState();
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const {
    currentInstIdResp: instituteId, currentBranchIdResp, academicYearListResp, brchCurriculumResp,
    branchListResp, getAdmissionsYearWiseResp, exportAdmissionsYearWiseResp } =
    useAppSelector(({ appData, branch, instAcademics, branchAcademics, reports }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getAdmissionsYearWiseResp: reports.getAdmissionsYearWiseResp,
      exportAdmissionsYearWiseResp: reports.exportAdmissionsYearWiseResp,
    }), shallowEqual)

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "admissions-year-wise-bar-view",
      labelName: "Admissions Year wise Bar",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "admissions-year-wise-table-view",
      labelName: "Admissions Year wise Table",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  const admissionTargetRef = useRef({
    prevExportAdmissionsYearWiseResp: exportAdmissionsYearWiseResp,
  });

  useEffect(() => {
    const { prevExportAdmissionsYearWiseResp } =
      admissionTargetRef.current;
    if (exportAdmissionsYearWiseResp && exportAdmissionsYearWiseResp !== prevExportAdmissionsYearWiseResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportAdmissionsYearWiseResp, "Admissions_year_wise");
    }
    admissionTargetRef.current.prevExportAdmissionsYearWiseResp = exportAdmissionsYearWiseResp;

  }, [exportAdmissionsYearWiseResp]);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "admissions-year-wise-bar-view":
        return AdmissionsYearWiseBar;
      case "admissions-year-wise-table-view":
        return AdmissionsYearWiseTable;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent></TabComponent>;
  }, [activeId]);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilterState((prevState) => ({ ...prevState, [name]: value }));
    admissionsYearWise({ [name]: value })
    advanceFilterChange({ keys: { ...filterState, [name]: value }, ignoredKeys: [] })
  }

  const admissionsYearWise = (otherProps: any) => {
    const payload = {
      ...filterState, instituteId, type: "ADMISSIONS", ...otherProps,
    };
    dispatch(getAdmissionsYearWiseAct(generateActionPayload("get_admissions_year_wise", undefined, payload)));
  };

  useEffect(() => {
    const years = academicYearListResp?.data || [];
    const selectedYear =
      years.find((y: any) => y.yearStatus?.toLowerCase() === "upcoming") ||
      years.find((y: any) => y.yearStatus?.toLowerCase() === "current") ||
      years[0];
    const academicYearId = selectedYear?.academicYearId || "";
    if (!academicYearId) return;
    setFilterState((prev: any) => ({ ...prev, academicYearId }));
    admissionsYearWise({ academicYearId });
  }, [academicYearListResp]);

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setFilterState((prev: any) => ({ ...prev, startDate, endDate }));
      admissionsYearWise({ startDate, endDate })
      advanceFilterChange({ keys: { ...filterState, startDate, endDate }, ignoredKeys: [] })
    }
  }

  const clearFilterHndlr = () => {
    const currentYear = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "upcoming");
    const academicYearId = currentYear?.academicYearId || "";
    setFilterState({ ...inititalValues, academicYearId });
    admissionsYearWise({ ...inititalValues, academicYearId })
    advanceFilterChange({ keys: { ...inititalValues }, ignoredKeys: [] })
  }

  const exportSubmitHndlr = () => {
    const payload = { ...filterState, instituteId, type: "ADMISSIONS", }
    dispatch(exportAdmissionsYearWiseAct(generateActionPayload("export_admissions_year_wise", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="admissions-year-wise-container">
        <div className="card tw-pb-0 tw-shadow-none tw-border-0">
          <div className="card-header tw-py-2 tw-border-b tw-border-dashed tw-border-gray-200">
            <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-3">
              <div className="tw-col-span-12 lg:tw-col-span-2">
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
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-2">
                <SelectInput
                  name="curriculumName"
                  value={filterState.curriculumName}
                  onChange={onChangeFilterHndlr}
                  menuItems={curriculumTypes || []}
                  valueKey="id"
                  textKey="name"
                  formgroupClassName="tw-mb-0"
                  labelText="Curriculum"
                  floatingLabel
                />
              </div>

              <div className="tw-col-span-12 lg:tw-col-span-2">
                <CustomDatePicker
                  name="dateRange"
                  startDate={filterState.startDate}
                  endDate={filterState.endDate}
                  onChange={handleDateChange}
                  placeholder="Select a Date Range"
                  monthsShown={2}
                  formgroupClassName="tw-mb-0"
                  labelText="Date Range"
                  floatingLabel
                ></CustomDatePicker>
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-6 tw-flex tw-items-center tw-justify-end tw-gap-3">
                {showClearFilterState && (
                  <Button
                    variant="wrong"
                    type="button"
                    onClick={clearFilterHndlr}
                  >
                    Clear filter
                  </Button>
                )}
                <div className="tw-flex tw-items-center">
                  <Button
                    id="export-btn"
                    variant="exportBtn"
                    onClick={openExportModal}
                  >
                    <img src={ExportIcon} className="tw-w-5 tw-h-5" />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </Button>
                </div>
             
              <div className="tw-w-fit">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="tw-overflow-auto tw-whitespace-nowrap tw-justify-end horizontal-menu-updated-style"
                ></UpdatedHorizontalTab>
              </div>
              </div>
            </div>
          </div>

          <div className="tw-card-body tw-p-0">
            <div>{activeComponent}</div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-branch-wise-net-paid-by-date-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Admissions Year Wise Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={""}
          submitHndlr={exportSubmitHndlr}
          feature="admission"
          subFeature={"year_wise_analysis"}
          remarksText="Enter remarks to export Admissions Year Wise Data ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default AdmissionsYearWise;

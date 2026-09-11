import { HugeiconsIcon } from "@hugeicons/react";
import {
  Button,
  MultiSelect,
  MultiSelectCheckbox,
  OffCanvasContainer,
  SelectInput,
} from "../../../Components/Common";
import ComplaintsDetailsTable from "./ComplaintsDetailsTable";
import MonthWiseTickets from "./MonthWiseTickets";
import RequestType from "./RequestType";
import HelpdeskStatistics from "./Statistics";
import { FilterIcon } from "@hugeicons-pro/core-stroke-standard";
import { useFilterState } from "../../../hooks/filterhook";
import React, { useEffect, useMemo, useState } from "react";
import AdavanceFilterModal from "./AdavanceFilterModal";
import TicketsSummary from "./TicketsSummary";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { categoryList, complaintUserTypeList, dateType, ignoredKeys } from "./helper";
import { getDepartmentAnalysisAct, getDepartmentListAct, getFetchRequestTypeAct, getHelpDeskStatsAct, getTopTenDepartmentsAct } from "../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import { generateActionPayload } from "../../../utility/reduxutility";
import TopTenDepartments from "./TopTenDepartments";
import DepartmentAnalysis from "./DepartmentAnalysis";
import { downloadExcelFile } from "../../../utility/commonutility";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/modalhook";

const initialValues = {
  branchId: "",
  academicYearId: "",
  complaintCategory: "",
  departmentNames: "",
  complaintUserType: "",
  dateType: "",
  startDate: "",
  endDate: "",
}

const SuperAdminHelpdesk = () => {
  const [openAdvFilers, setOpenAdvFilters] = useState<boolean>(false);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const dispatch = useAppDispatch();
  const { closeModal: closeExportSectionModalHnldr, openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();

  const toggleAdvanceFilter = () => {
    setOpenAdvFilters((prev) => !prev);
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    academicYearListResp,
    getAssignListCurriculumResp,
    branchListResp,
    getHelpDeskStatsResp,
    getFetchRequestTypeResp,
    getDepartmentListResp,
    getTopTenDepartmentsResp,
    getDepartmentAnalysisResp,
    concernsFeedbackErrResp,
    exportOpenTicketsResp,
  } =
    useAppSelector(({ appData, branch, instAcademics, concernsFeedback, assignLanguages }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getHelpDeskStatsResp: concernsFeedback.getHelpDeskStatsResp,
      getFetchRequestTypeResp: concernsFeedback.getFetchRequestTypeResp,
      getDepartmentListResp: concernsFeedback.getDepartmentListResp,
      getTopTenDepartmentsResp: concernsFeedback.getTopTenDepartmentsResp,
      getDepartmentAnalysisResp: concernsFeedback.getDepartmentAnalysisResp,
      concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
      exportOpenTicketsResp: concernsFeedback.exportOpenTicketsResp,

    }), shallowEqual)


    const branchDashboardRef = React.useRef({
            prevExportOpenTicketsResp: exportOpenTicketsResp,
            prevConcernsFeedbackErrResp: concernsFeedbackErrResp
        });
    
        useEffect(() => {
            const { prevExportOpenTicketsResp } = branchDashboardRef.current;
    
            if (exportOpenTicketsResp && prevExportOpenTicketsResp !== exportOpenTicketsResp) {
                toast.success("Exported Atendance Tracker Report Successfully");
                closeExportSectionModalHnldr();
                downloadExcelFile(exportOpenTicketsResp, "Open_Tickets");
            }
    
            branchDashboardRef.current.prevExportOpenTicketsResp = exportOpenTicketsResp;
        }, [exportOpenTicketsResp])
  const examinationForm = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: (values) => { },
  });

  const getHelpdeskDashboardStats = (otherProps?: any) => {
    let payload = {
      instituteId,
      ...examinationForm.values,
      ...otherProps,
    };
    if (Array.isArray(payload.departmentNames)) {
      payload.departmentNames = payload.departmentNames.map((item: any) => item.name).join(",");
    }
    dispatch(getHelpDeskStatsAct(generateActionPayload("get_helpdesk_dashboard_stats", undefined, payload)));
  };
  const getDepartmentListApiCall = ({ branchId, complaintCategory }: { branchId?: string, complaintCategory?: string } = {}) => {
    let payload = {
      branchId,
      complaintCategory
    };
      dispatch(getDepartmentListAct(generateActionPayload("get_department", undefined, payload)));
  };
  const getFetchRequestType = (otherProps?: any) => {
    let payload = {
      instituteId,
      ...examinationForm.values,
      ...otherProps,
    };
    if (Array.isArray(payload.departmentNames)) {
      payload.departmentNames = payload.departmentNames.map((item: any) => item.name).join(",");
    }
    dispatch(getFetchRequestTypeAct(generateActionPayload("get_request_type", undefined, payload)));
  };
  const getDepartmentAnalysis = (otherProps?: any) => {
    let payload = {
      instituteId,
      ...examinationForm.values,
      ...otherProps,
    };
    if (Array.isArray(payload.departmentNames)) {
      payload.departmentNames = payload.departmentNames.map((item: any) => item.name).join(",");
    }
    dispatch(getDepartmentAnalysisAct(generateActionPayload("get_department_analysis", undefined, payload)));
  };

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    examinationForm.setFieldValue("academicYearId", yearId);
    getHelpdeskDashboardStats({ academicYearId: yearId });
    getFetchRequestType({ academicYearId: yearId });
    getDepartmentAnalysis({ academicYearId: yearId });
  }, [academicYearListResp, instituteId]);
  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "branchId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
      getDepartmentListApiCall({ branchId: value });
    }
    // else if (name === "academicYearId") {
    //   examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
    //   getHelpdeskDashboardStats({ academicYearId: value });
    // } 
    // else if (name === "complaintCategory") {
    //   examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
    //   getDepartmentListApiCall({ complaintCategory: value });
    // } 
    // else if (name === "dateType") {
    //   examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, complaintUserType: "" }));
    //  getHelpdeskDashboardStats({ dateType: value });
    // }
    // else if (name === "complaintUserType") {
    //   examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
    //   getHelpdeskDashboardStats({ complaintUserType: value });
    // }
    // else {
    examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
    getHelpdeskDashboardStats({ [name]: value });
    getFetchRequestType({ [name]: value });
    getDepartmentAnalysis({ [name]: value });
    // }
    advanceFilterChange({ keys: { ...examinationForm.values, [name]: value }, ignoredKeys })
  }

  useEffect(() => {
    getDepartmentListApiCall();
  }, [instituteId]);

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      examinationForm.setValues({ ...initialValues, academicYearId: academicYearId || "" })
      getHelpdeskDashboardStats({ ...initialValues, academicYearId })
      getFetchRequestType({ ...initialValues, academicYearId })
      getDepartmentAnalysis({ ...initialValues, academicYearId })
      getDepartmentListApiCall({});
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
    }
  };
  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    advanceFilterChange({ keys: { ...examinationForm.values, ...appliedFilters }, ignoredKeys })
    examinationForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getHelpdeskDashboardStats(appliedFilters);
    getFetchRequestType(appliedFilters);
    getDepartmentAnalysis(appliedFilters);
  }

  const departments = useMemo(() => getDepartmentListResp?.map(dept => ({ name: dept })) || [], [getDepartmentListResp]);


  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="super-admin-helpdesk-container">
        <div className="tw-grid tw-grid-cols-12 tw-gap-1">
          <div className="tw-col-span-12">
            <div className="card !tw-rounded-2xl !tw-shadow-sm">
              <div className="card-header !tw-rounded-t-2xl">
                <h4 className="card-title !tw-mb-0">
                  Helpdesk Summary
                </h4>
              </div>

              <div className="card-body">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-py-1 !tw-items-end">
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="branchId"
                      valueKey="branchId"
                      textKey="branchName"
                      value={examinationForm.values.branchId}
                      menuItems={branchListResp?.data}
                      onChange={onChangeFilterHndlr}
                      labelText="Branch Name"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={examinationForm.values.academicYearId}
                      onChange={onChangeFilterHndlr}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      // inputClassName="border-0"
                      formgroupClassName="tw-mb-0"
                      labelText="Academic Year"
                      floatingLabel
                      labelClass="required"
                    />
                  </div>
                  {/* <div className="tw-col-span-12 lg:tw-col-span-2">
                    <MultiSelectCheckbox
                      name="departmentNames"
                      idKey="name"
                      labelText='Department'
                      value={examinationForm.values.departmentNames}
                      renderValue={renderValueStatus}
                      renderOptions={renderOptionsStatus}
                      onChange={onSelectOptionHandler}
                      searchKey="name"
                      options={departments || []}
                    />
                  </div> */}
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="dateType"
                      value={examinationForm.values.dateType}
                      onChange={onChangeFilterHndlr}
                      menuItems={dateType || []}
                      valueKey="id"
                      textKey="name"
                      formgroupClassName="tw-mb-0"
                      labelText="Date Type"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="complaintUserType"
                      value={examinationForm.values.complaintUserType}
                      onChange={onChangeFilterHndlr}
                      menuItems={complaintUserTypeList || []}
                      valueKey="id"
                      textKey="name"
                      formgroupClassName="tw-mb-0"
                      labelText="Raised By"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-2 lg:tw-col-span-1 tw-relative">
                    <button
                      style={{
                        backgroundColor: "#F4F7FA",
                      }}
                      className="tw-p-2 tw-btn tw-flex tw-items-center tw-mr-2 tw-rounded-md"
                      onClick={toggleAdvanceFilter}
                    >
                      <HugeiconsIcon
                        icon={FilterIcon}
                        size={18}
                        className="tw-mr-2"
                      />
                      <span className="tw-mr-2">Filters</span>
                    </button>
                    <span className="badge !tw-align-middle !tw-rounded-full" style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "70px", background: "#0ab39c" }}>
                      {count}
                    </span>
                  </div>
                  {showClearFilterState && (
                    <div className="tw-col-span-3 tw-flex tw-justify-end tw-items-center">
                      <Button type="button" variant="wrong"
                        onClick={clearFilterHndlr}
                      >
                        Clear Filter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="tw-col-span-12">
            <HelpdeskStatistics data={getHelpDeskStatsResp}></HelpdeskStatistics>
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-7 !tw-grid">
            <DepartmentAnalysis data={getDepartmentAnalysisResp} />
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-5 !tw-grid">
            <TicketsSummary data={getFetchRequestTypeResp} stats={getHelpDeskStatsResp}></TicketsSummary>
          </div>
          <div className="tw-col-span-12">
            <MonthWiseTickets filters={examinationForm.values} instituteId={instituteId}></MonthWiseTickets>
          </div>
          <div className="tw-col-span-12">
            <ComplaintsDetailsTable data={getFetchRequestTypeResp} instituteId={instituteId} filters={examinationForm.values} modalState={exportSectionModalState} openModal={openExportSectionModalHnldr} closeModal={closeExportSectionModalHnldr}></ComplaintsDetailsTable>
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-6 !tw-grid">
            <RequestType data={getFetchRequestTypeResp}></RequestType>
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-6 !tw-grid">
            <TopTenDepartments data={getTopTenDepartmentsResp} />
          </div>
        </div>
      </div>

      <OffCanvasContainer
        isOpen={openAdvFilers}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filters-super-admin-helpdesk"
      >
        <AdavanceFilterModal
          appliedFilter={examinationForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          departments={departments}
          getDepartmentListApiCall={getDepartmentListApiCall}
        ></AdavanceFilterModal>
      </OffCanvasContainer>
    </>
  );
};

export default SuperAdminHelpdesk;

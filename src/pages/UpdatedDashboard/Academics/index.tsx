import React, { useEffect, useRef, useState } from "react";
import ClassWiseHighMarks from "./ClassWiseHighMarks";
import ClassWiseMarks from "./ClassWiseMarks";
import ClassWiseTopPerformers from "./ClassWiseTopPerformers";
import FailuresAnalysis from "./FailuresAnalysis";
import ApplicationToAdmission from "./ApplicationToAdmission";
import AdmissionsYearWise from "./AdmissionsYearWise";
import ApplicationToAdmissionSummary from "./ApplicationToAdmissionSummary";
import ApplicationsYearWise from "./ApplicationsYearWise";
import AdmissionSummaryGraph from "./AdmissionSummary";
import LeadCaptureSource from "./LeadCaptureSource";
import AdmissionStats from "./AdmissionStats";
import { SelectInput } from "../../../Components/Common";
import BranchDrillDownTable from "./BranchDrilDownTable";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import ApplicationsAdmissionsyearWise from "./ApplicationsAdmissionsyearWise";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchCurriculumAct, setBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import ClassWiseAdmissionsAnalysisBar from "./ClassWiseAdmissionsAnalysis";
import GenderWiseComparision from "./GenderWiseComparision";
import { toast } from "react-toastify";

const inititalValues = {
  branchId: "",
  academicYearId: "",
  curriculumId: "",
  startDate: "",
  endDate: "",
}
const Academics = () => {
  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(inititalValues);

  const {
    currentInstIdResp: instituteId, currentBranchIdResp, academicYearListResp, brchCurriculumResp,
    branchListResp, reportsErrResp } =
    useAppSelector(({ appData, branch, instAcademics, branchAcademics, reports }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      reportsErrResp: reports.reportsErrResp,
    }), shallowEqual)

  const admissionTargetRef = useRef({
    prevReportsErrResp: reportsErrResp,
  });

  useEffect(() => {
    const { prevReportsErrResp } = admissionTargetRef.current;
    if (reportsErrResp && reportsErrResp !== prevReportsErrResp) {
      const { details } = reportsErrResp || {}
      toast.error(details || "Something went wrong");
    }
    admissionTargetRef.current.prevReportsErrResp = reportsErrResp;
  }, [reportsErrResp]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload = { academicYearId: filterState.academicYearId, branchId: filterState.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (payload.branchId) {
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }
  }

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ [name]: value, curriculumId: "" });
      setFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "" }));
    } else if (name === "curriculumId") {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
    } else if (name === "branchId") {
      setFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "" }));
      if (!value) {
        dispatch(setBrchCurriculumAct(undefined))
      } else {
        getCurriculumApiCall({ [name]: value, curriculumId: "" });
      }
    }
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}

  return (
    <div className="admissions-container">
      <div className="tw-grid tw-grid-cols-12 !tw-gap-1">
        <div className="tw-col-span-12">
          <div className="card !tw-bg-transparent !tw-shadow-none">
            <div className="card-header !tw-rounded-2xl !tw-shadow-sm">
              <div className="tw-grid tw-grid-cols-12 tw-gap-y-3 tw-items-center">
                <div className="tw-col-span-12 lg:tw-col-span-4">
                  <h4 className="tw-text-lg tw-mb-0 tw-flex-grow">
                    Admission Summary
                  </h4>
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-8">
                  <div className="tw-flex tw-flex-wrap tw-gap-3 lg:tw-justify-end">
                    <div className="tw-w-full lg:tw-w-1/4">
                      <SelectInput
                        name="branchId"
                        valueKey="branchId"
                        textKey="branchName"
                        value={filterState.branchId}
                        menuItems={branchListResp?.data}
                        onChange={onChangeFilterHndlr}
                        labelText="Branch Name"
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                      />
                    </div>
                    <div className="tw-w-full lg:tw-w-1/4">
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
                    <div className="tw-w-full lg:tw-w-1/4">
                      <SelectInput
                        name="curriculumId"
                        value={filterState.curriculumId}
                        onChange={onChangeFilterHndlr}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        labelText="Curriculum"
                        floatingLabel
                      />
                    </div>
                    {/* <div className="tw-w-1/2 lg:tw-w-1/4">
                      <CustomDatePicker
                        name="dateRange"
                        startDate={""}
                        endDate={""}
                        onChange={() => { }}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId={""}
                        floatingLabel
                      ></CustomDatePicker>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-col-span-12">
          <AdmissionStats branchId={filterState.branchId} academicYearId={filterState.academicYearId} curriculumId={filterState.curriculumId} ></AdmissionStats>
        </div> 
        <div className="tw-col-span-12">
          <BranchDrillDownTable {...{ ...filterState, isAdmissionTarget: true }} />
        </div>
        <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
          <AdmissionSummaryGraph branchId={filterState.branchId} academicYearId={filterState.academicYearId} curriculumId={filterState.curriculumId}></AdmissionSummaryGraph>
        </div>
        <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
          <LeadCaptureSource branchId={filterState.branchId} academicYearId={filterState.academicYearId} curriculumId={filterState.curriculumId} ></LeadCaptureSource>
        </div>
        <div className="tw-col-span-12">
          <ClassWiseAdmissionsAnalysisBar {...filterState}></ClassWiseAdmissionsAnalysisBar>
        </div>
        <div className="tw-col-span-12">
          <BranchDrillDownTable {...{ ...filterState, isAdmissionTarget: false }} />
        </div>
        <div className="tw-col-span-12">
          <GenderWiseComparision {...filterState} />
        </div>
        <div className="tw-col-span-12">
          <ApplicationsAdmissionsyearWise></ApplicationsAdmissionsyearWise>
        </div>
        <div className="tw-col-span-12">
          <ApplicationToAdmission {...filterState}></ApplicationToAdmission>
        </div>
        <div className="tw-col-span-12">
          <ApplicationToAdmissionSummary></ApplicationToAdmissionSummary>
        </div>
      </div>
    </div>
  );
};

export default Academics;

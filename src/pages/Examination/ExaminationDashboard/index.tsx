import React, { useEffect, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import StatsCardTypes from "./StatsCardTypes";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { ConfirmationModal, OffCanvasContainer, SelectInput } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import ExaminationSummary from "./ExaminationSummary";
import GradeWiseStudents from "./GradeWiseStudents";
// import SchoolResults from "./SchoolResults";
import StudentGradeBook from "./StudentGradeBook";
import RankSwiper from "./RankSwiper";
import { useFormik } from "formik";
import { getClassAnalysisReportAct, getClassGradeWiseAnalysisAct, getExaminationDashboardDataAct, getMarksRangeListAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { setBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { resetSectionListAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { getExaminationListAct } from "../../../store/examination/examinationsettings/examinationsettingsaction";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvanceFilter";
import { ignoredKeys } from "./helper";
import { useFilterState } from "../../../hooks/filterhook";
import { getAssignCurriculumListAct, getAssignLanClassListAct, getAssignLanSectionListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import GradewisePerformanceChart from "../../UpdatedDashboard/Examination/GradewisePerformanceChart";
import SchoolResults from "../../UpdatedDashboard/Examination/SchoolResults";
import SectionWiseAnalysis from "../../UpdatedDashboard/Examination/GradewisePerformanceChart/SectionWiseAnalysis";
import { getMasterSectionAct } from "../../../store/academic/academicRequest/academicrequestactions";
import ClassWiseAnalysis from "../../UpdatedDashboard/Examination/GradewisePerformanceChart/ClassWiseAnalysis";
import { useModal } from "../../../hooks/modalhook";
import { toast } from "react-toastify";


const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  examinationId: "",
  admissionType: "",
};

const ExaminationDashboard = () => {

  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState<boolean>(false);
  const {
    openModal: getClassAnalysisReportModalOpen,
    closeModal: getClassAnalysisReportModalClose,
    modalState: getClassAnalysisReportShowModal,
  } = useModal()


  const {
    academicYearListResp,
    getAssignListCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getAssignLanClassListResp,
    getAssignLanSectionListResp,
    getExaminationDashboardDataResp,
    getMarksRangeListResp,
    getMasterSectionResp,
    getExaminationListResp,
    getClassGradeWiseAnalysisResp,
    getClassAnalysisReportResp,
    examinationManagementErrorResp
  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, examinationSettings, assignLanguages, examinationManagement, academicRequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
      getExaminationDashboardDataResp: examinationManagement.getExaminationDashboardDataResp,
      getMarksRangeListResp: examinationManagement.getMarksRangeListResp,
      getMasterSectionResp: academicRequest.getMasterSectionResp,
      getExaminationListResp: examinationSettings.getExaminationListResp,
      getClassGradeWiseAnalysisResp: examinationManagement.getClassGradeWiseAnalysisResp,
      getClassAnalysisReportResp: examinationManagement.getClassAnalysisReportResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,


    }),
    shallowEqual
  );

  const examinationForm = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: (values) => {
      examinationDashboardApiCall(values);
      marksRangeApiCall(values);
      getMasterSectionApiCall(values);
      getClassGradeWiseApiCall(values);
     },
  });

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters }, ignoredKeys })
    examinationForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    // examinationDashboardApiCall(appliedFilters);
  }

  const getSectionListResp = (otherProps?: any) => {
          let payload = { branchClassId: examinationForm.values.classId || null, masterAcademicYearId: examinationForm.values.academicYearId, curriculumId: examinationForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
          if (payload.branchClassId && payload.masterAcademicYearId) {
              dispatch(
                  getAssignLanSectionListAct(
                      generateActionPayload("get_section_list", undefined, payload)
                  )
              );
          }
      }
  const marksRangeApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, sectionId } = examinationForm.values;
    let payload = {
      instituteId,
      academicYearId,
      branchId,
      displayType: "MARKS_RANGE",
      curriculumId,
      classId,
      ...otherProps,
    };
    if (payload.academicYearId && payload.branchId) {
      dispatch(getMarksRangeListAct(generateActionPayload('get_branch_wise_marks_range', undefined, payload)))
    }
  }

  const getMasterSectionApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId } = examinationForm.values;
    let payload = {
      academicYearId,
      branchId,
      curriculumId,
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId) {
      dispatch(getMasterSectionAct(generateActionPayload('get_master_section', undefined, payload)))
    }
  }
  const getClassGradeWiseApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId } = examinationForm.values;
    let payload = {
      academicYearId,
      branchId,
      instituteId,
      curriculumId,
      ...otherProps,
    };
    delete payload.examinationId
    delete payload.classId
    delete payload.sectionId
    delete payload.admissionType
    if (payload.academicYearId && payload.curriculumId) {
      dispatch(getClassGradeWiseAnalysisAct(generateActionPayload('get_class_grade_wise_analysis', undefined, payload)))
    }
  }

  const examinationDashboardApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, sectionId, } = examinationForm.values;
    let payload = {
      instituteId,
      academicYearId,
      curriculumId,
      branchId,
      classId,
      sectionId,
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId && payload.branchId) {
      dispatch(getExaminationDashboardDataAct(generateActionPayload('get_examination_dashboard_data', undefined, payload)))
    }
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload = { academicYearId: examinationForm.values.academicYearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (payload.branchId) {
      dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId, academicYearId: examinationForm.values?.academicYearId, curriculumId: examinationForm.values?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const examinationList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...examinationForm.values,
      ...otherProps,
      pageNo: 0,
      pageSize: 100,
    };
    delete payload.examinationId
    dispatch(getExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
  };


  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
      const curriculumId = examinationForm.values.curriculumId;
      const classId = examinationForm.values.classId;
      examinationForm.setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId, classId })
      getCurriculumApiCall({ academicYearId })
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    }
  };

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    examinationForm.setFieldValue("academicYearId", yearId);
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = getAssignListCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0) {
      const cbseCurriculum = data.find(curriculum => curriculum.curriculumName.toUpperCase() === "CBSE");
      const payload = { branchId, curriculumId: cbseCurriculum?.branchCurriculumId, academicYearId: examinationForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      examinationForm.setFieldValue("curriculumId", cbseCurriculum?.branchCurriculumId)
      getMasterSectionApiCall({ curriculumId: cbseCurriculum?.branchCurriculumId });
      getClassGradeWiseApiCall({ academicYearId: examinationForm.values.academicYearId, curriculumId: cbseCurriculum?.branchCurriculumId });
    }
  }, [getAssignListCurriculumResp])

  useEffect(() => {
    const { content } = getAssignLanClassListResp || {};

    if (Array.isArray(content) && content.length > 0) {
      examinationForm.setFieldValue("classId", content[0].id)
      // examinationDashboardApiCall({ classId: content[0]?.id });
      examinationList({ classId: content[0]?.id });
      getSectionListResp({ branchClassId: content[0]?.id });

      if (!isInitialDataLoaded && examinationForm.values.academicYearId && examinationForm.values.curriculumId) {
        setIsInitialDataLoaded(true);
      }
    }
  }, [getAssignLanClassListResp])

  useEffect(() => {
    if (isInitialDataLoaded) {
      examinationDashboardApiCall();
      marksRangeApiCall();
    }
  }, [isInitialDataLoaded]);

  function convertBase64ToReceipt(base64: any, fileName: any) {
    const link = document.createElement("a");
    link.href = `data:${"application/pdf"};base64,${base64}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function fetchClassAnalysisReport() {
    const {
      academicYearId, curriculumId, classId, sectionId, examinationId
    } = examinationForm.values;
    const payload = {
      instituteId,
      branchId,
      academicYearId,
      curriculumId,
      classId,
      sectionId,
      examinationId,
    }
    dispatch(getClassAnalysisReportAct(generateActionPayload('get_class_analysis_report', undefined, payload)))
  }

  const downloadClassAnalysisReportRef = useRef({
    prevGetClassAnalysisReportResp:getClassAnalysisReportResp,
    prevExaminationManagementErrorResp:examinationManagementErrorResp
  })

  useEffect(() => {
    const { prevGetClassAnalysisReportResp,prevExaminationManagementErrorResp } = downloadClassAnalysisReportRef.current;
    if(getClassAnalysisReportResp && getClassAnalysisReportResp !== prevGetClassAnalysisReportResp){
      convertBase64ToReceipt(getClassAnalysisReportResp?.pdfBase64,"Class_Analysis_Report.pdf");
      toast.success("Class Analysis Report downloaded successfully");
      getClassAnalysisReportModalClose();
    }
    else if(examinationManagementErrorResp && examinationManagementErrorResp !== prevExaminationManagementErrorResp){
      const { details, error } = examinationManagementErrorResp || {};
      getClassAnalysisReportModalClose();
      toast.error(details || error || "Something went wrong.");
    }

    downloadClassAnalysisReportRef.current.prevGetClassAnalysisReportResp = getClassAnalysisReportResp;
    downloadClassAnalysisReportRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
  },[getClassAnalysisReportResp, examinationManagementErrorResp])

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ [name]: value, curriculumId: "" });
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, curriculumId: "", classId: "", sectionId: "" }));
    } else if (name === "curriculumId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, classId: "", sectionId: "" }));
      if (value) {
        getClassApiCall({ curriculumId: value });
      }
      else {
        dispatch(setBrchClassAct(undefined));
      }
    }
    else if (name === "classId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, sectionId: "", examinationId: "" }));
      if (value) {
        // examinationDashboardApiCall({ classId: value });
        examinationList({ classId: value });
        getSectionListResp({ branchClassId: value });
      }
      else {
        dispatch(resetSectionListAct(undefined));
      }
    }
    else if (name === "sectionId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
      // examinationDashboardApiCall({ sectionId: value });
    }
    else if (name === "examinationId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
      // examinationDashboardApiCall({ examinationId: value });
    }
    else {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
    }
    advanceFilterChange({
          keys: { ...examinationForm.values, [name]: value },
          ignoredKeys: ["academicYearId", "curriculumId", "classId"],
        });
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const { content: classList } = getAssignLanClassListResp || {}
  const { data: sectionTypes } = getAssignLanSectionListResp || [];
  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <form onSubmit={examinationForm.handleSubmit}>
          <div className="container-fluid">
            <BreadCrumb title="Dashboard" pageTitle="Examination" />

            <div className="d-inline-block w-100 ">
              <div className="row">
                <div className="col-12">
                  <div className="card mb-3">
                    <div className="card-header">
                      <h4 className="card-title mb-0">
                        Examination Dashboard
                      </h4>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                          <SelectInput
                            name="academicYearId"
                            value={examinationForm.values.academicYearId}
                            onChange={onChangeFilterHndlr}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="mb-0"
                            labelText="Academic Year"
                            floatingLabel
                          />
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                          <SelectInput
                            name="curriculumId"
                            value={examinationForm.values.curriculumId}
                            onChange={onChangeFilterHndlr}
                            menuItems={curriculumTypes || []}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="mb-0"
                            labelText="Curriculum"
                            isDisabled
                            isReadOnly
                            floatingLabel
                          />
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                          <SelectInput
                            name="classId"
                            value={examinationForm.values.classId}
                            onChange={onChangeFilterHndlr}
                            menuItems={classList || []}
                            valueKey="id"
                            textKey="shortName"
                            labelText="Class"
                            floatingLabel
                            formgroupClassName="mb-0"
                          />
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                          <SelectInput
                              name="sectionId"
                              value={examinationForm.values.sectionId}
                              onChange={onChangeFilterHndlr}
                              menuItems={sectionTypes}
                              valueKey="sectionId"
                              textKey="sectionName"
                              formgroupClassName="mb-0"
                              defaultSelect="Section"
                              labelText='Section'
                              floatingLabel
                          />
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                          <SelectInput
                              name="examinationId"
                              value={examinationForm.values.examinationId}
                              onChange={onChangeFilterHndlr}
                              menuItems={getExaminationListResp?.data}
                              valueKey="id"
                              textKey="examinationName"
                              formgroupClassName="mb-0"
                              labelText="Examination"
                              floatingLabel
                          />
                        </div>

                        <div className="col-1 py-2 mt-1">
                          <button
                            type="button"
                            style={{
                              backgroundColor: "#F4F7FA",
                              border: "1px solid #ced4da",
                            }}
                            onClick={toggleAdvanceFilter}
                            className="p-2 btn d-flex"
                          >
                            <FilterSvg height={"18px"} width={"18px"} />
                            <span className='ms-2'>Filters</span>
                          </button>
                          <span className="badge align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                            {count}
                          </span>
                        </div>
                        {showClearFilterState && (
                          <div className="col-auto d-flex align-items-center py-2 mt-2">
                            <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">
                              Clear filter</button>
                          </div>
                        )}
                        <div className="col-auto ms-auto d-flex">
                          <button
                            type="submit" className="btn btn-3 text-white btn-success me-2"
                          >
                            Get Report
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => getClassAnalysisReportModalOpen()}
                          type="button"  
                          >
                            Class Anslysis Report
                          </button>
                          {/* <div className="d-flex align-items-center">
                            <button
                              id="export-btn"
                              type="button"
                              className="btn btn-icon btn-rounded btn-soft-info p-2"
                            >
                              <img src={ExportIcon} className="img-fluid h-100" alt="Export" />
                              <UncontrolledTooltip placement="bottom" target="export-btn">
                                Export
                              </UncontrolledTooltip>
                            </button>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <StatsCardTypes data={getExaminationDashboardDataResp?.examinationStats} />
                </div>
                <div className="col-12 d-grid">
                  <GradeWiseStudents data={getExaminationDashboardDataResp?.studentsGradeAndMarksDistribution}/>
                </div>
                {/* <div className="col-12 col-xl-4 d-grid">
                  <SchoolResults data={getExaminationDashboardDataResp?.schoolAverageAggregatePercentage}/>
                </div> */}
                <div className="col-12">
                  <ClassWiseAnalysis data={getClassGradeWiseAnalysisResp} sectionList={getAssignLanClassListResp?.content} formValues={examinationForm.values} />
                </div>
                <div className="col-12">
                  <SectionWiseAnalysis data={getExaminationDashboardDataResp?.sectionAnalysis} sectionList={getMasterSectionResp} formValues={examinationForm.values} />
                </div>
                <div className="col-12 col-xl-6 d-grid">
                  <ExaminationSummary data={getExaminationDashboardDataResp?.summarySection} subjectList={getExaminationDashboardDataResp?.subjectAnalysis?.subjects}/>
                </div>
                <div className="col-12 col-xl-6 d-grid">
                  <GradewisePerformanceChart data={getExaminationDashboardDataResp?.subjectAnalysis}/>
                </div>
                <div className="col-12">
                  <RankSwiper data={getExaminationDashboardDataResp?.summarySection?.top10StudentsData}/>
                </div>
                <div className="col-12">
                  <StudentGradeBook></StudentGradeBook>
                </div>
              </div>
            </div>
          </div>
        </form>
        <OffCanvasContainer
          isOpen={open}
          headerTitle="Advance Filters"
          closeHndlr={toggleAdvanceFilter}
          id="advance-filter-book-issuance"
        >
          <AdvanceFilterModal
            appliedFilter={examinationForm.values}
            applyFilterCallback={advanceFilterCallbckHndlr}
            toggleAdvanceFilter={toggleAdvanceFilter}
            isOpen={open}
          />
        </OffCanvasContainer>
        <ConfirmationModal
          id = "get-class-analysis-report-modal"
          isOpen={getClassAnalysisReportShowModal.showModal}
          confirmMessage="Are you sure you want to generate Report?"
          cancelHndlr={getClassAnalysisReportModalClose}
          confirmHndlr={fetchClassAnalysisReport}
          showImgIcon={true}
          iconType="approve"
          btnClassName='btn w-sm btn-success'
        ></ConfirmationModal>
      </div>
  
    </>
  );
};

export default ExaminationDashboard;

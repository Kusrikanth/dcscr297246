import { UncontrolledTooltip } from "reactstrap";
import { SelectInput } from "../../../Components/Common";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import StatsCardTypes from "./StatsCardTypes";
import SchoolResults from "./SchoolResults";
import ExaminationSummary from "./ExaminationSummary";
import GradewisePerformanceChart from "./GradewisePerformanceChart";
import RankSwiper from "../../Examination/ExaminationDashboard/RankSwiper";
import StudentGradeBook from "../../Examination/ExaminationDashboard/StudentGradeBook";
import BranchWiseResultsAnlaysis from "./BranchWiseResult";
import SubjectGradeAnalysis from "./SubjectGradeAnalysis";
import GradeWisePerformance from "./GradeWiseStudents";
import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { setBrchClassAct, setBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useEffect } from "react";
import { resetSectionListAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { getBranchWiseMarksRangeAct, getExaminationDashboardDataAct, getSubjectAndGradeWiseAct, getSubjectGradeWiseAnalysisAct, getSubjectListForDashboardAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { getCbseExaminationListAct } from "../../../store/examination/examinationsettings/examinationsettingsaction";
import { getAssignCurriculumListAct, getAssignLanClassListAct, getAssignLanSectionListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { getInstClassAct, getInstSecondClassAct } from "../../../store/mastersettings/instacademics/instacademicactions";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  branchId: "",
  sectionId: "",
  examinationId: "",
  secondClassId: "",
  thirdClassId: "",
  secondExaminationId: "",
};

const SuperAdminExaminationDashboard = () => {
  const dispatch = useAppDispatch();
  
  const {
    currentInstIdResp: instituteId, currentBranchIdResp, academicYearListResp, getAssignListCurriculumResp,
    branchListResp, getAssignLanClassListResp, getAssignLanSectionListResp, getCbseExaminationRequestListResp, getExaminationDashboardDataResp, getBranchWiseMarksRangeResp, getMarksRangeListResp, instClassResp,instSecondClassResp, getSubjectAndGradeWiseResp, getSubjectListForDashboardResp, getSubjectGradeWiseAnalysisResp } =
    useAppSelector(({ appData, branch, instAcademics, branchAcademics, classroomManagmentInfo, examinationSettings,examinationManagement, assignLanguages }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
      getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
      getExaminationDashboardDataResp: examinationManagement.getExaminationDashboardDataResp,
      getBranchWiseMarksRangeResp: examinationManagement.getBranchWiseMarksRangeResp,
      getMarksRangeListResp: examinationManagement.getMarksRangeListResp,
      getSubjectAndGradeWiseResp: examinationManagement.getSubjectAndGradeWiseResp,
      instClassResp: instAcademics.instClassResp,
      instSecondClassResp: instAcademics.instSecondClassResp,
      getSubjectListForDashboardResp: examinationManagement.getSubjectListForDashboardResp,
      getSubjectGradeWiseAnalysisResp: examinationManagement.getSubjectGradeWiseAnalysisResp


    }), shallowEqual)

  const examinationForm = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: (values) => { },
  });

  const getExaminationListApiCall = (otherProps?: any) => {
    const payload = { instituteId, academicYearId: examinationForm.values.academicYearId, classSequence: examinationForm.values.secondClassId,...otherProps };    
    if (payload.academicYearId && payload.classSequence) {
      dispatch(getSubjectListForDashboardAct(generateActionPayload("get_examination_list_of_dashboard", undefined, payload)));
    }
  }
  const getSecondClassApiCall = (otherProps?: any) => {
    const payload = { instituteId, ...otherProps };
    dispatch(getInstClassAct(generateActionPayload("get_class_inst", undefined, payload)));
  }
  const getThirdClassApiCall = (otherProps?: any) => {
    const payload = { instituteId, ...otherProps };
    dispatch(getInstSecondClassAct(generateActionPayload("get_class_inst", undefined, payload)));
  }

  const examinationDashboardApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, sectionId, branchId, examinationId } = examinationForm.values;
    let payload = {
      instituteId,
      academicYearId,
      curriculumId,
      branchId,
      classId,
      sectionId,
      examinationId,
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId && payload.branchId) {
      dispatch(getExaminationDashboardDataAct(generateActionPayload('get_examination_dashboard_data', undefined, payload)))
    }
  }
  const branchWiseMarksRangeApiCall = (otherProps?: any) => {
    const { academicYearId, secondClassId } = examinationForm.values;
    let payload = {
      instituteId,
      academicYearId,
      instituteClassIds: secondClassId, 
      ...otherProps,
    };
    delete payload.branchId
    delete payload.sectionId
    delete payload.classId
    delete payload.curriculumId
    if (payload.academicYearId ) {
      dispatch(getBranchWiseMarksRangeAct(generateActionPayload('get_branch_wise_marks_range', undefined, payload)))
    }
  }
  const getSubjectAndGradeWiseApiCall = (otherProps?: any) => {
   const { academicYearId } = examinationForm.values;
    let payload = {
      instituteId,
      academicYearId,
      ...otherProps,
    };
    delete payload.branchId
    delete payload.sectionId
    delete payload.classId
    delete payload.curriculumId
    if (payload.academicYearId ) {
      dispatch(getSubjectGradeWiseAnalysisAct(generateActionPayload('get_subject_grade_wise_analysis', undefined, payload)))
    }
  }
  const SubjcetAndGradeApiCall = (otherProps?: any) => {
    const { academicYearId } = examinationForm.values;
    let payload = {
      instituteId,
      academicYearId,
      ...otherProps,
    };
    delete payload.branchId
    delete payload.sectionId
    delete payload.classId
    delete payload.curriculumId
    if (payload.academicYearId ) {
      dispatch(getSubjectAndGradeWiseAct(generateActionPayload('get_branch_wise_marks_range', undefined, payload)))
    }
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload = { academicYearId: examinationForm.values.academicYearId, branchId: examinationForm.values.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (payload.branchId) {
      dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
    }
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: examinationForm.values?.branchId, academicYearId: examinationForm.values?.academicYearId, curriculumId: examinationForm.values?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    if(payload.branchId){
      dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
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

  const examinationList = (otherProps?: any) => {
    let payload = {
      ...examinationForm.values,
      ...otherProps,
      pageNo: 0,
      pageSize: 100,
    };
    delete payload.examinationId
    delete payload.secondClassId
    delete payload.thirdClassId
    delete payload.secondExaminationId
    if (payload.branchId) {
      dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
    }
  };

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId

    const { data } = branchListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      examinationForm.setFieldValue("branchId", data[0].branchId);
      examinationForm.setFieldValue("academicYearId", yearId);
      getCurriculumApiCall({ branchId: data[0].branchId, academicYearId: yearId });
    }
  }, [academicYearListResp, branchListResp]);

  useEffect(() => {
    getSecondClassApiCall();
    getThirdClassApiCall();
  }, [])

  useEffect(() => {
    const { data } = getAssignListCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0) {
      const cbseCurriculum = data.find(curriculum => curriculum.curriculumName.toUpperCase() === "CBSE");
      const payload = { branchId: examinationForm.values.branchId, curriculumId: cbseCurriculum?.branchCurriculumId, academicYearId: examinationForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      if(payload.branchId){
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
      examinationForm.setFieldValue("curriculumId", cbseCurriculum?.branchCurriculumId)
    }
  }, [getAssignListCurriculumResp])

  useEffect(() => {
    const { content } = getAssignLanClassListResp || {};

    if (Array.isArray(content) && content.length > 0) {
      examinationForm.setFieldValue("classId", content[0].id)
      getSectionListResp({ branchClassId: content[0]?.id });
      examinationList({ classId: content[0]?.id });
    }
  }, [getAssignLanClassListResp])
  
  useEffect(() => {
    const { data } = getCbseExaminationRequestListResp || {};
    
    if (Array.isArray(data) && data.length > 0) {
      examinationForm.setFieldValue("examinationId", data[0].id)
      examinationDashboardApiCall({ examinationId: data[0]?.id });
    }
  }, [getCbseExaminationRequestListResp])

  useEffect(() => {
    if (Array.isArray(instClassResp) && instClassResp.length > 0) {
      examinationForm.setFieldValue("secondClassId", instClassResp[0].classSequence)
      getExaminationListApiCall({ classSequence: instClassResp[0]?.classSequence });
    }
  }, [instClassResp])

  useEffect(() => {
    if (Array.isArray(getSubjectListForDashboardResp) && getSubjectListForDashboardResp.length > 0) {
      examinationForm.setFieldValue("secondExaminationId", getSubjectListForDashboardResp[0].examShortName);
      branchWiseMarksRangeApiCall({ examShortName: getSubjectListForDashboardResp[0].examShortName });
    }
  }, [getSubjectListForDashboardResp])

  useEffect(() => {

    if (Array.isArray(instSecondClassResp) && instSecondClassResp.length > 0) {
      examinationForm.setFieldValue("thirdClassId", instSecondClassResp[0].classSequence)
      getSubjectAndGradeWiseApiCall({ classSequence: instSecondClassResp[0]?.classSequence });
    }
  }, [instSecondClassResp])

  useEffect(() => {
    return () => {
      dispatch(setBrchCurriculumAct(undefined));
      dispatch(setBrchClassAct(undefined));
    }
  }, []);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ [name]: value, curriculumId: "" });
      branchWiseMarksRangeApiCall({ [name]: value });
      getSubjectAndGradeWiseApiCall({ [name]: value });
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, curriculumId: "", classId: "", sectionId: "" }));
    } else if (name === "curriculumId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, classId: "", sectionId: "" }));
      if (value) {
        getClassApiCall({ curriculumId: value });
      }
      else {
        dispatch(setBrchClassAct(undefined));
      }
    } else if (name === "branchId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, curriculumId: "", classId: "", sectionId: "" }));
      if (!value) {
        dispatch(setBrchCurriculumAct(undefined))
        dispatch(setBrchClassAct(undefined));
      } else {
        getCurriculumApiCall({ [name]: value, curriculumId: "", classId: "", sectionId: "" });
        // marksRangeApiCall({ [name]: value });
      }
    }
    else if (name === "classId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, sectionId: "" }));
      if (value) {
        getSectionListResp({ branchClassId: value });
        examinationDashboardApiCall({ classId: value });
        // marksRangeApiCall({ classId: value });
        examinationList({ classId: value });
      }
      else {
        dispatch(resetSectionListAct(undefined));
      }
    }
    else if (name === "sectionId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
      examinationDashboardApiCall({ sectionId: value });
      // marksRangeApiCall({ sectionId: value });
    }
    else if (name === "examinationId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
      examinationDashboardApiCall({ examinationId: value });
      // marksRangeApiCall({ examinationId: value });
    }
    else if (name === "secondClassId") {
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value, secondExaminationId: "" }));
      // marksRangeApiCall({ secondClassId: value });
      branchWiseMarksRangeApiCall({ instituteClassIds: value, secondExaminationId: "" });
      getExaminationListApiCall({ classSequence: value });
 
    }
    else if(name === "thirdClassId"){
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
      getSubjectAndGradeWiseApiCall({ instituteClassIds: value });
    }
    else if(name === "secondExaminationId"){
      examinationForm.setValues((prevState) => ({ ...prevState, [name]: value }));
      branchWiseMarksRangeApiCall({ examShortName: value });
    }
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const { content: classList } = getAssignLanClassListResp || {}
  return (
    <>
      <div className="super-admin-examination-dashboard-container">
        <div className="tw-grid tw-grid-cols-12 tw-gap-1">
          <div className="tw-col-span-12">
            <div className="card !tw-shadow-sm !tw-rounded-2xl !tw-mb-3">
              <div className="tw-p-4 tw-border-b tw-border-gray-200">
                <h4 className="card-title !tw-mb-0">Examination Dashboard</h4>
                {/* <div className="col-6">
                    <div className="d-flex">
                      <button
                        id="export-btn"
                        className="btn btn-icon btn-rounded btn-soft-info p-2 ms-auto"
                      >
                        <img
                          src={ExportIcon}
                          className="img-fluid h-100"
                          alt="Export"
                        />
                        <UncontrolledTooltip
                          placement="bottom"
                          target="export-btn"
                        >
                          Export
                        </UncontrolledTooltip>
                      </button>
                    </div>
                  </div> */}
              </div>
              <div className="card-body">
                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-6 tw-gap-4">
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
                    labelClass="required"
                  />
                  <SelectInput
                    name="academicYearId"
                    value={examinationForm.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-0"
                    labelText="Academic Year"
                    floatingLabel
                    labelClass="required"
                  />
                  <SelectInput
                    name="curriculumId"
                    value={examinationForm.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    isDisabled
                    isReadOnly
                    floatingLabel
                    labelClass="required"
                  />
                  <SelectInput
                    name="classId"
                    value={examinationForm.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={classList || []}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                    labelClass="required"
                  />
                  <SelectInput
                    name="sectionId"
                    value={examinationForm.values.sectionId}
                    onChange={onChangeFilterHndlr}
                    menuItems={getAssignLanSectionListResp?.data || []}
                    valueKey="sectionId"
                    textKey="sectionName"
                    formgroupClassName="tw-mb-0"
                    labelText="Section"
                    floatingLabel
                  />
                  <SelectInput
                    name="examinationId"
                    value={examinationForm.values.examinationId}
                    onChange={onChangeFilterHndlr}
                    menuItems={getCbseExaminationRequestListResp?.data}
                    valueKey="id"
                    textKey="examinationName"
                    formgroupClassName="tw-mb-0"
                    labelText="Examination"
                    floatingLabel
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tw-col-span-12">
            <StatsCardTypes data={getExaminationDashboardDataResp?.examinationStats} />
          </div>
          <div className="tw-col-span-12">
            <RankSwiper data={getExaminationDashboardDataResp?.summarySection?.top10StudentsData} />
          </div>
          <div className="tw-col-span-12 tw-grid">
            <GradeWisePerformance data={getExaminationDashboardDataResp?.studentsGradeAndMarksDistribution} />
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
            {/* <div className="col-12 col-xl-4 d-grid">
            <SchoolResults data={getExaminationDashboardDataResp?.schoolAverageAggregatePercentage}/>
          </div> */}
            <ExaminationSummary data={getExaminationDashboardDataResp?.summarySection} subjectList={getExaminationDashboardDataResp?.subjectAnalysis?.subjects} />
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
            <GradewisePerformanceChart data={getExaminationDashboardDataResp?.subjectAnalysis} />
          </div>
          <div className="tw-col-span-12">
            <BranchWiseResultsAnlaysis data={getBranchWiseMarksRangeResp} filterValues={examinationForm.values} setFilterValues={onChangeFilterHndlr} />
          </div>
          <div className="tw-col-span-12">
            <SubjectGradeAnalysis data={getSubjectGradeWiseAnalysisResp?.subjectAndGradeWiseAnalysis} filterValues={examinationForm.values} setFilterValues={onChangeFilterHndlr}></SubjectGradeAnalysis>
          </div>
          {/* <div className="col-12">
            <BranchWiseStudentsMarksList></BranchWiseStudentsMarksList>
          </div> */}
          {/* <div className="col-12">
            <StudentGradeBook></StudentGradeBook>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SuperAdminExaminationDashboard;

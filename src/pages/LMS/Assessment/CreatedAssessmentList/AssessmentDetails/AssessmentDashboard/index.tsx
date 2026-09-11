import AssessmentQuestionsAnalytics from "./AssessmentQuestionsAnalytics";
import GradeWiseAnalysis from "./GradeWiseAnalysis";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { getAssessmentQuestionSectionHeatmap, getAssessmentSectionWiseMarksOutcomeDetailsAct, getAssessmentSectionWiseOutcomeDetailsAct, getAssessmentWiseTopStudentsDetailsAct, getStatsByAssessmentAct } from "../../../../../../store/lms/studentAssessment/studentAssessmentActions";
import { useEffect, useRef, useState } from "react";
import SectionWiseAssessmentStats from "./SectionWiseAssessmentStats";
import AssessmentWiseTopStudentsDetails from "./AssessmentWiseTopStudentsDetails";
import { toast } from "react-toastify";
import CohertRosters from "./CohertRosters";
import { getSectionList } from "../../../../../../store/academic/classroomManagment/classroommanagmentactions";
import { SelectInput, TextInput } from "../../../../../../Components/Common";
import { useFormik } from "formik";
import { getResultListAct } from "../../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import QuestionWiseAnalysis from "./QuestionWiseAnalysis";

const initialValues = {
  academicYearName: "",
  curriculumName: "",
  className: "",
  sectionId: "",
}

const AssessmentDashboard = (getAssessmentByIdResp) => {
  const dispatch = useAppDispatch();
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");

    const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    showApiLoader,
    getAssessmentQuestionSectionHeatMapResp,
    getStatsByAssessmentResp,
    getAssessmentWiseTopStudentsDetailsResp,
    getAssessmentSectionWiseMarksOutcomeDetailsGenAct,
    getAssessmentSectionWiseDetailsDetailsResp,
    sectionListResp,
    getResultListResp,
    studentAssessmentsErrorResp
  } = useAppSelector(
    ({
      globalData,
      appData,
      instAcademics,
      studentAssessments,
      lmsAssessment,
      classroomManagmentInfo,
    }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      showApiLoader: globalData.showApiLoader,
      getAssessmentQuestionSectionHeatMapResp: studentAssessments.getAssessmentQuestionSectionHeatMapResp,
      getStatsByAssessmentResp: studentAssessments.getStatsByAssessmentResp,
      getAssessmentWiseTopStudentsDetailsResp: studentAssessments.getAssessmentWiseTopStudentsDetailsResp,
      getAssessmentSectionWiseMarksOutcomeDetailsGenAct: studentAssessments.getAssessmentSectionWiseMarksOutcomeDetailsGenAct,
      getAssessmentSectionWiseDetailsDetailsResp: studentAssessments.getAssessmentSectionWiseDetailsDetailsResp,
      getResultListResp: lmsAssessment.getResultListResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      studentAssessmentsErrorResp: studentAssessments.studentAssessmentsErrorResp,
    }),
    shallowEqual
  );

  const questionSectionheatMapApi = () => {
    if (!getAssessmentByIdResp?.id) return;
    dispatch(
      getAssessmentQuestionSectionHeatmap(
        generateActionPayload("get_assessment_question_section_heatmap", { assessmentId: getAssessmentByIdResp.id })
      )
    );
  };

  const assessmentStatsApi = (sectionId?: string) => {
    if (!getAssessmentByIdResp?.id) return;

    const finalSectionId = sectionId && sectionId !== "all" ? sectionId : "";
    const payload = {
      assessmentId: getAssessmentByIdResp.id,
      sectionId: finalSectionId,
    };

    dispatch(getStatsByAssessmentAct(generateActionPayload("get_stats_by_assessment", payload)));
  };

  const assessmentSectionGradeSummaryApi = () => {
    if (!getAssessmentByIdResp?.id) return;
    dispatch(
      getAssessmentSectionWiseMarksOutcomeDetailsAct(
        generateActionPayload("get_assessment_section_wise_marks_outcome_details", { assessmentId: getAssessmentByIdResp.id })
      )
    );
  };

  const assessmentSectionWiseOutcomeApi = (sectionId?: string) => {
    if (!getAssessmentByIdResp?.id) return;
    const finalSectionId = sectionId && sectionId !== "all" ? sectionId : "";
    const payload = {
      assessmentId: getAssessmentByIdResp.id,
      sectionId: finalSectionId,
    };

    dispatch(getAssessmentSectionWiseOutcomeDetailsAct(generateActionPayload("get_assessment_section_wise_outcome_details", payload)));
  };

  const assessmentWiseTopStudentsDetailsApi = (sectionId?: string) => {
    if (!getAssessmentByIdResp?.id) return;
    const finalSectionId = sectionId && sectionId !== "all" ? sectionId : "";
    const payload = {
      assessmentId: getAssessmentByIdResp.id,
      sectionId: finalSectionId,
    };

    dispatch(getAssessmentWiseTopStudentsDetailsAct(generateActionPayload("get_assessment_wise_top_students_details", payload)));
  };

  const getSectionListResp = (otherProps?: any) => {
    const { classId, academicYearId, branchCurriculumId } = getAssessmentByIdResp?.getAssessmentByIdResp || {};

    let payload = {
      branchClassId: classId || null,
      masterAcademicYearId: academicYearId,
      curriculumId: branchCurriculumId,
      pageNo: 0,
      pageSize: 20,
      sortBy: "sectionName",
      orderBy: "asc",
      ...otherProps
    };

    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }
const getResultListApiCall = (
    sectionId?: string,
    attemptStatus?: string,
    resultStatus?: string,
    otherProps?: Record<string, any>
  ) => {
    const { academicYearId } = getAssessmentByIdResp?.getAssessmentByIdResp || {};
    if (!academicYearId) return;

    const finalSectionId =
      sectionId === null || sectionId === undefined || sectionId === "all"
        ? ""
        : sectionId;

    const payload = {
      branchId,
      assessmentId: getAssessmentByIdResp.id,
      sectionId: finalSectionId,
      academicYearId: academicYearId,
      attemptStatus: attemptStatus || "",
      resultStatus: resultStatus || "",
      pageNo: 0,
      pageSize: 200,
      ...otherProps,
    };
    if (payload.branchId) {
      dispatch(
        getResultListAct(
          generateActionPayload("get_result_list", undefined, payload)
        )
      );
    }
  };

  useEffect(() => {
    const id = getAssessmentByIdResp?.id;
    const academicYearId = getAssessmentByIdResp?.getAssessmentByIdResp?.academicYearId;
    if (id && academicYearId) {
      questionSectionheatMapApi();
      assessmentStatsApi();
      assessmentWiseTopStudentsDetailsApi();
      assessmentSectionGradeSummaryApi();
      assessmentSectionWiseOutcomeApi();
      getResultListApiCall();
    }
  }, [getAssessmentByIdResp?.id, getAssessmentByIdResp?.getAssessmentByIdResp?.academicYearId]);

  const assessmentDashboardRef = useRef({
    prevStudentAssessmentsListByIdErrorResp: studentAssessmentsErrorResp,
  });

  useEffect(() => {
    const { prevStudentAssessmentsListByIdErrorResp } = assessmentDashboardRef.current;
    if (studentAssessmentsErrorResp && prevStudentAssessmentsListByIdErrorResp !== studentAssessmentsErrorResp) {
      const { details } = studentAssessmentsErrorResp || {};
      toast.error(details || "Something went wrong");
    }
    assessmentDashboardRef.current.prevStudentAssessmentsListByIdErrorResp = studentAssessmentsErrorResp;
  }, [studentAssessmentsErrorResp,]);

  const settingsFormik = useFormik({
    initialValues,
    onSubmit: (values) => {

    },
  });

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    settingsFormik.setFieldValue("sectionId", value);
    const normalizedValue = value === "all" ? "" : value;
    setSelectedSectionId(normalizedValue);
    assessmentWiseTopStudentsDetailsApi(normalizedValue);
    assessmentStatsApi(normalizedValue);
    assessmentSectionWiseOutcomeApi(normalizedValue);
    getResultListApiCall(normalizedValue);

  };

  useEffect(() => {
    if (getAssessmentByIdResp?.getAssessmentByIdResp) {
      getSectionListResp();
    }
  }, [getAssessmentByIdResp]);

  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-12 col-md-3 col-lg-2">
                  <TextInput
                    name="academicYearName"
                    value={getAssessmentByIdResp?.getAssessmentByIdResp?.academicYearName || ""}
                    onChange={handleSectionChange}
                    formgroupClassName="mb-0"
                    labelText="Academic Year"
                    floatingLabel
                    isDisabled
                  />
                </div>
                <div className="col-12 col-md-3 col-lg-2">
                  <TextInput
                    name="curriculumName"
                    value={getAssessmentByIdResp?.getAssessmentByIdResp?.curriculumName || ""}
                    onChange={handleSectionChange}
                    formgroupClassName="mb-0"
                    labelText="Curriculum"
                    floatingLabel
                    isDisabled
                  />
                </div>
                <div className="col-12 col-md-3 col-lg-2">
                  <TextInput
                    name="className"
                    value={getAssessmentByIdResp?.getAssessmentByIdResp?.className || ""}
                    onChange={handleSectionChange}
                    formgroupClassName="mb-0"
                    labelText="Class"
                    floatingLabel
                    isDisabled
                  />
                </div>

                <div className="col-12 col-md-3 col-lg-2">
                  <SelectInput
                    name="sectionId"
                    value={settingsFormik.values.sectionId}
                    onChange={handleSectionChange}
                    menuItems={[
                      { sectionId: "all", sectionName: "All" },
                      ...(sectionListResp?.data || []),
                    ]}
                    valueKey="sectionId"
                    textKey="sectionName"
                    formgroupClassName="mb-0"
                    labelText="Section"
                    floatingLabel
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3">
        <div className="col-12 mt-0 mb-2">
          <SectionWiseAssessmentStats getStatsByAssessmentResp={getStatsByAssessmentResp} />
        </div>
      </div>
      <div className="row gx-3 mb-4">
        <div className="col-12 col-lg-9" style={{ height: '500px' }}>
          <GradeWiseAnalysis getAssessmentSectionWiseMarksOutcomeDetailsGenAct={getAssessmentSectionWiseMarksOutcomeDetailsGenAct} />
        </div>
        <div className="col-12 col-md-3" style={{ height: '500px' }}>
          <AssessmentQuestionsAnalytics getAssessmentSectionWiseDetailsDetailsResp={getAssessmentSectionWiseDetailsDetailsResp} />
        </div>
        <div className="col-12 my-4">
          <QuestionWiseAnalysis getAssessmentQuestionSectionHeatMapResp={getAssessmentQuestionSectionHeatMapResp} getStatsByAssessmentResp={getStatsByAssessmentResp}/>
        </div>
        <div className="col-12 mt-4">
          <AssessmentWiseTopStudentsDetails
            getAssessmentWiseTopStudentsDetailsResp={getAssessmentWiseTopStudentsDetailsResp} />
        </div>
        <div className="col-12">
          <CohertRosters getResultListResp={getResultListResp} getResultListApiCall={getResultListApiCall} getAssessmentByIdResp={getAssessmentByIdResp}/>
        </div>
      </div>
    </>
  );
};

export default AssessmentDashboard;

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, } from "../../../../Components/Common";
import { getPayload } from "./helper";
import { useFormik } from "formik";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import LearningSubjectsSkills from "./LearningSubjectSkills";
import CreativeExprissions from "./CreativeExprissions";
import CambridgeLearnerAttribute from "./CambridgeLearnerAttributes";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSectionList, resetSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getEyGradeEntryDetailsAct, saveEyGradeEntryListAct, setEyGradeEntryAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { getExaminationTermListAct, getIgseTermNameListAct, getSkillEntryListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import SecondLanguage from "./SecondLanguage";
import { resetAssignedClassSubjectsListAct } from "../../../../store/academic/classSubjects/classsubjectsslice";
import * as Yup from "yup"
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons-pro/core-stroke-standard";
import { setIgseTermDetailsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsslice";
import { useLocation } from "react-router-dom";
import SportsSkills from "./SportsSkills";
import SoftSkills from "./SoftSkills";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  termId: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classId: Yup.string().required("Class is required.").nullable(),
  sectionId: Yup.string().required("Section is required.").nullable(),
  termId: Yup.string().required("Term is required."),
});

const EYGradesEntry = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const classApiCalled = useRef(false);

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const isEy = location.pathname.includes("/early-years-management");
  const isIgcse = location.pathname.includes("/igcse-management");

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    sectionListResp,
    showApiLoader,
    getEyGradeEntryListResp,
    getIgseTermNameListResp,
    saveEyGradeEntryListResp,
    examinationManagementErrorResp,
    loggedInUserRole
  } = useAppSelector(
    ({ instAcademics, branchAcademics, classroomManagmentInfo, examinationManagement, appData, examinationSettings, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getEyGradeEntryListResp: examinationManagement.getEyGradeEntryListResp,
      saveEyGradeEntryListResp: examinationManagement.saveEyGradeEntryListResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      loggedInUserRole: appData.loggedInUserRole,
    }),
    shallowEqual
  );

  const MenuOptions = [
     ...(isEy
    ? [
        {
          id: "learningSubject",
          labelName: "Areas of Learning and Subject Skillsets",
          customPadding: "0px 15px",
        },
      ]
    : []),
     ...(isEy
    ? [
        {
      id: "creativeExprissions",
      labelName: "Creative Expressions",
      customPadding: "0px 15px",
    },
      ]
    : []),
     ...(isIgcse
    ? [
        {
      id: "creativeExprissions",
      labelName: "Personality , Creative & Professional Curricular Skills",
      customPadding: "0px 15px",
    },
      ]
    : []),
      ...(isIgcse
    ? [
        {
          id: "sportSkills",
          labelName: "Physical Education : Sports Skills",
          customPadding: "0px 15px",
        },
        {
          id: "softSkills",
          labelName: "Soft Skills",
          customPadding: "0px 15px",
        },
      ]
    : []),
    {
      id: "cambridgeLearnerAttribute",
      labelName: "Cambridge Learner Attributes",
      customPadding: "0px 15px",
    },
    ...(isEy
      ? [
        {
          id: "secondLanguage",
          labelName: "II Language - Hindi/Telugu",
          customPadding: "0px 15px",
        },
      ]
      : []),
  ];

  const [activeId, setActiveId] = useState<string | null>(MenuOptions[0]?.id || null);
  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  useEffect(() => {
    if (activeId && admitCardForm.values.academicYearId && admitCardForm.values.curriculumId && admitCardForm.values.classId && admitCardForm.values.sectionId) {
      eyGradesEntryList();
    }
  }, [activeId]);

  const onSubmitApiCall = (name: string, studentsData: any) => {
    const payload = getPayload(name, { ...admitCardForm.values, branchId }, studentsData, isEy, isIgcse)    
    dispatch(saveEyGradeEntryListAct(generateActionPayload("save_ey_grade_list", undefined, payload)));
  }

  const eyGradesEntryList = (otherProps?: any) => {
    let gradeType = "";
    switch (activeId) {
      case "learningSubject":
        gradeType = "ACADEMIC_PERFORMANCE";
        break;
      case "creativeExprissions":
        gradeType = "CREATIVE_EXPRESSION";
        break;
      case "sportSkills":
        gradeType = "SOFT_SPORT_SKILLS";
        break;
      case "softSkills":
        gradeType = "SOFT_SPORT_SKILLS";
        break;
      case "cambridgeLearnerAttribute":
        gradeType = isIgcse ? "CAMBRIDGE_ENTRY_LEARNER" : "ENTRY_LEARNER";
        break;
      case "secondLanguage":
        gradeType = "SECOND_LANGUAGE";
        break;
      default:
        gradeType = "";
    }
    let payload = {
      branchId,
      academicYearId: admitCardForm.values.academicYearId,
      curriculumId: admitCardForm.values.curriculumId,
      classId: admitCardForm.values.classId,
      sectionId: admitCardForm.values.sectionId,
      searchString: admitCardForm.values.searchString,
      termId: admitCardForm.values.termId,
      ...pagination.current,
      gradeType,
      ...otherProps,
    };

    dispatch(getEyGradeEntryDetailsAct(generateActionPayload("get_ey_grade_list", undefined, payload)));
  };

  const examinationTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  const eyAoDataList = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: admitCardForm.values?.academicYearId, curriculumId: admitCardForm.values.curriculumId, ...otherProps };
    dispatch(getSkillEntryListAct(generateActionPayload("get_skill_entry_list", undefined, payload)));
  };

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetSectionListAct(undefined))
      dispatch(setEyGradeEntryAct(undefined))
    }
  }, [])

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    eyGradesEntryList({ ...admitCardForm.values, ...paginationInfo });
  }

  const admitCardForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      eyGradesEntryList({ ...values, searchString: "" })
      admitCardForm.setFieldValue("searchString", "");
    },
  });

const filteredMenuOptions = useMemo(() => {
  return MenuOptions.filter((menu) => {
    if (menu.id === "secondLanguage") {
      const selectedClassId = Number(admitCardForm.values.classId);
      const selectedClass = branchClassResp?.content?.find(
        (cls: any) => cls.id === selectedClassId
      );
      return selectedClass?.shortName === "EY-2" || selectedClass?.shortName === "EY-3";
    }
    return true;
  });
}, [admitCardForm.values.curriculumId, admitCardForm.values.classId, branchClassResp]);

  const studentRemarksRef = useRef({
    prevSaveEyGradeEntryListResp: saveEyGradeEntryListResp,
    prevStudentRemarksErrorResp: examinationManagementErrorResp,
  })

  useEffect(() => {
    if (activeId) {
      dispatch(setEyGradeEntryAct(undefined));
    }
  }, [activeId]);

  useEffect(() => {
    const { prevSaveEyGradeEntryListResp, prevStudentRemarksErrorResp } = studentRemarksRef.current;
    if (saveEyGradeEntryListResp && prevSaveEyGradeEntryListResp !== saveEyGradeEntryListResp) {
      isEy && toast.success("Ey grade entry saved successfully");
      isIgcse && toast.success("Igcse grade entry saved successfully");
      eyGradesEntryList()
    } else if (examinationManagementErrorResp && prevStudentRemarksErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    studentRemarksRef.current.prevSaveEyGradeEntryListResp = saveEyGradeEntryListResp;
    studentRemarksRef.current.prevStudentRemarksErrorResp = examinationManagementErrorResp;
  }, [saveEyGradeEntryListResp, examinationManagementErrorResp]);

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    admitCardForm.setFieldValue("academicYearId", yearId)
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);
  
  useEffect(() => {
    classApiCalled.current = false;
  }, [location.pathname]);

  useEffect(() => {
      const { data } = brchCurriculumResp || {};
      const curriculumMapping: Record<string, string> = {
        "/early-years-management": "EY1-EY3",
        "/cbse-management": "CBSE",
        "/igcse-management": "IGCSE",
      };
      const selectedCurriculumName = curriculumMapping[location.pathname];
  
      if (Array.isArray(data) && data.length > 0 && admitCardForm.values.academicYearId) {
        const selectedCurriculum = data.find(
          (item: any) => item.shortName?.trim()?.toUpperCase() === selectedCurriculumName?.trim()?.toUpperCase()
        );
  
        if (!selectedCurriculum) {
          dispatch(resetAssignedClassSubjectsListAct(undefined));
          dispatch(resetBrchClassAct(undefined));
          admitCardForm.setFieldValue("curriculumId", undefined);
          return;
        }
  
        const payload: any = {
          branchId,
          curriculumId: selectedCurriculum.branchCurriculumId,
          academicYearId: admitCardForm.values.academicYearId,
          sortBy: "classSequence",
          classFilter: isEy ? "EARLY" : "HIGHER",
          orderBy: "asc",
          pageNo: 0,
          pageSize: 100,
        };
        if (loggedInUserRole === "TEACHER") {
        payload.moduleName = "EXAMINATION";
        }
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, {branchId, curriculumId: selectedCurriculum.branchCurriculumId})));
        admitCardForm.setFieldValue("curriculumId", selectedCurriculum.branchCurriculumId);
  
      }
    }, [brchCurriculumResp, admitCardForm.values.academicYearId, location.pathname]);

  useEffect(() => {
    if (admitCardForm.values.academicYearId && admitCardForm.values.curriculumId && activeId !== "cambridgeLearnerAttribute") {
      eyAoDataList({
        branchId,
        academicYearId: admitCardForm.values.academicYearId,
        curriculumId: admitCardForm.values.curriculumId
      });
    }
  }, [activeId, admitCardForm.values.academicYearId, admitCardForm.values.curriculumId]);

  const handleSearch = (event: any) => {
    admitCardForm.handleSubmit(event);
    if (Object.keys(admitCardForm.errors).length === 0 &&
      Object.values(admitCardForm.values).every(value => value)) {
      eyGradesEntryList();
    }
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: admitCardForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload1.moduleName = "EXAMINATION";
    }
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: admitCardForm.values?.academicYearId, curriculumId: admitCardForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", classFilter: isEy ? "EARLY" : "HIGHER", pageNo: 0, pageSize: 100, ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload.moduleName = "EXAMINATION";
    }
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionListResp = (otherProps?: any) => {

    let payload = { branchClassId: admitCardForm.values.classId || null, masterAcademicYearId: admitCardForm.values.academicYearId, curriculumId: admitCardForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
    if (loggedInUserRole === "TEACHER") {
      payload.moduleName = "EXAMINATION";
    }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" }))
      getCurriculumApiCall({ academicYearId: value });
    }
    else if (name === 'curriculumId') {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
        dispatch(setIgseTermDetailsListAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: admitCardForm.values.academicYearId });
        examinationTermList(value);
      }
    }
    else if (name === 'classId') {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))

      if (!value) {
        dispatch(resetSectionListAct(undefined))
      } else {
        getSectionListResp({ branchClassId: value })
      }
    }
    else if (name === "searchString") {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      eyGradesEntryList({ searchString: value });
    }
    else {
      admitCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  function getActiveMenuComponent(menuId: string | null, getEyGradeEntryListResp: any, onSubmitApiCall: any) {
    switch (menuId) {
      case "learningSubject":
        return <LearningSubjectsSkills
          getEyGradeEntryListResp={getEyGradeEntryListResp}
          eyGradesEntryList={eyGradesEntryList}
          onSubmitApiCall={onSubmitApiCall}
        />;
      case "creativeExprissions":
        return <CreativeExprissions getEyGradeEntryListResp={getEyGradeEntryListResp}
          eyGradesEntryList={eyGradesEntryList} onSubmitApiCall={onSubmitApiCall} />;
      case "sportSkills":
        return <SportsSkills getEyGradeEntryListResp={getEyGradeEntryListResp}
          eyGradesEntryList={eyGradesEntryList} onSubmitApiCall={onSubmitApiCall} />;
      case "softSkills":
        return <SoftSkills getEyGradeEntryListResp={getEyGradeEntryListResp}
          eyGradesEntryList={eyGradesEntryList} onSubmitApiCall={onSubmitApiCall} />;
      case "cambridgeLearnerAttribute":
        return <CambridgeLearnerAttribute getEyGradeEntryListResp={getEyGradeEntryListResp}
          eyGradesEntryList={eyGradesEntryList} onSubmitApiCall={onSubmitApiCall} />;
      case "secondLanguage":
        return <SecondLanguage getEyGradeEntryListResp={getEyGradeEntryListResp}
          eyGradesEntryList={eyGradesEntryList} onSubmitApiCall={onSubmitApiCall} />;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    return getActiveMenuComponent(activeId, getEyGradeEntryListResp, onSubmitApiCall);
  }, [activeId, getEyGradeEntryListResp, paginationHndlr]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={admitCardForm.handleSubmit}>
          <div className="bg-light m-3 pt-1 rounded">
            <div className="row p-3 g-3 examination">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="academicYearId"
                  value={admitCardForm.values.academicYearId}
                  onChange={onChangeFilterHndlr}
                  menuItems={academicYearList || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  labelText='Academic Year'
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName='mb-0'
                  floatingLabel
                  invalid={(admitCardForm.touched.academicYearId && admitCardForm.errors.academicYearId) ? true : false}
                  error={(admitCardForm.touched.academicYearId && admitCardForm.errors.academicYearId) ? admitCardForm.errors.academicYearId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="curriculumId"
                  value={admitCardForm.values.curriculumId}
                  onChange={onChangeFilterHndlr}
                  menuItems={curriculumTypes || []}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  labelText='Curriculum'
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName='mb-0'
                  floatingLabel
                  isDisabled={!isEy}
                  invalid={(admitCardForm.touched.curriculumId && admitCardForm.errors.curriculumId) ? true : false}
                  error={(admitCardForm.touched.curriculumId && admitCardForm.errors.curriculumId) ? admitCardForm.errors.curriculumId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="classId"
                  value={admitCardForm.values.classId}
                  onChange={onChangeFilterHndlr}
                  menuItems={classTypes || []}
                  valueKey="id"
                  textKey="shortName"
                  labelText='Class'
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName='mb-0'
                  floatingLabel
                  invalid={(admitCardForm.touched.classId && admitCardForm.errors.classId) ? true : false}
                  error={(admitCardForm.touched.classId && admitCardForm.errors.classId) ? admitCardForm.errors.classId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="sectionId"
                  labelText="Section"
                  value={admitCardForm.values.sectionId}
                  onChange={onChangeFilterHndlr}
                  menuItems={sectionListResp?.data || []}
                  valueKey="sectionId"
                  textKey="sectionName"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName='mb-0'
                  floatingLabel
                  invalid={(admitCardForm.touched.sectionId && admitCardForm.errors.sectionId) ? true : false}
                  error={(admitCardForm.touched.sectionId && admitCardForm.errors.sectionId) ? admitCardForm.errors.sectionId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="termId"
                  value={admitCardForm.values.termId}
                  onChange={onChangeFilterHndlr}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="mb-0 w-100"
                  floatingLabel
                  labelText='Term Name'
                  labelClass="required"
                  inputClassName="bg-light"
                  invalid={(admitCardForm.touched.termId && admitCardForm.errors.termId) ? true : false}
                  error={(admitCardForm.touched.termId && admitCardForm.errors.termId) ? admitCardForm.errors.termId : ""}
                />
              </div>
              <div className="col-auto ms-auto d-flex align-items-start">
                <button className="btn btn-3 float-end text-white d-flex justify-content-center align-items-center" style={{ background: "#405189", border: "none" }} disabled={showApiLoader} type="button" onClick={handleSearch}>
               <HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} /> Search
                </button>
              </div>
            </div>
          </div>
        </form>
        <UpdatedHorizontalTab
          MenuOptions={filteredMenuOptions}
          clickMenuHandler={clickMenuHandler}
          activeTabId={activeId}
          showBadge={true}
          horizontalClass="mb-0 overflow-auto text-nowrap"
        />
        {activeComponent}
      </div>
    </>
  );
};
export default EYGradesEntry;
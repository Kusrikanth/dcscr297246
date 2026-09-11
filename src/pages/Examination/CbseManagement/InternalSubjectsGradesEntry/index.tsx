import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TextInput, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSectionList, resetSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getCoscholasticGradesListAct, getExaminationInstituteTermsAct, getInternalSubjectsMarksListAct, getSubjectsForInternalMarksEntryAct, saveInternalSubjectsMarksListAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { getAssignedClassSubjectsList, resetAssignedClassSubjectsListAct } from "../../../../store/academic/classSubjects/classsubjectsactions";
import { toast } from "react-toastify";
import * as Yup from "yup"
import { touchTableFieldOnBlur, validateOnChange, validateOnSubmit } from "../../../../utility/validationutility";
import { debounce } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons-pro/core-stroke-standard";
import { getCbseInternalSubjectsGradesListAct, getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";


const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  subjectId: "",
  termId: "",
};


const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classId: Yup.string().required("Class is required.").nullable(),
  sectionId: Yup.string().required("Section is required.").nullable(),
  termId: Yup.string().required("Term is required."),
  subjectId: Yup.string().required("Subject is required."),
});


const studentValidationSchema = Yup.array()
  .of(
    Yup.object().shape({
      grade: Yup.string().required("Grade is required.").nullable(),
    })
  )
  .test(
    "at-least-one-selected",
    "At least one subject must be selected",
    (subjects) => subjects?.some((subject) => subject.isSelected) || false
  );

const InternalSubjectsGradesEntry = () => {
  const [studentData, setStudentData] = useState<any>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const dispatch = useAppDispatch();

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    sectionListResp,
    getIgseTermNameListResp,
    getSubjectsForInternalMarksEntryResp,
    examinationManagementErrorResp,
    getInternalSubjectsMarksListResp,
    getCoscholasticGradesListResp,
    saveInternalSubjectsMarksListResp,
    getCbseInternalSubjectsGradesListResp,
    loggedInUserRole,
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, examinationManagement, examinationSettings, classSubjectsInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getSubjectsForInternalMarksEntryResp: examinationManagement.getSubjectsForInternalMarksEntryResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      getInternalSubjectsMarksListResp: examinationManagement.getInternalSubjectsMarksListResp,
      getCoscholasticGradesListResp: examinationManagement.getCoscholasticGradesListResp,
      saveInternalSubjectsMarksListResp: examinationManagement.saveInternalSubjectsMarksListResp,
      getCbseInternalSubjectsGradesListResp: examinationSettings.getCbseInternalSubjectsGradesListResp,
      loggedInUserRole: appData.loggedInUserRole,
    }),
    shallowEqual
  );

  const marksEntryRef = useRef({
    prevExaminationManagementErrorResp: examinationManagementErrorResp,
    prevSaveInternalSubjectsMarksListResp: saveInternalSubjectsMarksListResp,
  })

  useEffect(() => {
    const { prevExaminationManagementErrorResp, prevSaveInternalSubjectsMarksListResp } = marksEntryRef.current || {}
    if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveInternalSubjectsMarksListResp && prevSaveInternalSubjectsMarksListResp !== saveInternalSubjectsMarksListResp) {
      toast.success("Marks saved successfully")
      getInternalGradeEntryApiCall();
      setStudentData((prev: any) => prev.map((item: any) => ({ ...item, isSelected: false })))
      setAllStudentSelectedState(false)
    }
    marksEntryRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
    marksEntryRef.current.prevSaveInternalSubjectsMarksListResp = saveInternalSubjectsMarksListResp
  }, [examinationManagementErrorResp, saveInternalSubjectsMarksListResp])


  const internalGradeEntryForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      getInternalGradeEntryApiCall();
      getCoscholasticGradeList()
    },
  });


  const getCoscholasticGradeList = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: internalGradeEntryForm.values.academicYearId,
      curriculumId: internalGradeEntryForm.values.curriculumId,
      classId: internalGradeEntryForm.values.classId,
      subjectId: internalGradeEntryForm.values.subjectId,
      ...otherProps
    }
    delete payload?.termId
    delete payload?.searchString
    dispatch(getCbseInternalSubjectsGradesListAct(generateActionPayload("get_cbse_internal_subjects_grades_list", undefined, payload)));
  }
  const getInternalGradeEntryApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      instituteId,
      academicYearId: internalGradeEntryForm.values.academicYearId,
      curriculumId: internalGradeEntryForm.values.curriculumId,
      classId: internalGradeEntryForm.values.classId,
      sectionId: internalGradeEntryForm.values.sectionId,
      subjectId: internalGradeEntryForm.values.subjectId,
      termId: internalGradeEntryForm.values.termId,
      searchString: internalGradeEntryForm.values.searchString,
      ...otherProps,
    }
    dispatch(getInternalSubjectsMarksListAct(generateActionPayload("get_internal_subjects_marks_list", undefined, payload)));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: internalGradeEntryForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload1.moduleName = "EXAMINATION";
    }
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: internalGradeEntryForm.values?.academicYearId, curriculumId: internalGradeEntryForm.values.curriculumId, classFilter:  "HIGHER",  sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload.moduleName = "EXAMINATION";
    }
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: internalGradeEntryForm.values.classId || null, masterAcademicYearId: internalGradeEntryForm.values.academicYearId, curriculumId: internalGradeEntryForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
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

  const instituteTerms = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  const getSubjectList = (otherProps?: any) => {
    const { academicYearId, classId, curriculumId } = internalGradeEntryForm.values || {}
    const payload = {
      branchId ,academicYearId,  branchCurriculumId : curriculumId,branchClassId : classId,...otherProps
    }
    if (payload.branchId) {
      dispatch(
        getSubjectsForInternalMarksEntryAct(
          generateActionPayload("get_subjects_for_internal_marks", undefined, payload)
        )
      );
    }
  }

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...studentData];
    updateStudentState.forEach((item: any) => {
      item.isSelected = checked;
      if (!checked) {
        item.errors = {};
      }
    });
    setStudentData(updateStudentState);
  }, [studentData]);

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget
    const studentIdNumber = event.currentTarget.getAttribute("data-id")
    const studentRowIndex = studentData.findIndex((item: any) => +item.studentId === Number(studentIdNumber));
    if (studentRowIndex > -1) {      
      const studentDetails: any = studentData[studentRowIndex];
      let updateStudentState: any = [...studentData];
      updateStudentState.splice(studentRowIndex, 1, {
        ...studentDetails, isSelected: checked, ...(checked ? {} : { errors: {} }),
      });

      setStudentData(updateStudentState);
      const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [studentData]);

  useEffect(() => {
    if (getInternalSubjectsMarksListResp && Array.isArray(getInternalSubjectsMarksListResp?.studentGradeEntryDTOS)) {
      if (getInternalSubjectsMarksListResp?.studentGradeEntryDTOS.length > 0) {
        setStudentData(getInternalSubjectsMarksListResp?.studentGradeEntryDTOS?.map((item: any) => ({
          ...item,
          isSelected: false,
          isUpdated: item.studentGradeId ? true : false
        })))
      }
      else {
        setStudentData([]);
      }
    }
  }, [getInternalSubjectsMarksListResp]);

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    internalGradeEntryForm.setFieldValue("academicYearId", yearId)
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0 && internalGradeEntryForm.values.academicYearId) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === "CBSE"
      );

      if (!selectedCurriculum) {
        dispatch(resetAssignedClassSubjectsListAct(undefined));
        dispatch(resetBrchClassAct(undefined));
        internalGradeEntryForm.setFieldValue("curriculumId", undefined)
        internalGradeEntryForm.setFieldValue("subjectId", undefined)
        return;
      }

      const payload: any = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: internalGradeEntryForm.values.academicYearId,
        classFilter: "HIGHER",
        sortBy: "classSequence",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      if (loggedInUserRole === "TEACHER") {
        payload.moduleName = "EXAMINATION";
      }
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, {branchId, curriculumId: selectedCurriculum.branchCurriculumId})));
      internalGradeEntryForm.setFieldValue("curriculumId", selectedCurriculum.branchCurriculumId);
    }
  }, [brchCurriculumResp]);

  async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const [indexKey, nameKey] = name.split(".");

    if (indexKey && nameKey) {
      const indexMatch = indexKey.match(/\[(.*?)\]/) || "";
      const index = Number(indexMatch[1]);

      if (!isNaN(index)) {
        const updatedTermState = [...studentData];
          updatedTermState[index] = {
            ...studentData[index],
            [nameKey]: value,
          }
        const { items } = await validateOnChange(studentValidationSchema, name, updatedTermState);
        setStudentData(
          items.map((item: any, idx: number) => ({
            ...item,
            isSelected: updatedTermState[idx]?.isSelected || false,
          }))
        );
        setStudentData(updatedTermState);
      }
    }
  }


  async function onBlurTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const [indexKey, nameKey] = name.split(".");

    if (indexKey && nameKey) {
      const indexMatch = indexKey.match(/\[(.*?)\]/) || "";
      const index = Number(indexMatch[1]);

      if (!isNaN(index)) {
        const updatedStudentsListData = [...studentData];
        updatedStudentsListData[index] = {
          ...updatedStudentsListData[index],
          [nameKey]: value,
        };

        const studentsListDataTouched = await touchTableFieldOnBlur(index, nameKey, updatedStudentsListData);
        setStudentData(
          studentsListDataTouched.map((subject: any, idx: any) => ({
            ...subject,
            isSelected: studentData[idx]?.isSelected || false,
          }))
        );
      }
    }
  }

  async function submitHndlr() {
      const selectedStudent = studentData.filter((student: any) => student.isSelected);
  
      if (!selectedStudent.length) {
        toast.warning("Please select at least one student.");
        return;
      }
  
      const { items, isValid: isStudentStateValid } = await validateOnSubmit(
        studentValidationSchema,
        selectedStudent
      );
  
      if (!isStudentStateValid) {
        setStudentData((prev: any) =>
          prev.map((student: any) => {
            const validatedStudent = items.find(
              (item: { studentId: number }) => item.studentId === student.studentId
            );
            return validatedStudent
              ? { ...student, errors: validatedStudent.errors }
              : student;
          })
        );
        return;
      }
  
      const studentMarksDTOS = selectedStudent.map((item: any) => {
        
        const matchedGrade = getCbseInternalSubjectsGradesListResp?.data?.find(
          (innerItem: any) => innerItem.grade === item.grade
        )?.grade;
      
        if (item.isUpdated === false) {
          return {
            studentId: item.studentId,
            grade: matchedGrade || "",
          };
        } else {
          return {
            studentId: item.studentId,
            grade: matchedGrade || "",
            studentGradeId: item.studentGradeId,
            isUpdatedGrade: true,
          };
        }
      });
      
      
      const payload = {
        branchId,
        academicYearId: internalGradeEntryForm.values.academicYearId,
        curriculumId: internalGradeEntryForm.values.curriculumId,
        classId: internalGradeEntryForm.values.classId,
        sectionId: internalGradeEntryForm.values.sectionId,
        termId: internalGradeEntryForm.values.termId,
        subjectId: internalGradeEntryForm.values.subjectId,
        gradeId: getInternalSubjectsMarksListResp?.gradeId || "",
        studentGradeEntryDTOS:studentMarksDTOS
        
      }
            
      if (studentMarksDTOS.length > 0) {
        dispatch(saveInternalSubjectsMarksListAct(generateActionPayload("save_internal_subjects_marks", undefined, payload)));
      }
      else {
        toast.warning("Please select at least one student.");
      }
    }

  
    function search(value: string) {
      getInternalGradeEntryApiCall({ ...internalGradeEntryForm.values, searchString: value });
    }
  
    const debounceFun = useCallback(debounce(search, 200), [studentData]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetSectionListAct(undefined))
      internalGradeEntryForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
        curriculumId: prev.curriculumId ? prev.curriculumId : "",
        sectionId: "",
        termId: "",
        subjectId: "",

      }));
    }
    else if (name === 'classId') {
      internalGradeEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "", subjectId: "", termId: "" }));
      if (!value) {
        dispatch(resetSectionListAct(undefined))
        dispatch(resetAssignedClassSubjectsListAct(undefined))
      } else {
        getSectionListResp({ branchClassId: value })
        getSubjectList({branchClassId : value})
      }
    }
    else if (name === 'sectionId') {
      internalGradeEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "", termId: "", }));
    }
    else if (name === 'termId') {
      internalGradeEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
    }
    else if (name === "searchString") {
      internalGradeEntryForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
    else if(name === "curriculumId") {
      internalGradeEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }));
      instituteTerms(value);
    }
    else {
      internalGradeEntryForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }
  
  const columns = useMemo(() => generateColumns(allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr), [studentData,getInternalSubjectsMarksListResp]);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={internalGradeEntryForm.handleSubmit}>
          <div className="bg-light m-3 pt-1 rounded">
            <div className="row p-3 g-3 examination">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="academicYearId"
                  value={internalGradeEntryForm.values.academicYearId}
                  onChange={filterHandler}
                  menuItems={academicYearList || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  labelText="Academic Year"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  floatingLabel
                  invalid={(internalGradeEntryForm.touched.academicYearId && internalGradeEntryForm.errors.academicYearId) ? true : false}
                  error={(internalGradeEntryForm.touched.academicYearId && internalGradeEntryForm.errors.academicYearId) ? internalGradeEntryForm.errors.academicYearId : ""}
                />
              </div>

              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="curriculumId"
                  value={internalGradeEntryForm.values.curriculumId}
                  onChange={filterHandler}
                  menuItems={curriculumTypes}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  labelText="Curriculum"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  floatingLabel
                  isDisabled={true}
                  invalid={(internalGradeEntryForm.touched.curriculumId && internalGradeEntryForm.errors.curriculumId) ? true : false}
                  error={(internalGradeEntryForm.touched.curriculumId && internalGradeEntryForm.errors.curriculumId) ? internalGradeEntryForm.errors.curriculumId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="classId"
                  value={internalGradeEntryForm.values.classId}
                  onChange={filterHandler}
                  menuItems={branchClassResp?.content?.filter((item: any) => item?.classSequence >= 14)}
                  valueKey="id"
                  textKey="shortName"
                  labelText="Class"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  floatingLabel
                  invalid={(internalGradeEntryForm.touched.classId && internalGradeEntryForm.errors.classId) ? true : false}
                  error={(internalGradeEntryForm.touched.classId && internalGradeEntryForm.errors.classId) ? internalGradeEntryForm.errors.classId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="sectionId"
                  value={internalGradeEntryForm.values.sectionId}
                  onChange={filterHandler}
                  menuItems={sectionListResp?.data}
                  valueKey="sectionId"
                  textKey="sectionName"
                  labelText="Section"
                  floatingLabel
                  labelClass="required"
                  inputClassName="bg-light"
            formgroupClassName="mb-0"
                  invalid={(internalGradeEntryForm.touched.sectionId && internalGradeEntryForm.errors.sectionId) ? true : false}
                  error={(internalGradeEntryForm.touched.sectionId && internalGradeEntryForm.errors.sectionId) ? internalGradeEntryForm.errors.sectionId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="termId"
                  labelText="Term Name"
                  labelClass="required"
                  inputClassName="bg-light"
          formgroupClassName="mb-0"
                  value={internalGradeEntryForm.values.termId}
                  onChange={filterHandler}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  floatingLabel
                  invalid={internalGradeEntryForm.touched.termId &&
                    internalGradeEntryForm.errors.termId
                    ? true
                    : false}
                  error={internalGradeEntryForm.touched.termId &&
                    internalGradeEntryForm.errors.termId
                    ? internalGradeEntryForm.errors.termId
                    : ""}
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="subjectId"
                  value={internalGradeEntryForm.values.subjectId}
                  onChange={filterHandler}
                  menuItems={Array.isArray(getSubjectsForInternalMarksEntryResp) ? getSubjectsForInternalMarksEntryResp : []}
                  valueKey="subjectId"
                  textKey="subjectName"
                  labelText="Subject Name"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0"
                  floatingLabel
                  invalid={internalGradeEntryForm.touched.subjectId &&
                    internalGradeEntryForm.errors.subjectId
                    ? true
                    : false}
                  error={internalGradeEntryForm.touched.subjectId &&
                    internalGradeEntryForm.errors.subjectId
                    ? internalGradeEntryForm.errors.subjectId
                    : ""}
                />
              </div>
            </div>
          </div>
          <div className="row px-3 g-3 px-4 pb-3">
            <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 px-0">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                  value={internalGradeEntryForm.values.searchString}
                  onChange={filterHandler}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
            <div className="col-auto ms-auto d-flex align-items-center px-0">
                <button
                  className="btn btn-3 bg-success d-flex justify-content-center align-items-center"
                  type="submit"
                >
                  <div className="d-flex align-items-center text-white">
                  <HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} /> <span>Search</span>
                  </div>
                </button>
              </div>
          </div>
        </form>
        <TableContainer
          columns={columns || []}
          data={studentData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={false}
          onChangeInputHndlr={onChangeTableHndlr}
          onBlurInputHndlr={onBlurTableHndlr}
          rowDataInfo={getCbseInternalSubjectsGradesListResp?.data}
        />
        <div className="row">
          {studentData.length > 0 && <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
            <button
              type="button"
              className={`btn btn-success`}
              disabled={showApiLoader}
              onClick={submitHndlr}
            >
              Submit
            </button>
          </div>}
        </div>
      </div>
    </>
  );
};

export default InternalSubjectsGradesEntry;

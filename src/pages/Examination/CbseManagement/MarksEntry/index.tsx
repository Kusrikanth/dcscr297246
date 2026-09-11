import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { coScholasticSubjects, generateColumns, scholasticSubjects, subjectType, } from "./helper";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSectionList, resetSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { downloadMarksEntryAct, getCoscholasticGradesListAct, getExaminationClassesAct, getExaminationClassSubjectAct, getStudentDetailsAct, saveEntryMarksAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { setExaminationClassesAct, setExaminationClassSubjectAct, setStudentDetailsAct } from "../../../../store/examination/examinationmanagement/examinationmanagementslice";
import * as Yup from "yup"
import { toast } from "react-toastify";
import { getCoscholasticSubjectsListAct, getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { touchTableFieldOnBlur, validateOnChange, validateOnSubmit } from "../../../../utility/validationutility";
import { debounce, downloadExcelFile } from "../../../../utility/commonutility";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import UploadExcelModal from "./UploadExcelModal";
import { useLocation } from "react-router-dom";
import { Download04Icon, Search01Icon, Upload04Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { getSecoundLanguagesList } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  termId: "",
  examinationId: "",
  scholasticType: "",
  coScholasticType: "",
  subjectType: "SCHOLASTIC",
  subjectId: "",
  subjectsHeaderName: "",
  skillArea: "",
  languageId: "",
};



const MarksEntry = () => {

  const dispatch = useAppDispatch();
  const [studentData, setStudentData] = useState<any>([]);
  const { closeModal: closeDownloadMarksEntryModal, modalState: downloadMarksEntryModalState, openModal: openDownloadMarksEntryModal } = useModal()
  const { closeModal: closeUploadModal, modalState: uploadState, openModal: openUploadModal } = useModal();
  const { closeModal: closeResetModal, modalState: resetMarksModalState, openModal: openResetMarksModal } = useModal();
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const location = useLocation();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const classApiCalled = useRef(false);

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    sectionListResp,
    getStudentDetailsResp,
    getExaminationClassesResp,
    getExaminationClassSubjectResp,
    examinationManagementErrorResp,
    saveEntryMarksResp,
    getCoscholasticSubjectsRequestListResp,
    getCoscholasticGradesListResp,
    downloadMarksEntryResp,
    secoundLanguageResp,
    uploadMarksEntryResp,
    getIgseTermNameListResp,
    loggedInUserRole
  } = useAppSelector(
    ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, examinationManagement, examinationSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getStudentDetailsResp: examinationManagement.getStudentDetailsResp,
      getExaminationClassesResp: examinationManagement.getExaminationClassesResp,
      getExaminationClassSubjectResp: examinationManagement.getExaminationClassSubjectResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      saveEntryMarksResp: examinationManagement.saveEntryMarksResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getCoscholasticSubjectsRequestListResp: examinationSettings.getCoscholasticSubjectsRequestListResp,
      getCoscholasticGradesListResp: examinationManagement.getCoscholasticGradesListResp,
      downloadMarksEntryResp: examinationManagement.downloadMarksEntryResp,
      secoundLanguageResp: applicationSale.secoundLanguageResp,
      uploadMarksEntryResp: examinationManagement.uploadMarksEntryResp,
      loggedInUserRole: appData.loggedInUserRole,


    }),
    shallowEqual
  );

  const validationSchema = (context: { pathname: string }) => Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required.").nullable(),
    sectionId: Yup.string().required("Section is required.").nullable(),
    examinationId: Yup.string().required("Examination is required."),
    subjectType: Yup.string().required("Subject Type is required."),
    languageId: Yup.string().when('subjectId', {
      is: (subjectId: string) => {
        const selectedSubjectId = Number(subjectId);
        const selectedSubject = getExaminationClassSubjectResp?.find(
          (item: any) => item.subjectId === selectedSubjectId
        );
        return (
          selectedSubject?.scholasticType === 'LANGUAGE' &&
          (selectedSubject?.languageType === 'SECOND' ||
            selectedSubject?.languageType === 'THIRD')
        );
      },
      then: Yup.string().required('Language is required'),
      otherwise: Yup.string().nullable(),
    }),
    scholasticType: Yup.string().when('subjectType', {
      is: 'SCHOLASTIC',
      then: schema => schema.required("Scholastic Type is required."),
      otherwise: schema => schema.notRequired()
    }),
    coScholasticType: Yup.string().when('subjectType', {
      is: 'COSCHOLASTIC',
      then: schema => schema.required("Co-Scholastic Type is required."),
      otherwise: schema => schema.notRequired()
    }),
    subjectId: Yup.string().required("Subject is required."),
    termId: Yup.string().when([], {
      is: () => location?.pathname === '/igcse-management',
      then: schema => schema.required("Term is required."),
      otherwise: schema => schema.notRequired()
    }),
  });
  const studentValidationSchema = Yup.array()
    .of(
      Yup.object().shape({
        attendance: Yup.string().required("Attendance is required.").nullable(),
        subjectType: Yup.string(),
        marks: Yup.string()
          .nullable()
          .when(["attendance", "subjectType"], {
            is: (attendance: string, subjectType: string) => attendance === "PR" && subjectType === "SCHOLASTIC",
            then: (schema) => schema.required("Marks is required."),
            otherwise: (schema) => schema.notRequired(),
          }),
        coscholasticGradeId: Yup.string().nullable(),
        description: Yup.string().nullable(),
      })
    )
    .test(
      "at-least-one-selected",
      "At least one subject must be selected",
      (subjects) => subjects?.some((subject) => subject.isSelected) || false
    );

  const marksEntryRef = useRef({
    prevSaveEntryMarksResp: saveEntryMarksResp,
    prevExaminationManagementErrorResp: examinationManagementErrorResp,
    prevDownloadMarksEntryResp: downloadMarksEntryResp,
    prevUploadMarksEntryResp: uploadMarksEntryResp,
  })

  useEffect(() => {
    const { prevSaveEntryMarksResp, prevExaminationManagementErrorResp, prevDownloadMarksEntryResp,prevUploadMarksEntryResp } = marksEntryRef.current || {}

    if (saveEntryMarksResp && prevSaveEntryMarksResp !== saveEntryMarksResp) {
      toast.success("Marks Saved Successfully")
      getMarksEntryApiCall()
      closeResetModal()
      setStudentData((prev: any) => prev.map((item: any) => ({ ...item, isSelected: false })))
      setAllStudentSelectedState(false)
    }
    else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {}
      toast.error(details || "Something went wrong")
    }
    else if (downloadMarksEntryResp && prevDownloadMarksEntryResp !== downloadMarksEntryResp) {
      closeDownloadMarksEntryModal()
      toast.success("Marks Downloaded Successfully")
      downloadExcelFile(downloadMarksEntryResp, "ExaminationMarksEntryTemplate")
    }
    else if (uploadMarksEntryResp && prevUploadMarksEntryResp !== uploadMarksEntryResp) {
      closeUploadModal()
      toast.success("Marks Uploaded Successfully")
      getMarksEntryApiCall()
      if (marksEntryForm.values.subjectType === "COSCHOLASTIC") {
        getCoscholasticGradeList({ subjectId: marksEntryForm.values.subjectId, skillAreaId: marksEntryForm.values.skillArea })
      }
    }

    marksEntryRef.current.prevSaveEntryMarksResp = saveEntryMarksResp;
    marksEntryRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
    marksEntryRef.current.prevDownloadMarksEntryResp = downloadMarksEntryResp;
    marksEntryRef.current.prevUploadMarksEntryResp = uploadMarksEntryResp;
  }, [saveEntryMarksResp, examinationManagementErrorResp, downloadMarksEntryResp, uploadMarksEntryResp])

  const marksEntryForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      const { languageId, ...restValues } = values;
      const payload = {
        ...restValues,
        searchString: "",
        ...(shouldShowSkillArea && { languageId }),
      };
      getMarksEntryApiCall(payload);
      marksEntryForm.setFieldValue("searchString", "");
      if (values.subjectType === "COSCHOLASTIC") {
        getCoscholasticGradeList({
          subjectId: values.subjectId,
          skillAreaId: values.skillArea,
        });
      }
    },
  });
  
  const menuOptions = useMemo(
    () => [
      {
        id: "save",
        actionIcon: <button className="btn-sm btn-icon btn btn-outline-success me-3"><i className="ri-check-line fs-24" /></button>,
        actionName: "Save",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id") || '';
          const modalData = studentData?.find((i: any) => +i.studentId === +id);
          if (!modalData.attendance) {
            toast.warning("Please Mark the Attendance");
          }
        },
      },
    ],
    [studentData]
  );

  const getMarksEntryApiCall = (otherProps?: any) => {
    const selectedClassId = marksEntryForm.values.classId;
    const selectedClass = branchClassResp?.content?.find((item: any) => item.id === Number(selectedClassId));    
    const shouldIncludeClassSequence = selectedClass &&
      (selectedClass.classSequence === 14 || selectedClass.classSequence === 15);
    const payload = {
      branchId,
      academicYearId: marksEntryForm.values.academicYearId,
      curriculumId: marksEntryForm.values.curriculumId,
      classId: selectedClassId,
      sectionId: marksEntryForm.values.sectionId,
      searchString: marksEntryForm.values.searchString,
      subjectId: marksEntryForm.values.subjectId,
      examinationId: marksEntryForm.values.examinationId,
      skillAreaId: marksEntryForm.values.skillArea,
      ...(shouldIncludeClassSequence && { classSequence: selectedClass.classSequence }),
      ...otherProps,
    }
    delete payload?.scholasticType;
    delete payload?.coScholasticType;
    delete payload?.subjectsHeaderName;
    delete payload?.subjectType;
    delete payload?.skillArea;
    dispatch(getStudentDetailsAct(generateActionPayload("get_student_details", undefined, payload)));
  }


  const getExaminationClassSubjectApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: marksEntryForm.values.academicYearId,
      curriculumId: marksEntryForm.values.curriculumId,
      classId: marksEntryForm.values.classId,
      sectionId: marksEntryForm.values.sectionId,
      subjectType: marksEntryForm.values.subjectType,
      examinationId: marksEntryForm.values.examinationId,
      scholasticType: marksEntryForm.values.scholasticType,
      coScholasticType: marksEntryForm.values.coScholasticType,
      ...otherProps,
    }
    delete payload?.searchString
    marksEntryForm.values.subjectType === "SCHOLASTIC" ? delete payload?.coScholasticType : delete payload?.scholasticType

    if (payload.examinationId && payload.subjectType && (payload.scholasticType || payload.coScholasticType)) {
      dispatch(getExaminationClassSubjectAct(generateActionPayload("get_examination_class_subjects", undefined, payload)));
    }
  }
  const getExaminationList = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: marksEntryForm.values.academicYearId,
      curriculumId: marksEntryForm.values.curriculumId,
      classId: marksEntryForm.values.classId,
      termId: marksEntryForm.values.termId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    }
    delete payload?.searchString
    dispatch(getExaminationClassesAct(generateActionPayload("get_examination_classes", undefined, payload)));
  }
  const getSkillAreaList = (otherProps?:any) => {
    const payload = {
      branchCurriculumId: marksEntryForm.values.curriculumId, branchId, subjectId : marksEntryForm.values.subjectId , ...otherProps
    };
    dispatch(getCoscholasticSubjectsListAct(generateActionPayload("get_coscholastic_subjects_list", undefined, payload)));
  }

  const getCoscholasticGradeList = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: marksEntryForm.values.academicYearId,
      curriculumId: marksEntryForm.values.curriculumId,
      classId: marksEntryForm.values.classId,
      subjectId: marksEntryForm.values.subjectId,
      skillAreaId: marksEntryForm.values.skillArea,
      ...otherProps
    }
    delete payload?.searchString
    dispatch(getCoscholasticGradesListAct(generateActionPayload("get_coscholastic_grades_list", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: marksEntryForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload1.moduleName = "EXAMINATION";
    }
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, classFilter: "HIGHER", academicYearId: marksEntryForm.values?.academicYearId, curriculumId: marksEntryForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload.moduleName = "EXAMINATION";
    }
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const igseTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: marksEntryForm.values.classId || null, masterAcademicYearId: marksEntryForm.values.academicYearId, curriculumId: marksEntryForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
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
  const getSecondLanguageList = ({ classId, type,subjectId }: { classId: any, type: string, subjectId: any }) => {
    const params = {
      instituteId,
      academicYearId: marksEntryForm.values.academicYearId,
      branchId,
      curriculumId: marksEntryForm.values.curriculumId,
      classId,
      type,
      subjectId,
    };
  
    if (classId && type) {
      dispatch(
        getSecoundLanguagesList(
          generateActionPayload("get_secound_language_list", undefined, params)
        )
      );
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetSectionListAct(undefined))
      dispatch(setStudentDetailsAct(undefined))
    }
  }, []);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/early-years-management": "EY1-EY3",
      "/cbse-management": "CBSE",
      "/igcse-management": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    classApiCalled.current = false;

    marksEntryForm.setValues((prev: any) => ({
      ...prev,
      classId: "",
      sectionId: "",
      termId: "",
      examinationId: "",
      subjectId: "",
      scholasticType: "",
      coScholasticType: "",
      skillArea: "",
      subjectType: "SCHOLASTIC",
      subjectsHeaderName: "",
      languageId: "",
      searchString: "",
    }));

    setStudentData([]);

    if (Array.isArray(data) && data.length > 0 && marksEntryForm.values.academicYearId && !classApiCalled.current) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );
      if (!selectedCurriculum) {
        marksEntryForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: undefined,
        }));
        return;
      }
      const payload: any = {
        branchId,
        academicYearId: marksEntryForm.values.academicYearId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        sortBy: "classSequence",
        classFilter: "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      if (loggedInUserRole === "TEACHER") {
        payload.moduleName = "EXAMINATION";
      }
      dispatch(
        getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload))
      );
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, {branchId, curriculumId: selectedCurriculum.branchCurriculumId})));
      marksEntryForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      classApiCalled.current = true;
    }
  }, [location.pathname, brchCurriculumResp, marksEntryForm.values.academicYearId,]);

  useEffect(() => {
    const yearId = academicYearListResp?.data?.find((year: any) => year.yearStatus?.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      setTimeout(() => {
        marksEntryForm.setFieldValue("academicYearId", yearId);
        getCurriculumApiCall({ academicYearId: yearId });
      }, 0);
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (getStudentDetailsResp && Array.isArray(getStudentDetailsResp)) {
      if (getStudentDetailsResp.length > 0) {
        const subject = getExaminationClassSubjectResp?.find(
          (subject: any) => +subject.subjectId === +marksEntryForm.values.subjectId
        );
        const studentSubjectName = getStudentDetailsResp[0]?.subjectName || subject?.subjectName || "";
        const transformedData = getStudentDetailsResp.map((item: any) => {
          const isNewAttendance = item.attendance == null;
          const isNew = item.marksEntryDetailsId == null;
          return {
            ...item,
            studentSubject: subject,
            isSelected: isNew,
            subjectType: marksEntryForm?.values?.subjectType,
            attendance: isNewAttendance ? (item.attendance ?? "PR") : item.attendance,
            loggedInUserRole: loggedInUserRole,
            touched: {},
            errors: {},
          };
        });
        setStudentData(transformedData);
        marksEntryForm.setValues((prev: any) => ({
          ...prev,
          subjectsHeaderName: studentSubjectName
        }));
      } else {
        setStudentData([]);
        marksEntryForm.setValues((prev: any) => ({
          ...prev,
          subjectsHeaderName: ""
        }));
      }
    }
  }, [getStudentDetailsResp, getExaminationClassSubjectResp]);  

  async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const [indexKey, nameKey] = name.split(".");
    const indexMatch = indexKey.match(/\[(.*?)\]/);
    const index = indexMatch ? Number(indexMatch[1]) : -1;
  
    if (!isNaN(index) && index >= 0) {
      const updatedTermState = [...studentData];
      if (nameKey === "coscholasticGradeId") {
        const selectedGrade = getCoscholasticGradesListResp?.data?.find(
          (grade: any) => grade.id === Number(value)
        );
  
        if (selectedGrade) {
          updatedTermState[index] = {
            ...updatedTermState[index],
            coscholasticGradeId: selectedGrade.id,
            description: selectedGrade.description,
          };
        }
      }
      else if (nameKey === "marks") {
        const maxMarks = updatedTermState[index]?.studentSubject?.maxMarks;
        if ((typeof value === "string") && Number(value) <= maxMarks) {
          updatedTermState[index] = {
            ...updatedTermState[index],
            [nameKey]: value,
          };
  
          if (Number(value) >= 0) {
            updatedTermState[index].errors = {};
          }
        }
      }
      else if (nameKey === "attendance" && marksEntryForm.values.subjectType === "SCHOLASTIC") {
        updatedTermState[index] = {
          ...updatedTermState[index],
          [nameKey]: value,
        };
  
        if (value === "AB") {
          updatedTermState[index].errors = {};
        } else if (value === "PR") {
          updatedTermState[index].errors = {
            ...updatedTermState[index].errors,
            attendance: "",
          };
        }
      }
      else {
        updatedTermState[index] = {
          ...updatedTermState[index],
          [nameKey]: value,
        };
  
        const { items } = await validateOnChange(studentValidationSchema, name, updatedTermState);
        setStudentData(
          items.map((item: any, idx: number) => ({
            ...item,
            isSelected: updatedTermState[idx]?.isSelected || false,
          }))
        );
        return;
      }
  
      setStudentData(updatedTermState);
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

    const studentMarksDTOS = selectedStudent?.map((item: any) => {

      const matchedGrade = getCoscholasticGradesListResp?.data?.find(
        (innerItem: any) => +innerItem.id === +item.coscholasticGradeId
      )?.grade;

      const percentage = Number(item.marks) / Number(item?.studentSubject?.maxMarks) * 100;
      const status = item.attendance === "AB"
        ? "Absent"
        : item.attendance === "AB" && !item.marks || item.marks === 0
          ? "Absent"
          : item.attendance !== "AB" && !item.marks
            ? ""
            : percentage >= item?.studentSubject?.passMarksPercentage
              ? "Pass"
              : "Fail";

      return {
        studentId: item.studentId,
        changeStudentSubjectId: item.newSubjectId,
        ...(item.attendance === "AB"
          ? marksEntryForm.values.subjectType === "SCHOLASTIC"
            ? { attendance: item.attendance, result: status }
            : { attendance: item.attendance }
          : marksEntryForm.values.subjectType === "COSCHOLASTIC"
            ? {
              attendance: item.attendance || "",
              coscholasticGradeId: item.coscholasticGradeId || "",
              grade: matchedGrade || "",
              description: item.description || "",
            }
            : {
              marks: (item.marks)?.toString() || "",
              attendance: item.attendance || "",
              maxMarks: item.studentSubject?.maxMarks,
              passMarks: item.studentSubject?.passMarksPercentage,
              result: status,
            }),
      };

    });

    const payload = {
      branchId,
      academicYearId: marksEntryForm.values.academicYearId,
      curriculumId: marksEntryForm.values.curriculumId,
      classId: marksEntryForm.values.classId,
      sectionId: marksEntryForm.values.sectionId,
      subjectId: marksEntryForm.values.subjectId,
      examinationId: marksEntryForm.values.examinationId,
      languageId: marksEntryForm.values.languageId,
      ...(marksEntryForm.values.subjectType === "COSCHOLASTIC" && {
        skillAreaId: marksEntryForm.values.skillArea,
      }),
      source: "WEB",
      studentMarksDTOS
    }

    if (studentMarksDTOS.length > 0) {
      dispatch(saveEntryMarksAct(generateActionPayload("save_examination_marks", undefined, payload)));
    }
    else {
      toast.warning("Please select at least one student.");
    }
  }

  function search(value: string) {
    const { languageId, ...restValues } = marksEntryForm.values;
  
    const payload = {
      ...restValues,
      searchString: value,
      ...(shouldShowSkillArea && { languageId }),
    };
  
    getMarksEntryApiCall(payload);
  }

  const debounceFun = useCallback(debounce(search, 200), [studentData]);
  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      getClassApiCall({ academicYearId: value, curriculumId: marksEntryForm.values.curriculumId });
      dispatch(resetSectionListAct(undefined))
      marksEntryForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: prev.curriculumId ? prev.curriculumId : "",
        sectionId: null,
        examinationId: null,
        scholasticType: "",
        coScholasticType: "",
        subjectId: "",
        skillArea: "",
      }));
    } 
    else if (name === 'curriculumId') {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "", examinationId: "", scholasticType: "", coScholasticType: "", subjectId: "", skillArea: "",languageId:"" }));
      dispatch(setExaminationClassesAct(undefined))
      dispatch(setExaminationClassSubjectAct(undefined))
      dispatch(resetSectionListAct(undefined))

      if (!value) {
        dispatch(resetBrchClassAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: marksEntryForm.values.academicYearId });
        igseTermList(value);
      }
    }
    else if (name === 'classId') {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "", examinationId: "", subjectId: "", scholasticType: "", coScholasticType: "", skillArea: "", languageId:"" }));
      dispatch(setExaminationClassSubjectAct(undefined))
      getExaminationList({ classId: value })
      if (!value) {
        dispatch(resetSectionListAct(undefined))
      } else {
        getSectionListResp({ branchClassId: value })
      }
    } else if (name === "termId") {
      marksEntryForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        examinationId: "",
        subjectId: "",
        scholasticType: "",
        coScholasticType: "",
        skillArea: ""
      }));

      if (value) {
        getExaminationList({ termId: value });
      } else {
        dispatch(setExaminationClassesAct(undefined));
      }
    } else if (name === "subjectId") {
      const selectedSubject = getExaminationClassSubjectResp?.find(
        (item: any) => item.subjectId === Number(value)
      );
      marksEntryForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        skillArea: "",
        languageId: "",
      }));
      getSkillAreaList({ subjectId: value });
      if (
        selectedSubject?.scholasticType === "LANGUAGE" &&
        (selectedSubject?.languageType === "SECOND" ||
          selectedSubject?.languageType === "THIRD")
      ) {
        getSecondLanguageList({
          classId: marksEntryForm.values.classId,
          type: selectedSubject.languageType,
          subjectId: value,
        });
      }
    }
    else if (name === "searchString") {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
    else if (name === "subjectType") {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, scholasticType: "", coScholasticType: "", subjectId: "", skillArea: "", languageId:"" }))
      dispatch(setExaminationClassSubjectAct(undefined))
      if (!value) {
        dispatch(setExaminationClassSubjectAct(undefined))
      }
    }
    else if (name === "scholasticType") {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "", skillArea: "", languageId:"" }))
      getExaminationClassSubjectApiCall({ [name]: value })
      if (!value) {
        dispatch(setExaminationClassSubjectAct(undefined))
      }
    }
    else if (name === "coScholasticType") {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "", skillArea: "", languageId:"" }))
      getExaminationClassSubjectApiCall({ [name]: value })
      if (!value) {
        dispatch(setExaminationClassSubjectAct(undefined))
      }
    }
    else if (name === "examinationId") {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "", skillArea: "", languageId:"" }))
      getExaminationClassSubjectApiCall({ [name]: value })
      if (!value) {
        dispatch(setExaminationClassSubjectAct(undefined))
      }
    }
    else if (name === "subjectId") {
      getSkillAreaList({subjectId : value})
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value, skillArea: "", languageId:"" }))
    }
    else {
      marksEntryForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }
  
  useEffect(() => {
    if (marksEntryForm.values.curriculumId || marksEntryForm.values.classId || marksEntryForm.values.sectionId) {
      setStudentData({ curriculumId: marksEntryForm.values.curriculumId });
    }
  }, [marksEntryForm.values.curriculumId, marksEntryForm.values.classId, marksEntryForm.values.sectionId]);
  
  const handleDownload = async () => {
    const errors: any = await marksEntryForm.validateForm();
    if (Object.keys(errors).length > 0) {
      marksEntryForm.setTouched(errors);
      return;
    }
    openDownloadMarksEntryModal();
  };
  const handleUpload = async () => {
    const errors: any = await marksEntryForm.validateForm();
    if (Object.keys(errors).length > 0) {
      marksEntryForm.setTouched(errors);
      return;
    }
    openUploadModal();
  };

  const confirmDonloadMarksEntryHndler = () => {
    const { academicYearId, curriculumId, classId, sectionId, examinationId, subjectType, languageId, scholasticType, subjectId, coScholasticType, skillArea } = marksEntryForm.values
    const selectedClassId = marksEntryForm.values.classId;
    const selectedClass = branchClassResp?.content?.find((item: any) => item.id === Number(selectedClassId));
    const shouldIncludeClassSequence = selectedClass &&
      (selectedClass.classSequence === 14 || selectedClass.classSequence === 15);
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      classId,
      sectionId,
      examinationId,
      subjectType,
      ...(shouldIncludeClassSequence && { classSequence: selectedClass.classSequence }),
      ...(shouldShowSkillArea ? { languageId } : {}),
      ...(subjectType === "SCHOLASTIC" ? { scholasticType } : { coScholasticType }),
      subjectId,
      ...(subjectType === "COSCHOLASTIC" && { skillArea })
    }
    dispatch(downloadMarksEntryAct(generateActionPayload("download_marks_entry", undefined, payload, {
      responseType: 'blob'
    })));
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
  const handleResetMarks = () => {
    const selectedStudentsToReset = studentData
      .filter((student: any) => {
        return student.isSelected && student.marks !== null && student.marks !== '';
      })
      .map((student: any) => ({
        studentId: student.studentId,
        marks: student.marks,
        maxMarks: student.maxMarks,
        passMarks: student.passMarks,
        result: student.result,
        changeStudentSubjectId: student.changeStudentSubjectId,
        isMarksReset: true,
      }));
    if (selectedStudentsToReset.length === 0) {
      toast.warning("No students with existing marks selected for reset.");
      return;
    }

    const payload = {
      branchId,
       academicYearId: marksEntryForm.values.academicYearId,
      curriculumId: marksEntryForm.values.curriculumId,
      classId: marksEntryForm.values.classId,
      sectionId: marksEntryForm.values.sectionId,
      subjectId: marksEntryForm.values.subjectId,
      examinationId: marksEntryForm.values.examinationId,
      ...(marksEntryForm.values.subjectType === "COSCHOLASTIC" && {
        skillAreaId: marksEntryForm.values.skillArea,
      }),
      studentMarksDTOS: selectedStudentsToReset,
    };

    dispatch(saveEntryMarksAct(generateActionPayload("save_examination_marks", undefined, payload)));
  };

  const selectedSubjectId = Number(marksEntryForm.values.subjectId);

  const selectedSubject = getExaminationClassSubjectResp?.find(
    (item: any) => item.subjectId === selectedSubjectId
  );
  
  const shouldShowSkillArea =
    selectedSubject?.scholasticType === 'LANGUAGE' &&
    (selectedSubject?.languageType === 'SECOND' ||
      selectedSubject?.languageType === 'THIRD');

  const shouldShowResetButton = Array.isArray(studentData) && studentData.some(
    (student: any) => student.isSelected && student.marks !== null && student.marks !== ''
  ) && loggedInUserRole !== "TEACHER";

  const columns = useMemo(() => generateColumns(marksEntryForm.values.subjectsHeaderName, menuOptions, marksEntryForm.values.subjectType, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr), [studentData, marksEntryForm.values.subjectsHeaderName, getStudentDetailsResp, getExaminationClassSubjectResp, marksEntryForm.values.subjectType]);

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { data: secoundLanguageList } = secoundLanguageResp || {};

  return (
    <>
      <div className="card d-inline-block w-100">
        <div className="bg-light m-3 py-2 rounded">
          <div className="row px-3 pt-3 pb-2 pt-lg-0 g-3 examination">
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="academicYearId"
                value={marksEntryForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.academicYearId && marksEntryForm.errors.academicYearId) ? true : false}
                error={(marksEntryForm.touched.academicYearId && marksEntryForm.errors.academicYearId) ? marksEntryForm.errors.academicYearId : ""}
              />
            </div>

            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="curriculumId"
                value={marksEntryForm.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                isDisabled={true}
                invalid={(marksEntryForm.touched.curriculumId && marksEntryForm.errors.curriculumId) ? true : false}
                error={(marksEntryForm.touched.curriculumId && marksEntryForm.errors.curriculumId) ? marksEntryForm.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="classId"
                value={marksEntryForm.values.classId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.classId && marksEntryForm.errors.classId) ? true : false}
                error={(marksEntryForm.touched.classId && marksEntryForm.errors.classId) ? marksEntryForm.errors.classId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="sectionId"
                value={marksEntryForm.values.sectionId}
                onChange={filterHandler}
                menuItems={sectionListResp?.data}
                valueKey="sectionId"
                textKey="sectionName"
                labelText="Section"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.sectionId && marksEntryForm.errors.sectionId) ? true : false}
                error={(marksEntryForm.touched.sectionId && marksEntryForm.errors.sectionId) ? marksEntryForm.errors.sectionId : ""}
              />
            </div>
            {location.pathname === '/igcse-management' && (
              <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 mt-xl-3 col-xl-2">
                <SelectInput
                  name="termId"
                  value={marksEntryForm.values.termId}
                  onChange={filterHandler}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  labelText='Term Name'
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0 mt-lg-3"
                  floatingLabel
                  invalid={(marksEntryForm.touched.termId && marksEntryForm.errors.termId) ? true : false}
                  error={(marksEntryForm.touched.termId && marksEntryForm.errors.termId) ? marksEntryForm.errors.termId : ""}
                />
              </div>
                )}
            <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 mt-xl-3 col-xl-2">
              <SelectInput
                name="examinationId"
                value={marksEntryForm.values.examinationId}
                onChange={filterHandler}
                menuItems={getExaminationClassesResp?.content}
                valueKey="examinationId"
                textKey="examinationName"
                labelText="Examination"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.examinationId && marksEntryForm.errors.examinationId) ? true : false}
                error={(marksEntryForm.touched.examinationId && marksEntryForm.errors.examinationId) ? marksEntryForm.errors.examinationId : ""}
              />
            </div>

            <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0  mt-xl-3 col-xl-2">
              <SelectInput
                name="subjectType"
                value={marksEntryForm.values.subjectType}
                onChange={filterHandler}
                menuItems={subjectType}
                valueKey="id"
                textKey="name"
                defaultSelect="Scholastic"
                defaultValue="SCHOLASTIC"
                labelText="Subject Type"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName={
                  location.pathname === "/cbse-management"
                    ? "mb-0 mt-lg-3"
                    : "mb-0"
                }
                floatingLabel
                invalid={(marksEntryForm.touched.subjectType && marksEntryForm.errors.subjectType) ? true : false}
                error={(marksEntryForm.touched.subjectType && marksEntryForm.errors.subjectType) ? marksEntryForm.errors.subjectType : ""}
              />
            </div>

            {marksEntryForm.values.subjectType === "COSCHOLASTIC" ? <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
              <SelectInput
                name="coScholasticType"
                labelText="Co-Scholastic Type"
                value={marksEntryForm.values.coScholasticType}
                onChange={filterHandler}
                menuItems={coScholasticSubjects}
                valueKey="id"
                textKey="name"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.coScholasticType && marksEntryForm.errors.coScholasticType) ? true : false}
                error={(marksEntryForm.touched.coScholasticType && marksEntryForm.errors.coScholasticType) ? marksEntryForm.errors.coScholasticType : ""}
              />
            </div>
              :
              <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
                <SelectInput
                  name="scholasticType"
                  labelText="Scholastic Type"
                  value={marksEntryForm.values.scholasticType}
                  onChange={filterHandler}
                  menuItems={scholasticSubjects}
                  valueKey="id"
                  textKey="name"
                  labelClass="required"
                  inputClassName="bg-light"
                  formgroupClassName="mb-0 mt-lg-3"
                  floatingLabel
                  invalid={(marksEntryForm.touched.scholasticType && marksEntryForm.errors.scholasticType) ? true : false}
                  error={(marksEntryForm.touched.scholasticType && marksEntryForm.errors.scholasticType) ? marksEntryForm.errors.scholasticType : ""}
                />
              </div>
            }
            <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
              <SelectInput
                name="subjectId"
                value={marksEntryForm.values.subjectId}
                onChange={filterHandler}
                menuItems={getExaminationClassSubjectResp}
                valueKey="subjectId"
                textKey="subjectName"
                labelText="Subject Name"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.subjectId && marksEntryForm.errors.subjectId) ? true : false}
                error={(marksEntryForm.touched.subjectId && marksEntryForm.errors.subjectId) ? marksEntryForm.errors.subjectId : ""}
              />
            </div>
            {marksEntryForm.values.subjectType === "COSCHOLASTIC" && <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
              <SelectInput
                name="skillArea"
                value={marksEntryForm.values.skillArea}
                onChange={marksEntryForm.handleChange}
                menuItems={getCoscholasticSubjectsRequestListResp}
                valueKey="skillId"
                textKey="skillName"
                labelText="Skill Area"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.skillArea && marksEntryForm.errors.skillArea) ? true : false}
                error={(marksEntryForm.touched.skillArea && marksEntryForm.errors.skillArea) ? marksEntryForm.errors.skillArea : ""}
              />
            </div>}
            {shouldShowSkillArea && ( <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
              <SelectInput
                name="languageId"
                value={marksEntryForm.values.languageId}
                onChange={marksEntryForm.handleChange}
                menuItems={secoundLanguageList}
                valueKey="languageId"
                textKey="languageName"
                labelText="Language"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0 mt-lg-3"
                floatingLabel
                invalid={(marksEntryForm.touched.languageId && marksEntryForm.errors.languageId) ? true : false}
                error={(marksEntryForm.touched.languageId && marksEntryForm.errors.languageId) ? marksEntryForm.errors.languageId : ""}
              />
            </div>)}
            <div className="col-auto me-auto d-flex align-items-start">
              <button disabled={showApiLoader} type="button" onClick={(event: any) => marksEntryForm.handleSubmit(event)} className="btn btn-success float-end d-flex justify-content-center align-items-center"><HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} />Search</button>
            </div>
          </div>

        </div>
        <div className="row px-3 g-3 pt-2 mb-0">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 mt-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
                value={marksEntryForm.values.searchString}
                onChange={filterHandler}
                formgroupClassName="mb-0"
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          {studentData?.length > 0 && (
          <div className="col-auto ms-auto mt-2">
              {shouldShowResetButton && (
                <button
                  className="btn btn-3 me-2 btn-light"
                  onClick={() => openResetMarksModal()}
                >
                  Reset
                </button>
              )}
            <button
              className="btn btn-3 me-2 text-white"
              style={{ background: "#405189", border: "none" }}
              onClick={handleDownload}
            > <HugeiconsIcon icon={Download04Icon} className="me-2 text-white" size={18} />Download Template 
            </button>
            <button
              className="btn btn-3 btn-success"
            onClick={handleUpload}
            >
              <div className="d-flex align-items-center text-white">
              <HugeiconsIcon icon={Upload04Icon} className="me-2 text-white" size={18} /> <span>Upload</span>
              </div>
            </button>
          </div>
          )}
        </div>
        <div className='row px-3'>
          <div className='col-auto pe-3 ms-auto'>
            <p className="text-muted my-1">
            Present - PR, Absent - ABS, Medical leave- ML, Permitted Absent - PA
            </p>
          </div>
        </div>
        <TableContainer
          columns={columns || []}
          data={Array.isArray(studentData) ? studentData : []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={false}
          onChangeInputHndlr={onChangeTableHndlr}
          onBlurInputHndlr={onBlurTableHndlr}
          rowDataInfo={getCoscholasticGradesListResp?.data}

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

      <ModalContainerUpdated
        id="export-section-modal"
        isOpen={downloadMarksEntryModalState.showModal}
        toggle={closeDownloadMarksEntryModal}
        modalTitle="Download Template Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={downloadMarksEntryModalState.showModal}
          toggle={closeDownloadMarksEntryModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={confirmDonloadMarksEntryHndler}
          feature="examination"
          subFeature="examination_marks_entry_download"
          remarksText="Enter remarks to export marks entry data?"
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="bulk-upload-modal"
        isOpen={uploadState.showModal}
        toggle={closeUploadModal}
        modalTitle="Bulk Marks Upload Modal"
        modalSize="md"
      >
        <UploadExcelModal
          toggle={closeUploadModal}
          marksEntryForm={marksEntryForm}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="reset-marks-modal"
        isOpen={resetMarksModalState.showModal}
        toggle={closeResetModal}
        modalTitle="Reset Marks"
        modalSize="md"
      >
        <ExportModal
          isOpen={resetMarksModalState.showModal}
          toggle={closeResetModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={handleResetMarks}
          feature="examination"
          subFeature="examination_marks_entry_reset"
          remarksText="Enter Reason to reset marks?"
          showEnterRemarks={true}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default MarksEntry;

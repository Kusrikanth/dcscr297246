import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TableExpandable, TextInput } from "../../../../Components/Common";
import { generateColumnsModel } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {getStudentRemarksDescriptionAct, getStudentRemarksDetailsAct, saveStudentRemarksDetailsAct, setStudentRemarksAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { getSectionList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { touchTableFieldOnBlur, validateOnChange, validateOnSubmit } from "../../../../utility/validationutility";
import * as Yup from "yup";
import { getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { setExaminationClassesAct, setExaminationClassSubjectAct } from "../../../../store/examination/examinationmanagement/examinationmanagementslice";
import { debounce } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons-pro/core-stroke-standard";
import { setIgseTermDetailsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsslice";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  termId: ""
};

const subjectsValidationSchema = Yup.array().of(
  Yup.object().shape({
    remarkContextId: Yup.string().nullable(),
    remarks: Yup.string()
      .required()
      .required("Remarks are required.").nullable(),

  })
);

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classId: Yup.string().required("Class is required.").nullable(),
  sectionId: Yup.string().required("Section is required.").nullable(),
  termId: Yup.string().required("Term is required."),
});

const StudentRemarks = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [allStockSelectedState, setAllStockSelectedState] = useState<boolean>(false);
  const [studentListData, setSubjectsListData] = useState<any[]>([]);

  const isEy = location.pathname.includes("/early-years-management");
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const studentRemarksList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...examinationNameForm.values,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getStudentRemarksDetailsAct(generateActionPayload("get_student_remarks", undefined, payload)));
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
  const remarksDescriptionList = () => {
    dispatch(getStudentRemarksDescriptionAct(generateActionPayload("get_student_remarks_description", undefined)));
  };

  const examinationNameForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        academicYearId: values.academicYearId || "",
        curriculumId: values.curriculumId || "",
        classId: values.classId || "",
        sectionId: values.sectionId || "",
        searchString: values.searchString || "",
        termId: values.termId || "",
      };
      studentRemarksList(payload);
    },
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    sectionListResp,
    showApiLoader,
    getStudentRemarksListResp,
    saveStudentRemarksResp,
    getStudentRemarksDescriptionListResp,
    getIgseTermNameListResp,
    examinationManagementErrorResp,
    loggedInUserRole
  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationSettings, classroomManagmentInfo, examinationManagement, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getStudentRemarksListResp: examinationManagement.getStudentRemarksListResp,
      saveStudentRemarksResp: examinationManagement.saveStudentRemarksResp,
      getStudentRemarksDescriptionListResp: examinationManagement.getStudentRemarksDescriptionListResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      loggedInUserRole: appData.loggedInUserRole,
    }),
    shallowEqual
  );

  const studentRemarksRef = useRef({
    prevAddStudentRemarks: saveStudentRemarksResp,
    prevStudentRemarksErrorResp: examinationManagementErrorResp,
  })

  useEffect(() => {
    const { prevAddStudentRemarks, prevStudentRemarksErrorResp } = studentRemarksRef.current;
    if (saveStudentRemarksResp && prevAddStudentRemarks !== saveStudentRemarksResp) {
      toast.success("Student Remarks added successfully.");
      studentRemarksList()
    }
    else if (examinationManagementErrorResp && prevStudentRemarksErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    studentRemarksRef.current.prevAddStudentRemarks = saveStudentRemarksResp;
    studentRemarksRef.current.prevStudentRemarksErrorResp = examinationManagementErrorResp;
  }, [saveStudentRemarksResp, examinationManagementErrorResp]);

  useEffect(() => {
    if (getStudentRemarksListResp) {
      setSubjectsListData(getStudentRemarksListResp);
    } else {
      setSubjectsListData([]);
    }
  }, [getStudentRemarksListResp]);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    examinationNameForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
    const payload1: any = { academicYearId: yearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    if (loggedInUserRole === "TEACHER") {
      payload1.moduleName = "EXAMINATION";
    }
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }, [academicYearListResp]);

  const classApiCalled = useRef(false);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/early-years-management": "EY1-EY3",
      "/cbse-management": "CBSE",
      "/igcse-management": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (Array.isArray(data) && data.length > 0 && examinationNameForm.values.academicYearId && !classApiCalled.current) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );
      if (!selectedCurriculum) {
        examinationNameForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: undefined,
        }));
        return;
      }
      const payload: any = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: examinationNameForm.values.academicYearId,
        sortBy: "classSequence",
        classFilter: isEy ? "EARLY" : "HIGHER",
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
      examinationNameForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, {branchId, curriculumId: selectedCurriculum.branchCurriculumId})));
      classApiCalled.current = true;
    }
  }, [brchCurriculumResp, examinationNameForm.values.academicYearId]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: examinationNameForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload1.moduleName = "EXAMINATION";
    }
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, classFilter: isEy ? "EARLY" : "HIGHER", academicYearId: examinationNameForm.values?.academicYearId, curriculumId: examinationNameForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload.moduleName = "EXAMINATION";
    }
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: examinationNameForm.values.classId || null, masterAcademicYearId: examinationNameForm.values.academicYearId, curriculumId: examinationNameForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
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

  function search(value: string) {
    studentRemarksList({ ...examinationNameForm.values, searchString: value });
  }
  const debounceFun = useCallback(debounce(search, 200), [studentListData]);
  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      examinationNameForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: prev.curriculumId ? prev.curriculumId : "",
        sectionId: null
      }));
      if (examinationNameForm.values.curriculumId) {
        getClassApiCall({ curriculumId: examinationNameForm.values.curriculumId, academicYearId: value });
      }
    }
    else if (name === 'curriculumId') {
      examinationNameForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "", }));
      dispatch(setExaminationClassesAct(undefined))
      dispatch(setExaminationClassSubjectAct(undefined))
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
        dispatch(setIgseTermDetailsListAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: examinationNameForm.values.academicYearId });
        examinationTermList(value);
      }
    }
    else if (name === 'classId') {
      examinationNameForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "", }));
      dispatch(setExaminationClassSubjectAct(undefined))
      if (value) {
        getSectionListResp({ branchClassId: value })
      }
    }
    else if (name === "searchString") {
      examinationNameForm.setValues((prev: any) => ({
        ...prev,
        [name]: value
      }));

      debounceFun(value);
    }
    else {
      examinationNameForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  useEffect(() => {
    remarksDescriptionList();
    return () => {
      dispatch(setStudentRemarksAct(undefined))
    }
  }, []);

  async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      const indexMatch = indexKey.match(/\[(.*?)\]/) || "";
      const index = Number(indexMatch[1]);
      if (!isNaN(index)) {
        const updatedTermState = [...studentListData];
        updatedTermState[index] = {
          ...updatedTermState[index],
          [nameKey]: value,
        };
        if (nameKey === "remarkContextId") {
          const selectedRemark = getStudentRemarksDescriptionListResp.find(
            (item: { remarkContextId: number }) => item.remarkContextId === Number(value)
          );
          updatedTermState[index].remarks = selectedRemark ? selectedRemark.content : "";
        }
        const { items } = await validateOnChange(subjectsValidationSchema, name, updatedTermState);
        setSubjectsListData(
          items.map((item: any, idx: number) => ({
            ...item,
            isSelected: studentListData[idx]?.isSelected || false,
          }))
        );
        return;
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
        const updatedSubjectsListData = [...studentListData];
        updatedSubjectsListData[index] = {
          ...updatedSubjectsListData[index],
          [nameKey]: value,
        };
        try {
          await subjectsValidationSchema.validateAt(`[${index}].${nameKey}`, updatedSubjectsListData);
        } catch (error) {
          console.error(error);
        }
        const studentListDataTouched = await touchTableFieldOnBlur(index, nameKey, updatedSubjectsListData);
        setSubjectsListData(
          studentListDataTouched.map((subject: any, idx: any) => ({
            ...subject,
            isSelected: studentListData[idx]?.isSelected || false,
          }))
        );
      }
    }
  }

  const submitHndlr = async () => {
    const selectedStudents = studentListData.filter((student: any) => student.isSelected);
    if (!selectedStudents.length) {
      toast.warning("Please select at least one student.");
      return;
    }
    const { items, isValid: isStudentStateValid } = await validateOnSubmit(
      subjectsValidationSchema,
      selectedStudents
    );
    if (!isStudentStateValid) {
      setSubjectsListData((prev: any) =>
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
    const selectedRemarksData = studentListData
      .filter((student) => student.isSelected)
      .map((student) => ({
        id : student.id,
        studentDetailId: student.studentId,
        studentCode: student.studentCode || "",
        remarks: student.remarks,
        remarkId: student.remarkContextId,
      }));

    const payload = {
      instituteId,
      branchId,
      branchCurriculumId: examinationNameForm.values.curriculumId,
      branchClassId: examinationNameForm.values.classId,
      academicYearId: examinationNameForm.values.academicYearId,
      sectionId: examinationNameForm.values.sectionId,
      termId: examinationNameForm.values.termId,
      studentRemarksDtoList: selectedRemarksData,
    };

    dispatch(
      saveStudentRemarksDetailsAct(
        generateActionPayload("save_student_remarks", undefined, payload)
      )
    );
  };

  const allStockCheckHndlr = () => {
    setAllStockSelectedState((prevState) => {
      const newState = !prevState;
      setSubjectsListData((prevBooks) =>
        prevBooks.map((subject) => ({
          ...subject,
          isSelected: newState,
        }))
      );
      return newState;
    });
  };

  const singleStockCheckHndlr = (studentId?: number) => {
    setSubjectsListData((prevSubjects) =>
      prevSubjects.map((subject) =>
        subject.studentId === studentId
          ? { ...subject, isSelected: !subject.isSelected }
          : subject
      )
    );
  };

  const columns = useMemo(() => generateColumnsModel(allStockCheckHndlr, singleStockCheckHndlr, allStockSelectedState,), [studentListData]);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="card d-inline-block w-100">
        <div className="bg-light m-3 pt-1 rounded">
          <div className="row p-3 g-3 examination">
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="academicYearId"
                value={examinationNameForm.values.academicYearId}
                onChange={onChangeFilterHndlr}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="mb-2 mb-xl-0"
                labelText="Academic Year"
                labelClass="required"
                inputClassName="bg-light"
                floatingLabel
                invalid={(examinationNameForm.touched.academicYearId && examinationNameForm.errors.academicYearId) ? true : false}
                error={(examinationNameForm.touched.academicYearId && examinationNameForm.errors.academicYearId) ? examinationNameForm.errors.academicYearId : ""}
              />
            </div>

            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="curriculumId"
                value={examinationNameForm.values.curriculumId}
                onChange={onChangeFilterHndlr}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                formgroupClassName="mb-2 mb-xl-0"
                labelClass="required"
                inputClassName="bg-light"
                floatingLabel
                isDisabled={!isEy}
                invalid={(examinationNameForm.touched.curriculumId && examinationNameForm.errors.curriculumId) ? true : false}
                error={(examinationNameForm.touched.curriculumId && examinationNameForm.errors.curriculumId) ? examinationNameForm.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="classId"
                value={examinationNameForm.values.classId}
                onChange={onChangeFilterHndlr}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-2 mb-xl-0"
                floatingLabel
                invalid={(examinationNameForm.touched.classId && examinationNameForm.errors.classId) ? true : false}
                error={(examinationNameForm.touched.classId && examinationNameForm.errors.classId) ? examinationNameForm.errors.classId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="sectionId"
                value={examinationNameForm.values.sectionId}
                onChange={onChangeFilterHndlr}
                menuItems={sectionListResp?.data}
                valueKey="sectionId"
                textKey="sectionName"
                labelText="Section"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-2 mb-xl-0"
                floatingLabel
                invalid={(examinationNameForm.touched.sectionId && examinationNameForm.errors.sectionId) ? true : false}
                error={(examinationNameForm.touched.sectionId && examinationNameForm.errors.sectionId) ? examinationNameForm.errors.sectionId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="termId"
                value={examinationNameForm.values.termId}
                onChange={onChangeFilterHndlr}
                menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                valueKey="termId"
                textKey="termName"
                formgroupClassName="mb-2 mb-xl-0"
                labelText='Term Name'
                labelClass="required"
                inputClassName="bg-light"
                floatingLabel
                invalid={(examinationNameForm.touched.termId && examinationNameForm.errors.termId) ? true : false}
                error={(examinationNameForm.touched.termId && examinationNameForm.errors.termId) ? examinationNameForm.errors.termId : ""}
              />
            </div>
            <div className="col-auto ms-auto d-flex align-items-center">
              <button disabled={showApiLoader} type="button" onClick={(event: any) => examinationNameForm.handleSubmit(event)} className="btn float-end text-white d-flex justify-content-center align-items-center" style={{ background: "#405189", border: "none" }}><HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} />Search</button>
            </div>
          </div>

        </div>
        <div className="row px-3 g-3 pt-2 mb-md-2 mb-0">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 mt-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
                formgroupClassName="mb-2"
                value={examinationNameForm.values.searchString}
                onChange={onChangeFilterHndlr}
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
        </div>
        <TableExpandable
          columns={columns || []}
          data={Array.isArray(studentListData) ? studentListData : []}
          tableClass="mb-3 mb-xl-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          onChangeInputHndlr={onChangeTableHndlr}
          onBlurInputHndlr={onBlurTableHndlr}
          showCheckbox={false}
          rowDataInfo={getStudentRemarksDescriptionListResp}
          showPagination={false}
        />
        <div className="row px-3 mb-3">
          <div className="col-auto ms-auto">
            <button
              type="button"
              className={`btn btn-success`}
              disabled={showApiLoader}
              onClick={submitHndlr}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRemarks;

import React, { useEffect, useState } from "react";
import {
  AutoSearchInput,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import { ChangeCurriculumModalProps } from "./ChangeCurriculumTypes";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import {
  ChangeCurriculumModalFormType,
} from "./ChangeCurriculumTypes";

import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { RaiseChangeCurriculumReq, getClassList, getCurriculumList, getCurriculumStudentListResp, resetCurriculumStudentList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import * as Yup from 'yup';
import Button from "../../../Components/Common/Button";

const initialValues: ChangeCurriculumModalFormType = {
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
  studentId: "",
  changeCuriculumId: "",
  changeClassId: "",
};

const ChangeCurriculumModal = (props: ChangeCurriculumModalProps) => {  
  const dispatch = useDispatch();
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const [changeCurriculumModalState, setChangeCurriculumModalState] =
    useState<ChangeCurriculumModalFormType>(initialValues);
  const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
    branchClassId: Yup.string().required("Class is required"),
    studentId: Yup.string().required("Student is required"),
    changeCuriculumId: Yup.string().test("", "Change Curriculum is not the same as Curriculum",
    (value: any, schema: any) => {
        if (value && ((value === schema.parent?.curriculumId))) {
            return false
        }
        return true;
    }).required("Change Curiculum is required"),
    changeClassId: Yup.string().test("", "Change Class is not the same as Class",
    (value: any, schema: any) => {
        if (value && ((value === schema.parent?.branchClassId))) {
            return false
        }
        return true;
    }).required("Change Class is required"),
  });
  const ChangeCurriculumFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: changeCurriculumModalState,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        academicYearId: values.academicYearId,
        studentId: values.studentId,
        newClassId: values.changeClassId,
        newCurriculumId: values.changeCuriculumId
      }
      dispatch(RaiseChangeCurriculumReq(generateActionPayload('raise_change_curriculum_req', undefined, payload)))
    },
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    getCurriculumStudentList,
    classList,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader
  } = useAppSelector(
    ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getCurriculumStudentList: classroomManagmentInfo.getCurriculumStudentList,
      classList: classroomManagmentInfo.classList,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: ChangeCurriculumFilterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: any) => {
    ChangeCurriculumFilterForm.handleChange(event);
    const { name, value } = event.target;
    if (name === "academicYearId") {
      ChangeCurriculumFilterForm.setFieldValue("curriculumId","");
      ChangeCurriculumFilterForm.setFieldValue("classId","");
      getCurriculumApiCall({academicYearId : value})
    }
    else if (name === "studentId") {
      let data = getCurriculumStudentList && getCurriculumStudentList.find((student: any) => student.studentId === +value);
      ChangeCurriculumFilterForm.setFieldValue('curriculum', data.studentCurriculumName);
      ChangeCurriculumFilterForm.setFieldValue('class', data.studentClassName);
    }
    else if (name === "curriculumId") {
      ChangeCurriculumFilterForm.setFieldValue("classId","");
      const payload = { branchId: branchId,academicYearId : ChangeCurriculumFilterForm.values.academicYearId, curriculumId: value, pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    else if (name === "changeCuriculumId") {
      const payload = { branchId: branchId,academicYearId : ChangeCurriculumFilterForm.values.academicYearId, curriculumId: value, pageNo: 0, pageSize: 100 };
      dispatch(getClassList(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
  }

  function onInputSearchChange(inputString: any) {
    // dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
    //   branchId, academicYearId: filterState.academicYearId,
    //   studentName: inputString || "a"
    // })));
    let params = {
      academicYearId: ChangeCurriculumFilterForm.values.academicYearId,
      curriculumId: ChangeCurriculumFilterForm.values.curriculumId,
      classId: ChangeCurriculumFilterForm.values.branchClassId,
      searchString: inputString,
      branchId: branchId
    }
    if(params.academicYearId&&params.curriculumId&&params.classId){
      dispatch(getCurriculumStudentListResp(generateActionPayload('get_curriculum_student_list_res', undefined, params)))
    }
  }

  function selectedStudentHndlr(selectedStudent: any) {
    ChangeCurriculumFilterForm.setValues((prev: any) => ({ ...prev, studentId: selectedStudent.studentId }))
    setSearchStudentState(selectedStudent);
    // const payload1 = { branchId: branchId, curriculumId: selectedStudent.studentCurriculumId, classId: selectedStudent.studentClassId, sortBy: "streamGroupName", orderBy: "asc" }
    //   dispatch(
    //     getStreamList(
    //       generateActionPayload("get_stream_list", undefined, payload1)
    //     )
    //   );

    //Resest page number to 0 if filters are applied
    // paginationDetailRef.current.pageNo = 0;
    // if (selectedStudent) {
    //     const { id } = selectedStudent;
    // setFilterState((prevState: any) => ({ ...prevState, studentIds: id, }));
    // getStudentsApiCall({ studentIds: id });
    // setShowClearFilterState(true);
    // } 
    // else {
    //     const { studentIds, academicYearId, ...otherFilter } = filterState;
    //     const filterValues = Object.values(otherFilter);
    //     const anyFilterValue = filterValues.some(item => !!item);
    //     if (!anyFilterValue) {
    //         setShowClearFilterState(false);
    //     }
    //     setFilterState((prevState: any) => ({ ...prevState, studentIds: "" }));
    //     getStudentsApiCall({ studentIds: "" });
    // }
  }

  useEffect(() => {
    if (!props.isOpen) {
      ChangeCurriculumFilterForm.resetForm();
      dispatch(resetCurriculumStudentList(undefined));
      setSearchStudentState(null)
    }
  }, [props.isOpen])
  useEffect(() => {
    if(!props.directory){
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
      ChangeCurriculumFilterForm.setFieldValue('academicYearId',yearId)
      getCurriculumApiCall({ academicYearId: yearId, })
    }
  }, [academicYearListResp])

  useEffect(()=>{
      if(props.directory){
        const academicYearId = props.editChangeCurriculumDetails?.academicYearId
        const curriculumId = props.editChangeCurriculumDetails?.curriculumId
        const branchClassId = props.editChangeCurriculumDetails?.classId
        ChangeCurriculumFilterForm.setFieldValue('academicYearId',academicYearId)
        ChangeCurriculumFilterForm.setFieldValue('curriculumId',curriculumId)
        ChangeCurriculumFilterForm.setFieldValue('branchClassId',branchClassId)

        const inputString = props.editChangeCurriculumDetails?.studentCode

        let params = {
      academicYearId: props.editChangeCurriculumDetails?.academicYearId,
      curriculumId: props.editChangeCurriculumDetails?.curriculumId,
      classId: props.editChangeCurriculumDetails?.classId,
      searchString: inputString,
      branchId: branchId
    }
    
    if(params.academicYearId&&params.curriculumId&&params.classId){
      dispatch(getCurriculumStudentListResp(generateActionPayload('get_curriculum_student_list_res', undefined, params)))
    }
  
      }
    },[ props.editChangeCurriculumDetails?.academicYearId, props.editChangeCurriculumDetails?.curriculumId, props.editChangeCurriculumDetails?.classId, props.directory])

    useEffect(()=>{
      if(props.directory && getCurriculumStudentList){
        const selectedStudent = getCurriculumStudentList[0]        
        ChangeCurriculumFilterForm.setFieldValue("studentId", selectedStudent.studentId )
        setSearchStudentState(selectedStudent);
      }
    },[ getCurriculumStudentList, props.directory])

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { content: changeClassTypes } = classList || {};

  return (
    <>

      <div className="tw-p-5">

        <div className="tw-grid tw-grid-cols-1 tw-gap-3">

          <div>
            <SelectInput
              name="academicYearId"
              value={ChangeCurriculumFilterForm.values.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              isDisabled={props.directory}
              invalid={
                ChangeCurriculumFilterForm.touched.academicYearId &&
                  ChangeCurriculumFilterForm.errors.academicYearId
                  ? true
                  : false
              }
              error={
                ChangeCurriculumFilterForm.touched.academicYearId &&
                  ChangeCurriculumFilterForm.errors.academicYearId
                  ? ChangeCurriculumFilterForm.errors.academicYearId
                  : ""
              }
            />
          </div>

          <div>
            <SelectInput
              name="curriculumId"
              value={ChangeCurriculumFilterForm.values.curriculumId}
              onChange={filterHandler}
              menuItems={curriculumTypes}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              defaultSelect="Curriculum"
              formgroupClassName="tw-mb-0"
              labelText="Curriculum"
              isDisabled={props.directory}
              invalid={
                ChangeCurriculumFilterForm.touched.curriculumId &&
                  ChangeCurriculumFilterForm.errors.curriculumId
                  ? true
                  : false
              }
              error={
                ChangeCurriculumFilterForm.touched.curriculumId &&
                  ChangeCurriculumFilterForm.errors.curriculumId
                  ? ChangeCurriculumFilterForm.errors.curriculumId
                  : ""
              }
            />
          </div>

          <div>
            <SelectInput
              name="branchClassId"
              value={ChangeCurriculumFilterForm.values.branchClassId}
              onChange={filterHandler}
              menuItems={classTypes}
              valueKey="id"
              textKey="shortName"
              defaultSelect="Class"
              formgroupClassName="tw-mb-0"
              labelText="Class"
              isDisabled={props.directory}
              invalid={
                ChangeCurriculumFilterForm.touched.branchClassId &&
                  ChangeCurriculumFilterForm.errors.branchClassId
                  ? true
                  : false
              }
              error={
                ChangeCurriculumFilterForm.touched.branchClassId &&
                  ChangeCurriculumFilterForm.errors.branchClassId
                  ? ChangeCurriculumFilterForm.errors.branchClassId
                  : ""
              }
            />
          </div>

          <div>
            <AutoSearchInput
              formgroupClassName="tw-mb-0"
              name="studentId"
              placeHolder="Search..."
              onChange={onInputSearchChange}
              valueKey="studentId"
              labelKey="studentName"
              subLabelKey="studentCodeNum"
              labelHeader="Student Code"
              subLabelHeader="Student Name"
              options={getCurriculumStudentList || []}
              selected={searchStudentState}
              selectedOptionCallbck={selectedStudentHndlr}
              labelText="Student"
              invalid={
                ChangeCurriculumFilterForm.touched.studentId &&
                  ChangeCurriculumFilterForm.errors.studentId
                  ? true
                  : false
              }
              error={
                ChangeCurriculumFilterForm.touched.studentId &&
                  ChangeCurriculumFilterForm.errors.studentId
                  ? ChangeCurriculumFilterForm.errors.studentId
                  : ""
              }
            >
              <i className="ri-search-line" />
            </AutoSearchInput>
          </div>

          <div>
            <SelectInput
              name="changeCuriculumId"
              value={ChangeCurriculumFilterForm.values.changeCuriculumId}
              onChange={filterHandler}
              menuItems={curriculumTypes || []}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              inputClassName="tw-bg-gray-100"
              formgroupClassName="tw-mb-0"
              labelText="Change Curriculum"
              invalid={
                ChangeCurriculumFilterForm.touched.changeCuriculumId &&
                  ChangeCurriculumFilterForm.errors.changeCuriculumId
                  ? true
                  : false
              }
              error={
                ChangeCurriculumFilterForm.touched.changeCuriculumId &&
                  ChangeCurriculumFilterForm.errors.changeCuriculumId
                  ? ChangeCurriculumFilterForm.errors.changeCuriculumId
                  : ""
              }
            />
          </div>

          <div>
            <SelectInput
              name="changeClassId"
              value={ChangeCurriculumFilterForm.values.changeClassId}
              onChange={filterHandler}
              menuItems={changeClassTypes || []}
              valueKey="id"
              textKey="shortName"
              inputClassName="tw-bg-gray-100"
              formgroupClassName="tw-mb-0"
              labelText="Change Class"
              invalid={
                ChangeCurriculumFilterForm.touched.changeClassId &&
                  ChangeCurriculumFilterForm.errors.changeClassId
                  ? true
                  : false
              }
              error={
                ChangeCurriculumFilterForm.touched.changeClassId &&
                  ChangeCurriculumFilterForm.errors.changeClassId
                  ? ChangeCurriculumFilterForm.errors.changeClassId
                  : ""
              }
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={(event: any) =>
              ChangeCurriculumFilterForm.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            Submit
          </Button>
        </div>

      </div>
    </>
  );
};

export default ChangeCurriculumModal;

import React, { useEffect, useState } from "react";
import {
  AutoSearchInput,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import {
  ChangeStreamModalFilterhProps,
  ChangeStreamModalProps,
} from "./changeStreamTypes";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getClassListForChangeStream, getStreamChangeStudentList, resetClassListForStreamChangeAct, resetStreamChangeStudentList, setStreamChangeRequest } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getStreamList, resetStreamList } from "../../../store/academic/assignGroup/assigngroupactions";
import * as Yup from 'yup';
import { getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import Button from "../../../Components/Common/Button";

const initialValues: ChangeStreamModalFilterhProps = {
  academicYearId: "",
  curriculumId: "",
  studentId: "",
  className: "",
  currentStreamName: "",
  changeStreamId: "",
};

const ChangeStreamModal = (props: ChangeStreamModalProps) => {
  const dispatch = useDispatch();
  
  const [changeStreamModalFilterState, setChangeStreamModalFilterState] =
    useState<ChangeStreamModalFilterhProps>(initialValues);
  const [searchStudentState, setSearchStudentState] = useState<any>(null);

  const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required('Academic Year is required'),
    curriculumId: Yup.string().required('Curriculum is required'),
    studentId: Yup.string().required('Student Name is required'),
    // className: Yup.string().required('Class is required'),
    // currentStreamName: Yup.string().required('Current Stream is required'),
    changeStreamId: Yup.string().required('Change Stream is required'),
  });
  const ChangeStreamModalFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: changeStreamModalFilterState,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        academicYearId: values.academicYearId,
        studentId: values.studentId,
        newStreamId: values.changeStreamId
      }
      dispatch(setStreamChangeRequest(generateActionPayload('raise_stream_change_request', undefined, payload)))
    },
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    // branchClassResp,
    streamListResp,
    streamChangeStudentList,
    classListChangeStream,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader
  }: any = useAppSelector(
    ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData,globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      // branchClassResp: branchAcademics.branchClassResp,
      streamChangeStudentList: classroomManagmentInfo.streamChangeStudentList,
      classListChangeStream: classroomManagmentInfo.classListChangeStream,
      streamListResp: assignGroupInfo.streamListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader:globalData.showApiLoader,
    }),
    shallowEqual
  );

  const filterHandler = (event: any) => {
    ChangeStreamModalFilterForm.handleChange(event);
    const { name, value } = event.target;
    if (name === "curriculumId") {
      ChangeStreamModalFilterForm.setFieldValue('className', "");
      ChangeStreamModalFilterForm.setFieldValue('currentStreamName', "");
      // let params = {
      //   branchId: branchId,
      //   academicYearId: ChangeStreamModalFilterForm.values.academicYearId,
      //   curriculumId: value
      // }
      // dispatch(getStreamChangeStudentList(generateActionPayload('get_stream_change_student_list', undefined, params)));
    }
    else if (name === "studentId") {
      let data = streamChangeStudentList && streamChangeStudentList.find((stream: any) => stream.studentId === +value);
      if(data){
        ChangeStreamModalFilterForm.setFieldValue('className', data.studentClassName);
        ChangeStreamModalFilterForm.setFieldValue('currentStreamName', data.studentStreamName);
        const payload1 = { branchId: branchId, curriculumId: data.studentCurriculumId, classId: data.studentClassId, sortBy: "streamGroupName", orderBy: "asc" }
        dispatch(
          getStreamList(
            generateActionPayload("get_stream_list", undefined, payload1)
          )
        );
      }
    }
    else if(name === "academicYearId"){
      getCurriculumApiCall({[name]:value})
      ChangeStreamModalFilterForm.setFieldValue('curriculumId', "");
      ChangeStreamModalFilterForm.setFieldValue('className', "");
      ChangeStreamModalFilterForm.setFieldValue('currentStreamName', "");
    }
  }

  function onInputSearchChange(inputString: any) {
    // dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
    //   branchId, academicYearId: filterState.academicYearId,
    //   studentName: inputString || "a"
    // })));
    let params = {
      branchId: branchId,
      academicYearId: ChangeStreamModalFilterForm.values.academicYearId,
      curriculumId: ChangeStreamModalFilterForm.values.curriculumId,
      searchString:inputString
    }
    if(params.academicYearId&&params.curriculumId){
      dispatch(getStreamChangeStudentList(generateActionPayload('get_stream_change_student_list', undefined, params)));
    }
  }

  function selectedStudentHndlr(selectedStudent: any) {    
    ChangeStreamModalFilterForm.setValues((prev:any)=>({...prev,studentId:selectedStudent.studentId}))
    setSearchStudentState(selectedStudent);
    const payload1 = { branchId: branchId, branchClassId: selectedStudent.studentClassId,searchString:"" }
      dispatch(
        getClassListForChangeStream(
          generateActionPayload("get_classes_for_student_stream_change", undefined, payload1)
        )
      );
    
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

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: ChangeStreamModalFilterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  useEffect(() => {
    if (!props.isOpen) {
      ChangeStreamModalFilterForm.resetForm();
      setSearchStudentState(null);
      dispatch(resetStreamChangeStudentList(undefined));
      dispatch(resetStreamList(undefined))
      dispatch(resetClassListForStreamChangeAct(undefined))
    }
    
  }, [props.isOpen])
  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
    if(!props.directory){
      ChangeStreamModalFilterForm.setFieldValue('academicYearId',yearId)
      getCurriculumApiCall({academicYearId : yearId})
    }
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    // setTransferCertificateFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
  }, [academicYearListResp])

  useEffect(()=>{
    if(props.directory){
      const academicYearId = props.editChangeStreamDetails?.academicYearId
      const curriculumId = props.editChangeStreamDetails?.curriculumId
      ChangeStreamModalFilterForm.setFieldValue('academicYearId',academicYearId)
      ChangeStreamModalFilterForm.setFieldValue('curriculumId',curriculumId)

      const search = props.editChangeStreamDetails?.studentCode

      let params = {
      branchId: branchId,
      academicYearId,
      curriculumId,
      searchString: search
    }
    if(params.academicYearId&&params.curriculumId){
      dispatch(getStreamChangeStudentList(generateActionPayload('get_stream_change_student_list', undefined, params)));
    }
    }
  },[ props.editChangeStreamDetails, props.directory])

  useEffect(() => {
    if (streamChangeStudentList && props.directory && streamChangeStudentList.length > 0) {
      const selectedStudents = streamChangeStudentList[0]
      
      ChangeStreamModalFilterForm.setFieldValue("studentId",selectedStudents.studentId)
    setSearchStudentState(selectedStudents);
    if(selectedStudents.studentClassId){
      const payload1 = { branchId: branchId, branchClassId: selectedStudents.studentClassId,searchString:"" }
      dispatch(
        getClassListForChangeStream(
          generateActionPayload("get_classes_for_student_stream_change", undefined, payload1)
        )
      );
    }
      
    }
  }, [streamChangeStudentList])
  
  

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: StreamList } = streamListResp || {}


  return (
    <>

      <div className="tw-p-5">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">

          <div className="tw-col-span-12">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={ChangeStreamModalFilterForm.values.academicYearId}
              onChange={filterHandler}
              onBlur={ChangeStreamModalFilterForm.handleBlur}
              menuItems={academicYearList}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              isDisabled={props.directory}
              invalid={
                ChangeStreamModalFilterForm.touched.academicYearId &&
                  ChangeStreamModalFilterForm.errors.academicYearId
                  ? true
                  : false
              }
              error={
                ChangeStreamModalFilterForm.touched.academicYearId &&
                  ChangeStreamModalFilterForm.errors.academicYearId
                  ? ChangeStreamModalFilterForm.errors.academicYearId
                  : ""
              }
            />
          </div>

          <div className="tw-col-span-12">
            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              value={ChangeStreamModalFilterForm.values.curriculumId}
              onBlur={ChangeStreamModalFilterForm.handleBlur}
              onChange={filterHandler}
              menuItems={curriculumTypes}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="tw-mb-0"
              isDisabled={props.directory}
              invalid={
                ChangeStreamModalFilterForm.touched.curriculumId &&
                  ChangeStreamModalFilterForm.errors.curriculumId
                  ? true
                  : false
              }
              error={
                ChangeStreamModalFilterForm.touched.curriculumId &&
                  ChangeStreamModalFilterForm.errors.curriculumId
                  ? ChangeStreamModalFilterForm.errors.curriculumId
                  : ""
              }
            />
          </div>

          <div className="tw-col-span-12">
            <AutoSearchInput
              formgroupClassName="search-box"
              name="studentId"
              placeHolder="Search..."
              onChange={onInputSearchChange}
              valueKey="studentId"
              labelKey="studentName"
              subLabelKey="studentCodeNum"
              labelHeader="Student Code"
              subLabelHeader="Student Name"
              options={streamChangeStudentList || []}
              selected={searchStudentState}
              selectedOptionCallbck={selectedStudentHndlr}
              labelText="Student"
              isDisabled={props.directory}
            >
              <i className="ri-search-line search-icon"></i>
            </AutoSearchInput>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="className"
              labelText="Class"
              value={searchStudentState ? searchStudentState.studentClassName : ""}
              onChange={ChangeStreamModalFilterForm.handleChange}
              formgroupClassName="tw-mb-0"
              inputClassName="tw-bg-gray-100"
              isDisabled={true}
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="currentStreamName"
              labelText="Current Stream"
              value={searchStudentState ? searchStudentState.classShortName : ""}
              onChange={ChangeStreamModalFilterForm.handleChange}
              formgroupClassName="tw-mb-0"
              inputClassName="tw-bg-gray-100"
              isDisabled={true}
            />
          </div>

          <div className="tw-col-span-12">
            <SelectInput
              name="changeStreamId"
              labelText="Change Stream"
              value={ChangeStreamModalFilterForm.values.changeStreamId}
              onChange={filterHandler}
              onBlur={ChangeStreamModalFilterForm.handleBlur}
              menuItems={classListChangeStream || []}
              valueKey="branchClassId"
              textKey="className"
              formgroupClassName="tw-mb-0"
              invalid={
                ChangeStreamModalFilterForm.touched.changeStreamId &&
                  ChangeStreamModalFilterForm.errors.changeStreamId
                  ? true
                  : false
              }
              error={
                ChangeStreamModalFilterForm.touched.changeStreamId &&
                  ChangeStreamModalFilterForm.errors.changeStreamId
                  ? ChangeStreamModalFilterForm.errors.changeStreamId
                  : ""
              }
            />
          </div>

        </div>

        {/* Buttons */}
        <div className="tw-flex tw-gap-2 tw-justify-end">
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
              ChangeStreamModalFilterForm.handleSubmit(event)
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

export default ChangeStreamModal;

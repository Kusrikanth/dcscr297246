import React, { useEffect, useRef } from 'react';
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik';
import { AutoSearchInputUpdated, SelectInput, TextInput } from '../../../../../Components/Common';
import { groupType, questionsPoolTypes, RoleOptions, SubjectsOptions, teacherListResp } from './helper';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getBranchClassAct, getBranchCurriculumAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, PlusSignIcon } from '@hugeicons-pro/core-stroke-standard';
import { generateUniqueNumber } from '../../../../../utility/commonutility';
import { getAssignedClassSubjectsList } from '../../../../../store/academic/classSubjects/classsubjectsactions';
import { getTeacherList } from '../../../../../store/academic/classroomManagment/classroommanagmentactions';
import { saveQuestionPoolLibraryAct, editQuestionPoolLibraryAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { toast } from 'react-toastify';
import * as Yup from "yup";
import { setQuestionPoolLibraryByIdAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentslice';

const initialValues = {
  poolName: "",
  description: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  subject: "",
  poolType: "",
  tags: "",
  permissions: [
    {
      uniqueId: generateUniqueNumber(),
      employeeId: "",
      employeeName: "",
      employeeCode: "",
      access: ""
    }
  ]
}

const addPoolValidationSchema = Yup.object().shape({
    poolName: Yup.string().required("Pool Title is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
    classId: Yup.string().required("Class is required"),
    subject: Yup.string().required("Subject is required"),
});

interface FetchQuestionsModelProps {
  id: any;
  isOpen: boolean;
  toggle: () => void;
  modalTitle: string;
  data: any;
  mode: string;
}

const AddPoolModel: React.FC<FetchQuestionsModelProps> = (props) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const isInitializedRef = useRef(false);
  const createEmployeeForm = useFormik({
    initialValues,
    validationSchema: addPoolValidationSchema,
    onSubmit: (values: any) => {

      const academicYear = academicYearListResp?.data?.find(item => item.academicYearId === values.academicYearId);
      const curriculum = curriculumTypes?.find(item => +item.branchCurriculumId === +values.curriculumId);
      const classObj = classTypes?.find(item => +item.id === +values.classId);
      const subjectObj = assignedClassSubjectsListResp?.data?.find(item => +item.subjectId === +values.subject);  
      const poolTypeObj = questionsPoolTypes?.find(item => item.poolId === values.poolType);
      const branchName = branchListResp?.data?.find(item => +item.branchId === +branchId)?.branchName;
      const instituteName = instituteListResp?.data?.find(item => +item.id === +instituteId)?.instituteName;
          
      const createdBy = userMeResp?.id || 123; 
      const createdUserName = userMeResp?.username || "DPS"; 

      const permissionsPayload = values.permissions.map(({ employeeId, employeeName, employeeCode, access }) => ({
        employeeId,
        employeeName,
        employeeCode,
        access
      }));

      if (props.id) {
        const payload = {
          academicYearId: values.academicYearId,
          academicYearName: academicYear?.academicYearName,
          instituteId: instituteId,
          instituteName: instituteName,
          branchId: branchId,
          branchName: branchName,
          curriculumId: values.curriculumId,
          curriculumName: curriculum?.curriculumName,
          classId: values.classId,
          className: classObj?.shortName,
          subjectId: values.subject,
          subjectName: subjectObj?.subjectName,
          poolName: values.poolName,
          poolType: poolTypeObj?.poolId,
          description: values.description,
          tags: values.tags.split(',').map(tag => tag.trim()),
          lastModifiedBy: createdBy,
          lastModifiedUserName: createdUserName,
          permissions: props.mode === 'assign' ? permissionsPayload : [],
        };
        dispatch(editQuestionPoolLibraryAct(generateActionPayload("edit_question_pool_library", { id: props.id }, payload)));
      } else {
        const payload = {
          academicYearId: values.academicYearId,
          academicYearName: academicYear?.academicYearName,
          instituteId: instituteId,
          instituteName: instituteName,
          branchId: branchId,
          branchName: branchName,
          curriculumId: values.curriculumId,
          curriculumName: curriculum?.curriculumName,
          classId: values.classId,
          className: classObj?.shortName,
          subjectId: values.subject,
          subjectName: subjectObj?.subjectName,
          poolName: values.poolName,
          poolType: poolTypeObj?.poolId,
          description: values.description,
          tags: values.tags.split(',').map(tag => tag.trim()),
          createdBy,
          createdUserName,
          permissions: permissionsPayload,
        };
        dispatch(saveQuestionPoolLibraryAct(generateActionPayload("save_question_pool_library", undefined, payload)));
      }
    }
  });
  
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    assignedClassSubjectsListResp,
    employeeStatusResp,
    employeeCategoriesResp,
    teacherListResp,
    loggedInUserRole,
    userMeResp,
    branchListResp,
    instituteListResp,
    saveQuestionPoolLibraryResp
  } = useAppSelector(
    ({ instAcademics, globalData, branchAcademics, appData, classSubjectsInfo, masterData, classroomManagmentInfo, login, branch, instituteInfo, lmsAssessment }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      employeeStatusResp: masterData.employeeStatusResp,
      employeeCategoriesResp: masterData.employeeCategoriesResp,
      teacherListResp: classroomManagmentInfo.teacherListResp,
      loggedInUserRole: appData.loggedInUserRole,
      userMeResp: login.userMeResp,
      branchListResp: branch.branchListResp,
      instituteListResp: instituteInfo.instituteListResp,
      saveQuestionPoolLibraryResp: lmsAssessment.saveQuestionPoolLibraryResp

    }),
    shallowEqual
  );

  
  function addSlabHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), employeeId: "", employeeName: "", employeeCode: "", access: "" });
    }
  }
  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function onInputSearchChange(searchString: string) {
    let statusID = employeeStatusResp?.find(
      (status: any) => status.empStatusName.toLowerCase() === "active")?.id;
    let categoryID = employeeCategoriesResp?.find((category: any) => category.categoryName.toLowerCase() === "teachers")?.employeeCategoryId;
    // if (createEmployeeForm.values?.academicYearId && createEmployeeForm.values?.curriculumId) {
    const params = {
      branchId,
      pageNo: 0,
      pageSize: 2000,
      status: statusID,
      employeeCategoryId: categoryID,
      searchString: searchString || "",
      masterAcademicYearId: createEmployeeForm.values?.academicYearId,
      curriculumId: createEmployeeForm.values?.curriculumId,
    };
    dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
    // }
  }

  useEffect(() => {
    if (props.data && teacherListResp) {

      if (props.data.permissions && props.data.permissions.length > 0 && Array.isArray(teacherListResp) && teacherListResp.length > 0) {
        const teacherToFindId = props.data.permissions[0].employeeId;
        const isTeacherInList = teacherListResp.some(teacher => teacher.id === teacherToFindId || teacher.userId === teacherToFindId);
        if (!isTeacherInList) {
          console.error("no teacher list found");
        }
      }
    }
  }, [props.data, teacherListResp]);

  const selectedStudent = (selectedItem: any, index: number) => {
    if (selectedItem) {
      createEmployeeForm.setFieldValue(`permissions.${index}.employeeId`, selectedItem.id);
      createEmployeeForm.setFieldValue(`permissions.${index}.employeeName`, selectedItem.employeeName);
      createEmployeeForm.setFieldValue(`permissions.${index}.employeeCode`, selectedItem.employeeCode);
    } else {
      createEmployeeForm.setFieldValue(`permissions.${index}.employeeId`, "");
      createEmployeeForm.setFieldValue(`permissions.${index}.employeeName`, "");
      createEmployeeForm.setFieldValue(`permissions.${index}.employeeCode`, "");
    }
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  function getClassApiCall(curriculumId: string, academicYearId?: string) {
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

    const classSubjectListApicall = (otherProps?: any) => {
      const { academicYearId, classId, curriculumId } = createEmployeeForm.values;
      const payload = { academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: classId, ...otherProps, isDropdownRequest: false, pageNo: 0, pageSize: 100, };
      if (payload.academicYearId && payload.branchClassId) {
        dispatch(
          getAssignedClassSubjectsList(
            generateActionPayload("get_assigned_class_subject_list", undefined, payload)
          )
        );
      }
    }

     const getEmployees = (otherProps?: any) => {
        let statusID = employeeStatusResp && employeeStatusResp.find((status: any) => status.empStatusName.toLowerCase() === 'active')?.id;
        let categoryID = employeeCategoriesResp && employeeCategoriesResp.find((category: any) => category.categoryName.toLowerCase() === 'teachers')?.employeeCategoryId;
        let filterState = { ...otherProps };
    
        if (createEmployeeForm.values?.academicYearId && createEmployeeForm.values?.curriculumId) {
          const params = { 
            branchId: branchId, 
            pageNo: 0, 
            pageSize: 2000, 
            status: statusID, 
            employeeCategoryId: categoryID, 
            searchString: filterState.searchString || "", 
            masterAcademicYearId: createEmployeeForm.values?.academicYearId, 
            curriculumId: createEmployeeForm.values?.curriculumId, 
            ...otherProps 
          };
          dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
        }
      }

  useEffect(() => {
    if(academicYearListResp){
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      createEmployeeForm.setFieldValue("academicYearId", academicYearId);
  }},[academicYearListResp])

  useEffect(() => {
    const { classId } = createEmployeeForm.values;
    if (classId) {
      classSubjectListApicall();
    }
  }, [createEmployeeForm.values.classId]);

  useEffect(() => {
    const { curriculumId } = createEmployeeForm.values;
    if (curriculumId) {
      getClassApiCall(curriculumId);
      getEmployees(curriculumId);
    }
  }, [createEmployeeForm.values.curriculumId]);
  const { content: classTypes } = branchClassResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}

  useEffect(() => {
    getCurriculumApiCall();
    return () => {
      dispatch(setQuestionPoolLibraryByIdAct(undefined));
    }
  }, []);

  useEffect(() => {
    if (props.id && props.data) {
      const { poolName, description, tags, academicYearId, curriculumId, classId, subjectId, poolType, permissions } = props.data;
      createEmployeeForm.setValues({
        poolName: poolName,
        description: description,
        tags: tags.join(', '),
        academicYearId: academicYearId,
        curriculumId: curriculumId,
        classId: classId,
        subject: subjectId,
        poolType: poolType,
        permissions: permissions.map((p: any) => ({ ...p, uniqueId: generateUniqueNumber() }))
      });
      isInitializedRef.current = true;
    }
  }, [props.id, props.data]);

  return (
    // <form onSubmit={createEmployeeForm.handleSubmit}>
    <div style={{ padding: '1.25rem' }}>
      <div style={{ position: "relative", display: "inline-block", width: "100%", paddingBottom: "12px", paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px", }}>
        <p className='fs-12' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", paddingBottom: "15px", backgroundColor: "white", }}>Pool Details</p>
        <div className='row px-2 gx-3 mb-2 questionPool'>
          <div className='col-xs-12 col-md-4'>
            <TextInput
              name="poolName"
              formgroupClassName="mb-0"
              labelText="Pool Title"
              value={createEmployeeForm.values.poolName}
              onChange={createEmployeeForm.handleChange}
              labelClass='required'
              invalid={(createEmployeeForm.touched.poolName && createEmployeeForm.errors.poolName) ? true : false}
              error={(createEmployeeForm.touched.poolName && createEmployeeForm.errors.poolName) ? createEmployeeForm.errors.poolName : ""}
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
          <div className='col-xs-12 col-md-4'>
            <TextInput
              name="description"
              formgroupClassName="mb-0"
              labelText="Description"
              value={createEmployeeForm.values.description}
              onChange={createEmployeeForm.handleChange}
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
          <div className='col-xs-12 col-md-4'>
            <TextInput
              name="tags"
              value={createEmployeeForm.values.tags}
              onChange={createEmployeeForm.handleChange}
              labelText="Tags"
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
          <div className="col-xs-12 col-md-4">
            <SelectInput
              name="academicYearId"
              value={createEmployeeForm.values.academicYearId}
              onChange={createEmployeeForm.handleChange}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelText="Academic Year"
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
          <div className="col-xs-12 col-md-4">
            <SelectInput
              name="curriculumId"
              value={createEmployeeForm.values.curriculumId}
              onChange={createEmployeeForm.handleChange}
              menuItems={curriculumTypes}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="mb-0"
              labelText="Curriculum"
              labelClass='required'
              invalid={(createEmployeeForm.touched.curriculumId && createEmployeeForm.errors.curriculumId) ? true : false}
              error={(createEmployeeForm.touched.curriculumId && createEmployeeForm.errors.curriculumId) ? createEmployeeForm.errors.curriculumId : ""}
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
          <div className="col-xs-12 col-md-4">
            <SelectInput
              name="classId"
              value={createEmployeeForm.values.classId}
              onChange={createEmployeeForm.handleChange}
              menuItems={classTypes}
              valueKey="id"
              textKey="shortName"
              formgroupClassName="mb-0"
              labelText="Class"
              labelClass='required'
              invalid={(createEmployeeForm.touched.classId && createEmployeeForm.errors.classId) ? true : false}
              error={(createEmployeeForm.touched.classId && createEmployeeForm.errors.classId) ? createEmployeeForm.errors.classId : ""}
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
          <div className='col-xs-12 col-md-4'>
            <SelectInput
              name="subject"
              value={createEmployeeForm.values.subject}
              onChange={createEmployeeForm.handleChange}
              menuItems={assignedClassSubjectsListResp?.data}
              valueKey="subjectId"
              textKey="subjectName"
              labelText="Subject"
              formgroupClassName="mb-0"
              labelClass='required'
              invalid={(createEmployeeForm.touched.subject && createEmployeeForm.errors.subject) ? true : false}
              error={(createEmployeeForm.touched.subject && createEmployeeForm.errors.subject) ? createEmployeeForm.errors.subject : ""}
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
          <div className='col-xs-12 col-md-4'>
            <SelectInput
              name="poolType"
              value={createEmployeeForm.values.poolType}
              onChange={createEmployeeForm.handleChange}
              menuItems={questionsPoolTypes}
              valueKey="poolId"
              textKey="poolName"
              labelText="Pool Type"
              formgroupClassName="mb-0"
              isDisabled={props.mode === 'assign'}
            // floatingLabel
            />
          </div>
        </div>
      </div>
      <div style={{ position: "relative", display: "inline-block", width: "100%", paddingBottom: "12px", paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px", }}>
        <p className='fs-12' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", paddingBottom: "15px", backgroundColor: "white", }}>Assign Pool</p>
        <div className="row">
          <div className="col-6">
            <div className="hstack">
              <h6 className="fw-normal ms-3">Teacher Name</h6>
            </div>
          </div>
          <div className="col-4">
            <h6 className="fw-normal">
              Role
            </h6>
          </div>
        </div> <div className='row px-2 gx-3 mb-2'>
          <div className="col-12">
            <FormikProvider value={createEmployeeForm}>
              <FieldArray name="permissions">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) {
                    formikArrayHelpers.current = arrayHelpers;
                  }
                  return (
                    <>
                      {createEmployeeForm.values.permissions?.length > 0 &&
                        createEmployeeForm.values.permissions?.map((route: any, index: any) => {
                          const inputFieldErrors: any = createEmployeeForm.errors.permissions && createEmployeeForm.errors.permissions[index] || {};
                          const inputFieldTouched = createEmployeeForm.touched.permissions && createEmployeeForm.touched.permissions[index] || {};

                          const selectedTeacher = route.employeeId ? {
                            id: route.employeeId,
                            employeeName: route.employeeName,
                            employeeCode: route.employeeCode,
                          } : undefined;

                          return (
                            <div key={route.uniqueId} className="mb-3 row">
                              <div className="col-6">
                                <AutoSearchInputUpdated
                                  formgroupClassName="search-box"
                                  name={`permissions[${index}].employeeId`}
                                  selected={selectedTeacher}
                                  placeHolder="Search Employee..."
                                  onChange={onInputSearchChange}
                                  valueKey={"id"}
                                  labelKey="employeeCode"
                                  subLabelKey="employeeName"
                                  labelHeader="Teacher Code"
                                  subLabelHeader="Teacher Name"
                                  options={teacherListResp}
                                  selectedOptionCallbck={(option) => selectedStudent(option, index)}
                                  isDisabled={props.mode === 'edit'}
                                >
                                  <i className="ri-search-line search-icon"></i>
                                </AutoSearchInputUpdated>
                              </div>
                              <div className="col-6">
                                <div className="d-flex align-items-center w-90" >
                                  <SelectInput
                                    name={`permissions[${index}].access`}
                                    value={createEmployeeForm.values.permissions[index].access}
                                    inputClassName="w-90"
                                    onChange={createEmployeeForm.handleChange}
                                    menuItems={RoleOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="mb-0 w-90"
                                    isDisabled={props.mode === 'edit'}
                                  />
                                  {(index !== 0) && <button data-index={index} onClick={removeSlabHndlr} className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white">
                                    <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />                                </button>}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </>
                  )
                }}
              </FieldArray>
            </FormikProvider>
            <div className="row">
              <div className="col-12">
                <button onClick={addSlabHandler} type="button" className="btn btn-outline-primary btn-sm">
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='d-flex w-auto ms-auto '>
          <button
            type="submit"
            className="btn btn-light text-success mx-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success px-4"
            onClick={createEmployeeForm.submitForm}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    // {/* </form> */}
  );
};

export default AddPoolModel;
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { AutoSearchInput, RadioInputContainer, TextInput } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { getBranchClassAct, getBrchSectionsAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getSiblingDetailsAct, getStudentByFilterAct, getStudentsListAct, updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { details, formSectionSaveKey } from './helper';
import * as Yup from 'yup';
import { IModalProps, IUpdateStudentRepRef } from './StudentInfoTypes'
import Button from '../../../../Components/Common/Button';
interface AddSiblingDetailsProps {
  siblingId: string;
  siblingStudentId: string;
  siblingName: string;
  // siblingCampusTypeId: string;
  siblingCurriculumId: string;
  siblingCurriculumName: string;
  siblingClassId: string;
  siblingClassName: string;
  siblingSectionId: string;
  siblingSectionName: string;
  inSameSchool: any;
  siblingDetails: any;
}

const AddSiblingModal = (props: IModalProps) => {
  const dispatch = useDispatch();
  const [sectionList, setSectionList] = useState([]);
  const [searchStudentState, setSearchStudentState] = useState<any>(undefined);
  const initialValues = (editData?: any) => {
    return {
      siblingId: editData?.id || "",
      siblingStudentId: editData?.siblingStudentId || "",
      siblingName: editData?.siblingName || "",
      // siblingCampusTypeId: editData?.siblingCampusTypeId || "",
      siblingCurriculumId: editData?.siblingCurriculumId || "",
      siblingCurriculumName: editData?.siblingCurriculumName || "",
      siblingClassId: editData?.siblingClassId || "",
      siblingClassName: editData?.siblingClassName || "",
      siblingSectionId: editData?.siblingSectionId || "",
      siblingSectionName: editData?.siblingSectionName || "",
      inSameSchool: editData ? editData.inSameSchool ? "true" : "false" : "false",
      siblingDetails: editData?.siblingDetails || ""
    }
  }
  const [initialData, setInitialData] =
    useState<AddSiblingDetailsProps>(initialValues());

  const { brchCurriculumResp, branchClassResp, brchSectionsResp, affectedSection, updateStudentResp, getStudentsByFilterResp, studentsListResp, getSiblingDetailsResp, showApiLoader } = useAppSelector(
    ({ directoryStudent, instituteInfo, branchAcademics, globalData }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getSiblingDetailsResp: directoryStudent.getSiblingDetailsResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      affectedSection: directoryStudent.affectedSection,
      updateStudentResp: directoryStudent.updateStudentResp,
      getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
      studentsListResp: directoryStudent.studentsListResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const validationSchema = Yup.object().shape({
    siblingStudentId: Yup.string().when([], {
      is: () => addSiblingDetailsForm.values.inSameSchool === "true",
      then: Yup.string().required("Student Id is required"),
      otherwise: Yup.string().notRequired(),
    }),
    siblingName: Yup.string().required("Sibling Name is required"),
    // siblingCampusTypeId: Yup.string().when([],{
    //   is: () => addSiblingDetailsForm.values.inSameSchool,
    //   then: Yup.string().required("Sibling Campus Type is required"),
    //   otherwise: Yup.string().notRequired(),
    // }),
    // siblingDetails: Yup.string().when([], {
    //   is: () => addSiblingDetailsForm.values.inSameSchool === "false",
    //   then: Yup.string().required("Sibling Details is required"),
    //   otherwise: Yup.string().notRequired(),
    // }),
    siblingCurriculumId: Yup.string().when([], {
      is: () => addSiblingDetailsForm.values.inSameSchool === "true",
      then: Yup.string().required("Sibling Curriculum is required"),
      otherwise: Yup.string().notRequired(),
    }),
    siblingClassId: Yup.string().when([], {
      is: () => addSiblingDetailsForm.values.inSameSchool === "true",
      then: Yup.string().required("Sibling Class is required"),
      otherwise: Yup.string().notRequired(),
    }),
    // siblingSectionId: Yup.string().required("Section Type is required."),
    // inSameSchool: Yup.string().required("In the Same School is required."),
  });

  const addSiblingDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: initialData,
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      const data = details(props.data, values, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.siblingDetails);
      formData.append("studentRequest", JSON.stringify(data));
      dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
        affectedSection: "Sibling Info"
      })));
    },
  });

  const SiblingDetailsRef = useRef<IUpdateStudentRepRef>({
    preUpdateStudentDetails: updateStudentResp
  });

  useEffect(() => {
    const { preUpdateStudentDetails } =
      SiblingDetailsRef.current;

    if (updateStudentResp &&
      preUpdateStudentDetails !== updateStudentResp) {
      affectedSection === "Sibling Info" && toast.success(`Sibling ${props.editData ? "Updated" : "Added"} successfully.`);
      affectedSection === "Sibling Info" && props.toggle(true);
    }
    SiblingDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
  }, [affectedSection, updateStudentResp]);

  // useEffect(()=>{
  //   affectedSection==="Sibling Info" && props.toggle(true);
  // },[affectedSection])
  useEffect(() => {
    if (props.isOpen) {
      setInitialData(initialValues(props.editData))
      // dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined,
      //   { branchId: props.branchId, academicYearId: props.academicYearId, studentName: "" })));
      if (props.editData) {
        const payload = { branchId: props.branchId, curriculumId: props.editData.siblingCurriculumId, sortBy: "className",academicYearId: props.academicYearId, orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        const payload1 = { branchId: props.branchId, academicYearId: props.academicYearId, branchCurriculumId: props.editData.siblingCurriculumId, classId: props.editData.siblingClassId, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc" };
        initialData && dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
        dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined,
          { branchId: props.branchId, academicYearId: props.academicYearId, studentName: props.editData.siblingName })));
      }
    }
    else {
      addSiblingDetailsForm.resetForm();
      setSearchStudentState(undefined)
      // clearStudentsByFilterAct(undefined);
    }
  }, [props.isOpen])

  useEffect(() => {
    getStudentsByFilterResp && setSearchStudentState(getStudentsByFilterResp[0])
  }, [getStudentsByFilterResp])

  // useEffect(() => {
  //   const payload = { branchId: props.branchId, curriculumId: props.editData && props.editData.siblingCurriculumId, pageNo: 0, pageSize: 100 };
  //   props.editData && dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  //   const payload1 = { branchId: props.branchId, curriculumId: props.editData && props.editData.siblingCurriculumId, classId: props.editData && props.editData.siblingClassId, pageNo: 0, pageSize: 100 };
  //   // initialData && dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
  // }, [])
  const ChangeHandler = (e: any) => {
    addSiblingDetailsForm.handleChange(e);
    const { name, value } = e.target;
    if (name === "siblingCurriculumId") {
      const payload = { branchId: props.branchId, curriculumId: e.target.value, academicYearId: props.academicYearId, sortBy: "className", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    else if (name === "siblingClassId") {
      SectionList && setSectionList(SectionList.find((section: any) => section.branchClassId === +addSiblingDetailsForm.values.siblingClassId)?.sectionsResponse)
    }
    else if (name === "inSameSchool") {
      if (!e.target.checked) {
        addSiblingDetailsForm.setValues({ siblingId: initialData.siblingId, siblingStudentId: "", siblingSectionName: "", siblingName: "", siblingClassId: "", siblingClassName: "", siblingSectionId: "", inSameSchool: false, siblingDetails: "", siblingCurriculumId: "", siblingCurriculumName: "" });
        setSearchStudentState(undefined)
        addSiblingDetailsForm.setValues((prev: any) => ({ ...prev, inSameSchool: e.target.checked }))
      }
      else {
        addSiblingDetailsForm.setValues((prev: any) => ({ ...prev, inSameSchool: e.target.checked }))
      }
    }
  }
  // const ClassHandler = (e: any) => {
  //   addSiblingDetailsForm.handleChange(e);
  //   const payload1 = { branchId: 20, curriculumId: initialData.siblingCurriculumId, classId: initialData.siblingClassId, pageNo: 0, pageSize: 100 };
  //   // initialData && dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));



  // }
  const studentIdHandler = (event: any) => {
    addSiblingDetailsForm.handleChange(event);
    let params = { branchId: props.branchId, academicYearId: props.academicYearId, studentIds: event.target.value, pageNo: 0, pageSize: 100 }
    dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    // dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined,
    //             { branchId:props.branchId, academicYearId: props.academicYearId, studentIds: event.target.value,pageNo:0,pageSize:100 })));
  }
  function getStudentsApiCall(otherProps?: any) {
    // const params = {
    //   branchId: props.branchId, academicYearId: props.academicYearId, ...otherProps
    // };
    // dispatch(getStudentsListAct(generateActionPayload("get_students_by_id", undefined, params)));

    dispatch(getSiblingDetailsAct(generateActionPayload("get_students_by_id", { studentId: otherProps.studentId }, { academicYearId: props.academicYearId })));
  }
  function handleMenuOpen() {
    // if (filterState.academicYearId)
    // dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
    //   branchId: props.branchId, academicYearId: props.academicYearId,
    //   studentName: "a"
    // })));
  }
  function handleSearchStudentHndlr(inputString: string, inputAction: any) {
    if (inputString) {
      dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined,
        { branchId: props.branchId, academicYearId: props.academicYearId, studentName: inputString })));
    }
  }
  function handleSelectedStudent(selectedSingle?: any, meta?: any) {
    setSearchStudentState(selectedSingle);

    if (selectedSingle) {
      const { id } = selectedSingle;
      // setInitialData((prev: any) => ({ ...prev, siblingStudentId: id }))
      // setInitialData((prevState: any) => ({ ...prevState, siblingStudentId: id }));
      addSiblingDetailsForm.setValues((prev: any) => ({ ...prev, siblingStudentId: id }))
      getStudentsApiCall({ studentId: id });
    } else {
      // setInitialData((prevState: any) => ({ ...prevState, siblingStudentId: "" }));
      addSiblingDetailsForm.setValues((prev: any) => ({ ...prev, siblingStudentId: "", siblingName: "", siblingCurriculumId: "", siblingClassId: "", siblingSectionId: "", siblingDetails: "" }))
      getStudentsApiCall({ studentId: "" });
    }
  }

  function isEmployeeHandler(event: any) {
    addSiblingDetailsForm.handleChange(event);
    addSiblingDetailsForm.setErrors({})
  }

  useEffect(() => {
    // siblingStudentId: editData?.siblingStudentId || "",
    //   siblingName: editData?.siblingName || "",
    //   siblingCampusTypeId: editData?.siblingCampusTypeId || "",
    //   siblingCurriculumId: editData?.siblingCurriculumId || "",
    //   siblingClassId: editData?.siblingClassId || "",
    //   siblingSectionId: editData?.siblingSectionId || "",
    //   inSameSchool: editData ? editData.inSameSchool ? ['on'] : [] : ""
    if (getSiblingDetailsResp) {

      addSiblingDetailsForm.setValues((prev: any) => ({ ...prev, siblingName: getSiblingDetailsResp.studentDetails.studentName, siblingCurriculumId: getSiblingDetailsResp.studentAcademicDetails.curriculumId, siblingCurriculumName: getSiblingDetailsResp.studentAcademicDetails.curriculumName, siblingClassId: getSiblingDetailsResp.studentAcademicDetails.classId, siblingClassName: getSiblingDetailsResp.studentAcademicDetails.className, siblingSectionId: getSiblingDetailsResp.studentAcademicDetails.sectionId, siblingSectionName: getSiblingDetailsResp.studentAcademicDetails.sectionName, inSameSchool: addSiblingDetailsForm.values.inSameSchool, siblingStudentId: addSiblingDetailsForm.values.siblingStudentId }))
    }
  }, [getSiblingDetailsResp])

  const { data: CurriculumList } = brchCurriculumResp || {};
  const { data: SectionList } = brchSectionsResp || {};
  const { content: ClassList } = branchClassResp || {};

  useEffect(() => {

    SectionList && setSectionList(SectionList.find((section: any) => section.branchClassId === +addSiblingDetailsForm.values.siblingClassId)?.sectionsResponse)
  }, [SectionList])
  return (

    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-my-1 tw-p-4 tw-pt-2">

      {/* In Same School */}
      <div className="tw-col-span-12 md:tw-col-span-6">
        {/* <Switch
            attributeId={"inSameSchool"}
            labelName={"In the Same School"}
            className="form-switch-sm form-check-right w-70"
            onChangeHndlr={ChangeHandler}
            isDisabled={!!props.editData}
            checked={addSiblingDetailsForm.values.inSameSchool}
          /> */}
        <RadioInputContainer
          name="inSameSchool"
          labelText="In the Same School"
          // inputContainerClassName="mt-2"
          // formgroupClassName="tw-mb-0"
          radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
          value={addSiblingDetailsForm.values.inSameSchool}
          onChange={isEmployeeHandler}
          isDisabled={!!props.editData}
          invalid={
            addSiblingDetailsForm.touched.inSameSchool &&
              addSiblingDetailsForm.errors.inSameSchool
              ? true
              : false
          }
          error={
            addSiblingDetailsForm.touched.inSameSchool &&
              addSiblingDetailsForm.errors.inSameSchool
              ? addSiblingDetailsForm.errors.inSameSchool
              : ""
          }
        />
        {/* <SelectInput
            name="intheSameSchool"
            labelText="In the Same School"
            value={addSiblingDetailsForm.values.intheSameSchool}
            onChange={addSiblingDetailsForm.handleChange}
            menuItems={IsEmployeeOptions}
            valueKey="value"
            textKey="value"
            invalid={
              addSiblingDetailsForm.touched.intheSameSchool &&
              addSiblingDetailsForm.errors.intheSameSchool
                  ? true
                  : false
          }
          error={
            addSiblingDetailsForm.touched.intheSameSchool &&
            addSiblingDetailsForm.errors.intheSameSchool
                  ? addSiblingDetailsForm.errors.intheSameSchool
                  : ""
          }
          /> */}
      </div>

      {/* Search Student */}
      {addSiblingDetailsForm.values.inSameSchool === "true" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          {/* <SelectWithTextInput
            name="Search Student"
            value={searchStudentState}
            handleSelect={handleSelectedStudent}
            menuOpenHndlr={handleMenuOpen}
            options={(Array.isArray(getStudentsByFilterResp) && getStudentsByFilterResp) || []}
            placeHolder="Search..."
            handleInputChange={handleSearchStudentHndlr}
            labelId="name"
            valueId="id"
            formgroupClassName="tw-mb-0"
            labelText="Sibling Name"
            invalid={
              addSiblingDetailsForm.touched.siblingStudentId &&
                addSiblingDetailsForm.errors.siblingStudentId
                ? true
                : false
            }
            error={
              addSiblingDetailsForm.touched.siblingStudentId &&
                addSiblingDetailsForm.errors.siblingStudentId
                ? addSiblingDetailsForm.errors.siblingStudentId
                : ""
            }
          // isDisabled={!filterState.academicYearId}
          /> */}
          <AutoSearchInput
            formgroupClassName="search-box"
            name="searchString"
            placeHolder="Search..."
            onChange={handleSearchStudentHndlr}
            valueKey="id"
            labelKey="name"
            subLabelKey="studentCode"
            labelHeader="Student Code"
            subLabelHeader="Student Name"
            options={(Array.isArray(getStudentsByFilterResp) && getStudentsByFilterResp) || []}
            selected={searchStudentState}
            selectedOptionCallbck={handleSelectedStudent}
            labelText="Student Name / Code"
          >
            <i className="ri-search-line search-icon"></i>
          </AutoSearchInput>
        </div>
      )}

      {/* Name */}
      <div className="tw-col-span-12 md:tw-col-span-6">
        <TextInput
          name='siblingName'
          labelText='Name'
          // formgroupClassName="tw-mb-0"
          value={addSiblingDetailsForm.values.siblingName}
          isDisabled={addSiblingDetailsForm.values.inSameSchool === "true"}
          isReadOnly={addSiblingDetailsForm.values.inSameSchool === "true"}
          invalid={
            addSiblingDetailsForm.touched.siblingName &&
              addSiblingDetailsForm.errors.siblingName
              ? true
              : false
          }
          error={
            addSiblingDetailsForm.touched.siblingName &&
              addSiblingDetailsForm.errors.siblingName
              ? addSiblingDetailsForm.errors.siblingName
              : ""
          }
          onChange={addSiblingDetailsForm.handleChange}
          onBlur={addSiblingDetailsForm.handleBlur}
        />
        {/* <SelectInput
              name="name"
              labelText="ame"
              value={addSiblingDetailsForm.values.name}
              onChange={addSiblingDetailsForm.handleChange}
              menuItems={selectData3}
              valueKey="year"
              textKey="year"
              formgroupClassName="tw-mb-0"
            /> */}
      </div>
      {/* {addSiblingDetailsForm.values.inSameSchool && <div className='col-md-6'>
          <SelectInput
            name="siblingCampusTypeId"
            labelText="Campus"
            value={addSiblingDetailsForm.values.siblingCampusTypeId}
            onChange={addSiblingDetailsForm.handleChange}
            menuItems={CampusTypeOptions}
            valueKey="campusTypeId"
            textKey="campusType"
            isDisabled={addSiblingDetailsForm.values.inSameSchool}
            invalid={
              addSiblingDetailsForm.touched.siblingCampusTypeId &&
                addSiblingDetailsForm.errors.siblingCampusTypeId
                ? true
                : false
            }
            error={
              addSiblingDetailsForm.touched.siblingCampusTypeId &&
                addSiblingDetailsForm.errors.siblingCampusTypeId
                ? addSiblingDetailsForm.errors.siblingCampusTypeId
                : ""
            }
            formgroupClassName="tw-mb-0"
          />
        </div>} */}

      {/* Curriculum */}
      {addSiblingDetailsForm.values.inSameSchool === "true" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          {/* <TextInput
                name='curriculum'
                labelText='Curriculum'
                value={addSiblingDetailsForm.values.curriculum}
                onChange={addSiblingDetailsForm.handleChange}
            /> */}
        {/* <SelectInput
            name="siblingCurriculumId"
            labelText="Curriculum"
            value={addSiblingDetailsForm.values.siblingCurriculumId}
            onChange={ChangeHandler}
            onBlur={addSiblingDetailsForm.handleBlur}
            menuItems={CurriculumList || []}
            valueKey="branchCurriculumId"
            textKey="curriculumName"
            isDisabled={addSiblingDetailsForm.values.inSameSchool}
            invalid={
              addSiblingDetailsForm.touched.siblingCurriculumId &&
                addSiblingDetailsForm.errors.siblingCurriculumId
                ? true
                : false
            }
            error={
              addSiblingDetailsForm.touched.siblingCurriculumId &&
                addSiblingDetailsForm.errors.siblingCurriculumId
                ? addSiblingDetailsForm.errors.siblingCurriculumId
                : ""
            }
            formgroupClassName="tw-mb-0"
          /> */}
          <TextInput
          name='siblingCurriculumName'
          labelText='Curriculum'
          value={addSiblingDetailsForm.values.siblingCurriculumName}
          isDisabled={addSiblingDetailsForm.values.inSameSchool === "true"}
          isReadOnly={addSiblingDetailsForm.values.inSameSchool === "true"}
          // formgroupClassName="tw-mb-0"
          invalid={
            addSiblingDetailsForm.touched.siblingCurriculumName &&
              addSiblingDetailsForm.errors.siblingCurriculumName
              ? true
              : false
          }
          error={
            addSiblingDetailsForm.touched.siblingCurriculumName &&
              addSiblingDetailsForm.errors.siblingCurriculumName
              ? addSiblingDetailsForm.errors.siblingCurriculumName
              : ""
          }
          onChange={addSiblingDetailsForm.handleChange}
          onBlur={addSiblingDetailsForm.handleBlur}
        />
        </div>
      )}

      {/* Class */}
      {addSiblingDetailsForm.values.inSameSchool === "true" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          {/* <TextInput
                name='class'
                labelText='Class'
                value={addSiblingDetailsForm.values.class}
                onChange={addSiblingDetailsForm.handleChange}
            /> */}
        {/* <SelectInput
            name="siblingClassName"
            labelText="Class"
            value={addSiblingDetailsForm.values.siblingClassName}
            onChange={ChangeHandler}
            onBlur={addSiblingDetailsForm.handleBlur}
            menuItems={ClassList || []}
            valueKey="classId"
            textKey="shortName"
            isDisabled={addSiblingDetailsForm.values.inSameSchool}
            invalid={
              addSiblingDetailsForm.touched.siblingClassName &&
                addSiblingDetailsForm.errors.siblingClassName
                ? true
                : false
            }
            error={
              addSiblingDetailsForm.touched.siblingClassName &&
                addSiblingDetailsForm.errors.siblingClassName
                ? addSiblingDetailsForm.errors.siblingClassName
                : ""
            }
            formgroupClassName="tw-mb-0"
          /> */}
          <TextInput
          name='siblingClassName'
          labelText='Class'
          value={addSiblingDetailsForm.values.siblingClassName}
          isDisabled={addSiblingDetailsForm.values.inSameSchool === "true"}
          isReadOnly={addSiblingDetailsForm.values.inSameSchool === "true"}
          invalid={
            addSiblingDetailsForm.touched.siblingClassName &&
              addSiblingDetailsForm.errors.siblingClassName
              ? true
              : false
          }
          error={
            addSiblingDetailsForm.touched.siblingClassName &&
              addSiblingDetailsForm.errors.siblingClassName
              ? addSiblingDetailsForm.errors.siblingClassName
              : ""
          }
          onChange={addSiblingDetailsForm.handleChange}
          onBlur={addSiblingDetailsForm.handleBlur}
        />
        </div>
      )}

      {/* Section */}
      {addSiblingDetailsForm.values.inSameSchool === "true" && (
        <div className="tw-col-span-12 md:tw-col-span-6">
          {/* <TextInput
                name='section'
                labelText='Section'
                value={addSiblingDetailsForm.values.section}
                onChange={addSiblingDetailsForm.handleChange}
            /> */}
        {/* <SelectInput
            name="siblingSectionId"
            labelText="Section"
            value={addSiblingDetailsForm.values.siblingSectionId}
            onChange={addSiblingDetailsForm.handleChange}
            onBlur={addSiblingDetailsForm.handleBlur}
            menuItems={sectionList}
            valueKey="section"
            textKey="section"
            isDisabled={addSiblingDetailsForm.values.inSameSchool}
            invalid={
              addSiblingDetailsForm.touched.siblingSectionId &&
                addSiblingDetailsForm.errors.siblingSectionId
                ? true
                : false
            }
            error={
              addSiblingDetailsForm.touched.siblingSectionId &&
                addSiblingDetailsForm.errors.siblingSectionId
                ? addSiblingDetailsForm.errors.siblingSectionId
                : ""
            }
            formgroupClassName="tw-mb-0"
          /> */}
          <TextInput
          name='siblingSectionName'
          labelText='Section'
          value={addSiblingDetailsForm.values.siblingSectionName}
          isDisabled={addSiblingDetailsForm.values.inSameSchool === "true"}
          isReadOnly={addSiblingDetailsForm.values.inSameSchool === "true"}
          invalid={
            addSiblingDetailsForm.touched.siblingSectionId &&
              addSiblingDetailsForm.errors.siblingSectionId
              ? true
              : false
          }
          error={
            addSiblingDetailsForm.touched.siblingSectionId &&
              addSiblingDetailsForm.errors.siblingSectionId
              ? addSiblingDetailsForm.errors.siblingSectionId
              : ""
          }
          onChange={addSiblingDetailsForm.handleChange}
          onBlur={addSiblingDetailsForm.handleBlur}
        />
        </div>
      )}

      {/* Outside School */}
      {addSiblingDetailsForm.values.inSameSchool === "false" && (
        <div className="tw-col-span-12">
          <TextInput
          name='siblingDetails'
          labelText='Sibling Details'
          value={addSiblingDetailsForm.values.siblingDetails}
          // isDisabled={addSiblingDetailsForm.values.inSameSchool}
          invalid={
            addSiblingDetailsForm.touched.siblingDetails &&
              addSiblingDetailsForm.errors.siblingDetails
              ? true
              : false
          }
          error={
            addSiblingDetailsForm.touched.siblingDetails &&
              addSiblingDetailsForm.errors.siblingDetails
              ? addSiblingDetailsForm.errors.siblingDetails
              : ""
          }
          onChange={addSiblingDetailsForm.handleChange}
          onBlur={addSiblingDetailsForm.handleBlur}
        />
        </div>
      )}

      {/* Buttons */}
      <div className="tw-col-span-12 tw-flex tw-justify-end tw-gap-3 tw-mt-4">
        <Button
          type="button"
          variant='secondary'
          onClick={props.toggle}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant='primary'
          onClick={(e: any) => addSiblingDetailsForm.handleSubmit(e)}
          disabled={showApiLoader}
        >
          {props.editData ? "Update" : "Submit"}
        </Button>
      </div>
    </div>

  )
}

export default AddSiblingModal

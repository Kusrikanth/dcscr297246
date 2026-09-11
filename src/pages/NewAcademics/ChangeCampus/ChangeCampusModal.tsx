import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import {
  SelectInput,
  TextInput, AutoSearchInputUpdated
} from "../../../Components/Common";
import { useFormik } from "formik";
import { toast } from "react-toastify";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";

import {
  addChangeCampusAct, updateChangeCampusAct, changeCampusCurriculumAct,
  setChangeCampusCurriculumAct,
  campusChangeStudentListAct,
  setCampusChangeStudentListAct,
  addChangeCampusDpsAct
} from "../../../store/academic/academicRequest/academicrequestactions";
import { getParticularFormatDate } from "../../../utility/dateutility";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year required."),
  newAcademicYearId: Yup.string().required("Change Academic year required."),
  studentId: Yup.string().required("Student required."),
  newCampusId: Yup.string().required("Campus required."),
  newCurriculumId: Yup.string().required("Curriculum required."),
  newClassId: Yup.string().required("Class required."),
});

function getChangeCampusModalState(feeDetails?: any, academicYearId?: string, newAcademicYearId?: string) {
  return ({
    academicYearId: academicYearId || "",
    newAcademicYearId: newAcademicYearId || "",
    curriculumName: "",
    className: "",
    dateOfAdmission: "",
    studentId: "",
    newCampusId: "",
    newCurriculumId: "",
    newClassId: "",
  })
}

const ChangeCampusModal = (props: any) => {
  const { instituteId, branchId, academicYearId, newAcademicYearId, editChangeCampusDetails, directory } = props;
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const dispatch = useAppDispatch();
  const { showApiLoader, branchClassResp, academicYearListResp,
    branchListResp, changeCampusCurriculumResp, addChangeCampusResp, addChangeCampusDpsResp,
    campusChangeStudentListResp, updateChangeCampusResp } =
    useAppSelector(({ branch, branchAcademics, instAcademics, globalData, academicRequest }) => ({
      showApiLoader: globalData.showApiLoader,
      branchClassResp: branchAcademics.branchClassResp,
      academicYearListResp: instAcademics.academicYearListResp,
      branchListResp: branch.branchListResp,
      changeCampusCurriculumResp: academicRequest.changeCampusCurriculumResp,
      addChangeCampusResp: academicRequest.addChangeCampusResp,
      addChangeCampusDpsResp: academicRequest.addChangeCampusDpsResp,
      campusChangeStudentListResp: academicRequest.campusChangeStudentListResp,
      updateChangeCampusResp: academicRequest.updateChangeCampusResp
    }), shallowEqual);

  const changeCampusModalResp = useRef({
    prevAddChangeCampusResp: addChangeCampusResp,
    prevAddChangeCampusDpsResp: addChangeCampusDpsResp,
    prevUpdateChangeCampusResp: updateChangeCampusResp
  });

  useEffect(() => {
    const { prevAddChangeCampusResp, prevAddChangeCampusDpsResp, prevUpdateChangeCampusResp } = changeCampusModalResp.current;
    if (addChangeCampusResp && prevAddChangeCampusResp !== addChangeCampusResp) {
      toast.success("Change campus request created successfully.");
      props.toggle(true);
    } 
    else if (addChangeCampusDpsResp && prevAddChangeCampusDpsResp !== addChangeCampusDpsResp) {
      toast.success("Change campus request created successfully.");
      props.toggle(true);
    } else if (updateChangeCampusResp && prevUpdateChangeCampusResp !== updateChangeCampusResp) {
      toast.success("Change campus request updated successfully.");
      props.toggle(true);
    }
    changeCampusModalResp.current.prevAddChangeCampusResp = addChangeCampusResp;
    changeCampusModalResp.current.prevAddChangeCampusDpsResp = addChangeCampusDpsResp;
    changeCampusModalResp.current.prevUpdateChangeCampusResp = updateChangeCampusResp;
  }, [addChangeCampusResp, addChangeCampusDpsResp, updateChangeCampusResp]);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100 };
      dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
    }
    if (branchId) {
      const brchCurriculumparams = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
    }
  }, [instituteId, branchId, academicYearId]);

  const initialValues = getChangeCampusModalState(undefined, academicYearId, newAcademicYearId);

  const changeCampusForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        academicYearId: values.academicYearId,
        newAcademicYearId: values.newAcademicYearId,
        studentId: values.studentId,
        newCampusId: values.newCampusId,
        newCurriculumId: values.newCurriculumId,
        newClassId: values.newClassId,
      };

      if (instituteId === 1) {
        dispatch(
          addChangeCampusDpsAct(
            generateActionPayload("add_change_campus_dps", undefined, payload)
          )
        );
      } else {
        dispatch(
          addChangeCampusAct(
            generateActionPayload("add_change_campus", undefined, payload)
          )
        );
      }
    },
  });

  

  function getClassApiCall(campusId: any, curriculumId: any) {
    if (!campusId || !curriculumId) {
      return;
    }
    const payload = {
      curriculumId, branchId: campusId,academicYearId : changeCampusForm.values.newAcademicYearId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function getCurriculumApiCall(campusId?: any) {
    const params = { branchId: campusId,academicYearId : changeCampusForm.values.newAcademicYearId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(changeCampusCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, params)));
  }

  function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      updateFormValues = { ...changeCampusForm.values };
    if (name === "academicYearId") {
      dispatch(setCampusChangeStudentListAct(undefined));
      Object.assign(updateFormValues, {
        [name]: value, curriculumName: "",
        className: "", dateOfAdmission: ""
      });
      setSearchStudentState(null);
    } else if (name === "newAcademicYearId") {
      dispatch(setChangeCampusCurriculumAct(undefined));
      dispatch(setBrchClassAct(undefined));

      Object.assign(updateFormValues, {
        [name]: value,
        newCurriculumId: "",
        newClassId: ""
      });

      if (value && updateFormValues.newCampusId) {
        getCurriculumApiCall(updateFormValues.newCampusId);
      }
    }
    else if (name === "newCampusId") {
      dispatch(setChangeCampusCurriculumAct(undefined));
      dispatch(setBrchClassAct(undefined));

      Object.assign(updateFormValues, { [name]: value, newCurriculumId: "", newClassId: "" });

      if (value && updateFormValues.newAcademicYearId) {
        getCurriculumApiCall(value);
      }
    } else if (name === "newCurriculumId") {
      if (value) {
        getClassApiCall(updateFormValues.newCampusId, value);
      }
      dispatch(setBrchClassAct(undefined));
      Object.assign(updateFormValues, { [name]: value, newClassId: "" })
    }
    changeCampusForm.setValues((prevState) => ({ ...prevState, ...updateFormValues }))
  }

  //Auto Search Input Handler

  function onInputSearchChange(inputString: any) {
    const { academicYearId } = changeCampusForm.values;
    if (!academicYearId) {
      return;
    }
    const params = {
      branchId: props.branchId, academicYearId, pageNo: 0, pageSize: 20,
      searchString: inputString
    };
    dispatch(campusChangeStudentListAct(generateActionPayload("get_change_campus_student", undefined, params)));
  }

  useEffect(() => {
   if(directory && editChangeCampusDetails){
    const inputString =  editChangeCampusDetails?.studentCode;
    const params = {
      branchId: props.branchId, academicYearId, pageNo: 0, pageSize: 20,
      searchString: inputString
    };
    dispatch(campusChangeStudentListAct(generateActionPayload("get_change_campus_student", undefined, params)));
   }
  }, [directory, editChangeCampusDetails]);

  useEffect(() => {
    if (directory && campusChangeStudentListResp) {
      const selectedStudent = campusChangeStudentListResp[0]
      
      selectedStudentHndlr(selectedStudent);
      changeCampusForm.setFieldValue("studentId", selectedStudent?.studentId);
      changeCampusForm.setFieldValue("curriculumName", selectedStudent?.studentCurriculumName);
      changeCampusForm.setFieldValue("className", selectedStudent?.studentClassName);
      changeCampusForm.setFieldValue("dateOfAdmission", getParticularFormatDate(selectedStudent?.dateOfAdmission, "dd-MM-yyyy") || "");
    }
  }, [campusChangeStudentListResp, directory]);

  function selectedStudentHndlr(selectedStudent: any) {
    setSearchStudentState(selectedStudent);
    changeCampusForm.setValues((prevState) => ({
      ...prevState,
      curriculumName: selectedStudent?.studentCurriculumName || "",
      studentId: selectedStudent?.studentId || "",
      className: selectedStudent?.studentClassName || "",
      dateOfAdmission: selectedStudent?.dateOfAdmission ? (getParticularFormatDate(selectedStudent?.dateOfAdmission, "dd-MM-yyyy") || "") : ""
    }));
  }

  const filteredAcademicYears = useMemo(() => {
    const list = academicYearListResp?.data || [];
    const selectedYearId = Number(changeCampusForm.values.academicYearId);

    if (!selectedYearId) return [];

    return list.filter((year: any) => year.academicYearId >= selectedYearId);
  }, [academicYearListResp, changeCampusForm.values.academicYearId]);

  const campusList = useMemo(() => {
    const { data } = branchListResp || {};
    if (Array.isArray(data)) {
      return data.filter(item => item.branchId?.toString() !== props.branchId?.toString());
    }
    return [];
  }, [props.branchId, branchListResp]);

  return (
    <form onSubmit={changeCampusForm.handleSubmit}>

      <div className="tw-p-6">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-6">

          {/* Academic Year */}
          <div className="tw-col-span-1">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              labelClass="required"
              value={changeCampusForm.values.academicYearId}
              onChange={onChangeHndlr}
              onBlur={changeCampusForm.handleBlur}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              isDisabled={props.directory}
              invalid={(changeCampusForm.touched.academicYearId && changeCampusForm.errors.academicYearId) ? true : false}
              error={(changeCampusForm.touched.academicYearId && changeCampusForm.errors.academicYearId) ? changeCampusForm.errors.academicYearId : ""}
            />
          </div>

          {/* Student Search */}
          <div className="tw-col-span-1">
            <AutoSearchInputUpdated
              formgroupClassName="search-box"
              name="studentId"
              labelText="Search Student"
              labelClass="required"
              placeHolder="Search"
              onChange={onInputSearchChange}
              onBlur={changeCampusForm.handleBlur}
              valueKey="studentId"
              labelHeader="Student Code"
              labelKey="studentCodeNum"
              subLabelHeader="Student Name"
              subLabelKey="studentName"
              isDisabled={props.directory}
              options={campusChangeStudentListResp}
              selected={searchStudentState}
              selectedOptionCallbck={selectedStudentHndlr}
              invalid={(changeCampusForm.touched.studentId && changeCampusForm.errors.studentId) ? true : false}
              error={(changeCampusForm.touched.studentId && changeCampusForm.errors.studentId) ? changeCampusForm.errors.studentId : ""}
            ><i className="ri-search-line search-icon"></i>
            </AutoSearchInputUpdated>
          </div>

          {/* Curriculum */}
          <div className="tw-col-span-1 md:tw-col-span-2">
            <TextInput
              name="curriculumName"
              labelText="Curriculum"
              value={changeCampusForm.values.curriculumName}
              onChange={onChangeHndlr}
              onBlur={changeCampusForm.handleBlur}
              formgroupClassName="tw-mb-0"
              isDisabled={true}
            />
          </div>

          {/* Previous Class */}
          <div>
            <TextInput
              name="className"
              labelText="Previous Studied Class"
              value={changeCampusForm.values.className}
              onChange={changeCampusForm.handleChange}
              formgroupClassName="tw-mb-0"
              isDisabled={true}
            />
          </div>

          {/* Admission Date */}
          <div>
            <TextInput
              name="dateOfAdmission"
              labelText="Date Of Admission"
              labelClass="required"
              value={changeCampusForm.values.dateOfAdmission}
              onChange={changeCampusForm.handleChange}
              formgroupClassName="tw-mb-0"
              isDisabled={true}
            />
          </div>

          {/* Change Campus */}
          <div>
            <SelectInput
              name="newCampusId"
              labelText="Change Campus"
              labelClass="required"
              value={changeCampusForm.values.newCampusId}
              onChange={onChangeHndlr}
              onBlur={changeCampusForm.handleBlur}
              menuItems={campusList}
              formgroupClassName="tw-mb-0"
              valueKey="branchId"
              textKey="branchName"
              invalid={(changeCampusForm.touched.newCampusId && changeCampusForm.errors.newCampusId) ? true : false}
              error={(changeCampusForm.touched.newCampusId && changeCampusForm.errors.newCampusId) ? changeCampusForm.errors.newCampusId : ""}
            />
          </div>

          <div>
            <SelectInput
               name="newAcademicYearId"
              labelText="Change Academic Year"
              labelClass="required"
              value={changeCampusForm.values.newAcademicYearId}
              onChange={onChangeHndlr}
              onBlur={changeCampusForm.handleBlur}
              menuItems={filteredAcademicYears}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              isDisabled={props.directory}
              invalid={(changeCampusForm.touched.newAcademicYearId && changeCampusForm.errors.newAcademicYearId) ? true : false}
              error={(changeCampusForm.touched.newAcademicYearId && changeCampusForm.errors.newAcademicYearId) ? changeCampusForm.errors.newAcademicYearId : ""}
            />
          </div>

          {/* Change Curriculum */}
          <div>
            <SelectInput
              name="newCurriculumId"
              labelText="Change Curriculum"
              labelClass="required"
              value={changeCampusForm.values.newCurriculumId}
              onChange={onChangeHndlr}
              onBlur={changeCampusForm.handleBlur}
              menuItems={changeCampusCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="tw-mb-0"
              invalid={(changeCampusForm.touched.newCurriculumId && changeCampusForm.errors.newCurriculumId) ? true : false}
              error={(changeCampusForm.touched.newCurriculumId && changeCampusForm.errors.newCurriculumId) ? changeCampusForm.errors.newCurriculumId : ""}

            />
          </div>

          {/* Change Class */}
          <div>
            <SelectInput
              name="newClassId"
              labelText="Change Class"
              labelClass="required"
              value={changeCampusForm.values.newClassId}
              onChange={changeCampusForm.handleChange}
              onBlur={changeCampusForm.handleBlur}
              menuItems={branchClassResp?.content}
              formgroupClassName="tw-mb-0"
              valueKey="id"
              textKey="shortName"
              invalid={(changeCampusForm.touched.newClassId && changeCampusForm.errors.newClassId) ? true : false}
              error={(changeCampusForm.touched.newClassId && changeCampusForm.errors.newClassId) ? changeCampusForm.errors.newClassId : ""}
            />
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="tw-border-t tw-pt-4 tw-px-6 tw-pb-6 tw-flex tw-justify-end tw-gap-2 tw-shadow-inner">

        <Button
          type="button"
          variant="secondary"
          onClick={props.toggle}
          disabled={showApiLoader}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          disabled={showApiLoader}
        >
          Submit
        </Button>

      </div>

    </form>
  );
};

export default ChangeCampusModal;

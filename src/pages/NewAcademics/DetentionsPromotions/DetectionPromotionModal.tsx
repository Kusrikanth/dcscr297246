import React, { useEffect, useState } from "react";
import {
  AutoSearchInput,
  SelectInput,
  TextInput,
} from "../../../Components/Common";
import { Col, Row } from "reactstrap";
import {
  DetectionPromotionModalFilterhProps,
  DetectionPromotionModalProps,
} from "./DetectionPromotionTypes";
import { useFormik } from "formik";
import {  selectData7 } from "./helper";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getNotDetentionedPromotionedStudentList, getPromotedOrDetainedClassList, resetDetainedOrPromotedClassList, resetNotDetentionedPromotionedStudentList, setPromotionDetentionStudent } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import * as Yup from 'yup';
import { getAssignCurriculumListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { resetAssignLanClassListAct } from "../../../store/assignlanguages/assignlanguagesslice";
import Button from "../../../Components/Common/Button";

const initialValues: DetectionPromotionModalFilterhProps = {
  academicYearId: "",
  branchCurriculumId: "",
  studentId: "",
  prevStudiedClass: "",
  promotedDetained: "",
  detainedOrPromotedToClass: "",
};

const DetectionPromotionModal = (props: DetectionPromotionModalProps) => {
  const dispatch = useDispatch();
  const [
    detectionPromotionModalFilterState,
    setDetectionPromotionModalFilterState,
  ] = useState<DetectionPromotionModalFilterhProps>(initialValues);
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const [currentAcademicYear, setCurrentAcademicYear] = useState<any>()

  const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    branchCurriculumId: Yup.string().required("Curriculum is required."),
    studentId: Yup.string().required("Student is required."),
    promotedDetained: Yup.string().required("Promoted or Detained status is required."),
    detainedOrPromotedToClass: Yup.string().required("Promoted or Detained to Class is required."),


  });

  const DetectionPromotionModalFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: detectionPromotionModalFilterState,
    validationSchema,
    onSubmit: (values) => {
      const payload = { academicStudentId: values.studentId, curriculumId: values.branchCurriculumId, academicYearId: values.academicYearId, detainedOrPromoted: values.promotedDetained, classId: searchStudentState.classId, detainedOrPromotedToClass: values.detainedOrPromotedToClass }
      dispatch(setPromotionDetentionStudent(generateActionPayload('promote_or_detaine_student', undefined, payload)))

    },
  });

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    DetectionPromotionModalFilterForm.handleChange(event)
    const { branchCurriculumId } = DetectionPromotionModalFilterForm.values;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetAssignLanClassListAct(undefined))
      dispatch(resetDetainedOrPromotedClassList(undefined))
      DetectionPromotionModalFilterForm.setValues((prevState) => ({ ...prevState, [name]: value, branchCurriculumId: "", studentId: "", prevStudiedClass: "",promotedDetained: "",  detainedOrPromotedToClass: "" }));
      setSearchStudentState(null)
    }
    else if (name === "branchCurriculumId") {
      if (!value) {
        dispatch(resetDetainedOrPromotedClassList(undefined));
      }
      else {
        dispatch(resetDetainedOrPromotedClassList(undefined));
        DetectionPromotionModalFilterForm.setValues((prevState) => ({ ...prevState, [name]: value, studentId: "", prevStudiedClass: "",promotedDetained: "",  detainedOrPromotedToClass: "" }));
        setSearchStudentState(null)
      }
    }
    else if (name === "promotedDetained") {
      const params = { curriculumId: branchCurriculumId, eligibilityStatusDetentionAndPromotion: value, branchClassId: searchStudentState.classId, academicYearId: DetectionPromotionModalFilterForm.values.academicYearId }
      dispatch(getPromotedOrDetainedClassList(generateActionPayload('promoted_or_detained_class_list', undefined, params)))
    }
  }

  function onInputSearchChange(inputString: any) {
    // dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
    //   branchId, academicYearId: filterState.academicYearId,
    //   studentName: inputString || "a"
    // })));
    let params = {
      academicYearId: DetectionPromotionModalFilterForm.values.academicYearId,
      branchCurriculumId: DetectionPromotionModalFilterForm.values.branchCurriculumId,
      searchString: inputString,
      currentAcademicYearId: currentAcademicYear && currentAcademicYear.academicYearId
    }
    if (params.academicYearId && params.branchCurriculumId) {
      dispatch(getNotDetentionedPromotionedStudentList(generateActionPayload('not_promotion_detention_students', undefined, params)));
    }
  }

  function selectedStudentHndlr(selectedStudent: any) {
    DetectionPromotionModalFilterForm.setValues((prev: any) => ({ ...prev, studentId: selectedStudent.studentId }))
    setSearchStudentState(selectedStudent);
    // const payload1 = { branchId: branchId, curriculumId: selectedStudent.studentCurriculumId, classId: selectedStudent.studentClassId, sortBy: "streamGroupName", orderBy: "asc" }
    //   dispatch(
    //     getStreamList(
    //       generateActionPayload("get_stream_list", undefined, payload1)
    //     )
    //   );
  }

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, notDetentionedPromotionedStudends, detainedOrPromotedClasses,showApiLoader,getAssignListCurriculumResp }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo,globalData,assignLanguages }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        notDetentionedPromotionedStudends: classroomManagmentInfo.notDetentionedPromotionedStudends,
        detainedOrPromotedClasses: classroomManagmentInfo.detainedOrPromotedClasses,
        showApiLoader:globalData.showApiLoader,
        getAssignListCurriculumResp:assignLanguages.getAssignListCurriculumResp
      }),
      shallowEqual
    );

    const getCurriculumApiCall = (otherProps?: any) => {
      const payload1 = { academicYearId: DetectionPromotionModalFilterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
      dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  useEffect(() => {
    if (!props.isOpen) {
      DetectionPromotionModalFilterForm.resetForm();
      setSearchStudentState(null);
      dispatch(resetNotDetentionedPromotionedStudentList(undefined));
    }
  }, [props.isOpen])

  useEffect(() => {
    if (academicYearListResp) {
      let yearDetails = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current");
      setCurrentAcademicYear(yearDetails);
      DetectionPromotionModalFilterForm.setFieldValue('academicYearId', yearDetails.academicYearId);
      getCurriculumApiCall({academicYearId: yearDetails.academicYearId})
    }
  }, [academicYearListResp])

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {};

  return (
    <>
      <div className="tw-p-6">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-6">
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={DetectionPromotionModalFilterForm.values.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelClass="required"
              formgroupClassName="tw-mb-0"
              invalid={(DetectionPromotionModalFilterForm.touched.academicYearId && DetectionPromotionModalFilterForm.errors.academicYearId) ? true : false}
              error={(DetectionPromotionModalFilterForm.touched.academicYearId && DetectionPromotionModalFilterForm.errors.academicYearId) ? DetectionPromotionModalFilterForm.errors.academicYearId : ""}
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="branchCurriculumId"
              labelText="Curriculum"
              value={DetectionPromotionModalFilterForm.values.branchCurriculumId}
              onChange={filterHandler}
              menuItems={curriculumTypes}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelClass="required"
              formgroupClassName="tw-mb-0"
              invalid={(DetectionPromotionModalFilterForm.touched.branchCurriculumId && DetectionPromotionModalFilterForm.errors.branchCurriculumId) ? true : false}
              error={(DetectionPromotionModalFilterForm.touched.branchCurriculumId && DetectionPromotionModalFilterForm.errors.branchCurriculumId) ? DetectionPromotionModalFilterForm.errors.branchCurriculumId : ""}
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
              subLabelKey="studentCode"
              labelHeader="Student Code"
              subLabelHeader="Student Name"
              labelClass="required"
              options={notDetentionedPromotionedStudends || []}
              selected={searchStudentState}
              selectedOptionCallbck={selectedStudentHndlr}
              labelText="Student"
              invalid={(DetectionPromotionModalFilterForm.touched.studentId && DetectionPromotionModalFilterForm.errors.studentId) ? true : false}
              error={(DetectionPromotionModalFilterForm.touched.studentId && DetectionPromotionModalFilterForm.errors.studentId) ? DetectionPromotionModalFilterForm.errors.studentId : ""}
            >
              <i className="ri-search-line search-icon"></i>
            </AutoSearchInput>
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="prevStudiedClass"
              labelText="Previous Studied Class"
              value={searchStudentState?.className}
              onChange={filterHandler}
              formgroupClassName="tw-mb-0"
              inputClassName="tw-bg-gray-100"
              labelClass="required"
              isReadOnly
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="promotedDetained"
              labelText="Promoted or Detained"
              value={DetectionPromotionModalFilterForm.values.promotedDetained}
              onChange={filterHandler}
              menuItems={selectData7}
              valueKey="promotedDetainedId"
              textKey="promotedDetainedType"
              formgroupClassName="tw-mb-0"
              invalid={(DetectionPromotionModalFilterForm.touched.promotedDetained && DetectionPromotionModalFilterForm.errors.promotedDetained) ? true : false}
              error={(DetectionPromotionModalFilterForm.touched.promotedDetained && DetectionPromotionModalFilterForm.errors.promotedDetained) ? DetectionPromotionModalFilterForm.errors.promotedDetained : ""}
            />
          </div>
          {DetectionPromotionModalFilterForm.values.promotedDetained !== "" && (
            <div className="tw-col-span-12">
              <SelectInput
                name="detainedOrPromotedToClass"
                labelText="Detained or Promoted to Class"
                value={DetectionPromotionModalFilterForm.values.detainedOrPromotedToClass}
                onChange={filterHandler}
                menuItems={detainedOrPromotedClasses}
                valueKey="classId"
                textKey="classShortName"
                labelClass="required"
                formgroupClassName="tw-mb-0"
                invalid={(DetectionPromotionModalFilterForm.touched.detainedOrPromotedToClass && DetectionPromotionModalFilterForm.errors.detainedOrPromotedToClass) ? true : false}
                error={(DetectionPromotionModalFilterForm.touched.detainedOrPromotedToClass && DetectionPromotionModalFilterForm.errors.detainedOrPromotedToClass) ? DetectionPromotionModalFilterForm.errors.detainedOrPromotedToClass : ""}
              />
            </div>
          )}
        </div>
        <div className="tw-flex tw-justify-end tw-gap-3">
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
              DetectionPromotionModalFilterForm.handleSubmit(event)
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

export default DetectionPromotionModal;

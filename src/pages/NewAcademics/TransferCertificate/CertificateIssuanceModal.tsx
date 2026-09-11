import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  DateInput,
  MultiSelectCheckbox,
  RadioInputContainer,
  SelectInput,
  TextInput,
  TextInputWithRegex,
} from "../../../Components/Common";
import {
  CertificateIssuanceDataTypes,
} from "./transferCertificateTypes";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Row, Col } from "reactstrap";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { fetchStudentAcademicYearDataAct, getInitialTcIssuance, getTcIssuanceByIdAct, setCertificateIssuance, updateTcIssuanceAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getNationalityAct } from "../../../store/masterdata/masterdataactions";
import { getCurriculumWIseClassAct, getBranchClassAct, getBranchCurriculumAct, setBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { yesNoRadioOptions } from "../../../Components/constants/common";
import { getAssignedClassSubjectsList } from "../../../store/academic/classSubjects/classsubjectsactions";
import { toast } from "react-toastify";
import { classCompletionOptions } from "./helper";
import { SelectOptGrup } from "../../../Components/Common/SelectOptGrup";
import Button from "../../../Components/Common/Button";
import { getInstClassForBranchAct } from "../../../store/mastersettings/instacademics/instacademicactions";


function getFormData(editData?: any) {
  return ({
    academicYearId: editData?.academicYearId || "",
    curriculumId: editData?.curriculumId || "",
    studentName: editData?.studentName || "",
    className: editData?.className || "",
    sectionName: editData?.sectionName || "",
    lastAttendedDate: editData?.lastAttendedDate || "",
    fromClassId: editData?.fromClassId || "",
    toClassId: editData?.toClassId || "",
    currentStatus: editData?.currentStatus || "",
    toStatus: editData?.toStatus || "",
    certificateType: "Transfter Certificate",
    fatherName: editData?.fatherName || "",
    motherName: editData?.motherName || "",
    subjectNames: editData?.subjectNames || "",
    nationalityId: editData?.nationalityId || "",
    studentCastOrScheduleTribe: editData?.studentCastOrScheduleTribe || "",
    fromCurriculumId: editData?.fromCurriculumId || "",
    dateOfAdmission: editData?.dateOfAdmission || "",
    fromYear: editData?.fromYear || "",
    toYear: editData?.toYear || "",
    passedAndPromotedToClassId: editData?.passedAndPromotedToClassId || "",
    promotedClassText: editData?.promotedClassText || "",
    detainedInClassId: editData?.detainedInClassId || "",
    detainedClassText: editData?.detainedClassText || "",
    dateOfBirthInWords: editData?.dateOfBirthInWords || "",
    whetherFailed: editData?.whetherFailed || "",
    nccAndOtherDetails: editData?.nccAndOtherDetails || "",
    gameExtraCurActivities: editData?.gameExtraCurActivities || "",
    lastAnnualExamResultsAndBoardDetails: editData?.lastAnnualExamResultsAndBoardDetails || "",
    generalConduct: editData?.generalConduct || "",
    reasonForLeaving: editData?.reasonForLeaving || "",
    otherRemarks: editData?.otherRemarks || "",
    noOfWorkingDays: editData?.noOfWorkingDays || "",
    noOfPresentDays: editData?.noOfPresentDays || "",
    lastClassStudied: editData?.lastClassStudied || "",
    concession: editData?.concession || "",
    monthName: editData?.monthName || "",
    dateOfBirth: editData?.dateOfBirth || "",
    admissionNumber: editData?.admissionNumber || "",
    dateOfIssuance: editData?.dateOfIssuance || "",
    penNo: editData?.penNo || "",
    isProofDOBInAdm: editData?.isProofDOBInAdm || "No",
    schoolIsUnder: editData?.schoolIsUnder || "",

    curriculumName: editData?.curriculumName || "",
    toClassName: editData?.toClassName || "",
    fromClassName: editData?.fromClassName || "",
    fromCurriculumName: editData?.fromCurriculumName || "",
    nationalityName: editData?.nationalityName || "",
    academicYearName: editData?.academicYearName || "",
    isClassValidationRequired: true,
  })
}

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().nullable().required("Academic year is required."),
  lastAttendedDate: Yup.string().nullable().required("Last attended date is required."),
  certificateType: Yup.string().nullable().required("Certificate type is required."),


  // fromCurriculumId: Yup.string().nullable().required("Curriculum is required."),
  fromClassId: Yup.string().nullable().required("From class is required."),
  toClassId: Yup.string().nullable().required("To class is required."),
  currentStatus: Yup.string().nullable().required("Current class status is required."),

  dateOfAdmission: Yup.string().required("Date of admission is required.").nullable(),
  fromYear: Yup.string().nullable().required("From year is required."),
  toYear: Yup.string().nullable().required("To year is required."),
  lastAnnualExamResultsAndBoardDetails: Yup.string().nullable().required("Last result is required."),
  generalConduct: Yup.string().nullable().required("General conduct is required."),
  reasonForLeaving: Yup.string().nullable().required("Reason for leaving is required."),
  noOfWorkingDays: Yup.number().nullable().required("Working days is required.").typeError("Enter a valid number."),
  noOfPresentDays: Yup.number().nullable().required("Present days is required.").typeError("Enter a valid number."),
  concession: Yup.string().required("Concession is required."),
  lastClassStudied: Yup.string().required("Last class studied is required."),
  dateOfIssuance: Yup.string().nullable().required("Date of issuance is required."),
  // passedAndPromotedToClassId: Yup.string().test("passAndPromotedValidation", "Either Passed and Promoted to Class or Detained in Class selection is required.",
  //   (value: any, schema: any) => {
  //     if (((value && schema?.parent?.detainedInClassId) || (!value && !schema?.parent?.detainedInClassId)) && schema?.parent?.isClassValidationRequired) {
  //       return false;
  //     }
  //     return true;
  //   }),

  // detainedInClassId: Yup.string().test("detainedInClassValidation", "Either Passed and Promoted to Class or Detained in Class selection is required.",
  //   (value: any, schema: any) => {
  //     if (((value && schema?.parent?.passedAndPromotedToClassId) || (!value && !schema?.parent?.passedAndPromotedToClassId)) && schema?.parent?.isClassValidationRequired) {
  //       return false;
  //     }
  //     return true;
  //   }),
});


const initialValues = getFormData();
const CertificateIssuanceModal = (props: any) => {
  const dispatch = useDispatch();
  const { currentBranchIdResp: branchId, brchCurriculumResp, updateTcIssuanceResp, branchClassResp, tcIssuanceByIdResp,
    currentInstIdResp: instituteId, initalTcIssuanceRes, assignedClassSubjectsListResp, nationalityResp, showApiLoader, fetchStudentAcademicYearDataResp, curriculumWiseResp, instClassForBranchResp } =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classSubjectsInfo, classroomManagmentInfo, masterData, globalData }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        tcRequestList: classroomManagmentInfo.tcRequestList,
        initalTcIssuanceRes: classroomManagmentInfo.initalTcIssuanceRes,
        tcIssuanceByIdResp: classroomManagmentInfo.tcIssuanceByIdResp,
        updateTcIssuanceResp: classroomManagmentInfo.updateTcIssuanceResp,
        assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
        nationalityResp: masterData.nationalityResp,
        showApiLoader: globalData.showApiLoader,
        fetchStudentAcademicYearDataResp: classroomManagmentInfo.fetchStudentAcademicYearDataResp,
        curriculumWiseResp: branchAcademics.curriculumWiseResp,
        instClassForBranchResp: instAcademics.instClassForBranchResp,
      }),
      shallowEqual
    );

  const certificateIssuanceRef = useRef({
    prevInitalTcIssuanceRes: initalTcIssuanceRes,
    prevUpdateTcIssuanceResp: updateTcIssuanceResp,
    prevTcIssuanceByIdResp: tcIssuanceByIdResp
  });

  useEffect(() => {
    const { prevInitalTcIssuanceRes, prevTcIssuanceByIdResp, prevUpdateTcIssuanceResp } = certificateIssuanceRef.current;
    if (initalTcIssuanceRes && prevInitalTcIssuanceRes !== initalTcIssuanceRes) {
      const formData = getFormData(initalTcIssuanceRes?.data);
      certificateIssuanceForm.resetForm({
        values: formData
      });

      const { academicYearId, classId, curriculumId, studentId } = initalTcIssuanceRes?.data || {};
      const payload = {
        academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: classId,
        sortBy: "subjectName", orderBy: "asc",
        pageNo: 0, pageSize: 100
      }
      if (payload.academicYearId && payload.branchClassId) {
        dispatch(
          getAssignedClassSubjectsList(
            generateActionPayload("get_assigned_class_subject_list", undefined, payload)
          )
        );
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, pageNo: 0, pageSize: 100 };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
      if (studentId) {
        const payload = { branchId: branchId};
        dispatch(fetchStudentAcademicYearDataAct(generateActionPayload("fetch_student_academic_year", { studentId }, payload)));
      }
      if (studentId) {
        const payload = { branchId: branchId};
        dispatch(getCurriculumWIseClassAct(generateActionPayload("get_curriculum_wise_class", undefined, payload)));
      }
    } else if (tcIssuanceByIdResp && prevTcIssuanceByIdResp !== tcIssuanceByIdResp) {
      const formData = getFormData(tcIssuanceByIdResp?.data);
      certificateIssuanceForm.resetForm({
        values: formData
      })

      const { academicYearId, classId, curriculumId, studentId } = tcIssuanceByIdResp?.data || {};
      const payload = {
        academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: classId,
        sortBy: "subjectName", orderBy: "asc",
        pageNo: 0, pageSize: 100
      }
      if (payload.academicYearId && payload.branchClassId) {
        dispatch(
          getAssignedClassSubjectsList(
            generateActionPayload("get_assigned_class_subject_list", undefined, payload)
          )
        );
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, pageNo: 0, pageSize: 100 };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
      if (studentId) {
        const payload = { branchId: branchId};
        dispatch(fetchStudentAcademicYearDataAct(generateActionPayload("fetch_student_academic_year", { studentId }, payload)));
      }
      if (studentId) {
        const payload = { branchId: branchId};
        dispatch(getCurriculumWIseClassAct(generateActionPayload("get_curriculum_wise_class", undefined, payload)));
      }
    } else if (updateTcIssuanceResp && prevUpdateTcIssuanceResp !== updateTcIssuanceResp) {
      toast.success('TC Issuance updated successfully.');
      props.toggle();
    }
    certificateIssuanceRef.current.prevInitalTcIssuanceRes = initalTcIssuanceRes;
    certificateIssuanceRef.current.prevTcIssuanceByIdResp = tcIssuanceByIdResp;
    certificateIssuanceRef.current.prevUpdateTcIssuanceResp = updateTcIssuanceResp;
  }, [initalTcIssuanceRes, updateTcIssuanceResp, tcIssuanceByIdResp]);
  
  useEffect(() => {
    if (instituteId && branchId) {
        const payload = { instituteId, branchId, pageNo: 0, pageSize: 100 };
        dispatch(getInstClassForBranchAct(generateActionPayload("get_inst_class_for_branch", undefined, payload)));
      }
  }, [instituteId, branchId]);

  const certificateIssuanceForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      // const { subjectNames } = values;
      // const subjectNamesList = Array.isArray(subjectNames) && subjectNames.map(item => item.shortCode).join(",") || "";
      let payload = {
        certificateType: values.certificateType,
        fatherName: values.fatherName,
        motherName: values.motherName,
        lastAttendedDate: values.lastAttendedDate,
        subjectNames: values.subjectNames,
        nationalityId: values.nationalityId,
        studentCastOrScheduleTribe: values.studentCastOrScheduleTribe,
        fromCurriculumId: values.fromCurriculumId,
        fromClassId: values.fromClassId,
        toClassId: values.toClassId,
        currentStatus: values.currentStatus,
        dateOfAdmission: values.dateOfAdmission,
        fromYear: values.fromYear,
        toYear: values.toYear,
        passedAndPromotedToClassId: values.passedAndPromotedToClassId,
        promotedClassText: values.promotedClassText,
        detainedInClassId: values.detainedInClassId,
        detainedClassText: values.detainedClassText,
        passedAndPromotedToClassName: "",
        dateOfBirth: values.dateOfBirth,
        dateOfBirthInWords: values.dateOfBirthInWords,
        whetherFailed: values.whetherFailed,
        nccAndOtherDetails: values.nccAndOtherDetails,
        gameExtraCurActivities: values.gameExtraCurActivities,
        generalConduct: values.generalConduct,
        reasonForLeaving: values.reasonForLeaving,
        lastAnnualExamResultsAndBoardDetails: values.lastAnnualExamResultsAndBoardDetails,
        otherRemarks: values.otherRemarks,
        noOfWorkingDays: values.noOfWorkingDays,
        noOfPresentDays: values.noOfPresentDays,
        lastClassStudied: values.lastClassStudied,
        concession: values.concession,
        admissionNumber: values.admissionNumber,
        dateOfIssuance: values.dateOfIssuance,
        isProofDOBInAdm: values.isProofDOBInAdm,
        schoolIsUnder: values.schoolIsUnder,
        penNo: values.penNo,
        adminUser: "",
        monthName: values.monthName
      }
      if (props?.mode === "ADD") {
        dispatch(setCertificateIssuance(generateActionPayload('set_tc_issuance_form', { tcRequestId: props.tcId }, payload)))
      } else {
        dispatch(updateTcIssuanceAct(generateActionPayload('update_tcissuance', { tcRequestId: props.tcId }, payload)))
      }
    },
  });

  useEffect(() => {
    if (props.isOpen) {
      dispatch(getNationalityAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "nationality", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 100 })));
      if (props.mode === "ADD") {
        let params = { tcRequestId: props.tcId }
        dispatch(getInitialTcIssuance(generateActionPayload('get_initial_tc_issuance', params)));
      } else {
        let params = { tcRequestId: props.tcId }
        dispatch(getTcIssuanceByIdAct(generateActionPayload('get_tcissuance_byid', params)));
      }
    }
  }, [props.isOpen, props.mode, props.tcId])

  useEffect(() => {
    if (Array.isArray(branchClassResp?.content) && branchClassResp.content.length > 0 && (tcIssuanceByIdResp || initalTcIssuanceRes)) {
      const findClassSeq = branchClassResp.content.find((item: any) => +item.id === (+tcIssuanceByIdResp?.data?.classId || +initalTcIssuanceRes?.data?.classId))?.classSequence
      if (findClassSeq === 13 || findClassSeq === 15) {
        certificateIssuanceForm.setFieldValue("isClassValidationRequired",false)
      }
    }
  }, [branchClassResp, tcIssuanceByIdResp, initalTcIssuanceRes])

  function getClassApiCall(curriculumId: string) {
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, academicYearId: certificateIssuanceForm.values.academicYearId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onChangeCurriculumHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    dispatch(setBrchClassAct(undefined));
    certificateIssuanceForm.setValues((prevValues) => ({
      ...prevValues, [name]: value,
      fromClassId: "", toClassId: "", fromClassName: "", toClassName: "",
      detainedInClassId: "", detainedClassText: "", passedAndPromotedToClassId: ""
    }))
    if (value) {
      getClassApiCall(value);
    }
  }

  function onChangePromotedClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    certificateIssuanceForm.setValues(prevValue => ({ ...prevValue, [name]: value, detainedClassText: "" }));
  }
  const formattedClassList = Object.entries(curriculumWiseResp || {}).map(
    ([curriculumName, classList]) => ({
      label: curriculumName,
      options: classList,
    })
  );


  const { content: classTypes } = branchClassResp || {};
  return (
    <>

      <div style={{ padding: "1.25rem" }}>
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <div className="tw-col-span-1">
            <TextInput
              name="academicYearName"
              labelText="Academic Year"
              value={certificateIssuanceForm.values.academicYearName}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="curriculumName"
              labelText="Curriculum"
              value={certificateIssuanceForm.values.curriculumName}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="certificateType"
              labelText="Certificate"
              value={certificateIssuanceForm.values.certificateType}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="studentName"
              labelText="Student"
              value={certificateIssuanceForm.values.studentName}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="className"
              labelText="Class"
              value={certificateIssuanceForm.values.className}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="sectionName"
              labelText="Section"
              value={certificateIssuanceForm.values.sectionName}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="fatherName"
              labelText="Father Name"
              value={certificateIssuanceForm.values.fatherName}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="motherName"
              labelText="Mother Name"
              value={certificateIssuanceForm.values.motherName}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <DateInput
              name="lastAttendedDate"
              labelText="Last Attended Date"
              labelClass="required"
              value={certificateIssuanceForm.values.lastAttendedDate}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.lastAttendedDate && certificateIssuanceForm.errors.lastAttendedDate) ? true : false}
              error={(certificateIssuanceForm.touched.lastAttendedDate && certificateIssuanceForm.errors.lastAttendedDate) ? certificateIssuanceForm.errors.lastAttendedDate : ""}

            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="subjectNames"
              labelText="Subject Name"
              maxLength={500}
              value={certificateIssuanceForm.values.subjectNames}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.subjectNames && certificateIssuanceForm.errors.subjectNames) ? true : false}
              error={(certificateIssuanceForm.touched.subjectNames && certificateIssuanceForm.errors.subjectNames) ? certificateIssuanceForm.errors.subjectNames : ""}
            />
            {/* <MultiSelectCheckbox
              name="subjectNames"
              idKey="subjectId"
              labelText="Subject Name"
              value={certificateIssuanceForm?.values.subjectNames}
              renderValue={renderValue}
              renderOptions={renderOptions}
              onChange={onSelectOptionHandler}
              searchKey="shortCode"
              options={assignedClassSubjectsListResp?.data}
            /> */}
          </div>

          <div className="tw-col-span-1">
            <SelectInput
              name="nationalityId"
              labelText="Nationality"
              labelClass="required"
              value={certificateIssuanceForm.values.nationalityId}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              menuItems={nationalityResp?.data}
              valueKey="nationalityId"
              textKey="nationalityName"
              invalid={(certificateIssuanceForm.touched.nationalityId && certificateIssuanceForm.errors.nationalityId) ? true : false}
              error={(certificateIssuanceForm.touched.nationalityId && certificateIssuanceForm.errors.nationalityId) ? certificateIssuanceForm.errors.nationalityId : ""}
            />
            {/* <TextInput
              name="nationalityId"
              labelText="Nationality"
              value={certificateIssuanceForm.values.nationalityName}
              onChange={null}
              isReadOnly={true}
            /> */}
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="studentCastOrScheduleTribe"
              labelText="Schedule Caste or Schedule Tribe or OBC"
              value={certificateIssuanceForm.values.studentCastOrScheduleTribe}
              onChange={certificateIssuanceForm.handleChange}
            />
            {/* <RadioInputContainer
              name="studentCastOrScheduleTribe"
              labelText="Schedule Caste or Schedule Tribe"
              inputContainerClassName="mt-2"
              radioOptions={yesNoRadioOptions}
              value={certificateIssuanceForm.values.studentCastOrScheduleTribe}
              onChange={certificateIssuanceForm.handleChange}
            /> */}
          </div>

          {/* <div className="tw-col-span-1"> */}
          {/* <TextInput
        name="fromCurriculumId"
        labelText="From Curriculum"
        isReadOnly={true}
        value={certificateIssuanceForm.values.fromCurriculumName}
        onChange={null}
      /> */}
          {/* <SelectInput
        name="fromCurriculumId"
        labelText="From Curriculum"
        labelClass="required"
        value={certificateIssuanceForm.values.fromCurriculumId}
        onChange={onChangeCurriculumHandler}
        menuItems={brchCurriculumResp?.data}
        valueKey="branchCurriculumId"
        textKey="curriculumName"
        formgroupClassName="tw-mb-0"
        invalid={(certificateIssuanceForm.touched.fromCurriculumId && certificateIssuanceForm.errors.fromCurriculumId) ? true : false}
        error={(certificateIssuanceForm.touched.fromCurriculumId && certificateIssuanceForm.errors.fromCurriculumId) ? certificateIssuanceForm.errors.fromCurriculumId : ""}
      />
    </div> */}
          <div className="tw-col-span-1">
            <SelectOptGrup
              name="fromClassId"
              labelText="From Class"
              labelClass="required"
              value={certificateIssuanceForm.values.fromClassId}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              menuItems={formattedClassList}
              valueKey="id"
              textKey="className"
              invalid={(certificateIssuanceForm.touched.fromClassId && certificateIssuanceForm.errors.fromClassId) ? true : false}
              error={(certificateIssuanceForm.touched.fromClassId && certificateIssuanceForm.errors.fromClassId) ? certificateIssuanceForm.errors.fromClassId : ""}

            />
            {/* <TextInput
        name="fromClassName"
        labelText="From Class"
        isReadOnly={true}
        value={certificateIssuanceForm.values.fromClassName}
        onChange={null}
      /> */}
          </div>

          <div className="tw-col-span-1">
            <SelectInput
              name="toClassId"
              labelText="To Class"
              labelClass="required"
              value={certificateIssuanceForm.values.toClassId}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              menuItems={fetchStudentAcademicYearDataResp}
              valueKey="classId"
              textKey="displayName"
              formgroupClassName="tw-mb-2"
              invalid={(certificateIssuanceForm.touched.toClassId && certificateIssuanceForm.errors.toClassId) ? true : false}
              error={(certificateIssuanceForm.touched.toClassId && certificateIssuanceForm.errors.toClassId) ? certificateIssuanceForm.errors.toClassId : ""}
            />
            <SelectInput
              name="currentStatus"
              value={certificateIssuanceForm.values.currentStatus}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              menuItems={classCompletionOptions}
              defaultSelect="Current Status"
              valueKey="id"
              textKey="name"
              invalid={(certificateIssuanceForm.touched.currentStatus && certificateIssuanceForm.errors.currentStatus) ? true : false}
              error={(certificateIssuanceForm.touched.currentStatus && certificateIssuanceForm.errors.currentStatus) ? certificateIssuanceForm.errors.currentStatus : ""}
            />
            {/* <TextInput
        name="toClassName"
        labelText="To Class"
        isReadOnly={true}
        value={certificateIssuanceForm.values.toClassName}
        onChange={null}
      /> */}
          </div>
          <div className="tw-col-span-1">
            <DateInput
              name="dateOfAdmission"
              labelText="Date of Admission"
              labelClass="required"
              value={certificateIssuanceForm.values.dateOfAdmission}
              onChange={certificateIssuanceForm.handleChange}
              invalid={(certificateIssuanceForm.touched.dateOfAdmission && certificateIssuanceForm.errors.dateOfAdmission) ? true : false}
              error={(certificateIssuanceForm.touched.dateOfAdmission && certificateIssuanceForm.errors.dateOfAdmission) ? certificateIssuanceForm.errors.dateOfAdmission : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="fromYear"
              labelText="From Year"
              labelClass="required"
              value={certificateIssuanceForm.values.fromYear}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.fromYear && certificateIssuanceForm.errors.fromYear) ? true : false}
              error={(certificateIssuanceForm.touched.fromYear && certificateIssuanceForm.errors.fromYear) ? certificateIssuanceForm.errors.fromYear : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="toYear"
              labelText="To Year"
              labelClass="required"
              value={certificateIssuanceForm.values.toYear}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.toYear && certificateIssuanceForm.errors.toYear) ? true : false}
              error={(certificateIssuanceForm.touched.toYear && certificateIssuanceForm.errors.toYear) ? certificateIssuanceForm.errors.toYear : ""}
            />
          </div>

          <div className="tw-col-span-1">
          </div>
          <div className="tw-col-span-1">
            <SelectInput
              name="passedAndPromotedToClassId"
              formgroupClassName="tw-mb-2"
              labelText="Passed and Promoted to Class"
              value={certificateIssuanceForm.values.passedAndPromotedToClassId}
              onChange={onChangePromotedClassHndlr}
              menuItems={Array.isArray(instClassForBranchResp?.data) ? instClassForBranchResp.data : []}
              valueKey="instituteClassId"
              textKey="shortName"
            />
            <TextInput
              name="promotedClassText"
              value={certificateIssuanceForm.values.promotedClassText}
              onChange={certificateIssuanceForm.handleChange}
              isDisabled={!!certificateIssuanceForm.values.detainedClassText}
              placeHolder="Passed and Promoted to Class"
            />
          </div>
          <div className="tw-col-span-1">
            <SelectInput
              name="detainedInClassId"
              labelText="Detained in Class"
              formgroupClassName="tw-mb-2"
              value={certificateIssuanceForm.values.detainedInClassId}
              onChange={certificateIssuanceForm.handleChange}
              menuItems={classTypes}
              valueKey="id"
              textKey="shortName"
            />
            <TextInput
              name="detainedClassText"
              value={certificateIssuanceForm.values.detainedClassText}
              onChange={certificateIssuanceForm.handleChange}
              isDisabled={!!certificateIssuanceForm.values.promotedClassText}
              placeHolder="Detained in Class"
            />
          </div>

          <div className="tw-col-span-2">
            <TextInput
              name="dateOfBirthInWords"
              labelText="Date of Birth(In Words)"
              isReadOnly={true}
              value={certificateIssuanceForm.values.dateOfBirthInWords}
              onChange={null}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="whetherFailed"
              labelText="Whether Failed,Once/Twice in Same Class"
              value={certificateIssuanceForm.values.whetherFailed}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.whetherFailed && certificateIssuanceForm.errors.whetherFailed) ? true : false}
              error={(certificateIssuanceForm.touched.whetherFailed && certificateIssuanceForm.errors.whetherFailed) ? certificateIssuanceForm.errors.whetherFailed : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="nccAndOtherDetails"
              labelText="NCC Cadet/Boy Scout/Girl Guide Details"
              value={certificateIssuanceForm.values.nccAndOtherDetails}
              onChange={certificateIssuanceForm.handleChange}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="gameExtraCurActivities"
              labelText="Games played or Extra curricular activities"
              value={certificateIssuanceForm.values.gameExtraCurActivities}
              onChange={certificateIssuanceForm.handleChange}
              maxLength={60}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="generalConduct"
              labelText="General Conduct"
              labelClass="required"
              value={certificateIssuanceForm.values.generalConduct}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.generalConduct && certificateIssuanceForm.errors.generalConduct) ? true : false}
              error={(certificateIssuanceForm.touched.generalConduct && certificateIssuanceForm.errors.generalConduct) ? certificateIssuanceForm.errors.generalConduct : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="reasonForLeaving"
              labelText="Reasons for leaving the school"
              labelClass="required"
              maxLength={1000}
              value={certificateIssuanceForm.values.reasonForLeaving}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.reasonForLeaving && certificateIssuanceForm.errors.reasonForLeaving) ? true : false}
              error={(certificateIssuanceForm.touched.reasonForLeaving && certificateIssuanceForm.errors.reasonForLeaving) ? certificateIssuanceForm.errors.reasonForLeaving : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="lastAnnualExamResultsAndBoardDetails"
              labelText="School or Board Annual examination last taken with result"
              labelClass="required"
              maxLength={500}
              value={certificateIssuanceForm.values.lastAnnualExamResultsAndBoardDetails}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.lastAnnualExamResultsAndBoardDetails && certificateIssuanceForm.errors.lastAnnualExamResultsAndBoardDetails) ? true : false}
              error={(certificateIssuanceForm.touched.lastAnnualExamResultsAndBoardDetails && certificateIssuanceForm.errors.lastAnnualExamResultsAndBoardDetails) ? certificateIssuanceForm.errors.lastAnnualExamResultsAndBoardDetails : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="otherRemarks"
              labelText="Other Remarks"
              maxLength={500}
              value={certificateIssuanceForm.values.otherRemarks}
              onChange={certificateIssuanceForm.handleChange}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="noOfWorkingDays"
              labelText="No of Working Days"
              labelClass="required"
              value={certificateIssuanceForm.values.noOfWorkingDays}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.noOfWorkingDays && certificateIssuanceForm.errors.noOfWorkingDays) ? true : false}
              error={(certificateIssuanceForm.touched.noOfWorkingDays && certificateIssuanceForm.errors.noOfWorkingDays) ? certificateIssuanceForm.errors.noOfWorkingDays : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="noOfPresentDays"
              labelText="No of Present Days"
              labelClass="required"
              value={certificateIssuanceForm.values.noOfPresentDays}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.noOfPresentDays && certificateIssuanceForm.errors.noOfPresentDays) ? true : false}
              error={(certificateIssuanceForm.touched.noOfPresentDays && certificateIssuanceForm.errors.noOfPresentDays) ? certificateIssuanceForm.errors.noOfPresentDays : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="lastClassStudied"
              labelText="Last Class Studied (In Words)"
              labelClass="required"
              maxLength={50}
              value={certificateIssuanceForm.values.lastClassStudied}
              onChange={certificateIssuanceForm.handleChange}
              invalid={(certificateIssuanceForm.touched.lastClassStudied && certificateIssuanceForm.errors.lastClassStudied) ? true : false}
              error={(certificateIssuanceForm.touched.lastClassStudied && certificateIssuanceForm.errors.lastClassStudied) ? certificateIssuanceForm.errors.lastClassStudied : ""}
            />
          </div>

          <div className="tw-col-span-1">
            <TextInput
              name="concession"
              labelText="Concession"
              labelClass="required"
              maxLength={500}
              value={certificateIssuanceForm.values.concession}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.concession && certificateIssuanceForm.errors.concession) ? true : false}
              error={(certificateIssuanceForm.touched.concession && certificateIssuanceForm.errors.concession) ? certificateIssuanceForm.errors.concession : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="monthName"
              labelText="Month name"
              // valueKey="id"
              // textKey="name"
              // menuItems={monthMenuItems}
              value={certificateIssuanceForm.values.monthName}
              onChange={certificateIssuanceForm.handleChange}
            />
          </div>

          <div className="tw-col-span-1">
            <DateInput
              name="dateOfBirth"
              labelText="Date of Birth"
              isReadOnly={true}
              value={certificateIssuanceForm.values.dateOfBirth}
              onChange={null}
            />
          </div>

          <div className="tw-col-span-1">
            <RadioInputContainer
              name="isProofDOBInAdm"
              labelText="Proof for date of birth submitted at the time of admission"
              inputContainerClassName="tw-mt-2"
              radioOptions={yesNoRadioOptions}
              value={certificateIssuanceForm.values.isProofDOBInAdm}
              onChange={certificateIssuanceForm.handleChange}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="schoolIsUnder"
              labelText="Whether the school is under Govt. / Minority / Independent Category"
              value={certificateIssuanceForm.values.schoolIsUnder}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.schoolIsUnder && certificateIssuanceForm.errors.schoolIsUnder) ? true : false}
              error={(certificateIssuanceForm.touched.schoolIsUnder && certificateIssuanceForm.errors.schoolIsUnder) ? certificateIssuanceForm.errors.schoolIsUnder : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="admissionNumber"
              labelText="Admission No"
              isReadOnly={true}
              value={certificateIssuanceForm.values.admissionNumber}
              onChange={null}
            />
          </div>

          <div className="tw-col-span-1">
            <DateInput
              name="dateOfIssuance"
              labelText="Date of Issuance"
              labelClass="required"
              value={certificateIssuanceForm.values.dateOfIssuance}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.dateOfIssuance && certificateIssuanceForm.errors.dateOfIssuance) ? true : false}
              error={(certificateIssuanceForm.touched.dateOfIssuance && certificateIssuanceForm.errors.dateOfIssuance) ? certificateIssuanceForm.errors.dateOfIssuance : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="penNo"
              labelText="PEN Number"
              // labelClass="required"
              value={certificateIssuanceForm.values.penNo}
              onChange={certificateIssuanceForm.handleChange}
              onBlur={certificateIssuanceForm.handleBlur}
              invalid={(certificateIssuanceForm.touched.penNo && certificateIssuanceForm.errors.penNo) ? true : false}
              error={(certificateIssuanceForm.touched.penNo && certificateIssuanceForm.errors.penNo) ? certificateIssuanceForm.errors.penNo : ""}
            />
          </div>
        </div>
        <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-end tw-mt-3">
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
            onClick={(event: any) => certificateIssuanceForm.handleSubmit(event)}
            disabled={showApiLoader}
          >
            {props.branchId ? "Update" : "Submit"}
          </Button>
        </div>
      </div>

    </>
  );
};

export default CertificateIssuanceModal;

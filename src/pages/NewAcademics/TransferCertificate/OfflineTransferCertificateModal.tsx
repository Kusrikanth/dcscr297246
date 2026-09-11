import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "reactstrap";
import { useFormik } from "formik";

import {
  // AutoSearchInput,
  CropModal,
  DateInput,
  ModalContainer,
  ModalContainerUpdated,
  RadioInputContainer,
  SelectInput,
  TextInput,
  UploadFileInput,
} from "../../../Components/Common";
import {
  OfflineTransferDataTypes,
  TransferCertificateModalProps,
} from "./transferCertificateTypes";
import {
  menuItems, validateDimension
} from "./helper";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getStudentListForTcReq, getTcRequestById, resetTcRequestByIdAct, setEditTcReqRes,
  getStudentDetailsTcAct,
  setTcReqRes,
  getStudentListForTcReqAct
} from "../../../store/academic/classroomManagment/classroommanagmentactions";
import * as Yup from 'yup';
import { Current_Date_YYYYMMDD } from "../../../utility/dateutility";
import { uploadFileErrorHndlr } from "./helper";
import { useModal } from "../../../hooks/modalhook";
import { SearchInputWithAutoSearch } from "../../../Components/Common/SearchInputWithautoSearch";
import { searchInputOptions } from "../../Directory/StudentManagement/helper";
import { saveVlidateStudentStatusAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
import { toast } from "react-toastify";
import { setSaveVlidateStudentStatusAct } from "../../../store/academic/notreportingstudents/notreportingstudentsslice";
import Button from "../../../Components/Common/Button";

function getTcFormValues(editData?: any, loggedInUserRole?: string) {
  return ({
    academicYearId: editData?.academicYearId || "",
    curriculumId: editData?.curriculumId || "",
    studentId: editData?.studentId || "",
    classId: editData?.classId || "",
    sectionId: editData?.sectionId || "",
    tcApplicationDate: editData?.tcApplicationDate || Current_Date_YYYYMMDD,
    lastAttendedDate: editData?.lastAttendedDate || editData?.lastPresentDate || "",
    fromClassId: editData?.fromClassId || "",
    toClassId: editData?.toClassId || "",
    nextSchoolOfAdmission: editData?.nextSchoolOfAdmission || "",
    reason: editData?.reason || "",
    bonafide: editData?.bonafide ? "true" : "false",
    requestType: editData?.requestType || 'OFFLINE',
    loggedInUserRole: loggedInUserRole || "",

    motherSignature: editData?.motherSignature?.originalFileName || "",
    fatherSignature: editData?.fatherSignature?.originalFileName || "",

    className: editData?.className || "",
    sectionName: editData?.sectionName || "",
    curriculumName: editData?.curriculumName || "",
    fromClassName: editData?.fromClassName || "",
    toClassName: editData?.toClassName || "",
    motherSignatureFile: "",
    fatherSignatureFile: ""
  })
}

const initialValues = getTcFormValues();
const filterSearchOptions = searchInputOptions.slice(0, 4);

const validationSchema = Yup.object().shape({
  requestType: Yup.string(),
  loggedInUserRole: Yup.string(),
  academicYearId: Yup.string().required('Academic Year is required.'),
  studentId: Yup.string().required('Student is required.'),
  tcApplicationDate: Yup.string().required('TC Application Date is required.'),
  lastAttendedDate: Yup.string().test("mandatoryLastAttendedDate", "Last Attended Date is required.",
    (value: any, schema: any) => {
      const { loggedInUserRole } = schema.parent;
      if (!value && loggedInUserRole !== 'PARENT_ROLE') {
        return false;
      }
      return true;
    }),
  nextSchoolOfAdmission: Yup.string().required('Next School Of Admission is required.'),
  reason: Yup.string().required('Reason is required.'),
  motherSignature: Yup.string().test("mandatoryMotherSignature", "Mother signature is required.",
    (value: any, schema: any) => {
      const { requestType } = schema.parent;
      if (!value && (requestType === 'ONLINE')) {
        return false;
      }
      return true;
    }),
  fatherSignature: Yup.string().test("mandatoryFatherSignature", "Father signature is required.",
    (value: any, schema: any) => {
      const { requestType } = schema.parent;
      if (!value && (requestType === 'ONLINE')) {
        return false;
      }
      return true;
    }),
})

const OfflineTransferCertificateModal = (
  props: TransferCertificateModalProps
) => {
  const dispatch = useDispatch();
  const [selectedStudentState, setSelectedStudentState] = useState<any>(undefined);
  const [searchCategory, setSearchCategory] = useState('global');
  const { modalState, closeModal, openModal } = useModal()

  const { academicYearListResp, studentListTcReq, tcRequestById,
    studentDetailsTcResp, showApiLoader, loggedInUserRole, saveVlidateStudentStatusResp, notReportingStuErrResp }: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, globalData, notReportingStu }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        studentListTcReq: classroomManagmentInfo.studentListTcReq,
        tcRequestById: classroomManagmentInfo.tcRequestById,
        studentDetailsTcResp: classroomManagmentInfo.studentDetailsTcResp,
        classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
        showApiLoader: globalData.showApiLoader,
        loggedInUserRole: appData.loggedInUserRole,
        saveVlidateStudentStatusResp: notReportingStu.saveVlidateStudentStatusResp,
        notReportingStuErrResp: notReportingStu.notReportingStuErrResp,
      }), shallowEqual);

  const tcModalRespRef = useRef({
    prevStudentDetailsTcResp: studentDetailsTcResp,
    prevTcRequestById: tcRequestById,
    prevNotReportingStuErrResp: notReportingStuErrResp,

  });

  useEffect(() => {
    const { prevStudentDetailsTcResp, prevTcRequestById, prevNotReportingStuErrResp } = tcModalRespRef.current;
    if (notReportingStuErrResp && prevNotReportingStuErrResp !== notReportingStuErrResp) {
      const { details } = notReportingStuErrResp || {};
      toast.error(details || "Something went wrong");
      offlineTransferCertificateForm.setValues((values) => {
        return ({
          ...values,
          classId: "",
          className: "",
          curriculumId: "",
          curriculumName: "",
          sectionId: "",
          sectionName: "",
          fromClassId: "",
          fromClassName: "",
          toClassId: "",
          toClassName: "",
        })
      });
    }
    else if (studentDetailsTcResp && prevStudentDetailsTcResp !== studentDetailsTcResp && saveVlidateStudentStatusResp === 200) {
      offlineTransferCertificateForm.setValues((values) => {
        return ({
          ...values,
          classId: studentDetailsTcResp?.lastClass?.classId,
          className: studentDetailsTcResp?.lastClass?.classShortName,
          curriculumId: studentDetailsTcResp?.lastCurriculum?.curriculumId,
          curriculumName: studentDetailsTcResp?.lastCurriculum?.curriculumName,
          sectionId: studentDetailsTcResp?.lastClass?.sectionId,
          sectionName: studentDetailsTcResp?.lastClass?.sectionName,
          fromClassId: studentDetailsTcResp?.firstClass?.classId,
          fromClassName: studentDetailsTcResp?.firstClass?.classShortName,
          toClassId: studentDetailsTcResp?.lastClass?.classId,
          toClassName: studentDetailsTcResp?.lastClass?.classShortName,
        })
      });
    } else if (tcRequestById && prevTcRequestById !== tcRequestById) {
      const { studentId, studentName, studentCode, classId, className, sectionId, sectionName } = tcRequestById.data;
      setSelectedStudentState({ studentClassId: classId, studentClassName: className, studentCode: studentCode, studentId: studentId, studentName: studentName, studentSectionId: sectionId, studentSectionName: sectionName })
      const offlineFormData = getTcFormValues(tcRequestById?.data, loggedInUserRole);
      offlineTransferCertificateForm.resetForm({
        values: offlineFormData
      })
    }
    tcModalRespRef.current.prevStudentDetailsTcResp = studentDetailsTcResp;
    tcModalRespRef.current.prevTcRequestById = tcRequestById;
    tcModalRespRef.current.prevNotReportingStuErrResp = notReportingStuErrResp;
  }, [studentDetailsTcResp, tcRequestById, notReportingStuErrResp]);

  useEffect(() => {
    if (selectedStudentState) {
      const { studentId } = selectedStudentState;
      const matchedStudent = studentListTcReq?.find(
        (s: any) => s.studentId === studentId
      );
      if (matchedStudent?.lastPresentDate) {
        const formattedDate = matchedStudent.lastPresentDate.split("T")[0];

        offlineTransferCertificateForm.setFieldValue(
          "lastAttendedDate",
          formattedDate
        );
      }
    }
  }, [selectedStudentState, studentListTcReq]);

  useEffect(() => {
    return () => {
      dispatch(setSaveVlidateStudentStatusAct(undefined));
      dispatch(getStudentListForTcReqAct(undefined));
    }
  }, []);

  const offlineTransferCertificateForm = useFormik({
    initialValues: getTcFormValues(undefined, loggedInUserRole),
    validationSchema,
    onSubmit: (values) => {
      const optionalConfig = {
        headers: {
          branchId: props.branchId
        },
      }
      let data: any = {
        instituteId: props.instituteId,
        requestType: values.requestType,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        studentId: values.studentId, classId: values.classId, sectionId: values.sectionId,
        tcApplicationDate: values.tcApplicationDate, lastAttendedDate: values.lastAttendedDate,
        fromClassId: values.fromClassId, toClassId: values.toClassId,
        nextSchoolOfAdmission: values.nextSchoolOfAdmission, reason: values.reason, bonafide: values.bonafide === "true" ? true : false
      }
      const formData: any = new FormData();
      Object.keys(data).forEach((key: any) => {
        if (data[key]) {
          formData.append(key, data[`${key}`])
        }
      })
      if (values?.motherSignatureFile) {
        formData.append("motherSignature", values?.motherSignatureFile);
      } else if (tcRequestById?.data?.motherSignature && !values.motherSignature) {
        formData.append("motherURL", "");
      } else {
        formData.append("motherURL", tcRequestById?.data?.motherSignature?.s3URL);
      }
      if (values?.fatherSignatureFile) {
        formData.append("fatherSignature", values?.fatherSignatureFile);
      } else if (tcRequestById?.data?.fatherSignature && !values.fatherSignature) {
        formData.append("fatherURL", "");
      } else {
        formData.append("fatherURL", tcRequestById?.data?.fatherSignature?.s3URL);
      }
      if (props.tcId) {
        dispatch(setEditTcReqRes(generateActionPayload('edit_tc_req', { tcRequestId: props.tcId }, formData)))
      }
      else {
        dispatch(setTcReqRes(generateActionPayload('add_tc_req', undefined, formData, optionalConfig)))
      }
    },
  });

  useEffect(() => {
    if (props.directory) {
      const academicYearId = props.editCertificateDetails?.academicYearId;
      const search = props.editCertificateDetails?.studentCode;

      if (search && academicYearId) {
        offlineTransferCertificateForm.setFieldValue("academicYearId", academicYearId);

        const params = { academicYearId: academicYearId, branchId: props.branchId, search: search, pageNo: 0, pageSize: 100 };
        dispatch(getStudentListForTcReq(generateActionPayload("student_list_for_tc_req", undefined, params)));
      }
    }
  }, [offlineTransferCertificateForm.values.academicYearId, props.directory, props.editCertificateDetails?.studentCode]);

  useEffect(() => {
    if (props.directory && studentListTcReq && studentListTcReq.length > 0) {
      const search = props.editCertificateDetails?.studentCode;
      if (search) {
        const student = studentListTcReq.find((student: any) =>
          student?.studentCode === search || student?.studentName?.includes(search)
        );
        if (student) {
          selectStudentHandler(student);
        }
      }
    }
  }, [studentListTcReq, props.directory, props.editCertificateDetails?.studentCode]);

  const globalFilterRef = useRef<string>("global");

  function handleCategoryChange(name: string, value: string) {

    dispatch(setSaveVlidateStudentStatusAct(undefined));
    globalFilterRef.current = value || "global";
    setSearchCategory(value || 'global');
    offlineTransferCertificateForm.setValues(prevValues => ({
      ...prevValues,
      studentId: "",
      classId: "",
      className: "",
      curriculumId: "",
      curriculumName: "",
      sectionId: "",
      sectionName: "",
      fromClassId: "",
      fromClassName: "",
      toClassId: "",
      toClassName: "",
    }));
    setSelectedStudentState(undefined);
    if (studentListTcReq?.length) {
      dispatch(getStudentListForTcReqAct(undefined));
    }
  }

  function onInputSearchChange(name: string, inputString: any) {
    dispatch(setSaveVlidateStudentStatusAct(undefined));
    const { academicYearId } = offlineTransferCertificateForm.values;
    if (inputString && academicYearId) {
      const params = {
        academicYearId: academicYearId,
        branchId: props.branchId,
        search: inputString,
        globalFilter: globalFilterRef.current,
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getStudentListForTcReq(generateActionPayload("student_list_for_tc_req", undefined, params)));
    }
  }

  function selectStudentHandler(selectedStudent: any) {
    setSelectedStudentState(selectedStudent);

    if (selectedStudent) {

      const { studentId } = selectedStudent;
      const params = { studentId };
      dispatch(getStudentDetailsTcAct(generateActionPayload("student_details_fortc", params, { branchId: props.branchId })));
      dispatch(saveVlidateStudentStatusAct(generateActionPayload("save_validate_student_status", undefined, { studentId, requestType: "TC" })));

      offlineTransferCertificateForm.setFieldValue('studentId', selectedStudent.studentId);
    } else {
      offlineTransferCertificateForm.setFieldValue('studentId', '');
    }
  }

  function handleFileUploadHnlr(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];
    const errorMessage = uploadFileErrorHndlr(file.size, file.type);
    if (errorMessage) {
      offlineTransferCertificateForm.setFieldTouched(name, true, false);
      offlineTransferCertificateForm.setFieldValue(name, "", false);
      offlineTransferCertificateForm.setFieldError(name, errorMessage);
    } else {
      const previewUrl = URL.createObjectURL(file);
      const image = new Image();
      image.src = previewUrl;
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        const dimensionError = validateDimension(height, width);
        if (dimensionError) {
          offlineTransferCertificateForm.setFieldTouched(name, true, false);
          offlineTransferCertificateForm.setFieldValue(name, "", false);
          offlineTransferCertificateForm.setFieldError(name, dimensionError);
        } else {
          const fileKeyName = `${name}File`;
          offlineTransferCertificateForm.setValues(prevValues => ({
            ...prevValues,
            [name]: file?.name,
            [fileKeyName]: file
          }))
        }
      }
    }
  }

  function uploadCroppedImgHndlr(blobFile: any) {
    const { imageName, name } = modalState.modalData;
    const fileKeyName = `${name}File`;
    const newImage = new File([blobFile], blobFile.name, { type: blobFile.type });
    offlineTransferCertificateForm.setValues((prev: any) => ({
      ...prev,
      [name]: imageName,
      [fileKeyName]: newImage,
    }))
    closeModal();
  }

  function changeFileHandler(e: any) {
    const { name } = e.target;
    const file = e.target.files[0],
      errorMessage = uploadFileErrorHndlr(file.size, file.type);
    if (errorMessage) {
      offlineTransferCertificateForm.setValues((prev: any) => ({
        ...prev,
        fatherSignature: "",
        fatherSignatureFile: ""
      }))
    } else {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        openModal({
          name: name,
          imageName: e.target.files[0].name,
          imageType: file.type,
          imageSrc: reader.result?.toString() || '',
          cropWidth: 230,
          cropHeight: 200,
          rotate: 0,

        })
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  useEffect(() => {
    if (!props.currentStudent && academicYearListResp && !props.directory) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT").academicYearId
      offlineTransferCertificateForm.setValues((values) => ({
        ...values,
        requestType: props.requestType,
        academicYearId: yearId
      }));
    }
  }, [props.academicYearId, props.requestType, academicYearListResp])

  useEffect(() => {
    if (props.tcId) {
      dispatch(getTcRequestById(generateActionPayload('tc_request_by_id', { tcRequestId: props.tcId })))
    }
  }, [props.tcId]);

  useEffect(() => {
    if (props.currentStudent) {
      const { academicYearId, childBranchId, childName } = props.currentStudent;
      if (academicYearId) {
        const params = { academicYearId: academicYearId, branchId: childBranchId, search: childName, pageNo: 0, pageSize: 100 };
        offlineTransferCertificateForm.setValues((values) => ({
          ...values,
          requestType: props.requestType,
          academicYearId: academicYearId?.toString()
        }));
        dispatch(getStudentListForTcReq(generateActionPayload("student_list_for_tc_req", undefined, params)));
      }
    }
  }, [props.currentStudent, props.requestType])

  function removeFileHandler(inputName: string) {
    const fileKeyName = `${inputName}File`;
    offlineTransferCertificateForm.setValues(prevValues => ({
      ...prevValues,
      [inputName]: "",
      [fileKeyName]: ""
    }))
  }

  function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    offlineTransferCertificateForm.setValues(prevValues => ({
      ...prevValues,
      [name]: value,
      studentId: "",
      classId: "", className: "", curriculumId: "", curriculumName: "",
      sectionId: "", sectionName: "", fromClassId: "", fromClassName: "", toClassId: "", toClassName: "",
    }))
    setSelectedStudentState(null);
  }

  useEffect(() => {
    if (studentListTcReq && props.currentStudent) {
      const student = studentListTcReq.find((student: any) => student?.studentId === props?.currentStudent?.childId);
      if (student) {
        selectStudentHandler(student);
      }
    }
  }, [studentListTcReq, props.currentStudent])

  const { data: academicYearList } = academicYearListResp || {};
  return (
    <React.Fragment>
      <div className="tw-p-4">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3">
          <div className="tw-col-span-1">
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              labelClass={!!props.currentStudent ? "" : "required"}
              value={offlineTransferCertificateForm.values.academicYearId}
              onChange={onChangeAcademicYearHndlr}
              onBlur={offlineTransferCertificateForm.handleBlur}
              menuItems={academicYearList}
              valueKey="academicYearId"
              textKey="academicYearName"
              isDisabled={(!!props.currentStudent || props.tcId || props.directory) ? true : false}
              invalid={(offlineTransferCertificateForm.touched.academicYearId && offlineTransferCertificateForm.errors.academicYearId) ? true : false}
              error={(offlineTransferCertificateForm.touched.academicYearId && offlineTransferCertificateForm.errors.academicYearId) ? offlineTransferCertificateForm.errors.academicYearId : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <label className="tw-block tw-text-sm tw-font-medium tw-mb-1">
              Student
            </label>
            <SearchInputWithAutoSearch
              className="tw-mb-3"
              name="studentSearchCategory"
              labelClassName={!!props.currentStudent ? "" : "required"}
              menuItems={filterSearchOptions}
              idKey="id"
              value={searchCategory}
              onChange={handleCategoryChange}
              renderOptions={(item: any) => item.name}
              renderSelectedValue={(item: any) => item?.name || "Global Search"}
              searchHandler={onInputSearchChange}
              searchOptions={studentListTcReq || []}
              labelKey="studentName"
              subLabelKey="studentCode"
              valueKey="studentId"
              labelHeaderName="Student Name"
              subLabelHeaderName="Student Code"
              hideDefaultSelect={true}
              selected={selectedStudentState}
              selectedOptionCallbck={selectStudentHandler}
              isDisabled={(props.tcId || props.currentStudent || props.directory) ? true : false}
              invalid={(offlineTransferCertificateForm.touched.studentId && offlineTransferCertificateForm.errors.studentId) ? true : false}
              error={(offlineTransferCertificateForm.touched.studentId && offlineTransferCertificateForm.errors.studentId) ? offlineTransferCertificateForm.errors.studentId : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="curriculumName"
              labelText="Curriculum"
              value={offlineTransferCertificateForm.values.curriculumName}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="className"
              labelText="Class"
              value={offlineTransferCertificateForm?.values.className}
              onChange={null}
              isReadOnly={true}
            />
          </div>
          <div className="tw-col-span-1">
            <TextInput
              name="sectionName"
              labelText="Section"
              value={offlineTransferCertificateForm?.values.sectionName}
              onChange={null}
              isReadOnly={true}
              isDisabled={true}
            />
          </div>

          <div className="tw-col-span-1">
            <DateInput
              name="tcApplicationDate"
              labelText="Tc Application Date"
              value={offlineTransferCertificateForm.values.tcApplicationDate}
              onChange={offlineTransferCertificateForm.handleChange}
              onBlur={offlineTransferCertificateForm.handleBlur}
              invalid={(offlineTransferCertificateForm.touched.tcApplicationDate && offlineTransferCertificateForm.errors.tcApplicationDate) ? true : false}
              error={(offlineTransferCertificateForm.touched.tcApplicationDate && offlineTransferCertificateForm.errors.tcApplicationDate) ? offlineTransferCertificateForm.errors.tcApplicationDate : ""}
            />
          </div>
          {loggedInUserRole !== "PARENT_ROLE" && <div className="tw-col-span-1">
            <DateInput
              name="lastAttendedDate"
              labelText="Last Attended Date"
              labelClass={loggedInUserRole !== "PARENT_ROLE" ? "required" : ""}
              value={offlineTransferCertificateForm.values.lastAttendedDate}
              onChange={offlineTransferCertificateForm.handleChange}
              onBlur={offlineTransferCertificateForm.handleBlur}
              invalid={(offlineTransferCertificateForm.touched.lastAttendedDate && offlineTransferCertificateForm.errors.lastAttendedDate) ? true : false}
              error={(offlineTransferCertificateForm.touched.lastAttendedDate && offlineTransferCertificateForm.errors.lastAttendedDate) ? offlineTransferCertificateForm.errors.lastAttendedDate : ""}
              isReadOnly={loggedInUserRole === "PARENT_ROLE"}
              isDisabled={loggedInUserRole === "PARENT_ROLE"}
            />
          </div>}

          {!props.currentStudent && (
            <div className="tw-col-span-1">
              <TextInput
                name="fromClassName"
                labelText="From Class"
                value={offlineTransferCertificateForm.values.fromClassName}
                onChange={null}
                isReadOnly={true}
              />
            </div>
          )}
          {!props.currentStudent && (
            <div className="tw-col-span-1">
              <TextInput
                name="toClassName"
                labelText="To Class"
                value={offlineTransferCertificateForm.values.toClassName}
                onChange={null}
                isReadOnly={true}
              />
            </div>
          )}
          <div className="tw-col-span-1">
            <TextInput
              name="nextSchoolOfAdmission"
              labelText="Next School of Admission"
              labelClass="required"
              value={offlineTransferCertificateForm.values.nextSchoolOfAdmission}
              onChange={offlineTransferCertificateForm.handleChange}
              onBlur={offlineTransferCertificateForm.handleBlur}
              invalid={(offlineTransferCertificateForm.touched.nextSchoolOfAdmission && offlineTransferCertificateForm.errors.nextSchoolOfAdmission) ? true : false}
              error={(offlineTransferCertificateForm.touched.nextSchoolOfAdmission && offlineTransferCertificateForm.errors.nextSchoolOfAdmission) ? offlineTransferCertificateForm.errors.nextSchoolOfAdmission : ""}
            />
          </div>
          <div className="tw-col-span-1">
            <RadioInputContainer
              name="bonafide"
              labelText="Do You Require Study Cum Bonafide?"
              value={offlineTransferCertificateForm.values.bonafide}
              onChange={offlineTransferCertificateForm.handleChange}
              radioOptions={menuItems}
              invalid={(offlineTransferCertificateForm.touched.bonafide && offlineTransferCertificateForm.errors.bonafide) ? true : false}
              error={(offlineTransferCertificateForm.touched.bonafide && offlineTransferCertificateForm.errors.bonafide) ? offlineTransferCertificateForm.errors.bonafide : ""}
            />
          </div>
          <div className="tw-col-span-2">
            <TextInput
              name="reason"
              labelText="Reason"
              labelClass="required"
              value={offlineTransferCertificateForm.values.reason}
              onChange={offlineTransferCertificateForm.handleChange}
              onBlur={offlineTransferCertificateForm.handleBlur}
              invalid={(offlineTransferCertificateForm.touched.reason && offlineTransferCertificateForm.errors.reason) ? true : false}
              error={(offlineTransferCertificateForm.touched.reason && offlineTransferCertificateForm.errors.reason) ? offlineTransferCertificateForm.errors.reason : ""}
            />
          </div>
          <div className="tw-col-span-2">
            <UploadFileInput
              name="motherSignature"
              labelText="Upload Mother Signature"
              helperText="File size less than 1mb and dimensions of 230 x 200 pixels (preferred)."
              value={offlineTransferCertificateForm.values.motherSignature || ""}
              onChange={changeFileHandler}
              hideUploadBtn={true}
              canRemove={true}
              removeFileHandler={removeFileHandler}
              isReadOnly={props.tcId}
              invalid={(offlineTransferCertificateForm.touched.motherSignature && offlineTransferCertificateForm.errors.motherSignature) ? true : false}
              error={(offlineTransferCertificateForm.touched.motherSignature && offlineTransferCertificateForm.errors.motherSignature) ? offlineTransferCertificateForm.errors.motherSignature : ""}
            />
          </div>

          <div className="tw-col-span-2">
            <UploadFileInput
              name="fatherSignature"
              labelText="Upload Father Signature"
              helperText="File size less than 1mb and dimensions of 230 x 200 pixels (preferred)."
              value={offlineTransferCertificateForm.values.fatherSignature || ""}
              onChange={changeFileHandler}
              hideUploadBtn={true}
              isReadOnly={props.tcId}
              canRemove={true}
              removeFileHandler={removeFileHandler}
              invalid={(offlineTransferCertificateForm.touched.fatherSignature && offlineTransferCertificateForm.errors.fatherSignature) ? true : false}
              error={(offlineTransferCertificateForm.touched.fatherSignature && offlineTransferCertificateForm.errors.fatherSignature) ? offlineTransferCertificateForm.errors.fatherSignature : ""}
            />
          </div>
        </div>
      </div>
      <div className="tw-border-t tw-border-gray-200 tw-px-4 tw-py-3">
        <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-end tw-mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => props.toggle(undefined, undefined)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={(event: any) => offlineTransferCertificateForm.handleSubmit(event)}
            disabled={showApiLoader}
          >
            Submit
          </Button>
        </div>
      </div>
      <ModalContainerUpdated
        id="upload-new-image-tc-modal"
        isOpen={modalState.showModal}
        toggle={closeModal}
        modalTitle={"Upload Image"}
        modalSize="md"
      >
        <CropModal
          closeModalHndler={closeModal}
          modalData={modalState.modalData}
          uploadCroppedImgHndlr={uploadCroppedImgHndlr}
        />
      </ModalContainerUpdated>
    </React.Fragment>
  );
};

export default OfflineTransferCertificateModal;
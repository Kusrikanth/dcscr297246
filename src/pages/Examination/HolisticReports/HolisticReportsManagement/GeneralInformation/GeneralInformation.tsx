import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import {
  UncontrolledAccordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import { StepperFormContext } from "../helper";
import {
  getInitialFormData,
  interestOptions,
  areaTypeOptions,
  attendanceColumns,
  transformAttendanceData,
  transformAttendanceDataForEdit,
  formatInterestLabel,
  normalizeInterest,
} from "./helper";
import {
  TextInput,
  DateInput,
  PhoneInput,
  RadioInputContainer,
  UploadFileInput,
  TextInputWithRegex,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Appointment02Icon, Bookmark03Icon, CircleArrowRight01Icon, Tick01Icon, UserQuestion01Icon, IdentityCardIcon,
  Home09Icon,
  UserGroup02Icon, School01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { getStudentAttendanceAct, getStudentByIdAct, setStudentAttendanceAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { useFormik } from "formik";
import { calculateAge } from "../../../../../utility/dateutility";
import classNames from "classnames";
import ImgPreview from "../../../../../assets/imagesdps/directory/image_preview.png";
import * as Yup from "yup";
import { getGeneralInformationByIdAct, saveGeneralInformationAct, saveGeneralStudentPhotoAct, updateGeneralInformationAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { useHistory } from "react-router-dom";
import { getBranchByIdAct } from "../../../../../store/mastersettings/branch/branchactions";

const validationSchema = Yup.object().shape({
  studentPhoto: Yup.string().required("Student photo is required").nullable(),
});

const GeneralInformation = (props: any) => {
  const { stepId, branchId, instituteId, studentId, entryId } = props;
  const {
    nextStepHndlr,
    submitCurrentFormCllbck,
    tabsData,
    setTabsDataHandler,
    isViewMode,
    setValidationMethod,
  } = useContext(StepperFormContext);
  const [attendanceData, setAttendanceData] = useState<any>([]);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState<any>({});


  const {
    academicYearListResp,
    getStudentByIdResp,
    getStudentAttendanceResp,
    saveGeneralStudentPhotoResp,
    getGeneralInformationByIdResp,
    saveGeneralInformationResp,
    branchbyIdResp

  } = useAppSelector(

    ({
      instAcademics, examinationManagement, directoryStudent, branch }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        getStudentByIdResp: directoryStudent.getStudentByIdResp,
        getStudentAttendanceResp: directoryStudent.getStudentAttendanceResp,
        saveGeneralStudentPhotoResp: examinationManagement.saveGeneralStudentPhotoResp,
        getGeneralInformationByIdResp: examinationManagement.getGeneralInformationByIdResp,
        branchbyIdResp: branch.branchbyIdResp,
        saveGeneralInformationResp: examinationManagement.saveGeneralInformationResp,
      }),
    shallowEqual
  );

  const generalInfoForm = useFormik({
    validationSchema,
    initialValues: getInitialFormData(),
    onSubmit: (values) => {

    },
  });

  useEffect(() => {
    if (tabsData?.[stepId]) {
      generalInfoForm.setValues(tabsData[stepId]);
    } else {
      generalInfoForm.setValues(getInitialFormData());
    }
  }, [tabsData, stepId]);

  useEffect(() => {
    if (branchId) {
      const params = { branchId };
      dispatch(getBranchByIdAct(generateActionPayload("get_branch_byid", params)));
    }
  }, [branchId]);
  const handleInputChange = (field: string, value: any) => {
    const updatedData = { ...generalInfoForm.values, [field]: value };
    generalInfoForm.setValues(updatedData);
    setTabsDataHandler(stepId, updatedData);
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = useCallback(async () => {
    const errors = await generalInfoForm.validateForm();
    if (Object.keys(errors).length > 0) {
      generalInfoForm.setTouched(
        Object.keys(errors).reduce((touched, key) => {
          touched[key] = true;
          return touched;
        }, {} as any)
      );
      return false;
    }
    return true;
  }, [generalInfoForm.validateForm, generalInfoForm.setTouched]);

  useEffect(() => {
    if (setValidationMethod) {
      setValidationMethod(validateForm);
    }

    return () => {
      if (setValidationMethod) {
        setValidationMethod(null);
      }
    };
  }, [setValidationMethod, validateForm]);

  useEffect(() => {
    if (studentId) {
      const academicYearId = props.academicYearId;
      dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId }, { academicYearId })))
    }
  }, [studentId])

  useEffect(() => {
    if (getStudentByIdResp) {
      const academicYearId = props.academicYearId;
      getStudentAttendance(getStudentByIdResp?.studentDetails?.id, academicYearId, getStudentByIdResp?.studentAcademicDetails?.classId, getStudentByIdResp?.studentAcademicDetails?.curriculumId, getStudentByIdResp?.studentAcademicDetails?.sectionId);
    }
  }, [getStudentByIdResp])

  const saveGeneralInformation = () => {
    const academicYearId = props.academicYearId || null;
    const curriculumId = getStudentByIdResp?.studentAcademicDetails?.curriculumId
    const classId = getStudentByIdResp?.studentAcademicDetails?.classId
    const studentId = getStudentByIdResp?.studentDetails?.id

    const attendancePayload = attendanceData?.map(item => {
      return {
        monthName: item.month,
        workingDays: item.workingDays,
        daysPresent: item.daysPresent,
        attendancePercentage: Number(item.attendancePercent),
        // lowAttendanceReason: item.lowAttendanceReason
      };
    });

    const interest = generalInfoForm.values.interests?.map((item) => item.toUpperCase())

    // if (validateForm()) {
    const payload = {
      instituteId,
      branchId,
      academicYearId,
      curriculumId,
      classId,
      studentId,
      entryStatus: "SAVE",
      schoolName: getStudentByIdResp?.studentAcademicDetails?.schoolName || getGeneralInformationByIdResp?.schoolName,
      schoolAddress: getStudentByIdResp?.studentAcademicDetails?.schoolAddress || getGeneralInformationByIdResp?.schoolAddress,
      village: generalInfoForm.values.villageCity,
      brc: generalInfoForm.values.brc,
      crc: generalInfoForm.values.crc,
      state: generalInfoForm.values.state,
      pinCode: generalInfoForm.values.pinCode,
      udiseCode: generalInfoForm.values.udiseCode,
      teacherName: getStudentByIdResp?.studentAcademicDetails?.teacherName || getGeneralInformationByIdResp?.teacherName,
      teacherCode: getStudentByIdResp?.studentAcademicDetails?.teacherCode || getGeneralInformationByIdResp?.teacherCode,
      apaarId: generalInfoForm.values.apaarId,
      studentName: generalInfoForm.values.studentName,
      rollNo: generalInfoForm.values.rollNumber,
      admissionNo: generalInfoForm.values.admissionNumber,
      // grade: generalInfoForm.values.grade,
      section: generalInfoForm.values.section,
      dateOfBirth: generalInfoForm.values.dateOfBirth,
      age: generalInfoForm.values.age,
      address: generalInfoForm.values.fullAddress,
      phone: generalInfoForm.values.phoneNumber,
      motherName: generalInfoForm.values.motherName,
      fatherName: generalInfoForm.values.fatherName,
      fatherEducation: generalInfoForm.values.fatherEducation,
      fatherOccupation: generalInfoForm.values.fatherOccupation,
      motherEducation: generalInfoForm.values.motherEducation,
      motherOccupation: generalInfoForm.values.motherOccupation,
      guardianOccupation: generalInfoForm.values.guardianOccupation,
      guardianEducation: generalInfoForm.values.guardianEducation,
      guardianName: generalInfoForm.values.guardianName,
      numberOfSiblings: generalInfoForm.values.numberOfSiblings,
      siblingsAge: generalInfoForm.values.siblingsAge,
      areaType: generalInfoForm.values.areaType,
      mediumOfInstruction: generalInfoForm.values.mediumOfInstruction,
      motherTongue: generalInfoForm.values.motherTongue,
      ruralUrban: generalInfoForm.values.areaType,
      termId: props.termId,
      timesFallenIll: generalInfoForm.values.timesFallenIll,
      studentPhotoId: getStudentByIdResp?.studentDetails?.fullImageUrlId || getGeneralInformationByIdResp?.studentImageId || saveGeneralStudentPhotoResp?.data,
      lowAttendanceReason: generalInfoForm.values.lowAttendanceReason,
      interests: {
        interest,
        otherInterestDetails: generalInfoForm.values.otherInterest
      },
      attendance: attendancePayload || [],

    };

    if (saveGeneralInformationResp?.data || entryId) {
      dispatch(updateGeneralInformationAct(generateActionPayload("update_general_information", { id: saveGeneralInformationResp?.data || entryId }, payload)));
    } else {
      dispatch(saveGeneralInformationAct(generateActionPayload("save_general_information", undefined, payload)));
    }
    // }
  };

  const handleNext = async () => {
    const isValid = await validateForm();
    if (isValid) {
      saveGeneralInformation();
      submitCurrentFormCllbck([], "NEXT_TAB");
      nextStepHndlr(stepId, generalInfoForm.values);
    }
  };
  const handleDraft = async () => {
    const isValid = await validateForm();
    if (isValid) {
      saveGeneralInformation();
      history.push("/holistic-management");
    }
  };

  useEffect(() => {
    if (saveGeneralInformationResp?.data || entryId) {
      dispatch(getGeneralInformationByIdAct(generateActionPayload("get_general_information_by_id", { id: saveGeneralInformationResp?.data || entryId }, undefined)));
    }
  }, [entryId, saveGeneralInformationResp?.data])

  const getStudentAttendance = (
    studentId: string,
    academicYearId: string,
    classId: string,
    curriculumId: string,
    sectionId: string
  ) => {
    let params1 = {
      branchId: branchId,
      searchString: "",
      academicYearId: academicYearId,
      studentId: studentId,
      classId: classId,
      curriculumId: curriculumId,
      sectionId: sectionId,
    };
    if (sectionId) {
      dispatch(
        getStudentAttendanceAct(
          generateActionPayload("get_student_attendance", undefined, params1)
        )
      );
    }
    else {
      toast.warning("Section is not assigned to the student, cannot fetch attendance data");
    }
  };

  const handlePrevious = () => {
    submitCurrentFormCllbck([], "PREVIOUS_TAB");
    nextStepHndlr(stepId, generalInfoForm.values);
  };

  const handleInterestToggle = (interest: string) => {
    const currentInterests = generalInfoForm.values.interests || [];
    const updatedInterests = currentInterests.includes(interest)
      ? currentInterests.filter((item: string) => item !== interest)
      : [...currentInterests, interest];

    handleInputChange("interests", updatedInterests);
  };

  // Attendance table change handler
  const attendanceTableChangeHandler = (
    event: any,
    recordId: any,
    field: string
  ) => {
    const { value } = event.target;

    // Only handle lowAttendanceReason field changes
    if (field === 'lowAttendanceReason') {
      const updatedRecords = attendanceData.map((record: any) => {
        if (record.id === recordId) {
          return { ...record, [field]: value };
        }
        return record;
      });

      setAttendanceData(updatedRecords);
    }
  };

  const onChangeHndlr = (event: any) => {
    const { name, value } = event.target;
    generalInfoForm.setFieldValue(name, value);
  }

  useEffect(() => {
    if (getStudentByIdResp && !getGeneralInformationByIdResp) {
      const fatherData = getStudentByIdResp?.studentParentDetails?.find((parent: any) => parent.relationType?.toLowerCase() === "father") || {};
      const motherData = getStudentByIdResp?.studentParentDetails?.find((parent: any) => parent.relationType?.toLowerCase() === "mother") || {};
      const guardianData = getStudentByIdResp?.studentParentDetails?.find((parent: any) => parent.relationType?.toLowerCase() === "guardian") || {};
      generalInfoForm.setFieldValue("studentName", getStudentByIdResp?.studentDetails?.studentName || "");
      generalInfoForm.setFieldValue("studentCode", getStudentByIdResp?.studentDetails?.studentCode || "");
      generalInfoForm.setFieldValue("admissionNumber", getStudentByIdResp?.studentAcademicDetails?.admissionNo || "");
      generalInfoForm.setFieldValue("curriculum", getStudentByIdResp?.studentAcademicDetails?.curriculumName || "");
      generalInfoForm.setFieldValue("class", getStudentByIdResp?.studentAcademicDetails?.classShortName || "");
      generalInfoForm.setFieldValue("section", getStudentByIdResp?.studentAcademicDetails?.sectionName || "");
      generalInfoForm.setFieldValue("dateOfBirth", getStudentByIdResp?.studentDetails?.dob || "");
      generalInfoForm.setFieldValue("numberOfSiblings", getStudentByIdResp?.studentSiblingDetails?.length || "");
      generalInfoForm.setFieldValue("age", calculateAge(getStudentByIdResp?.studentDetails?.dob) || "");
      generalInfoForm.setFieldValue("fullAddress", getStudentByIdResp?.communicationDetails?.currentFullAddress || "");
      generalInfoForm.setFieldValue("villageCity", getStudentByIdResp?.communicationDetails?.currentCityId || "");
      generalInfoForm.setFieldValue("state", getStudentByIdResp?.communicationDetails?.currentStateId || "");
      generalInfoForm.setFieldValue("pinCode", getStudentByIdResp?.communicationDetails?.currentPincode || "");
      generalInfoForm.setFieldValue("motherTongue", getStudentByIdResp?.identificationDetail?.motherTongueName || "");
      generalInfoForm.setFieldValue("phoneNumber", getStudentByIdResp?.studentDetails?.contactNo || "");
      // generalInfoForm.setFieldValue("udiseCode", getStudentByIdResp?.studentDetails?.udiseCodes || "");
      generalInfoForm.setFieldValue("apaarId", getStudentByIdResp?.studentDetails?.apaarId || "");
      generalInfoForm.setFieldValue("fatherName", fatherData?.name || "");
      generalInfoForm.setFieldValue("fatherEducation", fatherData?.qualificationName || "");
      generalInfoForm.setFieldValue("fatherOccupation", fatherData?.occupationName || "");
      generalInfoForm.setFieldValue("motherName", motherData?.name || "");
      generalInfoForm.setFieldValue("motherEducation", motherData?.qualificationName || "");
      generalInfoForm.setFieldValue("motherOccupation", motherData?.occupationName || "");
      generalInfoForm.setFieldValue("guardianOccupation", guardianData?.occupationName || "");
      generalInfoForm.setFieldValue("guardianEducation", guardianData?.occupationName || "");
      generalInfoForm.setFieldValue("guardianName", guardianData?.occupationName || "");
      if (getStudentByIdResp?.studentDetails?.studentImageBase64) {
        const base64Image = `data:image/png;base64,${getStudentByIdResp?.studentDetails?.studentImageBase64}`;

        try {
          fetch(base64Image)
            .then(res => res.blob())
            .then(blob => {
              const previewUrl = URL.createObjectURL(blob);

              const file = new File([blob], 'student-photo.png', { type: 'image/png' });

              generalInfoForm.setFieldValue("studentPhoto", "student-photo.png");
              generalInfoForm.setFieldValue("studentPhotoFile", file);
              generalInfoForm.setFieldValue("studentPhotoPreviewUrl", previewUrl);
            })
            .catch(error => {
              console.error('Error converting base64 to blob:', error);
              generalInfoForm.setFieldValue("studentPhotoPreviewUrl", base64Image);
            });
        } catch (error) {
          console.error('Error processing base64 image:', error);
          generalInfoForm.setFieldValue("studentPhotoPreviewUrl", base64Image);
        }
      }
    }
    if(getStudentByIdResp){
      generalInfoForm.setFieldValue("rollNumber", getStudentByIdResp?.studentAcademicDetails?.rollNo || "");
    }
    return () => {
      if (getStudentByIdResp?.studentAcademicDetails?.sectionId) {
        dispatch(setStudentAttendanceAct(undefined));
      }
    }
  }, [getStudentByIdResp, getGeneralInformationByIdResp]);

  useEffect(() => {
    if (getGeneralInformationByIdResp) {
      generalInfoForm.setFieldValue("studentName", getGeneralInformationByIdResp?.studentName || "");
      generalInfoForm.setFieldValue("studentCode", getGeneralInformationByIdResp?.studentCode || "");
      generalInfoForm.setFieldValue("admissionNumber", getGeneralInformationByIdResp?.registrationNo || "");
      generalInfoForm.setFieldValue("timesFallenIll", getGeneralInformationByIdResp?.timesFallenIll || "");
      generalInfoForm.setFieldValue("numberOfSiblings", getStudentByIdResp?.studentSiblingDetails?.length || getGeneralInformationByIdResp?.numberOfSiblings || 0,);
      generalInfoForm.setFieldValue("siblingsAge", getGeneralInformationByIdResp?.siblingsAge || "");
      generalInfoForm.setFieldValue("crc", getGeneralInformationByIdResp?.crc || "");
      generalInfoForm.setFieldValue("brc", getGeneralInformationByIdResp?.brc || "");
      generalInfoForm.setFieldValue("curriculum", getGeneralInformationByIdResp?.curriculumName || "");
      generalInfoForm.setFieldValue("class", getGeneralInformationByIdResp?.classShortName || "");
      generalInfoForm.setFieldValue("section", getGeneralInformationByIdResp?.section || "");
      generalInfoForm.setFieldValue("dateOfBirth", getGeneralInformationByIdResp?.dateOfBirth || "");
      generalInfoForm.setFieldValue("age", getGeneralInformationByIdResp?.age || "");
      generalInfoForm.setFieldValue("fullAddress", getGeneralInformationByIdResp?.address || "");
      generalInfoForm.setFieldValue("villageCity", getGeneralInformationByIdResp?.village || "");
      generalInfoForm.setFieldValue("state", getGeneralInformationByIdResp?.state || "");
      generalInfoForm.setFieldValue("pinCode", getGeneralInformationByIdResp?.pinCode || "");
      generalInfoForm.setFieldValue("motherTongue", getGeneralInformationByIdResp?.motherTongue || "");
      generalInfoForm.setFieldValue("phoneNumber", getGeneralInformationByIdResp?.phone || "");
      // generalInfoForm.setFieldValue("udiseCode", getGeneralInformationByIdResp?.udiseCode || "");
      generalInfoForm.setFieldValue("apaarId", getGeneralInformationByIdResp?.apaarId || "");
      generalInfoForm.setFieldValue("fatherName", getGeneralInformationByIdResp?.fatherName || "");
      generalInfoForm.setFieldValue("fatherEducation", getGeneralInformationByIdResp?.fatherEducation || "");
      generalInfoForm.setFieldValue("fatherOccupation", getGeneralInformationByIdResp?.fatherOccupation || "");
      generalInfoForm.setFieldValue("motherName", getGeneralInformationByIdResp?.motherName || "");
      generalInfoForm.setFieldValue("motherEducation", getGeneralInformationByIdResp?.motherEducation || "");
      generalInfoForm.setFieldValue("motherOccupation", getGeneralInformationByIdResp?.motherOccupation || "");
      generalInfoForm.setFieldValue("guardianOccupation", getGeneralInformationByIdResp?.guardianOccupation || "");
      generalInfoForm.setFieldValue("guardianEducation", getGeneralInformationByIdResp?.guardianEducation || "");
      generalInfoForm.setFieldValue("mediumOfInstruction", getGeneralInformationByIdResp?.mediumOfInstruction || "");
      generalInfoForm.setFieldValue("guardianName", getGeneralInformationByIdResp?.guardianName || "");
      generalInfoForm.setFieldValue("studentPhotoPreviewUrl", getGeneralInformationByIdResp?.studentImageUrl);
      generalInfoForm.setFieldValue("lowAttendanceReason", getGeneralInformationByIdResp?.lowAttendanceReason || "");

      if (getGeneralInformationByIdResp?.interests) {
        const mappedInterests = getGeneralInformationByIdResp.interests.interest?.map((item: string) => normalizeInterest(item)) || [];

        generalInfoForm.setFieldValue("interests", mappedInterests);
        generalInfoForm.setFieldValue("otherInterest", getGeneralInformationByIdResp.interests.otherInterestDetails || "");
      }

      if (getGeneralInformationByIdResp?.studentImageBase64) {
        const base64Image = `data:image/png;base64,${getGeneralInformationByIdResp?.studentImageBase64}`;

        try {
          fetch(base64Image)
            .then(res => res.blob())
            .then(blob => {
              const previewUrl = URL.createObjectURL(blob);

              const file = new File([blob], 'student-photo.png', { type: 'image/png' });

              generalInfoForm.setFieldValue("studentPhoto", "student-photo.png");
              generalInfoForm.setFieldValue("studentPhotoFile", file);
              generalInfoForm.setFieldValue("studentPhotoPreviewUrl", previewUrl);
            })
            .catch(error => {
              console.error('Error converting base64 to blob:', error);
              generalInfoForm.setFieldValue("studentPhotoPreviewUrl", base64Image);
            });
        } catch (error) {
          console.error('Error processing base64 image:', error);
          generalInfoForm.setFieldValue("studentPhotoPreviewUrl", base64Image);
        }
      }
    }
  }, [getGeneralInformationByIdResp]);

  useEffect(() => {
    if(branchbyIdResp){
      generalInfoForm.setFieldValue("udiseCode", branchbyIdResp?.udiseCode);
    }
  },[branchbyIdResp])

  function handleFileUploadHnlr(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];
    const { studentPhotoPreviewUrl } = generalInfoForm.values;
    if (studentPhotoPreviewUrl) {
      URL.revokeObjectURL(studentPhotoPreviewUrl);
    }
    const previewUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = previewUrl;
    image.onload = () => {
      const fileKeyName = `${name}File`,
        filePreviewUrl = `${name}PreviewUrl`;
      generalInfoForm.setValues(prevValues => ({
        ...prevValues,
        [name]: file?.name,
        [fileKeyName]: file,
        [filePreviewUrl]: previewUrl
      }))
    }
    const requestPayload = {
      studentId: getStudentByIdResp?.studentDetails?.id,
      uploadType: "STUDENT_PHOTO"
    };
    const formData = new FormData();
    formData.append("request", JSON.stringify(requestPayload));
    if (file) {
      formData.append("file", file);
    }
    dispatch(saveGeneralStudentPhotoAct(generateActionPayload("save_general_student_photo", undefined, formData)));
  }

  useEffect(() => {
    return () => {
      dispatch(setStudentAttendanceAct(undefined));
    }
  }, []);


  useEffect(() => {
    if (getStudentAttendanceResp && !getGeneralInformationByIdResp) {
      const data = transformAttendanceData(getStudentAttendanceResp) || [];
      const editableData = data.map((item: any, index: number) => ({
        ...item,
        id: index,
        isEdit: false
      }));
      setAttendanceData(editableData);
    }
    else if (
      getStudentAttendanceResp &&
      getGeneralInformationByIdResp &&
      getGeneralInformationByIdResp.attendance &&
      getGeneralInformationByIdResp.attendance.length > 0
    ) {
      const data = transformAttendanceDataForEdit(
        getStudentAttendanceResp,
        getGeneralInformationByIdResp.attendance
      ) || [];
      setAttendanceData(data);
    }
  }, [getStudentAttendanceResp, getGeneralInformationByIdResp]);


  const totals = useMemo(() => {
    const result = attendanceData.reduce(
      (acc, curr) => {
        acc.totalWorkingDays += curr.workingDays;
        acc.totalDaysPresent += curr.daysPresent;
        return acc;
      },
      { totalWorkingDays: 0, totalDaysPresent: 0 }
    );

    result.attendancePercent = result.totalWorkingDays
      ? ((result.totalDaysPresent / result.totalWorkingDays) * 100).toFixed(2)
      : "0.00";

    return result;
  }, [attendanceData]);

  const columnsData = useMemo(() => attendanceColumns(), []);
  return (
    <>
      <div>

        {getStudentByIdResp && <UncontrolledAccordion
          open="studentBasicInfo"
          defaultOpen={[
            "studentBasicInfo",
            "contactAddressInfo",
            "institutionalInfo",
            "parentsGuardiansInfo",
            "attendanceRecord",
            "studentInterests",
          ]}
          stayOpen
        >
          {/* Student Basic Information */}
          <AccordionItem>
            <AccordionHeader tag="h5" targetId="studentBasicInfo">
              <div className="d-flex align-items-center">
                <HugeiconsIcon
                  icon={IdentityCardIcon}
                  size={22}
                  className="me-2"
                  style={{ color: "#0ab39c" }}
                />
                <div className="fw-bold">Student Basic Information</div>
              </div>

            </AccordionHeader>
            <AccordionBody accordionId="studentBasicInfo">
              <div className="row">
                <div className="col-4">
                  <TextInput
                    name="studentName"
                    labelText="Student Name"
                    value={generalInfoForm.values.studentName}
                    onChange={onChangeHndlr}
                    placeHolder="Enter student name"
                    isDisabled
                    maxLength={500}
                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="studentCode"
                    labelText="Student Code"
                    value={generalInfoForm.values.studentCode}
                    onChange={onChangeHndlr}
                    placeHolder="Enter student code"
                    isDisabled
                    maxLength={500}
                  />
                </div>

                <div className="col-4">
                  <TextInput
                    name="admissionNumber"
                    labelText="Admission Number"
                    value={generalInfoForm.values.admissionNumber}
                    onChange={onChangeHndlr}
                    placeHolder="Enter admission number"
                    isDisabled
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="curriculum"
                    labelText="Curriculum"
                    value={generalInfoForm.values.curriculum}
                    onChange={onChangeHndlr}
                    placeHolder="Enter curriculum"
                    isDisabled
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="class"
                    labelText="Class"
                    value={generalInfoForm.values.class}
                    onChange={onChangeHndlr}
                    isDisabled
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="section"
                    labelText="Section"
                    value={generalInfoForm.values.section}
                    onChange={onChangeHndlr}
                    isDisabled
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="rollNumber"
                    labelText="Roll Number"
                    value={generalInfoForm.values.rollNumber}
                    onChange={onChangeHndlr}
                    placeHolder="Enter roll number"
                    isDisabled
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <DateInput
                    name="dateOfBirth"
                    labelText="Date of Birth"
                    value={generalInfoForm.values.dateOfBirth}
                    onChange={onChangeHndlr}
                    isDisabled
                  />
                </div>
                <div className="col-4">

                  <TextInputWithRegex
                    name="age"
                    labelText="Age (Years)"
                    value={generalInfoForm.values.age}
                    onChange={onChangeHndlr}
                    placeHolder="Enter age"
                    isDisabled
                    maxLength={3}
                    allowedInputRegex="^[0-9]+$"
                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="motherTongue"
                    labelText="Mother Tongue"
                    value={generalInfoForm.values.motherTongue}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="mediumOfInstruction"
                    labelText="Medium of Instruction"
                    value={generalInfoForm.values.mediumOfInstruction}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInputWithRegex
                    name="timesFallenIll"
                    labelText="Times Fallen Ill"
                    value={generalInfoForm.values.timesFallenIll}
                    onChange={onChangeHndlr}
                    placeHolder="Enter number of times fallen ill"
                    isDisabled={isViewMode}
                    maxLength={500}
                    allowedInputRegex="^[0-9]+$"
                  />
                </div>
                <div className="col-4">
                  <TextInputWithRegex
                    name="numberOfSiblings"
                    labelText="No.of Sibilings"
                    value={generalInfoForm.values.numberOfSiblings}
                    onChange={onChangeHndlr}
                    isDisabled={getStudentByIdResp?.studentSiblingDetails?.length || getGeneralInformationByIdResp?.numberOfSiblings}
                    maxLength={500}
                    allowedInputRegex="^[0-9]+$"
                  />
                </div>
                <div className="col-4">
                  <TextInputWithRegex
                    name="siblingsAge"
                    labelText="Sibilings Age"
                    value={generalInfoForm.values.siblingsAge}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                    maxLength={500}
                    allowedInputRegex="^[0-9,]+$"
                  />
                </div>
                <div className="col-4"></div>
                <div className="col-4">
                  <UploadFileInput
                    name="studentPhoto"
                    labelText="Student Photo"
                    formgroupClassName="mb-0"
                    labelClass="required"
                    value={generalInfoForm.values.studentPhoto || ""}
                    onChange={handleFileUploadHnlr}
                    hideUploadBtn={true}
                    canRemove={false}
                    isDisabled={getStudentByIdResp?.studentDetails?.studentImageBase64}
                    invalid={(generalInfoForm.touched.studentPhoto && generalInfoForm.errors.studentPhoto) ? true : false}
                    error={(generalInfoForm.touched.studentPhoto && generalInfoForm.errors.studentPhoto) ? generalInfoForm.errors.studentPhoto : ""}
                  />
                </div>
                <div className="flex-shrink-0 " style={{ display: "contents" }}>
                  <div className={classNames("flex-shrink-0 preview-img ms-2 ", { "border border-2 rounded": !!generalInfoForm.values.studentPhotoPreviewUrl })}>
                    <img src={generalInfoForm.values.studentPhotoPreviewUrl || ImgPreview} style={{ height: "100px", width: "100px" }} className="img-fluid" />
                  </div>
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Contact & Address Information */}
          <AccordionItem>
            <AccordionHeader tag="h5" targetId="contactAddressInfo">
              <div className="d-flex align-items-center">
                <HugeiconsIcon
                  icon={Home09Icon}
                  size={22}
                  className="me-2"
                  style={{ color: "#0ab39c" }}
                />
                <div className="fw-bold">Contact & Address Information</div>
              </div>

            </AccordionHeader>
            <AccordionBody accordionId="contactAddressInfo">
              <div className="row">
                <div className="col-12">
                  <TextInput
                    name="fullAddress"
                    labelText="Full Address"
                    value={generalInfoForm.values.fullAddress}
                    onChange={onChangeHndlr}
                    placeHolder="Enter full address"
                    maxLength={500}
                    isDisabled={isViewMode}
                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="villageCity"
                    labelText="Village/City"
                    value={generalInfoForm.values.villageCity}
                    onChange={onChangeHndlr}
                    placeHolder="Enter village/city"
                    maxLength={500}
                    isDisabled={isViewMode}
                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="state"
                    labelText="State"
                    value={generalInfoForm.values.state}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="pinCode"
                    labelText="Pin Code"
                    value={generalInfoForm.values.pinCode}
                    onChange={onChangeHndlr}
                    placeHolder="Enter pin code"
                    invalid={(generalInfoForm.touched.pinCode && generalInfoForm.errors.pinCode) ? true : false}
                    error={(generalInfoForm.touched.pinCode && generalInfoForm.errors.pinCode) ? generalInfoForm.errors.pinCode : ""}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <PhoneInput
                    name="phoneNumber"
                    labelText="Phone Number"
                    value={generalInfoForm.values.phoneNumber}
                    onChange={onChangeHndlr}

                    isDisabled={isViewMode}
                  />
                </div>
                <div className="col-4">
                  <RadioInputContainer
                    name="areaType"
                    labelText="Area Type"
                    radioOptions={areaTypeOptions}
                    value={generalInfoForm.values.areaType}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                  />
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Institutional Information */}
          <AccordionItem>
            <AccordionHeader tag="h5" targetId="institutionalInfo">
              <div className="d-flex align-items-center">
                <HugeiconsIcon
                  icon={School01Icon}
                  size={22}
                  className="me-2"
                  style={{ color: "#9333EA" }}
                />
                <div className="fw-bold">Institutional Information</div>
              </div>

            </AccordionHeader>
            <AccordionBody accordionId="institutionalInfo">
              <div className="row">
                <div className="col-4">
                  <TextInput
                    name="udiseCode"
                    labelText="UDISE Code"
                    value={generalInfoForm.values.udiseCode}
                    onChange={onChangeHndlr}
                    placeHolder="Enter UDISE code"
                    error={errors.udiseCode}
                    invalid={!!errors.udiseCode}
                    isDisabled
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="apaarId"
                    labelText="APAAR ID"
                    value={generalInfoForm.values.apaarId}
                    onChange={onChangeHndlr}
                    placeHolder="Enter APAAR ID"
                    invalid={(generalInfoForm.touched.apaarId && generalInfoForm.errors.apaarId) ? true : false}
                    error={(generalInfoForm.touched.apaarId && generalInfoForm.errors.apaarId) ? generalInfoForm.errors.apaarId : ""}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="brc"
                    labelText="BRC (Block Resource Centre)"
                    value={generalInfoForm.values.brc}
                    onChange={onChangeHndlr}
                    placeHolder="Enter BRC"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="crc"
                    labelText="CRC (Cluster Resource Centre)"
                    value={generalInfoForm.values.crc}
                    onChange={onChangeHndlr}
                    placeHolder="Enter CRC"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>

              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Parents/Guardians Information */}
          <AccordionItem>
            <AccordionHeader tag="h5" targetId="parentsGuardiansInfo">
              <div className="d-flex align-items-center">
                <HugeiconsIcon
                  icon={UserGroup02Icon}
                  size={22}
                  className="me-2"
                  style={{ color: "#D97705" }}
                />
                <div className="fw-bold">Parents/Guardians Information</div>
              </div>

            </AccordionHeader>
            <AccordionBody accordionId="parentsGuardiansInfo">
              <div className="row">
                <div className="col-12">
                  <h6 className="mb-3">Father's Information</h6>
                </div>
                <div className="col-4">
                  <TextInput
                    name="fatherName"
                    labelText="Name"
                    value={generalInfoForm.values.fatherName}
                    onChange={onChangeHndlr}
                    placeHolder="Enter father's name"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="fatherEducation"
                    labelText="Education"
                    value={generalInfoForm.values.fatherEducation}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="fatherOccupation"
                    labelText="Occupation"
                    value={generalInfoForm.values.fatherOccupation}
                    onChange={onChangeHndlr}
                    placeHolder="Enter father's occupation"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-12">
                  <h6 className="mb-3 mt-4">Mother's Information</h6>
                </div>
                <div className="col-4">
                  <TextInput
                    name="motherName"
                    labelText="Name"
                    value={generalInfoForm.values.motherName}
                    onChange={onChangeHndlr}
                    placeHolder="Enter mother's name"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="motherEducation"
                    labelText="Education"
                    value={generalInfoForm.values.motherEducation}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="motherOccupation"
                    labelText="Occupation"
                    value={generalInfoForm.values.motherOccupation}
                    onChange={onChangeHndlr}
                    placeHolder="Enter mother's occupation"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-12">
                  <h6 className="mb-3 mt-4">Guardian's Information</h6>
                </div>
                <div className="col-4">
                  <TextInput
                    name="guardianName"
                    labelText="Name"
                    value={generalInfoForm.values.guardianName}
                    onChange={onChangeHndlr}
                    placeHolder="Enter guardian's name"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="guardianEducation"
                    labelText="Education"
                    value={generalInfoForm.values.guardianEducation}
                    onChange={onChangeHndlr}
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
                <div className="col-4">
                  <TextInput
                    name="guardianOccupation"
                    labelText="Occupation"
                    value={generalInfoForm.values.guardianOccupation}
                    onChange={onChangeHndlr}
                    placeHolder="Enter guardian's occupation"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Attendance Record */}
          <AccordionItem>
            <AccordionHeader tag="h5" targetId="attendanceRecord">
              <div className="d-flex align-items-center">
                <HugeiconsIcon
                  icon={Appointment02Icon}
                  size={22}
                  className="me-2"
                  style={{ color: "#DC2626" }}
                />
                <div className="fw-bold">Attendance Record (Academic Year 2024-25)</div>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="attendanceRecord">
              <TableContainer
                columns={columnsData}
                data={attendanceData || []}
                tableClass="table-bordered"
                theadClass="table-light"
                divClass="mb-0"
                onChangeInputHndlr={attendanceTableChangeHandler}
              />

              <div className="col-4 mt-4">
                  <TextInput
                    name="lowAttendanceReason"
                    labelText="Reason for Low Attendance"
                    value={generalInfoForm.values.lowAttendanceReason}
                    onChange={onChangeHndlr}
                    placeHolder="Enter reason for low attendance"
                    isDisabled={isViewMode}
                    maxLength={500}

                  />
                </div>

              {/* Summary Section */}
              <div className="row mt-4">
                <div className="col-12">
                  <div className="card border-0 bg-light !tw-mb-0">
                    <div className="card-body p-3">
                      <div className="row align-items-center">
                        <div className="col-md-8">
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              <div
                                className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                <HugeiconsIcon
                                  icon={Appointment02Icon}
                                  size={24}
                                  color="#ffffff"
                                  strokeWidth={1.5}
                                />
                              </div>
                            </div>
                            <div>
                              <h6 className="mb-1 fw-semibold text-dark">
                                {totals.totalWorkingDays > 0
                                  ? `Overall Attendance: ${totals.attendancePercent}%`
                                  : "Overall Attendance: No data available"}
                              </h6>
                              <small className="text-muted">
                                {totals.totalWorkingDays > 0
                                  ? `${totals.totalDaysPresent} out of ${totals.totalWorkingDays} days`
                                  : "No data available"}
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 text-md-end">
                          {generalInfoForm.values.attendanceStatus ? (
                            <div
                              className={`badge rounded-pill px-2 py-2 fs-6 ${
                                generalInfoForm.values.attendanceStatus === "Satisfactory"
                                  ? "bg-success"
                                  : "bg-warning"
                              }`}
                            >
                              <HugeiconsIcon
                                icon={Tick01Icon}
                                size={20}
                                color="#ffffff"
                              />
                              Status: {generalInfoForm.values.attendanceStatus}
                            </div>
                          ) : (
                            <div className="px-2 py-2 fs-6 badge bg-success ">
                              <HugeiconsIcon
                                icon={UserQuestion01Icon}
                                size={20}
                                color="#ffffff"
                              />
                              Status: No data
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>

          {/* Student Interest */}
          <AccordionItem>
            <AccordionHeader tag="h5" targetId="studentInterests">
              <div className="d-flex align-items-center">
                <HugeiconsIcon
                  icon={IdentityCardIcon}
                  size={22}
                  className="me-2"
                  style={{ color: "#0ab39c" }}
                />
                <div className="fw-bold">Student Interest</div>
              </div>
            </AccordionHeader>
            <AccordionBody accordionId="studentInterests">
              <div className="row">
                <div className="col-12">
                  {interestOptions.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          className={`btn ${generalInfoForm.values.interests?.includes(interest)
                              ? "!tw-bg-[#0ab39c]/20 !tw-text-[#0ab39c] !tw-text-sm !tw-font-semibold !tw-rounded-full !tw-py-2 !tw-px-4 !tw-border !tw-border-[#0ab39c]"
                              : "tw-bg-white !tw-text-sm tw-text-gray-600 tw-border !tw-border-gray-300 !tw-rounded-full !tw-py-2 !tw-px-4"
                            }`}
                          onClick={() => handleInterestToggle(interest)}
                          disabled={isViewMode}
                        >
                          {formatInterestLabel(interest)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mb-3">
                      <p className="text-muted">
                        No interest options available. Please configure interest
                        options.
                      </p>
                    </div>
                  )}
                  <div className="col-4">
                    <TextInput
                      name="otherInterest"
                      labelText="Other (specify)"
                      value={generalInfoForm.values.otherInterest}
                      onChange={onChangeHndlr}
                      placeHolder="Enter other interests"
                      maxLength={500}
                      isDisabled={isViewMode}
                    />
                  </div>
                </div>
              </div>
            </AccordionBody>
          </AccordionItem>
        </UncontrolledAccordion>}

        {!isViewMode && getStudentByIdResp && (
          <div className="row mt-4">
            <div className="col-12 d-flex justify-content-between">
              <div className="ms-auto">
                <button type="button" className="btn btn-outline-primary me-2"
                  onClick={handleDraft}
                >
                  <HugeiconsIcon
                    icon={Bookmark03Icon}
                    size={20}
                    color="currentColor"
                    className="!tw-mr-1"
                  />
                  Save as draft
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleNext}
                >
                  Next Step <HugeiconsIcon
                    icon={CircleArrowRight01Icon}
                    size={20}
                    color="currentColor"
                    className="!tw-ml-1"
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>

  );
};

export default GeneralInformation;

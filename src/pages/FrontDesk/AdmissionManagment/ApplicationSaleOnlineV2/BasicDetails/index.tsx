import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, Label, FormFeedback, FormGroup } from "reactstrap";
import * as Yup from "yup";
import {
  DateInput,
  FullPageLoader,
  InputCheckbox,
  ModalContainerUpdated,
  NewPhoneInput,
  RadioInputContainer,
  SelectInput,
  TextIconInput,
  TextInput,
} from "../../../../../Components/Common";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { Current_Date } from "../../../../../utility/dateutility";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "../../../../../utility/storageUtility";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import { parseQueryStringToObject } from "../../../../../utility/commonutility";
import { resetApplicationSaleClassListAct, resetSubjectListForCBSEAct, resetTransportAvalabilityStatus } from "../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentslice";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  generateOtpForUserAct, generateTokenForUserAct, getAmountForApplicationSaleAct, getApplicationSaleClassList, getEnquiryDetailsByRefIdAct, getSecoundLanguagesList, getSubjectListForCambridgeList, getSubjectListForCBSEList, saveEnquiryAppSaleAct,
  getThirdLanguagesListAct
} from "../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getCountriesAct, getGenderListAct } from "../../../../../store/masterdata/masterdataactions";
import { getInstBranchesAct } from "../../../../../store/mastersettings/branch/branchactions";
import { getInstAcademicYearAct } from "../../../../../store/mastersettings/instacademics/instacademicactions";
import { getApplicationDetailsByCurriculumAct, getOtpSettingKeyAct } from "../../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import { getInstituteListAct } from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getStreamList } from "../../../../../store/academic/assignGroup/assigngroupactions";
import VerifyNumberModal from "./VerifyNumberModal";

const initialValue = {
  fullName: "",
  dob: "",
  contactNumber: "",
  contactPerson: "",
  groupId: "",
  optionalSubjects: [],
  cambrigeLanguageId: "",
  emailId: "",
  admissionClassId: "",
  secondLanguageId: "",
  secondLanguageName: "",
  thirdLanguageId: "",
  // isHostelAvailable: false,
  curriculumId: "",
  genderId: "",
  academicYearId: "",
};

const LanguagesForCambridge = [
  { id: 3, language: "HINDI" },
  { id: 7, language: "FRENCH" },
  { id: 37, language: "SPANISH" },
]

const BasicDetails = ({ updateStepHndlr, applicationSaleData, onApplicationSaleDetails, onInstructionScroll }: any) => {
  const { search, state } = useLocation<any>();
  const { phoneNumber = "" } = state || {};
  const history = useHistory();
  const queryParamsObject = parseQueryStringToObject(search);
  const dispatch = useAppDispatch()
  const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [curriculumName, setCurriculumName] = useState("");
  const [subjectsCBSE, setSubjectsCBSE] = useState<any>([]);
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const [languageForCambridgeState, setLanguageForCambridgeState] = useState<any>();
  const [hostelType, setHostelType] = useState('dayScholar');
  const [showErr, setShowErr] = useState({
    show: false,
    msg: "",
  })
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [filteredClasses, setFiltredClasses] = useState<any>([])

  const [verifyNumberModal, setVerifyNumberModal] = useState({
    showModal: false,
    studentRegNo: ""
  });

  // const { isHostelAvailable } = applicationSaleData.current.basicDetails || {}

  const {
    brchCurriculumResp,
    academicYearListResp,
    applicationSaleClassListResp,
    subjectListForCambridgeResp,
    secoundLanguageResp,
    thirdLanguageResp,
    applicationSaleError,
    streamListResp,
    showApiLoader,
    subjectListForCBSEResp,
    saveEnquiryAppSaleResp,
    verifyOtpForUserResp,
    getOtpSettingKeyResp,
    getEnquiryDetailsByRefIdResp,
    genderListResp,
    getApplicationDetailsByCurriculumResp,
    saveEnquiryAppSaleError,
  } = useAppSelector(
    ({
      assignGroupInfo,
      branchAcademics,
      applicationSale,
      globalData,
      admissionAvailabilityRequest,
      masterData,
      instAcademics,
      appData
    }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      applicationSaleClassListResp: applicationSale.applicationSaleClassListResp,
      subjectListForCambridgeResp: applicationSale.subjectListForCambridgeResp,
      secoundLanguageResp: applicationSale.secoundLanguageResp,
      thirdLanguageResp: applicationSale.thirdLanguageResp,
      applicationSaleError: applicationSale.applicationSaleError,
      generateTokenForUserResp: applicationSale.generateTokenForUserResp,
      saveEnquiryAppSaleError: applicationSale.saveEnquiryAppSaleError,
      streamListResp: assignGroupInfo.streamListResp,
      subjectListForCBSEResp: applicationSale.subjectListForCBSEResp,
      verifyOtpForUserResp: applicationSale.verifyOtpForUserResp,
      saveEnquiryAppSaleResp: applicationSale.saveEnquiryAppSaleResp,
      getEnquiryDetailsByRefIdResp: applicationSale.getEnquiryDetailsByRefIdResp,
      getOtpSettingKeyResp: admissionAvailabilityRequest.getOtpSettingKeyResp,
      genderListResp: masterData.genderListResp,
      showApiLoader: globalData.showApiLoader,
      getApplicationDetailsByCurriculumResp: admissionAvailabilityRequest.getApplicationDetailsByCurriculumResp,
    }),
    shallowEqual
  );

  const applicationSaleParentRef = useRef({
    prevSaveEnquiryAppSaleResp: saveEnquiryAppSaleResp,
    prevVerifyOtpForUserResp: verifyOtpForUserResp,
    prevGetEnquiryDetailsByRefIdResp: getEnquiryDetailsByRefIdResp,
    prevGetEnquiryDetailsByRefId2Resp: getEnquiryDetailsByRefIdResp,
    prevApplicationSaleError: applicationSaleError,
    prevSaveEnquiryAppSaleError: saveEnquiryAppSaleError,
  });

  useEffect(() => {
    const { prevSaveEnquiryAppSaleResp, prevVerifyOtpForUserResp, prevApplicationSaleError, prevSaveEnquiryAppSaleError } = applicationSaleParentRef.current;
    if (saveEnquiryAppSaleResp && saveEnquiryAppSaleResp !== prevSaveEnquiryAppSaleResp) {
      const { enquiryId } = saveEnquiryAppSaleResp || {};
      const { admissionClassId, optionalSubjects } = applicationSaleFormParent.values || {}
      const hostelFacility = applicationSaleClassListResp?.data?.find((cls: any) => +cls.classId === +admissionClassId)?.hostelFacility?.trim()
      let optionalSubject: any = {};
      // if (curriculumName === "CBSE") {
      //   optionalSubjects?.map((sub: any, index: number) => {
      //     optionalSubject[`optionalSubj${index + 1}Id`] = +sub.subjectId;
      //   });
      // }
      applicationSaleData.current.basicDetails = { ...applicationSaleFormParent.values, languageForCambridgeState, selectedSubjects, showLanguageSelect, enquiryId, isHostelAvailable: hostelFacility === "YES" ? true : false, ...optionalSubject };
      updateStepHndlr("stepup", applicationSaleFormParent.values, "1");
    }
    else if (verifyOtpForUserResp && prevVerifyOtpForUserResp !== verifyOtpForUserResp) {
      toggleVerifyNumberModal()
      toast.success("Mobile number verified successfully");
      if (getOtpSettingKeyResp) {
        const { settingValue } = getOtpSettingKeyResp || {}
        if (+settingValue === 1) {
          saveEnquiryAppSaleApiCall()
        }
      }
    }
    else if (applicationSaleError && applicationSaleError !== prevApplicationSaleError) {
      const { details } = applicationSaleError;
      toast.error(details);
    }
    else if (saveEnquiryAppSaleError && saveEnquiryAppSaleError !== prevSaveEnquiryAppSaleError) {
      const { details, code } = saveEnquiryAppSaleError;
      if (code === 422 || code === 400 || code === 404) {
        setShowErr({ show: true, msg: details })
      } else {
        toast.error(details);
      }
    }

    applicationSaleParentRef.current.prevSaveEnquiryAppSaleResp = saveEnquiryAppSaleResp;
    applicationSaleParentRef.current.prevVerifyOtpForUserResp = verifyOtpForUserResp;
    applicationSaleParentRef.current.prevApplicationSaleError = applicationSaleError;
    applicationSaleParentRef.current.prevSaveEnquiryAppSaleError = saveEnquiryAppSaleError;
  }, [saveEnquiryAppSaleResp, verifyOtpForUserResp, applicationSaleError, saveEnquiryAppSaleError]);

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Enter Full Name').nullable(),
    dob: Yup.date().required("Select dob.").nullable(),
    contactNumber: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required('Enter Contact Number').nullable(),
    emailId: Yup.string().email("Enter valid mail.").required('Enter Email Id').nullable(),
    contactPerson: Yup.string().required('Enter Parent Name').nullable(),
    admissionClassId: Yup.string().required('Select Admission For Class'),
    // secondLanguageId: Yup.string().when("admissionClassId", (classId, schema) => {
    //   if (!checkHigherClass(classId) && (secoundLanguageList?.length)) {
    //     return schema.required("Select Second Language")
    //   }
    // }).nullable(),
    // thirdLanguageId: Yup.string().nullable().test(
    //   "isThirdLanguageRequired",
    //   "Select Third Language",
    //   (value: any, context: any) => {
    //     const { admissionClassId, secondLanguageName } = context?.parent || {};

    //     if (
    //       curriculumName === "CBSE" &&
    //       !checkHigherClass(admissionClassId) &&
    //       !!secondLanguageName && thirdLanguageResp?.data.length > 0
    //     ) {
    //       if (secondLanguageName !== "TELUGU") {
    //         return !!value;
    //       } else if (checkThirdLanguage(admissionClassId)) {
    //         return !!value;
    //       }
    //     }
    //     return true;
    //   }
    // ),
    groupId: Yup.string().nullable().when("admissionClassId", (classId, schema) => {
      if (+applicationSaleFormParent.values.curriculumId === 1 && checkHigherClass(classId)) {
        return schema.required("Select Group")
      }
    }).nullable(),
    // cambrigeLanguageId: Yup.string().when("admissionClassId", (classId, schema) => {
    //   if (checkHigherClass(classId) && showLanguageSelect) {
    //     return schema.required("Choose your language")
    //   }
    // }).nullable(),
    // optionalSubjects: Yup.array().of(
    //   Yup.object().shape({
    //     subjectId: Yup.string().required('Select Subject').nullable()
    //   })
    // ),
    genderId: Yup.string().required('Select Gender'),
    curriculumId: Yup.string().required('Select Curriculum').nullable(),
  })

  const applicationSaleFormParent = useFormik({
    initialValues: initialValue,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {

      if (getOtpSettingKeyResp) {
        const { settingValue } = getOtpSettingKeyResp || {}
        if (+settingValue === 1) {
          const payload = {
            instituteId: queryParamsObject?.instituteId, branchId: queryParamsObject?.branchId, mobileNo: applicationSaleFormParent.values.contactNumber, name: applicationSaleFormParent.values.fullName,
          }
          dispatch(generateOtpForUserAct(generateActionPayload("generate_otp_for_guest_user", undefined, payload, { tokenNotRequired: true })));
          toggleVerifyNumberModal()
        } else {
          saveEnquiryAppSaleApiCall();
          onInstructionScroll()
        }
      }
    },
  });

  useEffect(() => {
    applicationSaleFormParent.setFieldValue("contactNumber", phoneNumber);
  }, [phoneNumber]);

  // useEffect(() => {
  //   if (brchCurriculumResp && brchCurriculumResp?.data.length > 0) {
  //     const curriculumId = String(brchCurriculumResp?.data[0]?.branchCurriculumId);
  //     applicationSaleFormParent.setFieldValue("curriculumId", curriculumId);
  //     onApplicationSaleDetails((prev: any) => ({ ...prev, curriculumId: curriculumId }));
  //   }
  // }, [brchCurriculumResp]);

  const isBranch1 = +queryParamsObject?.branchId === 1;
  const isHostelFacilityAvailableForGirls = !isBranch1 && applicationSaleFormParent.values.genderId !== "1";

  const initalAPICalls = () => {
    if (
      !isBranch1 &&
      hostelType &&
      hostelType === "hostel"
    ) {
      applicationSaleFormParent.setValues((prev: any) => ({ ...prev, genderId: '1' }));
    }
    dispatch(
      getGenderListAct(
        generateActionPayload("get_inst_global_records", undefined, {
          categoryName: "gender",
          sortBy: "genderName",
          orderBy: "asc",
        })
      )
    );
    dispatch(getCountriesAct(generateActionPayload("get_countries")));
    const payload2 = {
      pageSize: 100,
      pageNo: 0,
      instituteId: queryParamsObject.instituteId,
    };
    // dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload2, {
    //   hideLoader: true,
    // })));
    const payload3 = {
      branchId: queryParamsObject?.branchId,
      instituteId: queryParamsObject?.instituteId,
    }
    dispatch(getAmountForApplicationSaleAct(generateActionPayload("get_amt_for_application_sale", undefined, payload3)));
    // const payload4 = { instituteId: queryParamsObject.instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    // dispatch(getInstAcademicYearAct(
    //   generateActionPayload("get_inst_academic_year", undefined, payload4, { tokenNotRequired: true })
    // ));
    // dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, payload2)));
    dispatch(getOtpSettingKeyAct(generateActionPayload("get_otp_setting_key", { searchString: "OTP_VERIFY" }, payload2)));
  }

  useEffect(() => {
    return () => {
      dispatch(resetTransportAvalabilityStatus(undefined));
    }
  }, []);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const yearId = data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId || "";
      if (yearId) {
        applicationSaleFormParent.setFieldValue("academicYearId", yearId);
        getCurriculumApiCall({ academicYearId: yearId });
      }
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const yearId = data.find(
        (year: any) => year.academicYearId === +queryParamsObject.academicYearId
      )?.academicYearId;
      if (yearId) {
        applicationSaleFormParent.setFieldValue("academicYearId", yearId);
        getCurriculumApiCall({ academicYearId: yearId });
      }
    }
  }, [academicYearListResp, queryParamsObject.academicYearId]);


  useEffect(() => {
    setCurriculumName(
      brchCurriculumResp?.data.find(
        (curr: any) => curr.branchCurriculumId === +applicationSaleFormParent.values.curriculumId
      )?.curriculumName
    );
  }, [brchCurriculumResp, applicationSaleFormParent.values.curriculumId]);

  useEffect(() => {
    let subjects: any = [];
    const { prevGetEnquiryDetailsByRefId2Resp } = applicationSaleParentRef.current || {}
    if (subjectListForCBSEResp) {
      subjectListForCBSEResp?.data?.optionalSubjects.map((sub: any) => {
        subjects.push({
          subjectId: "",
        });
      });
      if (!(getEnquiryDetailsByRefIdResp && getEnquiryDetailsByRefIdResp !== prevGetEnquiryDetailsByRefId2Resp)) {
        applicationSaleFormParent.setFieldValue("optionalSubjects", subjects);
      }
      setSubjectsCBSE(subjectListForCBSEResp.data.optionalSubjects);
      applicationSaleParentRef.current.prevGetEnquiryDetailsByRefId2Resp = getEnquiryDetailsByRefIdResp
    }
  }, [subjectListForCBSEResp]);

  useEffect(() => {
    if (getEnquiryDetailsByRefIdResp && brchCurriculumResp) {
      let subjects: any = [];
      const {
        studentName,
        dob,
        contactNumber,
        parentName,
        emailId,
        classId,
        groupId,
        secondLanguageId,
        thirdLanguageId,
        igcseLanguageId,
      } = getEnquiryDetailsByRefIdResp || {};

      if (getEnquiryDetailsByRefIdResp?.optionalSubj1Id) {
        subjects.push({ subjectId: getEnquiryDetailsByRefIdResp?.optionalSubj1Id });
        if (getEnquiryDetailsByRefIdResp?.optionalSubj2Id) {
          subjects.push({ subjectId: getEnquiryDetailsByRefIdResp?.optionalSubj2Id });
        }
      }

      applicationSaleFormParent.setValues((prev: any) => ({
        ...prev,
        fullName: studentName,
        dob,
        contactNumber,
        contactPerson: parentName,
        emailId,
        admissionClassId: classId,
        groupId,
        secondLanguageId,
        cambrigeLanguageId: igcseLanguageId,
        optionalSubjects: subjects,
      }));

      getSecondLanguageList({ classId });
      if (thirdLanguageId) {
        getThirdLanguageList({ classId });
      }
      if (groupId) {
        getStreamApiCall({ classId });
        getSubjectListForCbseApiCall({ classId, groupId });
      }
    }
  }, [getEnquiryDetailsByRefIdResp, brchCurriculumResp]);

  useEffect(() => {
    const { curriculumId } = applicationSaleFormParent.values;
    if (curriculumId) {
      appSaleClassListAPiCall({ curriculumId });
    }
  }, [applicationSaleFormParent.values.curriculumId]);


  useEffect(() => {
    if (applicationSaleClassListResp && getEnquiryDetailsByRefIdResp && curriculumName === "CAMBRIDGE INTERNATIONAL") {
      const { classId } = getEnquiryDetailsByRefIdResp || {}
      if (checkHigherClass(classId)) {
        getSubjectListForCambridgeApiCall({ classId })
      }
    }
  }, [applicationSaleClassListResp, getEnquiryDetailsByRefIdResp])


  useEffect(() => {
    const { data: secondLanguageList } = secoundLanguageResp || {};
    if (Array.isArray(secondLanguageList) && getEnquiryDetailsByRefIdResp && curriculumName === "CBSE") {
      if (getEnquiryDetailsByRefIdResp?.secondLanguageId) {
        const languageName = secondLanguageList.find(item => item.languageId === +getEnquiryDetailsByRefIdResp?.secondLanguageId)?.languageName || '';
        applicationSaleFormParent.setValues((prev: any) => ({
          ...prev,
          secondLanguageName: languageName
        }));
      }
    }
  }, [secoundLanguageResp, getEnquiryDetailsByRefIdResp])

  useEffect(() => {
    const { prevGetEnquiryDetailsByRefIdResp } = applicationSaleParentRef.current || {}
    if (applicationSaleClassListResp && (getEnquiryDetailsByRefIdResp && getEnquiryDetailsByRefIdResp !== prevGetEnquiryDetailsByRefIdResp) && curriculumName === "CAMBRIDGE INTERNATIONAL") {
      const { subjectIds: prevSelecectedSubjects, igcseLanguageId } = getEnquiryDetailsByRefIdResp || {}
      if (prevSelecectedSubjects) {
        const updatedSub = prevSelecectedSubjects?.split(",")?.map((item: any) => +item)
        setSelectedSubjects(updatedSub)
        if (Array.isArray(subjectListForCambridgeResp?.data?.optionalSubjects) && subjectListForCambridgeResp?.data?.optionalSubjects?.length > 0) {
          const isLanguagePresent = subjectListForCambridgeResp?.data?.optionalSubjects?.some((item: any) => (updatedSub.includes(+item?.subjectId) && item?.subjectName === "LANGUAGES"))
          if (isLanguagePresent) {
            setShowLanguageSelect(true)
            setLanguageForCambridgeState(igcseLanguageId)
          }
        }
      }
    }
    applicationSaleParentRef.current.prevGetEnquiryDetailsByRefIdResp = getEnquiryDetailsByRefIdResp
  }, [subjectListForCambridgeResp])


  const checkHigherClass = (classId: any) => {
    if (classId && applicationSaleClassListResp) {
      const classSequenceNo = +(applicationSaleClassListResp.data.find(
        (cls: any) => +cls.classId === +classId
      )?.classSequence?.toString())
      if (classSequenceNo >= 14) {
        return true
      } else {
        return false
      }
    }
  };

  const checkThirdLanguage = (classId: any) => {
    if (classId && applicationSaleClassListResp) {
      const classSequenceNo = +(applicationSaleClassListResp.data.find(
        (cls: any) => +cls.classId === +classId
      )?.classSequence?.toString())
      if (classSequenceNo === 8 || classSequenceNo === 9 || classSequenceNo === 10 ||
        classSequenceNo === 11
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  const appSaleClassListAPiCall = (otherDetails?: any) => {
    const payload = {
      instituteId: queryParamsObject?.instituteId,
      branchId: queryParamsObject?.branchId,
      curriculumId: applicationSaleFormParent.values.curriculumId,
      academicYearId: queryParamsObject.academicYearId,
      dateOfBirth: applicationSaleFormParent.values.dob,
      applicationType: "ONLINE",
      ...otherDetails,
    };
    dispatch(
      getApplicationSaleClassList(
        generateActionPayload(
          "get_application_sale_class_list",
          undefined,
          payload
        )
      )
    );
  }

  const getStreamApiCall = (otherDetails?: any) => {
    const payload = {
      academicYearId: queryParamsObject.academicYearId,
      curriculumId: applicationSaleFormParent.values.curriculumId,
      classId: applicationSaleFormParent.values.admissionClassId,
      branchId: queryParamsObject?.branchId,
      pageNo: 0,
      pageSize: 1000,
      sortBy: "streamGroupName",
      orderBy: "asc",
      ...otherDetails,
    };
    if (payload.classId && payload.curriculumId) {
      dispatch(
        getStreamList(
          generateActionPayload("get_stream_list", undefined, payload)
        )
      );
    }
  }

  const getSubjectListForCbseApiCall = (otherDetails?: any) => {
    const params = {
      instituteId: queryParamsObject?.instituteId,
      classId: applicationSaleFormParent.values.admissionClassId,
      groupId: applicationSaleFormParent.values.groupId,
      ...otherDetails,
    };
    dispatch(
      getSubjectListForCBSEList(
        generateActionPayload(
          "get_preadmission_subject_cbse",
          undefined,
          params
        )
      )
    );
  }

  const getSubjectListForCambridgeApiCall = (otherDetails?: any) => {
    const params = {
      instituteId: queryParamsObject.instituteId,
      classId: applicationSaleFormParent.values.admissionClassId,
      academicYearId: queryParamsObject.academicYearId,
      ...otherDetails,
    };
    if (params.classId) {
      dispatch(
        getSubjectListForCambridgeList(
          generateActionPayload(
            "get_preadmission_subject_cambridge",
            undefined,
            params
          )
        )
      );
    }
  }

  const getSecondLanguageList = (otherProps?: any) => {
    const params = {
      instituteId: queryParamsObject?.instituteId,
      academicYearId: queryParamsObject.academicYearId,
      branchId: queryParamsObject?.branchId,
      curriculumId: applicationSaleFormParent.values.curriculumId,
      classId: applicationSaleFormParent.values.admissionClassId,
      type: "SECOND",
      ...otherProps,
    };
    if (params.classId) {
      dispatch(
        getSecoundLanguagesList(
          generateActionPayload(
            "get_secound_language_list",
            undefined,
            params
          )
        )
      );
    }
  }
  const getThirdLanguageList = (otherProps?: any) => {
    const params = {
      instituteId: queryParamsObject?.instituteId,
      academicYearId: queryParamsObject.academicYearId,
      branchId: queryParamsObject?.branchId,
      curriculumId: applicationSaleFormParent.values.curriculumId,
      classId: applicationSaleFormParent.values.admissionClassId,
      type: "THIRD",
      ...otherProps,
    };
    if (params.classId) {
      dispatch(
        getThirdLanguagesListAct(
          generateActionPayload(
            "get_secound_language_list",
            undefined,
            params
          )
        )
      );
    }
  }

  const saveEnquiryAppSaleApiCall = () => {
    const { admissionClassId, contactNumber, contactPerson, dob, emailId, fullName, groupId, secondLanguageId, thirdLanguageId, optionalSubjects, cambrigeLanguageId, curriculumId, genderId } = applicationSaleFormParent.values || {};
    let payload: any = {
      studentName: fullName, parentName: contactPerson, branchClassId: admissionClassId,
      contactNo: contactNumber, academicYearId: queryParamsObject.academicYearId,
      branchId: queryParamsObject.branchId,
      branchCurriculumId: applicationSaleFormParent.values.curriculumId,
      emailId, dateOfBirth: dob, instituteId: queryParamsObject.instituteId,
      groupId: groupId || null, secondLanguageId: secondLanguageId || null,
      thirdLanguageId: thirdLanguageId || null,
      igcseLanguageId: cambrigeLanguageId || null,
      curriculumId, genderId, hostelType,
      admissionType: hostelType === "hostel" ? "Residential" : "Non-Residential"
    }
    if (queryParamsObject.enquiryRefId) {
      payload.enquiryId = getEnquiryDetailsByRefIdResp?.enquiryId
    }
    // if (curriculumName === "CBSE") {
    //   let optionalSubject: any = {};
    //   optionalSubjects?.map((sub: any, index: number) => {
    //     optionalSubject[`optionalSubj${index + 1}Id`] = +sub.subjectId;
    //   });
    //   payload = { ...payload, ...optionalSubject };
    // }
    if (Array.isArray(selectedSubjects)) {
      payload = { ...payload, subjectIds: selectedSubjects.length > 0 ? selectedSubjects : [] }
    }

    dispatch(saveEnquiryAppSaleAct(generateActionPayload("save_enquiry_app_sale", undefined, payload)));
  }

  const ContactNoChangeHandler = (contactNo: any) => {
    const contactNumber = contactNo.substring(2);
    applicationSaleFormParent.setFieldValue("contactNumber", contactNumber);
  };

  const ChangeHandler = (event: any) => {
    const { name, value } = event.target || {};
    if (name !== "admissionClassId") {
      applicationSaleFormParent.handleChange(event);
    }
    const { admissionClassId, dob } = applicationSaleFormParent.values;
    if (getLocalStorage("accesstoken")) {
      if (name === "admissionClassId") {
        setSelectedSubjects([])
        const selectedClass = applicationSaleClassListResp?.data.find(
          (cls: any) => cls.classId === +value
        )
        if (!hostelType || hostelType !== "hostel" || (hostelType === "hostel" && selectedClass?.hostelFacility === "YES")) {
          // applicationSaleFormParent.handleChange(event);
          // applicationSaleFormParent.setFieldValue('admissionClassId', value)
          // applicationSaleFormParent.setFieldValue('groupId', "")
          // applicationSaleFormParent.setFieldValue("secondLanguageId", "");
          // applicationSaleFormParent.setFieldValue("cambrigeLanguageId", "");
          // applicationSaleFormParent.setFieldValue("optionalSubjects", []);
          applicationSaleFormParent.setValues((prev) => ({
            ...prev,
            groupId: "",
            secondLanguageId: "",
            secondLanguageName: "",
            cambrigeLanguageId: "",
            optionalSubjects: [],
            admissionClassId: value
          }))
          dispatch(resetSubjectListForCBSEAct(undefined));
          if (curriculumName === "CBSE" && checkHigherClass(value)) {
            getStreamApiCall({ classId: value })
          } else if (
            curriculumName === "CAMBRIDGE INTERNATIONAL" &&
            checkHigherClass(value)
          ) {
            getSubjectListForCambridgeApiCall({ classId: value })
          } else {
            getSecondLanguageList({ classId: value });
            if (curriculumName === "CBSE") {
              getThirdLanguageList({ classId: value });
            }
          }
        }
        else {
          applicationSaleFormParent.setFieldValue('admissionClassId', "")
          toast.error('Hostel Facility is not available for this class')
        }
      }
      else if (name === "groupId") {
        getSubjectListForCbseApiCall({ classId: admissionClassId, groupId: value })
        applicationSaleFormParent.setFieldValue("optionalSubjects", []);
      } else if (name === "dob") {
        // dispatch(resetApplicationSaleClassListAct(undefined));
        // applicationSaleFormParent.setFieldValue('admissionClassId', "")
        // if (value) {
        //   appSaleClassListAPiCall({ dateOfBirth: value })
        // }
        appSaleClassListAPiCall({ dateOfBirth: value })
      }
      else if (name === "curriculumId") {
        dispatch(resetApplicationSaleClassListAct(undefined));
        applicationSaleFormParent.setFieldValue('admissionClassId', "")
        if (value) {
          appSaleClassListAPiCall({ curriculumId: value })
        }
      }
    }
  };
  const CheckBoxHandler = (subjectId: any) => {
    setLanguageForCambridgeState("")
    applicationSaleFormParent.setFieldValue("cambrigeLanguageId", "");
    let LanguagesubjectId: any;
    subjectForCambridge && subjectForCambridge?.optionalSubjects?.map((item: any) => {
      if (item?.subjectName === "LANGUAGES") {
        LanguagesubjectId = +item?.subjectId
      }
    })
    if (selectedSubjects.includes(subjectId)) {
      let leftSubjects = selectedSubjects.filter(
        (sub: any) => sub !== subjectId
      );
      if (leftSubjects?.includes(LanguagesubjectId)) {
        setShowLanguageSelect(true)
      } else {
        setShowLanguageSelect(false)
      }
      setSelectedSubjects(leftSubjects);
    } else {

      if (([...selectedSubjects, subjectId]?.includes(LanguagesubjectId)) && +([...selectedSubjects, subjectId].length) !== 5) {
        setShowLanguageSelect(true)
      } else {
        setShowLanguageSelect(false)
      }
      if (([...selectedSubjects, subjectId].length) > 4) {
        toast.warning("You can choose any four subjects")
      } else {
        setSelectedSubjects([...selectedSubjects, subjectId]);
      }
    }
  };

  const toggleVerifyNumberModal = () => {
    setVerifyNumberModal((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
  };

  const stepDownHndler = () => {
    updateStepHndlr("stepback", {}, "1");
    setShowErr({ show: false, msg: "" })
    applicationSaleFormParent.resetForm()
    if (queryParamsObject.enquiryRefId) {
      history.push(`/online-application-sale?curriculum=${applicationSaleFormParent.values.curriculumId}&branchId=${queryParamsObject.branchId}&academicYearId=${queryParamsObject.academicYearId}&instituteId=${queryParamsObject.instituteId}`)
    }
    getCurriculumApiCall({ academicYearId: applicationSaleFormParent.values.academicYearId });
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: queryParamsObject?.academicYearId,
      branchId: queryParamsObject.branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      // orderBy: "dec",
      ...otherProps,
    };
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload1)
      )
    );
  };

  useEffect(() => {
    applicationSaleFormParent.setFieldValue(
      "hostelType",
      hostelType === "hostel" ? "Residential" : "Non-Residential"
    );

    if (isHostelFacilityAvailableForGirls && hostelType === "hostel") {
      setHostelType("dayScholar");
      onApplicationSaleDetails((prev: any) => ({ ...prev, hostelType: "dayScholar" }));
    }
  }, [hostelType, applicationSaleFormParent.values.genderId, isBranch1]);

  useEffect(() => {
    if (isHostelFacilityAvailableForGirls) {
      setHostelType("dayScholar")
      onApplicationSaleDetails((prev) => ({
        ...prev,
        hostelType: "dayScholar",
      }));
    }
  }, [applicationSaleFormParent.values.genderId, isBranch1])

  useEffect(() => {
    initalAPICalls();
    if (queryParamsObject.enquiryRefId) {
      const { enquiryRefId, instituteId, branchId, academicYearId } = queryParamsObject;
      const payload = { enquiryRefId, instituteId, branchId, curriculum: applicationSaleFormParent.values.curriculumId, academicYearId };
      dispatch(getEnquiryDetailsByRefIdAct(generateActionPayload("enquiry_details_by_ref_id", undefined, payload)));
    }
  }, [applicationSaleFormParent.values.curriculumId]);

  useEffect(() => {
    const data = applicationSaleClassListResp?.data;
    if (Array.isArray(data) && data.length > 0) {
      const modifiedClasses = data;
      if (hostelType === "hostel") {
        setFiltredClasses(
          modifiedClasses.filter(
            (item: any) => item.hostelFacility?.toLowerCase() === "yes"
          )
        );
      } else {
        setFiltredClasses(modifiedClasses);
      }
    } else {
      setFiltredClasses([]);
    }
  }, [applicationSaleClassListResp, hostelType, brchCurriculumResp]);

  function onChangeSecondLangHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const { data: secondLanguageList = [] } = secoundLanguageResp || {};
    const { data: thirdLanguageList = [] } = thirdLanguageResp || {};

    if (!value) {
      applicationSaleFormParent.setValues(prevValues => ({
        ...prevValues,
        [name]: "",
        secondLanguageName: "",
        thirdLanguageId: ""
      }));
      return;
    }
    const selectedLang = secondLanguageList.find(item => item.languageId === +value);
    const languageName = selectedLang?.languageName || "";
    const updatedValues: any = {
      [name]: value,
      secondLanguageName: languageName,
      thirdLanguageId: ""
    };
    if (languageName !== "TELUGU") {
      const teluguLang = thirdLanguageList.find(item => item.languageName === "TELUGU");
      updatedValues.thirdLanguageId = teluguLang?.languageId || "";
    }
    applicationSaleFormParent.setValues(prevValues => ({
      ...prevValues,
      ...updatedValues,
    }));
  }

  const {
    thirdLanguages,
    canShowThirdLanguage,
    isDisabledThirdLanguage
  } = useMemo(() => {
    const { data } = thirdLanguageResp || {};
    const { secondLanguageName, admissionClassId } = applicationSaleFormParent.values;

    let filteredLanguages: any[] = [];
    let showThirdLanguage = false;
    let disableThirdLanguage = false;

    if (Array.isArray(data)) {
      if (secondLanguageName === "TELUGU") {
        filteredLanguages = data.filter(item => item.languageName !== "TELUGU");
      } else {
        filteredLanguages = data;
        disableThirdLanguage = true; // disable dropdown
      }
    }

    if (!checkHigherClass(admissionClassId) && curriculumName === "CBSE" && secondLanguageName) {
      if (secondLanguageName !== "TELUGU") {
        showThirdLanguage = true;
      } else {
        showThirdLanguage = checkThirdLanguage(admissionClassId);
      }
    }

    return {
      thirdLanguages: filteredLanguages,
      canShowThirdLanguage: showThirdLanguage,
      isDisabledThirdLanguage: disableThirdLanguage
    };
  }, [
    thirdLanguageResp,
    applicationSaleFormParent.values.secondLanguageName,
    applicationSaleFormParent.values.admissionClassId,
    curriculumName
  ]);

  const { branchDetailsDto } = getApplicationDetailsByCurriculumResp || {};
  const { isHostelAvailable } = branchDetailsDto || {};
  const { data: subjectForCambridge } = subjectListForCambridgeResp || {};
  const { data: secoundLanguageList } = secoundLanguageResp || {};
  const { content: streamList } = streamListResp || {};
  const { data: subjectForCBSE } = subjectListForCBSEResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  return (
    <>
      {!showErr.show ? (
        // Use CSS Grid with gaps (replaces flex wrap)
        <div className="form-inputs tw-grid md:tw-grid-cols-2 tw-gap-x-6 tw-mt-4 tw-gap-y-4">
          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              Full name along with Surname <span className="font-bold flash-text text-danger">(As per Aadhaar)</span> <span className="text-danger">*</span>
            </label>
            <TextInput
              name="fullName"
              inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
              value={applicationSaleFormParent.values.fullName}
              onChange={applicationSaleFormParent.handleChange}
              onBlur={applicationSaleFormParent.handleBlur}
              invalid={applicationSaleFormParent.touched.fullName && applicationSaleFormParent.errors.fullName ? true : false}
              error={applicationSaleFormParent.touched.fullName && applicationSaleFormParent.errors.fullName ? applicationSaleFormParent.errors.fullName : ""}
              placeHolder="Student Full Name"
              formgroupClassName="mb-0"
            />
          </div>

          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              Contact No (For Communication) <span className="text-danger">*</span>
            </label>
            <NewPhoneInput
              placeHolder="Mobile Number"
              name="contactNumber"
              formgroupClassName="mb-0"
              inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
              value={applicationSaleFormParent.values.contactNumber}
              isDisabled={Boolean(phoneNumber)}
              onChange={ContactNoChangeHandler}
              onBlur={applicationSaleFormParent.handleBlur}
              invalid={applicationSaleFormParent.touched.contactNumber && applicationSaleFormParent.errors.contactNumber ? true : false}
              error={applicationSaleFormParent.touched.contactNumber && applicationSaleFormParent.errors.contactNumber ? applicationSaleFormParent.errors.contactNumber : ""}
            />
          </div>

          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              Email Id (For Communication) <span className="text-danger">*</span>
            </label>
            <TextIconInput
              name="emailId"
              inputClassName="!tw-rounded-lg !tw-py-2.5"
              value={applicationSaleFormParent.values.emailId}
              onChange={applicationSaleFormParent.handleChange}
              onBlur={applicationSaleFormParent.handleBlur}
              invalid={applicationSaleFormParent.touched.emailId && applicationSaleFormParent.errors.emailId ? true : false}
              error={applicationSaleFormParent.touched.emailId && applicationSaleFormParent.errors.emailId ? applicationSaleFormParent.errors.emailId : ""}
              placeHolder="xyz@gmail.com"
              formgroupClassName="mb-0"
            >
              <i className="ri-mail-unread-line"></i>
            </TextIconInput>
          </div>

          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              Parent Name <span className="font-bold flash-text text-danger">(As per Aadhaar)</span> <span className="text-danger">*</span>
            </label>
            <TextInput
              name="contactPerson"
              inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
              value={applicationSaleFormParent.values.contactPerson}
              onChange={applicationSaleFormParent.handleChange}
              onBlur={applicationSaleFormParent.handleBlur}
              invalid={applicationSaleFormParent.touched.contactPerson && applicationSaleFormParent.errors.contactPerson ? true : false}
              error={applicationSaleFormParent.touched.contactPerson && applicationSaleFormParent.errors.contactPerson ? applicationSaleFormParent.errors.contactPerson : ""}
              placeHolder="Parent Full Name"
              formgroupClassName="mb-0"
            />
          </div>

          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              Curriculum <span className="text-danger">*</span>
            </label>
            <SelectInput
              name="curriculumId"
              inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
              value={applicationSaleFormParent.values.curriculumId}
              onChange={(e) => {
                applicationSaleFormParent.handleChange(e);
                applicationSaleFormParent.setFieldValue("admissionClassId", "", true);
                onApplicationSaleDetails((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
              onBlur={applicationSaleFormParent.handleBlur}
              menuItems={curriculumTypes || []}
              valueKey="branchCurriculumId"
              textKey="classRange"
              invalid={applicationSaleFormParent.touched.curriculumId && applicationSaleFormParent.errors.curriculumId ? true : false}
              error={applicationSaleFormParent.touched.curriculumId && applicationSaleFormParent.errors.curriculumId ? applicationSaleFormParent.errors.curriculumId : ""}
              formgroupClassName="mb-0"
            />
          </div>

          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              Gender <span className="text-danger">*</span>
            </label>
            <SelectInput
              name="genderId"
              inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
              value={applicationSaleFormParent.values.genderId}
              onChange={applicationSaleFormParent.handleChange}
              onBlur={applicationSaleFormParent.handleBlur}
              menuItems={genderListResp?.data || []}
              valueKey="genderId"
              textKey="genderName"
              isDisabled={hostelType === "hostel" && !isBranch1}
              invalid={applicationSaleFormParent.touched.genderId && applicationSaleFormParent.errors.genderId ? true : false}
              error={applicationSaleFormParent.touched.genderId && applicationSaleFormParent.errors.genderId ? applicationSaleFormParent.errors.genderId : ""}
              formgroupClassName="mb-0"
            />
          </div>

          {isHostelAvailable !== false && (
            <div className="tw-col-span-2 md:tw-col-span-1">
              <div className="admission-type">
                <label className="tw-font-medium title-type">Admission Type :&nbsp;</label>
                <div className="tw-flex tw-gap-3">
                  <button
                    type="button"
                    className={`tw-px-4 tw-py-2 tw-rounded-full tw-border 
                      ${isHostelFacilityAvailableForGirls
                        ? "tw-cursor-not-allowed tw-bg-[#FFF9F4] tw-border-[#EA760B]"
                        : hostelType === "dayScholar"
                          ? "tw-bg-[#FFF9F4] tw-border-[#EA760B]"
                          : "tw-bg-white tw-border-gray-300"
                      }`}
                    onClick={() => {
                      setHostelType("dayScholar");
                      onApplicationSaleDetails((p: any) => ({ ...p, hostelType: "dayScholar" }));
                    }}
                    disabled={isHostelFacilityAvailableForGirls}
                  >
                    Day Scholar
                  </button>

                  <button
                    type="button"
                    className={`tw-px-4 tw-py-2 tw-rounded-full tw-border 
                      ${isHostelFacilityAvailableForGirls
                        ? "tw-cursor-not-allowed"
                        : hostelType === "hostel"
                          ? "tw-bg-[#FFF9F4] tw-border-[#EA760B]"
                          : "tw-bg-white tw-border-gray-300"
                      }`}
                    onClick={() => {
                      setHostelType("hostel");
                      onApplicationSaleDetails((p: any) => ({ ...p, hostelType: "hostel" }));
                    }}
                    disabled={isHostelFacilityAvailableForGirls}
                  >
                    Hostel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              DOB <span className="font-bold flash-text text-danger">(As per Date of Birth Certificate)</span> <span className="text-danger">*</span>
            </label>
            <DateInput
              name="dob"
              inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
              value={applicationSaleFormParent.values.dob}
              onChange={ChangeHandler}
              maxDate={Current_Date}
              onBlur={applicationSaleFormParent.handleBlur}
              invalid={applicationSaleFormParent.touched.dob && applicationSaleFormParent.errors.dob ? true : false}
              error={applicationSaleFormParent.touched.dob && applicationSaleFormParent.errors.dob ? applicationSaleFormParent.errors.dob : ""}
              formgroupClassName="mb-0"
            />
          </div>

          <div className="tw-col-span-2 md:tw-col-span-1">
            <label className="tw-font-medium">
              Class <span className="text-danger">*</span>
            </label>
            <SelectInput
              name="admissionClassId"
              inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
              value={applicationSaleFormParent.values.admissionClassId}
              onChange={ChangeHandler}
              onBlur={applicationSaleFormParent.handleBlur}
              menuItems={filteredClasses || []}
              valueKey="classId"
              textKey="classShortName"
              invalid={applicationSaleFormParent.touched.admissionClassId && applicationSaleFormParent.errors.admissionClassId ? true : false}
              error={applicationSaleFormParent.touched.admissionClassId && applicationSaleFormParent.errors.admissionClassId ? applicationSaleFormParent.errors.admissionClassId : ""}
              formgroupClassName="mb-0"
            />
            {!(+queryParamsObject?.branchId === 6) && (
              <div className="tw-mt-2">
                <p className="fs-13 mb-0 text-success">Note :- EY-1 is equivalent to NURSERY.</p>
                <p className="fs-13 mb-0 text-success">EY-2 is equivalent to PP I / LKG</p>
                <p className="fs-13 mb-0 text-success">EY-3 is equivalent to PP II / UKG</p>
              </div>
            )}
          </div>

          {curriculumName === "CBSE" && checkHigherClass(applicationSaleFormParent.values.admissionClassId) && (
            <div className="tw-col-span-2 md:tw-col-span-1">
              <label className="tw-font-medium">
                Group <span className="text-danger">*</span>
              </label>
              <SelectInput
                name="groupId"
                inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
                value={applicationSaleFormParent.values.groupId}
                onChange={ChangeHandler}
                onBlur={applicationSaleFormParent.handleBlur}
                menuItems={streamList || []}
                valueKey="id"
                textKey="shortName"
                invalid={applicationSaleFormParent.touched.groupId && applicationSaleFormParent.errors.groupId ? true : false}
                error={applicationSaleFormParent.touched.groupId && applicationSaleFormParent.errors.groupId ? applicationSaleFormParent.errors.groupId : ""}
                formgroupClassName="mb-0"
              />
              <p className="text-muted fs-13 pt-1 mb-0">
                CORE SUBJECTS : <span>{subjectForCBSE?.mandatorySubjects.join(",")}</span>
              </p>
            </div>
          )}

          {/* {curriculumName === "CBSE" &&
            applicationSaleFormParent.values.groupId &&
            checkHigherClass(applicationSaleFormParent.values.admissionClassId) && (
              <FormikProvider value={applicationSaleFormParent}>
                <FieldArray name="optionalSubjects">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {applicationSaleFormParent.values.optionalSubjects &&
                          applicationSaleFormParent.values.optionalSubjects.map((sub: any, index: number) => {
                            const inputFieldErrors: any =
                              (applicationSaleFormParent.errors.optionalSubjects &&
                                applicationSaleFormParent.errors.optionalSubjects[index]) || {};
                            const inputFieldTouched: any =
                              (applicationSaleFormParent.touched.optionalSubjects &&
                                applicationSaleFormParent.touched.optionalSubjects[index]) || {};
                            return (
                              <div className="tw-col-span-2 md:tw-col-span-1" key={index}>
                                <SelectInput
                                  name={`optionalSubjects[${index}].subjectId`}
                                  value={sub.subjectId}
                                  onChange={applicationSaleFormParent.handleChange}
                                  onBlur={applicationSaleFormParent.handleBlur}
                                  menuItems={subjectsCBSE[index]?.subjects || []}
                                  valueKey="subjectId"
                                  textKey="subjectName"
                                  labelText={`${subjectForCBSE?.mandatorySubjects.length + index + 1}th Subject`}
                                  invalid={inputFieldTouched.subjectId && inputFieldErrors.subjectId ? true : false}
                                  error={inputFieldTouched.subjectId && inputFieldErrors.subjectId ? inputFieldErrors.subjectId : ""}
                                  formgroupClassName="mb-0"
                                />
                              </div>
                            );
                          })}
                      </>
                    );
                  }}
                </FieldArray>
              </FormikProvider>
            )} */}

          {curriculumName === "CAMBRIDGE INTERNATIONAL" &&
            checkHigherClass(applicationSaleFormParent.values.admissionClassId) && (
              <div className="tw-col-span-2 md:tw-col-span-1">
                <p className="my-1">Choose any four subjects</p>
                <div className="tw-flex tw-items-center">
                  <InputCheckbox name="english" value={true} onChange={() => { }} isDisabled={true} formgroupClassName="mb-0" />
                  <label className="tw-font-medium fs-16 tw-mb-0">English</label>
                </div>
                {subjectForCambridge?.optionalSubjects.map((sub: any, index: number) => (
                  <InputCheckbox
                    key={index}
                    name={sub.subjectName}
                    labelName={sub.subjectName}
                    value={selectedSubjects.includes(sub.subjectId)}
                    onChange={() => CheckBoxHandler(sub.subjectId)}
                  />
                ))}
                {subjectForCambridge?.optionalSubjects.length > 0 && +selectedSubjects.length !== 4 && (
                  <div className="text-danger">Must Select 4 subjects</div>
                )}
              </div>
            )}

          <div className="tw-col-span-2 tw-mt-4 d-none">
            <div className="tw-flex">
              <input
                type="checkbox"
                className="form-check-input me-2 tw-flex-shrink-0"
                onChange={() => setAgreeTerms(!agreeTerms)}
                id="flexCheckDefault"
                checked={agreeTerms}
              />
              <label className="form-check-label tw-text-xs text-danger tw-font-medium">
                By clicking Next, you consent us to use your provided contact information to communicate with you over SMS/RCS/Voice/WhatsApp/etc. Channels with you regarding our services and updates.
              </label>
            </div>
          </div>

          <div className="tw-col-span-2 tw-flex tw-justify-end tw-mt-2">
            <button
              className="tw-bg-[#155B2E] tw-text-white tw-border-none tw-rounded-[8px] tw-py-[10px] tw-px-[32px] hover:tw-bg-[#114925] tw-transition-colors"
              type="submit"
              disabled={showApiLoader}
              onClick={(e: any) => {
                applicationSaleFormParent.handleSubmit(e)
                // updateStepHndlr("stepup", applicationSaleFormParent.values, "2")
              }}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Alert !</h4>
            <p dangerouslySetInnerHTML={{ __html: showErr.msg }}></p>
            <hr />
            <p className="fs-16">
              Please{" "}
              <span onClick={stepDownHndler} className="text-decoration-underline cursor-pointer fw-bold">
                click here
              </span>{" "}
              to enter your details again.
            </p>
          </div>
          <div className="tw-flex tw-justify-center">
            <button className="btn btn-danger" onClick={stepDownHndler}>
              Close Window
            </button>
          </div>
        </>
      )}
      <ModalContainerUpdated
        id="terms-condition-modal"
        isOpen={verifyNumberModal.showModal}
        toggle={toggleVerifyNumberModal}
        modalTitle="Verify Your Number"
        modalSize="md"
      >
        <VerifyNumberModal
          isOpen={verifyNumberModal.showModal}
          toggle={toggleVerifyNumberModal}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BasicDetails;

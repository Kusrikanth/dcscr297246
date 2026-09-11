import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateColumns } from "./helper";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { HugeiconsIcon } from '@hugeicons/react';
import { Recycle03Icon, DownloadCircle02Icon, PropertyViewIcon, BatteryEmptyIcon, RepeatIcon, Search01Icon } from "@hugeicons-pro/core-stroke-standard";
import { toast } from "react-toastify";
import * as Yup from "yup"
import PreviewProgressCardModel from "./PreviewProgressCardModel";
import GenerateModal from "./GenerateModal";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { setExaminationClassesAct, setExaminationClassSubjectAct, setProgressCardListAct } from "../../../../store/examination/examinationmanagement/examinationmanagementslice";
import { downloadAllProgressCardsAct, downloadCbseProgressCardsAct, downloadProgressCardAct, generateProgressCardAct, getFilterListForCbseAct, getProgressCardListAct, previewProgressCardAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getSectionList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getCbseExaminationListAct, getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { setIgseTermDetailsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsslice";
import { debounce } from "../../../../utility/commonutility";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  termId: "",
  examinationId: "",
};

export const getValidationSchema = (isEarlyYearsManagement: boolean) => {
  return Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required.").nullable(),
    sectionId: Yup.string().required("Section is required.").nullable(),
    ...(isEarlyYearsManagement && {
      termId: Yup.string().required("Term is required."),
    }),
  });
};

const ProgressCard = () => {

  const location = useLocation();
  const isEarlyYearsManagement = location.pathname === "/early-years-management";
  const [studentData, setStudentData] = useState<any[]>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [confirmActionType, setConfirmActionType] = useState<"generate" | "regenerate">("generate");
  const { closeModal: closeGenerateProgressCardModal, modalState: generateProgressCardState, openModal: openGenerateProgressCardModal } = useModal();
  const { closeModal: closeGenerateProgressCardAllModal, modalState: generateProgressCardAllState, openModal: openGenerateProgressCardAllModal } = useModal();
  const { closeModal: closePreviewProgressCardModel, modalState: previewProgressCardModelState, openModal: openPreviewProgressCardModel, setModalState: setPreviewProgressCardModalState } = useModal();
  const { closeModal: closeDownloadProgressCardModal, modalState: downloadProgressCardState, openModal: openExportExcelModal } = useModal();
  const { closeModal: closeGenerateModel, modalState: generateModelState, openModal: openGenerateModel, setModalState: setGernrateProgressCardModalState } = useModal();
  const validationSchema = getValidationSchema(isEarlyYearsManagement);

  const classApiCalled = useRef(false);
  const dispatch = useAppDispatch();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const selectedStudentsExist = useMemo(() => studentData?.some((student) => student.isSelected), [studentData])

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    sectionListResp,
    getExaminationTermRequestListResp,
    getProgressCardListResp, downloadCbseProgressCardsActResp, getCbseExaminationRequestListResp,
    generateProgressCardActResp, downloadProgressCardActResp, previewProgressCardActResp, downloadAllProgressCardsActResp, getIgseTermNameListResp,
    loggedInUserRole,
    examinationManagementErrorResp
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, examinationManagement, examinationSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getProgressCardListResp: examinationManagement.getProgressCardListResp,
      generateProgressCardActResp: examinationManagement.generateProgressCardActResp,
      getExaminationTermRequestListResp: examinationSettings.getExaminationTermRequestListResp,
      downloadProgressCardActResp: examinationManagement.downloadProgressCardActResp,
      downloadAllProgressCardsActResp: examinationManagement.downloadAllProgressCardsActResp,
      previewProgressCardActResp: examinationManagement.previewProgressCardActResp,
      downloadCbseProgressCardsActResp: examinationManagement.downloadCbseProgressCardsActResp,
      getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      loggedInUserRole: appData.loggedInUserRole,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
    }),
    shallowEqual
  );

  const studentRemarksRef = useRef({
    prevGenerateProgressCardActResp: generateProgressCardActResp,
    prevDownloadProgressCardActRespActResp: downloadProgressCardActResp,
    prevDownloadAllProgressCardsActResp: downloadAllProgressCardsActResp,
    prevPreviewProgressCardActResp: previewProgressCardActResp,
    prevDownloadCbseProgressCardsActResp: downloadCbseProgressCardsActResp,
    prevStudentRemarksErrorResp: examinationManagementErrorResp,
  })

  useEffect(() => {
    const { prevDownloadAllProgressCardsActResp, prevDownloadProgressCardActRespActResp, prevGenerateProgressCardActResp, prevStudentRemarksErrorResp, prevDownloadCbseProgressCardsActResp } = studentRemarksRef.current;
    if (generateProgressCardActResp && prevGenerateProgressCardActResp !== generateProgressCardActResp) {
      toast.success("Progress Card Generated successfully");
      closeGenerateProgressCardAllModal();
      closeGenerateProgressCardModal();
      getProgressApiCall()
    } else if (downloadProgressCardActResp && prevDownloadProgressCardActRespActResp !== downloadProgressCardActResp) {
      toast.success("Progress Card downloaded successfully");
      convertBlobToReceipt(downloadProgressCardActResp, `ReportCard.pdf`);
      getProgressApiCall()
    }
    else if (downloadCbseProgressCardsActResp && prevDownloadCbseProgressCardsActResp !== downloadCbseProgressCardsActResp) {
      if (previewProgressCardModelState.modalData === "PREVIEW") {
        openPreviewProgressCardModel();
      } else {
        toast.success("Progress Card downloaded successfully");
        convertBase64ToReceipt(downloadCbseProgressCardsActResp?.pdfBase64, `ReportCard.pdf`);
        closeGenerateModel();
        getProgressApiCall();
      }
    }
    else if (downloadAllProgressCardsActResp && prevDownloadAllProgressCardsActResp !== downloadAllProgressCardsActResp) {
      toast.success("All Progress Cards downloaded successfully");
      downloadZipFile(downloadAllProgressCardsActResp, `REPORT_CARD.zip`);
      closeDownloadProgressCardModal();
      getProgressApiCall();
    } else if (examinationManagementErrorResp && prevStudentRemarksErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {};
      toast.error(details || "Something went wrong.");
    }
    studentRemarksRef.current.prevGenerateProgressCardActResp = generateProgressCardActResp;
    studentRemarksRef.current.prevDownloadProgressCardActRespActResp = downloadProgressCardActResp;
    studentRemarksRef.current.prevDownloadAllProgressCardsActResp = downloadAllProgressCardsActResp;
    studentRemarksRef.current.prevPreviewProgressCardActResp = previewProgressCardActResp;
    studentRemarksRef.current.prevStudentRemarksErrorResp = examinationManagementErrorResp;
  }, [downloadAllProgressCardsActResp, downloadProgressCardActResp, generateProgressCardActResp, downloadCbseProgressCardsActResp, examinationManagementErrorResp]);


  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(setProgressCardListAct(undefined))
    }
  }, [])

  const generateProgressCardHndlr = (studentIds?: string | string[]) => {
    let selectedIds: string[] | undefined;

    if (studentIds) {
      selectedIds = Array.isArray(studentIds) ? studentIds : [studentIds];
    } else if (!allStudentSelectedState) {
      selectedIds = studentData
        .filter(student => student.isSelected)
        .map(student => student.studentId.toString());
    }

    const payload: Record<string, any> = {
      academicYearId: progressCardForm.values.academicYearId || "",
      branchId,
      curriculumId: progressCardForm.values.curriculumId || "",
      classId: progressCardForm.values.classId || "",
      sectionId: progressCardForm.values.sectionId || "",
      termId: progressCardForm.values.termId || "",
    };

    if (!allStudentSelectedState) {
      payload.studentIds = selectedIds;
    }

    dispatch(generateProgressCardAct(generateActionPayload("generate_progress_card", undefined, payload)));
  };

  function downloadZipFile(response: BlobPart, fileName = 'download.zip') {
    const blob = new Blob([response], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  function convertBlobToReceipt(blobStream: any, fileName: any) {
    const url = window.URL.createObjectURL(new Blob([(blobStream)], { type: "application/pdf" }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function convertBase64ToReceipt(base64: any, fileName: any) {
    const link = document.createElement("a");
    link.href = `data:${"application/pdf"};base64,${base64}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const progressCardForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        academicYearId: values.academicYearId || "",
        curriculumId: values.curriculumId || "",
        classId: values.classId || "",
        sectionId: values.sectionId || "",
        searchString: values.searchString || "",
      };
      getProgressApiCall(payload);
    },
  });

  const handleGenerateClick = async () => {
    const errors = await progressCardForm.validateForm();

    progressCardForm.setTouched({
      academicYearId: true,
      curriculumId: true,
      classId: true,
      sectionId: true,
      ...(isEarlyYearsManagement && { termId: true }),
    });

    if (Object.keys(errors).length === 0) {
      const { curriculumId, classId } = progressCardForm.values || {};
      const payload = {
        curriculumId, classId, branchId
      }
      dispatch(getFilterListForCbseAct(generateActionPayload('get_cbse_progress_card_filter_list', undefined, payload)))
      if (isEarlyYearsManagement) {
        previewProgressCardsForCbse("PREVIEW", progressCardForm.values)
      } else {
        openGenerateModel();
      }
    }
  };

  function downloadReceiptHndlr(systemFileId: string) {
    if (systemFileId) {
      const params = {
        id: systemFileId
      };
      dispatch(
        downloadProgressCardAct(
          generateActionPayload("download_progress_card_by_system_file_id", params, undefined, {
            branchId, instituteId,
            responseType: "blob"
          })
        )
      );
    }
  }
  const previewProgressCard = (systemFileId: any) => {
    const params = {
      id: systemFileId,
    }
    dispatch(previewProgressCardAct(generateActionPayload('preview_progress_card_by_system_file_id', params)))
  }


  const menuOptions = useMemo(() => {
    if (isEarlyYearsManagement) {
      return [
        {
          id: "download",
          actionIcon: <HugeiconsIcon icon={DownloadCircle02Icon} className="me-2 text-muted" size={18} />,
          actionName: "Download",
          onClickHndlr: (event: any) => {
            const systemFileId = event.currentTarget.getAttribute("data-id");
            if (systemFileId) previewProgressCardsForCbse("DOWNLOAD", progressCardForm.values, systemFileId)
          }
        },
        {
          id: "preview",
          actionIcon: <HugeiconsIcon icon={PropertyViewIcon} className="me-2 text-muted" size={18} />,
          actionName: "Preview",
          onClickHndlr: (event: any) => {
            const systemFileId = event.currentTarget.getAttribute("data-id");
            if (systemFileId) previewProgressCardsForCbse("PREVIEW", progressCardForm.values, systemFileId)
          },
        }
      ];
    } else {
      return [
        {
          id: "generate",
          actionIcon: <HugeiconsIcon icon={RepeatIcon} className="me-2 text-muted" size={18} />,
          actionName: "Generate",
          onClickHndlr: (event: any) => {
            const systemFileId = event.currentTarget.getAttribute("data-id");
            // if (systemFileId) previewProgressCardsForCbse("DOWNLOAD", progressCardForm.values, systemFileId)
            openGenerateModel({ isSingleStu: true, id: systemFileId })
          }
        },
      ]
    }

    // const selectedStudents = studentData.filter(student => student.isSelected);
    // const singleSelection = selectedStudents.length <= 1;

    // const options: IOptionsHrtl[] = [
    //   {
    //     id: "download",
    //     actionIcon: <HugeiconsIcon icon={DownloadCircle02Icon} className="me-2 text-muted" size={18} />,
    //     actionName: "Download",
    //     onClickHndlr: (event: any) => {
    //       const systemFileId = event.currentTarget.getAttribute("data-systemFileId");
    //       if (systemFileId) downloadReceiptHndlr(systemFileId);
    //     }
    //   },
    //   {
    //     id: "regenerate",
    //     actionIcon: <HugeiconsIcon icon={Recycle03Icon} className="me-2 text-muted" size={18} />,
    //     actionName: "Re-Generate",
    //     onClickHndlr: (event: any) => {
    //       const studentId = event.currentTarget.getAttribute("data-studentId");
    //       setSelectedStudentId(studentId);
    //       setConfirmActionType("regenerate");
    //       openGenerateProgressCardModal();
    //     }
    //   },
    //   {
    //     id: "preview",
    //     actionIcon: <HugeiconsIcon icon={PropertyViewIcon} className="me-2 text-muted" size={18} />,
    //     actionName: "Preview",
    //     onClickHndlr: (event: any) => {
    //       const systemFileId = event.currentTarget.getAttribute("data-systemFileId");
    //       previewProgressCard(systemFileId);
    //       openPreviewProgressCardModel();
    //     },
    //   }
    // ];

    // if (!allStudentSelectedState && singleSelection) {
    //   options.push(
    //     { id: "space-left", actionIcon: <span style={{ pointerEvents: "none" }}><HugeiconsIcon icon={BatteryEmptyIcon} className="me-2" size={18} color="#fbfbfb" /></span>, actionName: "" },
    //     {
    //       id: "generate",
    //       actionIcon: <HugeiconsIcon icon={RepeatIcon} className="me-2 text-muted" size={18} />,
    //       actionName: "Generate",
    //       onClickHndlr: (event: any) => {
    //         const studentId = event.currentTarget.getAttribute("data-studentId");
    //         setSelectedStudentId(studentId);
    //         setConfirmActionType("generate");
    //         openGenerateProgressCardModal();
    //       }
    //     },
    //     { id: "space-right", actionIcon: <span style={{ pointerEvents: "none" }}><HugeiconsIcon icon={BatteryEmptyIcon} className="me-2" size={18} color="#fbfbfb" /></span>, actionName: "" }
    //   );
    // }

    // return options;
  }, [isEarlyYearsManagement, studentData, allStudentSelectedState]);


  const getProgressApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: progressCardForm.values.academicYearId,
      curriculumId: progressCardForm.values.curriculumId,
      classId: progressCardForm.values.classId,
      sectionId: progressCardForm.values.sectionId,
      searchString: progressCardForm.values.searchString,
      termId: progressCardForm.values.termId,
      ...otherProps,
    }
    dispatch(getProgressCardListAct(generateActionPayload("get_sports_progress_card_list", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: progressCardForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload1.progressCardType = "PVA";
    }
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: progressCardForm.values?.academicYearId, curriculumId: progressCardForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "PVA";
    }
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: progressCardForm.values.classId || null, masterAcademicYearId: progressCardForm.values.academicYearId, curriculumId: progressCardForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "PVA";
    }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  // const cbseExaminationList = (otherProps?: any) => {
  //   const { academicYearId, classId, curriculumId } = progressCardForm.values || {}
  //   const payload = {
  //     branchId,
  //     academicYearId, classId, curriculumId,
  //     pageNo: 0, pageSize: 100,
  //     ...otherProps,
  //   };
  //   if (payload.academicYearId && payload.curriculumId && payload.classId) {
  //     dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
  //   }
  // };

  // const igseTermList = (curriculumId: string) => {
  //   if (curriculumId) {
  //     let payload = {
  //       branchId,
  //       curriculumId,
  //     };
  //     dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
  //   }
  // };

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/other-pva-management": "CBSE"
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (Array.isArray(data) && data.length > 0 && progressCardForm.values.academicYearId && !classApiCalled.current) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );

      if (!selectedCurriculum) {
        progressCardForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: undefined,
        }));
        return;
      }

      const payload: any = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: progressCardForm.values.academicYearId,
        sortBy: "classSequence",
        classFilter: isEarlyYearsManagement ? "EARLY" : "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      if (loggedInUserRole === "TEACHER") {
        payload.progressCardType = "PVA";
      }
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      progressCardForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: selectedCurriculum.branchCurriculumId })));
      classApiCalled.current = true;
    }
  }, [brchCurriculumResp, progressCardForm.values.academicYearId, location.pathname]);

  useEffect(() => {
    if (Array.isArray(getProgressCardListResp) && getProgressCardListResp.length > 0) {
      setStudentData(getProgressCardListResp);
    } else {
      setStudentData([]);
    }
  }, [getProgressCardListResp]);

  useEffect(() => {
    const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    progressCardForm.setFieldValue("academicYearId", yearId)
    getCurriculumApiCall({ academicYearId: yearId });
  }, [academicYearListResp]);

  function search(value: string) {
    getProgressApiCall({ ...progressCardForm.values, searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [studentData]);
  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      progressCardForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: prev.curriculumId || null,
        sectionId: null
      }));
      classApiCalled.current = false;
    }
    else if (name === 'curriculumId') {
      progressCardForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "", examinationId: "", subjectId: "" }));
      dispatch(setExaminationClassesAct(undefined))
      dispatch(setExaminationClassSubjectAct(undefined))
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
        dispatch(setIgseTermDetailsListAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: progressCardForm.values.academicYearId });
        // igseTermList(value);
        dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: value })));
      }
    }
    else if (name === 'classId') {
      progressCardForm.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "", examinationId: "", subjectId: "" }));
      dispatch(setExaminationClassSubjectAct(undefined))
      if (value) {
        getSectionListResp({ branchClassId: value })
        // cbseExaminationList({ classId: value })
      }
    }
    else if (name === "searchString") {
      progressCardForm.setValues((prev: any) => ({
        ...prev,
        [name]: value
      }));
    }
    else {
      progressCardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  useEffect(() => {
    if (generateProgressCardActResp) {
      setAllStudentSelectedState(false);
      setStudentData((prevData) =>
        prevData.map((student) => ({
          ...student,
          isSelected: false,
        }))
      );
    }
  }, [generateProgressCardActResp]);

  const allStudentCheckHndlr = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    if (!Array.isArray(studentData) || studentData.length === 0) return;
    setStudentData((prevData) =>
      prevData.map((student) => ({
        ...student,
        isSelected: checked,
      }))
    );
  }, [studentData]);

  const singleStudentCheckHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const studentId = event.currentTarget.getAttribute("data-id");
    if (!studentId) return;
    setStudentData((prevData) => {
      const updatedData = prevData.map((student) =>
        student.studentId.toString() === studentId ? { ...student, isSelected: checked } : student
      );
      const areAllSelected = updatedData.every(student => student.isSelected);
      setAllStudentSelectedState(areAllSelected);
      return updatedData;
    });
  };

  const downloadProgressCardHndler = () => {
    dispatch(downloadAllProgressCardsAct(generateActionPayload("download_all_progress_cards", undefined, { ...progressCardForm.values, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  const hasValidProgressCards = Array.isArray(getProgressCardListResp) &&
    getProgressCardListResp.some(
      (item) => item.progressCardStatus === "REGENERATED" || item.progressCardStatus === "GENERATED"
    );

  const dropDownOption = useMemo(
    () => [
      {
        id: "generate",
        actionName: "Generate",
        actionIcon: <HugeiconsIcon icon={RepeatIcon} className="me-2 text-muted" size={18} />,
        onClickHndlr: () => {
          setConfirmActionType("generate");
          openGenerateProgressCardAllModal();
        },
      },
      {
        id: "re-generate",
        actionName: "Re-Generate",
        actionIcon: <HugeiconsIcon icon={Recycle03Icon} className="me-2 text-muted" size={18} />,
        onClickHndlr: () => {
          setConfirmActionType("regenerate");
          openGenerateProgressCardAllModal();
        },
      },
    ],
    []
  );

  const previewProgressCardsForCbse = async (name: string, modalValues?: any, id?: string, isSingleStu: boolean = false) => {
    const errors: any = await progressCardForm.validateForm();
    if (Object.keys(errors).length > 0) {
      progressCardForm.setTouched(errors);
      return;
    }
    setGernrateProgressCardModalState((prev) => ({ ...prev, modalData: name }));
    setPreviewProgressCardModalState((prev) => ({ ...prev, modalData: name }));
    const { academicYearId, classId, curriculumId, sectionId, } = progressCardForm.values;
    const classSequence = branchClassResp?.content?.find((i: any) => +i.id === +classId)?.classSequence;
    const { generationType, termId, examinationId, displayType, } = modalValues || {};

    const params = {
      academicYearId, classId, curriculumId, sectionId, classSequence, branchId, instituteId, displayType,
      ...(isEarlyYearsManagement && { termId }),
      ...(generationType === "term" && {
        termId: termId === "BOTH" ? "" : termId,
      }),
      ...(generationType === "exam" && { examinationId }),
      ...(selectedStudentsExist && !isSingleStu && {
        studentIds: studentData
          .filter((i: any) => i.isSelected)
          .map((i: any) => i.studentId)
          .join(","),
      }),
      // ...(isSingleStu && id && { studentIds: id }),
      ...(id && { studentIds: id }),
      progressCardType: "PVA"
    };
    dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
  }

  const columns = useMemo(() => generateColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, menuOptions, isEarlyYearsManagement), [studentData]);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="card d-inline-block w-100">
        <div className="bg-light m-3 pt-1 rounded">
          <div className="row p-3 g-3 examination">
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="academicYearId"
                value={progressCardForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="mb-0"
                labelText="Academic Year"
                labelClass="required"
                inputClassName="bg-light"
                floatingLabel
                invalid={(progressCardForm.touched.academicYearId && progressCardForm.errors.academicYearId) ? true : false}
                error={(progressCardForm.touched.academicYearId && progressCardForm.errors.academicYearId) ? progressCardForm.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="curriculumId"
                value={progressCardForm.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                formgroupClassName="mb-0"
                labelClass="required"
                inputClassName="bg-light"
                floatingLabel
                isDisabled={false}
                invalid={(progressCardForm.touched.curriculumId && progressCardForm.errors.curriculumId) ? true : false}
                error={(progressCardForm.touched.curriculumId && progressCardForm.errors.curriculumId) ? progressCardForm.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="classId"
                value={progressCardForm.values.classId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                floatingLabel
                invalid={(progressCardForm.touched.classId && progressCardForm.errors.classId) ? true : false}
                error={(progressCardForm.touched.classId && progressCardForm.errors.classId) ? progressCardForm.errors.classId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="sectionId"
                value={progressCardForm.values.sectionId}
                onChange={filterHandler}
                menuItems={sectionListResp?.data}
                valueKey="sectionId"
                textKey="sectionName"
                labelText="Section"
                labelClass="required"
                inputClassName="bg-light"
                formgroupClassName="mb-0"
                floatingLabel
                invalid={(progressCardForm.touched.sectionId && progressCardForm.errors.sectionId) ? true : false}
                error={(progressCardForm.touched.sectionId && progressCardForm.errors.sectionId) ? progressCardForm.errors.sectionId : ""}
              />
            </div>
            {isEarlyYearsManagement && (
              <>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="termId"
                    value={progressCardForm.values.termId}
                    onChange={filterHandler}
                    menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                    valueKey="termId"
                    textKey="termName"
                    labelClass="required"
                    inputClassName="bg-light"
                    formgroupClassName="mb-0"
                    labelText='Term Name'
                    floatingLabel
                    invalid={(progressCardForm.touched.termId && progressCardForm.errors.termId) ? true : false}
                    error={(progressCardForm.touched.termId && progressCardForm.errors.termId) ? progressCardForm.errors.termId : ""}
                  />
                </div></>
            )}
            <div className="col-auto ms-auto d-flex align-items-center">
              <button disabled={showApiLoader} type="button" onClick={(event: any) => progressCardForm.handleSubmit(event)} className="btn float-end text-white d-flex justify-content-center align-items-center" style={{ background: "#405189", border: "none" }}><HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} />Search</button>
            </div>
          </div>
        </div>
        <div className="row px-3 g-3 pt-2 mb-2">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 mt-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
                formgroupClassName="mb-2"
                value={progressCardForm.values.searchString}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target;
                  progressCardForm.setFieldValue("searchString", value);
                  debounceFun(value);
                }}
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <div className="col-auto mt-0 mb-2 ms-auto d-flex align-items-center">
            {selectedStudentsExist && (
              <button
                disabled={showApiLoader}
                className="btn btn-success float-end d-flex justify-content-center align-items-center"
                onClick={handleGenerateClick}
              >
                <HugeiconsIcon icon={RepeatIcon} className="me-2 text-white" size={18} /> Generate {(!allStudentSelectedState) ? "Selected Students" : "All"}
              </button>
            )}
            {/* {isEarlyYearsManagement && generateProgressCardAllState && (allStudentSelectedState || selectedStudentsExist) && (
              <div className="col-auto d-flex align-items-center">
                <DropDownToggle
                  id="book-collection-dropdown"
                  menuOptions={dropDownOption}
                  btnName="Generate/Re-Generate"
                  dropDownClassName="me-2"
                  btnVariant="btn-info"
                />
              </div>
            )} */}
          </div>
          {/* {isEarlyYearsManagement && allStudentSelectedState && hasValidProgressCards && (
            <div className="col-auto mt-0 d-flex align-items-center me-2 p-0">
              <button
                disabled={showApiLoader}
                className="btn btn-success float-end"
                onClick={() => openExportExcelModal()}
              >
                Download Progress Cards
              </button>
            </div>
          )} */}
        </div>
        <TableContainer
          columns={columns || []}
          data={studentData || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showCheckbox={false}
          showPagination={false}
        />
      </div>
      <ModalContainerUpdated
        id="generate-progress-card"
        isOpen={generateModelState.showModal}
        toggle={() => closeGenerateModel()}
        modalTitle="Generate Progress Card"
        modalSize="md"
      >
        <GenerateModal
          isOpen={false}
          toggle={() => closeGenerateModel()}
          previewProgressCardsForCbse={previewProgressCardsForCbse}
          isSingleStu={generateModelState.modalData?.isSingleStu}
          id={generateModelState.modalData?.id}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="preview-progress-card"
        isOpen={previewProgressCardModelState.showModal}
        toggle={() => closePreviewProgressCardModel()}
        modalTitle="Preview Progress Card"
        modalSize="xl"
      >
        <PreviewProgressCardModel
          id={previewProgressCardModelState.modalData}
          isOpen={false}
          toggle={() => closePreviewProgressCardModel()}
          modalTitle="Create Detail"
          isEarlyYearsManagement={isEarlyYearsManagement}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="generate-action-modal"
        isOpen={generateProgressCardState.showModal}
        confirmMessage={
          confirmActionType === "regenerate"
            ? "Are you sure you want to Re-Generate Progress Card?"
            : "Are you sure you want to Generate Progress Card?"
        }
        cancelHndlr={closeGenerateProgressCardModal}
        confirmHndlr={() => {
          if (selectedStudentId) {
            generateProgressCardHndlr([selectedStudentId]);
          }
        }}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
      <ConfirmationModal
        id="generate-modal"
        isOpen={generateProgressCardAllState.showModal}
        confirmMessage={
          confirmActionType === "regenerate"
            ? "Are you sure you want to Re-Generate Progress Card?"
            : "Are you sure you want to Generate Progress Card?"
        }
        cancelHndlr={closeGenerateProgressCardAllModal}
        confirmHndlr={() => generateProgressCardHndlr()}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
      <ConfirmationModal
        id="download-progress-card"
        isOpen={downloadProgressCardState.showModal}
        confirmMessage="Are you sure you want to Download All Progress Cards ?"
        cancelHndlr={closeDownloadProgressCardModal}
        confirmHndlr={() => downloadProgressCardHndler()}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
    </>
  );
};

export default ProgressCard;

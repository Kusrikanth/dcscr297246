import React, { useEffect, useMemo, useRef, useState } from "react";
import { generateColumns } from "./helper";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import TableContainer from "../../../Components/Common/TableContainer";
import { IPaginationState } from "../../../Components/Common/Pagination";
import {
  setAdmitCardDetailsAct,
  setAdmitCardExamDetailsAct,
  setCbseProgressCardStudentAct,
  setPreviewProgressCard,
} from "../../../store/examination/examinationmanagement/examinationmanagementslice";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  downloadAdmitCardAct,
  getAdmitCardDetailsAct,
  getAdmitCardExamDetailsAct,
  downloadCbseProgressCardsAct,
  getCbseProgressCardStudentAct,
} from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon, EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../hooks/modalhook";
import { ConfirmationModal, ModalContainerUpdated } from "../../../Components/Common";
import AddAdmitCard from "../CbseManagement/AdmitCard/AddAdmitCard";
import { useFormik } from "formik";
import PreviewProgressCardModel from "./PreviewProgressCardModel";
import PreviewAdmitCardModel from "./PreviewAdmitCardModel";
import { getIgseTermNameListAct } from "../../../store/examination/examinationsettings/examinationsettingsaction";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  termId: "",
  examinationId: "",
};

function convertBase64TopdfBlobUrl(base64: string): string | null {
  if (!base64) return null;
  try {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error converting Base64 to PDF:', error);
    toast.error('Failed to load the progress card. Please check the response data.');
    return null;
  }
}

const CbseManagement = () => {
  const dispatch = useAppDispatch();

  const [pdfBlobUrl, setpdfBlobUrl] = useState<string | null>(null);

  const { closeModal: closeDownloadAdmitCardModal, modalState: downloadAdmitCardModalState, openModal: openDownloadAdmitCardModal } = useModal();
  const { closeModal: closeDownloadProgressCardModal, modalState: downloadProgressCardModalState, openModal: openDownloadProgressCardModal } = useModal();
  const { closeModal: closeAdmitCardModal, modalState: admitCardModalState, openModal: openAdmitCardModal } = useModal();
  const { closeModal: closePreviewProgressCardModel, modalState: previewProgressCardModelState, openModal: openPreviewProgressCardModel } = useModal();
  const { closeModal: closePreviewAdmitCardModel, modalState: previewAdmitCardModelState, openModal: openPreviewAdmitCardModel } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    showApiLoader,
    getAdmitCardExamDetailsResp,
    examinationManagementErrorResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    parentChildrensResp,
    currentStudentId,
    generateAdmitCardResp,
    branchClassResp,
    downloadAdmitCardResp,
    getIgseTermNameListResp,
    downloadCbseProgressCardsActResp,
    getCbseProgressCardStudentActResp
  } = useAppSelector(
    ({ globalData, examinationSettings, examinationManagement, appData, instAcademics, directoryStudent, branchAcademics }) => {
      return {
        showApiLoader: globalData.showApiLoader,
        getAdmitCardExamDetailsResp: examinationManagement.getAdmitCardExamDetailsResp,
        examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        academicYearListResp: instAcademics.academicYearListResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        currentStudentId: appData.currentStudentId,
        getAdmitCardDetailsResp: examinationManagement.getAdmitCardDetailsResp,
        generateAdmitCardResp: examinationManagement.generateAdmitCardResp,
        branchClassResp: branchAcademics.branchClassResp,
        downloadAdmitCardResp: examinationManagement.downloadAdmitCardResp,
        getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
        downloadCbseProgressCardsActResp: examinationManagement.downloadCbseProgressCardsActResp,
        getCbseProgressCardStudentActResp: examinationManagement.getCbseProgressCardStudentActResp,
      };
    },
    shallowEqual
  );

  const componentRef = useRef({
    prevGenerateAdmitCardResp: generateAdmitCardResp,
    prevExaminationManagementErrorResp: examinationManagementErrorResp,
    prevDownloadAdmitCardResp: downloadAdmitCardResp,
    prevDownloadCbseProgressCardsActResp: downloadCbseProgressCardsActResp,
    prevGetCbseProgressCardStudentActResp: getCbseProgressCardStudentActResp,
  });

  const getExaminationDataApiCall = (otherProps?: any) => {
    const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);

    if (!studentDetails?.childId || !studentDetails?.academicYearId) {
      console.warn("Student details not yet available. Skipping API call.");
      return;
    }

    const payload = {
      academicYearId: studentDetails.academicYearId,
      studentId: studentDetails.childId,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getAdmitCardExamDetailsAct(generateActionPayload("get_admit_card_exam_details", payload)));
  };

  const igseTermList = (branchId: string, curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };


  useEffect(() => {
    if (academicYearListResp?.data && parentChildrensResp && currentStudentId) {
      const { childBranchId, curriculumId } = parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString()) || {};
      igseTermList(childBranchId, curriculumId);
      getExaminationDataApiCall();
    }
  }, [academicYearListResp, parentChildrensResp, currentStudentId]);

  useEffect(() => {
    return () => {
      dispatch(setAdmitCardExamDetailsAct(undefined));
      dispatch(setPreviewProgressCard(undefined));
      dispatch(setCbseProgressCardStudentAct(undefined));
    };
  }, []);

  const admitCardForm = useFormik({
    initialValues,
    onSubmit: (values) => {
      getAdmitCardDetailsApiCall({ ...values, searchString: "" });
      admitCardForm.setFieldValue("searchString", "");
    },
  });

  const getAdmitCardDetailsApiCall = (otherProps?: any) => {
    const selectedClassId = admitCardForm.values.classId;
    const selectedClass = branchClassResp?.content?.find((item: any) => item.id === Number(selectedClassId));
    const shouldIncludeClassSequence = selectedClass?.classSequence === 14 || selectedClass?.classSequence === 15;
    const payload = { branchId, ...admitCardForm.values, ...pagination.current, ...otherProps, ...(shouldIncludeClassSequence && { classSequence: selectedClass.classSequence }) };
    dispatch(getAdmitCardDetailsAct(generateActionPayload("get_cbse_admit_card_details", undefined, payload)));
  };
  
  const [progressCardAction, setProgressCardAction] = useState<"VIEW" | "DOWNLOAD" | null>(null);

  const confirmDonloadAdmitCardHndler = () => {
    const modalData = downloadAdmitCardModalState.modalData;
    if (!modalData) return;

    const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
    if (!studentDetails) {
      toast.error("Student details not found.");
      return;
    }

    const payload = {
      branchId: studentDetails.childBranchId,
      academicYearId: studentDetails.academicYearId,
      studentId: studentDetails.childId,
      classId: modalData.classId,
      examinationId: modalData.examinationId,
      viewType: modalData.viewType,
      sourceType: 'PARENT'
    };
    dispatch(downloadAdmitCardAct(generateActionPayload("download_admit_card", undefined, payload, { viewType: "DOWNLOAD" })));
  };
  const prevPdfBase64 = useRef<string | null>(null);
  useEffect(() => {
    const { prevGenerateAdmitCardResp, prevDownloadCbseProgressCardsActResp, prevGetCbseProgressCardStudentActResp, prevExaminationManagementErrorResp, } = componentRef.current || {};

    if (generateAdmitCardResp && prevGenerateAdmitCardResp !== generateAdmitCardResp) {
      toast.success("Admit Card Generated Successfully");
      getAdmitCardDetailsApiCall();
      closeAdmitCardModal();
    } else if (downloadAdmitCardResp && downloadAdmitCardResp.pdfBase64 !== prevPdfBase64.current) {
      const { fileName, pdfBase64, viewType } = downloadAdmitCardResp;
      if (pdfBase64) {
        prevPdfBase64.current = pdfBase64;
        const byteArray = Uint8Array.from(atob(pdfBase64), (char) => char.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        if (viewType === "VIEW") {
          openPreviewAdmitCardModel({ ...downloadAdmitCardResp, blobUrl: fileURL });
        } else {
          convertBlobToReceipt(blob, `${fileName || "AdmitCard"}.pdf`);
          toast.success("Admit Card Downloaded Successfully");
          closeDownloadAdmitCardModal();
        }
        return () => URL.revokeObjectURL(fileURL);
      } else {
        closePreviewAdmitCardModel();
      }
    }
    else if (getCbseProgressCardStudentActResp && prevGetCbseProgressCardStudentActResp !== getCbseProgressCardStudentActResp) {
      const { fileName, pdfBase64 } = getCbseProgressCardStudentActResp || {};
      if (pdfBase64) {
        const byteArray = Uint8Array.from(atob(pdfBase64), (char) => char.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        if (progressCardAction === "VIEW") {
          openPreviewProgressCardModel({ blobUrl: fileURL, fileName: fileName || "ProgressCard" });
        } else {
          convertBlobToReceipt(blob, `${fileName || "ProgressCard"}.pdf`);
          toast.success("Progress Card Downloaded Successfully");
          setTimeout(() => URL.revokeObjectURL(fileURL), 500);
        }
      } else {
        toast.error("No PDF data in response.");
      }
      closeDownloadProgressCardModal();
      setProgressCardAction(null);
    } else if (downloadCbseProgressCardsActResp && prevDownloadCbseProgressCardsActResp !== downloadCbseProgressCardsActResp) {
      const { fileName, pdfBase64 } = downloadCbseProgressCardsActResp || {};
      if (pdfBase64) {
        const byteArray = Uint8Array.from(atob(pdfBase64), (char) => char.charCodeAt(0));
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        if (progressCardAction === "VIEW") {
          openPreviewProgressCardModel({ blobUrl: fileURL, fileName: fileName || "ProgressCard" });
        } else {
          convertBlobToReceipt(blob, `${fileName || "ProgressCard"}.pdf`);
          toast.success("Progress Card Downloaded Successfully");
          setTimeout(() => URL.revokeObjectURL(fileURL), 500);
        }
      } else {
        toast.error("No PDF data in response.");
      }
      closeDownloadProgressCardModal();
      setProgressCardAction(null);
    }
    else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
      toast.error(examinationManagementErrorResp?.details || "Something went wrong");
    }

    componentRef.current.prevGenerateAdmitCardResp = generateAdmitCardResp;
    componentRef.current.prevDownloadAdmitCardResp = downloadAdmitCardResp;
    componentRef.current.prevDownloadCbseProgressCardsActResp = downloadCbseProgressCardsActResp;
    componentRef.current.prevGetCbseProgressCardStudentActResp = getCbseProgressCardStudentActResp;
    componentRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
  }, [generateAdmitCardResp, downloadAdmitCardResp,
    downloadCbseProgressCardsActResp,
    getCbseProgressCardStudentActResp, examinationManagementErrorResp,]);


  const selectedChild = useMemo(() => {
    if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
      return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
    }
    return {};
  }, [parentChildrensResp, currentStudentId]);

  function convertBlobToReceipt(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const viewProgressCardHndlr = () => {
    const modalData = downloadProgressCardModalState.modalData;
    // Branch 1 logic
    if (selectedChild.childBranchId === 1) {
      if ([12, 13].includes(selectedChild.classSequence)) {
        const examInfo = getExamInfo();
        if (!examInfo) {
          toast.error("Something went wrong.");
          return;
        }
        const params = {
          ...getCommonParams(),
          examinationId: examInfo?.examinationId,
        };
        dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
      } else {
        const term1Info = getTerm1Info();
        if (!term1Info) {
          toast.error("Something went wrong.");
          return;
        }
        const params = {
          ...getCommonParams(),
          termId: term1Info?.termId,
        };
        dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
      }
    }
    // Branch 2 logic
    else if (selectedChild.childBranchId === 2) {
      if ([12, 13].includes(selectedChild.classSequence)) {
        const examInfo = getExamInfo();
        if (!examInfo) {
          toast.error("Something went wrong.");
          return;
        }
        const params = {
          ...getCommonParams(),
          examinationId: examInfo?.examinationId,
        };
        dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
      } else {
        const term1Info = getTerm1Info();
        if (!term1Info) {
          toast.error("Something went wrong.");
          return;
        }
        const params = {
          ...getCommonParams(),
          termId: term1Info?.termId,
        };
        dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
      }
    }
    // const payload = {
    //   academicYearId: selectedChild.academicYearId,
    //   studentId: selectedChild.childId,
    //   examinationId: modalData.examinationId,
    // };

    // dispatch(getCbseProgressCardStudentAct(generateActionPayload("get_cbse_progress_card_student", undefined, payload)));
  };

  const admitCardMenuOptions = useMemo(() => [
    {
      id: "viewadmitcard",
      actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-success" size={18} />,
      actionName: "View Admit Card",
      onClickHndlr: (event: any) => {
        const dataId = event.currentTarget.getAttribute("data-id");
        if (!dataId) return;

        const [studentId, examinationId] = dataId.split("_");
        const studentDetails: any = parentChildrensResp?.find(
          (i: any) => +i?.childId === +currentStudentId
        );
        if (!studentDetails) return;
        dispatch(
          downloadAdmitCardAct(
            generateActionPayload(
              "download_admit_card",
              undefined,
              {
                branchId,
                academicYearId: studentDetails.academicYearId,
                studentId,
                classId: studentDetails.classId,
                examinationId,
                sourceType: "PARENT",
                viewType: "VIEW"
              },
              { viewType: "VIEW" }
            )
          )
        );
      }
    },
    {
      id: "downloadAdmitCard",
      actionIcon: <HugeiconsIcon icon={Download04Icon} size={18} className="me-1" />,
      actionName: "Download Admit Card",
      onClickHndlr: (event: any) => {
        const dataId = event.currentTarget.getAttribute("data-id");
        if (!dataId) return;
        const [studentId, examinationId] = dataId.split("_");
        const findData = getAdmitCardExamDetailsResp?.find(
          (item: any) =>
            +item.examinationId === +examinationId && +item.studentId === +studentId
        );
        if (findData) {
          openDownloadAdmitCardModal({ ...findData, viewType: "DOWNLOAD" });
        }
      },
    },
  ], [getAdmitCardExamDetailsResp]);

  const getExamInfo = () => {
    return getAdmitCardExamDetailsResp?.find((term: any) =>
      term?.examinationName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 'periodictest2'
    );
  };

  const getTerm1Info = () => {
    const { data: terms = [] } = getIgseTermNameListResp || {};
    return terms?.find((term: any) => term.termShortName === 'T1');
  };

  const getCommonParams = () => ({
    academicYearId: selectedChild.academicYearId,
    classId: selectedChild.classId,
    curriculumId: selectedChild.curriculumId,
    sectionId: selectedChild.sectionId,
    classSequence: selectedChild.classSequence,
    branchId: selectedChild.childBranchId,
    instituteId: selectedChild.instituteId,
    displayType: 'BOTH_MARKS_GRADES',
    processType: 'CBSE',
    studentIds: selectedChild.childId,
    sourceType: "PARENT"
  });

  const progressCardMenuOptions = useMemo(() => [
    {
      id: "viewprogressreport",
      actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-success" size={18} />,
      actionName: "View Progress Report",
      onClickHndlr: (event: any) => {
        const dataId = event.currentTarget.getAttribute("data-id");
        // const [studentId, examinationId] = dataId.split("_");
        // const payload = {
        //   academicYearId: selectedChild.academicYearId,
        //   studentId,
        //   examinationId,
        // };
        // dispatch(
        //   getCbseProgressCardStudentAct(
        //     generateActionPayload("get_cbse_progress_card_student", undefined, payload)
        //   )
        // );
        setProgressCardAction("VIEW");
        // Branch 1 logic
        if (selectedChild.childBranchId === 1) {
          if ([12, 13].includes(selectedChild.classSequence)) {
            const examInfo = getExamInfo();
            if (!examInfo) {
              toast.error("Something went wrong.");
              return;
            }
            const params = {
              ...getCommonParams(),
              examinationId: examInfo?.examinationId,
            };
            dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
          } else {
            const term1Info = getTerm1Info();
            if (!term1Info) {
              toast.error("Something went wrong.");
              return;
            }
            const params = {
              ...getCommonParams(),
              termId: term1Info?.termId,
            };
            dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
          }
        }
        // Branch 2 logic
        else if (selectedChild.childBranchId === 2) {
          if ([12, 13].includes(selectedChild.classSequence)) {
            const examInfo = getExamInfo();
            if (!examInfo) {
              toast.error("Something went wrong.");
              return;
            }
            const params = {
              ...getCommonParams(),
              examinationId: examInfo?.examinationId,
            };
            dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
          } else {
            const term1Info = getTerm1Info();
            if (!term1Info) {
              toast.error("Something went wrong.");
              return;
            }
            const params = {
              ...getCommonParams(),
              termId: term1Info?.termId,
            };
            dispatch(downloadCbseProgressCardsAct(generateActionPayload("download_cbse_progress_cards", undefined, params)));
          }
        }
      },
    },
    {
      id: "downloadProgressCard",
      actionIcon: <HugeiconsIcon icon={Download04Icon} size={18} className="me-1" />, // ✅ added back
      actionName: "Download Progress Card",
      onClickHndlr: (event: any) => {
        const dataId = event.currentTarget.getAttribute("data-id");
        if (!dataId) return;
        const [studentId, examinationId] = dataId.split("_");
        const findData = getAdmitCardExamDetailsResp?.find(
          (item: any) =>
            +item.examinationId === +examinationId && +item.studentId === +studentId
        );
        if (findData) {
          setProgressCardAction("DOWNLOAD");
          openDownloadProgressCardModal(findData);
        }
      },
    },
  ], [getAdmitCardExamDetailsResp, selectedChild, getIgseTermNameListResp]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getExaminationDataApiCall(paginationInfo);
  }

  const columns = useMemo(
    () => {
      const columns = generateColumns(admitCardMenuOptions, progressCardMenuOptions);
      if (selectedChild.curriculumName === "CBSE") {
        if (selectedChild.childBranchId === 1) {
          const allowedBranch1 = [4, 5, 10, 11, 12, 13, 14, 15];
          if (allowedBranch1.includes(selectedChild.classSequence)) {
            return columns;
          }
          return columns.filter((col) => col.accessor !== "progressCard");
        }
        if (selectedChild.childBranchId === 2) {
          const allowedBranch2 = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
          if (allowedBranch2.includes(selectedChild.classSequence)) {
            return columns;
          }
          return columns.filter((col) => col.accessor !== "progressCard");
        }
      }
      return columns.filter((col) => col.accessor !== "progressCard");
    },
    [admitCardMenuOptions, progressCardMenuOptions, getAdmitCardExamDetailsResp, selectedChild]
  );

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">

          <BreadCrumb
            title="CBSE Examination Managment"
            pageTitle="Examination"
          />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            <div className="tw-border-b tw-px-4 tw-py-3">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Examination Data
              </h4>
            </div>

            <div className="tw-p-0">
              <TableContainer
                columns={columns || []}
                data={getAdmitCardExamDetailsResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={false}
              />
            </div>

            <ModalContainerUpdated
              id="generate-admit-card-modal"
              isOpen={admitCardModalState.showModal}
              toggle={closeAdmitCardModal}
              modalTitle="Generate Admit Card"
              modalSize="md"
            >
              <AddAdmitCard
                isOpen={admitCardModalState.showModal}
                modalData={admitCardModalState.modalData}
                toggle={closeAdmitCardModal}
                filterState={admitCardForm.values}
              />
            </ModalContainerUpdated>
            <ConfirmationModal
              id="download-admit-card-modal"
              isOpen={downloadAdmitCardModalState.showModal}
              confirmMessage={`Are you sure you want to ${downloadAdmitCardModalState.modalData?.viewType} Admit Card ?`}
              cancelHndlr={closeDownloadAdmitCardModal}
              confirmHndlr={confirmDonloadAdmitCardHndler}
              isDisble={showApiLoader}
              showImgIcon={true}
              iconType="approve"
              btnClassName="tw-bg-green-600 tw-text-white tw-w-24 tw-py-2 tw-rounded-md"
            />
            <ConfirmationModal
              id="download-progress-card-modal"
              isOpen={downloadProgressCardModalState.showModal}
              confirmMessage={`Are you sure you want to ${progressCardAction} Progress Card ?`}
              cancelHndlr={closeDownloadProgressCardModal}
              confirmHndlr={viewProgressCardHndlr}
              isDisble={showApiLoader}
              showImgIcon={true}
              noteMessage="Note: This report card will not be retained in Digital Campus after download. Users are advised to save the document for future reference."
              iconType="approve"
              btnClassName="tw-bg-green-600 tw-text-white tw-w-24 tw-py-2 tw-rounded-md"
            />
            <ModalContainerUpdated
              id="preview-progress-card-modal"
              isOpen={previewProgressCardModelState.showModal}
              toggle={() => closePreviewProgressCardModel()}
              modalTitle="Progress Card Preview"
              modalSize="xl"
            >
              <PreviewProgressCardModel
                data={previewProgressCardModelState.modalData}
                isOpen={previewProgressCardModelState.showModal}
                toggle={() => closePreviewProgressCardModel()}
              />
            </ModalContainerUpdated>
            <ModalContainerUpdated
              id="preview-progress-card"
              isOpen={previewAdmitCardModelState.showModal}
              toggle={() => closePreviewAdmitCardModel()}
              modalTitle="Preview Admit Card"
              modalSize="xl"
            >
              <PreviewAdmitCardModel
                data={previewAdmitCardModelState.modalData}
                isOpen={previewAdmitCardModelState.showModal}
                toggle={() => closePreviewAdmitCardModel()}
                modalTitle="Create Detail"
              />
            </ModalContainerUpdated>
          </div>
        </div>
      </div>
    </>
  );
};

export default CbseManagement;
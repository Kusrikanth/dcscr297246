import TableContainer from "../../../Components/Common/TableContainer";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { getReportCardConfigAct } from "../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateColumns, generateTableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon, EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { downloadCbseProgressCardsAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/modalhook";
import { ConfirmationModal, ModalContainerUpdated, SelectInput } from "../../../Components/Common";
import PreviewProgressCardModel from "./PreviewProgressCard";
import { useFormik } from "formik";
import { getStudentsListAct } from "../../../store/directory/studentmanagement/studentmanagementactions";

const initialValues = {
    academicYearId: "",
};

const ParentProgressCard = () => {
    const dispatch = useAppDispatch();
    const [selectedStudentState, setSelectedStudentState] = useState<any>(undefined);
    const [progressCardAction, setProgressCardAction] = useState<"VIEW" | "DOWNLOAD" | null>(null);
    const { closeModal: closePreviewProgressCardModel, modalState: previewProgressCardModelState, openModal: openPreviewProgressCardModel } = useModal();
    const { closeModal: closeDownloadProgressCardModal, modalState: downloadProgressCardModalState, openModal: openDownloadProgressCardModal } = useModal();

    const { currentInstIdResp: instituteId, currentStudentId, showApiLoader,
        parentChildrensResp, reportCardConfigResp, downloadCbseProgressCardsActResp, academicYearListResp, studentsListResp, examinationManagementErrorResp } =
        useAppSelector(
            ({ appData, directoryStudent, examinationSettings, examinationManagement, globalData, instAcademics }) => ({
                currentInstIdResp: appData.currentInstIdResp,
                currentStudentId: appData.currentStudentId,
                showApiLoader: globalData.showApiLoader,
                parentChildrensResp: directoryStudent.parentChildrensResp,
                reportCardConfigResp: examinationSettings.reportCardConfigResp,
                downloadCbseProgressCardsActResp: examinationManagement.downloadCbseProgressCardsActResp,
                academicYearListResp: instAcademics.academicYearListResp,
                studentsListResp: directoryStudent.studentsListResp,
                examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
            }),
            shallowEqual
        );

    const progressCardFormik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values) => {
        },
    });

    const filteredAcademicYearList = useMemo(() => {
        if (!academicYearListResp?.data || !selectedStudentState?.admissionAcademicYearId) {
            return [];
        }
        return academicYearListResp.data.filter(
            (year: any) =>
                +year.academicYearId >=
                +selectedStudentState.admissionAcademicYearId
        );
    }, [academicYearListResp, selectedStudentState]);
    
    const progressCardRespRef = useRef({
        prevDownloadCbseProgressCardsActResp: downloadCbseProgressCardsActResp,
        prevExaminationManagementErrorResp: examinationManagementErrorResp
    });

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

    useEffect(() => {
        const { prevDownloadCbseProgressCardsActResp, prevExaminationManagementErrorResp } = progressCardRespRef.current || {};
        if (downloadCbseProgressCardsActResp && prevDownloadCbseProgressCardsActResp !== downloadCbseProgressCardsActResp) {
            const { fileName, pdfBase64 } = downloadCbseProgressCardsActResp || {};
            if (pdfBase64) {
                if (progressCardAction === "VIEW") {
                    openPreviewProgressCardModel({ pdfBase64 });
                } else {
                    const byteArray = Uint8Array.from(atob(pdfBase64), (char) => char.charCodeAt(0));
                    const blob = new Blob([byteArray], { type: "application/pdf" });
                    const fileURL = URL.createObjectURL(blob);
                    convertBlobToReceipt(blob, `${fileName || "ProgressCard"}.pdf`);
                    toast.success("Progress Card Downloaded Successfully");
                    setTimeout(() => URL.revokeObjectURL(fileURL), 500);
                }
            } else {
                toast.error("No PDF data in response.");
            }
            closeDownloadProgressCardModal();
            setProgressCardAction(null);
        } else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
            toast.error(examinationManagementErrorResp?.details || "Something went wrong");
        }
        progressCardRespRef.current.prevDownloadCbseProgressCardsActResp = downloadCbseProgressCardsActResp;
        progressCardRespRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
    }, [progressCardAction, downloadCbseProgressCardsActResp, examinationManagementErrorResp]);

    useEffect(() => {
        if (Array.isArray(parentChildrensResp) && parentChildrensResp.length && currentStudentId) {
            const studentDetails: any = parentChildrensResp.find((i: any) => +i?.childId === +currentStudentId);
            if (studentDetails) {
                setSelectedStudentState(studentDetails);
            }
        }
    }, [parentChildrensResp, currentStudentId]);

    function getStudentsApiCall() {
        const { academicYearId } = progressCardFormik.values || {};
        if (academicYearId) {
            const params = {
                branchId: selectedStudentState?.childBranchId,
                academicYearId,
                curriculumId: selectedStudentState?.curriculumId,
                searchString: selectedStudentState?.childCode,
                nameFilterType: "global",

            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }

    useEffect(() => {
        if (selectedStudentState?.childBranchId && progressCardFormik.values.academicYearId) {
            getStudentsApiCall();
        }
    }, [selectedStudentState?.childBranchId, progressCardFormik.values.academicYearId]);

    useEffect(() => {
        if (selectedStudentState && progressCardFormik.values.academicYearId && studentsListResp?.data?.length) {
            const studentForYear = studentsListResp.data.find(
            (student: any) =>
                student.studentCode === selectedStudentState.childCode
        );
        if (studentForYear?.classId) {
            dispatch(
                getReportCardConfigAct(
                    generateActionPayload("report_card_config", undefined, {
                        instituteId: selectedStudentState?.instituteId || "",
                        branchId: selectedStudentState?.childBranchId || "",
                        academicYearId: progressCardFormik.values.academicYearId,
                        curriculumId: selectedStudentState?.curriculumId || "",
                        classId: studentForYear?.classId
                    })
                )
            );
        }
        }
    }, [selectedStudentState, progressCardFormik.values.academicYearId, studentsListResp]);

    useEffect(() => {
        if (filteredAcademicYearList.length && !progressCardFormik.values.academicYearId) {
            const currentYear =
                filteredAcademicYearList.find(
                    (year: any) => year.yearStatus === "CURRENT"
                ) || filteredAcademicYearList[0];

            if (currentYear) {
                progressCardFormik.setFieldValue("academicYearId", currentYear.academicYearId);
            }
        }
    }, [filteredAcademicYearList]);

    const reportCardTableData = useMemo(() => {
        return generateTableData(reportCardConfigResp || []);
    }, [reportCardConfigResp]);

    const progressCardMenuOptions = useMemo(() => [
        {
            id: "viewprogressreport",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-success" size={18} />,
            actionName: "View Progress Report",
            onClickHndlr: (event: any) => {
                const rowId = event.currentTarget.getAttribute("data-id");
                const rowData = reportCardTableData.find((item: any) => item.rowId === rowId);
                if (!rowData) {
                    return;
                }
                setProgressCardAction("VIEW");
                const payload: any = {
                    academicYearId: rowData?.academicYearId,
                    studentId: currentStudentId,
                    progressCardType: rowData?.progressCardType,
                    processType: rowData?.processType,
                    sourceType: 'PARENT'
                };
                if (rowData?.generationType === "EXAM") {
                    payload.examinationId = rowData.id;
                }
                if (rowData?.generationType === "TERM") {
                    payload.termId = rowData.id;
                    payload.displayType = rowData?.displayTypes[0] || '';
                }
                if (rowData?.generationType === "BOTH_TERMS") {
                    payload.displayType = rowData?.displayTypes[0] || '';
                }
                dispatch(downloadCbseProgressCardsAct(generateActionPayload("parent_progresscard_download", undefined, payload)));
            },
        },
        {
            id: "downloadProgressCard",
            actionIcon: <HugeiconsIcon icon={Download04Icon} size={18} className="me-1" />, // ✅ added back
            actionName: "Download Progress Card",
            onClickHndlr: (event: any) => {
                const rowId = event.currentTarget.getAttribute("data-id");
                const rowData = reportCardTableData.find((item: any) => item.rowId === rowId);
                if (!rowData) {
                    return;
                }
                setProgressCardAction("DOWNLOAD");
                openDownloadProgressCardModal(rowData);
            },
        },
    ], [reportCardTableData, currentStudentId]);

    const viewProgressCardHndlr = () => {
        const modalData = downloadProgressCardModalState.modalData;
        const payload: any = {
            academicYearId: modalData?.academicYearId,
            studentId: currentStudentId,
            processType: modalData?.processType,
            progressCardType: modalData?.progressCardType,
            sourceType: 'PARENT'
        };
        if (modalData?.generationType === "EXAM") {
            payload.examinationId = modalData.id;
        }
        if (modalData?.generationType === "TERM") {
            payload.termId = modalData.id;
            payload.displayType = modalData?.displayTypes[0] || 'BOTH_MARKS_GRADES';
        }
        if (modalData?.generationType === "BOTH_TERMS") {
            payload.displayType = modalData?.displayTypes[0] || 'BOTH_MARKS_GRADES';
        }
        dispatch(downloadCbseProgressCardsAct(generateActionPayload("parent_progresscard_download", undefined, payload)));
    };

    const progressCardColumns = useMemo(() => { return generateColumns(progressCardMenuOptions) }, [reportCardTableData]);
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div className="card">
                        <div className="card-header">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-2">
                                    <h4 className="card-title tw-mb-0">Progress Card</h4>
                                </div>
                                {selectedStudentState?.admissionAcademicYearId && (
                                    <div className="tw-col-span-12 md:tw-col-span-2">
                                        <SelectInput
                                            name="academicYearId"
                                            value={progressCardFormik.values.academicYearId}
                                            onChange={progressCardFormik.handleChange}
                                            menuItems={filteredAcademicYearList}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Academic Year"
                                            floatingLabel
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card-body !tw-p-0">
                            <TableContainer
                                columns={progressCardColumns}
                                data={reportCardTableData}
                                tableClass="tw-mb-0"
                                divClass="table-responsive tw-mb-0"
                                theadClass="table-light tw-text-gray-500 align-middle"
                                showPagination={false}
                            />
                        </div>

                    </div>
                </div>
            </div>

            <ConfirmationModal
                id="download-progress-card-modal"
                isOpen={downloadProgressCardModalState.showModal}
                confirmMessage={`Are you sure you want to ${progressCardAction} Progress Card ?`}
                cancelHndlr={closeDownloadProgressCardModal}
                confirmHndlr={viewProgressCardHndlr}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType="approve"
                btnClassName="btn w-sm btn-success"
            />
            <ModalContainerUpdated
                id="preview-progress-card-modal"
                isOpen={previewProgressCardModelState.showModal}
                toggle={() => closePreviewProgressCardModel()}
                modalTitle="Progress Card Preview"
                modalSize="xl"
            >
                <PreviewProgressCardModel
                    modalData={previewProgressCardModelState.modalData}
                    isOpen={previewProgressCardModelState.showModal}
                    toggle={() => closePreviewProgressCardModel()}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default ParentProgressCard;
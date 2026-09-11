
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { downloadStudentIdCardZipAct, exportStudentIdCardListAct, getIdCardListAct, requestReuploadIdCardAct, resetDownloadStudentIdCardZipAct, sendIdCardNotifcationAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
import { generateColumns, idCardStatusType } from "./helper";
import { useModal } from "../../../hooks/modalhook";
import ApprovalModal from "./ApprovalModal";
import PayNowModal from "./PaynowModal";
import { ignoredKeys } from "./helper"
import { useFilterState } from "../../../hooks/filterhook";
import PreviewIdCard from "./PreviewIdCard";
import { useHistory, useLocation } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, IdentityCardIcon, ImageUploadIcon, Notification03Icon, Payment02Icon, PropertyViewIcon } from "@hugeicons-pro/core-stroke-standard";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { downloadExcelFile } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";
import ReuploadStudentImage from "./ReuploadStudentImage";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    idCardStatus: "",
};

const IdCard = () => {

    const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModalState, openModal: openExportConfirmationModal } = useModal()
    const dispatch = useDispatch();
    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const history = useHistory();
    const { pathname } = useLocation();
    const { modalState: approveModalState, closeModal: closeApproveModalHndlr, openModal: openApproveModalHndlr } = useModal();
    const { modalState: payNowModalState, closeModal: closePayNowModalHndlr, openModal: openPayNowModalHndlr } = useModal();
    const { closeModal: closeSendNotifcationModal, modalState: sendNotifcationState, openModal: openSendNotifcationeModal } = useModal();
    const { modalState: previewModalState, closeModal: closePreviewModalHndlr, openModal: openPreviewModalHndlr } = useModal();
    const [notReportingStuFilter, setNotReportingStuFilter] = useState(initialValues);
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const { closeModal: closeDownloadStudentIdCardZipModel, modalState: downloadStudentIdCardZipModelState, openModal: openDownloadStudentIdCardZipModel } = useModal();
    const { closeModal: closeRequestReuploadModel, modalState: requestReuploadModelState, openModal: openRequestReuploadModel } = useModal();
    const { closeModal: closeReuploadStudentImageModel, modalState: reuploadStudentImageModelState, openModal: openReuploadStudentImageModel } = useModal();

    const stuIdCardList = (otherProps?: any) => {
        let payload = {
            branchId,
            ...notReportingStuFilter,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId) {
            dispatch(getIdCardListAct(generateActionPayload('get_id_card_list', undefined, payload)))
        }
    }

    const exportModalHndler = () => {
        let payload = {
            branchId,
            ...notReportingStuFilter,
        };
        dispatch(exportStudentIdCardListAct(generateActionPayload('export_student_id_card_list', undefined, { ...payload }, {
            responseType: 'blob'
        })))
    }

    const sendNotifcationHandler = (otherProps?: any) => {

        let payload = {
            branchId,
            ...notReportingStuFilter,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId) {
            dispatch(getIdCardListAct(generateActionPayload('get_id_card_list', undefined, payload)))
        }
    };

    const downloadStudentIdCardZipHandler = (otherProps?: any) => {
        const selectedClass = classTypes?.find(
            (cls: any) => cls.id === Number(notReportingStuFilter.classId)
        );
        let payload = {
            branchId,
            ...notReportingStuFilter,
            classShortName: selectedClass?.shortName || ""
        };

        if (payload.academicYearId) {
            dispatch(downloadStudentIdCardZipAct(generateActionPayload('download_student_id_card_zip', undefined, payload, { responseType: "blob" })))
        }
    };

    const requestReuploadHandler = (otherProps?: any) => {
        const formData = new FormData();

        const idCardId = requestReuploadModelState?.modalData?.idCadrNo;

        formData.append("idCardId", idCardId);
        formData.append("status", "REQUEST_REUPLOAD");

        dispatch(requestReuploadIdCardAct(generateActionPayload('request_reupload_id_card', undefined, formData)))
    };

    const setOrderOpenHndler = () => {
        if (!notReportingStuFilter.academicYearId) {
            toast.error("Please select academic year");
            return
        } else if (!notReportingStuFilter.curriculumId) {
            toast.error("Please select curriculum");
            return
        } else if (!notReportingStuFilter.classId) {
            toast.error("Please select class");
            return
        }
        openDownloadStudentIdCardZipModel()
    }
    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getIdCardListResp,
        approveStuIdCardResp,
        payStuIdCardResp,
        sendIdCardNotifcationResp,
        exportStudentIdCardListResp,
        downloadStudentIdCardZipResp,
        requestReuploadIdCardResp,
        notReportingStuErrResp,
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, notReportingStu }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getIdCardListResp: notReportingStu.getIdCardListResp,
            approveStuIdCardResp: notReportingStu.approveStuIdCardResp,
            payStuIdCardResp: notReportingStu.payStuIdCardResp,
            sendIdCardNotifcationResp: notReportingStu.sendIdCardNotifcationResp,
            exportStudentIdCardListResp: notReportingStu.exportStudentIdCardListResp,
            downloadStudentIdCardZipResp: notReportingStu.downloadStudentIdCardZipResp,
            requestReuploadIdCardResp: notReportingStu.requestReuploadIdCardResp,
            notReportingStuErrResp: notReportingStu.notReportingStuErrResp,
        }),
        shallowEqual
    );
    const stuIdCardRef = useRef({
        prevSendIdCardNotifcationResp: sendIdCardNotifcationResp,
        prevApproveStuIdCardResp: approveStuIdCardResp,
        prevExportStudentIdCardListResp: exportStudentIdCardListResp,
        prevPayStuIdCardResp: payStuIdCardResp,
        prevDownloadStudentIdCardZipResp: downloadStudentIdCardZipResp,
        prevRequestReuploadIdCardRespResp: requestReuploadIdCardResp,
        prevNotReportingStuErrResp: notReportingStuErrResp,
    });

    useEffect(() => {

        const { prevSendIdCardNotifcationResp, prevApproveStuIdCardResp, prevPayStuIdCardResp, prevExportStudentIdCardListResp, prevDownloadStudentIdCardZipResp, prevRequestReuploadIdCardRespResp, prevNotReportingStuErrResp } = stuIdCardRef.current;
        if (approveStuIdCardResp && prevApproveStuIdCardResp !== approveStuIdCardResp) {
            pagination.current.pageNo = 0;
            if (approveModalState.showModal && approveModalState.modalData.idCardStatus === "ISSUED") {
                toast.success('ID Card Issued successfully.');
                closeApproveModalHndlr();
                stuIdCardList();
            } else if (approveModalState.showModal && approveModalState.modalData.idCardStatus === "PREPARED") {
                toast.success('ID Card Prepared successfully.');
                closeApproveModalHndlr();
                stuIdCardList();
            } else if (approveModalState.showModal && approveModalState.modalData.idCardStatus === "CANCELLED") {
                toast.success('ID Card Cancelled successfully.');
                closeApproveModalHndlr();
                stuIdCardList();
            }
        } else if (payStuIdCardResp && prevPayStuIdCardResp !== payStuIdCardResp) {
            toast.success('Updated successfully.');
            closePayNowModalHndlr();
            stuIdCardList();
        } else if (sendIdCardNotifcationResp && prevSendIdCardNotifcationResp !== sendIdCardNotifcationResp) {
            toast.success('Notification Sent successfully.');
            closeSendNotifcationModal();
            stuIdCardList();
        }
        else if (exportStudentIdCardListResp && exportStudentIdCardListResp !== prevExportStudentIdCardListResp) {
            downloadExcelFile(exportStudentIdCardListResp, "student_id_card_data")
            toast.success("Students ID Card List Downloaded Successfully.")
            closeExportConfirmationModal();
        }
        else if (notReportingStuErrResp && notReportingStuErrResp !== prevNotReportingStuErrResp) {
            const { details } = notReportingStuErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (downloadStudentIdCardZipResp && prevDownloadStudentIdCardZipResp !== downloadStudentIdCardZipResp) {
            dispatch(resetDownloadStudentIdCardZipAct(undefined));
            toast.success("All Student images downloaded successfully");
            downloadZipFile(downloadStudentIdCardZipResp, `student_img's.zip`);
            closeDownloadStudentIdCardZipModel();
            stuIdCardList();
        }
        else if (requestReuploadIdCardResp && prevRequestReuploadIdCardRespResp !== requestReuploadIdCardResp) {
            dispatch(resetDownloadStudentIdCardZipAct(undefined));
            toast.success("Successfully Updated");
            closeRequestReuploadModel();
            closeReuploadStudentImageModel();
            stuIdCardList();
        }
        stuIdCardRef.current.prevApproveStuIdCardResp = approveStuIdCardResp;
        stuIdCardRef.current.prevPayStuIdCardResp = payStuIdCardResp;
        stuIdCardRef.current.prevSendIdCardNotifcationResp = sendIdCardNotifcationResp;
        stuIdCardRef.current.prevExportStudentIdCardListResp = exportStudentIdCardListResp;
        stuIdCardRef.current.prevDownloadStudentIdCardZipResp = downloadStudentIdCardZipResp;
        stuIdCardRef.current.prevRequestReuploadIdCardRespResp = requestReuploadIdCardResp;
        stuIdCardRef.current.prevNotReportingStuErrResp = notReportingStuErrResp;
    }, [
        sendIdCardNotifcationResp,
        payStuIdCardResp,
        approveStuIdCardResp,
        exportStudentIdCardListResp,
        downloadStudentIdCardZipResp,
        requestReuploadIdCardResp,
        notReportingStuErrResp
    ]);

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

    const menuOptions = useMemo(
        () => [
            {
                id: "prepare-id-card",
                actionIcon: <HugeiconsIcon icon={IdentityCardIcon} className="me-2 text-muted" size={18} />,
                actionName: "Prepare Id Card",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openApproveModalHndlr({ idCadrNo, idCardStatus: "PREPARED" })
                }
            },
            {
                id: "issue-certificate",
                actionIcon: <HugeiconsIcon icon={IdentityCardIcon} className="me-2 text-muted" size={18} />,
                actionName: "Issue ID Card",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openApproveModalHndlr({ idCadrNo, idCardStatus: "ISSUED" })
                }
            },
            {
                id: "send-notification",
                actionIcon: <HugeiconsIcon icon={Notification03Icon} className="me-2 text-muted" size={18} />,
                actionName: "Send Notification",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openSendNotifcationeModal({ idCadrNo });
                }
            },
            {
                id: "cancel",
                actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
                actionName: "Cancel",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openApproveModalHndlr({ idCadrNo, idCardStatus: "CANCELLED" })
                }
            },
            {
                id: "pay-now",
                actionIcon: <HugeiconsIcon icon={Payment02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Pay Now",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openPayNowModalHndlr({ idCadrNo, idCardStatus: "PAY_NOW" })
                }
            },
            {
                id: "preview-idcard",
                actionIcon: <HugeiconsIcon icon={PropertyViewIcon} className="me-2 text-muted" size={18} />,
                actionName: "Preview IDCard",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openPreviewModalHndlr({ idCadrNo })
                }
            },
            {
                id: "request-reupload",
                actionIcon: <HugeiconsIcon icon={PropertyViewIcon} className="me-2 text-muted" size={18} />,
                actionName: "Request Re-Upload",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openRequestReuploadModel({ idCadrNo });
                }
            },
            {
                id: "reupload-student-image",
                actionIcon: <HugeiconsIcon icon={ImageUploadIcon} className="me-2 text-muted tw-rounded-xl" size={20} />,
                actionName: "Re-upload Student Image",
                onClickHndlr: (event: any) => {
                    const idCadrNo = event.currentTarget.getAttribute("data-idCadrNo");
                    openReuploadStudentImageModel({ idCadrNo });
                }
            },
        ],
        [getIdCardListResp]
    );

    const roleColumns = useMemo(() => generateColumns(menuOptions), [getIdCardListResp]);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setNotReportingStuFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
        stuIdCardList({ academicYearId: yearId })
        getCurriculumApiCall({ academicYearId: yearId })
    }, [academicYearListResp]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setNotReportingStuFilter((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: null }));
            stuIdCardList({ [name]: value, classId: null, curriculumId: null });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value, academicYearId: notReportingStuFilter.academicYearId });
            }
            else {
                dispatch(resetBrchClassAct(undefined));
            }
            stuIdCardList({ [name]: value, classId: null });
            setNotReportingStuFilter((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            setNotReportingStuFilter((prevState: any) => ({ ...prevState, [name]: value }));
            stuIdCardList({ [name]: value, });
        }
        advanceFilterChange({ keys: { ...notReportingStuFilter, [name]: value }, ignoredKeys })
    }

    function clearFilterHndlr() {
        pagination.current.pageNo = 0;
        if (academicYearListResp) {
            pagination.current = { ...pagination.current, pageNo: 0 }
            let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
            dispatch(resetBrchClassAct(undefined));
            setNotReportingStuFilter({ ...initialValues, academicYearId });
            stuIdCardList({ ...initialValues, academicYearId });
            advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
        }
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: notReportingStuFilter.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: notReportingStuFilter?.academicYearId, curriculumId: notReportingStuFilter?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        stuIdCardList(paginationInfo)
    }

    function moveToAddCard() {
        history.push("/id-card/add-id-card");
    }

    const hasStudentData =
        Array.isArray(getIdCardListResp?.data) &&
        getIdCardListResp.data.length > 0;

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { totalElements, totalPages, pageble } = getIdCardListResp || {}
    const { content: classTypes } = branchClassResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Academics" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-mb-6">
                        <div className="tw-border-b tw-px-5 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-sm md:tw-text-base tw-font-semibold tw-mb-0">
                                    Student Id Card
                                </h4>
                                <div className="tw-flex tw-items-center tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={moveToAddCard}
                                        className="tw-flex tw-items-center tw-gap-1"
                                    >
                                        <i className="ri-add-line tw-mr-2"></i>
                                        Add Request
                                    </Button>
                                    <Button
                                        variant="info"
                                        type="button"
                                        onClick={setOrderOpenHndler}
                                        disabled={showApiLoader}
                                        className={`tw-flex tw-items-center tw-gap-1 ${showApiLoader || !hasStudentData ? "tw-cursor-not-allowed tw-opacity-60" : ""
                                            }`}
                                    >
                                        <i className="ri-add-line"></i>
                                        <span>Download Student Images</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="exportBtn"
                                        onClick={() => openExportConfirmationModal()}
                                        className="!tw-p-2"
                                        disabled={
                                            showApiLoader ||
                                            !Array.isArray(getIdCardListResp?.data) ||
                                            getIdCardListResp?.data.length === 0
                                        }
                                    >
                                        <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-px-2">
                            <div className="tw-py-4 tw-px-3 tw-rounded">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                                        <div className="search-box">
                                            <TextInput
                                                name="searchString"
                                                value={notReportingStuFilter.searchString}
                                                onChange={filterHandler}
                                                formgroupClassName="tw-mb-0"
                                                placeHolder="Search"
                                                labelText="Search"
                                                floatingLabel
                                            />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                    </div>
                                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                        <SelectInput
                                            name="academicYearId"
                                            value={notReportingStuFilter.academicYearId}
                                            onChange={filterHandler}
                                            menuItems={academicYearList}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Academic Year"
                                            floatingLabel
                                        />
                                    </div>
                                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                        <SelectInput
                                            name="curriculumId"
                                            value={notReportingStuFilter.curriculumId}
                                            onChange={filterHandler}
                                            menuItems={curriculumTypes}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Curriculum"
                                            floatingLabel
                                        />
                                    </div>
                                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                        <SelectInput
                                            name="classId"
                                            value={notReportingStuFilter.classId}
                                            onChange={filterHandler}
                                            menuItems={classTypes}
                                            valueKey="id"
                                            textKey="shortName"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Class"
                                            floatingLabel
                                        />
                                    </div>
                                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                        <SelectInput
                                            name="idCardStatus"
                                            value={notReportingStuFilter.idCardStatus}
                                            onChange={filterHandler}
                                            menuItems={idCardStatusType}
                                            valueKey="id"
                                            textKey="name"
                                            formgroupClassName="tw-mb-0"
                                            labelText="Status"
                                            floatingLabel
                                        />
                                    </div>
                                    <div className="tw-col-span-12 md:tw-col-span-2 tw-flex tw-items-center tw-justify-end">
                                        {showClearFilterState && (
                                            <Button
                                                variant="wrong"
                                                type="button"
                                                onClick={clearFilterHndlr}
                                                className="tw-px-3 tw-py-1"
                                            >
                                                Clear filter
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={roleColumns}
                            data={Array.isArray(getIdCardListResp?.data) ? getIdCardListResp?.data : []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageble?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="id-card-approval-modal"
                isOpen={approveModalState.showModal}
                toggle={closeApproveModalHndlr}
                modalSize="md"
                hideHeader
            >
                <ApprovalModal
                    toggleModal={closeApproveModalHndlr}
                    modalInfo={approveModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="id-card-pay-now"
                isOpen={payNowModalState.showModal}
                toggle={closePayNowModalHndlr}
                modalTitle="Generate Receipt"
                modalSize="md"
            >
                <PayNowModal
                    toggle={closePayNowModalHndlr}
                    modalTitle="Generate Receipt"
                    modalData={payNowModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="changepassword-modal"
                isOpen={previewModalState.showModal}
                modalTitle="Preview Student Id Card"
                toggle={closePreviewModalHndlr}
                modalSize="md"
            >
                <PreviewIdCard
                    idCardNo={previewModalState.modalData}
                    isOpen={previewModalState.showModal}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="send-notification"
                isOpen={sendNotifcationState.showModal}
                confirmMessage="Are you sure you want to send notification?"
                cancelHndlr={closeSendNotifcationModal}
                confirmHndlr={sendNotifcationHandler}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <ModalContainerUpdated
                id="student-id-card"
                isOpen={exportConfirmationModalState.showModal}
                toggle={closeExportConfirmationModal}
                modalTitle="Export Student ID Card Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportConfirmationModalState.showModal}
                    toggle={closeExportConfirmationModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="academic"
                    subFeature="id_card_images_info"
                    remarksText="Enter remarks to export Students ID Card Data?"
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="send-notification"
                isOpen={downloadStudentIdCardZipModelState.showModal}
                confirmMessage="Are you sure you want to download student images?"
                cancelHndlr={closeDownloadStudentIdCardZipModel}
                confirmHndlr={downloadStudentIdCardZipHandler}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <ConfirmationModal
                id="request-reupload"
                isOpen={requestReuploadModelState.showModal}
                confirmMessage="Are you sure you want to Request Reupload the student images?"
                cancelHndlr={closeRequestReuploadModel}
                confirmHndlr={requestReuploadHandler}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <ModalContainerUpdated
                id="changepassword-modal"
                isOpen={reuploadStudentImageModelState.showModal}
                modalTitle="Re-Upload Student Image"
                toggle={closeReuploadStudentImageModel}
                modalSize="md"
            >
                <ReuploadStudentImage
                    idCardNo={reuploadStudentImageModelState.modalData}
                    isOpen={reuploadStudentImageModelState.showModal}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default IdCard;

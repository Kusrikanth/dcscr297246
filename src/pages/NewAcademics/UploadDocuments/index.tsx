
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
    generateColumns
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { deleteUploadDocumentsAct, exportUploadDocumentListAct, getUploadDocumentPreviewAct, getUploadDocumentsAct, getUrlDownloadFileAct, getWorkTypesListAct, resetUrlDownloadFileAct } from "../../../store/academic/academicRequest/academicrequestactions";
import AddUploadDocumnets from "./AddUploadDocuments";
import { useModal } from "../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import PreviewUploadDocuments from "./PreviewUploadDocuments";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { downloadExcelFile } from "../../../utility/commonutility";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import Button from "../../../Components/Common/Button";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    workTypeId: "",
};

const UploadDocuments = () => {

    const dispatch = useDispatch();
    const [uploadDocumentsFilterState, setUploadDocumentsFilterState] = useState(initialValues);
    const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModal, openModal: openExportConfirmationModal } = useModal();
    const { closeModal: closeUploadDocPreviewModal, modalState: uploadDocPreviewModalState, openModal: openUploadDocPreviewModal } = useModal();
    const { closeModal: closeUploadDocModal, openModal: openUploadDocModal, modalState: uploadDocModalState } = useModal()
    const { closeModal: closeDeleteDocModal, openModal: openDeleteDocModal, modalState: deleteDocModalState } = useModal()

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const uploadDocumentsList = (otherProps?: any) => {
        let payload = {
            ...uploadDocumentsFilterState,
            instituteId: instituteId,
            branchId,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId) {
            dispatch(getUploadDocumentsAct(generateActionPayload('get_upload_documents_list', undefined, payload)))
        }
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        loggedInUserRole,
        showApiLoader,
        getUploadDocumentsResp,
        getWorkTypesListResp,
        deleteUploadDocumentsResp,
        addUploadDocumentsResp,
        academicRequestErrorResp,
        getUrlDownloadFileResp,
        exportUploadDocumentListresp,
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, academicRequest, feeCollections }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            showApiLoader: globalData.showApiLoader,
            getUploadDocumentsResp: academicRequest.getUploadDocumentsResp,
            getWorkTypesListResp: academicRequest.getWorkTypesListResp,
            deleteUploadDocumentsResp: academicRequest.deleteUploadDocumentsResp,
            addUploadDocumentsResp: academicRequest.addUploadDocumentsResp,
            academicRequestErrorResp: academicRequest.academicRequestErrorResp,
            getUrlDownloadFileResp: academicRequest.getUrlDownloadFileResp,
            exportUploadDocumentListresp: academicRequest.exportUploadDocumentListresp,
        }),
        shallowEqual
    );

    const uploadDocumentsRef = useRef({
        prevAcademicRequestErrorResp: academicRequestErrorResp,
        prevAddUploadDocumentsResp: addUploadDocumentsResp,
        prevDeleteUploadDocumentsResp: deleteUploadDocumentsResp,
        prevExportUploadDocumentListresp: exportUploadDocumentListresp,
    })
    useEffect(() => {
        const { prevAcademicRequestErrorResp, prevDeleteUploadDocumentsResp, prevAddUploadDocumentsResp, prevExportUploadDocumentListresp } = uploadDocumentsRef.current;
        if (academicRequestErrorResp && prevAcademicRequestErrorResp !== academicRequestErrorResp) {
            const { details } = academicRequestErrorResp;
            toast.error(details)
        }
        else if (deleteUploadDocumentsResp && prevDeleteUploadDocumentsResp !== deleteUploadDocumentsResp) {
            toast.success('Document Deleted Successfully')
            closeDeleteDocModal();
            uploadDocumentsList()
        }
        else if (addUploadDocumentsResp && prevAddUploadDocumentsResp !== addUploadDocumentsResp) {
            toast.success('Document Added Successfully')
            closeUploadDocModal();
            uploadDocumentsList()
        }
        else if (exportUploadDocumentListresp && prevExportUploadDocumentListresp !== exportUploadDocumentListresp) {
            toast.success("Upload Documents Download Successfully.");
            closeExportConfirmationModal();
            downloadExcelFile(exportUploadDocumentListresp, 'upload_documents.xlsx')
        }
        uploadDocumentsRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
        uploadDocumentsRef.current.prevDeleteUploadDocumentsResp = deleteUploadDocumentsResp;
        uploadDocumentsRef.current.prevAddUploadDocumentsResp = addUploadDocumentsResp;
        uploadDocumentsRef.current.prevExportUploadDocumentListresp = exportUploadDocumentListresp;

    }, [academicRequestErrorResp, deleteUploadDocumentsResp, addUploadDocumentsResp, exportUploadDocumentListresp])

    const canDelete = useMemo(() => {
        return loggedInUserRole !== 'TEACHER'
    }, [loggedInUserRole]);
    const menuOptions = useMemo(
        () => {
            const actions: IOptionsHrtl[] = [
                {
                    id: "previewDocument",
                    actionIcon: (
                        <HugeiconsIcon
                            icon={EyeIcon}
                            className="text-gray-500"
                            size={18}
                        />
                    ),
                    actionName: "Preview",
                    onClickHndlr: (event: any) => {
                        const fullId = event.currentTarget.getAttribute("data-id");
                        const [, systemFileId] = fullId?.split("__") || [];
                        if (systemFileId) {
                            dispatch(
                                getUploadDocumentPreviewAct(
                                    generateActionPayload("upload_doc_preview", { systemFileId })
                                )
                            );
                            openUploadDocPreviewModal(systemFileId);
                        }
                    },
                },
                {
                    id: "delete",
                    actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
                    actionName: "Delete",
                    onClickHndlr: deleteFeeCategoryHndlr
                }
            ];
            if (canDelete) {
                return actions;
            } else {
                return actions.filter(action => action.id !== 'delete');
            }
        },
        [canDelete]
    );

    function deleteFeeCategoryHndlr(event: any) {
        const fullId = event.currentTarget.getAttribute("data-id");
        const [uploadId] = fullId?.split("__") || [];
        if (uploadId) {
            openDeleteDocModal(uploadId);
        }
    }

    function handleFileDownload(systemFileId) {
        dispatch(getUrlDownloadFileAct(generateActionPayload('get_url_download_file', { id: systemFileId })));
    }

    useEffect(() => {
        if (getUrlDownloadFileResp) {
            window.open(getUrlDownloadFileResp, "_self");
        }
    }, [getUrlDownloadFileResp]);

    const roleColumns = useMemo(() => generateColumns(menuOptions, handleFileDownload), [getUploadDocumentsResp]);

    useEffect(() => {

        dispatch(getWorkTypesListAct(generateActionPayload("get_work_types_list", undefined, { branchId, sortBy: "createdAt", orderBy: "desc", pageNo: 0, pageSize: 500 })));
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetUrlDownloadFileAct(undefined));
        }
    }, []);

    useEffect(() => {
        const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
        setUploadDocumentsFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        uploadDocumentsList({ academicYearId: yearId })
        const payload1: any = { academicYearId: yearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        if (loggedInUserRole === "TEACHER") {
            payload1.moduleName = "EXAMINATION";
        }
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }, [academicYearListResp]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            setUploadDocumentsFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", }));
            uploadDocumentsList({ [name]: value });
            if (value) {
                const brchCurriculumParams: any = { academicYearId: value, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
                if (loggedInUserRole === "TEACHER") {
                    brchCurriculumParams.moduleName = "EXAMINATION";
                }
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumParams)));
            } else {
                dispatch(resetBrchClassAct(undefined));
            }
        } else if (name === "curriculumId") {
            setUploadDocumentsFilterState((prev: any) => ({ ...prev, [name]: value, classId: "" }));
            const payload: any = { academicYearId: uploadDocumentsFilterState.academicYearId, branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, };
            uploadDocumentsList({ [name]: value });
            if (!value) {
                dispatch(resetBrchClassAct(undefined));
            } else {
                if (loggedInUserRole === "TEACHER") {
                    payload.moduleName = "EXAMINATION";
                }
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        } else {
            uploadDocumentsList({ [name]: value })
            setUploadDocumentsFilterState((prev: any) => ({ ...prev, [name]: value }));
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        uploadDocumentsList(paginationInfo)
    }

    const deleteDocumentHndler = () => {
        dispatch(deleteUploadDocumentsAct(generateActionPayload("delete_upload_documents", { uploadId: deleteDocModalState.modalData })));
    }
    const exportModalHndler = () => {

        dispatch(exportUploadDocumentListAct(generateActionPayload('export_upload_document_list', undefined, { ...uploadDocumentsFilterState }, {
            responseType: 'blob'
        })))
    }
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { data: studentResp, totalElements, totalPages, pageble } = getUploadDocumentsResp || {}
    const { content: classTypes } = branchClassResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Academics" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Upload Documents
                                </h4>
                                <div className="tw-flex tw-items-center tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => openUploadDocModal()}
                                    >
                                        <i className="ri-add-line tw-mr-2" />
                                        Upload
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="exportBtn"
                                        onClick={() => openExportConfirmationModal()}
                                        id="export-btn"
                                    >
                                        <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                    </Button>
                                    <UncontrolledTooltip placement="bottom" target="export-btn">
                                        Export
                                    </UncontrolledTooltip>
                                </div>
                            </div>
                        </div>
                        <div className="tw-px-4 tw-py-4">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={uploadDocumentsFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="bg-soft-light"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={uploadDocumentsFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={uploadDocumentsFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="classId"
                                        value={uploadDocumentsFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Class"
                                        floatingLabel
                                    />
                                </div>
                                <div className="tw-col-span-12 md:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="workTypeId"
                                        value={uploadDocumentsFilterState.workTypeId}
                                        onChange={filterHandler}
                                        menuItems={getWorkTypesListResp?.data || []}
                                        valueKey="examinationWorkId"
                                        textKey="workTypeName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Work Type"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={roleColumns || []}
                            data={studentResp || []}
                            divClass="tw-overflow-x-auto tw-mb-3"
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
                id="add-upload-documents-modal"
                isOpen={uploadDocModalState.showModal}
                toggle={closeUploadDocModal}
                modalTitle="Upload Documents"
                modalSize="md"
            >
                <AddUploadDocumnets toggle={closeUploadDocModal} instituteId={instituteId} branchId={branchId} isOpen={uploadDocModalState.showModal} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="add-upload-documents-modal"
                isOpen={uploadDocPreviewModalState.showModal}
                toggle={closeUploadDocPreviewModal}
                modalTitle="Preview Upload Document"
                modalSize="lg"
            >
                <PreviewUploadDocuments
                    isOpen={uploadDocPreviewModalState.showModal}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-upload-document-modal"
                isOpen={deleteDocModalState.showModal}
                confirmMessage="Are you sure you want delete Document ?"
                cancelHndlr={closeDeleteDocModal}
                confirmHndlr={deleteDocumentHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='reject'
                btnClassName='btn w-sm btn-danger'
            />
            <ModalContainerUpdated
                id="special-fee-reciepts-export-modal"
                isOpen={exportConfirmationModal.showModal}
                toggle={closeExportConfirmationModal}
                modalTitle={'Export Uploaded Documents'}
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportConfirmationModal.showModal}
                    toggle={closeExportConfirmationModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="uploads"
                    subFeature="documents"
                    remarksText="Enter remarks to export uploaded documents?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default UploadDocuments;

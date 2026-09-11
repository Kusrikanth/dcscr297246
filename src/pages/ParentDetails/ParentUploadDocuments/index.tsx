import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { IPaginationState } from "../../../Components/Common/Pagination";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../hooks/storehook";
import { getUploadDocumentPreviewAct, getUploadDocumentsAct, getUrlDownloadFileAct } from "../../../store/academic/academicRequest/academicrequestactions";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateColumns } from "./helper";
import { resetUrlDownloadFileAct, setUrlDownloadFileAct } from "../../../store/academic/academicRequest/academicrequestslice";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../hooks/modalhook";
import PreviewUploadDocuments from "./PreviewUploadDocuments";
import { getStudentsListAct } from "../../../store/directory/studentmanagement/studentmanagementactions";


const initialValues = {
    searchString: "",
    academicYearId: "",
};

const ParentUploadDocuments = () => {
    const dispatch = useDispatch();
    const [uploadDocumentsFilterState, setUploadDocumentsFilterState] = useState(initialValues);
    const { closeModal: closeUploadDocPreviewModal, modalState: uploadDocPreviewModalState, openModal: openUploadDocPreviewModal } = useModal();
    const [selectedStudentState, setSelectedStudentState] = useState<any>(undefined);
    
    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const uploadDocumentsList = (otherProps?: any) => {

        const student = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
        const { academicYearId, curriculumId, classId, childCode, sectionId, childBranchId, instituteId } = student;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId: childBranchId,
            classId: classId,
            sectionId: sectionId,
            searchString: "",
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId) {
            dispatch(getUploadDocumentsAct(generateActionPayload('get_upload_documents_list', undefined, payload)))
        }
    }

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getUploadDocumentsResp,
        currentStudentId,
        parentChildrensResp,
        academicRequestErrorResp,
        getUrlDownloadFileResp,
        studentsListResp,
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, academicRequest, directoryStudent }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentStudentId: appData.currentStudentId,
            showApiLoader: globalData.showApiLoader,
            getUploadDocumentsResp: academicRequest.getUploadDocumentsResp,
            academicRequestErrorResp: academicRequest.academicRequestErrorResp,
            parentChildrensResp: directoryStudent.parentChildrensResp,
            studentsListResp: directoryStudent.studentsListResp,
            getUrlDownloadFileResp: academicRequest.getUrlDownloadFileResp,
        }),
        shallowEqual
    );

    function getStudentsApiCall() {
        const { academicYearId } = uploadDocumentsFilterState;

        if (academicYearId && selectedStudentState) {
            const params = {
                branchId: selectedStudentState?.childBranchId,
                academicYearId,
                curriculumId: selectedStudentState?.curriculumId,
                searchString: selectedStudentState?.childCode,
                nameFilterType: "global",
            };

            dispatch(
                getStudentsListAct(
                    generateActionPayload("get_students", undefined, params)
                )
            );
        }
    }

    const parentUploadDocumentsRef = useRef({
        prevAcademicRequestErrorResp: academicRequestErrorResp,
        prevGetUrlDownloadFileResp: getUrlDownloadFileResp,
    })
    useEffect(() => {
        const { prevAcademicRequestErrorResp, prevGetUrlDownloadFileResp } = parentUploadDocumentsRef.current;
        if (academicRequestErrorResp && prevAcademicRequestErrorResp !== academicRequestErrorResp) {
            const { details } = academicRequestErrorResp;
            toast.error(details)
        }
        else if (getUrlDownloadFileResp && prevGetUrlDownloadFileResp !== getUrlDownloadFileResp) {
            toast.success("File downloaded successfully")
        }
        parentUploadDocumentsRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
        parentUploadDocumentsRef.current.prevGetUrlDownloadFileResp = getUrlDownloadFileResp;
    }, [ academicRequestErrorResp, getUrlDownloadFileResp])
 
    useEffect(() => {
        if (parentChildrensResp && currentStudentId) {
            const student = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
            const { academicYearId, curriculumId, classId, childCode, childBranchId, instituteId } = student;
            let payload = {
                academicYearId: academicYearId,
                curriculumId: curriculumId,
                instituteId: instituteId,
                branchId: childBranchId,
                classId: classId,
                searchString: "",
                ...pagination.current,
            };
            setUploadDocumentsFilterState((prev: any) => ({ ...prev, ...payload }))
            // uploadDocumentsList(payload)
        }

    }, [parentChildrensResp])

    useEffect(() => {
        if (selectedStudentState?.childBranchId && uploadDocumentsFilterState.academicYearId) {
            getStudentsApiCall();
        }
    }, [selectedStudentState?.childBranchId, uploadDocumentsFilterState.academicYearId]);
    
    useEffect(() => {
        if (
            selectedStudentState &&
            uploadDocumentsFilterState.academicYearId &&
            studentsListResp?.data?.length
        ) {
            const studentForYear = studentsListResp.data.find(
                (student: any) =>
                    student.studentCode === selectedStudentState.childCode
            );

            if (studentForYear?.classId) {
                uploadDocumentsList({
                    academicYearId: uploadDocumentsFilterState.academicYearId,
                    classId: studentForYear.classId
                });
            }
        }
    }, [selectedStudentState, uploadDocumentsFilterState.academicYearId, studentsListResp]);
    
    useEffect(() => {
        if (Array.isArray(parentChildrensResp) && parentChildrensResp.length && currentStudentId) {
            const studentDetails: any = parentChildrensResp.find((i: any) => +i?.childId === +currentStudentId);
            if (studentDetails) {
                setSelectedStudentState(studentDetails);
            }
        }
    }, [parentChildrensResp, currentStudentId]);

    const menuOptions = useMemo(
        () => [
            {
                id: "download",
                actionIcon: <i className="ri-download-2-line fs-20 text-info"></i>,
                actionName: "Download",
                onClickHndlr: downloadDocumentHndler
              },
              {
                id: "previewDocument",
                actionIcon: (
                    <HugeiconsIcon
                        icon={EyeIcon}
                        className="text-muted"
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
        ],
        [getUploadDocumentsResp]
    );

    function downloadDocumentHndler(event: any) {
        const fullId = event.currentTarget.getAttribute("data-id");
        if (!fullId) return;
        const [uploadId, systemFileId] = fullId.split("__");
        const findData = getUploadDocumentsResp?.data?.find(
            (item: any) => +item.uploadId === +uploadId
        );
        if (systemFileId) {
            dispatch(getUrlDownloadFileAct(generateActionPayload("get_url_download_file", { id: systemFileId }, undefined)));
        } else if (findData?.fileInfo) {
            window.open(findData.fileInfo, "_blank");
        }
    }

    useEffect(() => {
        if (getUrlDownloadFileResp) {
            window.open(getUrlDownloadFileResp, "_self");
        }
    }, [getUrlDownloadFileResp]);

    const roleColumns = useMemo(() => generateColumns(menuOptions), [getUploadDocumentsResp]);

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetUrlDownloadFileAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(academicYearListResp?.data) && academicYearListResp?.data.length > 0) {
            let yearId: any = academicYearListResp?.data?.find((year: any) => year.yearStatus === 'CURRENT')?.academicYearId
            // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
            setUploadDocumentsFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        }
    }, [academicYearListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setUploadDocumentsFilterState((prev: any) => ({ ...prev, [name]: value }))
        pagination.current.pageNo = 0;
        uploadDocumentsList({ [name]: value })
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        uploadDocumentsList(paginationInfo)
    }
    
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

    const { data: academicYearList } = academicYearListResp || {};
    const { data: studentResp, totalElements, totalPages, pageble } = getUploadDocumentsResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Academics" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">

                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Download Documents
                                </h4>
                            </div>
                        </div>

                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3">

                                <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            value={uploadDocumentsFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>

                                <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={uploadDocumentsFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={filteredAcademicYearList}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={studentResp || []}
                            divClass="table-responsive tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
                isOpen={uploadDocPreviewModalState.showModal}
                toggle={closeUploadDocPreviewModal}
                modalTitle="Preview Upload Document"
                modalSize="lg"
            >
                <PreviewUploadDocuments
                    isOpen={uploadDocPreviewModalState.showModal}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default ParentUploadDocuments;

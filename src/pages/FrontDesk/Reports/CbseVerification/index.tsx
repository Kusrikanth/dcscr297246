
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import { generateColumns, statusOptions, undertakingOptions } from "./helper";
import { getSectionList, setSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { downloadCbseVerifyListAct, exportCbseVerificationAct, getCbseVerifyReportAct } from "../../../../store/fee/feereport/feereportactions";
import { useHistory } from "react-router-dom";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import Button from "../../../../Components/Common/Button";


const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    academicStudentId: "",
    searchString: "",
    status: "",
    undertaking: "",
};

const CbseVerificationReport = () => {
    const dispatch = useDispatch();
    const [exportModal, setExportModal] = useState({ showModal: false });
    const [cbseVerifyReportFilterState, setCbseVerifyReportFilterState] = useState<any>(initialValues);
    const paginationRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const cbseVerificationList = (otherProps?: any) => {

        const payload = {
            branchId,
            instituteId,
            ...cbseVerifyReportFilterState,
            ...paginationRef.current,
            ...otherProps
        }

        if (payload.academicYearId && payload.branchId) {
            dispatch(getCbseVerifyReportAct(generateActionPayload('get_cbse_verify_list', undefined, payload)))
        }
    }

    const downloadCbseVerifyList = (otherProps?: any) => {
        const payload = {
            branchId,
            viewType: "VIEW",
            ...cbseVerifyReportFilterState,
            ...otherProps
        }
        dispatch(downloadCbseVerifyListAct(generateActionPayload('download_cbse_verify_list', undefined, payload)))
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        sectionListResp,
        getCbseVerifyReportResp,
        downloadCbseVerifyListResp, exportCbseVerificationResp,
        feeReportErrorResp,
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, holidayDetails, classroomManagmentInfo, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            getCbseVerifyReportResp: feeReport.getCbseVerifyReportResp,
            downloadCbseVerifyListResp: feeReport.downloadCbseVerifyListResp,
            exportCbseVerificationResp: feeReport.exportCbseVerificationResp,
            feeReportErrorResp: feeReport.feeReportErrorResp,
        }),
        shallowEqual
    );

    const studentLongLeavesRef = useRef({
        prevExportCbseVerificationResp: exportCbseVerificationResp,
        prevDownloadCbseVerifyListResp: downloadCbseVerifyListResp,
        prevFeeReportErrorResp: feeReportErrorResp,
    });

    useEffect(() => {
        const { prevFeeReportErrorResp, prevDownloadCbseVerifyListResp, prevExportCbseVerificationResp } = studentLongLeavesRef.current;

        if (feeReportErrorResp && feeReportErrorResp !== prevFeeReportErrorResp) {
            const { details } = feeReportErrorResp || {};
            toast.error(details || "Something went wrong.")
        } else if (downloadCbseVerifyListResp && downloadCbseVerifyListResp !== prevDownloadCbseVerifyListResp) {
            if (downloadCbseVerifyListResp?.fileURL) {
                window.open(downloadCbseVerifyListResp?.fileURL, "_blank");
            }
        } else if (exportCbseVerificationResp && exportCbseVerificationResp !== prevExportCbseVerificationResp) {
            toggleExportModalHandler();
            const url = window.URL.createObjectURL(new Blob([(exportCbseVerificationResp)]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'cbserverification.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        }

        studentLongLeavesRef.current.prevDownloadCbseVerifyListResp = downloadCbseVerifyListResp;
        studentLongLeavesRef.current.prevFeeReportErrorResp = feeReportErrorResp;
        studentLongLeavesRef.current.prevExportCbseVerificationResp = exportCbseVerificationResp;
    }, [downloadCbseVerifyListResp, feeReportErrorResp, exportCbseVerificationResp]);

    useEffect(() => {

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setCbseVerifyReportFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getCurriculumApiCall({ academicYearId: yearId });
        cbseVerificationList({ academicYearId: yearId })
    }, [academicYearListResp]);

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: cbseVerifyReportFilterState.classId || null, masterAcademicYearId: cbseVerifyReportFilterState.academicYearId, curriculumId: cbseVerifyReportFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: cbseVerifyReportFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",academicYearId : cbseVerifyReportFilterState.academicYearId, curriculumId, branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        if(name === 'academicYearId') {
            getCurriculumApiCall({ academicYearId: value })
            cbseVerificationList({ ...cbseVerifyReportFilterState, [name]: value, curriculumId: "", classId: "",sectionId:"" })
            setCbseVerifyReportFilterState((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "",sectionId:"" }))
            dispatch(resetBrchClassAct(undefined))
            dispatch(setSectionListAct(undefined))
        }
        else if (name === 'curriculumId') {
            dispatch(setSectionListAct(undefined))
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getClassApiCall(value)
            }
            cbseVerificationList({ ...cbseVerifyReportFilterState, [name]: value, classId: "" ,sectionId:""})
            setCbseVerifyReportFilterState((prev: any) => ({ ...prev, [name]: value, classId: "" ,sectionId:""}))
        }
        else if (name === 'classId') {
            getSectionListResp({ branchClassId: value })
            cbseVerificationList({ ...cbseVerifyReportFilterState, [name]: value, sectionId: "" })
            setCbseVerifyReportFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
        }
        else {
            cbseVerificationList({ ...cbseVerifyReportFilterState, [name]: value })
            setCbseVerifyReportFilterState((prev: any) => ({ ...prev, [name]: value }))
        }

    }

    function paginationHndlr(paginationInfo: any) {
        paginationRef.current = paginationInfo;
        cbseVerificationList(paginationInfo);
    }

    const history = useHistory();
    function updateCbseVerificationHndlr() {
        history.push('/cbse-verification-report/update');
    }

    function exportHandler() {
        setExportModal(prevState => ({ ...prevState, showModal: true }));
    }

    function submitHndlr(password: any) {
        const params = {
            branchId,
            instituteId,
            ...cbseVerifyReportFilterState,
        }
        dispatch(
            exportCbseVerificationAct(
                generateActionPayload("export_cbse_verification", undefined, params, {
                    responseType: 'blob'
                })
            )
        );
    }

    function toggleExportModalHandler() {
        setExportModal(prevState => ({ ...prevState, showModal: !prevState.showModal }));
    }

    const roleColumns = useMemo(() => generateColumns(), [getCbseVerifyReportResp]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { totalElements, totalPages, pageble } = getCbseVerifyReportResp || {}

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Reports" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                        <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                            <div className="tw-grid tw-grid-cols-12 tw-items-center">
                                <div className="tw-col-span-6">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                                        CBSE Verification Report
                                    </h4>
                                </div>
                                <div className="tw-col-span-6 tw-ml-auto">
                                    <Button
                                        variant="primary"
                                        onClick={updateCbseVerificationHndlr}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="tw-p-5">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="searchString"
                                            value={cbseVerifyReportFilterState.searchString}
                                            onChange={filterHandler}
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                            floatingLabel
                                            labelText="Search"
                                        />
                                        <i className="ri-search-line tw-absolute tw-top-1/2 tw-left-3 tw--translate-y-1/2 tw-text-gray-400"></i>
                                    </div>
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <SelectInput
                                        name="academicYearId"
                                        value={cbseVerifyReportFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <SelectInput
                                        name="curriculumId"
                                        value={cbseVerifyReportFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <SelectInput
                                        name="classId"
                                        value={cbseVerifyReportFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes}
                                        valueKey="id"
                                        textKey="shortName"
                                        labelText="Class"
                                        floatingLabel
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <SelectInput
                                        name="sectionId"
                                        value={cbseVerifyReportFilterState.sectionId}
                                        onChange={filterHandler}
                                        menuItems={sectionListResp?.data}
                                        valueKey="sectionId"
                                        textKey="sectionName"
                                        labelText="Section"
                                        floatingLabel
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <SelectInput
                                        name="status"
                                        value={cbseVerifyReportFilterState.status}
                                        onChange={filterHandler}
                                        menuItems={statusOptions}
                                        valueKey="id"
                                        textKey="name"
                                        labelText="Status"
                                        floatingLabel
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                                    <SelectInput
                                        name="undertaking"
                                        value={cbseVerifyReportFilterState.undertaking}
                                        onChange={filterHandler}
                                        menuItems={undertakingOptions}
                                        valueKey="id"
                                        textKey="name"
                                        labelText="Undertaking"
                                        floatingLabel
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>
                            </div>

                            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mt-0">
                                <div className="tw-col-span-12 tw-ml-auto tw-flex tw-items-center tw-flex-wrap tw-gap-2 tw-mt-3">
                                    <Button
                                        type="button"
                                        variant="soft"
                                        disabled={showApiLoader}
                                        onClick={() => downloadCbseVerifyList({ isBeforeSubmission: true })}
                                        className=" !tw-border-green-500 !tw-text-green-600 "
                                    >
                                        Report before submission
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="soft"
                                        disabled={showApiLoader}
                                        onClick={() => downloadCbseVerifyList({ isBeforeSubmission: false })}
                                        className="!tw-border !tw-border-red-500 !tw-text-red-600 "
                                    >
                                        Report after submission
                                    </Button>
                                    <Button
                                    variant="info"
                                        onClick={exportHandler}
                                    >
                                        <div className="tw-flex tw-items-center tw-text-white">
                                            <span><i className="ri-add-line tw-mr-1" /></span>
                                            <span>Export</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <TableContainer
                            columns={roleColumns || []}
                            data={Array.isArray(getCbseVerifyReportResp?.content) ? getCbseVerifyReportResp?.content : []}
                            divClass="tw-overflow-x-auto tw-mb-3"
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
                id="cbseverification-export-modal"
                isOpen={exportModal.showModal}
                toggle={toggleExportModalHandler}
                modalTitle={'Export CBSE Verification Data'}
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModal.showModal}
                    toggle={toggleExportModalHandler}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitHndlr}
                    feature="admission"
                    subFeature="cbse_verification"
                    remarksText="Enter remarks to export cbse verification data?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default CbseVerificationReport;


import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import { admissionTrackerReportAct, admissionTrackerReportExportAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";


const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
};

const AdmissionTrackerReport = () => {

    const dispatch = useDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const [exportExcel, setExportExcel] = useState({
        showModal: false
    })

    const trackerReportList = (otherProps?: any) => {
        const { academicYearId, curriculumId, classId, searchString } = trackerReportFilterState;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            searchString,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.academicYearId) {
            dispatch(admissionTrackerReportAct(generateActionPayload('admission_tracker_report', undefined, payload)))
        }
    }

    const [trackerReportFilterState, setTrackerReportFilterState] = useState(initialValues);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        currentInstCodeResp: instituteCode,
        showApiLoader,
        admissionTrackerReportResp,
        admissionTrackerReportExportResp,
        reportsErrResp,
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, reports }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentInstCodeResp: appData.currentInstCodeResp,
            showApiLoader: globalData.showApiLoader,
            admissionTrackerReportResp: reports.admissionTrackerReportResp,
            admissionTrackerReportExportResp: reports.admissionTrackerReportExportResp,
            reportsErrResp: reports.reportsErrResp,
        }),
        shallowEqual
    );

    const studentLongLeavesRef = useRef({
        prevAdmissionTrackerReportExportResp: admissionTrackerReportExportResp,
        prevReportsErrResp: reportsErrResp,
    });

    useEffect(() => {
        const { prevReportsErrResp, prevAdmissionTrackerReportExportResp } = studentLongLeavesRef.current;

        if (reportsErrResp && reportsErrResp !== prevReportsErrResp) {
            const { details } = reportsErrResp || {};
            toast.error(details || "Something went wrong.")
        } else if (admissionTrackerReportExportResp && admissionTrackerReportExportResp !== prevAdmissionTrackerReportExportResp) {
            toast.success("Admission Tracker Report Downloaded Successfully");
            toggleExportExcelModal();
            downloadExcelFile(admissionTrackerReportExportResp,"Admission_Tracker_Report");
        }

        studentLongLeavesRef.current.prevAdmissionTrackerReportExportResp = admissionTrackerReportExportResp;
        studentLongLeavesRef.current.prevReportsErrResp = reportsErrResp;
    }, [admissionTrackerReportExportResp, reportsErrResp]);


    const roleColumns = useMemo(() => {
        const columns = generateColumns();
        if (instituteCode === 'PMS') {
            return columns.filter(item => {
                const { accessor } = item;
                return accessor !== "examSchedule" &&
                    accessor !== "examScheduleDate" && accessor !== "examScheduleInterviewDate" &&
                    accessor !== "marksEntry" && accessor !== "marksEntryDate" &&
                    accessor !== "interviewSchedule" && accessor !== "interviewScheduleDate" &&
                    accessor !== "interviewDate" && accessor !== "observationAndInterviewResult"
            })
        }
        return columns;
    }, [instituteCode, admissionTrackerReportResp]);

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setTrackerReportFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getCurriculumApiCall({ academicYearId: yearId });
        trackerReportList({ academicYearId: yearId })
    }, [academicYearListResp]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: trackerReportFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function getClassApiCall(curriculumId: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",academicYearId : trackerReportFilterState.academicYearId, curriculumId, branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if(name === 'academicYearId') {
            getCurriculumApiCall({ academicYearId: value });
            setTrackerReportFilterState((prev: any) => ({ ...prev, [name]: value,curriculumId:"",classId:"" }))
            trackerReportList({ [name]: value ,curriculumId:"",classId:""})
            dispatch(resetBrchClassAct(undefined))
        }
        else if (name === 'curriculumId') {
            setTrackerReportFilterState((prev: any) => ({ ...prev, [name]: value,classId:"" }))
            trackerReportList({ [name]: value,classId:"" })
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getClassApiCall(value)
            }
        }
        else {
            setTrackerReportFilterState((prev: any) => ({ ...prev, [name]: value }))
            trackerReportList({ [name]: value })
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        trackerReportList(paginationInfo)
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { totalElements, totalPages, pageble } = admissionTrackerReportResp || {}
    const { content: classTypes } = branchClassResp || {};


    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };


    const exportExcelHndler = () => {

        const { academicYearId, curriculumId, classId, searchString } = trackerReportFilterState;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            searchString,
        };
        dispatch(admissionTrackerReportExportAct(generateActionPayload("admission_tracker_report_export", undefined, { ...payload }, {
            responseType: 'blob'
        })));
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Reports" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">

                        {/* Card Header */}
                        <div className="tw-border-b tw-px-6 tw-py-4">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                                    Admission Tracker Report
                                </h4>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="tw-p-6">

                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 xl:tw-grid-cols-5 tw-gap-4">

                                {/* Search */}
                                <div>
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="searchString"
                                            value={trackerReportFilterState.searchString}
                                            onChange={filterHandler}
                                            inputClassName="tw-bg-gray-100"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search..."
                                            labelText="Search"
                                            floatingLabel
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-2 tw-text-gray-400"></i>
                                    </div>
                                </div>

                                {/* Academic Year */}
                                <div>
                                    <SelectInput
                                        name="academicYearId"
                                        value={trackerReportFilterState.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>

                                {/* Curriculum */}
                                <div>
                                    <SelectInput
                                        name="curriculumId"
                                        value={trackerReportFilterState.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes || []}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Curriculum"
                                        floatingLabel
                                    />
                                </div>

                                {/* Class */}
                                <div>
                                    <SelectInput
                                        name="classId"
                                        value={trackerReportFilterState.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes || []}
                                        valueKey="id"
                                        textKey="shortName"
                                        labelText="Class"
                                        floatingLabel
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>

                                {/* Export Button */}
                                <div className="tw-flex tw-items-end tw-justify-end">
                                    <Button
                                        disabled={showApiLoader}
                                        onClick={toggleExportExcelModal}
                                        variant="info"
                                    >
                                        <i className="ri-add-line"></i>
                                        Export
                                    </Button>
                                </div>

                            </div>
                        </div>

                        {/* Table */}
                        <div className="tw-pb-6">
                            <TableContainer
                                columns={roleColumns || []}
                                data={admissionTrackerReportResp?.content || []}
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
            </div>
            <ModalContainerUpdated
                id="admission-tracker-report-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle={'Export Admission Tracker Report Data'}
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="admission"
                    subFeature="cbse_verification"
                    remarksText="Enter remarks to export admissin tracker report data?"
                />
            </ModalContainerUpdated>

        </>
    );
};

export default AdmissionTrackerReport;

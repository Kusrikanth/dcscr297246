
import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { DateInput, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { attendanceReportListAct, exportAttendanceReportAct, getMonthForBranchAndClassAct } from "../../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { getSectionList, resetSectionListAct, setSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { Current_Date, Current_Date_YYYYMMDD } from "../../../../utility/dateutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import StudentCountModal from "./StudentCountModal";
import { generateColumns } from "./helper";
import Button from "../../../../Components/Common/Button";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    attendanceStatus: "NOT_MARKED",
    fromDate: Current_Date_YYYYMMDD,
    toDate: Current_Date_YYYYMMDD,
};

const AttendanceReport = () => {

    const dispatch = useAppDispatch();
    const [attendanceReportListState, setAttendanceReportListState] = useState<any>(null);
    const [stuCountModalState, setStuCountModalState] = useState({
        showModal: false,
        modalData: undefined
    })

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
    })
    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    });
    const [attendanceReportFilterState, setAttendanceReportFilterState] = useState(initialValues);

    const attendanceReportList = (otherProps?: any) => {

        const payload = {
            ...attendanceReportFilterState,
            ...paginationDetailRef.current,
            ...otherProps,
            instituteId: instituteId,
            branchId,
        };
        if (payload.academicYearId && payload.curriculumId) {
            dispatch(attendanceReportListAct(generateActionPayload('attendance_report_list', undefined, payload)))
        }
    }

    const getMonthNameApiCall = (otherProps?: any) => {
        const { academicYearId, classId, curriculumId } = attendanceReportFilterState || {}
        const payload = { branchId, academicYearId, curriculumId, classId, ...otherProps }
        if (payload.academicYearId) {
            dispatch(getMonthForBranchAndClassAct(generateActionPayload('get_month_for_branch_and_class', undefined, payload)))
        }
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        stuDailyAttErrResp,
        sectionListResp,
        attendanceReportListResp,
        exportAttendanceReportResp,
        getMonthForBranchAndClassResp,
        loggedInUserRole
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            stuDailyAttErrResp: dailyAttendance.stuDailyAttErrResp,
            loggedInUserRole: appData.loggedInUserRole,
            attendanceReportListResp: dailyAttendance.attendanceReportListResp,
            exportAttendanceReportResp: dailyAttendance.exportAttendanceReportResp,
            getMonthForBranchAndClassResp: dailyAttendance.getMonthForBranchAndClassResp,
        }),
        shallowEqual
    );

    const canExport = useMemo(() => {
        return loggedInUserRole !== 'EY_PA'
    }, [loggedInUserRole]);

    const studentHolidayRef = useRef({
        prevStuDailyAttErrResp: stuDailyAttErrResp,
        prevAttendanceReportListResp: attendanceReportListResp,
        prevExportAttendanceReportResp: exportAttendanceReportResp,
    });

    useEffect(() => {
        const { prevStuDailyAttErrResp, prevAttendanceReportListResp, prevExportAttendanceReportResp } = studentHolidayRef.current;

        if (stuDailyAttErrResp && stuDailyAttErrResp !== prevStuDailyAttErrResp) {
            const { details } = stuDailyAttErrResp || {}
            toast.error(details || "Something went wrong")
        } else if (attendanceReportListResp && attendanceReportListResp !== prevAttendanceReportListResp) {
            if (!attendanceReportListResp?.statusCode) {
                const { attendanceNotMarkedResponseDTOS, markedResponseDTOS } = attendanceReportListResp || {}
                if (Array.isArray(attendanceNotMarkedResponseDTOS?.content) && attendanceNotMarkedResponseDTOS?.content?.length) {
                    setAttendanceReportListState(attendanceNotMarkedResponseDTOS)
                } else if (Array.isArray(markedResponseDTOS?.content) && markedResponseDTOS?.content?.length) {
                    setAttendanceReportListState(markedResponseDTOS)
                }
                else if (!attendanceNotMarkedResponseDTOS && !markedResponseDTOS) {
                    setAttendanceReportListState([])
                }
            } else {
                setAttendanceReportListState([])
            }
        }
        else if (exportAttendanceReportResp && exportAttendanceReportResp !== prevExportAttendanceReportResp) {
            toast.success("Attendance report exported successfully");
            toggleExportExcelModal()
            downloadExcelFile(exportAttendanceReportResp, 'Attendance_Report.xlsx')
        }

        studentHolidayRef.current.prevStuDailyAttErrResp = stuDailyAttErrResp;
        studentHolidayRef.current.prevAttendanceReportListResp = attendanceReportListResp;
        studentHolidayRef.current.prevExportAttendanceReportResp = exportAttendanceReportResp;
    }, [stuDailyAttErrResp, attendanceReportListResp, exportAttendanceReportResp]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: attendanceReportFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: attendanceReportFilterState?.academicYearId, curriculumId: attendanceReportFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        setAttendanceReportFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getCurriculumApiCall({ academicYearId: yearId })
    }, [academicYearListResp, branchId, instituteId]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            getClassApiCall({ curriculumId: data[0].branchCurriculumId })
            setAttendanceReportFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
            getMonthNameApiCall({ curriculumId: data[0].branchCurriculumId })
        }
    }, [brchCurriculumResp])

    useEffect(() => {
        if (Array.isArray(getMonthForBranchAndClassResp)) {
            attendanceReportList();
        }
    }, [getMonthForBranchAndClassResp]);

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: attendanceReportFilterState.classId || null, masterAcademicYearId: attendanceReportFilterState.academicYearId, curriculumId: attendanceReportFilterState.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    const toggleStudentCountModal = (modalData?: any, attendance?: any) => {
        setStuCountModalState((prev: any) => ({ ...prev, showModal: !prev.showModal, modalData: { ...modalData, attendance }, }))
    };

    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    const exportExcelHndler = () => {
        const payload = {
            ...attendanceReportFilterState,
            instituteId: instituteId,
            branchId,
        };
        dispatch(exportAttendanceReportAct(generateActionPayload("export_attendance_report", undefined, { ...payload }, {
            responseType: 'blob'
        })));
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value })
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetSectionListAct(undefined))
            setAttendanceReportFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", curriculumId: "", sectionId: "" }));
            attendanceReportList({ academicYearId: value, classId: "", curriculumId: "", sectionId: "" });
        }
        else if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getMonthNameApiCall({ curriculumId: value })
                getClassApiCall({ curriculumId: value, academicYearId: attendanceReportFilterState.academicYearId, });
            }
            dispatch(setSectionListAct(undefined))
            setAttendanceReportFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
        }
        else if (name === 'classId') {
            if (!value) {
                dispatch(setSectionListAct(undefined))
            } else {
                getSectionListResp({ branchClassId: value })
            }
            getMonthNameApiCall({ classId: value })
            setAttendanceReportFilterState((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))
        }
        else {
            attendanceReportList({
                ...attendanceReportFilterState,
                [name]: value,
            });
            setAttendanceReportFilterState((prev: any) => ({
                ...prev,
                [name]: value,
            }));
        }
    }

    const handleDateChange = (dateValue: any) => {
        const fromDate =
            dateValue?.fromDate ||
            dateValue?.startDate ||
            dateValue?.[0];
        const toDate =
            dateValue?.toDate ||
            dateValue?.endDate ||
            dateValue?.[1];

        if (!fromDate || !toDate) return;
        const updatedValues = {
            ...attendanceReportFilterState,
            fromDate,
            toDate,
        };
        setAttendanceReportFilterState(updatedValues);
        attendanceReportList(updatedValues);
    };
    const roleColumns = useMemo(() => {
        return generateColumns(attendanceReportFilterState, toggleStudentCountModal).map((col: any) => {
            if (col.accessor === "absentCount" || col.accessor === "presentCount" || col.accessor === "notMarkedCount" || col.accessor === "employeeName") {
                if (attendanceReportFilterState?.attendanceStatus === "NOT_MARKED") {
                    return null
                } else {
                    return col
                }
            } else {
                return col
            }
        }).filter(f => f);
    }, [attendanceReportFilterState]);

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        attendanceReportList();
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};

    const { pageNumber, totalPages, totalElements } = attendanceReportListState || {};
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb
                        title="daily attendance"
                        pageTitle="Student Attendance Reports"
                    />

                    <div className="card">
                        {/* Header */}
                        <div className="card-header">
                            <div className="tw-flex tw-items-center">
                                <h4 className="card-title tw-mb-0 tw-flex-1">
                                    Attendance Report
                                </h4>

                                {canExport && <Button
                                    className="btn"
                                    style={{ background: "#405189", border: "none" }}
                                    onClick={toggleExportExcelModal}
                                >
                                    <div className="tw-flex tw-items-center tw-text-white">
                                        <i className="ri-add-line tw-mr-1" />
                                        <span>Export</span>
                                    </div>
                                </Button>}
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="card-body">
                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-6 tw-gap-3">
                                <SelectInput
                                    name="academicYearId"
                                    value={attendanceReportFilterState.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="curriculumId"
                                    value={attendanceReportFilterState.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="classId"
                                    value={attendanceReportFilterState.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Class"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="sectionId"
                                    value={attendanceReportFilterState.sectionId}
                                    onChange={filterHandler}
                                    menuItems={sectionListResp?.data || []}
                                    valueKey="sectionId"
                                    textKey="sectionName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Section"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="attendanceStatus"
                                    value={attendanceReportFilterState.attendanceStatus}
                                    onChange={filterHandler}
                                    menuItems={[
                                        { name: "MARKED", id: "MARKED" },
                                        { name: "NOT MARKED", id: "NOT_MARKED" },
                                    ]}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Attendance Status"
                                    floatingLabel
                                />

                                <CustomDatePicker
                                    name="dateRange"
                                    startDate={attendanceReportFilterState.fromDate}
                                    endDate={attendanceReportFilterState.toDate}
                                    onChange={handleDateChange}
                                    placeholder="Select a date range"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    labelText="Date Range"
                                    floatingLabel
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <TableContainer
                            columns={roleColumns || []}
                            data={
                                Array.isArray(attendanceReportListState?.content)
                                    ? attendanceReportListState?.content
                                    : []
                            }
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="student-detail-attendance"
                isOpen={stuCountModalState.showModal}
                toggle={() => toggleStudentCountModal()}
                modalTitle="Students Details"
                modalSize="lg"
            >
                <StudentCountModal toggle={() => toggleStudentCountModal()} modalData={stuCountModalState.modalData} />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="export-student-attendance-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Students Attendance Report"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="attendance"
                    subFeature="attendance_report"
                    remarksText="Enter remarks to export students attendance report?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default AttendanceReport;

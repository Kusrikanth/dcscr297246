
import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { ModalContainerUpdated, MultiSelectCheckbox, SelectInput, TableExpandable } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { exportTotalWorkingDaysReportAct, totalWorkingDaysReportListAct } from "../../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { Current_Date_YYYYMMDD } from "../../../../utility/dateutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { generateColumns, renderOptionsStudent, renderValueStudent } from "./helper";
import Button from "../../../../Components/Common/Button";
import { useFormik } from "formik";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import { useModal } from "../../../../hooks/modalhook";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classIds: [],
    fromDate: Current_Date_YYYYMMDD,
    toDate: Current_Date_YYYYMMDD,
};

const NoofWorkingDaysHolidays = () => {

    const dispatch = useAppDispatch();
    const [tableDataState, setTableDataState] = useState([]);
    const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

    const addAcademicTermDetailsFormik = useFormik({
        initialValues,
        enableReinitialize: true,
        onSubmit: (values) => {
        },
    });

    const selectedClassIds = useMemo(() => {
        return addAcademicTermDetailsFormik.values.classIds
            .map((item: any) => item.id)
            .join(",");
    }, [addAcademicTermDetailsFormik.values.classIds]);

    const totalHolidaysWorkingDaysReportList = (updatedValues?: any) => {
        const values = updatedValues || addAcademicTermDetailsFormik.values;

        const payload = {
            ...values,
            curriculumId: values.curriculumId || "",
            classIds: Array.isArray(values.classIds)
                ? values.classIds.map((item: any) => item.id).join(",")
                : "",
            instituteId,
            branchId,
        };
        if (payload.academicYearId && payload.instituteId && payload.branchId) {
            dispatch(
                totalWorkingDaysReportListAct(
                    generateActionPayload(
                        "total_working_days_report",
                        undefined,
                        payload
                    )
                )
            );
        }
    };

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        stuDailyAttErrResp,
        totalWorkingDaysReportListResp,
        exportTotalWorkingDaysReportResp,
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            stuDailyAttErrResp: dailyAttendance.stuDailyAttErrResp,
            totalWorkingDaysReportListResp: dailyAttendance.totalWorkingDaysReportListResp,
            exportTotalWorkingDaysReportResp: dailyAttendance.exportTotalWorkingDaysReportResp,
        }),
        shallowEqual
    );

    const studentHolidayRef = useRef({
        prevStuDailyAttErrResp: stuDailyAttErrResp,
        prevExportTotalWorkingDaysReportResp: exportTotalWorkingDaysReportResp,
    });

    useEffect(() => {
        const { prevStuDailyAttErrResp, prevExportTotalWorkingDaysReportResp } = studentHolidayRef.current;

        if (exportTotalWorkingDaysReportResp && exportTotalWorkingDaysReportResp !== prevExportTotalWorkingDaysReportResp) {
            toast.success("Total working days report exported successfully");
            closeExportModal();
            downloadExcelFile(exportTotalWorkingDaysReportResp, 'Total_Working/holidays_Days_Report.xlsx')
        } else if (stuDailyAttErrResp && stuDailyAttErrResp !== prevStuDailyAttErrResp) {
            const { details } = stuDailyAttErrResp || {}
            toast.error(details || "Something went wrong");
        }

        studentHolidayRef.current.prevStuDailyAttErrResp = stuDailyAttErrResp;
        studentHolidayRef.current.prevExportTotalWorkingDaysReportResp = exportTotalWorkingDaysReportResp;
    }, [stuDailyAttErrResp, exportTotalWorkingDaysReportResp]);

    useEffect(() => {
        if (
            Array.isArray(totalWorkingDaysReportListResp) &&
            totalWorkingDaysReportListResp.length > 0
        ) {
            const modifiedData: any = totalWorkingDaysReportListResp.reduce(
                (acc: any[], curr: any) => {

                    let curriculum = acc.find(
                        (x: any) => x.curriculumId === curr.curriculumId
                    );

                    if (!curriculum) {
                        curriculum = {
                            curriculumId: curr.curriculumId,
                            curriculumName: curr.curriculumName,
                            totalWorkingDays: curr.totalWorkingDays,
                            totalHolidays: curr.totalHolidays,
                            subRows: [],
                        };

                        acc.push(curriculum);
                    }


                    let classObj = curriculum.subRows.find(
                        (x: any) => x.classId === curr.classId
                    );

                    if (!classObj) {
                        classObj = {
                            classId: curr.classId,
                            className: curr.className,
                            totalWorkingDays: curr.totalWorkingDays,
                            totalHolidays: curr.totalHolidays,
                            subRows: [],
                        };

                        curriculum.subRows.push(classObj);
                    }

                    classObj.subRows.push({
                        sectionId: curr.sectionId,
                        sectionName: curr.sectionName,
                        totalWorkingDays:
                            curr.totalWorkingDays || 0,
                        totalHolidays:
                            curr.totalHolidays || 0,
                    });

                    return acc;
                },
                []
            );

            setTableDataState(modifiedData);
        } else {
            setTableDataState([]);
        }
    }, [totalWorkingDaysReportListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0) {
            addAcademicTermDetailsFormik.setFieldValue(
                "curriculumId",
                data[0].branchCurriculumId
            );
        }
    }, [brchCurriculumResp]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: addAcademicTermDetailsFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: addAcademicTermDetailsFormik.values?.academicYearId, curriculumId: addAcademicTermDetailsFormik.values?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        let yearId =
            academicYearListResp &&
            academicYearListResp.data.find(
                (year: any) =>
                    year.yearStatus.toLowerCase() === "current"
            )?.academicYearId;

        addAcademicTermDetailsFormik.setFieldValue(
            "academicYearId",
            yearId
        );

        getCurriculumApiCall({ academicYearId: yearId });
    }, [academicYearListResp, branchId, instituteId]);

    useEffect(() => {
        const { curriculumId } =
            addAcademicTermDetailsFormik.values;

        if (curriculumId) {
            getClassApiCall({
                curriculumId,
            });

            addAcademicTermDetailsFormik.setFieldValue(
                "classIds",
                []
            );
        }
    }, [addAcademicTermDetailsFormik.values.curriculumId]);

    useEffect(() => {
        if (
            addAcademicTermDetailsFormik.values.academicYearId &&
            instituteId &&
            branchId
        ) {
            totalHolidaysWorkingDaysReportList();
        }
    }, [
        addAcademicTermDetailsFormik.values.academicYearId,
        addAcademicTermDetailsFormik.values.curriculumId,
        selectedClassIds,
        addAcademicTermDetailsFormik.values.fromDate,
        addAcademicTermDetailsFormik.values.toDate,
        instituteId,
        branchId,
    ]);

    const exportExcelHndler = () => {
        const payload = {
            ...addAcademicTermDetailsFormik.values,
            classIds: addAcademicTermDetailsFormik.values.classIds
                .map((item: any) => item.id)
                .join(","),
            instituteId,
            branchId,
        };
        dispatch(exportTotalWorkingDaysReportAct(generateActionPayload("export_total_working_days_report", undefined, { ...payload }, {
            responseType: 'blob'
        })));
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            addAcademicTermDetailsFormik.setValues({
                academicYearId: value,
                curriculumId: "",
                classIds: [],
                fromDate: addAcademicTermDetailsFormik.values.fromDate,
                toDate: addAcademicTermDetailsFormik.values.toDate,
            });
            getCurriculumApiCall({ academicYearId: value });
        } else if (name === "curriculumId") {
            addAcademicTermDetailsFormik.setValues((prev) => ({
                ...prev,
                curriculumId: value,
                classIds: [],
            }));
            if (value) {
                getClassApiCall({
                    curriculumId: value,
                });
            } else {
                dispatch(resetBrchClassAct(undefined));
                setTableDataState([]);
            }
        } else {
            addAcademicTermDetailsFormik.setFieldValue(name, value);
        }
    };

    function selectStudentHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        const updatedClasses = Array.isArray(selectedOptions)
            ? selectedOptions
            : [];

        addAcademicTermDetailsFormik.setFieldValue(name, updatedClasses);
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
            ...addAcademicTermDetailsFormik.values,
            fromDate,
            toDate,
        };
        addAcademicTermDetailsFormik.setValues(updatedValues);
        totalHolidaysWorkingDaysReportList(updatedValues);
    };

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const tableColumns = useMemo(() => generateColumns(), [totalWorkingDaysReportListResp]);

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb
                        title="daily attendance"
                        pageTitle="Total Working/Holidays"
                    />
                    <div className="card">
                        <div className="card-header">
                            <div className="tw-flex tw-items-center">
                                <h4 className="card-title tw-mb-0 tw-flex-1">
                                    Total Working/Holidays
                                </h4>

                                <Button
                                    className="btn"
                                    style={{ background: "#405189", border: "none" }}
                                    onClick={openExportModal}
                                >
                                    <div className="tw-flex tw-items-center tw-text-white">
                                        <i className="ri-add-line tw-mr-1" />
                                        <span>Export</span>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="card-body">
                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-6 tw-gap-3">
                                <SelectInput
                                    name="academicYearId"
                                    value={addAcademicTermDetailsFormik.values.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="curriculumId"
                                    value={addAcademicTermDetailsFormik.values.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                />

                                <MultiSelectCheckbox
                                    name="classIds"
                                    labelText="Class"
                                    containerClassName="mb-0"
                                    idKey="id"
                                    value={addAcademicTermDetailsFormik.values.classIds}
                                    renderValue={renderValueStudent}
                                    renderOptions={renderOptionsStudent}
                                    onChange={selectStudentHndlr}
                                    searchKey="shortName"
                                    options={classTypes || []}
                                    floatingLabel
                                />
                                <CustomDatePicker
                                    name="dateRange"
                                    startDate={addAcademicTermDetailsFormik.values.fromDate}
                                    endDate={addAcademicTermDetailsFormik.values.toDate}
                                    onChange={handleDateChange}
                                    placeholder="Select a date range"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    labelText="Date Range"
                                    floatingLabel
                                />
                            </div>
                        </div>
                        <TableExpandable
                            columns={tableColumns}
                            data={tableDataState}
                            divClass="table-responsive"
                            theadClass="theadPrimary"
                            tableClass="table-bordered table-nowrap"
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="export-total-working-holidays-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModal}
                modalTitle="Export Total Working/holidays"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="attendance"
                    subFeature={"total_working_days_report"}
                    remarksText="Enter remarks to export Total Working/holidays?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default NoofWorkingDaysHolidays;

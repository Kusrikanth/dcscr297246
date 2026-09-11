
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InputCheckbox, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { AbsentMark, HolidayMark, PresentMark, calculateWorkingDays, exportAttendanceToExcel, formatAcademicYearDates, generateColumns } from "./helper";
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { Current_Month_UpperCase, Current_Year, getDatesForMonth } from "../../../utility/dateutility";
import { dateRangeDailyAttAct, getMonthWiseAttListAct, updateMonthWiseAttListAct } from "../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { format, getMonth } from "date-fns";
import { getAttendanceHolidayDetailsListAct } from "../../../store/StudentAttendance/HolidayDetails/holidaydetailsaction";
import AddMonthWiseAttendance from "./AddMonthWiseAttendance";
import TrackAttendanceModal from "./TrackAttendanceModal";
import { nanoid } from "nanoid";
import * as yup from 'yup';
import { useFormik } from "formik";
import { ModalContainerUpdated } from "../../../Components/Common";
import { useModal } from "../../../hooks/modalhook";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import Button from "../../../Components/Common/Button";

const validationSchema = yup.object().shape({
    searchString: yup.string(),
    academicYearId: yup.string().required('Academic Year is required'),
    curriculumId: yup.string().required('Curriculum is required'),
    classId: yup.string().required('Class is required'),
    sectionId: yup.string().required('Section is required'),
    month: yup.string().required('Month is required'),
});


const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    monthYear: "",
    selectedMonth: "",
    selectedYear: "",
    month: "",
    startDate: "",
    endDate: "",
    dateList: [],
};

const StudentConcessions = () => {

    const dispatch = useAppDispatch();

    // const pagination = useRef({
    //     pageNo: 0,
    //     pageSize: 10
    // })
    const { closeModal: closeExportSectionModalHnldr,
        openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();
    const [attendanceData, setAttendanceData] = useState(false);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [monthlyAttList, setMonthlyAttList] = useState<Array<any>>([]);
    const { modalState: trackAttendanceModalState, openModal: openTrackAttendanceModal, closeModal: closeTrackAttendanceModal } = useModal();

    const studentAttendanceListApi = (otherProps?: any) => {
        const { academicYearId, curriculumId, selectedMonth, selectedYear, classId, sectionId } = filterForm.values || {};

        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId: classId,
            sectionId,
            searchString: "",
            month: selectedMonth,
            year: selectedYear,
            // ...pagination.current,
            ...otherProps,
        };

        payload.month = payload?.month?.toUpperCase();

        if (payload.academicYearId && payload.curriculumId && payload.classId && payload.sectionId) {
            dispatch(getMonthWiseAttListAct(generateActionPayload("get_monthly_attendance", undefined, payload)));
        }

        let payload1 = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            classId: classId,
            monthName: selectedMonth,
            ...otherProps,
        };

        payload1.monthName = payload1?.month ? payload1?.month?.toUpperCase() : payload1?.monthName?.toUpperCase()
        delete payload1.month
        if (payload1.academicYearId && payload1.curriculumId && payload1.classId && payload1.monthName) {
            dispatch(getAttendanceHolidayDetailsListAct(generateActionPayload('get_holiday_details_list', undefined, payload1)));
        }
    };

    const fetchDateRangeApi = (otherProps?: any) => {
        const { academicYearId, curriculumId, classId } = filterForm.values || {};
        const params = {
            academicYearId, curriculumId, classId, branchId, ...otherProps
        }

        if (params.academicYearId && params.curriculumId && params.classId) {
            dispatch(dateRangeDailyAttAct(generateActionPayload("date_range_stu_att", undefined, params)));
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
        getMonthWiseAttListResp,
        getAttendanceHolidayDetailsListResp,
        updateMonthWiseAttListResp,
        loggedInUserRole,
        dateRangeDailyAttResp,
        saveTriggerAttendanceResp,
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, feeCollections, dailyAttendance, holidayDetails }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getAllChangeStudentsListActResp: applicationSale.getAllChangeStudentsListActResp,
            saveChangeStudentDetailsResp: applicationSale.saveChangeStudentDetailsResp,
            applicationSaleError: applicationSale.applicationSaleError,
            showApiLoader: globalData.showApiLoader,
            exportChangeStudentListResp: applicationSale.exportChangeStudentListResp,
            sendNotifiChangeStuDetailResp: applicationSale.sendNotifiChangeStuDetailResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            getMonthWiseAttListResp: dailyAttendance.getMonthWiseAttListResp,
            stuDailyAttErrResp: dailyAttendance.stuDailyAttErrResp,
            updateMonthWiseAttListResp: dailyAttendance.updateMonthWiseAttListResp,
            dateRangeDailyAttResp: dailyAttendance.dateRangeDailyAttResp,
            loggedInUserRole: appData.loggedInUserRole,
            getAttendanceHolidayDetailsListResp: holidayDetails.getAttendanceHolidayDetailsListResp,
            saveTriggerAttendanceResp: dailyAttendance.saveTriggerAttendanceResp,
        }),
        shallowEqual
    );

    const dailyAttendanceRef = useRef<any>({
        prevStuDailyAttErrResp: stuDailyAttErrResp,
        prevUpdateMonthWiseAttListResp: updateMonthWiseAttListResp,
        prevSaveTriggerAttendanceResp: saveTriggerAttendanceResp,
    });
    const filterForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {

        }
    })

    useEffect(() => {
        const { prevStuDailyAttErrResp, prevUpdateMonthWiseAttListResp, prevSaveTriggerAttendanceResp } = dailyAttendanceRef.current;

        if (stuDailyAttErrResp && stuDailyAttErrResp !== prevStuDailyAttErrResp) {
            const { details } = stuDailyAttErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (updateMonthWiseAttListResp && updateMonthWiseAttListResp !== prevUpdateMonthWiseAttListResp) {
            toast.success("Attendance updated successfully.")
            setAttendanceData(false)
            studentAttendanceListApi()
        }
        else if (saveTriggerAttendanceResp && saveTriggerAttendanceResp !== prevSaveTriggerAttendanceResp) {
            toast.success("Attendance triggered successfully.")
            closeTrackAttendanceModal()
            studentAttendanceListApi()
        }

        dailyAttendanceRef.current.prevStuDailyAttErrResp = stuDailyAttErrResp;
        dailyAttendanceRef.current.prevUpdateMonthWiseAttListResp = updateMonthWiseAttListResp;
        dailyAttendanceRef.current.prevSaveTriggerAttendanceResp = saveTriggerAttendanceResp;
    }, [updateMonthWiseAttListResp, stuDailyAttErrResp, saveTriggerAttendanceResp]);

    const canCreateAndUpdate = useMemo(() => {
        return (loggedInUserRole !== 'EXAMINATION');
    }, [loggedInUserRole]);


    const roleColumns = useMemo(() => generateColumns(filterForm.values.selectedMonth, filterForm.values.selectedYear, filterForm.values.startDate, filterForm.values.endDate), [filterForm.values.selectedMonth, filterForm.values.selectedYear, filterForm.values.startDate, filterForm.values.endDate]);

    const memoizedHolidayDetailsList = useMemo(() => getAttendanceHolidayDetailsListResp, [getAttendanceHolidayDetailsListResp]);

    const totalWorkingDays = useMemo(() => {
        return calculateWorkingDays(
            filterForm.values.selectedMonth,
            filterForm.values.selectedYear,
            memoizedHolidayDetailsList,
            filterForm.values.startDate,
            filterForm.values.endDate,
        );
    }, [filterForm.values.selectedMonth, filterForm.values.selectedYear, memoizedHolidayDetailsList, filterForm.values.startDate, filterForm.values.endDate]);

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }


    useEffect(() => {
        if (academicYearListResp) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            filterForm.setFieldValue("academicYearId", yearId);
            getCurriculumApiCall({ academicYearId: yearId });
        }
    }, [academicYearListResp, branchId, instituteId]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0 && filterForm.values.academicYearId) {
            const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, academicYearId: filterForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            filterForm.setFieldValue("curriculumId", data[0].branchCurriculumId);
        }
    }, [brchCurriculumResp])

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            filterForm.setValues((prev: any) => ({ ...prev, classId: content[0].id }))
            fetchDateRangeApi({ classId: content[0].id })
            getSectionListResp({ branchClassId: content[0]?.id });
        }
    }, [branchClassResp])

    useEffect(() => {
        const { data } = sectionListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            filterForm.setValues((prev: any) => ({ ...prev, sectionId: data[0]?.sectionId }))
            studentAttendanceListApi({ sectionId: data[0]?.sectionId });
        }
    }, [sectionListResp])

    useEffect(() => {
        if (Array.isArray(dateRangeDailyAttResp?.content) && dateRangeDailyAttResp?.content?.length > 0) {
            const selectedData = dateRangeDailyAttResp?.content[0]

            let yearId: any = selectedData?.academicYearId
            let year: any = selectedData?.startDate?.split("-")[0]
            const startDate: string = selectedData?.startDate;
            const endDate: string = selectedData?.endDate;

            const dateList = getDatesForMonth(+year, getMonth(new Date()) + 1)
            const monthList = formatAcademicYearDates(dateRangeDailyAttResp?.content, yearId)

            const newList = monthList?.find(({ id }: any) => {
                const month = id?.split("-")[0]?.toUpperCase();
                const year = id?.split("-")[1];
                return month === Current_Month_UpperCase && +year === +Current_Year
            });

            filterForm.setValues((prev: any) => ({ ...prev, dateList, month: newList?.id, selectedMonth: Current_Month_UpperCase, selectedYear: Current_Year, startDate, endDate }));
        }
        else if (Array.isArray(dateRangeDailyAttResp?.content) && dateRangeDailyAttResp?.content?.length === 0) {
            toast.warning("There no date range for given class , Kindly add through settings")
            filterForm.setValues((prev: any) => ({ ...prev, dateList: [], startDate: "", endDate: "" }));
        }

    }, [dateRangeDailyAttResp]);

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...monthlyAttList];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setMonthlyAttList(updateStudentState);
    }, [monthlyAttList]);

    const singleStudentCheckHndlr = useCallback((event: any) => {

        const { checked } = event.currentTarget,
            studentId = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = monthlyAttList.findIndex((item: any) => +item.studentId === Number(studentId));
        if (studentRowIndex > -1) {
            const studentDetails: any = monthlyAttList[studentRowIndex];
            let updateStudentState: any = [...monthlyAttList];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setMonthlyAttList(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [monthlyAttList]);

    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: filterForm.values.classId || null, masterAcademicYearId: filterForm.values.academicYearId, curriculumId: filterForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        // pagination.current.pageNo = 0;
        if (name === 'academicYearId' || name === 'classId' || name === "sectionId") {

            if (!value) {
                filterForm.setFieldValue(name, "")
                return
            }
            if (name === "academicYearId") {
                getCurriculumApiCall({ academicYearId: value });
            }
            else if (name === "classId") {
                getSectionListResp({ branchClassId: value })
                fetchDateRangeApi({ classId: value })
            }
            else {
                studentAttendanceListApi({ [name]: value })
            }
            setAttendanceData(false)
            filterForm.setFieldValue(name, value)
        }
        else if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, academicYearId: filterForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
                filterForm.setFieldValue("curriculumId", "")
                return
            }
            else {
                filterForm.setFieldValue(name, value)
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            setAttendanceData(false)
        }
        else if (name === 'month') {
            if (!value) {
                filterForm.setFieldValue("month", "")
                return
            }
            else {
                const [month, year] = value.split('-');
                filterForm.setValues(prev => ({ ...prev, monthYear: value, selectedMonth: month, selectedYear: year }));
                filterForm.setFieldValue("month", value);
                studentAttendanceListApi({ month, year });
            }
            setAttendanceData(false)
        }
        else {
            filterForm.setFieldValue(name, value)
            setAttendanceData(false)
            studentAttendanceListApi({ [name]: value })
        }
    }


    function paginationHndlr(paginationInfo: IPaginationState) {
        // pagination.current = paginationInfo;
        studentAttendanceListApi(paginationInfo)
    }

    useEffect(() => {
        if (getMonthWiseAttListResp && Array.isArray(getMonthWiseAttListResp.content) && getMonthWiseAttListResp.content.length > 0) {

            setMonthlyAttList(getMonthWiseAttListResp.content.map((item: any) => ({
                ...item,
                dateWiseAttendanceRecords: item.dateWiseAttendanceRecords.map((record: any) => ({
                    ...record,
                    isSelected: record.attendance === 'PRESENT' ? true : false,
                    matchId: nanoid(),
                    isMarked: record.attendance === 'PRESENT' ? 'P' : 'A'
                }))

            })))
        }
    }, [getMonthWiseAttListResp])


    const monthList = useMemo(() => formatAcademicYearDates(dateRangeDailyAttResp?.content, filterForm.values.academicYearId), [dateRangeDailyAttResp, filterForm.values.academicYearId])

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    // const { content: studentResp, totalElements, totalPages, pageble } = getMonthWiseAttListResp || {}
    const { content: classTypes } = branchClassResp || {};


    const markAttendanceHndlr = () => {
        setAttendanceData(true);
        studentAttendanceListApi({ pageNo: 0, pageSize: 100 })

    }

    const onChangeInputHndlr = (studentId: any, matchId: string, selectedDate: any, isSelected: boolean) => {
        let updateStudentState = [...monthlyAttList];


        updateStudentState = updateStudentState.map((student) => {
            if (student.studentId === studentId) {
                let recordFound = false;
                student.dateWiseAttendanceRecords = student.dateWiseAttendanceRecords.map((record: any) => {
                    const attendanceDate = format(new Date(record.attendanceDate), 'yyyy-MM-dd');
                    if (attendanceDate === selectedDate && record.matchId === matchId) {
                        recordFound = true;
                        return {
                            ...record,
                            attendance: isSelected ? "PRESENT" : "ABSENT",
                            isSelected: isSelected,
                        };
                    }
                    return record;
                })
                if (!recordFound) {
                    student.dateWiseAttendanceRecords.push({
                        attendance: isSelected ? "PRESENT" : "ABSENT",
                        attendanceDate: selectedDate,
                        day: format(new Date(selectedDate), 'EEEE').toUpperCase(),
                        isSelected: isSelected,
                        matchId: matchId,
                    });
                }
            }
            return student;
        });


        setMonthlyAttList(updateStudentState);
    }

    const addStuMonthWiseAttendanceHndler = () => {

        const attendanceSaveDTOS = monthlyAttList?.filter(student => student.isSelected)?.map((student: any) => {
            const lastAttendedDate = student?.lastAttendedDate
                ? new Date(format(new Date(student.lastAttendedDate), 'yyyy-MM-dd'))
                : null;

            const monthWiseSaveDTOS = student?.dateWiseAttendanceRecords
                ?.filter((record: any) => {
                    if (!lastAttendedDate) return true;

                    const recordDate = new Date(
                        format(new Date(record.attendanceDate), 'yyyy-MM-dd')
                    );

                    return recordDate <= lastAttendedDate;
                })
                ?.map((record: any) => {
                    const isUpdate = (record.attendance === 'PRESENT' && record.isMarked === 'A') ||
                        (record.attendance === 'ABSENT' && record.isMarked === 'P');

                    const baseRecord = {
                        date: format(new Date(record.attendanceDate), 'yyyy-MM-dd'),
                        attendanceStatus: record.attendance || "ABSENT",
                        isUpdate: isUpdate || false,
                    };

                    if (record.monthWiseChildId) {
                        return {
                            ...baseRecord,
                            monthWiseChildId: record.monthWiseChildId,
                        };
                    }

                    return baseRecord;
                });

            return {
                id: student.id,
                studentId: student.studentId,
                monthWiseSaveDTOS,
            };
        });

        const attendancePayload = {
            branchId: branchId,
            academicYearId: filterForm.values.academicYearId,
            curriculumId: filterForm.values.curriculumId,
            month: filterForm.values.selectedMonth,
            year: filterForm.values.selectedYear,
            classId: filterForm.values.classId,
            sectionId: filterForm.values.sectionId,
            attendanceSaveDTOS: attendanceSaveDTOS
        };


        if (attendanceSaveDTOS.length > 0) {
            dispatch(updateMonthWiseAttListAct(generateActionPayload("update_monthly_attendance", undefined, attendancePayload)));
        }
        else {
            toast.warning("Please select atleast one student");
        }
    };


    const handalCancel = () => {
        setAttendanceData(false);
        studentAttendanceListApi()
    }

    const handleExportToExcel = () => {
        if (!getMonthWiseAttListResp?.content || getMonthWiseAttListResp.content.length === 0) {
            toast.warning("No data to export");
            return;
        }

        exportAttendanceToExcel(
            getMonthWiseAttListResp.content,
            filterForm.values.selectedMonth,
            filterForm.values.selectedYear,
            getAttendanceHolidayDetailsListResp,
            filterForm.values.startDate,
            filterForm.values.endDate
        );
        closeExportSectionModalHnldr();
    };



    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="daily attendance" pageTitle="Student Attendance" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        {/* Header */}
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Month Wise Attendance
                                </h4>

                                <div className="tw-ml-auto tw-flex tw-gap-2">
                                    {canCreateAndUpdate && !attendanceData && (
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() => markAttendanceHndlr()}
                                        >
                                            Mark Attendance
                                        </Button>
                                    )}
                                    {!attendanceData && <Button
                                        type="button"
                                        variant="primary"
                                        onClick={openTrackAttendanceModal}
                                    >
                                        Trigger Attendance
                                    </Button>}
                                    {!attendanceData && <Button id="export-btn" variant="exportBtn"
                                        onClick={openExportSectionModalHnldr}
                                    >
                                        <img src={ExportIcon} className="img-fluid h-100" />
                                        <UncontrolledTooltip placement="bottom" target="export-btn">
                                            Export
                                        </UncontrolledTooltip>
                                    </Button>}
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="tw-p-4">
                            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2
                        lg:tw-grid-cols-7 tw-gap-3">

                                <div className="tw-relative search-box">
                                    <TextInput
                                        name="searchString"
                                        value={filterForm.values.searchString}
                                        onChange={filterHandler}
                                        inputClassName="tw-bg-slate-100"
                                        formgroupClassName="tw-mb-0"
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-slate-400"></i>
                                </div>

                                <SelectInput
                                    name="academicYearId"
                                    value={filterForm.values.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="tw-mb-0"
                                    onBlur={filterForm.handleBlur}
                                    invalid={!!(filterForm.touched.academicYearId && filterForm.errors.academicYearId)}
                                    error={filterForm.touched.academicYearId && filterForm.errors.academicYearId}
                                    labelText="Academic Year"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="curriculumId"
                                    value={filterForm.values.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="tw-mb-0"
                                    onBlur={filterForm.handleBlur}
                                    invalid={!!(filterForm.touched.curriculumId && filterForm.errors.curriculumId)}
                                    error={filterForm.touched.curriculumId && filterForm.errors.curriculumId}
                                    labelText="Curriculum"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="classId"
                                    value={filterForm.values.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="tw-mb-0"
                                    onBlur={filterForm.handleBlur}
                                    invalid={!!(filterForm.touched.classId && filterForm.errors.classId)}
                                    error={filterForm.touched.classId && filterForm.errors.classId}
                                    labelText="Class"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="sectionId"
                                    value={filterForm.values.sectionId}
                                    onChange={filterHandler}
                                    menuItems={sectionListResp?.data || []}
                                    valueKey="sectionId"
                                    textKey="sectionName"
                                    formgroupClassName="tw-mb-0"
                                    onBlur={filterForm.handleBlur}
                                    invalid={!!(filterForm.touched.sectionId && filterForm.errors.sectionId)}
                                    error={filterForm.touched.sectionId && filterForm.errors.sectionId}
                                    labelText="Section"
                                    floatingLabel
                                />

                                <SelectInput
                                    name="month"
                                    value={filterForm.values.month}
                                    onChange={filterHandler}
                                    menuItems={monthList || []}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    onBlur={filterForm.handleBlur}
                                    invalid={!!(filterForm.touched.month && filterForm.errors.month)}
                                    error={filterForm.touched.month && filterForm.errors.month}
                                    labelText="Month"
                                    floatingLabel
                                />
                            </div>

                            {/* Legend + Summary */}
                            <div className="tw-mt-4 tw-flex tw-flex-wrap tw-items-center tw-gap-4">
                                <div className="tw-flex tw-gap-4">
                                    {!attendanceData ? (
                                        <>
                                            <div className="tw-flex tw-items-center">
                                                <PresentMark /> <span className="tw-ml-2">Present</span>
                                            </div>
                                            <div className="tw-flex tw-items-center">
                                                <AbsentMark /> <span className="tw-ml-2">Absent</span>
                                            </div>
                                            <div className="tw-flex tw-items-center">
                                                <HolidayMark /> <span className="tw-ml-2">Holiday</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="tw-flex tw-items-center">
                                                <InputCheckbox name="present" value={true} />
                                                <span className="tw-ml-2">Present</span>
                                            </div>
                                            <div className="tw-flex tw-items-center">
                                                <InputCheckbox name="absent" value={false} />
                                                <span className="tw-ml-2">Absent</span>
                                            </div>
                                            <div className="tw-flex tw-items-center">
                                                <HolidayMark /> <span className="tw-ml-2">Holiday</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="tw-ml-auto tw-flex tw-gap-4">
                                    <div>
                                        No of Working Days :
                                        <b className="tw-text-success tw-ml-1">
                                            {totalWorkingDays.workingDays || 0}
                                        </b>
                                    </div>
                                    <div>
                                        Holidays :
                                        <b className="tw-text-danger tw-ml-1">
                                            {totalWorkingDays.holidays || 0}
                                        </b>
                                    </div>
                                </div>
                            </div>

                            {attendanceData && (
                                <small className="tw-text-gray-500 tw-block tw-mt-2">
                                    <b>Note :</b> If no checkboxes are selected, the student will be marked as absent.
                                </small>
                            )}
                        </div>

                        {/* Table / Form */}
                        {attendanceData ? (
                            <AddMonthWiseAttendance
                                selectedMonth={filterForm.values.selectedMonth}
                                selectedYear={filterForm.values.selectedYear}
                                startDate={filterForm.values.startDate}
                                endDate={filterForm.values.endDate}
                                onChangeInputHndlr={onChangeInputHndlr}
                                data={monthlyAttList}
                                allStudentCheckHndlr={allStudentCheckHndlr}
                                singleStudentCheckHndlr={singleStudentCheckHndlr}
                                allStudentSelectedState={allStudentSelectedState}
                            />
                        ) : (
                            <TableContainer
                                columns={roleColumns || []}
                                data={Array.isArray(getMonthWiseAttListResp?.content) ? getMonthWiseAttListResp?.content : []}
                                divClass="tw-overflow-x-auto tw-mb-3"
                                theadClass="tw-bg-gray-100 tw-text-gray-500"
                                // showCheckbox={true}
                                showPagination={false}
                                // totalPages={totalPages || 0}
                                // totalRecords={totalElements || 0}
                                // callbackPaginationHndlr={paginationHndlr}
                                // currentPageNumber={pageble?.pageNumber || 0}
                                rowDataInfo={memoizedHolidayDetailsList}
                            />
                        )}

                        {/* Footer Buttons */}
                        {attendanceData && (
                            <div className="tw-flex tw-justify-end tw-gap-2 tw-p-4">
                                <Button
                                    variant="secondary"
                                    type="button"

                                    onClick={handalCancel}
                                    disabled={showApiLoader}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={addStuMonthWiseAttendanceHndler}
                                    disabled={showApiLoader}
                                >
                                    Submit
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="track-attendance-modal"
                isOpen={trackAttendanceModalState.showModal}
                toggle={closeTrackAttendanceModal}
                modalTitle="Update Month Attendance"
                modalSize="md"
            >
                <TrackAttendanceModal toggle={closeTrackAttendanceModal} modalData={filterForm.values} />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="export-attendance-modal"
                isOpen={exportSectionModalState.showModal}
                toggle={closeExportSectionModalHnldr}
                modalTitle="Export Monthly Attendance"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportSectionModalState.showModal}
                    toggle={closeExportSectionModalHnldr}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={handleExportToExcel}
                    feature="attendance"
                    subFeature="month_attendance"
                    remarksText="Enter remarks to export attendance?"
                />
            </ModalContainerUpdated>

        </>
    );
};

export default StudentConcessions;

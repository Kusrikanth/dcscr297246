import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useFormik, } from "formik";
import { DateInput, SelectInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import * as Yup from 'yup';
import { getAssignCurriculumListAct, getAssignLanClassListAct, getAssignLanSectionListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { addStuAttGenerateColumns, checkWithinTheRange, computeSubmitButtonError, isDateNotValid } from "./helper";
import { resetAssignLanClassListAct, resetAssignLanSectionListAct } from "../../../store/assignlanguages/assignlanguagesslice";
import { toast } from "react-toastify";
import { addStuDailyAttListAct, dateRangeDailyAttAct, updateStuDailyAttListAct } from "../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { resetAddStuDailyAttListAct } from "../../../store/StudentAttendance/DailyAttendance/dailyattendanceslice";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";
import { format, isSunday, parse } from "date-fns";
import { getHolidayDetailsListAct } from "../../../store/StudentAttendance/HolidayDetails/holidaydetailsaction";
import Button from "../../../Components/Common/Button";


const initialValues: any = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    minDate: "",
    maxDate: "",
    date: "",
    holidayDates : [],
    isPresent: null,
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required('Academic Year is required'),
    curriculumId: Yup.string().required('Curriculum is required'),
    classId: Yup.string().required('Class is required'),
    sectionId: Yup.string().required('Section is required'),
    date: Yup.string().test(
        'is-files-required',
        'Date is invalid',
        function (value) {
            const { createError, parent } = this;

            if (!value) {
                return createError({ message: 'Date is required' });
            }
            if (!checkWithinTheRange(value, parent.minDate, parent.maxDate)) {
                return createError({ message: 'Date should be between min and max date' });
            }
            if (isDateNotValid(value)) {
                return createError({ message: 'Date Cannot be future date' });
            }
            if (isSunday(parse(value, 'yyyy-MM-dd', new Date()))) {
                return createError({ message: 'Sundays are not allowed' });
            }
            if(parent.holidayDates.includes(value)){
                return createError({ message: 'This Date is Holiday' });
            }
            return true;
        }
    ),
})


const AddDailyAttendanceModal: React.FC<any> = (props) => {

    const { modalData } = props || {};
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

    const [studentList, setStudentList] = useState<any>([]);

    const dispatch = useDispatch();

    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        secoundLanguageResp,
        assignLanguagesErrResp,
        getAssignLanSectionListResp,
        getThirdLanForChangeStudentResp,
        getStuLanguagesListResp,
        getAssignLanClassListResp,
        addStuDailyAttListResp,
        dateRangeDailyAttResp,
        getHolidayDetailsListResp,
        loggedInUserRole,
        userMeResp,
        getAssignListCurriculumResp
    } = useAppSelector(
        ({ applicationSale, globalData, instAcademics, branchAcademics, appData, assignLanguages, dailyAttendance, login, holidayDetails, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            secoundLanguageResp: applicationSale.secoundLanguageResp,
            assignLanguagesErrResp: assignLanguages.assignLanguagesErrResp,
            getStuLanguagesListResp: assignLanguages.getStuLanguagesListResp,
            getThirdLanForChangeStudentResp: applicationSale.getThirdLanForChangeStudentResp,
            getAssignLanSectionListResp: assignLanguages.getAssignLanSectionListResp,
            getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
            addStuDailyAttListResp: dailyAttendance.addStuDailyAttListResp,
            loggedInUserRole: appData.loggedInUserRole,
            dateRangeDailyAttResp: dailyAttendance.dateRangeDailyAttResp,
            getHolidayDetailsListResp: holidayDetails.getHolidayDetailsListResp,
            userMeResp: login.userMeResp,
            getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp
        }),
        shallowEqual
    );

    const addAssignLangRef = useRef<any>({
        prevAssignLanguagesErrResp: assignLanguagesErrResp,
        prevAddStuDailyAttListResp: addStuDailyAttListResp,
        prevDateRangeDailyAttResp: dateRangeDailyAttResp,
        prevGetHolidayDetailsListResp: getHolidayDetailsListResp,
    });

    useEffect(() => {
        const { prevAssignLanguagesErrResp, prevAddStuDailyAttListResp, prevDateRangeDailyAttResp, prevGetHolidayDetailsListResp } = addAssignLangRef.current;

        if (assignLanguagesErrResp && assignLanguagesErrResp !== prevAssignLanguagesErrResp) {
            const { details } = assignLanguagesErrResp || {};
            toast.error(details || "Something went wrong");
        }
        else if (addStuDailyAttListResp !== prevAddStuDailyAttListResp) {
            const { content } = addStuDailyAttListResp || {};
            if(content?.length > 0){
                setStudentList(content?.map((i: any) => ({ ...i, isSelected: false })) || []);
            }else{
                setStudentList([])
            }
        }
        else if (getHolidayDetailsListResp && getHolidayDetailsListResp !== prevGetHolidayDetailsListResp) {
            if (Array.isArray(getHolidayDetailsListResp)) {
                const holidayList = getHolidayDetailsListResp.map((i: any) => i?.holidayDate)
                    addLanguageStateFormik.setFieldValue("holidayDates", holidayList)
            }

        }

        if (dateRangeDailyAttResp && dateRangeDailyAttResp !== prevDateRangeDailyAttResp) {
            const { content: data } = dateRangeDailyAttResp || {}
            const { academicYearId, classId, curriculumId, date } = addLanguageStateFormik.values || {}
            if (Array.isArray(data) && data?.length > 0) {
                const findData = data.find((i: any) => +i?.classId === +classId)

                if (findData) {
                    const isWithinRange = checkWithinTheRange(date, findData?.startDate, findData?.endDate)
                    addLanguageStateFormik.setFieldValue("maxDate", findData?.endDate)
                    addLanguageStateFormik.setFieldValue("minDate", findData?.startDate)
                    getHolidayListApi(date)
                    if (!isWithinRange) {
                        if (date) toast.warning("Given date is not applicable for entering attendance, please check settings.")
                        addLanguageStateFormik.setFieldValue("date", "")
                    }
                }
            }
            else if (data?.length === 0) {
                addLanguageStateFormik.setFieldValue("maxDate", "")
                addLanguageStateFormik.setFieldValue("minDate", "")
                addLanguageStateFormik.setFieldValue("date", "")
                toast.warning("There no date range for given class , Kindly add through settings")
            }
        }

        addAssignLangRef.current.prevAssignLanguagesErrResp = assignLanguagesErrResp;
        addAssignLangRef.current.prevAddStuDailyAttListResp = addStuDailyAttListResp;
        addAssignLangRef.current.prevDateRangeDailyAttResp = dateRangeDailyAttResp;
        addAssignLangRef.current.prevGetHolidayDetailsListResp = getHolidayDetailsListResp;
    }, [assignLanguagesErrResp, addStuDailyAttListResp, dateRangeDailyAttResp, getHolidayDetailsListResp]);

    const addLanguageStateFormik = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            if (values.isPresent) {
                delete values.isPresent
            }
            
            setAllStudentSelectedState(false)
            addStuAttendanceList(values)
        },
    });
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: addLanguageStateFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {

        if (modalData) {
            const { academicYearId, curriculumId, classId, sectionId, date } = modalData || {};
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, classId, sectionId, date }));

            if (academicYearId) {
                getCurriculumApiCall({ academicYearId })
            }

            if (curriculumId) {
                const payload = { branchId: branchId, curriculumId, academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            if (classId) {
                getSectionListResp({ masterAcademicYearId: academicYearId, curriculumId, branchClassId: classId, })
            }

            if (academicYearId && curriculumId && classId && sectionId && date) {
                addStuAttendanceList({ academicYearId, curriculumId, classId, sectionId, date })
            }
            if (academicYearId && curriculumId && classId) {
                const params = {
                    academicYearId, curriculumId, classId, branchId
                }
                dispatch(dateRangeDailyAttAct(generateActionPayload("date_range_stu_att", undefined, params)));
            }

            const newDate = new Date(date); // Replace with your date
            const month = format(newDate, 'MMMM').toUpperCase();

            const payload = {
                academicYearId,
                curriculumId,
                instituteId: instituteId,
                branchId,
                classId,
                monthName: month,
            };
            if (payload.academicYearId && payload.curriculumId && payload.classId && payload.monthName) {
                dispatch(getHolidayDetailsListAct(generateActionPayload('get_holiday_details_list', undefined, payload)))
            }

        }

    }, [branchId, instituteId])
    
    useEffect(() => {
        return () => {
            addLanguageStateFormik.resetForm();
            dispatch(resetAssignLanClassListAct(undefined))
            dispatch(resetAddStuDailyAttListAct(undefined))
            dispatch(resetAssignLanSectionListAct(undefined))
        }
    }, [])

    const addStuAttendanceList = (otherProps?: any) => {
        const { academicYearId, curriculumId, classId, sectionId, date } = addLanguageStateFormik.values;
        let payload = {
            academicYearId: academicYearId,
            curriculumId: curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            date,
            sectionId,
            pageNo: 0, pageSize: 100,
            ...otherProps,
        };
        delete payload.holidayDates
        delete payload.minDate
        delete payload.maxDate
        if (payload.academicYearId && payload.curriculumId && payload.classId && payload.sectionId && payload.date) {
            dispatch(addStuDailyAttListAct(generateActionPayload('get_daily_att_list', undefined, payload)))
        }
    }


    const getSectionListResp = (otherProps?: any) => {

        let payload = { branchClassId: addLanguageStateFormik.values.classId || null, masterAcademicYearId: addLanguageStateFormik.values.academicYearId, curriculumId: addLanguageStateFormik.values.curriculumId, sortBy: "sectionName", orderBy: "asc", pageNo: 0, pageSize: 20, ...otherProps }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(getAssignLanSectionListAct(generateActionPayload("get_section_list", undefined, payload)));
        }
    }

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        dispatch(resetAddStuDailyAttListAct(undefined))
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetAssignLanClassListAct(undefined))
            dispatch(resetAssignLanSectionListAct(undefined))
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" }))
        }
        else if (name === 'curriculumId') {
            const payload = { branchId: branchId, curriculumId: value, academicYearId: addLanguageStateFormik.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            // assignLanguagesList({[name]:value})
            if (!value) {
                dispatch(resetAssignLanClassListAct(undefined))
            }
            else {
                dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "", classId: "" }))
        }
        else if (name === 'classId') {
            getSectionListResp({ branchClassId: value })
            dispatch(resetAssignLanSectionListAct(undefined))
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "" }))

            const { academicYearId, curriculumId } = addLanguageStateFormik.values || {}

            if (academicYearId && curriculumId && value) {
                const params = {
                    academicYearId, curriculumId, classId: value, branchId
                }
                dispatch(dateRangeDailyAttAct(generateActionPayload("date_range_stu_att", undefined, params)));
            }
        }
        else if (name === "date") {
            addLanguageStateFormik.setFieldValue(String([name]), value)

            getHolidayListApi(value)
        }
        else {
            addLanguageStateFormik.setValues((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const getHolidayListApi = (date?: any) => {
        const { academicYearId, curriculumId, classId } = addLanguageStateFormik.values || {};
        let month = ""
        const newDate = new Date(date);
        if (!isNaN(newDate.getTime())) {
            month = format(newDate, 'MMMM').toUpperCase();
        }

        const payload = {
            academicYearId,
            curriculumId,
            instituteId: instituteId,
            branchId,
            classId,
            monthName: month,
        };
        if (payload.academicYearId && payload.curriculumId && payload.classId && payload.monthName) {
            dispatch(getHolidayDetailsListAct(generateActionPayload('get_holiday_details_list', undefined, payload)))
        }
    }

    const fetchStudentList = (e: any) => {
        e.preventDefault();
        addLanguageStateFormik.handleSubmit(e);
    }

    const onChangeInputHndlr = (studentId: any, name: any, event?: any) => {

        if (name === "PRESENT" || name === "ABSENT" || name === "RESET" || name === "remarks") {
            let updateStudentState = [...studentList];
            updateStudentState.forEach((item: any) => {
                if (item.studentId === studentId) {
                    if (name === "remarks") {
                        item.remarks = event.target.value
                    } else {
                        item.attendance = (name === "RESET" ? "NOT_MARKED" : name)
                    }
                }
            });
            setStudentList(updateStudentState);
        }
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...studentList];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
            item.attendance = checked ? item?.attendance : "NOT_MARKED";
            item.remarks = checked ? item?.remarks : "";
        });
        setStudentList(updateStudentState);
    }, [studentList]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            studentIdNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = studentList.findIndex((item: any) => +item.studentId === Number(studentIdNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = studentList[studentRowIndex];
            let updateStudentState: any = [...studentList];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked, attendance: checked ? studentDetails?.attendance : "NOT_MARKED", remarks: checked ? studentDetails?.remarks : "",
            });
            setStudentList(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [studentList]);

    const addStuDailyAttendanceHndler = () => {

        let presentCount = 0;
        let absentCount = 0;
        let notMarkedCount = 0;

        const stuList = studentList?.map((i: any) => {
            if (i?.attendance) {
                if (i?.attendance === "PRESENT") {
                    presentCount = presentCount + 1;
                } else if (i?.attendance === "ABSENT") {
                    absentCount = absentCount + 1;
                } else if (i?.attendance === "NOT_MARKED") {
                    notMarkedCount = notMarkedCount + 1;
                }
                return {
                    studentId: i?.studentId,
                    attendanceStatus: i?.attendance,
                    remarks: i?.remarks,
                }
            } else {
                notMarkedCount = notMarkedCount + 1
                return {
                    studentId: i?.studentId,
                    attendanceStatus: "NOT_MARKED",
                    remarks: i?.remarks,
                }
            }
        }).filter((f: any) => f)

        const payload = {
            academicYearId: addLanguageStateFormik.values.academicYearId,
            curriculumId: addLanguageStateFormik.values.curriculumId,
            classId: addLanguageStateFormik.values.classId,
            sectionId: addLanguageStateFormik.values.sectionId,
            date: addLanguageStateFormik.values.date,
            branchId: loggedInUserRole?.toLowerCase() === "teacher" ? userMeResp?.branchId : branchId,
            employeeId: loggedInUserRole?.toLowerCase() === "teacher" ? userMeResp?.loggedInUserInformation?.id : null,
            source: "WEB",
            studentsData: stuList,
            notMarkedCount: notMarkedCount,
            presentCount: presentCount,
            absentCount: absentCount,
        }

        const { minDate, maxDate, date } = addLanguageStateFormik.values || {};
        // if(((isAfter(new Date(date), new Date(minDate)) || isEqual(new Date(date), new Date(minDate))) && (isAfter(new Date(maxDate), new Date(date)) || isEqual(new Date(maxDate), new Date(date)))) && addLanguageStateFormik.values.date){
        if (isDateNotValid(date)) {
            toast.warning("Please Don't select Future Date")
        }
        else if (addLanguageStateFormik.values.date && checkWithinTheRange(date, minDate, maxDate)) {
            dispatch(updateStuDailyAttListAct(generateActionPayload("update_stu_att_list", undefined, payload)));
        }
        else if (!date) {
            toast.warning("Please Select Date")
        }
        // else if( minDate && maxDate && date && ((!isAfter(new Date(date), new Date(minDate)) && !isEqual(new Date(date), new Date(minDate)) ) || (!isAfter(new Date(maxDate), new Date(date)) && !isEqual(new Date(maxDate), new Date(date))))){
        else if (minDate && maxDate && date && !checkWithinTheRange(date, minDate, maxDate)) {
            toast.warning(`Given date is not between ${getDdMmYyyyFormat(minDate)} and ${getDdMmYyyyFormat(maxDate)}`)
        }
        else {
            toast.warning("There no date range for given class , Kindly add through settings")
        }

    }

    const markStuHndler = (name: any) => {
        const newList = studentList?.map((i: any) => ({ ...i, attendance: name === "" ? "NOT_MARKED" : name }))
        setStudentList(newList)
    }

    const submitButtonError = useMemo(() => computeSubmitButtonError(studentList), [studentList]);
    
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = getAssignListCurriculumResp || {}
    const { data: secoundLanguageList } = secoundLanguageResp || {};
    const { data: thirdLanguageList } = getThirdLanForChangeStudentResp || {};
    const { content: classTypes } = getAssignLanClassListResp || {};

    const roleColumns = useMemo(() => addStuAttGenerateColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState), [studentList, addLanguageStateFormik]);

    return (
        <>
            <form>
                <div className="tw-px-4">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        {/* Academic Year */}
                        <div className="tw-col-span-12 md:tw-col-span-2 tw-mb-3">
                            <SelectInput
                                name="academicYearId"
                                value={addLanguageStateFormik.values.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelClass="required"
                                labelText="Academic Year"
                                onBlur={addLanguageStateFormik.handleBlur}
                                invalid={(addLanguageStateFormik.touched.academicYearId && addLanguageStateFormik.errors.academicYearId) ? true : false}
                                error={(addLanguageStateFormik.touched.academicYearId && addLanguageStateFormik.errors.academicYearId) ? addLanguageStateFormik.errors.academicYearId : ""}
                            />
                        </div>

                        {/* Curriculum */}
                        <div className="tw-col-span-12 md:tw-col-span-2">
                            <SelectInput
                                name="curriculumId"
                                value={addLanguageStateFormik.values.curriculumId}
                                onChange={filterHandler}
                                menuItems={curriculumTypes || []}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                formgroupClassName="tw-mb-0"
                                labelClass="required"
                                defaultSelect="Select"
                                labelText="Curriculum"
                                onBlur={addLanguageStateFormik.handleBlur}
                                invalid={(addLanguageStateFormik.touched.curriculumId && addLanguageStateFormik.errors.curriculumId) ? true : false}
                                error={(addLanguageStateFormik.touched.curriculumId && addLanguageStateFormik.errors.curriculumId) ? addLanguageStateFormik.errors.curriculumId : ""}
                            />
                        </div>

                        {/* Class */}
                        <div className="tw-col-span-12 md:tw-col-span-2">
                            <SelectInput
                                name="classId"
                                value={addLanguageStateFormik.values.classId}
                                onChange={filterHandler}
                                menuItems={classTypes || []}
                                valueKey="id"
                                textKey="shortName"
                                defaultSelect="Select"
                                labelText="Class"
                                labelClass="required"
                                onBlur={addLanguageStateFormik.handleBlur}
                                // inputClassName="bg-light border-0"
                                formgroupClassName="tw-mb-0"
                                invalid={(addLanguageStateFormik.touched.classId && addLanguageStateFormik.errors.classId) ? true : false}
                                error={(addLanguageStateFormik.touched.classId && addLanguageStateFormik.errors.classId) ? addLanguageStateFormik.errors.classId : ""}
                            />
                        </div>

                        {/* Section */}
                        <div className="tw-col-span-12 md:tw-col-span-2">
                            <SelectInput
                                name="sectionId"
                                value={addLanguageStateFormik.values.sectionId}
                                onChange={filterHandler}
                                menuItems={getAssignLanSectionListResp?.data || []}
                                valueKey="sectionId"
                                textKey="sectionName"
                                defaultSelect="Select"
                                labelText="Section"
                                labelClass="required"
                                onBlur={addLanguageStateFormik.handleBlur}
                                // inputClassName="bg-light border-0"
                                formgroupClassName="tw-mb-0"
                                invalid={(addLanguageStateFormik.touched.sectionId && addLanguageStateFormik.errors.sectionId) ? true : false}
                                error={(addLanguageStateFormik.touched.sectionId && addLanguageStateFormik.errors.sectionId) ? addLanguageStateFormik.errors.sectionId : ""}
                            />
                        </div>

                        {/* Date */}
                        <div className="tw-col-span-12 md:tw-col-span-2">
                            <DateInput
                                name="date"
                                value={addLanguageStateFormik.values.date}
                                onChange={filterHandler}
                                formgroupClassName="tw-mb-0"
                                labelClass="required"
                                onBlur={addLanguageStateFormik.handleBlur}
                                // maxDate={addLanguageStateFormik.values?.maxDate || new Date()}
                                // minDate={addLanguageStateFormik.values?.minDate || new Date("01-01-1970")}
                                invalid={(addLanguageStateFormik.touched.date && addLanguageStateFormik.errors.date) ? true : false}
                                error={(addLanguageStateFormik.touched.date && addLanguageStateFormik.errors.date) ? addLanguageStateFormik.errors.date : ""}
                                labelText="Date"
                            />
                        </div>

                        {/* Search Button */}
                        <div className="tw-col-span-auto md:tw-col-span-auto md:tw-ml-auto tw-mt-4">
                            <div className="tw-flex tw-mt-3">
                                <Button
                                    onClick={fetchStudentList}
                                    disabled={showApiLoader}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-my-3">
                    <div className="tw-flex tw-gap-2 tw-w-auto tw-me-auto tw-mx-4 tw-mb-3">
                        {studentList?.length > 0 && (
                            <>
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => markStuHndler("PRESENT")}
                                >
                                    Mark All Present
                                </Button>

                                <Button
                                    type="button"
                                    variant="reject"

                                    onClick={() => markStuHndler("ABSENT")}
                                >
                                    Mark All Absent
                                </Button>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => markStuHndler("")}
                                >
                                    Reset All
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <TableContainer
                    columns={roleColumns || []}
                    data={studentList || []}
                    divClass="tw-overflow-x-auto tw-mb-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                    rowDataInfo={{ getThirdLanForChangeStudentResp, secoundLanguageResp, isDisabled: !addLanguageStateFormik.isValid }}
                    onChangeInputHndlr={onChangeInputHndlr}
                />
                <tr style={{ color: "#38414A26" }} />
                <div className="tw-flex">
                    <div className="tw-flex tw-gap-2 tw-w-auto tw-ml-auto tw-mx-4 tw-my-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            disabled={(showApiLoader || !addLanguageStateFormik.isValid) && true}
                            onClick={addStuDailyAttendanceHndler}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddDailyAttendanceModal;

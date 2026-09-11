import React, { useEffect, useRef, useState, useMemo } from 'react'
import { AutoSearchInput, DateInput, MultiSelectCheckbox, SelectInput, TextInput, UploadFileInput } from '../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { holidayTypes } from './helper';
import { toast } from 'react-toastify';
import { addHolidayAct, getBrchClassHolidayAct, getHolidayClassesAct, resetBrchClassHolidaysAct, setHolidayClassesAct, updateHolidayAct } from '../../../store/StudentAttendance/HolidayDetails/holidaydetailsaction';
import { generateActionPayload } from "../../../utility/reduxutility";
import { getDdMmYyyyFormat, isGreaterThanCompareDate, isSmallerThanCompareDate } from '../../../utility/dateutility';
import { getAssignCurriculumListAct } from '../../../store/assignlanguages/assignlanguagesaction';
import Button from '../../../Components/Common/Button';

function getStudentHolidayDetailsForm(editData?: any) {
    return ({
        academicYearId: editData?.academicYearId || "",
        curriculumId: editData?.curriculumId || "",
        classIds: editData?.classIds || null,
        fromDate: editData?.fromDate || "",
        toDate: editData?.toDate || "",
        holidayName: editData?.holidayName || "",
        holidayType: editData?.holidayType || "",
    })
}

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classIds: Yup.array().required('Class is required.').min(1, 'Select atleast one class.').nullable(),
    fromDate: Yup.string().required("From date is required.")
        .test("fromDateValidation", "Fromdate should be smaller or equal to todate.",
            (value: any, schema: any) => {
                const { toDate } = schema.parent;
                if (!value || !toDate) return true;
                return isSmallerThanCompareDate(value, toDate)
            }),
    toDate: Yup.string().required("To date is required.")
        .test("toDateValidation", "Todate should be greater than or equal to Fromdate.",
            (value: any, schema: any) => {
                const { fromDate } = schema.parent;
                if (!value || !fromDate) return true;
                return isGreaterThanCompareDate(value, fromDate)
            }),
    holidayName: Yup.string().required("Holiday name is required."),
    holidayType: Yup.string().required("Holiday type is required."),
});

function renderSelectedClass(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
            {
                selectedItems.map((item, index) => {
                    return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
                })
            }
        </div>)
    }
}

function renderOptionClass(item: any) {
    return (
        <div className="row">
            <div className='col-12'>{item.shortName}</div>
            <div className='col-12 text-muted fs-12'>
                {!item.fromDate && !item.toDate ? (
                    <span className='text-danger fs-12'>Academic Dates Not Assigned</span>
                ) : (
                    <span>{`(${getDdMmYyyyFormat(item.fromDate)} to ${getDdMmYyyyFormat(item.toDate)})`}</span>
                )}
            </div>
        </div>
    );
}

const initialValues = getStudentHolidayDetailsForm();
const AddStudentHolidayDetails = (props: any) => {
    const [calendarRangeState, setCalendarRangeState] = useState({ startDate: '', endDate: '' });
    const dispatch = useAppDispatch();
    const {
        academicYearListResp,
        brchCurriculumResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId, holidayClassesResp, getBrchClassHolidaysResp,
        addHolidayResp, updateHolidayResp, showApiLoader,
        getAssignListCurriculumResp
    }: any = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, holidayDetails, assignLanguages }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            holidayClassesResp: holidayDetails.holidayClassesResp,
            getBrchClassHolidaysResp: holidayDetails.getBrchClassHolidaysResp,
            addHolidayResp: holidayDetails.addHolidayResp,
            updateHolidayResp: holidayDetails.updateHolidayResp,
            getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp
        }), shallowEqual);

    useEffect(() => {
        if (!props.holidayId && academicYearListResp) {
            const { data } = academicYearListResp || {};
            if (Array.isArray(data)) {
                let { academicYearId, startDate, endDate } = data.find((year: any) => year.yearStatus === "CURRENT") || {};
                holidayDetailsForm.setFieldValue("academicYearId", academicYearId);
                setCalendarRangeState(prevState => ({ ...prevState, startDate, endDate }));
                getCurriculumApiCall({ academicYearId });
            }
        }
    }, [academicYearListResp, props.holidayId, branchId, instituteId]);

    useEffect(() => {
        const { holidayInfo } = props;
        const { data } = academicYearListResp || {};
        if (holidayInfo) {
            const formData = getStudentHolidayDetailsForm(holidayInfo);
            if (holidayInfo?.curriculumId) {
                getHolidayClassesApiCall(holidayInfo?.curriculumId, holidayInfo?.academicYearId)
            }
            let { startDate = "", endDate = "" } = data.find((year: any) => year.academicYearId === holidayInfo?.academicYearId) || {};
            setCalendarRangeState(prevState => ({ ...prevState, startDate, endDate }));
            holidayDetailsForm.resetForm({
                values: formData
            })
        }
    }, [props.holidayInfo, academicYearListResp, branchId, instituteId]);

    useEffect(() => {
        const { holidayInfo } = props,
            { content } = getBrchClassHolidaysResp || {};
        if (holidayInfo?.classIds && Array.isArray(content)) {
            const classIdList = holidayInfo?.classIds.split(',').map((item: any) => item.trim());
            const selectedClass = content.filter(item => classIdList.includes(item?.id?.toString()));
            holidayDetailsForm.setFieldValue("classIds", selectedClass);
        }
    }, [getBrchClassHolidaysResp, props.holidayInfo]);

    const holidayDetailsRef = useRef({
        prevAddHolidayResp: addHolidayResp,
        prevUpdateHolidayResp: updateHolidayResp
    });

    useEffect(() => {
        const { prevAddHolidayResp, prevUpdateHolidayResp } = holidayDetailsRef.current;
        if (addHolidayResp && prevAddHolidayResp !== addHolidayResp) {
            toast.success('Holiday details added successfully.');
            props.toggle(true);
        } else if (updateHolidayResp && prevUpdateHolidayResp !== updateHolidayResp) {
            toast.success('Holiday details updated successfully.');
            props.toggle(true);
        }
        holidayDetailsRef.current.prevAddHolidayResp = addHolidayResp;
        holidayDetailsRef.current.prevUpdateHolidayResp = updateHolidayResp;
    }, [addHolidayResp, updateHolidayResp]);

    const holidayDetailsForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload: any = { branchId, ...values };
            const [year,] = values.fromDate.split('-');
            payload.year = year;
            if (Array.isArray(values.classIds)) {
                payload.classIds = values?.classIds?.map((item: any) => item.id);
            } else {
                payload.classIds = [];
            }
            if (props.holidayId) {
                dispatch(updateHolidayAct(generateActionPayload("update_holiday", {
                    holidayId: props.holidayId
                }, payload)));
            } else {
                dispatch(addHolidayAct(generateActionPayload("add_holiday", undefined, payload)));
            }
        },
    });

    function getHolidayClassesApiCall(curriculumId: string, academicYearId?: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId, academicYearId: holidayDetailsForm.values.academicYearId || academicYearId };
        dispatch(getBrchClassHolidayAct(generateActionPayload("get_brch_curriculum_class_holidays", undefined, payload)));
    }
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: holidayDetailsForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        dispatch(resetBrchClassHolidaysAct(undefined));
        holidayDetailsForm.setValues(prevState => ({ ...prevState, [name]: value, classIds: null }))
        if (value) {
            getHolidayClassesApiCall(value);
        }
    }

    function onChangeAcademicYearHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        holidayDetailsForm.setValues(prevState => ({
            ...prevState, [name]: value, toDate: '',
            fromDate: '',
            classIds: null
        }))
        let { startDate = '', endDate = '' } = academicYearListResp?.data.find((year: any) => year.academicYearId?.toString() === value) || {};
        setCalendarRangeState(prevState => ({ ...prevState, startDate, endDate }))
        getCurriculumApiCall({ academicYearId: value });
        dispatch(resetBrchClassHolidaysAct(undefined));
    }

    const derivedDates = useMemo(() => {
        let minD = calendarRangeState.startDate;
        let maxD = calendarRangeState.endDate;
        const selectedClasses = holidayDetailsForm.values.classIds;

        if (Array.isArray(selectedClasses) && selectedClasses.length > 0) {
            const fromDates = selectedClasses?.map((c: any) => c.fromDate)?.filter(Boolean);
            const toDates = selectedClasses?.map((c: any) => c.toDate)?.filter(Boolean);

            if (fromDates.length > 0) {
                minD = fromDates?.reduce((earliest: any, current: any) => {
                    return new Date(current) < new Date(earliest) ? current : earliest;
                });
            }
            if (toDates.length > 0) {
                maxD = toDates?.reduce((latest: any, current: any) => {
                    return new Date(current) > new Date(latest) ? current : latest;
                });
            }
        }
        return { minDate: minD, maxDate: maxD };
    }, [calendarRangeState.startDate, calendarRangeState.endDate, holidayDetailsForm.values.classIds]);

    function onSelectClassHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        let newClasses: any = null;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            newClasses = selectedOptions;
        }
        holidayDetailsForm.setFieldValue(name, newClasses);
    }

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        holidayDetailsForm.handleChange(e);
        const { name, value } = e.target;

        if (value && ['fromDate', 'toDate'].includes(name)) {
            const classes = holidayDetailsForm.values.classIds;
            if (Array.isArray(classes)) {
                const target = new Date(value);

                const fromDate = name === 'fromDate' ? target : new Date(holidayDetailsForm.values.fromDate);
                const toDate = name === 'toDate' ? target : new Date(holidayDetailsForm.values.toDate);

                if (
                    holidayDetailsForm.values.fromDate &&
                    holidayDetailsForm.values.toDate &&
                    fromDate > toDate
                ) {
                    toast.error("From Date cannot be greater than To Date.");
                    return;
                }

                const errorMessages: string[] = [];

                const outOfRangeClasses: string[] = [];

                for (const cls of classes) {
                    if (!cls.fromDate || !cls.toDate) {
                        errorMessages.push(`${cls.shortName}: Academic dates are not assigned.`);
                        continue;
                    }

                    const cFrom = new Date(cls.fromDate);
                    const cTo = new Date(cls.toDate);

                    if (name === 'fromDate' && target < cFrom) {
                        outOfRangeClasses.push(cls.shortName);
                    }
                    if (name === 'toDate' && target > cTo) {
                        outOfRangeClasses.push(cls.shortName);
                    }
                }

                if (outOfRangeClasses.length > 0) {
                    errorMessages.push(`${outOfRangeClasses.join(', ')} is not in date range`);
                }

                if (errorMessages.length > 0) {
                    toast.error(errorMessages.join('\n'));
                }
            }
        }
    };
    return (
        <form onSubmit={holidayDetailsForm.handleSubmit}>
            <div className="tw-pb-3">
                {/* Modal Body */}
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-4">
                    {/* Academic Year */}
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="academicYearId"
                            labelClass="required"
                            value={holidayDetailsForm.values.academicYearId}
                            onChange={onChangeAcademicYearHndlr}
                            menuItems={academicYearListResp?.data}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            isDisabled={!!props.holidayId}
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Academic Year"
                            labelText="Academic Year"
                            invalid={
                                holidayDetailsForm.touched.academicYearId &&
                                    holidayDetailsForm.errors.academicYearId
                                    ? true
                                    : false
                            }
                            error={
                                holidayDetailsForm.touched.academicYearId &&
                                    holidayDetailsForm.errors.academicYearId
                                    ? holidayDetailsForm.errors.academicYearId
                                    : ""
                            }
                        />
                    </div>

                    {/* Curriculum */}
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="curriculumId"
                            labelClass="required"
                            value={holidayDetailsForm.values.curriculumId}
                            onChange={onChangeCurriculumHndlr}
                            menuItems={getAssignListCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Curriculum"
                            labelText="Curriculum"
                            invalid={
                                holidayDetailsForm.touched.curriculumId &&
                                    holidayDetailsForm.errors.curriculumId
                                    ? true
                                    : false
                            }
                            error={
                                holidayDetailsForm.touched.curriculumId &&
                                    holidayDetailsForm.errors.curriculumId
                                    ? holidayDetailsForm.errors.curriculumId
                                    : ""
                            }
                        />
                    </div>

                    {/* Classes */}
                    <div className="tw-col-span-12">
                        <MultiSelectCheckbox
                            name="classIds"
                            idKey="id"
                            labelText="Classes"
                            value={holidayDetailsForm.values.classIds}
                            renderValue={renderSelectedClass}
                            renderOptions={renderOptionClass}
                            onChange={onSelectClassHndlr}
                            searchKey="shortName"
                            options={getBrchClassHolidaysResp?.content}
                            invalid={
                                holidayDetailsForm.touched.classIds &&
                                    holidayDetailsForm.errors.classIds
                                    ? true
                                    : false
                            }
                            error={
                                holidayDetailsForm.touched.classIds &&
                                    holidayDetailsForm.errors.classIds
                                    ? holidayDetailsForm.errors.classIds
                                    : ""
                            }
                        />
                    </div>

                    {/* Holiday Name */}
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <TextInput
                            name="holidayName"
                            labelText="Holiday Name"
                            labelClass="required"
                            formgroupClassName="tw-mb-0"
                            value={holidayDetailsForm.values.holidayName}
                            onChange={holidayDetailsForm.handleChange}
                            invalid={
                                holidayDetailsForm.touched.holidayName &&
                                    holidayDetailsForm.errors.holidayName
                                    ? true
                                    : false
                            }
                            error={
                                holidayDetailsForm.touched.holidayName &&
                                    holidayDetailsForm.errors.holidayName
                                    ? holidayDetailsForm.errors.holidayName
                                    : ""
                            }
                        />
                    </div>

                    {/* Holiday Type */}
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="holidayType"
                            labelClass="required"
                            value={holidayDetailsForm.values.holidayType}
                            onChange={holidayDetailsForm.handleChange}
                            menuItems={holidayTypes}
                            valueKey="id"
                            textKey="name"
                            labelText="Holiday Type"
                            formgroupClassName="tw-mb-0"
                            invalid={
                                holidayDetailsForm.touched.holidayType &&
                                    holidayDetailsForm.errors.holidayType
                                    ? true
                                    : false
                            }
                            error={
                                holidayDetailsForm.touched.holidayType &&
                                    holidayDetailsForm.errors.holidayType
                                    ? holidayDetailsForm.errors.holidayType
                                    : ""
                            }
                        />
                    </div>

                    {/* From Date */}
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <DateInput
                            name="fromDate"
                            labelClass="required"
                            labelText="Holiday From Date"
                            formgroupClassName="tw-mb-0"
                            minDate={derivedDates.minDate}
                            maxDate={derivedDates.maxDate}
                            value={holidayDetailsForm.values.fromDate}
                            onChange={handleDateChange}
                            invalid={
                                holidayDetailsForm.touched.fromDate &&
                                    holidayDetailsForm.errors.fromDate
                                    ? true
                                    : false
                            }
                            error={
                                holidayDetailsForm.touched.fromDate &&
                                    holidayDetailsForm.errors.fromDate
                                    ? holidayDetailsForm.errors.fromDate
                                    : ""
                            }
                        />
                    </div>

                    {/* To Date */}
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <DateInput
                            name="toDate"
                            labelClass="required"
                            labelText="Holiday To Date"
                            formgroupClassName="tw-mb-0"
                            minDate={derivedDates.minDate}
                            maxDate={derivedDates.maxDate}
                            value={holidayDetailsForm.values.toDate}
                            onChange={handleDateChange}
                            invalid={
                                holidayDetailsForm.touched.toDate &&
                                    holidayDetailsForm.errors.toDate
                                    ? true
                                    : false
                            }
                            error={
                                holidayDetailsForm.touched.toDate &&
                                    holidayDetailsForm.errors.toDate
                                    ? holidayDetailsForm.errors.toDate
                                    : ""
                            }
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="tw-flex tw-justify-end tw-mt-4 tw-px-4">
                    <div className="tw-flex tw-gap-3">
                        <Button
                            type="button"
                            variant='secondary'
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant='primary'
                            disabled={showApiLoader}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>

        </form>
    )
}

export default AddStudentHolidayDetails
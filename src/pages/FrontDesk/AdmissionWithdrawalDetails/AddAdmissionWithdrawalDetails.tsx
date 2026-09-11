import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AutoSearchInputUpdated, DateInput, RadioInputContainer, SelectInput, TextInput } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from '../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { createAdmissionWithdrawalAct, getAdmissionWithdrawalByidAct, searchStudentAdmissionWithdrawalAct, updateAdmissionWithdrawalAct } from '../../../store/FrontDesk/AdmissionSettings/admissionsettingaction';
import { Current_Date_YYYYMMDD, getYyyyMmDdFormat } from '../../../utility/dateutility';
import { toast } from 'react-toastify';
import { saveVlidateStudentStatusAct } from '../../../store/academic/notreportingstudents/notreportingstudentsactions';
import { setSaveVlidateStudentStatusAct } from '../../../store/academic/notreportingstudents/notreportingstudentsslice';
import Button from '../../../Components/Common/Button';

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year is required."),
    branchCurriculumId: Yup.string().required("Curriculum id is required.").nullable(),
    branchClassId: Yup.string().required("Class is required.").nullable(),
    admissionWithdrawDate: Yup.string().required("Withdraw date is required.").nullable(),
    studentId: Yup.string().required("Student id is required."),
    studentAttendSchool: Yup.string(),
    lastAttendDate: Yup.string().when('studentAttendSchool', {
        is: (studentAttendSchool: string) => studentAttendSchool === "YES",
        then: Yup.string()
            .required("Last attended date is required.").nullable()
    }),
    classAdmitted: Yup.string().required("Class admitted is required.").nullable(),
    reason: Yup.string().required("Reason is required.")
});

export function getAdmissionWithdrawalData(editData?: any) {
    return ({
        academicYearId: editData?.academicYearId || "",
        branchCurriculumId: editData?.curriculumId || "",
        branchClassId: editData?.classId || "",
        admissionWithdrawDate: editData?.admissionWithdrawDate ? getYyyyMmDdFormat(editData?.admissionWithdrawDate) : "",
        studentId: editData?.studentId || "",
        studentAttendSchool: editData?.studentAttendSchool || "NO",
        classAdmitted: editData?.classAdmitted || "",
        lastAttendDate: editData?.lastAttendDate ? getYyyyMmDdFormat(editData?.lastAttendDate) : "",
        reason: editData?.reason || "",
    })
}

const initialValues = getAdmissionWithdrawalData();
const AddAdmissionWithdrawalDetails = ({ isOpen, branchId, instituteId, admissionWithdrawalId, toggle }: any) => {
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [selectedAcademicYearInfoState, setSelectedAcademicYearInfoState] = useState({
        startDate: "",
        endDate: ""
    })
    const [tempStudent, setTempStudent] = useState<any>(null);
    const dispatch = useDispatch(),
        {
            academicYearListResp,
            brchCurriculumResp,
            branchClassResp,
            showApiLoader,
            createAdmissionWithdrawalResp,
            updateAdmissionWithdrawalResp,
            admissionWithdrawalByIdResp,
            searchStudentAdmissionWithdrawalResp,
            saveVlidateStudentStatusResp,
            notReportingStuErrResp
        }: any = useAppSelector(
            ({ globalData, instAcademics, branchAcademics,
                admissionSettingRequest,notReportingStu

            }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader: globalData.showApiLoader,
                createAdmissionWithdrawalResp: admissionSettingRequest.createAdmissionWithdrawalResp,
                updateAdmissionWithdrawalResp: admissionSettingRequest.updateAdmissionWithdrawalResp,
                admissionWithdrawalByIdResp: admissionSettingRequest.admissionWithdrawalByIdResp,
                searchStudentAdmissionWithdrawalResp: admissionSettingRequest.searchStudentAdmissionWithdrawalResp,
                saveVlidateStudentStatusResp:notReportingStu.saveVlidateStudentStatusResp,
            notReportingStuErrResp: notReportingStu.notReportingStuErrResp,
            }),

            shallowEqual
        );
    const addAdmissionWithRespRef = useRef({
        prevCreateAdmissionWithdrawalResp: createAdmissionWithdrawalResp,
        prevUpdateAdmissionWithdrawalResp: updateAdmissionWithdrawalResp,
        prevNotReportingStuErrResp: notReportingStuErrResp,
        prevAdmissionWithdrawalByIdResp: admissionWithdrawalByIdResp
    });

    useEffect(() => {
        const { prevAdmissionWithdrawalByIdResp, prevUpdateAdmissionWithdrawalResp,
            prevCreateAdmissionWithdrawalResp, prevNotReportingStuErrResp } = addAdmissionWithRespRef.current;
        if (notReportingStuErrResp && notReportingStuErrResp !== prevNotReportingStuErrResp) {
            setTempStudent(null)
            addAdmissionWithdrawalForm.setValues((prev: any) => ({ ...prev, studentId: "", branchCurriculumId: "", branchClassId: "" }))
            const { details } = notReportingStuErrResp || {};
            toast.error(details || "Something went wrong");
        } 
        else if (createAdmissionWithdrawalResp && prevCreateAdmissionWithdrawalResp !== createAdmissionWithdrawalResp) {
            toast.success("Admission withdrawal created successfully.");
            toggle(true);
        } else if (updateAdmissionWithdrawalResp && prevUpdateAdmissionWithdrawalResp !== updateAdmissionWithdrawalResp) {
            toast.success("Admission withdrawal updated successfully.");
            toggle(true);
        } else if (admissionWithdrawalByIdResp && admissionWithdrawalByIdResp !== prevAdmissionWithdrawalByIdResp) {
            const { academicYearId, studentId, studentCode, curriculumId, studentName } = admissionWithdrawalByIdResp,
                formData = getAdmissionWithdrawalData(admissionWithdrawalByIdResp);

            getCurriculumApiCall({ academicYearId, });

            //Getting the class id
            getClassApiCall({ academicYearId, curriculumId });
            addAdmissionWithdrawalForm.resetForm({
                values: formData
            })
            //Set the calendar selectable start date.
            const { startDate, endDate } = academicYearListResp.data?.find((year: any) => year.academicYearId.toString() === academicYearId?.toString()) || {};
            setSelectedAcademicYearInfoState(prevState => ({
                ...prevState,
                startDate: getYyyyMmDdFormat(startDate)
            }));
            //Setting search student
            setSearchStudentState({
                studentCode,
                studentName: studentName || "",
                studentId: studentId || ""
            });

        }
        addAdmissionWithRespRef.current.prevCreateAdmissionWithdrawalResp = createAdmissionWithdrawalResp;
        addAdmissionWithRespRef.current.prevUpdateAdmissionWithdrawalResp = updateAdmissionWithdrawalResp;
        addAdmissionWithRespRef.current.prevAdmissionWithdrawalByIdResp = admissionWithdrawalByIdResp;
        addAdmissionWithRespRef.current.prevNotReportingStuErrResp = notReportingStuErrResp
    }, [createAdmissionWithdrawalResp, updateAdmissionWithdrawalResp, admissionWithdrawalByIdResp, notReportingStuErrResp]);

    useEffect(() => {
        if (admissionWithdrawalId && isOpen) {
            const params = { admissionWithdrawalId: admissionWithdrawalId };
            dispatch(getAdmissionWithdrawalByidAct(generateActionPayload("get_admission_withdrawal_byid", undefined, params)));
        }
    }, [admissionWithdrawalId, isOpen]);

    useEffect(() => {
        if (!admissionWithdrawalId) {
            const { academicYearId, startDate, endDate } = academicYearListResp.data?.find((year: any) => year?.isAdmissionDefault) || {};
            getCurriculumApiCall({ academicYearId });
            addAdmissionWithdrawalForm.setFieldValue('academicYearId', academicYearId);
            setSelectedAcademicYearInfoState(prevState => ({
                ...prevState,
                startDate: getYyyyMmDdFormat(startDate)
            }));
        }
    }, [academicYearListResp, admissionWithdrawalId]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: addAdmissionWithdrawalForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const getClassApiCall = (otherProps?:any)=>{
        const payload = { branchId: branchId, academicYearId : addAdmissionWithdrawalForm.values.academicYearId, curriculumId: addAdmissionWithdrawalForm.values.branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const addAdmissionWithdrawalForm = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            if (admissionWithdrawalId) {
                const payload = {
                    classAdmitted: values.classAdmitted,
                    studentAttendSchool: values.studentAttendSchool,
                    admissionWithdrawDate: values.admissionWithdrawDate,
                    lastAttendDate: values.lastAttendDate,
                    reason: values.reason
                };
                dispatch(updateAdmissionWithdrawalAct(generateActionPayload("udpate_admissionwithdrawal", {
                    admissionWithdrawalId
                }, payload)));
            } else {
                const payload = {
                    ...values,
                    branchId,
                    instituteId,
                    studentCode: searchStudentState?.studentCode,
                    studentName: searchStudentState?.studentName
                };
                dispatch(createAdmissionWithdrawalAct(generateActionPayload("create_admissionwith", undefined, payload)));
            }
        },
    });

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const { academicYearId } = addAdmissionWithdrawalForm.values;
            const params = { branchId, academicYearId, searchString: inputString, pageNo: 0, pageSize: 20 };
            dispatch(searchStudentAdmissionWithdrawalAct(generateActionPayload("search_student_admissionwith", undefined, params)));
        }
    }

    const selectStudentHandler = (selectedStudent: any) => {
        const { studentId = "", curriculumId = "", classId = "" } = selectedStudent || {};
        if (curriculumId) {
            getClassApiCall({ curriculumId });
            getCurriculumApiCall({academicYearId : addAdmissionWithdrawalForm.values.academicYearId});
        }
        // addAdmissionWithdrawalForm.setValues(prevState => ({
        //     ...prevState,
        //     studentId, branchCurriculumId: curriculumId, branchClassId: classId
        // }));
        dispatch(saveVlidateStudentStatusAct(generateActionPayload("save_validate_student_status", undefined, { studentId, requestType: "AW"})));
        
        dispatch(resetBrchClassAct(undefined));
        setTempStudent(selectedStudent);
        // setSearchStudentState(selectedStudent);
    }

    useEffect(() => {
        if (saveVlidateStudentStatusResp && saveVlidateStudentStatusResp === 200) {
            if (tempStudent) {
                const { studentId, curriculumId, classId } = tempStudent;

                setSearchStudentState(tempStudent);

                addAdmissionWithdrawalForm.setValues((prev) => ({
                    ...prev,
                    studentId,
                    branchCurriculumId: curriculumId,
                    branchClassId: classId,
                }));
            }
        }
    }, [saveVlidateStudentStatusResp, tempStudent]);

    useEffect(() => {
        return () => {
          dispatch(setSaveVlidateStudentStatusAct(undefined));
        }
      }, []);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "academicYearId") {
            const { startDate, endDate } = academicYearListResp.data?.find((year: any) => year.academicYearId.toString() === value) || {};
            setSelectedAcademicYearInfoState(prevState => ({
                ...prevState,
                startDate: getYyyyMmDdFormat(startDate)
            }));
            addAdmissionWithdrawalForm.setValues(prevState => ({
                ...prevState, [name]: value, studentId: ""
            }));
            setSearchStudentState(null);
        } else if (name === "branchCurriculumId") {
            addAdmissionWithdrawalForm.setValues((prevState) => ({
                ...prevState,
                [name]: value, branchClassId: ""
            }));
            if (value) {
                getClassApiCall({ curriculumId: value });
            } else {
                dispatch(resetBrchClassAct(undefined));
            }
        } else if (name === "studentAttendSchool") {
            addAdmissionWithdrawalForm.setValues((prevState) => ({
                ...prevState,
                [name]: value, lastAttendDate: ""
            }));
        } else {
            addAdmissionWithdrawalForm.setFieldValue(name, value);
        }

    }

    const academicYearList = useMemo(() => {
        const { data } = academicYearListResp;
        if (Array.isArray(data)) {
            if (admissionWithdrawalId) {
                return data;
            } else {
                return data.filter(item => item?.yearStatus?.toString().toLowerCase() !== "old");
            }
        }
        return [];
    }, [academicYearListResp, admissionWithdrawalId]);

    // const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    return (
        <div className="tw-p-6">
            <form onSubmit={addAdmissionWithdrawalForm.handleSubmit}>

                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="academicYearId"
                            labelClass="required"
                            value={addAdmissionWithdrawalForm.values.academicYearId}
                            onChange={onChangeHandler}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            defaultSelect="Select"
                            labelText="Academic Year"
                            isDisabled={!!admissionWithdrawalId}
                            invalid={(addAdmissionWithdrawalForm.touched.academicYearId && addAdmissionWithdrawalForm.errors.academicYearId) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.academicYearId && addAdmissionWithdrawalForm.errors.academicYearId) ? addAdmissionWithdrawalForm.errors.academicYearId : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <AutoSearchInputUpdated
                            formgroupClassName="search-box"
                            labelClass="required"
                            name="studentId"
                            labelText="Student"
                            onChange={onInputSearchChange}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            valueKey="studentId"
                            labelHeader="Student. Code"
                            labelKey="studentCode"
                            subLabelHeader="Student Name"
                            subLabelKey="studentName"
                            isDisabled={!addAdmissionWithdrawalForm.values.academicYearId || !!admissionWithdrawalId}
                            helperText="Select academic year to search."
                            options={searchStudentAdmissionWithdrawalResp}
                            selected={searchStudentState}
                            selectedOptionCallbck={selectStudentHandler}
                            invalid={(addAdmissionWithdrawalForm.touched.studentId && addAdmissionWithdrawalForm.errors.studentId) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.studentId && addAdmissionWithdrawalForm.errors.studentId) ? addAdmissionWithdrawalForm.errors.studentId : ""}
                        >
                            <i className="ri-search-line tw-text-gray-500"></i>
                        </AutoSearchInputUpdated>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="branchCurriculumId"
                            labelClass="required"
                            value={addAdmissionWithdrawalForm.values.branchCurriculumId}
                            onChange={onChangeHandler}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            menuItems={curriculumTypes || []}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            defaultSelect="Select"
                            labelText="Curriculum"
                            isDisabled={true}
                            invalid={(addAdmissionWithdrawalForm.touched.branchCurriculumId && addAdmissionWithdrawalForm.errors.branchCurriculumId) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.branchCurriculumId && addAdmissionWithdrawalForm.errors.branchCurriculumId) ? addAdmissionWithdrawalForm.errors.branchCurriculumId : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="branchClassId"
                            labelClass="required"
                            value={addAdmissionWithdrawalForm.values.branchClassId}
                            onChange={addAdmissionWithdrawalForm.handleChange}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            menuItems={classTypes || []}
                            valueKey="id"
                            textKey="shortName"
                            defaultSelect="Select"
                            labelText="Class"
                            isDisabled={true}
                            // inputClassName="bg-light border-0"
                            invalid={(addAdmissionWithdrawalForm.touched.branchClassId && addAdmissionWithdrawalForm.errors.branchClassId) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.branchClassId && addAdmissionWithdrawalForm.errors.branchClassId) ? addAdmissionWithdrawalForm.errors.branchClassId : ""}

                        />
                    </div>

                    <div className="tw-col-span-12">
                        <DateInput
                            name="admissionWithdrawDate"
                            labelClass="required"
                            value={addAdmissionWithdrawalForm.values.admissionWithdrawDate}
                            onChange={addAdmissionWithdrawalForm.handleChange}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            labelText="Admission Withdrawal Application Date"
                            minDate={admissionWithdrawalId ? null : Current_Date_YYYYMMDD}
                            invalid={(addAdmissionWithdrawalForm.touched.admissionWithdrawDate && addAdmissionWithdrawalForm.errors.admissionWithdrawDate) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.admissionWithdrawDate && addAdmissionWithdrawalForm.errors.admissionWithdrawDate) ? addAdmissionWithdrawalForm.errors.admissionWithdrawDate : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <RadioInputContainer
                            name="studentAttendSchool"
                            labelText="Student Attended the School"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={[{ id: "YES", name: "Yes" }, { id: "NO", name: "No" }]}
                            value={addAdmissionWithdrawalForm.values.studentAttendSchool}
                            onChange={onChangeHandler}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <DateInput
                            name="lastAttendDate"
                            labelClass={addAdmissionWithdrawalForm.values.studentAttendSchool === "YES" ? "required" : ""}
                            value={addAdmissionWithdrawalForm.values.lastAttendDate}
                            onChange={addAdmissionWithdrawalForm.handleChange}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            labelText='Last Attended Date'
                            invalid={(addAdmissionWithdrawalForm.touched.lastAttendDate && addAdmissionWithdrawalForm.errors.lastAttendDate) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.lastAttendDate && addAdmissionWithdrawalForm.errors.lastAttendDate) ? addAdmissionWithdrawalForm.errors.lastAttendDate : ""}
                            // minDate={selectedAcademicYearInfoState?.startDate}
                            isDisabled={addAdmissionWithdrawalForm.values.studentAttendSchool === "NO"}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <SelectInput
                            name="classAdmitted"
                            labelClass="required"
                            value={addAdmissionWithdrawalForm.values.classAdmitted}
                            onChange={addAdmissionWithdrawalForm.handleChange}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            menuItems={classTypes}
                            valueKey="id"
                            textKey="shortName"
                            defaultSelect="Select"
                            labelText='Class Admitted'
                            // inputClassName="bg-light border-0"
                            invalid={(addAdmissionWithdrawalForm.touched.classAdmitted && addAdmissionWithdrawalForm.errors.classAdmitted) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.classAdmitted && addAdmissionWithdrawalForm.errors.classAdmitted) ? addAdmissionWithdrawalForm.errors.classAdmitted : ""}

                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <TextInput
                            name="reason"
                            labelClass="required"
                            value={addAdmissionWithdrawalForm.values.reason}
                            onChange={addAdmissionWithdrawalForm.handleChange}
                            onBlur={addAdmissionWithdrawalForm.handleBlur}
                            labelText="Reason for Admission Withdrawal"
                            helperText=''
                            invalid={(addAdmissionWithdrawalForm.touched.reason && addAdmissionWithdrawalForm.errors.reason) ? true : false}
                            error={(addAdmissionWithdrawalForm.touched.reason && addAdmissionWithdrawalForm.errors.reason) ? addAdmissionWithdrawalForm.errors.reason : ""}
                        />
                    </div>

                </div>

                <div className="tw-flex tw-justify-end tw-mt-6 tw-gap-3">
                    <Button
                        type="button"
                        variant='secondary'
                        disabled={showApiLoader}
                        onClick={toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant='primary'
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>

            </form>
        </div>

    )
}

export default AddAdmissionWithdrawalDetails
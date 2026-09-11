import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";


import * as Yup from "yup";
import { details } from "./helper";

import { toast } from "react-toastify";

import { default as EditSvg } from "../../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { Current_Date, getYearGapCurrentDate, getYyyyMmDdFormat } from "../../../../../utility/dateutility";
import { validateNumber } from "../../../../../utility/validationutility";
import { useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getStudentByIdAct, updateStudentAct, updateStudentDetailsAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { getInstAcademicYearAct } from "../../../../../store/mastersettings/instacademics/instacademicactions";
import { getBloodGroupAct, getGenderListAct, getHouseDetailsAct } from "../../../../../store/masterdata/masterdataactions";
import { DateInput, NewPhoneInput, SelectInput, TextIconInput, TextInput, TextInputWithRegex } from "../../../../../Components/Common";
import Button from "../../../../../Components/Common/Button";

const initialValues = {
    studentId: "",
    admissionNumber: "",
    admissionDate: "22-09-2020",
    studentName: "",
    aadharNumber: "",
    gender: "",
    email: "",
    phoneno: "",
    placeofBirth: "",
    bloodGroup: "O +ve",
}
interface IStudentDetails {
    divId: string;
    studentId: number;
    academicYearId: string;
    branchId: number;
    instituteId: number;
}
export default function  StudentProfile(props: IStudentDetails) {
    const dispatch = useDispatch();
    const MinDate_YYYYMMDD = "01-01-1970"
    const Max_Age_Year = 3;
    const Student_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year));
    const validationSchema = Yup.object().shape({
        aadharCardNo: Yup.string().required("Aadhar Card No is required.").min(12, "Aadhar card number should be 12 digit."),
        birthPlace: Yup.string().required("Place of Birth is required."),
        bloodGroupId: Yup.string().required("Blood Group is required."),
        houseId: Yup.string().required("House Name is required."),
    });
    const initialValues = (data?: any) => {

        return {
            studentCode: data?.studentCode || "",
            // admissionAcademicYearId: data?.admissionAcademicYearId || "",
            admissionNo: data?.admissionNo || "",
            dateOfAdmission: data?.dateOfAdmission || "",
            studentName: data?.studentName || "",
            aadharCardNo: validateNumber(data?.aadharCardNo) && data?.aadharCardNo || "",
            genderId: data?.genderId || "",
            dob: data?.dob || "",
            emailId: data?.emailId || "",
            contactNo: data?.contactNo || "",
            whatsappNo: data?.whatsappNo || "",
            birthPlace: data?.birthPlace || "",
            bloodGroupId: data?.bloodGroupId || "",
            apaarId: data?.apaarId || "",
            penNo: data?.penNo || "",
            houseId: data?.houseId || "",
        }
    }
    const [edit, setEdit] = useState(false);
    const [initialData, setInitialData] = useState(initialValues());

    const { getStudentByIdResp, bloodGroupResp, genderListResp, updateStudentResp, affectedSection, academicYearListResp, updateStudentDetailsResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId, houseDetailsResp, showApiLoader } = useAppSelector(
        ({ directoryStudent, masterData, instAcademics, appData, globalData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            updateStudentDetailsResp: directoryStudent.updateStudentDetailsResp,
            bloodGroupResp: masterData.bloodGroupResp,
            genderListResp: masterData.genderListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            houseDetailsResp: masterData.houseDetailsResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );
    const StudentDetailsRef = useRef<any>({
        preUpdateStudentDetails: updateStudentDetailsResp
    });
    const getStudentDetailsAPI = () => {
        const params = { academicYearId: props.academicYearId }
        dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
    }
    const UpdateHandler = () => {
        getStudentDetailsAPI();
        setEdit(false);
    }
    useEffect(() => {
        const { preUpdateStudentDetails } =
            StudentDetailsRef.current;
        if (updateStudentDetailsResp &&
            preUpdateStudentDetails !== updateStudentDetailsResp) {
            affectedSection === "Student Details" && toast.success("Student Details Updated successfully.");
            affectedSection === "Student Details" && UpdateHandler();
        }
        StudentDetailsRef.current.preUpdateStudentDetails = updateStudentDetailsResp;

    }, [affectedSection, updateStudentDetailsResp]);
    const studentDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            const { bloodGroupId, birthPlace, aadharCardNo, whatsappNo, apaarId, penNo, houseId } = values || {};
            const payload = {
                id: getStudentByIdResp?.studentDetails?.id,
                bloodGroup: bloodGroupId,
                placeOfBirth: birthPlace,
                aadhaarCardNumber: aadharCardNo,
                whatsappNo,
                apaarId,
                penNo,
                houseId
            }
console.log('payload',payload);

            dispatch(updateStudentDetailsAct(generateActionPayload('update_student_details', undefined, payload, {
                affectedSection: "Student Details"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        // setInitialData(initialValues(getStudentByIdResp.studentDetails));
        studentDetailsForm.setValues(initialValues(getStudentByIdResp?.studentDetails || {})).then(() => {
            studentDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        studentDetailsForm.setFieldValue(name, updateDate);
    }
    // const submitHandler=(values:any)=>{
    //     const data={
    //         branchId: 20,
    //         instituteId: 49,
    //         studentDetails:values
    //     }
    //     dispatch(updateStudentAct(generateActionPayload('update_students_by_id',undefined,values)));
    //     // setEdit(false);

    // }


    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        dispatch(getBloodGroupAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "blood-group", searchString: "", pageNo: 0, pageSize: 100, sortBy: "bloodGroupName", orderBy: "asc" })));
        dispatch(getGenderListAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "gender", searchString: "", pageNo: 0, pageSize: 100, sortBy: "genderName", orderBy: "asc" })));
    }, []);

    useEffect(() => {
        if (instituteId) {
            const payload = {
                instituteId
            }
            dispatch(getHouseDetailsAct(generateActionPayload("get_house_details", undefined, payload)));
        }
    }, [instituteId]);

    useEffect(() => {
        getStudentByIdResp && setInitialData(initialValues(getStudentByIdResp.studentDetails));
    }, [getStudentByIdResp]);
    const { data: BloodGroupData } = bloodGroupResp || {};
    const { data: GenderListData } = genderListResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    return (
        <div id={props.divId} className="tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm tw-mb-4">
            <div className="tw-flex tw-items-center tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                <h4 className="tw-text-base tw-font-semibold tw-m-0">Student Profile</h4>
                {!edit && (
                    <div className="tw-ml-auto tw-flex tw-items-center tw-cursor-pointer" onClick={EditHandler}>
                        <EditSvg />
                    </div>
                )}
            </div>
            <div className="tw-p-5">
                <div className="tw-grid tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4 tw-mb-4">
                    <div>
                        <TextInput
                            name="studentCode"
                            labelText="Student Id"
                            value={studentDetailsForm.values.studentCode}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            isReadOnly={true}
                            isDisabled={!edit}
                            invalid={
                                studentDetailsForm.touched.studentCode &&
                                    studentDetailsForm.errors.studentCode
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.studentCode &&
                                    studentDetailsForm.errors.studentCode
                                    ? studentDetailsForm.errors.studentCode
                                    : ""
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <TextInput
                            name="admissionNo"
                            labelText="Admission Number"
                            value={studentDetailsForm.values.admissionNo}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            isDisabled={true}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}                            labelClass="tw-text-gray-500"
                            maxLength={15}
                        />
                        {/* <TextInputWithRegex
                            name="admissionNo"
                            labelText="Admission Number"
                            value={studentDetailsForm.values.admissionNo}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            isReadOnly={!edit}
                            isDisabled={true}
                            invalid={
                                studentDetailsForm.touched.admissionNo &&
                                    studentDetailsForm.errors.admissionNo
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.admissionNo &&
                                    studentDetailsForm.errors.admissionNo
                                    ? studentDetailsForm.errors.admissionNo
                                    : ""
                            }
                            labelClass="text-muted"
                            allowedInputRegex="^[0-9]+$"
                            // allowedInputRegex="^\\d+$"
                            maxLength={15}
                        /> */}
                    </div>
                    <div>
                        <DateInput
                            name="dateOfAdmission"
                            value={studentDetailsForm.values.dateOfAdmission}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            // inputClassName="bg-light"
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            isReadOnly={true}
                            isDisabled={true}
                            // formgroupClassName="mb-0"
                            labelText="Admission Date"
                            invalid={
                                studentDetailsForm.touched.dateOfAdmission &&
                                    studentDetailsForm.errors.dateOfAdmission
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.dateOfAdmission &&
                                    studentDetailsForm.errors.dateOfAdmission
                                    ? studentDetailsForm.errors.dateOfAdmission
                                    : ""
                            }
                            labelClass="tw-text-gray-500"
                            maxDate={Current_Date}
                        />
                    </div>
                    <div>
                        <DateInput
                            name="dob"
                            value={studentDetailsForm.values.dob}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            // inputClassName="bg-light"
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            isReadOnly={!edit}
                            isDisabled={true}
                            // formgroupClassName="mb-0"
                            labelText="Date Of Birth"
                            maxDate={getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year))}
                            invalid={
                                studentDetailsForm.touched.dob &&
                                    studentDetailsForm.errors.dob
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.dob &&
                                    studentDetailsForm.errors.dob
                                    ? studentDetailsForm.errors.dob
                                    : ""
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <TextInput
                            name="studentName"
                            labelText="Student Name"
                            value={studentDetailsForm.values.studentName}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            isDisabled={true}
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={
                                studentDetailsForm.touched.studentName &&
                                    studentDetailsForm.errors.studentName
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.studentName &&
                                    studentDetailsForm.errors.studentName
                                    ? studentDetailsForm.errors.studentName
                                    : ""
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <TextInputWithRegex
                            name="aadharCardNo"
                            labelText="Aadhar Number"
                            value={studentDetailsForm.values.aadharCardNo}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-transparent"}`}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            invalid={
                                studentDetailsForm.touched.aadharCardNo &&
                                    studentDetailsForm.errors.aadharCardNo
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.aadharCardNo &&
                                    studentDetailsForm.errors.aadharCardNo
                                    ? studentDetailsForm.errors.aadharCardNo
                                    : ""
                            }
                            allowedInputRegex="^[0-9]+$"
                            maxLength={12}
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="genderId"
                            labelText="Gender"
                            value={studentDetailsForm.values.genderId}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            valueKey="genderId"
                            textKey="genderName"
                            menuItems={GenderListData || []}
                            invalid={
                                studentDetailsForm.touched.genderId &&
                                    studentDetailsForm.errors.genderId
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.genderId &&
                                    studentDetailsForm.errors.genderId
                                    ? studentDetailsForm.errors.genderId
                                    : ""
                            }
                            isDisabled={true}
                            labelClass="tw-text-gray-500"
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                        />
                    </div>
                    <div>
                        <TextIconInput
                            name="emailId"
                            labelText="Priority Email Id"
                            value={studentDetailsForm.values.emailId}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            isDisabled={true}
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            labelClass="tw-text-gray-500"
                            invalid={
                                studentDetailsForm.touched.emailId &&
                                    studentDetailsForm.errors.emailId
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.emailId &&
                                    studentDetailsForm.errors.emailId
                                    ? studentDetailsForm.errors.emailId
                                    : ""
                            }
                        >
                            <i className="ri-mail-unread-line"></i>
                        </TextIconInput>
                    </div>
                    <div>
                        <NewPhoneInput
                            name="contactNo"
                            labelText="SMS Priority No"
                            value={studentDetailsForm.values.contactNo}
                            onChange={onChangePhoneInput}
                            onBlur={studentDetailsForm.handleBlur}
                            isDisabled={true}
                            labelClass="tw-text-gray-500"
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={(studentDetailsForm.touched.contactNo && studentDetailsForm.errors.contactNo) ? true : false}
                            error={(studentDetailsForm.touched.contactNo && studentDetailsForm.errors.contactNo) ? studentDetailsForm.errors.contactNo : ""}
                        />
                    </div>
                    <div>
                        <NewPhoneInput
                            name="whatsappNo"
                            labelText="WhatsApp Number"
                            value={studentDetailsForm.values.whatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={studentDetailsForm.handleBlur}
                            isDisabled={!edit}
                            labelClass="tw-text-gray-500"
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-transparent"}`}
                            invalid={(studentDetailsForm.touched.whatsappNo && studentDetailsForm.errors.whatsappNo) ? true : false}
                            error={(studentDetailsForm.touched.whatsappNo && studentDetailsForm.errors.whatsappNo) ? studentDetailsForm.errors.whatsappNo : ""}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="birthPlace"
                            labelText="Place of Birth"
                            value={studentDetailsForm.values.birthPlace}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-transparent"}`}
                            invalid={
                                studentDetailsForm.touched.birthPlace &&
                                    studentDetailsForm.errors.birthPlace
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.birthPlace &&
                                    studentDetailsForm.errors.birthPlace
                                    ? studentDetailsForm.errors.birthPlace
                                    : ""
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="bloodGroupId"
                            labelText="Blood Group"
                            value={studentDetailsForm.values.bloodGroupId}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            valueKey="bloodGroupId"
                            textKey="bloodGroupName"
                            menuItems={BloodGroupData || []}
                            invalid={
                                studentDetailsForm.touched.bloodGroupId &&
                                    studentDetailsForm.errors.bloodGroupId
                                    ? true
                                    : false
                            }
                            error={
                                studentDetailsForm.touched.bloodGroupId &&
                                    studentDetailsForm.errors.bloodGroupId
                                    ? studentDetailsForm.errors.bloodGroupId
                                    : ""
                            }
                            isDisabled={!edit}
                            labelClass="tw-text-gray-500"
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-transparent"}`}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="apaarId"
                            labelText="Apaar Id"
                            value={studentDetailsForm.values.apaarId}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            isDisabled={!edit}
                            labelClass="tw-text-gray-500"
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-transparent"}`}
                        />
                    </div>
                    <div>
                        <TextInput
                            name="penNo"
                            labelText="PEN No."
                            value={studentDetailsForm.values.penNo}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            isDisabled={!edit}
                            labelClass="tw-text-gray-500"
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-transparent"}`}
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="houseId"
                            labelText="House Name"
                            value={studentDetailsForm.values.houseId}
                            onChange={studentDetailsForm.handleChange}
                            onBlur={studentDetailsForm.handleBlur}
                            valueKey="id"
                            textKey="houseName"
                            menuItems={houseDetailsResp || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-transparent"}`}
                            labelClass="tw-text-gray-500"
                            invalid={studentDetailsForm.touched.houseId && studentDetailsForm.errors.houseId ? true : false}
                            error={studentDetailsForm.touched.houseId && studentDetailsForm.errors.houseId ? studentDetailsForm.errors.houseId : ""}
                        />
                    </div>
                </div>
                {edit && (
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-pb-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={CancelHandler}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={(e: any) => studentDetailsForm.handleSubmit(e)}
                            disabled={showApiLoader}
                        >
                            Update
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
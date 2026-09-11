import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { DateInput, NewPhoneInput, SelectInput, TextIconInput, TextInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { getStudentByIdAct, updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getBloodGroupAct, getGenderListAct, getHouseDetailsAct } from "../../../../store/masterdata/masterdataactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import * as Yup from "yup";
import { details, formSectionSaveKey } from "./helper";
import { IUpdateStudentRepRef } from "./StudentInfoTypes";
import { toast } from "react-toastify";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { Current_Date, Current_Date_YYYYMMDD, getYearGapCurrentDate, getYyyyMmDdFormat } from "../../../../utility/dateutility";
import { TextInputWithRegex } from "../../../../Components/Common/TextInput";
import { validateNumber } from "../../../../utility/validationutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";
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
    canCreateAndUpdate: boolean
}
export default function StudentDetails(props: IStudentDetails) {
    const dispatch = useDispatch();
    const MinDate_YYYYMMDD = "01-01-1970"
    const Max_Age_Year = 3;
    const Student_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year));
    const validationSchema = Yup.object().shape({
        // studentCode: Yup.string().required("Student Id required."),
        // admissionNo: Yup.string().required("Admission No is required."),
        admissionAcademicYearId: Yup.string().required("Admission Academic Year is required."),
        dateOfAdmission: Yup.string().required("Date Of Admission is required."),
        studentName: Yup.string().required("Student Name is required."),
        aadharCardNo: Yup.string().required("Aadhar Card No is required.").min(12, "Aadhar card number should be 12 digit."),
        genderId: Yup.string().required("Gender is required."),
        // dob: Yup.date().min(MinDate_YYYYMMDD, `DOB should be more than ${MinDate_YYYYMMDD}.`)
        //     .max(Student_Dob_MaxDate_YYYYMMDD, `Student age should be greater than ${Max_Age_Year} year.`).required("Select dob."),
        dob: Yup.date().min(MinDate_YYYYMMDD, `DOB should be more than ${MinDate_YYYYMMDD}.`)
            .max(Current_Date_YYYYMMDD, `DOB should be less than current date.`).required("Select dob."),
        emailId: Yup.string().email("Invalid Email.").required('Email Id is required.'),
        contactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Phone number required.").nullable(),
        whatsappNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'WhatsApp number with 10 digit is valid.').required("WhatsApp number required.").nullable(),
        birthPlace: Yup.string().required("Place of Birth is required."),
        bloodGroupId: Yup.string().required("Blood Group is required."),
        // apaarId: Yup.string().required("Apaar Id is required."),
        // udiseCodes: Yup.string().required("Udise Code is required."),
        // penNo: Yup.string().required("Pen Number is required."),
    });
    const initialValues = (data?: any) => {
        return {
            studentCode: data?.studentCode || "",
            admissionAcademicYearId: data?.admissionAcademicYearId || "",
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
            // udiseCodes: data?.udiseCodes || "",
            penNo: data?.penNo || "",
            rfid: data?.rfid || "",
            houseId: data?.houseId || "",
        }
    }
    const [edit, setEdit] = useState(false);
    const [initialData, setInitialData] = useState(initialValues());

    const { getStudentByIdResp, bloodGroupResp, genderListResp, updateStudentResp, affectedSection, academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId, houseDetailsResp } = useAppSelector(
        ({ directoryStudent, masterData, instAcademics, appData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            bloodGroupResp: masterData.bloodGroupResp,
            genderListResp: masterData.genderListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            houseDetailsResp: masterData.houseDetailsResp
        }),
        shallowEqual
    );
    const StudentDetailsRef = useRef<IUpdateStudentRepRef>({
        preUpdateStudentDetails: updateStudentResp
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

        if (updateStudentResp &&
            preUpdateStudentDetails !== updateStudentResp) {
            affectedSection === "Student Details" && toast.success("Student Details Updated successfully.");
            affectedSection === "Student Details" && UpdateHandler();
        }
        StudentDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
    }, [affectedSection, updateStudentResp]);
    const studentDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {

            let formData = new FormData();
            const data: any = details(getStudentByIdResp, values, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.studentProfile);
            formData.append("studentRequest", JSON.stringify(data));
            console.log(data);

            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Student Details"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        studentDetailsForm.setValues(initialValues(getStudentByIdResp.studentDetails)).then(() => {
            studentDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        studentDetailsForm.setFieldValue(name, updateDate);
    }

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
        <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
            {/* Header */}
            <div className="tw-flex tw-items-center tw-border-b tw-px-6 tw-py-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Student Profile
                </h4>

                {props.canCreateAndUpdate && !edit && (
                    <div
                        className="tw-ml-auto tw-flex tw-items-center tw-cursor-pointer tw-text-gray-500 hover:tw-text-gray-700"
                        onClick={EditHandler}
                    >
                        <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            size={18}
                            className="tw-mr-2"
                        />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-4 tw-mb-6">

                    <TextInput
                        name="studentCode"
                        labelText="Student Id"
                        value={studentDetailsForm.values.studentCode}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : "bg-light"}`}
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
                        labelClass="text-muted" />

                    <SelectInput
                        name="admissionAcademicYearId"
                        value={studentDetailsForm.values.admissionAcademicYearId}
                        onBlur={studentDetailsForm.handleBlur}
                        onChange={studentDetailsForm.handleChange}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect={"Academic Year"}
                        labelClass={"text-muted"}
                        isDisabled={true}
                        inputClassName={edit ? "bg-light" : "border-0 border-bottom bg-transparent bg-img-none"}
                        labelText="Admission Academic Year"
                    />

                    <TextInput
                        name="admissionNo"
                        labelText="Admission Number"
                        value={studentDetailsForm.values.admissionNo}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        labelClass="text-muted"
                        maxLength={15}
                    />

                    <DateInput
                        name="dateOfAdmission"
                        value={studentDetailsForm.values.dateOfAdmission}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        // inputClassName="bg-light"
                        inputClassName={'bg-transparent ' + `${!edit ? 'border-0 border-bottom rounded-0' : ""}`}
                        isReadOnly={!edit}
                        // formgroupClassName="tw-mb-0"
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
                        labelClass="text-muted"
                        maxDate={Current_Date}
                    />

                    <DateInput
                        name="dob"
                        value={studentDetailsForm.values.dob}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        // inputClassName="bg-light"
                        inputClassName={'bg-transparent ' + `${!edit ? 'border-0 border-bottom rounded-0' : ""}`}
                        isReadOnly={!edit}
                        // formgroupClassName="tw-mb-0"
                        labelText="Date Of Birth"
                        // maxDate={getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year))}
                        maxDate={Current_Date_YYYYMMDD}
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
                        labelClass="text-muted"
                    />

                    <TextInput
                        name="studentName"
                        labelText="Student Name"
                        value={studentDetailsForm.values.studentName}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
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
                        labelClass="text-muted" />

                    <TextInputWithRegex
                        name="aadharCardNo"
                        labelText="Aadhar Number"
                        value={studentDetailsForm.values.aadharCardNo}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
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
                        labelClass="text-muted"
                        allowedInputRegex="^[0-9]+$"
                        // allowedInputRegex="^\\d+$"
                        maxLength={12}
                    />

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
                        isDisabled={!edit}
                        labelClass={"text-muted"}
                        inputClassName={edit ? "bg-transparent" : "border-0 border-bottom bg-transparent bg-img-none"}
                    />
                    <TextIconInput
                        name="emailId"
                        labelText="Priority Email Id"
                        value={studentDetailsForm.values.emailId}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
                        labelClass="text-muted"
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

                    <NewPhoneInput
                        name="contactNo"
                        labelText="SMS Priority No"
                        value={studentDetailsForm.values.contactNo}
                        onChange={onChangePhoneInput}
                        onBlur={studentDetailsForm.handleBlur}
                        isDisabled={!edit}
                        labelClass="text-muted"
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent phone_no' : ""}`}
                        invalid={(studentDetailsForm.touched.contactNo && studentDetailsForm.errors.contactNo) ? true : false}
                        error={(studentDetailsForm.touched.contactNo && studentDetailsForm.errors.contactNo) ? studentDetailsForm.errors.contactNo : ""}
                    />

                    <NewPhoneInput
                        name="whatsappNo"
                        labelText="WhatsApp Number"
                        value={studentDetailsForm.values.whatsappNo}
                        onChange={onChangePhoneInput}
                        onBlur={studentDetailsForm.handleBlur}
                        isDisabled={!edit}
                        labelClass="text-muted"
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent phone_no' : ""}`}
                        invalid={(studentDetailsForm.touched.whatsappNo && studentDetailsForm.errors.whatsappNo) ? true : false}
                        error={(studentDetailsForm.touched.whatsappNo && studentDetailsForm.errors.whatsappNo) ? studentDetailsForm.errors.whatsappNo : ""}
                    />

                    <TextInput
                        name="birthPlace"
                        labelText="Place of Birth"
                        value={studentDetailsForm.values.birthPlace}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
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
                        labelClass="text-muted" />

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
                        labelClass={"text-muted"}
                        inputClassName={edit ? "bg-transparent" : "border-0 border-bottom bg-transparent bg-img-none"}
                    />

                    <TextInput
                        name="apaarId"
                        labelText="Apaar Id"
                        value={studentDetailsForm.values.apaarId}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
                        invalid={
                            studentDetailsForm.touched.apaarId &&
                                studentDetailsForm.errors.apaarId
                                ? true
                                : false
                        }
                        error={
                            studentDetailsForm.touched.apaarId &&
                                studentDetailsForm.errors.apaarId
                                ? studentDetailsForm.errors.apaarId
                                : ""
                        }
                        labelClass="text-muted" />

                    <TextInput
                        name="penNo"
                        labelText="PEN Number"
                        value={studentDetailsForm.values.penNo}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}

                        labelClass="text-muted" />
                    <TextInput
                        name="rfid"
                        labelText="RFID"
                        value={studentDetailsForm.values.rfid}
                        onChange={studentDetailsForm.handleChange}
                        onBlur={studentDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`${!edit ? 'border-0 border-bottom rounded-0 bg-transparent' : ""}`}
                        labelClass="text-muted" />
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
                        inputClassName={
                            !edit
                                ? "!tw-bg-transparent  !tw-border-0 !tw-border-b !tw-rounded-none"
                                : "!tw-bg-transparent"
                        }
                        labelClass="tw-text-gray-500"
                        defaultSelect="-"
                    />
                </div>

                {edit && (
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-4">
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
                        >
                            Update
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}
import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, UploadImageUpdated,
    TextInputWithRegex
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../utility/commonutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Utility 
import { Min_Date, MinDate_YYYYMMDD, Max_Date, Current_Date, getYyyyMmDdFormat, getYearGapCurrentDate, Current_Date_YYYYMMDD } from "../../../../../utility/dateutility";

const Max_Age_Year = 4;
const Student_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Age_Year));

const validationSchema = Yup.object().shape({
    admissionAcademicYearId: Yup.string().required("Select academic year."),
    dateOfAdmission: Yup.date().required('Date of admission required.')
        .min(MinDate_YYYYMMDD, `Date of admission should be more than ${Min_Date}.`).max(Current_Date_YYYYMMDD, `Date of admission cannot be future date.`),
    studentName: Yup.string().required("Student name required."),
    aadharCardNo: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    genderId: Yup.string().required("Select gender."),
    dob: Yup.date().required("Select dob."),
    emailId: Yup.string().email('Invalid Email.').required("Email id required."),
    contactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'SMS Priority No. with 10 digit is valid.').required("SMS Priority No. is required."),
    birthPlace: Yup.string().required("Birth place required."),
    bloodGroupId: Yup.string().required("Select blood group."),
});

function getInitialState(initialState: any) {
    return {
        id: initialState?.id || undefined,
        admissionAcademicYearId: initialState?.admissionAcademicYearId || "",
        admissionNo: initialState?.admissionNo || "",
        dateOfAdmission: initialState?.dateOfAdmission || "",
        studentName: initialState?.studentName || "",
        aadharCardNo: initialState?.aadharCardNo || "",
        genderId: initialState?.genderId || "",
        dob: initialState?.dob || "",
        emailId: initialState?.emailId || "",
        contactNo: initialState?.contactNo || "",
        birthPlace: initialState?.birthPlace || "",
        bloodGroupId: initialState?.bloodGroupId || "",
        studentCode: initialState?.studentCode || undefined,
        studentCodeNum: initialState?.studentCodeNum || undefined,
        apaarId : initialState?.apaarId || "",
        penNo: initialState?.penNo || "",
        rfid: initialState?.rfid || "",
    }
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
export default function BasicDetails({ instituteId }: any) {
    const [basicDetailsState, setBasicDetailsState] = useState<any>(getInitialState(undefined));
    const { currentMultiFormKeys, editStudentData,
        storeMultiFormData } = useContext<any>(StepperFormContext);
    const [studentImgFileState, setStudentImgFileState] = useState<any>("");
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");
    const studentImgFileRef = useRef<any>(null);

    const [studentUniqueCode, setStudentUnqiueCode] = useState(randomIntFromInterval(500, 1000));
    const dispatch = useAppDispatch();
    const { genderListResp, bloodGroupResp,
        academicYearListResp, instAcademicErrorResp, masterDataErrorResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            genderListResp: masterData.genderListResp,
            bloodGroupResp: masterData.bloodGroupResp,
            academicYearListResp: instAcademics.academicYearListResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
            masterDataErrorResp: masterData.masterDataErrorResp
        }), shallowEqual);

    useEffect(() => {
        const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 100 };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
        dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group", sortBy: "bloodGroupName", orderBy: "asc" })));
    }, []);


    const basicDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: basicDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            const { studentDetails } = editStudentData || {},
                { formData } = studentDetails || {};
            const payload = {
                studentImage: studentImgFileRef.current,
                studentImageBase64: studentImgFileRef.current ? "" : formData?.studentImageBase64,
                ...values
            }
            storeMultiFormData("studentDetails", true, payload);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("studentDetails"))
            basicDetailsForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        const { studentDetails } = editStudentData || {},
            { formData } = studentDetails || {};
        if (formData) {
            const { studentImageBase64, studentImage, ...otherInfo } = formData;
            if (studentImageBase64) {
                setStudentImgFileState(`data:image/jpeg;base64, ${studentImageBase64}`);
            } else if (studentImage) {
                studentImgFileRef.current = studentImage;
                setStudentImgFileState(URL.createObjectURL(studentImage));
            }
            setBasicDetailsState(getInitialState(otherInfo))
        }
    }, [editStudentData]);

    useEffect(() => {
        if(academicYearListResp){
            const { data } = academicYearListResp;
            if(Array.isArray(data) && data.length > 0){
                const currentAcademicYear = data.find((item: any) => item.yearStatus === "CURRENT");
                if(currentAcademicYear){
                    basicDetailsForm.setFieldValue("admissionAcademicYearId", currentAcademicYear.academicYearId);
                }
            }
        }
    },[academicYearListResp])

    

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        basicDetailsForm.setFieldValue(name, updateDate);
    }

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            return;
        }
        setFileUploadErrorMessageState("");
        studentImgFileRef.current = event.target.files[0];
        setStudentImgFileState(URL.createObjectURL(file));
    }

    return (
        <form onSubmit={basicDetailsForm.handleSubmit} noValidate>
            <AccordionHeader tag="span" className="fs-normal" targetId="basic-details">
                Basic Details
            </AccordionHeader>
            <AccordionBody accordionId="basic-details">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-4 tw-flex tw-flex-col">
                        <UploadImageUpdated
                            name="student-image"
                            acceptFileFormat=" image/jpg, image/png, image/jpeg"
                            value={studentImgFileState}
                            onChange={handleFileUploadHnlr}
                            error={fileUploadErrorMessageState}
                        />
                    </div>

                    <div className="tw-col-span-8">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-6">
                                <TextInput
                                    name="id"
                                    labelText="Student ID"
                                    value={basicDetailsForm.values.id}
                                    onChange={basicDetailsForm.handleChange}
                                    onBlur={basicDetailsForm.handleBlur}
                                    // invalid={(basicDetailsForm.touched.studentId && basicDetailsForm.errors.studentId) ? true : false}
                                    // error={(basicDetailsForm.touched.studentId && basicDetailsForm.errors.studentId) ? basicDetailsForm.errors.studentId : ""}
                                    isReadOnly={true}
                                />
                            </div>

                            <div className="tw-col-span-6">
                                <SelectInput
                                    name="admissionAcademicYearId"
                                    labelText="Academic Year"
                                    // formgroupClassName="mb-4"
                                    value={basicDetailsForm.values.admissionAcademicYearId}
                                    onChange={basicDetailsForm.handleChange}
                                    onBlur={basicDetailsForm.handleBlur}
                                    invalid={(basicDetailsForm.touched.admissionAcademicYearId && basicDetailsForm.errors.admissionAcademicYearId) ? true : false}
                                    error={(basicDetailsForm.touched.admissionAcademicYearId && basicDetailsForm.errors.admissionAcademicYearId) ? basicDetailsForm.errors.admissionAcademicYearId : ""}
                                    menuItems={academicYearListResp?.data}
                                    // defaultSelect="Academic Year"
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    labelClass="required"
                                    isReadOnly
                                    isDisabled
                                />
                            </div>

                            <div className="tw-col-span-6">
                                <TextInputWithRegex
                                    name="admissionNo"
                                    labelText="Admission No"
                                    // formgroupClassName="mb-4"
                                    value={basicDetailsForm.values.admissionNo}
                                    onChange={basicDetailsForm.handleChange}
                                    onBlur={basicDetailsForm.handleBlur}
                                    // invalid={(basicDetailsForm.touched.admissionNo && basicDetailsForm.errors.admissionNo) ? true : false}
                                    // error={(basicDetailsForm.touched.admissionNo && basicDetailsForm.errors.admissionNo) ? basicDetailsForm.errors.admissionNo : ""}
                                    allowedInputRegex="^[0-9]+$"
                                    maxLength={20}
                                />
                            </div>

                            <div className="tw-col-span-6">
                                <DateInput
                                    name="dateOfAdmission"
                                    labelText="Date of Admission"
                                    // formgroupClassName="mb-4"
                                    value={basicDetailsForm.values.dateOfAdmission}
                                    onChange={basicDetailsForm.handleChange}
                                    onBlur={basicDetailsForm.handleBlur}
                                    invalid={(basicDetailsForm.touched.dateOfAdmission && basicDetailsForm.errors.dateOfAdmission) ? true : false}
                                    error={(basicDetailsForm.touched.dateOfAdmission && basicDetailsForm.errors.dateOfAdmission) ? basicDetailsForm.errors.dateOfAdmission : ""}
                                    maxDate={Current_Date}
                                    labelClass="required"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-4">
                    <div className="tw-col-span-4">
                        <TextInput
                            name="studentName"
                            labelText="Student Name"
                            value={basicDetailsForm.values.studentName}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            labelClass="required"
                            invalid={(basicDetailsForm.touched.studentName && basicDetailsForm.errors.studentName) ? true : false}
                            error={(basicDetailsForm.touched.studentName && basicDetailsForm.errors.studentName) ? basicDetailsForm.errors.studentName : ""}
                        // helperText="Full name as displayed on Aadhar Number"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInputWithRegex
                            name="aadharCardNo"
                            labelText="Aadhar Number"
                            value={basicDetailsForm.values.aadharCardNo}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.aadharCardNo && basicDetailsForm.errors.aadharCardNo) ? true : false}
                            error={(basicDetailsForm.touched.aadharCardNo && basicDetailsForm.errors.aadharCardNo) ? basicDetailsForm.errors.aadharCardNo : ""}
                            maxLength={12}
                            labelClass="required"
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="genderId"
                            labelText="Gender"
                            value={basicDetailsForm.values.genderId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? true : false}
                            error={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? basicDetailsForm.errors.genderId : ""}
                            menuItems={genderListResp?.data}
                            valueKey="genderId"
                            textKey="genderName"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <DateInput
                            name="dob"
                            labelText="DOB"
                            value={basicDetailsForm.values.dob}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            invalid={(basicDetailsForm.touched.dob && basicDetailsForm.errors.dob) ? true : false}
                            error={(basicDetailsForm.touched.dob && basicDetailsForm.errors.dob) ? basicDetailsForm.errors.dob : ""}
                            maxDate={Student_Dob_MaxDate_YYYYMMDD}
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextIconInput
                            name="emailId"
                            labelText="Priority Email Id"
                            value={basicDetailsForm.values.emailId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            labelClass="required"
                            invalid={(basicDetailsForm.touched.emailId && basicDetailsForm.errors.emailId) ? true : false}
                            error={(basicDetailsForm.touched.emailId && basicDetailsForm.errors.emailId) ? basicDetailsForm.errors.emailId : ""}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>

                    <div className="tw-col-span-4">
                        <PhoneInput
                            name="contactNo"
                            labelText="SMS Priority No."
                            value={basicDetailsForm.values.contactNo}
                            onChange={onChangePhoneInput}
                            onBlur={basicDetailsForm.handleBlur}
                            labelClass="required"
                            invalid={(basicDetailsForm.touched.contactNo && basicDetailsForm.errors.contactNo) ? true : false}
                            error={(basicDetailsForm.touched.contactNo && basicDetailsForm.errors.contactNo) ? basicDetailsForm.errors.contactNo : ""}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="birthPlace"
                            labelText="Place of Birth"
                            value={basicDetailsForm.values.birthPlace}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            labelClass="required"
                            invalid={(basicDetailsForm.touched.birthPlace && basicDetailsForm.errors.birthPlace) ? true : false}
                            error={(basicDetailsForm.touched.birthPlace && basicDetailsForm.errors.birthPlace) ? basicDetailsForm.errors.birthPlace : ""}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="bloodGroupId"
                            labelText="Blood Group"
                            value={basicDetailsForm.values.bloodGroupId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                            labelClass="required"
                            invalid={(basicDetailsForm.touched.bloodGroupId && basicDetailsForm.errors.bloodGroupId) ? true : false}
                            error={(basicDetailsForm.touched.bloodGroupId && basicDetailsForm.errors.bloodGroupId) ? basicDetailsForm.errors.bloodGroupId : ""}
                            menuItems={bloodGroupResp?.data}
                            valueKey="bloodGroupId"
                            textKey="bloodGroupName"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="apaarId"
                            labelText="Apaar Id"
                            value={basicDetailsForm.values.apaarId}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}                            
                            />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="penNo"
                            labelText="Pen No."
                            value={basicDetailsForm.values.penNo}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="rfid"
                            labelText="RFID"
                            value={basicDetailsForm.values.rfid}
                            onChange={basicDetailsForm.handleChange}
                            onBlur={basicDetailsForm.handleBlur}
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" value="Submit Basic Details" />
                    </div> */}


                </div>
            </AccordionBody>
        </form>
    )
}
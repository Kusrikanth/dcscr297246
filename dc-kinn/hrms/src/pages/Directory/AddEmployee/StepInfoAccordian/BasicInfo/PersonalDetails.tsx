import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { prepareDataForValidation, useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex, UploadImageUpdated,
    AutoSearchInputUpdated
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions,
    maritalStatus
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../utility/commonutility";
import {
    Min_Date_Employee, Current_Date_YYYYMMDD, MinEmployee_YYYYMMDD,
    Current_Date_DDMMYYYY, getYearGapCurrentDate, getYyyyMmDdFormat, getDdMmYyyyFormat
} from "../../../../../utility/dateutility";

import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct, getCasteListAct,
    getMaritalStatusAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstRoleTypeAct
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getAllCompaniesListAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";

//Old Data
// function getInitialState(initialState: any) {
//     return {
//         admissionAcademicYearId: initialState?.admissionAcademicYearId || "1",
//         admissionNo: initialState?.admissionNo || "2432",
//         dateOfAdmission: initialState?.dateOfAdmission || "2023-01-15T09:45:00",
//         studentName: initialState?.studentName || "Student Name",
//         aadharCardNo: initialState?.aadharCardNo || "123456789012",
//         genderId: initialState?.genderId || "1",
//         dob: initialState?.dob || "1980-10-01T09:45:00",
//         emailId: initialState?.emailId || "stesting@gmail.com",
//         contactNo: initialState?.contactNo || "1234567890",
//         birthPlace: initialState?.birthPlace || "Shars",
//         bloodGroupId: initialState?.bloodGroupId || "1",
//     }
// }

const Max_Job_Year = 18;
const Employee_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Job_Year));

const validationSchema = Yup.object().shape({
    employeeName: Yup.string().required("Employee name required."),
    dob: Yup.date().min(MinEmployee_YYYYMMDD, `DOB should be more than ${Min_Date_Employee}.`)
        .max(Employee_Dob_MaxDate_YYYYMMDD, `Employee age should be greater than ${Max_Job_Year} year.`).required("Date of birth required."),
    genderId: Yup.string().required("Select gender."),
    nationalityId: Yup.string().required("Select nationality."),
    religionId: Yup.string().required("Select religion."),
    casteId: Yup.string().required("Select caste."),
    maritalStatusId: Yup.string().required("Select marital status."),
    personalEmailId: Yup.string().email("Invalid Email.").required("Email id required."),
    aadharNo: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    contactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    bloodGroupId: Yup.string().required("Select blood group."),
    identificationMark1: Yup.string().required("Identification required."),
    companyId: Yup.string().nullable().when('isOtherEmployee', {
        is: 'true',
        then: Yup.string().required('Company is required.'),
        otherwise: Yup.string().nullable(), })
    // .test("identificationMark1Check", "Identification mark 1 cannot be same as identification mark 2.",
    //     (value: any, schema: any) => {
    //         if (value && value?.toLowerCase() === schema.parent?.identificationMark2?.toLowerCase()) {
    //             return false
    //         }
    //         return true;
    //     })
    ,
    identificationMark2: Yup.string().test("identificationMark2Check", "Identification mark 2 cannot be same as identification mark 1.",
        (value: any, schema: any) => {
            if (value && value?.toLowerCase() === schema.parent?.identificationMark1?.toLowerCase()) {
                return false
            }
            return true;
        }),
    // identificationMark2: Yup.string().when("identificationMark1", {
    //     is: (val: string) => (val && val.length > 0 ? true : false),
    //     then: Yup.string().notOneOf(
    //         [Yup.ref("identificationMark1")],
    //         "Identification mark 2 cannot be same as identification mark 1."
    //     )
    // }),
    // identificationMark2: Yup.string().when(["identificationMark1"], (identificationMark1: any, schema: any) => {
    //     return schema.notOneOf([identificationMark1], "Identification mark 2 cannot be same as identification mark 1.");
    // }),
    // userTypeId: Yup.string().required("Select user type."),
});


function getInitialState(initialState?: any) {
     const currentPath = window.location.pathname;
    let defaultIsOtherEmployee = "false";
    if (currentPath.includes("other-employee/add-other-employee")) {
        defaultIsOtherEmployee = "true";
    } else if (currentPath.includes("employee-management/add-employee")) {
        defaultIsOtherEmployee = "false";
    }
    return {
        id: initialState?.id || undefined,
        employeeName: initialState?.employeeName || "",
        dob: initialState?.dob || "",
        genderId: initialState?.genderId || "",
        nationalityId: initialState?.nationalityId || "",
        religionId: initialState?.religionId || "",
        casteId: initialState?.casteId || "",
        maritalStatusId: initialState?.maritalStatusId || "",
        personalEmailId: initialState?.personalEmailId || "",
        aadharNo: initialState?.aadharNo || "",
        contactNo: initialState?.contactNo || "",
        bloodGroupId: initialState?.bloodGroupId || "",
        identificationMark1: initialState?.identificationMark1 || "",
        identificationMark2: initialState?.identificationMark2 || "",
        userTypeId: initialState?.userTypeId || "",
        employeeCode: initialState?.employeeCode || undefined,
        employeeCodeNum: initialState?.employeeCodeNum || undefined,
        isOtherEmployee: initialState?.isOtherEmployee !== undefined 
            ? initialState?.isOtherEmployee 
            : defaultIsOtherEmployee,
        companyId: initialState?.companyId || "",
    }
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
export default function PersonalDetails({ branchId, instituteId }: any) {
    const [personalDetailsState, setPersonalDetailsState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);
    const [employeeImgFileState, setEmployeeImgFileState] = useState<any>("");
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");
    const employeeImgFileRef = useRef<any>(null);
    const [currentJobState, setCurrentJobState] = useState<any>(getInitialState());
    const [searchCompany, setSearchCompany] = useState(undefined);

    const [employeeUniqueCode, setEmployeeUnqiueCode] = useState(randomIntFromInterval(1000, 2000));
    const dispatch = useAppDispatch();
    const { genderListResp, bloodGroupResp,
        nationalityResp, religionResp, casteListResp, maritalStatusResp, instRoleTypeListResp, getAllCompaniesllListResp } =
        useAppSelector(({ masterData, instituteInfo, instAcademics, directoryEmployee }) => ({
            genderListResp: masterData.genderListResp,
            bloodGroupResp: masterData.bloodGroupResp,
            nationalityResp: masterData.nationalityResp,
            religionResp: masterData.religionResp,
            casteListResp: masterData.casteListResp,
            maritalStatusResp: masterData.maritalStatusResp,
            instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
            getAllCompaniesllListResp: directoryEmployee.getAllCompaniesllListResp,
        }), shallowEqual);

    useEffect(() => {
        const payload = { instituteId, pageNo: 0, pageSize: 100 };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getReligionAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "religion", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group", sortBy: "bloodGroupName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getNationalityAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "nationality", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getCasteListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "caste", sortBy: "casteName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        // dispatch(getCasteListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "caste", pageNo: 0, pageSize: 100 })));
        dispatch(getInstRoleTypeAct(generateActionPayload("get_inst_role_type", { roleType: "EMPLOYEE" }, { pageNo: 0, pageSize: 100 })));
        dispatch(getMaritalStatusAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "MARITAL-STATUS", sortBy: "name", orderBy: "asc", pageNo: 0, pageSize: 100 })));
    }, []);


    const personalDetailsFrom = useFormik({
        enableReinitialize: true,
        initialValues: personalDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            const { employeeBasicDetails } = editEmployeeData || {},
                { formData } = employeeBasicDetails || {},
                { fullImageBase64 } = formData || {};
            const payload = {
                employeeImage: employeeImgFileRef.current,
                fullImageBase64: employeeImgFileRef.current ? "" : fullImageBase64,
                ...values
            };
            if(!payload.companyId){
                delete payload.companyId;
            }
            storeMultiFormData("employeeBasicDetails", true, payload);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeBasicDetails")) {
            personalDetailsFrom.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        const { employeeBasicDetails } = editEmployeeData || {},
            { formData } = employeeBasicDetails || {};
        if (formData) {
            const { fullImageBase64, employeeImage, ...otherInfo } = formData;
            // employeeImgFileRef.current = employeeImage;
            if (fullImageBase64) {
                setEmployeeImgFileState(`data:image/jpeg;base64, ${fullImageBase64}`);
            } else if (employeeImage) {
                employeeImgFileRef.current = employeeImage;
                setEmployeeImgFileState(URL.createObjectURL(employeeImage));
            }
            setPersonalDetailsState(getInitialState(otherInfo))
        }
    }, [editEmployeeData]);

    function onChangePhoneHndlr(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        personalDetailsFrom.setFieldValue(name, updateDate);
    }

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            return;
        }
        setFileUploadErrorMessageState("");
        employeeImgFileRef.current = event.target.files[0];
        setEmployeeImgFileState(URL.createObjectURL(file));
    }
    
    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const payload2 = { instituteId, searchString: inputString, };
            dispatch(getAllCompaniesListAct(generateActionPayload("get_all_complanies", undefined, payload2)));
        }
    }

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeCurrentJob } = editEmployeeData;
            const { formData } = employeeCurrentJob || {};
            if (formData) {
                setCurrentJobState(getInitialState(formData));
                if (formData.companyId) {
                    const selectedCompany = getAllCompaniesllListResp?.data?.find(
                        (company: any) => company.companyId === formData.companyId
                    );
                    setSearchCompany(selectedCompany || null);
                }
            }
        }
    }, [editEmployeeData, getAllCompaniesllListResp]);

    function selectCompanyHndlr(selectedCompany: any) {
        setSearchCompany(selectedCompany);
        personalDetailsFrom.setValues((prevState: any) => ({
            ...prevState,
            companyId: selectedCompany ? selectedCompany.companyId : ""
        }));
    }

    return (
        <form onSubmit={personalDetailsFrom.handleSubmit}>
            <AccordionHeader tag="span" className="tw-text-base" targetId="personal-details">
                Personal Details
            </AccordionHeader>
            <AccordionBody accordionId="personal-details">
                <div className="tw-grid tw-grid-cols-12 tw-mb-2">
                    <div className="tw-col-span-12 md:tw-col-span-4 tw-px-2">
                        <div>
                            <UploadImageUpdated
                                name="employee-image"
                                acceptFileFormat=" image/jpg, image/png, image/jpeg"
                                value={employeeImgFileState}
                                onChange={handleFileUploadHnlr}
                                error={fileUploadErrorMessageState}
                            />
                        </div>
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-8 tw-px-2">
                        <div className="tw-grid tw-grid-cols-12 tw--mx-2">
                            <div className="tw-col-span-12 md:tw-col-span-6">
                                <RadioInputContainer
                                    name="isOtherEmployee"
                                    labelText="Is Other Employee?"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                                    value={personalDetailsFrom.values.isOtherEmployee}
                                    onChange={personalDetailsFrom.handleChange}
                                />
                            </div>
                            {personalDetailsFrom.values.isOtherEmployee === "true" && (
                                    <div className="tw-col-span-12 md:tw-col-span-6 tw-px-2">
                                        <AutoSearchInputUpdated
                                            formgroupClassName="search-box"
                                            name="companyId"
                                            placeHolder="Search..."
                                            onChange={onInputSearchChange}
                                            onBlur={personalDetailsFrom.handleBlur}
                                            labelText="Company"
                                            valueKey="companyId"
                                            labelHeader="Branch Name"
                                            labelKey="branchName"
                                            subLabelHeader="Company Name"
                                            subLabelKey="companyName"
                                            options={(Array.isArray(getAllCompaniesllListResp?.data) && getAllCompaniesllListResp?.data) || []}
                                            selected={searchCompany}
                                            selectedOptionCallbck={selectCompanyHndlr}
                                            invalid={personalDetailsFrom.touched.companyId && personalDetailsFrom.errors.companyId ? true : false}
                                            error={personalDetailsFrom.touched.companyId && personalDetailsFrom.errors.companyId ? personalDetailsFrom.errors.companyId : ""}
                                            labelClass="required"
                                        >
                                            <i className="ri-search-line search-icon"></i>
                                        </AutoSearchInputUpdated>
                                    </div>
                            )}
                            <div className="tw-col-span-12 tw-px-2">
                                <TextInput
                                    name="employeeName"
                                    labelText="Employee Name"
                                    value={personalDetailsFrom.values.employeeName}
                                    onChange={personalDetailsFrom.handleChange}
                                    onBlur={personalDetailsFrom.handleBlur}
                                    invalid={(personalDetailsFrom.touched.employeeName && personalDetailsFrom.errors.employeeName) ? true : false}
                                    error={(personalDetailsFrom.touched.employeeName && personalDetailsFrom.errors.employeeName) ? personalDetailsFrom.errors.employeeName : ""}
                                    labelClass="required"
                                />
                            </div>
                            {/* <div className="tw-w-full md:tw-w-6/12 tw-px-2">
                        <TextInput
                            name="employeeId"
                            labelText="Employee ID"
                            value={employeeUniqueCode}
                            onChange={personalDetailsFrom.handleChange}
                            invalid={(personalDetailsFrom.touched.employeeId && personalDetailsFrom.errors.employeeId) ? true : false}
                            error={(personalDetailsFrom.touched.employeeId && personalDetailsFrom.errors.employeeId) ? personalDetailsFrom.errors.employeeId : ""}
                            isReadOnly={true}
                        />
                    </div> */}
                        </div>
                    </div>
                </div>
                <div className="tw-flex tw-flex-wrap tw--mx-2">
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="genderId"
                            labelText="Gender"
                            value={personalDetailsFrom.values.genderId}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.genderId && personalDetailsFrom.errors.genderId) ? true : false}
                            error={(personalDetailsFrom.touched.genderId && personalDetailsFrom.errors.genderId) ? personalDetailsFrom.errors.genderId : ""}
                            menuItems={genderListResp?.data}
                            valueKey="genderId"
                            textKey="genderName"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <DateInput
                            name="dob"
                            labelText="Date Of Birth"
                            value={personalDetailsFrom.values.dob}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.dob && personalDetailsFrom.errors.dob) ? true : false}
                            error={(personalDetailsFrom.touched.dob && personalDetailsFrom.errors.dob) ? personalDetailsFrom.errors.dob : ""}
                            maxDate={Employee_Dob_MaxDate_YYYYMMDD}
                            labelClass="required"
                            isEmployee={true}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInputWithRegex
                            name="aadharNo"
                            labelText="Aadhar No"
                            value={personalDetailsFrom.values.aadharNo}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.aadharNo && personalDetailsFrom.errors.aadharNo) ? true : false}
                            error={(personalDetailsFrom.touched.aadharNo && personalDetailsFrom.errors.aadharNo) ? personalDetailsFrom.errors.aadharNo : ""}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={12}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextIconInput
                            name="personalEmailId"
                            labelText="Email-Id"
                            value={personalDetailsFrom.values.personalEmailId}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.personalEmailId && personalDetailsFrom.errors.personalEmailId) ? true : false}
                            error={(personalDetailsFrom.touched.personalEmailId && personalDetailsFrom.errors.personalEmailId) ? personalDetailsFrom.errors.personalEmailId : ""}
                            labelClass="required"
                            maxLength={200}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <PhoneInput
                            name="contactNo"
                            labelText="Phone No"
                            value={personalDetailsFrom.values.contactNo}
                            onChange={onChangePhoneHndlr}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.contactNo && personalDetailsFrom.errors.contactNo) ? true : false}
                            error={(personalDetailsFrom.touched.contactNo && personalDetailsFrom.errors.contactNo) ? personalDetailsFrom.errors.contactNo : ""}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="nationalityId"
                            labelText="Nationality"
                            value={personalDetailsFrom.values.nationalityId}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.nationalityId && personalDetailsFrom.errors.nationalityId) ? true : false}
                            error={(personalDetailsFrom.touched.nationalityId && personalDetailsFrom.errors.nationalityId) ? personalDetailsFrom.errors.nationalityId : ""}
                            menuItems={nationalityResp?.data}
                            // defaultSelect="Nationality"
                            valueKey="nationalityId"
                            textKey="nationalityName"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="religionId"
                            labelText="Religion"
                            value={personalDetailsFrom.values.religionId}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.religionId && personalDetailsFrom.errors.religionId) ? true : false}
                            error={(personalDetailsFrom.touched.religionId && personalDetailsFrom.errors.religionId) ? personalDetailsFrom.errors.religionId : ""}
                            menuItems={religionResp?.data}
                            // defaultSelect="Religion"
                            valueKey="religionId"
                            textKey="religionName"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="casteId"
                            labelText="Caste"
                            value={personalDetailsFrom.values.casteId}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.casteId && personalDetailsFrom.errors.casteId) ? true : false}
                            error={(personalDetailsFrom.touched.casteId && personalDetailsFrom.errors.casteId) ? personalDetailsFrom.errors.casteId : ""}
                            menuItems={casteListResp?.data}
                            // defaultSelect="Caste"
                            valueKey="casteId"
                            textKey="casteName"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="bloodGroupId"
                            labelText="Blood Group"
                            value={personalDetailsFrom.values.bloodGroupId}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.bloodGroupId && personalDetailsFrom.errors.bloodGroupId) ? true : false}
                            error={(personalDetailsFrom.touched.bloodGroupId && personalDetailsFrom.errors.bloodGroupId) ? personalDetailsFrom.errors.bloodGroupId : ""}
                            menuItems={bloodGroupResp?.data}
                            valueKey="bloodGroupId"
                            textKey="bloodGroupName"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="identificationMark1"
                            labelText="Identification Mark 1"
                            value={personalDetailsFrom.values.identificationMark1}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.identificationMark1 && personalDetailsFrom.errors.identificationMark1) ? true : false}
                            error={(personalDetailsFrom.touched.identificationMark1 && personalDetailsFrom.errors.identificationMark1) ? personalDetailsFrom.errors.identificationMark1 : ""}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="identificationMark2"
                            labelText="Identification Mark 2"
                            value={personalDetailsFrom.values.identificationMark2}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.identificationMark2 && personalDetailsFrom.errors.identificationMark2) ? true : false}
                            error={(personalDetailsFrom.touched.identificationMark2 && personalDetailsFrom.errors.identificationMark2) ? personalDetailsFrom.errors.identificationMark2 : ""}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="maritalStatusId"
                            labelText="Marital Status"
                            value={personalDetailsFrom.values.maritalStatusId}
                            onChange={personalDetailsFrom.handleChange}
                            onBlur={personalDetailsFrom.handleBlur}
                            invalid={(personalDetailsFrom.touched.maritalStatusId && personalDetailsFrom.errors.maritalStatusId) ? true : false}
                            error={(personalDetailsFrom.touched.maritalStatusId && personalDetailsFrom.errors.maritalStatusId) ? personalDetailsFrom.errors.maritalStatusId : ""}
                            menuItems={maritalStatusResp?.data}
                            // defaultSelect="Caste"
                            valueKey="id"
                            textKey="name"
                            labelClass="required"
                        />
                    </div>
                    {/* <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                <SelectInput
                    name="userTypeId"
                    labelText="User Type"
                    value={personalDetailsFrom.values.userTypeId}
                    onChange={personalDetailsFrom.handleChange}
                    onBlur={personalDetailsFrom.handleBlur}
                    invalid={(personalDetailsFrom.touched.userTypeId && personalDetailsFrom.errors.userTypeId) ? true : false}
                    error={(personalDetailsFrom.touched.userTypeId && personalDetailsFrom.errors.userTypeId) ? personalDetailsFrom.errors.userTypeId : ""}
                    menuItems={instRoleTypeListResp?.data}
                    // menuItems={[{ id: "15", userTypeName: "Teacher" }]}
                    // defaultSelect="Caste"
                    valueKey="id"
                    textKey="name"
                />
            </div> */}
                    {/* <div className="tw-w-full tw-px-2">
                <input type="submit" value="Submit" />
            </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}
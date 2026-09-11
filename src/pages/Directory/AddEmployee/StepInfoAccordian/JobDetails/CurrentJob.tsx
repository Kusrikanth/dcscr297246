import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, AutoSearchInputUpdated
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import { employeeTypeOptions, sourceOfHireOptions } from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    Min_Date, Current_Date_YYYYMMDD, MinDate_YYYYMMDD,
    Current_Date_DDMMYYYY
} from "../../../../../utility/dateutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct,
    getEmployeeStatusAct,
    getHrmDepartmentsListAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getInstDepartmentAct, deleteInstDepartmentAct } from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";

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


const validationSchema = Yup.object().shape({
    confirmationDate: Yup.date().required("Confirmation date is required."),
    doj: Yup.date().required("Date of joining is required."),
    lastWorkingDate: Yup.date()
    .nullable()
    .when("employeeStatusId", {
      is: (statusId: number) => [6, 7, 9].includes(statusId),
      then: Yup.date().required("Last Working Date is required."),
      otherwise: Yup.date().nullable(),
    }),
    departmentId: Yup.string().required("Select department."),
    sourceOfHire: Yup.string().required("Select source of hire."),
    employeeStatusId: Yup.string().required("Select employee status."),
    workEmailId: Yup.string().email("Invalid Email.").required("Work email id required."),
    workLocation: Yup.string().required("Work location required."),
    employeeType: Yup.string().required("Select employee type."),
    workPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    // companyId: Yup.string().nullable().when('isOtherEmployee', {
    //     is: 'true',
    //     then: Yup.string().required('Company is required.'),
    //     otherwise: Yup.string().nullable(), }),
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
        employeeId: initialState?.employeeId || undefined,
        biometricId: initialState?.biometricId || "21348654",
        // campusTypeId: initialState?.campusTypeId || "",
        confirmationDate: initialState?.confirmationDate || "",
        doj: initialState?.doj || "",
        lastWorkingDate: initialState?.lastWorkingDate || "",
        departmentId: initialState?.departmentId || "",
        isTransfered: initialState?.isTransfered === "true" ? "true" : "false",
        rfid: initialState?.rfid || "",
        // isOtherEmployee: initialState?.isOtherEmployee !== undefined 
        //     ? initialState?.isOtherEmployee 
        //     : defaultIsOtherEmployee,
        sourceOfHire: initialState?.sourceOfHire || "",
        employeeStatusId: initialState?.employeeStatusId || "",
        workEmailId: initialState?.workEmailId || "",
        workLocation: initialState?.workLocation || "",
        employeeType: initialState?.employeeType || "",
        workPhoneNo: initialState?.workPhoneNo || "",
        // companyId: initialState?.companyId || "",
    }
}

function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function CurrentJob({ instituteId, branchId }: any) {
    const [currentJobState, setCurrentJobState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);
        const [searchCompany, setSearchCompany] = useState(undefined);

    const [employeeUniqueCode, setEmployeeUnqiueCode] = useState(randomIntFromInterval(1000, 2000));

    const dispatch = useAppDispatch();
    const { employeeStatusResp, hrmDepartmentResp, getAllCompaniesllListResp } =
        useAppSelector(({ masterData, instituteInfo, directoryEmployee }) => ({
            employeeStatusResp: masterData.employeeStatusResp,
            hrmDepartmentResp: masterData.hrmDepartmentResp,
            getAllCompaniesllListResp: directoryEmployee.getAllCompaniesllListResp,
        }), shallowEqual);

    useEffect(() => {
        const payload = { instituteId, sortBy: "departmentName", orderBy: "asc", isFeeDepartment: 0, pageNo: 0, pageSize: 1500 },
            employeeStatusPayload = { branchId };

        dispatch(getHrmDepartmentsListAct(generateActionPayload("get_hrm_department", undefined, payload)));
        dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status", undefined, employeeStatusPayload)))
    }, []);


    const currentJobForm = useFormik({
        enableReinitialize: true,
        initialValues: currentJobState,
        validationSchema,
        onSubmit: (values) => {
            const formData = {
                ...values,
            };
            // if (!formData.companyId) {
            //     delete formData.companyId;
            // }
            storeMultiFormData("employeeCurrentJob", true, formData);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeCurrentJob"))
            currentJobForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeCurrentJob } = editEmployeeData;
            const { formData } = employeeCurrentJob || {};
            if (formData) {
                setCurrentJobState(getInitialState(formData));
            }
        }
    }, [editEmployeeData, getAllCompaniesllListResp]);

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        currentJobForm.setFieldValue(name, updateDate);
    }

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const payload2 = { instituteId, searchString: inputString, };
            dispatch(getAllCompaniesListAct(generateActionPayload("get_all_complanies", undefined, payload2)));
        }
    }

    // function selectCompanyHndlr(selectedCompany: any) {
    //     setSearchCompany(selectedCompany);
    //     currentJobForm.setValues((prevState: any) => ({
    //         ...prevState,
    //         companyId: selectedCompany ? selectedCompany.companyId : ""
    //     }));
    // }
    
    return (
        <form onSubmit={currentJobForm.handleSubmit}>
            <AccordionHeader tag="span" className="tw-text-base" targetId="current-job">
                Current Job
            </AccordionHeader>
            <AccordionBody accordionId="current-job">
                <div className="tw-flex tw-flex-wrap tw--mx-2">
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="biometricId"
                            labelText="Biometric ID"
                            value={currentJobForm.values.biometricId}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.biometricId && currentJobForm.errors.biometricId) ? true : false}
                            error={(currentJobForm.touched.biometricId && currentJobForm.errors.biometricId) ? currentJobForm.errors.biometricId : ""}
                            isReadOnly={true}
                        // helperText="Full name as displayed on Aadhar Number"
                        />
                    </div>
                    {/* <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                <SelectInput
                    name="campusTypeId"
                    labelText="Campus Type"
                    value={currentJobForm.values.campusTypeId}
                    onChange={currentJobForm.handleChange}
                    invalid={(currentJobForm.touched.campusTypeId && currentJobForm.errors.campusTypeId) ? true : false}
                    error={(currentJobForm.touched.campusTypeId && currentJobForm.errors.campusTypeId) ? currentJobForm.errors.campusTypeId : ""}
                    menuItems={[{ id: "1", name: "In-Campus" }]}
                    // defaultSelect="Religion"
                    valueKey="id"
                    textKey="name"
                />
            </div> */}
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextIconInput
                            name="workEmailId"
                            labelText="Work Email"
                            value={currentJobForm.values.workEmailId}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.workEmailId && currentJobForm.errors.workEmailId) ? true : false}
                            error={(currentJobForm.touched.workEmailId && currentJobForm.errors.workEmailId) ? currentJobForm.errors.workEmailId : ""}
                            labelClass="required"
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <PhoneInput
                            name="workPhoneNo"
                            labelText="Work Phone no"
                            value={currentJobForm.values.workPhoneNo}
                            onChange={onChangePhoneInput}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.workPhoneNo && currentJobForm.errors.workPhoneNo) ? true : false}
                            error={(currentJobForm.touched.workPhoneNo && currentJobForm.errors.workPhoneNo) ? currentJobForm.errors.workPhoneNo : ""}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="workLocation"
                            labelText="Work Location"
                            value={currentJobForm.values.workLocation}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.workLocation && currentJobForm.errors.workLocation) ? true : false}
                            error={(currentJobForm.touched.workLocation && currentJobForm.errors.workLocation) ? currentJobForm.errors.workLocation : ""}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="employeeType"
                            labelText="Employee Type"
                            value={currentJobForm.values.employeeType}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.employeeType && currentJobForm.errors.employeeType) ? true : false}
                            error={(currentJobForm.touched.employeeType && currentJobForm.errors.employeeType) ? currentJobForm.errors.employeeType : ""}
                            labelClass="required"
                            menuItems={employeeTypeOptions}
                            // defaultSelect="Caste"
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="departmentId"
                            labelText="Department"
                            value={currentJobForm.values.departmentId}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.departmentId && currentJobForm.errors.departmentId) ? true : false}
                            error={(currentJobForm.touched.departmentId && currentJobForm.errors.departmentId) ? currentJobForm.errors.departmentId : ""}
                            labelClass="required"
                            menuItems={hrmDepartmentResp}
                            // defaultSelect="Caste"
                            valueKey="hrmDeptId"
                            textKey="departmentName"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <DateInput
                            name="confirmationDate"
                            labelText="Confirmation Date"
                            // formgroupClassName="tw-mb-4"
                            value={currentJobForm.values.confirmationDate}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.confirmationDate && currentJobForm.errors.confirmationDate) ? true : false}
                            error={(currentJobForm.touched.confirmationDate && currentJobForm.errors.confirmationDate) ? currentJobForm.errors.confirmationDate : ""}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <DateInput
                            name="doj"
                            labelText="Date Of Joining"
                            // formgroupClassName="tw-mb-4"
                            value={currentJobForm.values.doj}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.doj && currentJobForm.errors.doj) ? true : false}
                            error={(currentJobForm.touched.doj && currentJobForm.errors.doj) ? currentJobForm.errors.doj : ""}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="sourceOfHire"
                            labelText="Source of Hire"
                            value={currentJobForm.values.sourceOfHire}
                            onChange={currentJobForm.handleChange}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.sourceOfHire && currentJobForm.errors.sourceOfHire) ? true : false}
                            error={(currentJobForm.touched.sourceOfHire && currentJobForm.errors.sourceOfHire) ? currentJobForm.errors.sourceOfHire : ""}
                            menuItems={sourceOfHireOptions}
                            labelClass="required"
                            // defaultSelect="Caste"
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="employeeStatusId"
                            labelText="Employment Status"
                            value={currentJobForm.values.employeeStatusId}
                            onChange={(e: { target: { value: any; name: any; }; }) => {
                                const valueAsNumber = Number(e.target.value);
                                currentJobForm.handleChange({
                                    target: {
                                        name: e.target.name,
                                        value: valueAsNumber
                                    }
                                });
                            }}
                            onBlur={currentJobForm.handleBlur}
                            invalid={(currentJobForm.touched.employeeStatusId && currentJobForm.errors.employeeStatusId) ? true : false}
                            error={(currentJobForm.touched.employeeStatusId && currentJobForm.errors.employeeStatusId) ? currentJobForm.errors.employeeStatusId : ""}
                            menuItems={employeeStatusResp}
                            // defaultSelect="Caste"
                            valueKey="id"
                            textKey="empStatusName"
                            labelClass="required"
                        />
                    </div>
                    {[6, 7, 9].includes(currentJobForm.values.employeeStatusId) && (
                        <>
                            <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                                <DateInput
                                    name="lastWorkingDate"
                                    labelText="Date Of Joining"
                                    // formgroupClassName="tw-mb-4"
                                    value={currentJobForm.values.lastWorkingDate}
                                    onChange={currentJobForm.handleChange}
                                    onBlur={currentJobForm.handleBlur}
                                    invalid={(currentJobForm.touched.lastWorkingDate && currentJobForm.errors.lastWorkingDate) ? true : false}
                                    error={(currentJobForm.touched.lastWorkingDate && currentJobForm.errors.lastWorkingDate) ? currentJobForm.errors.lastWorkingDate : ""}
                                    labelClass="required"
                                />
                            </div>
                        </>
                    )}
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <RadioInputContainer
                            name="isTransfered"
                            labelText="Is Transfered?"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                            value={currentJobForm.values.isTransfered}
                            onChange={currentJobForm.handleChange}
                        />
                        {/* <SelectInput
                    name="isTransfered"
                    labelText="Is Transfered"
                    value={currentJobForm.values.isTransfered}
                    onChange={currentJobForm.handleChange}
                    invalid={(currentJobForm.touched.isTransfered && currentJobForm.errors.isTransfered) ? true : false}
                    error={(currentJobForm.touched.isTransfered && currentJobForm.errors.isTransfered) ? currentJobForm.errors.isTransfered : ""}
                    menuItems={[]}
                    // defaultSelect="Caste"
                    valueKey="id"
                    textKey="name"
                /> */}
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                       <TextInput
                            name="rfid"
                            labelText="RFID"
                            value={currentJobForm.values.rfid}
                            onChange={currentJobForm.handleChange}
                        />
                    </div>
                    {/*<div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <RadioInputContainer
                            name="isOtherEmployee"
                            labelText="Is Other Employee?"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                            value={currentJobForm.values.isOtherEmployee}
                            onChange={currentJobForm.handleChange}
                        />
                    </div>
                    {currentJobForm.values.isOtherEmployee === "true" && (
                        <div className="tw-w-full md:tw-w-6/12 tw-px-2">
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="companyId"
                                placeHolder="Search..."
                                onChange={onInputSearchChange}
                                onBlur={currentJobForm.handleBlur}
                                labelText="Company"
                                valueKey="companyId"
                                labelHeader="Short Name"
                                labelKey="shortName"
                                subLabelHeader="Company Name"
                                subLabelKey="companyName"
                                options={(Array.isArray(getAllCompaniesllListResp?.data) && getAllCompaniesllListResp?.data) || []}
                                selected={searchCompany}
                                selectedOptionCallbck={selectCompanyHndlr}
                                invalid={currentJobForm.touched.companyId && currentJobForm.errors.companyId ? true : false}
                                error={currentJobForm.touched.companyId && currentJobForm.errors.companyId ? currentJobForm.errors.companyId : ""}
                                labelClass="required"
                            >
                                <i className="ri-search-line search-icon"></i>
                            </AutoSearchInputUpdated>
                        </div>
                    )} */}
                    {/* <div className="tw-w-full tw-px-2">
                <input type="submit" value="Submit" />
            </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}
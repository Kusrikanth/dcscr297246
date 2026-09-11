import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AutoSearchInputUpdated, DateInput, NewPhoneInput, RadioInputContainer, SelectInput, TextIconInput, TextInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { addEmployeeAct, getAllCompaniesListAct, getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getBloodGroupAct, getCasteListAct, getGenderListAct, getMaritalStatusAct, getNationalityAct, getReligionAct } from "../../../../store/masterdata/masterdataactions";
import { getGlobalRecordsAct, getInstRoleTypeAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { details, formSectionSaveKey } from "./helper";
import * as Yup from 'yup';
import { IPropsTypes, IUpdateEmployeeRepRef } from "./EmployeeInfoTypes";
import { Current_Date, getGapedYear, getYearGapCurrentDate, getYyyyMmDdFormat, Min_Date_Employee, MinEmployee_YYYYMMDD } from "../../../../utility/dateutility";
import PhoneInput from "react-phone-input-2";
import { TextInputWithRegex } from "../../../../Components/Common/TextInput";
import { validateNumber } from "../../../../utility/validationutility";
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { AccordionBody, AccordionHeader } from "reactstrap";
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

export default function EmployeeDetails({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {
    const dispatch = useDispatch();
    const initialValues = (data?: any) => {

        return {
            employeeName: data?.employeeName || "",
            employeeId: data?.employeeCode || "",
            dob: data?.dob || "",
            nationalityId: data?.nationalityId || "",
            aadharNo: validateNumber(data?.aadharNo) && data?.aadharNo || "",
            genderId: data?.genderId || "",
            personalEmailId: data?.personalEmailId || "",
            contactNo: data?.contactNo || "",
            religionId: data?.religionId || "",
            casteId: data?.casteId || "",
            bloodGroupId: data?.bloodGroupId || "",
            identificationMark1: data?.identificationMark1 || "",
            identificationMark2: data?.identificationMark2 || "",
            maritalStatusId: data?.maritalStatusId || "",
            userTypeId: data?.userTypeId || "",
            isOtherEmployee: data ? data.isOtherEmployee ? "true" : "false" : "",
            companyId: data?.companyId || "",
        }
    }
    const Max_Job_Year = 18;
    const Employee_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Job_Year));
    const validationSchema = Yup.object().shape({
        employeeName: Yup.string().required("Emoployee Name is required."),
        dob: Yup.date().min(MinEmployee_YYYYMMDD, `DOB should be more than ${Min_Date_Employee}.`)
            .max(Employee_Dob_MaxDate_YYYYMMDD, `Employee age should be greater than ${Max_Job_Year} year.`).required("Date of birth required."),
        nationalityId: Yup.string().required("Nationality is required."),
        aadharNo: Yup.string().required("Aadhar Number is required.").min(12, "12 digit is required"),
        genderId: Yup.string().required("Gender is required."),
        personalEmailId: Yup.string().email("Invalid Email.").required("Personal Email is required."),
        contactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
        religionId: Yup.string().required("Religion is required."),
        casteId: Yup.string().required("Caste is required."),
        bloodGroupId: Yup.string().required("Blood Group is required."),
        identificationMark1: Yup.string().required("Identification Mark 1 is required."),
        identificationMark2: Yup.string().test("identificationMark2Check", "Identification mark 2 cannot be same as identification mark 1.",
            (value: any, schema: any) => {
                if (value && value?.toLowerCase() === schema.parent?.identificationMark1?.toLowerCase()) {
                    return false
                }
                return true;
            }),
        maritalStatusId: Yup.string().required("Marital Status is required."),
        isOtherEmployee: Yup.string().required("isOtherEmployee is required."),
    });

    const [edit, setEdit] = useState(false);
    const [initialData, setInitialData] = useState(initialValues());
    const [searchCompany, setSearchCompany] = useState<any>(undefined);

    const { getEmployeeByIdResp, updateStudentResp, affectedSection, bloodGroupResp, genderListResp, casteListResp, religionResp, nationalityResp, maritalStatusResp, instRoleTypeListResp,getAllCompaniesllListResp } = useAppSelector(
        ({ directoryEmployee, directoryStudent, masterData, instituteInfo }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            bloodGroupResp: masterData.bloodGroupResp,
            genderListResp: masterData.genderListResp,
            nationalityResp: masterData.nationalityResp,
            casteListResp: masterData.casteListResp,
            religionResp: masterData.religionResp,
            maritalStatusResp: masterData.maritalStatusResp,
            instRoleTypeListResp: instituteInfo.instRoleTypeListResp,
            getAllCompaniesllListResp: directoryEmployee.getAllCompaniesllListResp,
        }),
        shallowEqual
    );
    const EmployeeDetailsRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const getEmployeeDetailsAPI = () => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
    }
    const UpdateHandler = () => {
        getEmployeeDetailsAPI();
        setEdit(false);
    }
    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        employeeDetailsForm.setFieldValue(name, updateDate);
    }
    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeDetailsRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Details") {
                toast.success("Employee Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeDetailsRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [updateStudentResp]);

    const employeeDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            let formData = new FormData();
            const data: any = details(getEmployeeByIdResp, values, "Employee Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.employeeProfile)
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Details"
            })));
        },
    });
    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        employeeDetailsForm.setValues(initialValues(getEmployeeByIdResp.employeeBasicDetails)).then(() => {
            employeeDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    const submitHandler = (values: any) => {
        const data = {
            branchId: 20,
            instituteId: 49,
            studentDetails: values
        }
        dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, values)));

    }


    useEffect(() => {
        dispatch(getBloodGroupAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "blood-group", searchString: "", pageNo: 0, pageSize: 100, sortBy: "bloodGroupName", orderBy: "asc" })));
        dispatch(getGenderListAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "gender", searchString: "", pageNo: 0, pageSize: 100, sortBy: "genderName", orderBy: "asc" })));
        dispatch(getNationalityAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "nationality", searchString: "", pageNo: 0, pageSize: 100, sortBy: "id", orderBy: "asc" })));
        dispatch(getReligionAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "religion", searchString: "", pageNo: 0, pageSize: 100, sortBy: "id", orderBy: "asc" })));
        dispatch(getCasteListAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "caste", searchString: "", pageNo: 0, pageSize: 100, sortBy: "casteName", orderBy: "asc" })));
        dispatch(getMaritalStatusAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "MARITAL-STATUS", searchString: "", pageNo: 0, pageSize: 100, orderBy: "asc", sortBy: "name" })));
        const payload = { instituteId: instituteId, pageSize: 100, pageNo: 0, sortBy: "userTypeName", orderBy: "asc" };
        dispatch(getInstRoleTypeAct(generateActionPayload("get_inst_role_type", undefined, payload)));
    }, []);
    useEffect(() => {
        getEmployeeByIdResp && setInitialData(initialValues(getEmployeeByIdResp.employeeBasicDetails));
    }, [getEmployeeByIdResp]);

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const payload2 = { instituteId: instituteId, searchString: inputString, };
            dispatch(getAllCompaniesListAct(generateActionPayload("get_all_complanies", undefined, payload2)));
        }
    }

    function selectCompanyHndlr(selectedCompany: any) {
        setSearchCompany(selectedCompany);
            employeeDetailsForm.setValues((prevState: any) => ({
                ...prevState,
            companyId: selectedCompany?.companyId || "",
        }));
    }

    useEffect(() => {
        if (getEmployeeByIdResp) {
            setInitialData(initialValues(getEmployeeByIdResp.employeeBasicDetails));
            const company = getAllCompaniesllListResp?.data?.find(
                ( company: { companyId: any; } ) => company.companyId === getEmployeeByIdResp.employeeBasicDetails.companyId
            );
            setSearchCompany(company);
        }
    }, [getEmployeeByIdResp, getAllCompaniesllListResp]);

    const { data: BloodGroupData } = bloodGroupResp || {};
    const { data: GenderListData } = genderListResp || {};
    const { data: NationalityData } = nationalityResp || {};
    const { data: CasteData } = casteListResp || {};
    const { data: ReligionData } = religionResp || {};
    const { data: RoleTypes } = instRoleTypeListResp || {};
    const { data: MaritalStatus } = maritalStatusResp || {};
    return (
        <div>
            <AccordionHeader tag="h4" targetId="basic-info">
                Basic Information
            </AccordionHeader>
            <AccordionBody accordionId="basic-info">
                <div id={divId} className="tw-w-full">
                    <div className="">
                        <div className="tw-grid tw-gap-4 tw-grid-cols-1 lg:tw-grid-cols-2">

                            <TextInput
                                name="employeeName"
                                labelText="Employee Name"
                                value={employeeDetailsForm.values.employeeName}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={"!tw-bg-transparent " + `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none' : ''}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.employeeName &&
                                            employeeDetailsForm.errors.employeeName
                                            ? true
                                            : false
                                    }
                                error={
                                        employeeDetailsForm.touched.employeeName &&
                                            employeeDetailsForm.errors.employeeName
                                            ? employeeDetailsForm.errors.employeeName
                                            : ""
                                    }
                                labelClass="tw-font-semibold tw-text-sm"
                            />

                            <TextInput
                                name="employeeId"
                                labelText="Employee ID"
                                value={employeeDetailsForm.values.employeeId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                isReadOnly={true}
                                inputClassName={"!tw-bg-transparent " + `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none' : 'tw-bg-gray-100'}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.employeeId &&
                                            employeeDetailsForm.errors.employeeId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.employeeId &&
                                            employeeDetailsForm.errors.employeeId
                                            ? employeeDetailsForm.errors.employeeId
                                            : ""
                                    }
                                    labelClass="tw-font-semibold tw-text-sm"
                            />

                            <SelectInput
                                name="genderId"
                                labelText="Gender"
                                value={employeeDetailsForm.values.genderId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                valueKey="genderId"
                                textKey="genderName"
                                menuItems={GenderListData || []}
                                isDisabled={!edit}
                                labelClass="tw-font-semibold tw-text-sm"
                                inputClassName={"!tw-bg-transparent " + `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.genderId &&
                                            employeeDetailsForm.errors.genderId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.genderId &&
                                            employeeDetailsForm.errors.genderId
                                            ? employeeDetailsForm.errors.genderId
                                            : ""
                                    }
                                />

                            <DateInput
                                name="dob"
                                value={employeeDetailsForm.values.dob}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={"!tw-bg-transparent " + `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none' : ''}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                labelText="Date of Birth"
                                labelClass="tw-font-semibold tw-text-sm"
                                maxDate={getYyyyMmDdFormat(getYearGapCurrentDate(18))}
                                invalid={
                                        employeeDetailsForm.touched.dob &&
                                            employeeDetailsForm.errors.dob
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.dob &&
                                            employeeDetailsForm.errors.dob
                                            ? employeeDetailsForm.errors.dob
                                            : ""
                                    }
                                />
                            <TextInputWithRegex
                                name="aadharNo"
                                labelText="Aadhar Number"
                                value={employeeDetailsForm.values.aadharNo}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                isDisabled={!edit}
                                inputClassName={"!tw-bg-transparent " +  `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none' : ''}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                            employeeDetailsForm.touched.aadharNo &&
                                            employeeDetailsForm.errors.aadharNo
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.aadharNo &&
                                            employeeDetailsForm.errors.aadharNo
                                                ? employeeDetailsForm.errors.aadharNo
                                                : ""
                                        }
                                        labelClass="tw-font-semibold tw-text-sm"
                                allowedInputRegex="^[0-9]+$"
                                maxLength={12}
                            />
                            <TextIconInput
                                name="personalEmailId"
                                labelText="Email"
                                value={employeeDetailsForm.values.personalEmailId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={"!tw-bg-transparent " + `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none' : ''}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                labelClass="tw-font-semibold tw-text-sm"
                                iconPositionClassName="tw-w-full"
                                invalid={
                                        employeeDetailsForm.touched.personalEmailId &&
                                            employeeDetailsForm.errors.personalEmailId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.personalEmailId &&
                                            employeeDetailsForm.errors.personalEmailId
                                            ? employeeDetailsForm.errors.personalEmailId
                                            : ""
                                    }
                                maxLength={200}
                            >
                                <i className="ri-mail-unread-line"></i>
                            </TextIconInput>

                            <NewPhoneInput
                                name="contactNo"
                                labelText="Phone No."
                                value={employeeDetailsForm.values.contactNo}
                                onChange={onChangePhoneInput}
                                onBlur={employeeDetailsForm.handleBlur}
                                isDisabled={!edit}
                                labelClass="tw-font-semibold tw-text-sm"
                                inputClassName={"!tw-bg-transparent " + `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none phone_no' : ''}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={(employeeDetailsForm.touched.contactNo && employeeDetailsForm.errors.contactNo) ? true : false}
                                error={(employeeDetailsForm.touched.contactNo && employeeDetailsForm.errors.contactNo) ? employeeDetailsForm.errors.contactNo : ""}
                                />
                            <SelectInput
                                name="nationalityId"
                                labelText="Nationality"
                                value={employeeDetailsForm.values.nationalityId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                valueKey="nationalityId"
                                textKey="nationalityName"
                                menuItems={NationalityData || []}
                                isDisabled={!edit}
                                labelClass="tw-font-semibold tw-text-sm"
                                inputClassName={"!tw-bg-transparent " +  `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.nationalityId &&
                                            employeeDetailsForm.errors.nationalityId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.nationalityId &&
                                            employeeDetailsForm.errors.nationalityId
                                            ? employeeDetailsForm.errors.nationalityId
                                            : ""
                                    }
                                />
                            <SelectInput
                                name="religionId"
                                labelText="Religion"
                                value={employeeDetailsForm.values.religionId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                valueKey="religionId"
                                textKey="religionName"
                                menuItems={ReligionData || []}
                                isDisabled={!edit}
                                labelClass="tw-font-semibold tw-text-sm"
                                inputClassName={"!tw-bg-transparent " + `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.religionId &&
                                            employeeDetailsForm.errors.religionId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.religionId &&
                                            employeeDetailsForm.errors.religionId
                                            ? employeeDetailsForm.errors.religionId
                                            : ""
                                    }
                                />

                            <SelectInput
                                name="casteId"
                                labelText="Caste"
                                value={employeeDetailsForm.values.casteId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                valueKey="casteId"
                                textKey="casteName"
                                menuItems={CasteData || []}
                                isDisabled={!edit}
                                labelClass="tw-font-semibold tw-text-sm"
                                inputClassName={"!tw-bg-transparent " + `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.casteId &&
                                            employeeDetailsForm.errors.casteId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.casteId &&
                                            employeeDetailsForm.errors.casteId
                                            ? employeeDetailsForm.errors.casteId
                                            : ""
                                    }
                                />
                            <SelectInput
                                name="bloodGroupId"
                                labelText="Blood Group"
                                value={employeeDetailsForm.values.bloodGroupId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                valueKey="bloodGroupId"
                                textKey="bloodGroupName"
                                menuItems={BloodGroupData || []}
                                isDisabled={!edit}
                                labelClass="tw-font-semibold tw-text-sm"
                                inputClassName={"!tw-bg-transparent " + `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.bloodGroupId &&
                                            employeeDetailsForm.errors.bloodGroupId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.bloodGroupId &&
                                            employeeDetailsForm.errors.bloodGroupId
                                            ? employeeDetailsForm.errors.bloodGroupId
                                            : ""
                                    }
                                />
                            <TextInput
                                name="identificationMark1"
                                labelText="Identification Mark 1"
                                value={employeeDetailsForm.values.identificationMark1}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={"!tw-bg-transparent " + `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none' : ''}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.identificationMark1 &&
                                            employeeDetailsForm.errors.identificationMark1
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.identificationMark1 &&
                                            employeeDetailsForm.errors.identificationMark1
                                            ? employeeDetailsForm.errors.identificationMark1
                                            : ""
                                    }
                                labelClass="tw-font-semibold tw-text-sm"
                            />

                            <TextInput
                                name="identificationMark2"
                                labelText="Identification Mark 2"
                                value={employeeDetailsForm.values.identificationMark2}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                isReadOnly={!edit}
                                inputClassName={"!tw-bg-transparent " + `${!edit ? '!tw-border-0 !tw-border-0 !tw-rounded-none' : ''}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.identificationMark2 &&
                                            employeeDetailsForm.errors.identificationMark2
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.identificationMark2 &&
                                            employeeDetailsForm.errors.identificationMark2
                                            ? employeeDetailsForm.errors.identificationMark2
                                            : ""
                                    }
                                labelClass="tw-font-semibold tw-text-sm"
                            />

                            <SelectInput
                                name="maritalStatusId"
                                labelText="Marital Status"
                                value={employeeDetailsForm.values.maritalStatusId}
                                onChange={employeeDetailsForm.handleChange}
                                onBlur={employeeDetailsForm.handleBlur}
                                valueKey="id"
                                textKey="name"
                                menuItems={MaritalStatus || []}
                                isDisabled={!edit}
                                labelClass="tw-font-semibold tw-text-sm"
                                inputClassName={"!tw-bg-transparent " + `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`}
                                formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                invalid={
                                        employeeDetailsForm.touched.maritalStatusId &&
                                            employeeDetailsForm.errors.maritalStatusId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.maritalStatusId &&
                                            employeeDetailsForm.errors.maritalStatusId
                                            ? employeeDetailsForm.errors.maritalStatusId
                                            : ""
                                    }
                                />

                            {edit ? (
                                <RadioInputContainer
                                    name="isOtherEmployee"
                                    labelText="Is Other Employee"
                                    containerClassName="tw-flex tw-items-center tw-w-full"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                                    value={employeeDetailsForm.values.isOtherEmployee}
                                    onChange={employeeDetailsForm.handleChange}
                                    isDisabled={!edit}
                                    labelClassName="tw-font-semibold tw-text-sm"
                                    formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                    invalid={
                                        employeeDetailsForm.touched.isOtherEmployee &&
                                            employeeDetailsForm.errors.isOtherEmployee
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeDetailsForm.touched.isOtherEmployee &&
                                            employeeDetailsForm.errors.isOtherEmployee
                                            ? employeeDetailsForm.errors.isOtherEmployee
                                            : ""
                                    }
                                />
                            ) : (
                                <TextInput
                                    name="isOtherEmployee"
                                    labelText="Is Other Employee"
                                    value={employeeDetailsForm.values.isOtherEmployee === "true" ? "Yes" : "No"}
                                    isReadOnly={true}
                                    isDisabled={true}
                                    inputClassName="!tw-border-0 !tw-border-0 !tw-rounded-none !tw-bg-transparent"
                                    labelClass="tw-font-semibold tw-text-sm"
                                    formgroupClassName="!tw-bg-transparent tw-flex tw-flex-col"
                                />
                            )}

                            {employeeDetailsForm.values.isOtherEmployee === "true" && (
                                <div className="tw-w-full">
                                    {edit ? (
                                        <AutoSearchInputUpdated
                                            formgroupClassName="tw-flex tw-items-center tw-justify-center input-field"
                                            name="companyId"
                                            placeHolder="Search..."
                                            onChange={onInputSearchChange}
                                            onBlur={employeeDetailsForm.handleBlur}
                                            labelText="Company"
                                            valueKey="companyId"
                                            labelHeader="Short Name"
                                            labelKey="shortName"
                                            subLabelHeader="Company Name"
                                            subLabelKey="companyName"
                                            options={(Array.isArray(getAllCompaniesllListResp?.data) && getAllCompaniesllListResp?.data) || []}
                                            selected={searchCompany}
                                            selectedOptionCallbck={selectCompanyHndlr}
                                            isDisabled={!edit}
                                            labelClass="tw-font-semibold tw-text-sm"
                                            inputClassName={edit ? "!tw-border-0" : "!tw-border-0 !tw-border-0"}
                                            invalid={employeeDetailsForm.touched.companyId && employeeDetailsForm.errors.companyId}
                                            error={employeeDetailsForm.touched.companyId && employeeDetailsForm.errors.companyId}
                                        >
                                            <i className="ri-search-line search-icon"></i>
                                        </AutoSearchInputUpdated>
                                    ) : (
                                        <div className="tw-flex tw-items-center tw-w-full">
                                            <label className="tw-font-semibold tw-text-sm tw-w-1/3">Company</label>
                                            <div className="tw-w-2/3 tw-text-sm tw-text-gray-800">
                                                {getEmployeeByIdResp.employeeBasicDetails.companyName || "—"}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {canCreateAndUpdate && <>{!edit ? (
                            <div className="tw-flex tw-justify-end">
                                <Button
                                    variant="hoverInfo"
                                    onClick={EditHandler}
                                >
                                    <i className="ri-pencil-line tw-mr-2"></i> Edit
                                </Button>
                            </div>
                        ) : (
                            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-4">
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
                                    onClick={(e: any) => employeeDetailsForm.handleSubmit(e)}
                                >
                                    Update
                                </Button>
                            </div>
                        )}</>}
                    </div>
                </div>
            </AccordionBody>
        </div>
    )
}
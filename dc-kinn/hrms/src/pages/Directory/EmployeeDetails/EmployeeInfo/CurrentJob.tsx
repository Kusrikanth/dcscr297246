import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AutoSearchInputUpdated, DateInput, NewPhoneInput, RadioInputContainer, SelectInput, TextIconInput, TextInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { getAllCompaniesListAct, getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getBloodGroupAct, getEmployeeStatusAct, getGenderListAct, getHrmDepartmentsListAct } from "../../../../store/masterdata/masterdataactions";
import { getGlobalRecordsAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { BooleanType, CampusTypeOptions, EmployeeType, SourceOfHire } from "../helper";
import { IPropsTypes, IUpdateEmployeeRepRef } from "./EmployeeInfoTypes";
import * as Yup from 'yup'
import { details, formSectionSaveKey } from "./helper";
import { Current_Date, Current_Date_YYYYMMDD, getDurationBetweenDates } from "../../../../utility/dateutility";
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
export default function CurrentJob({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {
    const dispatch = useDispatch();
    const initialValues = (data?: any) => {
        const duration = getDurationBetweenDates(data?.doj, Current_Date_YYYYMMDD);
        return {
            employeeId: data?.employeeId || "",
            biometricId: data?.biometricId || "",
            workEmailId: data?.workEmailId || "",
            workPhoneNo: data?.workPhoneNo || "",
            workLocation: data?.workLocation || "",
            employeeType: data?.employeeType || "",
            departmentId: data?.departmentId || "",
            confirmationDate: data?.confirmationDate || "",
            lastWorkingDate: data?.lastWorkingDate || "",
            doj: data?.doj || "",
            sourceOfHire: data?.sourceOfHire || "",
            employeeStatusId: data?.employeeStatusId || "",
            rfid: data?.rfid || "",
            dpsExperiance: duration || "",
            isTransfered: data ? data.isTransfered ? "true" : "false" : "",
            // isOtherEmployee: data ? data.isOtherEmployee ? "true" : "false" : "",
            // companyId: data?.companyId || "",
        }
    }
    const validationSchema = Yup.object().shape({
        // biometricId: Yup.string().required("Biometric Id is required."),
        workEmailId: Yup.string().email('Invalid Email').required("Email Id is required."),
        workPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
        workLocation: Yup.string().required("Location is required."),
        employeeType: Yup.string().required("Employee Type is required."),
        departmentId: Yup.string().required("Department Id is required."),
        // confirmationDate: Yup.date().min(Current_Date, `Confirmation Date should be more than ${(Current_Date)} date`).required("Confirmation Date is required."),
        confirmationDate: Yup.date().required("Confirmation Date is required."),
        lastWorkingDate: Yup.date()
            .nullable()
            .when("employeeStatusId", {
                is: (statusId: number) => [6, 7, 9].includes(statusId),
                then: Yup.date().required("Last Working Date is required."),
                otherwise: Yup.date().nullable(),
            }),
        // doj: Yup.date().min(Current_Date, `Confirmation Date should be more than ${(Current_Date)} date`).required("Confirmation Date is required."),
        doj: Yup.date().required("Date of joining is required."),
        sourceOfHire: Yup.string().required("Source Of Hire is required."),
        employeeStatusId: Yup.string().required("Employee Status Id is required."),
        // dpsExperiance: Yup.number().positive("Enter valid experience.").typeError("Enter valid number.").required("DPS Experiance is required."),
        isTransfered: Yup.string().required("isTransfered is required."),
        // isOtherEmployee: Yup.string().required("isOtherEmployee is required."),
    });
    const [edit, setEdit] = useState(false);
    const [initialData, setInitialData] = useState(initialValues());
    const [searchCompany, setSearchCompany] = useState(undefined);

    const { getEmployeeByIdResp, updateStudentResp, affectedSection, employeeStatusResp, hrmDepartmentResp, getAllCompaniesllListResp, showApiLoader } = useAppSelector(
        ({ directoryEmployee, directoryStudent, masterData, globalData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            employeeStatusResp: masterData.employeeStatusResp,
            hrmDepartmentResp: masterData.hrmDepartmentResp,
            getAllCompaniesllListResp: directoryEmployee.getAllCompaniesllListResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const EmployeeJobRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const getEmployeeDetailsAPI = () => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
    }
    const UpdateHandler = () => {
        getEmployeeDetailsAPI();
        setEdit(false);
    }
    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeJobRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Job Details") {
                toast.success("Employee Job Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeJobRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);

    const employeeCurrentJobForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            const dpsExperianceValue = values.dpsExperiance ? values.dpsExperiance.split(' ')[0] : "0";
            const data = details(getEmployeeByIdResp, {
                ...values,
                dpsExperiance: dpsExperianceValue
            }, "Employee Job Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.currentJobDetails);
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Job Details"
            })));
        },
    });
    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        employeeCurrentJobForm.setValues(initialValues(getEmployeeByIdResp.employeeCurrentJob)).then(() => {
            employeeCurrentJobForm.setErrors({});
        });
        setEdit(false);
    }

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        employeeCurrentJobForm.setFieldValue(name, updateDate);
    }


    useEffect(() => {
        dispatch(getBloodGroupAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "blood-group", searchString: "", pageNo: 0, pageSize: 100, sortBy: "bloodGroupName", orderBy: "asc" })));
        dispatch(getGenderListAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "gender", searchString: "", pageNo: 0, pageSize: 100, sortBy: "genderName", orderBy: "asc" })));
        dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")));
        dispatch(getHrmDepartmentsListAct(generateActionPayload("get_hrm_department", undefined, { instituteId: instituteId, sortBy: "departmentName", orderBy: "asc" })));

    }, []);
    useEffect(() => {
        if (getEmployeeByIdResp) {
            setInitialData(initialValues(getEmployeeByIdResp.employeeCurrentJob));
        }
    }, [getEmployeeByIdResp, getAllCompaniesllListResp]);
    // const { data: BloodGroupData } = bloodGroupResp || {};
    // const { data: GenderListData } = genderListResp || {};

    const filterHndler = (event: any) => {
        const { name, value } = event.target;
        employeeCurrentJobForm.handleChange(event);
        const duration = getDurationBetweenDates(value, Current_Date_YYYYMMDD);
        employeeCurrentJobForm.setValues((prevData: any) => ({ ...prevData, [name]: value, dpsExperiance: duration }))
    }

    // function onInputSearchChange(inputString: any) {
    //     if (inputString) {
    //         const payload2 = { instituteId: instituteId, searchString: inputString, };
    //         dispatch(getAllCompaniesListAct(generateActionPayload("get_all_complanies", undefined, payload2)));
    //     }
    // }

    // function selectCompanyHndlr(selectedCompany: any) {
    //     setSearchCompany(selectedCompany);
    //         employeeCurrentJobForm.setValues((prevState: any) => ({
    //             ...prevState,
    //             companyId: selectedCompany?.companyId || "",
    //         }));
    // }

    return (
        <div>
            <AccordionHeader tag="h4" targetId="current-job">
                Current Job
            </AccordionHeader>
            <AccordionBody accordionId="current-job">
                <div id={divId} className="">
                    <div className="tw-p-0">
                        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4 tw-mb-3">
                            <div className="tw-col-span-1">
                                <TextInput
                                    name="biometricId"
                                    labelText="Biometric ID"
                                    value={employeeCurrentJobForm.values.biometricId}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    inputClassName={`${!edit ? '!tw-bg-transparent !tw-border-0 !tw-rounded-none' : "tw-bg-gray-100"}`}
                                    isReadOnly={true}
                                    invalid={
                                        employeeCurrentJobForm.touched.biometricId &&
                                            employeeCurrentJobForm.errors.biometricId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.biometricId &&
                                            employeeCurrentJobForm.errors.biometricId
                                            ? employeeCurrentJobForm.errors.biometricId
                                            : ""
                                    }
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextIconInput
                                    name="workEmailId"
                                    labelText="Work Email"
                                    value={employeeCurrentJobForm.values.workEmailId}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={`!tw-bg-transparent ${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    iconPositionClassName="tw-w-full"
                                    invalid={
                                        employeeCurrentJobForm.touched.workEmailId &&
                                            employeeCurrentJobForm.errors.workEmailId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.workEmailId &&
                                            employeeCurrentJobForm.errors.workEmailId
                                            ? employeeCurrentJobForm.errors.workEmailId
                                            : ""
                                    }
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    maxLength={200}
                                >
                                    <i className="ri-mail-unread-line"></i>
                                </TextIconInput>
                            </div>

                            <div className="tw-col-span-1">
                                <NewPhoneInput
                                    name="workPhoneNo"
                                    labelText="Work Phone no"
                                    value={employeeCurrentJobForm.values.workPhoneNo}
                                    onChange={onChangePhoneInput}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    isDisabled={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    inputClassName={`!tw-bg-transparent ${!edit ? '!tw-border-0 !tw-rounded-none phone_no' : ""}`}
                                    invalid={(employeeCurrentJobForm.touched.workPhoneNo && employeeCurrentJobForm.errors.workPhoneNo) ? true : false}
                                    error={(employeeCurrentJobForm.touched.workPhoneNo && employeeCurrentJobForm.errors.workPhoneNo) ? employeeCurrentJobForm.errors.workPhoneNo : ""}
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="workLocation"
                                    labelText="Work Location"
                                    value={employeeCurrentJobForm.values.workLocation}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={`!tw-bg-transparent ${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    invalid={
                                        employeeCurrentJobForm.touched.workLocation &&
                                            employeeCurrentJobForm.errors.workLocation
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.workLocation &&
                                            employeeCurrentJobForm.errors.workLocation
                                            ? employeeCurrentJobForm.errors.workLocation
                                            : ""
                                    }
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="employeeType"
                                    labelText="Employee Type"
                                    value={employeeCurrentJobForm.values.employeeType}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    valueKey="employeeType"
                                    textKey="employeeType"
                                    menuItems={EmployeeType}
                                    isDisabled={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    inputClassName={edit ? "!tw-bg-transparent" : "!tw-border-0 !tw-bg-transparent bg-img-none"}
                                    invalid={
                                        employeeCurrentJobForm.touched.employeeType &&
                                            employeeCurrentJobForm.errors.employeeType
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.employeeType &&
                                            employeeCurrentJobForm.errors.employeeType
                                            ? employeeCurrentJobForm.errors.employeeType
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="departmentId"
                                    labelText="Department"
                                    value={employeeCurrentJobForm.values.departmentId}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    valueKey="hrmDeptId"
                                    textKey="departmentName"
                                    menuItems={hrmDepartmentResp || []}
                                    isDisabled={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    inputClassName={edit ? "!tw-bg-transparent" : "!tw-border-0 !tw-bg-transparent bg-img-none"}
                                    invalid={
                                        employeeCurrentJobForm.touched.departmentId &&
                                            employeeCurrentJobForm.errors.departmentId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.departmentId &&
                                            employeeCurrentJobForm.errors.departmentId
                                            ? employeeCurrentJobForm.errors.departmentId
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <DateInput
                                    name="confirmationDate"
                                    value={employeeCurrentJobForm.values.confirmationDate}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    isReadOnly={!edit}
                                    labelText="Confirmation Date"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={
                                        employeeCurrentJobForm.touched.confirmationDate &&
                                            employeeCurrentJobForm.errors.confirmationDate
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.confirmationDate &&
                                            employeeCurrentJobForm.errors.confirmationDate
                                            ? employeeCurrentJobForm.errors.confirmationDate
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <DateInput
                                    name="doj"
                                    value={employeeCurrentJobForm.values.doj}
                                    onChange={filterHndler}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    inputClassName={'!tw-bg-transparent ' + `${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    isReadOnly={!edit}
                                    labelText="Date Of Joining"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={
                                        employeeCurrentJobForm.touched.doj &&
                                            employeeCurrentJobForm.errors.doj
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.doj &&
                                            employeeCurrentJobForm.errors.doj
                                            ? employeeCurrentJobForm.errors.doj
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="sourceOfHire"
                                    labelText="Source of Hire"
                                    value={employeeCurrentJobForm.values.sourceOfHire}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    valueKey="sourceOfHire"
                                    textKey="sourceOfHire"
                                    menuItems={SourceOfHire}
                                    isDisabled={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    inputClassName={edit ? "!tw-bg-transparent" : "!tw-border-0 !tw-bg-transparent bg-img-none"}
                                    invalid={
                                        employeeCurrentJobForm.touched.sourceOfHire &&
                                            employeeCurrentJobForm.errors.sourceOfHire
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.sourceOfHire &&
                                            employeeCurrentJobForm.errors.sourceOfHire
                                            ? employeeCurrentJobForm.errors.sourceOfHire
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <SelectInput
                                    name="employeeStatusId"
                                    labelText="Employment Status"
                                    value={employeeCurrentJobForm.values.employeeStatusId}
                                    onChange={(e: { target: { value: any; name: any; }; }) => {
                                        const valueAsNumber = Number(e.target.value);
                                        employeeCurrentJobForm.handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: valueAsNumber
                                            }
                                        });
                                    }}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    valueKey="id"
                                    textKey="empStatusName"
                                    menuItems={employeeStatusResp || []}
                                    isDisabled={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    inputClassName={edit ? "!tw-bg-transparent" : "!tw-border-0 !tw-bg-transparent bg-img-none"}
                                    invalid={
                                        employeeCurrentJobForm.touched.employeeStatusId &&
                                            employeeCurrentJobForm.errors.employeeStatusId
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.employeeStatusId &&
                                            employeeCurrentJobForm.errors.employeeStatusId
                                            ? employeeCurrentJobForm.errors.employeeStatusId
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-col-span-1">
                                <TextInput
                                    name="dpsExperiance"
                                    labelText="Experience (Yrs.)"
                                    value={employeeCurrentJobForm.values.dpsExperiance}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    isReadOnly={!edit}
                                    isDisabled={true}
                                    inputClassName={` ${!edit ? '!tw-bg-transparent !tw-border-0 !tw-rounded-none' : "t"}`}
                                    maxLength={2}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>

                            {[6, 7, 9].includes(employeeCurrentJobForm.values.employeeStatusId) && (
                                <>
                                    <div className="tw-col-span-1">
                                        <DateInput
                                            name="lastWorkingDate"
                                            value={employeeCurrentJobForm.values.lastWorkingDate}
                                            onChange={(e: { target: { value: any; }; }) => {
                                                employeeCurrentJobForm.setFieldValue('lastWorkingDate', e.target.value);
                                            }}
                                            onBlur={employeeCurrentJobForm.handleBlur}
                                            inputClassName={
                                                '!tw-bg-transparent ' +
                                                `${!edit ? '!tw-border-0 !tw-rounded-none' : ''}`
                                            }
                                            isReadOnly={!edit}
                                            labelText="Last Working Date"
                                            labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                            formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                            invalid={
                                                employeeCurrentJobForm.touched.lastWorkingDate &&
                                                    employeeCurrentJobForm.errors.lastWorkingDate
                                                    ? true
                                                    : false
                                            }
                                            error={
                                                employeeCurrentJobForm.touched.lastWorkingDate &&
                                                    employeeCurrentJobForm.errors.lastWorkingDate
                                                    ? employeeCurrentJobForm.errors.lastWorkingDate
                                                    : ''
                                            }
                                        />
                                    </div>
                                </>
                            )}

                            <div className="tw-col-span-1">
                                {edit ? <RadioInputContainer
                                    name="isTransfered"
                                    labelText="Is Transfered"
                                    containerClassName="radio-input-container tw-w-full tw-flex tw-items-center"
                                    inputContainerClassName="tw-mt-2 radio-input-field"
                                    radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                                    value={employeeCurrentJobForm.values.isTransfered}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    isDisabled={!edit}
                                    labelClassName="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        employeeCurrentJobForm.touched.isTransfered &&
                                            employeeCurrentJobForm.errors.isTransfered
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.isTransfered &&
                                            employeeCurrentJobForm.errors.isTransfered
                                            ? employeeCurrentJobForm.errors.isTransfered
                                            : ""
                                    }
                                /> : <TextInput
                                    name="isTransfered"
                                    labelText="Is Transfered"
                                    value={employeeCurrentJobForm.values.isTransfered === "true" ? "Yes" : "No"}
                                    isReadOnly={true}
                                    isDisabled={true}
                                    inputClassName={'!tw-bg-transparent !tw-border-0 !tw-rounded-none'}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />}
                            </div>
                            <div className="tw-col-span-1">
                                <TextInput
                                    name="rfid"
                                    labelText="RFID"
                                    value={employeeCurrentJobForm.values.rfid}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    onBlur={employeeCurrentJobForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={`!tw-bg-transparent ${!edit ? '!tw-border-0 !tw-rounded-none' : ""}`}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>
                        {/* <div className="col-12 col-lg-6">
                                {edit ? <RadioInputContainer
                                    name="isOtherEmployee"
                                    labelText="Is Other Employee"
                                    containerClassName = "radio-input-container w-100 d-flex align-items-center"
                                    inputContainerClassName="mt-2"
                                    radioOptions={[{ id: "true", name: "Yes" }, { id: "false", name: "No" }]}
                                    value={employeeCurrentJobForm.values.isOtherEmployee}
                                    onChange={employeeCurrentJobForm.handleChange}
                                    isDisabled={!edit}
                                    labelClassName="fw-semibold fs-14 mb-0"
                                    formgroupClassName="mb-4 d-flex align-items-center input-field"
                                    invalid={
                                        employeeCurrentJobForm.touched.isOtherEmployee &&
                                            employeeCurrentJobForm.errors.isOtherEmployee
                                            ? true
                                            : false
                                    }
                                    error={
                                        employeeCurrentJobForm.touched.isOtherEmployee &&
                                            employeeCurrentJobForm.errors.isOtherEmployee
                                            ? employeeCurrentJobForm.errors.isOtherEmployee
                                            : ""
                                    }
                                /> : <TextInput
                                    name="isOtherEmployee"
                                    labelText="Is Other Employee"
                                    value={employeeCurrentJobForm.values.isOtherEmployee === "true" ? "Yes" : "No"}
                                    isReadOnly={true}
                                    isDisabled={true}
                                    inputClassName={'bg-transparent border-0 rounded-0'}
                                    labelClass="fw-semibold fs-14 mb-0"
                                    formgroupClassName="mb-4 d-flex align-items-center input-field"
                                />}
                            </div>
                            {employeeCurrentJobForm.values.isOtherEmployee === "true" && (
                            <div className="col-12 col-lg-6">
                                    <AutoSearchInputUpdated
                                        formgroupClassName="search-box mb-4 d-flex align-items-center input-field"
                                        name="companyId"
                                        placeHolder="Search..."
                                        onChange={onInputSearchChange}
                                        onBlur={employeeCurrentJobForm.handleBlur}
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
                                        labelClass="fw-semibold fs-14 mb-0"
                                        inputClassName={edit ? "bg-transparent" : "border-0 bg-transparent bg-img-none"}
                                        invalid={employeeCurrentJobForm.touched.companyId && employeeCurrentJobForm.errors.companyId ? true : false}
                                        error={employeeCurrentJobForm.touched.companyId && employeeCurrentJobForm.errors.companyId ? employeeCurrentJobForm.errors.companyId : ""}
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </AutoSearchInputUpdated>
                            </div>
                            )} */}
                        </div>

                        {canCreateAndUpdate && !edit && <div className="tw-grid">
                            <div className="tw-ml-auto tw-flex tw-items-center tw-justify-end">
                                <Button variant="hoverInfo" onClick={EditHandler}>
                                    <i className="ri-pencil-line tw-mr-2 tw-text-base"></i>
                                    Edit
                                </Button>
                            </div>
                        </div>}

                        {edit && <div className="tw-grid">
                            <div className="tw-col-auto tw-ml-auto tw-flex tw-pl-4 tw-pb-3 tw-gap-4">
                                <Button variant="secondary" type="button" onClick={CancelHandler}>
                                    Cancel
                                </Button>
                                <Button variant="primary" type="submit" onClick={(e: any) => employeeCurrentJobForm.handleSubmit(e)} disabled={showApiLoader}>
                                    Update
                                </Button>
                            </div>
                        </div>}
                    </div>
                </div>
            </AccordionBody>
        </div>
    )
}
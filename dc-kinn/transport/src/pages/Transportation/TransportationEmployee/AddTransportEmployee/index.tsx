import React, { useMemo, forwardRef, useEffect, useRef, useCallback, useState, useImperativeHandle } from "react";
// Common Component
import { useFormik } from 'formik';
import * as Yup from "yup";
import {
    TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    TextInputWithRegex, UploadImageUpdated, RadioInputContainer,
    AutoSearchInput,
    UploadFileInput
} from "../../../../Components/Common";
import { employeeActiveStatus, employeeTypes, trueFalseOptions, uploadFileErrorHndlr } from "../helper";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct, getCasteListAct,
    getMaritalStatusAct,
    getEmployeeCategoriesAct
} from "../../../../store/masterdata/masterdataactions";
import {
    Min_Date_EMPLOYEE, MinDate_YYYYMMDD_EMPLOYEE, getYearGapCurrentDate, getYyyyMmDdFormat
} from "../../../../utility/dateutility";
import { uploadImageFileErrorHndlr } from "../../../../utility/commonutility";
import { addTransportEmployeeAct, getAadharValidationAct, getEmployeeTypeListAct, getTransportEmployeesAct, transportEmployeeByidAct, updateTransportEmployeeAct } from "../../../../store/transportation/TransportationEmployee/transportationemployeeactions";
import { getEmployeesBasedOnCategoryAct } from "../../../../store/transportation/transportationaction";
import { getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { setTransportEmployeeErrorAct } from "../../../../store/transportation/TransportationEmployee/transportationemployeeslice";
import Button from "../../../../Components/Common/Button";

const Max_Job_Year = 18;
const Employee_Dob_MaxDate_YYYYMMDD = getYyyyMmDdFormat(getYearGapCurrentDate(Max_Job_Year));


const validationSchema = Yup.object().shape({
    isDpsEmployee: Yup.string(),
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string().required("Last name is required."),
    transportEmployeeType: Yup.string().when('isDpsEmployee', {
        is: (isDpsEmployee: any) => isDpsEmployee === "false",
        then: Yup.string().required("Employee type is required."),
    }),
    employeeActiveStatus: Yup.string().required("Status is required."),
    dob: Yup.date().when('isDpsEmployee', {
        is: (isDpsEmployee: any) => isDpsEmployee === "false",
        then: Yup.date().min(MinDate_YYYYMMDD_EMPLOYEE, `DOB should be more than ${Min_Date_EMPLOYEE}.`)
            .max(Employee_Dob_MaxDate_YYYYMMDD, `Employee age should be greater than ${Max_Job_Year} year.`).required("Date of birth required."),
    }),
    genderId: Yup.string().when('isDpsEmployee', {
        is: (isDpsEmployee: any) => isDpsEmployee === "false",
        then: Yup.string().required("Select gender."),
    }),
    aadharNo: Yup.string().when('isDpsEmployee', {
        is: (isDpsEmployee: any) => isDpsEmployee === "false",
        then: Yup.string()
            .test('len', 'Aadhar card number should be 12 digit.', val => !val || val.length === 0 || val.length === 12)
            .matches(/^[0-9]*$/, 'Only numbers are allowed.')
            .required("Aadhar number required."),
    }),
    phoneNo: Yup.string().when('isDpsEmployee', {
        is: (isDpsEmployee: any) => isDpsEmployee === "false",
        then: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    }),
    identificationMark2: Yup.string().when('isDpsEmployee', {
        is: (isDpsEmployee: any) => isDpsEmployee === "false",
        then: Yup.string().test("identificationMark2Check", "Identification mark 2 cannot be same as identification mark 1.",
            (value: any, schema: any) => {
                if (value && value?.toLowerCase() === schema.parent?.identificationMark1?.toLowerCase()) {
                    return false
                }
                return true;
            })
    }),
    licenseExpiryDate: Yup.string().required("License expiry date is required."),
    licenseNumber: Yup.string().required("License number is required."),
});

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}


function getEmployeeFormValues(editData?: any) {
    let userImgFile = "",
        docFileName = "";
    if (editData?.employeeBase64Image) {
        userImgFile = `data:image/jpeg;base64, ${editData?.employeeBase64Image}`;
    }
    if (editData?.licenseDoc) {
        docFileName = editData?.licenseDoc?.originalFileName
    }
    return ({
        firstName: editData?.firstName || "",
        lastName: editData?.lastName || "",
        genderId: editData?.genderId || "",
        dob: editData?.dob || "",
        aadharNo: editData?.aadharNo || "",
        // emailId: editData?.personalEmailId || "",
        phoneNo: editData?.contactNo || "",
        nationalityId: editData?.nationalityId || "",
        religionId: editData?.religionId || "",
        casteId: editData?.casteId || "",
        bloodGroupId: editData?.bloodGroupId || "",
        identificationMark1: editData?.identificationMark1 || "",
        identificationMark2: editData?.identificationMark2 || "",
        martialStatusId: editData?.martialStatusId || "",
        licenseExpiryDate: editData?.licenseExpiryDate || "",
        licenseNumber: editData?.licenseNumber || "",
        isDpsEmployee: getTrueFalseOptions(editData?.isDpsEmployee || false),
        employeeId: editData?.employeeId || "",
        transportEmployeeType: editData?.transportEmployeeType || "",
        employeeActiveStatus: editData?.employeeActiveStatus || "",
        license: docFileName,
        file: userImgFile,

        employeeImg: "",
        licenseFile: "",
        agencyEmployeeId: editData?.agencyEmployeeId || "",
    })
}
const initialValues = getEmployeeFormValues();
function AddTransportEmployee() {
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { employeeId } = useParams<{ employeeId: string }>();
    const lastAadharValidatedRef = useRef<string>("");
    const initialAadharRef = useRef<string | null>(null);
    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId, genderListResp, bloodGroupResp,
        nationalityResp, religionResp, casteListResp, maritalStatusResp,
        getEmployeesBasedOnCategoryResp, getEmployeeByIdResp,
        transportEmployeeByidResp,
        getEmployeeTypeListResp,
        getAadharValidationResp,
        addTransportEmployeeResp, updateTransportEmployeeResp, transportEmployeeErrorResp, employeeManagementErrorResp } =
        useAppSelector(({ appData, masterData, transportrequest, transportEmployee, directoryEmployee }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            genderListResp: masterData.genderListResp,
            bloodGroupResp: masterData.bloodGroupResp,
            nationalityResp: masterData.nationalityResp,
            religionResp: masterData.religionResp,
            casteListResp: masterData.casteListResp,
            maritalStatusResp: masterData.maritalStatusResp,
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            getEmployeesBasedOnCategoryResp: transportrequest.getEmployeesBasedOnCategoryResp,
            addTransportEmployeeResp: transportEmployee.addTransportEmployeeResp,
            transportEmployeeByidResp: transportEmployee.transportEmployeeByidResp,
            updateTransportEmployeeResp: transportEmployee.updateTransportEmployeeResp,
            getEmployeeTypeListResp: transportEmployee.getEmployeeTypeListResp,
            getAadharValidationResp: transportEmployee.getAadharValidationResp,
            transportEmployeeErrorResp: transportEmployee.transportEmployeeErrorResp,
            employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
        }), shallowEqual);

    useEffect(() => {
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getReligionAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "religion", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group", sortBy: "bloodGroupName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getNationalityAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "nationality", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getCasteListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "caste", sortBy: "casteName", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getMaritalStatusAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "MARITAL-STATUS", sortBy: "name", orderBy: "asc", pageNo: 0, pageSize: 100 })));
        dispatch(getEmployeeTypeListAct(generateActionPayload("get_employee_type_list",undefined,undefined)))
    }, []);

    useEffect(() => {
        if (employeeId) {
            dispatch(transportEmployeeByidAct(generateActionPayload("get_transport_employeebyid", {
                employeeId
            })));
        }
    }, [employeeId]);

    const employeeFormRespRef = useRef({
        prevGetEmployeeByIdResp: getEmployeeByIdResp,
        prevAddTransportEmployeeResp: addTransportEmployeeResp,
        prevTransportEmployeeByidResp: transportEmployeeByidResp,
        prevUpdateTransportEmployeeResp: updateTransportEmployeeResp,
        prevEmployeeManagementErrorResp: employeeManagementErrorResp,
        prevTransportEmployeeErrorResp: transportEmployeeErrorResp,
    })
    useEffect(() => {
        const { prevGetEmployeeByIdResp, prevAddTransportEmployeeResp,
            prevEmployeeManagementErrorResp, prevTransportEmployeeByidResp,
            prevUpdateTransportEmployeeResp,
            prevTransportEmployeeErrorResp } = employeeFormRespRef.current;
        if (getEmployeeByIdResp && prevGetEmployeeByIdResp !== getEmployeeByIdResp) {
            const { employeeBasicDetails = {}, employeeDesignationDetails = {} } = getEmployeeByIdResp,
                { employeeName = "" } = employeeBasicDetails;
            const [firstName, ...lastName] = employeeName.trim().split(" ");
            employeeForm.setValues(prevValues => ({
                ...prevValues,
                employeeId: employeeBasicDetails.id || "",
                firstName,
                lastName: lastName?.join(' '),
                transportEmployeeType: employeeDesignationDetails?.employeeCategoryName === "DRIVERS" ? "DRIVER" : employeeDesignationDetails?.employeeCategoryName === "ATTENDERS" ? "ATTENDER" : "",
                genderId: employeeBasicDetails.genderId || "",
                dob: employeeBasicDetails.dob || "",
                aadharNo: employeeBasicDetails.aadharNo || "",
                // emailId: employeeBasicDetails.personalEmailId || "",
                phoneNo: employeeBasicDetails.contactNo || "",
                nationalityId: employeeBasicDetails.nationalityId || "",
                religionId: employeeBasicDetails.religionId || "",
                casteId: employeeBasicDetails.casteId || "",
                bloodGroupId: employeeBasicDetails.bloodGroupId || "",
                martialStatusId: employeeBasicDetails.maritalStatusId || "",
                identificationMark1: employeeBasicDetails.identificationMark1 || "",
                identificationMark2: employeeBasicDetails.identificationMark2 || "",
            }))
        } else if (transportEmployeeByidResp && prevTransportEmployeeByidResp !== transportEmployeeByidResp) {
            const formData = getEmployeeFormValues(transportEmployeeByidResp);
            if (transportEmployeeByidResp?.isDpsEmployee) {
                setSearchEmployeeState({
                    id: transportEmployeeByidResp?.employeeId,
                    employeeName: `${transportEmployeeByidResp?.firstName} ${transportEmployeeByidResp?.lastName}`,
                    employeeCode: transportEmployeeByidResp?.employeeCode,
                });
            }
            employeeForm.setValues(formData);
            initialAadharRef.current = transportEmployeeByidResp?.aadharNo || "";
        } else if (addTransportEmployeeResp && prevAddTransportEmployeeResp !== addTransportEmployeeResp) {
            toast.success('Transport employee added successfully.');
            history.push('/transportation-employee');
        } else if (updateTransportEmployeeResp && prevUpdateTransportEmployeeResp !== updateTransportEmployeeResp) {
            toast.success('Transport employee updated successfully.');
            history.push('/transportation-employee');
        } else if (employeeManagementErrorResp && prevEmployeeManagementErrorResp !== employeeManagementErrorResp) {
            const { details, message } = employeeManagementErrorResp;
            toast.error(details || message || 'Something went wrong.');
        } else if (transportEmployeeErrorResp && prevTransportEmployeeErrorResp !== transportEmployeeErrorResp) {
            const { details, message } = transportEmployeeErrorResp;
            toast.error(details || message || 'Something went wrong.');
        }
        employeeFormRespRef.current.prevGetEmployeeByIdResp = getEmployeeByIdResp;
        employeeFormRespRef.current.prevTransportEmployeeByidResp = transportEmployeeByidResp;
        employeeFormRespRef.current.prevAddTransportEmployeeResp = addTransportEmployeeResp;
        employeeFormRespRef.current.prevUpdateTransportEmployeeResp = updateTransportEmployeeResp;
        employeeFormRespRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
        employeeFormRespRef.current.prevTransportEmployeeErrorResp = transportEmployeeErrorResp;
    }, [getEmployeeByIdResp, transportEmployeeByidResp,
        addTransportEmployeeResp, updateTransportEmployeeResp,

        employeeManagementErrorResp, transportEmployeeErrorResp]);

    function getAadharValidation(aadharNo: string,employeeId?:any) {
        dispatch(getAadharValidationAct(generateActionPayload("get_aadhar_validation", { aadharNo:aadharNo, transportEmployeeId: employeeId })));
    }


    const employeeForm = useFormik({
        validationSchema,
        initialValues,
         onSubmit: (values) => {
            if (transportEmployeeErrorResp) {
                toast.error(
                    transportEmployeeErrorResp?.details ||
                    transportEmployeeErrorResp?.message ||
                    "Please resolve the error before submitting."
                );
                return;
            }

            const { license, licenseFile, file, employeeImg, ...requestPayload }: any = values;
            const payload = new FormData();
            requestPayload.branchId = branchId;
            payload.append("request", JSON.stringify(requestPayload));

            if (licenseFile) {
                payload.append("license", licenseFile);
            }
            if (employeeImg) {
                payload.append("file", employeeImg);
            }

            if (employeeId) {
                dispatch(
                    updateTransportEmployeeAct(
                        generateActionPayload("update_transport_employee", { employeeId }, payload)
                    )
                );
                return;
            }

            dispatch(
                addTransportEmployeeAct(
                    generateActionPayload("add_transport_employee", undefined, payload)
                )
            );
        },
    });

   useEffect(() => {
        if (employeeForm.values.isDpsEmployee !== "false") {
            return;
        }

        const aadhar = (employeeForm.values.aadharNo || "").trim();

        if (aadhar.length !== 12 || !/^[0-9]{12}$/.test(aadhar)) {
            lastAadharValidatedRef.current = "";
            return;
        }


        if (lastAadharValidatedRef.current === aadhar) {
            return;
        }

        if (transportEmployeeErrorResp) {
            dispatch(setTransportEmployeeErrorAct(undefined));
        }

        lastAadharValidatedRef.current = aadhar;
        getAadharValidation(aadhar,employeeId ?? "");
    }, [
        employeeForm.values.aadharNo,
        employeeForm.values.isDpsEmployee,
        employeeId,
    ]);

    useEffect(() => {
        if (transportEmployeeErrorResp) {
            dispatch(setTransportEmployeeErrorAct(undefined));
        }
    }, []);


    function onChangeEmployeeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        employeeForm.resetForm({
            values: getEmployeeFormValues({
                licenseExpiryDate: employeeForm.values.licenseExpiryDate,
                licenseNumber: employeeForm.values.licenseNumber,
                isDpsEmployee: value,
                license: employeeForm.values.license,
                file: employeeForm.values.file,

                employeeImg: employeeForm.values.employeeImg,
                licenseFile: employeeForm.values.licenseFile,
            })
        });
        setSearchEmployeeState(null);
    }

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            dispatch(getEmployeesBasedOnCategoryAct(generateActionPayload("get_employee_based_on_category", { branchId },
                { categoryNames: "DRIVERS,ATTENDERS", searchString: inputString })))
            // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
        }
    }

    function selectEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
        if (selectedEmployee) {
            const { id: employeeId } = selectedEmployee;
            dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId })));
        } else {
            employeeForm.resetForm({
                values: getEmployeeFormValues({
                    licenseExpiryDate: employeeForm.values.licenseExpiryDate || "",
                    licenseNumber: employeeForm.values.licenseNumber || "",
                    isDpsEmployee: "true",
                    license: employeeForm.values.license || "",
                    file: employeeForm.values.file || "",

                    employeeImg: employeeForm.values.employeeImg || "",
                    licenseFile: employeeForm.values.licenseFile || "",
                })
            });
        }
    }

    function onChangePhoneHndlr(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        employeeForm.setFieldValue(name, updateDate);
    }

    function licenceUploadHndlr(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        const errorMessage = uploadFileErrorHndlr(file.size, file.type);
        if (errorMessage) {
            employeeForm.setFieldTouched(name, true, false);
            employeeForm.setFieldValue(name, "", false);
            employeeForm.setFieldError(name, errorMessage);
        } else {
            const fileKeyName = `${name}File`;
            employeeForm.setValues(prevValues => ({
                ...prevValues,
                [name]: file?.name,
                [fileKeyName]: file
            }))
        }
    }

    function removeFileHandler(inputName: string) {
        const fileKeyName = `${inputName}File`;
        employeeForm.setValues(prevValues => ({
            ...prevValues,
            [inputName]: "",
            [fileKeyName]: ""
        }))
    }


    function userImageUploadHndlr(event: any) {
        const { name } = event.target;
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            employeeForm.setFieldTouched(name, true, false);
            employeeForm.setFieldValue(name, "", false);
            employeeForm.setFieldError(name, uploadFileMessage);
            return;
        }
        employeeForm.setValues(prevValues => ({
            ...prevValues,
            [name]: URL.createObjectURL(file),
            employeeImg: file
        }))
    }

    function cancelHandler() {
        history.push('/transportation-employee');
    }

    const isEditMode = !!employeeId;
    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb title="Add Transport Employee" pageTitle="Transportation" />

                <div className="tw-flex tw-justify-center">
                    <div className="tw-w-full xl:tw-w-10/12">
                        <div className="tw-flex">
                            <div className="tw-w-full">
                                <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
                                    <div className="tw-border-b tw-px-4 tw-py-3">
                                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                            {employeeId ? "Update" : "Add"} Transport Employee
                                        </h4>
                                    </div>
                                    <div className="tw-px-4 tw-py-4">
                                        <form onSubmit={employeeForm.handleSubmit}>
                                            <div className="tw-border-b tw-mb-4">
                                                <span className="tw-text-primary tw-font-semibold tw-block tw-mb-1">
                                                    Basic Info
                                                </span>
                                            </div>

                                            <div className="tw-flex tw-gap-6">
                                                <div className="tw-w-4/12 tw-flex tw-flex-col">
                                                    <UploadImageUpdated
                                                        name="file"
                                                        acceptFileFormat=" image/jpg, image/png, image/jpeg"
                                                        value={employeeForm.values.file}
                                                        onChange={userImageUploadHndlr}
                                                        error={employeeForm.errors.file || ""}
                                                    />
                                                </div>

                                                <div className="tw-w-8/12">
                                                    <div className="tw-grid tw-grid-cols-2 tw-gap-4">
                                                        <RadioInputContainer
                                                            name="isFatherEmployeeOfSchool"
                                                            radioClassName="form-radio-green"
                                                            labelText="Employee of the School ?"
                                                            inputContainerClassName="tw-mt-2"
                                                            radioOptions={trueFalseOptions}
                                                            value={employeeForm.values.isDpsEmployee}
                                                            onChange={onChangeEmployeeHndlr}
                                                            isDisabled={isEditMode}
                                                        />

                                                        <AutoSearchInput
                                                            formgroupClassName="search-box tw-mb-3"
                                                            name="fatherEmployeeId"
                                                            labelText="Employee Name / Code"
                                                            labelClass={(employeeForm.values.isDpsEmployee === "true") ? "required" : ""}
                                                            onChange={onInputSearchChange}
                                                            onBlur={employeeForm.handleBlur}
                                                            valueKey="id"
                                                            labelKey="employeeName"
                                                            subLabelKey="employeeCode"
                                                            labelHeader="Employee Code"
                                                            subLabelHeader="Employee Name"
                                                            options={Array.isArray(getEmployeesBasedOnCategoryResp) ? getEmployeesBasedOnCategoryResp : []}
                                                            selected={searchEmployeeState}
                                                            selectedOptionCallbck={selectEmployeeHndlr}
                                                            isDisabled={employeeForm.values.isDpsEmployee === "false" || isEditMode}
                                                            invalid={(employeeForm.touched.employeeId && employeeForm.errors.employeeId) ? true : false}
                                                            error={(employeeForm.touched.employeeId && employeeForm.errors.employeeId) ? employeeForm.errors.employeeId : ""}
                                                        >
                                                            <i className="ri-search-line search-icon"></i>
                                                        </AutoSearchInput>

                                                        <TextInput
                                                            name="firstName"
                                                            labelText="First Name"
                                                            labelClass={
                                                                employeeForm.values.isDpsEmployee === "false"
                                                                    ? "required"
                                                                    : ""
                                                            }
                                                            value={employeeForm.values.firstName}
                                                            onChange={employeeForm.handleChange}
                                                            onBlur={employeeForm.handleBlur}
                                                            invalid={(employeeForm.touched.firstName && employeeForm.errors.firstName) ? true : false}
                                                            error={(employeeForm.touched.firstName && employeeForm.errors.firstName) ? employeeForm.errors.firstName : ""}
                                                        />

                                                        <TextInput
                                                            name="lastName"
                                                            labelText="Last Name"
                                                            labelClass={
                                                                employeeForm.values.isDpsEmployee === "false"
                                                                    ? "required"
                                                                    : ""
                                                            }
                                                            value={employeeForm.values.lastName}
                                                            onChange={employeeForm.handleChange}
                                                            onBlur={employeeForm.handleBlur}
                                                            invalid={(employeeForm.touched.lastName && employeeForm.errors.lastName) ? true : false}
                                                            error={(employeeForm.touched.lastName && employeeForm.errors.lastName) ? employeeForm.errors.lastName : ""}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="tw-grid tw-grid-cols-3 tw-gap-4 tw-mb-3">
                                               
                                                <SelectInput
                                                        name="transportEmployeeType"
                                                        labelText="Employee Type"
                                                        labelClass={(employeeForm.values.isDpsEmployee === "false") ? "required" : ""}
                                                        value={employeeForm.values.transportEmployeeType}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        menuItems={getEmployeeTypeListResp && Array.isArray(getEmployeeTypeListResp) ? getEmployeeTypeListResp : []}
                                                        valueKey="employeeType"
                                                        textKey="employeeType"
                                                        isDisabled={employeeForm.values.isDpsEmployee === "true"}
                                                        invalid={(employeeForm.touched.transportEmployeeType && employeeForm.errors.transportEmployeeType) ? true : false}
                                                        error={(employeeForm.touched.transportEmployeeType && employeeForm.errors.transportEmployeeType) ? employeeForm.errors.transportEmployeeType : ""}
                                                    />
                                                
                                                
                                                    <SelectInput
                                                        name="employeeActiveStatus"
                                                        labelText="Active Status"
                                                        labelClass="required"
                                                        value={employeeForm.values.employeeActiveStatus}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        invalid={(employeeForm.touched.employeeActiveStatus && employeeForm.errors.employeeActiveStatus) ? true : false}
                                                        error={(employeeForm.touched.employeeActiveStatus && employeeForm.errors.employeeActiveStatus) ? employeeForm.errors.employeeActiveStatus : ""}
                                                        menuItems={employeeActiveStatus}
                                                        valueKey="id"
                                                        textKey="name"
                                                    />
                                                
                                                
                                                    <SelectInput
                                                        name="genderId"
                                                        labelText="Gender"
                                                        labelClass={(employeeForm.values.isDpsEmployee === "false") ? "required" : ""}
                                                        value={employeeForm.values.genderId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        invalid={(employeeForm.touched.genderId && employeeForm.errors.genderId) ? true : false}
                                                        error={(employeeForm.touched.genderId && employeeForm.errors.genderId) ? employeeForm.errors.genderId : ""}
                                                        menuItems={genderListResp?.data}
                                                        isDisabled={employeeForm.values.isDpsEmployee === "true"}
                                                        valueKey="genderId"
                                                        textKey="genderName"
                                                    />
                                                
                                                
                                                    <DateInput
                                                        name="dob"
                                                        labelText="Date Of Birth"
                                                        labelClass={(employeeForm.values.isDpsEmployee === "false") ? "required" : ""}
                                                        value={employeeForm.values.dob}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        isDisabled={employeeForm.values.isDpsEmployee === "true"}
                                                        invalid={(employeeForm.touched.dob && employeeForm.errors.dob) ? true : false}
                                                        error={(employeeForm.touched.dob && employeeForm.errors.dob) ? employeeForm.errors.dob : ""}
                                                        minDate={MinDate_YYYYMMDD_EMPLOYEE}
                                                        maxDate={Employee_Dob_MaxDate_YYYYMMDD}
                                                    />
                                                
                                                
                                                    <TextInputWithRegex
                                                        name="aadharNo"
                                                        labelText="Aadhar No"
                                                        labelClass={(employeeForm.values.isDpsEmployee === "false") ? "required" : ""}
                                                        value={employeeForm.values.aadharNo}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        invalid={(employeeForm.touched.aadharNo && employeeForm.errors.aadharNo) ? true : false}
                                                        error={(employeeForm.touched.aadharNo && employeeForm.errors.aadharNo) ? employeeForm.errors.aadharNo : ""}
                                                        allowedInputRegex="^[0-9]+$"
                                                        maxLength={12}
                                                    />
                                                    {/* <TextIconInput
                                                        name="emailId"
                                                        labelText="Email-Id"
                                                        labelClass={(employeeForm.values.isDpsEmployee === "false") ? "required" : ""}
                                                        value={employeeForm.values.emailId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        isDisabled={employeeForm.values.isDpsEmployee === "true"}
                                                        invalid={(employeeForm.touched.emailId && employeeForm.errors.emailId) ? true : false}
                                                        error={(employeeForm.touched.emailId && employeeForm.errors.emailId) ? employeeForm.errors.emailId : ""}
                                                    ><i className="ri-mail-unread-line"></i></TextIconInput> */}
                                                    <PhoneInput
                                                        name="phoneNo"
                                                        labelText="Phone No"
                                                        labelClass={(employeeForm.values.isDpsEmployee === "false") ? "required" : ""}
                                                        value={employeeForm.values.phoneNo}
                                                        onChange={onChangePhoneHndlr}
                                                        onBlur={employeeForm.handleBlur}
                                                        isDisabled={employeeForm.values.isDpsEmployee === "true"}
                                                        invalid={(employeeForm.touched.phoneNo && employeeForm.errors.phoneNo) ? true : false}
                                                        error={(employeeForm.touched.phoneNo && employeeForm.errors.phoneNo) ? employeeForm.errors.phoneNo : ""}
                                                    />
                                                
                                                    <SelectInput
                                                        name="nationalityId"
                                                        labelText="Nationality"
                                                        value={employeeForm.values.nationalityId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        menuItems={nationalityResp?.data}
                                                        valueKey="nationalityId"
                                                        textKey="nationalityName"
                                                    />
                                                
                                                    <SelectInput
                                                        name="religionId"
                                                        labelText="Religion"
                                                        value={employeeForm.values.religionId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        menuItems={religionResp?.data}
                                                        valueKey="religionId"
                                                        textKey="religionName"
                                                    />
                                                
                                                    <SelectInput
                                                        name="casteId"
                                                        labelText="Caste"
                                                        value={employeeForm.values.casteId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        menuItems={casteListResp?.data}
                                                        valueKey="casteId"
                                                        textKey="casteName"
                                                    />
                                                
                                                    <SelectInput
                                                        name="bloodGroupId"
                                                        labelText="Blood Group"
                                                        value={employeeForm.values.bloodGroupId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        menuItems={bloodGroupResp?.data}
                                                        valueKey="bloodGroupId"
                                                        textKey="bloodGroupName"
                                                    />
                                                
                                                    <SelectInput
                                                        name="martialStatusId"
                                                        labelText="Marital Status"
                                                        value={employeeForm.values.martialStatusId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        menuItems={maritalStatusResp?.data}
                                                        valueKey="id"
                                                        textKey="name"
                                                    />
                                                
                                                    <TextInput
                                                        name="identificationMark1"
                                                        labelText="Identification Mark 1"
                                                        value={employeeForm.values.identificationMark1}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                    />
                                                
                                                    <TextInput
                                                        name="identificationMark2"
                                                        labelText="Identification Mark 2"
                                                        value={employeeForm.values.identificationMark2}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                        invalid={(employeeForm.touched.identificationMark2 && employeeForm.errors.identificationMark2) ? true : false}
                                                        error={(employeeForm.touched.identificationMark2 && employeeForm.errors.identificationMark2) ? employeeForm.errors.identificationMark2 : ""}
                                                    />
                                                    <TextInput
                                                        name="agencyEmployeeId"
                                                        labelText="Agency Employee ID"
                                                        value={employeeForm.values.agencyEmployeeId}
                                                        onChange={employeeForm.handleChange}
                                                        onBlur={employeeForm.handleBlur}
                                                    />

                                            </div>
                                            <div className="tw-border-b tw-border-gray-300 tw-mb-4">
                                                <span className="tw-text-base tw-text-blue-600 tw-font-semibold tw-block tw-mb-1">
                                                    Driving Details
                                                </span>
                                            </div>

                                            <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                                                <TextInput
                                                    name="licenseNumber"
                                                    labelText="License Number"
                                                    labelClass="required"
                                                    value={employeeForm.values.licenseNumber}
                                                    onChange={employeeForm.handleChange}
                                                    onBlur={employeeForm.handleBlur}
                                                    invalid={(employeeForm.touched.licenseNumber && employeeForm.errors.licenseNumber) ? true : false}
                                                    error={(employeeForm.touched.licenseNumber && employeeForm.errors.licenseNumber) ? employeeForm.errors.licenseNumber : ""}
                                                    />

                                                <DateInput
                                                    name="licenseExpiryDate"
                                                    labelText="License Expiry Date"
                                                    labelClass="required"
                                                    value={employeeForm.values.licenseExpiryDate}
                                                    onChange={employeeForm.handleChange}
                                                    onBlur={employeeForm.handleBlur}
                                                    invalid={
                                                        employeeForm.touched.licenseExpiryDate &&
                                                            employeeForm.errors.licenseExpiryDate
                                                            ? true
                                                            : false
                                                    }
                                                    error={
                                                        employeeForm.touched.licenseExpiryDate &&
                                                            employeeForm.errors.licenseExpiryDate
                                                            ? employeeForm.errors.licenseExpiryDate
                                                            : ""
                                                    }
                                                />

                                                <div className="tw-col-span-3">
                                                    <UploadFileInput
                                                        name="license"
                                                        labelText="Upload License Document"
                                                        helperText="File size less than 1mb (preferred)."
                                                        value={employeeForm.values.license || ""}
                                                        onChange={licenceUploadHndlr}
                                                        hideUploadBtn={true}
                                                        canRemove={true}
                                                        removeFileHandler={removeFileHandler}
                                                        invalid={
                                                            employeeForm.touched.license &&
                                                                employeeForm.errors.license
                                                                ? true
                                                                : false
                                                        }
                                                        error={
                                                            employeeForm.touched.license &&
                                                                employeeForm.errors.license
                                                                ? employeeForm.errors.license
                                                                : ""
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="tw-flex tw-justify-end tw-items-center tw-mt-4 tw-gap-2">
                                                <Button
                                                variant="secondary"
                                                    onClick={cancelHandler}
                                                    type="button"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                variant="primary"
                                                    type="submit"
                                                >
                                                    {employeeId ? "Update" : "Save"}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}


export default AddTransportEmployee;

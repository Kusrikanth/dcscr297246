import React, { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import {
    AccordionBody,
    AccordionHeader
} from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";

import {
    TextIconInput, TextInput, SelectInput, PhoneInput,
    RadioInputContainer,
    AutoSearchInput, TextInputWithRegex, MemoizedSelectInput,
    CustomSelect
} from "../../../../../../Components/Common";

import StudentImgIcon from "../../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    trueFalseOptions, StepperFormContext
} from "../helper";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../../utility/commonutility";

import { getEmployeeByFilterAct } from "../../../../../../store/directory/employeemanagement/employeemanagementactions";

import { getStudentFatherEmployeeDetailsAct } from "../../../../../../store/directory/studentmanagement/studentmanagementactions";
import { getIncomeOptions, getQualificationName, incomeOptions, qualificationOptions, renderOptionsEmployee, renderValueSection } from "./helper";
import { getOccupationAct } from "../../../../../../store/masterdata/masterdataactions";

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

export function getFatherInfoInitialState(initialState?: any) {
    return {
        isFatherEmployeeOfSchool: getTrueFalseOptions(initialState?.isFatherEmployeeOfSchool),
        fatherEmployeeId: initialState?.fatherEmployeeId || "",
        fatherEmployeeCode: initialState?.fatherEmployeeCode || "",
        fatherName: initialState?.fatherName || "",
        fatherAadharNo: initialState?.fatherAadharNo || "",
        fatherEmail: initialState?.fatherEmail || "",
        fatherPhoneNo: initialState?.fatherPhoneNo || "",
        fatherWhatsappNo: initialState?.fatherWhatsappNo || "",
        fatherQualificationName: getQualificationName(initialState?.fatherQualificationName),
        fatherQualificationSpec: initialState?.fatherQualificationSpec || "",
        fatherOccupationId: initialState?.fatherOccupationId || "",
        fatherCompany: initialState?.fatherCompany || "",
        fatherDesignationName: initialState?.fatherDesignationName || "",
        fatherAnnualIncome: initialState?.fatherAnnualIncome || "",
        fatherOfficeLocation: initialState?.fatherOfficeLocation || ""
    }
}

const validationSchema = Yup.object().shape({
    isFatherEmployeeOfSchool: Yup.string(),
    fatherEmployeeId: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "true",
        then: Yup.string()
            .required('Employee id required.')
    }),
    fatherName: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Father name required.')
    }),
    fatherEmail: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string().email('Invalid Email.').
            required('Email id required.')
    }),
    fatherPhoneNo: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required.")
    }),
    fatherWhatsappNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Whatsapp number with 10 digit is valid.'),
    fatherQualificationName: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Qualification required.')
    }),
    fatherOccupationId: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Occupation required.')
    }),
    fatherCompany: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Organization required.')
    }),
    fatherDesignationName: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Designation required.')
    }),
    fatherAnnualIncome: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Income required.')
    }),
    fatherOfficeLocation: Yup.string().when('isFatherEmployeeOfSchool', {
        is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Office address required.')
    })
});

const initialValues = getFatherInfoInitialState();
export default function FatherInfo({ isViewMode, stepId, formId,
    storeMultiFormDataCallback }: any) {
    const { tabsData, currentMultiFormKeys } = useContext<any>(StepperFormContext);
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
    const dispatch = useAppDispatch();
    const { occupationResp, studentFatherEmployeeDetailsResp, getEmployeesByFilterResp, employeeManagementErrorResp } =
        useAppSelector(({ masterData, directoryEmployee, directoryStudent }) => ({
            occupationResp: masterData.occupationResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            studentFatherEmployeeDetailsResp: directoryStudent.studentFatherEmployeeDetailsResp,
            employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp
        }), shallowEqual);

    const fatherInfoRef = useRef<any>({
        prevStudentFatherEmployeeDetailsResp: studentFatherEmployeeDetailsResp,
        prevEmployeeManagementErrorResp: employeeManagementErrorResp
    });
    
    useEffect(() => {
        const { prevStudentFatherEmployeeDetailsResp, prevEmployeeManagementErrorResp } = fatherInfoRef.current;
        if (studentFatherEmployeeDetailsResp && prevStudentFatherEmployeeDetailsResp !== studentFatherEmployeeDetailsResp) {
            const { employeeBasicDetails, employeeCurrentJob,
                employeeEducationDetails, employeeDesignationDetails, employeeSalaryDetails } =
                studentFatherEmployeeDetailsResp;
            fatherForm.setValues({
                isFatherEmployeeOfSchool: "true",
                fatherEmployeeId: employeeBasicDetails?.id || "",
                fatherEmployeeCode: employeeBasicDetails?.employeeCode || "",
                fatherName: employeeBasicDetails?.employeeName || "",
                fatherAadharNo: employeeBasicDetails?.aadharNo || "",
                fatherEmail: employeeBasicDetails?.personalEmailId || "",
                fatherPhoneNo: employeeBasicDetails?.contactNo || "",
                fatherWhatsappNo: employeeBasicDetails?.fatherWhatsappNo || "",
                fatherQualificationName: getQualificationName(employeeEducationDetails?.qualificationName),
                fatherQualificationSpec: "",
                fatherOccupationId: employeeBasicDetails?.fatherOccupationId || "",
                fatherCompany: employeeBasicDetails?.organizationName || "",
                fatherDesignationName: employeeDesignationDetails?.designationName || "",
                fatherAnnualIncome: getIncomeOptions(employeeSalaryDetails?.grossSalary),
                fatherOfficeLocation: employeeCurrentJob?.workLocation || "",

            })
        } else if (employeeManagementErrorResp && prevEmployeeManagementErrorResp !== employeeManagementErrorResp) {
            // isEmployeeSearchedRef.current = false;
        }
        fatherInfoRef.current.prevStudentFatherEmployeeDetailsResp = studentFatherEmployeeDetailsResp;
        fatherInfoRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
    }, [studentFatherEmployeeDetailsResp, employeeManagementErrorResp]);

    const fatherForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            const payload = { ...values };
            // payload.fatherContributeStakeHolder = selectedStakeHolderListState.map((item: any) => item.stakeHolder);
            storeMultiFormDataCallback(formId, true, fatherForm.dirty, payload);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            fatherForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const { fatherEmployeeId, fatherEmployeeCode, fatherName } = tabsData[stepId];
            const formData = getFatherInfoInitialState(tabsData[stepId]);
            fatherForm.resetForm({
                values: formData
            });
            setSearchEmployeeState({
                employeeId: fatherEmployeeId,
                employeeCode: fatherEmployeeCode,
                employeeName: fatherName
            });

        }
    }, [tabsData, stepId]);


    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        fatherForm.setFieldValue(name, updateDate);
    }

    function onChangeEmployeeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        fatherForm.resetForm({
            values: getFatherInfoInitialState({ isFatherEmployeeOfSchool: value })
        });
        setSearchEmployeeState(null);
    }

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString },
                payload = { genderId: 1, instituteGroupId: 1, isOtherEmployee: false };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
        }
    }

    function selectEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
        if (selectedEmployee) {
            const { id } = selectedEmployee;
            dispatch(getStudentFatherEmployeeDetailsAct(generateActionPayload("get_employee_byid", { employeeId: id })));
        } else {
            fatherForm.resetForm({
                values: getFatherInfoInitialState({ isFatherEmployeeOfSchool: "true" }),
            });
        }
    }

    function handleOccupationChange(selected: any, config: any) {
        const { name } = config;
        fatherForm.setFieldValue(name, selected);
    }

    return (
        <form onSubmit={fatherForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                Father Info
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="tw-flex tw-flex-wrap -tw-mx-1.5">
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <RadioInputContainer
                            name="isFatherEmployeeOfSchool"
                            radioClassName="form-radio-green"
                            labelText="Employee of the School ?"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={trueFalseOptions}
                            isDisabled={isViewMode}
                            value={fatherForm.values.isFatherEmployeeOfSchool}
                            onChange={onChangeEmployeeHndlr}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <AutoSearchInput
                            formgroupClassName="tw-relative tw-mb-3"
                            name="fatherEmployeeId"
                            labelText="Parent Name"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "true") ? "required" : ""}
                            onChange={onInputSearchChange}
                            onBlur={fatherForm.handleBlur}
                            valueKey="id"
                            labelKey="employeeName"
                            subLabelKey="employeeCode"
                            labelHeader="Employee Code"
                            subLabelHeader="Employee Name"
                            options={getEmployeesByFilterResp}
                            selected={searchEmployeeState}
                            selectedOptionCallbck={selectEmployeeHndlr}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "false"}
                            invalid={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? true : false}
                            error={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? fatherForm.errors.fatherEmployeeId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="fatherName"
                            labelText="Name"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            maxLength={100}
                            value={fatherForm.values.fatherName}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherName && fatherForm.errors.fatherName) ? true : false}
                            error={(fatherForm.touched.fatherName && fatherForm.errors.fatherName) ? fatherForm.errors.fatherName : ""}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInputWithRegex
                            name="fatherAadharNo"
                            labelText="Aadhar Number"
                            value={fatherForm.values.fatherAadharNo}
                            onChange={fatherForm.handleChange}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                            maxLength={12}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextIconInput
                            name="fatherEmail"
                            labelText="Email ID"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            value={fatherForm.values.fatherEmail}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherEmail && fatherForm.errors.fatherEmail) ? true : false}
                            error={(fatherForm.touched.fatherEmail && fatherForm.errors.fatherEmail) ? fatherForm.errors.fatherEmail : ""}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <PhoneInput
                            name="fatherPhoneNo"
                            labelText="Phone No."
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            value={fatherForm.values.fatherPhoneNo}
                            onChange={onChangePhoneInput}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherPhoneNo && fatherForm.errors.fatherPhoneNo) ? true : false}
                            error={(fatherForm.touched.fatherPhoneNo && fatherForm.errors.fatherPhoneNo) ? fatherForm.errors.fatherPhoneNo : ""}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <PhoneInput
                            name="fatherWhatsappNo"
                            labelText="Father Whatsapp No."
                            value={fatherForm.values.fatherWhatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherWhatsappNo && fatherForm.errors.fatherWhatsappNo) ? true : false}
                            error={(fatherForm.touched.fatherWhatsappNo && fatherForm.errors.fatherWhatsappNo) ? fatherForm.errors.fatherWhatsappNo : ""}
                            isDisabled={isViewMode}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <SelectInput
                            name="fatherQualificationName"
                            labelText="Qualification"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            value={fatherForm.values.fatherQualificationName}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherQualificationName && fatherForm.errors.fatherQualificationName) ? true : false}
                            error={(fatherForm.touched.fatherQualificationName && fatherForm.errors.fatherQualificationName) ? fatherForm.errors.fatherQualificationName : ""}
                            menuItems={qualificationOptions}
                            valueKey="id"
                            textKey="name"
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="fatherQualificationSpec"
                            labelText="Specify Qualification"
                            isDisabled={isViewMode}
                            value={fatherForm.values.fatherQualificationSpec}
                            onChange={fatherForm.handleChange}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <CustomSelect
                            name="fatherOccupationId"
                            labelText="Occupation"
                            value={fatherForm.values.fatherOccupationId}
                            options={occupationResp?.data}
                            idKey="occupationId"
                            searchKey="occupationName"
                            renderValue={renderValueSection}
                            renderOptions={renderOptionsEmployee}
                            onChange={handleOccupationChange}
                            labelClass="required"
                            defaultSelect="Select"
                            invalid={(fatherForm.touched.fatherOccupationId && fatherForm.errors.fatherOccupationId) ? true : false}
                            error={(fatherForm.touched.fatherOccupationId && fatherForm.errors.fatherOccupationId) ? fatherForm.errors.fatherOccupationId : ""}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="fatherCompany"
                            labelText="Name Of Organization"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            value={fatherForm.values.fatherCompany}
                            onChange={fatherForm.handleChange}
                            invalid={(fatherForm.touched.fatherCompany && fatherForm.errors.fatherCompany) ? true : false}
                            error={(fatherForm.touched.fatherCompany && fatherForm.errors.fatherCompany) ? fatherForm.errors.fatherCompany : ""}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="fatherDesignationName"
                            labelText="Designation"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            value={fatherForm.values.fatherDesignationName}
                            onChange={fatherForm.handleChange}
                            invalid={(fatherForm.touched.fatherDesignationName && fatherForm.errors.fatherDesignationName) ? true : false}
                            error={(fatherForm.touched.fatherDesignationName && fatherForm.errors.fatherDesignationName) ? fatherForm.errors.fatherDesignationName : ""}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <SelectInput
                            name="fatherAnnualIncome"
                            labelText="Annual Income"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            value={fatherForm.values.fatherAnnualIncome}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherAnnualIncome && fatherForm.errors.fatherAnnualIncome) ? true : false}
                            error={(fatherForm.touched.fatherAnnualIncome && fatherForm.errors.fatherAnnualIncome) ? fatherForm.errors.fatherAnnualIncome : ""}
                            menuItems={incomeOptions}
                            valueKey="id"
                            textKey="name"
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full tw-px-1.5">
                        <TextInput
                            name="fatherOfficeLocation"
                            labelText="Office Address"
                            labelClass={(fatherForm.values.isFatherEmployeeOfSchool === "false") ? "required" : ""}
                            value={fatherForm.values.fatherOfficeLocation}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherOfficeLocation && fatherForm.errors.fatherOfficeLocation) ? true : false}
                            error={(fatherForm.touched.fatherOfficeLocation && fatherForm.errors.fatherOfficeLocation) ? fatherForm.errors.fatherOfficeLocation : ""}
                            isDisabled={isViewMode || fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}
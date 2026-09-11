import { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import {
    UncontrolledAccordion, AccordionBody,
    AccordionHeader, AccordionItem, Collapse
} from "reactstrap";

import { useFormik, setNestedObjectValues } from "formik";
import * as Yup from "yup";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch, SelectWithTextInput,
    UploadImage, AutoSearchInput,
    UploadImageUpdated, TextInputWithRegex, MultiSelect, MemoizedSelectInput,
    CustomSelect
} from "../../../../../../Components/Common";

import StudentImgIcon from "../../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    trueFalseOptions
} from "../helper";
import { StepperFormContext } from "../helper";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../../utility/commonutility";

import { getEmployeeByFilterAct } from "../../../../../../store/directory/employeemanagement/employeemanagementactions";
import { getStudentMotherEmployeeDetailsAct } from "../../../../../../store/directory/studentmanagement/studentmanagementactions";
import { getIncomeOptions, getQualificationName, incomeOptions, qualificationOptions, renderOptionsEmployee, renderValueSection } from "./helper";

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}

export function getMotherInfoInitialState(initialState?: any) {
    return {
        isMotherEmployeeOfSchool: getTrueFalseOptions(initialState?.isMotherEmployeeOfSchool) || "false",
        motherEmployeeId: initialState?.motherEmployeeId || "",
        motherEmployeeCode: initialState?.motherEmployeeCode || "",
        motherName: initialState?.motherName || "",
        motherAadharNo: initialState?.motherAadharNo || "",
        motherEmail: initialState?.motherEmail || "",
        motherPhoneNo: initialState?.motherPhoneNo || "",
        motherWhatsappNo: initialState?.motherWhatsappNo || "",
        motherQualificationName: getQualificationName(initialState?.motherQualificationName),
        motherQualificationSpec: initialState?.motherQualificationSpec || "",
        motherOccupationId: initialState?.motherOccupationId || "",
        motherCompany: initialState?.motherCompany || "",
        motherDesignationName: initialState?.motherDesignationName || "",
        motherAnnualIncome: initialState?.motherAnnualIncome || "",
        motherOfficeLocation: initialState?.motherOfficeLocation || "",
    }
}

const validationSchema = Yup.object().shape({
    isMotherEmployeeOfSchool: Yup.string(),
    motherEmployeeId: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "true",
        then: Yup.string()
            .required('Employee id required.')
    }),
    motherName: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Mother name required.')
    }),
    // motherAadharNo: Yup.string().when('isMotherEmployeeOfSchool', {
    //     is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
    //     then: Yup.string()
    //         .required('Document number required.')
    // }),
    motherEmail: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string().email('Invalid Email.').required('Email id required.')
    }),
    motherPhoneNo: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required.")
    }),
    motherWhatsappNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Whatsapp number with 10 digit is valid.'),
    motherQualificationName: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Qualification required.')
    }),
    motherOccupationId: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Occupation required.')
    }),
    motherCompany: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Organization required.')
    }),
    motherDesignationName: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Designation required.')
    }),
    motherAnnualIncome: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Income required.')
    }),
    motherOfficeLocation: Yup.string().when('isMotherEmployeeOfSchool', {
        is: (isMotherEmployeeOfSchool: any) => isMotherEmployeeOfSchool === "false",
        then: Yup.string()
            .required('Office address required.')
    })
});

const initialValues = getMotherInfoInitialState();
export default function MotherInfo({
    isViewMode,
    stepId,
    formId, storeMultiFormDataCallback

}: any) {
    const {
        tabsData, currentMultiFormKeys, storeMultiFormData
    } = useContext<any>(StepperFormContext);
    // const [fillEmployeeDetailsState, setFillEmployeeDetailsState] = useState<boolean>(false);
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
    const [selectedStakeHolderListState, setSelectedFeeCategoryListState] = useState<any>([]);

    const dispatch = useAppDispatch();
    const { occupationResp, studentMotherEmployeeDetailsResp, getEmployeesByFilterResp, employeeManagementErrorResp } = useAppSelector(({ directoryEmployee, directoryStudent, masterData }) => ({
        occupationResp: masterData.occupationResp,
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
        studentMotherEmployeeDetailsResp: directoryStudent.studentMotherEmployeeDetailsResp,
        employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
    }), shallowEqual);

    const motherInfoRef = useRef<any>({
        prevStudentMotherEmployeeDetailsResp: studentMotherEmployeeDetailsResp,
        prevEmployeeManagementErrorResp: employeeManagementErrorResp
    });
    useEffect(() => {
        const { prevStudentMotherEmployeeDetailsResp, prevEmployeeManagementErrorResp } = motherInfoRef.current;
        if (studentMotherEmployeeDetailsResp && prevStudentMotherEmployeeDetailsResp !== studentMotherEmployeeDetailsResp) {
            const { employeeBasicDetails, employeeContactDetails,
                employeeEducationDetails, employeeDesignationDetails, employeeSalaryDetails } = studentMotherEmployeeDetailsResp;
            motherInfoForm.setValues({
                isMotherEmployeeOfSchool: "true",
                motherEmployeeId: employeeBasicDetails?.id || "",
                motherEmployeeCode: employeeBasicDetails?.employeeCode || "",
                motherName: employeeBasicDetails?.employeeName || "",
                motherAadharNo: employeeBasicDetails?.aadharNo || "",
                motherEmail: employeeBasicDetails?.personalEmailId || "",
                motherPhoneNo: employeeBasicDetails?.contactNo || "",
                motherWhatsappNo: employeeBasicDetails?.motherWhatsappNo || "",
                motherQualificationName: getQualificationName(employeeEducationDetails?.qualificationName),
                motherQualificationSpec: "",
                motherOccupationId: employeeBasicDetails?.occupationId || "",
                motherCompany: employeeBasicDetails?.organizationName || "",
                motherDesignationName: employeeDesignationDetails?.designationId || "",
                motherAnnualIncome: getIncomeOptions(employeeSalaryDetails?.grossSalary),
                motherOfficeLocation: employeeContactDetails?.addressLine || ""
            })
        } else if (employeeManagementErrorResp && prevEmployeeManagementErrorResp !== employeeManagementErrorResp) {
            // Hanlding of error.
        }
        motherInfoRef.current.prevStudentMotherEmployeeDetailsResp = studentMotherEmployeeDetailsResp;
        motherInfoRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
    }, [studentMotherEmployeeDetailsResp, employeeManagementErrorResp]);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const motherInfoForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            const payload = { ...values };
            // payload.motherContributeStakeHolder = selectedStakeHolderListState.map((item: any) => item.stakeHolder);
            storeMultiFormDataCallback(formId, true, motherInfoForm.dirty, payload);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId))
            motherInfoForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const { motherEmployeeId, motherEmployeeCode, motherName } = tabsData[stepId];
            const formData = getMotherInfoInitialState(tabsData[stepId]);
            motherInfoForm.resetForm({
                values: formData
            });
            setSearchEmployeeState({
                employeeId: motherEmployeeId,
                employeeCode: motherEmployeeCode,
                employeeName: motherName
            });

        }
    }, [tabsData, stepId]);

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        motherInfoForm.setFieldValue(name, updateDate);
    }

    function onChangeEmployeeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        motherInfoForm.resetForm({
            values: getMotherInfoInitialState({ isMotherEmployeeOfSchool: value })
        });
        setSearchEmployeeState(null);
    }


    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString },
                payload = { genderId: 2, instituteGroupId: 1, isOtherEmployee: false };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
        }
    }

    function selectEmployeeHndlr(selectedSingle: any) {
        setSearchEmployeeState(selectedSingle);
        if (selectedSingle) {
            const { id } = selectedSingle;
            dispatch(getStudentMotherEmployeeDetailsAct(generateActionPayload("get_employee_byid", { employeeId: id })));
        } else {
            motherInfoForm.resetForm({
                values: getMotherInfoInitialState({ isMotherEmployeeOfSchool: "true" })
            });
        }
    }

    function handleOccupationChange(selected: any, config: any) {
        const { name } = config;
        motherInfoForm.setFieldValue(name, selected);
    }

    return (
        <form onSubmit={motherInfoForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                Mother Info
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="tw-flex tw-flex-wrap -tw-mx-1.5">
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <RadioInputContainer
                            name="isMotherEmployeeOfSchool"
                            labelText="Is Employee of School"
                            radioClassName="form-radio-green"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={trueFalseOptions}
                            isDisabled={isViewMode}
                            value={motherInfoForm.values.isMotherEmployeeOfSchool}
                            onChange={onChangeEmployeeHndlr}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <AutoSearchInput
                            formgroupClassName="tw-relative tw-mb-3"
                            name="motherEmployeeId"
                            labelText="Parent Name"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "true") ? "required" : ""}
                            onChange={onInputSearchChange}
                            onBlur={motherInfoForm.handleBlur}
                            valueKey="id"
                            labelKey="employeeName"
                            subLabelKey="employeeCode"
                            labelHeader="Employee Code"
                            subLabelHeader="Employee Name"
                            options={getEmployeesByFilterResp}
                            selected={searchEmployeeState}
                            selectedOptionCallbck={selectEmployeeHndlr}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "false"}
                            invalid={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? true : false}
                            error={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? motherInfoForm.errors.motherEmployeeId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="motherName"
                            labelText="Name"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            maxLength={100}
                            value={motherInfoForm.values.motherName}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherName && motherInfoForm.errors.motherName) ? true : false}
                            error={(motherInfoForm.touched.motherName && motherInfoForm.errors.motherName) ? motherInfoForm.errors.motherName : ""}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInputWithRegex
                            name="motherAadharNo"
                            labelText="Aadhar Number"
                            value={motherInfoForm.values.motherAadharNo}
                            onChange={motherInfoForm.handleChange}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                            maxLength={12}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextIconInput
                            name="motherEmail"
                            labelText="Email ID"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            value={motherInfoForm.values.motherEmail}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherEmail && motherInfoForm.errors.motherEmail) ? true : false}
                            error={(motherInfoForm.touched.motherEmail && motherInfoForm.errors.motherEmail) ? motherInfoForm.errors.motherEmail : ""}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <PhoneInput
                            name="motherPhoneNo"
                            labelText="Phone No."
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            value={motherInfoForm.values.motherPhoneNo}
                            onChange={onChangePhoneInput}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherPhoneNo && motherInfoForm.errors.motherPhoneNo) ? true : false}
                            error={(motherInfoForm.touched.motherPhoneNo && motherInfoForm.errors.motherPhoneNo) ? motherInfoForm.errors.motherPhoneNo : ""}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <PhoneInput
                            name="motherWhatsappNo"
                            labelText="Mother Whatsapp No."
                            value={motherInfoForm.values.motherWhatsappNo}
                            onChange={onChangePhoneInput}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherWhatsappNo && motherInfoForm.errors.motherWhatsappNo) ? true : false}
                            error={(motherInfoForm.touched.motherWhatsappNo && motherInfoForm.errors.motherWhatsappNo) ? motherInfoForm.errors.motherWhatsappNo : ""}
                            isDisabled={isViewMode}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <SelectInput
                            name="motherQualificationName"
                            labelText="Qualification"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            value={motherInfoForm.values.motherQualificationName}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherQualificationName && motherInfoForm.errors.motherQualificationName) ? true : false}
                            error={(motherInfoForm.touched.motherQualificationName && motherInfoForm.errors.motherQualificationName) ? motherInfoForm.errors.motherQualificationName : ""}
                            menuItems={qualificationOptions}
                            valueKey="id"
                            textKey="name"
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="motherQualificationSpec"
                            labelText="Specify Qualification"
                            isDisabled={isViewMode}
                            value={motherInfoForm.values.motherQualificationSpec}
                            onChange={motherInfoForm.handleChange}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <CustomSelect
                            name="motherOccupationId"
                            labelText="Occupation"
                            options={occupationResp?.data}
                            idKey="occupationId"
                            searchKey="occupationName"
                            renderValue={renderValueSection}
                            renderOptions={renderOptionsEmployee}
                            onChange={handleOccupationChange}
                            labelClass="required"
                            defaultSelect="Select"
                            value={motherInfoForm.values.motherOccupationId}
                            invalid={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? true : false}
                            error={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? motherInfoForm.errors.motherOccupationId : ""}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="motherCompany"
                            labelText="Name Of Organization"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            value={motherInfoForm.values.motherCompany}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherCompany && motherInfoForm.errors.motherCompany) ? true : false}
                            error={(motherInfoForm.touched.motherCompany && motherInfoForm.errors.motherCompany) ? motherInfoForm.errors.motherCompany : ""}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <TextInput
                            name="motherDesignationName"
                            labelText="Designation"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            value={motherInfoForm.values.motherDesignationName}
                            onChange={motherInfoForm.handleChange}
                            invalid={(motherInfoForm.touched.motherDesignationName && motherInfoForm.errors.motherDesignationName) ? true : false}
                            error={(motherInfoForm.touched.motherDesignationName && motherInfoForm.errors.motherDesignationName) ? motherInfoForm.errors.motherDesignationName : ""}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-1/4 tw-px-1.5">
                        <SelectInput
                            name="motherAnnualIncome"
                            labelText="Annual Income"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            value={motherInfoForm.values.motherAnnualIncome}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherAnnualIncome && motherInfoForm.errors.motherAnnualIncome) ? true : false}
                            error={(motherInfoForm.touched.motherAnnualIncome && motherInfoForm.errors.motherAnnualIncome) ? motherInfoForm.errors.motherAnnualIncome : ""}
                            menuItems={incomeOptions}
                            valueKey="id"
                            textKey="name"
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="tw-w-full tw-px-1.5">
                        <TextInput
                            name="motherOfficeLocation"
                            labelText="Office Address"
                            labelClass={(motherInfoForm.values.isMotherEmployeeOfSchool === "false") ? "required" : ""}
                            value={motherInfoForm.values.motherOfficeLocation}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherOfficeLocation && motherInfoForm.errors.motherOfficeLocation) ? true : false}
                            error={(motherInfoForm.touched.motherOfficeLocation && motherInfoForm.errors.motherOfficeLocation) ? motherInfoForm.errors.motherOfficeLocation : ""}
                            isDisabled={isViewMode || motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}
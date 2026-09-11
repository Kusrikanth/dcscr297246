import React, { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import {
    UncontrolledAccordion, AccordionBody,
    AccordionHeader, AccordionItem, Collapse
} from "reactstrap";

import { useFormik, setNestedObjectValues } from "formik";
import * as Yup from "yup";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch, SelectWithTextInput,
    UploadImage, UploadImageUpdated, AutoSearchInputUpdated, TextInputWithRegex,
    MultiSelect, MemoizedSelectInput
} from "../../../../../../../Components/Common";

import StudentImgIcon from "../../../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions, qualificationOptions, designationOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../../../utility/commonutility";

import { getEmployeeByFilterAct } from "../../../../../../../store/directory/employeemanagement/employeemanagementactions";

import { getStudentFatherEmployeeDetailsAct } from "../../../../../../../store/directory/studentmanagement/studentmanagementactions";

// Old details
// export function getFatherInfoInitialState(initialState: any) {
//     return {
//         fatherName: initialState?.fatherName || "Father Name",
//         fatherNationalityId: initialState?.fatherNationalityId || "1",
//         fatherEmail: initialState?.fatherEmail || "father@mail.com",
//         fatherPhoneNo: initialState?.fatherPhoneNo || "1234567890",
//         isFatherEmployeeOfSchool: initialState?.isFatherEmployeeOfSchool || false,
//         fatherEmployeeId: initialState?.fatherEmployeeId || "1",

//         fatherQualificationId: initialState?.fatherQualificationId || "1",
//         fatherOccupationId: initialState?.fatherOccupationId || "1",
//         fatherCompany: initialState?.fatherCompany || "1",

//         fatherDesignationId: initialState?.fatherDesignationId || "1",
//         fatherAnnualIncome: initialState?.fatherAnnualIncome || "34324",
//         fatherOfficeLocation: initialState?.fatherOfficeLocation || "Testin Address",

//         fatherDocumentType: initialState?.fatherDocumentType || "",
//         fatherAadharNo: initialState?.fatherAadharNo || "",

//         isSingleParent: initialState?.isSingleParent || false,

//     }
// }

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}


export function getFatherInfoInitialState(initialState?: any) {
    return {
        isFatherEmployeeOfSchool: initialState?.isFatherEmployeeOfSchool || "false",
        fatherEmployeeId: initialState?.fatherEmployeeId || "",
        fatherEmployeeCode: initialState?.fatherEmployeeId || "",
        fatherName: initialState?.fatherEmployeeId || "",
        fatherAadharNo: initialState?.fatherAadharNo || "",
        fatherEmail: initialState?.fatherAadharNo || "",
        fatherPhoneNo: initialState?.fatherAadharNo || "",
        fatherQualificationId: initialState?.fatherAadharNo || "",
        fatherOccupationId: initialState?.fatherAadharNo || "",
        fatherNationalityId: initialState?.fatherAadharNo || "1",
        fatherCompany: initialState?.fatherAadharNo || "",
        fatherDesignationId: initialState?.fatherAadharNo || "",
        fatherAnnualIncome: initialState?.fatherAadharNo || "",
        fatherOfficeLocation: initialState?.fatherAadharNo || "",
        fatherContributeStakeHolder: initialState?.fatherAadharNo || [],
    }
}

const validationSchema = Yup.object().shape({
    // isFatherEmployeeOfSchool: Yup.string(),
    // fatherEmployeeId: Yup.string().when('isFatherEmployeeOfSchool', {
    //     is: (isFatherEmployeeOfSchool: any) => isFatherEmployeeOfSchool === "true",
    //     then: Yup.string()
    //         .required('Employee id required.')
    // }),
    // fatherName: Yup.string().required('Father name required.'),
    // fatherAadharNo: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    // fatherEmail: Yup.string().required('Email id required.').email("Invalid email."),
    // fatherPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    // fatherQualificationId: Yup.string().required('Qualification required.'),
    // fatherOccupationId: Yup.string().required('Occupation required.'),
    // fatherCompany: Yup.string().required('Organization required.'),
    // fatherDesignationId: Yup.string().required('Designation required.'),
    // fatherAnnualIncome: Yup.number().required('Income required.').typeError("Enter valid number."),
    // fatherOfficeLocation: Yup.string().required('Office address required.')
});

const initialValues = getFatherInfoInitialState();
export default function FatherInfo({ formId, occupationResp, designationListResp,
    qualificationsListResp, stakeHolderList, storeMultiFormDataCallback }: any) {
    const [selectedStakeHolderListState, setSelectedFeeCategoryListState] = useState<any>([]);
    const { currentMultiFormKeys } = useContext<any>(StepperFormContext);

    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);

    const dispatch = useAppDispatch();
    const { studentFatherEmployeeDetailsResp, getEmployeesByFilterResp, employeeManagementErrorResp } =
        useAppSelector(({ directoryEmployee, directoryStudent }) => ({
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
            const { employeeBasicDetails, employeeContactDetails,
                employeeEducationDetails, employeeDesignationDetails, employeeSalaryDetails } =
                studentFatherEmployeeDetailsResp;
            fatherForm.resetForm({
                values: {
                    isFatherEmployeeOfSchool: "true",
                    fatherEmployeeId: employeeBasicDetails?.id || "",
                    fatherEmployeeCode: employeeBasicDetails?.employeeCode || "",
                    fatherName: employeeBasicDetails?.employeeName || "",
                    fatherAadharNo: employeeBasicDetails?.aadharNo || "",
                    fatherEmail: employeeBasicDetails?.personalEmailId || "",
                    fatherPhoneNo: employeeBasicDetails?.contactNo || "",
                    fatherQualificationId: employeeEducationDetails?.qualificationId || "",
                    fatherOccupationId: employeeBasicDetails?.occupationId || "",
                    fatherNationalityId: employeeBasicDetails?.nationalityId || "1",
                    fatherCompany: employeeBasicDetails?.organizationName || "",
                    fatherDesignationId: employeeDesignationDetails?.designationId || "",
                    fatherAnnualIncome: employeeSalaryDetails?.grossSalary || "",
                    fatherOfficeLocation: employeeContactDetails?.addressLine || "",
                    fatherContributeStakeHolder: [],
                }
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
            payload.fatherContributeStakeHolder = selectedStakeHolderListState.map((item: any) => item.stakeHolder);
            storeMultiFormDataCallback(formId, true, payload);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            fatherForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

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
                payload = { genderId: 1 };
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
                values: getFatherInfoInitialState({ isFatherEmployeeOfSchool: "true" })
            });
        }
    }

    function onSelectStakeHolderHndlr(selectItem: any) {
        setSelectedFeeCategoryListState(selectItem);
        if (selectItem.length > selectedStakeHolderListState.length) {
            const selectedId = selectItem.map((item: any) => item.id);
            const prevSelectedId = selectedStakeHolderListState.map((item: any) => item.id),
                addedItem = selectItem.find((item: any) => (!prevSelectedId.includes(item.id)));
            if (addedItem.id) {
                fatherForm.setValues((prevState: any) => ({
                    ...prevState,
                    fatherContributeStakeHolder: selectedId,
                }));
            }
        } else if (selectItem.length < selectedStakeHolderListState.length) {
            const selectedId = selectItem.map((item: any) => item.id),
                removedItemId = selectedStakeHolderListState.find((item: any) => (!selectedId.includes(item.id)));
            if (removedItemId.id) {
                fatherForm.setValues((prevState: any) => ({
                    ...prevState,
                    fatherContributeStakeHolder: selectedId,
                }));
            }
        } else {
            fatherForm.setValues((prevState: any) => ({
                ...prevState,
                fatherContributeStakeHolder: []
            }));
        }
    }

    return (
        <form onSubmit={fatherForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId="father-info">
                Father Info
            </AccordionHeader>
            <AccordionBody accordionId="father-info">
                <div className="row">
                    <div className="col-4">
                        <RadioInputContainer
                            name="isFatherEmployeeOfSchool"
                            labelText="Employee of the School ?"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={fatherForm.values.isFatherEmployeeOfSchool}
                            onChange={onChangeEmployeeHndlr}
                        />
                    </div>
                    <div className="col-4">
                        <AutoSearchInputUpdated
                            formgroupClassName="search-box"
                            name="fatherEmployeeId"
                            labelText="Parent Name"
                            onChange={onInputSearchChange}
                            onBlur={fatherForm.handleBlur}
                            valueKey="id"
                            labelHeader="Emp. Code"
                            labelKey="employeeCode"
                            subLabelHeader="Employee Name"
                            subLabelKey="employeeName"
                            alignRight={true}
                            options={getEmployeesByFilterResp}
                            selected={searchEmployeeState}
                            selectedOptionCallbck={selectEmployeeHndlr}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "false"}
                            invalid={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? true : false}
                            error={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? fatherForm.errors.fatherEmployeeId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="fatherName"
                            labelText="Name"
                            value={fatherForm.values.fatherName}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherName && fatherForm.errors.fatherName) ? true : false}
                            error={(fatherForm.touched.fatherName && fatherForm.errors.fatherName) ? fatherForm.errors.fatherName : ""}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInputWithRegex
                            name="fatherAadharNo"
                            labelText="Aadhar Number"
                            value={fatherForm.values.fatherAadharNo}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherAadharNo && fatherForm.errors.fatherAadharNo) ? true : false}
                            error={(fatherForm.touched.fatherAadharNo && fatherForm.errors.fatherAadharNo) ? fatherForm.errors.fatherAadharNo : ""}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                            maxLength={12}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="col-4">
                        <TextIconInput
                            name="fatherEmail"
                            labelText="Email ID"
                            value={fatherForm.values.fatherEmail}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherEmail && fatherForm.errors.fatherEmail) ? true : false}
                            error={(fatherForm.touched.fatherEmail && fatherForm.errors.fatherEmail) ? fatherForm.errors.fatherEmail : ""}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="col-4">
                        <PhoneInput
                            name="fatherPhoneNo"
                            labelText="Phone No."
                            value={fatherForm.values.fatherPhoneNo}
                            onChange={onChangePhoneInput}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherPhoneNo && fatherForm.errors.fatherPhoneNo) ? true : false}
                            error={(fatherForm.touched.fatherPhoneNo && fatherForm.errors.fatherPhoneNo) ? fatherForm.errors.fatherPhoneNo : ""}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <MemoizedSelectInput
                            name="fatherQualificationId"
                            labelText="Qualification"
                            value={fatherForm.values.fatherQualificationId}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherQualificationId && fatherForm.errors.fatherQualificationId) ? true : false}
                            error={(fatherForm.touched.fatherQualificationId && fatherForm.errors.fatherQualificationId) ? fatherForm.errors.fatherQualificationId : ""}
                            menuItems={qualificationsListResp?.data}
                            valueKey="id"
                            textKey="qualification"
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="fatherOccupationId"
                            labelText="Occupation"
                            value={fatherForm.values.fatherOccupationId}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherOccupationId && fatherForm.errors.fatherOccupationId) ? true : false}
                            error={(fatherForm.touched.fatherOccupationId && fatherForm.errors.fatherOccupationId) ? fatherForm.errors.fatherOccupationId : ""}
                            menuItems={occupationResp?.data}
                            valueKey="occupationId"
                            textKey="occupationName"
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="fatherCompany"
                            labelText="Company"
                            value={fatherForm.values.fatherCompany}
                            onChange={fatherForm.handleChange}
                            invalid={(fatherForm.touched.fatherCompany && fatherForm.errors.fatherCompany) ? true : false}
                            error={(fatherForm.touched.fatherCompany && fatherForm.errors.fatherCompany) ? fatherForm.errors.fatherCompany : ""}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <MemoizedSelectInput
                            name="fatherDesignationId"
                            labelText="Designation"
                            value={fatherForm.values.fatherDesignationId}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherDesignationId && fatherForm.errors.fatherDesignationId) ? true : false}
                            error={(fatherForm.touched.fatherDesignationId && fatherForm.errors.fatherDesignationId) ? fatherForm.errors.fatherDesignationId : ""}
                            menuItems={designationListResp?.data}
                            valueKey="id"
                            textKey="designationName"
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInputWithRegex
                            name="fatherAnnualIncome"
                            labelText="Annual Income"
                            value={fatherForm.values.fatherAnnualIncome}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherAnnualIncome && fatherForm.errors.fatherAnnualIncome) ? true : false}
                            error={(fatherForm.touched.fatherAnnualIncome && fatherForm.errors.fatherAnnualIncome) ? fatherForm.errors.fatherAnnualIncome : ""}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        />
                    </div>
                    <div className="col-12">
                        <TextInput
                            name="fatherOfficeLocation"
                            labelText="Office Address"
                            value={fatherForm.values.fatherOfficeLocation}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            invalid={(fatherForm.touched.fatherOfficeLocation && fatherForm.errors.fatherOfficeLocation) ? true : false}
                            error={(fatherForm.touched.fatherOfficeLocation && fatherForm.errors.fatherOfficeLocation) ? fatherForm.errors.fatherOfficeLocation : ""}
                            isDisabled={fatherForm.values.isFatherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-12">
                        <MultiSelect
                            name="contributeStakeHolder"
                            value={selectedStakeHolderListState}
                            onChange={onSelectStakeHolderHndlr}
                            menuItems={stakeHolderList?.data}
                            valueKey="id"
                            textKey="stakeHolder"
                            inputClassName="bg-soft-light"
                            labelText="Contribute Stake Holder"
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" value="Father Info" />
                    </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}
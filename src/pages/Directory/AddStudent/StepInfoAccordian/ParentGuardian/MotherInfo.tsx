import { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import {
    UncontrolledAccordion, AccordionBody,
    AccordionHeader, AccordionItem, Collapse
} from "reactstrap";

import { useFormik, setNestedObjectValues } from "formik";
import * as Yup from "yup";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch, SelectWithTextInput,
    UploadImage, AutoSearchInput,
    UploadImageUpdated, TextInputWithRegex, AutoSearchInputUpdated,
    CustomSelect
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions, qualificationOptions, designationOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../utility/commonutility";

import { getEmployeeByFilterAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";
import { getStudentMotherEmployeeDetailsAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";

// Old State
// export function getMotherInfoInitialState(initialState: any) {
//     return {
//         motherName: initialState?.motherName || "Mother Nmae",
//         motherNationalityId: initialState?.motherNationalityId || "1",
//         motherEmailId: initialState?.motherEmailId || "mother@gmail.com",
//         motherContactNo: initialState?.motherContactNo || "1234567890",
//         motherEmployeeId: initialState?.motherEmployeeId || "1",
//         isMotherEmployee: initialState?.isMotherEmployee || false,
//         motherQualificationId: initialState?.motherQualificationId || "1",

//         motherOccupationId: initialState?.motherOccupationId || "1",
//         motherOrganizationName: initialState?.motherOrganizationName || "Organization",
//         motherDesignationId: initialState?.motherDesignationId || "1",
//         motherIncomeId: initialState?.motherIncomeId || "34343",
//         motherOfficeAddress: initialState?.motherOfficeAddress || "Mother Office",
//         motherDocumentType: initialState?.motherDocumentType || "Adhar",
//         motherDocumentNumber: initialState?.motherDocumentNumber || "23243",
//     }
// }

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}
export function getMotherInfoInitialState(initialState?: any) {
    return {
        motherName: initialState?.motherName || "",
        motherNationalityId: initialState?.motherNationalityId || "1",
        motherEmailId: initialState?.motherEmailId || "",
        motherContactNo: initialState?.motherContactNo || "",
        motherEmployeeId: initialState?.motherEmployeeId || "",
        isMotherEmployee: getTrueFalseOptions(initialState?.isMotherEmployee),
        motherQualificationId: initialState?.motherQualificationId || "",
        motherOccupationId: initialState?.motherOccupationId || "",
        motherOrganizationName: initialState?.motherOrganizationName || "",
        motherDesignationId: initialState?.motherDesignationId || "",
        motherIncomeId: initialState?.motherIncomeId || "",
        motherOfficeAddress: initialState?.motherOfficeAddress || "",
        motherDocumentType: initialState?.motherDocumentType || "",
        motherDocumentNumber: initialState?.motherDocumentNumber || "",
        motherEmployeeCode: initialState?.motherEmployeeCode || "",
        // isSingleParent: "false"
        isSingleParent: getTrueFalseOptions(initialState?.isSingleParent),
    }
}
const validationSchema = Yup.object().shape({
    isMotherEmployee: Yup.string(),
    motherEmployeeId: Yup.string().when('isMotherEmployee', {
        is: (isMotherEmployee: any) => isMotherEmployee === "true",
        then: Yup.string()
            .required('Employee id required.')
    }),
    motherName: Yup.string().required('Mother name required.'),
    motherDocumentNumber: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    motherEmailId: Yup.string().required('Email id required.').email("Enter valid email."),
    motherContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    motherQualificationId: Yup.string().required('Qualification required.'),
    motherOccupationId: Yup.string().required('Occupation required.'),
    motherOrganizationName: Yup.string().required('Organization required.'),
    motherDesignationId: Yup.string().required('Designation required.'),
    motherIncomeId: Yup.string().required('Income required.'),
    motherOfficeAddress: Yup.string().required('Office address required.')
});

// const validationSchema = Yup.object().shape({
//     isMotherEmployee: Yup.string(),
//     motherEmployeeId: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "true",
//         then: Yup.string()
//             .required('Employee id required.')
//     }),
//     motherName: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Mother name required.')
//     }),
//     motherDocumentNumber: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Document number required.')
//     }),
//     motherEmailId: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Email id required.')
//     }),
//     motherContactNo: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required.")
//     }),
//     motherQualificationId: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Qualification required.')
//     }),
//     motherOccupationId: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Occupation required.')
//     }),
//     motherOrganizationName: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Organization required.')
//     }),
//     motherDesignationId: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Designation required.')
//     }),
//     motherIncomeId: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Income required.')
//     }),
//     motherOfficeAddress: Yup.string().when('isMotherEmployee', {
//         is: (isMotherEmployee: any) => isMotherEmployee === "false",
//         then: Yup.string()
//             .required('Office address required.')
//     })
// });

export default function MotherInfo({ occupationResp, designationListResp, qualificationsListResp }: any) {
    const {
        currentMultiFormKeys, editStudentData,
        updateFormKeyDataHndlr, storeMultiFormData
    } = useContext<any>(StepperFormContext);
    const [motherInfoState, setMotherInfoState] = useState<any>(() => {
        const { motherDetails } = editStudentData || {},
            { formData } = motherDetails || {};
        return getMotherInfoInitialState(formData);
    });
    // const [fillEmployeeDetailsState, setFillEmployeeDetailsState] = useState<boolean>(false);
    const [isFatherSingleParent, setIsFatherSingleParent] = useState(false);
    const [motherImgFileState, setMotherImgFileState] = useState<any>("");
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");

    const motherImgFileRef = useRef<any>(null);

    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);

    const dispatch = useAppDispatch();
    const { studentMotherEmployeeDetailsResp, getEmployeesByFilterResp, employeeManagementErrorResp, masterIncomeResp } = useAppSelector(({ directoryEmployee, directoryStudent, masterData }) => ({
        getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
        studentMotherEmployeeDetailsResp: directoryStudent.studentMotherEmployeeDetailsResp,
        employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
        masterIncomeResp: masterData.masterIncomeResp
    }), shallowEqual);

    const motherInfoRef = useRef<any>({
        prevStudentMotherEmployeeDetailsResp: studentMotherEmployeeDetailsResp,
        prevEmployeeManagementErrorResp: employeeManagementErrorResp
    });
    useEffect(() => {
        const { prevStudentMotherEmployeeDetailsResp, prevEmployeeManagementErrorResp } = motherInfoRef.current;
        if (studentMotherEmployeeDetailsResp && prevStudentMotherEmployeeDetailsResp !== studentMotherEmployeeDetailsResp) {
            const { employeeBasicDetails, employeeContactDetails,
                employeeEducationDetails, employeeDesignationDetails, employeeSalaryDetails } = studentMotherEmployeeDetailsResp,
                { fullImageBase64 } = employeeBasicDetails || {};
            if (fullImageBase64) {
                setMotherImgFileState(`data:image/jpeg;base64, ${fullImageBase64}`);
            } else {
                setMotherImgFileState(undefined);
                motherImgFileRef.current = undefined;
            }
            motherInfoForm.resetForm({
                values: {
                    motherName: employeeBasicDetails?.employeeName || "",
                    motherNationalityId: employeeBasicDetails?.nationalityId || "1",
                    motherEmailId: employeeBasicDetails?.personalEmailId || "",
                    motherContactNo: employeeBasicDetails?.contactNo || "",
                    isMotherEmployee: "true",
                    motherEmployeeId: employeeBasicDetails?.id || "",
                    motherQualificationId: employeeEducationDetails?.qualificationId || "",
                    motherOccupationId: employeeBasicDetails?.occupationId || "",
                    motherOrganizationName: employeeBasicDetails?.organizationName || "",
                    motherDesignationId: employeeDesignationDetails?.designationId || "",
                    motherIncomeId: employeeSalaryDetails?.grossSalary || "",
                    motherOfficeAddress: employeeContactDetails?.addressLine || "",
                    motherDocumentType: employeeBasicDetails?.documentType || "Adhar",
                    motherDocumentNumber: employeeBasicDetails?.aadharNo || "",
                    isSingleParent: "false",
                }
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
        initialValues: motherInfoState,
        validationSchema,
        onSubmit: (values: any) => {
            let motherImageBase64 = undefined;
            if (!motherImgFileRef.current) {
                const { motherDetails } = editStudentData || {},
                    { formData } = motherDetails || {},
                    { employeeBasicDetails } = studentMotherEmployeeDetailsResp || {},
                    { fullImageBase64 } = employeeBasicDetails || {};
                motherImageBase64 = formData?.motherImageBase64 || fullImageBase64;
            }

            const addMotherPayload = {
                motherImageBase64,
                motherImage: motherImgFileRef.current,
                ...values
            }
            storeMultiFormData("motherDetails", true, addMotherPayload);
        }
    })


    useEffect(() => {
        const { fatherDetails, motherDetails } = editStudentData || {},
            { formData } = motherDetails || {},
            { formData: fatherFormData } = fatherDetails || {},
            { isSingleParent } = fatherFormData || {};
        // if (isSingleParent === "true") {
        //     setIsFatherSingleParent(true);
        //     setSearchEmployeeState(null);
        //     setMotherImgFileState(undefined);
        //     motherImgFileRef.current = undefined;
        //     motherInfoForm.resetForm({
        //         values: getMotherInfoInitialState()
        //     });
        // } else
        if (formData) {
            // setIsFatherSingleParent(false);
            const { motherEmployeeId, motherEmployeeCode, motherImage, motherImageBase64, isMotherEmployee, motherName } = formData;
            if (motherImageBase64) {
                setMotherImgFileState(`data:image/jpeg;base64, ${motherImageBase64}`);
            } else if (motherImage) {
                motherImgFileRef.current = motherImage;
                setMotherImgFileState(URL.createObjectURL(motherImage));
            }
            if (isMotherEmployee === "true") {
                setSearchEmployeeState({
                    id: motherEmployeeId,
                    employeeName: motherName,
                    employeeCode: motherEmployeeCode
                })
            }
            motherInfoForm.resetForm({
                values: getMotherInfoInitialState(formData)
            });
        }
        // else if (isFatherSingleParent && (isSingleParent === "false")) {
        //     setIsFatherSingleParent(false);
        //     setSearchEmployeeState(null);
        //     setMotherImgFileState(undefined);
        //     motherImgFileRef.current = undefined;
        //     motherInfoForm.resetForm({
        //         values: getMotherInfoInitialState()
        //     });
        // }
    }, [editStudentData]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("motherDetails"))
            submitMotherHndlr();
    }, [currentMultiFormKeys]);

    function submitMotherHndlr() {
        const { isMotherEmployee, motherEmployeeId } = motherInfoForm.values;
        // if (isFatherSingleParent) {
        //     storeMultiFormData("motherDetails", true, null);
        // } else 
        if (isMotherEmployee === "true" && motherEmployeeId) {
            let motherImageBase64 = undefined;
            if (!motherImgFileRef.current) {
                const { fatherDetails } = editStudentData || {},
                    { formData } = fatherDetails || {},
                    { employeeBasicDetails } = studentMotherEmployeeDetailsResp || {},
                    { fullImageBase64 } = employeeBasicDetails || {};
                motherImageBase64 = formData?.motherImageBase64 || fullImageBase64;
            }
            const payload = {
                motherImageBase64,
                motherImage: motherImgFileRef.current,
                ...motherInfoForm.values
            }
            storeMultiFormData("motherDetails", true, payload);
        } else if (isMotherEmployee === "true" && !motherEmployeeId) {
            motherInfoForm.setFieldTouched("motherEmployeeId", true, true);
        } else {
            motherInfoForm.handleSubmit();
        }
    }

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        motherInfoForm.setFieldValue(name, updateDate);
    }
    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            return;
        }
        setFileUploadErrorMessageState("");
        motherImgFileRef.current = event.target.files[0];
        setMotherImgFileState(URL.createObjectURL(file));
    }

    function onChangeEmployeeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value, checked } = event.target,
            { isSingleParent } = motherInfoForm.values;
        // if (checked) {
        //     // motherInfoForm.resetForm();
        motherInfoForm.resetForm({
            values: getMotherInfoInitialState({ isMotherEmployee: value, isSingleParent })
        });
        setSearchEmployeeState(null);
    }
    function handleSearchEmployeeHndlr(inputString: string, inputAction: any) {
        if (inputString) {
            const params = { searchString: inputString },
                payload = { genderId: 2 };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
        }
    }
    function handleSelectedEmployee(selectedSingle?: any, meta?: any) {
        setSearchEmployeeState(selectedSingle);
        if (selectedSingle) {
            const { id } = selectedSingle;
            dispatch(getStudentMotherEmployeeDetailsAct(generateActionPayload("get_employee_byid", { employeeId: id })));
        } else {
            motherInfoForm.resetForm({
                values: getMotherInfoInitialState({ isMotherEmployee: "true" })
            });
        }
    }
    function handleMenuOpen() {
        const { employeeName } = searchEmployeeState || {},
            params = { searchString: (employeeName || "a") },
            payload = { genderId: 2 };
        dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
    }
    function singleParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        motherInfoForm.setFieldValue("isSingleParent", value);
        updateFormKeyDataHndlr("motherDetails", { ...motherInfoForm.values, "isSingleParent": value });
    }

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString },
                payload = { genderId: 2 };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
        }
    }

    function renderOccuptaionValueSection(selectedItem: any) {
        return selectedItem?.occupationName || "";
    }

    function renderOccuptaionOptions(item: any) {
        return item?.occupationName?.toString() || "";
    }

    function handleOccupationChange(selected: any, config: any) {
        const { name } = config;
        motherInfoForm.setFieldValue(name, selected);
    }

    function selectEmployeeHndlr(selectedSingle: any) {
        setSearchEmployeeState(selectedSingle);
        if (selectedSingle) {
            const { id } = selectedSingle;
            dispatch(getStudentMotherEmployeeDetailsAct(generateActionPayload("get_employee_byid", { employeeId: id })));
        } else {
            motherInfoForm.resetForm({
                values: getMotherInfoInitialState({ isMotherEmployee: "true" })
            });
        }
    }
    return (
        <form onSubmit={motherInfoForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId="mother-info">
                Mother Info
            </AccordionHeader>
            <AccordionBody accordionId="mother-info">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-4 tw-flex tw-flex-col">
                        <div>
                            <UploadImageUpdated
                                name="mother-image"
                                acceptFileFormat="image/jpg, image/png, image/jpeg"
                                value={motherImgFileState}
                                onChange={handleFileUploadHnlr}
                                error={fileUploadErrorMessageState}
                            />
                        </div>
                    </div>

                    <div className="tw-col-span-8">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-6">
                                <RadioInputContainer
                                    name="isMotherEmployee"
                                    labelText="Employee of the School ?"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={trueFalseOptions}
                                    value={motherInfoForm.values.isMotherEmployee}
                                    onChange={onChangeEmployeeHndlr}
                                    isDisabled={isFatherSingleParent}
                                />
                            </div>

                            <div className="tw-col-span-6">
                                <AutoSearchInputUpdated
                                    formgroupClassName="search-box"
                                    name="search_employee"
                                    labelText="Employee Name / Code"
                                    // onChange={(e: any) => setSearchInputState(e.target.value)}
                                    onChange={onInputSearchChange}
                                    onBlur={motherInfoForm.handleBlur}
                                    valueKey="id"
                                    labelHeader="Emp. Code"
                                    labelKey="employeeCode"
                                    subLabelHeader="Employee Name"
                                    subLabelKey="employeeName"
                                    alignRight={true}
                                    options={getEmployeesByFilterResp}
                                    selected={searchEmployeeState}
                                    selectedOptionCallbck={selectEmployeeHndlr}
                                    isDisabled={motherInfoForm.values.isMotherEmployee === "false"}
                                    invalid={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? true : false}
                                    error={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? motherInfoForm.errors.motherEmployeeId : ""}
                                ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                            </div>
                            {/* <div className="col-6">
                                <SelectWithTextInput
                                    name="search_employee"
                                    labelText="Employee Name"
                                    value={searchEmployeeState}
                                    handleSelect={handleSelectedEmployee}
                                    menuOpenHndlr={handleMenuOpen}
                                    options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
                                    placeHolder="Search..."
                                    handleInputChange={handleSearchEmployeeHndlr}
                                    labelId="employeeName"
                                    valueId="employeeCode"
                                    formgroupClassName="mb-0"
                                    isDisabled={motherInfoForm.values.isMotherEmployee === "false"}
                                    invalid={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? true : false}
                                    error={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? motherInfoForm.errors.motherEmployeeId : ""}
                                />
                            </div> */}
                            {/* <TextInput
                                    name="motherEmployeeId"
                                    labelText="Employee Id"
                                    // formgroupClassName="mb-4"
                                    value={motherInfoForm.values.motherEmployeeId}
                                    onChange={motherInfoForm.handleChange}
                                    invalid={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? true : false}
                                    error={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? motherInfoForm.errors.motherEmployeeId : ""}
                                    isDisabled={motherInfoForm.values.isMotherEmployee === "no"}
                                /> */}
                            <div className="tw-col-span-6">
                                <TextInput
                                    name="motherName"
                                    labelText="Name"
                                    // formgroupClassName="mb-4"
                                    value={motherInfoForm.values.motherName}
                                    onChange={motherInfoForm.handleChange}
                                    onBlur={motherInfoForm.handleBlur}
                                    labelClass="required"
                                    invalid={(motherInfoForm.touched.motherName && motherInfoForm.errors.motherName) ? true : false}
                                    error={(motherInfoForm.touched.motherName && motherInfoForm.errors.motherName) ? motherInfoForm.errors.motherName : ""}
                                    isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                                />
                            </div>
                            <div className="tw-col-span-6">
                                <TextInputWithRegex
                                    name="motherDocumentNumber"
                                    labelText="Aadhar Number"
                                    // formgroupClassName="mb-4"
                                    value={motherInfoForm.values.motherDocumentNumber}
                                    onChange={motherInfoForm.handleChange}
                                    onBlur={motherInfoForm.handleBlur}
                                    labelClass="required"
                                    invalid={(motherInfoForm.touched.motherDocumentNumber && motherInfoForm.errors.motherDocumentNumber) ? true : false}
                                    error={(motherInfoForm.touched.motherDocumentNumber && motherInfoForm.errors.motherDocumentNumber) ? motherInfoForm.errors.motherDocumentNumber : ""}
                                    isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                                    maxLength={12}
                                    allowedInputRegex="^[0-9]+$"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    <div className="tw-col-span-4">
                        <TextIconInput
                            name="motherEmailId"
                            labelText="Email ID"
                            value={motherInfoForm.values.motherEmailId}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            labelClass="required"
                            invalid={(motherInfoForm.touched.motherEmailId && motherInfoForm.errors.motherEmailId) ? true : false}
                            error={(motherInfoForm.touched.motherEmailId && motherInfoForm.errors.motherEmailId) ? motherInfoForm.errors.motherEmailId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>

                    <div className="tw-col-span-4">
                        <PhoneInput
                            name="motherContactNo"
                            labelText="Phone No."
                            value={motherInfoForm.values.motherContactNo}
                            onChange={onChangePhoneInput}
                            onBlur={motherInfoForm.handleBlur}
                            labelClass="required"
                            invalid={(motherInfoForm.touched.motherContactNo && motherInfoForm.errors.motherContactNo) ? true : false}
                            error={(motherInfoForm.touched.motherContactNo && motherInfoForm.errors.motherContactNo) ? motherInfoForm.errors.motherContactNo : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}

                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="motherQualificationId"
                            labelText="Qualification"
                            value={motherInfoForm.values.motherQualificationId}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            labelClass="required"   
                            invalid={(motherInfoForm.touched.motherQualificationId && motherInfoForm.errors.motherQualificationId) ? true : false}
                            error={(motherInfoForm.touched.motherQualificationId && motherInfoForm.errors.motherQualificationId) ? motherInfoForm.errors.motherQualificationId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                        />
                        {/* <TextInput
                            name="motherQualificationId"
                            labelText="Qualification"
                            value={motherInfoForm.values.motherQualificationId}
                            onChange={motherInfoForm.handleChange}
                            invalid={(motherInfoForm.touched.motherQualificationId && motherInfoForm.errors.motherQualificationId) ? true : false}
                            error={(motherInfoForm.touched.motherQualificationId && motherInfoForm.errors.motherQualificationId) ? motherInfoForm.errors.motherQualificationId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}

                        /> */}
                    </div>

                    <div className="tw-col-span-4">
                        {/* <TextInput
                            name="motherOccupationId"
                            labelText="Occupation"
                            value={motherInfoForm.values.motherOccupationId}
                            onChange={motherInfoForm.handleChange}
                            invalid={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? true : false}
                            error={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? motherInfoForm.errors.motherOccupationId : ""}
                        /> */}
                        <CustomSelect
                            name="motherOccupationId"
                            labelText="Occupation"
                            value={motherInfoForm.values.motherOccupationId}
                            options={occupationResp?.data}
                            idKey="occupationId"
                            searchKey="occupationName"
                            renderValue={renderOccuptaionValueSection}
                            renderOptions={renderOccuptaionOptions}
                            onChange={handleOccupationChange}
                            labelClass="required"
                            defaultSelect="Select"
                            invalid={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? true : false}
                            error={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? motherInfoForm.errors.motherOccupationId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="motherOrganizationName"
                            labelText="Company"
                            value={motherInfoForm.values.motherOrganizationName}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            labelClass="required"
                            invalid={(motherInfoForm.touched.motherOrganizationName && motherInfoForm.errors.motherOrganizationName) ? true : false}
                            error={(motherInfoForm.touched.motherOrganizationName && motherInfoForm.errors.motherOrganizationName) ? motherInfoForm.errors.motherOrganizationName : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}

                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="motherDesignationId"
                            labelText="Designation"
                            value={motherInfoForm.values.motherDesignationId}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            labelClass="required"
                            invalid={(motherInfoForm.touched.motherDesignationId && motherInfoForm.errors.motherDesignationId) ? true : false}
                            error={(motherInfoForm.touched.motherDesignationId && motherInfoForm.errors.motherDesignationId) ? motherInfoForm.errors.motherDesignationId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                        />
                        {/* <TextInput
                            name="motherDesignationId"
                            labelText="Designation"
                            value={motherInfoForm.values.motherDesignationId}
                            onChange={motherInfoForm.handleChange}
                            invalid={(motherInfoForm.touched.motherDesignationId && motherInfoForm.errors.motherDesignationId) ? true : false}
                            error={(motherInfoForm.touched.motherDesignationId && motherInfoForm.errors.motherDesignationId) ? motherInfoForm.errors.motherDesignationId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}

                        /> */}
                    </div>

                    <div className="tw-col-span-4">
                        {/* <TextInputWithRegex
                            name="motherIncomeId"
                            labelText="Annual Income"
                            value={motherInfoForm.values.motherIncomeId}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            labelClass="required"
                            invalid={(motherInfoForm.touched.motherIncomeId && motherInfoForm.errors.motherIncomeId) ? true : false}
                            error={(motherInfoForm.touched.motherIncomeId && motherInfoForm.errors.motherIncomeId) ? motherInfoForm.errors.motherIncomeId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        /> */}
                        <SelectInput
                            name="motherIncomeId"
                            labelText="Annual Income "
                            value={motherInfoForm.values.motherIncomeId}
                            onChange={motherInfoForm.handleChange}
                            menuItems={masterIncomeResp}
                            valueKey="annualIncome"
                            textKey="annualIncome"
                            formgroupClassName="tw-mb-2"
                            labelClass="required"
                            invalid={(motherInfoForm.touched.motherIncomeId && motherInfoForm.errors.motherIncomeId) ? true : false}
                            error={(motherInfoForm.touched.motherIncomeId && motherInfoForm.errors.motherIncomeId) ? motherInfoForm.errors.motherIncomeId : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
                        />
                    </div>
                    {/* <div className="col-4">
                        <RadioInputContainer
                            name="isSingleParent"
                            labelText="Is Single Parent ?"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={motherInfoForm.values.isSingleParent}
                            isDisabled={isFatherSingleParent}
                            onChange={singleParentHndlr}
                        />
                    </div> */}
                    {/* <div className="col-4">
                        <SelectInput
                            name="singleParentType"
                            labelText="Single Parent Type"
                            value={""}
                            onChange={() => { }}
                            menuItems={[{ id: "divorce", name: "Divorce" }, {
                                id: "Legally Separated", name: "Legally Separated"
                            }, {
                                id: "Widow", name: "Widow"
                            }, {
                                id: "Widower", name: "Widower"
                            }]}
                            valueKey="id"
                            textKey="name"
                            isDisabled={motherInfoForm.values.isSingleParent === "no"}

                        />
                    </div> */}
                    <div className="tw-col-span-12">
                        <TextInput
                            name="motherOfficeAddress"
                            labelText="Office Address"
                            value={motherInfoForm.values.motherOfficeAddress}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            labelClass="required"
                            invalid={(motherInfoForm.touched.motherOfficeAddress && motherInfoForm.errors.motherOfficeAddress) ? true : false}
                            error={(motherInfoForm.touched.motherOfficeAddress && motherInfoForm.errors.motherOfficeAddress) ? motherInfoForm.errors.motherOfficeAddress : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployee === "true"}
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
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
    UploadImage, UploadImageUpdated, AutoSearchInputUpdated, TextInputWithRegex,
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

import { getStudentFatherEmployeeDetailsAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";

// Old details
// export function getFatherInfoInitialState(initialState: any) {
//     return {
//         fatherName: initialState?.fatherName || "Father Name",
//         fatherNationalityId: initialState?.fatherNationalityId || "1",
//         fatherEmailId: initialState?.fatherEmailId || "father@mail.com",
//         fatherContactNo: initialState?.fatherContactNo || "1234567890",
//         isFatherEmployee: initialState?.isFatherEmployee || false,
//         fatherEmployeeId: initialState?.fatherEmployeeId || "1",

//         fatherQualificationId: initialState?.fatherQualificationId || "1",
//         fatherOccupationId: initialState?.fatherOccupationId || "1",
//         fatherOrganizationName: initialState?.fatherOrganizationName || "1",

//         fatherDesignationId: initialState?.fatherDesignationId || "1",
//         fatherIncomeId: initialState?.fatherIncomeId || "34324",
//         fatherOfficeAddress: initialState?.fatherOfficeAddress || "Testin Address",

//         fatherDocumentType: initialState?.fatherDocumentType || "",
//         fatherDocumentNumber: initialState?.fatherDocumentNumber || "",

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
        fatherName: initialState?.fatherName || "",
        fatherNationalityId: initialState?.fatherNationalityId || "1",
        fatherEmailId: initialState?.fatherEmailId || "",
        fatherContactNo: initialState?.fatherContactNo || "",
        isFatherEmployee: getTrueFalseOptions(initialState?.isFatherEmployee),
        fatherEmployeeId: initialState?.fatherEmployeeId || "",

        fatherQualificationId: initialState?.fatherQualificationId || "",
        fatherOccupationId: initialState?.fatherOccupationId || "",
        fatherOrganizationName: initialState?.fatherOrganizationName || "",

        fatherDesignationId: initialState?.fatherDesignationId || "",
        fatherIncomeId: initialState?.fatherIncomeId || "",
        fatherOfficeAddress: initialState?.fatherOfficeAddress || "",

        fatherDocumentType: initialState?.fatherDocumentType || "",
        fatherDocumentNumber: initialState?.fatherDocumentNumber || "",
        fatherEmployeeCode: initialState?.fatherEmployeeCode || "",

        // isSingleParent: getTrueFalseOptions(initialState?.isSingleParent),
        // isSingleParent: "false"
    }
}

const validationSchema = Yup.object().shape({
    isFatherEmployee: Yup.string(),
    fatherEmployeeId: Yup.string().when('isFatherEmployee', {
        is: (isFatherEmployee: any) => isFatherEmployee === "true",
        then: Yup.string()
            .required('Employee id required.')
    }),
    fatherName: Yup.string().required('Father name required.'),
    fatherDocumentNumber: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required."),
    fatherEmailId: Yup.string().required('Email id required.').email("Invalid email."),
    fatherContactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required."),
    fatherQualificationId: Yup.string().required('Qualification required.'),
    fatherOccupationId: Yup.string().required('Occupation required.'),
    fatherOrganizationName: Yup.string().required('Organization required.'),
    fatherDesignationId: Yup.string().required('Designation required.'),
    fatherIncomeId: Yup.string().required('Income required.'),
    fatherOfficeAddress: Yup.string().required('Office address required.')
});
// const validationSchema = Yup.object().shape({
//     isFatherEmployee: Yup.string(),
//     fatherEmployeeId: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "true",
//         then: Yup.string()
//             .required('Employee id required.')
//     }),
//     fatherName: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Father name required.')
//     }),
//     fatherDocumentNumber: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Document number required.')
//     }),
//     fatherEmailId: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Email id required.')
//     }),
//     fatherContactNo: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Contact number required.")
//     }),
//     fatherQualificationId: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Qualification required.')
//     }),
//     fatherOccupationId: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Occupation required.')
//     }),
//     fatherOrganizationName: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Organization required.')
//     }),
//     fatherDesignationId: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Designation required.')
//     }),
//     fatherIncomeId: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Income required.')
//     }),
//     fatherOfficeAddress: Yup.string().when('isFatherEmployee', {
//         is: (isFatherEmployee: any) => isFatherEmployee === "false",
//         then: Yup.string()
//             .required('Office address required.')
//     })
// });

export default function FatherInfo({ occupationResp, designationListResp, qualificationsListResp }: any) {
    const [fatherImgFileState, setFatherImgFileState] = useState<any>("");
    const fatherImgFileRef = useRef<any>(null);
    // const [fillEmployeeDetailsState, setFillEmployeeDetailsState] = useState<boolean>(false);
    const [isMotherSingleParent, setIsMotherSingleParent] = useState(false);
    const [fileUploadErrorMessageState, setFileUploadErrorMessageState] = useState<string>("");
    const { currentMultiFormKeys, editStudentData,
        updateFormKeyDataHndlr, storeMultiFormData, requestedMultiFormKeys, requestedMultiFormKeyCllback } = useContext<any>(StepperFormContext);
    const [fatherInfoState, setFatherInfoState] = useState<any>(() => {
        const { fatherDetails } = editStudentData || {},
            { formData } = fatherDetails || {};
        return getFatherInfoInitialState(formData)
    });
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);

    const dispatch = useAppDispatch();
    const { studentFatherEmployeeDetailsResp, getEmployeesByFilterResp, employeeManagementErrorResp, masterIncomeResp } =
        useAppSelector(({ directoryEmployee, directoryStudent, masterData }) => ({
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            studentFatherEmployeeDetailsResp: directoryStudent.studentFatherEmployeeDetailsResp,
            employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
            masterIncomeResp: masterData.masterIncomeResp
        }), shallowEqual);

    const fatherInfoRef = useRef<any>({
        prevStudentFatherEmployeeDetailsResp: studentFatherEmployeeDetailsResp,
        prevEmployeeManagementErrorResp: employeeManagementErrorResp
    });
    useEffect(() => {
        const { prevStudentFatherEmployeeDetailsResp, prevEmployeeManagementErrorResp } = fatherInfoRef.current;
        if (studentFatherEmployeeDetailsResp && prevStudentFatherEmployeeDetailsResp !== studentFatherEmployeeDetailsResp) {
            const { employeeBasicDetails, employeeContactDetails,
                employeeEducationDetails, employeeDesignationDetails, employeeSalaryDetails } = studentFatherEmployeeDetailsResp,
                { fullImageBase64 } = employeeBasicDetails || {};
            if (fullImageBase64) {
                setFatherImgFileState(`data:image/jpeg;base64, ${fullImageBase64}`);
            } else {
                setFatherImgFileState(undefined);
                fatherImgFileRef.current = undefined;
            }
            fatherForm.resetForm({
                values: {
                    fatherName: employeeBasicDetails?.employeeName || "",
                    fatherNationalityId: employeeBasicDetails?.nationalityId || "1",
                    fatherEmailId: employeeBasicDetails?.personalEmailId || "",
                    fatherContactNo: employeeBasicDetails?.contactNo || "",
                    isFatherEmployee: "true",
                    fatherEmployeeId: employeeBasicDetails?.id || "",
                    fatherQualificationId: employeeEducationDetails?.qualificationId || "",
                    fatherOccupationId: employeeBasicDetails?.occupationId || "",
                    fatherOrganizationName: employeeBasicDetails?.organizationName || "",
                    fatherDesignationId: employeeDesignationDetails?.designationId || "",
                    fatherIncomeId: employeeSalaryDetails?.grossSalary || "",
                    fatherOfficeAddress: employeeContactDetails?.addressLine || "",
                    fatherDocumentType: employeeBasicDetails?.documentType || "Aadhar",
                    fatherDocumentNumber: employeeBasicDetails?.aadharNo || "",
                    isSingleParent: "false",
                }
            })
        } else if (employeeManagementErrorResp && prevEmployeeManagementErrorResp !== employeeManagementErrorResp) {
            // isEmployeeSearchedRef.current = false;
        }
        fatherInfoRef.current.prevStudentFatherEmployeeDetailsResp = studentFatherEmployeeDetailsResp;
        fatherInfoRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
    }, [studentFatherEmployeeDetailsResp, employeeManagementErrorResp]);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const fatherForm = useFormik({
        enableReinitialize: true,
        initialValues: fatherInfoState,
        validationSchema,
        onSubmit: (values: any, handleSubmit: any) => {
            let fatherImageBase64 = undefined;
            if (!fatherImgFileRef.current) {
                const { fatherDetails } = editStudentData || {},
                    { formData } = fatherDetails || {},
                    { employeeBasicDetails } = studentFatherEmployeeDetailsResp || {},
                    { fullImageBase64 } = employeeBasicDetails || {};
                fatherImageBase64 = formData?.fatherImageBase64 || fullImageBase64;
            }

            const addFatherPayload = {
                fatherImageBase64,
                fatherImage: fatherImgFileRef.current,
                ...values
            }
            storeMultiFormData("fatherDetails", true, addFatherPayload);
        }
    })

    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        fatherForm.setFieldValue(name, updateDate);
    }

    function renderOccuptaionValueSection(selectedItem: any) {
        return selectedItem?.occupationName || "";
    }

    function renderOccuptaionOptions(item: any) {
        return item?.occupationName?.toString() || "";
    }

    function handleOccupationChange(selected: any, config: any) {
        const { name } = config;
        fatherForm.setFieldValue(name, selected);
    }

    useEffect(() => {
        const { fatherDetails, motherDetails } = editStudentData || {},
            { formData } = fatherDetails || {},
            { formData: motherFormData } = motherDetails || {},
            { isSingleParent } = motherFormData || {};
        // if (isSingleParent === "true") {
        //     setIsMotherSingleParent(true);
        //     setSearchEmployeeState(null);
        //     setFatherImgFileState(undefined);
        //     fatherImgFileRef.current = undefined;
        //     fatherForm.resetForm({
        //         values: getFatherInfoInitialState()
        //     });
        // } else
        if (formData) {
            // setIsMotherSingleParent(false);
            const { fatherEmployeeId, fatherImage, fatherEmployeeCode, fatherImageBase64, isFatherEmployee, fatherName } = formData;
            if (fatherImageBase64) {
                setFatherImgFileState(`data:image/jpeg;base64, ${fatherImageBase64}`);
            } else if (fatherImage) {
                fatherImgFileRef.current = fatherImage;
                setFatherImgFileState(URL.createObjectURL(fatherImage));
            }
            if (isFatherEmployee === "true") {
                setSearchEmployeeState({
                    id: fatherEmployeeId,
                    employeeName: fatherName,
                    employeeCode: fatherEmployeeCode
                })
            }
            fatherForm.resetForm({
                values: getFatherInfoInitialState(formData)
            });
        }
        //  else if (isMotherSingleParent && (isSingleParent === "false")) {
        //     setIsMotherSingleParent(false);
        //     setSearchEmployeeState(null);
        //     setFatherImgFileState(undefined);
        //     fatherImgFileRef.current = undefined;
        //     fatherForm.resetForm({
        //         values: getFatherInfoInitialState()
        //     });
        // }
    }, [editStudentData]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("fatherDetails")) {
            submitFatherHndlr();
        }
    }, [currentMultiFormKeys]);

    function submitFatherHndlr() {
        const { isFatherEmployee, fatherEmployeeId } = fatherForm.values;
        // if (isMotherSingleParent) {
        //     storeMultiFormData("fatherDetails", true, null);
        // } else 
        if ((isFatherEmployee === "true" && fatherEmployeeId)) {
            let fatherImageBase64 = undefined;
            if (!fatherImgFileRef.current) {
                const { fatherDetails } = editStudentData || {},
                    { formData } = fatherDetails || {},
                    { employeeBasicDetails } = studentFatherEmployeeDetailsResp || {},
                    { fullImageBase64 } = employeeBasicDetails || {};
                fatherImageBase64 = formData?.fatherImageBase64 || fullImageBase64;
            }
            const payload = {
                fatherImageBase64,
                fatherImage: fatherImgFileRef.current,
                ...fatherForm.values
            }
            storeMultiFormData("fatherDetails", true, payload);
        } else if (isFatherEmployee === "true" && !fatherEmployeeId) {
            fatherForm.setFieldTouched("fatherEmployeeId", true, true);
        } else {
            fatherForm.handleSubmit();
        }
    }

    function handleFileUploadHnlr(event: any) {
        const file = event.target.files[0];
        const uploadFileMessage = uploadImageFileErrorHndlr(file.size, file.type);
        if (uploadFileMessage && typeof (uploadFileMessage) === "string") {
            setFileUploadErrorMessageState(uploadFileMessage);
            return;
        }
        setFileUploadErrorMessageState("");
        fatherImgFileRef.current = event.target.files[0];
        setFatherImgFileState(URL.createObjectURL(file));
    }

    function onChangeEmployeeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        fatherForm.resetForm({
            values: getFatherInfoInitialState({ isFatherEmployee: value })
        });
        setSearchEmployeeState(null);
    }

    function handleSearchEmployeeHndlr(inputString: string, inputAction: any) {
        if (inputString) {
            const params = { searchString: inputString },
                payload = { genderId: 1 };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
        }
    }
    function handleSelectedEmployee(selectedSingle?: any, meta?: any) {
        setSearchEmployeeState(selectedSingle);
        if (selectedSingle) {
            const { id } = selectedSingle;
            dispatch(getStudentFatherEmployeeDetailsAct(generateActionPayload("get_employee_byid", { employeeId: id })));
        } else {
            fatherForm.resetForm({
                values: getFatherInfoInitialState({ isFatherEmployee: "true" })
            });
            setFatherImgFileState(undefined);
            fatherImgFileRef.current = undefined;
        }
    }
    function handleMenuOpen() {
        const { employeeName } = searchEmployeeState || {},
            params = { searchString: (employeeName || "a") },
            payload = { genderId: 1 };
        dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, payload)));
    }

    function singleParentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        fatherForm.setFieldValue(name, value);
        updateFormKeyDataHndlr("fatherDetails", { ...fatherForm.values, [name]: value });
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
                values: getFatherInfoInitialState({ isFatherEmployee: "true" })
            });
            setFatherImgFileState(undefined);
            fatherImgFileRef.current = undefined;
        }
    }
    return (
        <form onSubmit={fatherForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId="father-info">
                Father Info
            </AccordionHeader>
            <AccordionBody accordionId="father-info">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-4">
                            {/* <UploadImage
                                name="father-image"
                                acceptFileFormat="image/png, image/gif, image/jpeg"
                                value={fatherImgFileState || StudentImgIcon}
                                onChange={handleFileUploadHnlr}
                            /> */}
                            <UploadImageUpdated
                                name="father-image"
                                acceptFileFormat="image/jpg, image/png, image/jpeg"
                                value={fatherImgFileState}
                                onChange={handleFileUploadHnlr}
                                error={fileUploadErrorMessageState}
                            />
                        </div>
                    <div className="tw-col-span-8">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-6">
                                <RadioInputContainer
                                    name="isFatherEmployee"
                                    labelText="Employee of the School ?"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={trueFalseOptions}
                                    value={fatherForm.values.isFatherEmployee}
                                    onChange={onChangeEmployeeHndlr}
                                    isDisabled={isMotherSingleParent}
                                />
                            </div>
                            <div className="tw-col-span-6">
                                <AutoSearchInputUpdated
                                    formgroupClassName="tw-mb-0"
                                    name="employeeId"
                                    labelText="Employee Name / Code"
                                    // onChange={(e: any) => setSearchInputState(e.target.value)}
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
                                    isDisabled={fatherForm.values.isFatherEmployee === "false"}
                                    invalid={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? true : false}
                                    error={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? fatherForm.errors.fatherEmployeeId : ""}
                                ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                            </div>
                            {/* <div className="col-6">
                                <SelectWithTextInput
                                    name="employeeId"
                                    labelText="Employee Name / Code"
                                    value={searchEmployeeState}
                                    handleSelect={handleSelectedEmployee}
                                    menuOpenHndlr={handleMenuOpen}
                                    options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
                                    placeHolder="Search..."
                                    handleInputChange={handleSearchEmployeeHndlr}
                                    labelId="employeeName"
                                    valueId="id"
                                    formgroupClassName="mb-0"
                                    isDisabled={fatherForm.values.isFatherEmployee === "false" || isMotherSingleParent}
                                    invalid={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? true : false}
                                    error={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? fatherForm.errors.fatherEmployeeId : ""}
                                />

                            </div> */}
                            {/* <TextInput
                                    name="fatherEmployeeId"
                                    labelText="Employee Id"
                                    // formgroupClassName="mb-4"
                                    value={fatherForm.values.fatherEmployeeId}
                                    onChange={fatherForm.handleChange}
                                    invalid={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? true : false}
                                    error={(fatherForm.touched.fatherEmployeeId && fatherForm.errors.fatherEmployeeId) ? fatherForm.errors.fatherEmployeeId : ""}
                                    isDisabled={fatherForm.values.isFatherEmployee === "false"}
                                /> */}
                            <div className="tw-col-span-6">
                                <TextInput
                                    name="fatherName"
                                    labelText="Name"
                                    // formgroupClassName="mb-4"
                                    value={fatherForm.values.fatherName}
                                    onChange={fatherForm.handleChange}
                                    onBlur={fatherForm.handleBlur}
                                    labelClass="required"
                                    invalid={(fatherForm.touched.fatherName && fatherForm.errors.fatherName) ? true : false}
                                    error={(fatherForm.touched.fatherName && fatherForm.errors.fatherName) ? fatherForm.errors.fatherName : ""}
                                    isDisabled={fatherForm.values.isFatherEmployee === "true"}
                                />
                            </div>

                            <div className="tw-col-span-6">
                                <TextInputWithRegex
                                    name="fatherDocumentNumber"
                                    labelText="Aadhar Number"
                                    // formgroupClassName="mb-4"
                                    value={fatherForm.values.fatherDocumentNumber}
                                    onChange={fatherForm.handleChange}
                                    onBlur={fatherForm.handleBlur}
                                    labelClass="required"
                                    invalid={(fatherForm.touched.fatherDocumentNumber && fatherForm.errors.fatherDocumentNumber) ? true : false}
                                    error={(fatherForm.touched.fatherDocumentNumber && fatherForm.errors.fatherDocumentNumber) ? fatherForm.errors.fatherDocumentNumber : ""}
                                    isDisabled={fatherForm.values.isFatherEmployee === "true"}
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
                            name="fatherEmailId"
                            labelText="Email ID"
                            value={fatherForm.values.fatherEmailId}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            labelClass="required"
                            invalid={(fatherForm.touched.fatherEmailId && fatherForm.errors.fatherEmailId) ? true : false}
                            error={(fatherForm.touched.fatherEmailId && fatherForm.errors.fatherEmailId) ? fatherForm.errors.fatherEmailId : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>

                    <div className="tw-col-span-4">
                        <PhoneInput
                            name="fatherContactNo"
                            labelText="Phone No."
                            value={fatherForm.values.fatherContactNo}
                            onChange={onChangePhoneInput}
                            onBlur={fatherForm.handleBlur}
                            labelClass="required"
                            invalid={(fatherForm.touched.fatherContactNo && fatherForm.errors.fatherContactNo) ? true : false}
                            error={(fatherForm.touched.fatherContactNo && fatherForm.errors.fatherContactNo) ? fatherForm.errors.fatherContactNo : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="fatherQualificationId"
                            labelText="Qualification"
                            value={fatherForm.values.fatherQualificationId}
                            onChange={fatherForm.handleChange}
                            invalid={(fatherForm.touched.fatherQualificationId && fatherForm.errors.fatherQualificationId) ? true : false}
                            error={(fatherForm.touched.fatherQualificationId && fatherForm.errors.fatherQualificationId) ? fatherForm.errors.fatherQualificationId : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <CustomSelect
                            name="fatherOccupationId"
                            labelText="Occupation"
                            value={fatherForm.values.fatherOccupationId}
                            options={occupationResp?.data}
                            idKey="occupationId"
                            searchKey="occupationName"
                            renderValue={renderOccuptaionValueSection}
                            renderOptions={renderOccuptaionOptions}
                            onChange={handleOccupationChange}
                            labelClass="required"
                            defaultSelect="Select"
                            invalid={(fatherForm.touched.fatherOccupationId && fatherForm.errors.fatherOccupationId) ? true : false}
                            error={(fatherForm.touched.fatherOccupationId && fatherForm.errors.fatherOccupationId) ? fatherForm.errors.fatherOccupationId : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="fatherOrganizationName"
                            labelText="Company"
                            value={fatherForm.values.fatherOrganizationName}
                            onChange={fatherForm.handleChange}
                            labelClass="required"
                            invalid={(fatherForm.touched.fatherOrganizationName && fatherForm.errors.fatherOrganizationName) ? true : false}
                            error={(fatherForm.touched.fatherOrganizationName && fatherForm.errors.fatherOrganizationName) ? fatherForm.errors.fatherOrganizationName : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="fatherDesignationId"
                            labelText="Designation"
                            value={fatherForm.values.fatherDesignationId}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            labelClass="required"
                            invalid={(fatherForm.touched.fatherDesignationId && fatherForm.errors.fatherDesignationId) ? true : false}
                            error={(fatherForm.touched.fatherDesignationId && fatherForm.errors.fatherDesignationId) ? fatherForm.errors.fatherDesignationId : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                        />
                        {/* <TextInput
                            name="fatherDesignationId"
                            labelText="Designation"
                            value={fatherForm.values.fatherDesignationId}
                            onChange={fatherForm.handleChange}
                            invalid={(fatherForm.touched.fatherDesignationId && fatherForm.errors.fatherDesignationId) ? true : false}
                            error={(fatherForm.touched.fatherDesignationId && fatherForm.errors.fatherDesignationId) ? fatherForm.errors.fatherDesignationId : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                        /> */}
                    </div>

                    <div className="tw-col-span-4">
                        {/* <TextInputWithRegex
                            name="fatherIncomeId"
                            labelText="Annual Income"
                            value={fatherForm.values.fatherIncomeId}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            labelClass="required"
                            invalid={(fatherForm.touched.fatherIncomeId && fatherForm.errors.fatherIncomeId) ? true : false}
                            error={(fatherForm.touched.fatherIncomeId && fatherForm.errors.fatherIncomeId) ? fatherForm.errors.fatherIncomeId : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        /> */}

                        <SelectInput
                            name="fatherIncomeId"
                            labelText="Annual Income "
                            value={fatherForm.values.fatherIncomeId}
                            onChange={fatherForm.handleChange}
                            menuItems={masterIncomeResp}
                            valueKey="annualIncome"
                            textKey="annualIncome"
                            formgroupClassName="tw-mb-2"
                            labelClass="required"
                            invalid={(fatherForm.touched.fatherIncomeId && fatherForm.errors.fatherIncomeId) ? true : false}
                            error={(fatherForm.touched.fatherIncomeId && fatherForm.errors.fatherIncomeId) ? fatherForm.errors.fatherIncomeId : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}

                        />
                    </div>
                    {/* <div className="col-4">
                        <RadioInputContainer
                            name="isSingleParent"
                            // labelText="Employee of the School ?"
                            labelText="Is Single Parent?"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={fatherForm.values.isSingleParent}
                            onChange={singleParentHndlr}
                            isDisabled={isMotherSingleParent}
                        />
                    </div> */}
                    {/* <div className="col-4">
                        <SelectInput
                            name="SingleParentType"
                            labelText="Single Parent Type"
                            value={""}
                            onChange={() => { }}
                            menuItems={[{ id: "divorce", name: "Divorce" }]}
                            // hideSelectOption={true}
                            valueKey="id"
                            textKey="name"
                            isDisabled={fatherForm.values.isSingleParent === "no"}
                        />
                    </div> */}
                    <div className="tw-col-span-12">
                        <TextInput
                            name="fatherOfficeAddress"
                            labelText="Office Address"
                            value={fatherForm.values.fatherOfficeAddress}
                            onChange={fatherForm.handleChange}
                            onBlur={fatherForm.handleBlur}
                            labelClass="required"
                            invalid={(fatherForm.touched.fatherOfficeAddress && fatherForm.errors.fatherOfficeAddress) ? true : false}
                            error={(fatherForm.touched.fatherOfficeAddress && fatherForm.errors.fatherOfficeAddress) ? fatherForm.errors.fatherOfficeAddress : ""}
                            isDisabled={fatherForm.values.isFatherEmployee === "true"}
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
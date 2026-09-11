import { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
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
    UploadImage, AutoSearchInput,
    UploadImageUpdated, TextInputWithRegex, MultiSelect, MemoizedSelectInput
} from "../../../../../../../Components/Common";

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
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import { uploadImageFileErrorHndlr } from "../../../../../../../utility/commonutility";

import { getEmployeeByFilterAct } from "../../../../../../../store/directory/employeemanagement/employeemanagementactions";
import { getStudentMotherEmployeeDetailsAct } from "../../../../../../../store/directory/studentmanagement/studentmanagementactions";

// Old State
// export function getMotherInfoInitialState(initialState: any) {
//     return {
//         motherName: initialState?.motherName || "Mother Nmae",
//         motherNationalityId: initialState?.motherNationalityId || "1",
//         motherEmail: initialState?.motherEmail || "mother@gmail.com",
//         motherPhoneNo: initialState?.motherPhoneNo || "1234567890",
//         motherEmployeeId: initialState?.motherEmployeeId || "1",
//         isMotherEmployeeOfSchool: initialState?.isMotherEmployeeOfSchool || false,
//         motherQualificationId: initialState?.motherQualificationId || "1",

//         motherOccupationId: initialState?.motherOccupationId || "1",
//         motherCompany: initialState?.motherCompany || "Organization",
//         motherDesignationId: initialState?.motherDesignationId || "1",
//         motherAnnualIncome: initialState?.motherAnnualIncome || "34343",
//         motherOfficeLocation: initialState?.motherOfficeLocation || "Mother Office",
//         motherDocumentType: initialState?.motherDocumentType || "Adhar",
//         motherAadharNo: initialState?.motherAadharNo || "23243",
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
        isMotherEmployeeOfSchool: getTrueFalseOptions(initialState?.isMotherEmployeeOfSchool) || "false",
        motherEmployeeId: initialState?.motherEmployeeId || "",
        motherEmployeeCode: initialState?.motherEmployeeCode || "",
        motherName: initialState?.motherName || "",
        motherAadharNo: initialState?.motherAadharNo || "",
        motherEmail: initialState?.motherEmail || "",
        motherPhoneNo: initialState?.motherPhoneNo || "",
        motherQualificationId: initialState?.motherQualificationId || "",
        motherOccupationId: initialState?.motherOccupationId || "",
        motherNationalityId: initialState?.motherNationalityId || "1",
        motherCompany: initialState?.motherCompany || "",
        motherDesignationId: initialState?.motherDesignationId || "",
        motherAnnualIncome: initialState?.motherAnnualIncome || "",
        motherOfficeLocation: initialState?.motherOfficeLocation || "",
        motherContributeStakeHolder: initialState?.motherContributeStakeHolder || [],
        isMotherSingleParent: initialState?.isMotherSingleParent || "false",
        singleParentType: initialState?.singleParentType || "",
    }
}
const validationSchema = Yup.object().shape({

});

const initialValues = getMotherInfoInitialState();
export default function MotherInfo({
    formId, occupationResp, designationListResp,
    qualificationsListResp, stakeHolderList, storeMultiFormDataCallback

}: any) {
    const {
        currentMultiFormKeys, storeMultiFormData
    } = useContext<any>(StepperFormContext);
    // const [fillEmployeeDetailsState, setFillEmployeeDetailsState] = useState<boolean>(false);
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(null);
    const [selectedStakeHolderListState, setSelectedFeeCategoryListState] = useState<any>([]);

    const dispatch = useAppDispatch();
    const { studentMotherEmployeeDetailsResp, getEmployeesByFilterResp, employeeManagementErrorResp } = useAppSelector(({ directoryEmployee, directoryStudent }) => ({
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
            motherInfoForm.resetForm({
                values: {
                    isMotherEmployeeOfSchool: "true",
                    motherEmployeeId: employeeBasicDetails?.id || "",
                    motherEmployeeCode: employeeBasicDetails?.employeeCode || "",
                    motherName: employeeBasicDetails?.employeeName || "",
                    motherAadharNo: employeeBasicDetails?.aadharNo || "",
                    motherEmail: employeeBasicDetails?.personalEmailId || "",
                    motherPhoneNo: employeeBasicDetails?.contactNo || "",
                    motherQualificationId: employeeEducationDetails?.qualificationId || "",
                    motherOccupationId: employeeBasicDetails?.occupationId || "",
                    motherNationalityId: employeeBasicDetails?.nationalityId || "1",
                    motherCompany: employeeBasicDetails?.organizationName || "",
                    motherDesignationId: employeeDesignationDetails?.designationId || "",
                    motherAnnualIncome: employeeSalaryDetails?.grossSalary || "",
                    motherOfficeLocation: employeeContactDetails?.addressLine || "",
                    motherContributeStakeHolder: [],
                    isMotherSingleParent: "false",
                    singleParentType: "",
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
        initialValues,
        // validationSchema,
        onSubmit: (values: any) => {
            const payload = { ...values };
            payload.motherContributeStakeHolder = selectedStakeHolderListState.map((item: any) => item.stakeHolder);
            storeMultiFormDataCallback(formId, true, payload);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId))
            motherInfoForm.handleSubmit();
    }, [currentMultiFormKeys]);

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
                payload = { genderId: 2 };
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

    function onSelectStakeHolderHndlr(selectItem: any) {
        setSelectedFeeCategoryListState(selectItem);
        if (selectItem.length > selectedStakeHolderListState.length) {
            const selectedId = selectItem.map((item: any) => item.id);
            const prevSelectedId = selectedStakeHolderListState.map((item: any) => item.id),
                addedItem = selectItem.find((item: any) => (!prevSelectedId.includes(item.id)));
            if (addedItem.id) {
                motherInfoForm.setValues((prevState: any) => ({
                    ...prevState,
                    motherContributeStakeHolder: selectedId,
                }));
            }
        } else if (selectItem.length < selectedStakeHolderListState.length) {
            const selectedId = selectItem.map((item: any) => item.id),
                removedItemId = selectedStakeHolderListState.find((item: any) => (!selectedId.includes(item.id)));
            if (removedItemId.id) {
                motherInfoForm.setValues((prevState: any) => ({
                    ...prevState,
                    motherContributeStakeHolder: selectedId,
                }));
            }
        } else {
            motherInfoForm.setValues((prevState: any) => ({
                ...prevState,
                motherContributeStakeHolder: []
            }));
        }
    }

    return (
        <form onSubmit={motherInfoForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId="mother-info">
                Mother Info
            </AccordionHeader>
            <AccordionBody accordionId="mother-info">
                <div className="row">
                    <div className="col-4">
                        <RadioInputContainer
                            name="isMotherEmployeeOfSchool"
                            labelText="Is Employee of School"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={motherInfoForm.values.isMotherEmployeeOfSchool}
                            onChange={onChangeEmployeeHndlr}
                        />
                    </div>
                    <div className="col-4">
                        <AutoSearchInput
                            formgroupClassName="search-box"
                            name="motherEmployeeId"
                            labelText="Parent Name"
                            // onChange={(e: any) => setSearchInputState(e.target.value)}
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
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "false"}
                            invalid={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? true : false}
                            error={(motherInfoForm.touched.motherEmployeeId && motherInfoForm.errors.motherEmployeeId) ? motherInfoForm.errors.motherEmployeeId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="motherName"
                            labelText="Name"
                            // formgroupClassName="mb-4"
                            value={motherInfoForm.values.motherName}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherName && motherInfoForm.errors.motherName) ? true : false}
                            error={(motherInfoForm.touched.motherName && motherInfoForm.errors.motherName) ? motherInfoForm.errors.motherName : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInputWithRegex
                            name="motherAadharNo"
                            labelText="Aadhar Number"
                            // formgroupClassName="mb-4"
                            value={motherInfoForm.values.motherAadharNo}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherAadharNo && motherInfoForm.errors.motherAadharNo) ? true : false}
                            error={(motherInfoForm.touched.motherAadharNo && motherInfoForm.errors.motherAadharNo) ? motherInfoForm.errors.motherAadharNo : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                            maxLength={12}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="col-4">
                        <TextIconInput
                            name="motherEmail"
                            labelText="Email ID"
                            value={motherInfoForm.values.motherEmail}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherEmail && motherInfoForm.errors.motherEmail) ? true : false}
                            error={(motherInfoForm.touched.motherEmail && motherInfoForm.errors.motherEmail) ? motherInfoForm.errors.motherEmail : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        ><i className="ri-mail-unread-line"></i></TextIconInput>
                    </div>
                    <div className="col-4">
                        <PhoneInput
                            name="motherPhoneNo"
                            labelText="Phone No."
                            value={motherInfoForm.values.motherPhoneNo}
                            onChange={onChangePhoneInput}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherPhoneNo && motherInfoForm.errors.motherPhoneNo) ? true : false}
                            error={(motherInfoForm.touched.motherPhoneNo && motherInfoForm.errors.motherPhoneNo) ? motherInfoForm.errors.motherPhoneNo : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}

                        />
                    </div>
                    <div className="col-4">
                        <MemoizedSelectInput
                            name="motherQualificationId"
                            labelText="Qualification"
                            value={motherInfoForm.values.motherQualificationId}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherQualificationId && motherInfoForm.errors.motherQualificationId) ? true : false}
                            error={(motherInfoForm.touched.motherQualificationId && motherInfoForm.errors.motherQualificationId) ? motherInfoForm.errors.motherQualificationId : ""}
                            menuItems={qualificationsListResp?.data}
                            valueKey="id"
                            textKey="qualification"
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="motherOccupationId"
                            labelText="Occupation"
                            value={motherInfoForm.values.motherOccupationId}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? true : false}
                            error={(motherInfoForm.touched.motherOccupationId && motherInfoForm.errors.motherOccupationId) ? motherInfoForm.errors.motherOccupationId : ""}
                            menuItems={occupationResp?.data}
                            valueKey="occupationId"
                            textKey="occupationName"
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="motherCompany"
                            labelText="Company"
                            value={motherInfoForm.values.motherCompany}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherCompany && motherInfoForm.errors.motherCompany) ? true : false}
                            error={(motherInfoForm.touched.motherCompany && motherInfoForm.errors.motherCompany) ? motherInfoForm.errors.motherCompany : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}

                        />
                    </div>
                    <div className="col-4">
                        <MemoizedSelectInput
                            name="motherDesignationId"
                            labelText="Designation"
                            value={motherInfoForm.values.motherDesignationId}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherDesignationId && motherInfoForm.errors.motherDesignationId) ? true : false}
                            error={(motherInfoForm.touched.motherDesignationId && motherInfoForm.errors.motherDesignationId) ? motherInfoForm.errors.motherDesignationId : ""}
                            menuItems={designationListResp?.data}
                            valueKey="id"
                            textKey="designationName"
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                        />
                    </div>
                    <div className="col-4">
                        <TextInputWithRegex
                            name="motherAnnualIncome"
                            labelText="Annual Income"
                            value={motherInfoForm.values.motherAnnualIncome}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherAnnualIncome && motherInfoForm.errors.motherAnnualIncome) ? true : false}
                            error={(motherInfoForm.touched.motherAnnualIncome && motherInfoForm.errors.motherAnnualIncome) ? motherInfoForm.errors.motherAnnualIncome : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        />
                    </div>
                    <div className="col-4">
                        <RadioInputContainer
                            name="isMotherSingleParent"
                            labelText="Is Single Parent ?"
                            inputContainerClassName="mt-2"
                            radioOptions={trueFalseOptions}
                            value={motherInfoForm.values.isMotherSingleParent}
                            onChange={motherInfoForm.handleChange}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="singleParentType"
                            labelText="If Yes Mention Below"
                            value={motherInfoForm.values.singleParentType}
                            menuItems={[{ id: "divorce", name: "Divorce" }, {
                                id: "Legally Separated", name: "Legally Separated"
                            }, {
                                id: "Widow", name: "Widow"
                            }, {
                                id: "Widower", name: "Widower"
                            }]}
                            onChange={motherInfoForm.handleChange}
                            // hideSelectOption={true}
                            valueKey="id"
                            textKey="name"
                            isDisabled={motherInfoForm.values.isMotherSingleParent === "no"}

                        />
                    </div>
                    <div className="col-12">
                        <TextInput
                            name="motherOfficeLocation"
                            labelText="Office Address"
                            value={motherInfoForm.values.motherOfficeLocation}
                            onChange={motherInfoForm.handleChange}
                            onBlur={motherInfoForm.handleBlur}
                            invalid={(motherInfoForm.touched.motherOfficeLocation && motherInfoForm.errors.motherOfficeLocation) ? true : false}
                            error={(motherInfoForm.touched.motherOfficeLocation && motherInfoForm.errors.motherOfficeLocation) ? motherInfoForm.errors.motherOfficeLocation : ""}
                            isDisabled={motherInfoForm.values.isMotherEmployeeOfSchool === "true"}
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
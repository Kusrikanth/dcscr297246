import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct, getTaxCategoryAct,
    getSalaryCategoryAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { amountType } from "../../../EmployeeDetails/EmployeeInfo/helper";


const validationSchema = Yup.object().shape({
    isPfEligible: Yup.string(),
    pfAccountNo: Yup.string().when('isPfEligible', {
        is: (isPfEligible: any) => isPfEligible === "true",
        then: Yup.string()
            .required('PF account number required.')
    }),
    uanNo: Yup.string().when('isPfEligible', {
        is: (isPfEligible: any) => isPfEligible === "true",
        then: Yup.string()
            .required('UAN account number required.')
    }),
    isEsiEligible: Yup.string(),
    esiAccountNo: Yup.string().when('isEsiEligible', {
        is: (isEsiEligible: any) => isEsiEligible === "true",
        then: Yup.string()
            .required('ESI account number required.')
    }),
});

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}


function getInitialState(initialState?: any, haveSalaryDetails?: any) {
    return {
        id: initialState?.id || undefined,
        haveSalaryDetails: getTrueFalseOptions(haveSalaryDetails),
        taxCategoryTypeId: initialState?.taxCategoryTypeId || "",
        amountType: initialState?.amountType || "",
        salaryCategoryId: initialState?.salaryCategoryId || "",
        basicSalary: initialState?.basicSalary || "",
        grossSalary: initialState?.grossSalary || "",
        panCardNo: initialState?.panCardNo || "",
        isPfEligible: getTrueFalseOptions(initialState?.isPfEligible),
        pfAccountNo: initialState?.pfAccountNo || "",
        uanNo: initialState?.uanNo || "",
        isEsiEligible: getTrueFalseOptions(initialState?.isEsiEligible),
        esiAccountNo: initialState?.esiAccountNo || "",
        netTaxBenefitsPa: initialState?.netTaxBenefitsPa || "",
        remarks: initialState?.remarks || "",
    }
}

export default function SalaryDetails({ instituteId, branchId }: any) {
    const [salaryDetailState, setSalaryDetailState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { taxCategoryListResp, salaryCategoryListResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            taxCategoryListResp: masterData.taxCategoryListResp,
            salaryCategoryListResp: masterData.salaryCategoryListResp
        }), shallowEqual);

    useEffect(() => {
        const payload = { instituteId: 49, pageNo: 0, pageSize: 100 };
        dispatch(getTaxCategoryAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "TAX-CATEGORY" })));
        dispatch(getSalaryCategoryAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "SALARY-CATEGORY", pageNo: 0, pageSize: 100, orderBy: "asc", })));
    }, []);


    const salaryDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: salaryDetailState,
        validationSchema,
        onSubmit: (values: any) => {
            const { haveSalaryDetails, ...formData } = values;
            storeMultiFormData("employeeSalaryDetails", true, formData);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeSalaryDetails"))
            submitHanlder();
    }, [currentMultiFormKeys]);


    function submitHanlder() {
        if (salaryDetailsForm.values.haveSalaryDetails === "false") {
            storeMultiFormData("employeeSalaryDetails", true, null);
        } else {
            salaryDetailsForm.handleSubmit();
        }
    }
    useEffect(() => {
        if (editEmployeeData) {
            const { employeeSalaryDetails } = editEmployeeData,
                { formData } = employeeSalaryDetails || {};
            if (formData) {
                const haveSalaryDetails = Object.keys(formData).length > 0;
                setSalaryDetailState(getInitialState(formData, haveSalaryDetails));
            }
        }
    }, [editEmployeeData]);


    function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = phoneNumber.substring(2);
        salaryDetailsForm.setFieldValue(name, updateDate);
    }

    function onChangeHaveSalaryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        salaryDetailsForm.resetForm({
            values: getInitialState(undefined, value)
        });
    }
    return (
        <form onSubmit={salaryDetailsForm.handleSubmit}>
            <AccordionHeader tag="span" className="tw-text-base" targetId="salary-details">
                Salary Details
            </AccordionHeader>
            <AccordionBody accordionId="salary-details">
                <div className="tw-flex tw-flex-wrap tw--mx-2">
                    <div className="tw-w-full tw-px-2">
                        <RadioInputContainer
                            name="haveSalaryDetails"
                            labelText="Do You Have Salary Details ?"
                            containerClassName="tw-flex"
                            labelClassName="tw-mb-0 tw-mr-3"
                            radioOptions={trueFalseOptions}
                            value={salaryDetailsForm.values.haveSalaryDetails}
                            onChange={onChangeHaveSalaryHndlr}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="taxCategoryTypeId"
                            labelText="Tax Category"
                            value={salaryDetailsForm.values.taxCategoryTypeId}
                            onChange={salaryDetailsForm.handleChange}
                            onBlur={salaryDetailsForm.handleBlur}
                            menuItems={taxCategoryListResp?.data}
                            valueKey="id"
                            textKey="taxCategoryType"
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="amountType"
                            labelText="Amount Type"
                            value={salaryDetailsForm.values.amountType}
                            onChange={salaryDetailsForm.handleChange}
                            onBlur={salaryDetailsForm.handleBlur}
                            menuItems={amountType}
                            valueKey="id"
                            textKey="name"
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <SelectInput
                            name="salaryCategoryId"
                            labelText="Salary Category"
                            value={salaryDetailsForm.values.salaryCategoryId}
                            onChange={salaryDetailsForm.handleChange}
                            onBlur={salaryDetailsForm.handleBlur}
                            menuItems={salaryCategoryListResp?.data}
                            valueKey="id"
                            textKey="salaryCategoryName"
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInputWithRegex
                            name="basicSalary"
                            labelText="Basic Salary"
                            value={salaryDetailsForm.values.basicSalary}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                            allowedInputRegex="^[0-9]{1,7}(\.[0-9]{0,2})?$"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInputWithRegex
                            name="grossSalary"
                            labelText="Gross Salary"
                            value={salaryDetailsForm.values.grossSalary}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                            allowedInputRegex="^[0-9]{1,7}(\.[0-9]{0,2})?$"
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="panCardNo"
                            labelText="PAN Card No"
                            value={salaryDetailsForm.values.panCardNo}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <RadioInputContainer
                            name="isPfEligible"
                            labelText="PF Status"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={[{ id: "true", name: "Eligible" }, { id: "false", name: "Not Eligible" }]}
                            value={salaryDetailsForm.values.isPfEligible}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="pfAccountNo"
                            labelText="PF A/C No"
                            value={salaryDetailsForm.values.pfAccountNo}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.isPfEligible === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="uanNo"
                            labelText="UAN No"
                            value={salaryDetailsForm.values.uanNo}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.isPfEligible === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <RadioInputContainer
                            name="isEsiEligible"
                            labelText="ESI Status"
                            inputContainerClassName="tw-mt-2"
                            radioOptions={[{ id: "true", name: "Eligible" }, { id: "false", name: "Not Eligible" }]}
                            value={salaryDetailsForm.values.isEsiEligible}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInput
                            name="esiAccountNo"
                            labelText="ESI A/C No"
                            value={salaryDetailsForm.values.esiAccountNo}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.isEsiEligible === "false"}
                        />
                    </div>
                    <div className="tw-w-full md:tw-w-4/12 tw-px-2">
                        <TextInputWithRegex
                            name="netTaxBenefitsPa"
                            labelText="Net Tax Benefits (Per Annum)"
                            value={salaryDetailsForm.values.netTaxBenefitsPa}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                            allowedInputRegex="^[0-9]+$"
                        />
                    </div>
                    <div className="tw-w-full tw-px-2">
                        <TextInput
                            name="remarks"
                            labelText="Remarks"
                            value={salaryDetailsForm.values.remarks}
                            onChange={salaryDetailsForm.handleChange}
                            isDisabled={salaryDetailsForm.values.haveSalaryDetails === "false"}
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" value="Submit me" />
                    </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}
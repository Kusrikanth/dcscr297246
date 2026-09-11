import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
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
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import {
    getMasterBanksAct
} from "../../../../../store/masterdata/masterdataactions";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Old Data
// function getInitialState(initialState: any) {
//     return {
//         admissionAcademicYearId: initialState?.admissionAcademicYearId || "1",
//         admissionNo: initialState?.admissionNo || "2432",
//         dateOfAdmission: initialState?.dateOfAdmission || "2023-01-15T09:45:00",
//         studentName: initialState?.studentName || "Student Name",
//         aadharCardNo: initialState?.aadharCardNo || "123456789012",
//         genderId: initialState?.genderId || "1",
//         dob: initialState?.dob || "1980-10-01T09:45:00",
//         emailId: initialState?.emailId || "stesting@gmail.com",
//         contactNo: initialState?.contactNo || "1234567890",
//         birthPlace: initialState?.birthPlace || "Shars",
//         bloodGroupId: initialState?.bloodGroupId || "1",
//     }
// }


function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}


function getInitialState(initialState?: any, haveBankDetails?: any) {
    return {
        id: initialState?.id || undefined,
        haveBankDetails: getTrueFalseOptions(haveBankDetails),
        bankAccountNo: initialState?.bankAccountNo || "",
        bankId: initialState?.bankId || "",
        bankBranchName: initialState?.bankBranchName || "",
        bankBranchAddress: initialState?.bankBranchAddress || "",
        bankIfscCode: initialState?.bankIfscCode || "",
        isDefaultAcc: initialState?.isDefaultAcc || true,
    }
}

export default function BankDetails({ instituteId, branchId }: any) {
    const [bankDetailsState, setBankDetailsState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { masterBanksResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            masterBanksResp: masterData.masterBanksResp
        }), shallowEqual);

    // useEffect(() => {
    //     const payload = { instituteId: 49, pageNo: 0, pageSize: 100 };
    //     dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    //     dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender" })));
    //     dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group" })));
    // }, []);
    useEffect(() => {
        const payload = { pageNo: 0, pageSize: 100 };
        dispatch(getMasterBanksAct(generateActionPayload("get_master_banks", undefined, payload)));
    }, []);


    const bankDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: bankDetailsState,
        onSubmit: (values: any) => {
            const { haveBankDetails, ...formData } = values;
            storeMultiFormData("employeeBankDetails", true, formData);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeBankDetails"))
            submitHanlder();
    }, [currentMultiFormKeys]);

    function submitHanlder() {
        if (bankDetailsForm.values.haveBankDetails === "false") {
            storeMultiFormData("employeeBankDetails", true, null);
        } else {
            bankDetailsForm.handleSubmit();
        }
    }

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeBankDetails } = editEmployeeData,
                { formData } = employeeBankDetails || {};
            if (formData) {
                const haveBankDetails = Object.keys(formData).length > 0;
                setBankDetailsState(getInitialState(formData, haveBankDetails));
            }
        }
    }, [editEmployeeData]);

    function onChangeHaveBankHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        bankDetailsForm.resetForm({
            values: getInitialState(undefined, value)
        });
    }

    return (
        <form onSubmit={bankDetailsForm.handleSubmit}>
            <AccordionHeader tag="span" className="fs-normal" targetId="bank-details">
                Bank Details
            </AccordionHeader>
            <AccordionBody accordionId="bank-details">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12">
                        <RadioInputContainer
                            name="haveBankDetails"
                            labelText="Do You Have Bank Details?"
                            containerClassName="tw-flex tw-items-center"
                            labelClassName="tw-mb-0 tw-mr-3"
                            formgroupClassName="tw-mb-0"
                            radioOptions={trueFalseOptions}
                            value={bankDetailsForm.values.haveBankDetails}
                            onChange={onChangeHaveBankHndlr}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="bankId"
                            labelText="Bank Name"
                            value={bankDetailsForm.values.bankId}
                            onChange={bankDetailsForm.handleChange}
                            onBlur={bankDetailsForm.handleBlur}
                            menuItems={masterBanksResp?.content}
                            valueKey="id"
                            textKey="bankName"
                            isDisabled={bankDetailsForm.values.haveBankDetails === "false"}
                            labelClass={bankDetailsForm.values.haveBankDetails === "true" ? "" : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="bankAccountNo"
                            labelText="Bank A/C No"
                            value={bankDetailsForm.values.bankAccountNo}
                            onChange={bankDetailsForm.handleChange}
                            onBlur={bankDetailsForm.handleBlur}
                            isDisabled={bankDetailsForm.values.haveBankDetails === "false"}
                            maxLength={18}
                            labelClass={bankDetailsForm.values.haveBankDetails === "true" ? "" : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="bankBranchName"
                            labelText="Branch Name"
                            value={bankDetailsForm.values.bankBranchName}
                            onChange={bankDetailsForm.handleChange}
                            onBlur={bankDetailsForm.handleBlur}
                            isDisabled={bankDetailsForm.values.haveBankDetails === "false"}
                            labelClass={bankDetailsForm.values.haveBankDetails === "true" ? "" : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="bankIfscCode"
                            labelText="IFSC Code"
                            value={bankDetailsForm.values.bankIfscCode}
                            onChange={bankDetailsForm.handleChange}
                            onBlur={bankDetailsForm.handleBlur}
                            isDisabled={bankDetailsForm.values.haveBankDetails === "false"}
                            labelClass={bankDetailsForm.values.haveBankDetails === "true" ? "" : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-8">
                        <TextInput
                            name="bankBranchAddress"
                            labelText="Bank Address"
                            value={bankDetailsForm.values.bankBranchAddress}
                            onChange={bankDetailsForm.handleChange}
                            onBlur={bankDetailsForm.handleBlur}
                            isDisabled={bankDetailsForm.values.haveBankDetails === "false"}
                            labelClass={bankDetailsForm.values.haveBankDetails === "true" ? "" : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4 tw-flex tw-items-center">
                        <Switch
                            attributeId="isDefaultAcc"
                            labelName="Mark as default"
                            checked={bankDetailsForm.values.isDefaultAcc}
                            onChangeHndlr={bankDetailsForm.handleChange}
                            isDisabled={bankDetailsForm.values.haveBankDetails === "false"}
                        />

                    </div>

                    {/* <div className="col-12">
                        <input type="submit" />
                    </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}
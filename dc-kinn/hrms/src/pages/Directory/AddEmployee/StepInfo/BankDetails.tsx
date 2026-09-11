import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer
} from "../../../../Components/Common";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "./helper";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({

});

function getEmployeeDetail(studentDetails?: any): any {
    return ({
        id: ""
    })
}



export const BankDetails: React.FC<any> = (props) => {
    const [studentInfoState, setStudentInfoState] = useState<any>(getEmployeeDetail());
    const bankDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: studentInfoState,
        validationSchema,
        onSubmit: (values) => {
        },
    });


    function submitHndlr() {
    }

    return (
        <form id="student-info-form" onSubmit={(e) => e.preventDefault()}>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12">
                    <h5 className="tw-mb-3 tw-inline-block tw-border-b-2 tw-border-blue-500">
                        Employee Basic Details
                    </h5>
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="accountNo"
                        labelText="Bank A/C No"
                        value={bankDetailsForm.values.accountNo}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.accountNo && bankDetailsForm.errors.accountNo) ? true : false}
                        error={(bankDetailsForm.touched.accountNo && bankDetailsForm.errors.accountNo) ? bankDetailsForm.errors.accountNo : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="bankName"
                        labelText="Bank Name"
                        value={bankDetailsForm.values.bankName}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.bankName && bankDetailsForm.errors.bankName) ? true : false}
                        error={(bankDetailsForm.touched.bankName && bankDetailsForm.errors.bankName) ? bankDetailsForm.errors.bankName : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="branchName"
                        labelText="Branch Name"
                        value={bankDetailsForm.values.branchName}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.branchName && bankDetailsForm.errors.branchName) ? true : false}
                        error={(bankDetailsForm.touched.branchName && bankDetailsForm.errors.branchName) ? bankDetailsForm.errors.branchName : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="bankAddress"
                        labelText="Bank Address"
                        value={bankDetailsForm.values.bankAddress}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.bankAddress && bankDetailsForm.errors.bankAddress) ? true : false}
                        error={(bankDetailsForm.touched.bankAddress && bankDetailsForm.errors.bankAddress) ? bankDetailsForm.errors.bankAddress : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="taxCategory"
                        labelText="Tax Category"
                        value={bankDetailsForm.values.taxCategory}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.taxCategory && bankDetailsForm.errors.taxCategory) ? true : false}
                        error={(bankDetailsForm.touched.taxCategory && bankDetailsForm.errors.taxCategory) ? bankDetailsForm.errors.taxCategory : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="basicSalary"
                        labelText="Basic Salary"
                        value={bankDetailsForm.values.basicSalary}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.basicSalary && bankDetailsForm.errors.basicSalary) ? true : false}
                        error={(bankDetailsForm.touched.basicSalary && bankDetailsForm.errors.basicSalary) ? bankDetailsForm.errors.basicSalary : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="salaryCategory"
                        labelText="Salary Category"
                        value={bankDetailsForm.values.salaryCategory}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.salaryCategory && bankDetailsForm.errors.salaryCategory) ? true : false}
                        error={(bankDetailsForm.touched.salaryCategory && bankDetailsForm.errors.salaryCategory) ? bankDetailsForm.errors.salaryCategory : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="grossSalary"
                        labelText="Gross Salary"
                        value={bankDetailsForm.values.grossSalary}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.grossSalary && bankDetailsForm.errors.grossSalary) ? true : false}
                        error={(bankDetailsForm.touched.grossSalary && bankDetailsForm.errors.grossSalary) ? bankDetailsForm.errors.grossSalary : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="panCardNo"
                        labelText="PAN Card No"
                        value={bankDetailsForm.values.panCardNo}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.panCardNo && bankDetailsForm.errors.panCardNo) ? true : false}
                        error={(bankDetailsForm.touched.panCardNo && bankDetailsForm.errors.panCardNo) ? bankDetailsForm.errors.panCardNo : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="pfStatus"
                        labelText="PF Status"
                        value={bankDetailsForm.values.pfStatus}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.pfStatus && bankDetailsForm.errors.pfStatus) ? true : false}
                        error={(bankDetailsForm.touched.pfStatus && bankDetailsForm.errors.pfStatus) ? bankDetailsForm.errors.pfStatus : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="pfAccountNo"
                        labelText="PF A/C No"
                        value={bankDetailsForm.values.pfAccountNo}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.pfAccountNo && bankDetailsForm.errors.pfAccountNo) ? true : false}
                        error={(bankDetailsForm.touched.pfAccountNo && bankDetailsForm.errors.pfAccountNo) ? bankDetailsForm.errors.pfAccountNo : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="esiStatus"
                        labelText="ESI Status"
                        value={bankDetailsForm.values.esiStatus}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.esiStatus && bankDetailsForm.errors.esiStatus) ? true : false}
                        error={(bankDetailsForm.touched.esiStatus && bankDetailsForm.errors.esiStatus) ? bankDetailsForm.errors.esiStatus : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="esiAccountNo"
                        labelText="ESI A/C No"
                        value={bankDetailsForm.values.esiAccountNo}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.esiAccountNo && bankDetailsForm.errors.esiAccountNo) ? true : false}
                        error={(bankDetailsForm.touched.esiAccountNo && bankDetailsForm.errors.esiAccountNo) ? bankDetailsForm.errors.esiAccountNo : ""}
                        isReadOnly={true}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="taxBenefits"
                        labelText="Net Tax Benefits (Per Annum)"
                        value={bankDetailsForm.values.taxBenefits}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.taxBenefits && bankDetailsForm.errors.taxBenefits) ? true : false}
                        error={(bankDetailsForm.touched.taxBenefits && bankDetailsForm.errors.taxBenefits) ? bankDetailsForm.errors.taxBenefits : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="uanNo"
                        labelText="UAN No"
                        value={bankDetailsForm.values.uanNo}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.uanNo && bankDetailsForm.errors.uanNo) ? true : false}
                        error={(bankDetailsForm.touched.uanNo && bankDetailsForm.errors.uanNo) ? bankDetailsForm.errors.uanNo : ""}
                    />
                </div>

                <div className="tw-col-span-12">
                    <TextInput
                        name="remarks"
                        labelText="Remarks"
                        value={bankDetailsForm.values.remarks}
                        onChange={bankDetailsForm.handleChange}
                        invalid={(bankDetailsForm.touched.remarks && bankDetailsForm.errors.remarks) ? true : false}
                        error={(bankDetailsForm.touched.remarks && bankDetailsForm.errors.remarks) ? bankDetailsForm.errors.remarks : ""}
                    />
                </div>

                <div className="tw-col-span-12 tw-text-right tw-mt-2">
                    <Button
                        type="submit"
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={submitHndlr}
                        variant="primary"
                    >
                        Proceed
                    </Button>
                </div>
            </div>
        </form>
    )
}
import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, UploadImage
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



export const SalaryDetails: React.FC<any> = (props) => {
    const [studentInfoState, setStudentInfoState] = useState<any>(getEmployeeDetail());
    const basicDetailsForm = useFormik({
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
            <div className="tw-flex tw-flex-wrap">
                <div className="tw-w-full tw-mb-3">
                    <div className="tw-border-b">
                        <span className="tw-text-base tw-font-bold tw-block tw-mb-2">3. Payroll Details</span>
                    </div>
                </div>
            </div>
            <UncontrolledAccordion open="current-job" defaultOpen={["current-job", "designation-details",
                "identification", "past-education", "medical-info"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="current-job">
                        Bank Details
                    </AccordionHeader>
                    <AccordionBody accordionId="current-job">
                        <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                            <div>
                                <TextInput
                                    name="bankAcNo"
                                    labelText="Bank A/C No"
                                    value={basicDetailsForm.values.bankAcNo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.bankAcNo && basicDetailsForm.errors.bankAcNo) ? true : false}
                                    error={(basicDetailsForm.touched.bankAcNo && basicDetailsForm.errors.bankAcNo) ? basicDetailsForm.errors.bankAcNo : ""}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="bankName"
                                    labelText="Bank Name"
                                    value={basicDetailsForm.values.bankName}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.bankName && basicDetailsForm.errors.bankName) ? true : false}
                                    error={(basicDetailsForm.touched.bankName && basicDetailsForm.errors.bankName) ? basicDetailsForm.errors.bankName : ""}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="branchName"
                                    labelText="Branch Name"
                                    value={basicDetailsForm.values.branchName}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.branchName && basicDetailsForm.errors.branchName) ? true : false}
                                    error={(basicDetailsForm.touched.branchName && basicDetailsForm.errors.branchName) ? basicDetailsForm.errors.branchName : ""}
                                />
                            </div>
                            <div className="tw-col-span-3">
                                <TextInput
                                    name="bankAddress"
                                    labelText="Bank Address"
                                    value={basicDetailsForm.values.bankAddress}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.bankAddress && basicDetailsForm.errors.bankAddress) ? true : false}
                                    error={(basicDetailsForm.touched.bankAddress && basicDetailsForm.errors.bankAddress) ? basicDetailsForm.errors.bankAddress : ""}
                                />
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="designation-details">
                        Salary Details
                    </AccordionHeader>
                    <AccordionBody accordionId="designation-details">
                        <div className="tw-grid tw-grid-cols-3 tw-gap-4">
                            <div>
                                <SelectInput
                                    name="taxCategory"
                                    labelText="Tax Category"
                                    value={basicDetailsForm.values.taxCategory}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.taxCategory && basicDetailsForm.errors.taxCategory) ? true : false}
                                    error={(basicDetailsForm.touched.taxCategory && basicDetailsForm.errors.taxCategory) ? basicDetailsForm.errors.taxCategory : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="amountType"
                                    labelText="Amount Type"
                                    value={basicDetailsForm.values.amountType}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.amountType && basicDetailsForm.errors.amountType) ? true : false}
                                    error={(basicDetailsForm.touched.amountType && basicDetailsForm.errors.amountType) ? basicDetailsForm.errors.amountType : ""}
                                />
                            </div>
                            <div>
                                <SelectInput
                                    name="salaryCategory"
                                    labelText="Salary Category"
                                    value={basicDetailsForm.values.salaryCategory}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.salaryCategory && basicDetailsForm.errors.salaryCategory) ? true : false}
                                    error={(basicDetailsForm.touched.salaryCategory && basicDetailsForm.errors.salaryCategory) ? basicDetailsForm.errors.salaryCategory : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="basicSalary"
                                    labelText="Basic Salary"
                                    value={basicDetailsForm.values.basicSalary}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.basicSalary && basicDetailsForm.errors.basicSalary) ? true : false}
                                    error={(basicDetailsForm.touched.basicSalary && basicDetailsForm.errors.basicSalary) ? basicDetailsForm.errors.basicSalary : ""}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="grossSalary"
                                    labelText="Gross Salary"
                                    value={basicDetailsForm.values.grossSalary}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.grossSalary && basicDetailsForm.errors.grossSalary) ? true : false}
                                    error={(basicDetailsForm.touched.grossSalary && basicDetailsForm.errors.grossSalary) ? basicDetailsForm.errors.grossSalary : ""}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="panCardNo"
                                    labelText="PAN Card No"
                                    value={basicDetailsForm.values.panCardNo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.panCardNo && basicDetailsForm.errors.panCardNo) ? true : false}
                                    error={(basicDetailsForm.touched.panCardNo && basicDetailsForm.errors.panCardNo) ? basicDetailsForm.errors.panCardNo : ""}
                                />
                            </div>
                            <div>
                                <RadioInputContainer
                                    name="pfStatus"
                                    labelText="PF Status"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={[{ id: "yes", name: "Eligible" }, { id: "no", name: "Not Eligible" }]}
                                    value={basicDetailsForm.values.pfStatus}
                                    onChange={basicDetailsForm.handleChange}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="pfAcNo"
                                    labelText="PF A/C No"
                                    value={basicDetailsForm.values.pfAcNo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.pfAcNo && basicDetailsForm.errors.pfAcNo) ? true : false}
                                    error={(basicDetailsForm.touched.pfAcNo && basicDetailsForm.errors.pfAcNo) ? basicDetailsForm.errors.pfAcNo : ""}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="uanNo"
                                    labelText="UAN No"
                                    value={basicDetailsForm.values.uanNo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.uanNo && basicDetailsForm.errors.uanNo) ? true : false}
                                    error={(basicDetailsForm.touched.uanNo && basicDetailsForm.errors.uanNo) ? basicDetailsForm.errors.uanNo : ""}
                                />
                            </div>
                            <div>
                                <RadioInputContainer
                                    name="esiStatus"
                                    labelText="ESI Status"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={[{ id: "yes", name: "Eligible" }, { id: "no", name: "Not Eligible" }]}
                                    value={basicDetailsForm.values.esiStatus}
                                    onChange={basicDetailsForm.handleChange}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="esiAcNo"
                                    labelText="ESI A/C No"
                                    value={basicDetailsForm.values.esiAcNo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.esiAcNo && basicDetailsForm.errors.esiAcNo) ? true : false}
                                    error={(basicDetailsForm.touched.esiAcNo && basicDetailsForm.errors.esiAcNo) ? basicDetailsForm.errors.esiAcNo : ""}
                                />
                            </div>
                            <div>
                                <TextInput
                                    name="netTaxBenefits"
                                    labelText="Net Tax Benefits (Per Annum)"
                                    value={basicDetailsForm.values.netTaxBenefits}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.netTaxBenefits && basicDetailsForm.errors.netTaxBenefits) ? true : false}
                                    error={(basicDetailsForm.touched.netTaxBenefits && basicDetailsForm.errors.netTaxBenefits) ? basicDetailsForm.errors.netTaxBenefits : ""}
                                />
                            </div>
                            <div className="tw-col-span-3">
                                <TextInput
                                    name="remarks"
                                    labelText="Remarks"
                                    value={basicDetailsForm.values.remarks}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.remarks && basicDetailsForm.errors.remarks) ? true : false}
                                    error={(basicDetailsForm.touched.remarks && basicDetailsForm.errors.remarks) ? basicDetailsForm.errors.remarks : ""}
                                />
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="tw-grid tw-grid-cols-1">
                <div className="tw-col-span-1 tw-text-right tw-mt-2">
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
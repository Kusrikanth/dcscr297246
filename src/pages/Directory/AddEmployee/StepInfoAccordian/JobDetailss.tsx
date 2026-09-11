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



export const JobDetails: React.FC<any> = (props) => {
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
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-mb-3">
                    <div className="tw-border-b">
                        <span className="tw-text-base tw-font-bold tw-block tw-mb-2">
                            2. Job Details
                        </span>
                    </div>
                </div>
            </div>
            <UncontrolledAccordion open="current-job" defaultOpen={["current-job", "designation-details",
                "identification", "past-education", "medical-info"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="current-job">
                        Current Job
                    </AccordionHeader>
                    <AccordionBody accordionId="current-job">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-4">
                                <TextInput
                                    name="biometricID"
                                    labelText="Biometric ID"
                                    value={basicDetailsForm.values.biometricID}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.biometricID && basicDetailsForm.errors.biometricID ? true : false}
                                    error={basicDetailsForm.touched.biometricID && basicDetailsForm.errors.biometricID ? basicDetailsForm.errors.biometricID : ""}
                                    isReadOnly={true}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="campusType"
                                    labelText="Campus Type"
                                    value={basicDetailsForm.values.campusType}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.campusType && basicDetailsForm.errors.campusType ? true : false}
                                    error={basicDetailsForm.touched.campusType && basicDetailsForm.errors.campusType ? basicDetailsForm.errors.campusType : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <TextIconInput
                                    name="emailId"
                                    labelText="Work Email"
                                    value={basicDetailsForm.values.emailId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.emailId && basicDetailsForm.errors.emailId ? true : false}
                                    error={basicDetailsForm.touched.emailId && basicDetailsForm.errors.emailId ? basicDetailsForm.errors.emailId : ""}
                                >
                                    <i className="ri-mail-unread-line"></i>
                                </TextIconInput>
                            </div>

                            <div className="tw-col-span-4">
                                <PhoneInput
                                    name="workPhoneNo"
                                    labelText="Work Phone no"
                                    value={basicDetailsForm.values.workPhoneNo}
                                    onChange={() => { }}
                                    invalid={basicDetailsForm.touched.workPhoneNo && basicDetailsForm.errors.workPhoneNo ? true : false}
                                    error={basicDetailsForm.touched.workPhoneNo && basicDetailsForm.errors.workPhoneNo ? basicDetailsForm.errors.workPhoneNo : ""}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <TextInput
                                    name="workLocation"
                                    labelText="Work Location"
                                    value={basicDetailsForm.values.workLocation}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.workLocation && basicDetailsForm.errors.workLocation ? true : false}
                                    error={basicDetailsForm.touched.workLocation && basicDetailsForm.errors.workLocation ? basicDetailsForm.errors.workLocation : ""}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="employeeType"
                                    labelText="Employee Type"
                                    value={basicDetailsForm.values.employeeType}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.employeeType && basicDetailsForm.errors.employeeType ? true : false}
                                    error={basicDetailsForm.touched.employeeType && basicDetailsForm.errors.employeeType ? basicDetailsForm.errors.employeeType : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="department"
                                    labelText="Department"
                                    value={basicDetailsForm.values.department}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.department && basicDetailsForm.errors.department ? true : false}
                                    error={basicDetailsForm.touched.department && basicDetailsForm.errors.department ? basicDetailsForm.errors.department : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <DateInput
                                    name="confirmationDate"
                                    labelText="Confirmation Date"
                                    value={basicDetailsForm.values.confirmationDate}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.confirmationDate && basicDetailsForm.errors.confirmationDate ? true : false}
                                    error={basicDetailsForm.touched.confirmationDate && basicDetailsForm.errors.confirmationDate ? basicDetailsForm.errors.confirmationDate : ""}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="sourceOfHire"
                                    labelText="Source of Hire"
                                    value={basicDetailsForm.values.sourceOfHire}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.sourceOfHire && basicDetailsForm.errors.sourceOfHire ? true : false}
                                    error={basicDetailsForm.touched.sourceOfHire && basicDetailsForm.errors.sourceOfHire ? basicDetailsForm.errors.sourceOfHire : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="employmentStatus"
                                    labelText="Employment Status"
                                    value={basicDetailsForm.values.employmentStatus}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.employmentStatus && basicDetailsForm.errors.employmentStatus ? true : false}
                                    error={basicDetailsForm.touched.employmentStatus && basicDetailsForm.errors.employmentStatus ? basicDetailsForm.errors.employmentStatus : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <TextInput
                                    name="dpsExprience"
                                    labelText="DPS Experience"
                                    value={basicDetailsForm.values.dpsExprience}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.dpsExprience && basicDetailsForm.errors.dpsExprience ? true : false}
                                    error={basicDetailsForm.touched.dpsExprience && basicDetailsForm.errors.dpsExprience ? basicDetailsForm.errors.dpsExprience : ""}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="isTransferred"
                                    labelText="Is Transfered"
                                    value={basicDetailsForm.values.isTransferred}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.isTransferred && basicDetailsForm.errors.isTransferred ? true : false}
                                    error={basicDetailsForm.touched.isTransferred && basicDetailsForm.errors.isTransferred ? basicDetailsForm.errors.isTransferred : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="designation-details">
                        Designation Details
                    </AccordionHeader>
                    <AccordionBody accordionId="designation-details">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="postDesignation"
                                    labelText="Post / Designation"
                                    value={basicDetailsForm.values.postDesignation}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.postDesignation && basicDetailsForm.errors.postDesignation ? true : false}
                                    error={basicDetailsForm.touched.postDesignation && basicDetailsForm.errors.postDesignation ? basicDetailsForm.errors.postDesignation : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="reportingTo"
                                    labelText="Reporting To"
                                    value={basicDetailsForm.values.reportingTo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.reportingTo && basicDetailsForm.errors.reportingTo ? true : false}
                                    error={basicDetailsForm.touched.reportingTo && basicDetailsForm.errors.reportingTo ? basicDetailsForm.errors.reportingTo : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <RadioInputContainer
                                    name="isReportingHead"
                                    labelText="Is Reporting Head?"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={[{ id: "yes", name: "Yes" }, { id: "no", name: "No" }]}
                                    value={basicDetailsForm.values.isReportingHead}
                                    onChange={basicDetailsForm.handleChange}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="employeeCategory"
                                    labelText="Employee Category"
                                    value={basicDetailsForm.values.employeeCategory}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.employeeCategory && basicDetailsForm.errors.employeeCategory ? true : false}
                                    error={basicDetailsForm.touched.employeeCategory && basicDetailsForm.errors.employeeCategory ? basicDetailsForm.errors.employeeCategory : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="reportingClassDivision"
                                    labelText="Reporting Class Division"
                                    value={basicDetailsForm.values.reportingClassDivision}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.reportingClassDivision && basicDetailsForm.errors.reportingClassDivision ? true : false}
                                    error={basicDetailsForm.touched.reportingClassDivision && basicDetailsForm.errors.reportingClassDivision ? basicDetailsForm.errors.reportingClassDivision : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <RadioInputContainer
                                    name="isHod"
                                    labelText="Is HOD?"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={[{ id: "yes", name: "Yes" }, { id: "no", name: "No" }]}
                                    value={basicDetailsForm.values.isHod}
                                    onChange={basicDetailsForm.handleChange}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="hod"
                                    labelText="HOD"
                                    value={basicDetailsForm.values.hod}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.hod && basicDetailsForm.errors.hod ? true : false}
                                    error={basicDetailsForm.touched.hod && basicDetailsForm.errors.hod ? basicDetailsForm.errors.hod : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <RadioInputContainer
                                    name="isClassCoordinator"
                                    labelText="Is Class Coordinator?"
                                    inputContainerClassName="tw-mt-2"
                                    radioOptions={[{ id: "yes", name: "Yes" }, { id: "no", name: "No" }]}
                                    value={basicDetailsForm.values.isClassCoordinator}
                                    onChange={basicDetailsForm.handleChange}
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <SelectInput
                                    name="classCoordinator"
                                    labelText="Class Coordinator"
                                    value={basicDetailsForm.values.classCoordinator}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.classCoordinator && basicDetailsForm.errors.classCoordinator ? true : false}
                                    error={basicDetailsForm.touched.classCoordinator && basicDetailsForm.errors.classCoordinator ? basicDetailsForm.errors.classCoordinator : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="previous-experience">
                        Previous Experience
                    </AccordionHeader>
                    <AccordionBody accordionId="previous-experience">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-4">
                                <TextInput
                                    name="organizationName"
                                    labelText="Organisation Name"
                                    value={basicDetailsForm.values.organizationName}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.organizationName && basicDetailsForm.errors.organizationName ? true : false}
                                    error={basicDetailsForm.touched.organizationName && basicDetailsForm.errors.organizationName ? basicDetailsForm.errors.organizationName : ""}
                                />
                            </div>

                            <div className="tw-col-span-2">
                                <SelectInput
                                    name="designation"
                                    labelText="Designation"
                                    value={basicDetailsForm.values.designation}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.designation && basicDetailsForm.errors.designation ? true : false}
                                    error={basicDetailsForm.touched.designation && basicDetailsForm.errors.designation ? basicDetailsForm.errors.designation : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-4">
                                <TextInput
                                    name="dateRange"
                                    labelText="Date Range"
                                    placeHolder=""
                                    value={basicDetailsForm.values.dateRange}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.dateRange && basicDetailsForm.errors.dateRange ? true : false}
                                    error={basicDetailsForm.touched.dateRange && basicDetailsForm.errors.dateRange ? basicDetailsForm.errors.dateRange : ""}
                                />
                            </div>

                            <div className="tw-col-span-2">
                                <TextInput
                                    name="yearExp"
                                    labelText="Year Experience"
                                    placeHolder=""
                                    value={basicDetailsForm.values.yearExp}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={basicDetailsForm.touched.yearExp && basicDetailsForm.errors.yearExp ? true : false}
                                    error={basicDetailsForm.touched.yearExp && basicDetailsForm.errors.yearExp ? basicDetailsForm.errors.yearExp : ""}
                                />
                            </div>

                            <div className="tw-col-span-12">
                                <Button variant="primary">
                                    Add New
                                </Button>
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-text-end tw-mt-2">
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
                        Next
                    </Button>
                </div>
            </div>
        </form>
    )
}
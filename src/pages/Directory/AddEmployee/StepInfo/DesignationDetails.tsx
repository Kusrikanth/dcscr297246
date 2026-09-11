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



export const DesignationDetails: React.FC<any> = (props) => {
    const [studentInfoState, setStudentInfoState] = useState<any>(getEmployeeDetail());
    const designationForm = useFormik({
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
                        Designation Details
                    </h5>
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="postDesignation"
                        labelText="Post/Designation"
                        value={designationForm.values.postDesignation}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.postDesignation && designationForm.errors.postDesignation) ? true : false}
                        error={(designationForm.touched.postDesignation && designationForm.errors.postDesignation) ? designationForm.errors.postDesignation : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="employeeStatus"
                        labelText="Employee Status"
                        value={designationForm.values.employeeStatus}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.employeeStatus && designationForm.errors.employeeStatus) ? true : false}
                        error={(designationForm.touched.employeeStatus && designationForm.errors.employeeStatus) ? designationForm.errors.employeeStatus : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="department"
                        labelText="Department"
                        value={designationForm.values.department}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.department && designationForm.errors.department) ? true : false}
                        error={(designationForm.touched.department && designationForm.errors.department) ? designationForm.errors.department : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="reportingHead"
                        labelText="Reporting Head"
                        value={designationForm.values.reportingHead}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.reportingHead && designationForm.errors.reportingHead) ? true : false}
                        error={(designationForm.touched.reportingHead && designationForm.errors.reportingHead) ? designationForm.errors.reportingHead : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="employeeCategory"
                        labelText="Employee Category"
                        value={designationForm.values.employeeCategory}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.employeeCategory && designationForm.errors.employeeCategory) ? true : false}
                        error={(designationForm.touched.employeeCategory && designationForm.errors.employeeCategory) ? designationForm.errors.employeeCategory : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="employeeType"
                        labelText="Employee Type"
                        value={designationForm.values.employeeType}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.employeeType && designationForm.errors.employeeType) ? true : false}
                        error={(designationForm.touched.employeeType && designationForm.errors.employeeType) ? designationForm.errors.employeeType : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="isReportingHead"
                        labelText="Is Reporting Head?"
                        value={designationForm.values.isReportingHead}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.isReportingHead && designationForm.errors.isReportingHead) ? true : false}
                        error={(designationForm.touched.isReportingHead && designationForm.errors.isReportingHead) ? designationForm.errors.isReportingHead : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <RadioInputContainer
                        name="isHod"
                        labelText="Is HOD?"
                        inputContainerClassName="tw-mt-2"
                        radioOptions={[{ id: "yes", name: "Yes" }, { id: "no", name: "No" }]}
                        value={designationForm.values.isHod}
                        onChange={designationForm.handleChange}
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="isClassCoordinator "
                        labelText="Is Class Coordinator?"
                        value={designationForm.values.isClassCoordinator}
                        onChange={designationForm.handleChange}
                        invalid={(designationForm.touched.isClassCoordinator && designationForm.errors.isClassCoordinator) ? true : false}
                        error={(designationForm.touched.isClassCoordinator && designationForm.errors.isClassCoordinator) ? designationForm.errors.isClassCoordinator : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-12 tw-text-right tw-mt-2">
                    <Button
                        variant="secondary"
                        type="submit"
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
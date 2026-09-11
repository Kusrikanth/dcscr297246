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



export const BasicDetails: React.FC<any> = (props) => {
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
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12">
                    <h5 className="tw-mb-3 tw-inline-block tw-border-b-2 tw-border-blue-500">
                        Employee Basic Details</h5>
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="employeeName"
                        labelText="Employee Name"
                        value={basicDetailsForm.values.employeeName}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.employeeName && basicDetailsForm.errors.employeeName) ? true : false}
                        error={(basicDetailsForm.touched.employeeName && basicDetailsForm.errors.employeeName) ? basicDetailsForm.errors.employeeName : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="displayName"
                        labelText="Display Name"
                        value={basicDetailsForm.values.displayName}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.displayName && basicDetailsForm.errors.displayName) ? true : false}
                        error={(basicDetailsForm.touched.displayName && basicDetailsForm.errors.displayName) ? basicDetailsForm.errors.displayName : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        <div className="tw-col-span-8">
                            <DateInput
                                name="dateOfBirth"
                                labelText="Date Of Birth"
                                value={basicDetailsForm.values.dateOfBirth}
                                onChange={basicDetailsForm.handleChange}
                                invalid={(basicDetailsForm.touched.dateOfBirth && basicDetailsForm.errors.dateOfBirth) ? true : false}
                                error={(basicDetailsForm.touched.dateOfBirth && basicDetailsForm.errors.dateOfBirth) ? basicDetailsForm.errors.dateOfBirth : ""}
                            />
                        </div>
                        <div className="tw-col-span-4">
                            <TextInput
                                name="age"
                                labelText="Age"
                                value={basicDetailsForm.values.age}
                                onChange={basicDetailsForm.handleChange}
                                isDisabled={true}
                                invalid={(basicDetailsForm.touched.age && basicDetailsForm.errors.age) ? true : false}
                                error={(basicDetailsForm.touched.age && basicDetailsForm.errors.age) ? basicDetailsForm.errors.age : ""}
                            />
                        </div>
                    </div>
                </div>

                <div className="tw-col-span-4">
                    <TextInput name="placeOfBirth" labelText="Place of Birth"
                        value={basicDetailsForm.values.placeOfBirth}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.placeOfBirth && basicDetailsForm.errors.placeOfBirth) ? true : false}
                        error={(basicDetailsForm.touched.placeOfBirth && basicDetailsForm.errors.placeOfBirth) ? basicDetailsForm.errors.placeOfBirth : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextIconInput name="instEmailId" labelText="Institute Email-Id"
                        value={basicDetailsForm.values.instEmailId}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.instEmailId && basicDetailsForm.errors.instEmailId) ? true : false}
                        error={(basicDetailsForm.touched.instEmailId && basicDetailsForm.errors.instEmailId) ? basicDetailsForm.errors.instEmailId : ""}
                    >
                        <i className="ri-mail-unread-line"></i>
                    </TextIconInput>
                </div>

                <div className="tw-col-span-4">
                    <TextInput name="address" labelText="Address"
                        value={basicDetailsForm.values.address}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.address && basicDetailsForm.errors.address) ? true : false}
                        error={(basicDetailsForm.touched.address && basicDetailsForm.errors.address) ? basicDetailsForm.errors.address : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <SelectInput
                        name="gender"
                        labelText="Gender"
                        value={basicDetailsForm.values.gender}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.gender && basicDetailsForm.errors.gender) ? true : false}
                        error={(basicDetailsForm.touched.gender && basicDetailsForm.errors.gender) ? basicDetailsForm.errors.gender : ""}
                        menuItems={genderOptions}
                        valueKey="id"
                        defaultValue="Gender"
                        textKey="name"
                    />
                </div>
                <div className="tw-col-span-4">
                    <SelectInput
                        name="nationality"
                        labelText="Nationality"
                        value={basicDetailsForm.values.nationality}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.nationality && basicDetailsForm.errors.nationality) ? true : false}
                        error={(basicDetailsForm.touched.nationality && basicDetailsForm.errors.nationality) ? basicDetailsForm.errors.nationality : ""}
                        menuItems={[]}
                        defaultSelect="Nationality"
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <SelectInput
                        name="religion"
                        labelText="Religion"
                        value={basicDetailsForm.values.religion}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.religion && basicDetailsForm.errors.religion) ? true : false}
                        error={(basicDetailsForm.touched.religion && basicDetailsForm.errors.religion) ? basicDetailsForm.errors.religion : ""}
                        menuItems={[]}
                        defaultSelect="Religion"
                        valueKey="id"
                        textKey="name"
                    />
                </div>
                <div className="tw-col-span-4">
                    <SelectInput
                        name="caste"
                        labelText="Caste"
                        value={basicDetailsForm.values.caste}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.caste && basicDetailsForm.errors.caste) ? true : false}
                        error={(basicDetailsForm.touched.caste && basicDetailsForm.errors.caste) ? basicDetailsForm.errors.caste : ""}
                        menuItems={[]}
                        // defaultSelect="Caste"
                        valueKey="id"
                        textKey="name"
                    />
                </div>
                <div className="tw-col-span-4">
                    <SelectInput
                        name="maritalStatus"
                        labelText="Marital Status"
                        value={basicDetailsForm.values.maritalStatus}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.maritalStatus && basicDetailsForm.errors.maritalStatus) ? true : false}
                        error={(basicDetailsForm.touched.maritalStatus && basicDetailsForm.errors.maritalStatus) ? basicDetailsForm.errors.maritalStatus : ""}
                        menuItems={[]}
                        // defaultSelect="Caste"
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-col-span-4">
                    <DateInput name="dateOfJoining" labelText="Date Of Joining"
                        value={basicDetailsForm.values.dateOfJoining}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.dateOfJoining && basicDetailsForm.errors.dateOfJoining) ? true : false}
                        error={(basicDetailsForm.touched.dateOfJoining && basicDetailsForm.errors.dateOfJoining) ? basicDetailsForm.errors.dateOfJoining : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <DateInput name="confirmationDate" labelText="Confirmation Date"
                        value={basicDetailsForm.values.confirmationDate}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.confirmationDate && basicDetailsForm.errors.confirmationDate) ? true : false}
                        error={(basicDetailsForm.touched.confirmationDate && basicDetailsForm.errors.confirmationDate) ? basicDetailsForm.errors.confirmationDate : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <SelectInput
                        name="confirmationStatus"
                        labelText="Confirmation Status"
                        value={basicDetailsForm.values.confirmationStatus}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.confirmationStatus && basicDetailsForm.errors.confirmationStatus) ? true : false}
                        error={(basicDetailsForm.touched.confirmationStatus && basicDetailsForm.errors.confirmationStatus) ? basicDetailsForm.errors.confirmationStatus : ""}
                        menuItems={[]}
                        // defaultSelect="Caste"
                        valueKey="id"
                        textKey="name"
                    />
                </div>
                <div className="tw-col-span-4">
                    <TextIconInput
                        name="emailId"
                        labelText="Email-Id"
                        value={basicDetailsForm.values.emailId}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.emailId && basicDetailsForm.errors.emailId) ? true : false}
                        error={(basicDetailsForm.touched.emailId && basicDetailsForm.errors.emailId) ? basicDetailsForm.errors.emailId : ""}
                    ><i className="ri-mail-unread-line"></i></TextIconInput>
                </div>
                <div className="tw-col-span-4">
                    <TextInput
                        name="aadharNo"
                        labelText="Aadhar No"
                        value={basicDetailsForm.values.aadharNo}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.aadharNo && basicDetailsForm.errors.aadharNo) ? true : false}
                        error={(basicDetailsForm.touched.aadharNo && basicDetailsForm.errors.aadharNo) ? basicDetailsForm.errors.aadharNo : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <TextInput
                        name="landNo"
                        labelText="Land No"
                        value={basicDetailsForm.values.landNo}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.landNo && basicDetailsForm.errors.landNo) ? true : false}
                        error={(basicDetailsForm.touched.landNo && basicDetailsForm.errors.landNo) ? basicDetailsForm.errors.landNo : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <SelectInput
                        name="motherTongue"
                        labelText="Mother Tongue"
                        value={basicDetailsForm.values.motherTongue}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.motherTongue && basicDetailsForm.errors.motherTongue) ? true : false}
                        error={(basicDetailsForm.touched.motherTongue && basicDetailsForm.errors.motherTongue) ? basicDetailsForm.errors.motherTongue : ""}
                        menuItems={[]}
                        valueKey="id"
                        textKey="name"
                    />
                </div>
                <div className="tw-col-span-4">
                    <SelectInput
                        name="bloddGroup"
                        labelText="Blood Group"
                        value={basicDetailsForm.values.bloddGroup}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.bloddGroup && basicDetailsForm.errors.bloddGroup) ? true : false}
                        error={(basicDetailsForm.touched.bloddGroup && basicDetailsForm.errors.bloddGroup) ? basicDetailsForm.errors.bloddGroup : ""}
                        menuItems={[]}
                        valueKey="id"
                        textKey="name"
                    />
                </div>
                <div className="tw-col-span-4">
                    <TextInput
                        name="identificationMarks1"
                        labelText="Identification Mark 1"
                        value={basicDetailsForm.values.identificationMarks1}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.identificationMarks1 && basicDetailsForm.errors.identificationMarks1) ? true : false}
                        error={(basicDetailsForm.touched.identificationMarks1 && basicDetailsForm.errors.identificationMarks1) ? basicDetailsForm.errors.identificationMarks1 : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <TextInput
                        name="identificationMarks2"
                        labelText="Identification Mark 2"
                        value={basicDetailsForm.values.identificationMarks2}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.identificationMarks2 && basicDetailsForm.errors.identificationMarks2) ? true : false}
                        error={(basicDetailsForm.touched.identificationMarks2 && basicDetailsForm.errors.identificationMarks2) ? basicDetailsForm.errors.identificationMarks2 : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <TextInput
                        name="dpsExperience"
                        labelText="DPS Experience"
                        value={basicDetailsForm.values.dpsExperience}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.dpsExperience && basicDetailsForm.errors.dpsExperience) ? true : false}
                        error={(basicDetailsForm.touched.dpsExperience && basicDetailsForm.errors.dpsExperience) ? basicDetailsForm.errors.dpsExperience : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="previousExperience"
                        labelText="Previous Experience"
                        value={basicDetailsForm.values.previousExperience}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.previousExperience && basicDetailsForm.errors.previousExperience) ? true : false}
                        error={(basicDetailsForm.touched.previousExperience && basicDetailsForm.errors.previousExperience) ? basicDetailsForm.errors.previousExperience : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <TextInput
                        name="previousExperience"
                        labelText="Previous Experience"
                        value={basicDetailsForm.values.previousExperience}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.previousExperience && basicDetailsForm.errors.previousExperience) ? true : false}
                        error={(basicDetailsForm.touched.previousExperience && basicDetailsForm.errors.previousExperience) ? basicDetailsForm.errors.previousExperience : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <TextInput
                        name="qualification"
                        labelText="Qualification"
                        value={basicDetailsForm.values.qualification}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.qualification && basicDetailsForm.errors.qualification) ? true : false}
                        error={(basicDetailsForm.touched.qualification && basicDetailsForm.errors.qualification) ? basicDetailsForm.errors.qualification : ""}
                    />
                </div>
                <div className="tw-col-span-4">
                    <TextInput
                        name="ctet"
                        labelText="CTET/TET"
                        value={basicDetailsForm.values.ctet}
                        onChange={basicDetailsForm.handleChange}
                        invalid={(basicDetailsForm.touched.ctet && basicDetailsForm.errors.ctet) ? true : false}
                        error={(basicDetailsForm.touched.ctet && basicDetailsForm.errors.ctet) ? basicDetailsForm.errors.ctet : ""}
                    />
                </div>

                <div className="tw-col-span-4">
                    <RadioInputContainer
                        name="isTransferred"
                        labelText="Is Transferred ?"
                        inputContainerClassName="tw-mt-2"
                        radioOptions={[{ id: "yes", name: "Yes" }, { id: "no", name: "No" }]}
                        value={basicDetailsForm.values.isTransferred}
                        onChange={basicDetailsForm.handleChange}
                    />
                </div>

                <div className="tw-col-span-12 tw-text-right tw-mt-2">
                    <Button type="submit"
                        variant="secondary">
                        Cancel
                    </Button>
                    <Button onClick={submitHndlr}
                        variant="primary">
                        Proceed
                    </Button>
                </div>
            </div>
        </form>
    )
}
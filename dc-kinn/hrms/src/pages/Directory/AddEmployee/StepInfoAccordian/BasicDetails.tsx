import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import StudentImgIcon from "../../../../assets/imagesdps/directory/user-img.png";

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

function getInitialState(initialState?: any) {
    return {
        employeeName: initialState?.employeeName || "",
        dob: initialState?.dob || "",
        genderId: initialState?.genderId || "",
        nationalityId: initialState?.nationalityId || "",
        religionId: initialState?.religionId || "",
        casteId: initialState?.casteId || "",
        maritalStatusId: initialState?.maritalStatusId || "",
        personalEmailId: initialState?.personalEmailId || "",
        aadharNo: initialState?.aadharNo || "",
        contactNo: initialState?.contactNo || "",
        bloodGroupId: initialState?.bloodGroupId || "",
        identificationMark1: initialState?.identificationMark1 || "",
        identificationMark2: initialState?.identificationMark2 || "",
        userTypeId: initialState?.userTypeId || "",
    }
}

export const BasicDetails: React.FC<any> = (props) => {
    const [studentInfoState, setStudentInfoState] = useState<any>(getInitialState());
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
                            1. Basic Info</span>
                    </div>
                </div>
            </div>
            <UncontrolledAccordion open="personal-details" defaultOpen={["personal-details", "education",
                "identification", "past-education", "medical-info"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="personal-details">
                        Personal Details
                    </AccordionHeader>
                    <AccordionBody accordionId="personal-details">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-12 md:tw-col-span-4 tw-flex tw-flex-col">
                                <div>
                                    <UploadImage
                                        name="institute-logo"
                                        acceptFileFormat="image/png, image/gif, image/jpeg"
                                        value={StudentImgIcon}
                                    />
                                </div>
                                <div className="tw-text-red-600 tw-mt-2 tw-text-xs">
                                    * Maximum size 50kb allowed in JPG or JPEG format.
                                </div>
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-8">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                    <div className="tw-col-span-12">
                                        <TextInput
                                            name="employeeName"
                                            labelText="Employee Name"
                                            value={basicDetailsForm.values.employeeName}
                                            onChange={basicDetailsForm.handleChange}
                                            invalid={(basicDetailsForm.touched.employeeName && basicDetailsForm.errors.employeeName) ? true : false}
                                            error={(basicDetailsForm.touched.employeeName && basicDetailsForm.errors.employeeName) ? basicDetailsForm.errors.employeeName : ""}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 md:tw-col-span-6">
                                        <TextInput
                                            name="employeeId"
                                            labelText="Employee ID"
                                            value={basicDetailsForm.values.employeeId}
                                            onChange={basicDetailsForm.handleChange}
                                            invalid={(basicDetailsForm.touched.employeeId && basicDetailsForm.errors.employeeId) ? true : false}
                                            error={(basicDetailsForm.touched.employeeId && basicDetailsForm.errors.employeeId) ? basicDetailsForm.errors.employeeId : ""}
                                            isReadOnly={true}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 md:tw-col-span-6">
                                        <SelectInput
                                            name="genderId"
                                            labelText="Gender"
                                            value={basicDetailsForm.values.genderId}
                                            onChange={basicDetailsForm.handleChange}
                                            invalid={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? true : false}
                                            error={(basicDetailsForm.touched.genderId && basicDetailsForm.errors.genderId) ? basicDetailsForm.errors.genderId : ""}
                                            menuItems={genderOptions}
                                            valueKey="id"
                                            defaultValue="Gender"
                                            textKey="name"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <DateInput
                                    name="dob"
                                    labelText="Date Of Birth"
                                    value={basicDetailsForm.values.dob}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.dob && basicDetailsForm.errors.dob) ? true : false}
                                    error={(basicDetailsForm.touched.dob && basicDetailsForm.errors.dob) ? basicDetailsForm.errors.dob : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="aadharNo"
                                    labelText="Aadhar No"
                                    value={basicDetailsForm.values.aadharNo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.aadharNo && basicDetailsForm.errors.aadharNo) ? true : false}
                                    error={(basicDetailsForm.touched.aadharNo && basicDetailsForm.errors.aadharNo) ? basicDetailsForm.errors.aadharNo : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextIconInput
                                    name="personalEmailId"
                                    labelText="Email-Id"
                                    value={basicDetailsForm.values.personalEmailId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.personalEmailId && basicDetailsForm.errors.personalEmailId) ? true : false}
                                    error={(basicDetailsForm.touched.personalEmailId && basicDetailsForm.errors.personalEmailId) ? basicDetailsForm.errors.personalEmailId : ""}
                                >
                                    <i className="ri-mail-unread-line"></i>
                                </TextIconInput>
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <PhoneInput
                                    name="contactNo"
                                    labelText="Phone No"
                                    value={basicDetailsForm.values.contactNo}
                                    onChange={() => { }}
                                    invalid={(basicDetailsForm.touched.contactNo && basicDetailsForm.errors.contactNo) ? true : false}
                                    error={(basicDetailsForm.touched.contactNo && basicDetailsForm.errors.contactNo) ? basicDetailsForm.errors.contactNo : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="nationalityId"
                                    labelText="Nationality"
                                    value={basicDetailsForm.values.nationalityId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.nationalityId && basicDetailsForm.errors.nationalityId) ? true : false}
                                    error={(basicDetailsForm.touched.nationalityId && basicDetailsForm.errors.nationalityId) ? basicDetailsForm.errors.nationalityId : ""}
                                    menuItems={[]}
                                    defaultSelect="Nationality"
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="religionId"
                                    labelText="Religion"
                                    value={basicDetailsForm.values.religionId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.religionId && basicDetailsForm.errors.religionId) ? true : false}
                                    error={(basicDetailsForm.touched.religionId && basicDetailsForm.errors.religionId) ? basicDetailsForm.errors.religionId : ""}
                                    menuItems={[]}
                                    defaultSelect="Religion"
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="casteId"
                                    labelText="Caste"
                                    value={basicDetailsForm.values.casteId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.casteId && basicDetailsForm.errors.casteId) ? true : false}
                                    error={(basicDetailsForm.touched.casteId && basicDetailsForm.errors.casteId) ? basicDetailsForm.errors.casteId : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="bloodGroupId"
                                    labelText="Blood Group"
                                    value={basicDetailsForm.values.bloodGroupId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.bloodGroupId && basicDetailsForm.errors.bloodGroupId) ? true : false}
                                    error={(basicDetailsForm.touched.bloodGroupId && basicDetailsForm.errors.bloodGroupId) ? basicDetailsForm.errors.bloodGroupId : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="identificationMark1"
                                    labelText="Identification Mark 1"
                                    value={basicDetailsForm.values.identificationMark1}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.identificationMark1 && basicDetailsForm.errors.identificationMark1) ? true : false}
                                    error={(basicDetailsForm.touched.identificationMark1 && basicDetailsForm.errors.identificationMark1) ? basicDetailsForm.errors.identificationMark1 : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="identificationMark2"
                                    labelText="Identification Mark 2"
                                    value={basicDetailsForm.values.identificationMark2}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.identificationMark2 && basicDetailsForm.errors.identificationMark2) ? true : false}
                                    error={(basicDetailsForm.touched.identificationMark2 && basicDetailsForm.errors.identificationMark2) ? basicDetailsForm.errors.identificationMark2 : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="maritalStatusId"
                                    labelText="Marital Status"
                                    value={basicDetailsForm.values.maritalStatusId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.maritalStatusId && basicDetailsForm.errors.maritalStatusId) ? true : false}
                                    error={(basicDetailsForm.touched.maritalStatusId && basicDetailsForm.errors.maritalStatusId) ? basicDetailsForm.errors.maritalStatusId : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="userTypeId"
                                    labelText="User Type"
                                    value={basicDetailsForm.values.userTypeId}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.userTypeId && basicDetailsForm.errors.userTypeId) ? true : false}
                                    error={(basicDetailsForm.touched.userTypeId && basicDetailsForm.errors.userTypeId) ? basicDetailsForm.errors.userTypeId : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="education">
                        Education
                    </AccordionHeader>
                    <AccordionBody accordionId="education">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="highestQualification"
                                    labelText="Highest Qualification"
                                    value={basicDetailsForm.values.highestQualification}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.highestQualification && basicDetailsForm.errors.highestQualification) ? true : false}
                                    error={(basicDetailsForm.touched.highestQualification && basicDetailsForm.errors.highestQualification) ? basicDetailsForm.errors.highestQualification : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="instituteUniversity"
                                    labelText="Institute / University"
                                    value={basicDetailsForm.values.instituteUniversity}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.instituteUniversity && basicDetailsForm.errors.instituteUniversity) ? true : false}
                                    error={(basicDetailsForm.touched.instituteUniversity && basicDetailsForm.errors.instituteUniversity) ? basicDetailsForm.errors.instituteUniversity : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="passingYear"
                                    labelText="Passing Year"
                                    value={basicDetailsForm.values.passingYear}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.passingYear && basicDetailsForm.errors.passingYear) ? true : false}
                                    error={(basicDetailsForm.touched.passingYear && basicDetailsForm.errors.passingYear) ? basicDetailsForm.errors.passingYear : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="anySpecialization"
                                    labelText="Any Specialization"
                                    value={basicDetailsForm.values.anySpecialization}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.anySpecialization && basicDetailsForm.errors.anySpecialization) ? true : false}
                                    error={(basicDetailsForm.touched.anySpecialization && basicDetailsForm.errors.anySpecialization) ? basicDetailsForm.errors.anySpecialization : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-8">
                                <TextInput
                                    name="otherAchievements"
                                    labelText="Other Achievements"
                                    value={basicDetailsForm.values.otherAchievements}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.otherAchievements && basicDetailsForm.errors.otherAchievements) ? true : false}
                                    error={(basicDetailsForm.touched.otherAchievements && basicDetailsForm.errors.otherAchievements) ? basicDetailsForm.errors.otherAchievements : ""}
                                />
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="contact-details">
                        Contact Details
                    </AccordionHeader>
                    <AccordionBody accordionId="contact-details">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="address"
                                    labelText="Address"
                                    value={basicDetailsForm.values.address}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.address && basicDetailsForm.errors.address) ? true : false}
                                    error={(basicDetailsForm.touched.address && basicDetailsForm.errors.address) ? basicDetailsForm.errors.address : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="area"
                                    labelText="Area"
                                    value={basicDetailsForm.values.area}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.area && basicDetailsForm.errors.area) ? true : false}
                                    error={(basicDetailsForm.touched.area && basicDetailsForm.errors.area) ? basicDetailsForm.errors.area : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="state"
                                    labelText="State"
                                    value={basicDetailsForm.values.state}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.state && basicDetailsForm.errors.state) ? true : false}
                                    error={(basicDetailsForm.touched.state && basicDetailsForm.errors.state) ? basicDetailsForm.errors.state : ""}
                                    menuItems={genderOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="district"
                                    labelText="District"
                                    value={basicDetailsForm.values.district}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.district && basicDetailsForm.errors.district) ? true : false}
                                    error={(basicDetailsForm.touched.district && basicDetailsForm.errors.district) ? basicDetailsForm.errors.district : ""}
                                    menuItems={genderOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="city"
                                    labelText="City"
                                    value={basicDetailsForm.values.city}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.city && basicDetailsForm.errors.city) ? true : false}
                                    error={(basicDetailsForm.touched.city && basicDetailsForm.errors.city) ? basicDetailsForm.errors.city : ""}
                                    menuItems={genderOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="pinCode"
                                    labelText="PIN Code"
                                    value={basicDetailsForm.values.pinCode}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.pinCode && basicDetailsForm.errors.pinCode) ? true : false}
                                    error={(basicDetailsForm.touched.pinCode && basicDetailsForm.errors.pinCode) ? basicDetailsForm.errors.pinCode : ""}
                                />
                            </div>

                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="dependencies">
                        Dependencies
                    </AccordionHeader>
                    <AccordionBody accordionId="dependencies">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="name"
                                    labelText="Name"
                                    value={basicDetailsForm.values.name}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.name && basicDetailsForm.errors.name) ? true : false}
                                    error={(basicDetailsForm.touched.name && basicDetailsForm.errors.name) ? basicDetailsForm.errors.name : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="relationType"
                                    labelText="Relationship Type"
                                    value={basicDetailsForm.values.relationType}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.relationType && basicDetailsForm.errors.relationType) ? true : false}
                                    error={(basicDetailsForm.touched.relationType && basicDetailsForm.errors.relationType) ? basicDetailsForm.errors.relationType : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <PhoneInput
                                    name="phone"
                                    labelText="Phone No"
                                    value={basicDetailsForm.values.phone}
                                    onChange={() => { }}
                                    invalid={(basicDetailsForm.touched.phone && basicDetailsForm.errors.phone) ? true : false}
                                    error={(basicDetailsForm.touched.phone && basicDetailsForm.errors.phone) ? basicDetailsForm.errors.phone : ""}
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
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="contact-details">
                        Emergency Contacts
                    </AccordionHeader>
                    <AccordionBody accordionId="contact-details">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="name"
                                    labelText="Name"
                                    value={basicDetailsForm.values.name}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.name && basicDetailsForm.errors.name) ? true : false}
                                    error={(basicDetailsForm.touched.name && basicDetailsForm.errors.name) ? basicDetailsForm.errors.name : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <SelectInput
                                    name="relationType"
                                    labelText="Relationship Type"
                                    value={basicDetailsForm.values.relationType}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.relationType && basicDetailsForm.errors.relationType) ? true : false}
                                    error={(basicDetailsForm.touched.relationType && basicDetailsForm.errors.relationType) ? basicDetailsForm.errors.relationType : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <PhoneInput
                                    name="phone"
                                    labelText="Phone No"
                                    value={basicDetailsForm.values.phone}
                                    onChange={() => { }}
                                    invalid={(basicDetailsForm.touched.phone && basicDetailsForm.errors.phone) ? true : false}
                                    error={(basicDetailsForm.touched.phone && basicDetailsForm.errors.phone) ? basicDetailsForm.errors.phone : ""}
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
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="marriage-info">
                        Marriage Info
                    </AccordionHeader>
                    <AccordionBody accordionId="marriage-info">
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="certificateNo"
                                    labelText="Certificate No."
                                    value={basicDetailsForm.values.certificateNo}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.certificateNo && basicDetailsForm.errors.certificateNo) ? true : false}
                                    error={(basicDetailsForm.touched.certificateNo && basicDetailsForm.errors.certificateNo) ? basicDetailsForm.errors.certificateNo : ""}
                                />
                            </div>

                            <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                    name="dateOfRegistration"
                                    labelText="Date of Registration"
                                    value={basicDetailsForm.values.dateOfRegistration}
                                    onChange={basicDetailsForm.handleChange}
                                    invalid={(basicDetailsForm.touched.dateOfRegistration && basicDetailsForm.errors.dateOfRegistration) ? true : false}
                                    error={(basicDetailsForm.touched.dateOfRegistration && basicDetailsForm.errors.dateOfRegistration) ? basicDetailsForm.errors.dateOfRegistration : ""}
                                />
                            </div>

                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-flex tw-justify-end tw-mt-2 tw-gap-2">
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
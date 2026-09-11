import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import StudentImgIcon from "../../../../assets/imagesdps/directory/user-img.png";

//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../../Components/Common";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "./helper";

const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: studentDetails?.id || "",
        studentName: studentDetails?.studentName || "",
        firstName: studentDetails?.firstName || "n/a",
        lastName: studentDetails?.lastName || "n/a",
        admissionNo: studentDetails?.admissionNo || "",
        regId: studentDetails?.regId || "",
        branchId: studentDetails?.branchId || "",
        studentUidNo: studentDetails?.studentUidNo || "",
        admissionType: studentDetails?.admissionType || "",
        phone: studentDetails?.phone || "",
        emailId: studentDetails?.emailId || "",
        gender: studentDetails?.gender || "",
        nationality: studentDetails?.nationality || "",
        motherTongue: studentDetails?.motherTongue || "",
        bloodGroupId: studentDetails?.bloodGroupId || "",
        religion: studentDetails?.religion || "",
        caste: studentDetails?.caste || "",
        aadharEnrollmentNo: studentDetails?.aadharEnrollmentNo || "",
        identificationMarks1: studentDetails?.identificationMarks1 || "",
        identificationMarks2: studentDetails?.identificationMarks2 || "",
        houseId: studentDetails?.houseId || "",
        admissionCategoryId: studentDetails?.admissionCategoryId || "",
        isSpecialChild: studentDetails?.isSpecialChild || "",
        hasSiblings: studentDetails?.hasSiblings || "",
        isSingleParent: studentDetails?.isSingleParent || "",
        singleParentType: studentDetails?.singleParentType || "",
        formId: studentDetails?.formId || "",
        dateOfBirth: studentDetails?.dateOfBirth || "",
        placeOfBirth: studentDetails?.placeOfBirth || "",
        passportNo: studentDetails?.passportNo || "",
        dateOfAdmission: studentDetails?.dateOfAdmission || "",
        studentPhotoUrl: studentDetails?.studentPhotoUrl || "",
        studentPhotoId: studentDetails?.studentPhotoId || "",
        allergicTo: studentDetails?.allergicTo || "",
        smsPriorityNo: studentDetails?.smsPriorityNo || "",
        studentInterest: studentDetails?.studentInterest || "",
        newOrExistingStudents: studentDetails?.newOrExistingStudents || ""
    })
}

function getSiblingData(siblingDetails?: any): any {
    return ({
        siblingClassId: siblingDetails?.siblingClassId || "",
        siblingSectionId: siblingDetails?.siblingSectionId || "",
        siblingStudentId: siblingDetails?.siblingStudentId || "",
        siblingStudentName: siblingDetails?.siblingStudentName || "",
        siblingBranchId: siblingDetails?.siblingBranchId || "",
        siblingCurriculumId: siblingDetails?.siblingCurriculumId || ""
    })
}


export const StudentInfo: React.FC<any> = (props) => {
    const [studentInfoState, setStudentInfoState] = useState<any>(getStudentData());
    const [siblingState, setSiblingState] = useState<any>(getSiblingData());
    const [studUIDState, setStuUIDState] = useState<any>("aadhaar-card");
    const studentInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: studentInfoState,
        validationSchema,
        onSubmit: (values) => {
        },
    });

    const siblingForm = useFormik({
        enableReinitialize: true,
        initialValues: siblingState,
        validationSchema,
        onSubmit: (values) => {
        },
    });


    function submitHndlr() {
    }

    function onChangeUIDhndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setStuUIDState(value);
    }
    return (
        <form id="student-info-form" onSubmit={(e) => e.preventDefault()}>
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="border-bottom">
                        <span className="fs-normal fw-bold d-block mb-2">1. Student Profile</span>
                    </div>

                </div>
            </div>

            <UncontrolledAccordion  open={["basic-details", "academics",
                "identification", "past-education", "medical-info"]} stayOpen>
                <AccordionItem>
                    <AccordionHeader tag="span" className="fs-normal" targetId="basic-details">
                        Basic Details
                    </AccordionHeader>
                    <AccordionBody accordionId="basic-details">
                        <div className="row">
                            {/* <div className="col-4 d-flex flex-column">
                                <div>
                                    <UploadImage
                                        name="institute-logo"
                                        acceptFileFormat="image/png, image/gif, image/jpeg"
                                        value={StudentImgIcon}
                                    // value={fileState}
                                    // onChange={handleFileUploadHnlr}

                                    />
                                </div>
                                <div className="text-danger mt-2 fs-7">* Maximum size 50kb allowed in JPG or JPEG format.</div>



                            </div> */}
                            <div className="col-8">
                                <div className="row">
                                    <div className="col-6">
                                        <TextInput
                                            name="id"
                                            labelText="Student ID"
                                            // formgroupClassName="mb-4"
                                            value={studentInfoForm.values.id}
                                            onChange={studentInfoForm.handleChange}
                                            invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                            error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                                            isReadOnly={true}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <SelectInput
                                            name="academicYear"
                                            labelText="Academic Year"
                                            // formgroupClassName="mb-4"
                                            value={studentInfoForm.values.academicYear}
                                            onChange={studentInfoForm.handleChange}
                                            invalid={(studentInfoForm.touched.academicYear && studentInfoForm.errors.academicYear) ? true : false}
                                            error={(studentInfoForm.touched.academicYear && studentInfoForm.errors.academicYear) ? studentInfoForm.errors.academicYear : ""}
                                            menuItems={[]}
                                            defaultSelect="Academic Year"
                                            valueKey="id"
                                            textKey="name"
                                        />
                                    </div>
                                    <div className="col-6">
                                        <TextInput
                                            name="admissionNo"
                                            labelText="Admission No"
                                            // formgroupClassName="mb-4"
                                            value={studentInfoForm.values.admissionNo}
                                            onChange={studentInfoForm.handleChange}
                                            invalid={(studentInfoForm.touched.admissionNo && studentInfoForm.errors.admissionNo) ? true : false}
                                            error={(studentInfoForm.touched.admissionNo && studentInfoForm.errors.admissionNo) ? studentInfoForm.errors.admissionNo : ""}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <DateInput
                                            name="dateOfAdmission"
                                            labelText="Date of Admission"
                                            // formgroupClassName="mb-4"
                                            value={studentInfoForm.values.dateOfAdmission}
                                            onChange={studentInfoForm.handleChange}
                                            invalid={(studentInfoForm.touched.dateOfAdmission && studentInfoForm.errors.dateOfAdmission) ? true : false}
                                            error={(studentInfoForm.touched.dateOfAdmission && studentInfoForm.errors.dateOfAdmission) ? studentInfoForm.errors.dateOfAdmission : ""}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4">
                                <TextInput
                                    name="studentName"
                                    labelText="Student Name"
                                    value={studentInfoForm.values.studentName}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.studentName && studentInfoForm.errors.studentName) ? true : false}
                                    error={(studentInfoForm.touched.studentName && studentInfoForm.errors.studentName) ? studentInfoForm.errors.studentName : ""}
                                // helperText="Full name as displayed on Aadhar Number"
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="adharNumber"
                                    labelText="Aadhar Number"
                                    value={studentInfoForm.values.adharNumber}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.adharNumber && studentInfoForm.errors.adharNumber) ? true : false}
                                    error={(studentInfoForm.touched.adharNumber && studentInfoForm.errors.adharNumber) ? studentInfoForm.errors.adharNumber : ""}
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="gender"
                                    labelText="Gender"
                                    value={studentInfoForm.values.gender}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.gender && studentInfoForm.errors.gender) ? true : false}
                                    error={(studentInfoForm.touched.gender && studentInfoForm.errors.gender) ? studentInfoForm.errors.gender : ""}
                                    menuItems={genderOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <DateInput
                                    name="dateOfBirth"
                                    labelText="DOB"
                                    value={studentInfoForm.values.dateOfBirth}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.dateOfBirth && studentInfoForm.errors.dateOfBirth) ? true : false}
                                    error={(studentInfoForm.touched.dateOfBirth && studentInfoForm.errors.dateOfBirth) ? studentInfoForm.errors.dateOfBirth : ""}
                                />
                            </div>
                            <div className="col-4">
                                <TextIconInput
                                    name="emailId"
                                    labelText="E-mail"
                                    value={studentInfoForm.values.emailId}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.emailId && studentInfoForm.errors.emailId) ? true : false}
                                    error={(studentInfoForm.touched.emailId && studentInfoForm.errors.emailId) ? studentInfoForm.errors.emailId : ""}
                                ><i className="ri-mail-unread-line"></i></TextIconInput>
                            </div>
                            <div className="col-4">
                                <PhoneInput
                                    name="phone"
                                    labelText="Phone No"
                                    value={studentInfoForm.values.phone}
                                    onChange={() => { }}
                                    invalid={(studentInfoForm.touched.phone && studentInfoForm.errors.phone) ? true : false}
                                    error={(studentInfoForm.touched.phone && studentInfoForm.errors.phone) ? studentInfoForm.errors.phone : ""}
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="placeOfBirth"
                                    labelText="Place of Birth"
                                    value={studentInfoForm.values.placeOfBirth}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.placeOfBirth && studentInfoForm.errors.placeOfBirth) ? true : false}
                                    error={(studentInfoForm.touched.placeOfBirth && studentInfoForm.errors.placeOfBirth) ? studentInfoForm.errors.placeOfBirth : ""}
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="bloodGroupId"
                                    labelText="Blood Group"
                                    value={studentInfoForm.values.bloodGroupId}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.bloodGroupId && studentInfoForm.errors.bloodGroupId) ? true : false}
                                    error={(studentInfoForm.touched.bloodGroupId && studentInfoForm.errors.bloodGroupId) ? studentInfoForm.errors.bloodGroupId : ""}
                                    menuItems={bloodGroupOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>


                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="academics">
                        Academics
                    </AccordionHeader>
                    <AccordionBody accordionId="academics">
                        <div className="row">
                            <div className="col-4">
                                <SelectInput
                                    name="curriculumType"
                                    labelText="Campus Type"
                                    value={studentInfoForm.values.curriculumType}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.curriculumType && studentInfoForm.errors.curriculumType) ? true : false}
                                    error={(studentInfoForm.touched.curriculumType && studentInfoForm.errors.curriculumType) ? studentInfoForm.errors.curriculumType : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="curriculum"
                                    labelText="Curriculum"
                                    value={studentInfoForm.values.curriculum}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.curriculum && studentInfoForm.errors.curriculum) ? true : false}
                                    error={(studentInfoForm.touched.curriculum && studentInfoForm.errors.curriculum) ? studentInfoForm.errors.curriculum : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="class"
                                    labelText="Class"
                                    value={studentInfoForm.values.class}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.class && studentInfoForm.errors.class) ? true : false}
                                    error={(studentInfoForm.touched.class && studentInfoForm.errors.class) ? studentInfoForm.errors.class : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="section"
                                    labelText="Section"
                                    value={studentInfoForm.values.section}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.section && studentInfoForm.errors.section) ? true : false}
                                    error={(studentInfoForm.touched.section && studentInfoForm.errors.section) ? studentInfoForm.errors.section : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="rollNo"
                                    labelText="Roll No"
                                    // formgroupClassName="mb-4"
                                    value={studentInfoForm.values.rollNo}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.rollNo && studentInfoForm.errors.rollNo) ? true : false}
                                    error={(studentInfoForm.touched.rollNo && studentInfoForm.errors.rollNo) ? studentInfoForm.errors.rollNo : ""}
                                    isReadOnly={true}
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="houseId"
                                    labelText="House Name"
                                    value={studentInfoForm.values.houseId}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.houseId && studentInfoForm.errors.houseId) ? true : false}
                                    error={(studentInfoForm.touched.houseId && studentInfoForm.errors.houseId) ? studentInfoForm.errors.houseId : ""}
                                    menuItems={houseNameOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="firstLanguage"
                                    labelText="First Language"
                                    value={studentInfoForm.values.firstLanguage}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.firstLanguage && studentInfoForm.errors.firstLanguage) ? true : false}
                                    error={(studentInfoForm.touched.firstLanguage && studentInfoForm.errors.firstLanguage) ? studentInfoForm.errors.firstLanguage : ""}
                                    menuItems={languageOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="secondLanguage"
                                    labelText="Second Language"
                                    value={studentInfoForm.values.secondLanguage}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.secondLanguage && studentInfoForm.errors.secondLanguage) ? true : false}
                                    error={(studentInfoForm.touched.secondLanguage && studentInfoForm.errors.secondLanguage) ? studentInfoForm.errors.secondLanguage : ""}
                                    menuItems={languageOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="thirdLanguage"
                                    labelText="Third Language"
                                    value={studentInfoForm.values.thirdLanguage}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.thirdLanguage && studentInfoForm.errors.thirdLanguage) ? true : false}
                                    error={(studentInfoForm.touched.thirdLanguage && studentInfoForm.errors.thirdLanguage) ? studentInfoForm.errors.thirdLanguage : ""}
                                    menuItems={languageOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="admissionCategoryId"
                                    labelText="Admission Category"
                                    value={studentInfoForm.values.admissionCategoryId}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.admissionCategoryId && studentInfoForm.errors.admissionCategoryId) ? true : false}
                                    error={(studentInfoForm.touched.admissionCategoryId && studentInfoForm.errors.admissionCategoryId) ? studentInfoForm.errors.admissionCategoryId : ""}
                                    menuItems={admissionCategory}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="admissionType"
                                    labelText="Admission Type"
                                    value={studentInfoForm.values.admissionType}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.admissionType && studentInfoForm.errors.admissionType) ? true : false}
                                    error={(studentInfoForm.touched.admissionType && studentInfoForm.errors.admissionType) ? studentInfoForm.errors.admissionType : ""}
                                    menuItems={admissionTypes}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="identification">
                        Identification
                    </AccordionHeader>
                    <AccordionBody accordionId="identification">
                        <div className="row">
                            <div className="col-4">
                                <SelectInput
                                    name="nationality"
                                    labelText="Nationality"
                                    value={studentInfoForm.values.nationality}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.nationality && studentInfoForm.errors.nationality) ? true : false}
                                    error={(studentInfoForm.touched.nationality && studentInfoForm.errors.nationality) ? studentInfoForm.errors.nationality : ""}
                                    menuItems={nationalityOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="col-4">
                                <SelectInput
                                    name="religion"
                                    labelText="Religion"
                                    value={studentInfoForm.values.religion}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.religion && studentInfoForm.errors.religion) ? true : false}
                                    error={(studentInfoForm.touched.religion && studentInfoForm.errors.religion) ? studentInfoForm.errors.religion : ""}
                                    menuItems={religionOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <SelectInput
                                    name="caste"
                                    labelText="Cast"
                                    value={studentInfoForm.values.caste}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.caste && studentInfoForm.errors.caste) ? true : false}
                                    error={(studentInfoForm.touched.caste && studentInfoForm.errors.caste) ? studentInfoForm.errors.caste : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="col-4">
                                <SelectInput
                                    name="motherTongue"
                                    labelText="Mother Tongue"
                                    value={studentInfoForm.values.motherTongue}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.motherTongue && studentInfoForm.errors.motherTongue) ? true : false}
                                    error={(studentInfoForm.touched.motherTongue && studentInfoForm.errors.motherTongue) ? studentInfoForm.errors.motherTongue : ""}
                                    menuItems={motherToungeOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="passportNo"
                                    labelText="Foreign National Passport Number"
                                    value={studentInfoForm.values.passportNo}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.passportNo && studentInfoForm.errors.passportNo) ? true : false}
                                    error={(studentInfoForm.touched.passportNo && studentInfoForm.errors.passportNo) ? studentInfoForm.errors.passportNo : ""}
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="identificationMarks1"
                                    labelText="Identification Mark 1"
                                    value={studentInfoForm.values.identificationMarks1}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.identificationMarks1 && studentInfoForm.errors.identificationMarks1) ? true : false}
                                    error={(studentInfoForm.touched.identificationMarks1 && studentInfoForm.errors.identificationMarks1) ? studentInfoForm.errors.identificationMarks1 : ""}
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="identificationMarks2"
                                    labelText="Identification Mark 2"
                                    value={studentInfoForm.values.identificationMarks2}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.identificationMarks2 && studentInfoForm.errors.identificationMarks2) ? true : false}
                                    error={(studentInfoForm.touched.identificationMarks2 && studentInfoForm.errors.identificationMarks2) ? studentInfoForm.errors.identificationMarks2 : ""}
                                />
                            </div>

                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="past-education">
                        Past Education
                    </AccordionHeader>
                    <AccordionBody accordionId="past-education">
                        <div className="row">
                            <div className="col-4">
                                <TextInput
                                    name="lastSchoolStudied"
                                    labelText="School Studied"
                                    value={studentInfoForm.values.lastSchoolStudied}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.lastSchoolStudied && studentInfoForm.errors.lastSchoolStudied) ? true : false}
                                    error={(studentInfoForm.touched.lastSchoolStudied && studentInfoForm.errors.lastSchoolStudied) ? studentInfoForm.errors.lastSchoolStudied : ""}
                                />
                            </div>

                            <div className="col-4">
                                <SelectInput
                                    name="lastCurriculumStudied"
                                    labelText="Curriculum"
                                    value={studentInfoForm.values.lastCurriculumStudied}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.lastCurriculumStudied && studentInfoForm.errors.lastCurriculumStudied) ? true : false}
                                    error={(studentInfoForm.touched.lastCurriculumStudied && studentInfoForm.errors.lastCurriculumStudied) ? studentInfoForm.errors.lastCurriculumStudied : ""}
                                    menuItems={[]}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="col-4">
                                <TextInput
                                    name="lastClassStudied"
                                    labelText="Class"
                                    value={studentInfoForm.values.lastClassStudied}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.lastClassStudied && studentInfoForm.errors.lastClassStudied) ? true : false}
                                    error={(studentInfoForm.touched.lastClassStudied && studentInfoForm.errors.lastClassStudied) ? studentInfoForm.errors.lastClassStudied : ""}
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="percentage"
                                    labelText="Percentage"
                                    value={studentInfoForm.values.percentage}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.percentage && studentInfoForm.errors.percentage) ? true : false}
                                    error={(studentInfoForm.touched.percentage && studentInfoForm.errors.percentage) ? studentInfoForm.errors.percentage : ""}
                                />
                            </div>
                            <div className="col-8">
                                <TextInput
                                    name="reasonSeekingAdmission"
                                    labelText="Reason for Seeking Admission"
                                    value={studentInfoForm.values.reasonSeekingAdmission}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.reasonSeekingAdmission && studentInfoForm.errors.reasonSeekingAdmission) ? true : false}
                                    error={(studentInfoForm.touched.reasonSeekingAdmission && studentInfoForm.errors.reasonSeekingAdmission) ? studentInfoForm.errors.reasonSeekingAdmission : ""}
                                />
                            </div>

                        </div>
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="medical-info">
                        Medical Info
                    </AccordionHeader>
                    <AccordionBody accordionId="medical-info">
                        <div className="row">
                            <div className="col-4">
                                <Switch
                                    attributeId="isSpecialChild"
                                    labelName="Is Special Child"
                                    className="form-switch-sm mb-3 form-check-right"
                                />
                            </div>
                            <div className="w-100"></div>
                            <div className="col-4">
                                <TextInput
                                    name="details"
                                    labelText="Details"
                                    value={studentInfoForm.values.details}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.details && studentInfoForm.errors.details) ? true : false}
                                    error={(studentInfoForm.touched.details && studentInfoForm.errors.details) ? studentInfoForm.errors.details : ""}
                                    isDisabled={studentInfoForm.values.isSpecialChild === "false"}
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="allergicTo"
                                    labelText="Allergic To"
                                    value={studentInfoForm.values.allergicTo}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.allergicTo && studentInfoForm.errors.allergicTo) ? true : false}
                                    error={(studentInfoForm.touched.allergicTo && studentInfoForm.errors.allergicTo) ? studentInfoForm.errors.allergicTo : ""}
                                    isDisabled={studentInfoForm.values.isSpecialChild === "false"}
                                />
                            </div>
                            <div className="col-4">
                                <TextInput
                                    name="otherHealthIssue"
                                    labelText="Other Health Issue"
                                    value={studentInfoForm.values.otherHealthIssue}
                                    onChange={studentInfoForm.handleChange}
                                    invalid={(studentInfoForm.touched.otherHealthIssue && studentInfoForm.errors.otherHealthIssue) ? true : false}
                                    error={(studentInfoForm.touched.otherHealthIssue && studentInfoForm.errors.otherHealthIssue) ? studentInfoForm.errors.otherHealthIssue : ""}
                                    isDisabled={studentInfoForm.values.isSpecialChild === "false"}
                                />
                            </div>
                            <div className="col-4">
                                <PhoneInput
                                    name="emergencyContactNo"
                                    labelText="Emergency Contact no."
                                    value={studentInfoForm.values.emergencyContactNo}
                                    onChange={() => { }}
                                    invalid={(studentInfoForm.touched.emergencyContactNo && studentInfoForm.errors.emergencyContactNo) ? true : false}
                                    error={(studentInfoForm.touched.emergencyContactNo && studentInfoForm.errors.emergencyContactNo) ? studentInfoForm.errors.emergencyContactNo : ""}
                                />
                            </div>

                        </div>
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            <div className="row mt-3">
                <div className="col-12 text-end mt-2">
                    <button type="submit" className="btn btn-soft-success me-2">
                        Cancel
                    </button>
                    <button onClick={submitHndlr} className="btn btn-success">
                        Next
                    </button>
                </div>
            </div>
        </form>
    )
}
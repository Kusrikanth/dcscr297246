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
        newOrExistingStudents: studentDetails?.newOrExistingStudents || "",
        rfid: studentDetails?.rfid || ""
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
                <div className="col-12">
                    <h5 className="mb-3 d-inline-block text-underline-blue">Basic Details</h5>
                </div>
                <div className="col-4">
                    <TextInput
                        name="id"
                        labelText="Student ID"
                        value={studentInfoForm.values.id}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                    />
                </div>
                <div className="col-4">
                    <TextInput
                        name="studentName"
                        labelText="Student Name"
                        value={studentInfoForm.values.studentName}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.studentName && studentInfoForm.errors.studentName) ? true : false}
                        error={(studentInfoForm.touched.studentName && studentInfoForm.errors.studentName) ? studentInfoForm.errors.studentName : ""}
                        helperText="Full name as displayed on Aadhar Number"
                    />
                </div>
                <div className="col-4">
                    <TextInput
                        name="admissionNo"
                        labelText="Admission No"
                        value={studentInfoForm.values.admissionNo}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.admissionNo && studentInfoForm.errors.admissionNo) ? true : false}
                        error={(studentInfoForm.touched.admissionNo && studentInfoForm.errors.admissionNo) ? studentInfoForm.errors.admissionNo : ""}
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
                <div className="col-4">
                    <TextInput
                        name="regId"
                        labelText="Roll No."
                        value={studentInfoForm.values.regId}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.regId && studentInfoForm.errors.regId) ? true : false}
                        error={(studentInfoForm.touched.regId && studentInfoForm.errors.regId) ? studentInfoForm.errors.regId : ""}
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
                    <div className="row g-3">
                        <div className="col-6">
                            <SelectInput
                                name="branchTypeId"
                                labelText="Class"
                                value={studentInfoForm.values.branchTypeId}
                                onChange={studentInfoForm.handleChange}
                                invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                                error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                                menuItems={[]}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>
                        <div className="col-6">
                            <SelectInput
                                name="branchTypeId"
                                labelText="Section"
                                value={studentInfoForm.values.branchTypeId}
                                onChange={studentInfoForm.handleChange}
                                invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                                error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                                menuItems={[]}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>
                    </div>
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
                    <PhoneInput
                        name="smsPriorityNo"
                        labelText="Contact No (For SMS)"
                        value={studentInfoForm.values.smsPriorityNo}
                        onChange={() => { }}
                        invalid={(studentInfoForm.touched.smsPriorityNo && studentInfoForm.errors.smsPriorityNo) ? true : false}
                        error={(studentInfoForm.touched.smsPriorityNo && studentInfoForm.errors.smsPriorityNo) ? studentInfoForm.errors.smsPriorityNo : ""}
                    />
                </div>
                <div className="col-4">
                    <PhoneInput
                        name="phone"
                        labelText="Emergency Contact No"
                        value={studentInfoForm.values.phone}
                        onChange={() => { }}
                        invalid={(studentInfoForm.touched.phone && studentInfoForm.errors.phone) ? true : false}
                        error={(studentInfoForm.touched.phone && studentInfoForm.errors.phone) ? studentInfoForm.errors.phone : ""}
                    />
                </div>

                <div className="col-4">
                    <TextIconInput
                        name="emailId"
                        labelText="Email Id(For Communication)"
                        value={studentInfoForm.values.emailId}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.emailId && studentInfoForm.errors.emailId) ? true : false}
                        error={(studentInfoForm.touched.emailId && studentInfoForm.errors.emailId) ? studentInfoForm.errors.emailId : ""}
                    ><i className="ri-mail-unread-line"></i></TextIconInput>
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

                <div className="col-12 mt-2">
                    <h5 className="mb-3  d-inline-block text-underline-blue">Identification Information</h5>
                </div>

                <div className="col-12">
                    <RadioInputContainer
                        name="studUIDState"
                        labelText="Select UID Number"
                        containerClassName="d-flex"
                        labelClassName="mb-0 me-3"
                        radioOptions={studentUIDTypes}
                        value={studUIDState}
                        onChange={onChangeUIDhndlr}
                    />
                </div>
                <div className="col-6">
                    {studUIDState === "aadhaar-card" && <TextInput
                        name="studentUidNo"
                        labelText="ID Number"
                        value={studentInfoForm.values.studentUidNo}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.studentUidNo && studentInfoForm.errors.studentUidNo) ? true : false}
                        error={(studentInfoForm.touched.studentUidNo && studentInfoForm.errors.studentUidNo) ? studentInfoForm.errors.studentUidNo : ""}
                    />}
                    {studUIDState === "foreign-national-passport-number" && <TextInput
                        name="passportNo"
                        labelText="Passport No."
                        value={studentInfoForm.values.passportNo}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.passportNo && studentInfoForm.errors.passportNo) ? true : false}
                        error={(studentInfoForm.touched.passportNo && studentInfoForm.errors.passportNo) ? studentInfoForm.errors.passportNo : ""}
                    />}
                </div>
                <div className="col-6">
                    <TextInput
                        name="rfid"
                        labelText="RFID"
                        value={studentInfoForm.values.rfid}
                        onChange={studentInfoForm.handleChange}
                    />
                </div>
                <div className="w-100"></div>

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

                <div className="col-12 mt-2">
                    <h5 className="mb-4  d-inline-block text-underline-blue">Education Information</h5>
                </div>

                <div className="col-4">
                    <DateInput
                        name="dateOfAdmission"
                        labelText="Date of Admission"
                        value={studentInfoForm.values.dateOfAdmission}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.dateOfAdmission && studentInfoForm.errors.dateOfAdmission) ? true : false}
                        error={(studentInfoForm.touched.dateOfAdmission && studentInfoForm.errors.dateOfAdmission) ? studentInfoForm.errors.dateOfAdmission : ""}
                    />
                </div>

                <div className="col-4">
                    <TextInput
                        name="lastSchoolStudied"
                        labelText="Last School Studied"
                        value={studentInfoForm.values.lastSchoolStudied}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.lastSchoolStudied && studentInfoForm.errors.lastSchoolStudied) ? true : false}
                        error={(studentInfoForm.touched.lastSchoolStudied && studentInfoForm.errors.lastSchoolStudied) ? studentInfoForm.errors.lastSchoolStudied : ""}
                    />
                </div>

                <div className="col-4">
                    <SelectInput
                        name="lastCurriculumStudied"
                        labelText="Last Curriculum Studied"
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
                        labelText="Last Class Studied"
                        value={studentInfoForm.values.lastClassStudied}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.lastClassStudied && studentInfoForm.errors.lastClassStudied) ? true : false}
                        error={(studentInfoForm.touched.lastClassStudied && studentInfoForm.errors.lastClassStudied) ? studentInfoForm.errors.lastClassStudied : ""}
                    />
                </div>

                <div className="col-8">
                    <TextInput
                        name="reasonAdmission"
                        labelText="Reason for Seeking Admission"
                        value={studentInfoForm.values.reasonAdmission}
                        onChange={studentInfoForm.handleChange}
                        invalid={(studentInfoForm.touched.reasonAdmission && studentInfoForm.errors.reasonAdmission) ? true : false}
                        error={(studentInfoForm.touched.reasonAdmission && studentInfoForm.errors.reasonAdmission) ? studentInfoForm.errors.reasonAdmission : ""}
                    />
                </div>

                <div className="col-12 mt-2">
                    <h5 className="mb-4  d-inline-block text-underline-blue">Other Information</h5>
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
                <div className="col-4" >
                    <RadioInputContainer
                        name="isSpecialChild"
                        labelText="Is Special Child"
                        inputContainerClassName="mt-2"
                        radioOptions={trueFalseOptions}
                        value={studentInfoForm.values.isSpecialChild}
                        onChange={studentInfoForm.handleChange}
                    />
                </div>

                <div className="col-6">
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

                <div className="col-6">
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

                <div className="col-12 mt-2">
                    <h5 className="mb-4  d-inline-block text-underline-blue">Sibling Details</h5>
                </div>

                <div className="col-12">
                    <RadioInputContainer
                        name="hasSiblings"
                        labelText="Is there any Sibling Studying in the Same School ?"
                        containerClassName="d-flex"
                        labelClassName="mb-0 me-3"
                        radioOptions={trueFalseOptions}
                        value={studentInfoForm.values.hasSiblings}
                        onChange={studentInfoForm.handleChange}
                    />
                </div>

                <div className="col-4">
                    <TextInput
                        name="siblingStudentId"
                        labelText="Sibling Student Id"
                        value={siblingForm.values.siblingStudentId}
                        onChange={siblingForm.handleChange}
                        invalid={(siblingForm.touched.siblingStudentId && siblingForm.errors.siblingStudentId) ? true : false}
                        error={(siblingForm.touched.siblingStudentId && siblingForm.errors.siblingStudentId) ? siblingForm.errors.siblingStudentId : ""}
                        isDisabled={studentInfoForm.values.hasSiblings === "false"}
                    />
                </div>
                <div className="col-4">
                    <TextInput
                        name="siblingStudentName"
                        labelText="Sibling Name"
                        value={siblingForm.values.siblingStudentName}
                        onChange={siblingForm.handleChange}
                        invalid={(siblingForm.touched.siblingStudentName && siblingForm.errors.siblingStudentName) ? true : false}
                        error={(siblingForm.touched.siblingStudentName && siblingForm.errors.siblingStudentName) ? siblingForm.errors.siblingStudentName : ""}
                        isDisabled={studentInfoForm.values.hasSiblings === "false"}
                    />
                </div>
                <div className="col-4">
                    <SelectInput
                        name="siblingCurriculumId"
                        labelText="Curriculum Studied"
                        value={siblingForm.values.siblingCurriculumId}
                        onChange={siblingForm.handleChange}
                        invalid={(siblingForm.touched.siblingCurriculumId && siblingForm.errors.siblingCurriculumId) ? true : false}
                        error={(siblingForm.touched.siblingCurriculumId && siblingForm.errors.siblingCurriculumId) ? siblingForm.errors.siblingCurriculumId : ""}
                        menuItems={[]}
                        valueKey="id"
                        textKey="name"
                        isDisabled={studentInfoForm.values.hasSiblings === "false"}
                    />
                </div>

                <div className="col-8">
                    <div className="row">
                        <div className="col-6">
                            <SelectInput
                                name="siblingClassId"
                                labelText="Class"
                                value={siblingForm.values.siblingClassId}
                                onChange={siblingForm.handleChange}
                                invalid={(siblingForm.touched.siblingClassId && siblingForm.errors.siblingClassId) ? true : false}
                                error={(siblingForm.touched.siblingClassId && siblingForm.errors.siblingClassId) ? siblingForm.errors.siblingClassId : ""}
                                menuItems={[]}
                                valueKey="id"
                                textKey="name"
                                isDisabled={studentInfoForm.values.hasSiblings === "false"}
                            />
                        </div>
                        <div className="col-6">
                            <SelectInput
                                name="siblingSectionId"
                                labelText="Section"
                                value={siblingForm.values.siblingSectionId}
                                onChange={siblingForm.handleChange}
                                invalid={(siblingForm.touched.siblingSectionId && siblingForm.errors.siblingSectionId) ? true : false}
                                error={(siblingForm.touched.siblingSectionId && siblingForm.errors.siblingSectionId) ? siblingForm.errors.siblingSectionId : ""}
                                menuItems={[]}
                                valueKey="id"
                                textKey="name"
                                isDisabled={studentInfoForm.values.hasSiblings === "false"}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 text-end mt-2">
                    <button type="submit" className="btn btn-soft-success me-2">
                        Cancel
                    </button>
                    <button onClick={submitHndlr} className="btn btn-success">
                        Proceed
                    </button>
                </div>
            </div>
        </form>
    )
}
import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";


const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        studentName: studentDetails?.studentName || "",
        firstName: studentDetails?.studentName || "",
        lastName: studentDetails?.studentName || "",
        admissionNo: studentDetails?.studentName || "",
        regId: studentDetails?.studentName || "",
        branchId: studentDetails?.studentName || "",
        studentUidNo: studentDetails?.studentName || "",
        admissionType: studentDetails?.studentName || "",
        phone: studentDetails?.studentName || "",
        emailId: studentDetails?.studentName || "",
        gender: studentDetails?.studentName || "",
        nationality: studentDetails?.studentName || "",
        motherTongue: studentDetails?.studentName || "",
        bloodGroupId: studentDetails?.studentName || "",
        religion: studentDetails?.studentName || "",
        caste: studentDetails?.studentName || "",
        aadharEnrollmentNo: studentDetails?.studentName || "",
        identificationMarks1: studentDetails?.studentName || "",
        identificationMarks2: studentDetails?.studentName || "",
        houseId: studentDetails?.studentName || "",
        admissionCategoryId: studentDetails?.studentName || "",
        isSpecialChild: studentDetails?.studentName || "",
        hasSiblings: studentDetails?.studentName || "",
        isSingleParent: studentDetails?.studentName || "",
        singleParentType: studentDetails?.studentName || "",
        formId: studentDetails?.studentName || "",
        dateOfBirth: studentDetails?.studentName || "",
        placeOfBirth: studentDetails?.studentName || "",
        passportNo: studentDetails?.studentName || "",
        dateOfAdmission: studentDetails?.studentName || "",
        studentPhotoUrl: studentDetails?.studentName || "",
        studentPhotoId: studentDetails?.studentName || "",
        allergicTo: studentDetails?.studentName || "",
        smsPriorityNo: studentDetails?.studentName || "",
        studentInterest: studentDetails?.studentName || "",
        newOrExistingStudents: studentDetails?.studentName || ""
    })
}

// const data = {
//     "studentDetails": {
//         "": "Pooja Patkotwar",
//         "firstName": "Pooja",
//         "lastName": "Patkotwar",
//         "admissionNo": "adm123",
//         "regId": 263746347,
//         "branchId": "54a42c4d-47aa-40b7-bd6b-284702aaebb8",
//         "studentUidNo": "8784785",
//         "": "full time",
//         "": "4755555558",
//         "": "pooja@gmail.com",
//         "": "female",
//         "": "indian",
//         "motherTongue": "marathi",
//         "bloodGroupId": "b+",
//         "": "hindu",
//         "caste": "sc",
//         "aadharEnrollmentNo": "453545454533",
//         "identificationMarks1": "xyz",
//         "identificationMarks2": "yzc",
//         "houseId": 1212,
//         "admissionCategoryId": 343434,
//         "isSpecialChild": false,
//         "hasSiblings": true,
//         "isSingleParent": false,
//         "singleParentType": "na",
//         "formId": "na",
//         "": "1997-10-06",
//         "placeOfBirth": "rajura",
//         "passportNo": "2434343",
//         "dateOfAdmission": "2022-05-04",
//         "studentPhotoUrl": "cvdvcvdfdf",
//         "studentPhotoId": "1213",
//         "allergicTo": "na",
//         "smsPriorityNo": "23234",
//         "studentInterest": "bna",
//         "newOrExistingStudents": "new"
//     }

export const StudentInfo: React.FC<any> = (props) => {
    const [studentInfoState, setStudentInfoState] = useState<any>(getStudentData());
    const studentInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: studentInfoState,
        validationSchema,
        onSubmit: (values) => {
        },
    });
    return (
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12">
                <h5 className="tw-mb-2">Basic Details</h5>
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Student ID"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Student Name"
                    value={studentInfoForm.values.studentName}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.studentName && studentInfoForm.errors.studentName) ? true : false}
                    error={(studentInfoForm.touched.studentName && studentInfoForm.errors.studentName) ? studentInfoForm.errors.studentName : ""}
                    helperText="Full name as displayed on Aadhar Number"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="admissionType"
                    labelText="Admission Type"
                    value={studentInfoForm.values.admissionType}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.admissionType && studentInfoForm.errors.admissionType) ? true : false}
                    error={(studentInfoForm.touched.admissionType && studentInfoForm.errors.admissionType) ? studentInfoForm.errors.admissionType : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Roll No."
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                    <div className="tw-col-span-6">
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
                    <div className="tw-col-span-6">
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
            <div className="tw-col-span-4">
                <DateInput
                    name="dateOfBirth"
                    labelText="DOB"
                    value={studentInfoForm.values.dateOfBirth}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.dateOfBirth && studentInfoForm.errors.dateOfBirth) ? true : false}
                    error={(studentInfoForm.touched.dateOfBirth && studentInfoForm.errors.dateOfBirth) ? studentInfoForm.errors.dateOfBirth : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <PhoneInput
                    name="phone"
                    labelText="Phone No."
                    value={studentInfoForm.values.phone}
                    onChange={() => { }}
                    invalid={(studentInfoForm.touched.phone && studentInfoForm.errors.phone) ? true : false}
                    error={(studentInfoForm.touched.phone && studentInfoForm.errors.phone) ? studentInfoForm.errors.phone : ""}
                />
            </div>

            <div className="tw-col-span-4">
                <TextIconInput
                    name="emailId"
                    labelText="Email ID"
                    value={studentInfoForm.values.emailId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.emailId && studentInfoForm.errors.emailId) ? true : false}
                    error={(studentInfoForm.touched.emailId && studentInfoForm.errors.emailId) ? studentInfoForm.errors.emailId : ""}
                ><i className="ri-mail-unread-line"></i></TextIconInput>
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="gender"
                    labelText="Gender"
                    value={studentInfoForm.values.gender}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.gender && studentInfoForm.errors.gender) ? true : false}
                    error={(studentInfoForm.touched.gender && studentInfoForm.errors.gender) ? studentInfoForm.errors.gender : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="nationality"
                    labelText="Nationality"
                    value={studentInfoForm.values.nationality}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.nationality && studentInfoForm.errors.nationality) ? true : false}
                    error={(studentInfoForm.touched.nationality && studentInfoForm.errors.nationality) ? studentInfoForm.errors.nationality : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Mother Tongue"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Blood Group"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="religion"
                    labelText="Religion"
                    value={studentInfoForm.values.religion}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.religion && studentInfoForm.errors.religion) ? true : false}
                    error={(studentInfoForm.touched.religion && studentInfoForm.errors.religion) ? studentInfoForm.errors.religion : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
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
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Student Aadhar No."
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Identification Mark 1"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Identification Mark 2"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="House Name"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Admission Category"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Curriculum"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4" >
                <div className="tw-mb-3">
                    <Label htmlFor="subjectType" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">Is Special Child</Label>
                    <div className="tw-flex tw-items-center tw-mt-2">
                        <div className="tw-flex tw-items-center tw-me-4">
                            <Input className="tw-w-4 tw-h-4" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                            <Label className="tw-ms-2 tw-text-sm" htmlFor="formradioRight5">
                                Yes
                            </Label>
                        </div>
                        <div className="tw-flex tw-items-center">
                            <Input className="tw-w-4 tw-h-4" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                            <Label className="tw-ms-2 tw-text-sm" htmlFor="formradioRight5">
                                No
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="First Language"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Second Language"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Third Language"
                    value={studentInfoForm.values.branchTypeId}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? true : false}
                    error={(studentInfoForm.touched.branchTypeId && studentInfoForm.errors.branchTypeId) ? studentInfoForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="tw-col-span-12 tw-mt-2">
                <div className="tw-border-t tw-border-gray-200"></div>
            </div>
            <div className="tw-col-span-12 tw-mt-2">
                <h5 className="tw-mb-2">Sibling Details</h5>
            </div>
            <div className="tw-col-span-12">
                <div className="tw-flex tw-mb-3">
                    <Label htmlFor="subjectType" className="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-0 tw-me-2">Is there any Sibling Studying in the Same School ?</Label>
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex tw-items-center tw-me-4">
                            <Input className="tw-w-4 tw-h-4" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                            <Label className="tw-ms-2 tw-text-sm" htmlFor="formradioRight5">
                                Yes
                            </Label>
                        </div>
                        <div className="tw-flex tw-items-center">
                            <Input className="tw-w-4 tw-h-4" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                            <Label className="tw-ms-2 tw-text-sm" htmlFor="formradioRight5">
                                No
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Sibling Student Id"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Name"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Campus"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                    <div className="tw-col-span-6">
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
                    <div className="tw-col-span-6">
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
            <div className="tw-col-span-12 tw-text-right tw-mt-2">
                <Button type="submit" variant="secondary" >
                    Cancel
                </Button>
                <Button type="submit" variant="primary">
                    Proceed
                </Button>
            </div>
        </div>
    )
}
import React, { useState } from "react";
import { Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
//Common Component
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer
} from "../../../../../Components/Common";
//helper
import { yesNoOptions } from "../helper";


const validationSchema = Yup.object().shape({

});

function getFatherDetails(fatherDetail?: any): any {
    return ({
        id: "",
    })
}

export default function FatherDetails(props: any) {
    const [fatherDetailState, setFatherDetailState] = useState<any>(getFatherDetails());
    const fatherDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: fatherDetailState,
        validationSchema,
        onSubmit: (values) => {
        },
    });
    return (
        <React.Fragment>
            <div className="col-12">
                <h5 className="mb-3 d-inline-block text-underline-blue">Father Details</h5>
            </div>
            <div className="col-4">
                <RadioInputContainer
                    name="scholasticType"
                    labelText="Employee of the School ?"
                    containerClassName="d-flex my-2"
                    labelClassName="mb-0 me-3"
                    radioOptions={yesNoOptions}
                    value={fatherDetailsForm.values.scholasticType}
                    onChange={fatherDetailsForm.handleChange}
                />
            </div>
            <div className="col-4">
                <TextIconInput
                    formgroupClassName="search-box mb-3"
                    name="branchName"
                    value={fatherDetailsForm.values.id}
                    placeHolder="Search Employee..."
                    onChange={() => { }}
                ><i className="ri-search-line search-icon"></i></TextIconInput>
            </div>
            <div className="w-100"></div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Father Name"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Nationality"
                    value={fatherDetailsForm.values.branchTypeId}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.branchTypeId && fatherDetailsForm.errors.branchTypeId) ? true : false}
                    error={(fatherDetailsForm.touched.branchTypeId && fatherDetailsForm.errors.branchTypeId) ? fatherDetailsForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="col-4">
                <PhoneInput
                    name="phoneNumber"
                    labelText="Phone No."
                    value={fatherDetailsForm.values.phoneNumber}
                    onChange={() => { }}
                    invalid={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? true : false}
                    error={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? fatherDetailsForm.errors.phoneNumber : ""}
                />
            </div>
            <div className="col-4">
                <TextIconInput
                    name="mailId"
                    labelText="Email ID"
                    value={fatherDetailsForm.values.mailId}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? true : false}
                    error={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? fatherDetailsForm.errors.mailId : ""}
                ><i className="ri-mail-unread-line"></i></TextIconInput>
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Designation"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Occupation"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Name of the Organization"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Office Address"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Annual Income"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Aadhar / Passport No."
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Qualification"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="(Specify Qualification)"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-12">
                <h5 className="mb-3 mt-2 d-inline-block text-underline-blue">Mother Details</h5>
            </div>
            <div className="col-4 mb-3 d-flex align-items-center">
                <Label htmlFor="subjectType" className="form-label mb-0 me-2">Employee of the School ?</Label>
                <div className="d-flex align-items-center">
                    <div className="form-check form-radio-primary me-2">
                        <Input className="form-check-input" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                        <Label className="form-check-label" htmlFor="formradioRight5">
                            Yes
                        </Label>
                    </div>
                    <div className="form-check form-radio-primary">
                        <Input className="form-check-input" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                        <Label className="form-check-label" htmlFor="formradioRight5">
                            No
                        </Label>
                    </div>
                </div>
            </div>
            <div className="col-4">
                <TextIconInput
                    formgroupClassName="search-box mb-3"
                    name="branchName"
                    value={fatherDetailsForm.values.id}
                    placeHolder="Search Employee..."
                    onChange={() => { }}
                ><i className="ri-search-line search-icon"></i></TextIconInput>
            </div>
            <div className="w-100"></div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Mother's Name"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Nationality"
                    value={fatherDetailsForm.values.branchTypeId}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.branchTypeId && fatherDetailsForm.errors.branchTypeId) ? true : false}
                    error={(fatherDetailsForm.touched.branchTypeId && fatherDetailsForm.errors.branchTypeId) ? fatherDetailsForm.errors.branchTypeId : ""}
                    menuItems={[]}
                    valueKey="id"
                    textKey="name"
                />
            </div>
            <div className="col-4">
                <PhoneInput
                    name="phoneNumber"
                    labelText="Phone No."
                    value={fatherDetailsForm.values.phoneNumber}
                    onChange={() => { }}
                    invalid={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? true : false}
                    error={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? fatherDetailsForm.errors.phoneNumber : ""}
                />
            </div>
            <div className="col-4">
                <TextIconInput
                    name="mailId"
                    labelText="Email ID"
                    value={fatherDetailsForm.values.mailId}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? true : false}
                    error={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? fatherDetailsForm.errors.mailId : ""}
                ><i className="ri-mail-unread-line"></i></TextIconInput>
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Designation"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Occupation"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Name of the Organization"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Office Address"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Annual Income"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Aadhar / Passport No."
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Qualification"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="(Specify Qualification)"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>

        </React.Fragment>

    )
}
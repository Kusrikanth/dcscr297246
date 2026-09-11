import React, { useState } from "react";
import { Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
//Common Component
import { TextIconInput, TextInput, SelectInput, PhoneInput } from "../../../../../Components/Common";



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
            <div className="tw-col-span-12 tw-mb-2">
  <h6 className="tw-mb-1 tw-mr-2">Father Details</h6>
</div>

<div className="tw-col-span-12 tw-grid tw-grid-cols-12 tw-items-center tw-mb-4">
  <div className="tw-col-span-12 md:tw-col-span-4">
    <Label htmlFor="subjectType" className="tw-mb-0 tw-mr-2">
      Employee of the School ?
    </Label>
  </div>

  <div className="tw-col-span-12 md:tw-col-span-8">
    <div className="tw-grid tw-grid-cols-2 tw-items-center">
      
      <div className="tw-flex tw-items-center tw-mr-2">
        <Input
          className="tw-mr-2"
          type="radio"
          name="formradiocolor1"
          id="formradioRight5"
          defaultChecked
        />
        <Label htmlFor="formradioRight5" className="tw-mb-0">
          Yes
        </Label>
      </div>

      <div className="tw-flex tw-items-center">
        <Input
          className="tw-mr-2"
          type="radio"
          name="formradiocolor1"
          id="formradioRight6"
        />
        <Label htmlFor="formradioRight6" className="tw-mb-0">
          No
        </Label>
      </div>

    </div>
  </div>
</div>

<div className="tw-col-span-4">
  <TextInput
    name="id"
    labelText="Father Name"
    value={fatherDetailsForm.values.id}
    onChange={fatherDetailsForm.handleChange}
    invalid={
      fatherDetailsForm.touched.id && fatherDetailsForm.errors.id
        ? true
        : false
    }
    error={
      fatherDetailsForm.touched.id && fatherDetailsForm.errors.id
        ? fatherDetailsForm.errors.id
        : ""
    }
  />
</div>
            <div className="tw-col-span-4">
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
            <div className="tw-col-span-4">
                <PhoneInput
                    name="phoneNumber"
                    labelText="Phone No."
                    value={fatherDetailsForm.values.phoneNumber}
                    onChange={() => { }}
                    invalid={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? true : false}
                    error={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? fatherDetailsForm.errors.phoneNumber : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextIconInput
                    name="mailId"
                    labelText="Email ID"
                    value={fatherDetailsForm.values.mailId}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? true : false}
                    error={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? fatherDetailsForm.errors.mailId : ""}
                ><i className="ri-mail-unread-line"></i></TextIconInput>
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Designation"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Occupation"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Name of the Organization"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Office Afddress"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Annual Income"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Aadhar / Passport No."
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Qualification"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="(Specify Qualification)"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="col-12 mb-2">
                <h6 className="mb-1 me-2">Mother Details</h6>
            </div>
            <div className="col-12 tw-flex tw-mb-4">
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
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Employee ID"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Mother's Name"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Employee Category"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Department"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Nationality"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <PhoneInput
                    name="phoneNumber"
                    labelText="Phone No."
                    value={fatherDetailsForm.values.phoneNumber}
                    onChange={() => { }}
                    invalid={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? true : false}
                    error={(fatherDetailsForm.touched.phoneNumber && fatherDetailsForm.errors.phoneNumber) ? fatherDetailsForm.errors.phoneNumber : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextIconInput
                    name="mailId"
                    labelText="Email ID"
                    value={fatherDetailsForm.values.mailId}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? true : false}
                    error={(fatherDetailsForm.touched.mailId && fatherDetailsForm.errors.mailId) ? fatherDetailsForm.errors.mailId : ""}
                ><i className="ri-mail-unread-line"></i></TextIconInput>
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Office Afddress"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Annual Income"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Aadhar / Passport No."
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Qualification"
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
                />
            </div>
            <div className="tw-col-span-4">
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
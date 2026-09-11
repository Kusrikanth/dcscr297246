import React, { useState } from "react";
import { Label, Input } from "reactstrap";
import { useFormik } from 'formik';
import * as Yup from "yup";
//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput } from "../../../../../Components/Common";



const validationSchema = Yup.object().shape({

});

function getGaurdianDetail(fatherDetail?: any): any {
    return ({
        id: "",
    })
}

export default function GuardianDetail(props: any) {
    const [guardianDetailState, setGuardianDetailState] = useState<any>(getGaurdianDetail());
    const fatherDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: guardianDetailState,
        validationSchema,
        onSubmit: (values) => {
        },
    });
    return (
        <React.Fragment>
            <div className="tw-col-span-12 tw-mb-2">
                <h6 className="tw-mb-1 tw-me-2">Guardian Details</h6>
            </div>
            <div className="tw-col-span-4">
                <SelectInput
                    name="branchTypeId"
                    labelText="Relationship with Student"
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
                <TextInput
                    name="id"
                    labelText="Guardian Name"
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
                    labelText="Designation"
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
                    labelText="Aadhar / Passport No."
                    value={fatherDetailsForm.values.id}
                    onChange={fatherDetailsForm.handleChange}
                    invalid={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? true : false}
                    error={(fatherDetailsForm.touched.id && fatherDetailsForm.errors.id) ? fatherDetailsForm.errors.id : ""}
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

        </React.Fragment>

    )
}
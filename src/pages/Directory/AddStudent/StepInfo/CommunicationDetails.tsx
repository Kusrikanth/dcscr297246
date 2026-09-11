import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput, RadioInputContainer } from "../../../../Components/Common";
//Helper
import { yesNoOptions } from "./helper";


const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        id: "",
    })
}

export const CommunicationDetails: React.FC<any> = (props) => {
    const [communicationState, setCommunicationState] = useState<any>(getStudentData());
    const studentInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: communicationState,
        validationSchema,
        onSubmit: (values) => {
        },
    });
    return (
        <div className="row">
            <div className="col-12">
                <h5 className="mb-3 d-inline-block text-underline-blue">Residential Address</h5>
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="H.No / Flat No"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Location / Landmark"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="City"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="State"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="PIN Code"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Country"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="col-12">
                <TextInput
                    name="id"
                    labelText="Full Address"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="col-12">
                <h5 className="mb-3 d-inline-block text-underline-blue">Permanent Address</h5>
            </div>
            <div className="col-12">
                <RadioInputContainer
                    name="scholasticType"
                    labelText="Is Permanent Address is same as Correspondence Address ?"
                    containerClassName="d-flex"
                    labelClassName="mb-0 me-3"
                    radioOptions={yesNoOptions}
                    value={studentInfoForm.values.scholasticType}
                    onChange={studentInfoForm.handleChange}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="H.No / Flat No"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Location / Landmark"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="City"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="State"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="PIN Code"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-4">
                <TextInput
                    name="id"
                    labelText="Country"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-12">
                <TextInput
                    name="id"
                    labelText="Full Address"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>
            <div className="col-12 text-end mt-2">
                <button type="submit" className="btn btn-soft-success me-2">
                    Previous
                </button>
                <button type="submit" className="btn btn-success">
                    Proceed
                </button>
            </div>
        </div>
    )
}
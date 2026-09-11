import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { Label, Input } from "reactstrap";
//Common Component
import {  TextInput } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";


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
        <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-12">
                <h6 className="tw-mb-2">{props.titleName || "Residential Address"}</h6>
            </div>
            <div className="tw-col-4">
                <TextInput
                    name="id"
                    labelText="H.No / Flat No"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-4">
                <TextInput
                    name="id"
                    labelText="Location / Landmark"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-4">
                <TextInput
                    name="id"
                    labelText="City"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-4">
                <TextInput
                    name="id"
                    labelText="State"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-4">
                <TextInput
                    name="id"
                    labelText="PIN Code"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-4">
                <TextInput
                    name="id"
                    labelText="Country"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-12">
                <TextInput
                    name="id"
                    labelText="Full Address"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-12">
                <h6 className="tw-mb-2">Permanent Address</h6>
            </div>
            <div className="tw-col-span-12">
                <div className="tw-flex tw-mb-3 tw-items-center">
                    <Label htmlFor="subjectType" className="tw-mb-0 tw-mr-2">
                        Is Permanent Address is same as Correspondence Address ?
                    </Label>
                    <div className="tw-flex tw-items-center">
                        <div className="tw-flex tw-items-center tw-mr-2">
                            <Input className="form-check-input" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                            <Label className="form-check-label" htmlFor="formradioRight5">
                                Yes
                            </Label>
                        </div>
                        <div className="tw-flex tw-items-center">
                            <Input className="form-check-input" type="radio" name="formradiocolor1" id="formradioRight5" defaultChecked />
                            <Label className="form-check-label" htmlFor="formradioRight5">
                                No
                            </Label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="H.No / Flat No"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Location / Landmark"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="City"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="State"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="PIN Code"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-4">
                <TextInput
                    name="id"
                    labelText="Country"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-12">
                <TextInput
                    name="id"
                    labelText="Full Address"
                    value={studentInfoForm.values.id}
                    onChange={studentInfoForm.handleChange}
                    invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                    error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                />
            </div>

            <div className="tw-col-span-12 tw-text-right tw-mt-2">
                <Button type="submit" variant="previous">
                    Previous
                </Button>
                <Button type="submit" variant="primary">
                    Proceed
                </Button>
            </div>
        </div>
    )
}
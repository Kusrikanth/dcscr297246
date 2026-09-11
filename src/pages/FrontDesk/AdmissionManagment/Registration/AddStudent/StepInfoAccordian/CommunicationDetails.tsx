import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput, RadioInputContainer } from "../../../../../../Components/Common";
//Helper
import { yesNoOptions } from "./helper";


const validationSchema = Yup.object().shape({

});

function getStudentData(studentDetails?: any): any {
    return ({
        houseNo: "",
        location: "",
        country: "",
        state: "",
        city: "",
        pinCode: "",
        area: "",
        distanceFromSchool: ""
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
        <React.Fragment>
            <form id="student-info-form" onSubmit={(e) => e.preventDefault()}>
                <div className="row">
                    <div className="col-12 mb-3">
                        <div className="border-bottom">
                            <h5>3. Communication Details</h5>
                        </div>

                    </div>
                </div>

                <UncontrolledAccordion open={["sibling-details"]} stayOpen>
                    <AccordionItem>
                        <AccordionHeader tag="h4" targetId="sibling-details">
                            Residential Address
                        </AccordionHeader>
                        <AccordionBody accordionId="sibling-details">
                            <div className="row">
                                <div className="col-4">
                                    <TextInput
                                        name="houseNo"
                                        labelText="House/Flat no"
                                        value={studentInfoForm.values.houseNo}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.houseNo && studentInfoForm.errors.houseNo) ? true : false}
                                        error={(studentInfoForm.touched.houseNo && studentInfoForm.errors.houseNo) ? studentInfoForm.errors.houseNo : ""}
                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="location"
                                        labelText="Location / Landmark"
                                        value={studentInfoForm.values.location}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.location && studentInfoForm.errors.location) ? true : false}
                                        error={(studentInfoForm.touched.location && studentInfoForm.errors.location) ? studentInfoForm.errors.location : ""}
                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="country"
                                        labelText="Country"
                                        value={studentInfoForm.values.country}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.country && studentInfoForm.errors.country) ? true : false}
                                        error={(studentInfoForm.touched.country && studentInfoForm.errors.country) ? studentInfoForm.errors.country : ""}
                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="state"
                                        labelText="State"
                                        value={studentInfoForm.values.state}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.state && studentInfoForm.errors.state) ? true : false}
                                        error={(studentInfoForm.touched.state && studentInfoForm.errors.state) ? studentInfoForm.errors.state : ""}
                                    />
                                </div>
                                <div className="col-4">
                                    <TextInput
                                        name="city"
                                        labelText="City"
                                        value={studentInfoForm.values.city}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.city && studentInfoForm.errors.city) ? true : false}
                                        error={(studentInfoForm.touched.city && studentInfoForm.errors.city) ? studentInfoForm.errors.city : ""}
                                    />
                                </div>

                                <div className="col-4">
                                    <TextInput
                                        name="pinCode"
                                        labelText="PIN Code"
                                        value={studentInfoForm.values.pinCode}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.pinCode && studentInfoForm.errors.pinCode) ? true : false}
                                        error={(studentInfoForm.touched.pinCode && studentInfoForm.errors.pinCode) ? studentInfoForm.errors.pinCode : ""}
                                    />
                                </div>
                                <div className="col-4">
                                    <SelectInput
                                        name='area'
                                        valueKey='text'
                                        textKey='text'
                                        menuItems={[{ text: 'Area' }]}
                                        value={studentInfoForm.values.area}
                                        onChange={studentInfoForm.handleChange}
                                        formgroupClassName="pe-5"
                                        isDisabled={true}
                                        inputClassName={"border-0"}
                                        labelText="Area"
                                    />
                                </div>
                                <div className="col-4">
                                    <SelectInput
                                        name='distanceFromSchool'
                                        valueKey='text'
                                        textKey='text'
                                        menuItems={[{ text: '10-20km' }]}
                                        value={studentInfoForm.values.distanceFromSchool}
                                        onChange={studentInfoForm.handleChange}
                                        formgroupClassName="pe-5"
                                        isDisabled={true}
                                        inputClassName={"border-0"}
                                        labelText="Distance from School"
                                    />
                                </div>
                            </div>
                        </AccordionBody>
                    </AccordionItem>
                    <AccordionItem>
                        <AccordionHeader tag="h4" targetId="sibling-details">
                            Permanent Address
                        </AccordionHeader>
                        <AccordionBody accordionId="sibling-details">
                            <div className="row">
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
                                        name="country"
                                        labelText="Country"
                                        value={studentInfoForm.values.country}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.country && studentInfoForm.errors.country) ? true : false}
                                        error={(studentInfoForm.touched.country && studentInfoForm.errors.country) ? studentInfoForm.errors.country : ""}
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
                                        labelText="PIN Code"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
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
                        <button onClick={() => { }} className="btn btn-success">
                            Next
                        </button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}
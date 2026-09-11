
import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

//Common Component
import { ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput, RadioInputContainer } from "../../../../Components/Common";
//Helper
import { yesNoOptions } from "./helper";
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
        <React.Fragment>
            <form id="student-info-form" onSubmit={(e) => e.preventDefault()}>
                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12 tw-mb-3">
                        <div className="tw-border-b tw-pb-2">
                            <h5 className="tw-text-lg tw-font-semibold">
                                4. Communication Details
                            </h5>
                        </div>

                    </div>
                </div>

                <UncontrolledAccordion open="sibling-details" defaultOpen={["sibling-details"]} stayOpen>
                    <AccordionItem>
                        <AccordionHeader tag="h4" targetId="sibling-details">
                            Residential Address
                        </AccordionHeader>
                        <AccordionBody accordionId="sibling-details">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="H.No / Flat No"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="Location / Landmark"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="country"
                                        labelText="Country"
                                        value={studentInfoForm.values.country}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.country && studentInfoForm.errors.country) ? true : false}
                                        error={(studentInfoForm.touched.country && studentInfoForm.errors.country) ? studentInfoForm.errors.country : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="State"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="City"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
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
                    <AccordionItem>
                        <AccordionHeader tag="h4" targetId="sibling-details">
                            Permanent Address
                        </AccordionHeader>
                        <AccordionBody accordionId="sibling-details">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                <div className="tw-col-span-12">
                                    <RadioInputContainer
                                        name="scholasticType"
                                        labelText="Is Permanent Address is same as Correspondence Address ?"
                                        containerClassName="tw-grid tw-grid-cols-12 tw-items-center"
                                        labelClassName="tw-col-span-12 md:tw-col-span-6 tw-mb-2 md:tw-mb-0"
                                        radioOptions={yesNoOptions}
                                        value={studentInfoForm.values.scholasticType}
                                        onChange={studentInfoForm.handleChange}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="H.No / Flat No"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={studentInfoForm.touched.id && studentInfoForm.errors.id ? true : false}
                                        error={studentInfoForm.touched.id && studentInfoForm.errors.id ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="Location / Landmark"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={studentInfoForm.touched.id && studentInfoForm.errors.id ? true : false}
                                        error={studentInfoForm.touched.id && studentInfoForm.errors.id ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="country"
                                        labelText="Country"
                                        value={studentInfoForm.values.country}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={studentInfoForm.touched.country && studentInfoForm.errors.country ? true : false}
                                        error={studentInfoForm.touched.country && studentInfoForm.errors.country ? studentInfoForm.errors.country : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="State"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                    <TextInput
                                        name="id"
                                        labelText="City"
                                        value={studentInfoForm.values.id}
                                        onChange={studentInfoForm.handleChange}
                                        invalid={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? true : false}
                                        error={(studentInfoForm.touched.id && studentInfoForm.errors.id) ? studentInfoForm.errors.id : ""}
                                    />
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-4">
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
                <div className="tw-grid tw-grid-cols-12 tw-mt-3">
                    <div className="tw-col-span-12 tw-text-right tw-mt-2">
                        <Button
                            type="submit"
                            variant="secondary"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={() => { }}
                            variant="primary"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}
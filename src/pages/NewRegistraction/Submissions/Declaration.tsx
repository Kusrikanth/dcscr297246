import { useContext, useEffect } from "react";
import { AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik, setNestedObjectValues } from "formik";
import * as Yup from "yup";
import {
    TextInput, InputCheckboxUpdated, TextArea, SelectInput
} from "../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper

import { StepperFormContext } from "../helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getCountryStateAct, getStateCityAct,
    setCountryStateAct, setStateCityAct
} from "../../../store/masterdata/masterdataactions";
import { relationType } from "./helper";

// Ol state
// function getInitialState(initialState: any) {
//     return {
//         currentAddress: "Dummy address",
//         houseNo: initialState?.houseNo || "Current house",
//         landmark: initialState?.landmark || "Landmark",
//         country: initialState?.country || "1",
//         state: initialState?.state || "1",
//         city: initialState?.city || "1",
//         pinCode: initialState?.pinCode || "1"
//     }
// }

function getInitialState(initialState?: any) {
    return {
        isDeclared: false,
        relationshipWithStudent: "",
        relationshipWithStudentSignature: "",
    }
}

const validationSchema = Yup.object().shape({
    relationshipWithStudent: Yup.string().required("Select relation with student."),
    relationshipWithStudentSignature: Yup.string().required("Sign by entering your name."),
    isDeclared: Yup.bool().oneOf(
        [true],
        'Please accept the declaration.'
    ),

});

const initialValues = getInitialState();
export default function UploadDocuments({ formId, branchId, branchName, storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, instituteDetails } = useContext<any>(StepperFormContext);

    const declarationForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, values);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId))
            declarationForm.handleSubmit();
    }, [currentMultiFormKeys]);

    return (
        <form onSubmit={declarationForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                Declaration
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <ul className="guideline-container">
                    {(+branchId === 15 || +branchId === 16) ? <>
                        <li>
                            I hereby declare that name of my ward,date of birth,our names(Father and
                            mother) mentioned in the form are correct to the best of our knowledge.
                        </li>
                        <li>
                            Names mentioned above are as per the Birth certificate and Aadhar card.
                        </li>
                        <li>
                            I am aware that Registration Fee 500/- is non refundable. Obtaining application form/applying online does not imply admission. Admission is subject to availability of seats and eligibility of the student.
                        </li>
                        <li>
                            Age criteria may be relaxed or modified based on the norms set by state/
                            cbse from time to time. I will abide by the admission norms.
                        </li>
                        <li className="tw-font-semibold">
                            In case of withdrawal of admission, I am aware that I am not entitled
                            for refund of any fee deposited, irrespective of when my ward was
                            admitted. I abide to pay fee dues if any.
                        </li>
                        <li>
                            {instituteDetails?.shortName} does not have inter branch transfer
                            policy.
                        </li>
                        <li className="tw-hidden">
                            In the case of residential admission, I understand that after admission
                            confirmation, request for day schooling is not entertained during the
                            academic year.
                        </li>
                        <li>
                            Request for changing from Cambridge International curriculum to CBSE is
                            not accepted after registration and confirmation of admission.
                        </li>
                        <li>
                            Requests for transfer certificates will be considered only if made by
                            both parents. For single parents, a request from the legal custodian
                            will be considered.
                        </li>
                        <li>
                            In case of any damage/loss caused to the school property by my ward, the
                            damage charges will be paid to the school to the extent of the cost
                            applicable.
                        </li>
                        <li>
                            The school reserves the right to expel my ward anytime, including the
                            final external examination period for indulging in any act of gross
                            misconduct/indiscipline and on that cause any action taken by the school
                            or any matter concerning, with my ward will be final and binding on me.
                        </li>
                        <li className="tw-font-semibold">
                            {instituteDetails?.shortName} {branchName} plies school buses on the
                            fixed routes with limited stops. It will not be obligatory on the part
                            of the school authorities to make new bus stops. It will be the sole
                            responsibility of us to escort the pupil to and fro from the respective
                            bus stop. I am aware that the routes and stops are subject to changes
                            and no request for pick up /drop of my ward other than the designated
                            point and no request for travelling other than the designated route is
                            accepted.
                        </li>
                        <li>
                            I do understand that programming and philosophy of education at{" "}
                            {instituteDetails?.shortName} is to emphasize overall development of the
                            child along with sports, excursions and other co-curricular activities
                            besides academics. I shall permit my ward to participate and fully
                            cooperate with the school in this regard.
                        </li>
                        <li>I have no objection in receiving SMS from Digital Caampus.</li>
                        <li>
                            I acknowledge that school activities will be shared on social media. I
                            have no objection to my child's involvement in school-related activities
                            being shared on the website or social media.
                        </li>
                        <li>
                            I abide by the given fee structure . I am aware that there is a
                            different fee structure within the class and also aware that it is
                            subject to revision every year. I abide to pay the fee in time.
                        </li>
                        <li>
                            I abide to submit my ward's Transfer Certificate and copy of annual
                            academic report card within the time stipulated by school for
                            ratification of my ward's admission.
                        </li>
                        <li>
                            I assure that the information provided in this application form is
                            correct to the best of my knowledge and belief. I will not request for
                            correction/changes in name of my ward/ in our (parents) names and date
                            of birth of my ward. I promise to abide by the school rules and
                            regulations and abide by any change of school
                            timing,programmes,planning,etc.
                        </li>
                    </> : <>
                        <li>I hereby declare that name of my ward,date of birth,our names(Father and mother) mentioned in the form are correct to the best of our knowledge.</li>
                        <li>Names mentioned above are as per the Birth certificate and Aadhar card.</li>
                        <li>
                            Age criteria may be relaxed or modified based on the norms set by state/ cbse from time to time. I will abide by the admission norms.
                        </li>
                        <li>In case of withdrawal of admission, I am aware that I am not entitled for refund of any fee deposited, irrespective of when my ward was admitted. I abide to pay fee dues if any.</li>
                        <li>{instituteDetails?.shortName} does not have inter branch transfer policy.</li>
                        <li>In the case of residential admission, I understand that after admission confirmation, request for day schooling is not entertained during the academic year.</li>
                        <li>Request for changing from Cambridge International curriculum to CBSE is not accepted after registration and confirmation of admission.</li>
                        <li>Requests for transfer certificates will be considered only if made by both parents. For single parents, a request from the legal custodian will be considered.</li>
                        <li>In case of any damage/loss caused to the school property by my ward, the damage charges will be paid to the school to the extent of the cost applicable.</li>
                        <li>The school reserves the right to expel my ward anytime, including the final external examination period for indulging in any act of gross misconduct/indiscipline and on that cause any action taken by the school or any matter concerning, with my ward will be final and binding on me.</li>
                        <li>{instituteDetails?.shortName} {branchName} plies school buses on the fixed routes with limited stops. It will not be obligatory on the part of the school authorities to make new bus stops. It will be the sole responsibility of us to escort the pupil to and fro from the respective bus stop. I am aware that the routes and stops are subject to changes and no request for pick up /drop of my ward other than the designated point and no request for travelling other than the designated route is accepted.</li>
                        <li>I do understand that programming and philosophy of education at {instituteDetails?.shortName} is to emphasize overall development of the child along with sports, excursions and other co-curricular activities besides academics. I shall permit my ward to participate and fully cooperate with the school in this regard.</li>
                        <li>I have no objection in receiving SMS from School.</li>
                        <li>I acknowledge that school activities will be shared on social media. I have no objection to my child's involvement in school-related activities being shared on the website or social media.</li>
                        <li>I abide by the given fee structure . I am aware that there is a different fee structure within the class and also aware that it is subject to revision every year. I abide to pay the fee in time.</li>
                        <li>I abide to submit my ward's Transfer Certificate and copy of annual academic report card within the time stipulated by school for ratification of my ward's admission.</li>
                        <li>I assure that the information provided in this application form is correct to the best of my knowledge and belief. I will not request for correction/changes in name of my ward/ in our (parents) names and date of birth of my ward. I promise to abide by the school rules and regulations and abide by any change of school timing,programmes,planning,etc.</li>
                    </>}
                </ul>
                <InputCheckboxUpdated
                    formgroupClassName="tw-mb-0"
                    name="isDeclared"
                    labelName="Having read carefully the above details, I hereby accept and endorse the above declarations."
                    value={declarationForm.values.isDeclared}
                    onChange={declarationForm.handleChange}
                    invalid={(declarationForm.touched.isDeclared && declarationForm.errors.isDeclared) ? true : false}
                    error={(declarationForm.touched.isDeclared && declarationForm.errors.isDeclared) ? declarationForm.errors.isDeclared : ""}
                />
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-4 tw-justify-between">
                    <div className="tw-col-span-12 lg:tw-col-span-3">
                        <SelectInput
                            name="relationshipWithStudent"
                            labelText="Relation with Student"
                            labelClass="required"
                            inputClassName="ng-input"
                            value={declarationForm.values.relationshipWithStudent}
                            onChange={declarationForm.handleChange}
                            menuItems={relationType}
                            valueKey="id"
                            textKey="name"
                            invalid={(declarationForm.touched.relationshipWithStudent && declarationForm.errors.relationshipWithStudent) ? true : false}
                            error={(declarationForm.touched.relationshipWithStudent && declarationForm.errors.relationshipWithStudent) ? declarationForm.errors.relationshipWithStudent : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 lg:tw-col-span-4">
                        <TextArea
                            name="relationshipWithStudentSignature"
                            labelText="Signature"
                            labelClass="required"
                            value={declarationForm.values.relationshipWithStudentSignature}
                            onChange={declarationForm.handleChange}
                            onBlur={declarationForm.handleBlur}
                            inputClassName="resize-none"
                            invalid={(declarationForm.touched.relationshipWithStudentSignature && declarationForm.errors.relationshipWithStudentSignature) ? true : false}
                            error={(declarationForm.touched.relationshipWithStudentSignature && declarationForm.errors.relationshipWithStudentSignature) ? declarationForm.errors.relationshipWithStudentSignature : ""}
                        />
                    </div>
                </div>


            </AccordionBody>
        </form>
    )
}
import { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik, setNestedObjectValues } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex
} from "../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper

import { StepperFormContext } from "../helper";
import { scheduledMode } from "./helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getDistrictAct,
} from "../../../store/masterdata/masterdataactions";
import {
    generateRegistrationOtpAct, verifyRegistrationOtpAct
} from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { toast } from "react-toastify";
import {
    getBranchClassAct
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";

function getInitialState(initialState?: any) {
    return {
        scheduleMode: "",
        isOTPVerified: true,
        otpNumber: ""
    }
}

const validationSchema = Yup.object().shape({
    scheduleMode: Yup.string().required("Select scheduled mode."),
    // otpNumber: Yup.number().typeError("Enter valid number.").required("OTP is required."),
    // isOTPVerified: Yup.bool().oneOf(
    //     [true],
    //     'Please verify your otp.'
    // ),

});

const initialValues = getInitialState();
const physicalDistrictName = ["Hyderabad", "Rangareddy"];
export default function Undertaking({ stepId, formId, branchId, branchName, schoolName, storeMultiFormDataCallback }: any) {
    const { tabsData, currentMultiFormKeys, studentId, updateFormKeyDataHndlr,
        requestedMultiFormKeys, instituteDetails } = useContext<any>(StepperFormContext);
    const requestedResidentialAddress = useRef<any>(false);
    const [disableInterviewType, setDisableInterviewType] = useState(false);
    const [classFourthRegType, setClassFourthRegType] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const dispatch = useAppDispatch();
    const { branchClassResp, districtResp, generateRegistrationOtpResp, applicationSaleByApplicationNo,
        verifyRegistrationOtpResp } =
        useAppSelector(({ admissionRegistration, masterData, applicationSale, branchAcademics }) => ({
            generateRegistrationOtpResp: admissionRegistration.generateRegistrationOtpResp,
            districtResp: masterData.districtResp,
            applicationSaleByApplicationNo: applicationSale.applicationSaleByApplicationNo,
            branchClassResp: branchAcademics.branchClassResp,
            verifyRegistrationOtpResp: admissionRegistration.verifyRegistrationOtpResp
        }), shallowEqual);

    const undertakingRespRef = useRef({
        prevDistrictResp: districtResp,
        prevBranchClassResp: branchClassResp,
        prevApplicationSaleByApplicationNo: undefined,
        prevGenerateRegistrationOtpResp: generateRegistrationOtpResp,
        prevVerifyRegistrationOtpResp: verifyRegistrationOtpResp
    });



    useEffect(() => {
        const { prevGenerateRegistrationOtpResp, prevDistrictResp, prevApplicationSaleByApplicationNo,
            prevBranchClassResp, prevVerifyRegistrationOtpResp } = undertakingRespRef.current;
        if (generateRegistrationOtpResp && prevGenerateRegistrationOtpResp !== generateRegistrationOtpResp) {
            toast.success("OTP generated successfully and sended to your registered mail and phone.");
        } else if (applicationSaleByApplicationNo && prevApplicationSaleByApplicationNo !== applicationSaleByApplicationNo) {
            if (Array.isArray(applicationSaleByApplicationNo) && applicationSaleByApplicationNo.length > 0) {
                const { saleFormDetails } = applicationSaleByApplicationNo[0],
                    { countryId, stateId } = saleFormDetails || {};
                dispatch(getDistrictAct(generateActionPayload("get_state_district", undefined, { countryId, stateId })));
            }
        } else if (districtResp && prevDistrictResp !== districtResp) {
            const { data } = districtResp,
                { saleFormDetails } = applicationSaleByApplicationNo[0],
                { districtId } = saleFormDetails || {};
            if (Array.isArray(data)) {
                const { districtName } = data.find(item => item?.districtId?.toString() === districtId?.toString()) || {};
                if (districtName && physicalDistrictName.includes(districtName)) {
                    setDisableInterviewType(true);
                    undertakingForm.setValues(prevState => ({ ...prevState, scheduleMode: "PHYSICAL" }));
                }
            }
        }
        else if (branchClassResp && prevBranchClassResp !== branchClassResp) {
            const { content } = branchClassResp,
                { studentProfile } = tabsData || {},
                { admissionSoughtId } = studentProfile || {};
            if (Array.isArray(content)) {
                const classSequenceNo = content.find(item => item.id === +admissionSoughtId)?.classSequence,
                    fourthClassSequencNo = content.find(item => item.className?.toLowerCase() === "fourth class")?.classSequence;
                if (+classSequenceNo < +fourthClassSequencNo) {
                    setClassFourthRegType("below");
                } else {
                    setClassFourthRegType("above");
                }

            }
        } else if (verifyRegistrationOtpResp && prevVerifyRegistrationOtpResp !== verifyRegistrationOtpResp) {
            undertakingForm.setFieldValue("isOTPVerified", true);
            toast.success("Otp verified successfully.");
        }
        undertakingRespRef.current.prevGenerateRegistrationOtpResp = generateRegistrationOtpResp;
        undertakingRespRef.current.prevBranchClassResp = branchClassResp;
        undertakingRespRef.current.prevDistrictResp = districtResp;
        undertakingRespRef.current.prevVerifyRegistrationOtpResp = verifyRegistrationOtpResp;
        undertakingRespRef.current.prevApplicationSaleByApplicationNo = applicationSaleByApplicationNo;
    }, [branchClassResp, districtResp, applicationSaleByApplicationNo, generateRegistrationOtpResp, verifyRegistrationOtpResp]);

    useEffect(() => {
        const { studentProfile } = tabsData || {};
        if (studentProfile) {
            const { curriculumSoughtId } = studentProfile;
            getClassApiCall(curriculumSoughtId);
        }
    }, [tabsData, stepId]);

    function getClassApiCall(curriculumId: string) {
        if (curriculumId) {
            const classParams = {
                branchId, pageNo: 0, pageSize: 100, sortBy: "className",
                orderBy: "asc", curriculumId: curriculumId
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, classParams)));
        }
    }

    const undertakingForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, values);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            undertakingForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);


    useEffect(() => {
        if (Array.isArray(requestedMultiFormKeys) && requestedMultiFormKeys.includes("residentialAddress")) {
            undertakingForm.validateForm().then(formKeys => {
                if (Object.keys(formKeys).length === 0) {
                    updateFormKeyDataHndlr("residentialAddress", undertakingForm.values);
                    requestedResidentialAddress.current = true
                } else {
                    undertakingForm.setTouched(setNestedObjectValues<any>(formKeys, true));
                }
            })
        }
    }, [requestedMultiFormKeys]);

    function requestOtpHandler(event: any) {
        event.preventDefault();
        const params = { studentRegNo: studentId };
        dispatch(generateRegistrationOtpAct(generateActionPayload("request_registrationotp", params)));
    }

    function verifyOtpHandler() {
        const params = {
            studentRegNo: studentId,
            otp: undertakingForm.values.otpNumber
        }
        dispatch(verifyRegistrationOtpAct(generateActionPayload("verify_registrationotp", params)));
    }

    return (
        <form onSubmit={undertakingForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                UNDERTAKING
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <ul className="guideline-container">
                    <li>I do hereby agree and declare that:</li>
                </ul>
                <ol className="orderguideline-container">
                    <li>
                        My ward studying in class of {schoolName},{" "}
                        {branchName} may be permitted to take part in Inter School Sports or Co-curricular
                        competition /any camp / course / adventure / training /
                        treks / swimming / NCC / mountaineering / rock climbing / hiking / skating / cycling /
                        horse riding /yoga/ field trips/Excursions/or any adventure activities which involve risk,
                        organized by the school for the students’ practice / show / competition at all levels.
                        I undertake and agree to hold the school and its staff indemnified against all such claims
                        that may arise out of any loss or fatal injury to the property or person which my
                        ward may suffer while or in consequence of participation in any such activity. </li>
                    <li>
                        I understand that the school shall take all possible efforts to ensure the safety
                        of my child in the school /school bus/ hostel. In spite of their efforts,
                        in the unfortunate event of any injury/harm/accident/loss of life during
                        the course of stay of my child in school /school bus/ hostel, I shall
                        not hold the school or the authorities responsible for the same.
                    </li>
                    <li>I understand that the school mess is an optional facility and is outsourced to an agent. Though school shall take all precautions of food safety and hygiene, however in case of any health ailments arising due to this facility,
                        I shall not hold the school or the authorities responsible for the same.
                    </li>
                </ol>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3">
                    <div className="tw-col-span-12 lg:tw-col-span-5">
                        {(classFourthRegType === "below") &&
                            (<label className="form-label tw-mb-0 tw-font-bold">
                                Child observation and Parent interaction process will be initiated.  Please select one of the option for interaction.
                            </label>)}
                        {(classFourthRegType === "above") &&
                            (<label className="form-label tw-mb-0 tw-font-bold">
                                Scholastic analysis process will be initiated. Please select one of the option for interaction.
                            </label>)}
                    </div>
                    <div className="tw-col-span-12 lg:tw-col-span-3">
                        <SelectInput
                            formgroupClassName="tw-flex tw-flex-col"
                            name="scheduleMode"
                            inputClassName="ng-input"
                            menuItems={scheduledMode}
                            valueKey="id"
                            textKey="name"
                            isDisabled={disableInterviewType}
                            value={undertakingForm.values.scheduleMode}
                            onChange={undertakingForm.handleChange}
                            onBlur={undertakingForm.handleBlur}
                            invalid={(undertakingForm.touched.scheduleMode && undertakingForm.errors.scheduleMode) ? true : false}
                            error={(undertakingForm.touched.scheduleMode && undertakingForm.errors.scheduleMode) ? undertakingForm.errors.scheduleMode : ""}
                        />
                    </div>

                </div>
                {/* 
                {undertakingForm.values.isOTPVerified ? <>
                    <div className="row justify-content-center">
                        <div className="col-12 text-center">
                            <span className="text-success">Mobile number verified.</span>
                        </div>
                    </div>
                </> : (<>
                    <div className="d-flex justify-content-center mb-2">
                        <a href="#" onClick={requestOtpHandler} className="form-label text-decoration-underline text-green cursor-pointer">Request OTP</a>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-12 col-lg-4 d-flex flex-column flex-lg-row gap-3 gap-lg-0">
                            <TextInput
                                formgroupClassName="mb-0 flex-grow-1 me-lg-3"
                                name="otpNumber"
                                inputClassName="ng-input"
                                placeHolder="Enter OTP"
                                value={undertakingForm.values.otpNumber}
                                onChange={undertakingForm.handleChange}
                                invalid={(undertakingForm.touched.otpNumber && undertakingForm.errors.otpNumber) ? true : false}
                                error={(undertakingForm.touched.otpNumber && undertakingForm.errors.otpNumber) ? undertakingForm.errors.otpNumber : ""}
                            />
                            <button type="button" className="btn btn-orange btn-dc"
                                onClick={verifyOtpHandler}
                                disabled={!undertakingForm.values.otpNumber}
                            >Verify</button>
                        </div>
                        {(undertakingForm.touched.isOTPVerified && undertakingForm.errors.isOTPVerified)
                            && <div className="col-12 text-lg-center">
                                <span className="invalid-feedback d-block">
                                    {undertakingForm.errors.isOTPVerified}
                                </span>
                            </div>}
                    </div></>)}
 */}




            </AccordionBody>
        </form >
    )
}
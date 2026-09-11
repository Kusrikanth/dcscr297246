import { useEffect, useRef, useState } from "react";
import frame from "../../assets/images/frame.png";
import tcImg from "../../assets/images/tc-img.webp";
import { FullPageLoader, ModalContainerUpdated, RadioInputContainer, TextInput } from "../../Components/Common";
import "./_tctracking.scss";
import { useFormik } from "formik";
import NoResult from "./NoResult";
import { removeLocalStorage, setLocalStorage } from "../../utility/storageUtility";
import { generateTokenForUserAct, saveDownloadTcLogsAct, validateStuTcRequestAct, verifyTcRequestOtpAct } from "../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";
import HeaderLoginImg from "../../assets/imagesdps/authiconV1/dc-dark-logo.png";
import { toast } from "react-toastify";
import * as Yup from "yup";
import Result from "./Result";
import VerifyOtpModal from "./VerifyOtpModal";
import { useModal } from "../../hooks/modalhook";
import { getNameFromFilter, tcBranchFilterOptions, tcStudentFilterOptions } from "./helper";
import { setTcTrackingStuAct } from "../../store/appdata/appdataslice";
import Email from "../../assets/imagesdps/authiconV1/login-2.png";
import { WHATSAPP_LINK } from "../../Components/constants/common";
import Button from "../../Components/Common/Button";

const initialValues = {
    tcBranchFilter: "AFFILIATION_CODE",
    branchIdentifier: "",
    tcStudentFilter: "STUDENT_CODE",
    studentIdentifier: "",
}

const validationSchema = Yup.object().shape({
    branchIdentifier: Yup.string().required('Branch is required'),
    studentIdentifier: Yup.string().required('Student is required'),
})

export type ITcStepperTypes = "verification" | "result" | "noresult"
const TCTracking = () => {

    const dispatch = useAppDispatch();
    const [stepper, setStepper] = useState<ITcStepperTypes>("verification");
    const [otpValue, setOtpValue] = useState<string>("");
    const { closeModal: closeOtpModal, modalState: otpModalState, openModal: openOtpModal } = useModal()

    const {
        generateTokenForUserResp,
        applicationSaleError,
        showApiLoader,
        tcTrackingStuResp,
        validateStuTcRequestResp,
        verifyTcRequestOtpResp,
        verifyTcRequestOtpError,
    } = useAppSelector(
        ({ applicationSale, globalData, appData }) => ({
            showApiLoader: globalData.showApiLoader,
            generateTokenForUserResp: applicationSale.generateTokenForUserResp,
            applicationSaleError: applicationSale.applicationSaleError,
            validateStuTcRequestResp: applicationSale.validateStuTcRequestResp,
            verifyTcRequestOtpResp: applicationSale.verifyTcRequestOtpResp,
            verifyTcRequestOtpError: applicationSale.verifyTcRequestOtpError,
            tcTrackingStuResp: appData.tcTrackingStuResp,
        }),
        shallowEqual
    );

    const tcTrackerRef = useRef({
        prevApplicationSaleError: applicationSaleError,
        prevValidateStuTcRequestResp: validateStuTcRequestResp,
        prevVerifyTcRequestOtpResp: verifyTcRequestOtpResp,
        prevVerifyTcRequestOtpError: verifyTcRequestOtpError,
    });

    useEffect(() => {
        const { prevValidateStuTcRequestResp, prevVerifyTcRequestOtpResp, prevVerifyTcRequestOtpError, prevApplicationSaleError } = tcTrackerRef.current || {}

        if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const { details } = applicationSaleError || {}
            tcTrackingForm.resetForm()
            toast.error(details || "Something went wrong. Please try again later.")
        } else if (validateStuTcRequestResp && prevValidateStuTcRequestResp !== validateStuTcRequestResp) {
            if (!otpModalState.showModal) {
                openOtpModal(validateStuTcRequestResp)
                toast.success("OTP has been successfully sent to your registered mobile number and email ID.")
            } else {
                toast.success("OTP has been resent successfully to your registered mobile number and email ID.")
            }
        } else if (verifyTcRequestOtpResp && prevVerifyTcRequestOtpResp !== verifyTcRequestOtpResp) {
            const { preparationStatus } = verifyTcRequestOtpResp || {}
            const { otpId, requestId } = validateStuTcRequestResp || {}
            if (!tcTrackingStuResp?.otp) {
                toast.success("OTP has been verified successfully.")
                dispatch(setTcTrackingStuAct({ otp: otpValue, otpId, requestId }))
            } else {
                const { otp, otpId, requestId } = tcTrackingStuResp || {}
                dispatch(setTcTrackingStuAct({ otp, otpId, requestId }))
            }
            closeOtpModal()
            tcTrackingForm.resetForm()
            if (preparationStatus?.toLowerCase() === "issued") {
                setStepper("result")
            } else {
                setStepper("noresult")
            }
        } else if (verifyTcRequestOtpError && prevVerifyTcRequestOtpError !== verifyTcRequestOtpError) {
            const { code, details } = verifyTcRequestOtpError || {}
            if (tcTrackingStuResp?.otp) {
                dispatch(setTcTrackingStuAct(undefined))
            }
            if (code === 406) {
                toast.error(details || "Invalid OTP. Please check and try again.")
            } else if (code === 410) {
                toast.error(details || "OTP Expired, Please Regenerate to proceed further.")
            } else if (code === 404) {
                toast.error(details || "No Request Found For OTP Verification")
            }
        }

        tcTrackerRef.current.prevValidateStuTcRequestResp = validateStuTcRequestResp;
        tcTrackerRef.current.prevVerifyTcRequestOtpResp = verifyTcRequestOtpResp;
        tcTrackerRef.current.prevVerifyTcRequestOtpError = verifyTcRequestOtpError;
        tcTrackerRef.current.prevApplicationSaleError = applicationSaleError;

    }, [validateStuTcRequestResp, verifyTcRequestOtpResp, verifyTcRequestOtpError, applicationSaleError])

    const initalAPICalls = () => {
        const { otp, otpId, requestId } = tcTrackingStuResp || {}
        if (otp && otpId && requestId) {
            dispatch(verifyTcRequestOtpAct(generateActionPayload("verify_tc_request_otp", undefined, { otpId, requestId, otp })));
        }
    }

    const tcTrackingForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            dispatch(validateStuTcRequestAct(generateActionPayload("validate_student_tc_request", undefined, values)));
        },
    })

    useEffect(() => {
        const formData = new FormData();
        formData.append("clientName","WEB")
        formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
        removeLocalStorage('accesstoken')
        dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
        return () => {
        }
    }, []);

    useEffect(() => {
        if (generateTokenForUserResp?.token) {
            setLocalStorage('accesstoken', generateTokenForUserResp.token);
            initalAPICalls();
        }
    }, [generateTokenForUserResp]);

    const filterHndler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "tcBranchFilter") {
            tcTrackingForm.setValues((prevValues) => ({
                ...prevValues,
                [name]: value, branchIdentifier: "",
            }))
        } else if (name === "branchIdentifier" || name === "studentIdentifier") {
            tcTrackingForm.setValues((prevValues) => ({
                ...prevValues,
                [name]: value
            }))
        } else if (name === "tcStudentFilter") {
            tcTrackingForm.setValues((prevValues) => ({
                ...prevValues,
                [name]: value, studentIdentifier: ""
            }))
        }
    }

    const downloadTcLogsApiCall = () => {
        const requestId = tcTrackingStuResp?.requestId || validateStuTcRequestResp?.requestId
        dispatch(saveDownloadTcLogsAct(generateActionPayload("save_download_tc_logs", { tcRequestId: requestId })));
    }

    const resetHndler = () => {
        dispatch(setTcTrackingStuAct(undefined))
        tcTrackingForm.resetForm()
    }

    return (
        <>
            {showApiLoader && <FullPageLoader />}
            <form className="tc-tracking-container" onSubmit={tcTrackingForm.handleSubmit}>
                <div className="logo-container">
                    <img src={HeaderLoginImg} className="logo" alt="logo" />
                </div>

                {stepper === "verification" && (
                    <main className="main-content-tracking">

                    <div className=" tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="content-logo-container-1 tw-col-span-12 lg:tw-col-span-8 tw-order-2 lg:tw-order-1">
                            <h1 className="title">Your Transfer Certificate is One OTP Away!</h1>
                            <p className="description">
                                We believe in providing you with a hassle-free experience when recovering your Transfer Certificate (TC).
                            </p>
                            <p className="instruction">
                                By verifying your school and student information, you will receive an OTP on your registered mobile number and email ID. This OTP will allow you to securely download the TC already issued by the school.
                            </p>
                            <p className="instruction">
                                For any further information or clarification, please feel free to reach out to the admissions team at the school.
                            </p>
                            <p className="instruction">
                                Have a great day!
                            </p>
                        </div>
                        <div className="content-logo-container-2 tw-col-span-12 lg:tw-col-span-4 tw-order-1 lg:tw-order-2 tw-flex sm:tw-justify-end lg:tw-justify-start tw-items-start">
                            <img src={tcImg} alt="frame" className="frame tw-rounded-md tw-w-full sm:tw-w-1/2 lg:tw-w-full" />
                        </div>
                        </div>

                        <div className="application-no-container">

                            <div className="heading tw-mb-3">
                                Provide the details below to download TC. (Hint: Check payment receipt for correct details)
                            </div>

                            <div className="tw-grid md:tw-grid-cols-2 tw-gap-6">

                                <div>
                                    <div className="tw-font-medium tw-mb-3 heading">
                                        Branch : <span className="tw-text-red-500">*</span>
                                    </div>
                                    <RadioInputContainer
                                        name="tcBranchFilter"
                                        formgroupClassName="tw-mb-2"
                                        inputContainerClassName="tw-mt-2"
                                        radioOptions={tcBranchFilterOptions}
                                        value={tcTrackingForm.values.tcBranchFilter}
                                        onChange={filterHndler}
                                    />
                                </div>

                                <div>
                                    <TextInput
                                        name="branchIdentifier"
                                        onChange={tcTrackingForm.handleChange}
                                        value={tcTrackingForm.values.branchIdentifier}
                                        inputClassName="tw-h-10"
                                        invalid={(tcTrackingForm.touched.branchIdentifier && tcTrackingForm.errors.branchIdentifier) ? true : false}
                                        placeHolder={`Please Enter ${getNameFromFilter(
                                            tcBranchFilterOptions,
                                            tcTrackingForm.values.tcBranchFilter
                                        )}`}
                                    />
                                </div>

                                <div>
                                    <div className="tw-font-medium tw-mb-2 heading">
                                        Student : <span className="tw-text-red-500">*</span>
                                    </div>
                                    <RadioInputContainer
                                        name="tcStudentFilter"
                                        formgroupClassName="tw-mb-2"
                                        inputContainerClassName="tw-mt-2"
                                        radioOptions={tcStudentFilterOptions}
                                        value={tcTrackingForm.values.tcStudentFilter}
                                        onChange={filterHndler}
                                    />
                                </div>
                                <div>
                                    <TextInput
                                        name="studentIdentifier"
                                        onChange={tcTrackingForm.handleChange}
                                        value={tcTrackingForm.values.studentIdentifier}
                                        inputClassName="tw-h-10"
                                        invalid={(tcTrackingForm.touched.studentIdentifier && tcTrackingForm.errors.studentIdentifier) ? true : false}
                                        placeHolder={`Please Enter ${getNameFromFilter(
                                            tcStudentFilterOptions,
                                            tcTrackingForm.values.tcStudentFilter
                                        )}`}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="tw-flex tw-flex-col md:tw-flex-row tw-justify-between tw-items-start md:tw-items-center tw-mt-8 tw-gap-4">
                            <div className="tw-flex tw-items-center tw-gap-3">
                                <img
                                    className="tw-h-7 tw-w-7"
                                    src={Email}
                                    alt="email"
                                />
                                <span className="tw-text-gray-700">
                                    Need assistance? Click here
                                </span>

                                <a
                                    href={WHATSAPP_LINK}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="tw-text-green-600 hover:tw-text-green-700"
                                >
                                    <i className="ri-whatsapp-line tw-text-xl"></i>
                                </a>
                            </div>

                            <div className="tw-flex tw-gap-3 tw-w-full md:tw-w-auto md:tw-justify-end">
                                <Button
                                    disabled={showApiLoader}
                                    onClick={resetHndler}
                                    type="button"
                                    variant="secondary"
                                >
                                    Reset
                                </Button>

                                <Button
                                    disabled={showApiLoader}
                                    type="submit"
                                    variant="primary"
                                >
                                    Submit
                                </Button>
                            </div>
                        </div>
<Result setStepper={setStepper} downloadTcLogsApiCall={downloadTcLogsApiCall} />
                    </main>)}
                {stepper === "noresult" && <NoResult setStepper={setStepper} />}
                {stepper === "result" && <Result setStepper={setStepper} downloadTcLogsApiCall={downloadTcLogsApiCall} />}
            </form>
            <ModalContainerUpdated
                id="otp-verification-modal"
                isOpen={otpModalState.showModal}
                toggle={closeOtpModal}
                modalSize="xs"
                modalTitle="OTP Verification"
            >
                <VerifyOtpModal
                    toggle={closeOtpModal}
                    modalData={otpModalState.modalData}
                    filterValues={tcTrackingForm.values}
                    setOtpValue={setOtpValue}
                />

            </ModalContainerUpdated>
        </>
    )
}

export default TCTracking
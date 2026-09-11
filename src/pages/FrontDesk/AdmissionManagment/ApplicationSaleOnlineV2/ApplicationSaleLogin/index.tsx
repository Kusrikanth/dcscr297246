import FrontView1 from "../../../../../assets/imagesdps/authiconV1/app-login-left-img.webp";
import rightBG from "../../../../../assets/imagesdps/authiconV1/app-login-right-img.png";
import HeaderLoginImg from "../../../../../assets/imagesdps/authiconV1/dc-dark-logo.png";
import { InputCheckboxUpdated, IntervalTimer, ModalContainerUpdated, PhoneInput, TextInput } from "../../../../../Components/Common";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../../../../../utility/storageUtility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import {
  generateTokenForUserAct, generateOtpForUserAct,
  verifyOtpForUserAct,
  resendOtpForUserAct
} from "../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { accessTokenKey } from "../../../../../Components/constants/storageconstants";
import { getBranchByIdAct } from "../../../../../store/mastersettings/branch/branchactions";
import { parseQueryStringToObject } from "../../../../../utility/commonutility";
import { useHistory, useLocation } from "react-router-dom";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useModal } from "../../../../../hooks/modalhook";
import ConfirmationModal from "./ConfirmationModal";
import { getApplicationBannerAct } from "../../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction";
import Email from "../../../../../assets/imagesdps/authiconV1/login-2.png";
import { WHATSAPP_LINK } from '../../../../../Components/constants/common';

const initialValues = {
  contactNumber: "",
  currentStep: "ENTER_PHONE",
  agreeTerms: false,
  otpId: "",
  otpValue1: "",
  otpValue2: "",
  otpValue3: "",
  otpValue4: "",
  otpValue5: "",
  otpValue6: "",
}

const validationSchema = Yup.object().shape({
  currentStep: Yup.string(),
  contactNumber: Yup.string().when('currentStep', {
    is: (step: string) => step === 'ENTER_PHONE',
    then: (schema) => schema.required("Phone No is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  otpValue1: Yup.string().when('currentStep', {
    is: 'ENTER_OTP',
    then: (schema) => schema.required("*"),
    otherwise: (schema) => schema.notRequired(),
  }),
  otpValue2: Yup.string().when('currentStep', {
    is: 'ENTER_OTP',
    then: (schema) => schema.required("*"),
    otherwise: (schema) => schema.notRequired(),
  }),
  otpValue3: Yup.string().when('currentStep', {
    is: 'ENTER_OTP',
    then: (schema) => schema.required("*"),
    otherwise: (schema) => schema.notRequired(),
  }),
  otpValue4: Yup.string().when('currentStep', {
    is: 'ENTER_OTP',
    then: (schema) => schema.required("*"),
    otherwise: (schema) => schema.notRequired(),
  }),
  otpValue5: Yup.string().when('currentStep', {
    is: 'ENTER_OTP',
    then: (schema) => schema.required("*"),
    otherwise: (schema) => schema.notRequired(),
  }),
  otpValue6: Yup.string().when('currentStep', {
    is: 'ENTER_OTP',
    then: (schema) => schema.required("*"),
    otherwise: (schema) => schema.notRequired(),
  }),
  agreeTerms: Yup.boolean().when('currentStep', {
    is: 'ENTER_OTP',
    then: (schema) => schema.oneOf([true], 'You must agree to continue'),
    otherwise: (schema) => schema.notRequired(),
  }),
})

const ApplicationSaleLogin = () => {
  const params = useLocation().search;
  const dispatch = useAppDispatch();
  const { branchId, instituteId, academicYearId } = parseQueryStringToObject(params);
  const [expiryTimerState, setExpiryTimerState] = useState<boolean>(false);
  const [resendTimerState, setResendTimerState] = useState<boolean>(false);
  const { closeModal: closeDeleteRowModal, modalState: deleteRowModalState, openModal: openDeleteRowModal } = useModal();
  const { showApiLoader, generateTokenForUserResp, getApplicationBannerResp,
    resendOtpForUserResp, generateOtpForUserResp, verifyOtpForUserResp, branchbyIdResp,
    applicationSaleError
  } =
    useAppSelector(({ branch, globalData, applicationSale, admissionAvailabilityRequest }) => ({
      branchbyIdResp: branch.branchbyIdResp,
      generateTokenForUserResp: applicationSale.generateTokenForUserResp,
      generateOtpForUserResp: applicationSale.generateOtpForUserResp,
      verifyOtpForUserResp: applicationSale.verifyOtpForUserResp,
      resendOtpForUserResp: applicationSale.resendOtpForUserResp,
      getApplicationBannerResp: admissionAvailabilityRequest.getApplicationBannerResp,
      showApiLoader: globalData.showApiLoader,
      applicationSaleError: applicationSale.applicationSaleError,
    }), shallowEqual);

  const inputElementRef = useRef<any>({
    otpValue1: null,
    otpValue2: null,
    otpValue3: null,
    otpValue4: null,
    otpValue5: null,
    otpValue6: null,
  });

  useEffect(() => {
    const formData = new FormData();
    formData.append("clientName","WEB")
    formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
    dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
  }, []);

  const applicationLoginRespRef = useRef({
    prevGenerateTokenForUserResp: generateTokenForUserResp,
    prevGenerateOtpForUserResp: generateOtpForUserResp,
    prevVerifyOtpForUserResp: verifyOtpForUserResp,
    prevResendOtpForUserResp: resendOtpForUserResp,
    prevApplicationSaleError: applicationSaleError,
  });

  useEffect(() => {
    const { prevGenerateTokenForUserResp, prevGenerateOtpForUserResp,
      prevResendOtpForUserResp, prevVerifyOtpForUserResp, prevApplicationSaleError } = applicationLoginRespRef.current;
    if (generateTokenForUserResp && prevGenerateTokenForUserResp !== generateTokenForUserResp) {
      setLocalStorage(accessTokenKey, generateTokenForUserResp.token);
      getBranchInfoApiCall(branchId);
      getBannerApiCall(branchId);
    } else if (generateOtpForUserResp && prevGenerateOtpForUserResp !== generateOtpForUserResp) {
      setExpiryTimerState(true);
      toast.success("OTP sent successfully");
      saleLoginForm.setValues(prevValues => ({
        ...prevValues,
        currentStep: "ENTER_OTP",
        otpId: generateOtpForUserResp.id
      }), false);
    } else if (verifyOtpForUserResp && prevVerifyOtpForUserResp !== verifyOtpForUserResp) {
      openDeleteRowModal();
    } else if (resendOtpForUserResp && prevResendOtpForUserResp !== resendOtpForUserResp) {
      setResendTimerState(false);
      setExpiryTimerState(true);
      toast.success("OTP resent successfully");
      saleLoginForm.setValues(prevValues => ({
        ...prevValues,
        otpId: resendOtpForUserResp.id
      }), false);
    } else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
      const { details } = applicationSaleError || {}
      toast.error(details || "Something went wrong. Please try again later.")
    }
    applicationLoginRespRef.current.prevGenerateTokenForUserResp = generateTokenForUserResp;
    applicationLoginRespRef.current.prevGenerateOtpForUserResp = generateOtpForUserResp;
    applicationLoginRespRef.current.prevVerifyOtpForUserResp = verifyOtpForUserResp;
    applicationLoginRespRef.current.prevApplicationSaleError = applicationSaleError;
    applicationLoginRespRef.current.prevResendOtpForUserResp = resendOtpForUserResp;
  }, [branchId, generateTokenForUserResp, generateOtpForUserResp, verifyOtpForUserResp,
    resendOtpForUserResp, applicationSaleError]);

  const stopExpiryTimerHndlr = useCallback(() => {
    setResendTimerState(true);
    setExpiryTimerState(false);
  }, []);

  const saleLoginForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (values.currentStep === "ENTER_PHONE") {
        dispatch(generateOtpForUserAct(generateActionPayload("generate_otp_for_guest_user",
          undefined, {
          instituteId: instituteId, branchId: branchId,
          mobileNo: values.contactNumber
        })));
      } else {
        const otpValue = `${values.otpValue1}${values.otpValue2}${values.otpValue3}${values.otpValue4}${values.otpValue5}${values.otpValue6}`;
        dispatch(verifyOtpForUserAct(generateActionPayload("verify_otp_for_guest_user", undefined, {
          id: values.otpId,
          otp: otpValue
        })));
      }
    },
  })


  function getBranchInfoApiCall(branchId: string) {
    const params = { branchId };
    dispatch(getBranchByIdAct(generateActionPayload("get_branch_byid", params)));
  }

  function getBannerApiCall(branchId: string) {
    dispatch(getApplicationBannerAct(generateActionPayload("get_banner_img", {
      branchId: branchId,
      attributeKey: "APPLICATION_BANNER",
    })));
  }


  function onInputHndlr(event: React.FormEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const { name, value } = input;

    const nextElemId = input.getAttribute("data-nextelem");

    // Only one digit, numeric only
    const digit = value.replace(/\D/g, "").slice(-1);

    saleLoginForm.setValues((prev: any) => ({
      ...prev,
      [name]: digit,
    }));

    inputElementRef.current[name].value = digit;

    // Auto focus next
    if (digit && nextElemId) {
      setTimeout(() => {
        inputElementRef.current[nextElemId].focus();
      }, 0);
    }
  }

  function onKeyDownHndlr(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace") return;

    const input = event.currentTarget;
    const { name, value } = input;

    const prevElemId = input.getAttribute("data-prevelem");

    // Clear current value
    saleLoginForm.setValues((prev: any) => ({
      ...prev,
      [name]: "",
    }));
    inputElementRef.current[name].value = "";

    // Move focus back
    if (prevElemId) {
      setTimeout(() => {
        inputElementRef.current[prevElemId].focus();
      }, 0);
    }
  }

  function onPasteHndlr(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedValue = event.clipboardData.getData("Text");
    const digits = pastedValue.replace(/\D/g, "").split("");

    if (digits.length === 0) return;

    const updateFormInfo: any = {};

    Object.keys(inputElementRef.current).forEach((item, index) => {
      const digit = digits[index] || "";
      inputElementRef.current[item].value = digit;
      updateFormInfo[item] = digit;
    });

    saleLoginForm.setValues((prev: any) => ({
      ...prev,
      ...updateFormInfo,
    }));
  }

  function onChangePhoneInput(date: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
      updateDate = date.substring(2);
    saleLoginForm.setFieldValue(name, updateDate);
  }

  function toggleCofirmationModalHndlr(reset: any) {
    closeDeleteRowModal();
    if (typeof reset === "boolean" && reset) {
      saleLoginForm.resetForm();
    }
  }

  function resendOtpHandler() {
    dispatch(resendOtpForUserAct(generateActionPayload("resend_otp_for_guest_user",
      undefined, {
      instituteId: instituteId, branchId: branchId,
      mobileNo: saleLoginForm.values.contactNumber
    })));
  }


  const { schoolName, applicationLogoUrl } = branchbyIdResp || {};
  return (
    <>
      <form onSubmit={saleLoginForm.handleSubmit}>
        <section className="tw-mx-auto tw-p-0 !tw-m-0 tw-bg-[#fff] tw-w-full tw-h-screen">
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-[60%_40%]  tw-bg-[#fff] lg:tw-overflow-hidden tw-h-full">
            {/* Left: banner image (auto height on mobile, full height on large) */}
            <div className="tw-w-full tw-relative tw-overflow-hidden tw-h-[calc(40vh_-_24px)] md:tw-h-[70vh] lg:tw-h-full tw-rounded-b-[50px] lg:tw-rounded-b-[0px]">
              <img
                src={getApplicationBannerResp?.s3URL || FrontView1}
                alt="bg-image"
                className="tw-w-full tw-h-full tw-object-cover tw-object-center"
              />
              <div className="tw-absolute tw-inset-0 tw-bg-black/5"></div>
            </div>

            {/* Right: form (scroll on mobile, fixed column with inner scroll on large) */}
            <div
              className="tw-flex tw-items-center tw-justify-center tw-px-4 md:tw-px-8
            tw-bg-cover tw-bg-no-repeat tw-bg-right tw-relative
            "
              style={{ backgroundImage: `url(${rightBG})` }}
            >
              <div className="tw-absolute tw-top-4 tw-right-4">
                <span className="tw-font-semibold tw-mr-1 tw-mb-0">
                  Track your application:
                </span>
                <a
                  href="/application-tracking"
                  target="_blank"
                  className="tw-font-semibold tw-text-sky-600 hover:tw-text-sky-700 tw-transition-colors"
                >
                  Click here
                </a>
              </div>
              <div
                className="
                  tw-w-full
                  sm:tw-max-w-[400px]
                  md:tw-max-w-[420px]
                  lg:tw-max-w-[460px]
                  tw-bg-white
                  tw-rounded-xl
                  tw-border tw-border-[#F3F4F6]
                  tw-p-6 md:tw-p-8
                  tw-shadow-[0_3px_12px_#DFDFDF] tw-my-[58px] tw-mx-auto
                "
              >
                <div>
                  <div className="tw-mb-6">
                    <div className="tw-flex tw-flex-col tw-items-center">
                      {applicationLogoUrl && (
                        <img
                          src={applicationLogoUrl || HeaderLoginImg}
                          alt="logo"
                          className="tw-block tw-object-contain tw-h-auto tw-max-w-full tw-w-[220px] lg:tw-w-[240px] xl:tw-w-[260px] tw-mb-5"
                        />
                      )}
                      <h3 className="tw-font-semibold tw-text-xl lg:tw-text-2xl tw-text-gray-900 tw-mb-1">
                        Welcome !
                      </h3>
                      <p className="tw-text-gray-600 tw-text-sm tw-text-center tw-leading-relaxed tw-m-0">
                        Welcome to the admissions portal of&nbsp;
                        <span className="tw-font-medium tw-whitespace-nowrap">
                          {schoolName}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="tw-grid tw-grid-cols-1">
                    <PhoneInput
                      name="contactNumber"
                      labelText="Phone No."
                      labelClass="tw-font-medium"
                      inputClassName="!tw-rounded-lg !tw-py-2.5 !tw-px-2.5"
                      placeHolder="9999999999"
                      value={saleLoginForm.values.contactNumber}
                      onChange={onChangePhoneInput}
                      onBlur={saleLoginForm.handleBlur}
                      isDisabled={
                        saleLoginForm.values.currentStep === "ENTER_OTP"
                      }
                      invalid={
                        saleLoginForm.touched.contactNumber &&
                          saleLoginForm.errors.contactNumber
                          ? true
                          : false
                      }
                      error={
                        saleLoginForm.touched.contactNumber &&
                          saleLoginForm.errors.contactNumber
                          ? saleLoginForm.errors.contactNumber
                          : ""
                      }
                    />
                    {saleLoginForm.values.currentStep === "ENTER_OTP" && (
                      <>
                        <div className="tw-mb-5">
                          <label className="tw-font-semibold tw-mb-2 tw-block">
                            Enter OTP
                          </label>
                          <div className="tw-flex tw-gap-2.5">
                            <input
                              type="number"
                              ref={(el) =>
                                (inputElementRef.current.otpValue1 = el)
                              }
                              value={saleLoginForm.values.otpValue1}
                              onKeyDown={onKeyDownHndlr}
                              onInput={onInputHndlr}
                              onPaste={onPasteHndlr}
                              autoFocus
                              data-nextelem="otpValue2"
                              data-prevelem=""
                              className={classNames(
                                "form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input !tw-rounded-lg !tw-py-2.5 !tw-px-2.5",
                                saleLoginForm.touched.otpValue1 &&
                                  saleLoginForm.errors.otpValue1
                                  ? "is-invalid"
                                  : "tw-border-[#9E9E9E]"
                              )}
                              maxLength={1}
                              name="otpValue1"
                              autoComplete="off"
                            />
                            <input
                              type="number"
                              ref={(el) =>
                                (inputElementRef.current.otpValue2 = el)
                              }
                              value={saleLoginForm.values.otpValue2}
                              onKeyDown={onKeyDownHndlr}
                              onInput={onInputHndlr}
                              onPaste={onPasteHndlr}
                              data-nextelem="otpValue3"
                              data-prevelem="otpValue1"
                              className={classNames(
                                "form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input !tw-rounded-lg !tw-py-2.5 !tw-px-2.5",
                                saleLoginForm.touched.otpValue2 &&
                                  saleLoginForm.errors.otpValue2
                                  ? "is-invalid"
                                  : "tw-border-[#9E9E9E]"
                              )}
                              maxLength={1}
                              name="otpValue2"
                              autoComplete="off"
                            />
                            <input
                              type="number"
                              ref={(el) =>
                                (inputElementRef.current.otpValue3 = el)
                              }
                              value={saleLoginForm.values.otpValue3}
                              onKeyDown={onKeyDownHndlr}
                              onInput={onInputHndlr}
                              onPaste={onPasteHndlr}
                              data-nextelem="otpValue4"
                              data-prevelem="otpValue2"
                              className={classNames(
                                "form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input !tw-rounded-lg !tw-py-2.5 !tw-px-2.5",
                                saleLoginForm.touched.otpValue3 &&
                                  saleLoginForm.errors.otpValue3
                                  ? "is-invalid"
                                  : "tw-border-[#9E9E9E]"
                              )}
                              maxLength={1}
                              name="otpValue3"
                              autoComplete="off"
                            />
                            <input
                              type="number"
                              ref={(el) =>
                                (inputElementRef.current.otpValue4 = el)
                              }
                              value={saleLoginForm.values.otpValue4}
                              onKeyDown={onKeyDownHndlr}
                              onInput={onInputHndlr}
                              onPaste={onPasteHndlr}
                              data-nextelem="otpValue5"
                              data-prevelem="otpValue3"
                              className={classNames(
                                "form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input !tw-rounded-lg !tw-py-2.5 !tw-px-2.5",
                                saleLoginForm.touched.otpValue4 &&
                                  saleLoginForm.errors.otpValue4
                                  ? "is-invalid"
                                  : "tw-border-[#9E9E9E]"
                              )}
                              maxLength={1}
                              name="otpValue4"
                              autoComplete="off"
                            />
                            <input
                              type="number"
                              ref={(el) =>
                                (inputElementRef.current.otpValue5 = el)
                              }
                              value={saleLoginForm.values.otpValue5}
                              onKeyDown={onKeyDownHndlr}
                              onInput={onInputHndlr}
                              onPaste={onPasteHndlr}
                              data-nextelem="otpValue6"
                              data-prevelem="otpValue4"
                              className={classNames(
                                "form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input !tw-rounded-lg !tw-py-2.5 !tw-px-2.5",
                                saleLoginForm.touched.otpValue5 &&
                                  saleLoginForm.errors.otpValue5
                                  ? "is-invalid"
                                  : "tw-border-[#9E9E9E]"
                              )}
                              maxLength={1}
                              name="otpValue5"
                              autoComplete="off"
                            />
                            <input
                              type="number"
                              ref={(el) =>
                                (inputElementRef.current.otpValue6 = el)
                              }
                              value={saleLoginForm.values.otpValue6}
                              onKeyDown={onKeyDownHndlr}
                              onInput={onInputHndlr}
                              onPaste={onPasteHndlr}
                              data-nextelem=""
                              data-prevelem="otpValue5"
                              className={classNames(
                                "form-control tw-border tw-border-[#9E9E9E] tw-text-center opt-input !tw-rounded-lg !tw-py-2.5 !tw-px-2.5",
                                saleLoginForm.touched.otpValue6 &&
                                  saleLoginForm.errors.otpValue6
                                  ? "is-invalid"
                                  : "tw-border-[#9E9E9E]"
                              )}
                              maxLength={1}
                              name="otpValue6"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-mb-2">
                          <span className="tw-text-sm tw-text-gray-600">
                            OTP Expires in
                          </span>
                          <IntervalTimer
                            startTimer={expiryTimerState}
                            stopTimerHndlr={stopExpiryTimerHndlr}
                            initialMinute="10"
                            initialSeconds="00"
                            timerContainerClass="fs-14"
                          />
                        </div>
                        {resendTimerState && (
                          <div className="tw-text-center tw-mb-2 tw-text-xs md:tw-text-sm">
                            <button
                              type="button"
                              className="tw-text-blue-600 hover:tw-text-blue-700 tw-font-medium tw-bg-transparent tw-border-none tw-p-0 tw-underline"
                              onClick={resendOtpHandler}
                            >
                              Resend OTP
                            </button>
                          </div>
                        )}
                        <InputCheckboxUpdated
                          name="agreeTerms"
                          inputClassName="!tw-h-5 !tw-w-5 !tw-flex-shrink-0"
                          formgroupClassName="!tw-flex !tw-gap-2"
                          value={saleLoginForm.values.agreeTerms}
                          onChange={saleLoginForm.handleChange}
                          labelName="I agree to receive updates and communications from the school."
                          invalid={
                            saleLoginForm.touched.agreeTerms &&
                              saleLoginForm.errors.agreeTerms
                              ? true
                              : false
                          }
                          error={
                            saleLoginForm.touched.agreeTerms &&
                              saleLoginForm.errors.agreeTerms
                              ? saleLoginForm.errors.agreeTerms
                              : ""
                          }
                        />
                      </>
                    )}

                    <div className="tw-mt-4 tw-mb-5">
                      <button
                        className="btn btn-success tw-w-full tw-shadow-sm"
                        disabled={showApiLoader}
                      >
                        {saleLoginForm.values.currentStep === "ENTER_PHONE"
                          ? "Send OTP"
                          : "Login"}
                      </button>
                    </div>

                    <div className="d-flex align-items-center justify-content-center">
                      <p className="text-dark fs-7 tw-mb-0 tw-me-2">
                        <span className="me-2" style={{ lineHeight: "0px" }}>
                          <img className="img-fluid tw-w-7 tw-h-7" src={Email} />
                        </span>
                        <span style={{ display: "inline-block" }}>
                          Facing login issues? Click here
                        </span>
                      </p>
                      <div className="branch-whatsapp-container d-flex align-items-center justify-content-center">
                        <div className="">
                          <a
                            href={WHATSAPP_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none"
                          >
                            <i
                              className="ri-whatsapp-line fs-16"
                              style={{ color: "green" }}
                            ></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
      <ModalContainerUpdated
        id="assign-teacher-confirmation-modal"
        isOpen={deleteRowModalState.showModal}
        toggle={closeDeleteRowModal}
        modalTitle=""
        hideHeader={true}
        modalSize="md"
      >
        <ConfirmationModal
          toggle={toggleCofirmationModalHndlr}
          branchId={branchId}
          instituteId={instituteId}
          academicYearId={academicYearId}
          contactNumber={saleLoginForm.values.contactNumber}
          confirmationMessage="Would you like to proceed with the application submission?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ApplicationSaleLogin;

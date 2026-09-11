import { useEffect, useRef, useState } from 'react';
import { FullPageLoader } from '../../Components/Common';
import { useHistory, useLocation } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { default as ThankYouSvg } from "../../assets/imagesdps/ThankYou.svg?react"
import { default as RejectSvg } from "../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { parseQueryStringToObject } from "../../utility/commonutility";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { toast } from "react-toastify";
import { jodoPaymentStatusAct, generateTokenForUserAct } from '../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
//Utility
import { accessTokenKey } from "../../Components/constants/storageconstants";
import { getLocalStorage, setLocalStorage } from "../../utility/storageUtility";

const paymentStatus = {
    VERIFYING: "VERIFYING",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
    PENDING: "PENDING",
}
const Pooling_Count = 3;
export default function StudentIdCardPaymentSuccess() {
    const params = useLocation().search;
    const { order_id } = parseQueryStringToObject(params) || {};
    const [paymentState, setpaymentState] = useState(paymentStatus.VERIFYING);
    const [showLoaderState, setShowLoaderState] = useState(true);
    const paymentIntervalRef = useRef<any>(null);
    const intervalCount = useRef(0);
    const dispatch = useAppDispatch();
    const { generateTokenForUserResp, loggedInUserRole, jodoPaymentStatusResp, applicationSaleError } =
        useAppSelector(({ applicationSale, appData }) => ({
            generateTokenForUserResp: applicationSale.generateTokenForUserResp,
            loggedInUserRole: appData.loggedInUserRole,
            jodoPaymentStatusResp: applicationSale.jodoPaymentStatusResp,
            applicationSaleError: applicationSale.applicationSaleError,
        }), shallowEqual);

    const applicationRef = useRef({
        prevGenerateTokenForUserResp: generateTokenForUserResp,
        prevJodoPaymentStatusResp: jodoPaymentStatusResp,
        prevApplicationSaleError: applicationSaleError,
    });

    function resetInterval() {
        clearInterval(paymentIntervalRef.current);
        intervalCount.current = 0;
    }
    useEffect(() => {
        const { prevGenerateTokenForUserResp,
            prevJodoPaymentStatusResp, prevApplicationSaleError } = applicationRef.current;
        if (generateTokenForUserResp && prevGenerateTokenForUserResp !== generateTokenForUserResp) {
            setLocalStorage(accessTokenKey, generateTokenForUserResp.token);
            getPaymentStatusApiCall();
        } else if (jodoPaymentStatusResp && prevJodoPaymentStatusResp !== jodoPaymentStatusResp) {
            const { data } = jodoPaymentStatusResp,
                { status } = data || {};
            if (status?.toString()?.toLowerCase() === "paid") {
                setpaymentState(paymentStatus.SUCCESS);
                resetInterval();
                setShowLoaderState(false);
            } else if (intervalCount.current >= Pooling_Count) {
                resetInterval();
                setShowLoaderState(false);
                if (status?.toString()?.toLowerCase() === "fail" || status?.toString()?.toLowerCase() === "unpaid") {
                    setpaymentState(paymentStatus.FAIL);
                } else {
                    setpaymentState(paymentStatus.PENDING);
                }
            }
        } else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            if (intervalCount.current >= Pooling_Count) {
                const { message } = applicationSaleError;
                toast.error(message || "Something went wrong.");
                setpaymentState(paymentStatus.FAIL);
                resetInterval();
                setShowLoaderState(false);
            }
        }
        applicationRef.current.prevGenerateTokenForUserResp = generateTokenForUserResp;
        applicationRef.current.prevJodoPaymentStatusResp = jodoPaymentStatusResp;
        applicationRef.current.prevApplicationSaleError = applicationSaleError;
    }, [generateTokenForUserResp, jodoPaymentStatusResp, applicationSaleError]);

    useEffect(() => {
        const tokenKey = getLocalStorage(accessTokenKey);
        if (!order_id) {
            return;
        }
        if (!tokenKey) {
            const formData = new FormData();
            formData.append("clientName","WEB")
            formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
            dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
            return;
        }
        getPaymentStatusApiCall();
    }, [order_id, loggedInUserRole]);

    const history = useHistory();

    useEffect(() => {
        return () => { resetInterval(); }
    }, []);

    function redirectHomeHndlr() {
        // window.location.assign("https://dpssecunderabad.in/");
        history.push('/student-id-card');
    }

    function getPaymentStatusApiCall() {
        if (order_id) {
            const params = { orderId: order_id };
            if (paymentIntervalRef.current) {
                resetInterval();
            }
            intervalCount.current += 1;
            dispatch(jodoPaymentStatusAct(generateActionPayload("jodo_order_status", params, undefined, {
                hideLoader: true
            })));
            paymentIntervalRef.current = setInterval(() => {
                intervalCount.current += 1;
                dispatch(jodoPaymentStatusAct(generateActionPayload("jodo_order_status", params, undefined, {
                    hideLoader: true
                })));
            }, 10000);
        }
    }

    const isParentRole = loggedInUserRole === 'PARENT_ROLE';
    console.log(paymentState);
    return (
        <>
            {showLoaderState && <FullPageLoader />}
            <div className="">
                <div className="thank-you-page-top">
                    <div className="thank-you-page">
                        <div className='header'>
                        </div>
                        <div className='body'>
                            {(paymentState === paymentStatus.SUCCESS) && <ThankYouSvg className='thank-you-image tw-mb-2' />}
                            {(paymentState === paymentStatus.FAIL || paymentState === paymentStatus.PENDING) && <RejectSvg className='tw-mb-2' fill="#f06548" height={100} />}
                            {paymentState === paymentStatus.VERIFYING && (
                                <div className='bg-light skeleton-loader tw-mb-2' style={{ height: '100px', width: '100px' }}>
                                </div>
                            )}

                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-1'>AWESOME !</div>}
                            {(paymentState === paymentStatus.PENDING ||
                                paymentState === paymentStatus.FAIL) && <div className='text-1'>Error Occured !</div>}
                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-2'>Your Payment for Student Id Card is completed Successfully.</div>}
                            {(paymentState === paymentStatus.FAIL || paymentState === paymentStatus.PENDING) && <div className='text-2'>Your Payment is not submitted. Please try again.</div>}
                            <div className='text-2'>Student Id Card payment status.</div>
                            {(paymentState) && <div className="text-1 tw-flex tw-mb-2">
                                <span className='fw-bold me-1 tw-text-gray-400 tw-text-nowrap'>Payment Status:</span>
                                {(paymentState === paymentStatus.VERIFYING) && <span className='text-muted'>Verifying...</span>}
                                {(paymentState === paymentStatus.SUCCESS) && <span className="text-success">Your payment is completed successfully.</span>}
                                {(paymentState === paymentStatus.FAIL) && <span className="text-danger">Error in payment.</span>}
                                {(paymentState === paymentStatus.PENDING) && <span className="text-warning text-start">Payment pending. Payment status will be updated later.</span>}
                            </div>}
                            {(paymentState !== paymentStatus.VERIFYING && isParentRole) && <div className='d-flex gap-2'>
                                <button className='btn btn-orange' onClick={redirectHomeHndlr}>Back to Student Id Card</button>
                            </div>}
                            {(paymentState === paymentStatus.VERIFYING) && <div className='text-muted'>
                                * Please do not refresh or close this page while we are verifying your payment status. Thank you for your patience!
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
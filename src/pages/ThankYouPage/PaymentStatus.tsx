

import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { default as ThankYouSvg } from "../../assets/imagesdps/ThankYou.svg?react";
import { default as RejectSvg } from "../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { parseQueryStringToObject } from "../../utility/commonutility";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { toast } from "react-toastify";
import { generateTokenForUserAct } from '../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
//Utility
import { accessTokenKey } from "../../Components/constants/storageconstants";
import { getLocalStorage, setLocalStorage } from "../../utility/storageUtility";
import { paymentOrderStatusAct } from '../../store/fee/feecollections/feecollectionactions';

const paymentStatus = {
    VERIFYING: "VERIFYING",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL",
    PENDING: "PENDING",
}

export default function PaymentStatus(props: any) {
    const { branchId } = useParams<any>();
    const location: any = useLocation();
    const params = location.search,
        tokenKey = getLocalStorage(accessTokenKey);
    const { orderRef, redirectUrl } = parseQueryStringToObject(params) || {};
    const [paymentState, setpaymentState] = useState(paymentStatus.VERIFYING);
    const dispatch = useAppDispatch();
    const { showApiLoader, generateTokenForUserResp, paymentOrderStatusResp, feeCollectionErrorResp } =
        useAppSelector(({ globalData, applicationSale, feeCollections }) => ({
            generateTokenForUserResp: applicationSale.generateTokenForUserResp,
            paymentOrderStatusResp: feeCollections.paymentOrderStatusResp,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            showApiLoader: globalData.showApiLoader
        }), shallowEqual);

    const applicationRef = useRef({
        prevGenerateTokenForUserResp: generateTokenForUserResp,
        prevPaymentOrderStatusResp: paymentOrderStatusResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp,
    });


    useEffect(() => {
        const { prevGenerateTokenForUserResp,
            prevPaymentOrderStatusResp, prevFeeCollectionErrorResp } = applicationRef.current;
        if (generateTokenForUserResp && prevGenerateTokenForUserResp !== generateTokenForUserResp) {
            setLocalStorage(accessTokenKey, generateTokenForUserResp.token);
            getPaymentStatusApiCall();
        } else if (paymentOrderStatusResp && prevPaymentOrderStatusResp !== paymentOrderStatusResp) {
            const { order } = paymentOrderStatusResp;
            if (order?.orderStatus === "PAYMENT_FAILED") {
                setpaymentState(paymentStatus.FAIL);
            } else if (order?.orderStatus === "CANCELLED_BY_USER") {
                setpaymentState(paymentStatus.FAIL);
            } else {
                setpaymentState(paymentStatus.SUCCESS);
            }
        } else if (feeCollectionErrorResp && prevFeeCollectionErrorResp !== feeCollectionErrorResp) {
            const { message } = feeCollectionErrorResp;
            toast.error(message || "Something went wrong.");
            setpaymentState(paymentStatus.FAIL);
        }
        applicationRef.current.prevGenerateTokenForUserResp = generateTokenForUserResp;
        applicationRef.current.prevPaymentOrderStatusResp = paymentOrderStatusResp;
        applicationRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
    }, [generateTokenForUserResp, paymentOrderStatusResp, feeCollectionErrorResp]);

    useEffect(() => {
        if (!tokenKey) {
            const formData = new FormData();
            formData.append("clientName","WEB")
            formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
            dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
            return;
        } else {
            getPaymentStatusApiCall();
        }
    }, [tokenKey, branchId, orderRef]);

    function redirectHomeHndlr() {
        if (redirectUrl) {
            window.location.assign(redirectUrl);
        } else {
            toast.warning('Redirect url doesnot exist.')
        }
    }

    function getPaymentStatusApiCall() {
        if (orderRef) {
            const params = { branchId, orderRef };
            dispatch(paymentOrderStatusAct(generateActionPayload("ccavenue_payment_status", params)));
        }
    }

    return (
        <>
            <div className="tw-mt-5">
                <div className="thank-you-page-top">
                    <div className="thank-you-page">
                        <div className='header'>
                        </div>
                        <div className='body'>
                            {(paymentState === paymentStatus.SUCCESS) && <ThankYouSvg className='thank-you-image tw-mb-2' />}
                            {(paymentState === paymentStatus.FAIL || paymentState === paymentStatus.PENDING) && <RejectSvg className='tw-mb-2' fill="#f06548" height={100} />}
                            {paymentState === paymentStatus.VERIFYING && <div className='bg-light skeleton-loader tw-mb-2' style={{ height: '100px', width: '100px' }}>
                            </div>}
                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-1'>AWESOME !</div>}
                            {(paymentState === paymentStatus.PENDING ||
                                paymentState === paymentStatus.FAIL) && <div className='text-1'>Error Occured !</div>}
                            <div className='text-2'>Fee ledger payment status.</div>
                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-2'>Your Payment is Submitted Successfully.</div>}

                            {(paymentState) && <div className="text-1 tw-flex tw-mb-2">
                                <span className='fw-bold tw-mr-1 tw-text-gray-600 tw-text-nowrap'>Payment Status:</span>
                                {(paymentState === paymentStatus.VERIFYING) && <span className='tw-text-gray-600'>Verifying...</span>}
                                {(paymentState === paymentStatus.SUCCESS) && <span className="tw-text-green-600">Your payment is completed successfully.</span>}
                                {(paymentState === paymentStatus.FAIL) && <span className="tw-text-red-600">Error in payment.</span>}
                                {(paymentState === paymentStatus.PENDING) && <span className="tw-text-yellow-600 tw-text-start">Payment pending. Payment status will be updated later.</span>}
                            </div>}

                            {(paymentState !== paymentStatus.VERIFYING) && <div className='tw-flex tw-gap-2'>
                                <button className='btn btn-orange'
                                    disabled={showApiLoader}
                                    onClick={redirectHomeHndlr}>Return Back</button>
                            </div>}
                            {(paymentState === paymentStatus.VERIFYING) && <div className='tw-text-gray-600 tw-mt-2'>
                                * Please do not refresh or close this page while we are verifying your payment status. Thank you for your patience!
                            </div>}
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}

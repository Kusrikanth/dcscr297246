import React, { useEffect, useRef, useState } from 'react';
import { ModalContainerUpdated, FullPageLoader } from '../../Components/Common';
import { useLocation, useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { default as ThankYouSvg } from "../../assets/imagesdps/ThankYou.svg?react"
import { default as RejectSvg } from "../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { parseQueryStringToObject } from "../../utility/commonutility";
import PreviewModal from '../FrontDesk/AdmissionManagment/ApplicationSale/PreviewModal';
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { toast } from "react-toastify";
import { jodoPaymentStatusAct, generateTokenForUserAct, getApplicationSaleById } from '../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
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

const CCavenueApplicationSuccess = (props: any) => {
    const params = useLocation().search;
    const { branchId } = useParams<any>();
    const { orderRef, redirectUrl } = parseQueryStringToObject(params) || {};
    const [paymentState, setpaymentState] = useState(paymentStatus.VERIFYING);
    const [previewApplicationSale, setPreviewApplicationSale] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const dispatch = useAppDispatch();
    const { generateTokenForUserResp, applicationSaleByIdResp, paymentOrderStatusResp,
        feeCollectionErrorResp, showApiLoader
    } =
        useAppSelector(({ applicationSale, globalData, feeCollections }) => ({
            generateTokenForUserResp: applicationSale.generateTokenForUserResp,
            applicationSaleByIdResp: applicationSale.applicationSaleByIdResp,
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
            const { order, identifier } = paymentOrderStatusResp;
            if (order?.orderStatus === "PAYMENT_FAILED") {
                setpaymentState(paymentStatus.FAIL);
                return;
            } else if (order?.orderStatus === "CANCELLED_BY_USER") {
                setpaymentState(paymentStatus.FAIL);
            } else {
                setpaymentState(paymentStatus.SUCCESS);
            }
            dispatch(getApplicationSaleById(generateActionPayload('get_application_sale_by_id',
                { applicationSaleId: identifier?.value })))
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
        const tokenKey = getLocalStorage(accessTokenKey);
        if (!tokenKey) {
            const formData = new FormData();
            formData.append("clientName","WEB")
            formData.append("publicKey",import.meta.env.VITE_GENERATE_TOKEN_PUBLIC_KEY)
            dispatch(generateTokenForUserAct(generateActionPayload("generate_token_for_user", undefined, formData, { tokenNotRequired: true })));
            return;
        } else {
            getPaymentStatusApiCall();
            // dispatch(getApplicationSaleById(generateActionPayload('get_application_sale_by_id', { applicationSaleId })))
        }
    }, [orderRef]);

    function redirectHomeHndlr() {
        window.location.assign("https://dpssecunderabad.in/");
    }

    function previewReceiptHandler() {
        const { identifier } = paymentOrderStatusResp;
        setPreviewApplicationSale((prev: any) => ({
            ...prev, showModal: true,
            applicationId: identifier?.value
        }));
    }

    function toggleReceiptModalHndlr() {
        setPreviewApplicationSale((prev: any) => ({
            ...prev, showModal: false
        }));
    }

    function getPaymentStatusApiCall() {
        if (orderRef) {
            const params = { branchId, orderRef };
            dispatch(paymentOrderStatusAct(generateActionPayload("ccavenue_payment_status", params)));
        }
    }

    const { saleFormDetails } = applicationSaleByIdResp || {};
    return (
        <>
            {showApiLoader && <FullPageLoader />}
            <div className="mt-3">
                <div className="thank-you-page-top">
                    <div className="thank-you-page">
                        <div className='header'>
                        </div>
                        <div className='body'>
                            {(paymentState === paymentStatus.SUCCESS) && <ThankYouSvg className='thank-you-image mb-2' />}
                            {(paymentState === paymentStatus.FAIL || paymentState === paymentStatus.PENDING) && <RejectSvg className='mb-2' fill="#f06548" height={100} />}
                            {paymentState === paymentStatus.VERIFYING && <div className='bg-light skeleton-loader mb-2' style={{ height: '100px', width: '100px' }}>
                            </div>}
                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-1'>AWESOME !</div>}
                            {(paymentState === paymentStatus.PENDING ||
                                paymentState === paymentStatus.FAIL) && <div className='text-1'>Error Occured !</div>}
                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-2'>Your Application is Submitted Successfully.</div>}
                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-2'>Thank you for applying with {saleFormDetails?.instituteName}, You will be intimated
                                through mail and sms regarding the next Admission Process.</div>}
                            {(paymentState === paymentStatus.FAIL) && <div className='text-2'>Your Application is not submitted. Please try again.</div>}
                            {paymentState === paymentStatus.SUCCESS && saleFormDetails && <div className='text-3'>For any further inquiries please contact <a href='#' onClick={e => e.preventDefault()} style={{ color: "#41BAED" }}>
                                {saleFormDetails?.branchEmail || "admission@dpssecunderabad.in"}
                            </a></div>}
                            <div className="text-1 d-flex mb-2">
                                <span className='fw-bold me-1 text-muted text-nowrap'>Payment Status:</span>
                                {(paymentState === paymentStatus.VERIFYING) && <span className='text-muted'>Verifying...</span>}
                                {(paymentState === paymentStatus.SUCCESS) && <span className="text-success">Your payment is completed successfully.</span>}
                                {(paymentState === paymentStatus.FAIL) && <span className="text-danger">Error in payment.</span>}
                                {(paymentState === paymentStatus.PENDING) && <span className="text-warning text-start">Payment pending. Payment status will be updated later.</span>}
                            </div>

                            {(paymentState !== paymentStatus.VERIFYING) && <div className='d-flex gap-2 mb-2'>
                                <button className='btn btn-orange' onClick={redirectHomeHndlr}>{(paymentState === paymentStatus.FAIL || paymentState === paymentStatus.PENDING) ? "Try Again" : "Home"}</button>
                                {(paymentState === paymentStatus.SUCCESS) && <button className='btn btn-green'
                                    onClick={previewReceiptHandler}
                                >Preview Receipt</button>}
                            </div>}
                            {(paymentState === paymentStatus.VERIFYING) && <div className='text-muted'>
                                * Please do not refresh or close this page while we are verifying your payment status. Thank you for your patience!
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="show-receipt-preview"
                isOpen={previewApplicationSale.showModal}
                toggle={toggleReceiptModalHndlr}
                modalTitle="Preview Receipt"
                modalSize="lg"
            >
                <PreviewModal isOpen={previewApplicationSale.showModal}
                    applicationId={previewApplicationSale.applicationId} />
            </ModalContainerUpdated>
        </>
    )
}

export default CCavenueApplicationSuccess;

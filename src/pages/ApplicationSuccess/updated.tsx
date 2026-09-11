import React, { useEffect, useRef, useState } from 'react';
import { ModalContainerUpdated } from '../../Components/Common';
import { useLocation, useParams } from "react-router-dom";
import { shallowEqual } from "react-redux";
import { default as ThankYouSvg } from "../../assets/imagesdps/ThankYou.svg?react"
import { parseQueryStringToObject } from "../../utility/commonutility";
import PreviewModal from '../FrontDesk/AdmissionManagment/ApplicationSale/PreviewModal';
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { toast } from "react-toastify";
import { jodoPaymentStatusAct } from '../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
const paymentStatus = {
    VERIFY: "VERIFY",
    SUCCESS: "SUCCESS",
    FAIL: "FAIL"
}
const ApplicationSuccess = (props: any) => {
    const params = useLocation().search;
    const { applicationsaleid }: any = useParams() || {};
    const queryParamsObject = parseQueryStringToObject(params);
    const [paymentState, setpaymentState] = useState("");
    const [previewApplicationSale, setPreviewApplicationSale] = useState<any>({
        showModal: false,
        applicationId: undefined
    })
    const dispatch = useAppDispatch();
    const { jodoPaymentStatusResp, applicationSaleError } =
        useAppSelector(({ applicationSale }) => ({
            jodoPaymentStatusResp: applicationSale.jodoPaymentStatusResp,
            applicationSaleError: applicationSale.applicationSaleError,
        }), shallowEqual);

    const applicationRef = useRef({
        prevJodoPaymentStatusResp: jodoPaymentStatusResp,
        prevApplicationSaleError: applicationSaleError,
    });

    useEffect(() => {
        const { prevJodoPaymentStatusResp, prevApplicationSaleError } = applicationRef.current;
        if (jodoPaymentStatusResp && prevJodoPaymentStatusResp !== jodoPaymentStatusResp) {
            const { data } = jodoPaymentStatusResp,
                { status } = data || {};
            if (status === "paid") {
                setpaymentState(paymentStatus.SUCCESS);
            } else {
                setpaymentState(paymentStatus.FAIL);
            }
        } else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const { message } = applicationSaleError;
            toast.error(message || "Something went wrong.");
            setpaymentState(paymentStatus.FAIL);
        }
        applicationRef.current.prevJodoPaymentStatusResp = jodoPaymentStatusResp;
        applicationRef.current.prevApplicationSaleError = applicationSaleError;
    }, [jodoPaymentStatusResp, applicationSaleError]);

    useEffect(() => {
        const { order_id } = queryParamsObject || {};
        if (order_id) {
            const params = { orderId: order_id };
            setpaymentState(paymentStatus.VERIFY);
            dispatch(jodoPaymentStatusAct(generateActionPayload("jodo_order_status", params)));
        }
    }, [queryParamsObject?.order_id]);

    function redirectHomeHndlr() {
        window.location.assign("https://dpssecunderabad.in/");
    }

    function previewReceiptHandler() {
        setPreviewApplicationSale((prev: any) => ({
            ...prev, showModal: true,
            applicationId: applicationsaleid || "58188"
        }));
    }

    function toggleReceiptModalHndlr() {
        setPreviewApplicationSale((prev: any) => ({
            ...prev, showModal: false
        }));
    }

    return (
        <>
            <div className="">
                <div className="thank-you-page-top">
                    <div className="thank-you-page">
                        <div className='header'>
                        </div>
                        <div className='body'>
                            <div><ThankYouSvg className='thank-you-image' /></div>
                            <div className='text-1'>AWESOME !</div>
                            {(paymentState === paymentStatus.SUCCESS) && <div className='text-2'>Your Application is Submitted Successfully.</div>}
                            {(paymentState === paymentStatus.FAIL) && <div className='text-2'>Your Application is partially Submitted.</div>}
                            <div className='text-2'>Thank you for applying with Delhi Public School, You will be intimated
                                through mail and sms regarding the next Admission Process.</div>
                            <div className='text-3 '>For any further inquiries please contact <a href='#' onClick={e => e.preventDefault()} style={{ color: "#41BAED" }}>admission@dpssecunderabad.in</a></div>
                            {(paymentState) && <div className="text-1 tw-flex tw-flex-wrap tw-mb-2">
                                <span className='tw-font-bold tw-me-1 text-muted'>Payment Status:</span>
                                {(paymentState === paymentStatus.VERIFY) && <span>Verifying...</span>}
                                {(paymentState === paymentStatus.SUCCESS) && <span className="text-success">Your payment is completed successfully.</span>}
                                {(paymentState === paymentStatus.FAIL) && <span className="text-danger">Error in payment.</span>}
                            </div>}

                            {(paymentState === paymentStatus.SUCCESS) && <div className='tw-flex tw-gap-2'>
                                <button className='btn btn-orange' onClick={redirectHomeHndlr}>Home</button>
                                <button className='btn btn-green'
                                    onClick={previewReceiptHandler}
                                >Preview Receipt</button>
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
                <PreviewModal isOpen={previewApplicationSale.showModal} applicationId={previewApplicationSale.applicationId} />
            </ModalContainerUpdated>
        </>
    )
}

export default ApplicationSuccess

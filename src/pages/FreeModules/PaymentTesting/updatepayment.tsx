// {
//     "executionType": true,
//     "orderRef":"ORD100111",
//     "identifier":{
//         "type": "STUDENT",
//         "value":"1234567890"
//     },
//     "amount":100,
//     "paymentMode":"Unified Payments"
// }

import { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { processCcavenueDummyPaymentAct } from "../../../store/fee/feecollections/feecollectionactions";
import { generateActionPayload } from "../../../utility/reduxutility";

export default function UpdatePaymentModal({ modalData, closeModalHndlr }: {
    modalData: {
        orderRef: string, studentId: string, studentName: string,
        studentCode: string, amount: string, branchId: string,
    }, closeModalHndlr: () => void
}) {
    const history = useHistory()
    const dispatch = useAppDispatch();
    const { processCcavenueDummyPaymentResp, feeCollectionErrorResp }: any =
        useAppSelector(
            ({ feeCollections }) => ({

                processCcavenueDummyPaymentResp: feeCollections.processCcavenueDummyPaymentResp,
                feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            }), shallowEqual);

    const pyamentModalRef = useRef({
        prevProcessCcavenueDummyPaymentResp: processCcavenueDummyPaymentResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp
    });

    useEffect(() => {
        const { prevProcessCcavenueDummyPaymentResp } = pyamentModalRef.current;
        if (processCcavenueDummyPaymentResp && prevProcessCcavenueDummyPaymentResp !== processCcavenueDummyPaymentResp) {
            history.push(`/paymentstatus/${modalData?.branchId}?orderRef=${modalData.orderRef}&redirectUrl=${window.location.origin}/payment-testing`);
        }
        pyamentModalRef.current.prevProcessCcavenueDummyPaymentResp = processCcavenueDummyPaymentResp;
    }, [processCcavenueDummyPaymentResp]);

    function successPaymentHndlr() {
        const payload = {
            executionType: true,
            orderRef: modalData.orderRef,
            identifier: {
                type: 'STUDENT_CODE',
                value: modalData.studentCode,
                studentId: modalData.studentId,
            },
            studentName: modalData.studentName,
            amount: modalData.amount,
            paymentMode: 'Unified Payments'
        }
        dispatch(processCcavenueDummyPaymentAct(generateActionPayload("process_ccavenue_dummy_payment", {
            branchId: modalData.branchId
        }, payload)));
    }

    function cancelPaymentHndlr() {
        const payload = {
            executionType: false,
            orderRef: modalData.orderRef,
            identifier: {
                type: 'STUDENT_CODE',
                value: modalData.studentCode,
                studentId: modalData.studentId,
            },
            studentName: modalData.studentName,
            amount: modalData.amount,
            paymentMode: 'Unified Payments'
        }
        dispatch(processCcavenueDummyPaymentAct(generateActionPayload("process_ccavenue_dummy_payment",
            {
                branchId: modalData.branchId
            }, payload)));
    }

    return (
        <div className="p-4">
            <p className="text-center fs-18px font-bold">Update CCAvenue Payment</p>
            <div className="d-flex justify-content-center align-items-center">
                <button onClick={cancelPaymentHndlr} className="btn btn-danger me-3">
                    Trigger Fail
                </button>
                <button onClick={successPaymentHndlr} className="btn btn-success">
                    Trigger Success
                </button>
            </div>
        </div>
    )
}
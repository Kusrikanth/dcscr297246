import React, { useRef, useEffect, useMemo, useState, useCallback, createRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { previewFeeReceiptAct, downloadFeeReceiptAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { useLocation, useHistory, useParams } from "react-router-dom";

//Utility
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as DownloadSvg } from "../../../../assets/imagesdps/academics/Download.svg?react";
import { printDocumentHandler } from "../../../../utility/commonutility";

export default function PreviewReceiptModal({ receiptId }: any) {
    const dispatch = useAppDispatch();
    const location: any = useLocation();
    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        previewFeeReceiptResp, downloadFeeReceiptResp,
        feeCollectionErrorResp } =
        useAppSelector(({ appData, feeCollections }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            previewFeeReceiptResp: feeCollections.previewFeeReceiptResp,
            downloadFeeReceiptResp: feeCollections.downloadFeeReceiptResp,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        }), shallowEqual);
    const printDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (receiptId) {
            const params = {
                id: receiptId
            };
            dispatch(previewFeeReceiptAct(generateActionPayload("preview_hostel_fee_receipt", params)));
        }
    }, [receiptId]);


    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }


    return (
        <div className="modal-body">
            <div className="row ms-auto mb-3">
                <div className="col ms-auto d-flex justify-content-end">
                    <button onClick={printReceiptHndlr} className="btn btn-danger px-4 me-2">
                        <PrintSvg className="me-2 d-inline-block" stroke="#FFFFFF" />Print Receipt
                    </button>
                </div>
            </div>
            <div id="print-div" ref={printDivRef} dangerouslySetInnerHTML={{ __html: previewFeeReceiptResp }}>

            </div>
        </div>
    )
}
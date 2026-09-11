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
import { Button } from "../../../../Components/Common";

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
                receiptId
            };
            dispatch(previewFeeReceiptAct(generateActionPayload("preview_receipt", params)));
        }
    }, [receiptId]);


    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }


    return (
        <div className="modal-body">
            <div className="tw-flex tw-flex-wrap tw-ml-auto tw-mb-3">
                <div className="tw-grow tw-ml-auto tw-flex tw-justify-end">
                    <Button onClick={printReceiptHndlr} variant="reject">
                        <PrintSvg className="tw-mr-2 tw-inline-block" stroke="#FFFFFF" />Print Receipt
                    </Button>
                </div>
            </div>
            <div id="print-div" ref={printDivRef} dangerouslySetInnerHTML={{ __html: previewFeeReceiptResp }}>

            </div>
        </div>
    )
}
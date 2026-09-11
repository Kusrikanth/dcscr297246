import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import NoDataComp from "../../../Components/Common/NoDataComp";
import { generateActionPayload } from "../../../utility/reduxutility";
import { downloadFeeReceiptAct, previewFeeReceiptAct } from "../../../store/fee/feecollections/feecollectionactions";
import { printDocumentHandler } from "../../../utility/commonutility";
import { default as PrintSvg } from "../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as DownloadSvg } from "../../../assets/imagesdps/academics/Download.svg?react";

//Custom Hooks

export default function PreviewReceipt(props: any) {
    const dispatch = useAppDispatch();
    const printDivRef = useRef<HTMLDivElement>(null);
    const {receiptId} = props || {}

    const { previewFeeReceiptResp, downloadFeeReceiptResp,feeCollectionErrorResp,showApiLoader  } = useAppSelector(({ feeCollections,globalData }) => ({
        previewFeeReceiptResp:feeCollections.previewFeeReceiptResp,
        downloadFeeReceiptResp: feeCollections.downloadFeeReceiptResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        showApiLoader:globalData.showApiLoader,
    }), shallowEqual);

    const newFeeReceiptResp = useRef({
        prevDownloadFeeReceiptResp: downloadFeeReceiptResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp
    });

    useEffect(() => {
        const { prevDownloadFeeReceiptResp, prevFeeCollectionErrorResp } = newFeeReceiptResp.current;
        if (downloadFeeReceiptResp && prevDownloadFeeReceiptResp !== downloadFeeReceiptResp) {
            convertBlobToReceipt(downloadFeeReceiptResp, `fee-${receiptId}.pdf`);
        }
        else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
            const { message }: any = feeCollectionErrorResp;
            toast.error(message || "Something went wrong.");
        }
        newFeeReceiptResp.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
    }, [downloadFeeReceiptResp, feeCollectionErrorResp]);

    function convertBlobToReceipt(blobStream: any, fileName: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

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

    function downloadReceiptHndlr() {
        if (receiptId) {
            const params = {
                receiptId
            };
            dispatch(downloadFeeReceiptAct(generateActionPayload("download_receipt", params, undefined, {
                responseType: 'blob'
            })));
        }
    }

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className="tw-p-4">
                {previewFeeReceiptResp ? (
                    <div
                        id="print-div"
                        ref={printDivRef}
                        className="tw-flex tw-justify-center"
                        dangerouslySetInnerHTML={{ __html: previewFeeReceiptResp }}
                    />
                ) : (
                    <NoDataComp />
                )}
            </div>

            <div className="tw-flex tw-justify-end tw-p-4">
                <button
                    onClick={printReceiptHndlr}
                    className="tw-flex tw-items-center tw-bg-red-600 tw-text-white tw-px-6 tw-py-2 tw-rounded tw-mr-2 hover:tw-bg-red-700"
                >
                    <PrintSvg className="tw-mr-2 tw-inline-block" stroke="#FFFFFF" />
                    Print Receipt
                </button>

                <button
                    onClick={downloadReceiptHndlr}
                    disabled={showApiLoader}
                    className="tw-flex tw-items-center tw-px-6 tw-py-2 tw-rounded tw-text-white disabled:tw-opacity-60"
                    style={{ backgroundColor: "#405189" }}
                >
                    <DownloadSvg
                        fill="#cfcfcf"
                        className="tw-mr-2 tw-inline-block"
                    />
                    Download Receipt
                </button>
            </div>

        </form >
    )
}
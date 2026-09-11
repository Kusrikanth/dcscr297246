import React, { useRef, useEffect} from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { previewFeeReceiptAct } from "../../../../../store/fee/feecollections/feecollectionactions";
import { useParams } from "react-router-dom";

//Utility
import { default as PrintSvg } from "../../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as DownloadSvg } from "../../../../../assets/imagesdps/academics/Download.svg?react";
import { printDocumentHandler } from "../../../../../utility/commonutility";
import { downloadHostelFeeReceiptAct } from "../../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import Button from "../../../../../Components/Common/Button";

const PreviewReceiptPage = () => {
    const { receiptId }: any = useParams();
    const dispatch = useAppDispatch();

    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        previewFeeReceiptResp, downloadFeeReceiptResp,showApiLoader,downloadHostelFeeReceiptResp,
        feeCollectionErrorResp,hostelStuLedgerErrResp  } =
        useAppSelector(({ appData, feeCollections,globalData,hostelStuLedger }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            previewFeeReceiptResp: feeCollections.previewFeeReceiptResp,
            downloadFeeReceiptResp: feeCollections.downloadFeeReceiptResp,
            feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
            showApiLoader : globalData.showApiLoader,
            downloadHostelFeeReceiptResp: hostelStuLedger.downloadHostelFeeReceiptResp,
        }), shallowEqual);

    const newFeeReceiptResp = useRef<any>({
        prevDownloadHostelFeeReceiptResp: downloadHostelFeeReceiptResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp,
        prevHostelStuLedgerErrResp: hostelStuLedgerErrResp,
    });
    const printDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const { prevDownloadHostelFeeReceiptResp, prevFeeCollectionErrorResp , prevHostelStuLedgerErrResp } = newFeeReceiptResp.current;
        if (downloadHostelFeeReceiptResp && prevDownloadHostelFeeReceiptResp !== downloadHostelFeeReceiptResp) {
            window.open(downloadHostelFeeReceiptResp, "_blank");
        }
        else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
            const { message }: any = feeCollectionErrorResp;
            toast.error(message || "Something went wrong.");
        }
        else if(hostelStuLedgerErrResp && prevHostelStuLedgerErrResp !== hostelStuLedgerErrResp){
            const { details , message }: any = feeCollectionErrorResp || {};
            toast.error(details || message || "Something went wrong.");
        }
        newFeeReceiptResp.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
        newFeeReceiptResp.current.prevDownloadHostelFeeReceiptResp = downloadHostelFeeReceiptResp;
        newFeeReceiptResp.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp;
    }, [downloadHostelFeeReceiptResp, feeCollectionErrorResp,hostelStuLedgerErrResp]);

    useEffect(() => {
        if (receiptId) {
            const params = {
                id:receiptId
            };
            dispatch(previewFeeReceiptAct(generateActionPayload("preview_hostel_fee_receipt", params)));
        }
    }, [receiptId]);

    function downloadReceiptHndlr() {
        if (receiptId) {
            const params = {
               id: receiptId
            };
            dispatch(downloadHostelFeeReceiptAct(generateActionPayload("download_hostel_fee_receipt", params, undefined, )));
        }
    }

    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }
    return (
        <>
            <div className="page-content new_fee_receipt_page_warp">
                <div className="container-fluid">
                    <BreadCrumb title="Preview Receipt" pageTitle="Hostel" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-border-b tw-px-6 tw-py-4">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-grow">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Preview Receipt
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-6">
                            <div className="tw-flex tw-justify-end tw-mb-3">
                                <Button
                                    onClick={printReceiptHndlr}
                                    variant="reject"
                                >
                                    <PrintSvg className="tw-me-2 tw-inline-block" stroke="#FFFFFF" />
                                    Print Receipt
                                </Button>

                                <Button
                                    onClick={downloadReceiptHndlr}
                                    disabled={showApiLoader}
                                    variant="info"
                                >
                                    <DownloadSvg className="tw-me-2 tw-inline-block" fill="#cfcfcf" />
                                    Download Receipt
                                </Button>
                            </div>
                            <div
                                id="print-div"
                                ref={printDivRef}
                                dangerouslySetInnerHTML={{ __html: previewFeeReceiptResp }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PreviewReceiptPage;

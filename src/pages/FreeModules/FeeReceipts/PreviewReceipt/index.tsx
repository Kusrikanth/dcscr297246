import  { useRef, useEffect, } from "react";

import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

import BackButtonText from "../../../../Components/Common/BackButtonText";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";

import { previewFeeReceiptAct, downloadFeeReceiptAct, setPreviewFeeReceiptAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { useLocation, useParams } from "react-router-dom";

//Utility
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as DownloadSvg } from "../../../../assets/imagesdps/academics/Download.svg?react";
import { printDocumentHandler } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";

const NewFeeReceiptPage = () => {
    const { receiptId }: any = useParams();
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

    const newFeeReceiptResp = useRef<any>({
        prevDownloadFeeReceiptResp: downloadFeeReceiptResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp
    });
    const printDivRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (receiptId) {
            const params = {
                receiptId
            };
            dispatch(previewFeeReceiptAct(generateActionPayload("preview_receipt", params)));
        }
    }, [receiptId]);

    useEffect(() => {
        return ()=>{
           dispatch(setPreviewFeeReceiptAct(undefined))
        }
    }, [])

    function convertBlobToReceipt(blobStream: any, fileName: any) {
        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
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

    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }
    return (
        <>
            <div className="page-content new_fee_receipt_page_warp">
                <div className="container-fluid">
                    <BreadCrumb title="Preview Receipt" pageTitle="Fee" />

                    <BackButtonText
                        title={location.state ? "<< Back to Fee Summary" : "<< Back to Receipt List"}
                        link={location?.state ? "/student-fee-ledger/fee-details" : "/fee-receipts"}
                        otherDetails={{
                            studentId: location.state?.studentId,
                            academicYearId: location.state?.academicYearId,
                            curriculumId: location.state?.curriculumId,
                            classId: location.state?.classId,
                        }}
                    />

                    <div className="tw-bg-white tw-rounded-md tw-shadow">

                        <div className="tw-border-b tw-p-4">
                            <div className="tw-flex tw-items-center">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Preview Receipt
                                </h4>
                            </div>
                        </div>

                        <div className="tw-p-4">

                            <div className="tw-flex tw-justify-end tw-mb-3">
                                <Button
                                    onClick={printReceiptHndlr}
                                    variant="reject"
                                >
                                    <PrintSvg className="tw-mr-2 tw-inline-block" stroke="#FFFFFF" />
                                    Print Receipt
                                </Button>

                                <Button
                                    onClick={downloadReceiptHndlr}
                                    className="!tw-bg-[#405189] tw-text-white tw-px-4 tw-py-2 tw-rounded-md tw-flex tw-items-center hover:tw-opacity-90"
                                >
                                    <DownloadSvg fill="#cfcfcf" className="tw-mr-2 tw-inline-block" />
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

export default NewFeeReceiptPage;

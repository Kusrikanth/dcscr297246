import React, { useRef } from 'react'
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { printDocumentHandler } from "../../../../utility/commonutility";
const PreviewModal = () => {

    const {
        previewItFormResp,
    } =
        useAppSelector(({ feeApprovals }) => ({
                previewItFormResp: feeApprovals.previewItFormResp,

            }), shallowEqual);
    const printDivRef = useRef<HTMLDivElement>(null);

    function printReceiptHandlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }
    return (
        <div className='d-flex flex-column align-items-center justify-content-center'>
            {previewItFormResp && <div ref={printDivRef} dangerouslySetInnerHTML={{ __html: previewItFormResp }} className='mb-5'></div>}
            <button onClick={printReceiptHandlr} className="btn btn-info px-4 me-2 my-3">
                <PrintSvg />
                Print Receipt
            </button>
        </div>
    )
}

export default PreviewModal

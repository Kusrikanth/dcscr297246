import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { downloadApplicationSaleById, previewApplicationSaleById } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useAppSelector } from '../../../../hooks/storehook';
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { printDocumentHandler } from '../../../../utility/commonutility';
// import { Document, Page,pdfjs  } from 'react-pdf'

const PreviewModal = (props: any) => {
    const [numPages, setNumPages] = useState(null);
    const dispatch=useDispatch();
    const onDocumentLoadSuccess = ({ numPages }:any) => {
        setNumPages(numPages);
    };

    const printDivRef = useRef<HTMLDivElement>(null);
    function printReceiptHndlr() {
        const innerHTMLContent: string = printDivRef.current?.innerHTML || "";
        printDocumentHandler(innerHTMLContent);
    }

    useEffect(()=>{
        if(props.applicationId){
            dispatch(previewApplicationSaleById(generateActionPayload('preview_application_sale', { applicationId: props.applicationId })));
        }
    },[props.applicationId])

    const {
        previewApplicationSaleByIdResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,

    }: any = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections, applicationSale }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            applicationSaleListResp: applicationSale.applicationSaleListResp,
            sendPaymentLinkApplicationSaleStatusResp: applicationSale.sendPaymentLinkApplicationSaleStatusResp,
            sendEmailNotificationStatusResp: applicationSale.sendEmailNotificationStatusResp,
            sendSMSNotificationStatusResp: applicationSale.sendSMSNotificationStatusResp,
            cancelApplicationSaleByIdResp: applicationSale.cancelApplicationSaleByIdResp,
            downloadApplicationSaleByIdResp: applicationSale.downloadApplicationSaleByIdResp,
            previewApplicationSaleByIdResp: applicationSale.previewApplicationSaleByIdResp,
            applicationSaleError: applicationSale.applicationSaleError,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );
    
    return (
        <div className='d-flex flex-column align-items-center justify-content-center'>
            {previewApplicationSaleByIdResp && <div ref={printDivRef} dangerouslySetInnerHTML={{ __html: previewApplicationSaleByIdResp }} className='mb-5'></div>}
            <button onClick={printReceiptHndlr} className="btn btn-info px-4 me-2 my-3 text-center">
                {/* <PrintSvg /> */}
                Print Receipt
            </button>
        </div>
    )
}

export default PreviewModal

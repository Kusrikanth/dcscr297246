import React, { useRef, useState } from 'react'
import { useMemo, useEffect } from 'react'
import { generateColumnsApproveDocument} from './helper';
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import TableContainer from '../../../../Components/Common/TableContainer';
import { shallowEqual, useDispatch } from 'react-redux';
import { generateAdmissionFormPdfAct, getPreliminaryScrutinyDocuments, updatePreliminaryScrutinyDocumentStatus } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useAppSelector } from '../../../../hooks/storehook';
import { setShowGlobalLoaderAct } from '../../../../store/global/globalslice';
import Button from '../../../../Components/Common/Button';

const ApprovalDocumentData = [
    {
        registrationId: "RNH23001",
        studentName: "Harshil A. Shrimankar",
        class: "VI",
        phoneNo: "+91-1234567890",
        documents:
            [{
                id: 1,
                documentName: "demo aadhaar.pdf",
                identityProof: "Identity Proof ",
                status: "APPROVED",
            },
            {
                id: 2,
                documentName: "demo pancard.pdf",
                identityProof: "address Proof ",
                status: "PENDING",
            },
            {
                id: 3,
                documentName: "demo passport.pdf",
                identityProof: "nationality Proof ",
                status: "REJECTED",
            },]
    }
]

const ShowDocumentModal = (props?: any) => {


    const dispatch = useDispatch();

    const menuOptions = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <EyeSvg className="d-inline-block me-2" fill='#878A99' />,
                actionName: "View",
                onClickHndlr: (event: any) => {
                    //   toggleHostelExitApprovalViewLedgerModal();
                    // const { currentTarget } = event
                    // const link = currentTarget.getAttribute("data-id");
                    // var element = document.createElement('a');
                    // element.setAttribute('href', link);
                    // element.click();
                },
            },
        ],
        []
    );


    const [documentList, setDocumentList] = useState<any>([])

    const {
        preliminaryScrutinyDocumentList,
        updatePreliminaryScrutinyDocumentStatusResp,
        applicationSaleError,
        showApiLoader,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,

    }: any = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, globalData, feeConcession, feeCollections, applicationSale }) => ({
            preliminaryScrutinyDocumentList: applicationSale.preliminaryScrutinyDocumentList,
            updatePreliminaryScrutinyDocumentStatusResp: applicationSale.updatePreliminaryScrutinyDocumentStatusResp,
            applicationSaleError: applicationSale.applicationSaleError,
            showApiLoader: globalData.showApiLoader,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    const updateDocumentStatus = (documentId: any, status: any) => {
        //    const menuId = event?.currentTarget.getAttribute("data-id")
        const updated: any = documentList?.map((reg: any) => +reg.documentId === +documentId ? ({ ...reg, status: status }) : reg)
        setDocumentList(updated);

    }

    const roleColumns = useMemo(() => generateColumnsApproveDocument(menuOptions, updateDocumentStatus), [documentList]);

    useEffect(() => {
        if (typeof (props.regId) === "string" && props.regId) {
            dispatch(getPreliminaryScrutinyDocuments(generateActionPayload('get_priliminary_scrutiny_document_list', { applicationId: props.regId })))
        }
    }, [props.regId])

    useEffect(() => {
        if (preliminaryScrutinyDocumentList) {
            setDocumentList(preliminaryScrutinyDocumentList?.studentRegdDocumentsResponseDTOS);
        }

    }, [preliminaryScrutinyDocumentList])

    const ApprovalSubmission = () => {
        dispatch(setShowGlobalLoaderAct(true));
        const payload = documentList.filter((document: any) => document?.status === "approve" || document?.status === "reject").map((document: any) => ({
            id: document.id,
            approvalStatus: document?.status === "approve" ? "APPROVED" : "RESUBMISSION"
        }))
        dispatch(updatePreliminaryScrutinyDocumentStatus(generateActionPayload('update_priliminary_scrutiny_document_status', { applicationId: props.regId, scrutinyId: props.scrutinyId }, payload)))
    }

    const ConsolidateViewHandler: any = () => {
        if (props?.regId) {
            // dispatch(generateAdmissionFormPdfAct(generateActionPayload('generate_admission_form_pdf', { id: props?.regId },undefined,{
            //     responseType: 'blob'
            // })))
            props?.toggleConsolidatedViewConfomationModal(props?.regId)
        }
    }

    const { disableAction, actionType } = useMemo(() => {
        let alreadyApprovedDocs = 0,
            userApproved = 0, userRejected = 0, actionType = "CORRECT_DOCS";
        for (let i = 0; i < documentList.length; i++) {
            if (documentList[i].approvalStatus === "APPROVED") {
                alreadyApprovedDocs += 1;
            } else if (documentList[i].status === "approve") {
                userApproved += 1;
            } else if (documentList[i].status === "reject") {
                userRejected += 1;
            }
        }
        if (alreadyApprovedDocs + userApproved === documentList.length) {
            actionType = "APPROVE_DOCS";
        }
        return {
            disableAction: !((alreadyApprovedDocs + userRejected + userApproved) === documentList.length),
            actionType
        };
    }, [documentList]);

    return (
        <div className="tw-grid tw-grid-cols-12 tw-p-3 tw-gap-3">
            <div className="tw-col-span-6">
                Registration Id : <span className="tw-text-gray-400"> {preliminaryScrutinyDocumentList?.regNo}</span>
            </div>
            <div className="tw-col-span-6">
                Student Name : <span className="tw-text-gray-400"> {preliminaryScrutinyDocumentList?.studentName}</span>
            </div>
            <div className="tw-col-span-6">
                class : <span className="tw-text-gray-400"> {preliminaryScrutinyDocumentList?.classShortName}</span>
            </div>
            <div className="tw-col-span-6">
                Phone no : <span className="tw-text-gray-400">{preliminaryScrutinyDocumentList?.phoneNo}</span>
            </div>
            <div className="tw-col-span-6">
                Consolidated View :{" "}
                <span
                    className="tw-underline tw-cursor-pointer"
                    onClick={ConsolidateViewHandler}
                    style={{ color: "#25A0E2" }}
                >
                    Download
                </span>
            </div>

            <div className="tw-col-span-12">
                <TableContainer
                    columns={roleColumns || []}
                    data={documentList || []}
                    divClass="tw-overflow-x-auto tw-mb-3"
                    theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                    showPagination={false}
                />
            </div>

            <div className="tw-col-span-12 tw-grid tw-grid-cols-12 tw-p-0">
                <div className="tw-col-span-12 tw-flex tw-w-auto tw-ml-auto tw-my-3 tw-gap-2">
                    <Button
                        type="button"
                        variant='secondary'
                        onClick={() => props?.toggle(undefined, undefined)}
                    >
                        Close
                    </Button>
                    {actionType === "CORRECT_DOCS" ? (
                        <Button
                            type="submit"
                            variant='info'
                            onClick={(event: any) => ApprovalSubmission()}
                            disabled={disableAction || showApiLoader}
                        >
                            Ask For Correction
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant='primary'
                            onClick={(event: any) => ApprovalSubmission()}
                            disabled={disableAction || showApiLoader}
                        >
                            Approve
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ShowDocumentModal

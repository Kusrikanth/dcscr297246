
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
    generateLedgerColumns, generateReceiptColumns, getSpecialFeesLedgers,
} from "./helper";

import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getFeeReceiptsAct, getSpecialFeeLedgersAct, sendEmailFeeReceiptAct, setFeeReceiptsAct, setLedgerDetailsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import PreviewReceiptModal from "./PreviewReceiptModal";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
};

const ParentFeeLedger = ({ studentId, academicYearId, branchId }: any) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [sendEmailModal, setSendEmailModal] = useState<any>({
        showModal: false,
        receiptId: "",
    });
    const [specialFeelistState, setSpecialFeelistState] = useState<Array<any>>([]);

    const [printReceiptModalState, setPrintReceiptModalState] = useState({
        showModal: false,
        receiptId: ""
    })

    const {
        academicYearListResp,
        specialFeeLedgersResp,
        currentInstIdResp: instituteId,
        showApiLoader,
        feeReceiptsResp,
        currentStudentId,
        sendEmailFeeReceiptResp,
        parentChildrensResp,
    }: any = useAppSelector(
        ({ globalData, instAcademics, appData, feeCollections, directoryStudent }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            feeReceiptsResp: feeCollections.feeReceiptsResp,
            specialFeeLedgersResp: feeCollections.specialFeeLedgersResp,
            currentStudentId: appData.currentStudentId,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sendEmailFeeReceiptResp: feeCollections.sendEmailFeeReceiptResp,
            parentChildrensResp: directoryStudent.parentChildrensResp,
        }), shallowEqual);

    const parentFeeLedgerRef = useRef({
        prevSendEmailFeeReceiptResp: sendEmailFeeReceiptResp
    })

    useEffect(() => {
        const { prevSendEmailFeeReceiptResp } = parentFeeLedgerRef.current;
        if (sendEmailFeeReceiptResp && sendEmailFeeReceiptResp !== prevSendEmailFeeReceiptResp) {
            toast.success("Fee Reciept Sent to registered Email Successfully.")
            toggleSendEmailModal();
        }
        parentFeeLedgerRef.current.prevSendEmailFeeReceiptResp = sendEmailFeeReceiptResp;
    }, [sendEmailFeeReceiptResp]);


    useEffect(() => {
        if (specialFeeLedgersResp) {
            const specialFeeList = getSpecialFeesLedgers(specialFeeLedgersResp);
            const paidFeeList = specialFeeList.filter((item: any) =>
                item.paymentStatus?.toLowerCase() === "paid");
            setSpecialFeelistState(paidFeeList);
        }
    }, [specialFeeLedgersResp]);

    useEffect(() => {
        if (studentId && academicYearId) {
            setSpecialFeelistState([]);
            dispatch(setLedgerDetailsAct(undefined));
            dispatch(setFeeReceiptsAct(undefined));
            getLedgerDetails(studentId, academicYearId);
            getFeeReceiptDetails(studentId, academicYearId);
        }
    }, [studentId, academicYearId]);

    useEffect(() => {
        return () => {
            dispatch(setLedgerDetailsAct(undefined));
            dispatch(setFeeReceiptsAct(undefined));
        }
    }, []);


    const getLedgerDetails = (studentId: any, academicYearId: any) => {
        let params = {
            studentId: studentId,
            academicYearId: academicYearId,
        }
        dispatch(getSpecialFeeLedgersAct(generateActionPayload('get_special_pay_fee_details', undefined, params)));
    }

    const getFeeReceiptDetails = (studentId: any, academicYearId: any) => {
        let payload1 = {
            studentId: studentId,
            studentName: null,
            branchId: branchId,
            instituteId,
            academicYearId: academicYearId,
            studentTypes: ["SPECIAL_FEE"]
        };
        dispatch(getFeeReceiptsAct(generateActionPayload('fee_receipt_details', undefined, payload1)))
    }

    function printReceiptHndlr(event: any) {
        const feeReceiptId = event.currentTarget.getAttribute("data-id");
        if (feeReceiptId) {
            setPrintReceiptModalState((prevState) => ({
                ...prevState, showModal: true,
                receiptId: feeReceiptId
            }));
        }
    }
    const sendEmailModalHndler = () => {
        dispatch(sendEmailFeeReceiptAct(generateActionPayload('send_email_fee_reciept', { receiptId: sendEmailModal.receiptId }, undefined)))
    }
    const toggleSendEmailModal = (id?: any) => {
        setSendEmailModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            receiptId: id || "",
        }));
    };

    function toggleReceiptModalHanlder() {
        setPrintReceiptModalState(prevState => ({ ...prevState, showModal: !prevState.showModal }));
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "sendEmail",
                actionIcon: <i className="fs-16 ri-send-plane-fill text-muted"></i>,
                actionName: "Send Email",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    if (id) {
                        toggleSendEmailModal(id)
                    }
                },
            },
            {
                id: "print",
                actionIcon: <PrintSvg className="me-2 d-inline-block" stroke="#707070"
                    style={{ height: '16px', width: '16px' }}
                />,
                actionName: "Print",
                onClickHndlr: printReceiptHndlr,
            }
        ], [feeReceiptsResp]);

    const ledgerColumns = useMemo(() => generateLedgerColumns(), [specialFeeLedgersResp]);
    const receiptColumns = useMemo(() => generateReceiptColumns(menuOptions), [menuOptions, feeReceiptsResp]);
    const { data: feeReceiptData } = feeReceiptsResp || {};
    return (
        <>
            <div className="tw-pl-3 tw-mb-2 tw-py-3" style={{ background: "rgba(64, 81, 137, 0.05)", color: "#3a497b", fontWeight: 700, fontSize: "0.95rem" }}>
                Special Fee Details
            </div>
            <div>
                <TableContainer
                    columns={ledgerColumns}
                    data={Array.isArray(specialFeelistState) ? specialFeelistState : []}
                    divClass="table-responsive tw-mb-3"
                    theadClass="tw-align-middle"
                />
            </div>
            <div className="tw-pl-3 tw-mb-2 tw-py-3" style={{ background: "rgba(64, 81, 137, 0.05)", color: "#3a497b", fontWeight: 700, fontSize: "0.95rem" }}>
                Receipts
            </div>
            <div>
                <TableContainer
                    columns={receiptColumns}
                    data={Array.isArray(feeReceiptData) ? feeReceiptData : []}
                    divClass="table-responsive tw-mb-1"
                    theadClass="tw-align-middle"
                />
            </div>
            <ConfirmationModal
                id="fee-reciepts-send-email-modal"
                isOpen={sendEmailModal.showModal}
                confirmMessage="You want to Send an Email ?"
                cancelHndlr={() => toggleSendEmailModal()}
                confirmHndlr={sendEmailModalHndler}
                isDisble={showApiLoader}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
            <ModalContainerUpdated
                id="Print Receipt"
                modalTitle="Print Receipt"
                toggle={toggleReceiptModalHanlder}
                isOpen={printReceiptModalState.showModal}>
                <PreviewReceiptModal
                    receiptId={printReceiptModalState.receiptId}

                />
            </ModalContainerUpdated>
        </>
    );
};

export default ParentFeeLedger;

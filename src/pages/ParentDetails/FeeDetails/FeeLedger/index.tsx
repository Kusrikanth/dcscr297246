
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
    generateLedgerColumns, generateReceiptColumns,
} from "./helper";

import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getFeeReceiptsAct, getFeeSummaryDetailsAct, getLedgerDetailsAct, sendEmailFeeReceiptAct, setFeeReceiptsAct, setFeeSummaryDetailsAct, setLedgerDetailsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { ConfirmationModal, ModalContainerUpdated, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDateMonthYearFormat } from "../../../../utility/dateutility";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import PreviewReceiptModal from "./PreviewReceiptModal";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    type: "",
};

const ParentFeeLedger = ({ branchId , academicYearId }: any) => {
    const history = useHistory();

    const dispatch = useDispatch();
    const [sendEmailModal, setSendEmailModal] = useState<any>({
        showModal: false,
        receiptId: "",
    });
    const [printReceiptModalState, setPrintReceiptModalState] = useState({
        showModal: false,
        receiptId: ""
    })

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        feeSummaryList,
        ledgerDetails,
        classroomManagmentErrorResp,
        currentInstIdResp: instituteId,
        exportFeeSummaryResp,
        showApiLoader,
        feeSummaryDetails,
        feeReceiptsResp,
        currentStudentId,
        sendEmailFeeReceiptResp,
        parentChildrensResp,
    }: any = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeCollections, directoryStudent }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
            feeSummaryList: feeCollections.feeSummaryList,
            feeReceiptsResp: feeCollections.feeReceiptsResp,
            ledgerDetails: feeCollections.ledgerDetails,
            feeSummaryDetails: feeCollections.feeSummaryDetails,
            exportFeeSummaryResp: feeCollections.exportFeeSummaryResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentStudentId: appData.currentStudentId,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sendEmailFeeReceiptResp: feeCollections.sendEmailFeeReceiptResp,
            parentChildrensResp: directoryStudent.parentChildrensResp,
        }),
        shallowEqual
    );
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
    const { ledgers: LedgerList, basicDetails: StudentDetails } = ledgerDetails || {};

    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
        const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);
    useEffect(() => {
        if (currentStudentId && parentChildrensResp && academicYearId) {
            getLedgerDetails(currentStudentId, academicYearId)
            getFeeSummaryList(currentStudentId, academicYearId)
            getFeeReceiptDetails(currentStudentId, academicYearId)
        }
    }, [currentStudentId, parentChildrensResp,academicYearId]);

    useEffect(() => {
        return () => {
            dispatch(setLedgerDetailsAct(undefined));
            dispatch(setFeeSummaryDetailsAct(undefined));
            dispatch(setFeeReceiptsAct(undefined));
        }
    }, []);


    const getLedgerDetails = (studentId: any, academicYearId: any) => {
        let payload = {
            studentId: studentId,
            branchId: branchId,
            academicYearId: academicYearId,
            studentInfo: "studentInfo",
            allowStudentConcession: "",
            allowEmployeeConcession: "",
            allowRefund: "",
            feeType: [],
            // instituteDeptId: [1, 4],
            instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
            paymentStatus: ""
        }
        dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));
    }

    const getFeeSummaryList = (studentId: any, academicYearId: any) => {
        let params1 = { branchId: branchId, searchString: "", academicYearId: academicYearId, studentId: studentId };
        dispatch(getFeeSummaryDetailsAct(generateActionPayload('fee_summary_list', undefined, params1)));
    }

    const getFeeReceiptDetails = (studentId: any, academicYearId: any) => {
        let payload1 = {
            studentId: studentId,
            studentName: null,
            instituteId: instituteId,
            branchId: branchId,
            academicYearId: academicYearId,
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

    const LedgerColumns = useMemo(() => generateLedgerColumns(), []);
    const ReceiptColumns = useMemo(() => generateReceiptColumns(menuOptions), [menuOptions]);

    const { data: academicYearList } = academicYearListResp || {};
    // const { data: SectionList,totalPages,totalElements,pageNumber } = sectionListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { data: FeeReceiptData } = feeReceiptsResp || {};
    const { data: FeeSummaryDetails } = feeSummaryDetails || {};
    const { data: FeeSummary, totalPages, totalElements, pageNumber } = feeSummaryList || {};

    return (
        <>


            <div className="tw-p-5">
                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Fee Summary</p>
                    <div className="tw-grid tw-grid-cols-3 tw-gap-y-3">
                        <div className="tw-flex tw-text-sm">
                            <p className="tw-text-gray-500 tw-inline-block tw-w-1/2">Total Fee :</p>
                            ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].amountToPay)}
                        </div>
                        <div className="tw-flex tw-text-sm">
                            <p className="tw-text-gray-500 tw-inline-block tw-w-1/2 tw-pr-3">Total Concession :</p>
                            ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].totalConcession)}
                        </div>
                        <div className="tw-flex tw-text-sm">
                            <p className="tw-text-gray-500 tw-inline-block tw-w-1/2 tw-pr-3">Total Payable :</p>
                            ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].netAmount)}
                        </div>

                        <div className="tw-flex tw-text-sm">
                            <p className="tw-text-gray-500 tw-inline-block tw-w-1/2">Paid Amount :</p>
                            ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].amountPaid)}
                        </div>
                        <div className="tw-flex tw-text-sm">
                            <p className="tw-text-gray-500 tw-inline-block tw-w-1/2 tw-pr-3">Previous Balance :</p>
                            ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].previousYearBalance)}
                        </div>
                        <div className="tw-flex tw-text-sm">
                            <p className="tw-text-gray-500 tw-inline-block tw-w-1/2">Total Refund :</p>
                            ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].totalRefunds)}
                        </div>

                        <div className="tw-flex tw-text-sm">
                            <p className="tw-text-gray-500 tw-inline-block tw-w-1/2 tw-pr-3">
                                Balance on :<br />
                                <span>({getDateMonthYearFormat(new Date())})</span>
                            </p>
                            ₹ {FeeSummaryDetails && FeeSummaryDetails.length > 0 && getDisplayAmountValue(FeeSummaryDetails[0].amountToBePaid)}
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="tw-pl-3 tw-mb-2 tw-py-3 tw-font-bold tw-text-[0.95rem]"
                style={{ background: "rgba(64, 81, 137, 0.05)", color: "#3a497b" }}
            >
                Ledger Details
            </div>
            <div>
                <TableContainer
                    columns={LedgerColumns || []}
                    data={LedgerList || []}
                    divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                />
            </div>

            <div
                className="tw-pl-3 tw-mb-2 tw-py-3 tw-font-bold tw-text-[0.95rem]"
                style={{ background: "rgba(64, 81, 137, 0.05)", color: "#3a497b" }}
            >
                Receipts
            </div>
            <div>
                <TableContainer
                    columns={ReceiptColumns || []}
                    data={FeeReceiptData || []}
                    divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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

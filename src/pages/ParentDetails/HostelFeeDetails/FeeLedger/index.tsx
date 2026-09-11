
import { useEffect, useMemo, useRef, useState } from "react";
import {
    generateLedgerColumns, generateReceiptColumns,
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getFeeReceiptsAct, sendEmailFeeReceiptAct, setFeeReceiptsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { ConfirmationModal, ModalContainerUpdated, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDateMonthYearFormat } from "../../../../utility/dateutility";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import PreviewReceiptModal from "./PreviewReceiptModal";
import { getHostelStuLedgerDetailsAct, setHostelStuLedgerDetailsAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";

const ParentHostelFeeLedger = ({ branchId }: any) => {
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
        getHostelStuLedgerDetailsResp,
        currentInstIdResp: instituteId,
        showApiLoader,
        feeReceiptsResp,
        currentStudentId,
        sendEmailFeeReceiptResp,
        parentChildrensResp,
    }: any = useAppSelector(
        ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics,
            appData, feeCollections, directoryStudent, hostelStuLedger }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                feeSummaryList: feeCollections.feeSummaryList,
                feeReceiptsResp: feeCollections.feeReceiptsResp,
                exportFeeSummaryResp: feeCollections.exportFeeSummaryResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentStudentId: appData.currentStudentId,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader: globalData.showApiLoader,
                sendEmailFeeReceiptResp: feeCollections.sendEmailFeeReceiptResp,
                parentChildrensResp: directoryStudent.parentChildrensResp,
                getHostelStuLedgerDetailsResp: hostelStuLedger.getHostelStuLedgerDetailsResp,
                hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
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
    useEffect(() => {
        const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }, []);

    const getHostelStuLedgerDetails = (studentId: any, academicYearId: any) => {
        let payload = {
            studentId: studentId,
            branchId: branchId,
            academicYearId: academicYearId,
            studentInfo: "studentInfo",
            allowStudentConcession: "",
            allowEmployeeConcession: "YES",
            allowRefund: "NO",
            sortBy: "id"
        }
        dispatch(getHostelStuLedgerDetailsAct(generateActionPayload('hostel_stu_ledger_details', undefined, payload)));
    }

    const getFeeReceiptDetails = (studentId: any, academicYearId: any) => {
        let payload = {
            studentId: studentId,
            branchId: branchId,
            academicYearId: academicYearId,
        };
        dispatch(getFeeReceiptsAct(generateActionPayload('get_hostel_fee_receipts', undefined, payload)))
    }

    useEffect(() => {
        if (currentStudentId && parentChildrensResp) {
            const studentDetails: any = parentChildrensResp?.find((i: any) => +i?.childId === +currentStudentId);
            getHostelStuLedgerDetails(currentStudentId, studentDetails?.academicYearId);
            getFeeReceiptDetails(currentStudentId, studentDetails?.academicYearId);
        }
    }, [currentStudentId, parentChildrensResp]);

    useEffect(() => {
        return () => {
            dispatch(setHostelStuLedgerDetailsAct(undefined));
            dispatch(setFeeReceiptsAct(undefined));
        }
    }, []);

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
        dispatch(sendEmailFeeReceiptAct(generateActionPayload('send_email_hostel_fee_reciept', { receiptId: sendEmailModal.receiptId }, undefined)))
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

    const ledgersColumn = useMemo(() => generateLedgerColumns(), [getHostelStuLedgerDetailsResp]);
    const receiptColumns = useMemo(() => generateReceiptColumns(menuOptions), [feeReceiptsResp, menuOptions]);
    const { ledgersDtos: ledgersList, feeSummeryDto: feeSummaryDetails } = getHostelStuLedgerDetailsResp || {};
    const { data: feeReceipts } = feeReceiptsResp || {};
    return (
        <>
            <div className="card-body">
                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "10px", marginTop: "20px" }}>
                    <p className='tw-text-sm' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>Fee Summary</p>
                    <div>
                        <div className='tw-flex tw-flex-wrap tw-mb-3'>
                            <div className='lg:tw-w-1/3 tw-w-full'>
                                <div className='tw-flex tw-text-[14px]'>
                                    <p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-mb-0'>Total Fee :</p>
                                    ₹ {feeSummaryDetails && getDisplayAmountValue(feeSummaryDetails?.totalFee)}</div>
                            </div>
                            <div className='lg:tw-w-1/3 tw-w-full'>
                                <div className='tw-flex tw-text-[14px]'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-pr-3 tw-mb-0'>Total Concession:</p>
                                    ₹ {feeSummaryDetails && getDisplayAmountValue(feeSummaryDetails?.totalConcession)}</div>
                            </div>
                            <div className='lg:tw-w-1/3 tw-w-full'>
                                <div className='tw-flex tw-text-[14px]'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-pr-3 tw-mb-0'>Total Payable :</p>
                                    ₹ {feeSummaryDetails && getDisplayAmountValue(feeSummaryDetails?.totalPayble)}
                                </div>
                            </div>
                        </div>
                        <div className='tw-flex tw-flex-wrap tw-mb-3'>
                            <div className='lg:tw-w-1/3 tw-w-full'>
                                <div className='tw-flex tw-text-[14px]'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-mb-0'>Paid Amount :</p>
                                    ₹ {feeSummaryDetails && getDisplayAmountValue(feeSummaryDetails?.paidAmount)}</div>
                            </div>
                            <div className='lg:tw-w-1/3 tw-w-full'>
                                <div className='tw-flex tw-text-[14px]'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-pr-3 tw-mb-0'>Previous Balance :</p>
                                    ₹ {feeSummaryDetails && getDisplayAmountValue(feeSummaryDetails?.previousBalance)}</div>
                            </div>
                            <div className='lg:tw-w-1/3 tw-w-full'>
                                <div className='tw-flex tw-w-full'>
                                    <div className='tw-flex tw-text-[14px] tw-w-full'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-mb-0'>Total Refund :</p>
                                        ₹ {feeSummaryDetails && getDisplayAmountValue(feeSummaryDetails?.totalRefund)}</div>
                                </div>
                            </div>

                        </div>
                        <div className='tw-flex tw-flex-wrap'>
                            <div className='lg:tw-w-1/3 tw-w-full'>
                                <div className='tw-flex tw-text-[14px]'><p className='tw-w-1/2 tw-text-gray-500 tw-inline-block tw-pr-3 tw-mb-0'>
                                    Balance on :<br /><span>({getDateMonthYearFormat(new Date())})</span></p>
                                    ₹ {feeSummaryDetails && getDisplayAmountValue(feeSummaryDetails?.unpaidAmount)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="tw-pl-3 tw-mb-2 tw-py-3 tw-bg-[rgba(64,81,137,0.05)] tw-text-[#3a497b] tw-font-[700] tw-text-[0.95rem]">
                Ledger Details
            </div>
            <div>
                <TableContainer
                    columns={ledgersColumn}
                    data={Array.isArray(ledgersList) ? ledgersList : []}
                    divClass="table-responsive tw-mb-3"
                    theadClass="tw-align-middle"
                />
            </div>
            <div className="tw-pl-3 tw-mb-2 tw-py-3 tw-bg-[rgba(64,81,137,0.05)] tw-text-[#3a497b] tw-font-[700] tw-text-[0.95rem]">
                Receipts
            </div>
            <div>
                <TableContainer
                    columns={receiptColumns}
                    data={Array.isArray(feeReceipts) ? feeReceipts : []}
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

export default ParentHostelFeeLedger;

import { HugeiconsIcon } from "@hugeicons/react"
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard"
import { StatusLabel, UserDetails } from "../../../../Components/Common"
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions"
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility"
import {  convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility"

// Values stored against jodo_payment_method on the student fee ledger records.
export const JODO_PAYMENT_METHODS: Record<string, { label: string, statusType: string }> = {
    CRED_OPTED: { label: "CRED Opted", statusType: "cred" },
    FLEX_OPTED: { label: "Flex Opted", statusType: "flex" },
}

export const JODO_PAYMENT_METHOD_OPTIONS = Object.entries(JODO_PAYMENT_METHODS)
    .map(([value, { label }]) => ({ value, label }))

export function getJodoPaymentMethodLabel(jodoPaymentMethod: any) {
    if (!jodoPaymentMethod) {
        return "";
    }
    return JODO_PAYMENT_METHODS[jodoPaymentMethod]?.label || String(jodoPaymentMethod).replace(/_/g, " ");
}

function EditLedgerIcon({ title, onClick }: { title: string, onClick: () => void }) {
    return (
        <span role="button" title={title} className="cursor-pointer text-muted" onClick={onClick}>
            <HugeiconsIcon icon={PencilEdit02Icon} size={16} />
        </span>
    )
}

export function generateFeeDetailsColumns() {
    return ([
        {
            Header: "Fee Name",
            accessor: "feeName",
            disableSortBy: true
        },
        {
            Header: "Fee Type",
            accessor: "feeType",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => <>{original?.feeType === 'One Time Fee' ? '-' : original?.feeType}</>
        },
        {
            Header: "Total Amount (₹)",
            accessor: "totalAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.totalAmount)}</span>
            },
        },
        {
            Header: "Concession (₹)",
            accessor: "studentConcession",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.studentConcession)}</span>
            },
        },
        {
            Header: "Amount Payable (₹)",
            accessor: "amountToBePaid",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.amountToBePaid)}</span>
            },
        },
    ])
}
export function generateScheduledColumns() {
    return ([
        {
            Header: "Fee Details",
            accessor: "feeDetails",
            disableSortBy: true
        },
        {
            Header: "Due Date",
            accessor: "lastDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.lastDate)}</span>
            },
        },
        {
            Header: "Amount Payable (₹)",
            accessor: "totalAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.totalAmount)}</span>
            },
        },
        {
            Header: "Amount Paid (₹)",
            accessor: "amountPaid",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.amountPaid)}</span>
            },
        },
        {
            Header: "Unpaid Amount (₹)",
            accessor: "amountToBePaid",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getAmountValueWithDecimal(original?.amountToBePaid)}</span>
            },
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true
        },
    ])
}
export function generateLedgerColumns(actionsList: Array<IOptionsHrtl>, editLedgerHndlr?: (ledger: any) => void) {
    return ([
        {
            Header: "Fee Details",
            accessor: "feeDetails",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px]",
        },
        {
            Header: "Last Date",
            accessor: "lastDate",
            disableSortBy: true,
            columnClassName: "tw-w-[150px] tw-min-w-[150px]",
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.lastDate)}</span>
            },
        },
        {
            Header: "Fee Amount (₹)",
            accessor: "amountToPay",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.amountToPay)}</span>
            },
        },
        {
            Header: "Concession (₹)",
            accessor: "totalConcession",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.totalConcession)}</span>
            },
        },
        // {
        //     Header: "Card Charges (₹)",
        //     accessor: "cardCharges",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return <span>{getAmountValueWithDecimal(original?.cardCharges)}</span>
        //     },
        // },
        // {
        //     Header: "Fine (₹)",
        //     accessor: "fineAmount",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return <span>{getAmountValueWithDecimal(original?.fineAmount)}</span>
        //     },
        // },
        {
            Header: "Amount To Pay (₹)",
            accessor: "netAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.netAmount)}</span>
            },
        },
        {
            Header: "Actual Amount Paid (₹)",
            accessor: "actualAmountPaid",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.actualAmountPaid)}</span>
            },
        },
        {
            Header: "Amount Paid (₹)",
            accessor: "amountPaid",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.amountPaid)}</span>
            },
        },
        {
            Header: "Balance (₹)",
            accessor: "amountToBePaid",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.amountToBePaid)}</span>
            },
        },
        {
            Header: "Excess Amt (₹)",
            accessor: "excessAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.excessAmount)}</span>
            },
        },
        {
            Header: "Refunded Amt (₹)",
            accessor: "refundedAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.refundedAmount)}</span>
            },
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true,
        },
        {
            Header: "Status",
            accessor: "paymentStatus",
            disableSortBy: true,
            columnClassName: "sticky-right-second !tw-z-10 !tw-bg-white",
            tdClass: "sticky-right-second !tw-z-10",
            Cell: ({ row: { original } }: any) => {
                return <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
            },
        },
        {
            // Holds the jodo payment method along with the entry point to edit the ledger.
            Header: "Actions",
            accessor: "jodoPaymentMethod",
            disableSortBy: true,
            columnClassName: "sticky-right !tw-z-10 !tw-bg-white tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
            tdClass: "sticky-right !tw-z-10",
            Cell: ({ row: { original } }: any) => {
                const jodoPaymentMethod = original?.jodoPaymentMethod;
                return (
                    <div className="d-flex align-items-center tw-gap-2">
                        {jodoPaymentMethod
                            ? <StatusLabel
                                type={JODO_PAYMENT_METHODS[jodoPaymentMethod]?.statusType || jodoPaymentMethod}
                                labelName={getJodoPaymentMethodLabel(jodoPaymentMethod)}
                            />
                            : <span>-</span>}
                        {editLedgerHndlr && (
                            <EditLedgerIcon title="Edit Ledger Details" onClick={() => editLedgerHndlr(original)} />
                        )}
                    </div>
                )
            },
        },
        // {
        //     Header: "Actions",
        //     filterable: false,
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         if(+original?.amountPaid !== 0){
        //             return
        //         }
        //       return (
        //         <MoreActions actionOptions={actionsList} rowId={original.id} isHorizontal={true}/>
        //       );
        //     },
        //   },
    ])
}
export function generateReceiptColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Date",
            accessor: "receiptDate",
            disableSortBy: true,
            columnClassName: "tw-w-[120px] tw-min-w-[120px]",
            Cell: ({ row: { original } }: any) => {
                return getDdMmYyyyWithMonthNameFormat(new Date(original.receiptDate))
            },
        },
        {
            Header: "Receipt No",
            accessor: "receiptNumber",
            disableSortBy: true
        },
        {
            Header: "Fee Name",
            accessor: "feeName",
            disableSortBy: true,
            columnClassName: "tw-w-[250px] tw-min-w-[250px]",
            Cell: ({ row: { original } }: any) => {
                let abc = ""
                original?.feeDetailVOList?.map((fee: any, index: any) => {
                    abc = abc + fee.feeDetail + ((index !== (original?.feeDetailVOList?.length - 1)) ? "," : "")
                })
                return abc;
            }
        },
        {
            Header: "Payment Mode",
            accessor: "paymentMode",
            disableSortBy: true
        },
        {
            Header: "Actual Amount",
            accessor: "amountToPay",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.amountToPay)}</span>
                // <div className="d-flex align-items-center">
                {/* <RupeeSvg width="11px" height="11px" fill={"#495057"} /> */ }
                {/* </div> */ }
            },
        },
        {
            Header: "Paid Amount",
            accessor: "currentPaidAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.currentPaidAmount)}</span>
                // <div className="d-flex align-items-center">
                {/* <RupeeSvg width="11px" height="11px" fill={"#495057"} /> */ }
                {/* </div> */ }
            },
        },
        {
            Header: "Fine",
            accessor: "fine",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.fine)}</span>
                // <div className="d-flex align-items-center">
                {/* <RupeeSvg width="11px" height="11px" fill={"#495057"} /> */ }
                {/* </div> */ }
            },
        },
        {
            Header: "Card Charges",
            accessor: "cardCharges",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.cardCharges)}</span>
                // <div className="d-flex align-items-center">
                {/* <RupeeSvg width="11px" height="11px" fill={"#495057"} /> */ }
                {/* </div> */ }
            },
        },
        {
            Header: "Reference No",
            accessor: "transactionId",
            disableSortBy: true,

        },
        {
            Header: "Cheque Status",
            accessor: "chequeStatus",
            disableSortBy: true
        },
        {
            Header: "Receipt Status",
            accessor: "receiptStatus",
            disableSortBy: true
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}


function FeeNameTable({ row: { original, id } }: any) {
    const { concessionChildList, feeTuitionChildResponse } = original || {};
    if (Array.isArray(concessionChildList)) {
        if (concessionChildList.length === 0) {
            return (<span>-</span>);
        } else {
            return (
                <div className="tw-flex tw-flex-col">
                    {
                        concessionChildList.map((item: any, index: any) => (<span className="tw-flex tw-uppercase tw-bg-gray-100 tw-text-gray-600 tw-font-semibold tw-p-2 tw-mb-1 tw-text-xs" key={`index-${id}-${index}`}>
                            <span className="tw-tw-text-nowrap" style={{ marginRight: '4px' }}>{item?.feeName || "-"}{" "}:</span>
                            <span className="tw-tw-text-nowrap">₹{getDisplayAmountValue(item?.concessionAmount)}</span>
                        </span>))
                    }
                </div>
            )
        }
    } else if (Array.isArray(feeTuitionChildResponse)) {
        if (feeTuitionChildResponse.length === 0) {
            return (<span>-</span>);
        } else {
            return (
                <div className="tw-flex tw-flex-col">
                    {
                        feeTuitionChildResponse.map((item: any, index: any) => (<span className="tw-flex tw-uppercase tw-bg-gray-100 tw-text-gray-600 tw-font-semibold tw-p-2 tw-mb-1 tw-text-xs" key={`index-${id}-${index}`}>
                            <span className="tw-text-nowrap" style={{ marginRight: '4px' }}>{item?.feeName || "-"}{" "}:</span>
                            <span className="tw-text-nowrap">₹{getDisplayAmountValue(item?.concessionAmount)}</span>
                        </span>))
                    }
                </div>
            )
        }
    }
    else {
        return (<span>-</span>);
    }
}
export function generateConcessionColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Created Date",
            accessor: "createdAt",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                const [date,time] = original?.createdAt?.split("T") ?? [];
                return <UserDetails
                            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
                            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
                            showAvatar={false}
                        ></UserDetails>
            }
        },
        {
            Header: "Created By",
            accessor: "createdBy",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                return <span>{original?.createdBy ? original?.createdBy : "-"}</span>
            }
        },
        {
            Header: "Fee Name",
            accessor: "feeName",
            disableSortBy: true,
            Cell: FeeNameTable,
        },
        {
            Header: "Concession Type",
            accessor: "concessionType",
            disableSortBy: true
        },
        {
            Header: "Concession Amount (₹)",
            accessor: "totalConcessionAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.totalConcessionAmount)}</span>
                // <div className="d-flex align-items-center">
                {/* <RupeeSvg width="11px" height="11px" fill={"#495057"} /> */ }
                {/* </div> */ }
            },
        },
        // {
        //     Header: "Type",
        //     accessor: "type",
        //     disableSortBy: true
        // },
        {
            Header: "Employee Name",
            accessor: "employeeName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{original?.employeeName ? original?.employeeName : "-"}</span>
            }
        },
        {
            Header: "Sibling Name",
            accessor: "siblingName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span>{original?.siblingName ? original?.siblingName : "-"}</span>
            }
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true
        },
        {
            Header: "Documents",
            accessor: "fileInfo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl
                        actionOptions={actionsList}
                        rowId={original.id}
                    />
                );
            },
        },

    ])
}
export function generateRefundsColumns() {
    return ([
        {
            Header: "Refund Date",
            accessor: "transactionDate",
            disableSortBy: true,
            columnClassName: "tw-w-[120px] tw-min-w-[120px] tw-max-w-[120px]",
            Cell: ({ row: { original } }: any) => {
                const refundDate =
                    original?.paymentMode === "ONLINE" || original?.paymentMode === "UPI"
                        ? original?.transactionDate
                        : original?.paymentMode === "CHEQUE"
                            ? original?.chequeDate
                            : original?.refundDate;
                return refundDate
                    ? getDdMmYyyyWithMonthNameFormat(new Date(refundDate))
                    : "-";
            },
        },
        {
            Header: "Refund Amount (₹)",
            accessor: "refundAmount",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (
                    <span>{getDisplayAmountValue(value)}</span>
                );
            },
        },
        {
            Header: "Payment Mode",
            accessor: "paymentMode",
            disableSortBy: true
        },
        {
            Header: "Adjustment Amount (₹)",
            accessor: "adjustAmount",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (
                    <span>{getDisplayAmountValue(value)}</span>
                );
            },
        },
        {
            Header: "Adjusted to",
            accessor: "adjustedTo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.adjustedStudentName}
                            showAvatar={false}
                            displayId={original?.adjustedStudentCode}
                        />
                    </>
                );
            },
        },
        {
            Header: "Amount (₹)",
            accessor: "cashAmount",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (
                    <span>{getDisplayAmountValue(value)}</span>
                );
            },
        },
        {
            Header: "Cheque No/Reference No",
            accessor: "chequeNumber",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                if (original?.paymentMode === "CHEQUE") {
                    return original?.chequeNumber || "-";
                }
                if (
                    original?.paymentMode === "ONLINE" ||
                    original?.paymentMode === "UPI"
                ) {
                    return original?.transactionId || "-";
                }
                return "-";
            },
        },
        {
            Header: "In the Name Of",
            accessor: "accountPayeeName",
            disableSortBy: true
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true
        },

    ])
}

// TODO: remove once the student-fee-ledger APIs (ledger, fee details, receipts, concessions, refunds,
// academic years) are reliable on the backend. Lets this page be reviewed without a live backend.
export const USE_SAMPLE_STUDENT_FEE_LEDGER = true;

export const sampleStudentFeeLedgerDetails = {
    basicDetails: {
        studentDetails: {
            id: 1260072,
            studentName: "eewW",
            studentCode: "1260072",
            studentImageBase64: "",
            contactNo: "9343434324",
            emailId: "parent.sample@example.com",
            dateOfAdmission: "2022-06-01",
            parentEmployeeStatus: "",
        },
        studentAcademicDetails: {
            curriculumId: 1,
            classId: 12,
            curriculumName: "CBSE",
            classShortName: "II",
            sectionName: "B",
            jodoStudentId: "JODO-10234",
        },
        studentParentDetails: [
            { name: "re", isEliteParent: true },
        ],
    },
    studentStatus: "active",
    admissionNo: "ADM-2022-0456",
    jodoOptedStatus: "Opted",
    jodoStudentId: "JODO-10234",
    ledgers: [
        { id: 1, feeDetails: "Tuition Fee - Term 1", lastDate: "2026-06-15", amountToPay: 25000, totalConcession: 2000, netAmount: 23000, actualAmountPaid: 23000, amountPaid: 23000, amountToBePaid: 0, excessAmount: 0, refundedAmount: 0, remarks: "", paymentStatus: "PAID", jodoPaymentMethod: "CRED_OPTED" },
        { id: 2, feeDetails: "Tuition Fee - Term 2", lastDate: "2026-09-15", amountToPay: 25000, totalConcession: 2000, netAmount: 23000, actualAmountPaid: 0, amountPaid: 0, amountToBePaid: 23000, excessAmount: 0, refundedAmount: 0, remarks: "", paymentStatus: "UNPAID", jodoPaymentMethod: "FLEX_OPTED" },
        { id: 3, feeDetails: "Transport Fee - Term 1", lastDate: "2026-06-15", amountToPay: 8000, totalConcession: 0, netAmount: 8000, actualAmountPaid: 4000, amountPaid: 4000, amountToBePaid: 4000, excessAmount: 0, refundedAmount: 0, remarks: "Partial payment", paymentStatus: "PARTIALLY_PAID", jodoPaymentMethod: null },
    ],
};

export const sampleFeeSummary = [
    {
        amountToPay: 58000,
        totalConcession: 2000,
        netAmount: 56000,
        amountPaid: 27000,
        previousYearBalance: 0,
        totalRefunds: 0,
        currentAmountToBePaid: 29000,
        totalAdmissionWithDrawlCharges: 0,
        amountToBePaid: 29000,
    },
];

export const sampleFeeDetails = [
    { feeName: "Tuition Fee", feeType: "Term Fee", totalAmount: 50000, studentConcession: 2000, amountToBePaid: 48000 },
    { feeName: "Transport Fee", feeType: "Term Fee", totalAmount: 8000, studentConcession: 0, amountToBePaid: 8000 },
];

export const sampleFeeReceipts = [
    {
        id: 1, receiptDate: "2026-06-16", receiptNumber: "RCPT-2026-0456",
        feeDetailVOList: [{ feeDetail: "Tuition Fee - Term 1" }],
        paymentMode: "ONLINE", amountToPay: 23000, currentPaidAmount: 23000, fine: 0, cardCharges: 0,
        transactionId: "TXN9988776655", chequeStatus: "-", receiptStatus: "SUCCESS", remarks: "",
    },
    {
        id: 2, receiptDate: "2026-06-16", receiptNumber: "RCPT-2026-0461",
        feeDetailVOList: [{ feeDetail: "Transport Fee - Term 1" }],
        paymentMode: "CASH", amountToPay: 4000, currentPaidAmount: 4000, fine: 0, cardCharges: 0,
        transactionId: "-", chequeStatus: "-", receiptStatus: "SUCCESS", remarks: "",
    },
];

export const sampleFeeConcessions = [
    {
        id: 1, createdAt: "2026-06-01T09:30:00", createdBy: "ANCY THOMAS",
        concessionChildList: [{ feeName: "Tuition Fee", concessionAmount: 2000 }],
        concessionType: "Sibling Concession", totalConcessionAmount: 2000,
        employeeName: "ANCY THOMAS", siblingName: "Aarav Sharma", remarks: "Sibling studying in the same school.",
        fileInfo: [],
    },
];

export const sampleFeeRefunds = [
    {
        id: 1, transactionDate: "2026-07-01", paymentMode: "ONLINE", refundAmount: 1500,
        adjustAmount: 0, adjustedStudentName: "", adjustedStudentCode: "", cashAmount: 1500,
        transactionId: "REF1122334455", accountPayeeName: "re", remarks: "Excess transport fee refunded.",
    },
];

export const sampleAcademicYears = [
    { academicYearId: "1", academicYearName: "2025-26", yearStatus: "current" },
    { academicYearId: "2", academicYearName: "2024-25", yearStatus: "closed" },
];

export const sampleStudentSearchList = [
    { studentId: 1260072, studentCode: "1260072", studentName: "eewW", classId: 12 },
    { studentId: 1230536, studentCode: "1230536", studentName: "AADHYA RAGINI SAMARAPALLY", classId: 5 },
    { studentId: 1230312, studentCode: "1230312", studentName: "AARAV JALAN", classId: 5 },
];

export function generateColumnsForViewDocument() {
    return [
        {
            Header: "File Name",
            accessor: "originalFileName",
            disableSortBy: true,
        },
        {
            Header: "Download",
            accessor: "s3URL",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { s3URL } = original;
                return (
                    <>
                        <div onClick={() => window.open(s3URL, "_blank")}><i className="ri-download-line cursor-pointer text-info fs-20"></i></div>
                    </>
                );
            },
        },

    ];
}
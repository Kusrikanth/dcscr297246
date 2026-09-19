import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat, getDateWithTimeFormat } from "../../../../utility/dateutility";
import { getDisplayAmountValue } from "../../../../utility/commonutility";

export function generateColumns() {
    return [
        {
            Header: "Fee Type",
            accessor: "feeDetails",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
            Footer: "Total"
        },
        {
            Header: "Cash (₹)",
            accessor: "cash",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.cash)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.cash) ? 0 : Number(original?.cash))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "Cheque (₹)",
            accessor: "cheque",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.cheque)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.cheque) ? 0 : Number(original?.cheque))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "DD (₹)",
            accessor: "dd",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.dd)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.dd) ? 0 : Number(original?.dd))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "Card Payment (₹)",
            accessor: "card_payment",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.card_payment)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.card_payment) ? 0 : Number(original?.card_payment))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "Online PG (₹)",
            accessor: "online_pg",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.online_pg)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.online_pg) ? 0 : Number(original?.online_pg))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "Online (₹)",
            accessor: "online",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.online)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.online) ? 0 : Number(original?.online))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "UPI (₹)",
            accessor: "upi",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.upi)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.upi) ? 0 : Number(original?.upi))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "JODO Pay (₹)",
            accessor: "jodo_pay",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.jodo_pay)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.jodo_pay) ? 0 : Number(original?.jodo_pay))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "JODO QR (₹)",
            accessor: "jodo_qr",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.jodo_qr)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.jodo_qr) ? 0 : Number(original?.jodo_qr))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "JODO FLEX (₹)",
            accessor: "jodo_flex",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.jodo_flex)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.jodo_flex) ? 0 : Number(original?.jodo_flex))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "JODO CRED (₹)",
            accessor: "jodo_cred",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.jodo_cred)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.jodo_cred) ? 0 : Number(original?.jodo_cred))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
        {
            Header: "Total Amount (₹)",
            accessor: "total_amount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap tw-font-bold">₹ {getDisplayAmountValue(original?.total_amount)}</span>
            },
            Footer: ({ rows }: any) => {
                const cashAmount = rows.reduce((total: any, item: any) => {
                    const { original } = item;
                    total = total + (isNaN(original?.total_amount) ? 0 : Number(original?.total_amount))
                    return total;
                }, 0);
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(cashAmount)}</span>;
            },
        },
    ];
}

function FeeNameTable({ row: { original, id } }: any) {
    const { feeReceiptFeeDetailVOS } = original;
    if (Array.isArray(feeReceiptFeeDetailVOS)) {
        if (feeReceiptFeeDetailVOS.length === 0) {
            return (<span>-</span>);
        } else {
            return (
                <div className="tw-flex tw-flex-col">
                    {
                        feeReceiptFeeDetailVOS.map((item, index) => (<span className="tw-flex badge text-uppercase bg-light text-muted tw-p-2 tw-mb-1" key={`index-${id}-${index}`}>
                            <span className="tw-text-nowrap" style={{ marginRight: '4px' }}>{item?.feeDetail || "-"}{" "}:</span>
                            <span className="tw-text-nowrap">₹{getDisplayAmountValue(item?.amountPaidOfFeePayments)}</span>
                        </span>))
                    }
                </div>
            )
        }
    } else {
        return (<span>-</span>);
    }
}

export function generateColumnsForFeeCollection() {
    return [
        {
            Header: "Academic Year",
            accessor: "academicYearName",
            disableSortBy: true,
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span className="tw-text-nowrap">{original?.className || '-'}</span>)
            },
        },
        {
            Header: "Student Name",
            accessor: "studentDetail",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                const { studentCode, studentName } = original || {};
                if (!studentName) {
                    return <span>-</span>
                }
                return (
                    <>
                        <UserDetails
                            displayName={studentName}
                            displayId={studentCode}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Fee Name",
            accessor: "feeName",
            disableSortBy: true,
            Cell: FeeNameTable,
        },
        {
            Header: "Receipt No.",
            accessor: "receiptNumber",
            disableSortBy: true,
        },
        {
            Header: "Receipt Date",
            accessor: "receiptDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.receiptDate)}</span>)
            },
        },
        {
            Header: "User Date",
            accessor: "userDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span>-</span>)
            },
        },
        {
            Header: "Paid At",
            accessor: "receiptType",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span>{value || "-"}</span>)
            },
        },
        {
            Header: "Payment Mode",
            accessor: "paymentMode",
            disableSortBy: true,
        },
        {
            Header: "Transaction No.",
            accessor: "transactionId",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span className="text-nowrap">{value || "-"}</span>)
            },
        },
        {
            Header: "Settlement UTR",
            accessor: "settlementUtr",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span className="text-nowrap">{value || "-"}</span>)
            },
        },
        {
            Header: "Settlement Date",
            accessor: "settlementDate",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(value)}</span>)
            },
        },
        {
            Header: "Cheque No.",
            accessor: "chequeNo",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span className="text-nowrap">{value || "-"}</span>)
            },
        },
        {
            Header: "Card Charges (₹)",
            accessor: "cardCharges",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.cardCharges)}</span>
            },
        },
        {
            Header: "Fine (₹)",
            accessor: "fine",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.fine)}</span>
            },
        },
        {
            Header: "Paid Amount (₹)",
            accessor: "currentPaidAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.currentPaidAmount)}</span>
            },
        },
        // {
        //     Header: "Disbursement Amount (₹)",
        //     accessor: "disbursementAmount",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.disbursementAmount)}</span>
        //     },
        // },
        // {
        //     Header: "User Name",
        //     accessor: "userName",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         return (<span>-</span>)
        //     },
        // },
    ];
}

export const feeTypeWiseData = [
    { feeType: "Type A", cash: 100, cheque: 50, cardPayment: 75, onlinePg: 120, upi: 90, jodoPay: 110, jodoQr: 80 },
    { feeType: "Type B", cash: 80, cheque: 60, cardPayment: 90, onlinePg: 110, upi: 70, jodoPay: 100, jodoQr: 50 },
    { feeType: "Type C", cash: 120, cheque: 40, cardPayment: 100, onlinePg: 80, upi: 110, jodoPay: 70, jodoQr: 60 },
    { feeType: "Type D", cash: 90, cheque: 70, cardPayment: 110, onlinePg: 60, upi: 80, jodoPay: 120, jodoQr: 40 },
]

export const feeCollectionData = [
    {
        curriculumName: "CBSE",
        className: "VIII",
        studentName: "John Doe",
        feeName: "Tuition Fee",
        receiptNo: "123456",
        receiptDate: "2023-11-21",
        userDate: "2023-11-21",
        paidAt: "School Office",
        paymentMode: "Cash",
        transactionNo: "789012",
        chequeNo: "567890",
        cardCharges: 10,
        fine: 5,
        paidAmount: 1000,
        disbursementAmount: 990,
        userName: "Admin",
    },
    // Add more dummy data as needed
];

export const statusMenuOptions = [
    { id: "Active", value: "Active" },
    { id: "Inactive", value: "Inactive" },
]

export const studentTypeOptions = [
    {
        id: "EXISTING_STUDENT",
        value: "Existing Student"
    },
    {
        id: "NEW_STUDENT",
        value: "New Student"
    }
]

export const paymentModeMenuOptions = [
    { id: "CASH", value: "Cash" },
    { id: "CHEQUE", value: "Cheque" },
    { id: "ONLINE", value: "Online" },
    { id: "CARD_PAYMENT", value: "Card Payment" },
    { id: "ONLINE_PG", value: "Online Pg" },
    { id: "UPI", value: "UPI" },
    { id: "JODO_PAY", value: "JODO PAY" },
    { id: "JODO_QR", value: "JODO QR" },
    { id: "JODO_FLEX", value: "JODO FLEX" },
    { id: "JODO_CRED", value: "JODO CRED" },
]

export const paidAtMenuOptions = [
    { id: "BANK", value: "Bank" },
    { id: "SCHOOL", value: "School" },
]
export function generateFeeTypeColumns() {
    return [
        {
            Header: "Fee Type",
            accessor: "feeType",
            disableSortBy: true
        },
        {
            Header: "Cash (₹)",
            accessor: "cash",
            disableSortBy: true,
        },
        {
            Header: "Cheque (₹)",
            accessor: "cheque",
            disableSortBy: true,
        },
        {
            Header: "Online (₹)",
            accessor: "online",
            disableSortBy: true,
        },
        {
            Header: "Card Payment (₹)",
            accessor: "cardPayment",
            disableSortBy: true,
        },
        {
            Header: "Online PG (₹)",
            accessor: "onlinePg",
            disableSortBy: true,
        },
        {
            Header: "UPI (₹)",
            accessor: "upi",
            disableSortBy: true,
        },
        {
            Header: "JODO PAY (₹)",
            accessor: "jodoPay",
            disableSortBy: true,
        },
        {
            Header: "JODO QR (₹)",
            accessor: "jodoQR",
            disableSortBy: true,
        }
    ];
}

export function generateFeeCollectionColumns() {
    return [
        {
            Header: "SNo",
            accessor: "sNo",
            disableSortBy: true
        },
        {
            Header: "Curriculum",
            accessor: "curriculum",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "class",
            disableSortBy: true,
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
        },
        {
            Header: "Fee Name",
            accessor: "feeName",
            disableSortBy: true,
        },
        {
            Header: "Receipt No.",
            accessor: "recieptNo",
            disableSortBy: true,
        },
        {
            Header: "Receipt Date",
            accessor: "receiptDate",
            disableSortBy: true,
        },
        {
            Header: "User Date",
            accessor: "useDate",
            disableSortBy: true,
        },
        {
            Header: "Paid At",
            accessor: "paidAt",
            disableSortBy: true,
        },
        {
            Header: "Payment Mode",
            accessor: "paymentMode",
            disableSortBy: true,
        }, {
            Header: "Transaction No.",
            accessor: "transactionNo",
            disableSortBy: true,
        }, {
            Header: "Cheque No.",
            accessor: "chequeNo",
            disableSortBy: true,
        }, {
            Header: "Card Charges",
            accessor: "cardCharges",
            disableSortBy: true,
        }, {
            Header: "UTR No",
            accessor: "utrNo",
            disableSortBy: true,
        }, {
            Header: "Settlement Date",
            accessor: "settlementDate",
            disableSortBy: true,
        }, {
            Header: "Fine (₹)",
            accessor: "fine",
            disableSortBy: true,
        }, {
            Header: "Paid Amount (₹)",
            accessor: "paidAmount",
            disableSortBy: true,
        }, {
            Header: "Disbursement Amount (₹)",
            accessor: "disbursementAmount",
            disableSortBy: true,
        }, {
            Header: "User Name",
            accessor: "userName",
            disableSortBy: true,
        }
    ];
}
export const statusCardsList = [
    {
        statusName: "Cash",
        accessor: "cash",
        iconClassName: "cash-icon"

    },
    {
        statusName: "Cheque",
        accessor: "cheque",
        iconClassName: "cheque-icon"

    }, {
        statusName: "Online",
        accessor: "online",
        iconClassName: "online-icon"
    }, {
        statusName: "Card Payment",
        accessor: "card_payment",
        iconClassName: "cardpayment-icon"
    }, {
        statusName: "Online PG",
        accessor: "online_pg",
        iconClassName: "onlinepg-icon"
    }, {
        statusName: "UPI",
        accessor: "upi",
        iconClassName: "upi-icon"
    }, {
        statusName: "Jodo Pay",
        accessor: "jodo_pay",
        iconClassName: "jodopay-icon"
    }, {
        statusName: "Jodo QR",
        accessor: "jodo_qr",
        iconClassName: "jodoqr-icon"
    }, {
        statusName: "Jodo Flex",
        accessor: "jodo_flex",
        iconClassName: "jodoflex-icon"
    }, {
        statusName: "JODO Cred",
        accessor: "jodo_cred",
        iconClassName: "jodocred-icon"
    }
]


export function renderOptions(item: any) {
    return item?.value;
}

export function renderValue(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
            {
                selectedItems.map((item, index) => {
                    return item?.value + (index !== (selectedItems.length - 1) ? ', ' : '')
                })
            }
        </div>)
    }
}

export function renderFeeTypeOptions(item: any) {
    return item?.feeTypeName;
}

export function renderFeeTypeValue(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
            {
                selectedItems.map((item, index) => {
                    return item?.feeTypeName + (index !== (selectedItems.length - 1) ? ', ' : '')
                })
            }
        </div>)
    }
}


export function renderFeeNameOptions(item: any) {
    return item?.feeName;
}

export function renderFeeNameValues(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
            {
                selectedItems.map((item, index) => {
                    return item?.feeName + (index !== (selectedItems.length - 1) ? ', ' : '')
                })
            }
        </div>)
    }
}

export function renderFeeTermOptions(item: any) {
    return item?.termTypeName;
}

export function renderFeeTermValues(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
            {
                selectedItems.map((item, index) => {
                    return item?.termTypeName + (index !== (selectedItems.length - 1) ? ', ' : '')
                })
            }
        </div>)
    }
}

export function getAppliedFilterCount(filterApplied: any = {}) {
    const applyFilterCount = filterApplied && Object.keys(filterApplied).reduce((count, item) => {
        if (filterApplied?.[item] && item !== "academicYearId") {
            count += 1;
        }
        return count;
    }, 0);
    return applyFilterCount || 0;
}





export function renderClassOptions(item: any) {
    return item?.shortName;
}

export function renderClassValue(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
            {
                selectedItems.map((item, index) => {
                    return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
                })
            }
        </div>)
    }
}


/* ------------------------------------------------------------------ *
 *  Fee collection vs receivable trend (bar + line chart)
 * ------------------------------------------------------------------ */

export type IFeeTrendPeriodId = "DAY" | "WEEK" | "MONTH";

export const feeTrendPeriodOptions = [
    { id: "DAY", labelName: "Day", customPadding: "0px 0px 0px 0px" },
    { id: "WEEK", labelName: "Week", customPadding: "0px 0px 0px 0px" },
    { id: "MONTH", labelName: "Month", customPadding: "0px 0px 0px 0px" },
];

export const feeTrendColors = {
    academic: "#405189",
    transport: "#0AB39C",
    overall: "#F06530",
};

// Unit shown beside the "Last N" input, per granularity.
export const feeTrendPeriodUnitLabel: Record<IFeeTrendPeriodId, string> = {
    DAY: "Days",
    WEEK: "Weeks",
    MONTH: "Months",
};

// How many trailing buckets the chart opens with, before the user changes it.
export const feeTrendDefaultCount: Record<IFeeTrendPeriodId, number> = {
    DAY: 14,
    WEEK: 12,
    MONTH: 12,
};

// Upper bound on the "Last N" input — beyond this the bars become unreadable slivers.
export const feeTrendMaxCount: Record<IFeeTrendPeriodId, number> = {
    DAY: 60,
    WEEK: 52,
    MONTH: 36,
};

export function clampFeeTrendCount(period: IFeeTrendPeriodId, value: any) {
    const maxCount = feeTrendMaxCount[period] || 24;
    const numericValue = Math.floor(Number(value));
    if (!numericValue || isNaN(numericValue) || numericValue < 1) {
        return 1;
    }
    return Math.min(numericValue, maxCount);
}

// No backend endpoint exposes receivable-vs-collected by period yet, so the
// chart runs on generated fixtures. Flip this off once the API is wired in.
export const USE_SAMPLE_FEE_COLLECTION_TREND = true;

export interface IFeeTrendDailyRow {
    date: string;
    academicReceivable: number;
    academicCollected: number;
    transportReceivable: number;
    transportCollected: number;
}

export interface IFeeTrendBucket extends IFeeTrendDailyRow {
    label: string;
    rangeLabel: string;
    totalReceivable: number;
    totalCollected: number;
    academicPercent: number;
    transportPercent: number;
    totalPercent: number;
}

function toValidDate(value: any) {
    if (!value) {
        return null;
    }
    const dateValue = new Date(value);
    return isNaN(dateValue.getTime()) ? null : dateValue;
}

function startOfDay(inputDate: Date) {
    return new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
}

function addDays(inputDate: Date, days: number) {
    const dateValue = new Date(inputDate);
    dateValue.setDate(dateValue.getDate() + days);
    return dateValue;
}

// Monday as the first day of the week.
function startOfWeek(inputDate: Date) {
    const dateValue = startOfDay(inputDate);
    const weekDay = (dateValue.getDay() + 6) % 7;
    return addDays(dateValue, -weekDay);
}

function startOfMonth(inputDate: Date) {
    return new Date(inputDate.getFullYear(), inputDate.getMonth(), 1);
}

function toDateKey(inputDate: Date) {
    const month = `${inputDate.getMonth() + 1}`.padStart(2, "0");
    const day = `${inputDate.getDate()}`.padStart(2, "0");
    return `${inputDate.getFullYear()}-${month}-${day}`;
}

const feeTrendMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function toDayLabel(inputDate: Date) {
    return `${`${inputDate.getDate()}`.padStart(2, "0")} ${feeTrendMonthNames[inputDate.getMonth()]}`;
}

function toFullDayLabel(inputDate: Date) {
    return `${toDayLabel(inputDate)} ${inputDate.getFullYear()}`;
}

function toPercent(collected: number, receivable: number) {
    if (!receivable || receivable <= 0) {
        return 0;
    }
    return Number(((collected / receivable) * 100).toFixed(1));
}

// Stable hash so the fixtures do not jitter between renders. The avalanche step
// keeps consecutive dates from landing on near-identical values.
function feeTrendSeed(key: string) {
    let hash = 2166136261;
    for (let index = 0; index < key.length; index++) {
        hash ^= key.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    hash ^= hash >>> 15;
    hash = Math.imul(hash, 2246822507);
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 3266489909);
    hash = (hash ^ (hash >>> 16)) >>> 0;
    return hash / 4294967296;
}

export function buildSampleFeeCollectionTrend(fromDate: Date, toDate: Date): Array<IFeeTrendDailyRow> {
    const rows: Array<IFeeTrendDailyRow> = [];
    let cursor = startOfDay(fromDate);
    const lastDate = startOfDay(toDate);
    while (cursor <= lastDate) {
        const dateKey = toDateKey(cursor);
        // Collections dip on Sundays, so keep the fixture shaped like a real week.
        const weekendFactor = cursor.getDay() === 0 ? 0.35 : 1;
        const academicReceivable = Math.round((180000 + feeTrendSeed(`ar-${dateKey}`) * 220000) / 100) * 100;
        const transportReceivable = Math.round((45000 + feeTrendSeed(`tr-${dateKey}`) * 75000) / 100) * 100;
        const academicCollected = Math.round(
            academicReceivable * (0.52 + feeTrendSeed(`ac-${dateKey}`) * 0.4) * weekendFactor
        );
        const transportCollected = Math.round(
            transportReceivable * (0.45 + feeTrendSeed(`tc-${dateKey}`) * 0.45) * weekendFactor
        );
        rows.push({
            date: dateKey,
            academicReceivable,
            academicCollected,
            transportReceivable,
            transportCollected,
        });
        cursor = addDays(cursor, 1);
    }
    return rows;
}

/**
 * Window the chart plots: the last `count` buckets of the selected academic year.
 * The window ends at the year's end date, or today when the year is still running,
 * and never reaches back past the year's start date.
 */
export function getFeeCollectionTrendRange(
    period: IFeeTrendPeriodId,
    count: number,
    academicYearStartDate?: any,
    academicYearEndDate?: any
) {
    const today = startOfDay(new Date());
    const yearStartDate = toValidDate(academicYearStartDate);
    const yearEndDate = toValidDate(academicYearEndDate);
    const bucketCount = clampFeeTrendCount(period, count);

    // A year still in progress has no data beyond today; a closed year stops at its end date.
    const toDate = yearEndDate && startOfDay(yearEndDate) < today ? startOfDay(yearEndDate) : today;

    let fromDate;
    if (period === "DAY") {
        fromDate = addDays(toDate, -(bucketCount - 1));
    } else if (period === "WEEK") {
        fromDate = addDays(startOfWeek(toDate), -7 * (bucketCount - 1));
    } else {
        fromDate = new Date(toDate.getFullYear(), toDate.getMonth() - (bucketCount - 1), 1);
    }

    if (yearStartDate && fromDate < startOfDay(yearStartDate)) {
        fromDate = startOfDay(yearStartDate);
    }
    // The selected year has not started yet — nothing to plot.
    const isEmptyRange = fromDate > toDate;
    return { fromDate, toDate, bucketCount, isEmptyRange };
}

export function aggregateFeeCollectionTrend(
    dailyRows: Array<IFeeTrendDailyRow>,
    period: IFeeTrendPeriodId,
    maxBuckets?: number
): Array<IFeeTrendBucket> {
    if (!Array.isArray(dailyRows) || dailyRows.length === 0) {
        return [];
    }
    const bucketMap = new Map<string, any>();
    dailyRows.forEach((row) => {
        const rowDate = toValidDate(row?.date);
        if (!rowDate) {
            return;
        }
        let bucketStart;
        if (period === "WEEK") {
            bucketStart = startOfWeek(rowDate);
        } else if (period === "MONTH") {
            bucketStart = startOfMonth(rowDate);
        } else {
            bucketStart = startOfDay(rowDate);
        }
        const bucketKey = toDateKey(bucketStart);
        const bucket = bucketMap.get(bucketKey) || {
            date: bucketKey,
            bucketStart,
            bucketEnd: startOfDay(rowDate),
            academicReceivable: 0,
            academicCollected: 0,
            transportReceivable: 0,
            transportCollected: 0,
        };
        bucket.bucketEnd = startOfDay(rowDate) > bucket.bucketEnd ? startOfDay(rowDate) : bucket.bucketEnd;
        bucket.academicReceivable += Number(row?.academicReceivable) || 0;
        bucket.academicCollected += Number(row?.academicCollected) || 0;
        bucket.transportReceivable += Number(row?.transportReceivable) || 0;
        bucket.transportCollected += Number(row?.transportCollected) || 0;
        bucketMap.set(bucketKey, bucket);
    });

    const bucketLimit = clampFeeTrendCount(period, maxBuckets || feeTrendMaxCount[period]);
    return Array.from(bucketMap.values())
        .sort((first, second) => first.bucketStart - second.bucketStart)
        .slice(-bucketLimit)
        .map((bucket) => {
            const { bucketStart, bucketEnd } = bucket;
            let label, rangeLabel;
            if (period === "MONTH") {
                label = `${feeTrendMonthNames[bucketStart.getMonth()]} ${`${bucketStart.getFullYear()}`.slice(-2)}`;
                rangeLabel = `${feeTrendMonthNames[bucketStart.getMonth()]} ${bucketStart.getFullYear()}`;
            } else if (period === "WEEK") {
                label = toDayLabel(bucketStart);
                rangeLabel = `${toDayLabel(bucketStart)} - ${toFullDayLabel(bucketEnd)}`;
            } else {
                label = toDayLabel(bucketStart);
                rangeLabel = toFullDayLabel(bucketStart);
            }
            const totalReceivable = bucket.academicReceivable + bucket.transportReceivable;
            const totalCollected = bucket.academicCollected + bucket.transportCollected;
            return {
                date: bucket.date,
                label,
                rangeLabel,
                academicReceivable: bucket.academicReceivable,
                academicCollected: bucket.academicCollected,
                transportReceivable: bucket.transportReceivable,
                transportCollected: bucket.transportCollected,
                totalReceivable,
                totalCollected,
                academicPercent: toPercent(bucket.academicCollected, bucket.academicReceivable),
                transportPercent: toPercent(bucket.transportCollected, bucket.transportReceivable),
                totalPercent: toPercent(totalCollected, totalReceivable),
            };
        });
}

export function getFeeCollectionTrendTotals(buckets: Array<IFeeTrendBucket>) {
    const totals = (Array.isArray(buckets) ? buckets : []).reduce((accumulator, bucket) => {
        accumulator.academicReceivable += bucket?.academicReceivable || 0;
        accumulator.academicCollected += bucket?.academicCollected || 0;
        accumulator.transportReceivable += bucket?.transportReceivable || 0;
        accumulator.transportCollected += bucket?.transportCollected || 0;
        return accumulator;
    }, {
        academicReceivable: 0,
        academicCollected: 0,
        transportReceivable: 0,
        transportCollected: 0,
    });
    const totalReceivable = totals.academicReceivable + totals.transportReceivable;
    const totalCollected = totals.academicCollected + totals.transportCollected;
    return {
        ...totals,
        totalReceivable,
        totalCollected,
        academicPercent: toPercent(totals.academicCollected, totals.academicReceivable),
        transportPercent: toPercent(totals.transportCollected, totals.transportReceivable),
        totalPercent: toPercent(totalCollected, totalReceivable),
    };
}

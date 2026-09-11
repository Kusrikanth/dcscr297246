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


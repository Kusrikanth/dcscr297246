import { StatusLabel, UserDetails } from "../../../../Components/Common"
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions"
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility"
import {  convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility"

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
export function generateLedgerColumns(actionsList: Array<IOptionsHrtl>) {
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
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.lastDate)}</span>
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
            Cell: ({ row: { original } }: any) => {
                return <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
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
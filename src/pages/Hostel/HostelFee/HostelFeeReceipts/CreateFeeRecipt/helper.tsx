import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
    StatusLabel,
    TextInput,
    TextInputGroup
} from "../../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";
import { getAmountValueWithDecimal } from "../../../../../utility/commonutility";

export const receiptForOptions = [
    {
        id: "NEW_STUDENT",
        name: "New Student"
    },
    {
        id: "EXISTING_STUDENT",
        name: "Existing Student"
    }
]

export const receiptTypeOptions = [
    {
        id: "SCHOOL",
        name: "School"
    },
    {
        id: "BANK",
        name: "Bank"
    }
]

export const paymentModeOptions = [
    {
        id: "CASH",
        name: "Cash"
    },
    {
        id: "ONLINE",
        name: "Online"
    },
    {
        id: "CHEQUE",
        name: "Cheque"
    },
    {
        id: "DD",
        name: "DD"
    },
    {
        id: "CARD_PAYMENT",
        name: "Card Payment"
    },
    {
        id: "ONLINE_PG",
        name: "Online PG"
    },
    {
        id: "UPI",
        name: "UPI"
    },
    {
        id: "JODO_QR",
        name: "JODO QR"
    },
    {
        id: "JODO_FLEX",
        name: "JODO Flex"
    },
]

export const statusOptions = [
    {
        id : "sendSms",
        name : "SMS",
        selected : true,
    },
    {
        id : "sendEmail",
        name : "EMAIL",
        selected: true,
    },
]

export function feeDetailsColumns(onDeleteLedgerHndlr: any) {
    return [
        {
            Header: "#Previous Receipt No",
            accessor: "receiptNo",
            disableSortBy: true
        },
        {
            Header: "Fee Names",
            accessor: "feeDetails",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <TextInput
                    name={`feeDetails-${original.id}`}
                    value={original?.feeDetails}
                    formgroupClassName="tw-mb-0 tw-p-0"
                    inputClassName="tw-w-[200px]"
                    onChange={undefined}
                    isDisabled={true}
                />
            ),
        },
        {
            Header: "Amount Payable",
            accessor: "amountToPay",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => (
                <TextInputGroup
                    name={`amountToPay-${index}`}
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-w-[120px]"
                    inputClassName="tw-text-sm"
                    inputGroupStart={true}
                    value={getAmountValueWithDecimal(original.amountToPay)}
                    onChange={undefined}
                    isDisabled={true}
                >
                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                </TextInputGroup>
            ),
        },
        {
            Header: "Amount Paid",
            accessor: "amountPaid",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => (
                <TextInputGroup
                    name={`amountPaid-${index}`}
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-w-[120px]"
                    inputClassName="tw-text-sm"
                    inputGroupStart={true}
                    value={getAmountValueWithDecimal(original.amountPaid)}
                    onChange={undefined}
                    isDisabled={true}
                >
                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                </TextInputGroup>
            ),
        },
        {
            Header: "Concession",
            accessor: "concession",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => (
                <TextInputGroup
                    name={`totalConcession-${index}`}
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-w-[120px]"
                    inputClassName="tw-text-sm"
                    inputGroupStart={true}
                    value={getAmountValueWithDecimal(original.totalConcession)}
                    onChange={undefined}
                    isDisabled={true}
                >
                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                </TextInputGroup>
            ),
        },
        {
            Header: "Fine",
            accessor: "fineAmount",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => (
                <TextInputGroup
                    name={`fineAmount-${index}`}
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-w-[120px]"
                    inputClassName="tw-text-sm"
                    inputGroupStart={true}
                    value={getAmountValueWithDecimal(original.fineAmount)}
                    onChange={undefined}
                    isDisabled={true}
                >
                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                </TextInputGroup>
            ),
        },
        {
            Header: "Amount to Pay",
            accessor: "amountToBePaid",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => (
                <TextInputGroup
                    name={`amountToBePaid-${index}`}
                    formgroupClassName="tw-mb-0"
                    inputgroupClassName="tw-w-[120px]"
                    inputClassName="tw-text-sm"
                    inputGroupStart={true}
                    value={getAmountValueWithDecimal(original.amountToBePaid)}
                    onChange={undefined}
                    isDisabled={true}
                >
                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                </TextInputGroup>
            ),
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <button
                    type="button"
                    data-id={original?.id}
                    onClick={onDeleteLedgerHndlr}
                    className="tw-flex tw-items-center tw-justify-center tw-h-8 tw-w-8 tw-rounded-full hover:tw-bg-red-100"
                >
                    <i className="ri-delete-bin-2-fill tw-text-red-600" />
                </button>
            ),
        },
    ];
}

export function generateFeeStructureColumns() {
    return [
        {
            Header: "Fee Name",
            accessor: "feeName",
            disableSortBy: true
        },
        {
            Header: "Fee Amount (₹)",
            accessor: "newAdmissionFeeAmont",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <span>{getAmountValueWithDecimal(original?.newAdmissionFeeAmont)}</span>
            ),
        },
        {
            Header: "Tution Fee Concession (₹)",
            accessor: "tutionFeeConcession",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
                const { newAdmissionFeeAmont, netAmount } = original;
                const newAmount = !isNaN(newAdmissionFeeAmont) ? Number(newAdmissionFeeAmont) : 0;
                const netAmountValue = !isNaN(netAmount) ? Number(netAmount) : 0;

                return (
                    <span>{getAmountValueWithDecimal(newAmount - netAmountValue)}</span>
                );
            },
        },
        {
            Header: "Amount to be Paid (₹)",
            accessor: "netAmount",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <span>{getAmountValueWithDecimal(original?.netAmount)}</span>
            ),
        },
    ];
}

export function generateNewFeeReceiptModalColumns() {
    return [
        {
            Header: "Previous Receipt No",
            accessor: "receiptNo",
            disableSortBy: true
        },
        {
            Header: "Fee Names",
            accessor: "feeDetails",
            disableSortBy: true,
            Cell: ({ value }: any) => (
                <span className="tw-whitespace-nowrap">{value}</span>
            ),
        },
        {
            Header: "Last Date",
            accessor: "lastDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <span className="tw-whitespace-nowrap">
                    {getDdMmYyyyWithMonthNameFormat(original.lastDate)}
                </span>
            ),
        },
        {
            Header: "Amount Payable (₹)",
            accessor: "amountToPay",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <span>{getAmountValueWithDecimal(original?.amountToPay)}</span>
            ),
        },
        {
            Header: "Amount Paid (₹)",
            accessor: "amountPaid",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <span>{getAmountValueWithDecimal(original?.amountPaid)}</span>
            ),
        },
        {
            Header: "Balance Amount (₹)",
            accessor: "balance",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <span>{getAmountValueWithDecimal(original?.balance)}</span>
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const paidStatus = original.amountToBePaid === 0 ? "Paid" : "Unpaid";
                return <StatusLabel type={paidStatus} labelName={paidStatus} />;
            },
        },
        {
            Header: "Concession",
            accessor: "concession",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <span>{getAmountValueWithDecimal(original?.concession)}</span>
            ),
        },
        {
            Header: "Fine",
            accessor: "fine",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <span>{getAmountValueWithDecimal(original?.fine)}</span>
            ),
        },
    ];
}

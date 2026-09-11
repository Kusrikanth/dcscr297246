import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
    InputCheckbox,
    MenuOptionHrtl,
    StatusLabel,
    TextInput,
    TextInputGroup
} from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";
import classNames from "classnames";

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
    }
]

export const statusOptions = [
    {
        id: "sendSms",
        name: "SMS",
        selected: true,
    },
    {
        id: "sendEmail",
        name: "EMAIL",
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
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <TextInput
                            name={`feeDetails-${original.id}`}
                            value={original?.feeDetails}
                            formgroupClassName="tw-tw-mb-0 form-control-sm tw-p-0"
                            inputClassName="tw-w-[200px]"
                            onChange={undefined}
                            isDisabled={true}
                        />
                    </>
                );
            },
        },
        {
            Header: "Amount Payable",
            accessor: "amountToPay",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (
                    <>
                        <TextInputGroup
                            name={`amountToPay-${index}`}
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm tw-w-[120px]"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(original.amountToPay)}
                            onChange={undefined}
                            isDisabled={true}
                        >
                            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                    </>
                );
            },

        },
        {
            Header: "Amount Paid",
            accessor: "amountPaid",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (
                    <>
                        <TextInputGroup
                            name={`amountPaid-${index}`}
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm tw-w-[120px]"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(original.amountPaid)}
                            onChange={undefined}
                            isDisabled={true}
                        >
                            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                    </>
                );
            },
        },
        {
            Header: "Concession",
            accessor: "concession",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (
                    <>
                        <TextInputGroup
                            name={`totalConcession-${index}`}
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm tw-w-[120px]"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(original.totalConcession)}
                            onChange={undefined}
                            isDisabled={true}
                        >
                            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                    </>
                );
            },
        },
        {
            Header: "Fine",
            accessor: "fineAmount",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (
                    <>
                        <TextInputGroup
                            name={`fineAmount-${index}`}
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm tw-w-[120px]"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(original.fineAmount)}
                            onChange={undefined}
                            isDisabled={true}
                        >
                            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                    </>
                );
            },
        },
        {
            Header: "Amount to Pay",
            accessor: "amountToBePaid",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (
                    <>
                        <TextInputGroup
                            name={`amountToBePaid-${index}`}
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm tw-w-[120px]"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(original.amountToBePaid)}
                            onChange={undefined}
                            isDisabled={true}
                        >
                            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                    </>
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                if (!original?.canDelete) {
                    return;
                }
                return (
                    <button type="button" data-id={original?.id} onClick={onDeleteLedgerHndlr} color="white" className="btn btn-sm btn-icon btn-rounded btn-hover-danger">
                        <i className="ri-delete-bin-2-fill text-danger" />
                    </button>
                );
            },
        },
    ];
}

export function generateFeeStructureColumns(allFeeStructSelected?: any,
    onChangesingleFeeStructHndlr?: any, onChangeAllFeeStructHndlr?: any) {
    return ([
        {
            Header: () => {
                return (
                    <InputCheckbox
                        name={"all-student"}
                        value={allFeeStructSelected}
                        onChange={onChangeAllFeeStructHndlr}
                        formgroupClassName="tw-mb-0"
                    />
                )
            },
            accessor: "isStudentChecked",
            columnClassName: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { id, isEnabled, isChecked } = original;
                return (
                    <>
                        <InputCheckbox
                            name={`fee-${id}`}
                            value={isChecked}
                            isDisabled={!isEnabled}
                            onChange={onChangesingleFeeStructHndlr}
                            dataId={id}
                            formgroupClassName="tw-mb-0"
                        />
                    </>
                )
            }
        },
        {
            Header: "Fee Name",
            accessor: "feeName",
            disableSortBy: true
        },
        {
            Header: "Fee Amount (₹)",
            accessor: "newAdmissionFeeAmont",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getAmountValueWithDecimal(original?.newAdmissionFeeAmont)}</span>
                );
            },
        },
        {
            Header: "Tution Fee Concession (₹)",
            accessor: "tutionFeeConcession",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                const { newAdmissionFeeAmont, netAmount } = original,
                    newAdmissionFeeAmountValue = !isNaN(newAdmissionFeeAmont) ? Number(newAdmissionFeeAmont) : 0,
                    netAmountValue = !isNaN(netAmount) ? Number(netAmount) : 0;
                return (
                    <span>{getAmountValueWithDecimal(newAdmissionFeeAmountValue - netAmountValue)}</span>
                );
            },
        },
        {
            Header: "Amount to be Paid (₹)",
            accessor: "netAmount",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getAmountValueWithDecimal(original?.netAmount)}</span>
                );
            },
        },

    ])
}

export function generateNewFeeReceiptModalColumns(allLedgerSelected: boolean, singleAcademicLedgerCheckHndlr: any, allAcademicLedgerSelectHndlr: any) {
    return [
        {
            Header: ({ data }: any) => {
                const enableHeadersCheckbox = Array.isArray(data) && data.length > 0 ?
                    data.some((item: any) => item.isEnabled) : false;
                return (
                    <InputCheckbox
                        name={"all-student"}
                        value={allLedgerSelected}
                        onChange={allAcademicLedgerSelectHndlr}
                        isDisabled={!enableHeadersCheckbox}
                        formgroupClassName={classNames(`tw-mb-0`, !enableHeadersCheckbox ? 'tw-cursor-not-allowed' : '')}
                    />
                )
            },
            accessor: "isStudentChecked",
            columnClassName: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { id, isEnabled, isChecked } = original;
                return (
                    <>
                        <InputCheckbox
                            name={`fee-${id}`}
                            value={isChecked}
                            isDisabled={!isEnabled}
                            onChange={singleAcademicLedgerCheckHndlr}
                            dataId={id}
                            formgroupClassName={classNames(`tw-mb-0`, !isEnabled ? 'tw-cursor-not-allowed' : '')}
                        />
                    </>
                )
            }
        },
        // {
        //     Header: "Previous Receipt No",
        //     accessor: "receiptNo",
        //     disableSortBy: true
        // },
        {
            Header: "Fee Names",
            accessor: "feeDetails",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span className="text-nowrap">{value}</span>)
            },
        },
        {
            Header: "Last Date",
            accessor: "lastDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.lastDate)}</span>)
            },
        },
        {
            Header: "Amount Payable (₹)",
            accessor: "amountToPay",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getDisplayAmountValue(original?.amountToPay)}</span>
                );
            },
        },
        {
            Header: "Amount Paid (₹)",
            accessor: "amountPaid",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getDisplayAmountValue(original?.amountPaid)}</span>
                );
            },
        },
        {
            Header: "Balance Amount (₹)",
            accessor: "amountToBePaid",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getDisplayAmountValue(original?.amountToBePaid)}</span>
                );
            },
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const paidStatus = original.amountToBePaid === 0 ? "Paid" : "Unpaid";
                return (
                    <StatusLabel type={paidStatus} labelName={paidStatus} />
                );
            },
        },
        {
            Header: "Concession",
            accessor: "totalConcession",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getDisplayAmountValue(original?.totalConcession)}</span>
                );
            },
        },
        {
            Header: "Fine",
            accessor: "fineAmount",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getDisplayAmountValue(original?.fineAmount)}</span>
                );
            },
        },
    ];
}


export const ledgerType = [
    { id: "TERM", name: "Term" },
    { id: "MONTH", name: "Month" },
]
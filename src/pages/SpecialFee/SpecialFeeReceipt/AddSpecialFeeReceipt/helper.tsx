import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
    Button,
    InputCheckbox,
    MenuOptionHrtl,
    StatusLabel,
    TextInput,
    TextInputGroup
} from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat, getDisplayDateForTableFormat } from "../../../../utility/dateutility";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";
import { compareAsc, parseISO } from "date-fns";

export const receiptForOptions = [
    {
        id: "SPECIAL_FEE",
        name: "Special Fee"
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
            Header: "Academic Year",
            accessor: "academicYearName",
            disableSortBy: true,
        },
        {
            Header: "Special Fee Name",
            accessor: "specialFeeName",
            disableSortBy: true,
        },
        {
            Header: "Type Of Fee",
            accessor: "feeName",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px",
        },
        {
            Header: "Last Date",
            accessor: "dueDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">{getDisplayDateForTableFormat(original.dueDate)}</span>
            },
        },
        {
            Header: "Fee Amount (₹)",
            accessor: "feeAmount",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (
                    <>
                        <TextInputGroup
                            name={`feeAmount-${index}`}
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm tw-w-[120px]"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(original.feeAmount)}
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
            Header: "Amount Paid (₹)",
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
            Header: "Balance (₹)",
            accessor: "balance",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                return (
                    <>
                        <TextInputGroup
                            name={`balance-${index}`}
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm tw-w-[120px]"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(original.balance)}
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
            Header: "Fine (₹)",
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
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <Button type="button" data-id={original?.feeId} onClick={onDeleteLedgerHndlr} variant="wrong">
                        <i className="ri-delete-bin-2-fill" />
                    </Button>
                );
            },
        },
    ];
}

export function generateFeeStructureColumns() {
    return ([
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
            columnClassName: "tw-text-center",
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
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    <span>{getAmountValueWithDecimal(original?.netAmount)}</span>
                );
            },
        },

    ])
}

export function generateNewFeeReceiptModalColumns() {
    return [
        {
            Header: "Academic Year",
            accessor: "academicYearName",
            disableSortBy: true,
        },
        {
            Header: "Special Fee Name",
            accessor: "specialFeeName",
            disableSortBy: true,
        },
        {
            Header: "Type Of Fee",
            accessor: "feeName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px]",
        },
        {
            Header: "Last Date",
            accessor: "dueDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">{getDisplayDateForTableFormat(original.dueDate)}</span>
            },
        },
        {
            Header: "Fee Amount (₹)",
            accessor: "feeAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.feeAmount)}</span>
            },
        },
        {
            Header: "Amount Paid (₹)",
            accessor: "amountPaid",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
            },
        },
        {
            Header: "Balance (₹)",
            accessor: "balance",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.balance)}</span>
            },
        },
        {
            Header: "Fine (₹)",
            accessor: "fineAmount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.fineAmount)}</span>
                );
            },
        },
        {
            Header: "Status",
            accessor: "paymentStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
            },
        },

    ];
}

export function getSpecialFeesLedgers(specialFees: Array<any>) {
    if (Array.isArray(specialFees)) {
        const feeList: any = [];
        for (let i = 0; i < specialFees.length; i++) {
            const { feeType, monthWiseTerms, oneTimeFee, termWiseFee } = specialFees[i];

            if (feeType === "TERM" && Array.isArray(termWiseFee)) {
                for (let j = 0; j < termWiseFee.length; j++) {
                    feeList.push({
                        academicYearId: specialFees[i]?.academicYearId,
                        academicYearName: specialFees[i]?.academicYearName,
                        feeType: specialFees[i]?.feeType,
                        feeTypeId: specialFees[i]?.feeTypeId,
                        specialFeeId: specialFees[i]?.specialFeeId,
                        specialFeeName: specialFees[i]?.specialFeeName,
                        dueDate: termWiseFee[j]?.dueDate,
                        paymentStatus: termWiseFee[j]?.paymentStatus,
                        feeAmount: termWiseFee[j]?.feeAmount,
                        amountPaid: termWiseFee[j]?.amountPaid,
                        balance: termWiseFee[j]?.balance,
                        feeId: termWiseFee[j]?.termId,
                        feeName: termWiseFee[j]?.termName,
                    });

                }
            } else if (feeType === "ONETIME" && Array.isArray(oneTimeFee)) {
                for (let j = 0; j < oneTimeFee.length; j++) {
                    feeList.push({
                        academicYearId: specialFees[i]?.academicYearId,
                        academicYearName: specialFees[i]?.academicYearName,
                        feeType: specialFees[i]?.feeType,
                        feeTypeId: specialFees[i]?.feeTypeId,
                        specialFeeId: specialFees[i]?.specialFeeId,
                        specialFeeName: specialFees[i]?.specialFeeName,
                        dueDate: oneTimeFee[j]?.dueDate,
                        paymentStatus: oneTimeFee[j]?.paymentStatus,
                        feeAmount: oneTimeFee[j]?.feeAmount,
                        amountPaid: oneTimeFee[j]?.amountPaid,
                        balance: oneTimeFee[j]?.balance,
                        feeId: specialFees[i]?.specialFeeId,
                        feeName: oneTimeFee[j]?.termName,
                    });

                }
            } else if (feeType === "MONTH" && Array.isArray(monthWiseTerms)) {
                for (let j = 0; j < monthWiseTerms.length; j++) {
                    feeList.push({
                        academicYearId: specialFees[i]?.academicYearId,
                        academicYearName: specialFees[i]?.academicYearName,
                        feeType: specialFees[i]?.feeType,
                        feeTypeId: specialFees[i]?.feeTypeId,
                        specialFeeId: specialFees[i]?.specialFeeId,
                        specialFeeName: specialFees[i]?.specialFeeName,
                        dueDate: monthWiseTerms[j]?.dueDate,
                        paymentStatus: monthWiseTerms[j]?.paymentStatus,
                        feeAmount: monthWiseTerms[j]?.feeAmount,
                        amountPaid: monthWiseTerms[j]?.amountPaid,
                        balance: monthWiseTerms[j]?.balance,
                        feeId: monthWiseTerms[j]?.termId,
                        feeName: monthWiseTerms[j]?.termName,
                    });
                }
            }
        }
        feeList.sort((a: any, b: any) => {
            if (a.dueDate === null) return -1;
            if (b.dueDate === null) return 1;
            const dateA = parseISO(a.dueDate);
            const dateB = parseISO(b.dueDate);
            return compareAsc(dateA, dateB);
        });
        return feeList;
    }
    return [];
}
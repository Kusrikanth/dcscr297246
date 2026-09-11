import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";
import { feeTypeOptions } from "../BranchWiseDueSummary/helper";

const formatAmt = (amount: number) => {
    return (amount || 0).toLocaleString("en-IN")
};

export function generateColumns(openShowStuModal: any) {
    return [
        {
            Header: "Term",
            accessor: "",
            disableSortBy: true,
            rowSpan: 2,
            columnClassName: "tw-text-center",
            Footer: "",
            columns: [
                {
                    Header: "hidden",
                    displayNone: true,
                    accessor: "termName",
                    columnClassName: "tw-text-center",
                    disableSortBy: true,
                    Footer: "",
                },
            ],
        },
        {
            Header: "Academic Fee Status",
            accessor: "feeStructure",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Footer: "",
            columns: [
                {
                    Header: "Net (₹)",
                    accessor: "feeNet",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.feeNet) || 0}`}</div>)
                    },
                },
                {
                    Header: "Paid (₹)",
                    accessor: "feePaid",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.feePaid)}`}</div>)
                    },
                },
                {
                    Header: "Due (₹)",
                    accessor: "feeDue",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.feeDue)}`}</div>)
                    },
                },
                {
                    Header: "Unpaid",
                    accessor: "feeUnpaidStudent",
                    disableSortBy: true,
                    columnClassName: "tw-text-center tw-p-0",
                    Cell: ({ row }: any) => {
                        const { original } = row || {};
                        return (
                            <div onClick={() => original?.feeUnpaidStudent && openShowStuModal({ data: original, type: feeTypeOptions.FEE_STRUCTURE })} style={{ padding: "0.4rem 0.7rem" }}>
                                <span className="text-info cursor-pointer">
                                    {original?.feeUnpaidStudent || 0}
                                </span>
                            </div>
                        );
                    },
                },
            ],
        },
        {
            Header: "Transport Fee Status",
            accessor: "transportStructure",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Footer: "",
            columns: [
                {
                    Header: "Net (₹)",
                    accessor: "transportNet",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.transportNet)}`}</div>)
                    },
                },
                {
                    Header: "Paid (₹)",
                    accessor: "transportPaid",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.transportPaid)}`}</div>)
                    },
                },
                {
                    Header: "Due (₹)",
                    accessor: "transportDue",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.transportDue)}`}</div>)
                    },
                },
                {
                    Header: "Unpaid",
                    accessor: "transportUnpaidStudent",
                    disableSortBy: true,
                    columnClassName: "tw-text-center tw-p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (
                            <div onClick={() => original?.transportUnpaidStudent && openShowStuModal({ data: original, type: feeTypeOptions.TRANSPORT_FEE })} style={{ padding: "0.4rem 0.7rem" }}>
                                <span className="tw-text-blue-500 tw-cursor-pointer">
                                    {original?.transportUnpaidStudent || 0}
                                </span>
                            </div>
                        );
                    },
                },
            ],
        },
        {
            Header: "Cumulative Fee Status",
            accessor: "cumulativeStructure",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Footer: "",
            columns: [
                {
                    Header: "Net (₹)",
                    accessor: "cumulativeNet",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.cumulativeNet)}`}</div>)
                    },
                },
                {
                    Header: "Paid (₹)",
                    accessor: "cumulativePaid",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.cumulativePaid)}`}</div>)
                    },

                },
                {
                    Header: "Due (₹)",
                    accessor: "cumulativeDue",
                    disableSortBy: true,
                    columnClassName: "tw-text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (<div>{`₹ ${formatAmt(original?.cumulativeDue)}`}</div>)
                    },
                },
                {
                    Header: "Unpaid",
                    accessor: "cumulativeUnpaidStudent",
                    disableSortBy: true,
                    columnClassName: "tw-text-center tw-p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (
                            <div onClick={() => original?.cumulativeUnpaidStudent && openShowStuModal({ data: original, type: feeTypeOptions.ACCUMULATED })} style={{ padding: "0.4rem 0.7rem" }}>
                                <span className="tw-text-blue-500 tw-cursor-pointer">
                                    {original?.cumulativeUnpaidStudent || 0}
                                </span>
                            </div>
                        );
                    },
                },
            ],
        },
    ];
}

export const accumulatedData = (item: any) => {
    const { feeNet = 0, feePaid = 0, feeDue = 0, feeUnpaidStudent = 0, transportNet = 0, transportPaid = 0, transportDue = 0, transportUnpaidStudent = 0 } = item || {}
    return {
        cumulativeNet: feeNet + transportNet,
        cumulativePaid: feePaid + transportPaid,
        cumulativeDue: feeDue + transportDue,
        cumulativeUnpaidStudent: feeUnpaidStudent + transportUnpaidStudent
    }
}

export const modeOptions = [
    { id: "CRED_OPTED", name: "CRED" },
    { id: "FLEX_OPTED", name: "FLEX" },
    { id: "NON_JODO", name: "NON JODO" },
]

export const findSectionWiseAmt = (abc: any, name: string) => {
    return (+abc?.[name] || 0) + abc?.subRows?.reduce((acc: any, curr: any) => acc += (+curr?.[name] || 0), 0)
}

export const stuStatusOptions = [
    {
        id: "ACTIVE",
        name: "Active"
    }, {
        id: "INACTIVE",
        name: "Inactive"
    }
]

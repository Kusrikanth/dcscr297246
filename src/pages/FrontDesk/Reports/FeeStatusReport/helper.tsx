import { StatusLabel } from "../../../../Components/Common";
import { UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { getDisplayAmountValue } from "../../../../utility/commonutility";

export function generateColumns() {
    return [
        {
            Header: "Name",
            accessor: "studentDetails",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayName={original?.studentName}
                        displayId={original?.studentCode}
                        showAvatar={false}
                    />
                );
            },
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap"
        },
        {
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
        },
        {
            Header: "Admission Number",
            accessor: "admissionNo",
            disableSortBy: true,
            Cell: ({ value }: any) => <>{value || "-"}</>,
        },
        // {
        //     Header: "Fee Name",
        //     accessor: "feeName",
        //     disableSortBy: true,
        //     Cell: ({ value }: any) => <>{value || "-"}</>,
        // },
        {
            Header: "Total Actual Amount (₹)",
            accessor: "amountToPay",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return <span>{getDisplayAmountValue(value)}</span>
            },
        },
        {
            Header: "Total Discount (₹)",
            accessor: "totalConcession",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return <span>{getDisplayAmountValue(value)}</span>
            },
        },
        {
            Header: "Total Net Amount (₹)",
            accessor: "netAmount",
            disableSortBy: true,
            Cell: ({ value }: any) => <span>{getDisplayAmountValue(value)}</span>
        },
        {
            Header: "Total Actual Paid Amount (₹)",
            accessor: "actualAmountPaid",
            disableSortBy: true,
            Cell: ({ value }: any) => <span>{getDisplayAmountValue(value)}</span>
        },
        {
            Header: "Total Paid Amount (₹)",
            accessor: "amountPaid",
            disableSortBy: true,
            Cell: ({ value }: any) => <span>{getDisplayAmountValue(value)}</span>
        },
        {
            Header: "Total Unpaid Amount (₹)",
            accessor: "amountToBePaid",
            disableSortBy: true,
            Cell: ({ value }: any) => <span>{getDisplayAmountValue(value)}</span>
        },
        {
            Header: "Student Status",
            accessor: "studentStatus",
            disableSortBy: true,
            Cell: ({ value }: any) => <StatusLabel type={value} labelName={value} />
        },
        // {
        //     Header: "JODO Status",
        //     filterable: false,
        //     disableSortBy: true,

        // },
    ];
}


export const feeTypes = [
    {
        id: "FEE STRUCTURE",
        name: "Academics Fee"
    },
    {
        id: "TRANSPORT FEE",
        name: "Transport Fee"
    }
]

export const initialAdvncFilterState = {
    curriculumId: "",
    classId: "",
    sectionId: "",
    feeType: "",
    feeName: ""
}

export function checkFitlersApplied(applieFilters: any) {
    return Object.keys(applieFilters).some(item => {
        if (item === "academicYearId" || item === "branchId" || item === "pageNo" || item === "pageSize") {
            return false;
        }
        return !!applieFilters[item];
    });
}


export function generateClasswiseFeesData(feeData: any) {
    const { installmentData = {}, termIData = {}, termIIData = {}, termIIIData = {} } = feeData || {},
        sequenceLib: any = {},
        installementLibData: any = {},
        termILibData: any = {}, termIILibData: any = {}, termIIILibData: any = {};
    if (Object.keys(termIData).length > 0) {
        for (let classSequence in termIData) {
            let totalAmountPaid = 0,
                feeDetails = termIData[classSequence];
            for (let i = 0; Array.isArray(feeDetails) && i < feeDetails.length; i++) {
                totalAmountPaid += (Math.round(feeDetails[i]?.totalAmountPaid || 0));
                if (!sequenceLib[classSequence?.toString()]) {
                    sequenceLib[classSequence?.toString()] = feeDetails[i]?.classShortName;
                }
            }
            termILibData[classSequence?.toString()] = totalAmountPaid;
        }
    }
    if (Object.keys(termIIData).length > 0) {
        for (let classSequence in termIIData) {
            let totalAmountPaid = 0,
                feeDetails = termIIData[classSequence];
            for (let i = 0; Array.isArray(feeDetails) && i < feeDetails.length; i++) {
                totalAmountPaid += (Math.round(feeDetails[i]?.totalAmountPaid || 0));
                if (!sequenceLib[classSequence?.toString()]) {
                    sequenceLib[classSequence?.toString()] = feeDetails[i]?.classShortName;
                }
            }
            termIILibData[classSequence?.toString()] = totalAmountPaid;
        }
    }
    if (Object.keys(termIIIData).length > 0) {
        for (let classSequence in termIIIData) {
            let totalAmountPaid = 0,
                feeDetails = termIIIData[classSequence];
            for (let i = 0; Array.isArray(feeDetails) && i < feeDetails.length; i++) {
                totalAmountPaid += (Math.round(feeDetails[i]?.totalAmountPaid || 0));
                if (!sequenceLib[classSequence?.toString()]) {
                    sequenceLib[classSequence?.toString()] = feeDetails[i]?.classShortName;
                }
            }
            termIIILibData[classSequence?.toString()] = totalAmountPaid;
        }
    }
    if (Object.keys(installmentData).length > 0) {
        for (let classSequence in installmentData) {
            let totalAmountPaid = 0,
                feeDetails = installmentData[classSequence];
            for (let i = 0; Array.isArray(feeDetails) && i < feeDetails.length; i++) {
                totalAmountPaid += (Math.round(feeDetails[i]?.totalAmountPaid || 0));
                if (!sequenceLib[classSequence?.toString()]) {
                    sequenceLib[classSequence?.toString()] = feeDetails[i]?.classShortName;
                }
            }
            installementLibData[classSequence?.toString()] = totalAmountPaid;
        }
    }
    if (Object.keys(sequenceLib).length <= 0) {
        return [];
    }
    const sortedSequenceKeys = Object.keys(sequenceLib).sort((a, b) => parseInt(a) - parseInt(b)),
        installmentChardData: any = [],
        termIChartData: any = [], termIIChartData: any = [], termIIIChartData: any = [],
        xAxisLabel: any = [];
    for (let i = 0; i < sortedSequenceKeys.length; i++) {
        const sequenceKeyName: any = sortedSequenceKeys[i]?.toString();
        installmentChardData.push(installementLibData[sequenceKeyName] || 0);
        termIChartData.push(termILibData[sequenceKeyName] || 0);
        termIIChartData.push(termIILibData[sequenceKeyName] || 0);
        termIIIChartData.push(termIIILibData[sequenceKeyName] || 0);
        xAxisLabel.push(sequenceLib[sequenceKeyName]);
    }
    return {
        xAxisLabel, chartData: [
            {
                name: "Tution / Caution / Installment 1 Fee",
                data: installmentChardData
            },
            {
                name: "TERM I",
                data: termIChartData
            },
            {
                name: "TERM II",
                data: termIIChartData
            },
            {
                name: "TERM III",
                data: termIIIChartData
            },
        ]
    }
}
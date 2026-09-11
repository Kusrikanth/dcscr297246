import { UserDetails } from "../../../../../Components/Common";

const findTotalStudents = (data: any, accessor: string) => {
    let totalStudents = 0
    if (Array.isArray(data) && data.length > 0) {
        data.map((original: any) => {
            const { totalObj } = original
            totalStudents += (+(totalObj || original)?.[accessor] || 0)
        })
    }
    return totalStudents || 0
}

export const feeTypeOptions = {
    // We are using this in Branch Wise Net Amount Screen also
    FEE_STRUCTURE: "FEE STRUCTURE",
    TRANSPORT_FEE: "TRANSPORT FEE",
    ACCUMULATED: "",
    CUMULATIVE_FEE: "CUMULATIVE FEE",
}

export function generateColumns(openShowStuModal: any) {
    return [
        {
            Header: "Term",
            accessor: "",
            disableSortBy: true,
            rowSpan: 2,
            columnClassName: "text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [
                {
                    Header: "hidden",
                    displayNone: true,
                    accessor: "termName",
                    columnClassName: "text-center",
                    disableSortBy: true,
                    Footer: "",
                    footerClassName: "text-white fw-bold",
                },
            ],
        },
        {
            Header: "Academic Fee Status",
            accessor: "feeStructure",
            disableSortBy: true,
            columnClassName: "text-center",
            Footer: "",
            columns: [
                // {
                //     Header: "No of Students",
                //     accessor: "feeNoOfStudents",
                //     disableSortBy: true,
                //     columnClassName: "text-center",
                // },
                {
                    Header: "Paid (%)",
                    accessor: "feePaidPer",
                    disableSortBy: true,
                    columnClassName: "text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return `${original?.feePaidPer || "0.00"}%`
                    },
                },
                {
                    Header: "Unpaid (%)",
                    accessor: "feeUnPaidPer",
                    disableSortBy: true,
                    columnClassName: "text-center p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        const { feeUnPaidPer } = original || {};

                        const success = {
                            textColor: "text-success",
                            bgColor: "#b6e8e1",
                        };

                        const warning = {
                            textColor: "text-warning",
                            bgColor: "#fdeac9",
                        };
                        const danger = {
                            textColor: "text-danger",
                            bgColor: "#fbd1c8",
                        };

                        const feeUnPaidPerColor =
                            feeUnPaidPer ? (feeUnPaidPer <= 5
                                ? success
                                : feeUnPaidPer <= 10
                                    ? warning
                                    : danger) : success;
                        return (
                            <div
                                className="fw-semibold"
                                style={{ padding: "0.4rem 0.7rem" }}
                            >
                                <span
                                    style={{
                                        backgroundColor: `${feeUnPaidPerColor.bgColor}`,
                                    }}
                                    className="px-2 py-1 rounded"
                                >{`${feeUnPaidPer || "0.00"}%`}</span>
                            </div>
                        );
                    },
                },
                {
                    Header: "Unpaid",
                    accessor: "feeUnpaid",
                    disableSortBy: true,
                    columnClassName: "text-center p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        const { feeUnpaid: totalFeeUnpaid } = original?.totalObj || {}
                        return (
                            <div onClick={() => original?.feeUnpaid && openShowStuModal({ data: original, type: feeTypeOptions.FEE_STRUCTURE })} style={{ padding: "0.4rem 0.7rem" }}>
                                <span className="text-info cursor-pointer">
                                    {original?.feeUnpaid || 0}
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
            columnClassName: "text-center",
            Footer: "",
            columns: [
                // {
                //     Header: "No of Students",
                //     accessor: "transportNoOfStudents",
                //     disableSortBy: true,
                //     columnClassName: "text-center",
                //     Cell: ({ row, rowDataInfo }: any) => {
                //         const { original } = row || {};
                //         return original?.transportNoOfStudents || 0
                //     },
                // },
                {
                    Header: "Paid (%)",
                    accessor: "transportPaidPer",
                    disableSortBy: true,
                    columnClassName: "text-center",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return `${original?.transportPaidPer || "0.00"}%`
                    },
                },
                {
                    Header: "Unpaid (%)",
                    accessor: "transportUnPaidPer",
                    disableSortBy: true,
                    columnClassName: "text-center p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        const { transportUnPaidPer } = original || {};

                        const success = {
                            textColor: "text-success",
                            bgColor: "#b6e8e1",
                        };

                        const warning = {
                            textColor: "text-warning",
                            bgColor: "#fdeac9",
                        };
                        const danger = {
                            textColor: "text-danger",
                            bgColor: "#fbd1c8",
                        };

                        const transportUnPaidPerColor =
                            transportUnPaidPer ? (transportUnPaidPer <= 5
                                ? success
                                : transportUnPaidPer <= 10
                                    ? warning
                                    : danger) : success;
                        return (
                            <div
                                className="fw-semibold"
                                style={{ padding: "0.4rem 0.7rem" }}
                            >
                                <span
                                    style={{
                                        backgroundColor: `${transportUnPaidPerColor.bgColor}`,
                                    }}
                                    className="px-2 py-1 rounded"
                                >{`${transportUnPaidPer || "0.00"}%`}</span>
                            </div>
                        );
                    },
                },
                {
                    Header: "Unpaid",
                    accessor: "transportUnpaid",
                    disableSortBy: true,
                    columnClassName: "text-center p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        const { transportUnpaid: totalTransportUnpaid } = original?.totalObj || {}
                        return (
                            <div onClick={() => original?.transportUnpaid && openShowStuModal({ data: original, type: feeTypeOptions.TRANSPORT_FEE })} style={{ padding: "0.4rem 0.7rem" }}>
                                <span className="text-info cursor-pointer">
                                    {original?.transportUnpaid || 0}
                                </span>
                            </div>
                        );
                    },
                },
            ],
        },
        {
            Header: "Cumulative Fee Status",
            accessor: "accumulatedFeeStatus",
            disableSortBy: true,
            columnClassName: "text-center",
            Footer: "",
            columns: [
                // {
                //     Header: "No of Students",
                //     accessor: "accumulatedNoOfStudents",
                //     disableSortBy: true,
                //     columnClassName: "text-center",
                //     Cell: ({ row }: any) => {
                //         const { original } = row || {};
                //         return original?.accumulatedNoOfStudents || 0
                //     },
                // },
                {
                    Header: "Paid (%)",
                    accessor: "accumulatedPaidPer",
                    disableSortBy: true,
                    columnClassName: "text-center",
                    Cell: ({ row }: any) => {
                        const { original } = row || {};
                        return `${original?.accumulatedPaidPer || "0.00"}%`
                    },
                },
                {
                    Header: "Unpaid (%)",
                    accessor: "accumulatedUnPaidPer",
                    disableSortBy: true,
                    columnClassName: "text-center p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        const { accumulatedUnPaidPer } = original || {};

                        const success = {
                            textColor: "text-success",
                            bgColor: "#b6e8e1",
                        };

                        const warning = {
                            textColor: "text-warning",
                            bgColor: "#fdeac9",
                        };
                        const danger = {
                            textColor: "text-danger",
                            bgColor: "#fbd1c8",
                        };

                        const accumulatedUnPaidPerColor =
                            accumulatedUnPaidPer ? (accumulatedUnPaidPer <= 5
                                ? success
                                : accumulatedUnPaidPer <= 10
                                    ? warning
                                    : danger) : success;
                        return (
                            <div
                                className="fw-semibold"
                                style={{ padding: "0.4rem 0.7rem" }}
                            >
                                <span
                                    style={{
                                        backgroundColor: `${accumulatedUnPaidPerColor.bgColor}`,
                                    }}
                                    className="px-2 py-1 rounded"
                                >{`${accumulatedUnPaidPer || "0.00"}%`}</span>
                            </div>
                        );
                    },
                },
                {
                    Header: "Unpaid",
                    accessor: "accumulatedUnpaid",
                    disableSortBy: true,
                    columnClassName: "text-center p-0",
                    Cell: ({ row, rowDataInfo }: any) => {
                        const { original } = row || {};
                        return (
                            <div onClick={() => original?.accumulatedUnpaid && openShowStuModal({ data: original, type: feeTypeOptions.ACCUMULATED })} style={{ padding: "0.4rem 0.7rem" }}>
                                <span className="text-info cursor-pointer">
                                    {original?.accumulatedUnpaid || 0}
                                </span>
                            </div>
                        );
                    },
                },
            ],
        },
    ];
}

export const modeOptions = [
    { id: "CRED_OPTED", name: "CRED" },
    { id: "FLEX_OPTED", name: "FLEX" },
    { id: "NON_JODO", name: "NON JODO" },
]

export const accumulatedData = (item: any) => {
    const { feeNoOfStudents = 0, feeUnpaid = 0, transportNoOfStudents = 0, transportUnpaid = 0, feePaidStudents = 0, transportPaidStudents = 0 } = item || {}
    return {
        accumulatedNoOfStudents: (feeNoOfStudents) + (transportNoOfStudents),
        accumulatedPaidPer: ((((feeNoOfStudents - feeUnpaid) + (transportNoOfStudents - transportUnpaid)) * 100) / (feeNoOfStudents + transportNoOfStudents)).toFixed(2),
        accumulatedUnPaidPer: (((feeUnpaid + transportUnpaid) * 100) / (feeNoOfStudents + transportNoOfStudents)).toFixed(2),
        accumulatedUnpaid: (feeUnpaid + transportUnpaid),
        accumulatedPaid: (feePaidStudents + transportPaidStudents),
    }
}

export const findSectionWiseStu = (abc: any, name: string) => {
    return (+abc?.[name] || 0) + abc?.subRows?.reduce((acc: any, curr: any) => acc += (+curr?.[name] || 0), 0)
}

export function generateStudentModalColumns() {
    return (
        [{
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "w-300px min-w-300px max-w-300px",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        imageUrl={original?.studentBase64Image}
                        displayId={original.studentCode}
                        displayName={original.studentName}
                        showAvatar={true}
                        size="xs"
                    />
                );
            },
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
        },
        ]
    )
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
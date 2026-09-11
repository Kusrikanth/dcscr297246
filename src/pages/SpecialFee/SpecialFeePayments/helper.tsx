import { getDateWithTimeFormat, getDdMmYyyyFormat, getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";
import { StatusLabel, UserDetails } from "../../../Components/Common";
import { getDisplayAmountValue } from "../../../utility/commonutility";


export function generateColumns() {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] tw-sticky-left",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayName={original?.studentName || "-"}
                        displayId={original?.studentCode || "-"}
                        showAvatar={false}
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
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
        },
        {
            Header: "Fee Name",
            accessor: "feeDetails",
            disableSortBy: true,
        },

        {
            Header: "Amount  (₹)",
            accessor: "amount",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return getDisplayAmountValue(+original.amount);
            }
        },
        {
            Header: "Payment Mode",
            accessor: "paymentMode",
            disableSortBy: true,
        },
        {
            Header: "Payment Date",
            accessor: "paymentDate",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return original?.paymentDate ? getDdMmYyyyFormat(original?.paymentDate) : "-";
            },
        },
    ];
}

export const paymentModeOptions = [
    {
        id : "JODO_PAY",
        name : "JODO PAY",
    },
    {
        id : "ONLINE_PG",
        name : "ONLINE PG",
    }
]

export function hasStateChanged(newState: any) {
    let count: any = 0;
    let showState: boolean = false;
    for (const key in newState) {
        const newValue = newState[key];
        if (newValue) {
            showState = true;
            // if (!(key === "search" || key === "academicYearId" || key === "curriculumId" || key === "classId" || key === "sectionId"))
            //     count += 1;
        }
    }
    if (count > 0) { return { stateChange: showState, count: count } }
    else { return { stateChange: showState, count: count } }
}



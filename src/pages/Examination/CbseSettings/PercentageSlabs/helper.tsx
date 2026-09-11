import { StatusLabel } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateInternalSubjectGradesColumns(actionList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Display Type",
            accessor: "labelDisplayType",
            disableSortBy: true,
        },
        {
            Header: "From Percentage",
            accessor: "fromPercentage",
        },
        {
            Header: "To Percentage",
            accessor: "toPercentage",
        },
        {
            Header: "Display Name",
            accessor: "displayName",
            disableSortBy: true,
        },
        {
            Header: "Module type",
            accessor: "moduleType",
            disableSortBy: true,
        },
        {
            Header: "Slab Color",
            accessor: "slabColor",
            disableSortBy: true,
            Cell:({row:{original}}:any)=>{
                return <div className="fs-14 badge tw-bg-[#4051891a] px-1 text-dark fw-medium d-inline-flex align-items-center !tw-justify-center">
                    <span
                    className="rounded"
                    style={{
                        width: "20px",
                        height: "12px",
                        display: "inline-block",
                        backgroundColor: `${original.slabColor ? original.slabColor : "#FFFFFF" }`,
                    }}
                    ></span>
                </div>
            }
        },
        {
            Header: "Result",
            accessor: "result",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <StatusLabel
                        type={original.result}
                        labelName={original.result}
                    />
                );
            }
        },
        {
            Header: "Action",
            thClass: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
                );
            },
        },
    ];
}


export const ignoredKeys = ["searchString",];

export const displayTypes = [
    {
        label: "Branch wise",
        value: "BRANCH_WISE",
    },
    {
        label: "Marks Range",
        value: "MARKS_RANGE",
    },
    {
        label: "Percentage Range",
        value: "PERCENTAGE_RANGE",
    },
];

export const result = [
    {
        label: "Pass",
        value: "PASS",
    },
    {
        label: "Fail",
        value: "FAIL",
    },
]

export const moduleTypes = [
    {
        label: "Dashboard",
        value: "DASHBOARD",
    },
    {
        label: "Report",
        value: "REPORT",
    },
]
import { UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDateDifferenceInDays, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";

function ClassesList({ row: { original, id } }: any) {
    const { classNames } = original,
        classList = classNames?.split(',');
    if (!classNames || (classList.length === 0)) {
        return (<span>-</span>);
    }
    return (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
            {
                classList.map((item: any, index: number) => (
                    <span className="badge badge-soft-secondary" key={`index-${id}-${index}`}>
                        {item}
                    </span>))
            }
        </div>
    )
}



export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Holiday Name",
            accessor: "holidayName",
            disableSortBy: true,
            columnClassName: 'tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]',
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Classes",
            accessor: "classes",
            disableSortBy: true,
            columnClassName: 'tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]',
            Cell: ClassesList
        },
        {
            Header: "Holiday Type",
            accessor: "holidayType",
            disableSortBy: true,
        },
        {
            Header: "From Date",
            accessor: "fromDate",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
            Cell: ({ value }: any) =>
                getDdMmYyyyWithMonthNameFormat(value)
        },
        {
            Header: "To Date",
            accessor: "toDate",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
            Cell: ({ value }: any) =>
                getDdMmYyyyWithMonthNameFormat(value)
        },
        {
            Header: "No of Days",
            accessor: "noOfDays",
            disableSortBy: true,
            // Cell: ({ row: { original } }: any) => {
            //     const { fromDate, toDate } = original;
            //     return <>{getDateDifferenceInDays(toDate, fromDate)}</>
            // }
        },
        {
            Header:"Created By",
            accessor:"createdBy",
            disableSortBy:true,
            Cell:({row:{original}}:any)=>{
              return <span>{original.createdBy ? original.createdBy : "-"}</span>
            }
        },
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
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ];
}

export const MonthNames = [
    { id: "JANUARY", name: "JANUARY" },
    { id: "FEBRUARY", name: "FEBRUARY" },
    { id: "MARCH", name: "MARCH" },
    { id: "APRIL", name: "APRIL" },
    { id: "MAY", name: "MAY" },
    { id: "JUNE", name: "JUNE" },
    { id: "JULY", name: "JULY" },
    { id: "AUGUST", name: "AUGUST" },
    { id: "SEPTEMBER", name: "SEPTEMBER" },
    { id: "OCTOBER", name: "OCTOBER" },
    { id: "NOVEMBER", name: "NOVEMBER" },
    { id: "DECEMBER", name: "DECEMBER" }
];

export const holidayTypes = [
    {
        id: 'Holiday',
        name: 'Holiday'
    },
    {
        id: 'Optional Holiday',
        name: 'Optional Holiday'
    }
]

export const advanceFilterValues = {
    minDate: "",
    maxDate: "",
    startDate: '',
    endDate: ''
}


export function checkFitlersApplied(applieFilters: any) {
    return Object.keys(applieFilters).some(item => {
        if (item === "academicYearId" || item === "branchId" || item === "pageNo" || item === "pageSize") {
            return false;
        }
        return !!applieFilters[item];
    });
}

export function getAppliedAdvanceFilterCount(applieFilters: any) {
    return Object.keys(applieFilters).reduce((total: number, item: string) => {
        if (item === "startDate" && !!applieFilters[item]) {
            total += 1;
        } if (item === "endDate" && !!applieFilters[item]) {
            total += 1;
        }
        return total;
    }, 0);
}

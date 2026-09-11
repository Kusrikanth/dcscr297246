import { UserDetails } from "../../Components/Common";
import { MenuOptionHrtl } from "../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../utility/commonutility";
import { getDateMonthYearFormat } from "../../utility/dateutility";
import { StudentConcessionFilterhProps } from "./FeeSummaryTypes";

export function generateColumns() {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px max-w-200px",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            showAvatar={false}
                            displayNameClass="text-truncate"
                            displayName={original?.studentName}
                            displayId={original?.studentCode}
                        />
                    </>
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
            Cell: ({ row: { original } }: any) => {
                return (
                    <span className="text-nowrap">{original?.className}</span>
                );
            }
        },
        {
            Header: "Section",
            accessor: "sectionName",
            disableSortBy: true,
            columnClassName: 'text-center',
            Cell: ({ row: { original } }: any) => {
                return <span>{original.sectionName ? original.sectionName : "-"}</span>
            }
        },
        {
            Header: "Total Amount (₹)",
            accessor: "netAmount",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(+original?.amountToPay)}</span>
                // <div className="d-flex align-items-center">
                {/* <RupeeSvg width="11px" height="11px" fill={"#495057"} /> */ }
                {/* </div> */ }
            },
        },
        {
            Header: "Paid Amount (₹)",
            accessor: "amountPaid",
            disableSortBy: true,
            columnClassName: "text-center",

            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.amountPaid)}</span>
                // <div className="d-flex align-items-center">
                //   <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                //   <span>{original?.amountPaid}</span>
                // </div>
            },
        },
        {
            Header: () => <>Balance (₹) on <br />{getDateMonthYearFormat(new Date())}</>,
            accessor: "currentAmountToBePaid",
            disableSortBy: true,
            columnClassName: "w-150px min-w-150px max-w-150px text-center",
            Cell: ({ value }: any) => <span>{getDisplayAmountValue(value)}</span>,
        },
        {
            Header: "Balance Amt (₹)",
            accessor: "amountToBePaid",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return <span>{getDisplayAmountValue(original?.amountToBePaid)}</span>
                // <div className="d-flex align-items-center">
                //   <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                //   <span>{original?.amountToBePaid}</span>
                // </div>
            },
        }
    ];
}

export const initialValues: StudentConcessionFilterhProps = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    type: "",
};



export function getAppliedFiltersInfo(appliedFilters: any, currentAcademicYear: string | undefined) {
    const basicFilterKeys = Object.keys(initialValues);
    let isFilterApplied = false;
    for (const key of basicFilterKeys) {
        if (key === 'academicYearId') {
            if (appliedFilters.academicYearId?.toString() !== currentAcademicYear) {
                isFilterApplied = true;
                break;
            } else {
                continue;
            }
        }
        if (!!appliedFilters[key]) {
            isFilterApplied = true;
            break;
        }
        continue;
    }

    return {
        canClearFilter: isFilterApplied
    }
}

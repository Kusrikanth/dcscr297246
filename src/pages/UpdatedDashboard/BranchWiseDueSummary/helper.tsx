import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";
import { UserDetails } from "../../../Components/Common";

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
  CUMULATIVE_FEE : "CUMULATIVE FEE",
}

const isColExpandable = (row: any,rowDataInfo?:any) => {
  const { depth, isExpanded  } = row || {}
  const { termId } = rowDataInfo || {}
  if(termId){
    return false
  }
  if (!depth && !isExpanded) {
    return true
  }
  return false
}

export function generateColumns(openShowStuModal: any) {
  return [
    {
      id: "expander",
      disableSortBy: true,
      Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
        <span
          {...getToggleAllRowsExpandedProps()}
          className={`expander-btn fs-18 fw-normal ${isAllRowsExpanded ? "bg-danger" : "bg-success"
            }`}
        >
          {isAllRowsExpanded ? "-" : "+"}
        </span>
      ),
      rowSpan: 2,
      columnClassName: "sticky-left !tw-w-[100px] !tw-min-w-[100px] !tw-max-w-[100px]",
      footerClassName: "bg-light sticky-left !tw-w-[100px] !tw-min-w-[100px] !tw-max-w-[100px]",
      Footer: "",
      columns: [
        {
          Header: "Hidden",
          displayNone: true,
          disableSortBy: true,
          columnClassName: "sticky-left !tw-w-[100px] !tw-min-w-[100px] !tw-max-w-[100px]",
          footerClassName:
            "bg-light sticky-left !tw-w-[100px] !tw-min-w-[100px] !tw-max-w-[100px]",
          Footer: "",
          Cell: ({ row , rowDataInfo } : any) =>
            row.canExpand ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                  },
                })}
                className={`expander-btn fs-18 ${row.isExpanded ? "bg-danger" : "bg-success"
                  }`}
              >
                {row.isExpanded ? "-" : "+"}
              </span>
            ) : null,
        },
      ],
    },
    {
      Header: () => (
        <div className="!tw-flex !tw-items-center !tw-justify-center">
          <HugeiconsIcon icon={SchoolIcon}
            size={20}
            className="me-2"
          />

          <span>Branch Name</span>
        </div>
      ),
      accessor: "hiddenBranchName",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName:
        "!tw-text-nowrap !tw-text-center sticky-second-left !tw-w-[200px] !tw-min-w-[200px] !tw-max-w-[200px]",
      footerClassName:
        "!tw-text-nowrap !tw-text-center sticky-second-left !tw-w-[200px] !tw-min-w-[200px] !tw-max-w-[200px]",
      Footer: "",

      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "branchName",
          disableSortBy: true,
          columnClassName:
            "!tw-text-nowrap !tw-p-0 !tw-text-center sticky-second-left !tw-w-[200px] !tw-min-w-[200px] !tw-max-w-[200px]",
          footerClassName:
            "!tw-text-nowrap !tw-text-center sticky-second-left !tw-w-[200px] !tw-min-w-[200px] !tw-max-w-[200px] bg-light",
          Footer: "Total",
          Cell: ({ row: { original, ...otherValues } }: any) => {
            const { branchName, cellBgColor } = original || {};

            const { isExpanded } = otherValues || {};
            return (
              <div
                className="!tw-flex !tw-items-center !tw-text-center !tw-justify-center"
                style={{
                  padding: "0.4rem 0.7rem",
                }}
              >
                <span>{branchName}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      Header: "Term",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "!tw-text-center",
      footerClassName: "!tw-text-white !tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "termName",
          columnClassName: "!tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "!tw-text-white !tw-font-bold",
          Cell: ({ row,rowDataInfo }: any) => {
            return isColExpandable(row,rowDataInfo) ? "Total" : row?.original?.termName
          }
        },
      ],
    },
    {
      Header: "Academic Fee Status",
      accessor: "feeStructure",
      disableSortBy: true,
      columnClassName: "!tw-text-center",
      Footer: "",
      columns: [
        // {
        //   Header: "No of Students",
        //   accessor: "feeNoOfStudents",
        //   disableSortBy: true,
        //   columnClassName: "text-center",
        //   Cell: ({ row , rowDataInfo } : any) => {
        //     const { original } = row || {};
        //     const { totalObj } = original || {}
        //     const { feeNoOfStudents } = totalObj || {}
        //     return isColExpandable(row,rowDataInfo) ? feeNoOfStudents || 0 : original?.feeNoOfStudents || 0
        //   },
        //   Footer: (rowsData: any) => {
        //     const { data } = rowsData || {}
        //     return findTotalStudents(data, "feeNoOfStudents")
        //   }
        // },
        {
          Header: "Paid (%)",
          accessor: "feePaidPer",
          disableSortBy: true,
          columnClassName: "!tw-text-center",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return ((+(findTotalStudents(data, "feePaidStudents") * 100) / findTotalStudents(data, "feeNoOfStudents")).toFixed(2) || "0.00") + "%"
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { feePaidPer } = original?.totalObj || {}
            return isColExpandable(row,rowDataInfo) ? `${feePaidPer || "0.00"}%` : `${original?.feePaidPer || "0.00"}%`
          },
        },
        {
          Header: "Unpaid (%)",
          accessor: "feeUnPaidPer",
          disableSortBy: true,
          columnClassName: "!tw-text-center !tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return ((+(findTotalStudents(data, "feeUnpaid") * 100) / findTotalStudents(data, "feeNoOfStudents")).toFixed(2) || "0.00") + "%"
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { feeUnPaidPer } = original || {};
            const { feeUnPaidPer: totalFeeUnpaidPer } = original?.totalObj || {}

            const feeUnPaidPercentage = isColExpandable(row,rowDataInfo) ? totalFeeUnpaidPer : feeUnPaidPer

            const success = {
              textColor: "!tw-text-emerald-500",
              bgColor: "#b6e8e1",
            };

            const warning = {
              textColor: "!tw-text-amber-500",
              bgColor: "#fdeac9",
            };
            const danger = {
              textColor: "!tw-text-red-500",
              bgColor: "#fbd1c8",
            };

            const feeUnPaidPerColor =
              feeUnPaidPercentage ? (feeUnPaidPercentage <= 5
                ? success
                : feeUnPaidPercentage <= 10
                  ? warning
                  : danger) : success;
            return (
              <div
                className="!tw-font-semibold"
                style={{ padding: "0.4rem 0.7rem" }}
              >
                <span
                  style={{
                    backgroundColor: `${feeUnPaidPerColor.bgColor}`,
                  }}
                  className="!tw-px-2 !tw-py-1 !tw-rounded"
                >{`${feeUnPaidPercentage || "0.00"}%`}</span>
              </div>
            );
          },
        },
        {
          Header: "Unpaid",
          accessor: "feeUnpaid",
          disableSortBy: true,
          columnClassName: "!tw-text-center !tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return findTotalStudents(data, "feeUnpaid")
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { feeUnpaid: totalFeeUnpaid } = original?.totalObj || {}
            const feeUnpaidCount = isColExpandable(row,rowDataInfo) ? totalFeeUnpaid : original?.feeUnpaid
            return (
              <div onClick={() => feeUnpaidCount && openShowStuModal({ data: isColExpandable(row,rowDataInfo) ? original?.totalObj : original, type: feeTypeOptions.FEE_STRUCTURE })} style={{ padding: "0.4rem 0.7rem" }}>
                <span className="!tw-text-blue-500 !tw-cursor-pointer">
                  {feeUnpaidCount || 0}
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
      columnClassName: "!tw-text-center",
      Footer: "",
      columns: [
        // {
        //   Header: "No of Students",
        //   accessor: "transportNoOfStudents",
        //   disableSortBy: true,
        //   columnClassName: "text-center",
        //   Cell: ({ row , rowDataInfo } : any) => {
        //     const { original } = row || {};
        //     const { transportNoOfStudents } = original?.totalObj || {}
        //     return isColExpandable(row,rowDataInfo) ? transportNoOfStudents || 0 : original?.transportNoOfStudents || 0
        //   },
        //   Footer: (rowsData: any) => {
        //     const { data } = rowsData || {}
        //     return findTotalStudents(data, "transportNoOfStudents")
        //   }
        // },
        {
          Header: "Paid (%)",
          accessor: "transportPaidPer",
          disableSortBy: true,
          columnClassName: "!tw-text-center",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return (+((findTotalStudents(data, "transportPaidStudents") * 100) / findTotalStudents(data, "transportNoOfStudents")).toFixed(2) || "0.00") + "%"
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { transportPaidPer } = original?.totalObj || {}
            return isColExpandable(row,rowDataInfo) ? `${transportPaidPer || "0.00"}%` : `${original?.transportPaidPer || "0.00"}%`
          },
        },
        {
          Header: "Unpaid (%)",
          accessor: "transportUnPaidPer",
          disableSortBy: true,
          columnClassName: "!tw-text-center !tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return (+((findTotalStudents(data, "transportUnpaid") * 100) / findTotalStudents(data, "transportNoOfStudents")).toFixed(2) || "0.00") + "%"
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { transportUnPaidPer } = original || {};
            const { transportUnPaidPer: totalTransportUnpaidPer } = original?.totalObj || {}

            const transportUnPaidPercentage = isColExpandable(row,rowDataInfo) ? totalTransportUnpaidPer : transportUnPaidPer

            const success = {
              textColor: "!tw-text-emerald-500",
              bgColor: "#b6e8e1",
            };

            const warning = {
              textColor: "!tw-text-amber-500",
              bgColor: "#fdeac9",
            };
            const danger = {
              textColor: "!tw-text-red-500",
              bgColor: "#fbd1c8",
            };

            const transportUnPaidPerColor =
              transportUnPaidPercentage ? (transportUnPaidPercentage <= 5
                ? success
                : transportUnPaidPercentage <= 10
                  ? warning
                  : danger) : success;
            return (
              <div
                className="!tw-font-semibold"
                style={{ padding: "0.4rem 0.7rem" }}
              >
                <span
                  style={{
                    backgroundColor: `${transportUnPaidPerColor.bgColor}`,
                  }}
                  className="!tw-px-2 !tw-py-1 !tw-rounded"
                >{`${transportUnPaidPercentage || "0.00"}%`}</span>
              </div>
            );
          },
        },
        {
          Header: "Unpaid",
          accessor: "transportUnpaid",
          disableSortBy: true,
          columnClassName: "!tw-text-center !tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return findTotalStudents(data, "transportUnpaid")
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { transportUnpaid: totalTransportUnpaid } = original?.totalObj || {}
            const transportUnpaidCount = isColExpandable(row,rowDataInfo) ? totalTransportUnpaid : original?.transportUnpaid
            return (
              <div onClick={() => transportUnpaidCount && openShowStuModal({ data: isColExpandable(row,rowDataInfo) ? original?.totalObj : original, type: feeTypeOptions.TRANSPORT_FEE })} style={{ padding: "0.4rem 0.7rem" }}>
                <span className="!tw-text-blue-500 !tw-cursor-pointer">
                  {transportUnpaidCount || 0}
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
      columnClassName: "!tw-text-center",
      Footer: "",
      columns: [
        // {
        //   Header: "No of Students",
        //   accessor: "accumulatedNoOfStudents",
        //   disableSortBy: true,
        //   columnClassName: "text-center",
        //   Cell: ({ row , rowDataInfo } : any) => {
        //     const { original } = row || {};
        //     const { accumulatedNoOfStudents } = original?.totalObj || {}
        //     return isColExpandable(row,rowDataInfo) ? accumulatedNoOfStudents || 0 : original?.accumulatedNoOfStudents || 0
        //   },
        //   Footer: (rowsData: any) => {
        //     const { data } = rowsData || {}
        //     return findTotalStudents(data, "accumulatedNoOfStudents")
        //   }
        // },
        {
          Header: "Paid (%)",
          accessor: "accumulatedPaidPer",
          disableSortBy: true,
          columnClassName: "!tw-text-center",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return ((+(findTotalStudents(data, "accumulatedPaid") * 100) / findTotalStudents(data, "accumulatedNoOfStudents")).toFixed(2) || "0.00") + "%"
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { accumulatedPaidPer } = original?.totalObj || {}
            return isColExpandable(row,rowDataInfo) ? `${accumulatedPaidPer || "0.00"}%` : `${original?.accumulatedPaidPer || "0.00"}%`
          },
        },
        {
          Header: "Unpaid (%)",
          accessor: "accumulatedUnPaidPer",
          disableSortBy: true,
          columnClassName: "!tw-text-center !tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return ((+(findTotalStudents(data, "accumulatedUnpaid") * 100) / findTotalStudents(data, "accumulatedNoOfStudents")).toFixed(2) || "0.00") + "%"
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { accumulatedUnPaidPer } = original || {};
            const { accumulatedUnPaidPer: totalAccumulatedUnpaidPer } = original?.totalObj || {}

            const accumulatedUnPaidPercentage = isColExpandable(row,rowDataInfo) ? totalAccumulatedUnpaidPer : accumulatedUnPaidPer

            const success = {
              textColor: "!tw-text-emerald-500",
              bgColor: "#b6e8e1",
            };

            const warning = {
              textColor: "!tw-text-amber-500",
              bgColor: "#fdeac9",
            };
            const danger = {
              textColor: "!tw-text-red-500",
              bgColor: "#fbd1c8",
            };

            const accumulatedUnPaidPerColor =
              accumulatedUnPaidPercentage ? (accumulatedUnPaidPercentage <= 5
                ? success
                : accumulatedUnPaidPercentage <= 10
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
                  className="!tw-px-2 !tw-py-1 !tw-rounded"
                >{`${accumulatedUnPaidPercentage || "0.00"}%`}</span>
              </div>
            );
          },
        },
        {
          Header: "Unpaid",
          accessor: "accumulatedUnpaid",
          disableSortBy: true,
          columnClassName: "!tw-text-center !tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            return findTotalStudents(data, "accumulatedUnpaid")
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { accumulatedUnpaid: totalAccumulatedUnpaid } = original?.totalObj || {}
            const accumulatedUnpaidCount = isColExpandable(row,rowDataInfo) ? totalAccumulatedUnpaid : original?.accumulatedUnpaid
            return (
              <div onClick={() => accumulatedUnpaidCount && openShowStuModal({ data: isColExpandable(row,rowDataInfo) ? original?.totalObj : original, type: feeTypeOptions.ACCUMULATED })} style={{ padding: "0.4rem 0.7rem" }}>
                <span className="!tw-text-blue-500 !tw-cursor-pointer">
                  {accumulatedUnpaidCount || 0}
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
      columnClassName: "!tw-w-[300px] !tw-min-w-[300px] !tw-max-w-[300px]",
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
    id : "ACTIVE",
    name : "Active"
  },{
    id : "INACTIVE",
    name : "Inactive"
  }
]
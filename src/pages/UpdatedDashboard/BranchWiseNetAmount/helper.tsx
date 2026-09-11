import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";
import { feeTypeOptions } from "../BranchWiseDueSummary/helper";

const formatAmt = (amount: number) => {
  return (amount || 0).toLocaleString("en-IN")
};

const findTotalAmt = (data: any, accessor: string) => {
  let totalStudents = 0
  if (Array.isArray(data) && data.length > 0) {
    data.map((original: any) => {
      const { totalObj } = original
      totalStudents += (+(totalObj || original)?.[accessor] || 0)
    })
  }
  return totalStudents || 0
}

const isColExpandable = (row: any,rowDataInfo?:any) => {
  const { depth, isExpanded } = row || {}
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
      columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      footerClassName: "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      Footer: "",
      columns: [
        {
          Header: "Hidden",
          displayNone: true,
          disableSortBy: true,
          columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
          footerClassName:
            "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
          Footer: "",
          Cell: ({ row , rowDataInfo } : any) =>
            row.canExpand ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                    backgroundColor: `${row.original.cellBgColor}`,
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
        <div className="tw-flex tw-items-center">
          <HugeiconsIcon
            icon={SchoolIcon}
            size={20}
            className="tw-me-2"
          />

          <span>Branch Name</span>
        </div>
      ),
      accessor: "hiddenBranchName",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName:
        "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      footerClassName:
        "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "branchName",
          disableSortBy: true,
          columnClassName:
            "tw-text-nowrap p-0 tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
          footerClassName:
            "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] bg-light",
          Footer: "Total",
          Cell: ({ row: { original, ...otherValues } }: any) => {
            const { branchName, cellBgColor } = original || {};

            const { isExpanded } = otherValues || {};

            // console.log(otherValues);
            return (
              <div
                className="tw-flex tw-items-center tw-text-center"
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
          Cell: ({ row , rowDataInfo } : any) => {
            return isColExpandable(row,rowDataInfo) ? "Total" : row?.original?.termName
          }
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
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.feeNet : original?.feeNet) || 0}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "feeNet")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Paid (₹)",
          accessor: "feePaid",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.feePaid : original?.feePaid)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "feePaid")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Due (₹)",
          accessor: "feeDue",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.feeDue : original?.feeDue)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "feeDue")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Unpaid",
          accessor: "feeUnpaidStudent",
          disableSortBy: true,
          columnClassName: "tw-text-center tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "feeUnpaidStudent")
            return (+totalAmt ? <div>{`${formatAmt(totalAmt)}`}</div> : <div>{`0`}</div>)
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { feeUnpaidStudent: totalFeeUnpaid } = original?.totalObj || {}
            const feeUnpaidCount = isColExpandable(row,rowDataInfo) ? totalFeeUnpaid : original?.feeUnpaidStudent
            return (
              <div onClick={() => feeUnpaidCount && openShowStuModal({ data: isColExpandable(row,rowDataInfo) ? original?.totalObj : original, type: feeTypeOptions.FEE_STRUCTURE })} style={{ padding: "0.4rem 0.7rem" }}>
                <span className="tw-text-blue-500 tw-cursor-pointer">
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
      columnClassName: "tw-text-center",
      Footer: "",
      columns: [
        {
          Header: "Net (₹)",
          accessor: "transportNet",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.transportNet : original?.transportNet)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "transportNet")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Paid (₹)",
          accessor: "transportPaid",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.transportPaid : original?.transportPaid)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "transportPaid")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Due (₹)",
          accessor: "transportDue",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.transportDue : original?.transportDue)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "transportDue")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Unpaid",
          accessor: "transportUnpaidStudent",
          disableSortBy: true,
          columnClassName: "tw-text-center tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "transportUnpaidStudent")
            return (+totalAmt ? <div>{`${formatAmt(totalAmt)}`}</div> : <div>{`0`}</div>)
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { transportUnpaidStudent: totalTransportUnpaid } = original?.totalObj || {}
            const transportUnpaidCount = isColExpandable(row,rowDataInfo) ? totalTransportUnpaid : original?.transportUnpaidStudent
            return (
              <div onClick={() => transportUnpaidCount && openShowStuModal({ data: isColExpandable(row,rowDataInfo) ? original?.totalObj : original, type: feeTypeOptions.TRANSPORT_FEE })} style={{ padding: "0.4rem 0.7rem" }}>
                <span className="tw-text-blue-500 tw-cursor-pointer">
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
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.cumulativeNet : original?.cumulativeNet)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "cumulativeNet")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Paid (₹)",
          accessor: "cumulativePaid",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.cumulativePaid : original?.cumulativePaid)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "cumulativePaid")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Due (₹)",
          accessor: "cumulativeDue",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { totalObj } = original || {}
            return (<div>{`₹ ${formatAmt(isColExpandable(row,rowDataInfo) ? totalObj?.cumulativeDue : original?.cumulativeDue)}`}</div>)
          },
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "cumulativeDue")
            return (+totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>)
          }
        },
        {
          Header: "Unpaid",
          accessor: "cumulativeUnpaidStudent",
          disableSortBy: true,
          columnClassName: "tw-text-center tw-p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "cumulativeUnpaidStudent")
            return (+totalAmt ? <div>{`${formatAmt(totalAmt)}`}</div> : <div>{`0`}</div>)
          },
          Cell: ({ row , rowDataInfo } : any) => {
            const { original } = row || {};
            const { cumulativeUnpaidStudent: totalUnpaid } = original?.totalObj || {}
            const unpaidCount = isColExpandable(row,rowDataInfo) ? totalUnpaid : original?.cumulativeUnpaidStudent
            return (
              <div onClick={() => unpaidCount && openShowStuModal({ data: isColExpandable(row,rowDataInfo) ? original?.totalObj : original, type: feeTypeOptions.ACCUMULATED })} style={{ padding: "0.4rem 0.7rem" }}>
                <span className="tw-text-blue-500 tw-cursor-pointer">
                  {unpaidCount || 0}
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
    id : "ACTIVE",
    name : "Active"
  },{
    id : "INACTIVE",
    name : "Inactive"
  }
]

import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";
import { feeTypeOptions } from "../BranchWiseDueSummary/helper";

const formatAmt = (amount: number) => {
  return (amount || 0).toLocaleString("en-IN")
};

const findTotalAmt = (data: any, accessor: string) => {
  let totalStudents = 0;
  if (Array.isArray(data) && data.length > 0) {
    data.forEach((original: any) => {
      totalStudents +=
        (+original?.[accessor] || 0);
    });
  }
  return totalStudents || 0;
};

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
      columnClassName: "sticky-left w-100px min-w-100px max-w-100px",
      footerClassName: "bg-light sticky-left w-100px min-w-100px max-w-100px",
      Footer: "",
      columns: [
        {
          Header: "Hidden",
          displayNone: true,
          disableSortBy: true,
          columnClassName: "sticky-left w-100px min-w-100px max-w-100px",
          footerClassName:
            "bg-light sticky-left w-100px min-w-100px max-w-100px",
          Footer: "",
          Cell: ({ row, rowDataInfo }: any) =>
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
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "text-center",
      Cell: ({ row }: any) => {
        const { depth, original } = row;
        if (depth !== 0) {
          return null;
        }
        return (
          <div className="text-center">
            {original.curriculumName}
          </div>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "text-center",
      Cell: ({ row }: any) => {
        const { depth, original } = row;
        if (depth === 1) {
          return original.className;
        }
        return null;
      },
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "text-center",
      Cell: ({ row }: any) => {
        const { depth, original } = row;
        if (depth === 2) {
          return original.sectionName;
        }
        return null;
      },
    },
    {
      Header: "Academic Fee Status",
      accessor: "feeStructure",
      disableSortBy: true,
      columnClassName: "text-center",
      Footer: "",
      columns: [
        {
          Header: "Net (₹)",
          accessor: "feeNet",
          disableSortBy: true,
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.feeNet || 0)}
              </div>
            );
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
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.feePaid || 0)}
              </div>
            );
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
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.feeDue || 0)}
              </div>
            );
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
          columnClassName: "text-center p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "feeUnpaidStudent")
            return (+totalAmt ? <div>{`${formatAmt(totalAmt)}`}</div> : <div>{`0`}</div>)
          },
          Cell: ({ row }: any) => {
            const { original } = row || {};
            const feeUnpaidCount =
              original?.feeUnpaidStudent || 0;
            return (
              <div
                onClick={() =>
                  feeUnpaidCount &&
                  openShowStuModal({
                    data: {
                      branchId: original.branchId || null,
                      curriculumId: original.curriculumId || null,
                      classId: original.classId || null,
                      sectionId: original.sectionId || null,
                    },
                    type: feeTypeOptions.FEE_STRUCTURE
                  })
                }
                style={{ padding: "0.4rem 0.7rem" }}
              >
                <span className="text-info cursor-pointer">
                  {feeUnpaidCount}
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
        {
          Header: "Net (₹)",
          accessor: "transportNet",
          disableSortBy: true,
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.transportNet || 0)}
              </div>
            );
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
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.transportPaid || 0)}
              </div>
            );
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
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.transportDue || 0)}
              </div>
            );
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
          columnClassName: "text-center p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "transportUnpaidStudent")
            return (+totalAmt ? <div>{`${formatAmt(totalAmt)}`}</div> : <div>{`0`}</div>)
          },
          Cell: ({ row }: any) => {
            const { original } = row || {};
            const transportUnpaidCount =
              original?.transportUnpaidStudent || 0;
            return (
              <div
                onClick={() =>
                  transportUnpaidCount &&
                  openShowStuModal({
                    data: {
                      branchId: original.branchId || null,
                      curriculumId: original.curriculumId || null,
                      classId: original.classId || null,
                      sectionId: original.sectionId || null,
                    },
                    type: feeTypeOptions.TRANSPORT_FEE
                  })
                }
                style={{ padding: "0.4rem 0.7rem" }}
              >
                <span className="text-info cursor-pointer">
                  {transportUnpaidCount}
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
      columnClassName: "text-center",
      Footer: "",
      columns: [
        {
          Header: "Net (₹)",
          accessor: "cumulativeNet",
          disableSortBy: true,
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.cumulativeNet || 0)}
              </div>
            );
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
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.cumulativePaid || 0)}
              </div>
            );
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
          columnClassName: "text-center",
          Cell: ({ row }: any) => {
            const { original } = row || {};
            return (
              <div>
                ₹ {formatAmt(original?.cumulativeDue || 0)}
              </div>
            );
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
          columnClassName: "text-center p-0",
          Footer: (rowsData: any) => {
            const { data } = rowsData || {}
            const totalAmt = findTotalAmt(data, "cumulativeUnpaidStudent")
            return (+totalAmt ? <div>{`${formatAmt(totalAmt)}`}</div> : <div>{`0`}</div>)
          },
          Cell: ({ row }: any) => {
            const { original } = row || {};
            const unpaidCount =
              original?.cumulativeUnpaidStudent || 0;
            return (
              <div
                onClick={() =>
                  unpaidCount &&
                  openShowStuModal({
                    data: {
                      branchId: original.branchId || null,
                      curriculumId: original.curriculumId || null,
                      classId: original.classId || null,
                      sectionId: original.sectionId || null,
                    },
                    type: feeTypeOptions.ACCUMULATED
                  })
                }
                style={{ padding: "0.4rem 0.7rem" }}
              >
                <span className="text-info cursor-pointer">
                  {unpaidCount}
                </span>
              </div>
            );
          }
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

export function renderValueStudent(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item) => (
          <div key={`item-${item?.sectionId}`} className="selectedoption-item">
            <span>{item?.sectionName}</span>
            <span
              data-id={item?.sectionId}
              onClick={removeItemHandler}
              className="remove-icon"
            >
              <i className="ri-close-line"></i>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function renderOptionsStudent(item: any) {
  return item?.sectionName;
}
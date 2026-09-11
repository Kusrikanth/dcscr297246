
export function generateColumns(subjects, branchWiseSubjectAndAvgMarks) {
  const calculateFooterTotals = () => {
    const totals = {
      totalStudents: 0,
      totalCount: 0,
      totalPercentage: 0,
      totalAverage: 0,
      subjectTotals: {},
    };

    subjects?.forEach((subject) => {
      totals.subjectTotals[subject.name] = {
        totalCount: 0,
        totalPercentage: 0,
        branchCount: 0,
      };
    });

    branchWiseSubjectAndAvgMarks?.forEach((branch) => {
      totals.totalStudents += branch?.studentsCount || 0;
      totals.totalCount += branch.subjectAndAverageMarks?.TOTAL?.count || 0;
      totals.totalPercentage += branch.subjectAndAverageMarks?.TOTAL?.percentage || 0;

      if (branch?.subjectAndAverageMarks) {
        subjects?.forEach((subject) => {
          const subjectData = branch.subjectAndAverageMarks[subject.name];
          if (subjectData) {
            totals.subjectTotals[subject.name].totalCount +=
              subjectData.count || 0;
            totals.subjectTotals[subject.name].totalPercentage +=
              subjectData.percentage || 0;
            totals.subjectTotals[subject.name].branchCount += 1;
          }
        });
      }
    });

    subjects?.forEach((subject) => {
      const subjectTotal = totals.subjectTotals[subject.name];

      if (subjectTotal.branchCount > 0) {
        subjectTotal.averagePercentage =
          subjectTotal.totalPercentage / subjectTotal.branchCount;
      } else {
        subjectTotal.averagePercentage = 0;
      }
    });

    return totals;
  };

  const footerTotals = calculateFooterTotals();

  const fixedColumns = [
    {
      Header: "Branch",
      accessor: "hiddenBranch",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      rowSpan: 2,
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "branchName",
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "GRAND TOTAL",
        },
      ],
    },
    {
      Header: "Count",
      accessor: "hiddenCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      rowSpan: 2,
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "studentsCount",
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: footerTotals.totalStudents.toString(),
        },
      ],
    },
  ];

   const totalColumns = [
    {
      Header: "Total",
      accessor: "hiddenTotal",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: "",
      columns: [
        {
          Header: "Count",
          accessor: "totalCount",
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: footerTotals.totalCount.toString(),
          Cell: ({ row }) => {
            
            if (!row.original?.subjectAndAverageMarks) {
              return (
                <div
                  className="tw-font-semibold tw-flex tw-items-center tw-justify-center"
                >
                  <span
                    className={`tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center `}
                  >
                    0
                  </span>
                </div>
              );
            }
            
            return (
              <div
                className="tw-font-semibold tw-flex tw-items-center tw-justify-center"
              >
                <span
                  className={`tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center ${row.original.subjectAndAverageMarks?.TOTAL?.count > 0 ? "tw-bg-[#fbd1c8]" : ""}`}
                >
                  {row.original.subjectAndAverageMarks?.TOTAL?.count || "0"}
                </span>
              </div>
            );
          },
        },
        {
          Header: "%",
          accessor: "totalPercentage",
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: `${footerTotals.totalPercentage.toFixed(2)}%`,
          Cell: ({ row }) => {
            if (!row.original?.subjectAndAverageMarks) {
              return '0%';
            }
            
            const subjectData = row.original.subjectAndAverageMarks?.TOTAL;
            return subjectData ? `${subjectData.percentage.toFixed(2)}%` : '0%';
          },
        },
      ],
    },
  ];

  const dynamicColumns = subjects?.map((subject, idx) => {
    const subjectName = subject.name;

    const cleanSubjectName = subjectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const countAccessor = `${cleanSubjectName}_count_${idx}`;
    const percentageAccessor = `${cleanSubjectName}_percentage_${idx}`;
    const mainAccessor = `hidden_${cleanSubjectName}_${idx}`;

    const subjectTotal = footerTotals.subjectTotals[subjectName];

    return {
      key: `subject-${idx}`,
      Header: subjectName,
      accessor: mainAccessor,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      disableSortBy: true,
      Footer: "",
      columns: [
        {
          Header: "Count",
          accessor: countAccessor,
          columnClassName: "tw-text-center tw-px-2 tw-py-3",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: subjectTotal.totalCount.toString(),

          Cell: ({ row }) => {
            if (!row.original?.subjectAndAverageMarks) {
              return (
                <div
                  className="tw-font-semibold tw-flex tw-items-center tw-justify-center"
                  // style={{ padding: "0.4rem 0.7rem" }}
                >
                  <span
                    className={`tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center`}
                  >
                    "0"
                  </span>
                </div>
              );
            }

            const subjectData =
              row.original.subjectAndAverageMarks[subjectName];
            return (
              <div
                className="tw-font-semibold tw-flex tw-items-center tw-justify-center"
                // style={{ padding: "0.4rem 0.7rem" }}
              >
                <span
                  className={`tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center ${
                    subjectData?.count ? "tw-bg-[#fbd1c8]" : ""
                  }`}
                >
                  {subjectData ? subjectData.count.toString() : "0"}
                </span>
              </div>
            );
          },
        },
        {
          Header: "%",
          accessor: percentageAccessor,
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: `${subjectTotal.averagePercentage.toFixed(2)}%`,
          Cell: ({ row }) => {
            if (!row.original?.subjectAndAverageMarks) {
              return "0";
            }

            const subjectData =
              row.original.subjectAndAverageMarks[subjectName];
            return subjectData ? `${subjectData.percentage.toFixed(2)}%` : "0%";
          },
        },
      ],
    };
  });

  return [...fixedColumns, ...dynamicColumns, ...totalColumns];
}

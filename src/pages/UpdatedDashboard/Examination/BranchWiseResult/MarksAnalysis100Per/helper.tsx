export function generateColumns(subjects, branchWiseSubjectAndAvgMarks) {
  // Calculate dynamic totals for footer
  const calculateFooterTotals = () => {
    const totals = {
      totalStudents: 0,
      totalCount: 0,
      totalPercentage: 0,
      totalAverage: 0,
      subjectTotals: {}
    };

    // Initialize subject totals
    subjects?.forEach(subject => {
      totals.subjectTotals[subject.name] = {
        totalCount: 0,
        totalPercentage: 0,
        branchCount: 0
      };
    });

    // Calculate totals from branchWiseSubjectAndAvgMarks
    branchWiseSubjectAndAvgMarks?.forEach(branch => {
      totals.totalStudents += branch.studentsCount || 0;
      totals.totalCount += branch.subjectAndAverageMarks?.TOTAL?.count || 0;
      totals.totalPercentage += branch.subjectAndAverageMarks?.TOTAL?.percentage || 0;

      if (branch.subjectAndAverageMarks) {
        subjects?.forEach(subject => {
          const subjectData = branch.subjectAndAverageMarks[subject.name];
          if (subjectData) {
            totals.subjectTotals[subject.name].totalCount += subjectData.count || 0;
            totals.subjectTotals[subject.name].totalPercentage += subjectData.percentage || 0;
            totals.subjectTotals[subject.name].branchCount += 1;
          }
        });
      }
    });

    // Calculate average percentages
    subjects?.forEach(subject => {
      const subjectTotal = totals.subjectTotals[subject.name];
      if (subjectTotal.branchCount > 0) {
        subjectTotal.averagePercentage = subjectTotal.totalPercentage / subjectTotal.branchCount;
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
                  className="fw-semibold d-flex align-items-center justify-content-center"
                >
                  <span
                    className={`px-2 py-1 rounded d-flex align-items-center justify-content-center `}
                  >
                    0
                  </span>
                </div>
              );
            }
            
            return (
              <div
                className="fw-semibold d-flex align-items-center justify-content-center"
              >
                <span
                  className={`px-2 py-1 rounded d-flex align-items-center justify-content-center ${row.original.subjectAndAverageMarks?.TOTAL?.count > 0 ? "tw-bg-[#b6e8e1]" : ""}`}
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

  // Generate dynamic columns based on subjects
  const dynamicColumns = subjects?.map((subject, index) => {
    const subjectName = subject.name;
    // Create unique accessor keys based on subject name and index
    const cleanSubjectName = subjectName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const countAccessor = `${cleanSubjectName}_count_${index}`;
    const percentageAccessor = `${cleanSubjectName}_percentage_${index}`;
    const mainAccessor = `hidden_${cleanSubjectName}_${index}`;
    
    const subjectTotal = footerTotals.subjectTotals[subjectName];
    
    return {
      key: `subject_${cleanSubjectName}_${index}`,
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
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: subjectTotal.totalCount.toString(),
          Cell: ({ row }) => {
            
            if (!row.original?.subjectAndAverageMarks) {
              return (
                <div
                  className="fw-semibold d-flex align-items-center justify-content-center"
                  // style={{ padding: "0.4rem 0.7rem" }}
                >
                  <span
                    className={`px-2 py-1 rounded d-flex align-items-center justify-content-center `}
                  >
                    "0"
                  </span>
                </div>
              );
            }
            
            const subjectData = row.original.subjectAndAverageMarks[subjectName];            
            return (
              <div
                className="fw-semibold d-flex align-items-center justify-content-center"
                // style={{ padding: "0.4rem 0.7rem" }}
              >
                <span
                  className={`px-2 py-1 rounded d-flex align-items-center justify-content-center  ${subjectData?.count ? "tw-bg-[#b6e8e1]" : ""}`}
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
              return '0%';
            }
            
            const subjectData = row.original.subjectAndAverageMarks[subjectName];
            return subjectData ? `${subjectData.percentage.toFixed(2)}%` : '0%';
          },
        },
      ],
    };
  });

  return [...fixedColumns, ...dynamicColumns, ...totalColumns];
}
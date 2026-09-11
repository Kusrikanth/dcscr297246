

export function generateColumns(subjects, branchWiseSubjectAndAvgMarks) {
  const calculateFooterTotals = () => {
    const totals = {
      totalStudents: 0,
      subjectTotals: {},
    };

    subjects?.forEach((subject) => {
      totals.subjectTotals[subject.name] = {
        totalPercentage: 0,
        branchCount: 0,
      };
    });

    branchWiseSubjectAndAvgMarks?.forEach((branch) => {
      totals.totalStudents += branch.studentsCount || 0;

      if (branch.subjectAndAverageMarks) {
        subjects?.forEach((subject) => {
          const subjectData = branch.subjectAndAverageMarks[subject.name];

          if (subjectData) {
            totals.subjectTotals[subject.name].branchCount += 1;
            totals.subjectTotals[subject.name].totalPercentage += subjectData;
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
      accessor: "branchName",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: "Grand Total",
    },
    {
      Header: "Strength",
      accessor: "studentsCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: footerTotals.totalStudents.toString(),
    },
  ];

  const dynamicColumns = subjects?.map((subject, idx) => {
    const subjectName = subject.name;
    const cleanSubjectName = subjectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const subjectAccessor = `${cleanSubjectName}_${idx}`;

    const subjectTotal = footerTotals.subjectTotals[subjectName];

    return {
      key: `subjectWiseAvg_${idx}`,
      Header: subjectName,
      accessor: subjectAccessor,
      columnClassName: "tw-text-center tw-px-2 tw-py-3",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      disableSortBy: true,
      Footer: `${subjectTotal.averagePercentage.toFixed(0)}`,
      Cell: ({ row }) => {
        if (!row.original?.subjectAndAverageMarks) {
         return ( <div className="!tw-font-semibold tw-flex tw-items-center tw-justify-center">
            <span
              className={`tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center`}
            >
              0
            </span>
          </div>)
        }

        const subjectData = row?.original?.subjectAndAverageMarks[subjectName];

        const { averagePercentage } = footerTotals.subjectTotals[subjectName];

        const isAboveAvg = subjectData >= averagePercentage;

        return (
          <div className="!tw-font-semibold tw-flex tw-items-center tw-justify-center">
            <span
              className={`tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center ${
                isAboveAvg ? "tw-bg-[#b6e8e1]" : "tw-bg-[#fbd1c8]"
              }`}
            >
              {subjectData ? subjectData.toFixed(0) : "0"}
            </span>
          </div>
        );
      },
    };
  });

  return [...fixedColumns, ...dynamicColumns];
}


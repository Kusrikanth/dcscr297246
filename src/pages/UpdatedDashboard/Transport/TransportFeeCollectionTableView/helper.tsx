const getStyledCell = (value: any) => {
  let cellColor: string;

  if (value >= 95) {
    cellColor = "#b6e8e1";
  } else if (value >= 90) {
    cellColor = "#fdeac9";
  } else {
    cellColor = "#fbd1c8";
  }

  return (
    <div className="fw-semibold" style={{ padding: "0.4rem 0.7rem" }}>
      <span
        className="tw-px-2 tw-py-1 tw-rounded"
        style={{ backgroundColor: `${cellColor}` }}
      >
        {`${value?.toFixed(2) || "0.00"}%`}
      </span>
    </div>
  );
};

const findStuents = (termWiseResp: any, keyName: string, termName: string) => {
  return (Array.isArray(termWiseResp) ? termWiseResp : []).reduce((acc: any, curr: any) => {
    const term1 = curr?.termWiseSummaries?.find((t: any) => t.termName === termName);
    return acc + (term1?.[keyName] || 0);
  }, 0);
}

export function generateColumns(getTransportFeeTermWiseResp: any) {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Footer: "Total",
    },
    {
      Header: "Total Vehicles",
      accessor: "totalVehicles",
      disableSortBy: true,
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (curr.totalVehicles || 0), 0)
      },
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

    },
    {
      Header: "Routes",
      accessor: "routes",
      disableSortBy: true,
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (curr.routes || 0), 0)
      },
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

    },
    {
      Header: "Students",
      accessor: "students",
      disableSortBy: true,
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (curr.students || 0), 0)
      },
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

    },
    {
      Header: "Employees",
      accessor: "employees",
      disableSortBy: true,
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (curr.employees || 0), 0)
      },
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

    },
    {
      Header: "Seating Capacity",
      accessor: "vehiclesCapacity",
      disableSortBy: true,
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (curr.vehiclesCapacity || 0), 0)
      },
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

    },
    {
      Header: "Occupancy (%)",
      accessor: "occupancy",
      disableSortBy: true,
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        const totalStudents = data?.reduce((sum: any, item: any) => sum + (item.students || 0), 0);
        const totalEmployees = data?.reduce((sum: any, item: any) => sum + (item.employees || 0), 0);
        const totalVehicleCapacity = data?.reduce((sum: any, item: any) => sum + (item.vehiclesCapacity || 0), 0);
        return getStyledCell(((totalStudents + totalEmployees) / (totalVehicleCapacity || 0)) * 100);
      },
      columnClassName: "tw-p-0 tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

      Cell: ({ value }: any) => getStyledCell(value),
    },
    {
      Header: "Term 1 Paid (%)",
      accessor: "term1Per",
      disableSortBy: true,
      Footer: () => {
        const totalTerm1StuPaid = findStuents(getTransportFeeTermWiseResp, "totalStudentsPaid", "Term-1");
        const totalTerm1Stu = findStuents(getTransportFeeTermWiseResp, "totalStudents", "Term-1");
        return getStyledCell((totalTerm1StuPaid / (totalTerm1Stu || 1)) * 100);
      },
      columnClassName: "tw-p-0 tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

      Cell: ({ value }: any) => getStyledCell(value),
    },
    {
      Header: "Term 2 Paid (%)",
      accessor: "term2Per",
      disableSortBy: true,
      Footer: () => {
        const totalTerm1StuPaid = findStuents(getTransportFeeTermWiseResp, "totalStudentsPaid", "Term-2");
        const totalTerm1Stu = findStuents(getTransportFeeTermWiseResp, "totalStudents", "Term-2");
        return getStyledCell((totalTerm1StuPaid / (totalTerm1Stu || 1)) * 100);
      },
      columnClassName: "tw-p-0 tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

      Cell: ({ value }: any) => getStyledCell(value),
    },
    {
      Header: "Term 3 Paid (%)",
      accessor: "term3Per",
      disableSortBy: true,
      Footer: () => {
        const totalTerm1StuPaid = findStuents(getTransportFeeTermWiseResp, "totalStudentsPaid", "Term-3");
        const totalTerm1Stu = findStuents(getTransportFeeTermWiseResp, "totalStudents", "Term-3");
        return getStyledCell((totalTerm1StuPaid / (totalTerm1Stu || 1)) * 100);
      },
      columnClassName: "tw-p-0 tw-text-center",
      footerClassName: "tw-text-center",            
      tdClass: "tw-text-center",

      Cell: ({ value }: any) => getStyledCell(value),
    },
  ];
}
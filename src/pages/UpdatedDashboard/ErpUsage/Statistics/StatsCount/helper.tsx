export const getColumns = (type: string) => {
  if (type === "Parent Logins" || type === "Staff Logins") {
    return [
      { Header: "Branch Name", accessor: "branchName", disableSortBy: true },
      { Header: "Today", accessor: "today", disableSortBy: true, columnClassName: "tw-text-center", tdClass: "tw-text-center" },
      { Header: "Week", accessor: "week", disableSortBy: true, columnClassName: "tw-text-center", tdClass: "tw-text-center" },
      { Header: "Month", accessor: "month", disableSortBy: true, columnClassName: "tw-text-center", tdClass: "tw-text-center" },
      { Header: "Total Logins", accessor: "total", disableSortBy: true, columnClassName: "tw-text-center", tdClass: "tw-text-center" },
    ];
  }
  if (type === "Not Login Info") {
    return [
      { Header: "Branch Name", accessor: "branchName", disableSortBy: true },
      { Header: "Parents", accessor: "parents", disableSortBy: true, columnClassName: "tw-text-center", tdClass: "tw-text-center" },
      { Header: "Staff", accessor: "staff", disableSortBy: true, columnClassName: "tw-text-center", tdClass: "tw-text-center" },
    ];
  }
  return [];
};

export const getTableData = (type: string, data: any[]) => {
  if (!Array.isArray(data)) return [];
  if (type === "Parent Logins" || type === "Staff Logins") {
    return data.map((item) => ({
      branchName: item.branchName,
      today: item.today,
      week: item.week,
      month: item.month,
      total: item.total,
    }));
  }
  if (type === "Not Login Info") {
    // Group by branchName, then extract counts for Parent and Staff
    const branchMap: Record<string, { parents: number, staff: number }> = {};
    data.forEach((item) => {
      const branch = item.branchName;
      if (!branchMap[branch]) {
        branchMap[branch] = { parents: 0, staff: 0 };
      }
      if (item.userType.toLowerCase() === "parents") {
        branchMap[branch].parents = item.count;
      }
      if (item.userType.toLowerCase() === "staff") {
        branchMap[branch].staff = item.count;
      }
    });
    return Object.entries(branchMap).map(([branchName, counts]) => ({
      branchName,
      parents: counts.parents,
      staff: counts.staff,
    }));
  }
  return [];
};



export function generateColumns() {
  return [
    {
      Header: "Department Name",
      accessor: "departmentName",
      disableSortBy: true,
      columnClassName: "",
      Footer: "Total",
    },
    {
      Header: "Open Tickets",
      accessor: "openTickets",
      disableSortBy: true,
      columnClassName: "text-center",
      footerClassName: "text-center",

      Footer: (rowsData: any) => {
        const { data } = rowsData || {};
        return data?.reduce((acc: any, curr: any) => acc + curr.openTickets, 0);
      }
    },
    {
      Header: "Closed Tickets",
      accessor: "closedTickets",
      disableSortBy: true,
      columnClassName: "text-center",
      footerClassName: "text-center",
      Footer: (rowsData: any) => {
        const { data } = rowsData || {};
        return data?.reduce((acc: any, curr: any) => acc + curr.closedTickets, 0);
      }
    },
    {
      Header: "Total Tickets",
      accessor: "totalTickets",
      disableSortBy: true,
      columnClassName: "text-center",
      footerClassName: "text-center",
      Footer: (rowsData: any) => {
        const { data } = rowsData || {};
        return data?.reduce((acc: any, curr: any) => acc + curr.totalTickets, 0);
      }
    }
  ];
}

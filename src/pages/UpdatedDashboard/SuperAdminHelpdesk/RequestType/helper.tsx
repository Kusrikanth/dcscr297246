  export const formatRequestType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  export function generateColumns() {
  return [
    {
      Header: "Modules Name",
      accessor: "moduleName",
      disableSortBy: true,
      columnClassName: "",
      Footer: "Total",
    },
    {
      Header: "Open Tickets",
      accessor: "openTicketsCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",

      Footer: (rowsData: any) => {
        const { data } = rowsData || {};
        return data?.reduce((acc: any, curr: any) => acc + curr.openTicketsCount, 0);
      }
    },
    {
      Header: "Closed Tickets",
      accessor: "closedTicketsCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data } = rowsData || {};
        return data?.reduce((acc: any, curr: any) => acc + curr.closedTicketsCount, 0);
      }
    },
    {
      Header: "Total Tickets",
      accessor: "totalTicketsCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data } = rowsData || {};
        return data?.reduce((acc: any, curr: any) => acc + curr.totalTicketsCount, 0);
      }
    }
  ];
}
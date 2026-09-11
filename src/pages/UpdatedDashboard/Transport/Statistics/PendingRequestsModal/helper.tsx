export function generateColumns() {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
      Footer: "Total",
    },
    {
      Header: "New Requests",
      accessor: "newRequests",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ value }: any) => value || 0,
      Footer: ({ data = [] }: any) => {
        return data?.reduce((acc: any, curr: any) => acc + (+curr.newRequests || 0), 0)
      },
    },
    {
      Header: "Change Requests",
      accessor: "changeRequests",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ value }: any) => value || 0,
      Footer: ({ data = [] }: any) => {
        return data?.reduce((acc: any, curr: any) => acc + (+curr.changeRequests || 0), 0)
      },
    },
    {
      Header: "Termination Requests",
      accessor: "terminationRequests",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ value }: any) => value || 0,
      Footer: ({ data = [] }: any) => {
        return data?.reduce((acc: any, curr: any) => acc + (+curr.terminationRequests || 0), 0)
      },
    },
    {
      Header: "Total Pending Request",
      accessor: "totalPendingRequest",
      disableSortBy: true,
      columnClassName: "tw-text-center tw-font-semibold",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ value }: any) => value || 0,
      Footer: ({ data = [] }: any) => {
        return data?.reduce((acc: any, curr: any) => acc + (+curr.totalPendingRequest || 0), 0)
      },
    },
  ];
}

export const getKeyName = (name: string) => {
  switch (name) {
    case 'NEW_REQUEST':
      return 'newRequests';
    case 'CHANGE_REQUEST':
      return 'changeRequests';
    case 'TERMINATION_REQUEST':
      return 'terminationRequests';
    default:
      return ""
  }
}


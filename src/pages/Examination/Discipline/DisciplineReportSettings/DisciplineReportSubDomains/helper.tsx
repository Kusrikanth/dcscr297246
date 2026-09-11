import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Domain",
      accessor: "domainName",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
     {
      Header: "Sub Domains",
      accessor: "subDomains",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { subDomains } = original || {};
        return (
          <div className="tw-w-full tw-flex tw-gap-x-2 tw-gap-y-1 tw-flex-col tw-items-start">
            {subDomains?.map((item) => (
              <div key={item?.subDomainsDetailId ? item?.subDomainsDetailId : "-"} className="badge text-muted tw-bg-[#4051891a]">
                {item?.subDomainName ? item?.subDomainName : "-"}
              </div>
            ))}
          </div>
        );
      },
    },

    {
      Header: "Created By",
      accessor: "createdByName",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}
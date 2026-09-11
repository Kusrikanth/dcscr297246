import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export default function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Campaign Name",
      accessor: "campaignName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.campaignName ? original.campaignName : "-"}</span>
        );
      },
    },
    {
      Header: "Template Name",
      accessor: "templateName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.templateName ? original.templateName : "-"}</span>
        );
      },
    },
    {
      Header: "Template Type",
      accessor: "templateType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.templateType ? original.templateType : "-"}</span>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList || []}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

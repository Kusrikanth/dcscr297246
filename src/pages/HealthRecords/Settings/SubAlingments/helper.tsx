import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Common Ailments",
      accessor: "alimentName",
      disableSortBy: true,
    },
    {
      Header: "Common Sub Ailments",
      // accessor: "subAliments",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const ailmentNames = original.subAlimentName.map((subAilment: { ailmentName: string }) => subAilment.ailmentName);
        return ailmentNames.join(", ");
      },
    },

    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}
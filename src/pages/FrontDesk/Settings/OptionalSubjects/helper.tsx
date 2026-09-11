import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Subject",
      accessor: "subject",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{original?.subject ? original?.subject : original?.subjectName}</span>;
      }
    },
    {
      Header: "Option Number",
      accessor: "optionNumber",
      disableSortBy: true,
    },
    {
      Header: "User Name",
      accessor: "userName",
      disableSortBy: true,
    },
    {
      Header: "User Date",
      accessor: "userDate",
      disableSortBy: true,
    },
    {
      Header: "Is Optional",
      accessor: "isOptional",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original?.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const yesNoRadioOptions = [
  {
    id: "YES",
    name: "Yes",
  },
  {
    id: "NO",
    name: "No",
  },
];

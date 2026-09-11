import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "User Type",
      accessor: "userTypeName",
      disableSortBy: true,
    },
    {
      Header: "Record Type",
      accessor: "recordType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const ailmentNames = Array.isArray(original.recordTypeDTOS)
          ? original.recordTypeDTOS.map((subUserRecordType: { recordType: string }) => subUserRecordType.recordType)
          : [];
    
        return ailmentNames.join(", ");
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.userTypeId} />
        );
      },
    },
  ];
}
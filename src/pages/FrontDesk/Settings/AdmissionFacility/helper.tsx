import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {

  return [
    {
      Header: "SNO",
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1;
      },
    },
    {
      Header: "Department Name",
      accessor: "departmentName",
      disableSortBy: true,
    },
    {
      Header: "Facility Name",
      accessor: "facilityName",
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original?.createdDate);
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        // const { id } = original;
        let actions: Array<any> = actionsList;
        // if (!id) {
        //   actions = actionsList.filter((item: any) => item.id !== 'delete');
        // }

        return (
          <MenuOptionHrtl actionOptions={actions} rowId={original.id} />
        );
      },
    },
  ];
}
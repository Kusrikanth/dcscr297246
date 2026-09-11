import { MenuOptionHrtl, UserDetails } from '../../../../../Components/Common';
import { IOptionsHrtl } from '../../../../../Components/Common/MenuOptions';

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'category',
      accessor: 'categoryName',
      disableSortBy: true,
    },
    {
      Header: 'Created By',
      accessor: 'createdByName',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: 'Updated By',
      accessor: 'updatedByName',
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: 'Actions',
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
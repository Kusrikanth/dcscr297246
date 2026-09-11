import { IOptionsHrtl } from '../../../../../Components/Common/MenuOptions';
import { getDateWithTimeFormat } from '../../../../../utility/dateutility';

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: 'Access',
      accessor: 'profileName',
      disableSortBy: true
    },
    {
      Header: 'Permissions',
      accessor: 'permissions',
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell: ({ row: { original } }: any) => {
        const permissions = original?.permissions || [];

        return permissions.length > 0 ? (
          <>
            {permissions.map((item: any) => (
              <span
                key={item.id}
                className="badge text-uppercase bg-light text-muted p-2 me-1 mb-2"
              >
                {item.permissionCode}
              </span>
            ))}
          </>
        ) : (
          <span className="ms-2">-</span>
        );
      },
    },
    {
      Header: 'Description',
      accessor: 'description',
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
    },
    {
      Header: "Date",
      accessor: "createdAt",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          getDateWithTimeFormat(original?.createdAt ? `${original?.createdAt}z` : '')
        );
      },
    },
    // {
    //   Header: 'Actions',
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <MenuOptionHrtl
    //         actionOptions={actionsList}
    //         rowId={original.id}
    //       ></MenuOptionHrtl>
    //     );
    //   },
    // },
  ];
}

export const permissionOptions = [
  { id: "VIEW", name: "View" },
  { id: "DOWNLOAD", name: "Download" },
  { id: "UPLOAD", name: "Upload" },
  { id: "EDIT", name: "Edit" },
  { id: "DELETE", name: "Delete" },
  { id: "RENAME", name: "Rename" },
  { id: "MOVE", name: "Move" },
  { id: "SHARE", name: "Share" },
  { id: "MANAGE_PERMISSIONS", name: "Manage Permissions" },
  { id: "RESTORE", name: "Restore" },
  { id: "VIEW_AUDIT", name: "View Audit" },
];
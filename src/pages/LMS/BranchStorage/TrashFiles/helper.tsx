import { MenuOptionHrtl, UserDetails } from '../../../../Components/Common';
import { IOptionsHrtl } from '../../../../Components/Common/MenuOptions';
import { getDateWithTimeFormat } from '../../../../utility/dateutility';
import { FileInfoCell } from '../AllFilesStorage/FileInfoCell';

export function generateColumns(actionsList: Array<IOptionsHrtl>) {

  return [
    {
      Header: "Name",
      accessor: "name",
      disableSortBy: true,
      columnClassName:
        "sticky-left !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_246_249/var(--tw-bg-opacity))]",
      tdClass: 'sticky-left !tw-z-10',
      Cell: ({ row: { original } }: any) => (
        <FileInfoCell
          file={original}
          showFolderPath
          folderPath={original?.path}
        />
      ),
    },
    {
      Header: "File Category",
      accessor: "categoryName",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: "Deleted By",
      accessor: "deletedBy",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: "Deleted Date",
      accessor: "deletedDate",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="">
          {value ? getDateWithTimeFormat(`${value}Z`) : "-"}
        </span>
      ),
    },
    {
      Header: "Deleted In",
      accessor: "deletedInDays",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (
          <span className="badge text-uppercase bg-light text-muted p-2 me-1 mb-2">
            {value != null ? `${value}` : "-"}
          </span>
        );
      },
    },
    {
      Header: "Size",
      accessor: "size",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      id: "menuActions",
      Header: "Actions",
      disableSortBy: true,
      tdClass: "!tw-w-[1%] !tw-pe-0",
      Cell: ({ row: { original } }: any) => (
        <MenuOptionHrtl
          actionOptions={actionsList}
          rowId={original.recycleBinEntryId}
          className="!tw-w-fit tw-gap-1"
        />
      ),
    },
  ];
};
import { MenuOptionHrtl, UserDetails } from '../../../../Components/Common';
import { IOptionsHrtl } from '../../../../Components/Common/MenuOptions';
import { getDateWithTimeFormat } from '../../../../utility/dateutility';
import { FileInfoCell } from '../AllFilesStorage/FileInfoCell';

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Name",
      accessor: "originalFileName",
      disableSortBy: true,
      columnClassName:
        "sticky-left !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_246_249/var(--tw-bg-opacity))]",
      tdClass: 'sticky-left !tw-z-10',
      Cell: ({ row: { original } }: any) => (
        <FileInfoCell
          file={original}
          showFolderPath
          folderPath={original?.folderPath}
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
      Header: "Created By",
      accessor: "createdByName",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: "Created At",
      accessor: "createdAt",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-whitespace-nowrap">
          {value ? getDateWithTimeFormat(`${value}Z`) : "-"}
        </span>
      ),
    },
    {
      Header: "Updated By",
      accessor: "updatedByName",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: "Updated At",
      accessor: "modifiedAgo",
      columnClassName: "tw-w-[120px] tw-min-w-[120px] tw-max-w-[120px]",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: "Size",
      accessor: "sizeFormatted",
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
      columnClassName: "tw-flex tw-justify-center tw-items-center",
      Cell: ({ row: { original } }: any) => (
        <div className="tw-flex tw-pl-3 tw-justify-center tw-items-center tw-w-full">
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
            className="!tw-w-fit tw-gap-1 tw-mr-3"
          />
        </div>
      ),
    },
  ];
};
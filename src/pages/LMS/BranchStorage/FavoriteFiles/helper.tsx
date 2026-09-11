import { MenuOptionHrtl, UserDetails } from '../../../../Components/Common';
import { IColumnActionOption } from '../AllFilesStorage/helper';
import { getDateWithTimeFormat } from '../../../../utility/dateutility';
import { FileInfoCell } from '../AllFilesStorage/FileInfoCell';

export function generateColumns(actionsList: Array<IColumnActionOption>, onFolderClick?: (row: any) => void) {
  return [
    {
      Header: "File",
      accessor: "originalFileName",
      disableSortBy: true,
      columnClassName:
        "sticky-left !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_246_249/var(--tw-bg-opacity))]",
      tdClass: 'sticky-left !tw-z-10',
      Cell: ({ row: { original } }: any) => (
        <div
          className={original.type === "folder" ? "tw-cursor-pointer" : ""}
          onClick={() => {
            if (original.type === "folder") {
              onFolderClick?.(original);
            }
          }}
        >
          <FileInfoCell file={original} showFolderPath folderPath={original?.folderPath} />
        </div>
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
      columnClassName: "tw-flex tw-justify-end tw-items-center",
      Cell: ({ row: { original } }: any) => {
        const menuActions = (
          original.type === "folder"
            ? actionsList.filter((action) => action.id !== "view")
            : actionsList
        ).map((action: any) => ({
          ...action,

          actionIcon:
            typeof action.actionIcon === "function"
              ? action.actionIcon(original)
              : action.actionIcon,

          actionName:
            typeof action.actionName === "function"
              ? action.actionName(original)
              : action.actionName,

          onClickHndlr: (event: any) => {
            action.onClickHndlr(event, original);
          },
        }));

        return (
          <div className="tw-flex tw-pl-3 tw-justify-end tw-items-center tw-w-full">
            <MenuOptionHrtl
              actionOptions={menuActions}
              rowId={`${original.type}-${original.id}`}
              className="!tw-w-fit tw-gap-1 tw-mr-3"
            />
          </div>
        );
      },
    }
  ];
};
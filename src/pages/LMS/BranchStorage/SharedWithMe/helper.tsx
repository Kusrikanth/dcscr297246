import { getDateWithTimeFormat } from '../../../../utility/dateutility';
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from '../../../../Components/Common/MenuOptions';
import { FileInfoCell } from '../AllFilesStorage/FileInfoCell';
import { IColumnActionOption } from '../AllFilesStorage/helper';

export function generateColumns(moreActionsList: Array<IColumnActionOption>, onFolderClick?: (row: any) => void) {
  return [
    {
      Header: "File",
      accessor: "originalFileName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <div
          onClick={() => {
            if (original.type === "folder") {
              onFolderClick?.(original);
            }
          }}
          className={original.type === "folder"
            ? "tw-cursor-pointer"
            : ""}
        >
          <FileInfoCell file={original} showFolderPath/>
        </div>
      ),
    },
    {
      Header: "Path",
      accessor: "folderPath",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: "From Branch",
      accessor: "fromBranchName",
      disableSortBy: true,
    },
    {
      Header: "Shared By Name",
      accessor: "grantedByName",
      disableSortBy: true,
    },
    {
      Header: "Shared At",
      accessor: "grantedAt",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="">
          {value ? getDateWithTimeFormat(`${value}Z`) : "-"}
        </span>
      ),
    },
    {
      Header: "Size",
      accessor: "sizeBytes",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{(value / 1024).toFixed(2)} KB</span>
      ),
    },
    {
      Header: "Actions",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        const permissions = original.permissions ?? {};
        const isFolder = original.type === "folder";
        const isFile = original.type === "file";

        const hasPermission = (actionId: string): boolean => {
          switch (actionId) {
            case "view":
              return isFile && Boolean(permissions.canView);

            case "download":
              return (
                isFile &&
                !original.isDownloadRestricted &&
                Boolean(permissions.canDownload)
              );

            case "re-upload-file":
              return isFile && Boolean(permissions.canUpload);

            case "rename":
              return Boolean(permissions.canRename);

            case "delete":
              return Boolean(permissions.canDelete);

            case "move":
              return Boolean(permissions.canMove);

            case "share":
              return Boolean(permissions.canShare);

            case "manage-access":
              return Boolean(permissions.canManagePermissions);

            case "copy":
              return Boolean(permissions.canCopy);

            case "edit":
              return Boolean(permissions.canEdit);

            case "favorite":
              return true;

            default:
              return true;
          }
        };

        const actionOptions = moreActionsList
          .filter((action) => hasPermission(action.id))
          .map((action: any) => ({
            ...action,
            actionIcon:
              typeof action.actionIcon === "function"
                ? action.actionIcon(original)
                : action.actionIcon,
            actionName:
              typeof action.actionName === "function"
                ? action.actionName(original)
                : action.actionName,
          }));

        if (!actionOptions.length) {
          return null;
        }

        return (
          <div className="tw-flex tw-justify-end tw-items-center tw-w-full">
            <MenuOptionHrtl
              actionOptions={actionOptions}
              rowId={`${original.type}-${original.id}`}
              className="!tw-w-fit tw-gap-1"
            />
          </div>
        );
      },
    },
  ];
}
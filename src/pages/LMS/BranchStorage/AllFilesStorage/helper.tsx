import { InputCheckbox, MenuOptionHrtl, SelectInput, StatusLabel, TextInput, TextInputWithRegex, UserDetails } from '../../../../Components/Common';
import { IOptionsHrtl, MoreActions } from '../../../../Components/Common/MenuOptions';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, PencilEdit01Icon } from '@hugeicons-pro/core-stroke-standard';
import { CancelCircleHalfDotIcon } from '@hugeicons-pro/core-stroke-standard';
import { CheckmarkCircle03Icon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../Components/Common/Button';
import { UserGroup02Icon } from '@hugeicons-pro/core-stroke-standard';
import { User03Icon } from '@hugeicons-pro/core-stroke-standard';
import { getDateWithTimeFormat } from '../../../../utility/dateutility';
import { FileInfoCell, getFileName, getResourceRowId } from './FileInfoCell';
import { default as CorrectIcon } from "../../../../assets/imagesdps/common_icon/correct_icon.svg?react";
import { default as WrongIcon } from "../../../../assets/imagesdps/common_icon/wrong_icon.svg?react";

type DynamicActionValue<T> = T | ((row: any) => T);

export interface IColumnActionOption
  extends Omit<IOptionsHrtl, "actionIcon" | "actionName"> {
  actionIcon: DynamicActionValue<React.ReactNode>;
  actionName: DynamicActionValue<React.ReactNode>;
}

const EditableFolderName = ({
  value,
  onChange,
  onSave,
  onCancel,
  folderId,
}: any) => {

  return (
    <div
      className="tw-flex tw-items-center tw-gap-2 tw-min-w-[300px]"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <TextInputWithRegex
        name={`rename-${folderId}`}
        allowedInputRegex={'^[^\\\\/:*?"<>|]*$'}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        formgroupClassName="!tw-mb-0 tw-flex-1"
        inputClassName="!tw-w-[200px] !tw-min-w-[200px]"
        maxLength={45}
        autoFocus
      />

      <Button
        variant="sidebarMenu"
        type="button"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onCancel();
        }}
        className="tw-border-0 tw-bg-transparent"
      >
        <HugeiconsIcon icon={CancelCircleHalfDotIcon} size={16} />
      </Button>

      <Button
        variant="sidebarMenu"
        type="button"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          onSave(value);
        }}
        className="tw-border-0 tw-bg-transparent"
      >
        <HugeiconsIcon icon={CheckmarkCircle03Icon} size={16} />
      </Button>
    </div>
  );
};

export function generateColumns(
  actionsList: Array<IColumnActionOption>,
  moreActionsList: Array<IOptionsHrtl>,
  onFolderOpen?: (folder: any) => void,
  editingFolderId?: string | null,
  setEditingFolderId?: (id: string | null) => void,
  saveResourceName?: (item: any, newName: string) => void,
  allStudentCheckHndlr?: any,
  singleStudentCheckHndlr?: any,
  allStudentSelectedState?: any,
  selectedFolderIds?: any,
  editingResourceName?: string,
  setEditingResourceName?: (value: string) => void,
  onManageAccess?: (row: any) => void,
  tableData: any[] = []
) {
  const hasFiles = tableData.some(
    (item: any) => item.type === "file"
  );
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        );
      },
      accessor: "isStudentChecked",
      disableSortBy: true,
      columnClassName:
        "tw-w-5 !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_246_249/var(--tw-bg-opacity))]",
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected, type } = original;

        return (
          <InputCheckbox
            name={`${type}-${id}`}
            value={
              type === "folder"
                ? selectedFolderIds?.includes(Number(original.folderId))
                : !!isSelected
            }
            onChange={singleStudentCheckHndlr}
            dataId={type === "folder" ? original.folderId : id}
            formgroupClassName="tw-mb-0"
          />
        );
      }
    },
    {
      Header: 'Name',
      accessor: 'fileName',
      disableSortBy: true,
      columnClassName:
        "sticky-left !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_246_249/var(--tw-bg-opacity))]",
      tdClass: 'sticky-left !tw-z-10',
      Cell: ({ row: { original } }: any) => {
        const rowId = getResourceRowId(original);
        const fileName = getFileName(original);
        const isEditing = editingFolderId === rowId;

        return (
          <div
            onClick={() => {
              if (original.type === "folder" && !isEditing) {
                onFolderOpen?.(original);
              }
            }}
            className={
              original.type === "folder" && !isEditing
                ? "tw-cursor-pointer"
                : ""
            }
          >
            <FileInfoCell
              file={original}
              nameContent={
                isEditing ? (
                  <EditableFolderName
                    folderId={rowId}
                    value={editingResourceName || ""}
                    onChange={(value: string) => {
                      setEditingResourceName?.(value);
                    }}
                    onCancel={() => {
                      setEditingFolderId?.(null);
                      setEditingResourceName?.("");
                    }}
                    onSave={(newName: string) => {
                      saveResourceName?.(original, newName);
                    }}
                  />
                ) : undefined
              }
              actionContent={
                !isEditing ? (
                  <Button
                    variant="sidebarMenu"
                    type="button"
                    onClick={(
                      event: React.MouseEvent<HTMLButtonElement>
                    ) => {
                      event.stopPropagation();

                      setEditingResourceName?.(fileName);
                      setEditingFolderId?.(rowId);
                    }}
                    className="folder-edit-btn tw-border-0 tw-bg-transparent"
                  >
                    <HugeiconsIcon
                      icon={PencilEdit01Icon}
                      size={16}
                    />
                  </Button>
                ) : undefined
              }
            />
          </div>
        );
      },
    },
    {
      Header: "Owner",
      accessor: "owner",
      disableSortBy: true,
    },
    ...(hasFiles
      ? [
        {
          Header: "File Category",
          accessor: "categoryName",
          disableSortBy: true,
          columnClassName:
            "tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
          Cell: ({ value }: any) => (
            <span>{value || "-"}</span>
          ),
        },
      ]
      : []),
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
      Header: "Modified By",
      accessor: "updatedByName",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    // {
    //   Header: "Updated At",
    //   accessor: "updatedAt",
    //   disableSortBy: true,
    //   Cell: ({ value }: any) => (
    //     <span className="tw-whitespace-nowrap">
    //       {value ? getDateWithTimeFormat(`${value}Z`) : "-"}
    //     </span>
    //   ),
    // },
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
      columnClassName: "tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
    },
    {
      Header: "Access",
      accessor: "isShared",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const isShared = original.isShared;

        return (
          <Button
            type="button"
            variant='sidebarMenu'
            onClick={() => onManageAccess?.(original)}
            className={`!tw-inline-flex !tw-items-center !tw-gap-1 !tw-px-2 !tw-py-1 !tw-rounded !tw-text-xs !tw-font-medium ${isShared
              ? "!tw-bg-green-100 !tw-text-green-700"
              : "!tw-bg-[rgba(93,161,200,0.1)] !tw-text-[#5DA1C8]"
              }`}
          >
            <HugeiconsIcon
              icon={isShared ? UserGroup02Icon : User03Icon}
              size={14}
            />
            <span>{isShared ? "Shared" : "Private"}</span>
          </Button>
        );
      }
    },
    {
      id: "menuActions",
      Header: "Actions",
      disableSortBy: true,

      columnClassName:
        "sticky-right [--tw-bg-opacity:1] !tw-bg-[#f3f6f9] !tw-text-center",

      tdClass:
        "sticky-right !tw-right-0 !tw-w-[150px] !tw-min-w-[150px] !tw-max-w-[150px] !tw-pe-0 !tw-overflow-visible !tw-z-[1] has-[.dropdown.show]:!tw-z-[9999]",

      Cell: ({ row: { original } }: any) => {
        const isFolder = original.type === "folder";

        const rowActions: IOptionsHrtl[] = actionsList
          .filter((action) => {
            if (isFolder && ["view", "view-audits"].includes(action.id)) {
              return false;
            }

            return true;
          })
          .map((action): IOptionsHrtl => ({
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

        let filteredActions = moreActionsList;

        const folderRestrictedActions = [
          "details",
          "download",
          "preview",
        ];

        if (isFolder) {
          filteredActions = filteredActions.filter(
            (item: any) => !folderRestrictedActions.includes(item.id)
          );
        }

        return (
          <div className="tw-flex tw-items-center tw-justify-end tw-gap-2 tw-w-full tw-h-full !tw-px-2 tw-overflow-visible">
            <div className="tw-flex tw-items-center tw-justify-center tw-h-8">
              <MenuOptionHrtl
                actionOptions={rowActions}
                rowId={
                  isFolder
                    ? `folder-${original.folderId}`
                    : `file-${original.id}`
                }
                className="!tw-w-fit !tw-gap-1 !tw-m-0"
              />
            </div>

            {filteredActions.length > 0 && (
              <div className="tw-relative tw-flex tw-items-center tw-justify-start tw-h-8 !tw-mt-1 tw-overflow-visible">
                <MoreActions
                  actionOptions={filteredActions}
                  rowId={isFolder ? original.folderId : original.id}
                  isHorizontal={true}
                />
              </div>
            )}
          </div>
        );
      },
    }
  ];
}

export const sortByOptions = [
  {
    id: "NAME",
    name: "Name",
  },
  {
    id: "SIZE",
    name: "Size",
  },
  {
    id: "CREATED_DATE",
    name: "Created Date",
  },
  {
    id: "MODIFIED_DATE",
    name: "Modified Date",
  },
];

export const sortOrderOptions = [
  {
    id: "ASC",
    name: "Ascending",
  },
  {
    id: "DESC",
    name: "Descending",
  },
];

export const resourceTypeOptions = [
  {
    id: "FOLDER",
    name: "Folder",
  },
  {
    id: "FILE",
    name: "File",
  },
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function findFolderPathById(
  nodes: any[],
  id: string,
  parentPath = ""
): string {
  for (const node of nodes) {
    const currentPath = parentPath
      ? `${parentPath} / ${node.label}`
      : node.label;

    if (node.id === id) {
      return currentPath;
    }
    if (node.children?.length) {
      const foundPath = findFolderPathById(node.children, id, currentPath);
      if (foundPath) return foundPath;
    }
  }
  return "";
}

export function findFolderIdByPath(
  nodes: any[],
  targetPath: string,
  parentPath = ""
): string {
  for (const node of nodes) {
    const currentPath = parentPath
      ? `${parentPath} / ${node.label}`
      : node.label;

    if (currentPath === targetPath) {
      return node.id;
    }

    if (node.children?.length) {
      const foundId = findFolderIdByPath(
        node.children,
        targetPath,
        currentPath
      );

      if (foundId) return foundId;
    }
  }

  return "";
}

export const principalOptions = [
  { id: "GROUP", name: "Group" },
  { id: "USER", name: "User" },
  // { id: "ROLE", name: "Role" },
  // { id: "BRANCH", name: "Branch" },
  // { id: "INSTITUTE", name: "Institute" },
];

const PermissionAccessField = ({ index, original, permissionOptions, onChangePermission }: any) => {
  return (
    <div style={{ minWidth: "10rem" }}>
      <SelectInput
        name={`selectedEmployees[${index}].permissionCode`}
        inputClassName=""
        menuItems={permissionOptions || []}
        onChange={onChangePermission}
        value={original?.permissionCode}
        valueKey="permissionCode"
        textKey="permissionCode"
        isDisabled={false}
        error={
          original?.touched?.permissionCode && original?.errors?.permissionCode
            ? original?.errors?.permissionCode
            : ""
        }
        invalid={
          original?.touched?.permissionCode && original?.errors?.permissionCode
            ? true
            : false
        }
      />
    </div>
  );
};

export function generateManageAccessColumns({ permissionOptions, onChangePermission }: any) {
  return [
    {
      Header: "Employee Name",
      accessor: "employeeName",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            defaultImgType="employee"
            size="xs"
            displayName={original?.employeeName}
            displayId={original?.employeeCode}
          />
        );
      },
    },
    {
      Header: "Permission",
      accessor: "permissionCode",
      disableSortBy: true,
      Cell: ({ row: { index, original } }: any) => {
        return (
          <PermissionAccessField
            index={index}
            original={original}
            permissionOptions={permissionOptions}
            onChangePermission={onChangePermission}
          />
        );
      },
    },
  ];
}

export function generateViewFileAuditColumns(onGroupClick?: (group: Record<string, unknown>) => void) {
  return [
    {
      Header: "User/Group",
      accessor: "principalName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const isUser = original.principalType === "USER";

        return (
          <div className="tw-flex tw-items-center tw-gap-2">
            {isUser ? (
              <>
                <HugeiconsIcon
                  icon={User03Icon}
                  size={18}
                  className="tw-text-gray-500"
                />
                <UserDetails
                  defaultImgType="user"
                  size="xs"
                  displayName={original.principalName}
                  displayId={original.principalCode}
                />
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={UserGroup02Icon}
                  size={18}
                  className="tw-text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => onGroupClick?.(original)}
                  className="tw-border-0 tw-bg-transparent tw-p-0 tw-font-medium tw-text-primary tw-underline"
                >
                  {original.groupName}
                </button>
              </>
            )}
          </div>
        );
      },
    },

    {
      Header: "Viewed",
      accessor: "isViewed",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const isViewed = value === true ? <CorrectIcon style={{ width: "15px" }} /> : <WrongIcon style={{ width: "13px" }} />;
        return (
          <span>{isViewed}</span>
        );
      },
    },

    {
      Header: "Last Viewed At",
      accessor: "lastViewedAt",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-whitespace-nowrap">
          {value ? getDateWithTimeFormat(`${value}Z`) : "-"}
        </span>
      ),
    },
    {
      Header: "Downloaded",
      accessor: "isDownloaded",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const isDownloaded = value === true ? <CorrectIcon style={{ width: "15px" }} /> : <WrongIcon style={{ width: "13px" }} />;
        return (
          <span>{isDownloaded}</span>
        );
      },
    },
    {
      Header: "Last Downloaded At",
      accessor: "lastDownloadedAt",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="tw-whitespace-nowrap">
          {value ? getDateWithTimeFormat(`${value}Z`) : "-"}
        </span>
      ),
    },
  ];
}

export function renderValueEmployee(selectedItems: any, removeItemHandler: any) {
  if (!Array.isArray(selectedItems)) return null;

  return (
    <div className="selected-container">
      {selectedItems.map((item: any) => {
        return (
          <div key={`item-${item?.userId}`} className="selectedoption-item">
            <span>{item?.employeeName}</span>

            <span
              data-id={item?.userId}
              onClick={removeItemHandler}
              className="remove-icon"
            >
              <i className="ri-close-line"></i>
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function renderOptionsEmployee(item: any) {
  return (
    <div>
      <div>{`${item?.employeeName}`}</div>
      <div className="tw-text-gray-500 tw-text-[13px]">{`${item?.employeeCode} | ${item?.departmentName} | ${item?.branchName}`}</div>
    </div>
  );
}

export function generateColumnsManageAccess({
  removePermissionHandler,
  editPermissionHandler,
  permissionChangeHandler,
  editingPermissionRowKey,
  permissionOptions,
}: any) {
  return [
    {
      Header: "Institute",
      accessor: "toInstituteName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row, value }: any) => {
        return row.original.isForCurrentBranch ? "-" : value || "-";
      },
    },
    {
      Header: "Branch",
      accessor: "toBranchName",
      disableSortBy: true,
      Cell: ({ row, value }: any) => {
        return row.original.isForCurrentBranch ? "-" : value || "-";
      },
    },
    {
      Header: "Access Type",
      accessor: "principalType",
      disableSortBy: true,
    },
    {
      Header: "User/Group",
      accessor: "principalName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const isUser = original.principalType === "USER";

        return (
          <div className="tw-flex tw-items-center tw-gap-2">
            {isUser ? (
              <>
                <HugeiconsIcon
                  icon={User03Icon}
                  size={18}
                  className="tw-text-gray-500"
                />
                <UserDetails
                  defaultImgType="user"
                  size="xs"
                  displayName={original.principalName}
                  displayId={original.principalCode}
                />
              </>
            ) : (
              <>
                <HugeiconsIcon
                  icon={UserGroup02Icon}
                  size={18}
                  className="tw-text-gray-500"
                />
                <span className="tw-font-medium">
                  {original.principalName}
                </span>
              </>
            )}
          </div>
        );
      },
    },
    {
      Header: "Permission",
      accessor: "permission",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const isExistingRecord = Boolean(original.id);
        const isEditing =
          editingPermissionRowKey === original.rowKey;

        if (isEditing) {
          return (
            <div
              className="tw-min-w-[180px]"
              onClick={(event) => event.stopPropagation()}
            >
              <SelectInput
                name={`permission-${original.rowKey}`}
                value={String(original.permissionProfileId || "")}
                onChange={(event: any) =>
                  permissionChangeHandler(
                    original.rowKey,
                    event.target.value
                  )
                }
                menuItems={permissionOptions || []}
                valueKey="id"
                textKey="profileName"
                formgroupClassName="!tw-mb-0"
              />
            </div>
          );
        }

        return (
          <div className="tw-flex tw-items-center tw-gap-2">
            <span>{original.permission || "-"}</span>

            {isExistingRecord && (
              <Button
                variant="sidebarMenu"
                type="button"
                onClick={(
                  event: React.MouseEvent<HTMLButtonElement>
                ) => {
                  event.stopPropagation();
                  editPermissionHandler(original.rowKey);
                }}
                className="folder-edit-btn tw-border-0 tw-bg-transparent"
              >
                <HugeiconsIcon
                  icon={PencilEdit01Icon}
                  size={16}
                />
              </Button>
            )}
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "action",
      disableSortBy: true,
      Cell: ({ row }: any) => (
        <Button
          variant="wrong"
          type="button"
          onClick={() => removePermissionHandler(row.original.rowKey)}
          className="!tw-p-2 tw-rounded-full"
        >
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="tw-text-red-500"
            size={18}
          />
        </Button>
      )
    },
  ];
}

export function renderOptionsCategory(item: any) {
    return `${item?.categoryName}`;
  }

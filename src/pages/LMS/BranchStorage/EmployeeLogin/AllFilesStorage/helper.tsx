import { InputCheckbox, MenuOptionHrtl, SelectInput, StatusLabel, TextInput, TextInputWithRegex, UserDetails } from '../../../../../Components/Common';
import { IOptionsHrtl, MoreActions } from '../../../../../Components/Common/MenuOptions';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit01Icon, User03Icon, UserGroup02Icon } from '@hugeicons-pro/core-stroke-standard';
import { useState } from 'react';
import { CancelCircleHalfDotIcon } from '@hugeicons-pro/core-stroke-standard';
import { CheckmarkCircle03Icon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../../Components/Common/Button';
import { FileInfoCell, getResourceRowId } from '../../AllFilesStorage/FileInfoCell';
import { getDateWithTimeFormat } from '../../../../../utility/dateutility';

type DynamicActionValue<T> = T | ((row: any) => T);

export interface IColumnActionOption
  extends Omit<IOptionsHrtl, "actionIcon" | "actionName"> {
  actionIcon: DynamicActionValue<React.ReactNode>;
  actionName: DynamicActionValue<React.ReactNode>;
}

const EditableFolderName = ({
  initialValue,
  onSave,
  onCancel,
  folderId,
}: any) => {
  const [draftName, setDraftName] = useState(initialValue || "");

  return (
    <div className="tw-flex tw-items-center tw-gap-2">
      <TextInputWithRegex
        key={`rename-${folderId}`}
        allowedInputRegex={'^[^\\\\/:*?"<>|]*$'}
        name={`rename-${folderId}`}
        value={draftName}
        onChange={(e: any) => setDraftName(e.target.value)}
        formgroupClassName="mb-0"
      />

      <Button
        variant="sidebarMenu"
        type="button"
        onClick={onCancel}
        className="tw-border-0 tw-bg-transparent"
      >
        <HugeiconsIcon icon={CancelCircleHalfDotIcon} size={16} />
      </Button>

      <Button
        variant="sidebarMenu"
        type="button"
        onClick={() => onSave(draftName)}
      >
        <HugeiconsIcon icon={CheckmarkCircle03Icon} size={16} />
      </Button>
    </div>
  );
};

export function generateColumns(actionsList: Array<IColumnActionOption>, moreActionsList: Array<IOptionsHrtl>, onFolderOpen?: (folder: any) => void, editingFolderId?: string | null, setEditingFolderId?: (id: string | null) => void,
  saveResourceName?: (item: any, newName: string) => void, allStudentCheckHndlr?: any, singleStudentCheckHndlr?: any, allStudentSelectedState?: any, selectedFolderIds?: any, totalSelectedCount?: number, onManageAccess?: (row: any) => void,
  showSelectionCheckbox: boolean = true,branchListView: boolean = false) {
  const columns = [
    {
      Header: () => {
        if (!showSelectionCheckbox) {
          return null;
        }
        return (
          <InputCheckbox
            name="all-student"
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        );
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected, type } = original;

        if (type === "branch") {
          return null;
        }

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
      },
    },
    {
      Header: "Name",
      accessor: "fileName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const rowId = getResourceRowId(original);
        const isEditing = editingFolderId === rowId;

        const isFolder =
          original.type === "folder" ||
          original.type === "branch";

        return (
          <div
            onClick={(event) => {
              if (isFolder && !isEditing) {
                event.stopPropagation();
                onFolderOpen?.(original);
              }
            }}
            className={
              isFolder && !isEditing
                ? "tw-cursor-pointer"
                : ""
            }
          >
            <FileInfoCell
              file={
                original.type === "branch"
                  ? { ...original, type: "folder" }
                  : original
              }
              showFolderPath={original.type !== "branch"}
              folderPath={original.type !== "branch" ? original.path : ""}
              nameContent={
                isEditing ? (
                  <EditableFolderName
                    folderId={rowId}
                    initialValue={original.fileName || ""}
                    onCancel={() => {
                      setEditingFolderId?.(null);
                    }}
                    onSave={(newName: string) => {
                      saveResourceName?.(original, newName);
                    }}
                  />
                ) : undefined
              }
              actionContent={
                !isEditing && original.permissions?.canRename ? (
                  <Button
                    variant="sidebarMenu"
                    type="button"
                    onClick={(
                      event: React.MouseEvent<HTMLButtonElement>
                    ) => {
                      event.stopPropagation();
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
    {
      Header: "Modified At",
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
      Header: "Category",
      accessor: "categoryName",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span>{value || "-"}</span>
      ),
    },
    {
      Header: "Access",
      accessor: "isShared",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const isShared =
          original.isShared === true ||
          original.isShared === "true";

        return (
          <Button
            type="button"
            variant="sidebarMenu"
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
      },
    },
    {
      id: "menuActions",
      Header: "Actions",
      disableSortBy: true,
      columnClassName: "sticky-right [--tw-bg-opacity:1] !tw-bg-[#f3f6f9] !tw-text-center",

      tdClass: "sticky-right !tw-right-0 !tw-w-[150px] !tw-min-w-[150px] !tw-max-w-[150px] !tw-pe-0 !tw-overflow-visible !tw-z-[1] has-[.dropdown.show]:!tw-z-[9999]",
      Cell: ({ row: { original } }: any) => {
        const isFolder = original.type === "folder";
        const permissions = original.permissions || {};

        const rowActions = actionsList
          .filter((action) => {
            switch (action.id) {
              case "view":
                return !isFolder && permissions.canView;

              case "view-audits":
                return !isFolder && permissions.canUpload;

              case "share":
                return permissions.canShare;

              default:
                return true;
            }
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
        if (totalSelectedCount && totalSelectedCount > 1) {
          filteredActions = filteredActions.filter(
            (item: any) =>
              ![
                "download",
                "delete",
                "manageAccess",
                "revoke-manage-access",
              ].includes(item.id)
          );
        }
        if (isFolder) {
          filteredActions = filteredActions.filter(
            (item: any) => !["details", "download", "preview"].includes(item.id)
          );
        }
        filteredActions = filteredActions.filter((action: any) => {
          switch (action.id) {
            case "download":
              return !isFolder && permissions.canDownload;

            case "manageAccess":
            case "revoke-manage-access":
              return (
                permissions.canManagePermissions ||
                permissions.canShare
              );

            case "delete":
              return permissions.canDelete;

            case "details":
              return permissions.canView;

            case "archive":
              return false;

            case "share":
            case "getSharableLink":
              return permissions.canShare;

            case "re-upload-file":
              return !isFolder && permissions.canEdit;

            default:
              return true;
          }
        });

        return (
          <div className="tw-relative tw-flex tw-items-center tw-justify-end tw-gap-2 tw-w-full tw-h-full !tw-px-2 tw-overflow-visible tw-z-[1] has-[.dropdown.show]:!tw-z-[9999]">
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
    },
  ];
  if (branchListView) {
    return columns.filter(
      (column: any) => column.accessor === "fileName"
    );
  }

  return columns;
}
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
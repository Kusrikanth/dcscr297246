import { useMemo } from "react";
import Button from "../../../../Components/Common/Button";
import { Folder02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

const cloneTree = (tree: any[]) =>
  JSON.parse(JSON.stringify(tree || []));

const findFolder = (
  nodes: any[],
  folderId: string
): any => {
  for (const node of nodes) {
    if (String(node.id) === String(folderId)) {
      return node;
    }

    if (node.children?.length) {
      const found = findFolder(
        node.children,
        folderId
      );

      if (found) {
        return found;
      }
    }
  }

  return null;
};

const FolderTreeView = ({
  folderTree = [],
  files = [],
  showFiles = false,
  activeFolderId,
  activeFileId,
  setActiveFolderId,
  expandedFolders,
  setExpandedFolders,
  onFolderExpand,
  onFileClick,
}: any) => {
  const treeData = useMemo(() => {
    const clonedTree = cloneTree(folderTree);

    if (!showFiles) return clonedTree;

    files.forEach((file: any) => {
      if (file.type === "folder") return;

      const parentFolder = findFolder(
        clonedTree,
        file.folderId || "all"
      );

      if (!parentFolder) return;

      parentFolder.files = parentFolder.files || [];

      parentFolder.files.push({
        id: `file-${file.id}`,
        label: file.fileName,
        type: "file",
        fileData: file,
      });
    });

    return clonedTree;
  }, [folderTree, files, showFiles]);

  const renderNode = (node: any) => {
    const children = node.children || [];

    const hasChildren =
      children.length > 0 ||
      node.isRoot ||
      node.canExpand;

    const isExpanded = !!expandedFolders[node.id];
    const isActive = activeFolderId === node.id;

    const handleFolderClick = () => {
      const nextExpanded = !isExpanded;
      setActiveFolderId(node.id);
      setExpandedFolders((prev: any) => ({
        ...prev,
        [node.id]: nextExpanded,
      }));
      if (
        nextExpanded &&
        node.id !== "all" &&
        node.canExpand
      ) {
        onFolderExpand?.(node);
      }
    };

    return (
      <div key={node.id}>
        <Button
          variant="sidebarMenu"
          type="button"
          onClick={handleFolderClick}
          className={`
            !tw-w-full
            !tw-flex
            !tw-items-center
            !tw-justify-start
            !tw-gap-1.5
            !tw-px-2
            !tw-py-1
            !tw-rounded-md
            !tw-text-[14px]
            !tw-shadow-none
            ${isActive
              ? "!tw-font-semibold !tw-text-slate-900"
              : "!tw-font-normal !tw-text-slate-700 hover:!tw-bg-slate-50"
            }
          `}
        >
          {hasChildren ? (
            <i
              className={
                isExpanded
                  ? "ri-arrow-down-s-line"
                  : "ri-arrow-right-s-line"
              }
            />
          ) : (
            <span className="tw-w-2" />
          )}

          <HugeiconsIcon
            icon={Folder02Icon}
            size={17}
            className="tw-text-amber-600"
          />

          <span className="tw-truncate tw-text-[14px]">
            {node.label}
          </span>
        </Button>

        {isExpanded && (
          <div className="tw-ml-2 tw-border-l tw-border-gray-200 tw-pl-2 tw-space-y-0.5">
            {children.map((child: any) =>
              renderNode(child)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tw-space-y-1 tw-overflow-y-auto tw-pr-1">
      {treeData.map((node: any) =>
        renderNode(node)
      )}
    </div>
  );
};

export default FolderTreeView;
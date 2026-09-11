import { useMemo } from "react";
import Button from "../../../../../Components/Common/Button";

const cloneTree = (tree: any[]) => JSON.parse(JSON.stringify(tree || []));
const findFolder = (nodes: any[], folderId: string): any => {
  for (const node of nodes) {
    if (node.id === folderId) return node;
    if (node.children?.length) {
      const found = findFolder(node.children, folderId);
      if (found) return found;
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
      const parentFolder = findFolder(clonedTree, file.folderId || "all");
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
    const visibleFolderChildren = node.children || [];
    const hasVisibleFolderChildren =
      visibleFolderChildren.length > 0 || node.isRoot || node.canExpand;

    const isExpanded = !!expandedFolders[node.id];
    const isActive = activeFolderId === node.id;

    const handleFolderClick = (node: any) => {
      const nextExpanded = !expandedFolders[node.id];

      setExpandedFolders((prev: any) => ({
        ...prev,
        [node.id]: nextExpanded,
      }));

      if (!nextExpanded) {
        return;
      }

      setActiveFolderId(node.id);

      if (node.id !== "all" && node.canExpand) {
        onFolderExpand?.(node.id);
      }
    };

    return (
      <div key={node.id}>
        <Button
          variant="sidebarMenu"
          type="button"
          onClick={() => handleFolderClick(node)}
          className={`!tw-w-full !tw-flex !tw-items-center !tw-justify-start !tw-gap-1.5 !tw-px-2 !tw-py-1 !tw-rounded-md !tw-text-[14px] !tw-shadow-none
          ${isActive
              ? "!tw-font-semibold !tw-text-slate-900"
              : "!tw-font-normal !tw-text-slate-700 hover:!tw-bg-slate-50"
            }`}
        >
          {hasVisibleFolderChildren ? (
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

          <i className="ri-folder-line tw-text-orange-500" />

          <span
            className={`tw-truncate tw-text-[14px] ${isActive ? "tw-font-semibold" : "tw-font-normal"
              }`}
          >
            {node.label}
          </span>
        </Button>

        {isExpanded && (
          <div className="tw-ml-2 tw-border-l tw-border-gray-200 tw-pl-2 tw-space-y-0.5">
            {visibleFolderChildren.map((child: any) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="tw-space-y-1 tw-overflow-y-auto tw-pr-1">
      {treeData.map((node: any) => renderNode(node))}
    </div>
  );
};

export default FolderTreeView;
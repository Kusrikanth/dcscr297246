import React, { ReactNode } from 'react';
import { FolderOpenIcon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import { FileTypeIcon, normalizeFileExtension } from './FilceIconType';

export type FileInfo = {
  id?: number | string;
  folderId?: number | string;
  originalFileName?: string;
  logicalName?: string;
  fileName?: string;
  name?: string;
  extension?: string;
  folderPath?: string;
  resourceType?: string;
  type?: string;
  isFolder?: boolean;
  permissions?: {
    canRename?: boolean;
  };
};

type FileInfoCellProps = {
  file?: FileInfo;
  showFolderPath?: boolean;
  nameContent?: ReactNode;
  actionContent?: ReactNode;
  className?: string;
  iconSize?: number;
  folderPath?: string;
};

export const getFileName = (file?: FileInfo): string => {
  return (
    file?.originalFileName ||
    file?.logicalName ||
    file?.fileName ||
    file?.name ||
    'Untitled file'
  );
};

export const checkIsFolder = (file?: FileInfo, normalizedExtension?: string): boolean => {
  return (
    normalizedExtension === 'folder' ||
    file?.resourceType?.toUpperCase() === 'FOLDER' ||
    file?.type?.toUpperCase() === 'FOLDER' ||
    file?.isFolder === true
  );
};

export const getResourceRowId = (file?: FileInfo): string => {
  const fileName = getFileName(file);

  const extension = normalizeFileExtension(
    file?.extension || file?.type,
    fileName
  );

  const isFolder = checkIsFolder(file, extension);

  return isFolder
    ? `folder-${file?.folderId ?? file?.id}`
    : `file-${file?.id}`;
};

export function FileInfoCell({ file, showFolderPath = false, nameContent, actionContent, className = '', iconSize = 19, folderPath }: FileInfoCellProps) {
  const original = file ?? {};
  const fileName = getFileName(original);
  const extension = normalizeFileExtension(
    original.extension || original.type,
    fileName
  );
  const isFolder = checkIsFolder(original, extension);
  const removeFileExtension = (
    fileName: string,
    isFolder = false,
  ): string => {
    if (isFolder) {
      return fileName;
    }

    const lastDotIndex = fileName.lastIndexOf('.');

    // Keep names without extension and hidden files such as ".gitignore"
    if (lastDotIndex <= 0) {
      return fileName;
    }

    return fileName.substring(0, lastDotIndex);
  };
  const displayFileName = removeFileExtension(fileName, isFolder);

  return (
    <div
      className={`group tw-flex tw-w-full tw-min-w-0 tw-gap-3 tw-py-1.5 ${className}`}
    >
      <FileTypeIcon
        extension={extension}
        fileName={fileName}
        isFolder={isFolder}
        size={iconSize}
      />
      <div className="tw-flex tw-min-w-0 tw-flex-1 tw-flex-col tw-gap-1">
        <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-2">
          {nameContent ?? (
            <span
              className="tw-truncate tw-text-sm tw-font-semibold tw-text-slate-800 tw-transition-colors group-hover:tw-text-blue-600"
              title={fileName}
            >
              {displayFileName}
            </span>
          )}
          {/* {isFolder && !nameContent && (
            <span className="tw-shrink-0 tw-rounded-md tw-bg-amber-50 tw-px-2 tw-py-0.5 tw-text-[10px] tw-font-semibold tw-uppercase tw-tracking-wide tw-text-amber-700">
              Folder
            </span>
          )} */}
          {actionContent}
        </div>
        {showFolderPath && (
          <div
            className="tw-flex tw-min-w-0 tw-items-center tw-gap-1.5 tw-text-xs tw-text-slate-400"
            title={folderPath || 'No folder'}
          >
            <HugeiconsIcon
              icon={FolderOpenIcon}
              size={14}
              strokeWidth={1.7}
              color="currentColor"
              className="tw-shrink-0 tw-text-slate-400"
            />

            <span className="tw-truncate">
              {folderPath || 'No folder'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
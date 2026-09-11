export interface IFolderNode {
  id: string;
  label: string;
  parentFolderId?: number | null;
  folderPath?: string;
  folderLevel?: number;
  rootType?: string;
  accessScope?: string;
  isSystemFolder?: boolean;
  isHidden?: boolean;
  isFavorite?: boolean;
  isShared?: boolean;
  createdByName?: string | null;
  modifiedDate?: string | null;
  size?: number;
  sizeFormatted?: string;
  canExpand?: boolean;
  files?: any[];
  isRoot?: boolean;
  children: IFolderNode[];
}

export interface IStorageFile {
  id: string | number;
  fileName: string;
  owner?: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  updatedByName?: string;
  size?: string;
  status?: string;
  access?: string;
  type: string;
  folderId?: string;
  path?: string;
  mimeType?: string;
  isFavorite?: boolean;
  isShared?: boolean;
  isSelected?: boolean;
  permissions?: Record<string, boolean>;
  [key: string]: any;
}

export type ClipboardAction = 'COPY' | 'MOVE';

export interface IResourceClipboard {
  action: ClipboardAction;
  sourceFolderId: string;
  fileIds: number[];
  folderIds: number[];
}
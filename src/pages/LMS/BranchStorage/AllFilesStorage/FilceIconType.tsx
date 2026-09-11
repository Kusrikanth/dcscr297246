import React from 'react';
import { File01Icon, FileUnknownIcon, Folder02Icon, Image01Icon, Video01Icon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';

type FileTypeIconProps = {
  extension?: string;
  fileName?: string;
  isFolder?: boolean;
  size?: number;
};

type FileIconConfig = {
  icon: any;
  iconClass: string;
  containerClass: string;
  badgeClass: string;
  badgeText: string;
};

const EXTENSION_GROUPS = {
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tif', 'tiff'],
  video: ['mp4', 'mov', 'avi', 'mkv', 'webm', 'mpeg', 'mpg', 'm4v'],
  pdf: ['pdf'],
  word: ['doc', 'docx', 'odt', 'rtf'],
  excel: ['xls', 'xlsx', 'csv', 'ods'],
  presentation: ['ppt', 'pptx', 'odp'],
  text: ['txt', 'md', 'log', 'json', 'xml', 'yaml', 'yml'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2'],
  audio: ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'flac'],
  code: ['js', 'jsx', 'ts', 'tsx', 'java', 'py', 'html', 'css', 'scss', 'sql', 'sh'],
};

export const normalizeFileExtension = (extension?: string, fileName?: string): string => {

  const normalizedExtension = extension?.trim().toLowerCase().replace(/^\./, '');
  if (normalizedExtension) {
    return normalizedExtension;
  }
  const fileNameParts = fileName?.split('.') ?? [];
  if (fileNameParts.length <= 1) {
    return '';
  }
  return fileNameParts[fileNameParts.length - 1].toLowerCase();
};

const getFileIconConfig = (extension: string, isFolder: boolean): FileIconConfig => {
  if (isFolder) {
    return {
      icon: Folder02Icon,
      iconClass: 'tw-text-amber-600',
      containerClass:
        'tw-bg-amber-50 tw-border-amber-100 group-hover:tw-bg-amber-100',
      badgeClass: 'tw-bg-amber-100 tw-text-amber-700',
      badgeText: 'DIR',
    };
  }

  if (EXTENSION_GROUPS.image.includes(extension)) {
    return {
      icon: Image01Icon,
      iconClass: 'tw-text-teal-600',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-teal-50/50',
      badgeClass: 'tw-bg-teal-50 tw-text-teal-600',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.video.includes(extension)) {
    return {
      icon: Video01Icon,
      iconClass: 'tw-text-indigo-500',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-indigo-50/50',
      badgeClass: 'tw-bg-indigo-50 tw-text-indigo-600',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.pdf.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-rose-400',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-rose-50/40',
      badgeClass: 'tw-bg-rose-50 tw-text-rose-400',
      badgeText: 'PDF',
    };
  }

  if (EXTENSION_GROUPS.word.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-blue-500',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-blue-50/50',
      badgeClass: 'tw-bg-blue-50 tw-text-blue-600',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.excel.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-emerald-600',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-emerald-50/50',
      badgeClass: 'tw-bg-emerald-50 tw-text-emerald-600',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.presentation.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-violet-500',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-violet-50/50',
      badgeClass: 'tw-bg-violet-50 tw-text-violet-600',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.text.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-slate-500',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-slate-100/70',
      badgeClass: 'tw-bg-slate-100 tw-text-slate-500',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.archive.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-cyan-600',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-cyan-50/50',
      badgeClass: 'tw-bg-cyan-50 tw-text-cyan-600',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.audio.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-purple-500',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-purple-50/50',
      badgeClass: 'tw-bg-purple-50 tw-text-purple-600',
      badgeText: extension.toUpperCase(),
    };
  }

  if (EXTENSION_GROUPS.code.includes(extension)) {
    return {
      icon: File01Icon,
      iconClass: 'tw-text-cyan-700',
      containerClass:
        'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-cyan-50/50',
      badgeClass: 'tw-bg-cyan-50 tw-text-cyan-700',
      badgeText: extension.toUpperCase(),
    };
  }

  return {
    icon: FileUnknownIcon,
    iconClass: 'tw-text-slate-400',
    containerClass:
      'tw-bg-slate-50 tw-border-slate-200 group-hover:tw-bg-slate-100/70',
    badgeClass: 'tw-bg-slate-100 tw-text-slate-500',
    badgeText: extension ? extension.toUpperCase() : 'FILE',
  };
};

export function FileTypeIcon({ extension, fileName, isFolder = false, size = 19 }: FileTypeIconProps) {

  const normalizedExtension = normalizeFileExtension(extension, fileName);
  const iconConfig = getFileIconConfig(normalizedExtension, isFolder);

  return (
    <div className={`tw-relative tw-flex tw-h-8 tw-w-8 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-lg tw-border tw-transition-colors tw-duration-150 ${iconConfig.containerClass}`}>
      <HugeiconsIcon
        icon={iconConfig.icon}
        size={size}
        strokeWidth={1.7}
        color="currentColor"
        className={iconConfig.iconClass}
      />
      {!isFolder && (
        <span
          className={`tw-absolute -tw-bottom-1 -tw-right-1 tw-max-w-[35px] tw-truncate tw-rounded tw-border tw-border-white tw-px-1 tw-py-0.5 tw-text-[7px] tw-font-bold tw-leading-none tw-shadow-sm ${iconConfig.badgeClass}`}
          title={iconConfig.badgeText}
        >
          {iconConfig.badgeText}
        </span>
      )}
    </div>
  );
}
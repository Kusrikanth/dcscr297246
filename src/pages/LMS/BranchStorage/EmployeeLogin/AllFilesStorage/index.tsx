import { useFormik } from 'formik';
import { ConfirmationModal, DropDownToggle, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../../../Components/Common';
import Button from '../../../../../Components/Common/Button';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, AlertCircleIcon, Archive02Icon, Audit01Icon, BookUploadIcon, CancelCircleHalfDotIcon, Comment02Icon, Copy01Icon, Delete02StrokeStandard, Download01Icon, Download04Icon, EyeIcon, FileUploadIcon, FileValidationIcon, FilterIcon, GridViewIcon, LeftToRightListBulletIcon, Link04Icon, Link05Icon, LocationUpdate01Icon, Menu11Icon, MenuCollapseIcon, MoreVerticalCircle01Icon, PencilEdit01Icon, Settings01Icon, Share01Icon, Share08Icon, Stamp01Icon, StarIcon, ViewIcon } from '@hugeicons-pro/core-stroke-standard';
import { generateColumns, findFolderPathById, findFolderIdByPath, IColumnActionOption, sortByOptions, sortOrderOptions } from './helper';
import BreadCrumb, { BreadCrumbUpdated } from '../../../../../Components/Common/BreadCrumb';
import { useLocation } from 'react-router-dom';
import { useModal } from '../../../../../hooks/modalhook';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { deleteMultipleFoldersAndFilesAct, downloadBranchStorageFilesBulkAct, downloadBranchStorageSingleFileAct, getLoginBasedBranchStorageFoldersFilesByIdAct, getLoginBasedBranchStorageRootFoldersAct, getBranchStorageFoldersByIdAct, getBranchStorageRootFoldersAct, getBranchStorageSuggestedFilesAct, getManageAccessSummaryAct, getPreviewFolderFileDetailsAct, resetBranchStorageFoldersByIdAct, resetManageAccessSummaryAct, revokeManageAccessAct, updateBranchStorageFileNameAct, updateBranchStorageFolderNameAct, moveBranchStorageFolderFilesAct, copyBranchStorageFolderFilesAct, saveBranchStorageFavoriteFilesAct, getLoginBasedBranchStorageAccessibleBranchesAct, getBranchStorageSharedWithMeFilesAct, getBranchStorageAuditsByFileAct } from '../../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions';
import { FolderFileDetailsModal } from '../../AllFilesStorage/FolderFileDetailsModal';
import UploadFilesModal from '../../AllFilesStorage/uploadFilesModal';
import CreateNewFolderModal from '../../AllFilesStorage/CreateNewFolderModal';
import ManageFileAccess from '../../AllFilesStorage/ManageFileAccess';
import "swiper/swiper-bundle.css";
import { StarIcon as StarSolidIcon } from "@hugeicons-pro/core-solid-standard";
import { StarIcon as StarStrokeIcon } from "@hugeicons-pro/core-stroke-standard";
import ReUploadFilesModal from '../../AllFilesStorage/ReUploadFilesModal';
import UpdatedHorizontalTab from '../../../../../Components/Common/UpdatedHorizontalTab';
import SuggestedFilesSwiper from '../../AllFilesStorage/SuggestedFilesSwiper';
import FolderTreeView from '../../AllFilesStorage/FolderTreeView';
import ViewFileAudit from '../../AllFilesStorage/ViewFileAudit';

interface IFolderNode {
  id: string;
  label: string;
  isRoot?: boolean;
  canExpand?: boolean;
  children: IFolderNode[];
}

type ClipboardAction = "COPY" | "MOVE";

interface IResourceClipboard {
  action: ClipboardAction;
  sourceFolderId: string;
  fileIds: number[];
  folderIds: number[];
}

const initialValues = {
  searchString: '',
  sortBy: '',
  sortOrder: '',
  type: '',
};

const AllFilesStorage = () => {

  const dispatch = useAppDispatch();
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState('recents');
  const location = useLocation<{ folderId?: string; }>();
  const [activeFolderId, setActiveFolderId] = useState<string>("all");
  const [activeFileId, setActiveFileId] = useState<any>("");
  const [isFolderPanelCollapsed, setIsFolderPanelCollapsed] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ all: true });
  const [modalFolderId, setModalFolderId] = useState(activeFolderId);
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [activeBranchId, setActiveBranchId] = useState<number | null>(null);
  const [folderNavigationPath, setFolderNavigationPath] = useState<any[]>([]);
  const { openModal: openUploadFilesModal, closeModal: closeUploadFilesModal, modalState: uploadFilesModalState } = useModal();
  const { openModal: openCreateNewFolderModal, closeModal: closeCreateNewFolderModal, modalState: createNewFolderModalState } = useModal();
  const { closeModal: closeDelFileModal, modalState: delFileModalState, openModal: openDelFileModal } = useModal();
  const { openModal: openDownloadBranchStorageFilesBulkModel, closeModal: closeDownloadBranchStorageFilesBulkModal, modalState: downloadBranchStorageFilesBulkModalState } = useModal();
  const { openModal: openManageFIleAccessModal, closeModal: closeManageFileAccessModal, modalState: manageFIleAccessModalState } = useModal();
  const { closeModal: closeRevokeManageAccessModal, modalState: revokeManageAccessModalState, openModal: openRevokeManageAccessModal } = useModal();
  const { openModal: openFavoriteFilesModel, closeModal: closeFavoriteFilesModal, modalState: favoriteFilesModalState } = useModal();
  const { openModal: openViewFileAuditModel, closeModal: closeViewFileAuditModal, modalState: viewFileAuditModalState } = useModal();
  const { openModal: openReUploadFilesModal, closeModal: closeReUploadFilesModal, modalState: reUploadFilesModalState } = useModal();
  const { openModal: openCopyBranchStorageFolderFilesModal, closeModal: closeCopyBranchStorageFolderFilesModal, modalState: copyBranchStorageFolderFilesModalState } = useModal();
  const { openModal: openMoveBranchStorageFolderFilesModal, closeModal: closeMoveBranchStorageFolderFilesModal, modalState: moveBranchStorageFolderFilesModalState } = useModal();
  const [activePreviewFileId, setActivePreviewFileId] = useState<number | null>(null);
  const [favoriteResource, setFavoriteResource] = useState<any>(null);
  const [showSuggestedFiles, setShowSuggestedFiles] = useState(false);
  const swiperRef = useRef<any>(null);
  const [activeSuggestedFileId, setActiveSuggestedFileId] =
    useState<number | null>(null);
  const [modalExpandedFolders, setModalExpandedFolders] =
    useState<Record<string, boolean>>({
      all: true,
    });

  const [isUploadingToS3, setIsUploadingToS3] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [completedUploads, setCompletedUploads] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const [files, setFiles] = useState<any[]>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [selectedFileIds, setSelectedFileIds] = useState<number[]>([]);
  const [selectedFolderIds, setSelectedFolderIds] = useState<number[]>([]);
  const INITIAL_VISIBLE_ROWS = 10;
  const VIEW_MORE_STEP = 10;
  const [visibleRowsCount, setVisibleRowsCount] = useState(INITIAL_VISIBLE_ROWS);
  const [resourceClipboard, setResourceClipboard] =
    useState<IResourceClipboard | null>(null);

  const [open, setOpen] = useState<boolean>(false);


  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };
  const totalSelectedCount =
    selectedFileIds.length +
    selectedFolderIds.length;

  const hasMultipleSelection = totalSelectedCount > 1;
  const hasSelectedResources = totalSelectedCount > 0;

  const currentDestinationFolderId =
    activeFolderId === "all"
      ? null
      : Number(activeFolderId);

  const clipboardSourceFolderId =
    resourceClipboard?.sourceFolderId === "all"
      ? null
      : Number(resourceClipboard?.sourceFolderId);

  const isClipboardDestinationDifferent =
    Boolean(resourceClipboard) &&
    currentDestinationFolderId !== clipboardSourceFolderId;

  const isCopyClipboard =
    resourceClipboard?.action === "COPY";

  const branchStorageAllFilesFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });

  const loginBasedtorageAccessibleBranchesApiCall = () => {
    dispatch(
      getLoginBasedBranchStorageAccessibleBranchesAct(
        generateActionPayload(
          "get_login_based_storgae_accessible_branches",
          undefined,
          { branchId }
        )
      )
    );
  };

  const branchStorageSharedWithMeFilesApiCall = (selectedBranchId: number | string) => {
    dispatch(
      getBranchStorageSharedWithMeFilesAct(
        generateActionPayload(
          "get_branch_storage_shared_with_me_files",
          undefined,
          {
            instituteId,
            branchId: selectedBranchId,
          }
        )
      )
    );
  };

  const branchStorageSubFolderByIdApiCall = (
    id: number | string,
    selectedBranchId: number | string = activeBranchId || branchId,
    sortBy = branchStorageAllFilesFormik.values.sortBy,
    sortOrder = branchStorageAllFilesFormik.values.sortOrder,
    type = branchStorageAllFilesFormik.values.type
  ) => {
    if (!id || id === "all") return;

    const payload = {
      instituteId,
      branchId: selectedBranchId,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
      type: type || "",
      isIncludeFiles: "true",
    };
    dispatch(
      getLoginBasedBranchStorageFoldersFilesByIdAct(
        generateActionPayload(
          "get_login_based_storage_folders_files_by_id",
          { folderId: id },
          payload
        )
      )
    );
  };


  const branchStorageSuggestedFilesApiCall = () => {
    dispatch(
      getBranchStorageSuggestedFilesAct(
        generateActionPayload(
          "get_branch_storage_suggested_files",
          undefined,
          { instituteId, branchId, size: "10" }
        )
      )
    );
  };

  const refreshFolderData = (folderId?: string) => {
    loginBasedtorageAccessibleBranchesApiCall();

    if (folderId && folderId !== "all") {
      branchStorageSubFolderByIdApiCall(folderId);

      setActiveFolderId(folderId);

      const expandedPath =
        expandFolderPath(folderTree, folderId) || {};

      setExpandedFolders((prev) => ({
        ...prev,
        all: true,
        ...expandedPath,
      }));
    } else {
      dispatch(resetBranchStorageFoldersByIdAct(undefined));
    }
  };
  const expandFolderPath = (
    nodes: any[],
    targetId: string,
    expanded: Record<string, boolean> = {}
  ): Record<string, boolean> | null => {
    for (const node of nodes) {
      if (node.id === targetId) {
        return {
          ...expanded,
          [node.id]: true,
        };
      }

      if (node.children?.length) {
        const result = expandFolderPath(
          node.children,
          targetId,
          {
            ...expanded,
            [node.id]: true,
          }
        );

        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  const refreshCurrentStorageData = useCallback(() => {
    if (activeFolderId.startsWith("branch-")) {
      if (activeBranchId) {
        branchStorageSharedWithMeFilesApiCall(activeBranchId);
      }
      return;
    }
    if (activeFolderId === "all") {
      loginBasedtorageAccessibleBranchesApiCall();
      return;
    }
    if (activeBranchId) {
      branchStorageSubFolderByIdApiCall(
        activeFolderId,
        activeBranchId
      );
    }
  }, [activeFolderId, activeBranchId]);

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getBranchStorageList,
    getBranchStorageSharedWithMeFilesResp,
    getLoginBasedStorageAccessibleBranchesResp,
    getLoginBasedBranchStorageFoldersFilesByIdResp,
    getBranchStorageSuggestedFilesResp,
    userMeResp,
    loggedInUserRole,
    saveBranchStorageFoldersResp,
    updateBranchStorageFoldersNameResp,
    updateBranchStorageFileNameResp,
    downloadBranchStorageFilesBulkResp,
    deleteMultipleFoldersAndFilesResp,
    revokeManageAccessResp,
    downloadBranchStorageSingleFileResp,
    saveUserStorageManageAccessResp,
    saveBranchStorageFavoriteFilesResp,
    copyBranchStorageFolderFilesResp,
    moveBranchStorageFolderFilesResp,
    branchStorageManagementErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageManagement, login, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getBranchStorageList: branchStorageSettings.getBranchStorageList,
      getBranchStorageSharedWithMeFilesResp: branchStorageManagement.getBranchStorageSharedWithMeFilesResp,
      getLoginBasedStorageAccessibleBranchesResp: branchStorageManagement.getLoginBasedStorageAccessibleBranchesResp,
      getLoginBasedBranchStorageFoldersFilesByIdResp: branchStorageManagement.getLoginBasedBranchStorageFoldersFilesByIdResp,
      getBranchStorageSuggestedFilesResp: branchStorageManagement.getBranchStorageSuggestedFilesResp,
      userMeResp: login.userMeResp,
      loggedInUserRole: appData.loggedInUserRole,
      saveBranchStorageFoldersResp: branchStorageManagement.saveBranchStorageFoldersResp,
      updateBranchStorageFoldersNameResp: branchStorageManagement.updateBranchStorageFoldersNameResp,
      updateBranchStorageFileNameResp: branchStorageManagement.updateBranchStorageFileNameResp,
      downloadBranchStorageFilesBulkResp: branchStorageManagement.downloadBranchStorageFilesBulkResp,
      deleteMultipleFoldersAndFilesResp: branchStorageManagement.deleteMultipleFoldersAndFilesResp,
      revokeManageAccessResp: branchStorageManagement.revokeManageAccessResp,
      downloadBranchStorageSingleFileResp: branchStorageManagement.downloadBranchStorageSingleFileResp,
      saveUserStorageManageAccessResp: branchStorageManagement.saveUserStorageManageAccessResp,
      saveBranchStorageFavoriteFilesResp: branchStorageManagement.saveBranchStorageFavoriteFilesResp,
      copyBranchStorageFolderFilesResp: branchStorageManagement.copyBranchStorageFolderFilesResp,
      moveBranchStorageFolderFilesResp: branchStorageManagement.moveBranchStorageFolderFilesResp,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevBranchStorageManagementErrorAct: branchStorageManagementErrorAct,
    prevSaveBranchStorageFoldersResp: saveBranchStorageFoldersResp,
    prevUpdateBranchStorageFoldersNameResp: updateBranchStorageFoldersNameResp,
    prevUpdateBranchStorageFileNameResp: updateBranchStorageFileNameResp,
    prevDownloadBranchStorageFilesBulkResp: downloadBranchStorageFilesBulkResp,
    prevDeleteMultipleFoldersAndFilesResp: deleteMultipleFoldersAndFilesResp,
    prevRevokeManageAccessResp: revokeManageAccessResp,
    prevDownloadBranchStorageSingleFileRespp: downloadBranchStorageSingleFileResp,
    prevSaveUserStorageManageAccessResp: saveUserStorageManageAccessResp,
    prevSaveBranchStorageFavoriteFilesResp: saveBranchStorageFavoriteFilesResp,
    prevCopyBranchStorageFolderFilesResp: copyBranchStorageFolderFilesResp,
    prevMoveBranchStorageFolderFilesResp: moveBranchStorageFolderFilesResp,
  });

  useEffect(() => {
    const { prevBranchStorageManagementErrorAct, prevSaveBranchStorageFoldersResp, prevUpdateBranchStorageFoldersNameResp, prevDownloadBranchStorageFilesBulkResp, prevDeleteMultipleFoldersAndFilesResp, prevRevokeManageAccessResp, prevDownloadBranchStorageSingleFileRespp,
      prevSaveUserStorageManageAccessResp, prevUpdateBranchStorageFileNameResp, prevSaveBranchStorageFavoriteFilesResp, prevCopyBranchStorageFolderFilesResp, prevMoveBranchStorageFolderFilesResp } =
      branchWiseNetPaidByDateRef.current;
    if (branchStorageManagementErrorAct && branchStorageManagementErrorAct !== prevBranchStorageManagementErrorAct) {
      const { details } = branchStorageManagementErrorAct || {};

      toast.error(details || "Something went wrong");
    } else if (saveBranchStorageFoldersResp && prevSaveBranchStorageFoldersResp !== saveBranchStorageFoldersResp) {
      toast.success("Branch Storage Folder saved successfully.");
      closeCreateNewFolderModal();
      refreshCurrentStorageData();
    } else if (updateBranchStorageFoldersNameResp && prevUpdateBranchStorageFoldersNameResp !== updateBranchStorageFoldersNameResp) {
      toast.success("Branch Storage Folder Updated successfully.");
      refreshCurrentStorageData();
    }
    else if (updateBranchStorageFileNameResp && prevUpdateBranchStorageFileNameResp !== updateBranchStorageFileNameResp) {
      toast.success("Branch Storage File Updated successfully.");
      refreshCurrentStorageData();
    } else if (downloadBranchStorageFilesBulkResp && prevDownloadBranchStorageFilesBulkResp !== downloadBranchStorageFilesBulkResp) {
      handleBulkDownloadResponse(downloadBranchStorageFilesBulkResp, "files.zip")
        .then(() => {
          toast.success("Files Downloaded successfully.");
          closeDownloadBranchStorageFilesBulkModal();
        })
        .catch((error) => {
          toast.error(error?.message || "File download failed");
        });
    } else if (deleteMultipleFoldersAndFilesResp && prevDeleteMultipleFoldersAndFilesResp !== deleteMultipleFoldersAndFilesResp) {
      toast.success("File Deleted successfully");
      setSelectedFileIds([]);
      setSelectedFolderIds([]);
      setAllStudentSelectedState(false);
      closeDelFileModal();

      refreshCurrentStorageData();
    } else if (revokeManageAccessResp && prevRevokeManageAccessResp !== revokeManageAccessResp) {
      toast.success("Manage access revoked successfully.");
      closeRevokeManageAccessModal();
      refreshCurrentStorageData();
    }
    else if (downloadBranchStorageSingleFileResp && prevDownloadBranchStorageSingleFileRespp !== downloadBranchStorageSingleFileResp) {
      const downloadUrl = downloadBranchStorageSingleFileResp?.url;
      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("File downloaded successfully.");
        closeDownloadBranchStorageFilesBulkModal();
      }
    } else if (saveUserStorageManageAccessResp && prevSaveUserStorageManageAccessResp !== saveUserStorageManageAccessResp) {
      toast.success("Access for Selected files and folders shared successfully.");
      closeManageFileAccessModal();
      refreshCurrentStorageData();
    }
    else if (saveBranchStorageFavoriteFilesResp && prevSaveBranchStorageFavoriteFilesResp !== saveBranchStorageFavoriteFilesResp) {
      toast.success(favoriteResource?.isFavorite ? "Removed from Favorites successfully." : "Added to Favorites successfully.");
      closeFavoriteFilesModal();
      setFavoriteResource(null);
      refreshCurrentStorageData();
    }
    else if (copyBranchStorageFolderFilesResp && prevCopyBranchStorageFolderFilesResp !== copyBranchStorageFolderFilesResp) {
      toast.success("Selected files and folders copied successfully.");
      setResourceClipboard(null);
      setSelectedFileIds([]);
      setSelectedFolderIds([]);
      setAllStudentSelectedState(false);
      closeCopyBranchStorageFolderFilesModal();
      refreshCurrentStorageData();
    } else if (moveBranchStorageFolderFilesResp && prevMoveBranchStorageFolderFilesResp !== moveBranchStorageFolderFilesResp) {
      toast.success("Selected files and folders moved successfully.");
      setResourceClipboard(null);
      setSelectedFileIds([]);
      setSelectedFolderIds([]);
      setAllStudentSelectedState(false);
      closeMoveBranchStorageFolderFilesModal();

      refreshCurrentStorageData();
    }
    branchWiseNetPaidByDateRef.current.prevBranchStorageManagementErrorAct = branchStorageManagementErrorAct;
    branchWiseNetPaidByDateRef.current.prevSaveBranchStorageFoldersResp = saveBranchStorageFoldersResp;
    branchWiseNetPaidByDateRef.current.prevUpdateBranchStorageFoldersNameResp = updateBranchStorageFoldersNameResp;
    branchWiseNetPaidByDateRef.current.prevDownloadBranchStorageFilesBulkResp = downloadBranchStorageFilesBulkResp;
    branchWiseNetPaidByDateRef.current.prevDeleteMultipleFoldersAndFilesResp = deleteMultipleFoldersAndFilesResp;
    branchWiseNetPaidByDateRef.current.prevRevokeManageAccessResp = revokeManageAccessResp;
    branchWiseNetPaidByDateRef.current.prevDownloadBranchStorageSingleFileRespp = downloadBranchStorageSingleFileResp;
    branchWiseNetPaidByDateRef.current.prevSaveUserStorageManageAccessResp = saveUserStorageManageAccessResp;
    branchWiseNetPaidByDateRef.current.prevUpdateBranchStorageFileNameResp = updateBranchStorageFileNameResp;
    branchWiseNetPaidByDateRef.current.prevSaveBranchStorageFavoriteFilesResp = saveBranchStorageFavoriteFilesResp;
    branchWiseNetPaidByDateRef.current.prevCopyBranchStorageFolderFilesResp = copyBranchStorageFolderFilesResp;
    branchWiseNetPaidByDateRef.current.prevMoveBranchStorageFolderFilesResp = moveBranchStorageFolderFilesResp;
  }, [branchStorageManagementErrorAct, saveBranchStorageFoldersResp, updateBranchStorageFoldersNameResp, downloadBranchStorageFilesBulkResp, deleteMultipleFoldersAndFilesResp, revokeManageAccessResp, downloadBranchStorageSingleFileResp,
    saveUserStorageManageAccessResp, updateBranchStorageFileNameResp, saveBranchStorageFavoriteFilesResp, copyBranchStorageFolderFilesResp, moveBranchStorageFolderFilesResp, activeFolderId, activeBranchId, branchId,
  ]);

  const triggerUrlDownload = (downloadUrl: string, fileName = "files.zip") => {
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = fileName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadBlobFile = (blob: Blob, fileName = "files.zip") => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleBulkDownloadResponse = async (response: any, fileName = "files.zip") => {
    if (response?.downloadUrl) {
      triggerUrlDownload(response.downloadUrl, fileName);
      return;
    }
    if (response instanceof Blob) {
      const isJson =
        response.type?.includes("application/json") ||
        response.type?.includes("text/plain");
      if (isJson) {
        const text = await response.text();
        const data = JSON.parse(text);
        if (data?.downloadUrl) {
          triggerUrlDownload(data.downloadUrl, fileName);
          return;
        }
        throw new Error(data?.message || "Download URL not found");
      }
      downloadBlobFile(response, fileName);
      return;
    }
    if (response instanceof ArrayBuffer) {
      downloadBlobFile(
        new Blob([response], { type: "application/zip" }),
        fileName
      );
      return;
    }
    throw new Error("Invalid download response");
  };


  useEffect(() => {
    if (branchId) {
      loginBasedtorageAccessibleBranchesApiCall();
      branchStorageSuggestedFilesApiCall();
    }
  }, [branchId,
    branchStorageAllFilesFormik.values.sortBy,
    branchStorageAllFilesFormik.values.sortOrder,
    branchStorageAllFilesFormik.values.type,]);


  useEffect(() => {
    setVisibleRowsCount(INITIAL_VISIBLE_ROWS);
  }, [
    activeFolderId,
    activeFileId,
    activeTabId,
    branchStorageAllFilesFormik.values.searchString,
    branchStorageAllFilesFormik.values.sortBy,
    branchStorageAllFilesFormik.values.sortOrder,
    branchStorageAllFilesFormik.values.type,
  ]);

  const updateTree = (nodes: any[], parentId: string, children: any[]): any[] => {
    return nodes.map((node) => {
      if (node.id === parentId) {
        return {
          ...node,
          children,
        };
      }
      if (node.children?.length) {
        return {
          ...node,
          children: updateTree(
            node.children,
            parentId,
            children
          ),
        };
      }
      return node;
    });
  };

  const DEFAULT_PERMISSIONS = {
    canView: false,
    canDownload: false,
    canUpload: false,
    canEdit: false,
    canDelete: false,
    canRename: false,
    canMove: false,
    canShare: false,
    canManagePermissions: false,
  };

  const currentPermissions = useMemo(() => {
    if (activeFolderId === "all") {
      return {
        canView: true,
        canDownload: true,
        canUpload: false,
        canEdit: false,
        canDelete: false,
        canRename: false,
        canMove: true,
        canShare: false,
        canManagePermissions: false,
      };
    }
    if (activeFolderId.startsWith("branch-")) {
      return (
        getBranchStorageSharedWithMeFilesResp?.currentFolderPermissions || {}
      );
    }
    return (
      getLoginBasedBranchStorageFoldersFilesByIdResp?.currentFolderPermissions || {}
    );
  }, [
    activeFolderId,
    getBranchStorageSharedWithMeFilesResp,
    getLoginBasedBranchStorageFoldersFilesByIdResp,
  ]);

  const folderTree = useMemo(() => {
    const branches = getLoginBasedStorageAccessibleBranchesResp || [];

    const toCamelCase = (value: string | null | undefined = "") =>
      (value ?? "")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());

    return [
      {
        id: "all",
        label: "Shared With Me",
        isRoot: true,
        canExpand: branches.length > 0,

        children: branches.map((branch: any) => ({
          id: `branch-${branch.branchId}`,
          label: `${toCamelCase(branch.instituteShortName)} - ${toCamelCase(
            branch.branchName
          )}`,
          isBranch: true,
          branchId: branch.branchId,
          instituteId: branch.instituteId,
          canExpand: false,
          children: [],
        })),
      },
    ];
  }, [getLoginBasedStorageAccessibleBranchesResp]);
  const activeTreeFolderId = useMemo(() => {
    if (activeFolderId === "all") {
      return "all";
    }
    if (activeFolderId.startsWith("branch-")) {
      return activeFolderId;
    }
    if (activeBranchId) {
      return `branch-${activeBranchId}`;
    }
    return "all";
  }, [activeFolderId, activeBranchId]);

  const handleOpenUploadModal = useCallback(
    (folderId?: string) => {
      const selectedFolderId = String(folderId || activeFolderId || "all");

      setModalFolderId(selectedFolderId);

      const expandedPath =
        expandFolderPath(folderTree, selectedFolderId) || {};

      setModalExpandedFolders({
        all: true,
        ...expandedPath,
      });

      openUploadFilesModal();
    },
    [activeFolderId, folderTree, openUploadFilesModal]
  );

  const dropDownOption = useMemo(() => {
    const options: any[] = [];

    if (currentPermissions?.canUpload) {
      options.push({
        id: "upload-file",
        actionName: "Upload File",
        actionIcon: (
          <HugeiconsIcon
            icon={BookUploadIcon}
            className="tw-mr-2 tw-text-gray-400"
            size={18}
          />
        ),
        onClickHndlr: () => handleOpenUploadModal(),
      });

      options.push({
        id: "new-folder",
        actionName: "New Folder",
        actionIcon: (
          <HugeiconsIcon
            icon={Add01Icon}
            className="tw-mr-2 tw-text-gray-400"
            size={20}
          />
        ),
        onClickHndlr: () => handleOpenUploadModal(),
      });
    }

    return options;
  }, [currentPermissions, handleOpenUploadModal]);

  const tabMenuOptions = useMemo(() => [
    // {
    //   id: "recent",
    //   labelName: "Recent",
    //   customPadding: "",
    //   // count: getBranchStorageSuggestedFilesResp?.length || 0,
    // },
    {
      id: "starred",
      labelName: "Starred",
      customPadding: "",
      Icon: (
        <span className="tw-flex tw-items-center tw-leading-none">
          <HugeiconsIcon
            icon={StarIcon}
            size={18}
            className="tw-shrink-0 tw-me-1"
          />
        </span>
      ),
    },
  ], [getBranchStorageSuggestedFilesResp]);

  const suggestedFiles = useMemo(() => {
    return (
      getBranchStorageSuggestedFilesResp?.map((item: any) => ({
        id: item.id,
        fileName: item.originalFileName || item.logicalName,
        uploadedBy: item.createdByName || "-",
        uploadedOn: item.createdAt,
        extension: item.extension,
        folderId: item.folderId,
        path: item.folderPath,
        size:
          item.sizeBytes
            ? `${Math.round(item.sizeBytes / 1024)} KB`
            : "—",
      })) || []
    );
  }, [getBranchStorageSuggestedFilesResp]);

  function activeTabHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id") || "";
    const isSameTab = activeTabId === menuId;
    if (isSameTab) {
      setActiveTabId("");
      branchStorageAllFilesFormik.setFieldValue("sortBy", "");
      branchStorageAllFilesFormik.setFieldValue("sortOrder", "");
      return;
    }

    setActiveTabId(menuId);

    if (menuId === "recent") {
      branchStorageAllFilesFormik.setFieldValue("sortBy", "MODIFIED_DATE");
      branchStorageAllFilesFormik.setFieldValue("sortOrder", "DESC");
    } else if (menuId === "starred") {
      branchStorageAllFilesFormik.setFieldValue("sortBy", "");
      branchStorageAllFilesFormik.setFieldValue("sortOrder", "");
    }
  }

  function findFolderById(nodes: any[], id: string): any {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFolderById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  const openFolder = useCallback(
    (folderId: string) => {
      const nextFolderId = folderId || "all";

      setSelectedFileIds([]);
      setSelectedFolderIds([]);
      setAllStudentSelectedState(false);
      setActiveFileId("");

      if (nextFolderId === "all") {
        setActiveFolderId("all");
        setActiveBranchId(null);
        setFolderNavigationPath([]);
        dispatch(resetBranchStorageFoldersByIdAct(undefined));
        loginBasedtorageAccessibleBranchesApiCall();

        return;
      }

      const selectedNode = findFolderById(
        folderTree,
        nextFolderId
      );

      if (selectedNode?.isBranch) {
        const selectedBranchId = Number(selectedNode.branchId);

        setActiveBranchId(selectedBranchId);
        setActiveFolderId(nextFolderId);

        setFolderNavigationPath([
          {
            id: nextFolderId,
            label: selectedNode.label,
            type: "branch",
            branchId: selectedBranchId,
          },
        ]);

        return;
      }

      setActiveFolderId(nextFolderId);
    },
    [folderTree, dispatch]
  );

  useEffect(() => {
    if (activeFolderId === "all") {
      return;
    }
    if (activeFolderId.startsWith("branch-")) {
      if (!activeBranchId) return;
      dispatch(resetBranchStorageFoldersByIdAct(undefined));
      branchStorageSharedWithMeFilesApiCall(
        activeBranchId
      );
      return;
    }
    if (!activeBranchId) return;
    branchStorageSubFolderByIdApiCall(
      activeFolderId,
      activeBranchId
    );
  }, [activeFolderId, activeBranchId]);

  useEffect(() => {
    const folderIdFromBreadcrumb = location.state?.folderId;
    if (!folderIdFromBreadcrumb) return;
    openFolder(String(folderIdFromBreadcrumb));
  }, [location.key]);

  const handleFolderRowOpen = useCallback(
    (item: any) => {
      if (item?.type === "branch") {
        const branchId = Number(item.branchId);

        setActiveBranchId(branchId);
        setActiveFolderId(`branch-${branchId}`);

        setFolderNavigationPath([
          {
            id: `branch-${branchId}`,
            label: item.fileName,
            type: "branch",
            branchId,
          },
        ]);

        return;
      }

      if (item?.type === "folder") {
        const folderId = String(item.folderId);
        const selectedBranchId = Number(item.branchId);

        setActiveFolderId(folderId);
        setActiveBranchId(selectedBranchId);

        setFolderNavigationPath((previous) => {
          const existingIndex = previous.findIndex(
            (node) => String(node.id) === folderId
          );
          if (existingIndex >= 0) {
            return previous.slice(0, existingIndex + 1);
          }
          return [
            ...previous,
            {
              id: folderId,
              label: item.fileName,
              type: "folder",
              branchId: selectedBranchId,
            },
          ];
        });
      }
    },
    []
  );

  const filteredFiles = useMemo(() => {

    if (activeFolderId === "all") {
      return (
        getLoginBasedStorageAccessibleBranchesResp || []
      ).map((branch: any) => ({
        id: `branch-${branch.branchId}`,
        fileName: branch.branchName,
        owner: "—",
        size: "—",
        status: "Active",
        access: "BRANCH",
        type: "branch",
        branchId: Number(branch.branchId),
        instituteId: branch.instituteId,
        path: "",
        isSelected: false,
      }));
    }
    if (
      activeFolderId.startsWith("branch-")
    ) {
      const selectedBranch =
        getBranchStorageSharedWithMeFilesResp?.branches?.find(
          (branch: any) =>
            Number(branch.branchId) ===
            Number(activeBranchId)
        );

      const folderRows =
        selectedBranch?.folders?.map((folder: any) => ({
          id: `folder-${folder.id}`,
          fileName: folder.name,
          owner: folder.ownerUserName || "—",
          createdAt: folder.createdAt || "—",
          status: "Active",
          access: folder.accessScope || "BRANCH",
          type: "folder",
          folderId: String(folder.id),
          branchId: Number(selectedBranch?.branchId),
          path: folder.folderPath || "",
          modifiedAgo: folder.modifiedAgo || "",
          updatedByName: folder.updatedByName || "",
          categoryName: folder.categoryName || "",
          permissions: folder.permissions,
          isShared: folder.isShared,
          isFavorite: folder.isFavorite,
          size: folder.sizeBytes
            ? `${Math.round(folder.sizeBytes / 1024)} KB`
            : "—",
          isSelected: selectedFolderIds.includes(
            Number(folder.id)
          ),
        })) || [];

      const fileRows =
        selectedBranch?.files?.map((file: any) => ({
          id: file.id,
          fileName:
            file.logicalName ||
            file.originalFileName,
          owner: file.ownerUserName || "—",
          size: file.sizeBytes
            ? `${Math.round(file.sizeBytes / 1024)} KB`
            : "—",
          status: file.status || "ACTIVE",
          access: file.accessScope,
          type:
            file.extension?.toLowerCase() ||
            "file",
          folderId: String(file.folderId),
          branchId: Number(selectedBranch?.branchId),
          path: file.folderPath || "",
          modifiedAgo: file.modifiedAgo || "",
          updatedByName: file.updatedByName || "",
          categoryName: file.categoryName || "",
          createdAt: file.createdAt || "",
          permissions: file.permissions,
          isFavorite: file.isFavorite,
          isShared: file.isShared,
          isSelected: selectedFileIds.includes(
            Number(file.id)
          ),
        })) || [];
      if (activeTabId === "starred") {
        return fileRows.filter(
          (item: any) => item.isFavorite
        );
      }
      return [...folderRows, ...fileRows];
    }
    const folderRows =
      getLoginBasedBranchStorageFoldersFilesByIdResp?.folders
        ?.map((folder: any) => ({
          id: `folder-${folder.id}`,
          fileName: folder.name,
          owner: folder.ownerUserName || "—",
          status: "Active",
          access: folder.accessScope || "BRANCH",
          type: "folder",
          folderId: String(folder.id),
          branchId: activeBranchId,
          path: folder.folderPath || "",
          modifiedAgo: folder.modifiedAgo || "",
          updatedByName: folder.updatedByName || "",
          categoryName: folder.categoryName || "",
          createdAt: folder.createdAt || "",
          permissions: folder.permissions,
          isFavorite: folder.isFavorite,
          size: folder.sizeBytes
            ? `${Math.round(folder.sizeBytes / 1024)} KB`
            : "—",
          isShared: folder.isShared,
          isSelected: selectedFolderIds.includes(
            Number(folder.id)
          ),
        })) || [];

    const fileRows =
      getLoginBasedBranchStorageFoldersFilesByIdResp?.files
        ?.map((file: any) => ({
          id: file.id,
          fileName:
            file.logicalName ||
            file.originalFileName,
          owner: file.ownerUserName || "—",
          size: file.sizeBytes
            ? `${Math.round(file.sizeBytes / 1024)} KB`
            : "—",
          status: file.status || "ACTIVE",
          access: file.accessScope,
          type:
            file.extension?.toLowerCase() ||
            "file",
          folderId: String(file.folderId),
          branchId: activeBranchId,
          path:
            file.folderPath ||
            getLoginBasedBranchStorageFoldersFilesByIdResp
              ?.folder?.folderPath ||
            "",
          modifiedAgo: file.modifiedAgo,
          updatedByName: file.updatedByName,
          categoryName: file.categoryName,
          createdAt: file.createdAt,
          permissions: file.permissions,
          isFavorite: file.isFavorite,
          isShared: file.isShared,
          isSelected: selectedFileIds.includes(
            Number(file.id)
          ),
        })) || [];
    if (activeTabId === "starred") {
      return fileRows.filter(
        (item: any) => item.isFavorite
      );
    }
    return [...folderRows, ...fileRows];

  }, [
    activeFolderId,
    activeBranchId,
    activeTabId,
    getLoginBasedStorageAccessibleBranchesResp,
    getBranchStorageSharedWithMeFilesResp,
    getLoginBasedBranchStorageFoldersFilesByIdResp,
    selectedFileIds,
    selectedFolderIds,
  ]);

  const selectedRows = useMemo(() => {
    return filteredFiles.filter((item: any) => {
      if (item.type === "folder") {
        return selectedFolderIds.includes(Number(item.folderId));
      }

      return selectedFileIds.includes(Number(item.id));
    });
  }, [filteredFiles, selectedFileIds, selectedFolderIds]);

  const selectedRowsHavePermission = useCallback(
    (permissionKey: string) => {
      return (
        selectedRows.length > 0 &&
        selectedRows.every((item: any) => item.permissions?.[permissionKey])
      );
    },
    [selectedRows]
  );

  const selectedRowsCanManageAccess = useMemo(() => {
    return (
      selectedRows.length > 0 &&
      selectedRows.every(
        (item: any) =>
          item.permissions?.canManagePermissions || item.permissions?.canShare
      )
    );
  }, [selectedRows]);

  const showDownloadButton =
    totalSelectedCount > 1 &&
    selectedFileIds.length > 0 &&
    selectedFolderIds.length === 0 &&
    selectedRowsHavePermission("canDownload");

  const showDeleteButton =
    totalSelectedCount > 1 &&
    selectedRowsHavePermission("canDelete");

  const showManageAccessButton =
    totalSelectedCount > 1 &&
    selectedRowsCanManageAccess;

  const showCopyButton =
    totalSelectedCount > 0 &&
    !resourceClipboard &&
    selectedRowsHavePermission("canCopy");

  const showMoveButton =
    totalSelectedCount > 0 &&
    !resourceClipboard &&
    selectedRowsHavePermission("canMove");

  const showPasteButton =
    resourceClipboard &&
    isClipboardDestinationDifferent &&
    (
      (resourceClipboard.action === "COPY" &&
        currentPermissions?.canView) ||
      (resourceClipboard.action === "MOVE" &&
        currentPermissions?.canMove)
    );

  const openManageAccess = (id: number) => {
    const selectedItem = filteredFiles.find(
      (item: any) =>
        Number(item.id) === id ||
        Number(item.folderId) === id
    );

    if (!selectedItem) return;

    openManageFIleAccessModal({
      selectedResources: [
        {
          resourceType:
            selectedItem.type === "folder"
              ? "FOLDER"
              : "FILE",
          resourceId:
            selectedItem.type === "folder"
              ? Number(selectedItem.folderId)
              : Number(selectedItem.id),
        },
      ],
      selectedNames: [
        {
          name: selectedItem.fileName,
          type:
            selectedItem.type === "folder"
              ? "Folder"
              : "File",
        },
      ],
    });
  };

  const menuOptions = useMemo<IColumnActionOption[]>(
    () => [
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon
            icon={EyeIcon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "View Details",
        onClickHndlr: (event: any) => {
          const id = Number(event.currentTarget.getAttribute("data-id"));

          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );
          setActivePreviewFileId(id);
          dispatch(resetManageAccessSummaryAct(undefined));
          dispatch(
            getManageAccessSummaryAct(
              generateActionPayload(
                "get_manage_access_summary",
                undefined,
                {
                  branchId,
                  resourceType:
                    selectedItem?.type === "folder"
                      ? "FOLDER"
                      : "FILE",
                  resourceId: id,
                }
              )
            )
          );
          dispatch(
            getPreviewFolderFileDetailsAct(
              generateActionPayload(
                "preview_folder_file_details",
                { id }
              )
            )
          );
          toggleAdvanceFilter();
        },
      },
      {
        id: "view-audits",
        actionIcon: (
          <HugeiconsIcon
            icon={Audit01Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "View Audits",
        onClickHndlr: (event: any) => {
          const rawRowId =
            event.currentTarget.getAttribute("data-id") || "";

          const [resourceType, resourceId] = rawRowId.split("-");

          const id = Number(resourceId);
          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );
          setActivePreviewFileId(id);
          dispatch(
            getBranchStorageAuditsByFileAct(
              generateActionPayload(
                "get_branch_storage_audits_by_file",
                { id }
              )
            )
          );
          openViewFileAuditModel(selectedItem);
        },
      },
      {
        id: "share",
        actionIcon: (
          <HugeiconsIcon
            icon={Share08Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Share",
        onClickHndlr: (event: any) => {
          const rawRowId =
            event.currentTarget.getAttribute("data-id") || "";

          const [resourceType, resourceId] = rawRowId.split("-");
          const id = Number(event.currentTarget.getAttribute("data-id"));

          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );
          if (!selectedItem) return;
          handleManageAccess(selectedItem);
        }
      },
      {
        id: "favorite",
        actionIcon: (row: any) => (
          <HugeiconsIcon
            icon={row.isFavorite ? StarSolidIcon : StarStrokeIcon}
            size={18}
            className={
              row.isFavorite
                ? "tw-text-yellow-500"
                : "text-muted"
            }
          />
        ),
        actionName: (row: any) =>
          row.isFavorite
            ? "Remove Favorite"
            : "Add Favorite",
        onClickHndlr: (event: any) => {
          const rawRowId =
            event.currentTarget.getAttribute("data-id") || "";

          const [resourceType, resourceId] =
            rawRowId.split("-");

          const id = Number(event.currentTarget.getAttribute("data-id"));

          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );
          if (!selectedItem) return;
          setFavoriteResource({
            id,
            isFavorite: selectedItem?.isFavorite,
            resourceType:
              selectedItem?.type === "folder"
                ? "FOLDER"
                : "FILE",
          });
          openFavoriteFilesModel(id);
        },
      },
    ],
    [filteredFiles]
  );

  const moreMenuOptions = useMemo(
    () => [
      {
        id: "details",
        actionIcon: (
          <HugeiconsIcon
            icon={AlertCircleIcon}
            className="text-muted tw-me-2"
            size={18}
          />
        ),
        actionName: "Details",
        onClickHndlr: (event: any) => {
          const id = Number(
            event.currentTarget.getAttribute("data-id")
          );

          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );

          dispatch(
            getManageAccessSummaryAct(
              generateActionPayload(
                "get_manage_access_summary",
                undefined,
                {
                  branchId,
                  resourceType:
                    selectedItem?.type === "folder"
                      ? "FOLDER"
                      : "FILE",
                  resourceId: id,
                }
              )
            )
          );

          dispatch(
            getPreviewFolderFileDetailsAct(
              generateActionPayload(
                "preview_folder_file_details",
                { id }
              )
            )
          );

          toggleAdvanceFilter();
        },
      },
      {
        id: "download",
        actionIcon: <HugeiconsIcon icon={Download01Icon} className="text-muted tw-me-2" size={18} />,
        actionName: "Download",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
          dispatch(
            downloadBranchStorageSingleFileAct(
              generateActionPayload(
                "download_branch_storage_single_file",
                { id }
              )
            )
          );
        },
      },
      // {
      //   id: "preview",
      //   actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted tw-me-2" size={18} />,
      //   actionName: "Preview",
      //   onClickHndlr: (event: any) => {
      //     const id = event.currentTarget.getAttribute('data-id');
      //   },
      // },
      {
        id: "re-upload-file",
        actionIcon: (
          <HugeiconsIcon
            icon={FileUploadIcon}
            className="text-muted tw-me-2"
            size={18}
          />
        ),
        actionName: "Re-Upload File",
        onClickHndlr: (event: any) => {
          const id = Number(
            event.currentTarget.getAttribute("data-id")
          );

          const selectedFile = filteredFiles.find(
            (item: any) =>
              item.type !== "folder" &&
              Number(item.id) === id
          );

          if (!selectedFile) {
            toast.error("File not found");
            return;
          }

          openReUploadFilesModal(selectedFile);
        },
      },
      {
        id: "manageAccess",
        actionIcon: <HugeiconsIcon icon={FileValidationIcon} className="text-muted tw-me-2" size={18} />,
        actionName: "Manage Access",
        onClickHndlr: (event: any) => {
          const id = Number(
            event.currentTarget.getAttribute("data-id")
          );
          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );
          dispatch(resetManageAccessSummaryAct(undefined));
          dispatch(
            getManageAccessSummaryAct(
              generateActionPayload(
                "get_manage_access_summary",
                undefined,
                {
                  branchId,
                  resourceType:
                    selectedItem?.type === "folder"
                      ? "FOLDER"
                      : "FILE",
                  resourceId: id,
                }
              )
            )
          );
          openManageAccess(id);
        }
      },
      {
        id: "revoke-manage-access",
        actionIcon: (
          <HugeiconsIcon
            icon={LocationUpdate01Icon}
            className="text-muted tw-me-2"
            size={18}
          />
        ),
        actionName: "Revoke Manage Access",
        onClickHndlr: (event: any) => {
          const id = Number(event.currentTarget.getAttribute("data-id"));

          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );

          if (!selectedItem) return;

          const isFolder = selectedItem.type === "folder";

          openRevokeManageAccessModal({
            resourceType: isFolder ? "FOLDER" : "FILE",
            resourceId: isFolder
              ? Number(selectedItem.folderId)
              : Number(selectedItem.id),
          });
        },
      },
      {
        id: "archive",
        actionIcon: <HugeiconsIcon icon={Archive02Icon} className="text-muted tw-me-2" size={18} />,
        actionName: "Archive",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute('data-id');
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger tw-me-2" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = Number(event.currentTarget.getAttribute("data-id"));

          const folder = filteredFiles?.find(
            (item: any) =>
              item.type === "folder" &&
              Number(item.folderId) === id
          );
          openDelFileModal({
            id,
            type: folder ? "folder" : "file",
          });
        },
      }
    ],
    [filteredFiles],
  );

  // useEffect(() => {
  //   if (
  //     activeFolderId &&
  //     activeFolderId !== "all" &&
  //     folderTree.length
  //   ) {
  //     const expandedPath =
  //       expandFolderPath(folderTree, activeFolderId) || {};

  //     setExpandedFolders((prev) => ({
  //       ...prev,
  //       all: true,
  //       ...expandedPath,
  //     }));
  //   }
  // }, [folderTree, activeFolderId]);


  const visibleFiles = useMemo(() => {
    return filteredFiles.slice(0, visibleRowsCount);
  }, [filteredFiles, visibleRowsCount]);

  const canViewMore = visibleRowsCount < filteredFiles.length;

  const handleViewMore = () => {
    setVisibleRowsCount((prev) =>
      Math.min(prev + VIEW_MORE_STEP, filteredFiles.length)
    );
  };

  function cleanFolderPath(path: string) {
    return path.replace(/^All files\s*\/\s*/i, "").trim();
  }

  const folderBreadCrumbOptions = useMemo(() => {
    return [
      {
        id: "all",
        breadcrumbLabel: "All Files",
        redirectUrl: {
          pathname: location.pathname,
          state: {
            folderId: "all",
          },
        },
      },

      ...folderNavigationPath.map((item) => ({
        id: item.id,
        breadcrumbLabel: item.label,
        redirectUrl: {
          pathname: location.pathname,
          state: {
            folderId: item.id,
            branchId: item.branchId,
          },
        },
      })),
    ];
  }, [folderNavigationPath, location.pathname]);

  useEffect(() => {
    loginBasedtorageAccessibleBranchesApiCall();
  }, []);

  useEffect(() => {
    const fileIds = visibleFiles
      .filter((item: any) => item.type !== "folder")
      .map((item: any) => Number(item.id));

    const folderIds = visibleFiles
      .filter((item: any) => item.type === "folder")
      .map((item: any) => Number(item.folderId));

    const allFilesSelected =
      fileIds.length === 0 ||
      fileIds.every((id) => selectedFileIds.includes(id));

    const allFoldersSelected =
      folderIds.length === 0 ||
      folderIds.every((id) => selectedFolderIds.includes(id));

    setAllStudentSelectedState(
      (fileIds.length + folderIds.length) > 0 &&
      allFilesSelected &&
      allFoldersSelected
    );
  }, [
    selectedFileIds,
    selectedFolderIds,
    visibleFiles,
  ]);

  const saveResourceName = (item: any, newNameValue: string) => {
    const newName = newNameValue.trim();

    if (!newName) {
      toast.error("Name is required");
      return;
    }

    if (!item?.permissions?.canRename) {
      toast.error("You don't have permission to rename this item");
      return;
    }

    if (item.type === "folder") {
      dispatch(
        updateBranchStorageFolderNameAct(
          generateActionPayload(
            "update_branch_storage_folder_name",
            { id: item.folderId },
            {
              folderName: newName,
            }
          )
        )
      );
    } else {
      dispatch(
        updateBranchStorageFileNameAct(
          generateActionPayload(
            "update_branch_storage_file_name",
            undefined,
            {
              fileId: item.id,
              fileName: newName
            }
          )
        )
      );
    }

    setEditingFolderId(null);
  };

  const downloadStudentIdCardZipHandler = () => {
    const selectedFiles = visibleFiles.filter((item: any) =>
      selectedFileIds.includes(Number(item.id))
    );

    if (!selectedFiles.length) {
      toast.error("Please select at least one file");
      return;
    }

    const payload = {
      instituteId: Number(instituteId),
      branchId: Number(branchId),
      fileIds: selectedFiles.map((item: any) => Number(item.id))
    };

    dispatch(
      downloadBranchStorageFilesBulkAct(
        generateActionPayload(
          "download_branch_storage_files_bulk",
          undefined,
          payload,
          { responseType: "blob" }
        )
      )
    );
  };

  const favoriteFilesSubmitHandler = () => {
    if (!favoriteResource) return;
    const payload = {
      resources: [
        {
          action: favoriteResource.isFavorite ? "UNMARK" : "MARK",
          resources: [
            {
              resourceType: "FOLDER",
              resourceIds:
                favoriteResource.resourceType === "FOLDER"
                  ? [favoriteResource.id]
                  : [],
            },
            {
              resourceType: "FILE",
              resourceIds:
                favoriteResource.resourceType === "FILE"
                  ? [favoriteResource.id]
                  : [],
            },
          ],
        },
      ],
    };

    dispatch(
      saveBranchStorageFavoriteFilesAct(
        generateActionPayload(
          "save_branch_storage_favorite_files",
          undefined,
          payload
        )
      )
    );
  };

  function delModalSubmitHndlr() {
    const { id, type } =
      delFileModalState.modalData || {};

    const payload =
      type === "bulk"
        ? {
          fileIds: selectedFileIds,
          folderIds: selectedFolderIds,
        }
        : {
          fileIds:
            type === "file"
              ? [Number(id)]
              : [],
          folderIds:
            type === "folder"
              ? [Number(id)]
              : [],
        };

    dispatch(
      deleteMultipleFoldersAndFilesAct(
        generateActionPayload(
          "delete_multiple_folders_and_files",
          undefined,
          payload
        )
      )
    );
  }

  function copyModalSubmitHndlr() {
    if (!hasSelectedResources) {
      toast.error("Please select at least one file or folder");
      return;
    }
    setResourceClipboard({
      action: "COPY",
      sourceFolderId: activeFolderId,
      fileIds: [...selectedFileIds],
      folderIds: [...selectedFolderIds],
    });
    closeCopyBranchStorageFolderFilesModal();
    setSelectedFileIds([]);
    setSelectedFolderIds([]);
    setAllStudentSelectedState(false);
    toast.success(
      `${totalSelectedCount} selected item${totalSelectedCount > 1 ? "s" : ""
      } ready to paste`
    );
  }

  function moveModalSubmitHndlr() {
    if (!hasSelectedResources) {
      toast.error("Please select at least one file or folder");
      return;
    }
    setResourceClipboard({
      action: "MOVE",
      sourceFolderId: activeFolderId,
      fileIds: [...selectedFileIds],
      folderIds: [...selectedFolderIds],
    });
    closeMoveBranchStorageFolderFilesModal();
    setSelectedFileIds([]);
    setSelectedFolderIds([]);
    setAllStudentSelectedState(false);
    toast.success(
      `${totalSelectedCount} selected item${totalSelectedCount > 1 ? "s" : ""
      } ready to move`
    );
  }

  function executeClipboardAction() {
    if (!resourceClipboard) {
      toast.error("No copied or moved resources found");
      return;
    }
    if (!isClipboardDestinationDifferent) {
      toast.error(
        resourceClipboard.action === "COPY"
          ? "Please open a different folder before pasting"
          : "Please open a different folder before moving"
      );
      return;
    }

    const payload = {
      folderIds: resourceClipboard.folderIds,
      fileIds: resourceClipboard.fileIds,
      targetParentFolderId: currentDestinationFolderId,
    };

    if (resourceClipboard.action === "COPY") {
      dispatch(
        copyBranchStorageFolderFilesAct(
          generateActionPayload(
            "copy_branch_storage_folder_files",
            undefined,
            payload
          )
        )
      );
      return;
    }

    dispatch(
      moveBranchStorageFolderFilesAct(
        generateActionPayload(
          "move_branch_storage_folder_files",
          undefined,
          payload
        )
      )
    );
  }

  function revokeManageAccessModalSubmitHndlr() {
    const { resourceType, resourceId } =
      revokeManageAccessModalState.modalData || {};

    if (!resourceType || !resourceId) {
      toast.error("Invalid resource selected");
      return;
    }

    const payload = {
      resourceType,
      resourceId: Number(resourceId),
    };

    dispatch(
      revokeManageAccessAct(
        generateActionPayload(
          "revoke_manage_access",
          {
            resourceType,
            resourceId: Number(resourceId),
          }
        )
      )
    );
  }

  const allStudentCheckHndlr = (event: any) => {
    const checked = event.target.checked;

    setAllStudentSelectedState(checked);

    const fileIds = visibleFiles
      .filter((item: any) => item.type !== "folder")
      .map((item: any) => Number(item.id));

    const folderIds = visibleFiles
      .filter((item: any) => item.type === "folder")
      .map((item: any) => Number(item.folderId));

    if (checked) {
      setSelectedFileIds(fileIds);
      setSelectedFolderIds(folderIds);
    } else {
      setSelectedFileIds([]);
      setSelectedFolderIds([]);
    }
  };

  const singleStudentCheckHndlr = (event: any) => {
    const id = Number(
      event.currentTarget.getAttribute("data-id")
    );
    const name = event.target.name || "";

    const type = name.startsWith("folder-")
      ? "folder"
      : "file";

    if (type === "folder") {
      setSelectedFolderIds((prev) =>
        prev.includes(id)
          ? prev.filter((folderId) => folderId !== id)
          : [...prev, id]
      );
    } else {
      setSelectedFileIds((prev) =>
        prev.includes(id)
          ? prev.filter((fileId) => fileId !== id)
          : [...prev, id]
      );
    }
  };

  const inProgressUploads = totalUploads - completedUploads;
  const progressPercentage =
    totalUploads > 0
      ? (completedUploads / totalUploads) * 100
      : 0;
  const storageInfo = getBranchStorageList?.data?.find(
    (item: any) => item.branchId === Number(branchId)
  );

  const handleRecentFileClick = (item: any) => {
    if (item?.folderId == null || item?.id == null) {
      toast.error("Folder information not found");
      return;
    }

    const folderId = String(item.folderId);
    const fileId = Number(item.id);

    const folderExists = findFolderById(folderTree, folderId);

    if (!folderExists) {
      toast.error("Folder not found in storage response");
      return;
    }

    setSelectedFileIds([]);
    setSelectedFolderIds([]);
    setAllStudentSelectedState(false);
    setActiveFolderId(folderId);
    setActiveFileId(fileId);

    const expandedPath =
      expandFolderPath(folderTree, folderId) || {};

    setExpandedFolders((prev) => ({
      ...prev,
      all: true,
      ...expandedPath,
      [folderId]: true,
    }));

    requestAnimationFrame(() => {
      document
        .getElementById("branch-storage-files-table")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  };

  const handleManageAccess = (row: any) => {
    const id =
      row.type === "folder"
        ? Number(row.folderId)
        : Number(row.id);

    dispatch(resetManageAccessSummaryAct(undefined));

    dispatch(
      getManageAccessSummaryAct(
        generateActionPayload(
          "get_manage_access_summary",
          undefined,
          {
            branchId,
            resourceType:
              row.type === "folder"
                ? "FOLDER"
                : "FILE",
            resourceId: id,
          }
        )
      )
    );

    openManageAccess(id);
  };

  const tableColumns = useMemo(
    () =>
      generateColumns(
        menuOptions,
        moreMenuOptions,
        handleFolderRowOpen,
        editingFolderId,
        setEditingFolderId,
        saveResourceName,
        allStudentCheckHndlr,
        singleStudentCheckHndlr,
        allStudentSelectedState,
        selectedFolderIds,
        totalSelectedCount,
        handleManageAccess,
        activeFolderId !== "all",
        activeFolderId === "all"
      ),
    [
      menuOptions,
      moreMenuOptions,
      handleFolderRowOpen,
      editingFolderId,
      saveResourceName,
      allStudentCheckHndlr,
      singleStudentCheckHndlr,
      allStudentSelectedState,
      selectedFolderIds,
      totalSelectedCount,
      handleManageAccess,
      activeFolderId,
    ]
  );

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Branch Storage" />
          <div
            className={`tw-grid tw-grid-cols-1 tw-mb-5 tw-relative lg:tw-transition-[grid-template-columns] lg:tw-duration-500 lg:tw-ease-in-out
                      ${isFolderPanelCollapsed
                ? "lg:tw-grid-cols-[56px_minmax(0,1fr)]"
                : "lg:tw-grid-cols-[20%_80%]"
              } `}
          >
            <div className="tw-hidden lg:tw-block tw-relative tw-min-w-0 tw-overflow-visible">
              <div className="tw-sticky tw-top-[5px] tw-h-[calc(100vh-125px)] tw-flex tw-flex-col tw-overflow-visible tw-bg-[#F3F6F9]">
                <div className="tw-flex tw-items-center tw-justify-end tw-pe-2 tw-pt-3">
                  <Button
                    variant="sidebarMenu"
                    type="button"
                    title={
                      isFolderPanelCollapsed
                        ? "Expand folder panel"
                        : "Collapse folder panel"
                    }
                    aria-label={
                      isFolderPanelCollapsed
                        ? "Expand folder panel"
                        : "Collapse folder panel"
                    }
                    onClick={() =>
                      setIsFolderPanelCollapsed((prev) => !prev)
                    }
                    className="
            !tw-flex
            !tw-items-center
            !tw-justify-center
            !tw-w-8
            !tw-h-8
            !tw-min-w-8
            !tw-min-h-8
            !tw-p-0
            !tw-leading-none
            !tw-rounded-md
            !tw-border
            !tw-border-slate-200
            !tw-bg-white
            !tw-text-slate-500
            !tw-shadow-sm
            !tw-transition-all
            !tw-duration-200
            !tw-ease-in-out
            hover:!tw-bg-slate-50
            !hover:tw-text-slate-800
            !active:tw-scale-95
          "
                  >
                    <span className="tw-relative tw-flex tw-w-[18px] tw-h-[18px] tw-items-center tw-justify-center">
                      <HugeiconsIcon
                        icon={MenuCollapseIcon}
                        size={18}
                        className={`tw-absolute tw-inset-0 tw-transition-all tw-duration-200 tw-ease-in-out ${isFolderPanelCollapsed
                          ? "tw-opacity-0 tw-scale-75"
                          : "tw-opacity-100 tw-scale-100"
                          }`}
                      />

                      <HugeiconsIcon
                        icon={Menu11Icon}
                        size={18}
                        className={`tw-absolute tw-inset-0 tw-transition-all tw-duration-200 tw-ease-in-out ${isFolderPanelCollapsed
                          ? "tw-opacity-100 tw-scale-100"
                          : "tw-opacity-0 tw-scale-75"
                          }`}
                      />
                    </span>
                  </Button>
                </div>
                <div
                  className={`tw-flex-1 tw-min-h-0 tw-overflow-y-auto !tw-pe-1 tw-pb-4 tw-pt-2
          tw-transition-all tw-duration-300 tw-ease-in-out
          ${isFolderPanelCollapsed
                      ? "tw-opacity-0 tw-pointer-events-none"
                      : "tw-opacity-100"
                    }
        `}
                >
                  <FolderTreeView
                    folderTree={folderTree}
                    activeFolderId={activeTreeFolderId}
                    setActiveFolderId={openFolder}
                    expandedFolders={expandedFolders}
                    setExpandedFolders={setExpandedFolders}
                  />
                </div>
              </div>
            </div>
            <div className="tw-min-w-0 tw-relative tw-transition-all tw-duration-500 tw-ease-in-out">
              <div className="tw-bg-white tw-min-h-full tw-rounded">
                <div className="tw-border-b tw-border-slate-200 tw-px-5 tw-py-3">
                  <div className="tw-flex tw-items-center tw-justify-between">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                      All files
                    </h4>

                    <div className="tw-flex tw-items-center tw-gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        title={
                          showSuggestedFiles
                            ? "Hide suggested files"
                            : "Show suggested files"
                        }
                        aria-label={
                          showSuggestedFiles
                            ? "Hide suggested files"
                            : "Show suggested files"
                        }
                        onClick={() => setShowSuggestedFiles((prev) => !prev)}
                        className="
          !tw-h-9
          !tw-w-9
          !tw-p-0
          !tw-rounded-lg
          tw-flex
          tw-items-center
          tw-justify-center
          tw-transition-all
          tw-duration-300
        "
                      >
                        <HugeiconsIcon
                          icon={
                            showSuggestedFiles
                              ? CancelCircleHalfDotIcon
                              : ViewIcon
                          }
                          className={`text-muted tw-transition-all tw-duration-300 ${showSuggestedFiles
                            ? "tw-rotate-90 tw-scale-100"
                            : "tw-rotate-0 tw-scale-100"
                            }`}
                          size={18}
                        />
                      </Button>

                      {dropDownOption.length > 0 && (
                        <DropDownToggle
                          id="book-collection-dropdown"
                          menuOptions={dropDownOption}
                          btnName="Add New"
                          dropDownClassName="tw-mr-0"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className={`tw-overflow-hidden tw-transition-all tw-duration-500 tw-ease-in-out
                              ${showSuggestedFiles
                    ? "tw-max-h-[350px] tw-opacity-100"
                    : "tw-max-h-0 tw-opacity-0 tw-pointer-events-none"
                  } `}
                >
                  <div className={`tw-border-b tw-border-slate-200 tw-px-5 tw-transition-all tw-duration-500 tw-ease-in-out
                                ${showSuggestedFiles
                      ? "tw-py-5 tw-translate-y-0"
                      : "tw-py-0 -tw-translate-y-3"
                    } `}
                  >
                    <div className={`tw-transition-all tw-duration-500 tw-ease-in-out
                                  ${showSuggestedFiles
                        ? "tw-opacity-100 tw-scale-100"
                        : "tw-opacity-0 tw-scale-[0.98]"
                      } `}
                    >
                      <div className="tw-flex tw-items-center tw-justify-between tw-mb-1">
                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                          Suggested for you
                        </h4>
                      </div>

                      <div className="tw-min-h-0 tw-overflow-hidden">
                        <div className="tw-overflow-x-auto">
                          <div className="tw-overflow-hidden">
                            {suggestedFiles.length === 0 ? (
                              <div className="tw-flex tw-h-[150px] tw-items-center tw-justify-center tw-text-sm tw-text-slate-400">
                                No recent files found
                              </div>
                            ) : (
                              <SuggestedFilesSwiper
                                files={suggestedFiles}
                                onFileClick={handleRecentFileClick}
                                onSwiperMove={() => {
                                  setHoveredRowId(null);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tw-px-5 tw-py-5">
                  <div className="tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-overflow-hidden">
                    <div className="tw-p-4 tw-border-b tw-border-slate-200">
                      <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-pt-1 tw-pb-4">
                        <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap">

                          <BreadCrumbUpdated
                            breadCrumbOptions={folderBreadCrumbOptions as any}
                            extraClass="!tw-pt-6 !tw-mb-0 !tw-border-0 !tw-border-none !tw-shadow-none !tw-text-base !tw-font-semibold"
                          />
                        </div>
                        <div className="tw-flex tw-justify-end tw-flex-shrink-0">
                          <UpdatedHorizontalTab
                            MenuOptions={tabMenuOptions}
                            activeTabId={activeTabId}
                            clickMenuHandler={activeTabHandler}
                            showBadge={false}
                            horizontalClass="horizontal-menu-pill-tabs tw-w-fit tw-ps-4 tw-pb-3"
                          />
                        </div>
                      </div>
                      <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        <div className="tw-col-span-4">
                          <div className="search-box">
                            <TextInput
                              name="searchString"
                              placeHolder="Search documents, folders, users..."
                              value={branchStorageAllFilesFormik.values.searchString}
                              onChange={branchStorageAllFilesFormik.handleChange}
                              formgroupClassName="mb-0"
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>
                        {/* <div className="lg:tw-col-span-2">
                                                <SelectInput
                                                  name="type"
                                                  menuItems={resourceTypeOptions}
                                                  valueKey="id"
                                                  textKey="name"
                                                  value={branchStorageAllFilesFormik.values.type}
                                                  onChange={branchStorageAllFilesFormik.handleChange}
                                                  formgroupClassName="mb-0"
                                                  labelText="Type"
                                                  floatingLabel
                                                />
                                              </div> */}
                        <div className="tw-col-span-2">
                          <SelectInput
                            name="sortBy"
                            menuItems={sortByOptions}
                            valueKey="id"
                            textKey="name"
                            value={branchStorageAllFilesFormik.values.sortBy}
                            onChange={branchStorageAllFilesFormik.handleChange}
                            formgroupClassName="mb-0"
                            labelText="Sort By"
                            floatingLabel
                          />
                        </div>
                        <div className="tw-col-span-2">
                          <SelectInput
                            name="sortOrder"
                            menuItems={sortOrderOptions}
                            valueKey="id"
                            textKey="name"
                            value={branchStorageAllFilesFormik.values.sortOrder}
                            onChange={branchStorageAllFilesFormik.handleChange}
                            formgroupClassName="mb-0"
                            labelText="Sort Order"
                            floatingLabel
                          />
                        </div>
                      </div>

                      {totalSelectedCount > 0 && !resourceClipboard && (
                        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mt-3">
                          <div className="lg:tw-col-span-12 tw-flex tw-justify-end tw-items-center tw-gap-3 tw-whitespace-nowrap">

                            {currentPermissions?.canCopy && (
                              <Button
                                variant="soft"
                                type="button"
                                disabled={showApiLoader}
                                onClick={() => {
                                  if (!hasSelectedResources) {
                                    toast.error("Please select at least one file or folder");
                                    return;
                                  }

                                  openCopyBranchStorageFolderFilesModal();
                                }}
                                className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                              >
                                <HugeiconsIcon icon={Copy01Icon} size={18} />
                                <span>Copy</span>
                              </Button>
                            )}

                            {currentPermissions?.canMove && (
                              <Button
                                variant="hoverInfo"
                                type="button"
                                disabled={showApiLoader}
                                onClick={() => {
                                  if (!hasSelectedResources) {
                                    toast.error("Please select at least one file or folder");
                                    return;
                                  }

                                  openMoveBranchStorageFolderFilesModal();
                                }}
                                className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                              >
                                <HugeiconsIcon icon={Share01Icon} size={18} />
                                <span>Move</span>
                              </Button>
                            )}

                            {showDownloadButton && (
                              <Button
                                variant="info"
                                type="button"
                                disabled={showApiLoader}
                                onClick={openDownloadBranchStorageFilesBulkModel}
                                className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                              >
                                <HugeiconsIcon
                                  icon={Download04Icon}
                                  className="tw-text-white"
                                  size={18}
                                />
                                <span>Download Files</span>
                              </Button>
                            )}

                            {showDeleteButton && (
                              <Button
                                variant="reject"
                                type="button"
                                disabled={showApiLoader}
                                onClick={() =>
                                  openDelFileModal({
                                    type: "bulk",
                                  })
                                }
                                className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                              >
                                <HugeiconsIcon
                                  icon={Delete02StrokeStandard}
                                  size={18}
                                />
                                <span>Delete</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {resourceClipboard && (
                        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mt-3">
                          <div className="lg:tw-col-span-12 tw-flex tw-justify-end tw-items-center tw-gap-3 tw-whitespace-nowrap">

                            {((isCopyClipboard && currentPermissions?.canView) ||
                              (!isCopyClipboard && currentPermissions?.canMove)) && (
                                <Button
                                  variant={isCopyClipboard ? "soft" : "hoverInfo"}
                                  type="button"
                                  disabled={
                                    showApiLoader ||
                                    !isClipboardDestinationDifferent
                                  }
                                  onClick={executeClipboardAction}
                                  className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                                >
                                  <HugeiconsIcon
                                    icon={isCopyClipboard ? Copy01Icon : Share01Icon}
                                    size={18}
                                  />

                                  <span>
                                    {isCopyClipboard ? "Paste" : "Move Here"}
                                  </span>
                                </Button>
                              )}

                            <Button
                              variant="secondary"
                              type="button"
                              disabled={showApiLoader}
                              onClick={() => {
                                setResourceClipboard(null);
                                toast.info("Copy or move operation cancelled");
                              }}
                              className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                            >
                              <span>Cancel</span>
                            </Button>
                          </div>

                          {!isClipboardDestinationDifferent && (
                            <div className="tw-col-span-12 tw-text-right tw-text-xs tw-text-slate-500">
                              Open another folder to{" "}
                              {isCopyClipboard ? "paste" : "move"} the selected items.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <TableContainer
                      columns={tableColumns}
                      data={visibleFiles}
                      divClass="table-responsive tw-mb-0 tw-flex-1 tw-min-h-[500px]"
                      theadClass="table-light text-muted align-middle"
                      showPagination={false}
                    />
                  </div>
                  {canViewMore && (
                    <Button
                      type="button"
                      variant="sidebarMenu"
                      onClick={handleViewMore}
                      className="!tw-mt-4 !tw-ml-1 tw-border-0 tw-bg-transparent tw-p-0 !tw-text-[14.5px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                    >
                      View more
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="upload-files-modal"
        isOpen={uploadFilesModalState.showModal}
        toggle={closeUploadFilesModal}
        modalTitle="Upload Files"
        modalSize="lg"
      >
        <UploadFilesModal
          folderTree={folderTree}
          activeFolderId={modalFolderId}
          setActiveFolderId={setModalFolderId}
          expandedFolders={modalExpandedFolders}
          setExpandedFolders={setModalExpandedFolders}
          onFolderExpand={branchStorageSubFolderByIdApiCall}
          toggle={closeUploadFilesModal}
          setIsUploadingToS3={setIsUploadingToS3}
          setUploadStatus={setUploadStatus}
          setCompletedUploads={setCompletedUploads}
          setTotalUploads={setTotalUploads}
          onUploadSuccess={(folderId: string) => {
            refreshFolderData(folderId);
          }}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="reupload-files-modal"
        isOpen={reUploadFilesModalState.showModal}
        toggle={closeReUploadFilesModal}
        modalTitle="Re-Upload File"
        modalSize="md"
      >
        <ReUploadFilesModal
          modalData={reUploadFilesModalState.modalData}
          toggle={closeReUploadFilesModal}
          setIsUploadingToS3={setIsUploadingToS3}
          setUploadStatus={setUploadStatus}
          setCompletedUploads={setCompletedUploads}
          setTotalUploads={setTotalUploads}
          onUploadSuccess={(folderId: string) => {
            refreshFolderData(folderId);
          }}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="create-new-folder-modal"
        isOpen={createNewFolderModalState.showModal}
        toggle={closeCreateNewFolderModal}
        modalTitle="Create New Folder"
        modalSize="md"
      >
        <CreateNewFolderModal
          id={createNewFolderModalState.modalData}
          folderBreadCrumbOptions={folderBreadCrumbOptions}
          toggle={closeCreateNewFolderModal}
          activeFolderId={activeFolderId}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="view-file-audit-modal"
        isOpen={viewFileAuditModalState.showModal}
        toggle={closeViewFileAuditModal}
        modalTitle="View Audit"
        modalSize="xl"
      >
        <ViewFileAudit
          id={viewFileAuditModalState.modalData?.id}
          toggle={closeViewFileAuditModal}
          fileName={viewFileAuditModalState.modalData?.fileName || ""}
        />
      </ModalContainerUpdated>
      <OffCanvasContainer
        isOpen={open}
        headerTitle="File Name"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-course-directory-list"
        width={900}
        customClass="bg-custom"
      >
        <FolderFileDetailsModal
          closeHndlr={toggleAdvanceFilter}
        />
      </OffCanvasContainer>

      <ConfirmationModal
        id="delete-file"
        isOpen={delFileModalState.showModal}
        confirmMessage="Are you sure you want to delete this File ?"
        cancelHndlr={closeDelFileModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ConfirmationModal
        id="download-files-bulk"
        isOpen={downloadBranchStorageFilesBulkModalState.showModal}
        confirmMessage="Are you sure you want to download Files?"
        cancelHndlr={closeDownloadBranchStorageFilesBulkModal}
        confirmHndlr={downloadStudentIdCardZipHandler}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />

      <ConfirmationModal
        id="revoke-manage-access"
        isOpen={revokeManageAccessModalState.showModal}
        confirmMessage="Are you sure you want to revoke manage access ?"
        cancelHndlr={closeRevokeManageAccessModal}
        confirmHndlr={revokeManageAccessModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ConfirmationModal
        id="copy-file"
        isOpen={copyBranchStorageFolderFilesModalState.showModal}
        confirmMessage={`Are you sure you want to copy ${totalSelectedCount} selected item${totalSelectedCount > 1 ? "s" : ""}?`}
        cancelHndlr={closeCopyBranchStorageFolderFilesModal}
        confirmHndlr={copyModalSubmitHndlr}
        showImgIcon
        isDisble={showApiLoader}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
      <ConfirmationModal
        id="move-file"
        isOpen={moveBranchStorageFolderFilesModalState.showModal}
        confirmMessage={`Are you sure you want to move ${totalSelectedCount} selected item${totalSelectedCount > 1 ? "s" : ""}?`}
        cancelHndlr={closeMoveBranchStorageFolderFilesModal}
        confirmHndlr={moveModalSubmitHndlr}
        showImgIcon
        isDisble={showApiLoader}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
      <ConfirmationModal
        id="favorite-files"
        isOpen={favoriteFilesModalState.showModal}
        confirmMessage="Are you sure you want to add this file to favorites?"
        cancelHndlr={closeFavoriteFilesModal}
        confirmHndlr={favoriteFilesSubmitHandler}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
      <ModalContainerUpdated
        id="userAccess-profile-permissions"
        isOpen={manageFIleAccessModalState.showModal}
        toggle={closeManageFileAccessModal}
        modalTitle={
          manageFIleAccessModalState.modalData ? 'Edit Permission Access' : 'Manage Access'
        }
        modalSize="lg"
      >
        <ManageFileAccess
          isOpen={manageFIleAccessModalState.showModal}
          toggle={() => closeManageFileAccessModal()}
          selectedResources={
            manageFIleAccessModalState.modalData?.selectedResources || []
          }
          selectedNames={
            manageFIleAccessModalState.modalData?.selectedNames || []
          } />
      </ModalContainerUpdated>
      {isUploadingToS3 && (
        <div className="tw-fixed tw-bottom-6 tw-right-6 tw-z-[1050] tw-w-[300px] tw-rounded-xl tw-border tw-border-slate-200 tw-bg-white tw-p-4 tw-shadow-lg">
          <div className="tw-flex tw-items-center tw-gap-3">
            <div className="tw-w-10 tw-h-10 tw-rounded-lg tw-bg-indigo-50 tw-flex tw-items-center tw-justify-center">
              {uploadStatus === "success" ? (
                <i className="ri-checkbox-circle-fill tw-text-green-500 tw-text-xl" />
              ) : uploadStatus === "error" ? (
                <i className="ri-close-circle-fill tw-text-red-500 tw-text-xl" />
              ) : (
                <i className="ri-loader-4-line tw-text-indigo-500 tw-text-xl tw-animate-spin" />
              )}
            </div>
            <div className="tw-min-w-0 tw-flex-1">
              <p className="tw-mb-1 tw-text-[14px] tw-font-bold tw-text-slate-800">
                {uploadStatus === "success"
                  ? "Upload Complete"
                  : uploadStatus === "error"
                    ? "Upload Failed"
                    : "Uploading Files..."}
              </p>
              <p className="tw-mb-2 tw-text-[11px] tw-font-medium tw-text-slate-500">
                {uploadStatus === "success"
                  ? `All ${totalUploads} files uploaded successfully`
                  : uploadStatus === "error"
                    ? "Some files failed to upload"
                    : `${completedUploads} of ${totalUploads} complete • ${inProgressUploads} in progress`}
              </p>
              <div className="tw-h-1 tw-w-full tw-rounded-full tw-bg-slate-100 tw-overflow-hidden">
                <div
                  className="tw-h-full tw-rounded-full tw-bg-emerald-500 tw-transition-all"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AllFilesStorage;
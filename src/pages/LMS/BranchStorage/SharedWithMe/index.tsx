import { useFormik } from 'formik';
import { Button, ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, TextInput } from '../../../../Components/Common';
import BreadCrumb, { BreadCrumbUpdated } from '../../../../Components/Common/BreadCrumb';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { deleteMultipleFoldersAndFilesAct, getBranchStorageFoldersByIdAct, getBranchStorageSharedWithMeFilesAct, getManageAccessSummaryAct, getPreviewFolderFileDetailsAct, resetManageAccessSummaryAct, saveBranchStorageFavoriteFilesAct } from '../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftDoubleIcon, Delete02StrokeStandard, EyeIcon, FileUploadIcon, Home01Icon } from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../hooks/modalhook';
import ReUploadFilesModal from '../AllFilesStorage/ReUploadFilesModal';
import { FolderFileDetailsModal } from '../AllFilesStorage/FolderFileDetailsModal';
import { StarIcon as StarSolidIcon } from "@hugeicons-pro/core-solid-standard";
import { StarIcon as StarStrokeIcon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  searchString: '',
  branchTypeId: '',
  acdemicYearId: '',
};

const SharedWithMe = () => {

  const dispatch = useAppDispatch();

  const sharedWithMeFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });
  const INITIAL_VISIBLE_ROWS = 10;
  const { openModal: openReUploadFilesModal, closeModal: closeReUploadFilesModal, modalState: reUploadFilesModalState } = useModal();
  const { closeModal: closeDelFileModal, modalState: delFileModalState, openModal: openDelFileModal } = useModal();
  const { openModal: openFavoriteFilesModel, closeModal: closeFavoriteFilesModal, modalState: favoriteFilesModalState } = useModal();

  const [isUploadingToS3, setIsUploadingToS3] = useState(false);

  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const [completedUploads, setCompletedUploads] = useState(0);
  const [totalUploads, setTotalUploads] = useState(0);
  const [visibleRowsCount, setVisibleRowsCount] = useState(INITIAL_VISIBLE_ROWS);

  const inProgressUploads = totalUploads - completedUploads;

  const progressPercentage =
    totalUploads > 0
      ? (completedUploads / totalUploads) * 100
      : 0;

  const [folderHistory, setFolderHistory] = useState<{ id: number; name: string }[]>([]);
  const [isInsideFolder, setIsInsideFolder] = useState(false);
  const [activePreviewFileId, setActivePreviewFileId] = useState<number | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [favoriteResource, setFavoriteResource] = useState<any>(null);

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  const branchStorageSharedWithMeApiCall = () => {
    dispatch(
      getBranchStorageSharedWithMeFilesAct(
        generateActionPayload(
          "get_branch_storage_shared_with_me_files",
          undefined,
          {
            instituteId,
            branchId,
          }
        )
      )
    );
  };


  const branchStorageFolderByIdApiCall = (folderId: number) => {
    dispatch(
      getBranchStorageFoldersByIdAct(
        generateActionPayload(
          "get_branch_storage_folders_by_id",
          { id: folderId }
        )
      )
    );
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getBranchStorageSharedWithMeFilesResp,
    getBranchStorageFoldersByIdList,
    saveBranchStorageFavoriteFilesResp,
    deleteMultipleFoldersAndFilesResp,
    branchStorageManagementErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageManagement, login, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getBranchStorageSharedWithMeFilesResp: branchStorageManagement.getBranchStorageSharedWithMeFilesResp,
      getBranchStorageFoldersByIdList: branchStorageManagement.getBranchStorageFoldersByIdList,
      saveBranchStorageFavoriteFilesResp: branchStorageManagement.saveBranchStorageFavoriteFilesResp,
      deleteMultipleFoldersAndFilesResp: branchStorageManagement.deleteMultipleFoldersAndFilesResp,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevBranchStorageManagementErrorAct: branchStorageManagementErrorAct,
    prevSaveBranchStorageFavoriteFilesResp: saveBranchStorageFavoriteFilesResp,
    prevDeleteMultipleFoldersAndFilesResp: deleteMultipleFoldersAndFilesResp,
  });

  useEffect(() => {
    const { prevBranchStorageManagementErrorAct, prevSaveBranchStorageFavoriteFilesResp, prevDeleteMultipleFoldersAndFilesResp } = branchWiseNetPaidByDateRef.current;
    if (branchStorageManagementErrorAct && branchStorageManagementErrorAct !== prevBranchStorageManagementErrorAct) {
      const { details, ERROR } = branchStorageManagementErrorAct || {}
      toast.error(ERROR || "Something went wrong");
    } else if (saveBranchStorageFavoriteFilesResp && prevSaveBranchStorageFavoriteFilesResp !== saveBranchStorageFavoriteFilesResp) {
      toast.success(favoriteResource?.isFavorite ? "Removed from Favorites successfully." : "Added to Favorites successfully.");
      closeFavoriteFilesModal();
      setFavoriteResource(null);
      if (folderHistory.length === 0) {
        branchStorageSharedWithMeApiCall();
      } else {
        branchStorageFolderByIdApiCall(
          folderHistory[folderHistory.length - 1].id
        );
      }
    } else if (deleteMultipleFoldersAndFilesResp && prevDeleteMultipleFoldersAndFilesResp !== deleteMultipleFoldersAndFilesResp) {
      toast.success("File Deleted successfully");
      closeDelFileModal();
      if (folderHistory.length === 0) {
        branchStorageSharedWithMeApiCall();
      } else {
        branchStorageFolderByIdApiCall(
          folderHistory[folderHistory.length - 1].id
        );
      }
    }
    branchWiseNetPaidByDateRef.current.prevBranchStorageManagementErrorAct = branchStorageManagementErrorAct;
    branchWiseNetPaidByDateRef.current.prevSaveBranchStorageFavoriteFilesResp = saveBranchStorageFavoriteFilesResp;
    branchWiseNetPaidByDateRef.current.prevDeleteMultipleFoldersAndFilesResp = deleteMultipleFoldersAndFilesResp;
  }, [branchStorageManagementErrorAct, saveBranchStorageFavoriteFilesResp, deleteMultipleFoldersAndFilesResp]);

  useEffect(() => {
    if (instituteId) {
      branchStorageSharedWithMeApiCall();
    }
  }, [instituteId, branchId, sharedWithMeFormik.values.searchString]);

  const sharedItems = useMemo(() => {
    const folders = Array.isArray(getBranchStorageSharedWithMeFilesResp?.folders) ? getBranchStorageSharedWithMeFilesResp.folders.map(
      (folder: any) => ({
        ...folder,
        id: Number(folder.id),
        folderId: String(folder.id),
        type: "folder",
        originalFileName: folder.name,
        fileName: folder.name,
        sizeBytes: Number(
          folder.sizeBytes ?? folder.size ?? 0
        ),
        permissions: folder.permissions || {},
      })
    )
      : [];

    const files = Array.isArray(getBranchStorageSharedWithMeFilesResp?.files) ? getBranchStorageSharedWithMeFilesResp.files.map(
      (file: any) => ({
        ...file,
        id: Number(file.id),
        folderId: String(file.folderId),
        type: "file",
        fileType:
          file.extension?.toLowerCase() ||
          file.fileType?.toLowerCase() ||
          "file",
        originalFileName:
          file.originalFileName ||
          file.logicalName ||
          file.fileName,
        sizeBytes: Number(
          file.sizeBytes ?? file.size ?? 0
        ),
        permissions: file.permissions || {},
      })
    )
      : [];

    return [...folders, ...files];
  }, [getBranchStorageSharedWithMeFilesResp]);
  const filteredFiles = useMemo(() => {
    const searchString =
      sharedWithMeFormik.values.searchString
        .trim()
        .toLowerCase();

    if (!searchString) {
      return sharedItems;
    }

    return sharedItems.filter((file: any) =>
      [
        file.originalFileName,
        file.fromBranchName,
        file.grantedByName,
        file.folderPath,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(searchString)
    );
  }, [
    sharedItems,
    sharedWithMeFormik.values.searchString,
  ]);

  const visibleFiles = useMemo(() => {
    return filteredFiles.slice(0, visibleRowsCount);
  }, [filteredFiles, visibleRowsCount]);

  const isShowingAll = visibleRowsCount >= filteredFiles.length;

  const handleViewMoreLess = () => {
    setVisibleRowsCount(
      isShowingAll ? INITIAL_VISIBLE_ROWS : filteredFiles.length
    );
  };

  const currentRootSharedFolder = useMemo(() => {
    if (!folderHistory.length) {
      return null;
    }

    const rootFolderId = folderHistory[0].id;

    return getBranchStorageSharedWithMeFilesResp?.folders?.find(
      (folder: any) =>
        Number(folder.id) === Number(rootFolderId)
    ) || null;
  }, [folderHistory, getBranchStorageSharedWithMeFilesResp]);

  const currentRootFolderPermissions =
    currentRootSharedFolder?.permissions || null;

  const tableData = useMemo(() => {
    if (!isInsideFolder) {
      return visibleFiles;
    }

    const childFolders = Array.isArray(
      getBranchStorageFoldersByIdList?.childFolders
    )
      ? getBranchStorageFoldersByIdList.childFolders.map(
        (folder: any) => ({
          ...folder,

          id: Number(folder.id),
          folderId: String(folder.id),
          type: "folder",

          originalFileName: folder.name,
          fileName: folder.name,

          sizeBytes: Number(
            folder.sizeBytes ?? folder.size ?? 0
          ),

          permissions:
            folder.permissions ||
            currentRootSharedFolder?.permissions ||
            {},

          fromBranchName:
            folder.fromBranchName ||
            currentRootSharedFolder?.fromBranchName ||
            "-",

          grantedByName:
            folder.grantedByName ||
            currentRootSharedFolder?.grantedByName ||
            "-",

          grantedAt:
            folder.grantedAt ||
            currentRootSharedFolder?.grantedAt ||
            null,

          fromBranchId:
            folder.fromBranchId ||
            currentRootSharedFolder?.fromBranchId,

          fromInstituteId:
            folder.fromInstituteId ||
            currentRootSharedFolder?.fromInstituteId,

          fromInstituteName:
            folder.fromInstituteName ||
            currentRootSharedFolder?.fromInstituteName,

          folderPath:
            folder.folderPath ||
            currentRootSharedFolder?.folderPath ||
            "",
        })
      )
      : [];

    const childFiles = Array.isArray(
      getBranchStorageFoldersByIdList?.files
    )
      ? getBranchStorageFoldersByIdList.files.map(
        (file: any) => ({
          ...file,

          id: Number(file.id),
          folderId: String(file.folderId),
          type: "file",

          fileType:
            file.extension?.toLowerCase() ||
            file.fileType?.toLowerCase() ||
            "file",

          originalFileName:
            file.originalFileName ||
            file.logicalName ||
            file.fileName,

          permissions:
            file.permissions ||
            currentRootSharedFolder?.permissions ||
            {},

          fromBranchName:
            file.fromBranchName ||
            currentRootSharedFolder?.fromBranchName ||
            "-",

          grantedByName:
            file.grantedByName ||
            currentRootSharedFolder?.grantedByName ||
            "-",

          grantedAt:
            file.grantedAt ||
            currentRootSharedFolder?.grantedAt ||
            null,

          fromBranchId:
            file.fromBranchId ||
            currentRootSharedFolder?.fromBranchId,

          fromInstituteId:
            file.fromInstituteId ||
            currentRootSharedFolder?.fromInstituteId,

          fromInstituteName:
            file.fromInstituteName ||
            currentRootSharedFolder?.fromInstituteName,

          folderPath:
            file.folderPath ||
            currentRootSharedFolder?.folderPath ||
            "",
        })
      )
      : [];


    return [...childFolders, ...childFiles];
  }, [isInsideFolder, visibleFiles, getBranchStorageFoldersByIdList, currentRootSharedFolder]);

  const moreMenuOptions = useMemo(
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

          const [type, id] =
            (event.currentTarget.getAttribute("data-id") || "").split("-");

          const selectedItem =
            type === "folder"
              ? tableData.find((x: any) => x.type === "folder" && Number(x.id) === Number(id))
              : tableData.find((x: any) => x.type !== "folder" && Number(x.id) === Number(id));
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
          const [, id] =
            (event.currentTarget.getAttribute("data-id") || "").split("-");
          const source = isInsideFolder ? tableData : filteredFiles;

          const selectedFile = source.find(
            (item: any) => Number(item.id) === Number(id)
          );

          if (!selectedFile) {
            toast.error("File not found");
            return;
          }

          openReUploadFilesModal({
            id: Number(selectedFile.id),
            folderId: String(selectedFile.folderId),
            path:
              selectedFile.folderPath ||
              selectedFile.path ||
              "-",
            fileName:
              selectedFile.originalFileName ||
              selectedFile.fileName,
          });
        },
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

          const id = Number(resourceId);
          const selectedItem = filteredFiles.find(
            (item: any) =>
              Number(item.id) === id ||
              Number(item.folderId) === id
          );
          if (!selectedItem) return;
          setFavoriteResource({
            id,
            isFavorite: selectedItem.isFavorite,
            resourceType: resourceType === "folder" ? "FOLDER" : "FILE",
          });
          openFavoriteFilesModel(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger tw-me-2" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const [type, id] =
            (event.currentTarget.getAttribute("data-id") || "").split("-");
          openDelFileModal({
            id: Number(id),
            type,
          });
          const folder = filteredFiles?.find(
            (item: any) =>
              item.type === "folder" &&
              Number(item.folderId) === id
          );
        },
      }
    ],
    [filteredFiles]
  );

  const handleFolderClick = (row: any) => {
    if (row.type !== "folder") return;

    setFolderHistory(prev => [
      ...prev,
      {
        id: row.id,
        name: row.originalFileName || row.fileName || row.name,
      },
    ]);

    setIsInsideFolder(true);
    branchStorageFolderByIdApiCall(row.id);
  };

  const handlePrevious = () => {
    if (folderHistory.length <= 1) {
      setFolderHistory([]);
      setIsInsideFolder(false);
      branchStorageSharedWithMeApiCall();
      return;
    }
    const updated = folderHistory.slice(0, -1);
    setFolderHistory(updated);
    branchStorageFolderByIdApiCall(
      updated[updated.length - 1].id
    );
  };

  const breadCrumbOptions = useMemo(() => {
    const items: any[] = [
      {
        id: "shared",
        breadcrumbLabel: "Shared With Me",
        redirectUrl: "#",
      },
    ];
    folderHistory.forEach(folder => {
      items.push({
        id: folder.id,
        breadcrumbLabel: folder.name,
        redirectUrl: "#",
      });
    });

    return items;
  }, [folderHistory]);

  const handleMain = () => {
    setFolderHistory([]);
    setIsInsideFolder(false);
    branchStorageSharedWithMeApiCall();
  };

  const selectedPreviewFile = useMemo(() => {
    return filteredFiles.find(
      (item: any) => Number(item.id) === Number(activePreviewFileId)
    );
  }, [filteredFiles, activePreviewFileId]);

  function delModalSubmitHndlr() {
    const { id, type } =
      delFileModalState.modalData || {};

    const payload = {
      fileIds: type === "file" ? [Number(id)] : [],
      folderIds: type === "folder" ? [Number(id)] : [],
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

  useEffect(() => {
    setVisibleRowsCount(INITIAL_VISIBLE_ROWS);
  }, [sharedWithMeFormik.values.searchString]);

  const tableColumns = useMemo(() => generateColumns(moreMenuOptions, handleFolderClick), [moreMenuOptions, getBranchStorageSharedWithMeFilesResp]);

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <div className='tw-mb-4'>
            <BreadCrumbUpdated
              breadCrumbOptions={breadCrumbOptions as any}
              disableNavigation={true}
              extraClass="!tw-text-[14px] !tw-font-normal !tw-pt-3 !tw-mb-0 !tw-border-0 !tw-border-none !tw-shadow-none"
            />
          </div>
          <div className="tw-card">
            <div className="tw-card-header tw-pb-0">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
                <h4 className="tw-card-title">Shared With Me</h4>
              </div>
            </div>
            <div className="tw-card-body">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-4">
                <div className="lg:tw-col-span-4">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      placeHolder="Search..."
                      value={sharedWithMeFormik.values.searchString}
                      onChange={sharedWithMeFormik.handleChange}
                      formgroupClassName="mb-0"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="lg:tw-col-start-12 tw-justify-self-end">
                  <div className="tw-flex tw-items-center tw-gap-2">
                    {/* <div>
                      <UpdatedHorizontalTab
                        MenuOptions={viewMenuOptions}
                        clickMenuHandler={activeViewHandler}
                        activeTabId={activeViewId}
                        horizontalClass="tw-flex tw-justify-end tw-gap-2 horizontal-menu-updated-style"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
              {isInsideFolder && (
                <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                  <Button
                    type="button"
                    variant="linkBtn"
                    onClick={handleMain}
                    className="!tw-py-0"
                  >
                    <HugeiconsIcon icon={Home01Icon} size={20} />
                    <span className="tw-ml-1">Home</span>
                  </Button>

                  {folderHistory.length > 1 && (
                    <Button
                      type="button"
                      variant="linkBtn"
                      onClick={handlePrevious}
                      className="!tw-py-0"
                    >
                      <HugeiconsIcon icon={ArrowLeftDoubleIcon} size={20} />
                      <span className="tw-ml-1">Previous</span>
                    </Button>
                  )}
                </div>
              )}
              <div>
                <TableContainer
                  columns={tableColumns}
                  data={tableData}
                  divClass="tw-border tw-rounded-lg  tw-overflow-hidden table-responsive tw-mb-3"
                  theadClass="table-light text-muted align-middle"
                ></TableContainer>
              </div>
              {filteredFiles.length > INITIAL_VISIBLE_ROWS && (
                <Button
                  type="button"
                  variant="sidebarMenu"
                  onClick={handleViewMoreLess}
                  className="!tw-mt-4 !tw-ml-1 tw-border-0 tw-bg-transparent tw-p-0 !tw-text-[14.5px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                >
                  {isShowingAll ? "View less" : "View more"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="shared-with-me-reupload-files-modal"
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
          onUploadSuccess={() => {
            if (folderHistory.length === 0) {
              branchStorageSharedWithMeApiCall();
            } else {
              branchStorageFolderByIdApiCall(
                folderHistory[folderHistory.length - 1].id
              );
            }
          }}
        />
      </ModalContainerUpdated>
      <OffCanvasContainer
        isOpen={open}
        headerTitle={selectedPreviewFile?.fileName || "File Details"}
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-course-directory-list"
        width={900}
        customClass="bg-custom"
      >
        <FolderFileDetailsModal
          closeHndlr={toggleAdvanceFilter}
          fileId={activePreviewFileId}
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
        id="favorite-files"
        isOpen={favoriteFilesModalState.showModal}
        confirmMessage="Are you sure you want to add this file to favorites?"
        cancelHndlr={closeFavoriteFilesModal}
        confirmHndlr={favoriteFilesSubmitHandler}
        showImgIcon={true}
        iconType='approve'
        btnClassName='btn w-sm btn-success'
      />
    </>
  );
};

export default SharedWithMe;

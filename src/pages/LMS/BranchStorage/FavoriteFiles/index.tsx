import { useFormik } from 'formik';
import { ConfirmationModal, OffCanvasContainer, TextInput } from '../../../../Components/Common';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import Button from '../../../../Components/Common/Button';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { toast } from 'react-toastify';
import { shallowEqual } from 'react-redux';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowLeftDoubleIcon, ArrowUp01Icon, DatabaseRestoreIcon, EyeIcon, Home01Icon } from '@hugeicons-pro/core-stroke-standard';
import { getBranchStorageFavoriteFilesAct, getBranchStorageFoldersByIdAct, getLoginBasedFavoritesFilesAct, getManageAccessSummaryAct, getPreviewFolderFileDetailsAct, resetManageAccessSummaryAct, saveBranchStorageFavoriteFilesAct } from '../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions';
import { FolderFileDetailsModal } from '../AllFilesStorage/FolderFileDetailsModal';
import { StarIcon as StarSolidIcon } from "@hugeicons-pro/core-solid-standard";
import { StarIcon as StarStrokeIcon } from "@hugeicons-pro/core-stroke-standard";
import { useModal } from '../../../../hooks/modalhook';

const initialValues = {
  searchString: '',
};

const FavoriteFiles = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [folderHistory, setFolderHistory] = useState<{ id: number; name: string }[]>([]);
  const [isInsideFolder, setIsInsideFolder] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [favoriteResource, setFavoriteResource] = useState<any>(null);
  const [activePreviewFileId, setActivePreviewFileId] = useState<number | null>(null);
  const { openModal: openFavoriteFilesModel, closeModal: closeFavoriteFilesModal, modalState: favoriteFilesModalState } = useModal();

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };
  const branchStorageFavoriteFilesApiCall = () => {
    dispatch(
      getBranchStorageFavoriteFilesAct(
        generateActionPayload(
          "get_branch_storage_favorite_files",
          undefined,
          {
            instituteId,
            branchId,
          }
        )
      )
    );
  };

  const otherStorageFavoriteFilesApiCall = () => {
    dispatch(
      getLoginBasedFavoritesFilesAct(
        generateActionPayload(
          "get_login_based_favorite_files",
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
    getBranchStorageFavoriteFilesResp,
    getLoginBasedStorageFavoriteFilesResp,
    loggedInUserRole,
    virtualRoleResp,
    saveBranchStorageFavoriteFilesResp,
    getBranchStorageFoldersByIdList,
    branchStorageManagementErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageManagement, login, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getBranchStorageFavoriteFilesResp: branchStorageManagement.getBranchStorageFavoriteFilesResp,
      getLoginBasedStorageFavoriteFilesResp: branchStorageManagement.getLoginBasedStorageFavoriteFilesResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
      saveBranchStorageFavoriteFilesResp: branchStorageManagement.saveBranchStorageFavoriteFilesResp, getBranchStorageFoldersByIdList: branchStorageManagement.getBranchStorageFoldersByIdList,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevSaveBranchStorageFavoriteFilesResp: saveBranchStorageFavoriteFilesResp,
    prevBranchStorageManagementErrorAct: branchStorageManagementErrorAct,
  });

  useEffect(() => {
    const { prevSaveBranchStorageFavoriteFilesResp, prevBranchStorageManagementErrorAct } =
      branchWiseNetPaidByDateRef.current;
    if (saveBranchStorageFavoriteFilesResp && prevSaveBranchStorageFavoriteFilesResp !== saveBranchStorageFavoriteFilesResp) {
      toast.success(favoriteResource?.isFavorite ? "Removed from Favorites successfully." : "Added to Favorites successfully.");
      closeFavoriteFilesModal();
      setFavoriteResource(null);
      if (folderHistory.length === 0) {
        if (
          loggedInUserRole === "INSTITUTE_ADMIN" ||
          loggedInUserRole === "BRANCH_ADMIN"
        ) {
          branchStorageFavoriteFilesApiCall();
        } else {
          otherStorageFavoriteFilesApiCall();
        }
      } else {
        branchStorageFolderByIdApiCall(
          folderHistory[folderHistory.length - 1].id
        );
      }
    } else if (branchStorageManagementErrorAct && branchStorageManagementErrorAct !== prevBranchStorageManagementErrorAct) {
      const { details } = branchStorageManagementErrorAct || {}
      toast.error(details || "Something went wrong");
    }
    branchWiseNetPaidByDateRef.current.prevSaveBranchStorageFavoriteFilesResp = saveBranchStorageFavoriteFilesResp;
    branchWiseNetPaidByDateRef.current.prevBranchStorageManagementErrorAct = branchStorageManagementErrorAct;
  }, [saveBranchStorageFavoriteFilesResp, branchStorageManagementErrorAct]);

  const favoriteFilesFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });

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

    if (
      loggedInUserRole === "INSTITUTE_ADMIN" ||
      loggedInUserRole === "BRANCH_ADMIN"
    ) {
      branchStorageFolderByIdApiCall(row.id);
    } else {
      branchStorageFolderByIdApiCall(row.id);
    }
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

  useEffect(() => {
    if (instituteId && branchId) {
      if (
        loggedInUserRole === "INSTITUTE_ADMIN" ||
        loggedInUserRole === "BRANCH_ADMIN"
      ) {
        branchStorageFavoriteFilesApiCall();
      } else {
        otherStorageFavoriteFilesApiCall();
      }
    }
  }, [instituteId, branchId, loggedInUserRole]);

  const handleFavoriteClick = (
    event: any,
    row: any
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (row?.id == null || !row?.type) {
      console.error("Invalid favorite item:", row);
      return;
    }

    setFavoriteResource({
      id: Number(row.id),

      resourceType:
        String(row.type).toLowerCase() === "folder"
          ? "FOLDER"
          : "FILE",

      isFavorite:
        row.isFavorite !== undefined
          ? Boolean(row.isFavorite)
          : Boolean(row.favoriteId),
    });

    openFavoriteFilesModel(Number(row.id));
  };

  const menuOptions = useMemo(
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
          const rawRowId =
            event.currentTarget.getAttribute("data-id") || "";

          const [resourceType, resourceId] = rawRowId.split("-");
          const fileId = Number(resourceId);

          setActivePreviewFileId(fileId);

          dispatch(resetManageAccessSummaryAct(undefined));

          dispatch(
            getManageAccessSummaryAct(
              generateActionPayload(
                "get_manage_access_summary",
                undefined,
                {
                  branchId,
                  resourceType:
                    resourceType === "folder" ? "FOLDER" : "FILE",
                  resourceId: fileId,
                }
              )
            )
          );

          dispatch(
            getPreviewFolderFileDetailsAct(
              generateActionPayload(
                "preview_folder_file_details",
                { id: fileId }
              )
            )
          );

          toggleAdvanceFilter();
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
          row.isFavorite ? "Remove Favorite" : "Add Favorite",

        onClickHndlr: handleFavoriteClick,
      }
    ],
    [getBranchStorageFavoriteFilesResp]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [favoriteFilesFormik.values.searchString]);

  const tableColumns = useMemo(() => generateColumns(menuOptions, handleFolderClick), [menuOptions, getBranchStorageFavoriteFilesResp]);

  const favoriteResponse =
    loggedInUserRole === "INSTITUTE_ADMIN" ||
      loggedInUserRole === "BRANCH_ADMIN"
      ? getBranchStorageFavoriteFilesResp
      : getLoginBasedStorageFavoriteFilesResp;

  const FavoriteFiles = useMemo(() => {
    if (!Array.isArray(favoriteResponse?.items)) return [];

    return favoriteResponse.items.map((item: any) => {
      if (item.resourceType === "FILE") {
        const file = item.file;

        return {
          id: file.id,
          type: "file",
          favoriteId: item.favoriteId,

          originalFileName: file.originalFileName || file.logicalName,
          createdByName: file.createdByName,
          categoryName: file.categoryName,
          createdAt: file.createdAt,
          updatedByName: file.updatedByName,
          updatedAt: file.updatedAt,
          modifiedAgo: file.modifiedAgo,
          size: file.sizeFormatted,

          folderPath: file.folderPath,
          extension: file.extension,
          isFavorite: file.isFavorite,
          isShared: file.isShared,

          original: file,
        };
      }

      const folder = item.folder;

      return {
        id: folder.id,
        type: "folder",
        favoriteId: item.favoriteId,

        originalFileName: folder.folderName,
        createdByName: folder.createdByName,
        categoryName: folder.categoryName,
        createdAt: folder.createdAt,
        updatedByName: folder.updatedByName,
        updatedAt: folder.updatedAt,
        modifiedAgo: folder.modifiedAgo,
        size: folder.sizeFormatted,

        folderPath: folder.folderPath,
        hasChildren: folder.hasChildren,

        original: folder,
      };
    });
  }, [favoriteResponse]);

  const visibleFavoriteFiles = useMemo(() => {
    return FavoriteFiles.slice(0, visibleCount);
  }, [FavoriteFiles, visibleCount]);

  const tableData = useMemo(() => {
    let data: any[] = [];

    if (!isInsideFolder) {
      data = visibleFavoriteFiles;
    } else {
      const childFolders = Array.isArray(getBranchStorageFoldersByIdList?.childFolders)
        ? getBranchStorageFoldersByIdList.childFolders.map((folder: any) => ({
          ...folder,
          id: Number(folder.id),
          type: "folder",
          originalFileName: folder.name,
          fileName: folder.name,
          size: "-",
          isFavorite: folder.isFavorite,
          favoriteId: folder.favoriteId,
        }))
        : [];

      const childFiles = Array.isArray(getBranchStorageFoldersByIdList?.files)
        ? getBranchStorageFoldersByIdList.files.map((file: any) => ({
          ...file,
          id: Number(file.id),
          type: "file",
          originalFileName:
            file.originalFileName || file.logicalName || file.fileName,
          size: file.sizeFormatted,
          isFavorite: file.isFavorite,
          favoriteId: file.favoriteId,
        }))
        : [];

      data = [...childFolders, ...childFiles];
    }

    const search = favoriteFilesFormik.values.searchString.trim().toLowerCase();

    if (!search) return data;

    return data.filter((item: any) =>
      [
        item.originalFileName,
        item.createdByName,
        item.updatedByName,
        item.folderPath,
        item.extension,
        item.type,
      ]
        .filter(Boolean)
        .some((value: string) =>
          value.toLowerCase().includes(search)
        )
    );
  }, [
    isInsideFolder,
    visibleFavoriteFiles,
    getBranchStorageFoldersByIdList,
    favoriteFilesFormik.values.searchString,
  ]);

  const selectedPreviewFile = useMemo(
    () =>
      tableData.find(
        (item: any) => Number(item.id) === Number(activePreviewFileId)
      ),
    [tableData, activePreviewFileId]
  );
  const handlePrevious = () => {
    if (folderHistory.length <= 1) {
      setFolderHistory([]);
      setIsInsideFolder(false);

      if (
        loggedInUserRole === "INSTITUTE_ADMIN" ||
        loggedInUserRole === "BRANCH_ADMIN"
      ) {
        branchStorageFavoriteFilesApiCall();
      } else {
        otherStorageFavoriteFilesApiCall();
      }

      return;
    }

    const updated = folderHistory.slice(0, -1);
    setFolderHistory(updated);

    branchStorageFolderByIdApiCall(
      updated[updated.length - 1].id
    );
  };

  const handleMain = () => {
    setFolderHistory([]);
    setIsInsideFolder(false);

    if (
      loggedInUserRole === "INSTITUTE_ADMIN" ||
      loggedInUserRole === "BRANCH_ADMIN"
    ) {
      branchStorageFavoriteFilesApiCall();
    } else {
      otherStorageFavoriteFilesApiCall();
    }
  };

  const showViewMore = visibleCount < FavoriteFiles.length;
  const showViewLess = visibleCount > PAGE_SIZE;

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Branch Storage" />
          <div className="tw-card">
            <div className="tw-card-header tw-pb-0">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
                <h4 className="tw-card-title">Favorite Files</h4>
              </div>
            </div>
            <div className="tw-card-body">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-4">
                <div className="lg:tw-col-span-4">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      placeHolder="Search..."
                      value={favoriteFilesFormik.values.searchString}
                      onChange={favoriteFilesFormik.handleChange}
                      formgroupClassName="mb-0"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="lg:tw-col-start-12 tw-justify-self-end">
                  <div className="tw-flex tw-items-center tw-gap-2">
                  </div>
                </div>
              </div>
              {isInsideFolder && (
                <div className="tw-flex tw-items-center tw-gap-2 tw-mb-2">
                  <Button
                    type="button"
                    variant="linkBtn"
                    onClick={handleMain}
                    className="!tw-p-0"
                  >
                    <HugeiconsIcon icon={Home01Icon} size={20} />
                    <span>Home</span>
                  </Button>

                  {folderHistory.length > 1 && (
                    <Button
                      type="button"
                      variant="linkBtn"
                      onClick={handlePrevious}
                      className="!tw-p-0"
                    >
                      <HugeiconsIcon icon={ArrowLeftDoubleIcon} size={20} />
                      <span>Previous</span>
                    </Button>
                  )}
                </div>
              )}
              <div>
                <TableContainer
                  columns={tableColumns}
                  data={tableData}
                  divClass="tw-border tw-rounded-lg tw-overflow-hidden table-responsive tw-mb-3"
                  theadClass="table-light text-muted align-middle"
                />
              </div>
              <div className="tw-flex tw-justify-end tw-gap-3 tw-pe-2 tw-mt-4">
                {showViewMore && (
                  <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + PAGE_SIZE, FavoriteFiles.length)
                      )
                    }
                    className="!tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                  >
                    <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
                    View More
                  </Button>
                )}

                {showViewLess && (
                  <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.max(prev - PAGE_SIZE, PAGE_SIZE)
                      )
                    }
                    className="!tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                  >
                    <HugeiconsIcon icon={ArrowUp01Icon} size={18} />
                    View Less
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <OffCanvasContainer
        isOpen={open}
        headerTitle={selectedPreviewFile?.originalFileName || "File Details"}
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
        id="favorite-files"
        isOpen={favoriteFilesModalState.showModal}
        confirmMessage={
          favoriteResource?.isFavorite
            ? "Are you sure you want to remove this item from favorites?"
            : "Are you sure you want to add this item to favorites?"
        }
        cancelHndlr={closeFavoriteFilesModal}
        confirmHndlr={favoriteFilesSubmitHandler}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
    </>
  );
};

export default FavoriteFiles;

import { useEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { deleteMultipleFoldersAndFilesAct, getBranchStorageManagementDetailsAct, getBranchStorageManagementFileTypeCatogeryDetailsAct, getBranchStorageManagementFileTypeDetailsAct, getManageAccessSummaryAct, getPreviewFolderFileDetailsAct, resetBranchStorageManagementFileTypeDetailsAct, resetManageAccessSummaryAct } from '../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon, Image01Icon, Video01Icon, FileUnknownIcon, FileSearchIcon, ClockIcon, FileRemoveIcon, EyeIcon, Delete02StrokeStandard } from '@hugeicons-pro/core-stroke-standard';
import { getBranchStorageAct } from '../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { Button, ConfirmationModal, OffCanvasContainer, SelectInput } from '../../../../Components/Common';
import { generateColumns, largeFileSizeMbOptions, monthOptions } from './helper';
import TableContainer from '../../../../Components/Common/TableContainer';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { useFormik } from 'formik';
import { useModal } from '../../../../hooks/modalhook';
import { FolderFileDetailsModal } from '../AllFilesStorage/FolderFileDetailsModal';

const initialValues = {
  largeFileSizeMb: "50",
  oldFileMonths: "",
}

const StorageManagementDashboard = () => {

  const dispatch = useAppDispatch();
  const selectedCleanup = useRef<{ type: string; title: string; isCategory?: boolean;} | null>(null);
  const [activePreviewFileId, setActivePreviewFileId] = useState<number | null>(null);
  const { closeModal: closeDelFileModal, modalState: delFileModalState, openModal: openDelFileModal } = useModal();
  const [open, setOpen] = useState<boolean>(false);

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const branchStorageAllFilesFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getBranchStorageList,
    getBranchStorageManagementDetailsResp,
    getBranchStorageManagementFileTypeDetailsResp,
    deleteMultipleFoldersAndFilesResp,
    getBranchStorageManagementFileTypeCategoryDetailsResp,
    branchStorageManagementErrorAct,
  } = useAppSelector(
    ({ appData, globalData, branch, branchStorageSettings, branchStorageManagement }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getBranchStorageList: branchStorageSettings.getBranchStorageList,
      getBranchStorageManagementDetailsResp: branchStorageManagement.getBranchStorageManagementDetailsResp,
      getBranchStorageManagementFileTypeDetailsResp: branchStorageManagement.getBranchStorageManagementFileTypeDetailsResp,
      deleteMultipleFoldersAndFilesResp: branchStorageManagement.deleteMultipleFoldersAndFilesResp,
      getBranchStorageManagementFileTypeCategoryDetailsResp: branchStorageManagement.getBranchStorageManagementFileTypeCategoryDetailsResp,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }),
    shallowEqual
  );

  const branchStorageApiCall = () => {
    dispatch(
      getBranchStorageAct(
        generateActionPayload('get_branch_storage', undefined, {
          instituteId,
          branchId,
        })
      )
    );
  };
  const branchStorageDetailsApiCall = (otherProps?: any) => {
    const currentType = selectedCleanup.current?.type;

    dispatch(
      getBranchStorageManagementDetailsAct(
        generateActionPayload(
          "get_branch_storage_management_details",
          undefined,
          {
            instituteId,
            branchId,
            largeFileSizeMb:
              currentType === "OLD_FILES"
                ? "0"
                : otherProps?.largeFileSizeMb ??
                branchStorageAllFilesFormik.values.largeFileSizeMb ??
                "50",

            oldFileMonths:
              currentType === "OLD_FILES"
                ? otherProps?.oldFileMonths ??
                branchStorageAllFilesFormik.values.oldFileMonths
                : undefined,
          }
        )
      )
    );
  };

  const branchStorageFileTypeDetailsApiCall = (
    type: string,
    otherProps?: any
  ) => {
    const paginationData = otherProps || pagination.current;
    const { pageNo, ...restPagination } = paginationData;

    dispatch(
      getBranchStorageManagementFileTypeDetailsAct(
        generateActionPayload(
          "get_branch_storage_management_file_type_details",
          undefined,
          {
            instituteId,
            branchId,
            type,
            page: pageNo,
            largeFileSizeMb:
              type === "OLD_FILES"
                ? "0"
                : otherProps?.largeFileSizeMb ??
                branchStorageAllFilesFormik.values.largeFileSizeMb ??
                "50",

            oldFileMonths:
              type === "OLD_FILES"
                ? otherProps?.oldFileMonths ??
                branchStorageAllFilesFormik.values.oldFileMonths
                : undefined,
            ...restPagination,
          }
        )
      )
    );
  };

  const branchStorageFileTypeCategoryDetailsApiCall = (type: string, otherProps?: any) => {
    
    const paginationData = otherProps || pagination.current;
    const { pageNo, pageSize } = paginationData;
    dispatch(
      getBranchStorageManagementFileTypeCatogeryDetailsAct(
        generateActionPayload(
          "get_branch_storage_management_file_type_category_details",
          undefined,
          {
            instituteId,
            branchId,
            type,
            page: pageNo,
            pageSize,
          }
        )
      )
    );
  };

  const branchWiseNetPaidByDateRef = useRef({
    prevDeleteMultipleFoldersAndFilesResp: deleteMultipleFoldersAndFilesResp,
    prevBranchStorageManagementErrorAct: branchStorageManagementErrorAct,
  });

  useEffect(() => {
    const { prevDeleteMultipleFoldersAndFilesResp, prevBranchStorageManagementErrorAct } = branchWiseNetPaidByDateRef.current;
    if (deleteMultipleFoldersAndFilesResp && deleteMultipleFoldersAndFilesResp !== prevDeleteMultipleFoldersAndFilesResp) {
      toast.success("File Deleted successfully");
      closeDelFileModal();
      branchStorageApiCall();
      branchStorageDetailsApiCall();
      if (selectedCleanup.current?.type) {
        if (selectedCleanup.current.isCategory) {
          branchStorageFileTypeCategoryDetailsApiCall(
            selectedCleanup.current.type,
            pagination.current
          );
        } else {
          branchStorageFileTypeDetailsApiCall(
            selectedCleanup.current.type,
            pagination.current
          );
        }
      }
    } else if (branchStorageManagementErrorAct && branchStorageManagementErrorAct !== prevBranchStorageManagementErrorAct) {
      const { details } = branchStorageManagementErrorAct || {};
      toast.error(details || 'Something went wrong');
    }
    branchWiseNetPaidByDateRef.current.prevDeleteMultipleFoldersAndFilesResp = deleteMultipleFoldersAndFilesResp;
    branchWiseNetPaidByDateRef.current.prevBranchStorageManagementErrorAct = branchStorageManagementErrorAct;
  }, [deleteMultipleFoldersAndFilesResp, branchStorageManagementErrorAct]);

  const selectedPreviewFile = useMemo(() => {
    return getBranchStorageManagementFileTypeDetailsResp?.data?.find(
      (item: any) => Number(item.id) === Number(activePreviewFileId)
    );
  }, [getBranchStorageManagementFileTypeDetailsResp, activePreviewFileId]);

  const currentReviewData = selectedCleanup.current?.isCategory
    ? getBranchStorageManagementFileTypeCategoryDetailsResp?.data
    : getBranchStorageManagementFileTypeDetailsResp?.data;

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
          const id = Number(event.currentTarget.getAttribute("data-id"));

          const selectedItem = currentReviewData?.find(
            (item: any) => Number(item.id) === id
          );

          if (!selectedItem) return;

          setActivePreviewFileId(id);

          dispatch(resetManageAccessSummaryAct(undefined));

          dispatch(
            getManageAccessSummaryAct(
              generateActionPayload(
                "get_manage_access_summary",
                undefined,
                {
                  branchId,
                  resourceType: "FILE",
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
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger tw-me-2"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = Number(event.currentTarget.getAttribute("data-id"));

          const selectedItem = currentReviewData?.find(
            (item: any) => Number(item.id) === id
          );

          if (!selectedItem) return;

          openDelFileModal({
            id: selectedItem.id,
            type: "file",
          });
        },
      },
    ],
    [ getBranchStorageManagementFileTypeDetailsResp,
      getBranchStorageManagementFileTypeCategoryDetailsResp,
      selectedCleanup.current?.isCategory,]);

  useEffect(() => {
    if (instituteId && branchId) {
      branchStorageApiCall();
      branchStorageDetailsApiCall("50");

      selectedCleanup.current = {
        type: "LARGE_FILES",
        title: "Large Files",
        isCategory: false,
      };

      pagination.current = {
        pageNo: 0,
        pageSize: 10,
      };

      branchStorageFileTypeDetailsApiCall("LARGE_FILES", {
        pageNo: 0,
        pageSize: 10,
        largeFileSizeMb: "50",
      });
    }
  }, [instituteId, branchId]);


  const delModalSubmitHndlr = () => {
    const { id, type } = delFileModalState.modalData || {};

    dispatch(
      deleteMultipleFoldersAndFilesAct(
        generateActionPayload(
          "delete_multiple_folders_and_files",
          undefined,
          {
            fileIds: type === "file" ? [Number(id)] : [],
            folderIds: type === "folder" ? [Number(id)] : [],
          }
        )
      )
    );
  };

  const formatBytes = (bytes: number = 0) => {
    if (!bytes) return '0 KB';

    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, index);

    return `${value.toFixed(2)} ${units[index]}`;
  };

  const formatStatus = (status?: string) => {
    if (!status) return '';

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const storageData = useMemo(() => {
    const managementData = getBranchStorageManagementDetailsResp || {};
    const storageList = getBranchStorageList?.data || [];

    const storageOverview =
      storageList.find((item: any) => Number(item.branchId) === Number(branchId)) ||
      storageList[0] ||
      {};

    const categories = managementData.categories || [];
    const cleanupSuggestions = managementData.cleanupSuggestions || [];

    const getCategory = (category: string) =>
      categories.find((item: any) => item.category === category) || {};

    const getCleanup = (cleanupType: string) =>
      cleanupSuggestions.find((item: any) => item.cleanupType === cleanupType) || {};

    const usedBytes =
      storageOverview.usedBytes ??
      ((storageOverview.allocatedBytes || 0) - (storageOverview.availableBytes || 0));

    const usedPercentage = Number(storageOverview.utilizationPercentage || 0);

    return {
      usedStorage:
        storageOverview.usedBytesConversion || formatBytes(usedBytes),

      totalStorage:
        storageOverview.allocatedBytesConversion ||
        formatBytes(storageOverview.allocatedBytes),

      remainingStorage:
        storageOverview.availableBytesConversion ||
        formatBytes(storageOverview.availableBytes),

      usedPercentage,

      status: formatStatus(storageOverview.healthStatus),

      documents: getCategory('DOCUMENTS'),
      images: getCategory('IMAGES'),
      videos: getCategory('VIDEOS'),
      others: getCategory('OTHERS'),

      largeFiles: getCleanup('LARGE_FILES'),
      oldFiles: getCleanup('OLD_FILES'),
      duplicateFiles: getCleanup('DUPLICATE_FILES'),
      unusedFiles: getCleanup('UNUSED_FILES'),
    };
  }, [getBranchStorageList, getBranchStorageManagementDetailsResp, branchId]);

  const formatCategoryTitle = (value?: string) => {
    if (!value) return "";

    return value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const categoryCards = useMemo(() => {
    const categories = getBranchStorageManagementDetailsResp?.categories || [];

    return categories.map((category: any) => ({
      category: category.category,
      title: category.title || formatCategoryTitle(category.category),
      size: category.sizeReadable || formatBytes(category.sizeBytes || 0),
      count: `${category.fileCount || 0} files`,
      icon: FileUnknownIcon,
      iconBoxClass: "tw-bg-gray-50 tw-text-gray-500",
      bgCircleClass: "tw-bg-gray-400",
      accentClass: "tw-bg-gray-500",
    }));
  }, [getBranchStorageManagementDetailsResp]);

  const cleanupCards = [
    {
      title: storageData.largeFiles.title || "Large Files",
      type: "LARGE_FILES",
      description: storageData.largeFiles.description || "",
      size: storageData.largeFiles.sizeReadable || "0 KB",
      count: `${storageData.largeFiles.fileCount || 0} files`,
      icon: FileSearchIcon,
      iconBoxClass: "tw-bg-blue-50 tw-text-blue-600",
      bgCircleClass: "tw-bg-blue-500",
      accentClass: "tw-bg-blue-500",
    },
    {
      title: storageData.oldFiles.title || "Old Files",
      type: "OLD_FILES",
      description: storageData.oldFiles.description || "",
      size: storageData.oldFiles.sizeReadable || "0 KB",
      count: `${storageData.oldFiles.fileCount || 0} files`,
      icon: ClockIcon,
      iconBoxClass: "tw-bg-amber-50 tw-text-amber-600",
      bgCircleClass: "tw-bg-amber-500",
      accentClass: "tw-bg-amber-500",
    },
    {
      title: storageData.unusedFiles.title || "Unused Files",
      type: "UNUSED_FILES",
      description: storageData.unusedFiles.description || "",
      size: storageData.unusedFiles.sizeReadable || "0 KB",
      count: `${storageData.unusedFiles.fileCount || 0} files`,
      icon: FileRemoveIcon,
      iconBoxClass: "tw-bg-purple-50 tw-text-purple-600",
      bgCircleClass: "tw-bg-purple-500",
      accentClass: "tw-bg-purple-500",
    },
    // Uncomment if you want to show Duplicate Files
    // {
    //   title: storageData.duplicateFiles.title || "Duplicate Files",
    //   type: "DUPLICATE_FILES",
    //   description: storageData.duplicateFiles.description || "",
    //   size: storageData.duplicateFiles.sizeReadable || "0 KB",
    //   count: `${storageData.duplicateFiles.fileCount || 0} files`,
    //   icon: Copy01Icon,
    //   iconBoxClass: "tw-bg-emerald-50 tw-text-emerald-600",
    //   bgCircleClass: "tw-bg-emerald-500",
    //   accentClass: "tw-bg-emerald-500",
    // },
  ];

  const handleReview = (item: any) => {
    selectedCleanup.current = {
      type: item.type,
      title: item.title,
      isCategory: false,
    };
    pagination.current = {
      pageNo: 0,
      pageSize: 10,
    };
    branchStorageFileTypeDetailsApiCall(item.type);
  };

  const handleCategoryReview = (category: any) => {
    selectedCleanup.current = {
      type: category.category,
      title: category.title || category.category,
      isCategory: true,
    };
    pagination.current = {
      pageNo: 0,
      pageSize: 10,
    };
    branchStorageFileTypeCategoryDetailsApiCall(
      category.category,
      {
        pageNo: 0,
        pageSize: 10,
      }
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resetBranchStorageManagementFileTypeDetailsAct(undefined));
    };
  }, []);

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    if (!selectedCleanup.current?.type) {
      return;
    }
    if (selectedCleanup.current.isCategory) {
      branchStorageFileTypeCategoryDetailsApiCall(
        selectedCleanup.current.type,
        paginationInfo
      );
    } else {
      branchStorageFileTypeDetailsApiCall(
        selectedCleanup.current.type,
        paginationInfo
      );
    }
  }

  const onChangeFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    branchStorageAllFilesFormik.setFieldValue(name, value);
    pagination.current = {
      pageNo: 0,
      pageSize: 10,
    };
    const payload: any = {
      pageNo: 0,
      pageSize: 10,
    };
    if (name === "largeFileSizeMb") {
      payload.largeFileSizeMb = value;
    }
    if (name === "oldFileMonths") {
      payload.oldFileMonths = value;
    }
    branchStorageDetailsApiCall(payload);

    if (selectedCleanup.current?.type) {
      if (selectedCleanup.current.isCategory) {
        branchStorageFileTypeCategoryDetailsApiCall(
          selectedCleanup.current.type,
          pagination.current
        );
      } else {
        branchStorageFileTypeDetailsApiCall(
          selectedCleanup.current.type,
          pagination.current
        );
      }
    }
  };

  const currentReviewResponse = selectedCleanup.current?.isCategory
    ? getBranchStorageManagementFileTypeCategoryDetailsResp
    : getBranchStorageManagementFileTypeDetailsResp;
  const tableData = Array.isArray(currentReviewResponse?.data)
    ? currentReviewResponse.data
    : [];
  const tableColumns = useMemo(() => generateColumns(menuOptions), [menuOptions, currentReviewResponse]);
  const { totalElements, totalPages, pageble } = currentReviewResponse || {};

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Branch Storage" />

          <div className="tw-card">
            <div className="tw-card-body">
              <div className="tw-mb-6 tw-border-b tw-border-gray-200 tw-pb-5">
                <h4 className="tw-card-title tw-flex tw-items-center tw-font-semibold tw-text-gray-900">
                  Storage Management
                </h4>
                <p className="tw-text-sm tw-text-gray-400 tw-mb-0">
                  Monitor storage usage, identify cleanup opportunities, and
                  manage files efficiently.
                </p>
              </div>
              <h5 className="tw-card-title tw-flex tw-items-center tw-mb-3">
                Storage Overview
              </h5>
              <div className="tw-rounded-xl tw-border tw-border-gray-200 tw-bg-white tw-p-5 tw-shadow-sm tw-mb-4">
                <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
                  <div className="tw-flex-1 tw-min-w-0">
                    <div className="tw-flex tw-items-end tw-gap-2 tw-flex-wrap">
                      <h2 className="tw-text-[25px] tw-font-semibold tw-mb-0">
                        {storageData.usedStorage}
                      </h2>
                      <span className="tw-text-[13px] tw-font-medium tw-text-gray-400">
                        of {storageData.totalStorage} used
                      </span>
                    </div>
                    <p className="tw-text-sm tw-text-gray-500 tw-mt-3 tw-mb-0">
                      Approximately {storageData.remainingStorage} remaining •{' '}
                      {Number(storageData.usedPercentage).toFixed(2)}% utilized
                    </p>
                  </div>
                  {storageData.status && (
                    <span className="tw-shrink-0 tw-rounded-md tw-bg-emerald-50 tw-px-3 tw-py-2 tw-text-sm tw-font-semibold tw-text-emerald-500">
                      {storageData.status}
                    </span>
                  )}
                </div>
                <div className="tw-h-1.5 tw-w-full tw-overflow-hidden tw-rounded-full tw-bg-gray-200 tw-mt-4">
                  <div
                    className="tw-h-full tw-rounded-full tw-bg-emerald-500 tw-transition-all tw-duration-300"
                    style={{
                      width: `${Math.min(Math.max(storageData.usedPercentage, 0), 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-5 tw-mb-7">
                {categoryCards.map((item) => (
                  <div
                    key={item.category}
                    className="tw-group tw-relative tw-overflow-hidden tw-rounded-2xl tw-border 
                    tw-border-gray-100 tw-bg-white tw-p-6 tw-shadow-sm tw-transition-all tw-duration-300 
                    hover:-tw-translate-y-1 hover:tw-shadow-lg"
                  >
                    <div className="tw-relative tw-z-10">
                      <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
                        <div>
                          <p className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-500">
                            {item.title}
                          </p>
                          <h4 className="tw-mb-1 tw-font-bold tw-tracking-tight tw-text-gray-950">
                            {item.size}
                          </h4>
                          <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-400">
                            {item.count}
                          </p>
                        </div>
                        <div className={`tw-grid tw-h-10 tw-w-10 tw-shrink-0 tw-items-center 
                            tw-justify-center tw-rounded-2xl tw-shadow-sm tw-transition-transform 
                            tw-duration-300 group-hover:tw-scale-110 ${item.iconBoxClass}`}
                        >
                          <HugeiconsIcon
                            icon={item.icon}
                            size={22}
                            strokeWidth={1.8}
                            color="currentColor"
                          />
                          {item.category === "DOCUMENTS" && (
                            <Button
                              type="button"
                              variant="linkBtn"
                              className="!tw-mt-4 !tw-px-0 !tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold"
                              onClick={() => handleCategoryReview(item)}
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tw-mb-4">
                <div className="tw-flex tw-items-start tw-justify-between tw-gap-4">
                  <div>
                    <h5 className="tw-card-title tw-flex tw-items-center tw-mb-1">
                      Cleanup Suggestions
                    </h5>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                      Review files that may be taking unnecessary storage space.
                    </p>
                  </div>
                  <div className="tw-ml-auto tw-flex tw-items-center tw-gap-3">
                    {selectedCleanup.current?.type === "LARGE_FILES" && (
                      <SelectInput
                        name="largeFileSizeMb"
                        menuItems={largeFileSizeMbOptions}
                        valueKey="id"
                        textKey="name"
                        value={branchStorageAllFilesFormik.values.largeFileSizeMb}
                        onChange={onChangeFilter}
                        formgroupClassName="mb-0"
                        labelText="Size"
                        floatingLabel
                      />
                    )}

                    {selectedCleanup.current?.type === "OLD_FILES" && (
                      <SelectInput
                        name="oldFileMonths"
                        menuItems={monthOptions}
                        valueKey="id"
                        textKey="name"
                        value={branchStorageAllFilesFormik.values.oldFileMonths}
                        onChange={onChangeFilter}
                        formgroupClassName="mb-0"
                        labelText="Month"
                        floatingLabel
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-3 tw-gap-5 tw-mb-4">
                {cleanupCards.map((item) => {

                  return (
                    <div
                      key={item.title}
                      className="tw-group tw-relative tw-overflow-hidden tw-rounded-2xl tw-border tw-border-gray-100 tw-bg-gradient-to-br tw-from-white tw-to-gray-50 tw-p-5 tw-shadow-sm tw-transition-all tw-duration-300 hover:-tw-translate-y-1 hover:tw-shadow-lg"
                    >
                      <div className="tw-pointer-events-none tw-absolute tw-right-0 tw-top-0 tw-h-[115px] tw-w-[115px] tw-overflow-hidden">
                        <div
                          className={`tw-absolute -tw-right-12 -tw-top-[3.75rem] tw-h-[120px] tw-w-[120px] tw-rounded-full tw-opacity-15 ${item.bgCircleClass}`}
                        />
                        <div
                          className={`tw-absolute -tw-right-7 -tw-top-10 tw-h-[78px] tw-w-[78px] tw-rounded-full tw-opacity-20 ${item.bgCircleClass}`}
                        />
                      </div>
                      <div className="tw-relative tw-z-10 tw-flex tw-items-center tw-justify-between tw-gap-5">
                        <div className="tw-flex tw-items-start tw-gap-4">
                          <div
                            className={`tw-flex tw-h-10 tw-w-10 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-2xl tw-shadow-sm tw-transition-transform tw-duration-300 group-hover:tw-scale-110 ${item.iconBoxClass}`}
                          >
                            <HugeiconsIcon
                              icon={item.icon}
                              size={22}
                              strokeWidth={1.8}
                              color="currentColor"
                            />
                          </div>
                          <div>
                            <div className="tw-mb-3">
                              <h6 className="tw-mb-1 tw-text-base tw-font-bold tw-text-gray-900">
                                {item.title}
                              </h6>

                              <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-500">
                                {item.description}
                              </p>
                            </div>
                            <h4 className="tw-mb-1 tw-font-bold tw-tracking-tight tw-text-gray-950">
                              {item.size}
                            </h4>
                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-400">
                              {item.count}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="linkBtn"
                          disabled={false}
                          className="!tw-px-0 tw-self-end !tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold"
                          onClick={() => handleReview(item)}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="">
                {selectedCleanup.current && (
                  <div className="tw-flex tw-items-center tw-justify-between tw-rounded-t-xl tw-border tw-border-b-0 tw-border-gray-200 tw-bg-white tw-px-5 tw-py-4">
                    <div>
                      <h5 className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-900">
                        {selectedCleanup.current.title}
                      </h5>
                      <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        Review and manage files under this cleanup category.
                      </p>
                    </div>
                  </div>
                )}
                <TableContainer
                  columns={tableColumns}
                  data={tableData}
                  divClass={`tw-border tw-border-gray-200 tw-overflow-hidden table-responsive tw-mb-3 ${selectedCleanup.current
                    ? "tw-rounded-b-xl"
                    : "tw-rounded-xl"
                    }`}
                  theadClass="table-light text-muted align-middle"
                  showPagination={true}
                  totalPages={totalPages || 0}
                  totalRecords={totalElements || 0}
                  callbackPaginationHndlr={paginationHndlr}
                  paginationContainerClass="tw-pb-0"
                  currentPageNumber={pageble?.pageNumber || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default StorageManagementDashboard;
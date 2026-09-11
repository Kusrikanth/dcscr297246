import { useFormik } from 'formik';
import { ConfirmationModal, OffCanvasContainer, TextInput } from '../../../../Components/Common';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import Button from '../../../../Components/Common/Button';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getBranchStorageAct } from '../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { toast } from 'react-toastify';
import { shallowEqual } from 'react-redux';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, ArrowUp01Icon, DatabaseRestoreIcon, EyeIcon } from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../hooks/modalhook';
import { getBranchStorageFavoriteFilesAct, getBranchStorageRecentFilesAct, getLoginBasedRecentFilesAct, getManageAccessSummaryAct, getPreviewFolderFileDetailsAct, resetManageAccessSummaryAct } from '../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions';
import { FolderFileDetailsModal } from '../AllFilesStorage/FolderFileDetailsModal';

const initialValues = {
  searchString: '',
};

const RecentFiles = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [open, setOpen] = useState<boolean>(false);
  const [activePreviewFileId, setActivePreviewFileId] = useState<number | null>(null);

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  const branchStorageRecentFilesApiCall = () => {
    dispatch(
      getBranchStorageRecentFilesAct(
        generateActionPayload(
          "get_branch_storage_recent_files",
          undefined,
          {
            instituteId,
            branchId,
          }
        )
      )
    );
  };

  const othersStorageRecentFilesApiCall = () => {
    dispatch(
      getLoginBasedRecentFilesAct(
        generateActionPayload(
          "get_login_based_recent_files",
          undefined,
          {
            instituteId,
            branchId,
          }
        )
      )
    );
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getBranchStorageRecentFilesResp,
    getLoginBasedStorageRecentFilesResp,
    loggedInUserRole,
    virtualRoleResp,
    branchStorageManagementErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageManagement, login, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getBranchStorageRecentFilesResp: branchStorageManagement.getBranchStorageRecentFilesResp,
      getLoginBasedStorageRecentFilesResp: branchStorageManagement.getLoginBasedStorageRecentFilesResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevBranchStorageManagementErrorAct: branchStorageManagementErrorAct,
  });

  useEffect(() => {
    const { prevBranchStorageManagementErrorAct } =
      branchWiseNetPaidByDateRef.current;
    if (branchStorageManagementErrorAct && branchStorageManagementErrorAct !== prevBranchStorageManagementErrorAct) {
      const { details } = branchStorageManagementErrorAct || {}
      toast.error(details || "Something went wrong");
    }
    branchWiseNetPaidByDateRef.current.prevBranchStorageManagementErrorAct = branchStorageManagementErrorAct;
  }, [branchStorageManagementErrorAct]);

  const recentFilesFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });

  useEffect(() => {
    if (instituteId && branchId) {
      if (
        loggedInUserRole === "INSTITUTE_ADMIN" ||
        loggedInUserRole === "BRANCH_ADMIN"
      ) {
        branchStorageRecentFilesApiCall();
      } else {
        othersStorageRecentFilesApiCall();
      }
    }
  }, [instituteId, branchId, loggedInUserRole]);

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

          const selectedItem = recentFiles.find(
            (item: any) => Number(item.id) === id
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
      }
    ],
    [getBranchStorageRecentFilesResp]
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [recentFilesFormik.values.searchString]);

  const tableColumns = useMemo(() => generateColumns(menuOptions), [menuOptions, getBranchStorageRecentFilesResp]);

  const recentFiles = useMemo(() => {
    if (
      loggedInUserRole === "INSTITUTE_ADMIN" ||
      loggedInUserRole === "BRANCH_ADMIN"
    ) {
      return Array.isArray(getBranchStorageRecentFilesResp)
        ? getBranchStorageRecentFilesResp
        : [];
    }

    return Array.isArray(getLoginBasedStorageRecentFilesResp)
      ? getLoginBasedStorageRecentFilesResp
      : [];
  }, [
    loggedInUserRole,
    getBranchStorageRecentFilesResp,
    getLoginBasedStorageRecentFilesResp,
  ]);

  const selectedPreviewFile = useMemo(
    () =>
      recentFiles.find(
        (item: any) => Number(item.id) === Number(activePreviewFileId)
      ),
    [recentFiles, activePreviewFileId]
  );
  const filteredRecentFiles = useMemo(() => {
    const search = recentFilesFormik.values.searchString.trim().toLowerCase();

    if (!search) return recentFiles;

    return recentFiles.filter((item: any) =>
      [
        item.originalFileName,
        item.logicalName,
        item.fileName,
        item.createdByName,
        item.updatedByName,
        item.folderPath,
        item.extension,
      ]
        .filter(Boolean)
        .some((value: string) =>
          value.toLowerCase().includes(search)
        )
    );
  }, [recentFiles, recentFilesFormik.values.searchString]);

  const visibleRecentFiles = useMemo(() => {
    return filteredRecentFiles.slice(0, visibleCount);
  }, [filteredRecentFiles, visibleCount]);

  const showViewMore = visibleCount < filteredRecentFiles.length;
  const showViewLess = visibleCount > PAGE_SIZE;

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Branch Storage" />
          <div className="tw-card">
            <div className="tw-card-header tw-pb-0">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
                <h4 className="tw-card-title">Recent Files</h4>
              </div>
            </div>
            <div className="tw-card-body">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-4">
                <div className="lg:tw-col-span-4">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      placeHolder="Search..."
                      value={recentFilesFormik.values.searchString}
                      onChange={recentFilesFormik.handleChange}
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

              <div>
                <TableContainer
                  columns={tableColumns}
                  data={visibleRecentFiles}
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
                        Math.min(prev + PAGE_SIZE, filteredRecentFiles.length)
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
    </>
  );
};

export default RecentFiles;

import { useFormik } from 'formik';
import { ConfirmationModal, TextInput } from '../../../../Components/Common';
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
import { getBranchStorageTrashFilesAct, getLoginBasedTrashFilesAct, restoreBranchStorageTrashFilesAct } from '../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions';
import { HugeiconsIcon } from '@hugeicons/react';
import { DatabaseRestoreIcon } from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../hooks/modalhook';

const initialValues = {
  searchString: '',
};

const TrashFiles = () => {
  const dispatch = useAppDispatch();
  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { openModal: openRestoreModal, closeModal: closeRestoreModal, modalState: restoreModalState } = useModal();
  const [selectedRecycleBinEntryIds, setSelectedRecycleBinEntryIds] = useState<number[]>([]);

  const branchStorageTrashApiCall = () => {
    dispatch(
      getBranchStorageTrashFilesAct(
        generateActionPayload(
          "get_branch_storage_trash_files",
          undefined,
          {
            instituteId,
            branchId,
          }
        )
      )
    );
  };

  const loginBasedStorageTrashApiCall = () => {
    dispatch(
      getLoginBasedTrashFilesAct(
        generateActionPayload(
          "get_login_based_trash_files",
          undefined
        )
      )
    );
  };

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    loggedInUserRole,
    getBranchStorageTrashFilesResp,
    restoreBranchStorageTrashFilesResp,
    getLoginBasedStorageTrashFilesResp,
    branchStorageManagementErrorAct,
  } =
    useAppSelector(({ appData, globalData, instituteInfo, branch, branchStorageManagement, login, branchStorageSettings }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      loggedInUserRole: appData.loggedInUserRole,
      getBranchStorageTrashFilesResp: branchStorageManagement.getBranchStorageTrashFilesResp,
      restoreBranchStorageTrashFilesResp: branchStorageManagement.restoreBranchStorageTrashFilesResp,
      getLoginBasedStorageTrashFilesResp: branchStorageManagement.getLoginBasedStorageTrashFilesResp,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }), shallowEqual);

  const branchWiseNetPaidByDateRef = useRef({
    prevRestoreBranchStorageTrashFilesResp: restoreBranchStorageTrashFilesResp,
    prevBranchStorageManagementErrorAct: branchStorageManagementErrorAct,
  });

  useEffect(() => {
    const { prevRestoreBranchStorageTrashFilesResp, prevBranchStorageManagementErrorAct } =
      branchWiseNetPaidByDateRef.current;
    if (restoreBranchStorageTrashFilesResp && restoreBranchStorageTrashFilesResp !== prevRestoreBranchStorageTrashFilesResp) {
      toast.success("Branch Storage File Restored.");
      closeRestoreModal();

      if (isAdmin) {
        branchStorageTrashApiCall();
      } else {
        loginBasedStorageTrashApiCall();
      }
    } else if (branchStorageManagementErrorAct && branchStorageManagementErrorAct !== prevBranchStorageManagementErrorAct) {
      const { details } = branchStorageManagementErrorAct || {}
      toast.error(details || "Something went wrong");
    }
    branchWiseNetPaidByDateRef.current.prevRestoreBranchStorageTrashFilesResp = restoreBranchStorageTrashFilesResp;
    branchWiseNetPaidByDateRef.current.prevBranchStorageManagementErrorAct = branchStorageManagementErrorAct;
  }, [restoreBranchStorageTrashFilesResp, branchStorageManagementErrorAct]);

  const isAdmin =
    loggedInUserRole === "INSTITUTE_ADMIN" ||
    loggedInUserRole === "BRANCH_ADMIN";

  const trashFilesFormik = useFormik({
    initialValues,
    onSubmit: () => { },
  });

  useEffect(() => {
    if (isAdmin) {
      if (instituteId && branchId) {
        branchStorageTrashApiCall();
      }
    } else {
      loginBasedStorageTrashApiCall();
    }
  }, [loggedInUserRole, instituteId, branchId]);

  const trashFilesResp = isAdmin
    ? getBranchStorageTrashFilesResp
    : getLoginBasedStorageTrashFilesResp;

  const trashFilesData = useMemo(() => {
    return (
      trashFilesResp?.entries?.map((item: any) => {
        const isFile = item.resourceType === "FILE";

        return {
          recycleBinEntryId: item.recycleBinEntryId,
          resourceType: item.resourceType,
          resourceId: item.resourceId,
          name: isFile ? item.file?.logicalName : item.folder?.name,
          path: isFile ? item.file?.folderPath : item.folder?.folderPath,
          deletedBy: item.deletedByName || "-",
          deletedInDays: item.deletedInDays || "-",
          deletedDate: item.deletedAt,
          size: isFile
            ? item.file?.convertedSizeBytes
            : item.folder?.convertedSizeBytes || "-",
          categoryName: item.file?.categoryName,
          originalData: item,
        };
      }) || []
    );
  }, [trashFilesResp]);

  const filteredTrashFiles = useMemo(() => {
    const search = trashFilesFormik.values.searchString.trim().toLowerCase();

    if (!search) return trashFilesData;

    return trashFilesData.filter((item: any) => {
      return (
        item.name?.toLowerCase().includes(search) ||
        item.path?.toLowerCase().includes(search) ||
        item.deletedBy?.toLowerCase().includes(search) ||
        item.resourceType?.toLowerCase().includes(search) ||
        item.deletedDate?.toLowerCase().includes(search)
      );
    });
  }, [trashFilesData, trashFilesFormik.values.searchString]);

  function restoreModalSubmitHndlr() {
    const payload = {
      recycleBinEntryIds: selectedRecycleBinEntryIds,
    };

    dispatch(
      restoreBranchStorageTrashFilesAct(
        generateActionPayload(
          "restore_branch_storage_trash_files",
          undefined,
          payload
        )
      )
    );
  }

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [trashFilesData.length, trashFilesFormik.values.searchString]);

  const menuOptions = useMemo(
    () => [
      {
        id: "restore",
        actionIcon: (
          <HugeiconsIcon
            icon={DatabaseRestoreIcon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Restore",
        onClickHndlr: (event: any) => {
          const recycleBinEntryId = Number(
            event.currentTarget.getAttribute("data-id")
          );

          setSelectedRecycleBinEntryIds([recycleBinEntryId]);
          openRestoreModal();
        },
      }
    ],
    [trashFilesData]
  );

  const tableColumns = useMemo(() => generateColumns(menuOptions), [menuOptions, trashFilesData]);
  const visibleTrashFiles = useMemo(() => {
    return filteredTrashFiles.slice(0, visibleCount);
  }, [filteredTrashFiles, visibleCount]);

  const showOnlyViewMore =
    visibleCount === PAGE_SIZE &&
    filteredTrashFiles.length > PAGE_SIZE;

  const showBothButtons =
    visibleCount > PAGE_SIZE &&
    visibleCount < filteredTrashFiles.length;

  const showOnlyViewLess =
    visibleCount >= filteredTrashFiles.length &&
    filteredTrashFiles.length > PAGE_SIZE;

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Branch Storage" />
          <div className="tw-card">
            <div className="tw-card-header tw-pb-0">
              <div className="tw-flex tw-items-center tw-gap-2 tw-mb-4">
                <h4 className="tw-card-title">Trash</h4>
              </div>
            </div>
            <div className="tw-card-body">
              <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3 tw-items-center tw-mb-4">
                <div className="lg:tw-col-span-4">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      placeHolder="Search..."
                      value={trashFilesFormik.values.searchString}
                      onChange={trashFilesFormik.handleChange}
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

              <div>
                <TableContainer
                  columns={tableColumns}
                  data={visibleTrashFiles}
                  divClass="tw-border tw-rounded-lg tw-overflow-hidden table-responsive tw-mb-3"
                  theadClass="table-light text-muted align-middle"
                />
              </div>
              <div className="tw-flex tw-justify-end tw-gap-3 tw-pe-2 tw-mt-4">
                {showOnlyViewMore && (
                  <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + PAGE_SIZE, filteredTrashFiles.length)
                      )
                    }
                    className="!tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                  >
                    View More
                  </Button>
                )}

                {showBothButtons && (
                  <>
                    <Button
                      type="button"
                      variant="sidebarMenu"
                      onClick={() =>
                        setVisibleCount((prev) =>
                          Math.min(prev + PAGE_SIZE, filteredTrashFiles.length)
                        )
                      }
                      className="!tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                    >
                      View More
                    </Button>

                    <Button
                      type="button"
                      variant="sidebarMenu"
                      onClick={() => setVisibleCount(PAGE_SIZE)}
                      className="!tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                    >
                      View Less
                    </Button>
                  </>
                )}

                {showOnlyViewLess && (
                  <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={() => setVisibleCount(PAGE_SIZE)}
                    className="!tw-border-0 tw-bg-transparent !tw-text-[14px] tw-font-semibold tw-text-indigo-500 hover:tw-text-indigo-700"
                  >
                    View Less
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        id="delete-file"
        isOpen={restoreModalState.showModal}
        confirmMessage="Are you sure you want to restore this File ?"
        cancelHndlr={closeRestoreModal}
        confirmHndlr={restoreModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default TrashFiles;

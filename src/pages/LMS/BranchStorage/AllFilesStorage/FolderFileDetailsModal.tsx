import { useEffect, useMemo, useState } from "react";
import { Button, SkeletonLoader } from "../../../../Components/Common";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import Details from "./Details";
import Activity from "./Activity";
import Versions from "./Versions";
import Comments from "./Comments";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { downloadBranchStorageSingleFileAct, getPreviewFolderFileDetailsAct, resetPreviewFolderFileDetailsAct } from '../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions';
import Access from "./Access";
import { getBranchPoliciesAct, getUserAccessProfilePremissionsAct } from "../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download04Icon } from "@hugeicons-pro/core-stroke-standard";

export const FolderFileDetailsModal = ({ closeHndlr, fileId }: any) => {
  const dispatch = useAppDispatch();
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [activeTabId, setActiveTabId] = useState('details');
  const toolbarPluginInstance = toolbarPlugin();
  const { Toolbar } = toolbarPluginInstance;

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    branchListResp,
    getPreviewFolderFileDetailsResp
  } =
    useAppSelector(({ appData, globalData, branch, branchStorageManagement }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      getPreviewFolderFileDetailsResp: branchStorageManagement.getPreviewFolderFileDetailsResp,
    }), shallowEqual);

  const isStorageManagementDashboard =
    window.location.pathname === "/storage-management-dashboard";

  const tabMenuOptions: any = [
    {
      id: "details",
      labelName: "Details",
      customPadding: "0px 10px 5px 10px",
    },

    ...(!isStorageManagementDashboard
      ? [
        {
          id: "access",
          labelName: "Access",
          customPadding: "0px 10px 5px 10px",
        },
        {
          id: "activity",
          labelName: "Activity",
          customPadding: "0px 10px 5px 10px",
        },
        {
          id: "versions",
          labelName: "Versions",
          customPadding: "0px 10px 5px 10px",
        },
      ]
      : []),

    // {
    //   id: "comments",
    //   labelName: "Comments",
    //   customPadding: "0px 10px 5px 10px",
    // },
  ];


  function activeTabHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute('data-id') || '';
    setActiveTabId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "details":
        return Details;
      case "activity":
        return Activity;
      case "versions":
        return Versions;
      case "comments":
        return Comments;
      case "access":
        return Access;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeTabId);

    return (
      <TabComponent
        activeId={activeTabId}
        previewDetails={getPreviewFolderFileDetailsResp}
      />
    );
  }, [activeTabId, getPreviewFolderFileDetailsResp]);

  const userAccessPermissionApiCall = () => {
    dispatch(
      getUserAccessProfilePremissionsAct(
        generateActionPayload(
          "get_user_access_profile_permissions_list",
          undefined,
          {
            instituteId,
            branchId
          }
        )
      )
    );
  };

  useEffect(() => {
    if (isStorageManagementDashboard && activeTabId !== "details") {
      setActiveTabId("details");
    }
  }, [isStorageManagementDashboard, activeTabId]);

  useEffect(() => {
    userAccessPermissionApiCall();
    return () => {
      dispatch(resetPreviewFolderFileDetailsAct(undefined));
    };
  }, []);

  const extension =
    getPreviewFolderFileDetailsResp?.details?.originalFileName
      ?.split(".")
      ?.pop()
      ?.toLowerCase() || "";

  const unsupportedIframeTypes = ["doc", "docx", "xls", "xlsx"];

  const isUnsupportedIframeType = unsupportedIframeTypes.includes(extension);

  useEffect(() => {
    if (isUnsupportedIframeType) {
      setIsPdfLoading(false);
    } else {
      setIsPdfLoading(true);
    }
  }, [getPreviewFolderFileDetailsResp?.url, isUnsupportedIframeType]);

  const downloadBranchStorageSingleFileHandler = () => {
    dispatch(
      downloadBranchStorageSingleFileAct(
        generateActionPayload(
          "download_branch_storage_single_file",
          { id: fileId }
        )
      )
    );
  };
  return (
    <div className="offcanvas-body !tw-bg-[#F3F4F6] !tw-p-0">
      <div className="tw-grid tw-grid-cols-12 tw-h-full">
        <div className={`tw-hidden lg:tw-block ${["comments", "access"].includes(activeTabId)
          ? "lg:tw-col-span-7"
          : "lg:tw-col-span-8"
          } tw-h-full`}>
          <div className="tw-h-full tw-bg-[#F3F4F6] tw-overflow-auto tw-relative">
            {isPdfLoading && (
              <div className="tw-absolute tw-inset-0 tw-bg-white tw-z-10">
                <SkeletonLoader />
              </div>
            )}

            {getPreviewFolderFileDetailsResp?.url ? (
              isUnsupportedIframeType ? (
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-text-center tw-p-6">
                  <h5 className="tw-font-semibold tw-text-gray-700">
                    Unsupported Preview
                  </h5>
                  <p className="tw-text-gray-500 tw-mt-2">
                    This file type ({extension.toUpperCase()}) is not supported for iframe preview.
                  </p>
                  <Button
                    variant="info"
                    type="button"
                    disabled={showApiLoader}
                    onClick={downloadBranchStorageSingleFileHandler}
                    className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                  >
                    <HugeiconsIcon
                      icon={Download04Icon}
                      className="tw-text-white"
                      size={18}
                    />
                    <span>Download Files</span>
                  </Button>
                </div>
              ) : (
                <>
                  {!isUnsupportedIframeType && isPdfLoading && (
                    <div className="tw-rounded-lg tw-p-6 tw-mx-5 tw-mt-5 tw-bg-[#FFFFFF] tw-w-full">
                      <SkeletonLoader
                        width="45%"
                        height="26px"
                        formgroupClassName="tw-bg-[#E5E7EB] tw-mb-8"
                      />
                      <SkeletonLoader
                        width="100%"
                        height="14px"
                        formgroupClassName="tw-bg-[#E5E7EB] tw-mb-3"
                      />
                      <SkeletonLoader
                        width="95%"
                        height="14px"
                        formgroupClassName="tw-bg-[#E5E7EB] tw-mb-3"
                      />
                    </div>
                  )}

                  <iframe
                    src={getPreviewFolderFileDetailsResp.url}
                    title={getPreviewFolderFileDetailsResp?.details?.originalFileName}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                    onLoad={() => setIsPdfLoading(false)}
                  />
                </>
              )
            ) : (
              <div className="tw-flex tw-items-center tw-justify-center tw-h-full">
                No Preview Available
                <Button
                  variant="info"
                  type="button"
                  disabled={showApiLoader}
                  onClick={downloadBranchStorageSingleFileHandler}
                  className="tw-flex tw-items-center tw-gap-1 !tw-py-1.5"
                >
                  <HugeiconsIcon
                    icon={Download04Icon}
                    className="tw-text-white"
                    size={18}
                  />
                  <span>Download Files</span>
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className={`tw-col-span-12 ${["comments", "access"].includes(activeTabId)
          ? "lg:tw-col-span-5"
          : "lg:tw-col-span-4"
          } tw-min-w-0 tw-bg-[#FFFFFF] tw-h-full`}>
          <UpdatedHorizontalTab
            MenuOptions={tabMenuOptions}
            clickMenuHandler={activeTabHandler}
            activeTabId={activeTabId}
            horizontalClass="ps-0 tw-pb-4 tw-pt-3 !tw-px-3"
          />
          <div className="tw-h-[calc(100vh-180px)] tw-overflow-y-auto">
            {activeComponent}
          </div>
        </div>
      </div>
    </div>
  );
};
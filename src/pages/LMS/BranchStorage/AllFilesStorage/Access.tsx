import { UserDetails } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroup02Icon,
  UserIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";

const Access = ({ previewDetails }: any) => {
  const [activeTabId, setActiveTabId] = useState("home");

  const { getManageAccessSummaryResp, getUserAccessProfilePermissionsResp } =
    useAppSelector(
      ({ branchStorageManagement, branchStorageSettings }) => ({
        getManageAccessSummaryResp:
          branchStorageManagement.getManageAccessSummaryResp,
        getUserAccessProfilePermissionsResp:
          branchStorageSettings.getUserAccessProfilePermissionsResp,
      }),
      shallowEqual
    );

  const tabMenuOptions = [
    {
      id: "home",
      labelName: "Home Branch",
      customPadding: "0px 10px 5px 10px",
    },
    {
      id: "other",
      labelName: "Other Branch",
      customPadding: "0px 10px 5px 10px",
    },
  ];

  function activeTabHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id") || "";
    setActiveTabId(menuId);
  }

  const homeBranchGrants =
    getManageAccessSummaryResp?.data?.homeBranchGrants || [];

  const otherBranchGrants =
    getManageAccessSummaryResp?.data?.otherBranchGrants || [];

  const grants =
    activeTabId === "home"
      ? homeBranchGrants
      : otherBranchGrants;

  const groups = grants.filter((item: any) => item.principalType === "GROUP");
  const users = grants.filter((item: any) => item.principalType === "USER");

  const accessProfiles = useMemo(() => {
    const response: any = getUserAccessProfilePermissionsResp;

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  }, [getUserAccessProfilePermissionsResp]);

  const permissionProfileMap = useMemo(() => {
    return new Map(
      accessProfiles.map((profile: any) => [Number(profile.id), profile])
    );
  }, [accessProfiles]);

  const getPermissionProfile = (permissionProfileId: number | string) => {
    return permissionProfileMap.get(Number(permissionProfileId));
  };

  const formatPermission = (permissionCode?: string) => {
    return permissionCode ? permissionCode.replace(/_/g, " ") : "";
  };

  const getPermissionBadgeClass = (permission?: string) => {
    const value = permission?.toUpperCase();

    if (value === "EDITOR") {
      return "tw-bg-emerald-50 tw-text-emerald-700 tw-border-emerald-100";
    }

    if (value === "CONTRIBUTOR") {
      return "tw-bg-blue-50 tw-text-blue-700 tw-border-blue-100";
    }

    if (value === "VIEWER") {
      return "tw-bg-slate-50 tw-text-slate-600 tw-border-slate-100";
    }

    if (value === "PREVIEW_ONLY") {
      return "tw-bg-violet-50 tw-text-violet-700 tw-border-violet-100";
    }

    return "tw-bg-slate-50 tw-text-slate-600 tw-border-slate-100";
  };

  const SectionTitle = ({
    icon,
    title,
    count,
  }: {
    icon: any;
    title: string;
    count: number;
  }) => (
    <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
      <HugeiconsIcon icon={icon} size={17} className="tw-text-[#1E3A8A]" />

      <span className="tw-text-[13px] tw-font-bold tw-uppercase tw-tracking-wide tw-text-[#1E3A8A]">
        {title}
      </span>

      <span className="tw-text-[11px] tw-font-semibold tw-text-slate-500 tw-bg-slate-100 tw-px-2 tw-py-0.5 tw-rounded-full">
        {count}
      </span>
    </div>
  );

  const PermissionTooltip = ({ grant }: { grant: any }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const hideTimerRef = useRef<any>(null);

    const profile: any = getPermissionProfile(grant.permissionProfileId);

    const permissions =
      profile?.permissions?.map((item: any) => item.permissionCode) || [];

    const openTooltip = (event: any) => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      const rect = event.currentTarget.getBoundingClientRect();

      const tooltipWidth = 240;
      const tooltipHeight = 120;
      const gap = 8;

      let left = rect.left;
      let top = rect.bottom + gap;

      if (left + tooltipWidth > window.innerWidth - 12) {
        left = window.innerWidth - tooltipWidth - 12;
      }

      if (top + tooltipHeight > window.innerHeight - 12) {
        top = rect.top - tooltipHeight - gap;
      }

      setPosition({
        top: Math.max(top, 12),
        left: Math.max(left, 12),
      });

      setShowTooltip(true);
    };

    const closeTooltip = () => {
      hideTimerRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 120);
    };

    const keepTooltipOpen = () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }

      setShowTooltip(true);
    };

    return (
      <>
        <i
          className="ri-information-line tw-text-slate-400 tw-text-[17px] tw-cursor-pointer hover:tw-text-[#1E3A8A]"
          onMouseEnter={openTooltip}
          onMouseLeave={closeTooltip}
        />

        {showTooltip &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              className="tw-fixed tw-z-[99999] tw-w-[240px] tw-rounded-lg tw-border tw-border-slate-200 tw-bg-white tw-p-3 tw-shadow-xl"
              style={{
                top: position.top,
                left: position.left,
              }}
              onMouseEnter={keepTooltipOpen}
              onMouseLeave={closeTooltip}
            >
              <div className="tw-text-[12px] tw-font-bold tw-text-slate-800 tw-mb-2">
                {profile?.profileName ||
                  grant.permissionProfileName ||
                  "Custom"}
              </div>

              {permissions.length > 0 ? (
                <div className="tw-flex tw-flex-wrap tw-gap-1.5">
                  {permissions.map((permission: string) => (
                    <span
                      key={permission}
                      className="tw-rounded-full tw-bg-slate-100 tw-px-2 tw-py-0.5 tw-text-[10px] tw-font-semibold tw-text-slate-600"
                    >
                      {formatPermission(permission)}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="tw-text-[11px] tw-text-slate-500">
                  No permissions found
                </div>
              )}
            </div>,
            document.body
          )}
      </>
    );
  };

  return (
    <div className="tw-px-6 tw-pb-6">
      <UpdatedHorizontalTab
        MenuOptions={tabMenuOptions}
        activeTabId={activeTabId}
        clickMenuHandler={activeTabHandler}
        showBadge={false}
        horizontalClass="horizontal-menu-pill-tabs tw-w-fit tw-ps-4 tw-pb-3"
      />
      {(groups.length > 0 || users.length > 0) && (
        <div className="tw-space-y-5">
          {groups.length > 0 && (
            <div className="tw-border-b tw-border-slate-200 tw-pb-5">
              <SectionTitle
                icon={UserGroup02Icon}
                title="Groups"
                count={groups.length}
              />

              <div className="tw-space-y-1.5 tw-max-h-[260px] tw-overflow-y-auto tw-pr-1">
                {groups.map((group: any) => (
                  <div
                    key={group.id}
                    className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-rounded-md tw-py-1.5 tw-px-1"
                  >

                    <span className="tw-text-[13px] tw-font-semibold tw-text-[#1E3A8A]">
                      {group.principalName}
                    </span>

                    {group.permissionProfileName && (
                      <div className="tw-flex tw-items-center tw-gap-1.5">
                        <span
                          className={`tw-rounded-full tw-border tw-px-2.5 tw-py-1 tw-text-[10px] tw-font-semibold tw-uppercase ${getPermissionBadgeClass(
                            group.permissionProfileName
                          )}`}
                        >
                          {group.permissionProfileName}
                        </span>

                        <PermissionTooltip grant={group} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {users.length > 0 && (
            <div className="tw-border-b tw-border-slate-200 tw-pb-5">
              <SectionTitle icon={UserIcon} title="Users" count={users.length} />

              <div className="tw-space-y-1.5 tw-max-h-[260px] tw-overflow-y-auto tw-pr-1">
                {users.map((user: any) => (
                  <div
                    key={user.id}
                    className="tw-flex tw-items-center tw-justify-between tw-gap-3 tw-rounded-md tw-py-1.5 tw-px-1"
                  >
                    <div className="tw-min-w-0 tw-flex-1">
                      <UserDetails
                        displayName={user.principalName}
                        displayId={user.principalCode}
                        size="xs"
                        contentNotCenter={true}
                      />
                    </div>

                    <div className="tw-flex tw-items-center tw-gap-1.5 tw-shrink-0">
                      <span
                        className={`tw-rounded-full tw-border tw-px-2.5 tw-py-1 tw-text-[10px] tw-font-semibold tw-uppercase ${getPermissionBadgeClass(
                          user.permissionProfileName
                        )}`}
                      >
                        {user.permissionProfileName || "Custom"}
                      </span>

                      <PermissionTooltip grant={user} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {groups.length === 0 && users.length === 0 && (
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-8 tw-text-center">
          <div className="tw-h-10 tw-w-10 tw-rounded-full tw-bg-slate-100 tw-flex tw-items-center tw-justify-center tw-mb-3">
            <HugeiconsIcon
              icon={UserGroup02Icon}
              size={21}
              className="tw-text-slate-500"
            />
          </div>

          <h4 className="tw-text-[14px] tw-font-semibold tw-text-slate-800 tw-mb-1">
            No access shared yet
          </h4>

          <p className="tw-text-[12px] tw-text-slate-500 tw-mb-0">
            This item is not shared with any users or groups.
          </p>
        </div>
      )}
    </div>
  );
};

export default Access;
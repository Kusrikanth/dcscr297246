import {
  FileVerifiedIcon,
  HardDriveIcon,
  Time02Icon,
  Audit01Icon,
  SquareLock01Icon,
  MentoringIcon,
  UserSwitchIcon,
  FileAttachmentIcon,
} from '@hugeicons-pro/core-stroke-standard';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { HugeiconsIcon, type HugeiconsIconProps } from '@hugeicons/react';
import { useMemo, useState } from 'react';
import BranchStorage from './BranchStorage';
import FilePolicies from './FilePolicies';
import RetentionArchival from './RetentionArchival';
import StorageProviders from './StorageProviders';
import AuditLogs from './AuditLogs';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import UserGroups from './UserGroups';
import UserAccessPermissions from './UserAccessPermissions';
import FileCategory from './FileCategory';

interface IMenuOption {
  id: string;
  labelName: string;
  icon?: HugeiconsIconProps['icon'];
}

interface IMenuSection {
  id: string;
  menuLabel: string;
  options: IMenuOption[];
}

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case 'branches-storage':
      return BranchStorage;
    case 'file-category':
      return FileCategory;
    case 'user-groups':
      return UserGroups;
    case 'users-access':
      return UserAccessPermissions;
    case 'file-policies':
      return FilePolicies;
    case 'retention-archival':
      return RetentionArchival;
    case 'storage-providers':
      return StorageProviders;
    case 'audit-logs':
      return AuditLogs;
  }
}

const BranchStorageSettings = () => {

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    loggedInUserRole,
    virtualRoleResp,
  } =
    useAppSelector(({ appData, directoryEmployee, directoryStudent, instAcademics, globalData, concernsFeedback, complaintDepartment, login, instituteInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
    }), shallowEqual);

  const isBranchAdmin =
    virtualRoleResp === "BRANCH_ADMIN" ||
    loggedInUserRole === "BRANCH_ADMIN";

  const [activeMenuId, setActiveMenuId] = useState(isBranchAdmin ? "user-groups" : "branches-storage");
  
  const menuOptions: IMenuSection[] =
    isBranchAdmin
      ? [
        {
          id: "user-access",
          menuLabel: "USERS & ACCESS",
          options: [
            {
              id: "user-groups",
              labelName: "User Groups",
              icon: MentoringIcon,
            },
            {
              id: "users-access",
              labelName: "User Access",
              icon: UserSwitchIcon,
            },
          ],
        },
        {
          id: "storage-compliance",
          menuLabel: "STORAGE & COMPLIANCE",
          options: [
            {
              id: "file-policies",
              labelName: "File Policies",
              icon: FileVerifiedIcon,
            },
            {
              id: "retention-archival",
              labelName: "Retention & Archival",
              icon: SquareLock01Icon,
            },
            {
              id: "storage-providers",
              labelName: "Storage Providers (S3)",
              icon: Time02Icon,
            },
            {
              id: "audit-logs",
              labelName: "Audit Logs",
              icon: Audit01Icon,
            },
          ],
        },
      ]
      : [
        {
          id: "organization",
          menuLabel: "ORGANIZATION",
          options: [
            {
              id: "branches-storage",
              labelName: "Branches Storage",
              icon: HardDriveIcon,
            },
            {
              id: "file-category",
              labelName: "File Category",
              icon: FileAttachmentIcon,
            },
          ],
        },
      ];

  const activeComponent = useMemo(() => {
    const ActiveTabComponet: any = getActiveMenuComponent(activeMenuId);

    return <ActiveTabComponet></ActiveTabComponet>;
  }, [activeMenuId]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb pageTitle="Branch Storage" />

        <div className="tw-grid tw-grid-cols-12 tw-gap-6">
          <div className="tw-col-span-12 lg:tw-col-span-3">
            <div className="tw-card tw-rounded-lg tw-border tw-border-gray-200">
              <div className="tw-card-body tw-flex tw-flex-col tw-gap-y-3">
                {menuOptions.map((section) => (
                  <div key={section.id} className="tw-space-y-2">
                    <div className="">
                      <h3 className="tw-text-xs tw-text-gray-400 tw-uppercase tw-tracking-wider tw-mb-0 tw-font-medium">
                        {section.menuLabel}
                      </h3>
                    </div>
                    <div className="tw-space-y-1">
                      {section.options.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActiveMenuId(item.id)}
                          className={`tw-px-4 tw-py-2.5 tw-flex tw-items-center tw-gap-3 tw-cursor-pointer tw-transition-colors tw-rounded-lg ${activeMenuId === item.id
                            ? 'tw-bg-[#C2D1FA7A] tw-border tw-border-[#1E3A8A80] tw-text-[#1E3A8A]'
                            : 'hover:tw-bg-gray-50 tw-text-zinc-600'
                            }`}
                        >
                          <HugeiconsIcon icon={item.icon!} size={18} />
                          <span className="tw-text-sm tw-font-medium">
                            {item.labelName}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-9">
            {activeComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchStorageSettings;

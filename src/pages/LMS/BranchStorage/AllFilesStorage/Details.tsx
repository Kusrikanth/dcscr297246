import { useEffect, useState } from "react";
import { AvatarGroupUpdated } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, Clock01Icon, Folder02Icon, UserGroup02Icon, UserIcon } from "@hugeicons-pro/core-stroke-standard";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";

const Details = ({previewDetails}: any) => {

    const details = previewDetails?.details || {};
    const activity = previewDetails?.activity || {};

    const fileType =
        previewDetails?.url
            ?.split("?")[0]
            ?.split(".")
            ?.pop()
            ?.toUpperCase() || "-";

    return (
        <div className="">
            <div className="tw-px-6 tw-pb-6">
                <div className="tw-text-[14px] tw-font-semibold tw-tracking-wide tw-uppercase tw-text-[#1F3A8A] tw-mb-4">
                    Properties
                </div>
                <div className="tw-flex tw-items-start tw-gap-3 tw-mb-1">
                    <HugeiconsIcon
                        icon={UserIcon}
                        size={18}
                        className="tw-text-[#9CA3AF] tw-mt-1"
                    />
                    <div>
                        <p className="tw-text-[#9CA3AF] tw-text-[12px] tw-mb-0">Owner</p>
                        <p className="tw-text-[#1F2937] tw-font-semibold tw-text-[14px]">
                           {details.createdByName || "-"}
                        </p>
                    </div>
                </div>
                <div className="tw-flex tw-items-start tw-gap-3 tw-mb-1">
                    <HugeiconsIcon
                        icon={Briefcase01Icon}
                        size={18}
                        className="tw-text-[#9CA3AF] tw-mt-1"
                    />
                    <div>
                        <p className="tw-text-[#9CA3AF] tw-text-[12px] tw-mb-0">Size</p>
                        <p className="tw-text-[#1F2937] tw-font-semibold tw-text-[14px]">
                            {details.size || "-"}
                        </p>
                    </div>
                </div>
                <div className="tw-flex tw-items-start tw-gap-3 tw-mb-1">
                    <HugeiconsIcon
                        icon={Folder02Icon}
                        size={18}
                        className="tw-text-[#9CA3AF] tw-mt-1"
                    />
                    <div>
                        <p className="tw-text-[#9CA3AF] tw-text-[12px] tw-mb-0">Type</p>
                        <p className="tw-text-[#1F2937] tw-font-semibold tw-text-[14px]">
                             {fileType}
                        </p>
                    </div>
                </div>
                <div className="tw-flex tw-items-start tw-gap-3">
                    <HugeiconsIcon
                        icon={Clock01Icon}
                        size={18}
                        className="tw-text-[#9CA3AF] tw-mt-1"
                    />
                    <div>
                        <p className="tw-text-[#9CA3AF] tw-text-[12px] tw-mb-0">Created At</p>
                        <p className="tw-text-[#1F2937] tw-font-semibold tw-text-[14px]">
                             {getDateWithTimeFormat(activity?.created?.time ? `${activity?.created?.time}Z` : '')}
                        </p>
                    </div>
                </div>
                <div className="tw-flex tw-items-start tw-gap-3 tw-border-b">
                    <HugeiconsIcon
                        icon={Clock01Icon}
                        size={18}
                        className="tw-text-[#9CA3AF] tw-mt-1"
                    />
                    <div>
                        <p className="tw-text-[#9CA3AF] tw-text-[12px] tw-mb-0">Modified</p>
                        <p className="tw-text-[#1F2937] tw-font-semibold tw-text-[14px]">
                            {details.modified || "-"}
                        </p>
                    </div>
                </div>
            </div>
            {/* <div className="tw-px-6 tw-pb-6">
                <div className="tw-text-[14px] tw-font-semibold tw-tracking-wide tw-uppercase tw-text-[#1F3A8A] tw-mb-4">
                    Access
                </div>
                <div className="tw-inline-flex tw-items-center tw-gap-2 tw-bg-[#EFF6FF] tw-text-[#1E3A8A] tw-px-2 tw-py-1 tw-rounded-lg">
                    <HugeiconsIcon
                        icon={UserGroup02Icon}
                        size={18}
                        className="tw-text-[#1E3A8A]"
                    />
                    <span className="tw-text-[14px] tw-font-semibold">Team</span>
                </div>
                <div className="tw-flex tw-items-start tw-gap-3 tw-py-3 tw-border-b">

                    <div>
                    </div>
                </div>
            </div>
            <div className="tw-px-6 tw-pb-6">
                <div className="tw-text-[14px] tw-font-semibold tw-tracking-wide tw-uppercase tw-text-[#1F3A8A] tw-mb-4">
                    Shared With
                </div>
                <AvatarGroupUpdated
                    avatars={createdByList || []}
                    imageKey="empImage"
                    tooltipKey="empName"
                    numberOfAvatarToShow={3}
                    showLimitedAvatar={true}
                    showAvatarName={true}
                    uniqueAvatarKey="empId"
                />
            </div> */}
        </div>
    );
};

export default Details
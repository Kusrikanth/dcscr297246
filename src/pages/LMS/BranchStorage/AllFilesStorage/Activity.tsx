import { useEffect, useState } from "react";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";

const Activity = ({ previewDetails }: any) => {

    const activityList = [
        {
            status: "Viewed",
            userName: previewDetails?.activity?.viewed?.username || "-",
            date: previewDetails?.activity?.viewed?.time,
            color: "#6B7280",
        },
        {
            status: "Modified",
            userName: previewDetails?.activity?.modified?.username || "-",
            date: previewDetails?.activity?.modified?.time,
            color: "#0AB39C",
        },
        {
            status: "Downloaded",
            userName: previewDetails?.activity?.downloaded?.username || "-",
            date: previewDetails?.activity?.downloaded?.time,
            color: "#2563EB",
        },
        {
            status: "Created",
            userName: previewDetails?.activity?.created?.username || "-",
            date: previewDetails?.activity?.created?.time,
            color: "#0AB39C",
        },
    ].filter((item) => item.date);

    return (
        <div className="tw-px-6 tw-py-4">
            {activityList.map((item, index) => (
                <div
                    key={index}
                    className={`tw-pb-5 ${index !== activityList.length - 1
                        ? "tw-mb-5 tw-border-b tw-border-[#E5E7EB]"
                        : ""
                        }`}
                >
                    <div className="tw-flex tw-items-center tw-gap-3 tw-mb-1">
                        <div
                            className="tw-w-3 tw-h-3 tw-rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="tw-text-[14px] tw-font-semibold tw-text-[#374151]">
                            {item.status}
                        </span>
                    </div>
                    <div className="tw-pl-6">
                        <div className="tw-text-[14px] tw-text-[#6B7280]">
                            by {item.userName}
                        </div>
                        <div className="tw-text-[13px] tw-text-[#9CA3AF]">
                            {item.date
                                ? getDateWithTimeFormat(`${item.date}Z`)
                                : "-"}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Activity
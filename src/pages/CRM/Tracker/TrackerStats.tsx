import type { ReactNode } from "react";

interface TrackerStatsProps {
    actionItemCount: number;
    pendingActionCount: number;
    overdueCount: number;
    pendingApprovalCount: number;
}

interface SummaryCardProps {
    bgColor: string;
    cardTitle: string;
    cardCount: number;
    cardIcon: ReactNode;
    iconBgColor?: string;
    iconColor?: string;
}

const SummaryCard = ({
    bgColor,
    cardTitle,
    cardCount,
    cardIcon,
    iconBgColor = "#ffffff",
    iconColor = "#111827",
}: SummaryCardProps) => {
    return (
        <div>
            <div
                className="tw-flex tw-min-h-[92px] tw-w-full tw-items-center tw-justify-between tw-rounded-[14px] tw-px-4 tw-py-4"
                style={{ backgroundColor: bgColor }}
            >
                <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-3">
                    <div
                        className="tw-flex tw-h-10 tw-w-10 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full"
                        style={{
                            backgroundColor: iconBgColor,
                            color: iconColor,
                        }}
                    >
                        {cardIcon}
                    </div>

                    <div className="tw-min-w-0">
                        <h6 className="tw-mb-1 tw-truncate tw-text-[14px] tw-font-medium tw-text-[#4b5563]">
                            {cardTitle}
                        </h6>
                        <h4 className="tw-mb-0 tw-text-lg tw-font-semibold tw-leading-none tw-text-[#4b5563]">
                            {cardCount}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrackerStats = ({
    actionItemCount,
    pendingActionCount,
    overdueCount,
    pendingApprovalCount,
}: TrackerStatsProps) => {
    return (
        <div className="tw-mb-4 tw-grid tw-grid-cols-1 tw-gap-4 md:tw-grid-cols-2 2xl:tw-grid-cols-4">
            <SummaryCard
                bgColor="#e9e9fb"
                cardTitle="Action Items"
                cardCount={actionItemCount}
                cardIcon={<i className="ri-flow-chart tw-text-lg"></i>}
            />

            <SummaryCard
                bgColor="#f1f9e6"
                cardTitle="Pending Actions"
                cardCount={pendingActionCount}
                cardIcon={<i className="ri-list-check-2 tw-text-lg"></i>}
            />

            <SummaryCard
                bgColor="#fff4e5"
                cardTitle="Overdue"
                cardCount={overdueCount}
                cardIcon={
                    <i
                        className={`ri-calendar-close-line tw-text-lg ${overdueCount > 0 ? "tw-text-[#f06548]" : ""}`}
                    ></i>
                }
            />

            <SummaryCard
                bgColor="#f1f3e7"
                cardTitle="Pending Approvals"
                cardCount={pendingApprovalCount}
                cardIcon={<i className="ri-shield-check-line tw-text-lg"></i>}
            />
        </div>
    );
};

export default TrackerStats;

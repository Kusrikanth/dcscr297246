import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Call02Icon, UserMultiple02Icon, AlertCircleIcon, Calendar03Icon } from "@hugeicons-pro/core-stroke-standard";
import bgImg from "../FeeConcessionReport/cardimg.svg";

interface IOutcomeSummary {
    summary: any;
    /** Rendered between the headline cards and the outcomes panel. */
    afterCards?: React.ReactNode;
}

const headlineCards = [
    { key: "totalCalls", label: "TOTAL CALLS", icon: Call02Icon, iconClass: "jodocred-icon" },
    { key: "studentsFollowedUp", label: "STUDENTS FOLLOWED UP", icon: UserMultiple02Icon, iconClass: "online-icon" },
    { key: "chronicParents", label: "CHRONIC PARENTS", icon: AlertCircleIcon, iconClass: "cash-icon" },
    { key: "overdueNextActions", label: "OVERDUE NEXT ACTIONS", icon: Calendar03Icon, iconClass: "jodoflex-icon" },
];

export default function OutcomeSummary({ summary, afterCards }: IOutcomeSummary) {
    const outcomes: Array<any> = Array.isArray(summary?.outcomes) ? summary.outcomes : [];
    const totalCalls = Number(summary?.totalCalls) || outcomes.reduce((acc, item) => acc + (Number(item?.count) || 0), 0);

    return (
        <>
            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 fee-payment-reports stats-card-types-container tw-gap-4 tw-mb-3">
                {headlineCards.map((card) => (
                    <div key={card.key} className="tw-bg-white tw-rounded-lg tw-shadow tw-relative tw-overflow-hidden">
                        <div className="tw-absolute tw-inset-0">
                            <img src={bgImg} alt="bg-image" />
                        </div>
                        <div className="tw-p-4 tw-relative tw-z-10">
                            <div className="tw-flex tw-items-center">
                                <div className={`tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-me-4 payment-icon ${card.iconClass}`}>
                                    <HugeiconsIcon icon={card.icon} className="payment-icon" />
                                </div>
                                <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                    <p className="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate" title={card.label}>
                                        {card.label}
                                    </p>
                                    <h5 className="tw-text-lg tw-font-semibold tw-text-gray-900">
                                        {Number(summary?.[card.key]) || 0}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {afterCards}

            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                <div className="tw-border-b tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">Call Outcomes</h4>
                </div>
                <div className="tw-p-4">
                    {outcomes.length === 0 ? (
                        <p className="tw-text-sm tw-text-gray-500 tw-mb-0">No call outcomes recorded for the selected filters.</p>
                    ) : (
                        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 xl:tw-grid-cols-6 tw-gap-3">
                            {outcomes.map((item) => {
                                const count = Number(item?.count) || 0;
                                const pct = totalCalls ? Math.round((count * 100) / totalCalls) : 0;
                                return (
                                    <div key={item?.statusId || item?.statusName} className="tw-border tw-rounded-lg tw-p-3">
                                        <p className="tw-text-xs tw-font-medium tw-text-gray-500 tw-uppercase tw-truncate tw-mb-1" title={item?.statusName}>
                                            {item?.statusName || "-"}
                                        </p>
                                        <div className="tw-flex tw-items-baseline tw-gap-2">
                                            <span className="tw-text-xl tw-font-semibold tw-text-gray-900">{count}</span>
                                            <span className="tw-text-xs tw-text-gray-500">{pct}%</span>
                                        </div>
                                        <div className="tw-h-1.5 tw-bg-gray-100 tw-rounded tw-mt-2 tw-overflow-hidden">
                                            <div className="tw-h-full tw-bg-[#1bb3a6]" style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

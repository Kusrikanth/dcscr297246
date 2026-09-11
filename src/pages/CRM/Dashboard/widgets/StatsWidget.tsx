import type { DashboardStatCard } from "../helper";
import type { DashboardWidgetSize } from "../dashboardLayout";

interface StatsWidgetProps {
    cards: DashboardStatCard[];
    size: DashboardWidgetSize;
}

const columnClass: Record<string, string> = {
    quarter: "col-12",
    half: "col-12 col-sm-6",
    "three-quarter": "col-12 col-sm-6 col-xl-4",
    full: "col-12 col-md-6 col-lg-3",
};

const trendClass: Record<string, string> = {
    up: "tw-text-emerald-600",
    down: "tw-text-red-600",
    warning: "tw-text-amber-600",
    neutral: "tw-text-gray-500",
};

const StatsWidget = ({ cards, size }: StatsWidgetProps) => (
    <div className="row tw-h-full tw-gap-y-3">
        {cards.map(card => (
            <div
                key={card.id}
                className={columnClass[size] || columnClass.full}
            >
                <div className="tw-card tw-mb-0 tw-h-full">
                    <div className="tw-card-body">
                        <div className="tw-flex tw-items-start tw-gap-3">
                            <div
                                className={`tw-flex tw-h-10 tw-w-10 tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded ${card.iconClassName}`}
                            >
                                <i
                                    className={`${card.icon} tw-text-xl`}
                                ></i>
                            </div>

                            <div className="tw-min-w-0">
                                <p className="tw-mb-1 tw-text-xs tw-font-medium tw-uppercase tw-text-gray-500">
                                    {card.label}
                                </p>
                                <p className="tw-mb-0 tw-text-2xl tw-font-semibold tw-text-gray-900">
                                    {Number(
                                        card.value || 0,
                                    ).toLocaleString()}
                                </p>
                                {card.trend && (
                                    <p
                                        className={`tw-mb-0 tw-text-xs ${trendClass[card.trendTone]}`}
                                    >
                                        {card.trend}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default StatsWidget;

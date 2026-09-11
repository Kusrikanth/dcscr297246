import { useMemo, useState, type ChangeEvent } from "react";

import {
    Button,
    MultiSelectCheckbox,
    SelectInput,
} from "../../../../../Components/Common";
import NoDataComp from "../../../../../Components/Common/NoDataComp";
import { CustomDatePicker } from "../../../../DashBoardBranchSummary/CustomDatePicker";
import {
    branchList,
    formatCount,
    formatDate,
    formatMoney,
    recentDaysRange,
    whatsAppAccounts,
    whatsAppAnalytics,
    type UsageBreakdownRecord,
} from "../../helper";

interface BranchFilterOption {
    id: string;
    name: string;
}

const DAYS_PER_PAGE = 7;

const branchOptions: Array<BranchFilterOption> = branchList.map(item => ({
    id: item.id,
    name: item.branchName,
}));

const renderBranchValue = (
    selectedItems: Array<BranchFilterOption>,
    removeItemHandler: (event: React.MouseEvent<HTMLElement>) => void,
) => (
    <div className="tw-flex tw-flex-wrap tw-gap-1">
        {selectedItems.map(item => (
            <span
                key={item.id}
                className="badge badge-soft-primary tw-flex tw-items-center tw-gap-1"
            >
                {item.name}
                <i
                    data-id={item.id}
                    className="ri-close-line tw-cursor-pointer"
                    onClick={removeItemHandler}
                ></i>
            </span>
        ))}
    </div>
);

const renderBranchOption = (item: BranchFilterOption) => <span>{item.name}</span>;

const metricCard = (
    icon: string,
    label: string,
    value: string,
    helper: string,
) => (
    <div className="col-12 col-md-6 col-xl-3" key={label}>
        <div className="tw-h-full tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-3">
            <div className="tw-flex tw-items-center tw-gap-2">
                <span className="tw-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded tw-bg-[#d1f4f1] tw-text-[#0b6d63]">
                    <i className={icon}></i>
                </span>
                <span className="tw-text-xs tw-uppercase tw-text-gray-500">
                    {label}
                </span>
            </div>
            <p className="tw-mb-0 tw-mt-2 tw-text-2xl tw-font-semibold tw-text-gray-800">
                {value}
            </p>
            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">{helper}</p>
        </div>
    </div>
);

const breakdownCard = (
    title: string,
    rows: Array<UsageBreakdownRecord>,
    emptyText: string,
) => {
    const maxMessages = Math.max(...rows.map(item => item.messages || 0), 1);

    return (
        <div className="col-12 col-xl-6" key={title}>
            <div className="tw-h-full tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-3">
                <p className="tw-mb-3 tw-text-sm tw-font-semibold tw-text-gray-800">
                    {title}
                </p>

                {rows.length ? (
                    rows.map(item => (
                        <div
                            key={item.id || item.name}
                            className="tw-mb-2 tw-flex tw-items-center tw-gap-2"
                        >
                            <span
                                className="tw-w-32 tw-flex-shrink-0 tw-truncate tw-text-xs tw-text-gray-700"
                                title={item.name}
                            >
                                {item.name}
                            </span>

                            <span className="tw-flex tw-h-2 tw-flex-1 tw-overflow-hidden tw-rounded tw-bg-gray-100">
                                <span
                                    className="tw-h-full tw-bg-[#1bb3a6]"
                                    style={{
                                        width: `${Math.max(2, ((item.utility || 0) / maxMessages) * 100)}%`,
                                    }}
                                />
                                <span
                                    className="tw-h-full tw-bg-[#405189]"
                                    style={{
                                        width: `${Math.max(2, ((item.marketing || 0) / maxMessages) * 100)}%`,
                                    }}
                                />
                            </span>

                            <span className="tw-w-16 tw-flex-shrink-0 tw-text-end tw-text-xs tw-font-semibold tw-text-gray-800">
                                {formatCount(item.messages)}
                            </span>
                            <span className="tw-w-20 tw-flex-shrink-0 tw-text-end tw-text-xs tw-text-gray-500">
                                {formatMoney(item.spend)}
                            </span>
                        </div>
                    ))
                ) : (
                    <p className="tw-mb-0 tw-py-3 tw-text-sm tw-text-gray-500">
                        {emptyText}
                    </p>
                )}
            </div>
        </div>
    );
};

const DashboardTab = () => {
    const [accountId, setAccountId] = useState<string>("");
    const [selectedBranches, setSelectedBranches] = useState<
        Array<BranchFilterOption>
    >([]);
    const [dateRange, setDateRange] = useState(() => recentDaysRange(7));
    const [dayPage, setDayPage] = useState<number>(1);

    const analytics = whatsAppAnalytics;

    const branchIds = useMemo(
        () => selectedBranches.map(item => item.id),
        [selectedBranches],
    );

    const daily = useMemo(
        () =>
            analytics.daily.filter(day => {
                const matchesFrom =
                    !dateRange.startDate || day.day >= dateRange.startDate;
                const matchesTo =
                    !dateRange.endDate || day.day <= dateRange.endDate;

                return matchesFrom && matchesTo;
            }),
        [analytics.daily, dateRange],
    );

    const accountRows = useMemo(
        () =>
            analytics.integrations.filter(
                item => !accountId || item.id === accountId,
            ),
        [accountId, analytics.integrations],
    );

    const branchRows = useMemo(
        () =>
            analytics.branchWise.filter(
                item => !branchIds.length || branchIds.includes(item.id),
            ),
        [analytics.branchWise, branchIds],
    );

    const summary = useMemo(() => {
        if (!accountId && !branchIds.length) {
            return analytics.summary;
        }

        const source = accountId ? accountRows : branchRows;
        const utility = source.reduce(
            (total, item) => total + (item.utility || 0),
            0,
        );
        const marketing = source.reduce(
            (total, item) => total + (item.marketing || 0),
            0,
        );
        const messages = source.reduce(
            (total, item) => total + (item.messages || 0),
            0,
        );
        const spend = source.reduce(
            (total, item) => total + (item.spend || 0),
            0,
        );
        const share = analytics.summary.totalMessages
            ? messages / analytics.summary.totalMessages
            : 0;

        return {
            totalMessages: messages,
            incomingMessages: Math.round(
                analytics.summary.incomingMessages * share,
            ),
            utilityMessages: utility,
            marketingMessages: marketing,
            utilitySpend: analytics.summary.utilitySpend * share,
            marketingSpend: analytics.summary.marketingSpend * share,
            estimatedSpend: spend,
            delivered: Math.round(analytics.summary.delivered * share),
            pending: Math.round(analytics.summary.pending * share),
            failed: Math.round(analytics.summary.failed * share),
        };
    }, [accountId, accountRows, analytics.summary, branchIds.length, branchRows]);

    const totalDayPages = Math.max(
        1,
        Math.ceil(daily.length / DAYS_PER_PAGE),
    );
    const visibleDaily = daily.slice(
        (dayPage - 1) * DAYS_PER_PAGE,
        dayPage * DAYS_PER_PAGE,
    );
    const maxDayTotal = Math.max(
        ...visibleDaily.map(day => (day.utility || 0) + (day.marketing || 0)),
        1,
    );

    const accountChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        setAccountId(event.target.value);
        setDayPage(1);
    };

    const branchChangeHandler = (
        selectedOptions: Array<BranchFilterOption>,
    ) => {
        setSelectedBranches(selectedOptions);
        setDayPage(1);
    };

    const dateRangeChangeHandler = (dates: {
        startDate: string;
        endDate: string;
    }) => {
        setDateRange(dates);
        setDayPage(1);
    };

    const exportHandler = () => {
    };

    return (
        <div className="tw-card">
            <div className="tw-card-header">
                <div className="row tw-items-end tw-gap-y-3">
                    <div className="col-12 col-md-6 col-xl-3">
                        <SelectInput
                            name="dashboardAccountId"
                            labelText="WhatsApp Account"
                            defaultSelect="All WhatsApp accounts"
                            value={accountId}
                            onChange={accountChangeHandler}
                            menuItems={whatsAppAccounts}
                            valueKey="id"
                            textKey="name"
                            formgroupClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-3">
                        <MultiSelectCheckbox
                            name="dashboardBranches"
                            idKey="id"
                            labelText="Branches"
                            value={selectedBranches}
                            renderValue={renderBranchValue}
                            renderOptions={renderBranchOption}
                            onChange={branchChangeHandler}
                            searchKey="name"
                            options={branchOptions}
                            containerClassName="tw-mb-0"
                            defaultSelect="All branches"
                            floatingLabel
                        />
                    </div>
                </div>
            </div>

            <div className="tw-card-body">
                <div className="row tw-gap-y-3">
                    {metricCard(
                        "ri-send-plane-line",
                        "Total messages",
                        formatCount(summary.totalMessages),
                        `${formatCount(summary.incomingMessages)} incoming`,
                    )}
                    {metricCard(
                        "ri-bar-chart-line",
                        "Utility messages",
                        formatCount(summary.utilityMessages),
                        `${formatMoney(summary.utilitySpend)} estimated`,
                    )}
                    {metricCard(
                        "ri-line-chart-line",
                        "Marketing messages",
                        formatCount(summary.marketingMessages),
                        `${formatMoney(summary.marketingSpend)} estimated`,
                    )}
                    {metricCard(
                        "ri-money-rupee-circle-line",
                        "Total spend",
                        formatMoney(summary.estimatedSpend),
                        `${formatCount(summary.delivered)} delivered / read / sent`,
                    )}
                </div>

                <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-text-xs tw-text-gray-600">
                    <span className="tw-flex tw-items-center tw-gap-1">
                        <span className="tw-h-2 tw-w-4 tw-rounded tw-bg-[#1bb3a6]" />
                        Utility messages
                    </span>
                    <span className="tw-flex tw-items-center tw-gap-1">
                        <span className="tw-h-2 tw-w-4 tw-rounded tw-bg-[#405189]" />
                        Marketing messages
                    </span>
                    <span className="tw-text-gray-400">
                        All metrics exclude failed messages. Spend also excludes
                        pending messages.
                    </span>
                </div>

                <div className="row tw-mt-3 tw-gap-y-3">
                    <div className="col-12">
                        <div className="tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-3">
                            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                                <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                    Day-wise usage
                                </p>
                                <span className="tw-text-xs tw-text-gray-500">
                                    {formatDate(dateRange.startDate)} –{" "}
                                    {formatDate(dateRange.endDate)}
                                </span>
                            </div>

                            {visibleDaily.length ? (
                                visibleDaily.map(day => {
                                    const total =
                                        (day.utility || 0) +
                                        (day.marketing || 0) +
                                        (day.incoming || 0);

                                    return (
                                        <div
                                            key={day.day}
                                            className="tw-mb-2 tw-flex tw-items-center tw-gap-2"
                                        >
                                            <span className="tw-w-24 tw-flex-shrink-0 tw-text-xs tw-text-gray-700">
                                                {day.day}
                                            </span>

                                            <span className="tw-flex tw-h-2 tw-flex-1 tw-overflow-hidden tw-rounded tw-bg-gray-100">
                                                <span
                                                    className="tw-h-full tw-bg-[#1bb3a6]"
                                                    style={{
                                                        width: `${Math.max(2, ((day.utility || 0) / maxDayTotal) * 100)}%`,
                                                    }}
                                                />
                                                <span
                                                    className="tw-h-full tw-bg-[#405189]"
                                                    style={{
                                                        width: `${Math.max(2, ((day.marketing || 0) / maxDayTotal) * 100)}%`,
                                                    }}
                                                />
                                            </span>

                                            <span className="tw-w-16 tw-flex-shrink-0 tw-text-end tw-text-xs tw-font-semibold tw-text-gray-800">
                                                {formatCount(total)}
                                            </span>
                                            <span className="tw-w-20 tw-flex-shrink-0 tw-text-end tw-text-xs tw-text-gray-500">
                                                {formatMoney(day.spend)}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <NoDataComp
                                    title="No WhatsApp usage found"
                                    helperText="Try widening the selected date range."
                                />
                            )}

                            {daily.length > DAYS_PER_PAGE && (
                                <div className="tw-mt-3 tw-flex tw-items-center tw-justify-end tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        disabled={dayPage <= 1}
                                        onClick={() =>
                                            setDayPage(current =>
                                                Math.max(1, current - 1),
                                            )
                                        }
                                    >
                                        <i className="ri-arrow-left-s-line"></i>
                                        Previous
                                    </Button>
                                    <span className="tw-text-xs tw-text-gray-500">
                                        Page {dayPage} of {totalDayPages}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        disabled={dayPage >= totalDayPages}
                                        onClick={() =>
                                            setDayPage(current =>
                                                Math.min(
                                                    totalDayPages,
                                                    current + 1,
                                                ),
                                            )
                                        }
                                    >
                                        Next
                                        <i className="ri-arrow-right-s-line"></i>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {breakdownCard(
                        "Account-wise usage",
                        accountRows,
                        "No account usage available.",
                    )}
                    {breakdownCard(
                        "Branch-wise usage",
                        branchRows,
                        "No branch usage found for the selected filters.",
                    )}
                    {breakdownCard(
                        "Campaign-wise usage",
                        analytics.campaignWise,
                        "No campaign usage found for the selected filters.",
                    )}
                </div>

                <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                    <span className="tw-text-sm tw-text-gray-600">
                        Delivered / read / sent{" "}
                        <strong className="tw-text-gray-800">
                            {formatCount(summary.delivered)}
                        </strong>
                    </span>
                    <span className="tw-text-sm tw-text-gray-600">
                        Pending{" "}
                        <strong className="tw-text-gray-800">
                            {formatCount(summary.pending)}
                        </strong>
                    </span>
                    <span className="tw-text-sm tw-text-gray-600">
                        Failed{" "}
                        <strong className="tw-text-gray-800">
                            {formatCount(summary.failed)}
                        </strong>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DashboardTab;

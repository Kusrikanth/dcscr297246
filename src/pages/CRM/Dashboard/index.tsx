import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";
import { useHistory } from "react-router-dom";
import {
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import { toast } from "react-toastify";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import {
    Button,
    SelectInput,
    TextIconInput,
} from "../../../Components/Common";
import {
    canViewSavedReport,
    readSavedReports,
    savedReportsChangedEvent,
    type ReportDefinition,
} from "../Reports/helper";

import DashboardFilters from "./DashboardFilters";
import SavedReportsTab from "./SavedReportsTab";
import ActivityWidget from "./widgets/ActivityWidget";
import CurriculumStageWidget from "./widgets/CurriculumStageWidget";
import FunnelWidget from "./widgets/FunnelWidget";
import SavedReportWidget from "./widgets/SavedReportWidget";
import StatsWidget from "./widgets/StatsWidget";
import {
    applyDashboardFilters,
    applyFilterCascade,
    buildActivityTrends,
    buildFilterOptions,
    buildFunnel,
    buildStatCards,
    dashboardFilterCount,
    dashboardLeads,
    dashboardStages,
    greeting,
    initialDashboardFilters,
    todayLabel,
    type DashboardFilterState,
} from "./helper";
import {
    DASHBOARD_LAYOUT_EVENT,
    DASHBOARD_WIDGETS,
    dashboardMoveTarget,
    dashboardHeightClass,
    dashboardHeightOptions,
    dashboardSizeOptions,
    defaultDashboardLayout,
    isReportWidget,
    isSameDashboardLayout,
    normalizeDashboardLayout,
    readDashboardLayout,
    reportIdOf,
    writeDashboardLayout,
    type DashboardLayoutItem,
    type DashboardWidgetHeight,
    type DashboardWidgetSize,
} from "./dashboardLayout";

const COLUMN_SPAN: Record<string, string> = {
    quarter: "col-12 col-xl-3",
    half: "col-12 col-xl-6",
    "three-quarter": "col-12 col-xl-9",
    full: "col-12",
};

const CRMDashboard = () => {
    const history = useHistory();

    const [activeTabId, setActiveTabId] =
        useState<string>("overview");
    const [filters, setFilters] =
        useState<DashboardFilterState>(
            initialDashboardFilters,
        );
    const [filtersOpen, setFiltersOpen] =
        useState<boolean>(false);

    const [savedReports, setSavedReports] = useState<
        ReportDefinition[]
    >(() => readSavedReports());
    const [savedLayout, setSavedLayout] = useState<
        DashboardLayoutItem[]
    >(() => readDashboardLayout());
    const [layout, setLayout] = useState<
        DashboardLayoutItem[]
    >(savedLayout);
    const [isEditingLayout, setIsEditingLayout] =
        useState<boolean>(false);
    const [widgetSearch, setWidgetSearch] =
        useState<string>("");

    useEffect(() => {
        const reload = () => {
            const nextLayout = readDashboardLayout();

            setSavedReports(readSavedReports());
            setSavedLayout(nextLayout);
            setLayout(current =>
                isEditingLayout ? current : nextLayout,
            );
        };

        window.addEventListener(
            DASHBOARD_LAYOUT_EVENT,
            reload,
        );
        window.addEventListener(
            savedReportsChangedEvent,
            reload,
        );
        window.addEventListener("storage", reload);

        return () => {
            window.removeEventListener(
                DASHBOARD_LAYOUT_EVENT,
                reload,
            );
            window.removeEventListener(
                savedReportsChangedEvent,
                reload,
            );
            window.removeEventListener("storage", reload);
        };
    }, [isEditingLayout]);

    const filterOptions = useMemo(
        () => buildFilterOptions(dashboardLeads, filters),
        [filters],
    );

    const filteredLeads = useMemo(
        () => applyDashboardFilters(dashboardLeads, filters),
        [filters],
    );

    const statCards = useMemo(
        () => buildStatCards(filteredLeads),
        [filteredLeads],
    );

    const funnel = useMemo(
        () => buildFunnel(filteredLeads),
        [filteredLeads],
    );

    const activityTrends = useMemo(
        () => buildActivityTrends(filteredLeads, filters),
        [filteredLeads, filters],
    );

    const activeFilterCount = dashboardFilterCount(filters);

    const multiChangeHandler = (
        key: keyof DashboardFilterState,
        values: string[],
    ) => {
        setFilters(current =>
            applyFilterCascade(current, key, values),
        );
    };

    const dateFieldChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setFilters(current => ({
            ...current,
            dateField: event.target
                .value as DashboardFilterState["dateField"],
        }));
    };

    const dateRangeChangeHandler = (dates: {
        startDate: string;
        endDate: string;
    }) => {
        setFilters(current => ({
            ...current,
            dateFrom: dates.startDate,
            dateTo: dates.endDate,
        }));
    };

    const clearFiltersHandler = () => {
        setFilters(initialDashboardFilters);
        toast.success("Dashboard filters cleared");
    };

    const visibleSavedReports = useMemo(
        () =>
            savedReports.filter(report =>
                canViewSavedReport(report),
            ),
        [savedReports],
    );

    const visibleLayout = useMemo(
        () => layout.filter(item => item.visible !== false),
        [layout],
    );

    const isDirty = !isSameDashboardLayout(
        layout,
        savedLayout,
    );

    const stageLayout = (next: DashboardLayoutItem[]) =>
        setLayout(normalizeDashboardLayout(next));

    const patchWidget = (
        id: string,
        values: Partial<DashboardLayoutItem>,
    ) =>
        stageLayout(
            layout.map(item =>
                item.id === id
                    ? { ...item, ...values }
                    : item,
            ),
        );

    const moveWidget = (
        id: string,
        direction: "left" | "right" | "up" | "down",
    ) => {
        const targetId = dashboardMoveTarget(
            visibleLayout,
            id,
            direction,
        );

        if (!targetId) {
            return;
        }

        const next = [...layout];
        const from = next.findIndex(item => item.id === id);
        const to = next.findIndex(
            item => item.id === targetId,
        );

        [next[from], next[to]] = [next[to], next[from]];
        stageLayout(next);
    };

    const addWidgetHandler = (id: string) => {
        stageLayout(
            layout.some(item => item.id === id)
                ? layout.map(item =>
                    item.id === id
                        ? { ...item, visible: true }
                        : item,
                )
                : [
                    {
                        id,
                        size: "half" as DashboardWidgetSize,
                        height: "auto" as DashboardWidgetHeight,
                        visible: true,
                    },
                    ...layout,
                ],
        );
        setWidgetSearch("");
    };

    const availableItems = useMemo(() => {
        const term = widgetSearch.trim().toLowerCase();

        const hiddenWidgets = DASHBOARD_WIDGETS.filter(
            widget =>
                !layout.some(
                    item =>
                        item.id === widget.id &&
                        item.visible !== false,
                ),
        ).map(widget => ({
            id: widget.id,
            title: widget.title,
            subtitle: "Dashboard widget",
        }));

        const hiddenReports = visibleSavedReports
            .filter(
                report =>
                    !layout.some(
                        item =>
                            item.id ===
                            `report:${report.id}` &&
                            item.visible !== false,
                    ),
            )
            .map(report => ({
                id: `report:${report.id}`,
                title: report.title || "Untitled report",
                subtitle: `${report.type || "Report"} saved report`,
            }));

        return [...hiddenWidgets, ...hiddenReports].filter(
            item =>
                !term ||
                `${item.title} ${item.subtitle}`
                    .toLowerCase()
                    .includes(term),
        );
    }, [layout, visibleSavedReports, widgetSearch]);

    const saveLayoutHandler = () => {
        setSavedLayout(writeDashboardLayout(layout));
        setIsEditingLayout(false);
        toast.success("Dashboard layout saved");
    };

    const discardLayoutHandler = () => {
        setLayout(savedLayout);
        setIsEditingLayout(false);
    };

    const resetLayoutHandler = () => {
        stageLayout(defaultDashboardLayout());
        setWidgetSearch("");
    };

    const tabClickHandler = (
        event: MouseEvent<HTMLElement>,
    ) => {
        const tabId =
            event.currentTarget.getAttribute("data-id");

        if (tabId) {
            setActiveTabId(tabId);
        }
    };

    const menuOptions = useMemo(
        () => [
            {
                id: "overview",
                labelName: "Overview",
                customPadding: "0px 14px",
                count: visibleLayout.length,
            },
            {
                id: "saved",
                labelName: "Saved Reports",
                customPadding: "0px 14px",
                count: visibleSavedReports.length,
            },
        ],
        [visibleLayout.length, visibleSavedReports.length],
    );

    const renderWidget = (item: DashboardLayoutItem) => {
        if (isReportWidget(item.id)) {
            const report = visibleSavedReports.find(
                saved =>
                    String(saved.id) === reportIdOf(item.id),
            );

            if (!report) {
                return null;
            }

            return (
                <SavedReportWidget
                    report={report}
                    leads={filteredLeads}
                />
            );
        }

        if (item.id === "stats") {
            return (
                <StatsWidget
                    cards={statCards}
                    size={item.size}
                />
            );
        }

        if (item.id === "activity") {
            return <ActivityWidget trends={activityTrends} />;
        }

        if (item.id === "funnel") {
            return <FunnelWidget funnel={funnel} />;
        }

        if (item.id === "curriculum-stage") {
            return (
                <CurriculumStageWidget
                    leads={filteredLeads}
                    stages={dashboardStages}
                />
            );
        }

        return null;
    };

    const widgetTitle = (item: DashboardLayoutItem) => {
        if (isReportWidget(item.id)) {
            return (
                visibleSavedReports.find(
                    saved =>
                        String(saved.id) ===
                        reportIdOf(item.id),
                )?.title || "Saved report"
            );
        }

        return (
            DASHBOARD_WIDGETS.find(
                widget => widget.id === item.id,
            )?.title || item.id
        );
    };

    return (
        <div className="page-content crm_dashboard_wrapper">
            <div className="container-fluid">
                <BreadCrumb title="Dashboard" pageTitle="CRM" />

                <div className="tw-card">
                    <div className="tw-card-header">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                            <div>
                                <p className="tw-mb-0 tw-text-xs tw-font-semibold tw-uppercase tw-tracking-wide tw-text-gray-500">
                                    {todayLabel()}
                                </p>
                                <h4 className="tw-card-title tw-mb-0">
                                    Good {greeting()}
                                </h4>
                                <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                    Here's what needs your
                                    admissions team's attention
                                    today.
                                </p>
                            </div>

                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                <Button
                                    type="button"
                                    variant={filtersOpen ? "primary" : "hoverInfo"}
                                    onClick={() =>
                                        setFiltersOpen(
                                            current => !current,
                                        )
                                    }
                                >
                                    <i className="ri-filter-3-line tw-me-1"></i>
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="badge badge-soft-danger tw-ms-1">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </Button>

                                {activeFilterCount > 0 && (
                                    <Button
                                        type="button"
                                        variant="reject"
                                        onClick={
                                            clearFiltersHandler
                                        }
                                    >
                                        <i className="ri-filter-off-line tw-me-1"></i>
                                        Clear
                                    </Button>
                                )}

                                {activeTabId === "overview" && (
                                    <Button
                                        type="button"
                                        variant={
                                            isEditingLayout
                                                ? "primary"
                                                : "hoverInfo"
                                        }
                                        onClick={() =>
                                            isEditingLayout
                                                ? discardLayoutHandler()
                                                : setIsEditingLayout(
                                                    true,
                                                )
                                        }
                                    >
                                        <i className="ri-layout-grid-line tw-me-1"></i>
                                        {isEditingLayout
                                            ? "Exit layout editor"
                                            : "Customise layout"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {filtersOpen && (
                        <DashboardFilters
                            filters={filters}
                            options={filterOptions}
                            onMultiChange={multiChangeHandler}
                            onDateFieldChange={
                                dateFieldChangeHandler
                            }
                            onDateRangeChange={
                                dateRangeChangeHandler
                            }
                        />
                    )}

                    <div className="tw-mt-3">
                        <UpdatedHorizontalTab
                            MenuOptions={menuOptions}
                            clickMenuHandler={tabClickHandler}
                            activeTabId={activeTabId}
                            showBadge
                            horizontalClass="use-small-font"
                        />
                    </div>

                    <div className="tw-card-body">
                        {activeTabId === "overview" ? (
                            <>
                                {isEditingLayout && (
                                    <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                                        <div>
                                            <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                                Dashboard layout
                                                editor
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                Add widgets and
                                                adjust how the
                                                overview appears.
                                                {isDirty
                                                    ? " You have unsaved changes."
                                                    : ""}
                                            </p>
                                        </div>

                                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                            <UncontrolledDropdown>
                                                <DropdownToggle
                                                    tag="button"
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    <i className="ri-add-fill tw-me-1"></i>
                                                    Add widget /
                                                    report
                                                </DropdownToggle>
                                                <DropdownMenu
                                                    end
                                                    className="tw-w-72 tw-p-3"
                                                >
                                                    <TextIconInput
                                                        formgroupClassName="search-box tw-mb-2"
                                                        name="widgetSearch"
                                                        value={
                                                            widgetSearch
                                                        }
                                                        onChange={(
                                                            event: ChangeEvent<HTMLInputElement>,
                                                        ) =>
                                                            setWidgetSearch(
                                                                event
                                                                    .target
                                                                    .value,
                                                            )
                                                        }
                                                        placeHolder="Search widgets or saved reports…"
                                                    >
                                                        <i className="ri-search-line search-icon"></i>
                                                    </TextIconInput>

                                                    {availableItems.length ? (
                                                        availableItems.map(
                                                            option => (
                                                                <Button
                                                                    key={
                                                                        option.id
                                                                    }
                                                                    type="button"
                                                                    variant="sidebarMenu"
                                                                    className="tw-mb-1 tw-w-full !tw-flex-col tw-px-2 tw-py-1 tw-text-start hover:tw-bg-gray-100"
                                                                    onClick={() =>
                                                                        addWidgetHandler(
                                                                            option.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="tw-block tw-text-sm tw-font-medium tw-text-gray-800">
                                                                        {
                                                                            option.title
                                                                        }
                                                                    </span>
                                                                    <small className="tw-text-gray-500">
                                                                        {
                                                                            option.subtitle
                                                                        }
                                                                    </small>
                                                                </Button>
                                                            ),
                                                        )
                                                    ) : (
                                                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                                            No
                                                            hidden
                                                            widgets
                                                            or
                                                            saved
                                                            reports
                                                            found.
                                                        </p>
                                                    )}
                                                </DropdownMenu>
                                            </UncontrolledDropdown>

                                            <Button
                                                type="button"
                                                variant="hoverInfo"
                                                onClick={
                                                    resetLayoutHandler
                                                }
                                            >
                                                Reset layout
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                disabled={
                                                    !isDirty
                                                }
                                                onClick={
                                                    discardLayoutHandler
                                                }
                                            >
                                                Discard
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="primary"
                                                disabled={
                                                    !isDirty
                                                }
                                                onClick={
                                                    saveLayoutHandler
                                                }
                                            >
                                                Save changes
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {visibleLayout.length ? (
                                    <div className="row tw-gap-y-3">
                                        {visibleLayout.map(
                                            item => {
                                                const content =
                                                    renderWidget(
                                                        item,
                                                    );

                                                if (!content) {
                                                    return null;
                                                }

                                                return (
                                                    <div
                                                        key={
                                                            item.id
                                                        }
                                                        className={`${COLUMN_SPAN[
                                                            item
                                                                .size
                                                        ] ||
                                                            COLUMN_SPAN.half
                                                            } ${dashboardHeightClass[
                                                            item.height
                                                            ] || ""}`}
                                                    >
                                                        {isEditingLayout && (
                                                            <div className="tw-mb-2 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-border-dashed tw-border-gray-300 tw-bg-white tw-p-2">
                                                                <strong className="tw-me-auto tw-text-sm tw-text-gray-700">
                                                                    {widgetTitle(
                                                                        item,
                                                                    )}
                                                                </strong>

                                                                {(
                                                                    [
                                                                        [
                                                                            "left",
                                                                            "ri-arrow-left-line",
                                                                        ],
                                                                        [
                                                                            "right",
                                                                            "ri-arrow-right-line",
                                                                        ],
                                                                        [
                                                                            "up",
                                                                            "ri-arrow-up-line",
                                                                        ],
                                                                        [
                                                                            "down",
                                                                            "ri-arrow-down-line",
                                                                        ],
                                                                    ] as Array<
                                                                        [
                                                                            "left" | "right" | "up" | "down",
                                                                            string,
                                                                        ]
                                                                    >
                                                                ).map(
                                                                    ([
                                                                        direction,
                                                                        icon,
                                                                    ]) => (
                                                                        <Button
                                                                            key={
                                                                                direction
                                                                            }
                                                                            type="button"
                                                                            variant="secondary"
                                                                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                                                            title={`Move ${widgetTitle(item)} ${direction}`}
                                                                            aria-label={`Move ${widgetTitle(item)} ${direction}`}
                                                                            disabled={
                                                                                !dashboardMoveTarget(
                                                                                    visibleLayout,
                                                                                    item.id,
                                                                                    direction,
                                                                                )
                                                                            }
                                                                            onClick={() =>
                                                                                moveWidget(
                                                                                    item.id,
                                                                                    direction,
                                                                                )
                                                                            }
                                                                        >
                                                                            <i
                                                                                className={
                                                                                    icon
                                                                                }
                                                                            ></i>
                                                                        </Button>
                                                                    ),
                                                                )}

                                                                <div className="tw-w-40">
                                                                    <SelectInput
                                                                        name={`size-${item.id}`}
                                                                        value={
                                                                            item.size
                                                                        }
                                                                        onChange={(
                                                                            event: ChangeEvent<HTMLSelectElement>,
                                                                        ) =>
                                                                            patchWidget(
                                                                                item.id,
                                                                                {
                                                                                    size: event
                                                                                        .target
                                                                                        .value as DashboardWidgetSize,
                                                                                },
                                                                            )
                                                                        }
                                                                        menuItems={
                                                                            dashboardSizeOptions
                                                                        }
                                                                        valueKey="id"
                                                                        textKey="name"
                                                                        hideSelectOption
                                                                        formgroupClassName="tw-mb-0"
                                                                    />
                                                                </div>

                                                                <div className="tw-w-40">
                                                                    <SelectInput
                                                                        name={`height-${item.id}`}
                                                                        value={
                                                                            item.height
                                                                        }
                                                                        onChange={(
                                                                            event: ChangeEvent<HTMLSelectElement>,
                                                                        ) =>
                                                                            patchWidget(
                                                                                item.id,
                                                                                {
                                                                                    height: event
                                                                                        .target
                                                                                        .value as DashboardWidgetHeight,
                                                                                },
                                                                            )
                                                                        }
                                                                        menuItems={
                                                                            dashboardHeightOptions
                                                                        }
                                                                        valueKey="id"
                                                                        textKey="name"
                                                                        hideSelectOption
                                                                        formgroupClassName="tw-mb-0"
                                                                    />
                                                                </div>

                                                                {isReportWidget(
                                                                    item.id,
                                                                ) && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="wrong"
                                                                            onClick={() =>
                                                                                patchWidget(
                                                                                    item.id,
                                                                                    {
                                                                                        visible:
                                                                                            false,
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    )}
                                                            </div>
                                                        )}

                                                        {content}
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : (
                                    <div className="tw-py-10 tw-text-center">
                                        <p className="tw-mb-1 tw-text-base tw-font-semibold tw-text-gray-900">
                                            No widgets on your
                                            dashboard
                                        </p>
                                        <p className="tw-mb-3 tw-text-sm tw-text-gray-500">
                                            Every widget is
                                            hidden for this view.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="hoverInfo"
                                            onClick={
                                                resetLayoutHandler
                                            }
                                        >
                                            Restore the default
                                            layout
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <SavedReportsTab
                                reports={savedReports}
                                leads={filteredLeads}
                                onCreateNew={() =>
                                    history.push("/crm-reports")
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CRMDashboard;

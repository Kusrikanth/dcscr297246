export type DashboardWidgetSize =
    | "quarter"
    | "half"
    | "three-quarter"
    | "full";

export type DashboardWidgetHeight =
    | "auto"
    | "short"
    | "medium"
    | "tall"
    | "x-tall";

export interface DashboardLayoutItem {
    id: string;
    size: DashboardWidgetSize;
    height: DashboardWidgetHeight;
    visible: boolean;
}

export interface DashboardWidgetDefinition {
    id: string;
    title: string;
    size: DashboardWidgetSize;
}

export const DASHBOARD_WIDGETS: DashboardWidgetDefinition[] = [
    {
        id: "stats",
        title: "Performance cards",
        size: "half",
    },
    {
        id: "activity",
        title: "My daily CRM activity",
        size: "half",
    },
    {
        id: "funnel",
        title: "Admissions funnel",
        size: "half",
    },
    {
        id: "curriculum-stage",
        title: "Leads by branch, curriculum, class and stage",
        size: "full",
    },
];

const DASHBOARD_SIZES: DashboardWidgetSize[] = [
    "quarter",
    "half",
    "three-quarter",
    "full",
];

const DASHBOARD_HEIGHTS: DashboardWidgetHeight[] = [
    "auto",
    "short",
    "medium",
    "tall",
    "x-tall",
];

export const dashboardHeightOptions = [
    { id: "auto", name: "Fit content" },
    { id: "short", name: "Short" },
    { id: "medium", name: "Medium" },
    { id: "tall", name: "Tall" },
    { id: "x-tall", name: "Extra tall" },
];

export const dashboardHeightClass: Record<string, string> = {
    auto: "",
    short: "tw-h-[260px] tw-overflow-auto",
    medium: "tw-h-[380px] tw-overflow-auto",
    tall: "tw-h-[520px] tw-overflow-auto",
    "x-tall": "tw-h-[680px] tw-overflow-auto",
};

export const dashboardSizeOptions = [
    { id: "quarter", name: "Quarter width" },
    { id: "half", name: "Half width" },
    { id: "three-quarter", name: "Three-quarter width" },
    { id: "full", name: "Full width" },
];

export const DASHBOARD_LAYOUT_EVENT =
    "crm:dashboard-layout-changed";

const DASHBOARD_LAYOUT_KEY =
    "crm_dashboard_overview_layout";

export const isReportWidget = (id: string) =>
    String(id || "").startsWith("report:");

export const reportIdOf = (id: string) =>
    isReportWidget(id) ? String(id).slice(7) : "";

export function normalizeDashboardLayout(
    layout: unknown,
): DashboardLayoutItem[] {
    const known = new Set(
        DASHBOARD_WIDGETS.map(widget => widget.id),
    );
    const validSizes = new Set<string>(DASHBOARD_SIZES);
    const validHeights = new Set<string>(DASHBOARD_HEIGHTS);
    const source = Array.isArray(layout)
        ? (layout as Array<Partial<DashboardLayoutItem>>)
        : [];

    const cleaned: DashboardLayoutItem[] = source
        .filter(
            item =>
                known.has(String(item.id)) ||
                isReportWidget(String(item.id)),
        )
        .map(item => ({
            id: String(item.id),
            size: (validSizes.has(String(item.size))
                ? item.size
                : "half") as DashboardWidgetSize,
            height: (validHeights.has(String(item.height))
                ? item.height
                : "auto") as DashboardWidgetHeight,
            visible: known.has(String(item.id))
                ? true
                : item.visible !== false,
        }));

    const existing = new Set(cleaned.map(item => item.id));

    DASHBOARD_WIDGETS.forEach(widget => {
        if (!existing.has(widget.id)) {
            cleaned.push({
                id: widget.id,
                size: widget.size,
                height: "auto",
                visible: true,
            });
        }
    });

    return cleaned;
}

export function defaultDashboardLayout(): DashboardLayoutItem[] {
    return DASHBOARD_WIDGETS.map(widget => ({
        id: widget.id,
        size: widget.size,
        height: "auto" as DashboardWidgetHeight,
        visible: true,
    }));
}

export function readDashboardLayout(): DashboardLayoutItem[] {
    try {
        const saved = JSON.parse(
            localStorage.getItem(DASHBOARD_LAYOUT_KEY) || "null",
        );

        if (Array.isArray(saved) && saved.length) {
            return normalizeDashboardLayout(saved);
        }
    } catch (error) {
        console.error("Failed to read the saved dashboard layout:", error);
    }

    return defaultDashboardLayout();
}

export function writeDashboardLayout(
    layout: DashboardLayoutItem[],
): DashboardLayoutItem[] {
    const normalized = normalizeDashboardLayout(layout);

    localStorage.setItem(
        DASHBOARD_LAYOUT_KEY,
        JSON.stringify(normalized),
    );
    window.dispatchEvent(
        new CustomEvent(DASHBOARD_LAYOUT_EVENT),
    );

    return normalized;
}

export function isSameDashboardLayout(
    left: DashboardLayoutItem[],
    right: DashboardLayoutItem[],
) {
    if (left.length !== right.length) {
        return false;
    }

    return left.every((item, index) => {
        const other = right[index];

        return (
            Boolean(other) &&
            item.id === other.id &&
            item.size === other.size &&
            (item.height || "auto") === (other.height || "auto") &&
            item.visible !== false ===
            (other.visible !== false)
        );
    });
}

const SPANS: Record<string, number> = {
    quarter: 1,
    half: 2,
    "three-quarter": 3,
    full: 4,
};

export const dashboardWidgetSpan = (size: string) =>
    SPANS[size] || 2;

function dashboardGridPositions(
    items: DashboardLayoutItem[],
) {
    let row = 0;
    let column = 0;

    return items.map(item => {
        const span = dashboardWidgetSpan(item.size);

        if (column + span > 4) {
            row += 1;
            column = 0;
        }

        const position = {
            id: item.id,
            row,
            column,
            span,
            center: column + span / 2,
        };

        column += span;

        if (column === 4) {
            row += 1;
            column = 0;
        }

        return position;
    });
}

export function dashboardMoveTarget(
    items: DashboardLayoutItem[],
    id: string,
    direction: "left" | "right" | "up" | "down",
): string | null {
    const positions = dashboardGridPositions(items);
    const current = positions.find(
        position => position.id === id,
    );

    if (!current) {
        return null;
    }

    if (direction === "left" || direction === "right") {
        const candidates = positions
            .filter(
                position =>
                    position.row === current.row &&
                    (direction === "left"
                        ? position.column < current.column
                        : position.column > current.column),
            )
            .sort((a, b) =>
                direction === "left"
                    ? b.column - a.column
                    : a.column - b.column,
            );

        return candidates[0]?.id || null;
    }

    const candidates = positions.filter(position =>
        direction === "up"
            ? position.row < current.row
            : position.row > current.row,
    );

    if (!candidates.length) {
        return null;
    }

    const targetRow =
        direction === "up"
            ? Math.max(
                ...candidates.map(position => position.row),
            )
            : Math.min(
                ...candidates.map(position => position.row),
            );

    return (
        candidates
            .filter(position => position.row === targetRow)
            .sort(
                (a, b) =>
                    Math.abs(a.center - current.center) -
                    Math.abs(b.center - current.center),
            )[0]?.id || null
    );
}

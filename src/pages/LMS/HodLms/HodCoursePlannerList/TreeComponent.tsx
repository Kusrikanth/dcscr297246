import React, { useContext, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { IFeature, ISubTreeParentInfo, StatusPill } from "./helper";
export type ExpandCollapseAction = "EXPAND_ALL" | "COLLAPSE_ALL" | "EXPAND" | "COLLAPSE" | "";

export type ExpandCollapseState = {
  action: ExpandCollapseAction;
  ids: string[];
  version: number;
};

export interface ITreeContext {
  value: ExpandCollapseState;
  toggle: (action: ExpandCollapseAction, ids?: string[]) => void;
}

export const TreeContextProvider = React.createContext<ITreeContext>({
  value: { action: "", ids: [], version: 0 },
  toggle: () => { },
});
const fmtDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : "—");

const fmtWeekRange = (
  weeks?: { weekName?: string; weekStartDate?: string; weekEndDate?: string }[]
) => {
  if (!weeks || weeks.length === 0) return [];
  return weeks.map((w) => {
    const start = fmtDate(w.weekStartDate);
    const end = fmtDate(w.weekEndDate);
    const hasAnyDate = Boolean(w.weekStartDate || w.weekEndDate);

    return {
      name: w.weekName || "Week",
      range: hasAnyDate ? `${start} → ${end}` : "Dates not set",
    };
  });
};

const INDEX_STYLE = [
  "",
  "tw-bg-sky-100 tw-text-sky-700",
  "tw-bg-amber-100 tw-text-amber-700",
  "tw-bg-emerald-100 tw-text-emerald-700",
];

const TEXT_STYLE = [
  "",
  "tw-text-gray-900 tw-font-semibold",
  "tw-text-gray-800 tw-font-medium",
  "tw-text-gray-700",
];

export function ModuleTree({
  id,
  parentsInfo = [],
  level,
  description,
  indexNumber,
  subFeatures,
  meta,
  showEmptyMeta = false,
}: {
  id: string;
  parentsInfo: ISubTreeParentInfo[];
  level: number;
  description: string;
  indexNumber: string;
  subFeatures: IFeature[];
  meta?: IFeature["meta"];
  showEmptyMeta?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  const { value } = useContext(TreeContextProvider);
  const hasChildren = subFeatures.length > 0;

  const updatedParents = useMemo(
    () => [...parentsInfo, { parentFeatureId: id, parentFeatureName: description }],
    [parentsInfo, id, description]
  );

  useEffect(() => {
    if (value.action === "EXPAND_ALL") setIsOpen(true);
    if (value.action === "COLLAPSE_ALL") setIsOpen(false);

    if (
      value.action === "COLLAPSE" &&
      value.ids.some((pid) => parentsInfo.some((p) => p.parentFeatureId === pid))
    ) {
      setIsOpen(false);
    }
  }, [value.action, value.ids, value.version, parentsInfo]);
  const weekLines = useMemo(() => fmtWeekRange(meta?.weeks), [meta?.weeks]);
  const previewCount = 2;
  const hasMoreWeeks = weekLines.length > previewCount;
  const shownWeeks = showAllWeeks ? weekLines : weekLines.slice(0, previewCount);

  const termLabel = meta?.termName ?? (showEmptyMeta ? "Not set" : null);

  const hoursLabel =
    meta?.plannedTeachingHours || meta?.plannedTeachingHours === 0
      ? `${meta.plannedTeachingHours} hrs`
      : showEmptyMeta
        ? "Hours not set"
        : null;

  const sessionsLabel =
    meta?.totalSessions || meta?.totalSessions === 0
      ? `${meta.totalSessions} sessions`
      : showEmptyMeta
        ? "Sessions not set"
        : null;

  const minutesLabel =
    meta?.minPerSession || meta?.minPerSession === 0
      ? `${meta.minPerSession} min / session`
      : showEmptyMeta
        ? "Min/session not set"
        : null;

  const weeksLabel =
    weekLines.length > 0 ? `Weeks: ${weekLines.length}` : showEmptyMeta ? "Weeks not set" : null;

  return (
    <>
      <div
        className={classnames(
          "tw-rounded-2xl tw-border tw-border-slate-100 tw-bg-white",
          "tw-px-4 tw-py-3 tw-mb-2",
          "hover:tw-bg-slate-50 hover:tw-border-slate-200 hover:tw-shadow-sm",
          isOpen && "tw-bg-slate-50 tw-border-slate-200"
        )}
        style={{ marginLeft: (level - 1) * 18 }}
      >
        <div className="tw-grid tw-grid-cols-[auto,1fr] tw-gap-3 tw-items-start">
          <button
            type="button"
            className={classnames(
              "tw-flex tw-items-start tw-gap-3 tw-text-left tw-w-full",
              hasChildren ? "tw-cursor-pointer" : "tw-cursor-default"
            )}
            onClick={hasChildren ? () => setIsOpen((p) => !p) : undefined}
          >
            <div className="tw-mt-0.5 tw-w-5 tw-flex tw-justify-center tw-shrink-0">
              {hasChildren ? (
                <i
                  className={classnames(
                    "ri-arrow-right-s-line tw-transition-transform tw-text-slate-500",
                    isOpen && "tw-rotate-90"
                  )}
                />
              ) : (
                <span className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-slate-300 tw-mt-2" />
              )}
            </div>
            <span
              className={classnames(
                "tw-text-xs tw-font-semibold tw-px-2.5 tw-py-1 tw-rounded-xl tw-shrink-0",
                INDEX_STYLE[level]
              )}
            >
              {indexNumber}
            </span>
            <div className="tw-min-w-0">
              <div className={classnames("tw-text-sm tw-truncate", TEXT_STYLE[level])}>
                {description}
              </div>
            </div>
          </button>
          <div
            className="tw-flex tw-flex-wrap tw-gap-2 tw-justify-end tw-items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {termLabel && (
              <StatusPill
                tone={termLabel === "Not set" ? "neutral" : "info"}
                variant="soft"
                size="sm"
                label={termLabel}
                title="Term"
              />
            )}
            {hoursLabel && (
              <StatusPill
                tone={hoursLabel === "Hours not set" ? "neutral" : "success"}
                variant="soft"
                size="sm"
                label={hoursLabel}
                title="Planned Teaching Hours"
              />
            )}
            {sessionsLabel && (
              <StatusPill
                tone={sessionsLabel === "Sessions not set" ? "neutral" : "neutral"}
                variant="soft"
                size="sm"
                label={sessionsLabel}
                title="Total Sessions"
              />
            )}
            {minutesLabel && (
              <StatusPill
                tone={minutesLabel === "Min/session not set" ? "neutral" : "warning"}
                variant="soft"
                size="sm"
                label={minutesLabel}
                title="Minutes per Session"
              />
            )}
            {weeksLabel && (
              <StatusPill
                tone={weeksLabel === "Weeks not set" ? "neutral" : "info"}
                variant="outline"
                size="sm"
                label={weeksLabel}
                title="Weeks"
                showDot={false}
              />
            )}
          </div>
        </div>
        {weekLines.length > 0 && (
          <div className="tw-mt-2 tw-pt-2 tw-border-t tw-border-slate-100 tw-text-xs tw-text-slate-600 tw-space-y-1">
            {shownWeeks.map((w, idx) => (
              <div key={idx} className="tw-flex tw-gap-2 tw-min-w-0">
                <span className="tw-font-medium tw-text-slate-700 tw-truncate">{w.name}:</span>
                <span className="tw-truncate">{w.range}</span>
              </div>
            ))}
            {hasMoreWeeks && (
              <button
                type="button"
                className="tw-mt-1 tw-text-[12px] tw-text-teal-700 hover:tw-underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllWeeks((p) => !p);
                }}
              >
                {showAllWeeks ? "Show fewer weeks" : `View all weeks (+${weekLines.length - previewCount})`}
              </button>
            )}
          </div>
        )}
      </div>
      <Collapse isOpen={isOpen}>
        <div className="tw-ml-4 tw-pl-4 tw-border-l tw-border-slate-200 tw-mt-2">
          {subFeatures.map((child) => (
            <ModuleTree
              key={child.id}
              level={level + 1}
              parentsInfo={updatedParents}
              showEmptyMeta={showEmptyMeta}
              {...child}
            />
          ))}
        </div>
      </Collapse>
    </>
  );
}

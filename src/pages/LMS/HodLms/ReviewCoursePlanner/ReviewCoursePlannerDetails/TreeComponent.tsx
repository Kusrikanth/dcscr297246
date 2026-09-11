import React, { useContext, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { IFeature, ISubTreeParentInfo, StatusPill, TreeContextProvider } from "./helper";

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

const fmtHours = (v?: number | string) => (v || v === 0 ? `${v} hrs` : null);
const fmtMinutes = (v?: number | string) => (v || v === 0 ? `${v} min / session` : null);
const fmtSessions = (v?: number | string) => (v || v === 0 ? `${v} sessions` : null);

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
}: {
  id: string;
  parentsInfo: ISubTreeParentInfo[];
  level: number;
  description: string;
  indexNumber: string;
  subFeatures: IFeature[];
  meta?: IFeature["meta"];
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
  }, [value, parentsInfo]);

  const weekLines = useMemo(() => fmtWeekRange(meta?.weeks), [meta?.weeks]);
  const previewCount = 2;
  const hasMoreWeeks = weekLines.length > previewCount;
  const shownWeeks = showAllWeeks ? weekLines : weekLines.slice(0, previewCount);

  const hours = fmtHours(meta?.plannedTeachingHours);
  const sessions = fmtSessions(meta?.totalSessions);
  const minutes = fmtMinutes(meta?.minPerSession);
  const term = meta?.termName;

  return (
    <>
      <div
        className={classnames(
          "tw-rounded-xl tw-px-3 tw-py-2 tw-mb-2 tw-border tw-border-transparent",
          "hover:tw-bg-gray-50 hover:tw-border-gray-100",
          isOpen && "tw-bg-gray-50 tw-border-gray-100"
        )}
        style={{ marginLeft: (level - 1) * 24 }}
        onClick={hasChildren ? () => setIsOpen((p) => !p) : undefined}
        role={hasChildren ? "button" : undefined}
      >
        <div className="tw-flex tw-items-start tw-gap-2">
          <div className="tw-mt-0.5 tw-w-4 tw-flex tw-justify-center">
            {hasChildren ? (
              <i
                className={classnames(
                  "ri-arrow-right-s-line tw-transition-transform tw-text-gray-500",
                  isOpen && "tw-rotate-90"
                )}
              />
            ) : (
              <span className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-gray-300 tw-mt-2" />
            )}
          </div>

          <span
            className={classnames(
              "tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-lg",
              INDEX_STYLE[level]
            )}
          >
            {indexNumber}
          </span>

          <div className="tw-flex-1 tw-min-w-0">
            <div className="tw-flex tw-items-start tw-justify-between tw-gap-3">
              <div className={classnames("tw-text-sm tw-truncate", TEXT_STYLE[level])}>
                {description}
              </div>

              <div className="tw-flex tw-flex-wrap tw-gap-2 tw-justify-end">
                {term && (
                  <StatusPill tone="info" variant="soft" size="sm" label={term} title="Term" />
                )}

                {hours && (
                  <StatusPill
                    tone="success"
                    variant="soft"
                    size="sm"
                    label={hours}
                    title="Planned Teaching Hours"
                  />
                )}

                {sessions && (
                  <StatusPill
                    tone="neutral"
                    variant="soft"
                    size="sm"
                    label={sessions}
                    title="Total Sessions"
                  />
                )}

                {minutes && (
                  <StatusPill
                    tone="warning"
                    variant="soft"
                    size="sm"
                    label={minutes}
                    title="Minutes per Session"
                  />
                )}

                {weekLines.length > 0 && (
                  <StatusPill
                    tone="info"
                    variant="outline"
                    size="sm"
                    label={`Weeks: ${weekLines.length}`}
                    title="Number of weeks"
                    showDot={false}
                  />
                )}
              </div>
            </div>

            {weekLines.length > 0 && (
              <div className="tw-mt-1 tw-text-xs tw-text-gray-500 tw-space-y-1">
                {shownWeeks.map((w, idx) => (
                  <div key={idx} className="tw-flex tw-gap-2 tw-min-w-0">
                    <span className="tw-font-medium tw-text-gray-600 tw-truncate">{w.name}:</span>
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
        </div>
      </div>

      <Collapse isOpen={isOpen}>
        <div className="tw-ml-3 tw-pl-3 tw-border-l tw-border-gray-200">
          {subFeatures.map((child) => (
            <ModuleTree
              key={child.id}
              level={level + 1}
              parentsInfo={updatedParents}
              {...child}
            />
          ))}
        </div>
      </Collapse>
    </>
  );
}

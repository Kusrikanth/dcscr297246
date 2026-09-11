import React, { useContext, useEffect, useMemo, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { IFeature, ISubTreeParentInfo, TreeContextProvider } from "./helper";

const PREFIX = ["", "U", "CH", "T"];
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
}: {
    id: string;
    parentsInfo: ISubTreeParentInfo[];
    level: number;
    description: string;
    indexNumber: string;
    subFeatures: IFeature[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const { value, toggle } = useContext(TreeContextProvider);
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

    return (
        <>
            <div
                className={classnames(
                    "tw-flex tw-items-center tw-gap-2 tw-rounded-xl tw-px-3 tw-py-2 tw-mb-2",
                    "hover:tw-bg-gray-50",
                    isOpen && "tw-bg-gray-50"
                )}
                style={{ marginLeft: (level - 1) * 24 }}
                onClick={hasChildren ? () => setIsOpen((p) => !p) : undefined}
            >
                {hasChildren && (
                    <i
                        className={classnames(
                            "ri-arrow-right-s-line tw-transition-transform",
                            isOpen && "tw-rotate-90"
                        )}
                    />
                )}
                <span className={classnames("tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-lg", INDEX_STYLE[level])}>
                    {PREFIX[level]} {indexNumber}
                </span>

                <span className={classnames("tw-text-sm tw-truncate", TEXT_STYLE[level])}>
                    {description}
                </span>
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

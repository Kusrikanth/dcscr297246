import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";
import { Collapse } from "reactstrap";
import { IFeature, ISubTreeParentInfo, TreeContextProvider } from "./helper";

export function ModuleTree({
    id: featureId,
    parentFeatureId,
    parentsInfo = [],
    level,
    description,
    indexNumber,
    subFeatures = [],
    totalChapters,
    totalTopics,
    totalHours,
    percentage,
    selectedNodeId,
    setSelectedNodeId,
    setSelectedNodeInfo,
    setActiveId
}: {
    id: string;
    parentFeatureId: string;
    parentsInfo: ISubTreeParentInfo[];
    level: number;
    description: string;
    indexNumber: string;
    subFeatures?: IFeature[];
    totalChapters?: number;
    totalTopics?: number;
    totalHours?: number;
    percentage?: number;
    selectedNodeId: string;
    setSelectedNodeId: (id: string) => void;
    setSelectedNodeInfo: (info: {
        id: string;
        level: number;
        description: string;
        indexNumber: string;
    }) => void;
    setActiveId: (id: string) => void;
}) {


    const [isOpen, setIsOpen] = useState(false);
    const { value, toggle } = useContext(TreeContextProvider);
    const parentInfoRef = useRef<string[]>(parentsInfo.map((item) => item.parentFeatureId));

    const updatedParentInfo = useMemo(() => {
        const next = [...parentsInfo];
        next.push({ parentFeatureId: featureId, parentFeatureName: description });
        return next;
    }, [parentsInfo, featureId, description]);

    const hasChildren = (subFeatures?.length || 0) > 0;

    useEffect(() => {
        const { ids, action } = value;
        if (action === "COLLAPSE" && ids.some((el) => parentInfoRef.current.includes(el))) {
            setIsOpen(false);
            return;
        }
        if (action === "EXPAND_ALL") {
            setIsOpen(true);
            return;
        }
        if (action === "COLLAPSE_ALL") {
            setIsOpen(false);
        }
    }, [value]);

    const getPrefix = () => {
        if (level === 1) return "U";
        if (level === 2) return "CH";
        if (level === 3) return "T";
        return "";
    };

    const getIndexStyles = () => {
        if (level === 1) return "tw-bg-sky-100 tw-text-sky-700";
        if (level === 2) return "tw-bg-amber-100 tw-text-amber-700";
        if (level === 3) return "tw-bg-emerald-100 tw-text-emerald-700";
        return "tw-bg-gray-100 tw-text-gray-700";
    };

    const getTextStyles = () => {
        if (level === 1) return "tw-text-gray-900 tw-font-semibold";
        if (level === 2) return "tw-text-gray-800 tw-font-medium";
        return "tw-text-gray-700 tw-font-normal";
    };

    function toggleHandler() {
        if (
            isOpen &&
            subFeatures.some((item) => (item.subFeatures ?? []).length > 0)
        ) {
            toggle("COLLAPSE", [featureId]);
        }

        setIsOpen((p) => !p);
    }

    const renderSummary = () => {
        if (level === 1) {
            return (
                <div className="tw-text-xs tw-text-gray-500">
                    {totalChapters} chapter{totalChapters !== 1 ? "s" : ""} ·{" "}
                    {totalTopics} topics · {totalHours}h · {percentage}%
                </div>
            );
        }

        if (level === 2) {
            return (
                <div className="tw-text-xs tw-text-gray-500">
                    {totalTopics} topics · {totalHours}h · {percentage}%
                </div>
            );
        }

        return null;
    };
    return (
        <>
            <div
                onClick={() => {
                    if (hasChildren) toggleHandler();
                    setSelectedNodeId(featureId);
                    setSelectedNodeInfo({
                        id: featureId,
                        level,
                        description,
                        indexNumber
                    });
                    if (level === 1) setActiveId("units");
                    if (level === 2) setActiveId("chapters");
                    if (level === 3) setActiveId("topics");
                }}
                className={classnames(
                    "tw-group tw-flex tw-items-center tw-justify-between tw-rounded-xl tw-px-3 tw-py-2 tw-mb-2 tw-transition",
                    selectedNodeId === featureId ? "tw-bg-emerald-50 tw-border tw-border-emerald-300" : "hover:tw-bg-gray-50"
                )}
            >
                <div className="tw-flex tw-items-center tw-gap-2 tw-min-w-0">
                    {hasChildren ? (
                        <i
                            className={classnames(
                                "ri-arrow-right-s-line tw-text-[#405189] tw-transition-transform tw-duration-150 tw-flex-shrink-0",
                                isOpen && "tw-rotate-90"
                            )}
                        />
                    ) : (
                        <span className="tw-w-[18px] tw-flex-shrink-0" />
                    )}
                    <span
                        className={classnames(
                            "tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-lg tw-flex-shrink-0",
                            getIndexStyles()
                        )}
                    >
                        {indexNumber}
                    </span>

                    <div className="tw-flex tw-flex-col tw-min-w-0">
                        <span className={classnames("tw-text-sm tw-truncate", getTextStyles())}>
                            {description}
                        </span>
                        {renderSummary()}
                    </div>

                </div>
            </div>
            <Collapse isOpen={isOpen}>
                <div className="tw-border-l tw-border-gray-200 tw-ml-3 tw-pl-3">
                    {subFeatures.map((item) => (
                        <ModuleTree
                            key={item.id}
                            parentsInfo={updatedParentInfo}
                            parentFeatureId={featureId}
                            selectedNodeId={selectedNodeId}
                            setSelectedNodeId={setSelectedNodeId}
                            setSelectedNodeInfo={setSelectedNodeInfo}
                            setActiveId={setActiveId}
                            {...item}
                        />
                    ))}
                </div>
            </Collapse>
        </>
    );
}
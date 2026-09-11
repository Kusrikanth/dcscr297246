import { useEffect, useMemo, useState } from "react";

import { Button, InputCheckbox } from "../../../../../Components/Common";
import type { BusinessUnitOption } from "../../helper";
import type { BusinessUnitConfig } from "../../businessunitconfig";

interface OverviewProps {
    config: BusinessUnitConfig;
    unit?: BusinessUnitOption;
    onSaveDuplicateRule: (fields: Array<string>) => void;
}

const Overview = ({ config, unit, onSaveDuplicateRule }: OverviewProps) => {
    const [selectedFields, setSelectedFields] = useState<Array<string>>(
        config.duplicateRule,
    );

    useEffect(() => {
        setSelectedFields(config.duplicateRule);
    }, [config.duplicateRule]);

    const fieldGroups = useMemo(() => {
        const groups: Array<{
            name: string;
            fields: BusinessUnitConfig["duplicateFields"];
        }> = [];

        config.duplicateFields.forEach(field => {
            const group = groups.find(item => item.name === field.group);

            if (group) {
                group.fields.push(field);
            } else {
                groups.push({ name: field.group, fields: [field] });
            }
        });

        return groups;
    }, [config.duplicateFields]);

    const labelFor = (key: string) =>
        config.duplicateFields.find(field => field.key === key)?.label || key;

    const isDirty =
        selectedFields.join(",") !== config.duplicateRule.join(",");

    const toggleFieldHandler = (key: string) =>
        setSelectedFields(current =>
            current.includes(key)
                ? current.filter(item => item !== key)
                : [...current, key],
        );

    const cards = [
        {
            id: "fields",
            label: "Lead fields",
            value: config.fields.length,
            icon: "ri-list-settings-line",
        },
        {
            id: "stages",
            label: "Pipeline stages",
            value: config.pipelineStages.length,
            icon: "ri-git-branch-line",
        },
        {
            id: "branches",
            label: "Branches",
            value: config.branches.length,
            icon: "ri-bank-card-line",
        },
        {
            id: "sources",
            label: "Lead sources",
            value: config.sources.length,
            icon: "ri-route-line",
        },
        {
            id: "campaigns",
            label: "Campaigns",
            value: config.campaigns.length,
            icon: "ri-megaphone-line",
        },
        {
            id: "tracker",
            label: "Tracker statuses",
            value: config.trackerStatuses.length,
            icon: "ri-flow-chart",
        },
    ];

    return (
        <>
            <div className="row tw-mb-4 tw-gap-y-3">
                {cards.map(card => (
                    <div key={card.id} className="col-6 col-md-4 col-xl-2">
                        <div className="tw-card tw-h-full">
                            <div className="tw-card-body tw-text-center">
                                <span
                                    className="tw-mx-auto tw-grid tw-h-10 tw-w-10 tw-place-items-center tw-rounded-full tw-text-white"
                                    style={{
                                        backgroundColor: unit?.color || "#405189",
                                    }}
                                >
                                    <i className={card.icon}></i>
                                </span>

                                <p className="tw-mb-0 tw-mt-2 tw-text-xl tw-font-semibold tw-text-gray-800">
                                    {card.value}
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tw-card">
                <div className="tw-card-body">
                    <p className="tw-mb-1 tw-text-base tw-font-semibold tw-text-gray-800">
                        {unit?.name || "Business unit"} configuration
                    </p>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                        {unit?.description ||
                            "No description provided for this business unit."}
                    </p>
                    <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-text-gray-600">
                        Manage this unit&apos;s lead fields, pipeline, branch and
                        payment routes, source lists
                        {unit?.compatibilityMode === "legacy_school"
                            ? ", academic setup"
                            : ""}{" "}
                        and tracker workflow from the tabs above.
                    </p>
                </div>
            </div>

            <div className="tw-card tw-mt-4">
                <div className="tw-card-body">
                    <p className="tw-mb-1 tw-text-base tw-font-semibold tw-text-gray-800">
                        Duplicate lead rule
                    </p>
                    <p className="tw-mb-3 tw-text-sm tw-text-gray-500">
                        A new lead is treated as a duplicate when every field
                        below already matches an existing lead in this business
                        unit. Applies to the Add lead form, public enquiry
                        forms, bulk uploads and Meta Lead Ads.
                    </p>

                    <div className="row tw-gap-y-3">
                        {fieldGroups.map(group => (
                            <div
                                key={group.name}
                                className="col-12 col-md-6 col-xl-3"
                            >
                                <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                                    {group.name}
                                </p>

                                {group.fields.map(field => (
                                    <InputCheckbox
                                        key={field.key}
                                        name={`duplicate-${field.key}`}
                                        labelName={field.label}
                                        value={selectedFields.includes(
                                            field.key,
                                        )}
                                        onChange={() =>
                                            toggleFieldHandler(field.key)
                                        }
                                        formgroupClassName="tw-mb-1"
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-3">
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                            {selectedFields.length ? (
                                <>
                                    Two leads are the same when{" "}
                                    <strong className="tw-text-gray-800">
                                        {selectedFields
                                            .map(labelFor)
                                            .join(" + ")}
                                    </strong>{" "}
                                    all match.
                                </>
                            ) : (
                                "Choose at least one field."
                            )}
                        </p>

                        <Button
                            type="button"
                            variant="primary"
                            disabled={!selectedFields.length || !isDirty}
                            onClick={() =>
                                onSaveDuplicateRule(selectedFields)
                            }
                        >
                            Save duplicate rule
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Overview;

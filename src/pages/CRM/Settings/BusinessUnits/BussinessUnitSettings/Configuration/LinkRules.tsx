import { useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    InputCheckbox,
    MultiSelectCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../../Components/Common";
import { settingsBranches } from "../../../helper";
import type { BusinessUnitConfig } from "../../../businessunitconfig";
import {
    valuesOfSection,
    type ConfigLinkRule,
    type ConfigSection,
} from "./helper";

interface LinkRulesProps {
    sections: Array<ConfigSection>;
    pipelines: BusinessUnitConfig["leadPipelines"];
    rules: Array<ConfigLinkRule>;
    onChange: (rules: Array<ConfigLinkRule>) => void;
}

interface Option {
    id: string;
    name: string;
}

const emptyRule = {
    displayName: "",
    description: "",
    pipelineId: "",
    resultSectionId: "",
    includesBranch: true,
    keySectionIds: [] as Array<string>,
    isActive: true,
};

const renderSelectedValues = (
    selectedItems: Array<Option>,
    removeItemHandler: (event: MouseEvent<HTMLElement>) => void,
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

const renderOption = (item: Option) => <span>{item.name}</span>;

const LinkRules = ({
    sections,
    pipelines,
    rules,
    onChange,
}: LinkRulesProps) => {
    const [form, setForm] = useState(emptyRule);
    const [editingId, setEditingId] = useState<string>("");
    const [searchString, setSearchString] = useState<string>("");
    const [openRuleId, setOpenRuleId] = useState<string>("");

    const [rowBranchIds, setRowBranchIds] = useState<Array<string>>([]);
    const [rowKeyValueIds, setRowKeyValueIds] = useState<
        Record<string, Array<string>>
    >({});
    const [rowResultValueIds, setRowResultValueIds] = useState<Array<string>>(
        [],
    );
    const [rowSearchString, setRowSearchString] = useState<string>("");

    const answerableSections = useMemo(
        () => sections.filter(section => section.values.length > 0),
        [sections],
    );

    const openRule = rules.find(rule => rule.id === openRuleId);

    const sectionNameOf = (sectionId: string) =>
        sections.find(section => section.id === sectionId)?.displayName || "";

    const valueNameOf = (valueId: string) => {
        for (const section of sections) {
            const value = section.values.find(item => item.id === valueId);

            if (value) {
                return value.displayName;
            }
        }

        return valueId;
    };

    const branchNameOf = (branchId: string) =>
        settingsBranches.find(branch => branch.id === branchId)?.name || "";

    const keyNamesOf = (rule: {
        includesBranch: boolean;
        keySectionIds: Array<string>;
    }) =>
        [
            rule.includesBranch ? "branch" : "",
            ...rule.keySectionIds.map(sectionNameOf),
        ].filter(Boolean);

    const resetForm = () => {
        setEditingId("");
        setForm(emptyRule);
    };

    const changeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setForm(current => ({ ...current, [name]: value }));
    };

    const saveHandler = () => {
        if (!form.displayName.trim()) {
            toast.error("Give the link a name");
            return;
        }

        if (!form.resultSectionId) {
            toast.error("Choose the configuration this link offers");
            return;
        }

        if (!form.includesBranch && !form.keySectionIds.length) {
            toast.error(
                "Choose a branch or at least one configuration to key this link on",
            );
            return;
        }

        if (editingId) {
            const existing = rules.find(rule => rule.id === editingId);
            const isKeyChanged =
                existing &&
                (existing.includesBranch !== form.includesBranch ||
                    existing.keySectionIds.join(",") !==
                    form.keySectionIds.join(",") ||
                    existing.resultSectionId !== form.resultSectionId);
            const clearedCount =
                isKeyChanged && existing ? existing.rows.length : 0;

            onChange(
                rules.map(rule =>
                    rule.id === editingId
                        ? {
                            ...rule,
                            displayName: form.displayName.trim(),
                            description: form.description.trim(),
                            pipelineId: form.pipelineId,
                            resultSectionId: form.resultSectionId,
                            includesBranch: form.includesBranch,
                            keySectionIds: form.keySectionIds,
                            isActive: form.isActive,
                            rows: isKeyChanged ? [] : rule.rows,
                        }
                        : rule,
                ),
            );

            toast.success(
                clearedCount
                    ? `Link saved. ${clearedCount} saved combination${clearedCount === 1 ? "" : "s"} were cleared because the question changed.`
                    : "Configuration link saved",
            );
        } else {
            onChange([
                ...rules,
                {
                    id: `link-${Date.now()}`,
                    displayName: form.displayName.trim(),
                    description: form.description.trim(),
                    pipelineId: form.pipelineId,
                    resultSectionId: form.resultSectionId,
                    includesBranch: form.includesBranch,
                    keySectionIds: form.keySectionIds,
                    isActive: form.isActive,
                    rows: [],
                },
            ]);
            toast.success("Configuration link saved");
        }

        resetForm();
    };

    const editHandler = (rule: ConfigLinkRule) => {
        setEditingId(rule.id);
        setForm({
            displayName: rule.displayName,
            description: rule.description,
            pipelineId: rule.pipelineId,
            resultSectionId: rule.resultSectionId,
            includesBranch: rule.includesBranch,
            keySectionIds: rule.keySectionIds,
            isActive: rule.isActive,
        });
    };

    const removeHandler = (rule: ConfigLinkRule) => {
        onChange(rules.filter(item => item.id !== rule.id));

        if (editingId === rule.id) {
            resetForm();
        }

        toast.success("Configuration link deleted");
    };

    const addCombinationsHandler = () => {
        if (!openRule) {
            return;
        }

        if (openRule.includesBranch && !rowBranchIds.length) {
            toast.error("Choose at least one branch");
            return;
        }

        if (!rowResultValueIds.length) {
            toast.error(
                `Choose the ${sectionNameOf(openRule.resultSectionId)} to offer`,
            );
            return;
        }

        const branchList = openRule.includesBranch ? rowBranchIds : [""];
        const keyCombinations = openRule.keySectionIds.reduce<
            Array<Array<string>>
        >(
            (combinations, sectionId) => {
                const chosen = rowKeyValueIds[sectionId] || [];

                if (!chosen.length) {
                    return combinations;
                }

                return combinations.flatMap(combination =>
                    chosen.map(valueId => [...combination, valueId]),
                );
            },
            [[]],
        );

        const nextRows = branchList.flatMap(branchId =>
            keyCombinations.map((keyValueIds, index) => ({
                id: `row-${Date.now()}-${branchId}-${index}`,
                branchId,
                keyValueIds,
                resultValueIds: rowResultValueIds,
            })),
        );

        onChange(
            rules.map(rule =>
                rule.id === openRule.id
                    ? {
                        ...rule,
                        rows: [
                            ...rule.rows.filter(
                                existing =>
                                    !nextRows.some(
                                        next =>
                                            next.branchId ===
                                            existing.branchId &&
                                            next.keyValueIds.join(",") ===
                                            existing.keyValueIds.join(","),
                                    ),
                            ),
                            ...nextRows,
                        ],
                    }
                    : rule,
            ),
        );

        setRowBranchIds([]);
        setRowKeyValueIds({});
        setRowResultValueIds([]);
        toast.success(
            `${nextRows.length} combination${nextRows.length === 1 ? "" : "s"} saved`,
        );
    };

    const removeCombinationHandler = (rowId: string) => {
        if (!openRule) {
            return;
        }

        onChange(
            rules.map(rule =>
                rule.id === openRule.id
                    ? {
                        ...rule,
                        rows: rule.rows.filter(row => row.id !== rowId),
                    }
                    : rule,
            ),
        );
        toast.success("Combination deleted");
    };

    const visibleRules = rules.filter(rule =>
        `${rule.displayName} ${sectionNameOf(rule.resultSectionId)}`
            .toLowerCase()
            .includes(searchString.trim().toLowerCase()),
    );

    if (openRule) {
        const visibleRows = openRule.rows.filter(row =>
            `${branchNameOf(row.branchId)} ${row.keyValueIds
                .map(valueNameOf)
                .join(" ")} ${row.resultValueIds.map(valueNameOf).join(" ")}`
                .toLowerCase()
                .includes(rowSearchString.trim().toLowerCase()),
        );

        return (
            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2">
                        <div className="tw-min-w-0">
                            <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                {openRule.displayName}
                            </p>
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                Offers {sectionNameOf(openRule.resultSectionId)}{" "}
                                by {keyNamesOf(openRule).join(" and ")}. Every
                                combination of what you pick is saved.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={() => setOpenRuleId("")}
                        >
                            <i className="ri-arrow-left-line tw-me-1"></i>
                            All links
                        </Button>
                    </div>

                    <div className="row tw-items-end tw-gap-y-3">
                        {openRule.includesBranch && (
                            <div className="col-12 col-md-6 col-xl-3">
                                <MultiSelectCheckbox
                                    name="rowBranchIds"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Branch"
                                    value={settingsBranches
                                        .map(branch => ({
                                            id: branch.id,
                                            name: branch.name,
                                        }))
                                        .filter(item =>
                                            rowBranchIds.includes(item.id),
                                        )}
                                    options={settingsBranches.map(branch => ({
                                        id: branch.id,
                                        name: branch.name,
                                    }))}
                                    renderValue={renderSelectedValues}
                                    renderOptions={renderOption}
                                    onChange={(selected: Array<Option>) =>
                                        setRowBranchIds(
                                            selected.map(item => item.id),
                                        )
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>
                        )}

                        {openRule.keySectionIds.map(sectionId => (
                            <div
                                key={sectionId}
                                className="col-12 col-md-6 col-xl-3"
                            >
                                <MultiSelectCheckbox
                                    name={`key-${sectionId}`}
                                    idKey="id"
                                    searchKey="name"
                                    labelText={sectionNameOf(sectionId)}
                                    value={valuesOfSection(
                                        sections,
                                        sectionId,
                                    ).filter(item =>
                                        (
                                            rowKeyValueIds[sectionId] || []
                                        ).includes(item.id),
                                    )}
                                    options={valuesOfSection(
                                        sections,
                                        sectionId,
                                    )}
                                    renderValue={renderSelectedValues}
                                    renderOptions={renderOption}
                                    onChange={(selected: Array<Option>) =>
                                        setRowKeyValueIds(current => ({
                                            ...current,
                                            [sectionId]: selected.map(
                                                item => item.id,
                                            ),
                                        }))
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>
                        ))}

                        <div className="col-12 col-md-6 col-xl-3">
                            <MultiSelectCheckbox
                                name="rowResultValueIds"
                                idKey="id"
                                searchKey="name"
                                labelText={`${sectionNameOf(openRule.resultSectionId)} to offer`}
                                value={valuesOfSection(
                                    sections,
                                    openRule.resultSectionId,
                                ).filter(item =>
                                    rowResultValueIds.includes(item.id),
                                )}
                                options={valuesOfSection(
                                    sections,
                                    openRule.resultSectionId,
                                )}
                                renderValue={renderSelectedValues}
                                renderOptions={renderOption}
                                onChange={(selected: Array<Option>) =>
                                    setRowResultValueIds(
                                        selected.map(item => item.id),
                                    )
                                }
                                containerClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={addCombinationsHandler}
                            >
                                <i className="ri-add-line tw-me-1"></i>
                                Add combinations
                            </Button>
                        </div>
                    </div>

                    <p className="tw-mb-3 tw-mt-2 tw-text-xs tw-text-gray-500">
                        Picking several on each line saves every combination of
                        them at once. Saving a combination that already exists
                        replaces what it offers.
                    </p>

                    <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                            {visibleRows.length} combination
                            {visibleRows.length === 1 ? "" : "s"}
                        </p>

                        <div className="tw-w-full md:tw-w-64">
                            <TextInput
                                name="rowSearchString"
                                placeHolder="Search combinations…"
                                value={rowSearchString}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ) => setRowSearchString(event.target.value)}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                    </div>

                    {!visibleRows.length ? (
                        <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                            {openRule.rows.length
                                ? "No combinations match your search."
                                : "No combinations yet."}
                        </p>
                    ) : (
                        <div className="tw-flex tw-flex-col tw-gap-2">
                            {visibleRows.map(row => (
                                <div
                                    key={row.id}
                                    className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-p-3"
                                >
                                    <div className="tw-min-w-0 tw-flex-1">
                                        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                            {[
                                                branchNameOf(row.branchId),
                                                ...row.keyValueIds.map(
                                                    valueNameOf,
                                                ),
                                            ]
                                                .filter(Boolean)
                                                .join(" · ")}
                                        </p>
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            offers{" "}
                                            {row.resultValueIds
                                                .map(valueNameOf)
                                                .join(", ") || "nothing"}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="wrong"
                                        onClick={() =>
                                            removeCombinationHandler(row.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const previewKeyNames = keyNamesOf(form);
    const previewAnswerName = sectionNameOf(form.resultSectionId);

    return (
        <div className="row tw-gap-y-3">
            <div className="col-12 col-xl-4">
                <div className="tw-card tw-h-full">
                    <div className="tw-card-body">
                        <p className="tw-mb-3 tw-text-base tw-font-semibold tw-text-gray-800">
                            {editingId ? "Edit link" : "Add link"}
                        </p>

                        <TextInput
                            name="displayName"
                            labelText="Name"
                            labelClass="required"
                            placeHolder="e.g. Courses by branch and intake"
                            maxLength={100}
                            value={form.displayName}
                            onChange={changeHandler}
                        />

                        {pipelines.length > 1 && (
                            <SelectInput
                                name="pipelineId"
                                labelText="Lead Pipeline"
                                defaultSelect="Every lead pipeline"
                                value={form.pipelineId}
                                onChange={changeHandler}
                                menuItems={pipelines.map(pipeline => ({
                                    id: pipeline.id,
                                    name: pipeline.displayName,
                                }))}
                                valueKey="id"
                                textKey="name"
                            />
                        )}

                        <InputCheckbox
                            name="includesBranch"
                            labelName="The answer depends on the branch"
                            value={form.includesBranch}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) =>
                                setForm(current => ({
                                    ...current,
                                    includesBranch: event.target.checked,
                                }))
                            }
                        />

                        <MultiSelectCheckbox
                            name="keySectionIds"
                            idKey="id"
                            searchKey="name"
                            labelText="Also Depends On"
                            value={sections
                                .filter(
                                    section =>
                                        section.id !== form.resultSectionId,
                                )
                                .map(section => ({
                                    id: section.id,
                                    name: section.displayName,
                                }))
                                .filter(item =>
                                    form.keySectionIds.includes(item.id),
                                )}
                            options={sections
                                .filter(
                                    section =>
                                        section.id !== form.resultSectionId,
                                )
                                .map(section => ({
                                    id: section.id,
                                    name: section.displayName,
                                }))}
                            renderValue={renderSelectedValues}
                            renderOptions={renderOption}
                            onChange={(selected: Array<Option>) =>
                                setForm(current => ({
                                    ...current,
                                    keySectionIds: selected.map(
                                        item => item.id,
                                    ),
                                }))
                            }
                        />

                        <SelectInput
                            name="resultSectionId"
                            labelText="Offers"
                            labelClass="required"
                            defaultSelect="Select a configuration"
                            value={form.resultSectionId}
                            onChange={changeHandler}
                            menuItems={answerableSections.map(section => ({
                                id: section.id,
                                name: section.displayName,
                            }))}
                            valueKey="id"
                            textKey="name"
                            isDisabled={!answerableSections.length}
                        />

                        {!answerableSections.length && (
                            <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                No configuration has any values yet. Add values
                                under Manage sections first — a link can only
                                offer values that exist.
                            </p>
                        )}

                        {previewAnswerName && previewKeyNames.length > 0 && (
                            <p className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-2 tw-text-sm tw-text-gray-700">
                                Offers{" "}
                                <strong className="tw-text-gray-800">
                                    {previewAnswerName}
                                </strong>{" "}
                                based on{" "}
                                <strong className="tw-text-gray-800">
                                    {previewKeyNames.join(" and ")}
                                </strong>
                                .
                            </p>
                        )}

                        <div className="tw-flex tw-flex-wrap tw-gap-2">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={saveHandler}
                            >
                                {editingId ? "Save changes" : "Add link"}
                            </Button>

                            {editingId && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-xl-8">
                <div className="tw-card tw-h-full">
                    <div className="tw-card-body">
                        <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                            <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                {visibleRules.length} link
                                {visibleRules.length === 1 ? "" : "s"}
                            </p>

                            <div className="tw-w-full md:tw-w-64">
                                <TextInput
                                    name="searchString"
                                    placeHolder="Search links…"
                                    value={searchString}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) => setSearchString(event.target.value)}
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>
                        </div>

                        {!visibleRules.length ? (
                            <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                                {rules.length
                                    ? "No results match your search."
                                    : "No links yet."}
                            </p>
                        ) : (
                            <div className="tw-flex tw-flex-col tw-gap-2">
                                {visibleRules.map(rule => (
                                    <div
                                        key={rule.id}
                                        className={`tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-p-3 ${editingId === rule.id
                                            ? "tw-border-[#405189] tw-bg-[#f4f7fa]"
                                            : "tw-border-gray-200"
                                            }`}
                                    >
                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {rule.displayName}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                Offers{" "}
                                                {sectionNameOf(
                                                    rule.resultSectionId,
                                                )}{" "}
                                                by{" "}
                                                {keyNamesOf(rule).join(" and ")}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                {rule.rows.length} combination
                                                {rule.rows.length === 1
                                                    ? ""
                                                    : "s"}{" "}
                                                ·{" "}
                                                {rule.pipelineId
                                                    ? pipelines.find(
                                                        pipeline =>
                                                            pipeline.id ===
                                                            rule.pipelineId,
                                                    )?.displayName ||
                                                    "one pipeline"
                                                    : "every pipeline"}
                                            </p>
                                        </div>

                                        <div className="tw-flex tw-flex-wrap tw-gap-1">
                                            <Button
                                                type="button"
                                                variant="hoverInfo"
                                                onClick={() =>
                                                    setOpenRuleId(rule.id)
                                                }
                                            >
                                                Combinations
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="hoverInfo"
                                                onClick={() =>
                                                    editHandler(rule)
                                                }
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                type="button"
                                                variant="wrong"
                                                onClick={() =>
                                                    removeHandler(rule)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkRules;

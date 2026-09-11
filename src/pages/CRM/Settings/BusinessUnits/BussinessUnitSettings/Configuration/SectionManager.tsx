import { useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../../Components/Common";
import type { BusinessUnitConfig } from "../../../businessunitconfig";
import {
    buildSectionTree,
    descendantIdsOf,
    sectionCountText,
    sectionPathOf,
    type ConfigSection,
} from "./helper";

interface SectionManagerProps {
    sections: Array<ConfigSection>;
    pipelines: BusinessUnitConfig["leadPipelines"];
    onChange: (sections: Array<ConfigSection>) => void;
    onOpenValues: (sectionId: string) => void;
}

const emptySection = {
    displayName: "",
    description: "",
    placeholder: "",
    sectionType: "list",
    childLabel: "",
    childPlaceholder: "",
    parentSectionId: "",
    pipelineId: "",
    isActive: true,
};

const SectionManager = ({
    sections,
    pipelines,
    onChange,
    onOpenValues,
}: SectionManagerProps) => {
    const [form, setForm] = useState(emptySection);
    const [editingId, setEditingId] = useState<string>("");
    const [collapsedIds, setCollapsedIds] = useState<Array<string>>([]);
    const [isChild, setIsChild] = useState<boolean>(false);

    const blockedParentIds = useMemo(
        () =>
            editingId
                ? [editingId, ...descendantIdsOf(sections, editingId)]
                : [],
        [sections, editingId],
    );

    const parentOptions = useMemo(
        () =>
            sections
                .filter(section => !blockedParentIds.includes(section.id))
                .map(section => ({
                    id: section.id,
                    name: sectionPathOf(sections, section),
                })),
        [sections, blockedParentIds],
    );

    const treeRows = useMemo(
        () => buildSectionTree(sections, collapsedIds),
        [sections, collapsedIds],
    );

    const editingType = sections.find(
        section => section.id === editingId,
    )?.sectionType;

    const isHierarchy = form.sectionType === "hierarchy";

    const resetForm = () => {
        setEditingId("");
        setForm(emptySection);
        setIsChild(false);
    };

    const changeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setForm(current => ({ ...current, [name]: value }));
    };

    const sectionTypeChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const nextIsChild = event.target.value === "child";

        setIsChild(nextIsChild);
        setForm(current => ({
            ...current,
            parentSectionId: nextIsChild
                ? parentOptions[0]?.id || ""
                : "",
        }));
    };

    const saveHandler = () => {
        if (!form.displayName.trim()) {
            toast.error("Section name is required");
            return;
        }

        if (isChild && !form.parentSectionId) {
            toast.error("Choose the parent section");
            return;
        }

        if (isHierarchy && !form.childLabel.trim()) {
            toast.error('Name the sub-level, for example "Specialisation"');
            return;
        }

        if (editingId) {
            onChange(
                sections.map(section =>
                    section.id === editingId
                        ? {
                            ...section,
                            displayName: form.displayName.trim(),
                            description: form.description.trim(),
                            placeholder: form.placeholder.trim(),
                            sectionType: form.sectionType,
                            childLabel: form.childLabel.trim(),
                            childPlaceholder: form.childPlaceholder.trim(),
                            parentSectionId: form.parentSectionId,
                            pipelineId: form.pipelineId,
                            isActive: form.isActive,
                        }
                        : section,
                ),
            );
            toast.success("Section updated");
        } else {
            onChange([
                ...sections,
                {
                    id: `section-${Date.now()}`,
                    displayName: form.displayName.trim(),
                    description: form.description.trim(),
                    placeholder: form.placeholder.trim(),
                    sectionType: "list",
                    childLabel: "",
                    childPlaceholder: "",
                    parentSectionId: form.parentSectionId,
                    pipelineId: form.pipelineId,
                    isActive: form.isActive,
                    values: [],
                },
            ]);
            toast.success("Section added");
        }

        resetForm();
    };

    const editHandler = (section: ConfigSection) => {
        setEditingId(section.id);
        setIsChild(Boolean(section.parentSectionId));
        setForm({
            displayName: section.displayName,
            description: section.description,
            placeholder: section.placeholder,
            sectionType: section.sectionType,
            childLabel: section.childLabel,
            childPlaceholder: section.childPlaceholder,
            parentSectionId: section.parentSectionId,
            pipelineId: section.pipelineId,
            isActive: section.isActive,
        });
    };

    const removeHandler = (section: ConfigSection) => {
        const descendants = descendantIdsOf(sections, section.id);

        onChange(
            sections.filter(
                item =>
                    item.id !== section.id && !descendants.has(item.id),
            ),
        );

        if (editingId === section.id) {
            resetForm();
        }

        toast.success(`${section.displayName} deleted`);
    };

    const moveHandler = (
        section: ConfigSection,
        direction: "up" | "down",
    ) => {
        const siblings = sections.filter(
            item =>
                (item.parentSectionId || "") ===
                (section.parentSectionId || ""),
        );
        const index = siblings.findIndex(item => item.id === section.id);
        const target = direction === "up" ? index - 1 : index + 1;

        if (target < 0 || target >= siblings.length) {
            return;
        }

        const order = sections.map(item => item.id);
        const left = order.indexOf(siblings[index].id);
        const right = order.indexOf(siblings[target].id);

        [order[left], order[right]] = [order[right], order[left]];

        onChange(
            order.map(
                id => sections.find(item => item.id === id) as ConfigSection,
            ),
        );
    };

    const toggleCollapsedHandler = (sectionId: string) =>
        setCollapsedIds(current =>
            current.includes(sectionId)
                ? current.filter(id => id !== sectionId)
                : [...current, sectionId],
        );

    const siblingIndexOf = (section: ConfigSection) => {
        const siblings = sections.filter(
            item =>
                (item.parentSectionId || "") ===
                (section.parentSectionId || ""),
        );

        return {
            index: siblings.findIndex(item => item.id === section.id),
            total: siblings.length,
        };
    };

    return (
        <div className="row tw-gap-y-3">
            <div className="col-12 col-xl-4">
                <div className="tw-card tw-h-full">
                    <div className="tw-card-body">
                        <p className="tw-mb-3 tw-text-base tw-font-semibold tw-text-gray-800">
                            {editingId ? "Edit section" : "Add section"}
                        </p>

                        <TextInput
                            name="displayName"
                            labelText="Section Name"
                            labelClass="required"
                            placeHolder="e.g. Courses"
                            maxLength={80}
                            value={form.displayName}
                            onChange={changeHandler}
                        />

                        <TextInput
                            name="description"
                            labelText="Description"
                            placeHolder="What this section holds"
                            maxLength={160}
                            value={form.description}
                            onChange={changeHandler}
                        />

                        <TextInput
                            name="placeholder"
                            labelText="Picker Placeholder"
                            placeHolder="e.g. Select a course"
                            maxLength={80}
                            value={form.placeholder}
                            onChange={changeHandler}
                        />

                        <SelectInput
                            name="placement"
                            labelText="Section Type"
                            labelClass="required"
                            value={isChild ? "child" : "independent"}
                            onChange={sectionTypeChangeHandler}
                            menuItems={[
                                {
                                    id: "independent",
                                    name: "Independent section",
                                },
                                {
                                    id: "child",
                                    name: parentOptions.length
                                        ? "Link parent to this section"
                                        : "Link parent to this section (none available yet)",
                                },
                            ]}
                            valueKey="id"
                            textKey="name"
                            hideSelectOption
                        />

                        {isChild && (
                            <SelectInput
                                name="parentSectionId"
                                labelText="Select Parent Section"
                                labelClass="required"
                                defaultSelect="Select a section"
                                value={form.parentSectionId}
                                onChange={changeHandler}
                                menuItems={parentOptions}
                                valueKey="id"
                                textKey="name"
                                isDisabled={!parentOptions.length}
                            />
                        )}

                        {editingId && blockedParentIds.length > 1 && (
                            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                Sections under this one are not listed: moving a
                                section beneath its own child would close a loop.
                            </p>
                        )}

                        {editingId && editingType === "hierarchy" && (
                            <SelectInput
                                name="sectionType"
                                labelText="Values Inside This Section"
                                value={form.sectionType}
                                onChange={changeHandler}
                                menuItems={[
                                    {
                                        id: "hierarchy",
                                        name: "Two levels (existing setup)",
                                    },
                                    {
                                        id: "list",
                                        name: "Simple list of values",
                                    },
                                ]}
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                            />
                        )}

                        {editingId &&
                            editingType === "hierarchy" &&
                            !isHierarchy && (
                                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                    Only possible while no sub-values exist.
                                    Delete them first, or this will be refused.
                                </p>
                            )}

                        {isHierarchy && (
                            <>
                                <TextInput
                                    name="childLabel"
                                    labelText="Sub-level Name"
                                    labelClass="required"
                                    placeHolder="Specialisation"
                                    maxLength={80}
                                    value={form.childLabel}
                                    onChange={changeHandler}
                                />

                                <TextInput
                                    name="childPlaceholder"
                                    labelText="Sub-level Placeholder"
                                    placeHolder="Select a specialisation"
                                    maxLength={80}
                                    value={form.childPlaceholder}
                                    onChange={changeHandler}
                                />

                                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                    Each{" "}
                                    {form.displayName.trim() || "parent value"}{" "}
                                    keeps its own{" "}
                                    {form.childLabel.trim() || "sub-values"},
                                    the way a sub-stage belongs to one stage.
                                </p>
                            </>
                        )}

                        {pipelines.length > 1 && (
                            <>
                                <SelectInput
                                    name="pipelineId"
                                    labelText="Used By"
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
                                <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                    A franchise lead and an admissions lead rarely
                                    need the same configuration.
                                </p>
                            </>
                        )}

                        <InputCheckbox
                            name="isActive"
                            labelName="Active"
                            value={form.isActive}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) =>
                                setForm(current => ({
                                    ...current,
                                    isActive: event.target.checked,
                                }))
                            }
                        />

                        <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={saveHandler}
                            >
                                {editingId ? "Save changes" : "Add section"}
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
                        <p className="tw-mb-3 tw-text-base tw-font-semibold tw-text-gray-800">
                            {sections.length} section
                            {sections.length === 1 ? "" : "s"}
                        </p>

                        {!treeRows.length ? (
                            <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                                No sections yet. Add one to get started.
                            </p>
                        ) : (
                            <div className="tw-flex tw-flex-col tw-gap-2">
                                {treeRows.map(
                                    ({ section, depth, hasChildren }) => {
                                        const position =
                                            siblingIndexOf(section);
                                        const isCollapsed =
                                            collapsedIds.includes(section.id);

                                        return (
                                            <div
                                                key={section.id}
                                                className={`tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-p-3 ${editingId === section.id
                                                    ? "tw-border-[#405189] tw-bg-[#f4f7fa]"
                                                    : "tw-border-gray-200"
                                                    }`}
                                                style={{
                                                    marginInlineStart: `${depth * 20}px`,
                                                }}
                                            >
                                                {hasChildren ? (
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title={
                                                            isCollapsed
                                                                ? `Expand ${section.displayName}`
                                                                : `Collapse ${section.displayName}`
                                                        }
                                                        className="!tw-h-7 !tw-w-7 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                                                        onClick={() =>
                                                            toggleCollapsedHandler(
                                                                section.id,
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                isCollapsed
                                                                    ? "ri-arrow-right-s-line"
                                                                    : "ri-arrow-down-s-line"
                                                            }
                                                        ></i>
                                                    </Button>
                                                ) : (
                                                    <span className="tw-h-7 tw-w-7"></span>
                                                )}

                                                <div className="tw-min-w-0 tw-flex-1">
                                                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                        {section.displayName}
                                                    </p>
                                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                        {sectionCountText(
                                                            section,
                                                        )}{" "}
                                                        ·{" "}
                                                        {section.isActive
                                                            ? "Active"
                                                            : "Inactive"}
                                                        {section.parentSectionId
                                                            ? ` · under ${sections.find(
                                                                item =>
                                                                    item.id ===
                                                                    section.parentSectionId,
                                                            )?.displayName ||
                                                            "another section"
                                                            }`
                                                            : ""}
                                                        {section.pipelineId
                                                            ? ` · ${pipelines.find(
                                                                pipeline =>
                                                                    pipeline.id ===
                                                                    section.pipelineId,
                                                            )?.displayName ||
                                                            "one pipeline"
                                                            } only`
                                                            : ""}
                                                    </p>
                                                </div>

                                                <div className="tw-flex tw-flex-wrap tw-gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="hoverInfo"
                                                        onClick={() =>
                                                            onOpenValues(
                                                                section.id,
                                                            )
                                                        }
                                                    >
                                                        Values
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Move up"
                                                        disabled={
                                                            position.index === 0
                                                        }
                                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                                                        onClick={() =>
                                                            moveHandler(
                                                                section,
                                                                "up",
                                                            )
                                                        }
                                                    >
                                                        <i className="ri-arrow-up-line"></i>
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Move down"
                                                        disabled={
                                                            position.index ===
                                                            position.total - 1
                                                        }
                                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                                                        onClick={() =>
                                                            moveHandler(
                                                                section,
                                                                "down",
                                                            )
                                                        }
                                                    >
                                                        <i className="ri-arrow-down-line"></i>
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="hoverInfo"
                                                        onClick={() =>
                                                            editHandler(section)
                                                        }
                                                    >
                                                        Edit
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="wrong"
                                                        onClick={() =>
                                                            removeHandler(
                                                                section,
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionManager;

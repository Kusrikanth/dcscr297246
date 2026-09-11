import { useState, type ChangeEvent, type MouseEvent } from "react";
import { toast } from "react-toastify";

import UpdatedHorizontalTab from "../../../../../../Components/Common/UpdatedHorizontalTab";
import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../../Components/Common";
import type { ConfigSection, ConfigSectionValue } from "./helper";

interface SectionValuesProps {
    section: ConfigSection;
    onChange: (values: Array<ConfigSectionValue>) => void;
}

const blankDraft = () => ({
    key: `draft-${Date.now()}-${Math.round(Math.random() * 1000)}`,
    code: "",
    displayName: "",
    position: "0",
    isActive: true,
});

const SectionValues = ({ section, onChange }: SectionValuesProps) => {
    const [level, setLevel] = useState<string>("parent");
    const [drafts, setDrafts] = useState([blankDraft()]);
    const [parentValueId, setParentValueId] = useState<string>("");
    const [editingId, setEditingId] = useState<string>("");
    const [searchString, setSearchString] = useState<string>("");

    const isHierarchy = section.sectionType === "hierarchy";
    const childLabel = section.childLabel || "Sub-value";
    const onChild = isHierarchy && level === "child";
    const levelName = onChild ? childLabel : section.displayName;

    const children = section.values.flatMap(value =>
        value.children.map(child => ({ ...child, parent: value })),
    );

    const visibleRows = (onChild ? children : section.values).filter(row =>
        `${row.displayName} ${row.code}`
            .toLowerCase()
            .includes(searchString.trim().toLowerCase()),
    );

    const parentMissing = onChild && !section.values.length;

    const resetForm = () => {
        setEditingId("");
        setDrafts([blankDraft()]);
        setParentValueId("");
    };

    const levelChangeHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setLevel(menuId);
            setSearchString("");
            resetForm();
        }
    };

    const patchDraft = (
        key: string,
        change: Partial<ReturnType<typeof blankDraft>>,
    ) =>
        setDrafts(current =>
            current.map(row => (row.key === key ? { ...row, ...change } : row)),
        );

    const dropDraft = (key: string) =>
        setDrafts(current =>
            current.length === 1
                ? [blankDraft()]
                : current.filter(row => row.key !== key),
        );

    const saveHandler = () => {
        const filled = drafts.filter(row => row.displayName.trim());

        if (!filled.length) {
            toast.error("Enter at least one name");
            return;
        }

        if (onChild && !editingId && !parentValueId) {
            toast.error(
                `Select the parent ${section.displayName.toLowerCase()}`,
            );
            return;
        }

        if (editingId) {
            const row = filled[0];

            onChange(
                section.values.map(value =>
                    value.id === editingId
                        ? {
                            ...value,
                            displayName: row.displayName.trim(),
                            position: Number(row.position) || 0,
                            isActive: row.isActive,
                        }
                        : {
                            ...value,
                            children: value.children.map(child =>
                                child.id === editingId
                                    ? {
                                        ...child,
                                        displayName:
                                            row.displayName.trim(),
                                        position:
                                            Number(row.position) || 0,
                                        isActive: row.isActive,
                                    }
                                    : child,
                            ),
                        },
                ),
            );
            toast.success("Saved");
            resetForm();
            return;
        }

        const created = filled.map((row, index) => ({
            id: `value-${Date.now()}-${index}`,
            code: row.code.trim(),
            displayName: row.displayName.trim(),
            position: Number(row.position) || 0,
            isActive: row.isActive,
        }));

        if (onChild) {
            onChange(
                section.values.map(value =>
                    value.id === parentValueId
                        ? { ...value, children: [...value.children, ...created] }
                        : value,
                ),
            );
        } else {
            onChange([
                ...section.values,
                ...created.map(value => ({ ...value, children: [] })),
            ]);
        }

        toast.success(
            `${created.length} ${levelName.toLowerCase()} added`,
        );
        resetForm();
    };

    const editHandler = (row: {
        id: string;
        code: string;
        displayName: string;
        position: number;
        isActive: boolean;
        parent?: ConfigSectionValue;
    }) => {
        setEditingId(row.id);
        setDrafts([
            {
                key: blankDraft().key,
                code: row.code,
                displayName: row.displayName,
                position: String(row.position || 0),
                isActive: row.isActive,
            },
        ]);

        if (row.parent) {
            setParentValueId(row.parent.id);
        }
    };

    const removeHandler = (row: { id: string; displayName: string }) => {
        onChange(
            section.values
                .filter(value => value.id !== row.id)
                .map(value => ({
                    ...value,
                    children: value.children.filter(
                        child => child.id !== row.id,
                    ),
                })),
        );

        if (editingId === row.id) {
            resetForm();
        }

        if (parentValueId === row.id) {
            setParentValueId("");
        }

        toast.success(`${row.displayName} deleted`);
    };

    const addChildHandler = (value: ConfigSectionValue) => {
        setLevel("child");
        setEditingId("");
        setDrafts([blankDraft()]);
        setParentValueId(value.id);
    };

    return (
        <>
            <div className="tw-card tw-mb-3">
                <div className="tw-card-body">
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        {section.displayName}
                    </p>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        {section.description ||
                            (isHierarchy
                                ? `Each ${section.displayName.toLowerCase()} keeps its own ${childLabel.toLowerCase()}.`
                                : `Values available under ${section.displayName}.`)}
                    </p>
                </div>
            </div>

            {isHierarchy && (
                <div className="tw-mb-3">
                    <UpdatedHorizontalTab
                        MenuOptions={[
                            {
                                id: "parent",
                                labelName: section.displayName,
                                customPadding: "0px 10px 0px 10px",
                                count: section.values.length,
                            },
                            {
                                id: "child",
                                labelName: childLabel,
                                customPadding: "0px 10px 0px 10px",
                                count: children.length,
                            },
                        ]}
                        clickMenuHandler={levelChangeHandler}
                        activeTabId={level}
                        showBadge
                        horizontalClass=""
                    />
                </div>
            )}

            <div className="tw-card tw-mb-3">
                <div className="tw-card-body">
                    <p className="tw-mb-3 tw-text-base tw-font-semibold tw-text-gray-800">
                        {editingId
                            ? `Edit ${levelName.toLowerCase()}`
                            : `Add ${levelName.toLowerCase()}`}
                    </p>

                    {onChild && (
                        <div className="row">
                            <div className="col-12 col-md-6 col-xl-4">
                                <SelectInput
                                    name="parentValueId"
                                    labelText={`Parent ${section.displayName}`}
                                    labelClass="required"
                                    defaultSelect={
                                        section.placeholder ||
                                        `Select ${section.displayName.toLowerCase()}`
                                    }
                                    value={parentValueId}
                                    onChange={(
                                        event: ChangeEvent<HTMLSelectElement>,
                                    ) => setParentValueId(event.target.value)}
                                    menuItems={section.values.map(value => ({
                                        id: value.id,
                                        name: value.displayName,
                                    }))}
                                    valueKey="id"
                                    textKey="name"
                                    isDisabled={Boolean(editingId)}
                                />

                                {!editingId && (
                                    <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                        Chosen once — every row below is added
                                        under it.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {parentMissing && (
                        <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                            Add a {section.displayName.toLowerCase()} first — a{" "}
                            {childLabel.toLowerCase()} has to belong to one.
                        </p>
                    )}

                    {drafts.map((row, index) => (
                        <div key={row.key} className="row tw-items-center">
                            <div className="col-12 col-md-4">
                                <TextInput
                                    name={`displayName-${row.key}`}
                                    labelText={`${levelName} Name`}
                                    labelClass="required"
                                    placeHolder={
                                        onChild
                                            ? section.childPlaceholder ||
                                            `Add a ${childLabel.toLowerCase()}`
                                            : section.placeholder ||
                                            `Add a ${section.displayName.toLowerCase()}`
                                    }
                                    maxLength={80}
                                    value={row.displayName}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        patchDraft(row.key, {
                                            displayName: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-12 col-md-3">
                                <TextInput
                                    name={`code-${row.key}`}
                                    labelText="Code"
                                    placeHolder="From the name"
                                    maxLength={40}
                                    isDisabled={Boolean(editingId)}
                                    value={row.code}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        patchDraft(row.key, {
                                            code: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-6 col-md-2">
                                <TextInput
                                    name={`position-${row.key}`}
                                    inputType="number"
                                    labelText="Order"
                                    value={row.position}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        patchDraft(row.key, {
                                            position: event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="tw-flex tw-items-center tw-gap-2">
                                    <InputCheckbox
                                        name={`isActive-${row.key}`}
                                        labelName="Active"
                                        value={row.isActive}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            patchDraft(row.key, {
                                                isActive: event.target.checked,
                                            })
                                        }
                                        formgroupClassName="tw-mb-0"
                                    />

                                    {!editingId && (
                                        <>
                                            {index === drafts.length - 1 && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    title="Add another row"
                                                    disabled={parentMissing}
                                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                                                    onClick={() =>
                                                        setDrafts(current => [
                                                            ...current,
                                                            blankDraft(),
                                                        ])
                                                    }
                                                >
                                                    <i className="ri-add-line"></i>
                                                </Button>
                                            )}

                                            <Button
                                                type="button"
                                                variant="secondary"
                                                title="Remove this row"
                                                className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                                                onClick={() =>
                                                    dropDraft(row.key)
                                                }
                                            >
                                                <i className="ri-delete-bin-line tw-text-danger"></i>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="tw-mt-2 tw-flex tw-flex-wrap tw-gap-2">
                        <Button
                            type="button"
                            variant="primary"
                            disabled={parentMissing}
                            onClick={saveHandler}
                        >
                            {editingId
                                ? "Save changes"
                                : `Add ${levelName.toLowerCase()}`}
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

            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                            {visibleRows.length} record
                            {visibleRows.length === 1 ? "" : "s"}
                        </p>

                        <div className="tw-w-full md:tw-w-64">
                            <TextInput
                                name="searchString"
                                placeHolder={`Search ${levelName.toLowerCase()}…`}
                                value={searchString}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ) => setSearchString(event.target.value)}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                    </div>

                    {!visibleRows.length ? (
                        <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                            {searchString.trim()
                                ? "No results match your search."
                                : `No ${levelName.toLowerCase()} yet.`}
                        </p>
                    ) : (
                        <div className="tw-flex tw-flex-col tw-gap-2">
                            {visibleRows.map(row => (
                                <div
                                    key={row.id}
                                    className={`tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-p-3 ${editingId === row.id
                                        ? "tw-border-[#405189] tw-bg-[#f4f7fa]"
                                        : "tw-border-gray-200"
                                        }`}
                                >
                                    <div className="tw-min-w-0 tw-flex-1">
                                        <p className="tw-mb-0 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-text-sm tw-font-medium tw-text-gray-800">
                                            {row.displayName}

                                            {"parent" in row && (
                                                <span className="badge badge-soft-secondary">
                                                    {row.parent.displayName}
                                                </span>
                                            )}
                                        </p>
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            {row.code || "No code"} · Order{" "}
                                            {row.position || 0} ·{" "}
                                            {row.isActive
                                                ? "Active"
                                                : "Inactive"}
                                            {!onChild && isHierarchy
                                                ? ` · ${(row as ConfigSectionValue).children.length} ${childLabel.toLowerCase()}`
                                                : ""}
                                        </p>
                                    </div>

                                    <div className="tw-flex tw-flex-wrap tw-gap-1">
                                        {!onChild && isHierarchy && (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                title={`Add ${childLabel.toLowerCase()} under ${row.displayName}`}
                                                className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                                                onClick={() =>
                                                    addChildHandler(
                                                        row as ConfigSectionValue,
                                                    )
                                                }
                                            >
                                                <i className="ri-corner-down-right-line"></i>
                                            </Button>
                                        )}

                                        <Button
                                            type="button"
                                            variant="hoverInfo"
                                            onClick={() => editHandler(row)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="wrong"
                                            onClick={() => removeHandler(row)}
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
        </>
    );
};

export default SectionValues;

import { useState, type ChangeEvent, type MouseEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    MultiSelectCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../Components/Common";
import type { BusinessUnitConfig } from "../../businessunitconfig";

interface AdmissionClassConfigProps {
    config: BusinessUnitConfig;
    onChange: (rows: BusinessUnitConfig["admissionClassConfigs"]) => void;
}

interface Option {
    id: string;
    name: string;
}

const emptyForm = {
    academicYear: "",
    branchIds: [] as Array<string>,
    curriculumIds: [] as Array<string>,
    admissionTypeIds: [] as Array<string>,
    classIds: [] as Array<string>,
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

const AdmissionClassConfig = ({ config, onChange }: AdmissionClassConfigProps) => {
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState<string>("");
    const [searchString, setSearchString] = useState<string>("");

    const isEditing = Boolean(editingId);

    const branchOptions = config.branches.map(branch => ({
        id: branch.id,
        name: branch.name,
    }));

    const curriculumOptions = config.curriculums
        .filter(item => item.isActive)
        .map(item => ({ id: item.id, name: item.displayName }));

    const admissionTypeOptions = config.admissionTypes
        .filter(item => item.isActive)
        .map(item => ({ id: item.id, name: item.displayName }));

    const classOptions = config.admissionClasses.map(item => ({
        id: item.id,
        name: item.displayName,
    }));

    const nameOf = (options: Array<Option>, id: string) =>
        options.find(option => option.id === id)?.name || "";

    const visibleRows = config.admissionClassConfigs.filter(row =>
        `${row.academicYear} ${nameOf(branchOptions, row.branchId)} ${nameOf(curriculumOptions, row.curriculumId)} ${nameOf(admissionTypeOptions, row.admissionTypeId)}`
            .toLowerCase()
            .includes(searchString.trim().toLowerCase()),
    );

    const resetForm = () => {
        setEditingId("");
        setForm(emptyForm);
    };

    const saveHandler = () => {
        if (
            !form.academicYear ||
            !form.branchIds.length ||
            !form.curriculumIds.length ||
            !form.admissionTypeIds.length
        ) {
            toast.error(
                "Academic year, branch, curriculum and admission type are required",
            );
            return;
        }

        if (!form.classIds.length) {
            toast.error("Select at least one class");
            return;
        }

        if (editingId) {
            onChange(
                config.admissionClassConfigs.map(row =>
                    row.id === editingId
                        ? { ...row, classIds: form.classIds }
                        : row,
                ),
            );
            toast.success("Configuration updated");
            resetForm();
            return;
        }

        const created = form.branchIds.flatMap(branchId =>
            form.curriculumIds.flatMap(curriculumId =>
                form.admissionTypeIds.map(admissionTypeId => ({
                    id: `acc-${branchId}-${curriculumId}-${admissionTypeId}-${form.academicYear}`,
                    academicYear: form.academicYear,
                    branchId,
                    curriculumId,
                    admissionTypeId,
                    classIds: form.classIds,
                })),
            ),
        );

        const kept = config.admissionClassConfigs.filter(
            row => !created.some(entry => entry.id === row.id),
        );

        onChange([...kept, ...created]);
        toast.success(
            `${created.length} configuration${created.length === 1 ? "" : "s"} saved`,
        );
        resetForm();
    };

    const editHandler = (
        row: BusinessUnitConfig["admissionClassConfigs"][number],
    ) => {
        setEditingId(row.id);
        setForm({
            academicYear: row.academicYear,
            branchIds: [row.branchId],
            curriculumIds: [row.curriculumId],
            admissionTypeIds: [row.admissionTypeId],
            classIds: row.classIds,
        });
    };

    const removeHandler = (
        row: BusinessUnitConfig["admissionClassConfigs"][number],
    ) => {
        onChange(
            config.admissionClassConfigs.filter(item => item.id !== row.id),
        );

        if (editingId === row.id) {
            resetForm();
        }

        toast.success("Configuration deleted");
    };

    return (
        <div className="tw-card">
            <div className="tw-card-body">
                <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                    Admission class configuration
                </p>
                <p className="tw-mb-3 tw-text-sm tw-text-gray-500">
                    Create class availability for one or several branches,
                    curricula and admission types at once.
                </p>

                <div className="row tw-items-end tw-gap-y-3">
                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="academicYear"
                            labelText="Academic Year"
                            labelClass="required"
                            defaultSelect="Select academic year"
                            value={form.academicYear}
                            onChange={(
                                event: ChangeEvent<HTMLSelectElement>,
                            ) =>
                                setForm(current => ({
                                    ...current,
                                    academicYear: event.target.value,
                                }))
                            }
                            menuItems={config.academicYears.map(year => ({
                                id: year.academicYear,
                                name: year.displayName || year.academicYear,
                            }))}
                            valueKey="id"
                            textKey="name"
                            isDisabled={isEditing}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <MultiSelectCheckbox
                            name="branchIds"
                            idKey="id"
                            searchKey="name"
                            labelText="Branch"
                            value={branchOptions.filter(option =>
                                form.branchIds.includes(option.id),
                            )}
                            options={branchOptions}
                            renderValue={renderSelectedValues}
                            renderOptions={renderOption}
                            onChange={(selected: Array<Option>) =>
                                setForm(current => ({
                                    ...current,
                                    branchIds: selected.map(item => item.id),
                                }))
                            }
                            isDisabled={isEditing}
                            containerClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <MultiSelectCheckbox
                            name="curriculumIds"
                            idKey="id"
                            searchKey="name"
                            labelText="Curriculum"
                            value={curriculumOptions.filter(option =>
                                form.curriculumIds.includes(option.id),
                            )}
                            options={curriculumOptions}
                            renderValue={renderSelectedValues}
                            renderOptions={renderOption}
                            onChange={(selected: Array<Option>) =>
                                setForm(current => ({
                                    ...current,
                                    curriculumIds: selected.map(
                                        item => item.id,
                                    ),
                                }))
                            }
                            isDisabled={isEditing}
                            containerClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <MultiSelectCheckbox
                            name="admissionTypeIds"
                            idKey="id"
                            searchKey="name"
                            labelText="Admission Type"
                            value={admissionTypeOptions.filter(option =>
                                form.admissionTypeIds.includes(option.id),
                            )}
                            options={admissionTypeOptions}
                            renderValue={renderSelectedValues}
                            renderOptions={renderOption}
                            onChange={(selected: Array<Option>) =>
                                setForm(current => ({
                                    ...current,
                                    admissionTypeIds: selected.map(
                                        item => item.id,
                                    ),
                                }))
                            }
                            isDisabled={isEditing}
                            containerClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <MultiSelectCheckbox
                            name="classIds"
                            idKey="id"
                            searchKey="name"
                            labelText="Classes"
                            value={classOptions.filter(option =>
                                form.classIds.includes(option.id),
                            )}
                            options={classOptions}
                            renderValue={renderSelectedValues}
                            renderOptions={renderOption}
                            onChange={(selected: Array<Option>) =>
                                setForm(current => ({
                                    ...current,
                                    classIds: selected.map(item => item.id),
                                }))
                            }
                            containerClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="tw-flex tw-flex-wrap tw-gap-2">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={saveHandler}
                            >
                                {isEditing
                                    ? "Save Changes"
                                    : "Add Configuration"}
                            </Button>

                            {isEditing && (
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

                {isEditing && (
                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                        Several branches, curricula and admission types can be
                        picked while creating. Editing updates only this
                        combination.
                    </p>
                )}

                {!isEditing && (
                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                        Every combination of what you pick is saved. A
                        combination that already exists is replaced.
                    </p>
                )}

                <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-3">
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                        {visibleRows.length} configuration
                        {visibleRows.length === 1 ? "" : "s"}
                    </p>

                    <div className="tw-w-full md:tw-w-64">
                        <TextInput
                            name="searchString"
                            placeHolder="Search configurations…"
                            value={searchString}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) => setSearchString(event.target.value)}
                            formgroupClassName="tw-mb-0"
                        />
                    </div>
                </div>

                <div className="tw-mt-3 tw-flex tw-flex-col tw-gap-2">
                    {visibleRows.map(row => (
                        <div
                            key={row.id}
                            className={`tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-p-3 ${editingId === row.id
                                ? "tw-border-[#405189] tw-bg-[#f4f7fa]"
                                : "tw-border-gray-200"
                                }`}
                        >
                            <div className="tw-min-w-0 tw-flex-1">
                                <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                    {row.academicYear} ·{" "}
                                    {nameOf(branchOptions, row.branchId)}
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {nameOf(curriculumOptions, row.curriculumId)}{" "}
                                    ·{" "}
                                    {nameOf(
                                        admissionTypeOptions,
                                        row.admissionTypeId,
                                    )}{" "}
                                    · {row.classIds.length} class
                                    {row.classIds.length === 1 ? "" : "es"}
                                </p>
                            </div>

                            <div className="tw-flex tw-flex-wrap tw-gap-1">
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

                    {!visibleRows.length && (
                        <div className="tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-py-6 tw-text-center">
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                {config.admissionClassConfigs.length
                                    ? "No configurations match your search."
                                    : "No configurations yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdmissionClassConfig;

import { useMemo, useState, type ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    InputCheckboxUpdated,
    SelectInput,
    TextInput,
} from "../../../../../Components/Common";
import {
    fieldUsageOptions,
    filterControlOptions,
    leadFieldCatalogue,
    leadFieldTypes,
    type LeadField,
} from "../../businessunitconfig";
import type { ConfigSection } from "./Configuration/helper";

interface AddEditLeadFieldModalProps {
    data?: LeadField;
    catalogue: typeof leadFieldCatalogue;
    sections: Array<ConfigSection>;
    toggle: () => void;
    onSave: (field: LeadField, isNew: boolean) => void;
}

const toFieldKey = (displayName: string) =>
    displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 40) || "custom_field";

const selectTypes = ["single_select", "multi_select"];

const validationSchema = Yup.object().shape({
    displayName: Yup.string().trim().required("Field name is required"),

    fieldType: Yup.string().required("Field type is required"),

    filterControl: Yup.string().when("isFilterable", {
        is: true,
        then: schema => schema.required("Filter control is required"),
        otherwise: schema => schema,
    }),

    importHeader: Yup.string().when("isImportable", {
        is: true,
        then: schema =>
            schema.trim().required("Import column heading is required"),
        otherwise: schema => schema,
    }),

    options: Yup.string().when(["fieldType", "optionsSectionId"], {
        is: (fieldType: string, optionsSectionId: string) =>
            selectTypes.includes(fieldType) && !optionsSectionId,
        then: schema => schema.trim().required("Add at least one option"),
        otherwise: schema => schema,
    }),

    columnWidth: Yup.number()
        .typeError("Column width must be a number")
        .min(60, "Column width must be at least 60")
        .max(600, "Column width must be at most 600"),
});

const AddEditLeadFieldModal = ({
    data,
    catalogue,
    sections,
    toggle,
    onSave,
}: AddEditLeadFieldModalProps) => {
    const isEdit = Boolean(data);

    const [isStandard, setIsStandard] = useState<boolean>(
        !isEdit && catalogue.length > 0,
    );
    const [standardKey, setStandardKey] = useState<string>("");

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            displayName: data?.displayName || "",
            fieldType: data?.fieldType || "text",
            placeholder: data?.placeholder || "",
            options: (data?.options || []).join(", "),
            isRequired: data?.isRequired || false,
            useInLeadForm: data ? data.useInLeadForm : true,
            useInQuickCreate: data?.useInQuickCreate || false,
            useInLeadDetails: data ? data.useInLeadDetails : true,
            showInList: data ? data.showInList : true,
            isFilterable: data ? data.isFilterable : true,
            isSearchable: data?.isSearchable || false,
            useInReports: data ? data.useInReports : true,
            useInAutomations: data?.useInAutomations || false,
            isImportable: data ? data.isImportable : true,
            isImportRequired: data?.isImportRequired || false,
            filterControl: data?.filterControl || "contains",
            importHeader: data?.importHeader || "",
            importSampleValue: data?.importSampleValue || "",
            columnWidth: String(data?.columnWidth || 180),
            optionsSectionId: data?.optionsSectionId || "",
            optionsSectionLevel: data?.optionsSectionLevel || "parent",
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `field-${Date.now()}`,
                    fieldKey:
                        data?.fieldKey ||
                        standardKey ||
                        toFieldKey(values.displayName),
                    displayName: values.displayName.trim(),
                    fieldType: values.fieldType,
                    placeholder: values.placeholder,
                    options:
                        selectTypes.includes(values.fieldType) &&
                            !values.optionsSectionId
                            ? values.options
                                .split(",")
                                .map(option => option.trim())
                                .filter(Boolean)
                            : [],
                    optionsSectionId: selectTypes.includes(values.fieldType)
                        ? values.optionsSectionId
                        : "",
                    optionsSectionLevel: values.optionsSectionLevel,
                    isSystem: data?.isSystem || false,
                    isRequired: values.useInLeadForm ? values.isRequired : false,
                    showInList: values.showInList,
                    isFilterable: values.isFilterable,
                    filterControl: values.filterControl,
                    isSearchable: values.isSearchable,
                    isImportable: values.isImportable,
                    isImportRequired: values.isImportable
                        ? values.isImportRequired
                        : false,
                    importHeader: values.isImportable
                        ? values.importHeader.trim()
                        : "",
                    importSampleValue: values.importSampleValue.trim(),
                    useInLeadForm: values.useInLeadForm,
                    useInQuickCreate: values.useInQuickCreate,
                    useInLeadDetails: values.useInLeadDetails,
                    useInReports: values.useInReports,
                    useInAutomations: values.useInAutomations,
                    columnWidth: Number(values.columnWidth),
                },
                !isEdit,
            );

            toggle();
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const controlOptions = useMemo(
        () => filterControlOptions(formik.values.fieldType),
        [formik.values.fieldType],
    );

    const activeSections = sections.filter(section => section.isActive);

    const sectionOptions = activeSections.flatMap(section =>
        section.sectionType === "hierarchy"
            ? [
                {
                    id: `${section.id}:parent`,
                    name: section.displayName,
                },
                {
                    id: `${section.id}:child`,
                    name: `${section.displayName} → ${section.childLabel || "sub-values"}`,
                },
            ]
            : [{ id: `${section.id}:parent`, name: section.displayName }],
    );

    const chosenStandard = catalogue.find(entry => entry.key === standardKey);

    const currentSectionValues = () => {
        const section = activeSections.find(
            item => item.id === formik.values.optionsSectionId,
        );

        if (!section) {
            return "";
        }

        const values =
            formik.values.optionsSectionLevel === "child"
                ? section.values.flatMap(value => value.children)
                : section.values;

        return values
            .filter(value => value.isActive)
            .map(value => value.displayName)
            .join(", ");
    };

    const standardChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const key = event.target.value;

        setStandardKey(key);

        const entry = catalogue.find(item => item.key === key);

        if (!entry) {
            return;
        }

        formik.setValues({
            ...formik.initialValues,
            displayName: entry.label,
            fieldType: entry.fieldType,
            importHeader: entry.label,
            columnWidth: String(entry.columnWidth),
            isSearchable: entry.isSearchable,
            filterControl: filterControlOptions(entry.fieldType)[0].id,
        });
    };

    const usageChangeHandler = (
        key: (typeof fieldUsageOptions)[number]["key"],
        isOn: boolean,
    ) => {
        formik.setValues({
            ...formik.values,
            [key]: isOn,
            ...(key === "isImportable" && !isOn ? { isImportRequired: false } : null),
            ...(key === "useInLeadForm" && !isOn ? { isRequired: false } : null),
        });
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                {!isEdit && catalogue.length > 0 && (
                    <div className="tw-mb-3 tw-flex tw-flex-wrap tw-gap-2">
                        <Button
                            type="button"
                            variant={isStandard ? "primary" : "secondary"}
                            onClick={() => {
                                setIsStandard(true);
                                setStandardKey("");
                                formik.resetForm();
                            }}
                        >
                            Standard field
                        </Button>

                        <Button
                            type="button"
                            variant={isStandard ? "secondary" : "primary"}
                            onClick={() => {
                                setIsStandard(false);
                                setStandardKey("");
                                formik.resetForm();
                            }}
                        >
                            New custom field
                        </Button>
                    </div>
                )}

                {isStandard && (
                    <SelectInput
                        name="standardKey"
                        labelText="Standard Field"
                        labelClass="required"
                        defaultSelect="Select a field"
                        value={standardKey}
                        onChange={standardChangeHandler}
                        menuItems={catalogue.map(entry => ({
                            id: entry.key,
                            name: `${entry.group} · ${entry.label}`,
                        }))}
                        valueKey="id"
                        textKey="name"
                    />
                )}

                {isStandard && (
                    <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                        {chosenStandard
                            ? `${chosenStandard.fieldType.replace(/_/g, " ")} · values from ${chosenStandard.sourceLabel.toLowerCase()}`
                            : "Fields the CRM already understands, with their values wired up."}
                    </p>
                )}

                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="displayName"
                            isDisabled={isStandard && !standardKey}
                            labelText="Field Name"
                            labelClass="required"
                            placeHolder="Shown on the lead form"
                            maxLength={120}
                            value={formik.values.displayName}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                const { value } = event.target;

                                formik.setValues({
                                    ...formik.values,
                                    displayName: value,
                                    importHeader:
                                        !formik.values.importHeader ||
                                            formik.values.importHeader ===
                                            formik.values.displayName
                                            ? value
                                            : formik.values.importHeader,
                                });
                            }}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("displayName") ? true : false}
                            error={errorFor("displayName")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <SelectInput
                            name="fieldType"
                            labelText="Field Type"
                            labelClass="required"
                            hideSelectOption
                            isDisabled={data?.isSystem || isStandard}
                            value={formik.values.fieldType}
                            onChange={(
                                event: React.ChangeEvent<HTMLSelectElement>,
                            ) => {
                                const fieldType = event.target.value;

                                formik.setValues({
                                    ...formik.values,
                                    fieldType,
                                    filterControl:
                                        filterControlOptions(fieldType)[0].id,
                                });
                            }}
                            onBlur={formik.handleBlur}
                            menuItems={leadFieldTypes}
                            valueKey="id"
                            textKey="name"
                            invalid={errorFor("fieldType") ? true : false}
                            error={errorFor("fieldType")}
                        />
                    </div>

                    {Boolean(sectionOptions.length) &&
                        !selectTypes.includes(formik.values.fieldType) && (
                            <div className="col-12">
                                <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                    Choose <b>single select</b> or{" "}
                                    <b>multi select</b> to take the options from{" "}
                                    {activeSections
                                        .map(section => section.displayName)
                                        .join(", ")}
                                    .
                                </p>
                            </div>
                        )}

                    {selectTypes.includes(formik.values.fieldType) &&
                        !data?.isSystem && (
                            <div className="col-12">
                                <SelectInput
                                    name="optionsSectionId"
                                    labelText="Options From"
                                    defaultSelect="A list typed here"
                                    value={
                                        formik.values.optionsSectionId
                                            ? `${formik.values.optionsSectionId}:${formik.values.optionsSectionLevel}`
                                            : ""
                                    }
                                    onChange={(
                                        event: ChangeEvent<HTMLSelectElement>,
                                    ) => {
                                        const [sectionId, level] =
                                            event.target.value.split(":");

                                        formik.setValues({
                                            ...formik.values,
                                            optionsSectionId: sectionId || "",
                                            optionsSectionLevel:
                                                level || "parent",
                                        });
                                    }}
                                    menuItems={sectionOptions}
                                    valueKey="id"
                                    textKey="name"
                                    isDisabled={!sectionOptions.length}
                                />

                                <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                    {formik.values.optionsSectionId
                                        ? "Options are read from that section, so adding a value there updates this field everywhere."
                                        : sectionOptions.length
                                            ? "Or point this field at a section configured for this business unit."
                                            : "No configuration sections are defined for this business unit yet."}
                                </p>
                            </div>
                        )}

                    {selectTypes.includes(formik.values.fieldType) &&
                        !formik.values.optionsSectionId && (
                            <div className="col-12">
                                <TextInput
                                    name="options"
                                    labelText="Options"
                                    labelClass="required"
                                    placeHolder="Option 1, Option 2, Option 3"
                                    helperText="Separate each option with a comma."
                                    value={formik.values.options}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("options") ? true : false}
                                    error={errorFor("options")}
                                />
                            </div>
                        )}

                    {selectTypes.includes(formik.values.fieldType) &&
                        Boolean(formik.values.optionsSectionId) && (
                            <div className="col-12">
                                <TextInput
                                    name="currentValues"
                                    labelText="Current Values"
                                    isReadOnly
                                    placeHolder="This section has no values yet"
                                    value={currentSectionValues()}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        )}

                    <div className="col-12 col-md-8">
                        <TextInput
                            name="placeholder"
                            labelText="Placeholder"
                            placeHolder="Hint shown inside the empty field"
                            maxLength={120}
                            value={formik.values.placeholder}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <TextInput
                            name="columnWidth"
                            inputType="number"
                            labelText="List Column Width"
                            value={formik.values.columnWidth}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("columnWidth") ? true : false}
                            error={errorFor("columnWidth")}
                        />
                    </div>
                </div>

                {isStandard && !standardKey && (
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        Choose a field above to set where it appears and how it
                        behaves.
                    </p>
                )}

                {(!isStandard || Boolean(standardKey)) &&
                    formik.values.useInLeadForm && (
                    <SelectInput
                        name="isRequired"
                        labelText="Lead Form Requirement"
                        labelClass="required"
                        hideSelectOption
                        value={formik.values.isRequired ? "mandatory" : "optional"}
                        onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>,
                        ) =>
                            formik.setFieldValue(
                                "isRequired",
                                event.target.value === "mandatory",
                            )
                        }
                        menuItems={[
                            { id: "optional", name: "Optional on lead form" },
                            { id: "mandatory", name: "Mandatory on lead form" },
                        ]}
                        valueKey="id"
                        textKey="name"
                    />
                )}

                {(!isStandard || Boolean(standardKey)) && (
                <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        Where this field can be used
                    </p>
                    <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                        Select every area this field should be available in.
                    </p>

                    <div className="tw-grid tw-gap-2 md:tw-grid-cols-2">
                        {fieldUsageOptions.map(option => (
                            <div
                                key={option.key}
                                className="tw-rounded tw-border tw-border-gray-200 tw-p-2"
                            >
                                <InputCheckboxUpdated
                                    name={option.key}
                                    formgroupClassName="tw-mb-0"
                                    value={Boolean(
                                        formik.values[
                                        option.key as keyof typeof formik.values
                                        ],
                                    )}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        usageChangeHandler(
                                            option.key,
                                            event.target.checked,
                                        )
                                    }
                                    labelName={
                                        <span className="tw-min-w-0">
                                            <span className="tw-block tw-text-sm tw-text-gray-800">
                                                {option.label}
                                            </span>
                                            <span className="tw-block tw-text-xs tw-text-gray-500">
                                                {option.description}
                                            </span>
                                        </span>
                                    }
                                />
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {(!isStandard || Boolean(standardKey)) &&
                    formik.values.isFilterable && (
                    <SelectInput
                        name="filterControl"
                        labelText="Filter Control"
                        labelClass="required"
                        hideSelectOption
                        value={formik.values.filterControl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        menuItems={controlOptions}
                        valueKey="id"
                        textKey="name"
                        invalid={errorFor("filterControl") ? true : false}
                        error={errorFor("filterControl")}
                    />
                )}

                {(!isStandard || Boolean(standardKey)) &&
                    formik.values.isImportable && (
                    <>
                        <div className="row">
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="importHeader"
                                    labelText="Import Column Heading"
                                    labelClass="required"
                                    placeHolder="CSV / Google Sheet heading"
                                    value={formik.values.importHeader}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={errorFor("importHeader") ? true : false}
                                    error={errorFor("importHeader")}
                                />
                            </div>

                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="importSampleValue"
                                    labelText="Example Value"
                                    placeHolder="Shown in the downloaded template"
                                    value={formik.values.importSampleValue}
                                    onChange={formik.handleChange}
                                />
                            </div>
                        </div>

                        <InputCheckbox
                            name="isImportRequired"
                            labelName="Required during import"
                            value={formik.values.isImportRequired}
                            onChange={formik.handleChange}
                        />
                    </>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isStandard && !standardKey}
                >
                    {isEdit ? "Save Changes" : "Add Field"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditLeadFieldModal;

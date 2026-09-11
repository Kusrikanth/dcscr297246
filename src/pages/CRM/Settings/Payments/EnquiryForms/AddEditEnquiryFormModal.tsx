import { useMemo, type ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../../Components/Common";
import { activeStatusOptions, employeeMaster } from "../../helper";
import { configForUnit, sourcesForChannel } from "../../businessunitconfig";
import {
    defaultEnquiryFields,
    emptyEnquiryForm,
    toEnquiryFormKey,
    type EnquiryForm,
    type EnquiryFormField,
} from "./helper";

interface AddEditEnquiryFormModalProps {
    data?: EnquiryForm;
    businessUnitId: string;
    toggle: () => void;
    onSave: (form: EnquiryForm, isNew: boolean) => void;
}

const validationSchema = (needsAcademicYear: boolean) =>
    Yup.object().shape({
        displayName: Yup.string().trim().required("Form name is required"),

        defaultBranchId: Yup.string().required("Default branch is required"),

        defaultAcademicYear: needsAcademicYear
            ? Yup.string().required("Academic year is required")
            : Yup.string(),

        defaultStageId: Yup.string().required("Default stage is required"),

        redirectUrl: Yup.string()
            .trim()
            .url("Enter a valid URL, e.g. https://example.com/thank-you"),

        paymentAmount: Yup.number()
            .typeError("Amount must be a number")
            .when("paymentRequired", {
                is: true,
                then: schema =>
                    schema.moreThan(0, "Amount must be greater than zero"),
                otherwise: schema => schema,
            }),

        fields: Yup.array().min(1, "Add at least one field to the form"),
    });

const AddEditEnquiryFormModal = ({
    data,
    businessUnitId,
    toggle,
    onSave,
}: AddEditEnquiryFormModalProps) => {
    const isEdit = Boolean(data?.id);
    const config = useMemo(
        () => configForUnit(businessUnitId),
        [businessUnitId],
    );

    const needsAcademicYear = config.academicYears.length > 0;

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            displayName: data?.displayName || "",
            description: data?.description || "",
            defaultBranchId: data?.defaultBranchId || "",
            defaultAcademicYear: data?.defaultAcademicYear || "",
            defaultStageId: data?.defaultStageId || "",
            defaultSubstageId: data?.defaultSubstageId || "",
            defaultChannelId: data?.defaultChannelId || "",
            defaultSourceId: data?.defaultSourceId || "",
            defaultCampaignId: data?.defaultCampaignId || "",
            defaultOwnerEmployeeId: data?.defaultOwnerEmployeeId || "",
            paymentRequired: data?.paymentRequired || false,
            paymentAmount: data?.paymentAmount || "",
            paymentComponentType: data?.paymentComponentType || "",
            successMessage:
                data?.successMessage || emptyEnquiryForm.successMessage,
            redirectUrl: data?.redirectUrl || "",
            status: data ? (data.isActive ? "active" : "inactive") : "active",
            fields:
                data?.fields ||
                (defaultEnquiryFields(config.fields) as Array<EnquiryFormField>),
        },

        validationSchema: validationSchema(needsAcademicYear),

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `enquiry-${Date.now()}`,
                    formKey: data?.formKey || toEnquiryFormKey(values.displayName),
                    displayName: values.displayName.trim(),
                    description: values.description.trim(),
                    businessUnitId,
                    defaultBranchId: values.defaultBranchId,
                    defaultAcademicYear: values.defaultAcademicYear,
                    defaultStageId: values.defaultStageId,
                    defaultSubstageId: values.defaultSubstageId,
                    defaultChannelId: values.defaultChannelId,
                    defaultSourceId: values.defaultSourceId,
                    defaultCampaignId: values.defaultCampaignId,
                    defaultOwnerEmployeeId: values.defaultOwnerEmployeeId,
                    paymentRequired: values.paymentRequired,
                    paymentComponentType: values.paymentRequired
                        ? values.paymentComponentType.trim()
                        : "",
                    paymentAmount: values.paymentRequired
                        ? String(values.paymentAmount)
                        : "",
                    successMessage: values.successMessage.trim(),
                    redirectUrl: values.redirectUrl.trim(),
                    isActive: values.status === "active",
                    fields: values.fields.map((field, index) => ({
                        ...field,
                        position: index + 1,
                    })),
                },
                !isEdit,
            );

            toggle();
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && typeof formik.errors[field] === "string"
            ? (formik.errors[field] as string)
            : "";

    const availableFields = useMemo(() => {
        const chosen = new Set(formik.values.fields.map(field => field.fieldKey));

        return config.fields.filter(
            field => !chosen.has(field.fieldKey) && field.useInLeadForm,
        );
    }, [config.fields, formik.values.fields]);

    const substages = useMemo(
        () =>
            config.leadSubstages.filter(
                substage =>
                    !formik.values.defaultStageId ||
                    substage.stageId === formik.values.defaultStageId,
            ),
        [config.leadSubstages, formik.values.defaultStageId],
    );

    const addFieldHandler = (fieldKey: string) => {
        const field = config.fields.find(item => item.fieldKey === fieldKey);

        if (!field) {
            return;
        }

        formik.setFieldValue("fields", [
            ...formik.values.fields,
            {
                fieldKey: field.fieldKey,
                label: field.displayName,
                placeholder: field.placeholder,
                isRequired: field.isRequired,
                position: formik.values.fields.length + 1,
            },
        ]);
    };

    const patchFieldHandler = (
        index: number,
        changes: Partial<EnquiryFormField>,
    ) => {
        formik.setFieldValue(
            "fields",
            formik.values.fields.map((field, fieldIndex) =>
                fieldIndex === index ? { ...field, ...changes } : field,
            ),
        );
    };

    const moveFieldHandler = (index: number, offset: number) => {
        const target = index + offset;

        if (target < 0 || target >= formik.values.fields.length) {
            return;
        }

        const next = [...formik.values.fields];

        [next[index], next[target]] = [next[target], next[index]];

        formik.setFieldValue(
            "fields",
            next.map((field, fieldIndex) => ({
                ...field,
                position: fieldIndex + 1,
            })),
        );
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <div className="row">
                    <div className="col-12 col-md-8">
                        <TextInput
                            name="displayName"
                            labelText="Form Name"
                            labelClass="required"
                            placeHolder="e.g. Main website enquiry"
                            maxLength={120}
                            value={formik.values.displayName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("displayName") ? true : false}
                            error={errorFor("displayName")}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <SelectInput
                            name="status"
                            labelText="Status"
                            hideSelectOption
                            value={formik.values.status}
                            onChange={formik.handleChange}
                            menuItems={activeStatusOptions}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12">
                        <TextArea
                            name="description"
                            labelText="Description"
                            placeHolder="Shown below the form title"
                            height="70px"
                            maxLength={300}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Defaults applied to leads from this form
                </p>

                <div className="row">
                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="defaultBranchId"
                            labelText="Default Branch"
                            labelClass="required"
                            defaultSelect="Select branch"
                            value={formik.values.defaultBranchId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={config.branches}
                            valueKey="id"
                            textKey="name"
                            invalid={errorFor("defaultBranchId") ? true : false}
                            error={errorFor("defaultBranchId")}
                        />
                    </div>

                    {needsAcademicYear && (
                        <div className="col-12 col-md-6 col-xl-4">
                            <SelectInput
                                name="defaultAcademicYear"
                                labelText="Academic Year"
                                labelClass="required"
                                defaultSelect="Select academic year"
                                value={formik.values.defaultAcademicYear}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                menuItems={config.academicYears.map(year => ({
                                    id: year.academicYear,
                                    name: year.displayName,
                                }))}
                                valueKey="id"
                                textKey="name"
                                invalid={
                                    errorFor("defaultAcademicYear") ? true : false
                                }
                                error={errorFor("defaultAcademicYear")}
                            />
                        </div>
                    )}

                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="defaultStageId"
                            labelText="Default Stage"
                            labelClass="required"
                            defaultSelect="Select stage"
                            value={formik.values.defaultStageId}
                            onChange={(
                                event: React.ChangeEvent<HTMLSelectElement>,
                            ) => {
                                formik.setValues({
                                    ...formik.values,
                                    defaultStageId: event.target.value,
                                    defaultSubstageId: "",
                                });
                            }}
                            onBlur={formik.handleBlur}
                            menuItems={config.pipelineStages}
                            valueKey="id"
                            textKey="displayName"
                            invalid={errorFor("defaultStageId") ? true : false}
                            error={errorFor("defaultStageId")}
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="defaultSubstageId"
                            labelText="Default Sub-stage"
                            defaultSelect="No sub-stage"
                            value={formik.values.defaultSubstageId}
                            onChange={formik.handleChange}
                            menuItems={substages}
                            valueKey="id"
                            textKey="displayName"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="defaultChannelId"
                            labelText="Default Channel"
                            defaultSelect="No channel"
                            value={formik.values.defaultChannelId}
                            onChange={(
                                event: React.ChangeEvent<HTMLSelectElement>,
                            ) =>
                                formik.setValues({
                                    ...formik.values,
                                    defaultChannelId: event.target.value,
                                    defaultSourceId: "",
                                })
                            }
                            menuItems={config.channels}
                            valueKey="id"
                            textKey="displayName"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="defaultSourceId"
                            labelText="Default Source"
                            defaultSelect="No source"
                            value={formik.values.defaultSourceId}
                            onChange={formik.handleChange}
                            menuItems={sourcesForChannel(
                                config.sources,
                                formik.values.defaultChannelId,
                            )}
                            valueKey="id"
                            textKey="displayName"
                            formgroupClassName="tw-mb-1"
                        />
                        <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                            {formik.values.defaultChannelId
                                ? "Sources mapped to the selected channel."
                                : "Select a channel to choose a source."}
                        </p>
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="defaultCampaignId"
                            labelText="Default Campaign"
                            defaultSelect="No campaign"
                            value={formik.values.defaultCampaignId}
                            onChange={formik.handleChange}
                            menuItems={config.campaigns}
                            valueKey="id"
                            textKey="displayName"
                        />
                    </div>

                    <div className="col-12 col-md-6 col-xl-4">
                        <SelectInput
                            name="defaultOwnerEmployeeId"
                            labelText="Assign Owner"
                            defaultSelect="Unassigned"
                            value={formik.values.defaultOwnerEmployeeId}
                            onChange={formik.handleChange}
                            menuItems={employeeMaster}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                </div>

                <div className="tw-mb-3 tw-mt-2 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                    <div className="tw-mb-2 tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-2">
                        <div className="tw-min-w-0">
                            <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                Fields shown on the website
                            </p>
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                Visitors see them in this order.
                            </p>
                        </div>

                        <div className="tw-w-full sm:tw-w-[240px]">
                            <SelectInput
                                name="addField"
                                defaultSelect="Add field"
                                value=""
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => addFieldHandler(event.target.value)}
                                menuItems={availableFields.map(field => ({
                                    id: field.fieldKey,
                                    name: field.displayName,
                                }))}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                isDisabled={!availableFields.length}
                            />
                        </div>
                    </div>

                    {formik.values.fields.length === 0 ? (
                        <p className="tw-mb-0 tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                            Select the fields you want visitors to fill on your
                            website.
                        </p>
                    ) : (
                        formik.values.fields.map((field, index) => (
                            <div
                                key={`${field.fieldKey}-${index}`}
                                className="tw-mb-2 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-2"
                            >
                                <TextInput
                                    name={`${field.fieldKey}-${index}-label`}
                                    placeHolder="Label"
                                    value={field.label}
                                    onChange={event =>
                                        patchFieldHandler(index, {
                                            label: event.target.value,
                                        })
                                    }
                                    inputClassName="form-control-sm"
                                    formgroupClassName="tw-mb-0 tw-w-[160px] tw-flex-1"
                                />

                                <TextInput
                                    name={`${field.fieldKey}-${index}-placeholder`}
                                    placeHolder="Placeholder"
                                    value={field.placeholder}
                                    onChange={event =>
                                        patchFieldHandler(index, {
                                            placeholder: event.target.value,
                                        })
                                    }
                                    inputClassName="form-control-sm"
                                    formgroupClassName="tw-mb-0 tw-w-[160px] tw-flex-1"
                                />

                                <InputCheckbox
                                    name={`isRequired-${field.fieldKey}`}
                                    labelName="Required"
                                    labelClassName="tw-whitespace-nowrap tw-text-xs tw-text-gray-700"
                                    formgroupClassName="tw-mb-0"
                                    value={field.isRequired}
                                    onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        patchFieldHandler(index, {
                                            isRequired: event.target.checked,
                                        })
                                    }
                                />

                                <div className="tw-flex tw-gap-1">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        title="Move up"
                                        aria-label={`Move ${field.label} up`}
                                        disabled={index === 0}
                                        onClick={() => moveFieldHandler(index, -1)}
                                    >
                                        <i className="ri-arrow-up-line"></i>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        title="Move down"
                                        aria-label={`Move ${field.label} down`}
                                        disabled={
                                            index === formik.values.fields.length - 1
                                        }
                                        onClick={() => moveFieldHandler(index, 1)}
                                    >
                                        <i className="ri-arrow-down-line"></i>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        title="Remove field"
                                        aria-label={`Remove ${field.label}`}
                                        onClick={() =>
                                            formik.setFieldValue(
                                                "fields",
                                                formik.values.fields.filter(
                                                    (_, fieldIndex) =>
                                                        fieldIndex !== index,
                                                ),
                                            )
                                        }
                                    >
                                        <i className="ri-close-line"></i>
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}

                    {errorFor("fields") && (
                        <p className="tw-mb-0 tw-text-xs tw-text-danger">
                            {errorFor("fields")}
                        </p>
                    )}
                </div>

                <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                    <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                        Application payment
                    </p>

                    <InputCheckbox
                        name="paymentRequired"
                        labelName="Collect an application payment on this form"
                        value={formik.values.paymentRequired}
                        onChange={formik.handleChange}
                    />

                    {formik.values.paymentRequired && (
                        <div className="row tw-mt-2">
                            <div className="col-12 col-md-4">
                                <TextInput
                                    name="paymentAmount"
                                    inputType="number"
                                    labelText="Amount to Collect"
                                    placeHolder="Leave blank to use the branch amount"
                                    value={formik.values.paymentAmount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    invalid={
                                        errorFor("paymentAmount") ? true : false
                                    }
                                    error={errorFor("paymentAmount")}
                                />
                            </div>

                            <div className="col-12 col-md-4">
                                <TextInput
                                    name="paymentComponentType"
                                    labelText="Jodo Component"
                                    placeHolder="Leave blank to use the branch component"
                                    maxLength={120}
                                    helperText="What this form's payments settle against in Jodo, which is how they are told apart there."
                                    value={formik.values.paymentComponentType}
                                    onChange={formik.handleChange}
                                />
                            </div>

                            <div className="col-12">
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    The Jodo API key, secret and collector code come
                                    from the selected branch under Branch Settings.
                                    Without them the form cannot take payment.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="row">
                    <div className="col-12">
                        <TextArea
                            name="successMessage"
                            labelText="Success Message"
                            height="70px"
                            maxLength={300}
                            value={formik.values.successMessage}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="col-12">
                        <TextInput
                            name="redirectUrl"
                            labelText="Redirect URL"
                            placeHolder="Optional: https://yourwebsite.com/thank-you"
                            value={formik.values.redirectUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("redirectUrl") ? true : false}
                            error={errorFor("redirectUrl")}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save Changes" : "Add Enquiry Form"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditEnquiryFormModal;

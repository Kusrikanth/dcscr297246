import type { ChangeEvent } from "react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    DateInput,
    RadioInputContainer,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../../Components/Common";
import { activeStatusOptions, settingsBranches } from "../../helper";
import FormFieldBuilder from "./FormFieldBuilder";
import {
    selectionTypeOptions,
    type PaymentCategory,
    type PaymentForm,
    type PaymentFormField,
} from "./helper";

interface AddEditPaymentFormModalProps {
    data?: PaymentForm;
    toggle: () => void;
    onSave: (form: PaymentForm, isNew: boolean) => void;
}

const toFormKey = (title: string) =>
    title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "payment-form";

const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Form title is required"),

    branchId: Yup.string().required("Branch is required"),

    selectionType: Yup.string().required("Selection type is required"),

    redirectUrl: Yup.string()
        .trim()
        .url("Enter a valid URL, e.g. https://example.com/success"),

    categories: Yup.array()
        .of(
            Yup.object().shape({
                name: Yup.string().trim().required("Category name is required"),
                amount: Yup.number()
                    .typeError("Amount must be a number")
                    .moreThan(0, "Amount must be greater than zero")
                    .required("Amount is required"),
            }),
        )
        .min(1, "Add at least one category"),

    fields: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().trim().required("Field name is required"),
            label: Yup.string().trim().required("Display label is required"),
        }),
    ),
});

const AddEditPaymentFormModal = ({
    data,
    toggle,
    onSave,
}: AddEditPaymentFormModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            title: data?.title || "",
            description: data?.description || "",
            logo: data?.logo || "",
            componentType: data?.componentType || "",
            branchId: data?.branchId || "",
            selectionType: data?.selectionType || "single",
            fields: data?.fields || ([] as Array<PaymentFormField>),
            categories:
                data?.categories && data.categories.length
                    ? data.categories
                    : ([{ name: "", amount: "" }] as Array<PaymentCategory>),
            successMessage: data?.successMessage || "",
            redirectUrl: data?.redirectUrl || "",
            expiresOn: data?.expiresOn || "",
            status: data ? (data.isActive ? "active" : "inactive") : "active",
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `form-${Date.now()}`,
                    formKey: data?.formKey || toFormKey(values.title),
                    title: values.title.trim(),
                    description: values.description.trim(),
                    logo: values.logo,
                    componentType: values.componentType.trim(),
                    branchId: values.branchId,
                    selectionType: values.selectionType as "single" | "multiple",
                    fields: values.fields,
                    categories: values.categories.map(category => ({
                        name: category.name.trim(),
                        amount: String(category.amount),
                    })),
                    successMessage: values.successMessage.trim(),
                    redirectUrl: values.redirectUrl.trim(),
                    expiresOn: values.expiresOn,
                    isActive: values.status === "active",
                    submissionCount: data?.submissionCount || 0,
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

    const categoryErrorFor = (
        index: number,
        key: keyof PaymentCategory,
    ) => {
        const touched = formik.touched.categories?.[index]?.[key];
        const errors = formik.errors.categories?.[index];

        if (!touched || !errors || typeof errors === "string") {
            return "";
        }

        return (errors as Record<string, string>)[key] || "";
    };

    const logoChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (file.size > 1024 * 1024) {
            toast.error("Logo must be 1 MB or smaller");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () =>
            formik.setFieldValue("logo", String(reader.result || ""));
        reader.onerror = () => toast.error("Could not read that image");
        reader.readAsDataURL(file);
    };

    const categoryChangeHandler = (
        index: number,
        key: keyof PaymentCategory,
        value: string,
    ) => {
        formik.setFieldValue(
            "categories",
            formik.values.categories.map((category, categoryIndex) =>
                categoryIndex === index ? { ...category, [key]: value } : category,
            ),
        );
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="title"
                            labelText="Form Title"
                            labelClass="required"
                            placeHolder="e.g. Admission Fee Payment"
                            maxLength={120}
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("title") ? true : false}
                            error={errorFor("title")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <SelectInput
                            name="branchId"
                            labelText="Branch"
                            labelClass="required"
                            defaultSelect="Select branch"
                            value={formik.values.branchId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={settingsBranches}
                            valueKey="id"
                            textKey="name"
                            invalid={errorFor("branchId") ? true : false}
                            error={errorFor("branchId")}
                        />
                    </div>

                    <div className="col-12">
                        <TextArea
                            name="description"
                            labelText="Description"
                            placeHolder="What is this payment for?"
                            height="70px"
                            maxLength={300}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <p className="tw-mb-1 tw-text-sm">
                            Selection Type <span className="tw-text-danger">*</span>
                        </p>

                        <RadioInputContainer
                            name="selectionType"
                            radioOptions={selectionTypeOptions.map(option => ({
                                id: option.id,
                                name: (
                                    <span className="tw-flex tw-items-center tw-gap-2">
                                        <i
                                            className={`${option.icon} tw-text-gray-500`}
                                        ></i>
                                        {option.name}
                                    </span>
                                ),
                                description: option.description,
                            }))}
                            value={formik.values.selectionType}
                            onChange={(event: ChangeEvent<HTMLInputElement>) =>
                                formik.setFieldValue(
                                    "selectionType",
                                    event.target.value,
                                )
                            }
                            inputContainerClassName="tw-flex-wrap tw-gap-3"
                        />
                    </div>

                    <div className="col-12 col-md-3">
                        <DateInput
                            name="expiresOn"
                            labelText="Expiry Date"
                            value={formik.values.expiresOn}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            formgroupClassName="tw-mb-1"
                        />
                        <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                            {formik.values.expiresOn
                                ? "The link stops accepting payments at the end of this day."
                                : "Leave blank for no expiry."}
                        </p>
                    </div>

                    <div className="col-12 col-md-3">
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

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="componentType"
                            labelText="Jodo Component"
                            placeHolder="e.g. Sports Fee"
                            maxLength={120}
                            helperText="What this form's payments settle against in Jodo, which is how they are told apart there. Must match a component configured on the branch's Jodo collector. Leave blank to use the branch default."
                            value={formik.values.componentType}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <span className="tw-mb-1 tw-block tw-text-sm tw-text-[#495057]">
                            Logo
                        </span>

                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                            {formik.values.logo ? (
                                <img
                                    src={formik.values.logo}
                                    alt="Payment form logo preview"
                                    className="tw-h-10 tw-w-10 tw-rounded tw-border tw-border-gray-200 tw-object-contain"
                                />
                            ) : (
                                <span className="tw-grid tw-h-10 tw-w-10 tw-place-items-center tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-text-gray-400">
                                    <i className="ri-image-line"></i>
                                </span>
                            )}

                            <label className="btn btn-light tw-mb-0 tw-cursor-pointer tw-border tw-border-gray-200">
                                <i className="ri-upload-2-line tw-me-1"></i>
                                {formik.values.logo ? "Replace" : "Choose file"}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/gif,image/webp"
                                    className="tw-hidden"
                                    onChange={logoChangeHandler}
                                />
                            </label>

                            {formik.values.logo && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    title="Remove logo"
                                    aria-label="Remove logo"
                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200"
                                    onClick={() =>
                                        formik.setFieldValue("logo", "")
                                    }
                                >
                                    <i className="ri-close-line"></i>
                                </Button>
                            )}
                        </div>

                        <p className="tw-mb-3 tw-mt-1 tw-text-xs tw-text-gray-500">
                            PNG, JPG, GIF or WebP up to 1 MB. Shown beside the
                            title on the public payment page.
                        </p>
                    </div>
                </div>

                <FormFieldBuilder
                    fields={formik.values.fields}
                    onChange={fields => formik.setFieldValue("fields", fields)}
                />

                <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        Payment categories <span className="tw-text-danger">*</span>
                    </p>
                    <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                        The options a payer can choose from.
                    </p>

                    {formik.values.categories.map((category, index) => (
                        <div key={index} className="row tw-items-start">
                            <div className="col-12 col-md-7">
                                <TextInput
                                    name={`categories[${index}].name`}
                                    placeHolder="Category name (e.g. Admission Fee)"
                                    value={category.name}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        categoryChangeHandler(
                                            index,
                                            "name",
                                            event.target.value,
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    invalid={
                                        categoryErrorFor(index, "name") ? true : false
                                    }
                                    error={categoryErrorFor(index, "name")}
                                />
                            </div>

                            <div className="col-10 col-md-4">
                                <TextInput
                                    name={`categories[${index}].amount`}
                                    inputType="number"
                                    placeHolder="Amount (₹)"
                                    value={category.amount}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        categoryChangeHandler(
                                            index,
                                            "amount",
                                            event.target.value,
                                        )
                                    }
                                    onBlur={formik.handleBlur}
                                    invalid={
                                        categoryErrorFor(index, "amount") ? true : false
                                    }
                                    error={categoryErrorFor(index, "amount")}
                                />
                            </div>

                            <div className="col-2 col-md-1">
                                {formik.values.categories.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        title="Remove category"
                                        aria-label={`Remove category ${index + 1}`}
                                        onClick={() =>
                                            formik.setFieldValue(
                                                "categories",
                                                formik.values.categories.filter(
                                                    (_, categoryIndex) =>
                                                        categoryIndex !== index,
                                                ),
                                            )
                                        }
                                    >
                                        <i className="ri-close-line"></i>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={() =>
                            formik.setFieldValue("categories", [
                                ...formik.values.categories,
                                { name: "", amount: "" },
                            ])
                        }
                    >
                        <i className="ri-add-line tw-me-1"></i>
                        Add Category
                    </Button>

                    {typeof formik.errors.categories === "string" && (
                        <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-danger">
                            {formik.errors.categories}
                        </p>
                    )}
                </div>

                <div className="row">
                    <div className="col-12">
                        <TextArea
                            name="successMessage"
                            labelText="Success Message"
                            placeHolder="Message shown after a successful payment"
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
                            labelText="Redirect URL (after payment)"
                            placeHolder="https://example.com/success"
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
                    {isEdit ? "Save Changes" : "Create Form"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditPaymentFormModal;

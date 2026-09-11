import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../../Components/Common";
import {
    hasSequentialVariables,
    previewBody,
    variableCountOf,
    whatsappButtonTypes,
    whatsappCategories,
    whatsappHeaderTypes,
    whatsappLanguages,
    type WhatsAppButton,
    type WhatsAppTemplate,
} from "./helper";

interface AddEditWhatsAppTemplateModalProps {
    data?: WhatsAppTemplate;
    accountId: string;
    toggle: () => void;
    onSave: (template: WhatsAppTemplate, isNew: boolean) => void;
}

const maxButtons = 3;

const validationSchema = Yup.object().shape({
    templateName: Yup.string()
        .trim()
        .matches(
            /^[a-z0-9_]+$/,
            "Use lowercase letters, numbers and underscores only",
        )
        .required("Template name is required"),

    category: Yup.string().required("Category is required"),

    language: Yup.string().required("Language is required"),

    headerText: Yup.string().when("headerType", {
        is: "text",
        then: schema => schema.trim().required("Header text is required"),
        otherwise: schema => schema,
    }),

    body: Yup.string()
        .trim()
        .max(1024, "The body may be at most 1024 characters")
        .test(
            "sequential",
            "Placeholders must run {{1}}, {{2}}, {{3}} with none missing",
            value => hasSequentialVariables(value || ""),
        )
        .required("Message body is required"),

    footer: Yup.string().max(60, "The footer may be at most 60 characters"),

    buttons: Yup.array().of(
        Yup.object().shape({
            text: Yup.string().trim().required("Button text is required"),

            value: Yup.string().when("buttonType", {
                is: "url",
                then: schema =>
                    schema
                        .trim()
                        .url("Enter a valid URL, e.g. https://example.com")
                        .required("URL is required"),
                otherwise: schema =>
                    schema.when("buttonType", {
                        is: "phone",
                        then: inner =>
                            inner
                                .trim()
                                .matches(
                                    /^\+?[0-9]{8,15}$/,
                                    "Enter a valid phone number",
                                )
                                .required("Phone number is required"),
                        otherwise: inner => inner,
                    }),
            }),
        }),
    ),
});

const AddEditWhatsAppTemplateModal = ({
    data,
    accountId,
    toggle,
    onSave,
}: AddEditWhatsAppTemplateModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            templateName: data?.templateName || "",
            category: data?.category || "UTILITY",
            language: data?.language || "en",
            headerType: data?.headerType || "none",
            headerText: data?.headerText || "",
            body: data?.body || "",
            footer: data?.footer || "",
            buttons: data?.buttons || ([] as Array<WhatsAppButton>),
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `whatsapp-template-${Date.now()}`,
                    accountId: data?.accountId || accountId,
                    templateName: values.templateName.trim(),
                    category: values.category,
                    language: values.language,
                    headerType: values.headerType as WhatsAppTemplate["headerType"],
                    headerText:
                        values.headerType === "text"
                            ? values.headerText.trim()
                            : "",
                    body: values.body.trim(),
                    footer: values.footer.trim(),
                    buttons: values.buttons,
                    status: "pending",
                    rejectionReason: "",
                    updatedAt: new Date().toISOString(),
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

    const buttonErrorFor = (index: number, key: keyof WhatsAppButton) => {
        const touched = formik.touched.buttons?.[index]?.[key];
        const errors = formik.errors.buttons?.[index];

        if (!touched || !errors || typeof errors === "string") {
            return "";
        }

        return (errors as Record<string, string>)[key] || "";
    };

    const patchButtonHandler = (
        index: number,
        changes: Partial<WhatsAppButton>,
    ) => {
        formik.setFieldValue(
            "buttons",
            formik.values.buttons.map((button, buttonIndex) =>
                buttonIndex === index ? { ...button, ...changes } : button,
            ),
        );
    };

    const variableCount = variableCountOf(formik.values.body);

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                {isEdit && data?.status === "approved" && (
                    <div className="alert alert-warning tw-py-2">
                        <span className="tw-text-sm">
                            This template is approved. Saving a change submits it for
                            review again, and it cannot be sent until Meta approves
                            the new wording.
                        </span>
                    </div>
                )}

                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="templateName"
                            labelText="Template Name"
                            labelClass="required"
                            placeHolder="enquiry_acknowledgement"
                            maxLength={512}
                            helperText="Lowercase letters, numbers and underscores only."
                            value={formik.values.templateName}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                                formik.setFieldValue(
                                    "templateName",
                                    event.target.value
                                        .toLowerCase()
                                        .replace(/[^a-z0-9_]/g, "_"),
                                )
                            }
                            onBlur={formik.handleBlur}
                            invalid={errorFor("templateName") ? true : false}
                            error={errorFor("templateName")}
                        />
                    </div>

                    <div className="col-12 col-md-3">
                        <SelectInput
                            name="category"
                            labelText="Category"
                            labelClass="required"
                            hideSelectOption
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={whatsappCategories}
                            valueKey="id"
                            textKey="name"
                            invalid={errorFor("category") ? true : false}
                            error={errorFor("category")}
                        />
                    </div>

                    <div className="col-12 col-md-3">
                        <SelectInput
                            name="language"
                            labelText="Language"
                            labelClass="required"
                            hideSelectOption
                            value={formik.values.language}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            menuItems={whatsappLanguages}
                            valueKey="id"
                            textKey="name"
                            invalid={errorFor("language") ? true : false}
                            error={errorFor("language")}
                        />
                    </div>

                    <div className="col-12 col-md-4">
                        <SelectInput
                            name="headerType"
                            labelText="Header"
                            hideSelectOption
                            value={formik.values.headerType}
                            onChange={formik.handleChange}
                            menuItems={whatsappHeaderTypes}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    {formik.values.headerType === "text" && (
                        <div className="col-12 col-md-8">
                            <TextInput
                                name="headerText"
                                labelText="Header Text"
                                labelClass="required"
                                placeHolder="Digital Campus Admissions"
                                maxLength={60}
                                value={formik.values.headerText}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={errorFor("headerText") ? true : false}
                                error={errorFor("headerText")}
                            />
                        </div>
                    )}

                    {["image", "document", "video"].includes(
                        formik.values.headerType,
                    ) && (
                            <div className="col-12 col-md-8">
                                <p className="tw-mb-3 tw-mt-4 tw-text-xs tw-text-gray-500">
                                    A {formik.values.headerType} header carries no fixed
                                    content here — the file is chosen when the message is
                                    sent.
                                </p>
                            </div>
                        )}

                    <div className="col-12">
                        <TextArea
                            name="body"
                            labelText="Message Body"
                            labelClass="required"
                            placeHolder="Hi {{1}}, thank you for your enquiry about admission for {{2}}."
                            height="120px"
                            maxLength={1024}
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("body") ? true : false}
                            error={errorFor("body")}
                        />

                        <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                            {variableCount} variable{variableCount === 1 ? "" : "s"} ·{" "}
                            {formik.values.body.length}/1024 characters. Use{" "}
                            {"{{1}}"}, {"{{2}}"} for values filled in at send time.
                        </p>
                    </div>

                    <div className="col-12">
                        <TextInput
                            name="footer"
                            labelText="Footer"
                            placeHolder="Reply STOP to opt out"
                            maxLength={60}
                            helperText="Optional. Shown in small grey text under the message."
                            value={formik.values.footer}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("footer") ? true : false}
                            error={errorFor("footer")}
                        />
                    </div>
                </div>

                <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                    <div className="tw-mb-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        <div className="tw-min-w-0">
                            <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                Buttons
                            </p>
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                Up to {maxButtons}. Quick replies come back as a
                                message; the others open a link or dial a number.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="hoverInfo"
                            disabled={formik.values.buttons.length >= maxButtons}
                            onClick={() =>
                                formik.setFieldValue("buttons", [
                                    ...formik.values.buttons,
                                    {
                                        id: `button-${Date.now()}`,
                                        buttonType: "quick_reply",
                                        text: "",
                                        value: "",
                                    },
                                ])
                            }
                        >
                            <i className="ri-add-line tw-me-1"></i>
                            Add Button
                        </Button>
                    </div>

                    {formik.values.buttons.length === 0 ? (
                        <p className="tw-mb-0 tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-py-3 tw-text-center tw-text-sm tw-text-gray-500">
                            No buttons. The message will be text only.
                        </p>
                    ) : (
                        formik.values.buttons.map((button, index) => (
                            <div key={button.id} className="row tw-items-start">
                                <div className="col-12 col-md-3">
                                    <SelectInput
                                        name={`buttons[${index}].buttonType`}
                                        hideSelectOption
                                        value={button.buttonType}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLSelectElement>,
                                        ) =>
                                            patchButtonHandler(index, {
                                                buttonType: event.target
                                                    .value as WhatsAppButton["buttonType"],
                                                value: "",
                                            })
                                        }
                                        menuItems={whatsappButtonTypes}
                                        valueKey="id"
                                        textKey="name"
                                    />
                                </div>

                                <div className="col-12 col-md-4">
                                    <TextInput
                                        name={`buttons[${index}].text`}
                                        placeHolder="Button text"
                                        maxLength={25}
                                        value={button.text}
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>,
                                        ) =>
                                            patchButtonHandler(index, {
                                                text: event.target.value,
                                            })
                                        }
                                        onBlur={formik.handleBlur}
                                        invalid={
                                            buttonErrorFor(index, "text") ? true : false
                                        }
                                        error={buttonErrorFor(index, "text")}
                                    />
                                </div>

                                <div className="col-10 col-md-4">
                                    {button.buttonType === "quick_reply" ? (
                                        <p className="tw-mb-3 tw-pt-2 tw-text-xs tw-text-gray-500">
                                            The reply text is the button text.
                                        </p>
                                    ) : (
                                        <TextInput
                                            name={`buttons[${index}].value`}
                                            placeHolder={
                                                button.buttonType === "url"
                                                    ? "https://example.com"
                                                    : "+919000000000"
                                            }
                                            value={button.value}
                                            onChange={(
                                                event: React.ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                patchButtonHandler(index, {
                                                    value: event.target.value,
                                                })
                                            }
                                            onBlur={formik.handleBlur}
                                            invalid={
                                                buttonErrorFor(index, "value")
                                                    ? true
                                                    : false
                                            }
                                            error={buttonErrorFor(index, "value")}
                                        />
                                    )}
                                </div>

                                <div className="col-2 col-md-1">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        title="Remove button"
                                        aria-label={`Remove button ${index + 1}`}
                                        onClick={() =>
                                            formik.setFieldValue(
                                                "buttons",
                                                formik.values.buttons.filter(
                                                    (_, buttonIndex) =>
                                                        buttonIndex !== index,
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
                </div>

                {formik.values.body.trim() && (
                    <div className="tw-mb-0 tw-rounded tw-border tw-border-gray-200 tw-bg-[#ece5dd] tw-p-3">
                        <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-text-gray-700">
                            Preview
                        </p>

                        <div className="tw-max-w-[320px] tw-rounded tw-bg-white tw-p-3 tw-shadow-sm">
                            {formik.values.headerType === "text" &&
                                formik.values.headerText && (
                                    <p className="tw-mb-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        {formik.values.headerText}
                                    </p>
                                )}

                            {["image", "document", "video"].includes(
                                formik.values.headerType,
                            ) && (
                                    <div className="tw-mb-2 tw-grid tw-h-20 tw-place-items-center tw-rounded tw-bg-gray-100 tw-text-xs tw-uppercase tw-text-gray-500">
                                        {formik.values.headerType}
                                    </div>
                                )}

                            <p className="tw-mb-1 tw-whitespace-pre-wrap tw-text-sm tw-text-gray-800">
                                {previewBody(formik.values.body)}
                            </p>

                            {formik.values.footer && (
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {formik.values.footer}
                                </p>
                            )}

                            {formik.values.buttons.length > 0 && (
                                <div className="tw-mt-2 tw-flex tw-flex-col tw-gap-1 tw-border-t tw-border-gray-200 tw-pt-2">
                                    {formik.values.buttons.map(button => (
                                        <span
                                            key={button.id}
                                            className="tw-text-center tw-text-sm tw-text-[#0b7a4f]"
                                        >
                                            {button.text || "Button"}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save & Resubmit" : "Submit for Review"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditWhatsAppTemplateModal;

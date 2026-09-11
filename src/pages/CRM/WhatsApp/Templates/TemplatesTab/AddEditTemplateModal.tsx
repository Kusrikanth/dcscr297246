import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormFeedback, Label } from "reactstrap";

import {
    Button,
    InputCheckboxUpdated,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../../Components/Common";
import WhatsAppPreview from "../../WhatsAppPreview";
import {
    crmUsers,
    ctaTypeOptions,
    detectTemplateVariables,
    messageActionTypeOptions,
    templateCategoryOptions,
    templateLanguageOptions,
    templateTypeOptions,
    whatsAppAccounts,
    type TemplateCTAButton,
    type WhatsAppTemplate,
} from "../../helper";

interface AddEditTemplateModalProps {
    data?: WhatsAppTemplate;
    prefill?: Partial<WhatsAppTemplate>;
    toggle: () => void;
    onSave: (values: WhatsAppTemplate, isEdit: boolean) => void;
}

const mediaHeaderTypes = ["IMAGE", "VIDEO", "FILE"];

const emptyCta: TemplateCTAButton = {
    type: "URL",
    buttonTitle: "",
    buttonValue: "",
};

const validationSchema = Yup.object().shape({
    integrationId: Yup.string().required("WhatsApp account is required"),

    templateName: Yup.string()
        .trim()
        .required("Template name is required")
        .max(60, "Template name cannot exceed 60 characters")
        .matches(
            /^[a-z0-9_]+$/,
            "Use lowercase letters, numbers and underscores only",
        ),

    label: Yup.string().trim().required("Label is required"),

    category: Yup.string().required("Category is required"),

    language: Yup.string().required("Language is required"),

    templateType: Yup.string().required("Template type is required"),

    headerContent: Yup.string().when("templateType", {
        is: (value: string) => mediaHeaderTypes.includes(value),
        then: Yup.string()
            .trim()
            .required("Header media URL is required for this template type")
            .url("Enter a valid URL"),
        otherwise: Yup.string(),
    }),

    body: Yup.string()
        .trim()
        .required("Message body is required")
        .max(1024, "Message body cannot exceed 1024 characters"),

    footer: Yup.string().max(60, "Footer cannot exceed 60 characters"),

    sampleText: Yup.string().when("body", {
        is: (value: string) => detectTemplateVariables(value).length > 0,
        then: Yup.string()
            .trim()
            .required(
                "Sample text is required when the body contains placeholders",
            ),
        otherwise: Yup.string(),
    }),

    quickReplies: Yup.array().when("messageActionType", {
        is: "QuickReplies",
        then: Yup.array()
            .of(
                Yup.string()
                    .trim()
                    .required("Quick reply text is required")
                    .max(25, "Quick reply cannot exceed 25 characters"),
            )
            .min(1, "Add at least one quick reply")
            .max(3, "A template can carry up to 3 quick replies"),
        otherwise: Yup.array(),
    }),

    callToAction: Yup.array().when("messageActionType", {
        is: "CTA",
        then: Yup.array()
            .of(
                Yup.object().shape({
                    type: Yup.string().required("Button type is required"),

                    buttonTitle: Yup.string()
                        .trim()
                        .required("Button text is required")
                        .max(30, "Button text cannot exceed 30 characters"),

                    buttonValue: Yup.string()
                        .trim()
                        .required("Button value is required")
                        .when("type", {
                            is: "URL",
                            then: Yup.string().url("Enter a valid URL"),
                            otherwise: Yup.string().matches(
                                /^\+?[0-9]{10,15}$/,
                                "Enter a valid phone number",
                            ),
                        }),
                }),
            )
            .min(1, "Add at least one call-to-action button")
            .max(2, "A template can carry up to 2 call-to-action buttons"),
        otherwise: Yup.array(),
    }),
});

const AddEditTemplateModal = ({
    data,
    prefill,
    toggle,
    onSave,
}: AddEditTemplateModalProps) => {
    const isEdit = Boolean(data);
    const source = data || prefill;
    const [userSearch, setUserSearch] = useState<string>("");

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            integrationId: source?.integrationId || "",
            templateName: source?.templateName || "",
            label: source?.label || "",
            category: source?.category || "MARKETING",
            language: source?.language || "English",
            templateType: source?.templateType || "TEXT",
            messageActionType: source?.messageActionType || "NONE",
            headerContent: source?.headerContent || "",
            body: source?.body || "",
            footer: source?.footer || "",
            sampleText: source?.sampleText || "",
            quickReplies: source?.quickReplies || [],
            callToAction: source?.callToAction || [],
            visibleUserIds: source?.visibleUserIds || [],
        },

        validationSchema,

        onSubmit: values => {
            const bodyVariables = detectTemplateVariables(values.body);
            const account = whatsAppAccounts.find(
                item => item.id === values.integrationId,
            );

            const payload: WhatsAppTemplate = {
                id: data?.id || `t-${Date.now()}`,
                templateName: values.templateName.trim(),
                label: values.label.trim(),
                category: values.category,
                language: values.language,
                templateType: values.templateType,
                messageActionType: values.messageActionType,
                status: isEdit ? data?.status || "PENDING" : "PENDING",
                body: values.body.trim(),
                headerContent: mediaHeaderTypes.includes(values.templateType)
                    ? values.headerContent.trim()
                    : "",
                footer: values.footer.trim(),
                sampleText: bodyVariables.length
                    ? values.sampleText.trim()
                    : values.body.trim(),
                quickReplies:
                    values.messageActionType === "QuickReplies"
                        ? values.quickReplies.filter(item => item.trim())
                        : [],
                callToAction:
                    values.messageActionType === "CTA"
                        ? values.callToAction
                        : [],
                visibleUserIds: values.visibleUserIds,
                rejectionReason: isEdit ? data?.rejectionReason || "" : "",
                integrationId: values.integrationId,
                integrationName: account?.name || "",
                createdAt: data?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            onSave(payload, isEdit);
            toggle();
        },
    });

    const { values, setFieldValue } = formik;

    useEffect(() => {
        if (isEdit || !values.integrationId) {
            return;
        }

        const account = whatsAppAccounts.find(
            item => item.id === values.integrationId,
        );

        if (account) {
            setFieldValue("label", account.name);
        }
    }, [isEdit, setFieldValue, values.integrationId]);

    const bodyVariables = useMemo(
        () => detectTemplateVariables(values.body),
        [values.body],
    );

    const accountOptions = useMemo(
        () =>
            whatsAppAccounts.map(item => ({
                id: item.id,
                name: item.hasCredentials
                    ? `${item.name} · ${item.branchName}`
                    : `${item.name} (configuration required)`,
                disabled: !item.hasCredentials,
            })),
        [],
    );

    const visibleUsers = useMemo(() => {
        const term = userSearch.trim().toLowerCase();

        if (!term) {
            return crmUsers;
        }

        return crmUsers.filter(user =>
            `${user.name} ${user.email}`.toLowerCase().includes(term),
        );
    }, [userSearch]);

    const templateNameChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "");

        setFieldValue("templateName", value);
    };

    const quickReplyChangeHandler = (index: number, value: string) => {
        setFieldValue(
            "quickReplies",
            values.quickReplies.map((item, itemIndex) =>
                itemIndex === index ? value : item,
            ),
        );
    };

    const ctaChangeHandler = (
        index: number,
        field: keyof TemplateCTAButton,
        value: string,
    ) => {
        setFieldValue(
            "callToAction",
            values.callToAction.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item,
            ),
        );
    };

    const toggleUserHandler = (userId: string) => {
        setFieldValue(
            "visibleUserIds",
            values.visibleUserIds.includes(userId)
                ? values.visibleUserIds.filter(item => item !== userId)
                : [...values.visibleUserIds, userId],
        );
    };

    const quickReplyError = (index: number) => {
        const errors = formik.errors.quickReplies;

        return Array.isArray(errors) ? (errors[index] as string) : "";
    };

    const ctaError = (index: number, field: keyof TemplateCTAButton) => {
        const errors = formik.errors.callToAction;

        if (!Array.isArray(errors)) {
            return "";
        }

        const entry = errors[index] as
            | Record<string, string>
            | string
            | undefined;

        return typeof entry === "object" ? entry?.[field] || "" : "";
    };

    const listLevelError = (field: "quickReplies" | "callToAction") => {
        const errors = formik.errors[field];

        return typeof errors === "string" ? errors : "";
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="row">
                <div className="col-12 col-xl-8">
                    <h6 className="tw-mb-3 tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-500">
                        Basic information
                    </h6>

                    <div className="row">
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="integrationId"
                                labelText="WhatsApp Account"
                                defaultSelect="Select Account"
                                value={values.integrationId}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                menuItems={accountOptions}
                                valueKey="id"
                                textKey="name"
                                isDisabled={isEdit}
                                invalid={
                                    formik.touched.integrationId &&
                                        formik.errors.integrationId
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.integrationId &&
                                        formik.errors.integrationId
                                        ? formik.errors.integrationId
                                        : ""
                                }
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <TextInput
                                name="label"
                                labelText="Label"
                                placeHolder="Filled from the WhatsApp account"
                                value={values.label}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                isReadOnly
                                helperText="Taken from the WhatsApp account this template is created on"
                                invalid={
                                    formik.touched.label && formik.errors.label
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.label && formik.errors.label
                                        ? formik.errors.label
                                        : ""
                                }
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <TextInput
                                name="templateName"
                                labelText="Template Name"
                                placeHolder="my_template_name"
                                value={values.templateName}
                                onChange={templateNameChangeHandler}
                                onBlur={formik.handleBlur}
                                maxLength={60}
                                isReadOnly={isEdit}
                                helperText="Lowercase letters, numbers and underscores only"
                                invalid={
                                    formik.touched.templateName &&
                                        formik.errors.templateName
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.templateName &&
                                        formik.errors.templateName
                                        ? formik.errors.templateName
                                        : ""
                                }
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="category"
                                labelText="Category"
                                value={values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                menuItems={templateCategoryOptions}
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                                invalid={
                                    formik.touched.category &&
                                        formik.errors.category
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.category &&
                                        formik.errors.category
                                        ? formik.errors.category
                                        : ""
                                }
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="language"
                                labelText="Language"
                                value={values.language}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                menuItems={templateLanguageOptions}
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                                invalid={
                                    formik.touched.language &&
                                        formik.errors.language
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.language &&
                                        formik.errors.language
                                        ? formik.errors.language
                                        : ""
                                }
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="templateType"
                                labelText="Template Type"
                                value={values.templateType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                menuItems={templateTypeOptions}
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                                invalid={
                                    formik.touched.templateType &&
                                        formik.errors.templateType
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.templateType &&
                                        formik.errors.templateType
                                        ? formik.errors.templateType
                                        : ""
                                }
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="messageActionType"
                                labelText="Message Buttons"
                                value={values.messageActionType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                menuItems={messageActionTypeOptions}
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                            />
                        </div>

                        {mediaHeaderTypes.includes(values.templateType) && (
                            <div className="col-12">
                                <TextInput
                                    name="headerContent"
                                    labelText={`Header Content (${values.templateType.toLowerCase()} URL)`}
                                    placeHolder="https://..."
                                    value={values.headerContent}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    maxLength={500}
                                    invalid={
                                        formik.touched.headerContent &&
                                            formik.errors.headerContent
                                            ? true
                                            : false
                                    }
                                    error={
                                        formik.touched.headerContent &&
                                            formik.errors.headerContent
                                            ? formik.errors.headerContent
                                            : ""
                                    }
                                    labelClass="required"
                                />
                            </div>
                        )}

                        <div className="col-12">
                            <TextArea
                                name="body"
                                labelText="Message Body"
                                placeHolder="Hello {{1}}, welcome to {{2}}!"
                                value={values.body}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                height="130px"
                                maxLength={1024}
                                showRemainingChars
                                helperText="Use {{1}}, {{2}} for personalised values"
                                invalid={
                                    formik.touched.body && formik.errors.body
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.body && formik.errors.body
                                        ? formik.errors.body
                                        : ""
                                }
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12">
                            <TextInput
                                name="footer"
                                labelText="Footer"
                                placeHolder="Optional footer text"
                                value={values.footer}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                maxLength={60}
                                helperText={`${values.footer.length} / 60 characters`}
                                invalid={
                                    formik.touched.footer &&
                                        formik.errors.footer
                                        ? true
                                        : false
                                }
                                error={
                                    formik.touched.footer &&
                                        formik.errors.footer
                                        ? formik.errors.footer
                                        : ""
                                }
                            />
                        </div>

                        {bodyVariables.length > 0 && (
                            <div className="col-12">
                                <TextArea
                                    name="sampleText"
                                    labelText="Sample Text"
                                    placeHolder="One sample value per line, in placeholder order"
                                    value={values.sampleText}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    height="90px"
                                    helperText={`${bodyVariables.length} placeholder(s) found: ${bodyVariables.join(", ")}`}
                                    invalid={
                                        formik.touched.sampleText &&
                                            formik.errors.sampleText
                                            ? true
                                            : false
                                    }
                                    error={
                                        formik.touched.sampleText &&
                                            formik.errors.sampleText
                                            ? formik.errors.sampleText
                                            : ""
                                    }
                                    labelClass="required"
                                />
                            </div>
                        )}
                    </div>

                    {values.messageActionType === "QuickReplies" && (
                        <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                            <div className="tw-mb-2 tw-flex tw-items-center tw-justify-between">
                                <div>
                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        Quick replies
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        Add up to 3 quick reply options
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="soft"
                                    onClick={() =>
                                        setFieldValue("quickReplies", [
                                            ...values.quickReplies,
                                            "",
                                        ])
                                    }
                                    disabled={values.quickReplies.length >= 3}
                                >
                                    <i className="ri-add-line"></i>
                                    Add quick reply
                                </Button>
                            </div>

                            {values.quickReplies.map((reply, index) => (
                                <div
                                    key={`quick-reply-${index}`}
                                    className="tw-mb-2 tw-flex tw-items-start tw-gap-2"
                                >
                                    <div className="tw-flex-1">
                                        <TextInput
                                            name={`quickReplies[${index}]`}
                                            placeHolder={`Reply ${index + 1}`}
                                            value={reply}
                                            onChange={event =>
                                                quickReplyChangeHandler(
                                                    index,
                                                    event.target.value,
                                                )
                                            }
                                            onBlur={formik.handleBlur}
                                            maxLength={25}
                                            formgroupClassName="tw-mb-0"
                                            invalid={
                                                quickReplyError(index)
                                                    ? true
                                                    : false
                                            }
                                            error={quickReplyError(index)}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-mt-1"
                                        aria-label="Remove quick reply"
                                        onClick={() =>
                                            setFieldValue(
                                                "quickReplies",
                                                values.quickReplies.filter(
                                                    (_, itemIndex) =>
                                                        itemIndex !== index,
                                                ),
                                            )
                                        }
                                    >
                                        <i className="ri-delete-bin-line tw-text-danger"></i>
                                    </Button>
                                </div>
                            ))}

                            {listLevelError("quickReplies") && (
                                <FormFeedback className="tw-block">
                                    {listLevelError("quickReplies")}
                                </FormFeedback>
                            )}
                        </div>
                    )}

                    {values.messageActionType === "CTA" && (
                        <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                            <div className="tw-mb-2 tw-flex tw-items-center tw-justify-between">
                                <div>
                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        Call-to-action buttons
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        Add up to 2 call-to-action buttons
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="soft"
                                    onClick={() =>
                                        setFieldValue("callToAction", [
                                            ...values.callToAction,
                                            { ...emptyCta },
                                        ])
                                    }
                                    disabled={values.callToAction.length >= 2}
                                >
                                    <i className="ri-add-line"></i>
                                    Add button
                                </Button>
                            </div>

                            {values.callToAction.map((button, index) => (
                                <div
                                    key={`cta-${index}`}
                                    className="row tw-mb-2 tw-items-start"
                                >
                                    <div className="col-12 col-md-3">
                                        <SelectInput
                                            name={`callToAction[${index}].type`}
                                            value={button.type}
                                            onChange={event =>
                                                ctaChangeHandler(
                                                    index,
                                                    "type",
                                                    event.target.value,
                                                )
                                            }
                                            menuItems={ctaTypeOptions}
                                            valueKey="id"
                                            textKey="name"
                                            hideSelectOption
                                            formgroupClassName="tw-mb-0"
                                        />
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <TextInput
                                            name={`callToAction[${index}].buttonTitle`}
                                            placeHolder="Button text"
                                            value={button.buttonTitle}
                                            onChange={event =>
                                                ctaChangeHandler(
                                                    index,
                                                    "buttonTitle",
                                                    event.target.value,
                                                )
                                            }
                                            onBlur={formik.handleBlur}
                                            maxLength={30}
                                            formgroupClassName="tw-mb-0"
                                            invalid={
                                                ctaError(index, "buttonTitle")
                                                    ? true
                                                    : false
                                            }
                                            error={ctaError(
                                                index,
                                                "buttonTitle",
                                            )}
                                        />
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <TextInput
                                            name={`callToAction[${index}].buttonValue`}
                                            placeHolder={
                                                button.type === "URL"
                                                    ? "https://..."
                                                    : "+919876543210"
                                            }
                                            value={button.buttonValue}
                                            onChange={event =>
                                                ctaChangeHandler(
                                                    index,
                                                    "buttonValue",
                                                    event.target.value,
                                                )
                                            }
                                            onBlur={formik.handleBlur}
                                            maxLength={300}
                                            formgroupClassName="tw-mb-0"
                                            invalid={
                                                ctaError(index, "buttonValue")
                                                    ? true
                                                    : false
                                            }
                                            error={ctaError(
                                                index,
                                                "buttonValue",
                                            )}
                                        />
                                    </div>

                                    <div className="col-12 col-md-1">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                            aria-label="Remove call-to-action button"
                                            onClick={() =>
                                                setFieldValue(
                                                    "callToAction",
                                                    values.callToAction.filter(
                                                        (_, itemIndex) =>
                                                            itemIndex !== index,
                                                    ),
                                                )
                                            }
                                        >
                                            <i className="ri-delete-bin-line tw-text-danger"></i>
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {listLevelError("callToAction") && (
                                <FormFeedback className="tw-block">
                                    {listLevelError("callToAction")}
                                </FormFeedback>
                            )}
                        </div>
                    )}

                    <div className="tw-rounded tw-border tw-border-gray-200 tw-p-3">
                        <div className="tw-mb-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                            <div>
                                <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                    Who can use this template
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    Counsellors only see templates selected
                                    here. Administrators always see every
                                    template.
                                </p>
                            </div>

                            <div className="tw-flex tw-gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        setFieldValue(
                                            "visibleUserIds",
                                            crmUsers.map(user => user.id),
                                        )
                                    }
                                >
                                    Select all
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={!values.visibleUserIds.length}
                                    onClick={() =>
                                        setFieldValue("visibleUserIds", [])
                                    }
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {!values.visibleUserIds.length && (
                            <div className="alert alert-warning tw-mb-2 tw-py-2 tw-text-xs">
                                Nobody selected. This template will be usable by
                                administrators only — counsellors will not see
                                it in the send screen.
                            </div>
                        )}

                        <TextInput
                            name="templateUserSearch"
                            placeHolder="Search users…"
                            value={userSearch}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) => setUserSearch(event.target.value)}
                            formgroupClassName="tw-mb-2"
                        />

                        <div className="row">
                            {visibleUsers.map(user => (
                                <div
                                    className="col-12 col-md-6"
                                    key={user.id}
                                >
                                    <div
                                        className={`tw-mb-2 tw-w-full tw-rounded tw-border tw-p-2 ${values.visibleUserIds.includes(user.id)
                                            ? "tw-border-[#1bb3a6] tw-bg-[#d1f4f1]"
                                            : "tw-border-gray-200 hover:tw-bg-gray-50"
                                            }`}
                                    >
                                        <InputCheckboxUpdated
                                            name={`visibleUser-${user.id}`}
                                            formgroupClassName="tw-mb-0"
                                            value={values.visibleUserIds.includes(
                                                user.id,
                                            )}
                                            onChange={() =>
                                                toggleUserHandler(user.id)
                                            }
                                            labelName={
                                                <span className="tw-min-w-0">
                                                    <span className="tw-block tw-truncate tw-text-sm tw-font-medium tw-text-gray-800">
                                                        {user.name}
                                                    </span>
                                                    <span className="tw-block tw-truncate tw-text-xs tw-text-gray-500">
                                                        {user.email}
                                                    </span>
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>
                            ))}

                            {!visibleUsers.length && (
                                <div className="col-12">
                                    <p className="tw-mb-0 tw-py-2 tw-text-sm tw-text-gray-500">
                                        No users match “{userSearch}”.
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-400">
                            {values.visibleUserIds.length} of {crmUsers.length}{" "}
                            users selected
                        </p>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <Label className="tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-500">
                        Preview
                    </Label>

                    <div className="tw-sticky tw-top-2">
                        <WhatsAppPreview template={values} />

                        <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                            <p className="tw-mb-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                                Before you submit
                            </p>
                            <ul className="tw-mb-0 tw-ps-3 tw-text-xs tw-text-gray-600">
                                <li>
                                    Template names must be lowercase with
                                    underscores
                                </li>
                                <li>Message body is limited to 1024 characters</li>
                                <li>Footer is limited to 60 characters</li>
                                <li>
                                    Every placeholder needs a sample value on its
                                    own line
                                </li>
                                <li>
                                    Submitted templates stay in Pending until the
                                    provider approves them
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Discard
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Update Template" : "Create Template"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditTemplateModal;

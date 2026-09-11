import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    MultiSelect,
    QuillEditor,
    SelectInput,
    TextInput,
} from "../../../../../Components/Common";
import { activeStatusOptions } from "../../helper";
import { crmUsers } from "../../Users/helper";
import {
    emailMergeFields,
    emailTemplateCategories,
    type EmailTemplate,
} from "./helper";

interface AddEditEmailTemplateModalProps {
    data?: EmailTemplate;
    toggle: () => void;
    onSave: (template: EmailTemplate, isNew: boolean) => void;
}

const validationSchema = Yup.object().shape({
    templateName: Yup.string().trim().required("Template name is required"),

    category: Yup.string().required("Category is required"),

    subject: Yup.string().trim().required("Subject is required"),

    bodyHtml: Yup.string()
        .test(
            "not-empty",
            "Email body is required",
            value => Boolean(value && value.replace(/<[^>]*>/g, "").trim()),
        )
        .required("Email body is required"),
});

const AddEditEmailTemplateModal = ({
    data,
    toggle,
    onSave,
}: AddEditEmailTemplateModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            templateName: data?.templateName || "",
            category: data?.category || "General",
            subject: data?.subject || "",
            bodyHtml: data?.bodyHtml || "",
            status: data ? (data.isActive ? "active" : "inactive") : "active",
            visibleUserIds: data?.visibleUserIds || ([] as Array<string>),
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `email-template-${Date.now()}`,
                    templateName: values.templateName.trim(),
                    category: values.category,
                    subject: values.subject.trim(),
                    bodyHtml: values.bodyHtml,
                    isActive: values.status === "active",
                    visibleUserIds: values.visibleUserIds,
                    updatedBy: data?.updatedBy || "CRM user",
                    updatedAt: new Date().toISOString(),
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

    const insertMergeFieldHandler = (field: string) => {
        formik.setFieldValue(
            "subject",
            `${formik.values.subject}{{${field}}}`,
        );
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="templateName"
                            labelText="Template Name"
                            labelClass="required"
                            placeHolder="e.g. Enquiry Acknowledgement"
                            maxLength={120}
                            value={formik.values.templateName}
                            onChange={formik.handleChange}
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
                            menuItems={emailTemplateCategories}
                            valueKey="id"
                            textKey="name"
                            invalid={errorFor("category") ? true : false}
                            error={errorFor("category")}
                        />
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

                    <div className="col-12">
                        <TextInput
                            name="subject"
                            labelText="Subject"
                            labelClass="required"
                            placeHolder="Thank you for your enquiry, {{parent_name}}"
                            maxLength={200}
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("subject") ? true : false}
                            error={errorFor("subject")}
                        />
                    </div>
                </div>

                <QuillEditor
                    name="bodyHtml"
                    labelText="Email Body"
                    labelClass="required"
                    placeHolder="Write the message the recipient will read…"
                    value={formik.values.bodyHtml}
                    onChange={(value: string) =>
                        formik.setFieldValue("bodyHtml", value)
                    }
                    onBlur={() => formik.setFieldTouched("bodyHtml", true)}
                    invalid={errorFor("bodyHtml") ? true : false}
                    error={errorFor("bodyHtml")}
                />

                <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        Merge fields
                    </p>
                    <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                        Click to add to the subject, or type the token straight into
                        the body.
                    </p>

                    <div className="tw-flex tw-flex-wrap tw-gap-1">
                        {emailMergeFields.map(field => (
                            <Button
                                key={field}
                                type="button"
                                variant="secondary"
                                className="!tw-px-2 !tw-py-1 !tw-bg-[#eef1f7] !tw-text-xs tw-font-semibold tw-text-[#405189]"
                                onClick={() => insertMergeFieldHandler(field)}
                            >
                                {`{{${field}}}`}
                            </Button>
                        ))}
                    </div>
                </div>

                <MultiSelect
                    name="visibleUserIds"
                    labelText="Visible To"
                    menuItems={crmUsers.map(user => ({
                        id: user.id,
                        name: user.name,
                    }))}
                    valueKey="id"
                    textKey="name"
                    value={crmUsers
                        .filter(user =>
                            formik.values.visibleUserIds.includes(user.id),
                        )
                        .map(user => ({ id: user.id, name: user.name }))}
                    onChange={(selected: Array<{ id: string }>) =>
                        formik.setFieldValue(
                            "visibleUserIds",
                            (selected || []).map(option => option.id),
                        )
                    }
                />

                <p className="tw-mb-0 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                    Leave empty to let every CRM user send this template.
                </p>
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save Template" : "Create Template"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditEmailTemplateModal;

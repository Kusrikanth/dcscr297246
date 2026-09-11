import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    MultiSelect,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../../Components/Common";
import { crmUsers } from "../../Users/helper";
import {
    dltContentIdPattern,
    previewBody,
    segmentCountOf,
    smsTemplateCategories,
    variableCountOf,
    type SmsTemplate,
} from "./helper";

interface AddEditSmsTemplateModalProps {
    data?: SmsTemplate;
    accountId: string;
    toggle: () => void;
    onSave: (template: SmsTemplate, isNew: boolean) => void;
}

const validationSchema = Yup.object().shape({
    templateName: Yup.string().trim().required("Template name is required"),

    dltContentId: Yup.string()
        .trim()
        .matches(dltContentIdPattern, "DLT Content ID must be 4 to 19 digits")
        .required("DLT Content ID is required"),

    body: Yup.string().trim().required("Message text is required"),
});

const AddEditSmsTemplateModal = ({
    data,
    accountId,
    toggle,
    onSave,
}: AddEditSmsTemplateModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            templateName: data?.templateName || "",
            category: data?.category || "General",
            body: data?.body || "",
            dltContentId: data?.dltContentId || "",
            senderId: data?.senderId || "",
            isActive: data ? data.isActive : true,
            visibleUserIds: data?.visibleUserIds || ([] as Array<string>),
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `sms-template-${Date.now()}`,
                    accountId: data?.accountId || accountId,
                    templateName: values.templateName.trim(),
                    category: values.category,
                    body: values.body.trim(),
                    dltContentId: values.dltContentId.trim(),
                    senderId: values.senderId.trim(),
                    isActive: values.isActive,
                    visibleUserIds: values.visibleUserIds,
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

    const variableCount = variableCountOf(formik.values.body);
    const segmentCount = segmentCountOf(formik.values.body);

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="templateName"
                            labelText="Template Name"
                            labelClass="required"
                            placeHolder="Application reminder"
                            maxLength={120}
                            value={formik.values.templateName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("templateName") ? true : false}
                            error={errorFor("templateName")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="dltContentId"
                            labelText="DLT Content ID"
                            labelClass="required"
                            placeHolder="1234567890123"
                            maxLength={19}
                            helperText="Issued by the DLT portal for this exact wording. 4 to 19 digits."
                            value={formik.values.dltContentId}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) =>
                                formik.setFieldValue(
                                    "dltContentId",
                                    event.target.value.replace(/\D/g, ""),
                                )
                            }
                            onBlur={formik.handleBlur}
                            invalid={errorFor("dltContentId") ? true : false}
                            error={errorFor("dltContentId")}
                        />
                    </div>

                    <div className="col-12">
                        <TextArea
                            name="body"
                            labelText="Message"
                            labelClass="required"
                            placeHolder="Dear {{1}}, your application {{2}} is pending."
                            height="110px"
                            maxLength={1000}
                            value={formik.values.body}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("body") ? true : false}
                            error={errorFor("body")}
                        />

                        <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                            {variableCount} variable
                            {variableCount === 1 ? "" : "s"} ·{" "}
                            {formik.values.body.length} characters · {segmentCount}{" "}
                            segment{segmentCount === 1 ? "" : "s"}. Use{" "}
                            {"{{1}}"}, {"{{2}}"} for values filled in at send time.
                        </p>
                    </div>

                    <div className="col-12 col-md-6">
                        <SelectInput
                            name="category"
                            labelText="Category"
                            hideSelectOption
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            menuItems={smsTemplateCategories}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="senderId"
                            labelText="Sender ID"
                            placeHolder="Leave blank to use the account's"
                            maxLength={11}
                            value={formik.values.senderId}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>

                {formik.values.body.trim() && (
                    <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                        <p className="tw-mb-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                            Preview
                        </p>
                        <p className="tw-mb-1 tw-text-sm tw-text-gray-700">
                            {previewBody(formik.values.body)}
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            {previewBody(formik.values.body).length} characters ·{" "}
                            {segmentCountOf(previewBody(formik.values.body))} segment
                            {segmentCountOf(previewBody(formik.values.body)) === 1
                                ? ""
                                : "s"}{" "}
                            once the values are filled in.
                        </p>
                    </div>
                )}

                <InputCheckbox
                    name="isActive"
                    labelName="Active"
                    value={formik.values.isActive}
                    onChange={formik.handleChange}
                />

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
                    {isEdit ? "Save Changes" : "Add Template"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditSmsTemplateModal;

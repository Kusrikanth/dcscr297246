import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../Components/Common";
import type { ConfigItem } from "../../businessunitconfig";
import type { SettingsOption } from "../../helper";

interface AddEditConfigItemModalProps {
    data?: ConfigItem & { parentId?: string };
    itemLabel: string;
    parentLabel?: string;
    parentOptions?: Array<SettingsOption>;
    codeLabel?: string;
    codePlaceholder?: string;
    showPosition?: boolean;
    toggle: () => void;
    onSave: (item: ConfigItem & { parentId?: string }, isNew: boolean) => void;
}

const AddEditConfigItemModal = ({
    data,
    itemLabel,
    parentLabel,
    parentOptions,
    codeLabel,
    codePlaceholder,
    showPosition,
    toggle,
    onSave,
}: AddEditConfigItemModalProps) => {
    const isEdit = Boolean(data?.id);
    const needsParent = Boolean(parentLabel && parentOptions);

    const validationSchema = Yup.object().shape({
        displayName: Yup.string()
            .trim()
            .required(`${itemLabel} name is required`),

        parentId: needsParent
            ? Yup.string().required(`${parentLabel} is required`)
            : Yup.string(),
    });

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            displayName: data?.displayName || "",
            code: data?.code || "",
            position: String(data?.position || 0),
            parentId: data?.parentId || "",
            isActive: data ? data.isActive : true,
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `item-${Date.now()}`,
                    displayName: values.displayName.trim(),
                    isActive: values.isActive,
                    ...(codeLabel ? { code: values.code.trim() } : null),
                    ...(showPosition ? { position: Number(values.position) } : null),
                    ...(needsParent ? { parentId: values.parentId } : null),
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

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            {needsParent && (
                <SelectInput
                    name="parentId"
                    labelText={parentLabel}
                    labelClass="required"
                    defaultSelect={`Select ${parentLabel?.toLowerCase()}`}
                    value={formik.values.parentId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    menuItems={parentOptions}
                    valueKey="id"
                    textKey="name"
                    invalid={errorFor("parentId") ? true : false}
                    error={errorFor("parentId")}
                />
            )}

            <TextInput
                name="displayName"
                labelText={`${itemLabel} Name`}
                labelClass="required"
                placeHolder={`Enter the ${itemLabel.toLowerCase()} name`}
                maxLength={120}
                value={formik.values.displayName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={errorFor("displayName") ? true : false}
                error={errorFor("displayName")}
            />

            {codeLabel && (
                <TextInput
                    name="code"
                    labelText={codeLabel}
                    placeHolder={codePlaceholder}
                    maxLength={40}
                    value={formik.values.code}
                    onChange={formik.handleChange}
                />
            )}

            {showPosition && (
                <TextInput
                    name="position"
                    inputType="number"
                    labelText="Display Order"
                    value={formik.values.position}
                    onChange={formik.handleChange}
                />
            )}

            <InputCheckbox
                name="isActive"
                labelName="Active"
                value={formik.values.isActive}
                onChange={formik.handleChange}
            />
            <p className="tw-mb-0 tw-ms-4 tw-text-xs tw-text-gray-500">
                An inactive value stays on the records that already use it, but is
                no longer offered on new ones.
            </p>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save Changes" : `Add ${itemLabel}`}
                </Button>
            </div>
        </form>
    );
};

export default AddEditConfigItemModal;

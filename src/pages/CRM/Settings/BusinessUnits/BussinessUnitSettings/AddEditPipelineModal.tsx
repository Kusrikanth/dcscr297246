import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    TextInput,
} from "../../../../../Components/Common";
import type { BusinessUnitConfig } from "../../businessunitconfig";

type LeadPipeline = BusinessUnitConfig["leadPipelines"][number];

interface AddEditPipelineModalProps {
    data?: LeadPipeline;
    toggle: () => void;
    onSave: (pipeline: LeadPipeline, isNew: boolean) => void;
}

const validationSchema = Yup.object().shape({
    displayName: Yup.string()
        .trim()
        .required("Pipeline name is required"),
});

const AddEditPipelineModal = ({
    data,
    toggle,
    onSave,
}: AddEditPipelineModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            displayName: data?.displayName || "",
            description: data?.description || "",
            isDefault: data?.isDefault || false,
            isActive: data ? data.isActive : true,
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `pipeline-${Date.now()}`,
                    displayName: values.displayName.trim(),
                    description: values.description.trim(),
                    isDefault: values.isDefault,
                    isActive: values.isActive,
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
            <div className="row">
                <div className="col-12">
                    <TextInput
                        name="displayName"
                        labelText="Pipeline Name"
                        labelClass="required"
                        placeHolder="e.g. Transport enquiries"
                        maxLength={80}
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={errorFor("displayName") ? true : false}
                        error={errorFor("displayName")}
                    />
                </div>

                <div className="col-12">
                    <TextInput
                        name="description"
                        labelText="Description"
                        placeHolder="What this pipeline is for"
                        maxLength={160}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                </div>

                <div className="col-12">
                    <InputCheckbox
                        name="isDefault"
                        labelName="Default pipeline for new leads"
                        value={formik.values.isDefault}
                        onChange={formik.handleChange}
                    />
                    <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                        Where a lead goes when nothing names a pipeline —
                        manual adds, imports, enquiry forms and Meta leads.
                    </p>
                </div>

                {isEdit && (
                    <div className="col-12">
                        <InputCheckbox
                            name="isActive"
                            labelName="Active"
                            value={formik.values.isActive}
                            onChange={formik.handleChange}
                        />
                    </div>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save changes" : "Add pipeline"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditPipelineModal;

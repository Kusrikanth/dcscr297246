import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    InputCheckbox,
    SelectInput,
    TextInput,
} from "../../../../../Components/Common";
import {
    stageTypeOptions,
    type PipelineStage,
    type TrackerStatus,
} from "../../businessunitconfig";

type StageRecord = PipelineStage | TrackerStatus;

interface AddEditStageModalProps {
    data?: StageRecord;
    itemLabel: string;
    showFollowup?: boolean;
    showStageType?: boolean;
    toggle: () => void;
    onSave: (stage: StageRecord, isNew: boolean) => void;
}

const validationSchema = (itemLabel: string) =>
    Yup.object().shape({
        displayName: Yup.string()
            .trim()
            .required(`${itemLabel} name is required`),

        color: Yup.string().required("Colour is required"),
    });

const AddEditStageModal = ({
    data,
    itemLabel,
    showFollowup,
    showStageType,
    toggle,
    onSave,
}: AddEditStageModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            displayName: data?.displayName || "",
            stageType: data?.stageType || "open",
            color: data?.color || "#405189",
            requiresFollowup:
                (data as PipelineStage | undefined)?.requiresFollowup || false,
            isActive: data ? data.isActive : true,
        },

        validationSchema: validationSchema(itemLabel),

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `stage-${Date.now()}`,
                    displayName: values.displayName.trim(),
                    stageType: values.stageType,
                    color: values.color,
                    position: data?.position || 0,
                    isActive: values.isActive,
                    ...(showFollowup
                        ? { requiresFollowup: values.requiresFollowup }
                        : null),
                } as StageRecord,
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
                <div className="col-12 col-md-8">
                    <TextInput
                        name="displayName"
                        labelText={`${itemLabel} Name`}
                        labelClass="required"
                        placeHolder={`Enter the ${itemLabel.toLowerCase()} name`}
                        maxLength={80}
                        value={formik.values.displayName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={errorFor("displayName") ? true : false}
                        error={errorFor("displayName")}
                    />
                </div>

                <div className="col-12 col-md-4">
                    <label className="form-label required" htmlFor="color">
                        Colour
                    </label>

                    <input
                        id="color"
                        name="color"
                        type="color"
                        className="form-control form-control-color tw-mb-3"
                        value={formik.values.color}
                        onChange={formik.handleChange}
                    />
                </div>

                {showStageType && (
                    <div className="col-12">
                        <SelectInput
                            name="stageType"
                            labelText={`${itemLabel} Behaviour`}
                            hideSelectOption
                            value={formik.values.stageType}
                            onChange={formik.handleChange}
                            menuItems={stageTypeOptions}
                            valueKey="id"
                            textKey="name"
                        />
                    </div>
                )}
            </div>

            {showFollowup && (
                <InputCheckbox
                    name="requiresFollowup"
                    labelName="Next follow-up required"
                    value={formik.values.requiresFollowup}
                    onChange={formik.handleChange}
                />
            )}

            {isEdit && (
                <InputCheckbox
                    name="isActive"
                    labelName="Active"
                    value={formik.values.isActive}
                    onChange={formik.handleChange}
                />
            )}

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

export default AddEditStageModal;

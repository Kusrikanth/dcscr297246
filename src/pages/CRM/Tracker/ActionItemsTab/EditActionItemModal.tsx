import { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    DateInput,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../Components/Common";
import {
    guestOwners,
    toLocalInputValue,
    trackerUsers,
    type ActionItemRecord,
    type TrackerStage,
} from "../helper";

interface EditActionItemModalProps {
    data?: ActionItemRecord;
    stages: Array<TrackerStage>;
    toggle: () => void;
    onSave: (record: ActionItemRecord) => void;
}

const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required("Action item is required"),

    stageId: Yup.string().required("Status is required"),

    ownerKey: Yup.string().required("Owner is required"),

    dueAt: Yup.string().required("Deadline is required"),
});

const EditActionItemModal = ({
    data,
    stages,
    toggle,
    onSave,
}: EditActionItemModalProps) => {
    const ownerOptions = useMemo(
        () => [
            ...trackerUsers
                .filter(user => user.employeeId)
                .map(user => ({
                    id: `employee:${user.employeeId}`,
                    name: user.name,
                })),
            ...guestOwners.map(owner => ({
                id: `guest:${owner.id}`,
                name: `${owner.name} (guest)`,
            })),
        ],
        [],
    );

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            title: data?.title || "",
            description: data?.description || "",
            stageId: data?.stageId || "",
            ownerKey: data?.ownerEmployeeId
                ? `employee:${data.ownerEmployeeId}`
                : data?.guestOwnerId
                    ? `guest:${data.guestOwnerId}`
                    : "",
            dueAt: toLocalInputValue(data?.dueAt),
        },

        validationSchema,

        onSubmit: values => {
            if (!data) {
                return;
            }

            const [ownerType, ownerId] = values.ownerKey.split(":");
            const ownerName =
                ownerOptions
                    .find(item => item.id === values.ownerKey)
                    ?.name.replace(" (guest)", "") || "";

            onSave({
                ...data,
                title: values.title.trim(),
                description: values.description,
                stageId: values.stageId,
                ownerEmployeeId: ownerType === "employee" ? ownerId : "",
                guestOwnerId: ownerType === "guest" ? ownerId : "",
                owner: ownerName,
                dueAt: values.dueAt,
            });

            toggle();
        },
    });

    const errorFor = (
        field: "title" | "description" | "stageId" | "ownerKey" | "dueAt",
    ) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            {data && (
                <p className="tw-mb-3 tw-font-mono tw-text-xs tw-text-[#405189]">
                    {data.recordNumber}
                </p>
            )}

            <div className="row">
                <div className="col-12">
                    <TextInput
                        name="title"
                        labelText="Action Item"
                        placeHolder="Enter the action item"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        maxLength={200}
                        invalid={errorFor("title") ? true : false}
                        error={errorFor("title")}
                        labelClass="required"
                    />
                </div>

                <div className="col-12">
                    <TextArea
                        name="description"
                        labelText="Description"
                        placeHolder="Add any detail the owner needs"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        height="100px"
                        maxLength={1000}
                        showRemainingChars
                    />
                </div>

                <div className="col-12 col-md-6">
                    <SelectInput
                        name="stageId"
                        labelText="Status"
                        defaultSelect="Select status"
                        value={formik.values.stageId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        menuItems={stages}
                        valueKey="id"
                        textKey="displayName"
                        invalid={errorFor("stageId") ? true : false}
                        error={errorFor("stageId")}
                        labelClass="required"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <SelectInput
                        name="ownerKey"
                        labelText="Owner"
                        defaultSelect="Select owner"
                        value={formik.values.ownerKey}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        menuItems={ownerOptions}
                        valueKey="id"
                        textKey="name"
                        invalid={errorFor("ownerKey") ? true : false}
                        error={errorFor("ownerKey")}
                        labelClass="required"
                    />
                </div>

                <div className="col-12">
                    <DateInput
                        name="dueAt"
                        labelText="Deadline"
                        inputType="datetime-local"
                        value={formik.values.dueAt}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={errorFor("dueAt") ? true : false}
                        error={errorFor("dueAt")}
                        labelClass="required"
                    />
                </div>
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    Save Changes
                </Button>
            </div>
        </form>
    );
};

export default EditActionItemModal;

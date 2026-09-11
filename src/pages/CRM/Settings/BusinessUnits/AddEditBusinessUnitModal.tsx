import type { ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import {
    Button,
    TextArea,
    TextInput,
} from "../../../../Components/Common";
import type { BusinessUnitOption } from "../helper";

interface AddEditBusinessUnitModalProps {
    data?: BusinessUnitOption;
    toggle: () => void;
    onSave: (unit: BusinessUnitOption, isNew: boolean) => void;
}

const defaultColour = "#0b7a4f";

const normaliseHex = (input: string) => {
    const raw = String(input ?? "")
        .trim()
        .replace(/^#/, "");

    if (/^[0-9a-f]{3}$/i.test(raw)) {
        return `#${raw
            .split("")
            .map(character => character + character)
            .join("")}`.toLowerCase();
    }

    if (/^[0-9a-f]{6}$/i.test(raw)) {
        return `#${raw}`.toLowerCase();
    }

    return "";
};

const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),

    industryType: Yup.string().trim().required("Industry type is required"),

    color: Yup.string()
        .trim()
        .test(
            "hex",
            "Enter a colour like #0b7a4f",
            value => Boolean(value && normaliseHex(value)),
        )
        .required("Theme colour is required"),

    helpUrl: Yup.string()
        .trim()
        .test(
            "scheme",
            "Must start with https://, mailto: or tel:",
            value =>
                !value || /^(https:\/\/|mailto:|tel:)/i.test(value.trim()),
        ),
});

const AddEditBusinessUnitModal = ({
    data,
    toggle,
    onSave,
}: AddEditBusinessUnitModalProps) => {
    const isEdit = Boolean(data);

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            name: data?.name || "",
            industryType: data?.industryType || "General",
            description: data?.description || "",
            color: data?.color || defaultColour,
            brandTitle: data?.brandTitle || "",
            brandSubtitle: data?.brandSubtitle || "",
            brandLogo: data?.brandLogo || "",
            helpUrl: data?.helpUrl || "",
            helpTitle: data?.helpTitle || "",
            helpSubtitle: data?.helpSubtitle || "",
            deletionPassword: "",
        },

        validationSchema,

        onSubmit: values => {
            onSave(
                {
                    id: data?.id || `unit-${Date.now()}`,
                    name: values.name.trim(),
                    industryType: values.industryType.trim(),
                    description: values.description.trim(),
                    color: normaliseHex(values.color) || defaultColour,
                    leadCount: data?.leadCount || 0,
                    isDefault: data?.isDefault || false,
                    compatibilityMode: data?.compatibilityMode || "metadata",
                    brandTitle: values.brandTitle.trim(),
                    brandSubtitle: values.brandSubtitle.trim(),
                    brandLogo: values.brandLogo,
                    helpUrl: values.helpUrl.trim(),
                    helpTitle: values.helpTitle.trim(),
                    helpSubtitle: values.helpSubtitle.trim(),
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

    const swatch = normaliseHex(formik.values.color) || defaultColour;

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
            formik.setFieldValue("brandLogo", String(reader.result || ""));
        reader.onerror = () => toast.error("Could not read that image");
        reader.readAsDataURL(file);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="tw-p-4">
            <div className="tw-max-h-[65vh] tw-overflow-y-auto tw-pe-1">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="name"
                            labelText="Name"
                            labelClass="required"
                            placeHolder="e.g. Real Estate"
                            maxLength={100}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("name") ? true : false}
                            error={errorFor("name")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="industryType"
                            labelText="Industry Type"
                            labelClass="required"
                            placeHolder="e.g. Property Sales"
                            maxLength={100}
                            value={formik.values.industryType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("industryType") ? true : false}
                            error={errorFor("industryType")}
                        />
                    </div>

                    <div className="col-12">
                        <TextArea
                            name="description"
                            labelText="Description"
                            placeHolder="What this business unit sells or admits for"
                            height="70px"
                            maxLength={300}
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Sidebar branding
                </p>

                <div className="row">
                    <div className="col-12 col-md-6">
                        <TextInput
                            name="brandTitle"
                            labelText="Title"
                            placeHolder="Orbit"
                            maxLength={80}
                            value={formik.values.brandTitle}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="brandSubtitle"
                            labelText="Sub Title"
                            placeHolder="Admissions CRM"
                            maxLength={120}
                            value={formik.values.brandSubtitle}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12">
                        <span className="tw-mb-1 tw-block tw-text-sm tw-text-[#495057]">
                            Logo
                        </span>

                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                            {formik.values.brandLogo ? (
                                <img
                                    src={formik.values.brandLogo}
                                    alt="Sidebar logo preview"
                                    className="tw-h-10 tw-w-10 tw-rounded tw-border tw-border-gray-200 tw-object-contain"
                                />
                            ) : (
                                <span className="tw-grid tw-h-10 tw-w-10 tw-place-items-center tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-text-gray-400">
                                    <i className="ri-image-line"></i>
                                </span>
                            )}

                            <label className="btn btn-light tw-mb-0 tw-cursor-pointer tw-border tw-border-gray-200">
                                <i className="ri-upload-2-line tw-me-1"></i>
                                {formik.values.brandLogo ? "Replace" : "Choose file"}
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/gif,image/webp"
                                    className="tw-hidden"
                                    onChange={logoChangeHandler}
                                />
                            </label>

                            {formik.values.brandLogo && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() =>
                                        formik.setFieldValue("brandLogo", "")
                                    }
                                >
                                    Remove logo
                                </Button>
                            )}
                        </div>

                        <p className="tw-mb-3 tw-mt-1 tw-text-xs tw-text-gray-500">
                            PNG, JPG, GIF or WebP up to 1 MB. Leave blank to keep
                            the default mark.
                        </p>
                    </div>
                </div>

                <p className="tw-mb-2 tw-mt-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                    Support card
                </p>

                <div className="row">
                    <div className="col-12">
                        <TextInput
                            name="helpUrl"
                            labelText="Link"
                            placeHolder="https://wa.me/919000000000"
                            maxLength={1000}
                            helperText="Where the sidebar help card sends people. Must start with https://, mailto: or tel:. Leave blank to show the card without a link."
                            value={formik.values.helpUrl}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={errorFor("helpUrl") ? true : false}
                            error={errorFor("helpUrl")}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="helpTitle"
                            labelText="Title"
                            placeHolder="Need a hand?"
                            maxLength={80}
                            value={formik.values.helpTitle}
                            onChange={formik.handleChange}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="helpSubtitle"
                            labelText="Sub Title"
                            placeHolder="Visit the help centre"
                            maxLength={160}
                            value={formik.values.helpSubtitle}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 col-md-6">
                        <label className="form-label required" htmlFor="color">
                            Theme Colour
                        </label>

                        <div className="tw-mb-3 tw-flex tw-items-center tw-gap-2">
                            <input
                                type="color"
                                className="form-control form-control-color tw-flex-shrink-0"
                                aria-label="Theme colour swatch"
                                value={swatch}
                                onChange={event =>
                                    formik.setFieldValue("color", event.target.value)
                                }
                            />

                            <TextInput
                                name="color"
                                placeHolder={defaultColour}
                                maxLength={7}
                                value={formik.values.color}
                                onChange={formik.handleChange}
                                onBlur={event => {
                                    formik.handleBlur(event);

                                    const hex = normaliseHex(formik.values.color);

                                    if (hex) {
                                        formik.setFieldValue("color", hex);
                                    }
                                }}
                                invalid={Boolean(errorFor("color"))}
                                error={errorFor("color")}
                                formgroupClassName="tw-mb-0 tw-flex-1"
                            />
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <TextInput
                            name="deletionPassword"
                            inputType="password"
                            labelText="Deletion Password"
                            autoComplete="new-password"
                            maxLength={200}
                            placeHolder="No password required"
                            helperText="Applied to every deletion in this business unit. Leave blank to allow deletion without a password."
                            value={formik.values.deletionPassword}
                            onChange={formik.handleChange}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button type="submit" variant="primary">
                    {isEdit ? "Save Changes" : "Add Business Unit"}
                </Button>
            </div>
        </form>
    );
};

export default AddEditBusinessUnitModal;

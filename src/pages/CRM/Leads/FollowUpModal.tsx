import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    DateInput,
    SelectInput,
} from "../../../Components/Common";

const stageOptions = [
    {
        id: "new",
        name: "New",
    },
    {
        id: "not-connected",
        name: "Not Connected",
    },
    {
        id: "campus-visit",
        name: "Campus Visit",
    },
    {
        id: "not-interested",
        name: "Not Interested",
    },
    {
        id: "lost",
        name: "Lost",
    },
    {
        id: "application",
        name: "Application",
    },
    {
        id: "admission-done",
        name: "Admission Done",
    },
];

const subStageOptions = [
    {
        id: "new-lead",
        name: "New Lead",
    },
    {
        id: "new-pending",
        name: "New - Pending",
    },
];

const counsellorOptions = [
    {
        id: "1",
        name: "ARJUN - NACHARAM",
    },
    {
        id: "2",
        name: "TARUN - NACHARAM",
    },
];

const initialValues = {
    stageId: "new",
    subStageId: "",
    counsellorId: "1",
    nextFollowUp: "",
    newComment: "",
};

interface FollowUpModalData {
    stageId?: string;
    subStageId?: string;
    counsellorId?: string;
    nextFollowUpValue?: string;
}

interface FollowUpModalProps {
    toggle: () => void;
    data?: FollowUpModalData;
}

const validationSchema = Yup.object().shape({
    stageId: Yup.string()
        .required("Stage is required"),

    subStageId: Yup.string()
        .required("Sub-stage is required"),

    counsellorId: Yup.string()
        .required("Counsellor is required"),

    newComment: Yup.string()
        .trim()
        .required("New comment is required"),
});

const FollowUpModal = ({
    toggle,
    data,
}: FollowUpModalProps) => {
    const formik = useFormik({
        enableReinitialize: true,

        initialValues: data
            ? {
                stageId:
                    data?.stageId || "new",

                subStageId:
                    data?.subStageId || "",

                counsellorId:
                    data?.counsellorId || "1",

                nextFollowUp:
                    data?.nextFollowUpValue || "",

                newComment: "",
            }
            : initialValues,

        validationSchema,

        onSubmit: () => {
            toggle();
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="tw-p-4"
        >
            <div className="row">
                <div className="col-12 col-lg-6">
                    <SelectInput
                        name="stageId"
                        labelText="Stage"
                        value={
                            formik.values.stageId
                        }
                        onChange={
                            formik.handleChange
                        }
                        onBlur={
                            formik.handleBlur
                        }
                        menuItems={
                            stageOptions
                        }
                        valueKey="id"
                        textKey="name"
                        invalid={
                            !!(
                                formik.touched
                                    .stageId &&
                                formik.errors
                                    .stageId
                            )
                        }
                        error={
                            formik.touched.stageId &&
                                formik.errors.stageId
                                ? formik.errors.stageId
                                : ""
                        }
                        labelClass="required"
                    />
                </div>

                <div className="col-12 col-lg-6">
                    <SelectInput
                        name="subStageId"
                        labelText="Sub-stage"
                        value={
                            formik.values
                                .subStageId
                        }
                        onChange={
                            formik.handleChange
                        }
                        onBlur={
                            formik.handleBlur
                        }
                        menuItems={
                            subStageOptions
                        }
                        valueKey="id"
                        textKey="name"
                        invalid={
                            !!(
                                formik.touched
                                    .subStageId &&
                                formik.errors
                                    .subStageId
                            )
                        }
                        error={
                            formik.touched
                                .subStageId &&
                                formik.errors
                                    .subStageId
                                ? formik.errors
                                    .subStageId
                                : ""
                        }
                        labelClass="required"
                    />
                </div>
                <div className="col-12 col-lg-6">
                    <DateInput
                        name="nextFollowUp"
                        labelText="Next Followup"
                        placeHolder="Select Next Followup"
                        value={
                            formik.values
                                .nextFollowUp
                        }
                        onChange={
                            formik.handleChange
                        }
                        onBlur={
                            formik.handleBlur
                        }
                    />
                </div>

                <div className="col-12 col-lg-6">
                    <SelectInput
                        name="counsellorId"
                        labelText="Counsellor"
                        value={
                            formik.values
                                .counsellorId
                        }
                        onChange={
                            formik.handleChange
                        }
                        onBlur={
                            formik.handleBlur
                        }
                        menuItems={
                            counsellorOptions
                        }
                        valueKey="id"
                        textKey="name"
                        invalid={
                            !!(
                                formik.touched
                                    .counsellorId &&
                                formik.errors
                                    .counsellorId
                            )
                        }
                        error={
                            formik.touched
                                .counsellorId &&
                                formik.errors
                                    .counsellorId
                                ? formik.errors
                                    .counsellorId
                                : ""
                        }
                        labelClass="required"
                    />
                </div>

                <div className="col-12 tw-mt-2">
                    <label className="form-label">
                        Previous comments
                    </label>

                    <div className="tw-rounded-xl tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-4">
                        <div className="tw-flex tw-flex-wrap tw-items-start tw-gap-3">
                            <div className="tw-font-semibold tw-text-gray-800">
                                Previous counsellor
                            </div>

                            <div className="tw-text-gray-400">
                                —
                            </div>

                            <div className="tw-text-sm tw-text-gray-500">
                                12 Aug 2026, 1:50 pm
                            </div>

                            <div className="tw-text-gray-400">
                                —
                            </div>

                            <div className="tw-text-sm tw-leading-6 tw-text-gray-600">
                                <div>
                                    Imported from Meta Lead Ads
                                </div>

                                <div>
                                    Source: 4
                                </div>

                                <div>
                                    Type: Test Campaign
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 tw-pt-3">
                    <div className="mb-3">
                        <label
                            htmlFor="newComment"
                            className="form-label required"
                        >
                            New comment
                        </label>

                        <textarea
                            id="newComment"
                            name="newComment"
                            rows={5}
                            className={`form-control ${formik.touched
                                .newComment &&
                                formik.errors
                                    .newComment
                                ? "is-invalid"
                                : ""
                                }`}
                            placeholder="Write a new comment..."
                            value={
                                formik.values
                                    .newComment
                            }
                            onChange={
                                formik.handleChange
                            }
                            onBlur={
                                formik.handleBlur
                            }
                        />

                        {formik.touched
                            .newComment &&
                            formik.errors
                                .newComment && (
                                <div className="invalid-feedback">
                                    {
                                        formik.errors
                                            .newComment
                                    }
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                >
                    Save follow-up
                </Button>
            </div>
        </form>
    );
};

export default FollowUpModal;

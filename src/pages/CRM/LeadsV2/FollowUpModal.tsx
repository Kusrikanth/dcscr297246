import { useMemo, type ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    CustomSelect,
    DateInput,
    SelectInput,
    TextArea,
} from "../../../Components/Common";
import { followupTypeOptions, leadMeta } from "./data";
import {
    formatDateTime,
    minimumFollowupTime,
    referralChoices,
    referralKey,
    splitReferralKey,
    stageLabelFor,
    stageRequiresFollowup,
    stagesForPipeline,
    substagesForStage,
    toLocalInput,
} from "./helper";
import type { LeadRecord, Option } from "./types";

export interface FollowUpPayload {
    stageId: string;
    substageId: string;
    nextFollowupAt: string;
    followupType: string;
    referralBranchId: string;
    referralEmployeeId: string;
    comment: string;
}

interface FollowUpModalProps {
    lead: LeadRecord;
    toggle: () => void;
    onSave: (payload: FollowUpPayload) => void;
}

const FollowUpModal = ({
    lead,
    toggle,
    onSave,
}: FollowUpModalProps) => {
    const counsellorOptions = useMemo(
        () => referralChoices(leadMeta.employees),
        [],
    );

    const defaultBranchId = String(
        lead.referredToBranchId || lead.branchId || "",
    );

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            stageId: String(lead.stageId || ""),
            substageId: String(lead.substageId || ""),
            nextFollowupAt: toLocalInput(lead.nextFollowupAt),
            followupType: lead.followupType || "",
            counsellorKey: referralKey(
                defaultBranchId,
                String(lead.ownerEmployeeId || ""),
            ),
            comment: "",
        },

        validationSchema: Yup.object().shape({
            stageId: Yup.string().required(
                "Stage is required",
            ),

            substageId: Yup.string().required(
                "Sub-stage is required",
            ),

            nextFollowupAt: Yup.string().when(
                "stageId",
                (stageId: string, schema: Yup.StringSchema) =>
                    stageRequiresFollowup(leadMeta, stageId)
                        ? schema.required(
                            "Next follow-up is required for this stage",
                        )
                        : schema,
            ),

            followupType: Yup.string().when(
                "stageId",
                (stageId: string, schema: Yup.StringSchema) =>
                    stageRequiresFollowup(leadMeta, stageId)
                        ? schema.required(
                            "Follow-up type is required for this stage",
                        )
                        : schema,
            ),

            counsellorKey: Yup.string().required(
                "Counsellor is required",
            ),

            comment: Yup.string()
                .trim()
                .required("New comment is required"),
        }),

        onSubmit: values => {
            const { branchId, employeeId } = splitReferralKey(
                values.counsellorKey,
            );

            onSave({
                stageId: values.stageId,
                substageId: values.substageId,
                nextFollowupAt: values.nextFollowupAt,
                followupType: values.followupType,
                referralBranchId: branchId,
                referralEmployeeId: employeeId,
                comment: values.comment.trim(),
            });
        },
    });

    const { values } = formik;

    const availableSubstages = useMemo(
        () => substagesForStage(leadMeta, values.stageId),
        [values.stageId],
    );

    const followupRequired = stageRequiresFollowup(
        leadMeta,
        values.stageId,
    );

    const stageChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        formik.setValues({
            ...values,
            stageId: event.target.value,
            substageId: "",
            nextFollowupAt: "",
            followupType: "",
        });
    };

    const errorOf = (name: keyof typeof values) =>
        formik.touched[name] && formik.errors[name]
            ? (formik.errors[name] as string)
            : "";

    const invalidOf = (name: keyof typeof values) =>
        Boolean(formik.touched[name] && formik.errors[name]);

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
                        labelClass="required"
                        value={values.stageId}
                        onChange={stageChangeHandler}
                        onBlur={formik.handleBlur}
                        menuItems={stagesForPipeline(
                            leadMeta,
                            lead.pipelineId,
                        ).map(item => ({
                            id: item.id,
                            name: stageLabelFor(
                                leadMeta,
                                item.id,
                            ),
                        }))}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select stage"
                        invalid={invalidOf("stageId")}
                        error={errorOf("stageId")}
                    />
                </div>

                <div className="col-12 col-lg-6">
                    <SelectInput
                        name="substageId"
                        labelText="Sub-stage"
                        labelClass="required"
                        value={values.substageId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        menuItems={availableSubstages.map(
                            item => ({
                                id: item.id,
                                name: item.displayName,
                            }),
                        )}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select sub-stage"
                        invalid={invalidOf("substageId")}
                        error={errorOf("substageId")}
                    />
                </div>

                {followupRequired && (
                    <>
                        <div className="col-12 col-lg-6">
                            <DateInput
                                name="nextFollowupAt"
                                labelText="Next Follow-up"
                                labelClass="required"
                                inputType="datetime-local"
                                minDate={minimumFollowupTime()}
                                value={values.nextFollowupAt}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={invalidOf(
                                    "nextFollowupAt",
                                )}
                                error={errorOf("nextFollowupAt")}
                            />
                        </div>

                        <div className="col-12 col-lg-6">
                            <SelectInput
                                name="followupType"
                                labelText="Follow-up Type"
                                labelClass="required"
                                value={values.followupType}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                menuItems={followupTypeOptions}
                                valueKey="id"
                                textKey="name"
                                defaultSelect="Select follow-up type"
                                invalid={invalidOf(
                                    "followupType",
                                )}
                                error={errorOf("followupType")}
                            />
                        </div>
                    </>
                )}

                <div className="col-12">
                    <CustomSelect
                        name="counsellorKey"
                        idKey="id"
                        searchKey="name"
                        labelText="Counsellor"
                        labelClass="required"
                        value={values.counsellorKey}
                        options={counsellorOptions}
                        defaultSelect="Search by counsellor or branch…"
                        renderValue={(item?: Option) =>
                            item?.name || ""
                        }
                        renderOptions={(item?: Option) =>
                            item?.name || ""
                        }
                        onChange={(next: string) => {
                            formik.setFieldValue(
                                "counsellorKey",
                                next,
                            );
                            formik.setFieldTouched(
                                "counsellorKey",
                                true,
                                false,
                            );
                        }}
                        invalid={invalidOf("counsellorKey")}
                        error={errorOf("counsellorKey")}
                    />
                    <small className="tw-text-xs tw-text-gray-500">
                        Search by counsellor or branch name.
                        Referring transfers the lead to that
                        counsellor's branch.
                    </small>
                </div>

                <div className="col-12 tw-mt-3">
                    <label className="form-label">
                        Previous comments
                    </label>

                    <div className="tw-max-h-52 tw-overflow-y-auto tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                        {lead.comments?.length ? (
                            lead.comments
                                .slice()
                                .reverse()
                                .map(comment => (
                                    <div
                                        key={comment.id}
                                        className="tw-mb-3 last:tw-mb-0"
                                    >
                                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                            <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                                                {
                                                    comment.counsellorName
                                                }
                                            </span>
                                            <span className="tw-text-gray-400">
                                                —
                                            </span>
                                            <span className="tw-text-xs tw-text-gray-500">
                                                {formatDateTime(
                                                    comment.createdAt,
                                                ) ||
                                                    "Earlier comment"}
                                            </span>
                                        </div>
                                        <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                                            {comment.commentText}
                                        </p>
                                    </div>
                                ))
                        ) : (
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                No previous comments
                            </p>
                        )}
                    </div>
                </div>

                <div className="col-12 tw-mt-3">
                    <TextArea
                        name="comment"
                        labelText="New comment"
                        labelClass="required"
                        placeHolder="Write a new comment…"
                        height="120px"
                        value={values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={invalidOf("comment")}
                        error={errorOf("comment")}
                    />
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

import { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button,
    CustomSelect,
    SelectInput } from "../../../Components/Common";
import { leadMeta } from "./data";
import {
    displayNameOf,
    referralChoices,
    referralKey,
    splitReferralKey,
} from "./helper";
import type { LeadRecord, Option } from "./types";

export interface ReferTarget {
    lead?: LeadRecord;
    leadIds?: string[];
}

interface ReferModalProps {
    target: ReferTarget;
    toggle: () => void;
    onRefer: (payload: {
        branchId: string;
        employeeId: string;
        pipelineId: string;
        leadIds: string[];
    }) => void;
}

const ReferModal = ({
    target,
    toggle,
    onRefer,
}: ReferModalProps) => {
    const isBulk = Boolean(target.leadIds?.length);
    const leadCount = isBulk
        ? (target.leadIds as string[]).length
        : 1;

    const counsellorOptions = useMemo(
        () => referralChoices(leadMeta.employees),
        [],
    );

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            pipelineId: "",
            counsellorKey:
                !isBulk && target.lead
                    ? referralKey(
                        String(
                            target.lead.referredToBranchId ||
                            target.lead.branchId ||
                            "",
                        ),
                        String(
                            target.lead.ownerEmployeeId || "",
                        ),
                    )
                    : "",
        },

        validationSchema: Yup.object().shape({
            counsellorKey: Yup.string().required(
                "Counsellor is required",
            ),
        }),

        onSubmit: values => {
            const { branchId, employeeId } = splitReferralKey(
                values.counsellorKey,
            );

            onRefer({
                branchId,
                employeeId,
                pipelineId: values.pipelineId,
                leadIds: isBulk
                    ? (target.leadIds as string[])
                    : [String(target.lead?.id)],
            });
        },
    });

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="tw-p-4"
        >
            <div className="tw-mb-3">
                <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                    {isBulk
                        ? "Bulk lead referral"
                        : "Lead referral"}
                </p>
                <h5 className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-900">
                    {isBulk
                        ? `Refer ${leadCount} selected lead${leadCount === 1 ? "" : "s"}`
                        : `Refer ${target.lead?.studentName}`}
                </h5>
                {!isBulk && (
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        {target.lead?.leadId} ·{" "}
                        {target.lead?.branchName}
                    </p>
                )}
            </div>

            <div className="row">
                {leadMeta.pipelines.length > 1 && (
                    <div className="col-12">
                        <SelectInput
                            name="pipelineId"
                            labelText="Pipeline"
                            value={formik.values.pipelineId}
                            onChange={formik.handleChange}
                            menuItems={leadMeta.pipelines.map(
                                item => ({
                                    id: item.id,
                                    name: item.isDefault
                                        ? `${item.displayName} (default)`
                                        : item.displayName,
                                }),
                            )}
                            valueKey="id"
                            textKey="name"
                            defaultSelect="Keep the current pipeline"
                        />
                    </div>
                )}

                <div className="col-12">
                    <CustomSelect
                        name="counsellorKey"
                        idKey="id"
                        searchKey="name"
                        labelText="Counsellor"
                        labelClass="required"
                        value={formik.values.counsellorKey}
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
                        invalid={
                            !!(
                                formik.touched.counsellorKey &&
                                formik.errors.counsellorKey
                            )
                        }
                        error={
                            formik.touched.counsellorKey &&
                                formik.errors.counsellorKey
                                ? formik.errors.counsellorKey
                                : ""
                        }
                    />
                </div>
            </div>

            <p className="tw-mt-2 tw-mb-0 tw-text-xs tw-text-gray-500">
                Search by counsellor or branch name. Only
                counsellors with active CRM access are listed, and
                referring transfers the lead to that counsellor's
                branch.
                {formik.values.pipelineId
                    ? ` The ${isBulk ? "leads" : "lead"} will also move to the first stage of ${displayNameOf(
                        leadMeta.pipelines,
                        formik.values.pipelineId,
                    )}.`
                    : ""}
            </p>

            <div className="tw-mt-5 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
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
                    disabled={!formik.values.counsellorKey}
                >
                    {isBulk
                        ? `Refer ${leadCount} lead${leadCount === 1 ? "" : "s"}`
                        : "Refer lead"}
                </Button>
            </div>
        </form>
    );
};

export default ReferModal;

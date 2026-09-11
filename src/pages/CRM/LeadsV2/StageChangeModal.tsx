import { useMemo, type ChangeEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { Button,
    SelectInput } from "../../../Components/Common";
import { leadMeta } from "./data";
import { stageLabelFor, substagesForStage } from "./helper";
import type { LeadRecord } from "./types";

export interface StageChangeTarget {
    lead?: LeadRecord;
    leadIds?: string[];
}

interface StageChangeModalProps {
    target: StageChangeTarget;
    toggle: () => void;
    onChangeStage: (payload: {
        stageId: string;
        substageId: string;
        leadIds: string[];
    }) => void;
}

const StageChangeModal = ({
    target,
    toggle,
    onChangeStage,
}: StageChangeModalProps) => {
    const isBulk = Boolean(target.leadIds?.length);
    const leadCount = isBulk
        ? (target.leadIds as string[]).length
        : 1;

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            stageId: isBulk
                ? ""
                : String(target.lead?.stageId || ""),
            substageId: isBulk
                ? ""
                : String(target.lead?.substageId || ""),
        },

        validationSchema: Yup.object().shape({
            stageId: Yup.string().required(
                "Stage is required",
            ),
            substageId: Yup.string().required(
                "Sub-stage is required",
            ),
        }),

        onSubmit: values =>
            onChangeStage({
                stageId: values.stageId,
                substageId: values.substageId,
                leadIds: isBulk
                    ? (target.leadIds as string[])
                    : [String(target.lead?.id)],
            }),
    });

    const availableSubstages = useMemo(
        () =>
            substagesForStage(
                leadMeta,
                formik.values.stageId,
            ),
        [formik.values.stageId],
    );

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="tw-p-4"
        >
            <div className="tw-mb-3">
                <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                    {isBulk
                        ? "Bulk lead stage change"
                        : "Lead stage change"}
                </p>
                <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                    {isBulk
                        ? `${leadCount} lead${leadCount === 1 ? "" : "s"} will be updated to the selected stage`
                        : `${target.lead?.studentName} · ${target.lead?.leadId}`}
                </p>
            </div>

            <div className="row">
                <div className="col-12 col-lg-6">
                    <SelectInput
                        name="stageId"
                        labelText="Stage"
                        labelClass="required"
                        value={formik.values.stageId}
                        onChange={(
                            event: ChangeEvent<HTMLSelectElement>,
                        ) =>
                            formik.setValues({
                                stageId: event.target.value,
                                substageId: "",
                            })
                        }
                        onBlur={formik.handleBlur}
                        menuItems={leadMeta.stages.map(item => ({
                            id: item.id,
                            name: stageLabelFor(leadMeta, item.id),
                        }))}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select stage"
                        invalid={
                            !!(
                                formik.touched.stageId &&
                                formik.errors.stageId
                            )
                        }
                        error={
                            formik.touched.stageId &&
                                formik.errors.stageId
                                ? formik.errors.stageId
                                : ""
                        }
                    />
                </div>

                <div className="col-12 col-lg-6">
                    <SelectInput
                        name="substageId"
                        labelText="Sub-stage"
                        labelClass="required"
                        value={formik.values.substageId}
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
                        isDisabled={!formik.values.stageId}
                        defaultSelect={
                            formik.values.stageId
                                ? "Select sub-stage"
                                : "Select stage first"
                        }
                        invalid={
                            !!(
                                formik.touched.substageId &&
                                formik.errors.substageId
                            )
                        }
                        error={
                            formik.touched.substageId &&
                                formik.errors.substageId
                                ? formik.errors.substageId
                                : ""
                        }
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
                    disabled={
                        !formik.values.stageId ||
                        !formik.values.substageId
                    }
                >
                    {isBulk
                        ? `Change stage for ${leadCount} lead${leadCount === 1 ? "" : "s"}`
                        : "Change stage"}
                </Button>
            </div>
        </form>
    );
};

export default StageChangeModal;

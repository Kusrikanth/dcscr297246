import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { TextInput } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateUniqueNumber } from "../../../utility/commonutility";
import { addChronicParentTypesAct, updateChronicParentTypeAct } from "../../../store/fee/feecollections/feecollectionactions";
import Button from "../../../Components/Common/Button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";

const validationSchema = Yup.object().shape({
    chronicParentTypes: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().nullable().required("Chronic Parent Type Name is required"),
        })
    ),
});

const initialValues: any = {
    chronicParentTypes: [
        {
            uniqueId: generateUniqueNumber(),
            name: "",
        },
    ],
};

const AddChronicParentTypeModal = (props: any) => {
    const dispatch = useAppDispatch();
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const { showApiLoader, currentBranchIdResp: branchId, getChronicParentTypeByIdResp } = useAppSelector(
        ({ appData, globalData, feeCollections }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getChronicParentTypeByIdResp: feeCollections.getChronicParentTypeByIdResp,
        }),
        shallowEqual
    );

    const chronicParentTypeForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { chronicParentTypes } = values || {};
            const names = chronicParentTypes?.map((i: any) => i?.name?.trim()).filter(Boolean);
            if (props?.id) {
                dispatch(
                    updateChronicParentTypeAct(
                        generateActionPayload("update_chronic_parent_type", { id: props.id }, { chronicParentTypeName: names?.[0] || "" })
                    )
                );
            } else {
                dispatch(
                    addChronicParentTypesAct(
                        generateActionPayload("add_chronic_parent_types", undefined, { branchId, chronicParentTypes: names })
                    )
                );
            }
        },
    });

    useEffect(() => {
        if (props.id && getChronicParentTypeByIdResp) {
            const { chronicParentTypeName } = getChronicParentTypeByIdResp;
            chronicParentTypeForm.setValues({
                chronicParentTypes: [{ uniqueId: generateUniqueNumber(), name: chronicParentTypeName || "" }],
            });
        }
    }, [props.id, getChronicParentTypeByIdResp]);

    function removeRowHndlr(event: React.MouseEvent<HTMLElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function addRowHndlr() {
        formikArrayHelpers.current?.push({ uniqueId: generateUniqueNumber(), name: "" });
    }

    return (
        <div className="tw-p-5">
            <div className="tw-mb-4">
                <h6 className="tw-text-sm tw-font-medium tw-mb-2">
                    Chronic Parent Type Name <span className="tw-text-red-500">*</span>
                </h6>
            </div>
            <FormikProvider value={chronicParentTypeForm}>
                <FieldArray name="chronicParentTypes">
                    {(arrayHelpers: ArrayHelpers) => {
                        if (!formikArrayHelpers.current) {
                            formikArrayHelpers.current = arrayHelpers;
                        }
                        return (
                            <>
                                {chronicParentTypeForm.values.chronicParentTypes?.map((row: any, index: number) => {
                                    const rowErrors: any = (chronicParentTypeForm.errors.chronicParentTypes as any)?.[index] || {};
                                    const rowTouched: any = (chronicParentTypeForm.touched.chronicParentTypes as any)?.[index] || {};
                                    return (
                                        <div key={row.uniqueId} className="tw-mb-3">
                                            <div className="tw-flex tw-items-center tw-gap-3">
                                                <TextInput
                                                    name={`chronicParentTypes[${index}].name`}
                                                    value={row.name}
                                                    formgroupClassName="tw-mb-0 tw-w-[90%]"
                                                    onChange={chronicParentTypeForm.handleChange}
                                                    onBlur={chronicParentTypeForm.handleBlur}
                                                    invalid={rowTouched.name && rowErrors.name}
                                                    error={rowTouched.name && rowErrors.name ? rowErrors.name : ""}
                                                />
                                                {!props.id && index !== 0 && (
                                                    <Button
                                                        type="button"
                                                        variant="wrong"
                                                        data-index={index}
                                                        onClick={removeRowHndlr}
                                                        className="!tw-px-2 !tw-py-1"
                                                    >
                                                        <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </>
                        );
                    }}
                </FieldArray>
            </FormikProvider>
            {!props.id && (
                <div className="tw-mt-2">
                    <Button type="button" variant="hoverInfo" onClick={addRowHndlr} className="!tw-px-3 !tw-py-1">
                        Add New
                    </Button>
                </div>
            )}
            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
                <Button type="button" variant="secondary" onClick={props.toggle}>
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => chronicParentTypeForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.id ? "Update" : "Submit"}
                </Button>
            </div>
        </div>
    );
};

export default React.memo(AddChronicParentTypeModal);

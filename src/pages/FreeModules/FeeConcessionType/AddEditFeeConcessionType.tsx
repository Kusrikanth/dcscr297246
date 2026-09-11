import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import React from "react";
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { TextInput } from "../../../Components/Common";
import { generateActionPayload } from "../../../utility/reduxutility";
import { addFeeConcessionTypeAct, updateFeeConcessionTypeAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import Button from "../../../Components/Common/Button";

interface SubType {
    concessionSubTypeId: number | null;
    concessionSubTypeName: string;
    deleted?: boolean;
}

const validationSchema = Yup.object().shape({
    concessionTypeName: Yup.string().nullable().required('Concession Type Name is required'),
});

const initialValues = {
    concessionTypeName: "",
    subTypes: [] as SubType[],
};

const AddEditFeeConcessionType: React.FC<any> = (props) => {
    const dispatch = useAppDispatch();
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [initialFormValues, setInitialFormValues] = useState(initialValues);

    const {
        showApiLoader,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
    } = useAppSelector(({ appData, globalData }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        showApiLoader: globalData.showApiLoader,
    }), shallowEqual);



    useEffect(() => {
        if (props.id && props.editModalData?.modalData) {
            setInitialFormValues({
                concessionTypeName: props.editModalData.modalData.concessionTypeName,
                subTypes: props.editModalData.modalData.subTypes?.map((st: any) => ({
                    concessionSubTypeId: st.id ?? null,
                    concessionSubTypeName: st.concessionSubTypeName,
                    deleted: false,
                })) || [],
            });
        } else if (props.isOpen) {
            setInitialFormValues(initialValues);
        }
    }, [props.id, props.editModalData?.modalData, props.isOpen]);


    const concessionTypeAddForm = useFormik({
        enableReinitialize: true,
        initialValues: initialFormValues,
        validationSchema,
        onSubmit: (values, { resetForm }) => {
            const { subTypes, concessionTypeName } = values;
            if (props.id) {
                const updateSubTypes = subTypes.map((ele: any) => {
                    if (ele.concessionSubTypeId) {
                        return {
                            concessionSubTypeId: ele.concessionSubTypeId,
                            concessionSubTypeName: ele.concessionSubTypeName,
                            deleted: !!ele.deleted
                        };
                    }
                    return {
                        concessionSubTypeName: ele.concessionSubTypeName
                    };
                });
                const payload = {
                    concessionTypeName: props.editModalData.modalData.concessionTypeName,
                    subTypesUpdateDetails: updateSubTypes
                };
                dispatch(updateFeeConcessionTypeAct(generateActionPayload("update_fee_concession_type", { id: props.id }, payload)));
            } else {
                const tempres = subTypes
                    ?.map((ele: any) => ({
                        concessionSubTypeName: ele.concessionSubTypeName,
                    }));
                dispatch(addFeeConcessionTypeAct(generateActionPayload("add_fee_concession_type", undefined, { branchId: props.branchId, concessionTypeName, subTypes: tempres }, undefined)));
            }
        },
    });

    function addSlabHandler() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), concessionSubTypeName: "" });
        }
    }


    function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined && rowIndex !== null) {
            const idx = Number(rowIndex);
            const subType = concessionTypeAddForm.values.subTypes[idx];
            if (subType.concessionSubTypeId) {
                formikArrayHelpers.current?.replace(idx, {
                    ...subType,
                    deleted: true,
                });
            } else {
                formikArrayHelpers.current?.remove(idx);
            }
        }
    }
    return (
        <div className="tw-p-5">

            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                <div className="tw-col-span-12">
                    <TextInput
                        name="concessionTypeName"
                        value={concessionTypeAddForm.values.concessionTypeName}
                        onChange={concessionTypeAddForm.handleChange}
                        onBlur={concessionTypeAddForm.handleBlur}
                        labelText="Concession Type Name"
                        labelClass="required"
                        invalid={(concessionTypeAddForm.touched.concessionTypeName && concessionTypeAddForm.errors.concessionTypeName) ? true : false}
                        error={(concessionTypeAddForm.touched.concessionTypeName && concessionTypeAddForm.errors.concessionTypeName) ? concessionTypeAddForm.errors.concessionTypeName : ""}
                    />
                </div>

                {concessionTypeAddForm.values.subTypes?.length > 0 && (
                    <div className="tw-col-span-12 tw-mt-2">
                        <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                            Concession Sub Type Name
                        </h6>
                    </div>
                )}

                <FormikProvider value={concessionTypeAddForm}>
                    <FieldArray name="subTypes">
                        {(arrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                                <>
                                    {concessionTypeAddForm.values.subTypes
                                        ?.map((route: any, index: any) => {
                                            if (route.deleted) return null;
                                            const key = route.concessionSubTypeId ? `id-${route.concessionSubTypeId}` : `uid-${route.uniqueId}`;
                                            return (
                                                <div
                                                    key={key}
                                                    className="tw-col-span-12 md:tw-col-span-6 tw-mb-3"
                                                >
                                                    <div className="tw-flex tw-items-center tw-gap-3">
                                                        <div className="tw-flex-1">
                                                            <TextInput
                                                                name={`subTypes[${index}].concessionSubTypeName`}
                                                                inputClassName="w-80"
                                                                value={route.concessionSubTypeName}
                                                                formgroupClassName="tw-mb-0"
                                                                onChange={concessionTypeAddForm.handleChange}
                                                                onBlur={concessionTypeAddForm.handleBlur}
                                                            />
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            data-index={index}
                                                            onClick={removeSlabHndlr}
                                                            variant="wrong"
                                                        >
                                                            <HugeiconsIcon
                                                                icon={Delete02StrokeStandard}
                                                                className="tw-text-red-500"
                                                                size={18}
                                                            />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </>
                            )
                        }}
                    </FieldArray>
                </FormikProvider>

                <div className="tw-col-span-12">
                    <Button
                        type="button"
                        onClick={addSlabHandler}
                        variant="soft"
                    >
                        Add Sub Type
                    </Button>
                </div>

            </div>

            <div className="tw-flex tw-justify-end tw-gap-4 tw-mt-6 tw-border-t tw-pt-4">
                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    onClick={(event: any) => concessionTypeAddForm.handleSubmit(event)}
                    disabled={showApiLoader}
                    variant="primary"
                >
                    {props.routeId ? "Update" : "Submit"}
                </Button>
            </div>
        </div>
    )
}

export default AddEditFeeConcessionType;
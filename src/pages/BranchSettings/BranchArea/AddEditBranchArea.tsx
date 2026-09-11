import React, { useRef, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { TextInput, TextInputWithRegex } from "../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik,  ArrayHelpers, FormikProvider } from "formik";


//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { addBranchAreaAct, updateBranchAreaAct } from "../../../store/branchsettings/branchinfo/branchinfoactions";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";
// Interface and Types
import { IBranchAreaState } from "./branchareatypes";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    areas: Yup.array().of(
        Yup.object().shape({
            areaName: Yup.string().required("Name is required."),
            pinCode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required."),
        })
    ),
});

function getInitialState(editData?: any): IBranchAreaState {
    const data: any = {
        uniqueId: editData?.id || generateUniqueNumber(),
        id: editData?.id || "",
        branchId: "",
        areaName: editData?.areaName || "",
        pinCode: editData?.pinCode || ""
    };
    return { areas: [data] }
}
const AddEditBranchArea: React.FC<any> = (props) => {
    const [branchAreaState, setBranchAreaState] = useState<IBranchAreaState>(() => getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addBranchAreaResp, updateBranchAreaResp,showApiLoader } = useAppSelector(({ branchInfo,globalData }) => ({
        addBranchAreaResp: branchInfo.addBranchAreaResp,
        updateBranchAreaResp: branchInfo.updateBranchAreaResp,
        showApiLoader:globalData.showApiLoader,
    }), shallowEqual);


    const addDepartmentRespRef = useRef<any>({
        prevAddBranchAreaResp: addBranchAreaResp,
        prevUpdateBranchAreaResp: updateBranchAreaResp
    });

    useEffect(() => {
        if (!props.isOpen) {
            addBranchAreaForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.editAreaDetails) {
            setBranchAreaState(getInitialState(props.editAreaDetails));
        } else {
            setBranchAreaState(getInitialState());
        }
    }, [props.editAreaDetails]);

    useEffect(() => {
        const { prevAddBranchAreaResp, prevUpdateBranchAreaResp } = addDepartmentRespRef.current;
        if (addBranchAreaResp && prevAddBranchAreaResp !== addBranchAreaResp) {
            props.toggle(true);
            toast.success("Branch area added successfully.");
        } else if (updateBranchAreaResp && prevUpdateBranchAreaResp !== updateBranchAreaResp) {
            props.toggle(true);
            toast.success("Branch area updated successfully.");
        }
        addDepartmentRespRef.current.prevAddBranchAreaResp = addBranchAreaResp;
        addDepartmentRespRef.current.prevUpdateBranchAreaResp = updateBranchAreaResp;
    }, [addBranchAreaResp, updateBranchAreaResp]);

    function addNewAreaHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                id: "",
                branchId: "",
                areaName: "",
                pinCode: ""
            });
        }
    }

    function removeAreaHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    const addBranchAreaForm = useFormik({
        enableReinitialize: true,
        initialValues: branchAreaState,
        validationSchema,
        onSubmit: (values) => {
            const payload = values.areas.map(item => {
                const { uniqueId, ...otherData } = item;
                return Object.assign(otherData, { branchId: props.branchId });
            });
            if (props.branchAreaId) {
                dispatch(updateBranchAreaAct(generateActionPayload("add_branch_area", undefined, payload)));
            } else {
                dispatch(addBranchAreaAct(generateActionPayload("add_branch_area", undefined, payload)));
            }
        },
    });


    return (

        <div className="tw-p-5">

            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                            Area Name
                        </h6>

                        {!props.branchAreaId && (
                            <Button
                                onClick={addNewAreaHndlr}
                                variant="hoverInfo"
                                className="!tw-px-2 !tw-py-0"
                            >
                                <i className="ri-add-line tw-text-lg" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="tw-col-span-12 md:tw-col-span-6">
                    <h6 className="tw-text-sm tw-font-semibold tw-text-gray-700">
                        Pin Code
                    </h6>
                </div>

            </div>

            <FormikProvider value={addBranchAreaForm}>
                <FieldArray name="areas">
                    {(arrayHelpers: ArrayHelpers) => {

                        if (!formikArrayHelpers.current) {
                            formikArrayHelpers.current = arrayHelpers;
                        }

                        return (
                            <>
                                {addBranchAreaForm.values.areas.length > 0 &&
                                            addBranchAreaForm.values.areas.map((area: any, index: any) => {
                                                const inputFieldErrors: any = (addBranchAreaForm.errors.areas && addBranchAreaForm?.errors?.areas[index]) || {};
                                                const inputFieldTouched: any = (addBranchAreaForm.touched.areas && addBranchAreaForm?.touched?.areas[index]) || {};
                                                return (
                                        <div
                                            key={area.uniqueId}
                                            className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4"
                                        >

                                            <div className="tw-col-span-12 md:tw-col-span-6">
                                                <TextInput
                                                    name={`areas[${index}].areaName`}
                                                    value={area.areaName}
                                                    formgroupClassName="tw-mb-0"
                                                    onChange={addBranchAreaForm.handleChange}
                                                    onBlur={addBranchAreaForm.handleBlur}
                                                    invalid={(inputFieldTouched.areaName && inputFieldErrors.areaName) ? true : false}
                                                                error={(inputFieldTouched.areaName && inputFieldErrors.areaName) ? inputFieldErrors.areaName : ""}
                                                />
                                            </div>
                                            <div className="tw-col-span-12 md:tw-col-span-6">
                                                <div className="tw-flex tw-items-center tw-gap-3">

                                                    <div className="tw-flex-1">
                                                        <TextInputWithRegex
                                                            name={`areas[${index}].pinCode`}
                                                            inputClassName="tw-w-full"
                                                            value={area.pinCode}
                                                            formgroupClassName="tw-mb-0"
                                                            onChange={addBranchAreaForm.handleChange}
                                                            onBlur={addBranchAreaForm.handleBlur}
                                                             invalid={(inputFieldTouched.pinCode && inputFieldErrors.pinCode) ? true : false}
                                                                    error={(inputFieldTouched.pinCode && inputFieldErrors.pinCode) ? inputFieldErrors.pinCode : ""}
                                                            maxLength={6}
                                                            allowedInputRegex="^[0-9]+$"
                                                        />
                                                    </div>

                                                    {index !== 0 && (
                                                        <Button
                                                            data-index={index}
                                                            onClick={removeAreaHndlr}
                                                            variant="wrong"
                                                        >
                                                            <i className="ri-delete-bin-2-fill" />
                                                        </Button>
                                                    )}

                                                </div>
                                            </div>

                                        </div>
                                    );
                                })}
                            </>
                        );
                    }}
                </FieldArray>
            </FormikProvider>

            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">

                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    onClick={(event: any) => addBranchAreaForm.handleSubmit(event)}
                    disabled={showApiLoader}
                    variant="primary"
                >
                    {props.branchAreaId ? "Update" : "Submit"}
                </Button>

            </div>
        </div>
    
    )
}


export default AddEditBranchArea;


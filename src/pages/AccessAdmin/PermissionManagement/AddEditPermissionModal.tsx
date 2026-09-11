import React, { useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
//Common Component
import { TextInput, } from "../../../Components/Common";
// Formik validation
import * as Yup from "yup";
import { useFormik, } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { toast } from "react-toastify";
import { mutatePermissionAct } from "../../../store/accessmanagement/accessmanagementaction";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    description: Yup.string().required("Permission is required."),
});

function getRoleFormData(infoData?: any) {
    return ({
        id: infoData?.id || "",
        description: infoData?.description || "",
    })
}
const initialValues = getRoleFormData();
const AddEditPermissionModal: React.FC<any> = (props) => {
    const dispatch = useAppDispatch();
    const { mutatePermissionResp, showApiLoader } =
        useAppSelector(({ accessManagement, globalData }) => ({
            mutatePermissionResp: accessManagement.mutatePermissionResp,
            showApiLoader: globalData.showApiLoader
        }), shallowEqual);


    useEffect(() => {
        if (props.modalData) {
            const formData = getRoleFormData(props.modalData);
            addRoleTypeForm.resetForm({
                values: formData
            });
        }

    }, [props.modalData]);

    const addEditModalRespRef = useRef({
        prevMutatePermissionResp: mutatePermissionResp,
    });

    useEffect(() => {
        const { prevMutatePermissionResp } = addEditModalRespRef.current;
        if (mutatePermissionResp && prevMutatePermissionResp !== mutatePermissionResp) {
            const { optionalConfig } = mutatePermissionResp;
            if (optionalConfig?.type === 'ADD') {
                toast.success("Permission created successfully.");
            } else {
                toast.success("Permission updated successfully.");
            }
            props.toggle(true);
        }
        addEditModalRespRef.current.prevMutatePermissionResp = mutatePermissionResp;
    }, [mutatePermissionResp]);


    const addRoleTypeForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values };
            if (props.roleTypeId) {
                dispatch(mutatePermissionAct(generateActionPayload("mutate_permission", undefined, [payload], {
                    type: "UPDATE"
                })));
                return;
            }
            // Remove id in add mode
            delete payload.id;
            dispatch(mutatePermissionAct(generateActionPayload("mutate_permission", undefined, [payload], {
                type: "ADD"
            })));
        },
    });

    return (
        <form onSubmit={addRoleTypeForm.handleSubmit}>
            <div className="tw-px-6 tw-pt-6 tw-pb-0">
                <div className="tw-grid tw-grid-cols-1">
                    <div>
                        <TextInput
                            name="description"
                            value={addRoleTypeForm.values.description}
                            labelText="Permission"
                            formgroupClassName="tw-mb-4"
                            labelClass="required"
                            onChange={addRoleTypeForm.handleChange}
                            invalid={addRoleTypeForm.touched.description && addRoleTypeForm.errors.description ? true : false}
                            error={addRoleTypeForm.touched.description && addRoleTypeForm.errors.description ? addRoleTypeForm.errors.description : ""}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-border-t tw-px-6 tw-py-4">
                <div className="tw-flex tw-gap-2 tw-justify-end">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        onClick={(event: any) => addRoleTypeForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        {props.roleTypeId ? "Update" : "Save"}
                    </Button>
                </div>
            </div>
        </form>
    )
}

export default AddEditPermissionModal;

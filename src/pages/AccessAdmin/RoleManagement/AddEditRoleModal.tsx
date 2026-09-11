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
import { addInstRoleTypeV2Act, updateInstRoleTypeV2Act, } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { toast } from "react-toastify";
import { addRoleTypeAct, updateRoleTypeAct } from "../../../store/accessmanagement/accessmanagementaction";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    description: Yup.string().required("Role Type is required."),
});



function getRoleFormData(infoData?: any) {
    return ({
        id: infoData?.id || "",
        description: infoData?.description || "",
    })
}
const initialValues = getRoleFormData();
const AddEditRoleModal: React.FC<any> = (props) => {
    const dispatch = useAppDispatch();
    const { updateRoleTypeResp, addRoleTypeResp, showApiLoader } =
        useAppSelector(({ accessManagement, globalData }) => ({
            addRoleTypeResp: accessManagement.addRoleTypeResp,
            updateRoleTypeResp: accessManagement.updateRoleTypeResp,
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
        prevAddRoleTypeResp: addRoleTypeResp,
        prevUpdateRoleTypeResp: updateRoleTypeResp,
    });

    useEffect(() => {
        const { prevAddRoleTypeResp, prevUpdateRoleTypeResp } = addEditModalRespRef.current;
        if (addRoleTypeResp && prevAddRoleTypeResp !== addRoleTypeResp) {
            toast.success("Role type created successfully.");
            props.toggle(true);
        }
        else if (updateRoleTypeResp && prevUpdateRoleTypeResp !== updateRoleTypeResp) {
            toast.success("Role type updated successfully.");
            props.toggle(true);
        }
        addEditModalRespRef.current.prevAddRoleTypeResp = addRoleTypeResp;
        addEditModalRespRef.current.prevUpdateRoleTypeResp = updateRoleTypeResp;
    }, [addRoleTypeResp, updateRoleTypeResp]);


    const addRoleTypeForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values };
            if (props.roleTypeId) {
                dispatch(updateRoleTypeAct(generateActionPayload("mutate_role_type", undefined, payload)));
                return;
            }
            // Remove id in add mode
            delete payload.id;
            dispatch(addRoleTypeAct(generateActionPayload("mutate_role_type", undefined, payload)));
        },
    });

    return (
        <form onSubmit={addRoleTypeForm.handleSubmit}>
            <div className="tw-px-6 tw-pt-6 tw-pb-0">
                <div className="tw-grid tw-grid-cols-1">
                    <div>
                        <TextInput
                            name={"description"}
                            value={addRoleTypeForm.values.description}
                            labelText="Role Type"
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
                <div className="tw-flex tw-justify-end tw-gap-2">
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

export default React.memo(AddEditRoleModal);

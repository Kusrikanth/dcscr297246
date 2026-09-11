import React, { useRef, useEffect } from "react";
import { shallowEqual } from "react-redux";

//Common Component
import {  TextInput, SelectInput } from "../../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import {  FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {  addInstRoleV2Act } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { nanoid } from "nanoid";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    roleTypeId: Yup.string().required("Role Type is required."),
    roleDescriptions: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().required("Role is required.")
        })
    )
});

const initialValues = {
    roleTypeId: "",
    id: nanoid(),
    roleDescriptions: [
        {
            id: nanoid(),
            description: "",
        }
    ]
}

const AddEditRoleModal: React.FC<any> = (props) => {
    const { instituteId } = props || {}; 
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addInstRoleTypeResp, updateInstRoleTypeResp, showApiLoader, addInstRoleV2Resp,getInstRoleTypeV2Resp,
    } = useAppSelector(({ instituteInfo, globalData,appData }) => ({
        addInstRoleTypeResp: instituteInfo.addInstRoleTypeResp,
        updateInstRoleTypeResp: instituteInfo.updateInstRoleTypeResp,
        getInstRoleTypeV2Resp: instituteInfo.getInstRoleTypeV2Resp,
        showApiLoader: globalData.showApiLoader,
        addInstRoleV2Resp: instituteInfo.addInstRoleV2Resp
    }), shallowEqual);

    const addRoleForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                instituteId ,
                roleTypeId: values.roleTypeId,
                roleDescriptions: values.roleDescriptions.map((role: any) => (role?.description))
            }
            if(!props.modalData){
                dispatch(addInstRoleV2Act(generateActionPayload("add_inst_role_v2", undefined, payload)));
            }

        },
    });

    useEffect(() => {
        return ()=>{
            addRoleForm.resetForm();
        }
    }, []);

    function addNewRoleHndlr() {

        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ id : nanoid(),description:"" });
        }
    }

    function removeRoleHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    return (

        <div className="tw-p-5">

            <div className="tw-w-full">
                <SelectInput
                    name={"roleTypeId"}
                    value={addRoleForm.values.roleTypeId}
                    labelText="Role Type"
                    formgroupClassName="tw-mb-3"
                    labelClass="required"
                    onChange={addRoleForm.handleChange}
                    invalid={addRoleForm.touched.roleTypeId && addRoleForm.errors.roleTypeId ? true : false}
                    error={addRoleForm.touched.roleTypeId && addRoleForm.errors.roleTypeId ? addRoleForm.errors.roleTypeId : ""}
                    menuItems={getInstRoleTypeV2Resp}
                    valueKey="id"
                    textKey="code"
                />
            </div>

            <div className="tw-mb-2">
                <h6 className="tw-text-sm tw-font-medium tw-flex tw-items-center">
                    <span className="required tw-mr-2">Role</span>
                </h6>
            </div>

            <div className="tw-w-full">
                <FormikProvider value={addRoleForm}>
                    <FieldArray name="roleDescriptions">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }
                            return (
                                <>
                                    {addRoleForm.values.roleDescriptions.length > 0 &&
                                        addRoleForm.values.roleDescriptions.map(
                                            (role: any, index: number) => {
                                                const inputFieldErrors: any =
                                                    (Array.isArray(addRoleForm.errors.roleDescriptions) &&
                                                        addRoleForm.errors.roleDescriptions[index]) ||
                                                    {};
                                                const inputFieldTouched =
                                                    (Array.isArray(addRoleForm.touched.roleDescriptions) &&
                                                        addRoleForm.touched.roleDescriptions[index]) ||
                                                    {};

                                                return (
                                                    <div key={role.id} className="tw-mb-3">

                                                        <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
                                                            <TextInput
                                                                formgroupClassName="tw-mb-0 tw-w-4/5"
                                                                name={`roleDescriptions[${index}].description`}
                                                                data-index={index}
                                                                value={role.description}
                                                                onChange={addRoleForm.handleChange}
                                                                invalid={(inputFieldTouched.description && inputFieldErrors.description) ? true : false}
                                                                error={(inputFieldTouched.description && inputFieldErrors.description) ? inputFieldErrors.description : ""}
                                                            />

                                                            {index !== 0 && (
                                                                <Button
                                                                    data-index={index}
                                                                    onClick={removeRoleHndlr}
                                                                    type="button"
                                                                    variant="wrong"
                                                                >
                                                                    <i className="ri-delete-bin-2-fill" />
                                                                </Button>
                                                            )}
                                                        </div>

                                                    </div>
                                                );
                                            }
                                        )}
                                </>
                            );
                        }}
                    </FieldArray>
                </FormikProvider>
            </div>

            <div className="tw-mb-3">
                <Button
                    onClick={addNewRoleHndlr}
                    type="button"
                    variant="hoverInfo"
                >
                    Add New
                </Button>
            </div>

            <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => addRoleForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.modalData ? "Update" : "Submit"}
                </Button>

            </div>

        </div>

    )
}

export default React.memo(AddEditRoleModal);

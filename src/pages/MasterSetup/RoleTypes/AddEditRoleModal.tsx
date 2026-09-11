import React, { MouseEventHandler, useState, useRef, useEffect } from "react";
import { Row, Col, Input, Button } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

//Common Component
import { ModalContainer, TextIconInput, TextInput, SelectInput, PhoneInput } from "../../../Components/Common";

// Formik validation
import * as Yup from "yup";
import { Formik, FieldArray, useFormik, Form, ArrayHelpers, FormikErrors, FormikProvider } from "formik";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";
//types
import { IAddEditRoleModalProps, IRolesInfo } from "./roletypes";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { addInstRoleTypeAct, updateInstRoleTypeAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getMasterUserRoleAct } from "../../../store/masterdata/masterdataactions";
import { roleTypeData, userRoleTypes } from "./helper";

const validationSchema = Yup.object().shape({
    roles: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Role name is required.")
                .matches(/^[^-\s][a-zA-Z\s-]+$/, 'Only alphabet with space, - character are allowed.'),
            roleType: Yup.string().required("Role type is required.")
        })
    )
});

function getInitialState(editData?: any): any {
    const data: any = {
        uniqueId: editData?.id || generateUniqueNumber(),
        name: editData?.name || "",
        roleType: editData?.roleType || "",
        version: editData?.version || undefined,
    }
    return { roles: [data] }
}


const AddEditRoleModal: React.FC<IAddEditRoleModalProps> = (props) => {
    const [roleListState, setDepartmentListState] = useState<any>(() => getInitialState());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { addInstRoleTypeResp, updateInstRoleTypeResp } = useAppSelector(({ instituteInfo }) => ({
        addInstRoleTypeResp: instituteInfo.addInstRoleTypeResp,
        updateInstRoleTypeResp: instituteInfo.updateInstRoleTypeResp,
    }), shallowEqual);


    const addDepartmentRespRef = useRef<any>({
        prevAddInstRoleTypeResp: addInstRoleTypeResp,
        prevUpdateInstRoleTypeResp: updateInstRoleTypeResp
    });

    useEffect(() => {
        if (!props.isOpen) {
            addRoleTypeForm.resetForm();
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.editRoleDetails) {
            setDepartmentListState(getInitialState(props.editRoleDetails));
        } else {
            setDepartmentListState(getInitialState());
        }
    }, [props.editRoleDetails]);

    useEffect(() => {
        const { prevAddInstRoleTypeResp, prevUpdateInstRoleTypeResp } = addDepartmentRespRef.current;
        if (addInstRoleTypeResp && prevAddInstRoleTypeResp !== addInstRoleTypeResp) {
            props.toggle(true);
            toast.success("Role type added successfully.");
        } else if (updateInstRoleTypeResp && prevUpdateInstRoleTypeResp !== updateInstRoleTypeResp) {
            props.toggle(true);
            toast.success("Role type updated successfully.");
        }
        addDepartmentRespRef.current.prevAddInstRoleTypeResp = addInstRoleTypeResp;
        addDepartmentRespRef.current.prevUpdateInstRoleTypeResp = updateInstRoleTypeResp;
    }, [addInstRoleTypeResp, updateInstRoleTypeResp]);

    function addNewRoleHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), name: "", roleType: "" });
        }
    }

    function removeRoleHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    function onChangeRoleTypeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        const siblingIndexKey = name.split(".")[0];
        if (value === "STUDENT") {
            addRoleTypeForm.setFieldValue(`${siblingIndexKey}.name`, "Student");

        } else if (value === "PARENT") {
            addRoleTypeForm.setFieldValue(`${siblingIndexKey}.name`, "Parent");
        } else {
            addRoleTypeForm.setFieldValue(`${siblingIndexKey}.name`, "");
        }
        addRoleTypeForm.setFieldValue(name, value);
    }

    const addRoleTypeForm = useFormik({
        enableReinitialize: true,
        initialValues: roleListState,
        validationSchema,
        onSubmit: (values) => {
            const params = { instituteId: props.instituteId, roleId: props.roleId };
            if (props.roleId) {
                const updateRolePayload: any = values.roles[0];
                const params = {
                    roleType: updateRolePayload.roleType,
                    roleId: props.roleId,
                    roleName: updateRolePayload.name
                };
                delete updateRolePayload.uniqueId;
                // const updateDepartmentPayload: IUpdateDepartmentModel = filterUniqueId[0];
                dispatch(updateInstRoleTypeAct(generateActionPayload("update_inst_role_type", params)));
            } else {
                const addRolePayload = values.roles.map((role: any) => {
                    const { uniqueId, ...otherInfo } = role;
                    return ({
                        ...otherInfo, instituteId: props.instituteId
                    })
                }), addRolesPayload = { roleList: addRolePayload };
                dispatch(addInstRoleTypeAct(generateActionPayload("add_inst_role_type", params, addRolesPayload)));
            }
        },
    });


    return (
        <ModalContainer
            id="role-modal"
            modalTitle={props.modalTitle}
            isOpen={props.isOpen}
            toggle={props.toggle}
            submitHndlr={addRoleTypeForm.handleSubmit}
            submitTitle={props.roleId ? "Update" : "Submit"}
            cancelHndlr={props.toggle}
            modalSize="md"
        >
            <div className="row">
                <div className="col-12 mb-3">
                    <div className="row">
                        <div className="col-6">
                            <div className="hstack">
                                <h6 className="mb-0 me-2">Role Type</h6>
                                {!props.roleId && <Button onClick={addNewRoleHndlr} color="outline-primary" className="btn-sm btn-icon"><i className="ri-add-line fs-18" />
                                </Button>}
                            </div>
                        </div>
                        <div className="col-6">
                            <h6 className="mb-0">Role Name</h6>
                        </div>
                    </div>

                </div>
                <div className="col-12">
                    <FormikProvider value={addRoleTypeForm}>
                        <FieldArray name="roles">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                    <>
                                        {addRoleTypeForm.values.roles.length > 0 &&
                                            addRoleTypeForm.values.roles.map((role: any, index: number) => {
                                                const inputFieldErrors: any = Array.isArray(addRoleTypeForm.errors.roles) && addRoleTypeForm.errors.roles[index] || {};
                                                const inputFieldTouched = Array.isArray(addRoleTypeForm.touched.roles) && addRoleTypeForm.touched.roles[index] || {};
                                                return (
                                                    <div key={role.uniqueId} className="row mb-3">
                                                        <div className="col-6">
                                                            <SelectInput
                                                                name={`roles[${index}].roleType`}
                                                                data-index={index}
                                                                value={role.roleType}
                                                                formgroupClassName="mb-0"
                                                                // inputClassName="w-80"
                                                                onChange={onChangeRoleTypeHndlr}
                                                                invalid={(inputFieldTouched.roleType && inputFieldErrors.roleType) ? true : false}
                                                                error={(inputFieldTouched.roleType && inputFieldErrors.roleType) ? inputFieldErrors.roleType : ""}
                                                                menuItems={userRoleTypes}
                                                                valueKey="id"
                                                                textKey="name"
                                                                isDisabled={!!props.roleId}
                                                            />

                                                        </div>
                                                        <div className="col-6">
                                                            <div className="hstack justify-content-between">
                                                                <TextInput
                                                                    formgroupClassName="mb-0 w-80 me-2"
                                                                    name={`roles[${index}].name`}
                                                                    data-index={index}
                                                                    value={role.name}
                                                                    onChange={addRoleTypeForm.handleChange}
                                                                    invalid={(inputFieldTouched.name && inputFieldErrors.name) ? true : false}
                                                                    error={(inputFieldTouched.name && inputFieldErrors.name) ? inputFieldErrors.name : ""}
                                                                    isDisabled={role.roleType === "STUDENT" || role.roleType === "PARENT"}
                                                                />

                                                                {(index !== 0) && <Button data-index={index} onClick={removeRoleHndlr} color="white"
                                                                    className="btn-sm btn-icon btn-rounded btn-hover-danger">
                                                                    <i className="ri-delete-bin-2-fill" />
                                                                </Button>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </>
                                )
                            }}
                        </FieldArray>

                    </FormikProvider>
                    {/* {
                        roleListState.map((item, index) => (
                            <div key={item.id} className="hstack mb-3 justify-content-between">
                                <Input type="text" placeholder="" id="branchName" className="w-90" />
                                {(index !== 0) &&
                                    <Button data-id={item.id} data-index={index} onClick={() => { }} color="white" className="btn-sm btn-icon btn-rounded btn-hover-danger"><i className="ri-delete-bin-2-fill" />
                                    </Button>}
                            </div>
                        ))
                    } */}

                </div>
            </div>
        </ModalContainer>
    )
}

export default React.memo(AddEditRoleModal);

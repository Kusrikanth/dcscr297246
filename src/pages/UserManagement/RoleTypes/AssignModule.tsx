import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
//Common Component
import {
    ModalContainer, TextIconInput, TextInput, SelectInput, PhoneInput
    , UploadImage,
    TextInputWithRegex,
    UploadImageUpdated,
    ModalComponent
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";


//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { getRoleTypePermissionAct, updateRoleTypeUserAct } from "../../../store/usermanagement/usermanagementactions";
import TreeComponent from "./TreeComponent";

export default function AssignModule(props: any) {
    const [roleTypeState, setRoleTypeState] = useState("");
    const [permissionsState, setPermissionsState] = useState<any>([]);
    const dispatch = useAppDispatch();

    const { roleTypePermissionResp } = useAppSelector(({ userManagement }) => ({
        roleTypePermissionResp: userManagement.roleTypePermissionResp,
    }), shallowEqual);

    const assignModuleRespRef = useRef({
        prevRoleTypePermissionResp: roleTypePermissionResp
    });

    useEffect(() => {
        const { prevRoleTypePermissionResp } = assignModuleRespRef.current;
        if (roleTypePermissionResp && prevRoleTypePermissionResp !== roleTypePermissionResp) {
            const { data } = roleTypePermissionResp;
            if (Array.isArray(data)) {
                setPermissionsState(data);
            }
        }
        assignModuleRespRef.current.prevRoleTypePermissionResp = roleTypePermissionResp;
    }, [roleTypePermissionResp]);
    useEffect(() => {
        if (props.isOpen) {
            const params = { roleType: "EMPLOYEE" };
            dispatch(getRoleTypePermissionAct(generateActionPayload("get_role_type_permission", params)));
        }
    }, [props.isOpen]);

    return (
        <ModalComponent
            id="assign-module-modal"
            modalTitle="Assign Modules"
            isOpen={props.isOpen}
            toggle={props.toggle}
            hideFooter={true}
            cancelHndlr={props.toggle}
            modalSize="lg"
        >
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                {/* <div className="tw-col-span-5">
                    <SelectInput
                        name="roleType"
                        labelText="Branch Type"
                        value={roleTypeState}
                        onChange={(e: any) => { setRoleTypeState(e.target.value) }}
                        menuItems={[{ id: "Admin", name: "Admin" }]}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Role Type"
                    />
                </div> */}
                <div className="tw-col-span-12">
                    <TreeComponent permissionDetails={permissionsState} />
                </div>
            </div>
        </ModalComponent>
    )
}
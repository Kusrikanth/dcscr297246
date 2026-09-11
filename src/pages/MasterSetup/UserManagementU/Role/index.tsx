import React, { useMemo, useEffect, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";

//Modal Component

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteInstRoleV2Act, getInstRoleV2Act } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import AddEditRoleModal from "./AddEditRoleModal";
import { useModal } from "../../../../hooks/modalhook";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    roleTypeId: "",
}

const Role: React.FC<any> = ({ instituteId, instituteName }) => {

    const { closeModal: closeRoleModal, modalState: roleModalState, openModal: openRoleModal } = useModal();
    const { closeModal: closeDeleteRoleModal, modalState: deleteRoleModalState, openModal: openDeleteRoleModal } = useModal();
    const [filterState, setFilterState] = useState(initialValues);

    const dispatch = useAppDispatch();
    const { deleteInstRoleTypeResp, instInfoError, getInstRoleV2Resp, getInstRoleTypeV2Resp, addInstRoleV2Resp, updateInstRoleV2Resp, deleteInstRoleV2Resp, showApiLoader, } = useAppSelector(({ instituteInfo, globalData }) => ({
        deleteInstRoleTypeResp: instituteInfo.deleteInstRoleTypeResp,
        getInstRoleV2Resp: instituteInfo.getInstRoleV2Resp,
        getInstRoleTypeV2Resp: instituteInfo.getInstRoleTypeV2Resp,
        addInstRoleV2Resp: instituteInfo.addInstRoleV2Resp,
        updateInstRoleV2Resp: instituteInfo.updateInstRoleV2Resp,
        deleteInstRoleV2Resp: instituteInfo.deleteInstRoleV2Resp,
        showApiLoader: globalData.showApiLoader,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const departmentRespRef = useRef({
        prevDeleteInstRoleTypeResp: deleteInstRoleTypeResp,
        prevAddInstRoleV2Resp: addInstRoleV2Resp,
        prevUpdateInstRoleV2Resp: updateInstRoleV2Resp,
        prevDeleteInstRoleV2Resp: deleteInstRoleV2Resp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        if ( Array.isArray(getInstRoleTypeV2Resp) && getInstRoleTypeV2Resp.length > 0) {
            const { id } = getInstRoleTypeV2Resp[0] || {}
            getRoleApiCall({roleTypeId : id});
            setFilterState((prevState: any) => ({ ...prevState, roleTypeId: id }));
        }
    }, [getInstRoleTypeV2Resp]);

    useEffect(() => {

        const { prevDeleteInstRoleTypeResp, prevAddInstRoleV2Resp, prevUpdateInstRoleV2Resp, prevDeleteInstRoleV2Resp, prevInstInfoError } = departmentRespRef.current;
        if (deleteInstRoleTypeResp && prevDeleteInstRoleTypeResp !== deleteInstRoleTypeResp) {
            closeDeleteRoleModal()
            getRoleApiCall();
            toast.success("Role type deleted successfully.");
        }
        else if (addInstRoleV2Resp && prevAddInstRoleV2Resp !== addInstRoleV2Resp) {
            closeRoleModal()
            getRoleApiCall();
            toast.success("Role added successfully.");
        }
        else if (updateInstRoleV2Resp && prevUpdateInstRoleV2Resp !== updateInstRoleV2Resp) {
            closeRoleModal()
            getRoleApiCall();
            toast.success("Role updated successfully.");
        }
        else if (deleteInstRoleV2Resp && prevDeleteInstRoleV2Resp !== deleteInstRoleV2Resp) {
            getRoleApiCall();
            toast.success("Role deleted successfully.");
        }
        else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { message }: any = instInfoError;
            toast.error(message || "Something went wrong.");
        }

        departmentRespRef.current.prevDeleteInstRoleTypeResp = deleteInstRoleTypeResp;
        departmentRespRef.current.prevAddInstRoleV2Resp = addInstRoleV2Resp;
        departmentRespRef.current.prevUpdateInstRoleV2Resp = updateInstRoleV2Resp;
        departmentRespRef.current.prevDeleteInstRoleV2Resp = deleteInstRoleV2Resp;
        departmentRespRef.current.prevInstInfoError = instInfoError;

    }, [deleteInstRoleTypeResp, addInstRoleV2Resp, updateInstRoleV2Resp, deleteInstRoleV2Resp, instInfoError]);


    function editRoleTypeHndlr(event: any) {
        const roleId = event.currentTarget.getAttribute("data-id"),
            modalData: any = getInstRoleV2Resp.find((item: any) => item.roleId === (roleId));
        if (modalData) {
            openRoleModal(modalData)
        }
    }

    function deleteDepartmentHndlr(event: any) {
        const roleId = event.currentTarget.getAttribute("data-id"),
            modalData: any = getInstRoleV2Resp.find((item: any) => item.roleId === (roleId));
        if (modalData)
            openDeleteRoleModal(modalData)
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: editRoleTypeHndlr,
        },
        {
            id: "delete",
            actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
            actionName: "Delete",
            onClickHndlr: deleteDepartmentHndlr
        }]), [getInstRoleV2Resp]);

    function delModalSubmitHndlr() {
        const { modalData } = deleteRoleModalState;

        // if (modalData) {
        //     dispatch(deleteInstRoleV2Act(generateActionPayload("delete_inst_role_v2", undefined , {id: modalData})));
        // }
    }

    function getRoleApiCall(otherProps?: any) {
        const payload = {
            instituteId,...filterState, ...otherProps
        }
        dispatch(getInstRoleV2Act(generateActionPayload("get_inst_role_v2", undefined, payload)));
    }

    const onChangeRoleTypeHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getRoleApiCall({ [name]: value });
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions), [getInstRoleV2Resp]);

    return (
        <React.Fragment>
            <div className="tw-p-0">

                <div className="tw-px-3 tw-py-2">
                    <div className="tw-flex tw-flex-wrap tw-items-end tw-gap-3 tw-py-2">

                        <div className="tw-w-full lg:tw-w-2/12">
                            <SelectInput
                                name={`roleTypeId`}
                                value={filterState.roleTypeId}
                                formgroupClassName="tw-mb-0"
                                onChange={onChangeRoleTypeHndlr}
                                menuItems={getInstRoleTypeV2Resp}
                                labelText="Role Type"
                                floatingLabel
                                valueKey="id"
                                textKey="description"
                            />
                        </div>

                        <div className="tw-ml-auto">
                            <Button
                            variant="primary"
                                onClick={() => openRoleModal()}
                            >
                                Add Role
                            </Button>
                        </div>

                    </div>
                </div>

                <TableContainer
                    columns={roleColumns}
                    data={Array.isArray(getInstRoleV2Resp) ? getInstRoleV2Resp : []}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={false}
                />

            </div>
            <ModalContainerUpdated
                id="add-forms-admin"
                isOpen={roleModalState.showModal}
                toggle={closeRoleModal}
                modalTitle={roleModalState.modalData ? "Edit Role" : "Add Role"}
                modalSize="md"
            >
                <AddEditRoleModal
                    isOpen={roleModalState.showModal}
                    toggle={closeRoleModal}
                    instituteId={instituteId}
                    modalData={roleModalState.modalData}
                    roleType={getInstRoleTypeV2Resp}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-role-modal"
                isOpen={deleteRoleModalState.showModal}
                confirmMessage="Are you sure you want to delete this role ?"
                cancelHndlr={closeDeleteRoleModal}
                confirmHndlr={delModalSubmitHndlr}
                isDisble={showApiLoader}
                iconType="reject"
                showImgIcon={true}
            />
        </React.Fragment >
    )
}

export default Role;
import React, {  useMemo, useEffect, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";

//Modal Component
import AddEditRoleModal from "./AddEditRoleModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteInstRoleTypeV2Act, getInstRoleTypeV2Act } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";

//types
import { IRoleTypesProps } from "./roletypes";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import Button from "../../../../Components/Common/Button";

const RoleTypes: React.FC<IRoleTypesProps> = ({ instituteId, instituteName }) => {

    const { closeModal: closeRoleTypeModal, modalState: roleTypeModalState, openModal: openRoleTypeModal } = useModal();
    const { closeModal: closeDeleteRoleTypeModal, modalState: deleteRoleTypeModalState, openModal: openDeleteRoleTypeModal } = useModal();

    const dispatch = useAppDispatch();
    const { updateInstRoleTypeV2Resp, deleteInstRoleTypeV2Resp, instInfoError, getInstRoleTypeV2Resp, addInstRoleTypeV2Resp,showApiLoader } = useAppSelector(({ instituteInfo,globalData }) => ({
        deleteInstRoleTypeV2Resp: instituteInfo.deleteInstRoleTypeV2Resp,
        getInstRoleTypeV2Resp: instituteInfo.getInstRoleTypeV2Resp,
        addInstRoleTypeV2Resp: instituteInfo.addInstRoleTypeV2Resp,
        updateInstRoleTypeV2Resp: instituteInfo.updateInstRoleTypeV2Resp,
        showApiLoader: globalData.showApiLoader,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);

    const departmentRespRef = useRef({
        prevDeleteInstRoleTypeV2Resp: deleteInstRoleTypeV2Resp,
        prevAddInstRoleTypeV2Resp: addInstRoleTypeV2Resp,
        prevUpdateInstRoleTypeV2Resp: updateInstRoleTypeV2Resp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        if (instituteId) {
            getRoleTypeApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteInstRoleTypeV2Resp, prevAddInstRoleTypeV2Resp,prevUpdateInstRoleTypeV2Resp, prevInstInfoError } = departmentRespRef.current;
        if (deleteInstRoleTypeV2Resp && prevDeleteInstRoleTypeV2Resp !== deleteInstRoleTypeV2Resp) {
            closeDeleteRoleTypeModal()
            getRoleTypeApiCall();
            toast.success("Role type deleted successfully.");
        }
        else if (addInstRoleTypeV2Resp && prevAddInstRoleTypeV2Resp !== addInstRoleTypeV2Resp) {
            closeRoleTypeModal()
            getRoleTypeApiCall();
            toast.success("Role type created successfully.");
        }
        else if(updateInstRoleTypeV2Resp && prevUpdateInstRoleTypeV2Resp !== updateInstRoleTypeV2Resp){
            closeRoleTypeModal()
            getRoleTypeApiCall();
            toast.success("Role type updated successfully.");
        }
        else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { message }: any = instInfoError;
            toast.error(message || "Something went wrong.");
        }
        departmentRespRef.current.prevDeleteInstRoleTypeV2Resp = deleteInstRoleTypeV2Resp;
        departmentRespRef.current.prevAddInstRoleTypeV2Resp = addInstRoleTypeV2Resp;
        departmentRespRef.current.prevUpdateInstRoleTypeV2Resp = updateInstRoleTypeV2Resp;
        departmentRespRef.current.prevInstInfoError = instInfoError;
    }, [deleteInstRoleTypeV2Resp, addInstRoleTypeV2Resp,updateInstRoleTypeV2Resp, instInfoError]);

    function editRoleTypeHndlr(event: any) {
        const id = event.currentTarget.getAttribute("data-id"),
            modalData: any = getInstRoleTypeV2Resp.find((item: any) => item.id === id);
        if (modalData) {
            openRoleTypeModal(modalData)
        }
    }

    function deleteDepartmentHndlr(event: any) {
        const roleId = event.currentTarget.getAttribute("data-id")
        if (roleId)
            openDeleteRoleTypeModal(roleId)
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
        }]), [getInstRoleTypeV2Resp]);

    function delModalSubmitHndlr() {
        // const { modalData } = deleteRoleTypeModalState;
        //     dispatch(deleteInstRoleTypeV2Act(generateActionPayload("delete_inst_role_type_v2",undefined, { id: modalData })));
    }

    function getRoleTypeApiCall() {
        dispatch(getInstRoleTypeV2Act(generateActionPayload("get_inst_role_type_v2")));
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions), [getInstRoleTypeV2Resp])
    return (
        <React.Fragment>
            <div className="tw-p-0">

                <div className="tw-px-3 tw-py-2">
                    <div className="tw-flex tw-gap-3">

                        <div className="tw-ml-auto">
                            <Button
                            variant="primary"
                                onClick={() => openRoleTypeModal()}
                            >
                                Add Role Type
                            </Button>
                        </div>

                    </div>
                </div>

                <TableContainer
                    columns={roleColumns}
                    data={Array.isArray(getInstRoleTypeV2Resp) ? getInstRoleTypeV2Resp : []}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={false}
                />

            </div>

            <ModalContainerUpdated
                id="add-forms-admin"
                isOpen={roleTypeModalState.showModal}
                toggle={closeRoleTypeModal}
                modalTitle={roleTypeModalState.modalData ? "Edit Role Type" : "Add Role Type"}
                modalSize="md"
            >
                <AddEditRoleModal
                    isOpen={roleTypeModalState.showModal}
                    toggle={closeRoleTypeModal}
                    roleTypeId={roleTypeModalState.modalData?.id}
                    instituteId={instituteId}
                    modalData={roleTypeModalState.modalData}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-role-modal"
                isOpen={deleteRoleTypeModalState.showModal}
                confirmMessage="Are you sure you want to delete this role ?"
                cancelHndlr={closeDeleteRoleTypeModal}
                confirmHndlr={delModalSubmitHndlr}
                isDisble={showApiLoader}
                iconType="reject"
                showImgIcon={true}
            />
        </React.Fragment >
    )
}

export default RoleTypes;
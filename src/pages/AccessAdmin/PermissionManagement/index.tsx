import React, { useMemo, useEffect, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";

//Modal Component
import AddEditPermissionModal from "./AddEditPermissionModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { deleteInstRoleTypeV2Act, getInstRoleTypeV2Act } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

//types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { useModal } from "../../../hooks/modalhook";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getPermssionAct, getRoleTypesAct } from "../../../store/accessmanagement/accessmanagementaction";
import { searhWithTextInList } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";

export interface IPermissionTypes {
    id: string,
    code: string,
    description: string
}

const RoleTypes: React.FC = () => {
    const [permissionState, setPermissionState] = useState<IPermissionTypes[]>([]);
    const [filterState, setFilterState] = useState({ searchString: "" });
    const { closeModal: closeRoleTypeModal, modalState: roleTypeModalState, openModal: openRoleTypeModal } = useModal();
    const { closeModal: closeDeleteRoleTypeModal, modalState: deleteRoleTypeModalState, openModal: openDeleteRoleTypeModal } = useModal();
    const searchStringRef = useRef("");
    const dispatch = useAppDispatch();
    const { deletePermissionResp, accessManagementErrorResp, permissionsListResp, showApiLoader } =
        useAppSelector(({ accessManagement, globalData }) => ({
            permissionsListResp: accessManagement.permissionsListResp,
            deletePermissionResp: accessManagement.deletePermissionResp,
            showApiLoader: globalData.showApiLoader,
            accessManagementErrorResp: accessManagement.accessManagementErrorResp
        }), shallowEqual);

    const departmentRespRef = useRef({
        prevPermissionsListResp: permissionsListResp,
        prevDeletePermissionResp: deletePermissionResp,
        prevAccessManagementErrorResp: accessManagementErrorResp
    });

    useEffect(() => {
        getPermissionsApiCall();
    }, []);

    useEffect(() => {
        const { prevPermissionsListResp, prevDeletePermissionResp, prevAccessManagementErrorResp } = departmentRespRef.current;
        if (permissionsListResp && prevPermissionsListResp !== permissionsListResp) {
            const filterData = searhWithTextInList(permissionsListResp, "description", searchStringRef.current);
            setPermissionState(filterData);
        }
        else if (deletePermissionResp && prevDeletePermissionResp !== deletePermissionResp) {
            closeDeleteRoleTypeModal()
            getPermissionsApiCall();
            toast.success("Permission deleted successfully.");
        }
        else if (accessManagementErrorResp && accessManagementErrorResp !== prevAccessManagementErrorResp) {
            const { message }: any = accessManagementErrorResp;
            toast.error(message || "Something went wrong.");
        }
        departmentRespRef.current.prevPermissionsListResp = permissionsListResp;
        departmentRespRef.current.prevDeletePermissionResp = deletePermissionResp;
        departmentRespRef.current.prevAccessManagementErrorResp = accessManagementErrorResp;
    }, [searchStringRef, permissionsListResp, deletePermissionResp, accessManagementErrorResp]);

    function editRoleTypeHndlr(event: any) {
        const id = event.currentTarget.getAttribute("data-id"),
            modalData: any = permissionsListResp.find((item: any) => item.id === id);
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
        }]), [permissionsListResp]);

    function delModalSubmitHndlr() {
        // const { modalData } = deleteRoleTypeModalState;
        //     dispatch(deleteInstRoleTypeV2Act(generateActionPayload("delete_inst_role_type_v2",undefined, { id: modalData })));
    }

    function getPermissionsApiCall() {
        dispatch(getPermssionAct(generateActionPayload("get_permissions")));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }))
        searchStringRef.current = value;
        const filterData = searhWithTextInList(permissionsListResp, "description", value);
        setPermissionState(filterData);
    }

    function closeRoleModalHndlr(apiCall?: boolean) {
        if (typeof apiCall === 'boolean' && apiCall) {
            getPermissionsApiCall();
        }
        closeRoleTypeModal();
    }

    const permissionColumns = useMemo(() => generateColumns(menuOptions), [permissionsListResp])
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                <BreadCrumb pageTitle="Digital Caampus" />
                <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mt-4">
                    <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-px-6 tw-py-4">
                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                            Permissions
                        </h4>
                    </div>
                    <div className="tw-p-0">
                        <div className="tw-px-6 tw-py-4">
                            <div className="tw-flex tw-flex-wrap tw-gap-4 tw-items-center">
                                <div className="tw-w-full md:tw-w-1/3">
                                    <TextIconInput
                                        formgroupClassName="tw-relative search-box"
                                        name="searchString"
                                        value={filterState.searchString}
                                        placeHolder="Search..."
                                        onChange={onChangeFilterHndlr}
                                    >
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                                    </TextIconInput>
                                </div>
                                <div className="tw-ml-auto">
                                    <Button
                                        onClick={() => openRoleTypeModal()}
                                        variant="primary"
                                    >
                                        Add Permission
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={permissionColumns}
                            data={Array.isArray(permissionState) ? permissionState : []}
                            divClass="tw-overflow-x-auto"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={false}
                        />
                    </div>
                </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-forms-admin"
                isOpen={roleTypeModalState.showModal}
                toggle={closeRoleTypeModal}
                modalTitle={roleTypeModalState.modalData ? "Edit Permission" : "Add Permission"}
                modalSize="md"
            >
                <AddEditPermissionModal
                    isOpen={roleTypeModalState.showModal}
                    toggle={closeRoleModalHndlr}
                    roleTypeId={roleTypeModalState.modalData?.id}
                    modalData={roleTypeModalState.modalData}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-permission-modal"
                isOpen={deleteRoleTypeModalState.showModal}
                confirmMessage="Are you sure you want to delete this permission ?"
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
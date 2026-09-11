import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
// import { Card, CardHeader, CardBody, Row, Col, Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { ConfirmationModal, TextInput, ModalContainer, ModalContainerUpdated, TextIconInput } from "../../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
// import AddClassModal from "./AddClassModal";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getRoleTypeUsersAct, deleteRoleTypeUserAct } from "../../../../store/usermanagement/usermanagementactions";
import { setLoginActivityForUserDetailsAct } from "../../../../store/appdata/appdataactions";

//Common Utility
import { getSortingKeys } from "../../../../utility/commonutility";
//Constants
import { roleTypes } from "../../../../Components/constants/common";

//Interface & Types
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

//Component
import ChangePassword from "./ChangePassword";
import EditUserDetails from "./EditUserDetails";
import DeactivateAccount from "./DeactivateAccount";
import { useHistory } from "react-router-dom";

const Administrator: React.FC<any> = ({ instituteId, instituteName }) => {
    const [editUserModalState, setEditUserModalState] = useState<any>({
        showModal: false, userId: "", modalData: undefined
    });
    const [changePwdModalState, setChangePwdModalState] = useState({
        showModal: false,
        userIds: undefined
    });
    const [deactivateModalState, setDeactivateModalState] = useState({
        showModal: false,
        userIds: undefined, userEnabled: undefined
    });
    const [delUserModalState, setDelUserModalState] = useState<any>({
        showModal: false,
        userId: ""
    })
    const [filterState, setFilterState] = useState<any>({
        searchString: undefined
    });
    const history = useHistory();
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingDetailRef = useRef<any>(undefined);


    const dispatch = useAppDispatch();
    const { getRoleTypeUsersResp, deleteRoleTypeUserResp, userManagementErrorResp } = useAppSelector(({ userManagement }) => ({
        getRoleTypeUsersResp: userManagement.getRoleTypeUsersResp,
        deleteRoleTypeUserResp: userManagement.deleteRoleTypeUserResp,
        userManagementErrorResp: userManagement.userManagementErrorResp
    }), shallowEqual);

    const userManagementRespRef = useRef<any>({
        prevDeleteRoleTypeUserResp: deleteRoleTypeUserResp,
        prevUserManagementErrorResp: userManagementErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getUserApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteRoleTypeUserResp, prevUserManagementErrorResp } = userManagementRespRef.current;
        if (deleteRoleTypeUserResp && prevDeleteRoleTypeUserResp !== deleteRoleTypeUserResp) {
            setDelUserModalState((prevState: any) => ({ ...prevState, showModal: false }));
            getUserApiCall();
            toast.success("User deleted successfully.")
        } else if (userManagementErrorResp && userManagementErrorResp !== prevUserManagementErrorResp) {
            const { details }: any = userManagementErrorResp;
            toast.error(details);
        }
        userManagementRespRef.current.prevDeleteRoleTypeUserResp = deleteRoleTypeUserResp;
        userManagementRespRef.current.prevUserManagementErrorResp = userManagementErrorResp;
    }, [deleteRoleTypeUserResp, userManagementErrorResp]);

    const toggleEditUserModal = useCallback((apiCall?: boolean) => {
        setEditUserModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }));
        if (typeof (apiCall) === "boolean" && apiCall) {
            getUserApiCall();
        }
    }, [instituteId, getRoleTypeUsersResp]);


    const toggleChangePwdHandler = useCallback((apiCall?: boolean) => {
        setChangePwdModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getUserApiCall();
        }
    }, [instituteId, getRoleTypeUsersResp]);


    const toggleDeactivateHandler = useCallback((apiCall?: boolean) => {
        setDeactivateModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getUserApiCall();
        }
    }, [instituteId, getRoleTypeUsersResp]);


    function addClassHndlr() {
        setEditUserModalState((prevState: any) => ({ ...prevState, showModal: true, userId: "", modalData: undefined }));
    }

    function editUserHndlr(event: any) {
        const userId = Number(event.currentTarget.getAttribute("data-id")),
            modalData: any = getRoleTypeUsersResp?.data.find((item: any) => item.id === Number(userId));
        if (modalData) {
            setEditUserModalState((prevState: any) => ({ ...prevState, showModal: true, userId, modalData }));
        }
    }

    function deleteUserHndlr(event: any) {
        const userId = event.currentTarget.getAttribute("data-id");
        if (userId)
            setDelUserModalState((prevState: any) => ({ ...prevState, showModal: true, userId }));
    }

    function changePwdHandler(event: any) {
        const userId = Number(event.currentTarget.getAttribute("data-id"));
        if (userId) {
            setChangePwdModalState((prevState: any) => ({
                ...prevState,
                showModal: true,
                userIds: [userId],

            }))
        }
    }

    function deactivateHandler(event: any) {
        const userId = Number(event.currentTarget.getAttribute("data-id")),
            { enabled } = getRoleTypeUsersResp?.data.find((item: any) => item.id === Number(userId)) || {};
        if (typeof enabled === "boolean") {
            setDeactivateModalState((prevState: any) => ({
                ...prevState, showModal: true, userIds: [userId],
                userEnabled: enabled
            }))
        }
    }

    function loginActivityHandler(event: any) {
        const userId = Number(event.currentTarget.getAttribute("data-id")),
            userDetails = getRoleTypeUsersResp?.data.find((item: any) => item.id === Number(userId)) || {};
        if (userDetails) {
            const { id, role } = userDetails, { roleType } = role || {};
            if (id && roleType) {
                dispatch(setLoginActivityForUserDetailsAct({ userId: id, roleType }));
                history.push(`general-settings/login-activity/${userId}`)
            }
        }
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="ri-pencil-fill tw-text-blue-500 tw-text-lg tw-mr-2"></i>,
            actionName: "Edit",
            onClickHndlr: editUserHndlr,
        },
        {
            id: "change-password",
            actionIcon: <i className="ri-door-lock-line tw-text-orange-500 tw-text-lg tw-mr-2"></i>,
            actionName: "Change Password",
            onClickHndlr: changePwdHandler
        },
        {
            id: "deactivate-user",
            actionIcon: <i className="ri-user-unfollow-fill tw-text-red-500 tw-text-lg tw-mr-2"></i>,
            actionName: "Deactivate Account",
            onClickHndlr: deactivateHandler
        },
        {
            id: "activate-user",
            actionIcon: <i className="ri-user-follow-fill tw-text-green-500 tw-text-lg tw-mr-2"></i>,
            actionName: "Activate Account",
            onClickHndlr: deactivateHandler
        },
        {
            id: "login-activities",
            actionIcon: <i className="ri-shield-user-line tw-text-indigo-500 tw-text-lg tw-mr-2"></i>,
            actionName: "Login Activities",
            onClickHndlr: loginActivityHandler
        },
        {
            id: "delete",
            actionIcon: <i className="ri-delete-bin-5-fill tw-text-red-500 tw-text-lg tw-mr-2"></i>,
            actionName: "Delete",
            onClickHndlr: deleteUserHndlr
        }
    ]), [getRoleTypeUsersResp]);

    function delModalCancelHndlr() {
        setDelUserModalState((prevState: any) => ({ ...prevState, showModal: false, userId: "" }));
    }
    function delModalSubmitHndlr() {
        const { userId } = delUserModalState,
            params = {
                userId,
                roleType: roleTypes.BRANCH
            };
        dispatch(deleteRoleTypeUserAct(generateActionPayload("del_role_type_user", params)));
    }
    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getUserApiCall();
    }

    function getUserApiCall(otherProps?: any) {
        const { pageNo, pageSize } = paginationDetailRef.current || {};
        const sortingParams = getSortingKeys(sortingDetailRef.current);
        const payload = {
            ...filterState, ...otherProps,
            pageNo: (Number(pageNo) + 1), pageSize: pageSize, isPageable: true,
            ...sortingParams
        };
        const params = {
            roleType: roleTypes.BRANCH
        }
        dispatch(getRoleTypeUsersAct(generateActionPayload("get_role_type_users", params, payload)));
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getUserApiCall({ [name]: value });
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
            sortingDetailRef.current = sortingKeys;
            getUserApiCall();
            //Testing
        } else {
            sortingDetailRef.current = sortingKeys;
        }
    }

    const userColumns = useMemo(() => generateColumns(menuOptions), [getRoleTypeUsersResp]),
        { data: branchAdminList, pageNumber, totalPages, totalElements } = getRoleTypeUsersResp || {};
    return (
        <React.Fragment>
            {/* <Card> */}
            {/* <CardHeader>
                    <h4 className="card-title mb-0 flex-grow-1">Administrators</h4>
                </CardHeader> */}
            <div className="tw-p-0">
                <div className="tw-py-4 tw-px-6">
                    <form onClick={e => e.preventDefault()}>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                            <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4">
                                <div className="tw-relative search-box">
                                    <TextIconInput
                                        formgroupClassName="search-box"
                                        name="searchString"
                                        value={filterState.searchString}
                                        placeHolder="Search by Admin Name"
                                        onChange={onChangeFilterHndlr}
                                    ><i className="ri-search-line search-icon"></i></TextIconInput>
                                </div>
                            </div>
                            {/* <div className="ms-auto col-auto">
                                    <button className="btn btn-soft-success me-2" onClick={addClassHndlr}>Change Password</button>
                                    <button className="btn btn-soft-danger" onClick={addClassHndlr}>Deactivate Account</button>
                                </div> */}
                        </div>
                    </form>
                </div>
                <div className="tw-mt-2">
                    <TableContainer
                        columns={userColumns || []}
                        data={Array.isArray(branchAdminList) ? branchAdminList : []}
                        divClass="table-responsive tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                        manualSorting={true}
                        sortingHandler={sortingHandler}
                    />
                </div>
            </div>
            {/* </Card> */}
            <ModalContainerUpdated
                id="change-password-admin"
                isOpen={changePwdModalState.showModal}
                toggle={toggleChangePwdHandler}
                modalTitle={"Change Password"}
                modalSize="md"
            >
            <ChangePassword
                isOpen={changePwdModalState.showModal}
                toggle={toggleChangePwdHandler}
                userIds={changePwdModalState.userIds}
            />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="edit-user-details"
                isOpen={editUserModalState.showModal}
                toggle={toggleEditUserModal}
                modalTitle={"Update User"}
                modalSize="lg"
            >
            <EditUserDetails
                isOpen={editUserModalState.showModal}
                toggle={toggleEditUserModal}
                instituteId={instituteId}
                userId={editUserModalState.userId}
                branchId={editUserModalState.branchId}
                editUserDetails={editUserModalState.modalData}
            />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="deactivate-account-admin"
                isOpen={deactivateModalState.showModal}
                toggle={toggleDeactivateHandler}
                // modalTitle={"Change Password"}
                modalSize="md"
                hideHeader={true}
            >
            <DeactivateAccount
                isOpen={deactivateModalState.showModal}
                toggle={toggleDeactivateHandler}
                userIds={deactivateModalState.userIds}
                isUserActive={deactivateModalState.userEnabled}
            />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delUserModalState.showModal}
                confirmMessage="Are you sure you want to delete this Branch Admin?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default Administrator;
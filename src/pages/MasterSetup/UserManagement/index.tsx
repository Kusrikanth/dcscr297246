import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { TextInput } from "../../../Components/Common";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainer } from "../../../Components/Common";
import { generateColumns } from "./helper";

//Modal Component
// import AddClassModal from "./AddClassModal";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getRoleTypeUsersAct, deleteRoleTypeUserAct } from "../../../store/usermanagement/usermanagementactions";
import { setLoginActivityForUserDetailsAct } from "../../../store/appdata/appdataactions";

//Common Utility
import { getSortingKeys } from "../../../utility/commonutility";
//Constants
import { roleTypes } from "../../../Components/constants/common";

//Interface & Types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";

//Component
import ChangePassword from "./ChangePassword";
import EditUserDetails from "./EditUserDetails";
import DeactivateAccount from "./DeactivateAccount";
import { useHistory } from "react-router-dom";

const UserManagement: React.FC<any> = ({ instituteId, instituteName }) => {
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
            actionIcon: <i className="tw-text-blue-500 ri-pencil-fill tw-text-base tw-mr-2"></i>,
            actionName: "Edit",
            onClickHndlr: editUserHndlr,
        },
        {
            id: "change-password",
            actionIcon: <i className="tw-text-orange-500 ri-door-lock-line tw-text-base tw-mr-2"></i>,
            actionName: "Change Password",
            onClickHndlr: changePwdHandler
        },
        {
            id: "deactivate-user",
            actionIcon: <i className="tw-text-yellow-500 ri-user-unfollow-fill tw-text-base tw-mr-2"></i>,
            actionName: "Deactivate Account",
            onClickHndlr: deactivateHandler
        },
        {
            id: "activate-user",
            actionIcon: <i className="tw-text-green-500 ri-user-follow-fill tw-text-base tw-mr-2"></i>,
            actionName: "Activate Account",
            onClickHndlr: deactivateHandler
        },
        {
            id: "login-activities",
            actionIcon: <i className="tw-text-indigo-500 ri-shield-user-line tw-text-base tw-mr-2"></i>,
            actionName: "Login Activities",
            onClickHndlr: loginActivityHandler
        },
        {
            id: "delete",
            actionIcon: <i className="tw-text-red-500 ri-delete-bin-5-fill tw-text-base tw-mr-2"></i>,
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
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200">
                <div className="tw-bg-gray-50 tw-rounded-t-lg tw-border-b tw-border-gray-200 tw-px-6 tw-py-4">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Administrators</h4>
                </div>
                <div className="tw-p-0">
                    <div className="tw-py-4 tw-px-6">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12">
                                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-5">
                                    <div className="tw-relative search-box">
                                        <TextInput
                                            name="searchString"
                                            value={filterState.searchString}
                                            placeHolder="Search by Admin Name"
                                            onChange={onChangeFilterHndlr}
                                            labelText="Search by Admin Name"
                                            formgroupClassName="tw-mb-0"
                                        />
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-[30px] tw-text-gray-400"></i>
                                    </div>
                                </div>
                                {/* <div className="ms-auto col-auto">
                                    <button className="btn btn-soft-success me-2" onClick={addClassHndlr}>Change Password</button>
                                    <button className="btn btn-soft-danger" onClick={addClassHndlr}>Deactivate Account</button>
                                </div> */}
                            </div>
                        </form>
                    </div>
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
            <ChangePassword
                isOpen={changePwdModalState.showModal}
                toggle={toggleChangePwdHandler}
                userIds={changePwdModalState.userIds}
            />
            <EditUserDetails
                isOpen={editUserModalState.showModal}
                toggle={toggleEditUserModal}
                modalTitle={"Add Branch Admin"}
                instituteId={instituteId}
                userId={editUserModalState.userId}
                branchId={editUserModalState.branchId}
                editUserDetails={editUserModalState.modalData}
            />
            <DeactivateAccount
                isOpen={deactivateModalState.showModal}
                toggle={toggleDeactivateHandler}
                userIds={deactivateModalState.userIds}
                isUserActive={deactivateModalState.userEnabled}
            />

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

export default UserManagement;
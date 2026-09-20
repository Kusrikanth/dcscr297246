import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useFormik } from "formik";
import {
  CreateStudentAccModalType,
  ManageStudentFilterProps,
  UserDetailsProps,
} from "../ManageUserTypes";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import {
  generateColumns,
} from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";

//Common Component
import { ConfirmationModal, TextIconInput, ModalContainer } from "../../../../Components/Common";

//ModalContainer
import CreateParentAccModal from "./CreateParentAccModal";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getRoleTypeUsersAct, deleteRoleTypeUserAct } from "../../../../store/usermanagement/usermanagementactions";
import { setLoginActivityForUserDetailsAct } from "../../../../store/appdata/appdataactions";

//Constants
import { roleTypes } from "../../../../Components/constants/common";

//Action Modals
import ChangePassword from "../ActionModals/ChangePassword";
import DeactivateAccount from "../ActionModals/DeactivateAccount";
import { useChangeUsername } from "../ActionModals/ChangeUsername";
import { USE_SAMPLE_MANAGE_USERS, sampleParentUsers } from "../helper";
//Common Utility
import { getSortingKeys } from "../../../../utility/commonutility";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard, ResetPasswordStrokeStandard,
  ShieldUserStrokeStandard, UserLock01StrokeStandard, UserUnlock01StrokeStandard
} from "@hugeicons-pro/core-stroke-standard";


const initialValues: any = {
  search: "",
  class: "Class",
  section: "",
  status: "",
};

const Employees = ({ instituteId, branchId, showCreateUserModal, closeModalHndlr }: any) => {
  const history = useHistory();
  const [parentFilterState, setParentFilterState] =
    useState<any>({ searchString: "" });
  const [createParentModalState, setCreateParentModalState] =
    useState<any>({
      showModal: false,
      modalData: undefined
    });
  const [delUserModalState, setDelUserModalState] = useState<any>({
    showModal: false,
    userId: ""
  });
  const [changePwdModalState, setChangePwdModalState] = useState({
    showModal: false,
    userIds: undefined
  });
  const [deactivateModalState, setDeactivateModalState] = useState({
    showModal: false,
    userIds: undefined, userEnabled: undefined
  });
  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });
  const sortingDetailRef = useRef<any>(undefined);

  const dispatch = useDispatch(),
    { getRoleTypeUsersResp, deleteRoleTypeUserResp, userManagementErrorResp } = useAppSelector(({ userManagement }) => ({
      getRoleTypeUsersResp: userManagement.getRoleTypeUsersResp,
      deleteRoleTypeUserResp: userManagement.deleteRoleTypeUserResp,
      userManagementErrorResp: userManagement.userManagementErrorResp,
    }), shallowEqual);

  //Sample rows, used while the manage user API is not reachable in this environment.
  const useSampleUsers = USE_SAMPLE_MANAGE_USERS &&
    !(Array.isArray(getRoleTypeUsersResp?.data) && getRoleTypeUsersResp?.data.length > 0);
  const usersListData = useSampleUsers ? sampleParentUsers : getRoleTypeUsersResp?.data;

  //Change Username (Rename / Merge with Existing / Split) actions
  const changeUsername = useChangeUsername({ usersList: usersListData });

  const createEmployeeRespRef = useRef<any>({
    prevDeleteRoleTypeUserResp: deleteRoleTypeUserResp,
    prevUserManagementErrorResp: userManagementErrorResp,
  });
  useEffect(() => {
    const { prevUserManagementErrorResp, prevDeleteRoleTypeUserResp } = createEmployeeRespRef.current;
    if (deleteRoleTypeUserResp && prevDeleteRoleTypeUserResp !== deleteRoleTypeUserResp) {
      setDelUserModalState((prevState: any) => ({ ...prevState, showModal: false }));
      getParetnApiCall();
      toast.success("Parent user id deleted successfully.")
    } else if (!USE_SAMPLE_MANAGE_USERS && userManagementErrorResp && prevUserManagementErrorResp !== userManagementErrorResp) {
      const { message, details } = userManagementErrorResp;
      toast.error(message || details);
    }
    createEmployeeRespRef.current.prevDeleteRoleTypeUserResp = deleteRoleTypeUserResp;
    createEmployeeRespRef.current.prevUserManagementErrorResp = userManagementErrorResp;
  }, [deleteRoleTypeUserResp, userManagementErrorResp]);


  useEffect(() => {
    if (showCreateUserModal) {
      setCreateParentModalState((prevState: any) => ({ ...prevState, showModal: true, modalData: undefined }));
    }
  }, [showCreateUserModal]);

  //Login Activty Page Redirection
  function loginActivityHandler(event: any) {
    const userId = Number(event.currentTarget.getAttribute("data-id")),
      userDetails = getRoleTypeUsersResp?.data.find((item: any) => item.id === Number(userId)) || {};
    if (userDetails) {
      const { id, role } = userDetails, { roleType } = role || {};
      if (id && roleType) {
        dispatch(setLoginActivityForUserDetailsAct({ userId: id, roleType }));
        history.push(`manage-user/login-activity/${userId}`)
      }
    }
  }

  function deleteUserHndlr(event: any) {
    const userId = event.currentTarget.getAttribute("data-id");
    if (userId)
      setDelUserModalState((prevState: any) => ({ ...prevState, showModal: true, userId }));
  }

  function changePwdHandler(event: any) {
    const userId = Number(event.currentTarget.getAttribute("data-id"));
    setChangePwdModalState((prevState: any) => ({
      ...prevState,
      showModal: true,
      userIds: [userId],
    }))
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

  const menuOptions = useMemo(() => [
    {
      id: "change-password",
      actionIcon: <HugeiconsIcon
        icon={ResetPasswordStrokeStandard}
        className="tw-mr-2 tw-text-gray-500" size={18} />,
      actionName: "Change Password",
      onClickHndlr: changePwdHandler
    },
    changeUsername.menuOption,
    {
      id: "deactivate-user",
      actionIcon: <HugeiconsIcon
        icon={UserLock01StrokeStandard}
        className="tw-mr-2 tw-text-gray-500" size={18} />,
      actionName: "Deactivate Account",
      onClickHndlr: deactivateHandler
    },
    {
      id: "activate-user",
      actionIcon: <HugeiconsIcon icon={UserUnlock01StrokeStandard}
        className=" tw-text-gray-500 tw-mr-2" size={18} />,
      actionName: "Activate Account",
      onClickHndlr: deactivateHandler
    },
    {
      id: "login-activities",
      actionIcon: <HugeiconsIcon icon={ShieldUserStrokeStandard}
        className=" tw-text-gray-500 align-bottom tw-mr-2" size={18} />,
      actionName: "Login Activities",
      onClickHndlr: loginActivityHandler
    }, {
      id: "delete",
      actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500 tw-mr-2" size={18} />,
      actionName: "Delete",
      onClickHndlr: deleteUserHndlr
    },
  ], [getRoleTypeUsersResp, changeUsername.menuOption]);

  useEffect(() => {
    getParetnApiCall();
  }, [])
  const EmployeeFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: parentFilterState,
    onSubmit: (values) => { },
  });

  const toggleCreateParentHndlr = useCallback((apiCall?: boolean) => {
    setCreateParentModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      // <embed src="" type="" />();
      getParetnApiCall();
    }
    closeModalHndlr();
  }, [instituteId, getRoleTypeUsersResp]);

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getParetnApiCall();
  }

  //Delete Modal Handlers
  function delModalCancelHndlr() {
    setDelUserModalState((prevState: any) => ({ ...prevState, showModal: false, userId: "" }));
  }
  function delModalSubmitHndlr() {
    const { userId } = delUserModalState,
      params = {
        userId,
        roleType: roleTypes.PARENT
      };
    dispatch(deleteRoleTypeUserAct(generateActionPayload("del_role_type_user", params)));
  }
  //Delete Modal Handlers

  //Change Password Modal Handlers
  const toggleChangePwdHandler = useCallback((apiCall?: boolean) => {
    setChangePwdModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getParetnApiCall();
    }
  }, [instituteId, getRoleTypeUsersResp]);


  //Deactivate User Modal Handlers
  const toggleDeactivateHandler = useCallback((apiCall?: boolean) => {
    setDeactivateModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getParetnApiCall();
    }
  }, [instituteId, getRoleTypeUsersResp]);

  function getParetnApiCall(otherProps?: any) {
    const { pageNo, pageSize } = paginationDetailRef.current || {};
    const sortingParams = getSortingKeys(sortingDetailRef.current);
    const payload = {
      ...parentFilterState, ...otherProps, pageNo: pageNo,
      pageSize: pageSize, isPageable: true, ...sortingParams
    };
    dispatch(getRoleTypeUsersAct(generateActionPayload("get_role_type_users", { roleType: roleTypes.PARENT }, payload)));
  }

  function sortingHandler(sortingKeys: any) {
    if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
      sortingDetailRef.current = sortingKeys;
      getParetnApiCall();
      //Testing
    } else {
      sortingDetailRef.current = sortingKeys;
    }
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setParentFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getParetnApiCall({ [name]: value });
  }

  const { data: employeeData, totalElements, pageNumber, totalPages } = getRoleTypeUsersResp || {};
  const roleColumns = useMemo(() => generateColumns(menuOptions), [getRoleTypeUsersResp, menuOptions]);
  return (
    <>
      <div className="tw-w-full">

        <form
          onSubmit={EmployeeFilterForm.handleSubmit}
          className="tw-px-4 tw-py-4"
        >
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  value={parentFilterState.searchString}
                  onChange={onChangeFilterHndlr}
                  formgroupClassName="tw-mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
        </form>
        <TableContainer
          columns={roleColumns || []}
          data={changeUsername.applyUsernameChanges(usersListData || [])}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          showPagination={true}
          totalPages={useSampleUsers ? 1 : totalPages}
          totalRecords={useSampleUsers ? sampleParentUsers.length : totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={useSampleUsers ? 0 : pageNumber}
          manualSorting={true}
          sortingHandler={sortingHandler}
        />
      </div>
      <ModalContainerUpdated
        id="create-parent-modal"
        isOpen={createParentModalState.showModal}
        toggle={toggleCreateParentHndlr}
        modalTitle="Create Parent Account"
        modalSize="lg"
      >
        <CreateParentAccModal
          isOpen={createParentModalState.showModal}
          toggle={toggleCreateParentHndlr}
          modalTitle="Create Parent Account"
          instituteId={instituteId}
          branchId={branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-newPassword-parent-modal"
        isOpen={changePwdModalState.showModal}
        toggle={toggleChangePwdHandler}
        modalTitle="Change Password"
        modalSize="md"
      >
        <ChangePassword
          isOpen={changePwdModalState.showModal}
          toggle={toggleChangePwdHandler}
          userIds={changePwdModalState.userIds}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="deactivate-parent-modal"
        hideHeader={true}
        isOpen={deactivateModalState.showModal}
        toggle={toggleDeactivateHandler}
        modalTitle="Change Password"
        modalSize="md"
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
        confirmMessage="Are you sure you want to delete this login id for parent?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
      {changeUsername.modals}
    </>
  );
};

export default Employees;

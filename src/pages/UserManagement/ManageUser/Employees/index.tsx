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
import CreateEmployeeAccModal from "./CreateEmployeeAccModal";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getRoleTypeUsersAct, deleteRoleTypeUserAct } from "../../../../store/usermanagement/usermanagementactions";
import { setLoginActivityForUserDetailsAct } from "../../../../store/appdata/appdataactions";

//Constants
import { roleTypes } from "../../../../Components/constants/common";

//Action Modals
import ChangePassword from "../ActionModals/ChangePassword";
import DeactivateAccount from "../ActionModals/DeactivateAccount";

//Common Utility
import { getSortingKeys } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  ResetPasswordStrokeStandard, ShieldUserStrokeStandard,
  UserLock01StrokeStandard, UserUnlock01StrokeStandard
} from "@hugeicons-pro/core-stroke-standard";

const initialValues: any = {
  search: "",
  class: "Class",
  section: "",
  status: "",
};

const Employees = ({ instituteId, branchId, showCreateUserModal, closeModalHndlr }: any) => {
  const history = useHistory();
  const [employeeFilterState, setEmployeeFilterState] =
    useState<any>({ searchString: "" });
  const [createEmployeeModalState, setCreateEmployeeModalState] =
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
  const [applyFilter, setApplyFilter] = useState<boolean>(false);
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

  const createEmployeeRespRef = useRef<any>({
    prevDeleteRoleTypeUserResp: deleteRoleTypeUserResp,
    prevUserManagementErrorResp: userManagementErrorResp,
  });
  useEffect(() => {
    const { prevUserManagementErrorResp, prevDeleteRoleTypeUserResp } = createEmployeeRespRef.current;
    if (deleteRoleTypeUserResp && prevDeleteRoleTypeUserResp !== deleteRoleTypeUserResp) {
      setDelUserModalState((prevState: any) => ({ ...prevState, showModal: false }));
      getEmployeeApiCall();
      toast.success("Employee user id deleted successfully.")
    } else if (userManagementErrorResp && prevUserManagementErrorResp !== userManagementErrorResp) {
      const { message, details } = userManagementErrorResp;
      toast.error(message || details);
    }
    createEmployeeRespRef.current.prevDeleteRoleTypeUserResp = deleteRoleTypeUserResp;
    createEmployeeRespRef.current.prevUserManagementErrorResp = userManagementErrorResp;
  }, [deleteRoleTypeUserResp, userManagementErrorResp]);


  useEffect(() => {
    if (showCreateUserModal) {
      setCreateEmployeeModalState((prevState: any) => ({ ...prevState, showModal: true, modalData: undefined }));
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
      actionIcon: <HugeiconsIcon icon={ResetPasswordStrokeStandard} className="tw-mr-2 tw-text-gray-500" size={18} />,
      actionName: "Change Password",
      onClickHndlr: changePwdHandler
    },
    {
      id: "deactivate-user",
      actionIcon: <HugeiconsIcon icon={UserLock01StrokeStandard} className="tw-mr-2 tw-text-gray-500" size={18} />,
      actionName: "Deactivate Account",
      onClickHndlr: deactivateHandler
    },
    {
      id: "activate-user",
      actionIcon: <HugeiconsIcon icon={UserUnlock01StrokeStandard} className=" tw-text-gray-500 tw-mr-2" size={18} />,
      actionName: "Activate Account",
      onClickHndlr: deactivateHandler
    },
    {
      id: "login-activities",
      actionIcon: <HugeiconsIcon icon={ShieldUserStrokeStandard} className=" tw-text-gray-500 align-bottom tw-mr-2" size={18} />,
      actionName: "Login Activities",
      onClickHndlr: loginActivityHandler
    },
    // {
    //   id: "delete",
    //   actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard}  className="tw-text-red-500 tw-mr-2" size={18} />,
    //   actionName: "Delete",
    //   onClickHndlr: deleteUserHndlr
    // }
  ], [getRoleTypeUsersResp]);

  useEffect(() => {
    getEmployeeApiCall();
  }, [])
  const EmployeeFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: employeeFilterState,
    onSubmit: (values) => { },
  });
  const filterHandler = () => {
    setApplyFilter(true);
  };
  const clearFilterHandler = () => {
    EmployeeFilterForm.values.search = "";
    EmployeeFilterForm.values.class = "";
    EmployeeFilterForm.values.section = "";
    EmployeeFilterForm.values.status = "";
    setApplyFilter(false);
  };

  const toggleCreateEmployeeHndlr = useCallback((apiCall?: boolean) => {
    setCreateEmployeeModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      // <embed src="" type="" />();
      getEmployeeApiCall();
    }
    closeModalHndlr();
  }, [instituteId, getRoleTypeUsersResp]);

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getEmployeeApiCall();
  }

  //Delete Modal Handlers
  function delModalCancelHndlr() {
    setDelUserModalState((prevState: any) => ({ ...prevState, showModal: false, userId: "" }));
  }
  function delModalSubmitHndlr() {
    const { userId } = delUserModalState,
      params = {
        userId,
        roleType: roleTypes.EMPLOYEE
      };
    dispatch(deleteRoleTypeUserAct(generateActionPayload("del_role_type_user", params)));
  }
  //Delete Modal Handlers

  //Change Password Modal Handlers
  const toggleChangePwdHandler = useCallback((apiCall?: boolean) => {
    setChangePwdModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getEmployeeApiCall();
    }
  }, [instituteId, getRoleTypeUsersResp]);


  //Deactivate User Modal Handlers
  const toggleDeactivateHandler = useCallback((apiCall?: boolean) => {
    setDeactivateModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
    if (typeof (apiCall) === "boolean" && apiCall) {
      getEmployeeApiCall();
    }
  }, [instituteId, getRoleTypeUsersResp]);

  function getEmployeeApiCall(otherProps?: any) {
    const { pageNo, pageSize } = paginationDetailRef.current || {};
    const sortingParams = getSortingKeys(sortingDetailRef.current);
    const payload = {
      ...employeeFilterState, ...otherProps, pageNo: pageNo,
      pageSize: pageSize, isPageable: true, ...sortingParams
    };
    dispatch(getRoleTypeUsersAct(generateActionPayload("get_role_type_users", { roleType: roleTypes.EMPLOYEE }, payload)));
  }
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setEmployeeFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getEmployeeApiCall({ [name]: value });
  }

  function sortingHandler(sortingKeys: any) {
    if (sortingDetailRef.current && sortingDetailRef.current !== sortingKeys) {
      sortingDetailRef.current = sortingKeys;
      getEmployeeApiCall();
      //Testing
    } else {
      sortingDetailRef.current = sortingKeys;
    }
  }

  const { data: EmployeeData, totalElements, pageNumber, totalPages } = getRoleTypeUsersResp || {};
  const roleColumns = useMemo(() => generateColumns(menuOptions), [getRoleTypeUsersResp]);
  return (
    <>
      <div className="tw-w-full">
        <form onSubmit={EmployeeFilterForm.handleSubmit} className="tw-px-4 tw-py-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  value={employeeFilterState.searchString}
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
          data={EmployeeData || []}
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber}
          manualSorting={true}
          sortingHandler={sortingHandler}
        />
      </div>
      <ModalContainerUpdated
        id="create-parent-modal"
        isOpen={createEmployeeModalState.showModal}
        toggle={toggleCreateEmployeeHndlr}
        modalTitle="Create Parent Account"
        modalSize="md"
      >
        <CreateEmployeeAccModal
          isOpen={createEmployeeModalState.showModal}
          toggle={toggleCreateEmployeeHndlr}
          modalTitle="Create Employee Account"
          instituteId={instituteId}
          branchId={branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="change-newPassword-employee-modal"
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
        id="deactivate-employee-modal"
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
        confirmMessage="Are you sure you want to delete this login id for employee?"
        cancelHndlr={delModalCancelHndlr}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
    </>
  );
};

export default Employees;
